/**
 * Academic Date & Semester Calendar Utilities
 */

export function getAcademicWeek(semesterStartDate: string | Date, targetDate: string | Date = new Date()): number {
  const start = new Date(semesterStartDate).getTime();
  const current = new Date(targetDate).getTime();
  const diffDays = Math.floor((current - start) / (1000 * 60 * 60 * 24));
  if (diffDays < 0) return 0;
  return Math.floor(diffDays / 7) + 1;
}

export function formatTimeRemaining(deadlineIso: string, fromDate: string | Date = new Date()): string {
  const target = new Date(deadlineIso).getTime();
  const now = new Date(fromDate).getTime();
  const diffMs = target - now;

  if (diffMs <= 0) return 'Deadline passed';

  const totalMinutes = Math.floor(diffMs / (1000 * 60));
  const hours = Math.floor(totalMinutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 1) return `${days} days remaining`;
  if (days === 1) return '1 day remaining';
  if (hours > 0) return `${hours}h ${totalMinutes % 60}m remaining`;
  return `${totalMinutes}m remaining`;
}

export function isSameDay(date1: string | Date, date2: string | Date): boolean {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
}
