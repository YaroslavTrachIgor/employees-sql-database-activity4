"use server";

import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { sessionOptions, type SessionData } from "@/lib/session";

type LoginResult = { error: string } | { success: true; userId: string };

type ActionResult = { error: string } | { success: true };

/**
 * Validates credentials against the database and establishes an encrypted session cookie.
 * Returns success so the client can remember the user ID for autocomplete, then navigate.
 */
export async function loginAction(formData: FormData): Promise<LoginResult> {
  const userId = String(formData.get("userId") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!userId || !password) {
    return { error: "Enter both user ID and password." };
  }

  const user = await prisma.user.findUnique({ where: { userId } });
  if (!user) {
    return { error: "Invalid user ID or password." };
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    return { error: "Invalid user ID or password." };
  }

  const session = await getIronSession<SessionData>(await cookies(), sessionOptions);
  session.loginUserId = user.userId;
  session.role = user.role;
  await session.save();

  return { success: true, userId: user.userId };
}

/**
 * Clears the session cookie (used by Log out and idle timeout).
 */
export async function logoutAction(): Promise<void> {
  const session = await getIronSession<SessionData>(await cookies(), sessionOptions);
  session.destroy();
  redirect("/login");
}

/**
 * Creates a new user. Server-side role check ensures only managers can call this successfully.
 */
export async function createUserAction(formData: FormData): Promise<ActionResult> {
  const session = await getIronSession<SessionData>(await cookies(), sessionOptions);
  if (!session.loginUserId || session.role !== "MANAGER") {
    return { error: "Only managers can create accounts." };
  }

  const newUserId = String(formData.get("newUserId") ?? "").trim();
  const newPassword = String(formData.get("newPassword") ?? "");
  const roleRaw = String(formData.get("role") ?? "EMPLOYEE");

  if (newUserId.length < 2 || !/^[a-zA-Z0-9_]+$/.test(newUserId)) {
    return {
      error:
        "User ID must be at least 2 characters and use only letters, numbers, or underscore.",
    };
  }

  if (newPassword.length < 6) {
    return { error: "Password must be at least 6 characters." };
  }

  const role = roleRaw === "MANAGER" ? "MANAGER" : "EMPLOYEE";

  const existing = await prisma.user.findUnique({ where: { userId: newUserId } });
  if (existing) {
    return { error: "That user ID is already in use." };
  }

  const passwordHash = await bcrypt.hash(newPassword, 10);
  await prisma.user.create({
    data: { userId: newUserId, passwordHash, role },
  });

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/team");
  return { success: true };
}
