/**
 * StudySync Backend API Client
 * Talks to the Express backend at http://localhost:3001
 */

export const API_BASE = 'http://localhost:3001';

export interface ActivityEntry {
  id: string;
  type: 'submission' | 'assignment_file_upload' | 'assignment_created' | 'resource_upload' | 'broadcast' | 'growth_submission';
  actor: string;
  detail: string;
  ts: string;
  fileUrl?: string | null;
}

export interface UploadResult {
  ok: boolean;
  fileName: string;
  fileUrl: string;
  fileSize: string;
  storedName?: string;
}

export interface SubmissionResult {
  ok: boolean;
  submittedAt: string;
  submissionHash: string;
  fileName: string | null;
  fileUrl: string | null;
  fileSize: string;
  submission?: any;
}

export interface ResourceUploadResult {
  ok: boolean;
  id: string;
  fileName: string;
  fileUrl: string | null;
  fileSize: string;
  resource?: any;
}

export interface BackendAssignment {
  id: string;
  title: string;
  subject: string;
  due: string;
  deadline: string;
  description?: string;
  submitted: number;
  total: number;
  status: string;
  hash: string;
  fileName?: string | null;
  fileSize?: string | null;
  fileUrl?: string | null;
  postedAt: string;
  createdBy: string;
  isRecurring?: boolean;
  recurrenceRule?: string;
  subtasks?: any[];
}

export interface BackendBroadcast {
  id: string;
  author: string;
  role: string;
  code: string;
  text: string;
  time: string;
  pinned: boolean;
  reactions: number;
  status: 'pending' | 'approved';
}

export interface BackendGrowthActivity {
  id: string;
  studentName: string;
  rollNo: string;
  title: string;
  category: string;
  points: number;
  status: 'pending_approval' | 'approved' | 'rejected';
  verifiedBy?: string | null;
  ts: string;
  fileName?: string | null;
  fileUrl?: string | null;
}

/** Check if backend is reachable */
export async function checkHealth(): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE}/api/health`, { signal: AbortSignal.timeout(2000) });
    return res.ok;
  } catch {
    return false;
  }
}

/** Fetch recent activity log */
export async function fetchActivity(): Promise<ActivityEntry[]> {
  try {
    const res = await fetch(`${API_BASE}/api/activity`);
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

/** Fetch assignments from backend */
export async function fetchAssignments(): Promise<BackendAssignment[]> {
  try {
    const res = await fetch(`${API_BASE}/api/assignments`);
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

/**
 * Upload an assignment attachment (CR uploading the question file)
 */
export async function uploadAssignmentFile(
  file: File,
  uploader: string,
  role: string,
  assignmentTitle: string
): Promise<UploadResult> {
  const form = new FormData();
  form.append('file', file);
  form.append('uploader', uploader);
  form.append('role', role);
  form.append('assignmentTitle', assignmentTitle);

  const res = await fetch(`${API_BASE}/api/upload/assignment-file`, { method: 'POST', body: form });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Upload failed' }));
    throw new Error(err.error || 'Upload failed');
  }
  return res.json();
}

/**
 * Create a new assignment on the backend (with optional file)
 */
export async function createAssignmentBackend(params: {
  file?: File | null;
  title: string;
  subject: string;
  due?: string;
  deadline: string;
  description?: string;
  createdBy: string;
  role?: string;
  fileName?: string;
  fileSize?: string;
  isRecurring?: boolean;
  recurrenceRule?: string;
  subtasks?: any[];
}): Promise<{ ok: boolean; assignment: BackendAssignment }> {
  const form = new FormData();
  if (params.file) form.append('file', params.file);
  form.append('title', params.title);
  form.append('subject', params.subject);
  if (params.due) form.append('due', params.due);
  form.append('deadline', params.deadline);
  if (params.description) form.append('description', params.description);
  form.append('createdBy', params.createdBy);
  if (params.role) form.append('role', params.role);
  if (params.fileName) form.append('fileName', params.fileName);
  if (params.fileSize) form.append('fileSize', params.fileSize);
  if (params.isRecurring) form.append('isRecurring', String(params.isRecurring));
  if (params.recurrenceRule) form.append('recurrenceRule', params.recurrenceRule);
  if (params.subtasks) form.append('subtasks', JSON.stringify(params.subtasks));

  const res = await fetch(`${API_BASE}/api/assignments`, { method: 'POST', body: form });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Failed to create assignment' }));
    throw new Error(err.error || 'Failed to create assignment');
  }
  return res.json();
}

/**
 * Submit assignment — optionally with a file attachment
 */
export async function submitAssignmentBackend(params: {
  file?: File | null;
  studentName: string;
  studentId: string;
  assignmentId: string;
  assignmentTitle: string;
  textNote?: string;
}): Promise<SubmissionResult> {
  const form = new FormData();
  if (params.file) form.append('file', params.file);
  form.append('studentName', params.studentName);
  form.append('studentId', params.studentId);
  form.append('assignmentId', params.assignmentId);
  form.append('assignmentTitle', params.assignmentTitle);
  form.append('textNote', params.textNote || '');

  const res = await fetch(`${API_BASE}/api/submit`, { method: 'POST', body: form });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Submission failed' }));
    throw new Error(err.error || 'Submission failed');
  }
  return res.json();
}

/**
 * Upload a resource to the library (with optional file)
 */
export async function uploadResourceBackend(params: {
  file?: File | null;
  uploader: string;
  title: string;
  subject: string;
  category: string;
  fileName?: string;
}): Promise<ResourceUploadResult> {
  const form = new FormData();
  if (params.file) form.append('file', params.file);
  form.append('uploader', params.uploader);
  form.append('title', params.title);
  form.append('subject', params.subject);
  form.append('category', params.category);
  if (params.fileName) form.append('fileName', params.fileName);

  const res = await fetch(`${API_BASE}/api/upload/resource`, { method: 'POST', body: form });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Upload failed' }));
    throw new Error(err.error || 'Upload failed');
  }
  return res.json();
}

/** Fetch broadcasts from backend */
export async function fetchBroadcasts(): Promise<BackendBroadcast[]> {
  try {
    const res = await fetch(`${API_BASE}/api/broadcasts`);
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

/** Post a new broadcast */
export async function sendBroadcastBackend(params: {
  author: string;
  role: string;
  code: string;
  text: string;
  pinned?: boolean;
}): Promise<{ ok: boolean; broadcast: BackendBroadcast }> {
  const res = await fetch(`${API_BASE}/api/broadcasts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Broadcast failed' }));
    throw new Error(err.error || 'Broadcast failed');
  }
  return res.json();
}

