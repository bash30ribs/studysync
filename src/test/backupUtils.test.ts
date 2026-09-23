import { describe, it, expect } from 'vitest';
import { validateBackupSchema, createBackupManifest } from '../utils/backupUtils';

describe('backupUtils', () => {
  it('validates a correct backup manifest', () => {
    const valid = createBackupManifest(
      { id: 'c-1', name: 'CSE-3A', code: 'CS-301' },
      5,
      64
    );
    expect(validateBackupSchema(valid)).toBe(true);
  });

  it('rejects invalid or corrupted manifests', () => {
    expect(validateBackupSchema(null)).toBe(false);
    expect(validateBackupSchema({})).toBe(false);
    expect(validateBackupSchema({ version: '1.2.0' })).toBe(false);
    expect(validateBackupSchema({
      version: '1.2.0',
      timestamp: '2026-09-24T00:00:00Z',
      classGroup: { id: 'c-1', name: 'Test' } // missing code
    })).toBe(false);
  });

  it('rejects negative counts', () => {
    const invalid = {
      version: '1.2.0',
      timestamp: '2026-09-24T00:00:00Z',
      classGroup: { id: 'c-1', name: 'Test', code: 'TEST-1' },
      assignmentCount: -1,
      userCount: 10
    };
    expect(validateBackupSchema(invalid)).toBe(false);
  });
});
