import { describe, it, expect } from 'vitest';
import { getRelativeDeadline } from '../utils/deadlineUtils';

describe('getRelativeDeadline', () => {
  const baseNow = new Date('2026-09-24T12:00:00Z').getTime();

  it('correctly marks past deadlines as Overdue', () => {
    const past = new Date('2026-09-24T10:00:00Z').toISOString();
    const result = getRelativeDeadline(past, baseNow);
    expect(result.isOverdue).toBe(true);
    expect(result.label).toBe('Overdue');
    expect(result.isUrgent).toBe(false);
  });

  it('marks deadlines within 24 hours as Urgent', () => {
    const soon = new Date('2026-09-24T18:00:00Z').toISOString(); // 6 hours away
    const result = getRelativeDeadline(soon, baseNow);
    expect(result.isOverdue).toBe(false);
    expect(result.isUrgent).toBe(true);
    expect(result.label).toBe('Due in 6h');
  });

  it('handles minimum 1 hour for imminent deadlines', () => {
    const imminent = new Date('2026-09-24T12:20:00Z').toISOString(); // 20 mins away
    const result = getRelativeDeadline(imminent, baseNow);
    expect(result.isOverdue).toBe(false);
    expect(result.isUrgent).toBe(true);
    expect(result.label).toBe('Due in 1h');
  });

  it('formats multi-day deadlines cleanly without urgent flag', () => {
    const future = new Date('2026-09-27T12:00:00Z').toISOString(); // 3 days away
    const result = getRelativeDeadline(future, baseNow);
    expect(result.isOverdue).toBe(false);
    expect(result.isUrgent).toBe(false);
    expect(result.label).toBe('Due in 3d');
  });
});
