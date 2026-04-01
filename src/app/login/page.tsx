import { LoginForm } from "@/components/login-form";

export const metadata = {
  title: "Sign in | Activity 4",
};

/**
 * Entry login screen (middleware sends unauthenticated users here for protected routes).
 */
export default function LoginPage() {
  return (
    <div className="flex min-h-full flex-1 flex-col items-center justify-center bg-zinc-50 px-4 py-16 dark:bg-zinc-950">
      <div className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-8 shadow-lg dark:border-zinc-800 dark:bg-zinc-900">
        <header className="mb-8 text-center">
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            Activity 4
          </h1>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            Sign in with your user ID and password
          </p>
        </header>
        <LoginForm />
        <p className="mt-8 text-center text-xs text-zinc-500 dark:text-zinc-500">
          Demo: manager1 / manager123 · employee1 / employee123 (after seed)
        </p>
      </div>
    </div>
  );
}
