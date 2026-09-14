import { describe, it, expect } from 'vitest';
import { exportAssignmentsToCSV, exportAttendanceToCSV } from '../utils/exportReports';
import { Assignment, AttendanceSession, User } from '../types';

describe('exportReports utility', () => {
  it('should generate properly escaped CSV for assignments', () => {
    const assignments: Assignment[] = [
      {
        id: '1',
        classId: 'class-1',
        title: 'Project 1, Part A',
        subject: 'CS-101',
        deadline: '2026-09-25T00:00:00Z',
        postedAt: '2026-09-14T00:00:00Z',
        createdBy: 'user-cr',
        status: 'active',
        description: 'First assignment project breakdown',
        notifyOnCreate: false,
        maxScore: 50,
      },
    ];

    const csv = exportAssignmentsToCSV(assignments);
    expect(csv).toContain('ID,Title,Subject,Deadline,Status,Max Score,Description');
    expect(csv).toContain('"1","Project 1, Part A","CS-101"');
  });

  it('should generate CSV for attendance sessions mapping student names', () => {
    const sessions: AttendanceSession[] = [
      {
        id: 'sess-1',
        classId: 'class-1',
        date: '2026-09-14',
        subject: 'Database Systems',
        conductedBy: 'user-cr',
        createdAt: '2026-09-14T10:00:00Z',
        records: [
          {
            studentId: 'stud-1',
            studentName: 'Alex Johnson',
            rollNo: 'CS-042',
            status: 'present',
          },
        ],
      },
    ];

    const users: User[] = [
      {
        id: 'stud-1',
        name: 'Alex Johnson',
        role: 'Student',
        email: 'alex@example.com',
        rollNo: 'CS-042',
        classId: 'class-1',
        joinedAt: '2026-09-01',
        lastActive: '2026-09-14',
      },
    ];

    const csv = exportAttendanceToCSV(sessions, users);
    expect(csv).toContain('Session ID,Date,Subject,Student Name,Roll Number,Status');
    expect(csv).toContain('"Alex Johnson","CS-042","present"');
  });
});
