import { describe, it, expect, beforeEach } from 'vitest';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { 
  generateStudentUid, 
  generateTeacherUid, 
  generateStudentRollNo, 
  generateSecureTempPassword,
  getDeptCode,
  getNamePrefix
} from '../utils/edutrackUid';
import { StudySyncProvider, useStudySync } from '../store';
import { MembersView } from '../components/members/MembersView';
import { User } from '../types';

describe('EduTrack Directory & UID Generation Integration', () => {
  it('generates correct department codes and name prefixes', () => {
    expect(getDeptCode('Computer Science')).toBe('CSE');
    expect(getDeptCode('AIML')).toBe('AIML');
    expect(getDeptCode('ECE')).toBe('ECE');
    expect(getDeptCode('Mechanical')).toBe('ME');
    expect(getDeptCode('Information Technology')).toBe('IT');
    expect(getNamePrefix('Wilson Gaikwad')).toBe('WIL');
    expect(getNamePrefix('Dr. Andrew Tate')).toBe('DRX');
  });

  it('generates valid EduTrack student UID (STU-<DEPT><YY><NAME3><SEQ>)', () => {
    const mockUsers: User[] = [];
    const uid1 = generateStudentUid('Wilson Gaikwad', 'AIML', mockUsers);
    expect(uid1).toMatch(/^STU-AIML\d{2}WIL001$/);

    const existing: User[] = [{
      id: 'u1',
      name: 'Wilson Gaikwad',
      email: 'w@test.com',
      role: 'Student',
      classId: 'c1',
      joinedAt: '2026-01-01',
      lastActive: 'now',
      uid: uid1
    }];

    const uid2 = generateStudentUid('Wilson Two', 'AIML', existing);
    expect(uid2).toMatch(/^STU-AIML\d{2}WIL002$/);
  });

  it('generates valid EduTrack faculty UID (EMP-<DEPT><YY><NAME3><SEQ>)', () => {
    const mockUsers: User[] = [];
    const uid1 = generateTeacherUid('Andrew Tate', 'AIML', mockUsers);
    expect(uid1).toMatch(/^EMP-AI\d{2}AND001$/);
  });

  it('generates valid EduTrack student roll numbers (<DEPT><YY><SEQ>)', () => {
    const mockUsers: User[] = [];
    const roll1 = generateStudentRollNo('CSE', mockUsers);
    expect(roll1).toMatch(/^CSE\d{2}001$/);

    const existing: User[] = [{
      id: 'u1',
      name: 'John Doe',
      email: 'j@test.com',
      role: 'Student',
      classId: 'c1',
      joinedAt: '2026-01-01',
      lastActive: 'now',
      rollNo: roll1
    }];

    const roll2 = generateStudentRollNo('CSE', existing);
    expect(roll2).toMatch(/^CSE\d{2}002$/);
  });

  it('generates secure temporary passwords', () => {
    const pwd = generateSecureTempPassword();
    expect(pwd.length).toBeGreaterThanOrEqual(8);
    expect(/[!@#$%^&*]/.test(pwd)).toBe(true);
    expect(/\d{4}/.test(pwd)).toBe(true);
  });

  it('adds a student and a faculty via store context and assigns EduTrack credentials', () => {
    let capturedContext: ReturnType<typeof useStudySync> | null = null;

    const TestConsumer = () => {
      capturedContext = useStudySync();
      return <div>Test</div>;
    };

    renderToString(
      <StudySyncProvider>
        <TestConsumer />
      </StudySyncProvider>
    );

    expect(capturedContext).not.toBeNull();
    if (!capturedContext) return;

    const initialUserCount = (capturedContext as ReturnType<typeof useStudySync>).allUsers.length;

    // Add Student
    const newStudent = (capturedContext as ReturnType<typeof useStudySync>).addStudent({
      name: 'Wilson Gaikwad',
      department: 'AIML',
      rollNo: 'CS21554',
      phone: '+91 99999 11111',
      guardianPhone: '+91 83737 11116'
    });

    expect(newStudent.name).toBe('Wilson Gaikwad');
    expect(newStudent.role).toBe('Student');
    expect(newStudent.uid).toContain('STU-AIML');
    expect(newStudent.rollNo).toBe('CS21554');
    expect(newStudent.tempPassword).toBeDefined();

    // Add Faculty
    const newFaculty = (capturedContext as ReturnType<typeof useStudySync>).addFaculty({
      name: 'Dr. Andrew Tate',
      department: 'AIML',
      designation: 'Associate Professor',
      officeRoom: 'Cabin 304'
    });

    expect(newFaculty.name).toBe('Dr. Andrew Tate');
    expect(newFaculty.role).toBe('Faculty');
    expect(newFaculty.uid).toContain('EMP-AI');
    expect(newFaculty.designation).toBe('Associate Professor');
    expect(newFaculty.officeRoom).toBe('Cabin 304');
    expect(newFaculty.tempPassword).toBeDefined();
  });

  it('renders MembersView with EduTrack controls, tabs, and action buttons', () => {
    const html = renderToString(
      <StudySyncProvider>
        <MembersView />
      </StudySyncProvider>
    );

    expect(html).toContain('Class Roster &amp; Members');
    expect(html).toContain('EduTrack Integration');
    expect(html).toContain('id="btn-add-student"');
    expect(html).toContain('id="btn-add-faculty"');
    expect(html).toContain('Students');
    expect(html).toContain('Faculty &amp; Teachers');
    expect(html).toContain('All Directory');
    expect(html).toContain('Filter At-Risk Students (EWS)');
    expect(html).toContain('All Departments');
  });
});
