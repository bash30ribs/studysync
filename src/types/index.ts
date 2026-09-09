export type UserRole = 'CR' | 'Student';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  classId: string;
  joinedAt: string;
  rollNo?: string;
  avatar?: string;
  lastActive: string;
  device?: string;
}

export interface ClassGroup {
  id: string;
  name: string;
  code: string;
  crId: string;
  crName: string;
  createdAt: string;
  subjects: string[];
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
}

export type SubmissionStatus = 'assigned' | 'viewed' | 'submitted' | 'missed';

export interface SubmissionProof {
  os: string;
  browser: string;
  ipMock?: string;
  submissionHash: string;
  timestamp: string;
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

export type NotificationType = 'assignment' | 'reminder' | 'broadcast' | 'submission' | 'system';

export interface NotificationItem {
  id: string;
  userId: string; // user specific or 'ALL'
  type: NotificationType;
  title: string;
  content: string;
  refId?: string;
  refType?: 'assignment' | 'broadcast' | 'message';
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

export type NavTab = 
  | 'dashboard' 
  | 'assignments' 
  | 'calendar' 
  | 'members' 
  | 'broadcasts' 
  | 'messages' 
  | 'analytics' 
  | 'settings'
  | 'profile';
