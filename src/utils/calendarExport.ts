import { Assignment } from '../types';

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
    const dueTime = formatToICSDate(a.deadline);
    const summary = `[${a.subject}] ${a.title}`;
    const description = `${a.description || 'Assignment due for ' + a.subject}\\n\\nDifficulty: ${a.difficultyEstimate || 'Medium'}\\nStatus: ${a.status}\\nPlatform: StudySync`;
    const uid = `studysync-assignment-${a.id}@studysync.app`;

    return [
      'BEGIN:VEVENT',
      `UID:${uid}`,
      `DTSTAMP:${now}`,
      `DTSTART:${dueTime}`,
      `DTEND:${dueTime}`,
      `SUMMARY:${summary}`,
      `DESCRIPTION:${description}`,
      `CATEGORIES:${a.subject},ACADEMIC`,
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
  const startTime = formatToICSDate(assignment.deadline);
  const endTime = formatToICSDate(assignment.deadline);
  const title = encodeURIComponent(`[${assignment.subject}] ${assignment.title}`);
  const details = encodeURIComponent(
    `${assignment.description || 'Assignment due for ' + assignment.subject}\n\nDifficulty: ${assignment.difficultyEstimate || 'Medium'}\nTracked via StudySync`
  );
  
  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startTime}/${endTime}&details=${details}`;
}
