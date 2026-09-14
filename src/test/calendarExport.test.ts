import { describe, it, expect } from 'vitest';
import { formatToICSDate, generateAssignmentsICS, createGoogleCalendarUrl } from '../utils/calendarExport';
import { Assignment } from '../types';

describe('calendarExport utility', () => {
  const mockAssignment: Assignment = {
    id: 'asg-1',
    title: 'Operating Systems Semaphore Lab',
    course: 'CS-301',
    dueDate: '2026-09-20T23:59:00Z',
    description: 'Implement mutex locks and semaphore primitives',
    priority: 'high',
    status: 'pending',
    points: 100,
    tags: ['C++', 'Concurrency'],
  };

  it('should correctly format date strings to RFC 5545 UTC timestamps', () => {
    const formatted = formatToICSDate('2026-09-20T23:59:00Z');
    expect(formatted).toMatch(/^20260920T235900Z$/);
  });

  it('should generate valid iCalendar VCALENDAR with VEVENT and VALARM', () => {
    const ics = generateAssignmentsICS([mockAssignment], 'Computer Science Class');
    expect(ics).toContain('BEGIN:VCALENDAR');
    expect(ics).toContain('VERSION:2.0');
    expect(ics).toContain('BEGIN:VEVENT');
    expect(ics).toContain('SUMMARY:[CS-301] Operating Systems Semaphore Lab');
    expect(ics).toContain('BEGIN:VALARM');
    expect(ics).toContain('END:VCALENDAR');
  });

  it('should construct valid Google Calendar render template URLs', () => {
    const url = createGoogleCalendarUrl(mockAssignment);
    expect(url).toContain('https://calendar.google.com/calendar/render?action=TEMPLATE');
    expect(url).toContain('Operating%20Systems%20Semaphore%20Lab');
  });
});
