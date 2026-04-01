"use client";

import { useMemo, useSyncExternalStore, useState } from "react";
import { useRouter } from "next/navigation";
import { loginAction } from "@/app/actions/auth";

const STORAGE_KEY = "activity4_remembered_user_ids";
const CHANGE_EVENT = "activity4_userids_changed";

function loadRememberedIds(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed)
      ? parsed.filter((x): x is string => typeof x === "string")
      : [];
  } catch {
    return [];
  }
}

/** Stable empty snapshot for SSR (must be the same reference every time). */
const SERVER_SNAPSHOT: string[] = [];

let cachedSerialized = "";
let cachedRemembered: string[] = SERVER_SNAPSHOT;

/**
 * Returns the same array reference when localStorage contents are unchanged.
 * Required by useSyncExternalStore — a new [] each render triggers an infinite loop.
 */
function getCachedClientSnapshot(): string[] {
  const next = loadRememberedIds();
  const serialized = JSON.stringify(next);
  if (serialized !== cachedSerialized) {
    cachedSerialized = serialized;
    cachedRemembered = next;
  }
  return cachedRemembered;
}

function subscribe(onChange: () => void) {
  const onStorage = () => onChange();
  window.addEventListener("storage", onStorage);
  window.addEventListener(CHANGE_EVENT, onStorage);
  return () => {
    window.removeEventListener("storage", onStorage);
    window.removeEventListener(CHANGE_EVENT, onStorage);
  };
}

/** Persists successful login user IDs for autocomplete (most recent first, max 10). */
function rememberUserId(userId: string) {
  const ids = loadRememberedIds().filter((x) => x !== userId);
  ids.unshift(userId);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(ids.slice(0, 10)));
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

/**
 * Login screen: validates against the database via server action; datalist suggests prior user IDs.
 */
export function LoginForm() {
  const router = useRouter();
  const [input, setInput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const remembered = useSyncExternalStore(
    subscribe,
    getCachedClientSnapshot,
    () => SERVER_SNAPSHOT
  );

  const suggestions = useMemo(() => {
    const q = input.trim().toLowerCase();
    if (!q) return remembered.slice(0, 8);
    return remembered.filter((id) => id.toLowerCase().includes(q)).slice(0, 8);
  }, [input, remembered]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setPending(true);
    const fd = new FormData(e.currentTarget);
    const result = await loginAction(fd);
    setPending(false);
    if ("error" in result) {
      setError(result.error);
      return;
    }
    rememberUserId(result.userId);
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-sm flex-col gap-5">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="userId" className="text-sm font-medium text-zinc-700 dark:text-zinc-200">
          User ID
        </label>
        <input
          id="userId"
          name="userId"
          type="text"
          autoComplete="username"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          list="userId-suggestions"
          required
          className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-zinc-900 shadow-sm outline-none ring-zinc-400 focus:ring-2 dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-100"
        />
        <datalist id="userId-suggestions">
          {suggestions.map((id) => (
            <option key={id} value={id} />
          ))}
        </datalist>
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="password" className="text-sm font-medium text-zinc-700 dark:text-zinc-200">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-zinc-900 shadow-sm outline-none ring-zinc-400 focus:ring-2 dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-100"
        />
      </div>
      {error ? (
        <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-800 dark:bg-red-950/50 dark:text-red-200">
          {error}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={pending}
        className="rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-zinc-800 disabled:opacity-60 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white"
      >
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
