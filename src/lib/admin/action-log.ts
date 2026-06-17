import "server-only";

export function logAdminActionStarted(action: string): void {
  console.info("[admin-action]", { event: "action_started", action });
}

export function logAdminActionFailed(action: string, error?: string): void {
  console.info("[admin-action]", {
    event: "action_failed_without_clearing_session",
    action,
    ...(error ? { error } : {}),
  });
}

export function logAdminActionSucceeded(action: string): void {
  console.info("[admin-action]", { event: "action_succeeded", action });
}
