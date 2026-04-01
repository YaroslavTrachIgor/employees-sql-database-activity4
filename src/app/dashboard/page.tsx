import { redirect } from "next/navigation";
import { getSession } from "@/lib/get-session";
import { CreateAccountForm } from "@/components/create-account-form";

/**
 * Role-based home: managers see account-creation; employees see an employee-focused panel.
 */
export default async function DashboardPage() {
  const session = await getSession();
  if (!session.loginUserId) {
    redirect("/login");
  }

  const isManager = session.role === "MANAGER";

  return (
    <div className="flex flex-col gap-10">
      <section>
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
          Welcome, {session.loginUserId}
        </h1>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400">
          You are signed in as{" "}
          <strong>{isManager ? "a manager" : "an employee"}</strong>. Use the navigation
          above to move between screens.
        </p>
      </section>

      {isManager ? (
        <section className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-700 dark:bg-zinc-900/50">
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
              Manager overview
            </h2>
            <ul className="mt-4 list-inside list-disc space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
              <li>Create and manage user accounts (SQL-backed)</li>
              <li>Access team tools from the Team &amp; accounts page</li>
              <li>Session expires after a period of inactivity</li>
            </ul>
          </div>
          <CreateAccountForm />
        </section>
      ) : (
        <section className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-700 dark:bg-zinc-900/50">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            Employee workspace
          </h2>
          <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400">
            Your interface is limited to employee features. Managers can create new accounts and
            open the team section; those options are hidden for your role.
          </p>
        </section>
      )}
    </div>
  );
}
