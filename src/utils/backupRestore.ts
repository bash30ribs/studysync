/**
 * StudySync Workspace State Backup & Recovery Utility
 */

export interface BackupPayload {
  version: string;
  exportedAt: string;
  source: 'StudySync Academic Platform';
  data: Record<string, unknown>;
}

export function createWorkspaceBackup(state: Record<string, unknown>): string {
  const payload: BackupPayload = {
    version: '1.1.0',
    exportedAt: new Date().toISOString(),
    source: 'StudySync Academic Platform',
    data: state,
  };
  return JSON.stringify(payload, null, 2);
}

export function downloadWorkspaceBackup(state: Record<string, unknown>, filename = 'studysync-backup.json') {
  const content = createWorkspaceBackup(state);
  const blob = new Blob([content], { type: 'application/json;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function validateBackupFile(jsonString: string): { valid: boolean; data?: Record<string, unknown>; error?: string } {
  try {
    const parsed = JSON.parse(jsonString) as Partial<BackupPayload>;
    if (!parsed || typeof parsed !== 'object') {
      return { valid: false, error: 'Invalid JSON structure' };
    }
    if (parsed.source !== 'StudySync Academic Platform' || !parsed.data) {
      return { valid: false, error: 'File is not a valid StudySync backup package' };
    }
    return { valid: true, data: parsed.data as Record<string, unknown> };
  } catch {
    return { valid: false, error: 'Malformed JSON file' };
  }
}
