import { describe, it, expect } from 'vitest';
import { isCR, isStudent, isActiveAssignment, isOverdueAssignment, hasSubmitted } from '../types/guards';
import { User, Assignment, Submission } from '../types';

describe('TypeScript domain guards', () => {
  const crUser: User = {
    id: 'u-1',
    name: 'Class Rep',
    email: 'cr@college.edu',
    role: 'CR',
    classId: 'c-1',
    joinedAt: '2026-09-01T00:00:00Z',
    lastActive: 'now'
  };

  const studentUser: User = {
    ...crUser,
    id: 'u-2',
    name: 'Student One',
    role: 'Student'
  };

  const activeAsg: Assignment = {
    id: 'a-1',
    classId: 'c-1',
    title: 'Lab 1',
    subject: 'CS',
    description: 'Test',
    deadline: '2026-09-30T00:00:00Z',
    postedAt: '2026-09-01T00:00:00Z',
    createdBy: 'u-1',
    status: 'active',
    notifyOnCreate: false
  };

  it('validates user roles correctly', () => {
    expect(isCR(crUser)).toBe(true);
    expect(isCR(studentUser)).toBe(false);
    expect(isCR(null)).toBe(false);

    expect(isStudent(studentUser)).toBe(true);
    expect(isStudent(crUser)).toBe(false);
  });

  it('validates active assignments', () => {
    expect(isActiveAssignment(activeAsg)).toBe(true);
    expect(isActiveAssignment({ ...activeAsg, status: 'closed' })).toBe(false);
    expect(isActiveAssignment(null)).toBe(false);
  });

  it('evaluates overdue assignments based on timestamp', () => {
    const pastAsg = { ...activeAsg, deadline: '2026-09-01T00:00:00Z' };
    const now = new Date('2026-09-20T00:00:00Z').getTime();
    expect(isOverdueAssignment(pastAsg, now)).toBe(true);
    expect(isOverdueAssignment(activeAsg, now)).toBe(false);
  });

  it('evaluates submission status', () => {
    const sub: Submission = {
      id: 's-1',
      assignmentId: 'a-1',
      studentId: 'u-2',
      studentName: 'Student',
      studentEmail: 'student@college.edu',
      status: 'submitted'
    };
    expect(hasSubmitted(sub)).toBe(true);
    expect(hasSubmitted({ ...sub, status: 'assigned' })).toBe(false);
    expect(hasSubmitted(null)).toBe(false);
  });
});
