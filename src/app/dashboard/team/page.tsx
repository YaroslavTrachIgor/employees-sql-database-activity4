import { redirect } from "next/navigation";
import { getSession } from "@/lib/get-session";
import { TeamUserTable } from "@/components/team-user-table";
import { Suspense } from "react";

export const metadata = {
  title: "Team & accounts | Activity 4",
};

/**
 * Manager-only area: lists SQL-backed users so managers can verify accounts without a DB GUI.
 */
export default async function TeamPage() {
  const session = await getSession();
  if (!session.loginUserId) {
    redirect("/login");
  }
  if (session.role !== "MANAGER") {
    redirect("/dashboard");
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
          Team &amp; accounts
        </h1>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400">
          Everyone in the local SQLite database is listed below. Use{" "}
          <strong>Dashboard → Create account</strong> to add users; duplicate user IDs are
          rejected by the database (unique constraint).
        </p>
      </div>

      <section className="flex flex-col gap-3">
        <h2 className="text-lg font-medium text-zinc-900 dark:text-zinc-100">All users</h2>
        <Suspense
          fallback={
            <p className="text-sm text-zinc-500 dark:text-zinc-400">Loading team list…</p>
          }
        >
          <TeamUserTable />
        </Suspense>
      </section>

      <section className="rounded-xl border border-dashed border-zinc-300 bg-zinc-50/80 p-6 text-sm text-zinc-600 dark:border-zinc-600 dark:bg-zinc-900/30 dark:text-zinc-400">
        <strong className="text-zinc-800 dark:text-zinc-200">Later activities:</strong> reports,
        schedules, and other manager tools can plug in here.
      </section>
    </div>
  );
}
