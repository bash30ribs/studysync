import { describe, it, expect } from 'vitest';
import publicHtml from '../../public/workspace.html?raw';
import rootHtml from '../../workspace.html?raw';

describe('Workspace HTML Feature Suite', () => {
  it('ensures public/workspace.html and root workspace.html exist and are synchronized', () => {
    expect(publicHtml.length).toBeGreaterThan(150000);
    expect(rootHtml.length).toBeGreaterThan(150000);
    expect(publicHtml).toBe(rootHtml);
  });

  it('verifies New Assignment PDF upload / attachment support', () => {
    expect(publicHtml).toContain('id="naDropzone"');
    expect(publicHtml).toContain('id="naFileInput"');
    expect(publicHtml).toContain('accept=".pdf,.doc,.docx"');
    expect(publicHtml).toContain('id="naAttachedFile"');
    expect(publicHtml).toContain('asg-file-badge');
    expect(publicHtml).toContain('data-action="download-brief"');
  });

  it('verifies editable Due Date with quick presets and calendar picker sync', () => {
    expect(publicHtml).toContain('id="naDueText"');
    expect(publicHtml).toContain('id="naDuePicker"');
    expect(publicHtml).toContain('date-presets');
    expect(publicHtml).toContain('data-preset="Tomorrow · 5:00 PM"');
    expect(publicHtml).toContain('data-preset="Friday · 11:59 PM"');
    expect(publicHtml).toContain('data-preset="Next Monday · 9:00 AM"');
    expect(publicHtml).toContain('data-preset="In 7 Days · 5:00 PM"');
    expect(publicHtml).toContain('case \'edit-due\'');
  });

  it('verifies Academic Vault Upload modal and file download triggers', () => {
    expect(publicHtml).toContain('case \'upload\'');
    expect(publicHtml).toContain('id="resDropzone"');
    expect(publicHtml).toContain('id="resFileInput"');
    expect(publicHtml).toContain('id="resTitle"');
    expect(publicHtml).toContain('id="resSubject"');
    expect(publicHtml).toContain('id="resCategory"');
    expect(publicHtml).toContain('data-action="download-resource"');
  });

  it('verifies Course Code / Join Code CS2026 clarity and modal', () => {
    expect(publicHtml).toContain('Join Code:');
    expect(publicHtml).toContain('CS2026');
    expect(publicHtml).toContain('case \'class-info\'');
    expect(publicHtml).toContain('What is this code meant for?');
    expect(publicHtml).toContain('AIML 2026');
  });

  it('verifies real CSV file exports and JSON backup triggers', () => {
    expect(publicHtml).toContain('function triggerFileDownload(');
    expect(publicHtml).toContain('function exportCSV(');
    expect(publicHtml).toContain('StudySync_CS2026_Assignments_Tracker.csv');
    expect(publicHtml).toContain('StudySync_CS2026_Student_Roster.csv');
    expect(publicHtml).toContain('StudySync_CS2026_Full_Ledger.json');
  });

  it('verifies Local Offline Storage explanation modal', () => {
    expect(publicHtml).toContain('id="storageWidget"');
    expect(publicHtml).toContain('case \'storage-info\'');
    expect(publicHtml).toContain('Local Offline Storage (PWA)');
    expect(publicHtml).toContain('What does "Offline Cache" mean?');
  });
});
