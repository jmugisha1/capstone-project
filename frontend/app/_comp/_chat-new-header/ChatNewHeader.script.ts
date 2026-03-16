export function formatHeaderName(
  hasStarted: boolean,
  userName: string,
  conversationId: number | null,
): string {
  if (!hasStarted) return "Untitled Diagnosis";
  const names = userName ? userName.split(" ").slice(0, 2).join(" ") : "User";
  return `${names} — Diagnosis #${conversationId ?? "..."}`;
}

export function formatHeaderDate(startedAt: string | null): string {
  const date = startedAt ? new Date(startedAt) : new Date();
  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
