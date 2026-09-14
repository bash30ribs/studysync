import { Assignment, ScheduleEvent } from '../types';

/**
 * Format a Date or date string to iCalendar standard UTC timestamp (YYYYMMDDTHHmmssZ)
 */
export function formatToICSDate(dateInput: string | Date): string {
  const d = new Date(dateInput);
  if (isNaN(d.getTime())) {
    return new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  }
  return d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
}

/**
 * Generate standard RFC 5545 .ics formatted calendar string for assignments
 */
export function generateAssignmentsICS(assignments: Assignment[], className = 'StudySync Class'): string {
  const now = formatToICSDate(new Date());

  const events = assignments.map((a) => {
    const dueTime = formatToICSDate(a.dueDate);
    const summary = `[${a.course}] ${a.title}`;
    const description = `${a.description || 'Assignment due for ' + a.course}\\n\\nPriority: ${a.priority}\\nStatus: ${a.status}\\nPlatform: StudySync`;
    const uid = `studysync-assignment-${a.id}@studysync.app`;

    return [
      'BEGIN:VEVENT',
      `UID:${uid}`,
      `DTSTAMP:${now}`,
      `DTSTART:${dueTime}`,
      `DTEND:${dueTime}`,
      `SUMMARY:${summary}`,
      `DESCRIPTION:${description}`,
      `CATEGORIES:${a.course},ACADEMIC`,
      'STATUS:CONFIRMED',
      'BEGIN:VALARM',
      'TRIGGER:-PT24H',
      'ACTION:DISPLAY',
      `DESCRIPTION:Reminder: ${a.title} is due in 24 hours`,
      'END:VALARM',
      'END:VEVENT',
    ].join('\r\n');
  });

  const icsLines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//StudySync//Academic Class Manager//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    `X-WR-CALNAME:${className} - Assignments`,
    'X-WR-TIMEZONE:UTC',
    ...events,
    'END:VCALENDAR',
  ];

  return icsLines.join('\r\n');
}

/**
 * Generate standard RFC 5545 .ics formatted calendar string for class schedule
 */
export function generateScheduleICS(schedule: ScheduleEvent[], className = 'StudySync Class'): string {
  const now = formatToICSDate(new Date());

  const events = schedule.map((s) => {
    // Generate dates based on start and end time or current week dates
    const uid = `studysync-schedule-${s.id}@studysync.app`;
    const summary = `${s.subject}: ${s.title || s.subject}`;
    const description = `Instructor: ${s.instructor || 'TBD'}\\nLocation/Room: ${s.room || 'Online'}\\nType: ${s.type || 'Lecture'}`;

    return [
      'BEGIN:VEVENT',
      `UID:${uid}`,
      `DTSTAMP:${now}`,
      `DTSTART:${formatToICSDate(s.startTime)}`,
      `DTEND:${formatToICSDate(s.endTime)}`,
      `SUMMARY:${summary}`,
      `LOCATION:${s.room || 'Main Campus'}`,
      `DESCRIPTION:${description}`,
      'STATUS:CONFIRMED',
      'END:VEVENT',
    ].join('\r\n');
  });

  const icsLines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//StudySync//Academic Schedule//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    `X-WR-CALNAME:${className} - Class Schedule`,
    'X-WR-TIMEZONE:UTC',
    ...events,
    'END:VCALENDAR',
  ];

  return icsLines.join('\r\n');
}

/**
 * Triggers a browser download of an .ics calendar file
 */
export function downloadICSFile(content: string, filename = 'studysync-calendar.ics') {
  const blob = new Blob([content], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Generate a direct Google Calendar event creation URL
 */
export function createGoogleCalendarUrl(assignment: Assignment): string {
  const startTime = formatToICSDate(assignment.dueDate);
  const endTime = formatToICSDate(assignment.dueDate);
  const title = encodeURIComponent(`[${assignment.course}] ${assignment.title}`);
  const details = encodeURIComponent(
    `${assignment.description || 'Assignment due for ' + assignment.course}\n\nPriority: ${assignment.priority}\nTracked via StudySync`
  );
  
  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startTime}/${endTime}&details=${details}`;
}
