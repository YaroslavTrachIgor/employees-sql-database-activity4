import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/get-session";
import { IdleLogout } from "@/components/idle-logout";
import { LogoutButton } from "@/components/logout-button";

/**
 * Authenticated shell: idle timeout, role-aware nav, and consistent layout.
 */
export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session.loginUserId) {
    redirect("/login");
  }

  const isManager = session.role === "MANAGER";

  return (
    <>
      <IdleLogout />
      <div className="flex min-h-full flex-1 flex-col bg-zinc-50 dark:bg-zinc-950">
        <header className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
          <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 px-4 py-4">
            <div className="flex flex-wrap items-center gap-6">
              <Link
                href="/dashboard"
                className="text-lg font-semibold text-zinc-900 dark:text-zinc-50"
              >
                Dashboard
              </Link>
              <nav className="flex gap-4 text-sm">
                <Link
                  href="/dashboard"
                  className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                >
                  Home
                </Link>
                {isManager ? (
                  <Link
                    href="/dashboard/team"
                    className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                  >
                    Team &amp; accounts
                  </Link>
                ) : (
                  <span className="text-zinc-400 dark:text-zinc-600">Team (managers only)</span>
                )}
              </nav>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-zinc-600 dark:text-zinc-400">
                <span className="font-medium text-zinc-900 dark:text-zinc-100">
                  {session.loginUserId}
                </span>
                <span className="mx-2 text-zinc-300 dark:text-zinc-600">·</span>
                {isManager ? "Manager" : "Employee"}
              </span>
              <LogoutButton />
            </div>
          </div>
        </header>
        <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-4 py-8">{children}</main>
      </div>
    </>
  );
}
