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

  it('verifies Unified Dual-View Architecture (Landing + Workspace)', () => {
    expect(publicHtml).toContain('id="landing"');
    expect(publicHtml).toContain('id="workspace"');
    expect(publicHtml).toContain('class="view-root active" id="landing"');
    expect(publicHtml).toContain('class="view-root app" id="workspace"');
    expect(publicHtml).toContain('function showWorkspace(');
    expect(publicHtml).toContain('function showLanding(');
    expect(publicHtml).toContain('body.ws-open');
  });

  it('verifies Landing Page Hero and Fast Persona Entry', () => {
    expect(publicHtml).toContain('Stop managing your class on');
    expect(publicHtml).toContain('id="net"');
    expect(publicHtml).toContain('data-persona="sundaram"');
    expect(publicHtml).toContain('data-persona="ribhav"');
    expect(publicHtml).toContain('data-persona="aaditya"');
    expect(publicHtml).toContain('Submission Tracking');
    expect(publicHtml).toContain('1-Click Nudges');
    expect(publicHtml).toContain('Live Class Polls');
    expect(publicHtml).toContain('EduTrack Identity');
  });

  it('verifies Figure 4.1 CR Command Center Stage and 3D Tilt', () => {
    expect(publicHtml).toContain('id="stage"');
    expect(publicHtml).toContain('id="tilt"');
    expect(publicHtml).toContain('id="mock"');
    expect(publicHtml).toContain('Figure 4.1 · CR Command Center');
    expect(publicHtml).toContain('id="remindBtn"');
    expect(publicHtml).toContain('id="nudgeBtn"');
    expect(publicHtml).toContain('id="cohortFill"');
  });

  it('verifies 75% Bunk Radar Calculator with range sliders and presets', () => {
    expect(publicHtml).toContain('id="calculator"');
    expect(publicHtml).toContain('id="totalLec"');
    expect(publicHtml).toContain('id="attLec"');
    expect(publicHtml).toContain('id="gaugeVal"');
    expect(publicHtml).toContain('id="verdict"');
    expect(publicHtml).toContain('data-preset="70"');
    expect(publicHtml).toContain('data-preset="75"');
    expect(publicHtml).toContain('data-preset="90"');
  });

  it('verifies SHA-256 Submission Proof Simulator', () => {
    expect(publicHtml).toContain('id="proof"');
    expect(publicHtml).toContain('id="pName"');
    expect(publicHtml).toContain('id="pAss"');
    expect(publicHtml).toContain('id="genReceipt"');
    expect(publicHtml).toContain('id="receiptCard"');
    expect(publicHtml).toContain('id="copyHashBtn"');
  });

  it('verifies Landing Web Audio Soundscapes Dock', () => {
    expect(publicHtml).toContain('id="audioDock"');
    expect(publicHtml).toContain('id="audioToggle"');
    expect(publicHtml).toContain('id="audioMenu"');
    expect(publicHtml).toContain('data-sound="rain"');
    expect(publicHtml).toContain('data-sound="binaural"');
    expect(publicHtml).toContain('data-sound="noise"');
    expect(publicHtml).toContain('data-sound="mute"');
  });
});