/** Approve a broadcast */
export async function approveBroadcastBackend(id: string): Promise<void> {
  await fetch(`${API_BASE}/api/broadcasts/${id}/approve`, { method: 'POST' });
}

/** Fetch growth activities */
export async function fetchGrowthActivities(): Promise<BackendGrowthActivity[]> {
  try {
    const res = await fetch(`${API_BASE}/api/growth`);
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

/** Submit growth activity / certificate */
export async function submitGrowthActivityBackend(params: {
  file?: File | null;
  studentName: string;
  rollNo: string;
  title: string;
  category: string;
  points: number;
}): Promise<{ ok: boolean; activity: BackendGrowthActivity }> {
  const form = new FormData();
  if (params.file) form.append('file', params.file);
  form.append('studentName', params.studentName);
  form.append('rollNo', params.rollNo);
  form.append('title', params.title);
  form.append('category', params.category);
  form.append('points', String(params.points));

  const res = await fetch(`${API_BASE}/api/growth`, { method: 'POST', body: form });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Growth activity submission failed' }));
    throw new Error(err.error || 'Growth activity submission failed');
  }
  return res.json();
}

/** Approve growth activity */
export async function approveGrowthActivityBackend(id: string): Promise<void> {
  await fetch(`${API_BASE}/api/growth/${id}/approve`, { method: 'POST' });
}

/**
 * Notify backend that an assignment was created
 */
export async function notifyAssignmentCreated(params: {
  createdBy: string;
  title: string;
  subject: string;
  deadline?: string;
  due?: string;
  fileName?: string;
  fileSize?: string;
}): Promise<void> {
  try {
    await fetch(`${API_BASE}/api/assignments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
  } catch {
    // Ignore backend connection errors for graceful degradation
  }
}

/**
 * Notify backend of a submission (fallback if multipart upload wasn't used)
 */
export async function notifyAssignmentSubmitted(params: {
  studentName: string;
  studentId: string;
  assignmentId: string;
  assignmentTitle: string;
  textNote?: string;
}): Promise<void> {
  try {
    await fetch(`${API_BASE}/api/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
  } catch {
    // Ignore
  }
}

