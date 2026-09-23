import { User, Assignment, Submission } from './index';

/**
 * Type guard checking if user has CR role
 */
export function isCR(user?: User | null): boolean {
  return !!user && user.role === 'CR';
}

/**
 * Type guard checking if user has Student role
 */
export function isStudent(user?: User | null): boolean {
  return !!user && user.role === 'Student';
}

/**
 * Checks if assignment is currently in active status
 */
export function isActiveAssignment(assignment?: Assignment | null): boolean {
  return !!assignment && assignment.status === 'active';
}

/**
 * Checks if assignment deadline has passed
 */
export function isOverdueAssignment(assignment: Assignment, nowMs: number = Date.now()): boolean {
  return new Date(assignment.deadline).getTime() < nowMs;
}

/**
 * Checks if submission has status 'submitted'
 */
export function hasSubmitted(submission?: Submission | null): boolean {
  return !!submission && submission.status === 'submitted';
}
