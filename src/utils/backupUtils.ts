export interface StudySyncBackupSnapshot {
  version: string;
  timestamp: string;
  classGroup: {
    id: string;
    name: string;
    code: string;
  };
  assignmentCount: number;
  userCount: number;
}

/**
 * Validates whether an imported object contains valid StudySync backup structure
 */
export function validateBackupSchema(data: unknown): data is StudySyncBackupSnapshot {
  if (!data || typeof data !== 'object') return false;

  const candidate = data as Partial<StudySyncBackupSnapshot>;
  if (typeof candidate.version !== 'string') return false;
  if (typeof candidate.timestamp !== 'string') return false;
  if (!candidate.classGroup || typeof candidate.classGroup !== 'object') return false;

  const { id, name, code } = candidate.classGroup;
  if (typeof id !== 'string' || typeof name !== 'string' || typeof code !== 'string') {
    return false;
  }

  if (typeof candidate.assignmentCount !== 'number' || candidate.assignmentCount < 0) {
    return false;
  }

  if (typeof candidate.userCount !== 'number' || candidate.userCount < 0) {
    return false;
  }

  return true;
}

/**
 * Generates a clean backup manifest
 */
export function createBackupManifest(
  classGroup: { id: string; name: string; code: string },
  assignmentCount: number,
  userCount: number,
  version: string = '1.2.0'
): StudySyncBackupSnapshot {
  return {
    version,
    timestamp: new Date().toISOString(),
    classGroup,
    assignmentCount,
    userCount
  };
}
