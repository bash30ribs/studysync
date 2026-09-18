import { describe, it, expect } from 'vitest';
import { getAcademicWeek, formatTimeRemaining, isSameDay } from '../utils/dateUtils';

describe('dateUtils utility', () => {
  it('should calculate the correct academic week', () => {
    const semesterStart = '2026-08-01T00:00:00Z';
    const weekOne = '2026-08-04T00:00:00Z';
    const weekThree = '2026-08-18T00:00:00Z';

    expect(getAcademicWeek(semesterStart, weekOne)).toBe(1);
    expect(getAcademicWeek(semesterStart, weekThree)).toBe(3);
  });

  it('should format time remaining countdown strings', () => {
    const fromTime = new Date('2026-09-18T10:00:00Z');
    const deadline1 = new Date('2026-09-22T10:00:00Z').toISOString();
    const deadline2 = new Date('2026-09-18T15:30:00Z').toISOString();
    const passedDeadline = new Date('2026-09-17T10:00:00Z').toISOString();

    expect(formatTimeRemaining(deadline1, fromTime)).toBe('4 days remaining');
    expect(formatTimeRemaining(deadline2, fromTime)).toBe('5h 30m remaining');
    expect(formatTimeRemaining(passedDeadline, fromTime)).toBe('Deadline passed');
  });

  it('should accurately compare same days', () => {
    expect(isSameDay('2026-09-18T10:00:00Z', '2026-09-18T22:30:00Z')).toBe(true);
    expect(isSameDay('2026-09-18T10:00:00Z', '2026-09-19T10:00:00Z')).toBe(false);
  });
});
