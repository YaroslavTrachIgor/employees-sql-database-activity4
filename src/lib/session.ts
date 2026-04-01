import type { SessionOptions } from "iron-session";

/**
 * Shape stored in the encrypted iron-session cookie (server + middleware).
 */
export interface SessionData {
  loginUserId?: string;
  role?: "MANAGER" | "EMPLOYEE";
}

/**
 * iron-session encrypts the session cookie. SESSION_SECRET must be ≥ 32 characters.
 */
export const sessionOptions: SessionOptions = {
  password:
    process.env.SESSION_SECRET ??
    "dev-only-fallback-min-32-characters-long!!",
  cookieName: "activity4_session",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  },
};
