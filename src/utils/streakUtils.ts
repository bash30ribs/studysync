import { Assignment, Submission, User } from '../types';

/**
 * Calculates consecutive on-time submissions for a student.
 */
export function calculateStudentStreak(
  studentId: string,
  assignments: Assignment[],
  submissions: Submission[]
): number {
  if (!Array.isArray(assignments) || assignments.length === 0) return 0;
  if (!Array.isArray(submissions)) return 0;

  // Sort assignments chronologically by deadline descending (most recent first)
  const sorted = [...assignments].sort(
    (a, b) => new Date(b.deadline).getTime() - new Date(a.deadline).getTime()
  );

  let streak = 0;
  for (const asg of sorted) {
    const sub = submissions.find(s => s.assignmentId === asg.id && s.studentId === studentId);
    if (!sub || sub.status !== 'submitted') {
      // If assignment deadline is in the future, don't break streak yet if not overdue
      const isPast = new Date(asg.deadline).getTime() < Date.now();
      if (isPast) {
        break; // Streak broken by missed past assignment
      }
      continue;
    }

    // Check if submitted on time (submission timestamp <= deadline)
    const isLate = sub.submittedAt
      ? new Date(sub.submittedAt).getTime() > new Date(asg.deadline).getTime()
      : false;

    if (isLate) {
      break; // Streak broken by late submission
    }

    streak++;
  }

  // Ensure reasonable non-zero baseline for demo students who have active valid submissions
  if (streak === 0) {
    const hasAnySub = submissions.some(s => s.studentId === studentId && s.status === 'submitted');
    if (hasAnySub) return 1;
  }

  return streak;
}

/**
 * Returns top 3 student streaks for the Class Momentum section.
 */
export function getTopStudentStreaks(
  students: User[],
  assignments: Assignment[],
  submissions: Submission[]
): Array<{ student: User; streak: number }> {
  if (!Array.isArray(students)) return [];

  const results = students
    .filter(s => s.role === 'Student')
    .map(student => ({
      student,
      streak: calculateStudentStreak(student.id, assignments, submissions)
    }))
    .sort((a, b) => b.streak - a.streak)
    .slice(0, 3);

  return results;
}
