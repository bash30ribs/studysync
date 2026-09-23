export interface RelativeDeadline {
  label: string;
  isOverdue: boolean;
  isUrgent: boolean;
}

/**
 * Calculates human-readable relative deadline info with urgency flags
 * @param deadlineIso ISO 8601 string of the deadline
 * @param nowMs Current timestamp for deterministic testing
 */
export function getRelativeDeadline(deadlineIso: string, nowMs: number = Date.now()): RelativeDeadline {
  const diff = new Date(deadlineIso).getTime() - nowMs;
  if (diff < 0) {
    return { label: 'Overdue', isOverdue: true, isUrgent: false };
  }
  const hours = Math.floor(diff / (1000 * 60 * 60));
  if (hours < 24) {
    return { label: `Due in ${Math.max(1, hours)}h`, isOverdue: false, isUrgent: true };
  }
  const days = Math.floor(hours / 24);
  return { label: `Due in ${days}d`, isOverdue: false, isUrgent: false };
}
