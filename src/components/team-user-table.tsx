import { prisma } from "@/lib/prisma";

/**
 * Loads all users for the manager team view (no password fields — hashes stay server-only).
 */
export async function TeamUserTable() {
  const users = await prisma.user.findMany({
    select: {
      userId: true,
      role: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
  });

  if (users.length === 0) {
    return (
      <p className="rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-6 text-center text-sm text-zinc-600 dark:border-zinc-700 dark:bg-zinc-900/40 dark:text-zinc-400">
        No users in the database yet. Add accounts from the Dashboard.
      </p>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-700 dark:bg-zinc-900/50">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-zinc-200 bg-zinc-50 text-zinc-700 dark:border-zinc-600 dark:bg-zinc-800/80 dark:text-zinc-200">
          <tr>
            <th className="px-4 py-3 font-semibold">User ID</th>
            <th className="px-4 py-3 font-semibold">Role</th>
            <th className="px-4 py-3 font-semibold">Created</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-100 dark:divide-zinc-700">
          {users.map((u) => (
            <tr key={u.userId} className="text-zinc-800 dark:text-zinc-200">
              <td className="px-4 py-3 font-mono text-xs">{u.userId}</td>
              <td className="px-4 py-3">{u.role === "MANAGER" ? "Manager" : "Employee"}</td>
              <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">
                {u.createdAt.toLocaleString(undefined, {
                  dateStyle: "medium",
                  timeStyle: "short",
                })}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="border-t border-zinc-200 px-4 py-2 text-xs text-zinc-500 dark:border-zinc-700 dark:text-zinc-500">
        {users.length} user{users.length === 1 ? "" : "s"} — data from SQLite via Prisma (passwords are
        hashed and not shown).
      </p>
    </div>
  );
}
