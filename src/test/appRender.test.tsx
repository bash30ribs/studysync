import { describe, it, expect, beforeEach } from 'vitest';
import React from 'react';
import { renderToString } from 'react-dom/server';
import App from '../App';

describe('App Render & Landing Transition', () => {
  beforeEach(() => {
    // Mock browser globalThiss
    globalThis.sessionStorage = {
      getItem: (key: string) => (key === 'studysync_entered' ? '1' : null),
      setItem: () => {},
      removeItem: () => {},
      clear: () => {},
      key: () => null,
      length: 0
    };
    globalThis.localStorage = {
      getItem: () => null,
      setItem: () => {},
      removeItem: () => {},
      clear: () => {},
      key: () => null,
      length: 0
    };
  });

  it('renders App when studysync_entered is 1 (direct to dashboard)', () => {
    const html = renderToString(<App />);
    expect(html).toBeTruthy();
    expect(html).toContain('Class Overview');
  });

  it('renders App when user is Student', () => {
    globalThis.localStorage.getItem = (key: string) => {
      if (key === 'studysync_v2_current_user') {
        return JSON.stringify({
          id: 'u-student',
          name: 'Test Student',
          email: 'student@test.edu',
          role: 'Student',
          classId: 'c-1',
          joinedAt: '2026-09-01T00:00:00Z',
          lastActive: 'now'
        });
      }
      return null;
    };
    const html = renderToString(<App />);
    expect(html).toBeTruthy();
  });

  it('renders App when class is newly created with empty assignments and submissions', () => {
    globalThis.localStorage.getItem = (key: string) => {
      if (key === 'studysync_v2_class') {
        return JSON.stringify({
          id: 'class-new',
          name: 'NEW-CLASS',
          code: 'NEW123',
          crId: 'cr-1',
          crName: 'New CR',
          createdAt: new Date().toISOString(),
          subjects: ['Subject A']
        });
      }
      if (key === 'studysync_v2_current_user') {
        return JSON.stringify({
          id: 'cr-1',
          name: 'New CR',
          email: 'cr@test.edu',
          role: 'CR',
          classId: 'class-new',
          joinedAt: new Date().toISOString(),
          lastActive: 'now'
        });
      }
      if (key === 'studysync_v2_users') {
        return JSON.stringify([{
          id: 'cr-1',
          name: 'New CR',
          email: 'cr@test.edu',
          role: 'CR',
          classId: 'class-new',
          joinedAt: new Date().toISOString(),
          lastActive: 'now'
        }]);
      }
      if (key === 'studysync_v2_assignments') return JSON.stringify([]);
      if (key === 'studysync_v2_submissions') return JSON.stringify([]);
      if (key === 'studysync_v2_attendance') return JSON.stringify([]);
      if (key === 'studysync_v2_polls') return JSON.stringify([]);
      if (key === 'studysync_v2_resources') return JSON.stringify([]);
      if (key === 'studysync_v2_broadcasts') return JSON.stringify([]);
      if (key === 'studysync_v2_notifications') return JSON.stringify([]);
      return null;
    };
    const html = renderToString(<App />);
    expect(html).toBeTruthy();
    expect(html).toContain('NEW-CLASS');
  });
});
