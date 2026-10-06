import { User } from '../types';

export const DEPARTMENT_CODES: Record<string, string> = {
  'computer science': 'CSE',
  'cse': 'CSE',
  'artificial intelligence': 'AIML',
  'aiml': 'AIML',
  'ai & ml': 'AIML',
  'electronics': 'ECE',
  'ece': 'ECE',
  'mechanical': 'ME',
  'me': 'ME',
  'civil': 'CE',
  'ce': 'CE',
  'electrical': 'EEE',
  'eee': 'EEE',
  'information technology': 'IT',
  'it': 'IT',
  'general': 'GEN',
};

export const POPULAR_DEPARTMENTS = [
  'CSE',
  'AIML',
  'ECE',
  'IT',
  'ME',
  'CE',
  'EEE'
];

export const FACULTY_DESIGNATIONS = [
  'Assistant Professor',
  'Associate Professor',
  'Professor',
  'Head of Department (HOD)',
  'Visiting Faculty',
  'Lab Incharge',
  'Dean of Academics'
];

export function getDeptCode(department: string): string {
  const clean = (department || '').trim().toLowerCase();
  if (DEPARTMENT_CODES[clean]) return DEPARTMENT_CODES[clean];
  const upper = department.toUpperCase().replace(/[^A-Z]/g, '');
  return upper.slice(0, 4) || 'CSE';
}

export function getNamePrefix(name: string, length = 3): string {
  const firstWord = (name || '').trim().split(/\s+/)[0] || 'STU';
  const clean = firstWord.replace(/[^a-zA-Z]/g, '').toUpperCase();
  return clean.slice(0, length).padEnd(length, 'X');
}

export function getYearSuffix(): string {
  return new Date().getFullYear().toString().slice(-2);
}

/**
 * Generate Student UID in EduTrack format: STU-<DEPT><YY><NAME3><SEQ>
 * Example: STU-CSE26WIL001
 */
export function generateStudentUid(name: string, department: string, existingUsers: User[] = []): string {
  const dept = getDeptCode(department);
  const yr = getYearSuffix();
  const nam = getNamePrefix(name);
  const prefix = `STU-${dept}${yr}${nam}`;
  const existingCount = existingUsers.filter(u => u.uid && u.uid.startsWith(prefix)).length;
  const seq = String(existingCount + 1).padStart(3, '0');
  return `${prefix}${seq}`;
}

/**
 * Generate Teacher / Faculty UID in EduTrack format: EMP-<DEPT><YY><NAME3><SEQ>
 * Example: EMP-CS26AND001
 */
export function generateTeacherUid(name: string, department: string, existingUsers: User[] = []): string {
  const dept = getDeptCode(department).slice(0, 2) || 'CS';
  const yr = getYearSuffix();
  const nam = getNamePrefix(name);
  const prefix = `EMP-${dept}${yr}${nam}`;
  const existingCount = existingUsers.filter(u => u.uid && u.uid.startsWith(prefix)).length;
  const seq = String(existingCount + 1).padStart(3, '0');
  return `${prefix}${seq}`;
}

/**
 * Generate Student Roll Number in EduTrack format: <DEPT><YY><SEQ>
 * Example: CSE26001
 */
export function generateStudentRollNo(department: string, existingUsers: User[] = []): string {
  const dept = getDeptCode(department);
  const yr = getYearSuffix();
  const prefix = `${dept}${yr}`;
  const existingCount = existingUsers.filter(u => u.rollNo && u.rollNo.startsWith(prefix)).length;
  const seq = String(existingCount + 1).padStart(3, '0');
  return `${prefix}${seq}`;
}

/**
 * Generate temporary password for newly created student / teacher
 */
export function generateSecureTempPassword(): string {
  const words = ['Study', 'Precision', 'Acad', 'Sync', 'Nexus', 'Track'];
  const symbols = ['@', '#', '$', '!'];
  const word = words[Math.floor(Math.random() * words.length)];
  const symbol = symbols[Math.floor(Math.random() * symbols.length)];
  const num = Math.floor(1000 + Math.random() * 9000);
  return `${word}${symbol}${num}`;
}
