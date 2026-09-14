import { describe, it, expect } from 'vitest';
import { exportAssignmentsToCSV, exportAttendanceToCSV } from '../utils/exportReports';
import { Assignment, AttendanceRecord, Member } from '../types';

describe('exportReports utility', () => {
  it('should generate properly escaped CSV for assignments', () => {
    const assignments: Assignment[] = [
      {
        id: '1',
        title: 'Project 1, Part A',
        course: 'CS-101',
        dueDate: '2026-09-25',
        priority: 'high',
        status: 'pending',
        points: 50,
      },
    ];

    const csv = exportAssignmentsToCSV(assignments);
    expect(csv).toContain('ID,Title,Course,Due Date,Priority,Status,Points,Description');
    expect(csv).toContain('"1","Project 1, Part A","CS-101"');
  });

  it('should generate CSV for attendance records mapping student names', () => {
    const records: AttendanceRecord[] = [
      {
        id: 'rec-1',
        date: '2026-09-14',
        subject: 'Database Systems',
        studentId: 'stud-1',
        status: 'present',
      },
    ];

    const members: Member[] = [
      {
        id: 'stud-1',
        name: 'Alex Johnson',
        role: 'student',
        email: 'alex@example.com',
        rollNumber: 'CS-042',
      },
    ];

    const csv = exportAttendanceToCSV(records, members);
    expect(csv).toContain('Record ID,Date,Subject,Student Name,Roll Number,Status');
    expect(csv).toContain('"Alex Johnson","CS-042","present"');
  });
});
