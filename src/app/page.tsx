/**
 * `/` is handled in middleware (redirect to `/login` or `/dashboard`).
 * This component is only a fallback if middleware is bypassed.
 */
export default function Home() {
  return null;
}
