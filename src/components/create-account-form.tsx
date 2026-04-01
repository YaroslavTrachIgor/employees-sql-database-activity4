"use client";

import { useState } from "react";
import { createUserAction } from "@/app/actions/auth";

/**
 * Manager-only form to register a new user in the SQL database (server enforces role).
 */
export function CreateAccountForm() {
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // Capture before `await` — after an async gap React clears `e.currentTarget`.
    const form = e.currentTarget;
    setError(null);
    setOk(false);
    const fd = new FormData(form);
    const result = await createUserAction(fd);
    if ("error" in result) {
      setError(result.error);
      return;
    }
    setOk(true);
    form.reset();
  }

  return (
    <form onSubmit={onSubmit} className="flex max-w-md flex-col gap-4 rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-700 dark:bg-zinc-900/50">
      <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">Create account</h2>
      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        New users are stored in the local SQLite database (hashed passwords).
      </p>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="newUserId" className="text-sm font-medium text-zinc-700 dark:text-zinc-200">
          New user ID
        </label>
        <input
          id="newUserId"
          name="newUserId"
          type="text"
          required
          minLength={2}
          pattern="[a-zA-Z0-9_]+"
          title="Letters, numbers, and underscore only"
          className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-zinc-900 outline-none focus:ring-2 focus:ring-zinc-400 dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-100"
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="newPassword" className="text-sm font-medium text-zinc-700 dark:text-zinc-200">
          Password
        </label>
        <input
          id="newPassword"
          name="newPassword"
          type="password"
          required
          minLength={6}
          autoComplete="new-password"
          className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-zinc-900 outline-none focus:ring-2 focus:ring-zinc-400 dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-100"
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="role" className="text-sm font-medium text-zinc-700 dark:text-zinc-200">
          Role
        </label>
        <select
          id="role"
          name="role"
          defaultValue="EMPLOYEE"
          className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-zinc-900 outline-none focus:ring-2 focus:ring-zinc-400 dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-100"
        >
          <option value="EMPLOYEE">Employee</option>
          <option value="MANAGER">Manager</option>
        </select>
      </div>
      {error ? (
        <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-800 dark:bg-red-950/50 dark:text-red-200">
          {error}
        </p>
      ) : null}
      {ok ? (
        <p className="rounded-md bg-emerald-50 px-3 py-2 text-sm text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-200">
          Account created successfully.
        </p>
      ) : null}
      <button
        type="submit"
        className="rounded-lg bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-600 dark:bg-emerald-600 dark:hover:bg-emerald-500"
      >
        Create account
      </button>
    </form>
  );
}
