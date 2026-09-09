export type UserRole = 'CR' | 'Student';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  classId: string;
  enrolledClassIds?: string[];
  joinedAt: string;
  rollNo?: string;
  avatar?: string;
  lastActive: string;
  device?: string;
  isEmailVerified?: boolean;
}

export interface ClassGroup {
  id: string;
  name: string;
  code: string;
  crId: string;
  crName: string;
  createdAt: string;
  subjects: string[];
  semester?: string;
  academicYear?: string;
  isArchived?: boolean;
  memberCount?: number;
}

export interface Assignment {
  id: string;
  classId: string;
  title: string;
  subject: string;
  description: string;
  fileUrl?: string;
  fileName?: string;
  fileSize?: string;
  deadline: string; // ISO date string
  postedAt: string;
  createdBy: string;
  status: 'active' | 'closed' | 'overdue';
  notifyOnCreate: boolean;
  isRecurring?: boolean;
  recurrenceRule?: 'weekly' | 'biweekly';
  aiSummary?: string;
  difficultyEstimate?: 'Low' | 'Medium' | 'High';
  maxScore?: number;
}

export type SubmissionStatus = 'assigned' | 'viewed' | 'submitted' | 'missed';

export interface SubmissionProof {
  os: string;
  browser: string;
  ipMock?: string;
  submissionHash: string;
  timestamp: string;
}

export interface SubmissionGrade {
  score: number;
  maxScore: number;
  feedback?: string;
  gradedAt: string;
  gradedBy: string;
}

export interface Submission {
  id: string;
  assignmentId: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  status: SubmissionStatus;
  submittedAt?: string;
  viewedAt?: string;
  textResponse?: string;
  fileName?: string;
  fileSize?: string;
  fileUrl?: string;
  proof?: SubmissionProof;
  grade?: SubmissionGrade;
}

export interface Broadcast {
  id: string;
  classId: string;
  content: string;
  sentAt: string;
  sentBy: string;
  authorName: string;
  deliveredCount: number;
  isPinned?: boolean;
  readBy: string[]; // student IDs
}

export interface Message {
  id: string;
  classId: string;
  senderId: string;
  senderName: string;
  senderRole: UserRole;
  recipientId: string | null; // null = group class channel, or studentId for 1-1 with CR
  content: string;
  fileUrl?: string;
  fileName?: string;
  sentAt: string;
  readBy: string[];
  isEncrypted: boolean;
}

export type NotificationType = 'assignment' | 'reminder' | 'broadcast' | 'submission' | 'attendance' | 'grade' | 'poll' | 'system';

export interface NotificationItem {
  id: string;
  userId: string; // user specific or 'ALL'
  type: NotificationType;
  title: string;
  content: string;
  refId?: string;
  refType?: 'assignment' | 'broadcast' | 'message' | 'attendance' | 'poll' | 'resource';
  read: boolean;
  createdAt: string;
}

export interface DiscussionComment {
  id: string;
  assignmentId: string;
  authorId: string;
  authorName: string;
  authorRole: UserRole;
  content: string;
  createdAt: string;
}

export interface ReminderLog {
  id: string;
  assignmentId: string;
  triggeredAt: string;
  triggeredBy: string;
  recipientCount: number;
  type: 'manual' | 'auto_24h' | 'auto_2h';
}

// Attendance Types
export type AttendanceStatus = 'present' | 'absent' | 'late' | 'excused';

export interface AttendanceRecord {
  studentId: string;
  studentName: string;
  rollNo: string;
  status: AttendanceStatus;
}

export interface AttendanceSession {
  id: string;
  classId: string;
  date: string; // YYYY-MM-DD
  subject: string;
  topic?: string;
  conductedBy: string;
  records: AttendanceRecord[];
  createdAt: string;
}

// Resource Library Types
export type ResourceCategory = 'notes' | 'pyq' | 'syllabus' | 'lab' | 'formula';

export interface ResourceItem {
  id: string;
  classId: string;
  title: string;
  subject: string;
  category: ResourceCategory;
  description: string;
  fileName: string;
  fileSize: string;
  fileUrl?: string;
  uploadedBy: string;
  uploadedByName: string;
  uploadedAt: string;
  downloadsCount: number;
}

// Polls & Quick Votes Types
export interface PollOption {
  id: string;
  text: string;
  votes: string[]; // student IDs
}

export interface ClassPoll {
  id: string;
  classId: string;
  question: string;
  description?: string;
  options: PollOption[];
  createdBy: string;
  createdByName: string;
  createdAt: string;
  expiresAt: string;
  isClosed: boolean;
}

export type TrustPageType = 'privacy' | 'terms' | 'security' | 'status' | 'about';

export type NavTab = 
  | 'dashboard' 
  | 'assignments' 
  | 'attendance'
  | 'resources'
  | 'polls'
  | 'calendar' 
  | 'members' 
  | 'broadcasts' 
  | 'messages' 
  | 'analytics' 
  | 'settings';
