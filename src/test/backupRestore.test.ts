import { describe, it, expect } from 'vitest';
import { createWorkspaceBackup, validateBackupFile } from '../utils/backupRestore';

describe('backupRestore utility', () => {
  const mockState = {
    classes: [{ id: 'c1', name: 'CS-2026' }],
    user: { id: 'u1', name: 'Alex' },
  };

  it('should generate valid JSON backup with metadata', () => {
    const backupJson = createWorkspaceBackup(mockState);
    const parsed = JSON.parse(backupJson);

    expect(parsed.version).toBe('1.1.0');
    expect(parsed.source).toBe('StudySync Academic Platform');
    expect(parsed.data.classes[0].name).toBe('CS-2026');
  });

  it('should validate and extract valid backup payload', () => {
    const validJson = createWorkspaceBackup(mockState);
    const validation = validateBackupFile(validJson);

    expect(validation.valid).toBe(true);
    expect(validation.data).toBeDefined();
  });

  it('should reject invalid or corrupted backup files', () => {
    const badJson = '{"source": "OtherApp", "data": {}}';
    const validation = validateBackupFile(badJson);

    expect(validation.valid).toBe(false);
    expect(validation.error).toContain('not a valid StudySync');
  });
});
