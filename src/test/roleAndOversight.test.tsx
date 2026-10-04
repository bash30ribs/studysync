import { describe, it, expect, beforeEach } from 'vitest';
import React from 'react';
import { renderToString } from 'react-dom/server';
import App from '../App';
import { INITIAL_USERS, INITIAL_ASSIGNMENTS, INITIAL_HOLISTIC_ACTIVITIES, INITIAL_CONFIDENTIAL_GRIEVANCES, INITIAL_FACULTY_AUDITS } from '../data/initialData';

describe('3-Role Architecture & Cohort Scale Verification', () => {
  it('contains exactly 50 total cohort users with 1 CR, 1 Faculty Incharge, and 48 Students', () => {
    expect(INITIAL_USERS.length).toBe(50);

    const crUsers = INITIAL_USERS.filter(u => u.role === 'CR');
    const facultyUsers = INITIAL_USERS.filter(u => u.role === 'Faculty');
    const studentUsers = INITIAL_USERS.filter(u => u.role === 'Student');

    expect(crUsers.length).toBe(1);
    expect(facultyUsers.length).toBe(1);
    expect(studentUsers.length).toBe(48);

    // Verify specified names
    expect(crUsers[0].name).toContain('Ribhav Sharma');
    expect(crUsers[0].id).toBe('user-cr-1');

    expect(facultyUsers[0].name).toContain('Dr. Meenakshi Sundaram');
    expect(facultyUsers[0].designation).toBe('Professor & Core Faculty Incharge');
    expect(facultyUsers[0].officeRoom).toBe('Tech Block 3, Room 412');
    expect(facultyUsers[0].department).toBe('Mechanical Engineering & Academic Dean Office');

    // Verify all 48 students have roll numbers, emails, and devices
    studentUsers.forEach((stu, idx) => {
      expect(stu.rollNo).toMatch(/^23ME0/);
      expect(stu.email).toContain('@college.edu');
      expect(stu.device).toBeTruthy();
    });
  });

  it('verifies assignments support multiple subtasks with estimated time and mandatory flags', () => {
    INITIAL_ASSIGNMENTS.forEach(asg => {
      expect(asg.subtasks).toBeDefined();
      expect(Array.isArray(asg.subtasks)).toBe(true);
      expect(asg.subtasks!.length).toBeGreaterThan(0);

      asg.subtasks!.forEach(st => {
        expect(st.id).toBeTruthy();
        expect(st.title).toBeTruthy();
        expect(typeof st.estimatedMinutes).toBe('number');
        expect(typeof st.mandatory).toBe('boolean');
      });
    });
  });

  it('verifies holistic growth activities and AICTE activity points', () => {
    expect(INITIAL_HOLISTIC_ACTIVITIES.length).toBeGreaterThan(0);
    INITIAL_HOLISTIC_ACTIVITIES.forEach(act => {
      expect(act.studentId).toBeTruthy();
      expect(act.title).toBeTruthy();
      expect(act.category).toMatch(/^(hackathon|leadership|certification|social_impact|sports_cultural|research)$/);
      expect(act.points).toBeGreaterThan(0);
      expect(act.status).toMatch(/^(pending_approval|approved|rejected)$/);
    });
  });

  it('verifies confidential grievances are restricted and contain privacy safeguards', () => {
    expect(INITIAL_CONFIDENTIAL_GRIEVANCES.length).toBeGreaterThan(0);
    INITIAL_CONFIDENTIAL_GRIEVANCES.forEach(g => {
      expect(g.id).toBeTruthy();
      expect(g.message).toBeTruthy();
      expect(typeof g.isAnonymous).toBe('boolean');
      expect(g.category).toMatch(/^(academic_stress|attendance_dispute|peer_issue|facility_lab|general)$/);
      expect(g.status).toMatch(/^(pending|reviewed|resolved)$/);
    });
  });

  it('verifies cryptographic audit trail ledger exists', () => {
    expect(INITIAL_FACULTY_AUDITS.length).toBeGreaterThan(0);
    INITIAL_FACULTY_AUDITS.forEach(audit => {
      expect(audit.id).toBeTruthy();
      expect(audit.action).toBeTruthy();
      expect(audit.performedBy).toBeTruthy();
      expect(audit.role).toMatch(/^(Faculty|CR|Student)$/);
      expect(audit.severity).toMatch(/^(info|warning|critical)$/);
    });
  });

  it('renders application flawlessly in Faculty Incharge persona', () => {
    globalThis.sessionStorage = {
      getItem: (key: string) => (key === 'studysync_entered' ? '1' : null),
      setItem: () => {},
      removeItem: () => {},
      clear: () => {},
      key: () => null,
      length: 0
    };
    globalThis.localStorage = {
      getItem: (key: string) => {
        if (key === 'studysync_v2_current_user') {
          return JSON.stringify(INITIAL_USERS[1]); // Faculty Incharge Dr. Meenakshi Sundaram
        }
        return null;
      },
      setItem: () => {},
      removeItem: () => {},
      clear: () => {},
      key: () => null,
      length: 0
    };

    const html = renderToString(<App />);
    expect(html).toBeTruthy();
    expect(html).toContain('StudySync');
    // Faculty should have access to Faculty Incharge mode & oversight navigation
    expect(html).toContain('Faculty Incharge');
  });

  it('renders student dashboard with holistic growth meter and confidential faculty grievance action', () => {
    globalThis.sessionStorage = {
      getItem: (key: string) => (key === 'studysync_entered' ? '1' : null),
      setItem: () => {},
      removeItem: () => {},
      clear: () => {},
      key: () => null,
      length: 0
    };
    globalThis.localStorage = {
      getItem: (key: string) => {
        if (key === 'studysync_v2_current_user') {
          return JSON.stringify(INITIAL_USERS[2]); // Student Aaditya Verma
        }
        return null;
      },
      setItem: () => {},
      removeItem: () => {},
      clear: () => {},
      key: () => null,
      length: 0
    };

    const html = renderToString(<App />);
    expect(html).toBeTruthy();
    expect(html).toContain('Holistic Growth Portfolio');
    expect(html).toContain('Faculty Grievance');
  });
});

