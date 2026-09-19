import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  User, 
  ClassGroup, 
  Assignment, 
  Submission, 
  Broadcast, 
  Message, 
  NotificationItem, 
  DiscussionComment, 
  NavTab, 
  UserRole,
  SubmissionProof,
  AttendanceSession,
  AttendanceRecord,
  ResourceItem,
  ClassPoll,
  TrustPageType
} from '../types';
import { 
  INITIAL_CLASS,
  INITIAL_CLASSES,
  INITIAL_USERS, 
  INITIAL_ASSIGNMENTS, 
  INITIAL_SUBMISSIONS, 
  INITIAL_BROADCASTS, 
  INITIAL_MESSAGES, 
  INITIAL_NOTIFICATIONS, 
  INITIAL_DISCUSSIONS,
  INITIAL_ATTENDANCE,
  INITIAL_RESOURCES,
  INITIAL_POLLS
} from '../data/initialData';

export type ThemeAccent = 'blue' | 'indigo' | 'emerald' | 'amber' | 'cyan' | 'teal';

export interface ToastItem {
  message: string;
  type: 'success' | 'error' | 'info';
  undoAction?: () => void;
}

interface StudySyncContextType {
  currentUser: User;
  currentClass: ClassGroup;
  classes: ClassGroup[];
  allUsers: User[];
  assignments: Assignment[];
  submissions: Submission[];
  broadcasts: Broadcast[];
  messages: Message[];
  notifications: NotificationItem[];
  discussions: DiscussionComment[];
  attendanceSessions: AttendanceSession[];
  resources: ResourceItem[];
  polls: ClassPoll[];
  activeTab: NavTab;
  selectedAssignmentId: string | null;
  selectedStudentId: string | null;
  selectedCalendarDate: string | null;
  isOffline: boolean;
  isRightPanelOpen: boolean;
  isNewAssignmentModalOpen: boolean;
  isSubmitDrawerOpen: boolean;
  isCommandPaletteOpen: boolean;
  isShortcutsOpen: boolean;
  isQRCodeOpen: boolean;
  activeTrustPage: TrustPageType | null;
  themeAccent: ThemeAccent;
  toast: ToastItem | null;
  
  // Setters & Nav
  setActiveTab: (tab: NavTab) => void;
  setSelectedAssignmentId: (id: string | null) => void;
  setSelectedStudentId: (id: string | null) => void;
  setSelectedCalendarDate: (date: string | null) => void;
  setIsRightPanelOpen: (open: boolean) => void;
  setIsNewAssignmentModalOpen: (open: boolean) => void;
  setIsSubmitDrawerOpen: (open: boolean) => void;
  setIsCommandPaletteOpen: (open: boolean) => void;
  setIsShortcutsOpen: (open: boolean) => void;
  setIsQRCodeOpen: (open: boolean) => void;
  setActiveTrustPage: (page: TrustPageType | null) => void;
  setThemeAccent: (accent: ThemeAccent) => void;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  showUndoToast: (message: string, onUndo: () => void, duration?: number) => void;
  
  // Actions
  switchRole: (role: UserRole, targetUserId?: string) => void;
  switchClass: (classId: string) => void;
  archiveCurrentClass: () => void;
  transferCR: (newCRStudentId: string) => void;
  createClass: (name: string, crName: string, crEmail: string) => string;
  joinClass: (code: string, studentName: string, studentEmail: string) => { success: boolean; error?: string };
  createAssignment: (data: { 
    title: string; 
    subject: string; 
    description: string; 
    deadline: string; 
    fileName?: string; 
    fileSize?: string; 
    notifyOnCreate: boolean;
    isRecurring?: boolean;
    recurrenceRule?: 'weekly' | 'biweekly';
    maxScore?: number;
  }) => void;
  submitAssignment: (assignmentId: string, textResponse?: string, file?: { name: string; size: string }) => void;
  markAssignmentViewed: (assignmentId: string) => void;
  gradeSubmission: (submissionId: string, score: number, maxScore: number, feedback?: string) => void;
  sendBroadcast: (content: string) => void;
  sendMessage: (content: string, recipientId: string | null, file?: { name: string }) => void;
  remindPendingStudents: (assignmentId: string) => void;
  addDiscussionComment: (assignmentId: string, content: string) => void;
  takeAttendance: (data: { subject: string; date: string; topic?: string; conductedBy?: string; records: AttendanceRecord[] }) => void;
  deleteAttendanceSession: (sessionId: string) => void;
  uploadResource: (data: { title: string; subject: string; category: any; description: string; fileName: string; fileSize: string }) => void;
  deleteResource: (resourceId: string) => void;
  incrementResourceDownload: (resourceId: string) => void;
  createPoll: (data: { question: string; description?: string; options: string[]; expiresHours?: number }) => void;
  votePoll: (pollId: string, optionId: string) => void;
  closePoll: (pollId: string) => void;
  removeStudent: (studentId: string) => void;
  regenerateClassCode: () => string;
  updateClassName: (name: string) => void;
  updateUserDisplayName: (name: string) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  toggleOffline: () => void;
  exportSubmissionsCSV: (assignmentId?: string) => void;
  exportMembersCSV: () => void;
  exportAttendanceCSV: () => void;
  leaveClass: () => void;
  resetDemoData: () => void;
}

const STORAGE_KEY_PREFIX = 'studysync_v2_';

const loadStorage = <T,>(key: string, defaultValue: T): T => {
  try {
    const item = localStorage.getItem(STORAGE_KEY_PREFIX + key);
    return item ? JSON.parse(item) : defaultValue;
  } catch {
    return defaultValue;
  }
};

const saveStorage = <T,>(key: string, value: T): void => {
  try {
    localStorage.setItem(STORAGE_KEY_PREFIX + key, JSON.stringify(value));
  } catch (e) {
    console.error('Storage error:', e);
  }
};

// Escape a field value for safe CSV embedding
const escapeCSV = (val: string): string => `"${val.replace(/"/g, '""')}"`;

// Clear only StudySync-owned localStorage keys
const clearStudySyncStorage = () => {
  const keysToRemove: string[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i);
    if (k && k.startsWith(STORAGE_KEY_PREFIX)) keysToRemove.push(k);
  }
  keysToRemove.forEach(k => localStorage.removeItem(k));
};

const StudySyncContext = createContext<StudySyncContextType | undefined>(undefined);

export const StudySyncProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [classes, setClasses] = useState<ClassGroup[]>(() => loadStorage('classes', INITIAL_CLASSES));
  const [currentClass, setCurrentClass] = useState<ClassGroup>(() => loadStorage('class', INITIAL_CLASS));
  const [allUsers, setAllUsers] = useState<User[]>(() => loadStorage('users', INITIAL_USERS));
  const [currentUser, setCurrentUser] = useState<User>(() => {
    const saved = loadStorage<User | null>('current_user', null);
    return saved || INITIAL_USERS[0];
  });
  
  const [assignments, setAssignments] = useState<Assignment[]>(() => loadStorage('assignments', INITIAL_ASSIGNMENTS));
  const [submissions, setSubmissions] = useState<Submission[]>(() => loadStorage('submissions', INITIAL_SUBMISSIONS));
  const [broadcasts, setBroadcasts] = useState<Broadcast[]>(() => loadStorage('broadcasts', INITIAL_BROADCASTS));
  const [messages, setMessages] = useState<Message[]>(() => loadStorage('messages', INITIAL_MESSAGES));
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => loadStorage('notifications', INITIAL_NOTIFICATIONS));
  const [discussions, setDiscussions] = useState<DiscussionComment[]>(() => loadStorage('discussions', INITIAL_DISCUSSIONS));
  const [attendanceSessions, setAttendanceSessions] = useState<AttendanceSession[]>(() => loadStorage('attendance', INITIAL_ATTENDANCE));
  const [resources, setResources] = useState<ResourceItem[]>(() => loadStorage('resources', INITIAL_RESOURCES));
  const [polls, setPolls] = useState<ClassPoll[]>(() => loadStorage('polls', INITIAL_POLLS));

  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  const [selectedAssignmentId, setSelectedAssignmentId] = useState<string | null>(assignments[0]?.id || null);
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(allUsers.find(u => u.role === 'Student')?.id || null);
  const [selectedCalendarDate, setSelectedCalendarDate] = useState<string | null>(new Date().toISOString().split('T')[0]);
  const [isOffline, setIsOffline] = useState<boolean>(false);
  const [isRightPanelOpen, setIsRightPanelOpen] = useState<boolean>(false);
  const [isNewAssignmentModalOpen, setIsNewAssignmentModalOpen] = useState<boolean>(false);
  const [isSubmitDrawerOpen, setIsSubmitDrawerOpen] = useState<boolean>(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState<boolean>(false);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState<boolean>(false);
  const [isQRCodeOpen, setIsQRCodeOpen] = useState<boolean>(false);
  const [activeTrustPage, setActiveTrustPage] = useState<TrustPageType | null>(null);
  const [themeAccent, setThemeAccentState] = useState<ThemeAccent>(() => loadStorage('theme_accent', 'blue'));
  const [toast, setToast] = useState<ToastItem | null>(null);

  // Sync to local storage
  useEffect(() => saveStorage('classes', classes), [classes]);
  useEffect(() => saveStorage('users', allUsers), [allUsers]);
  useEffect(() => saveStorage('current_user', currentUser), [currentUser]);
  useEffect(() => saveStorage('class', currentClass), [currentClass]);
  useEffect(() => saveStorage('assignments', assignments), [assignments]);
  useEffect(() => saveStorage('submissions', submissions), [submissions]);
  useEffect(() => saveStorage('broadcasts', broadcasts), [broadcasts]);
  useEffect(() => saveStorage('messages', messages), [messages]);
  useEffect(() => saveStorage('notifications', notifications), [notifications]);
  useEffect(() => saveStorage('discussions', discussions), [discussions]);
  useEffect(() => saveStorage('attendance', attendanceSessions), [attendanceSessions]);
  useEffect(() => saveStorage('resources', resources), [resources]);
  useEffect(() => saveStorage('polls', polls), [polls]);
  useEffect(() => {
    saveStorage('theme_accent', themeAccent);
    document.documentElement.setAttribute('data-accent', themeAccent);
  }, [themeAccent]);

  // Global Keyboard Shortcuts (⌘K, ?, N, B, A, P, R, Escape)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeEl = document.activeElement;
      const isInput = activeEl?.tagName === 'INPUT' || activeEl?.tagName === 'TEXTAREA' || activeEl?.getAttribute('contenteditable') === 'true';

      // Command / Ctrl + K -> Toggle Command Palette
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen(prev => !prev);
        return;
      }

      // Escape -> close all open overlays
      if (e.key === 'Escape') {
        setIsCommandPaletteOpen(false);
        setIsNewAssignmentModalOpen(false);
        setIsSubmitDrawerOpen(false);
        setIsShortcutsOpen(false);
        setIsQRCodeOpen(false);
        setActiveTrustPage(null);
        return;
      }

      // If user is actively typing in an input field, do not trigger single-key navigation
      if (isInput) return;

      // ? or Shift+/ -> handled by App.tsx to avoid duplicate firing

      // Single Key Actions
      if (!e.metaKey && !e.ctrlKey && !e.altKey) {
        if (e.key.toLowerCase() === 'n') {
          e.preventDefault();
          if (currentUser.role === 'CR') {
            setIsNewAssignmentModalOpen(true);
          } else {
            setIsSubmitDrawerOpen(true);
          }
        } else if (e.key.toLowerCase() === 'b') {
          e.preventDefault();
          setActiveTab('broadcasts');
        } else if (e.key.toLowerCase() === 'a') {
          e.preventDefault();
          setActiveTab('attendance');
        } else if (e.key.toLowerCase() === 'p') {
          e.preventDefault();
          setActiveTab('polls');
        } else if (e.key.toLowerCase() === 'r') {
          e.preventDefault();
          setActiveTab('resources');
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentUser]);

  const setThemeAccent = (accent: ThemeAccent) => {
    setThemeAccentState(accent);
    document.documentElement.setAttribute('data-accent', accent);
    showToast(`Theme accent set to ${accent.toUpperCase()}`, 'info');
  };

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(prev => prev?.message === message ? null : prev);
    }, 4000);
  };

  const showUndoToast = (message: string, onUndo: () => void, duration: number = 6000) => {
    setToast({ message, type: 'info', undoAction: onUndo });
    setTimeout(() => {
      setToast(prev => prev?.message === message ? null : prev);
    }, duration);
  };

  const switchRole = (role: UserRole, targetUserId?: string) => {
    if (targetUserId) {
      const found = allUsers.find(u => u.id === targetUserId);
      if (found) {
        setCurrentUser(found);
        showToast(`Switched view to ${found.name} (${found.role})`, 'info');
        return;
      }
    }

    if (role === 'CR') {
      const cr = allUsers.find(u => u.role === 'CR') || INITIAL_USERS[0];
      setCurrentUser(cr);
      showToast(`Switched to CR View (${cr.name})`, 'info');
    } else {
      const student = allUsers.find(u => u.role === 'Student') || INITIAL_USERS[1];
      setCurrentUser(student);
      showToast(`Switched to Student View (${student.name})`, 'info');
    }
  };

  const switchClass = (classId: string) => {
    const target = classes.find(c => c.id === classId);
    if (target) {
      setCurrentClass(target);
      showToast(`Switched active class to ${target.name}`, 'info');
    }
  };

  const archiveCurrentClass = () => {
    const updated = { ...currentClass, isArchived: true };
    setCurrentClass(updated);
    setClasses(prev => prev.map(c => c.id === currentClass.id ? updated : c));
    showToast(`Class ${currentClass.name} archived for the semester`, 'info');
  };

  const transferCR = (newCRStudentId: string) => {
    const newCR = allUsers.find(u => u.id === newCRStudentId);
    if (!newCR) return;

    const oldCR = currentUser;
    const updatedUsers = allUsers.map(u => {
      if (u.id === newCRStudentId) {
        return { ...u, role: 'CR' as UserRole };
      }
      if (u.id === oldCR.id) {
        return { ...u, role: 'Student' as UserRole };
      }
      return u;
    });

    const updatedClass = {
      ...currentClass,
      crId: newCR.id,
      crName: newCR.name
    };

    setAllUsers(updatedUsers);
    setCurrentClass(updatedClass);
    setClasses(prev => prev.map(c => c.id === currentClass.id ? updatedClass : c));
    setCurrentUser({ ...oldCR, role: 'Student' });

    showToast(`CR role successfully transferred to ${newCR.name}. You are now in Student view.`, 'success');
  };

  const generateCode = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  };

  const createClass = (name: string, crName: string, crEmail: string): string => {
    const code = generateCode();
    const newCrId = 'user-cr-' + Date.now();
    const newClassId = 'class-' + Date.now();

    const newCr: User = {
      id: newCrId,
      name: crName,
      email: crEmail,
      role: 'CR',
      classId: newClassId,
      joinedAt: new Date().toISOString(),
      rollNo: '23CR001',
      lastActive: 'Just now',
      device: 'Desktop / Chrome'
    };

    const newClass: ClassGroup = {
      id: newClassId,
      name: name.toUpperCase(),
      code: code,
      crId: newCrId,
      crName: crName,
      createdAt: new Date().toISOString(),
      subjects: ['General Mechanics', 'Applied Physics', 'Engineering Drawing', 'Mathematics']
    };

    setClasses(prev => [...prev, newClass]);
    // Add the new CR to existing users rather than wiping the whole list
    setAllUsers(prev => [...prev, newCr]);
    setCurrentUser(newCr);
    setCurrentClass(newClass);
    setAssignments([]);
    setSubmissions([]);
    setAttendanceSessions([]);
    setResources([]);
    setPolls([]);
    setBroadcasts([
      {
        id: 'bc-init-' + Date.now(),
        classId: newClassId,
        content: `Welcome to ${newClass.name}! Join code is ${code}. Official class updates, attendance, and assignments will be coordinated here.`,
        sentAt: new Date().toISOString(),
        sentBy: newCrId,
        authorName: crName,
        deliveredCount: 1,
        isPinned: true,
        readBy: []
      }
    ]);
    setActiveTab('dashboard');
    showToast(`Class created! Class code: ${code}`, 'success');
    return code;
  };

  const joinClass = (code: string, studentName: string, studentEmail: string): { success: boolean; error?: string } => {
    const cleanCode = code.trim().toUpperCase();
    const targetClass = classes.find(c => c.code === cleanCode) || (cleanCode === currentClass.code ? currentClass : null);

    if (!targetClass) {
      return { success: false, error: 'Code not found. Check with your CR.' };
    }

    const newStudentId = 'user-stu-' + Date.now();
    const newStudent: User = {
      id: newStudentId,
      name: studentName,
      email: studentEmail,
      role: 'Student',
      classId: targetClass.id,
      joinedAt: new Date().toISOString(),
      rollNo: `23ME${Math.floor(100 + Math.random() * 899)}`,
      lastActive: 'Just now',
      device: 'Mobile Browser'
    };

    setCurrentClass(targetClass);
    setAllUsers(prev => [...prev, newStudent]);
    setCurrentUser(newStudent);

    const newSubs: Submission[] = assignments.map(asg => ({
      id: `sub-${asg.id}-${newStudentId}`,
      assignmentId: asg.id,
      studentId: newStudentId,
      studentName: studentName,
      studentEmail: studentEmail,
      status: 'assigned'
    }));

    setSubmissions(prev => [...prev, ...newSubs]);
    setActiveTab('dashboard');
    showToast(`Successfully joined ${targetClass.name}!`, 'success');
    return { success: true };
  };

  const createAssignment = (data: { 
    title: string; 
    subject: string; 
    description: string; 
    deadline: string; 
    fileName?: string; 
    fileSize?: string; 
    notifyOnCreate: boolean;
    isRecurring?: boolean;
    recurrenceRule?: 'weekly' | 'biweekly';
    maxScore?: number;
  }) => {
    // Validate deadline is not in the past
    if (data.deadline && new Date(data.deadline).getTime() < Date.now()) {
      showToast('Deadline cannot be set in the past. Please pick a future date.', 'error');
      return;
    }
    const newId = 'asg-' + Date.now();
    const newAsg: Assignment = {
      id: newId,
      classId: currentClass.id,
      title: data.title,
      subject: data.subject,
      description: data.description,
      deadline: data.deadline,
      fileName: data.fileName,
      fileSize: data.fileSize,
      fileUrl: data.fileName ? '#' : undefined,
      postedAt: new Date().toISOString(),
      createdBy: currentUser.name,
      status: 'active',
      notifyOnCreate: data.notifyOnCreate,
      isRecurring: data.isRecurring,
      recurrenceRule: data.recurrenceRule,
      maxScore: data.maxScore || 20
    };

    const studentUsers = allUsers.filter(u => u.role === 'Student');
    const newSubs: Submission[] = studentUsers.map(stu => ({
      id: `sub-${newId}-${stu.id}`,
      assignmentId: newId,
      studentId: stu.id,
      studentName: stu.name,
      studentEmail: stu.email,
      status: 'assigned'
    }));

    setAssignments(prev => [newAsg, ...prev]);
    setSubmissions(prev => [...prev, ...newSubs]);
    setSelectedAssignmentId(newId);
    setIsNewAssignmentModalOpen(false);

    if (data.notifyOnCreate) {
      const newNotif: NotificationItem = {
        id: 'notif-asg-' + Date.now(),
        userId: 'ALL',
        type: 'assignment',
        title: 'New Assignment Posted',
        content: `${data.title} (${data.subject}) — due ${new Date(data.deadline).toLocaleDateString(undefined, { weekday: 'short', hour: '2-digit', minute: '2-digit' })}`,
        refId: newId,
        refType: 'assignment',
        read: false,
        createdAt: new Date().toISOString()
      };
      setNotifications(prev => [newNotif, ...prev]);
    }

    showToast(`Assignment "${data.title}" posted to all students`, 'success');
  };

  const markAssignmentViewed = (assignmentId: string) => {
    if (currentUser.role !== 'Student') return;

    setSubmissions(prev => prev.map(sub => {
      if (sub.assignmentId === assignmentId && sub.studentId === currentUser.id) {
        if (sub.status === 'assigned') {
          return {
            ...sub,
            status: 'viewed',
            viewedAt: new Date().toISOString()
          };
        }
      }
      return sub;
    }));
  };

  const submitAssignment = (
    assignmentId: string, 
    textResponse?: string, 
    file?: { name: string; size: string }
  ) => {
    if (isOffline) {
      showToast('Submission requires active network connection', 'error');
      return;
    }

    const isoTime = new Date().toISOString();
    const hash = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    // navigator.platform is deprecated — use userAgentData if available
    const detectedOS = (navigator as any).userAgentData?.platform ||
      (navigator.userAgent.includes('Win') ? 'Windows' :
      navigator.userAgent.includes('Mac') ? 'macOS' :
      navigator.userAgent.includes('Linux') ? 'Linux' :
      navigator.userAgent.includes('Android') ? 'Android' :
      navigator.userAgent.includes('iPhone') || navigator.userAgent.includes('iPad') ? 'iOS' : 'Unknown OS');
    const proof: SubmissionProof = {
      os: detectedOS,
      browser: navigator.userAgent.includes('Chrome') ? 'Chrome' : navigator.userAgent.includes('Safari') ? 'Safari' : 'Browser',
      submissionHash: hash,
      timestamp: isoTime
    };

    setSubmissions(prev => {
      const existing = prev.find(s => s.assignmentId === assignmentId && s.studentId === currentUser.id);
      if (existing) {
        return prev.map(sub => {
          if (sub.id === existing.id) {
            return {
              ...sub,
              status: 'submitted',
              submittedAt: isoTime,
              textResponse: textResponse || sub.textResponse,
              fileName: file?.name || sub.fileName || 'Submission_Document.pdf',
              fileSize: file?.size || sub.fileSize || '1.8 MB',
              fileUrl: '#',
              proof
            };
          }
          return sub;
        });
      } else {
        const newSub: Submission = {
          id: `sub-${assignmentId}-${currentUser.id}`,
          assignmentId,
          studentId: currentUser.id,
          studentName: currentUser.name,
          studentEmail: currentUser.email,
          status: 'submitted',
          submittedAt: isoTime,
          textResponse,
          fileName: file?.name || 'Submission_Document.pdf',
          fileSize: file?.size || '1.8 MB',
          fileUrl: '#',
          proof
        };
        return [...prev, newSub];
      }
    });

    const targetAsg = assignments.find(a => a.id === assignmentId);
    
    const crNotif: NotificationItem = {
      id: 'notif-sub-cr-' + Date.now(),
      userId: currentClass.crId,
      type: 'submission',
      title: 'Submission Received',
      content: `${currentUser.name} submitted ${targetAsg?.title || 'Assignment'}.`,
      refId: assignmentId,
      refType: 'assignment',
      read: false,
      createdAt: isoTime
    };

    setNotifications(prev => [crNotif, ...prev]);
    setIsSubmitDrawerOpen(false);
    showToast('Assignment submitted with tamper-evident cryptographic proof!', 'success');
  };

  const gradeSubmission = (submissionId: string, score: number, maxScore: number, feedback?: string) => {
    const gradedAt = new Date().toISOString();
    setSubmissions(prev => prev.map(sub => {
      if (sub.id === submissionId) {
        return {
          ...sub,
          grade: {
            score,
            maxScore,
            feedback,
            gradedAt,
            gradedBy: currentUser.name
          }
        };
      }
      return sub;
    }));

    const sub = submissions.find(s => s.id === submissionId);
    if (sub) {
      const studentNotif: NotificationItem = {
        id: 'notif-grade-' + Date.now(),
        userId: sub.studentId,
        type: 'grade',
        title: 'Assignment Graded',
        content: `Score: ${score}/${maxScore}. Feedback: ${feedback ? `"${feedback}"` : 'Well done!'}`,
        refId: sub.assignmentId,
        refType: 'assignment',
        read: false,
        createdAt: gradedAt
      };
      setNotifications(prev => [studentNotif, ...prev]);
    }

    showToast(`Grade recorded: ${score}/${maxScore}`, 'success');
  };

  const sendBroadcast = (content: string) => {
    if (currentUser.role !== 'CR') {
      showToast('Only the Class Representative can send official broadcasts.', 'error');
      return;
    }

    const clean = content.trim();
    if (!clean) return;

    const newBc: Broadcast = {
      id: 'bc-' + Date.now(),
      classId: currentClass.id,
      content: clean,
      sentAt: new Date().toISOString(),
      sentBy: currentUser.id,
      authorName: currentUser.name,
      deliveredCount: Math.max(1, allUsers.filter(u => u.role === 'Student').length),
      isPinned: false,
      readBy: []
    };

    const notif: NotificationItem = {
      id: 'notif-bc-' + Date.now(),
      userId: 'ALL',
      type: 'broadcast',
      title: 'Official Broadcast',
      content: `CR Notice: ${clean.substring(0, 90)}${clean.length > 90 ? '...' : ''}`,
      refId: newBc.id,
      refType: 'broadcast',
      read: false,
      createdAt: new Date().toISOString()
    };

    setBroadcasts(prev => [newBc, ...prev]);
    setNotifications(prev => [notif, ...prev]);
    showToast('Broadcast sent to all students', 'success');
  };

  const sendMessage = (content: string, recipientId: string | null, file?: { name: string }) => {
    const clean = content.trim();
    if (!clean && !file) return;

    const newMsg: Message = {
      id: 'msg-' + Date.now(),
      classId: currentClass.id,
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderRole: currentUser.role,
      recipientId: recipientId,
      content: clean,
      fileName: file?.name,
      fileUrl: file ? '#' : undefined,
      sentAt: new Date().toISOString(),
      readBy: [currentUser.id],
      isEncrypted: true
    };

    setMessages(prev => [...prev, newMsg]);
  };

  const remindPendingStudents = (assignmentId: string) => {
    const asg = assignments.find(a => a.id === assignmentId);
    if (!asg) return;

    const asgSubs = submissions.filter(s => s.assignmentId === assignmentId);
    const pendingStudentIds = allUsers
      .filter(u => u.role === 'Student')
      .filter(u => {
        const sub = asgSubs.find(s => s.studentId === u.id);
        return !sub || sub.status === 'assigned' || sub.status === 'viewed';
      })
      .map(u => u.id);

    if (pendingStudentIds.length === 0) {
      showToast('All students have already submitted this assignment!', 'info');
      return;
    }

    const newNotifs: NotificationItem[] = pendingStudentIds.map(stuId => ({
      id: `notif-remind-${assignmentId}-${stuId}-${Date.now()}`,
      userId: stuId,
      type: 'reminder',
      title: 'Submission Reminder',
      content: `Reminder from CR: You have not submitted "${asg.title}". Please submit before the deadline.`,
      refId: assignmentId,
      refType: 'assignment',
      read: false,
      createdAt: new Date().toISOString()
    }));

    setNotifications(prev => [...newNotifs, ...prev]);
    showToast(`Reminder sent to ${pendingStudentIds.length} pending student(s)`, 'success');
  };

  const addDiscussionComment = (assignmentId: string, content: string) => {
    const clean = content.trim();
    if (!clean) return;

    const newComm: DiscussionComment = {
      id: 'comm-' + Date.now(),
      assignmentId,
      authorId: currentUser.id,
      authorName: currentUser.name,
      authorRole: currentUser.role,
      content: clean,
      createdAt: new Date().toISOString()
    };

    setDiscussions(prev => [...prev, newComm]);
  };

  // Attendance Actions
  const takeAttendance = (data: { subject: string; date: string; topic?: string; conductedBy?: string; records: AttendanceRecord[] }) => {
    const newSession: AttendanceSession = {
      id: 'att-' + Date.now(),
      classId: currentClass.id,
      date: data.date,
      subject: data.subject,
      topic: data.topic || 'Class Lecture',
      conductedBy: data.conductedBy || currentUser.name,
      records: data.records,
      createdAt: new Date().toISOString()
    };

    setAttendanceSessions(prev => [newSession, ...prev]);

    // Check for defaulters below 75%
    const absentees = data.records.filter(r => r.status === 'absent');
    if (absentees.length > 0) {
      const absentNotifs: NotificationItem[] = absentees.map(a => ({
        id: 'notif-att-' + a.studentId + '-' + Date.now(),
        userId: a.studentId,
        type: 'attendance',
        title: 'Attendance Alert',
        content: `Marked absent for ${data.subject} on ${data.date}. Keep attendance above 75% to avoid defaulter list.`,
        refType: 'attendance',
        read: false,
        createdAt: new Date().toISOString()
      }));
      setNotifications(prev => [...absentNotifs, ...prev]);
    }

    showToast(`Attendance recorded for ${data.records.length} students in ${data.subject}`, 'success');
  };

  const deleteAttendanceSession = (sessionId: string) => {
    const previous = [...attendanceSessions];
    setAttendanceSessions(prev => prev.filter(s => s.id !== sessionId));
    showUndoToast('Attendance session deleted', () => {
      setAttendanceSessions(previous);
    });
  };

  // Resource Actions
  const uploadResource = (data: { title: string; subject: string; category: any; description: string; fileName: string; fileSize: string }) => {
    const newResource: ResourceItem = {
      id: 'res-' + Date.now(),
      classId: currentClass.id,
      title: data.title,
      subject: data.subject,
      category: data.category,
      description: data.description,
      fileName: data.fileName,
      fileSize: data.fileSize,
      fileUrl: '#',
      uploadedBy: currentUser.id,
      uploadedByName: currentUser.name + (currentUser.role === 'CR' ? ' (CR)' : ''),
      uploadedAt: new Date().toISOString(),
      downloadsCount: 0
    };

    setResources(prev => [newResource, ...prev]);
    showToast(`Resource "${data.title}" uploaded to library`, 'success');
  };

  const deleteResource = (resourceId: string) => {
    const previous = [...resources];
    setResources(prev => prev.filter(r => r.id !== resourceId));
    showUndoToast('Resource removed', () => {
      setResources(previous);
    });
  };

  const incrementResourceDownload = (resourceId: string) => {
    setResources(prev => prev.map(r => r.id === resourceId ? { ...r, downloadsCount: r.downloadsCount + 1 } : r));
    showToast('Download started', 'info');
  };

  // Polls Actions
  const createPoll = (data: { question: string; description?: string; options: string[]; expiresHours?: number }) => {
    const newPoll: ClassPoll = {
      id: 'poll-' + Date.now(),
      classId: currentClass.id,
      question: data.question,
      description: data.description,
      options: data.options.map((opt, i) => ({ id: `opt-${i + 1}`, text: opt, votes: [] })),
      createdBy: currentUser.id,
      createdByName: currentUser.name,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + (data.expiresHours || 24) * 3600 * 1000).toISOString(),
      isClosed: false
    };

    setPolls(prev => [newPoll, ...prev]);
    showToast(`Quick Poll created: "${data.question}"`, 'success');
  };

  const votePoll = (pollId: string, optionId: string) => {
    setPolls(prev => prev.map(p => {
      if (p.id === pollId) {
        const updatedOptions = p.options.map(opt => {
          const filteredVotes = opt.votes.filter(id => id !== currentUser.id);
          if (opt.id === optionId) {
            return { ...opt, votes: [...filteredVotes, currentUser.id] };
          }
          return { ...opt, votes: filteredVotes };
        });
        return { ...p, options: updatedOptions };
      }
      return p;
    }));
    showToast('Vote cast successfully!', 'success');
  };

  const closePoll = (pollId: string) => {
    setPolls(prev => prev.map(p => p.id === pollId ? { ...p, isClosed: true } : p));
    showToast('Poll closed for voting', 'info');
  };

  const removeStudent = (studentId: string) => {
    const stu = allUsers.find(u => u.id === studentId);
    setAllUsers(prev => prev.filter(u => u.id !== studentId));
    setSubmissions(prev => prev.filter(s => s.studentId !== studentId));
    if (selectedStudentId === studentId) {
      setSelectedStudentId(null);
    }
    showToast(`Student ${stu?.name || ''} removed from class`, 'info');
  };

  const regenerateClassCode = (): string => {
    const newCode = generateCode();
    setCurrentClass(prev => ({ ...prev, code: newCode }));
    setClasses(prev => prev.map(c => c.id === currentClass.id ? { ...c, code: newCode } : c));
    showToast(`New class code generated: ${newCode}`, 'info');
    return newCode;
  };

  const updateClassName = (name: string) => {
    const clean = name.trim().toUpperCase();
    if (!clean) return;
    setCurrentClass(prev => ({ ...prev, name: clean }));
    setClasses(prev => prev.map(c => c.id === currentClass.id ? { ...c, name: clean } : c));
    showToast('Class name updated', 'success');
  };

  const updateUserDisplayName = (name: string) => {
    const clean = name.trim();
    if (!clean) return;
    setCurrentUser(prev => ({ ...prev, name: clean }));
    setAllUsers(prev => prev.map(u => u.id === currentUser.id ? { ...u, name: clean } : u));
    showToast('Profile updated', 'success');
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    showToast('All notifications marked as read', 'info');
  };

  const toggleOffline = () => {
    setIsOffline(prev => {
      const next = !prev;
      if (next) {
        showToast('Simulated Offline mode active', 'info');
      } else {
        showToast('Back online — changes synchronized', 'success');
      }
      return next;
    });
  };

  const exportSubmissionsCSV = (assignmentId?: string) => {
    const targetAsg = assignmentId ? assignments.find(a => a.id === assignmentId) : assignments[0];
    const targetSubs = submissions.filter(s => !targetAsg || s.assignmentId === targetAsg.id);

    const headers = ['Student Name', 'Email', 'Assignment', 'Subject', 'Status', 'Grade Score', 'Grade Feedback', 'Submitted At', 'Submission Hash'];
    const rows = targetSubs.map(s => {
      const asg = assignments.find(a => a.id === s.assignmentId);
      return [
        escapeCSV(s.studentName),
        escapeCSV(s.studentEmail),
        escapeCSV(asg?.title || ''),
        escapeCSV(asg?.subject || ''),
        escapeCSV(s.status.toUpperCase()),
        escapeCSV(s.grade ? `${s.grade.score}/${s.grade.maxScore}` : 'Not Graded'),
        escapeCSV(s.grade?.feedback || ''),
        escapeCSV(s.submittedAt ? new Date(s.submittedAt).toLocaleString() : 'N/A'),
        escapeCSV(s.proof?.submissionHash || 'N/A')
      ].join(',');
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `StudySync_${currentClass.name}_Submissions_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast('Submission report exported to CSV', 'success');
  };

  const exportMembersCSV = () => {
    const headers = ['Name', 'Email', 'Role', 'Roll Number', 'Joined Date', 'Last Active'];
    const rows = allUsers.map(u => [
      escapeCSV(u.name),
      escapeCSV(u.email),
      escapeCSV(u.role),
      escapeCSV(u.rollNo || ''),
      escapeCSV(new Date(u.joinedAt).toLocaleDateString()),
      escapeCSV(u.lastActive)
    ].join(','));

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `StudySync_${currentClass.name}_Roster_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast('Class roster exported to CSV', 'success');
  };

  const exportAttendanceCSV = () => {
    const headers = ['Session Date', 'Subject', 'Topic', 'Student RollNo', 'Student Name', 'Attendance Status'];
    const rows: string[] = [];
    attendanceSessions.forEach(sess => {
      sess.records.forEach(rec => {
        rows.push([
          escapeCSV(sess.date),
          escapeCSV(sess.subject),
          escapeCSV(sess.topic || ''),
          escapeCSV(rec.rollNo),
          escapeCSV(rec.studentName),
          escapeCSV(rec.status.toUpperCase())
        ].join(','));
      });
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `StudySync_${currentClass.name}_Attendance_Report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast('Attendance report exported to CSV', 'success');
  };

  const leaveClass = () => {
    const leavingId = currentUser.id;
    // Use functional updates to avoid stale closure bugs
    setAllUsers(prev => prev.filter(u => u.id !== leavingId));
    setSubmissions(prev => prev.filter(s => s.studentId !== leavingId));
    // Find next user from current snapshot before mutation
    const nextUser = allUsers.find(u => u.id !== leavingId) || INITIAL_USERS[0];
    setCurrentUser(nextUser);
    showToast('You have left the class', 'info');
  };

  const resetDemoData = () => {
    // Only clear StudySync-owned keys — do NOT wipe unrelated localStorage entries
    clearStudySyncStorage();
    setClasses(INITIAL_CLASSES);
    setAllUsers(INITIAL_USERS);
    setCurrentUser(INITIAL_USERS[0]);
    setCurrentClass(INITIAL_CLASS);
    setAssignments(INITIAL_ASSIGNMENTS);
    setSubmissions(INITIAL_SUBMISSIONS);
    setBroadcasts(INITIAL_BROADCASTS);
    setMessages(INITIAL_MESSAGES);
    setNotifications(INITIAL_NOTIFICATIONS);
    setDiscussions(INITIAL_DISCUSSIONS);
    setAttendanceSessions(INITIAL_ATTENDANCE);
    setResources(INITIAL_RESOURCES);
    setPolls(INITIAL_POLLS);
    setActiveTab('dashboard');
    setSelectedAssignmentId(INITIAL_ASSIGNMENTS[0].id);
    setSelectedStudentId(INITIAL_USERS[1].id);
    setThemeAccentState('blue');
    showToast('Demo data reset to default MECH-3A state', 'info');
  };

  return (
    <StudySyncContext.Provider
      value={{
        currentUser,
        currentClass,
        classes,
        allUsers,
        assignments,
        submissions,
        broadcasts,
        messages,
        notifications,
        discussions,
        attendanceSessions,
        resources,
        polls,
        activeTab,
        selectedAssignmentId,
        selectedStudentId,
        selectedCalendarDate,
        isOffline,
        isRightPanelOpen,
        isNewAssignmentModalOpen,
        isSubmitDrawerOpen,
        isCommandPaletteOpen,
        isShortcutsOpen,
        isQRCodeOpen,
        activeTrustPage,
        themeAccent,
        toast,
        setActiveTab,
        setSelectedAssignmentId,
        setSelectedStudentId,
        setSelectedCalendarDate,
        setIsRightPanelOpen,
        setIsNewAssignmentModalOpen,
        setIsSubmitDrawerOpen,
        setIsCommandPaletteOpen,
        setIsShortcutsOpen,
        setIsQRCodeOpen,
        setActiveTrustPage,
        setThemeAccent,
        showToast,
        showUndoToast,
        switchRole,
        switchClass,
        archiveCurrentClass,
        transferCR,
        createClass,
        joinClass,
        createAssignment,
        submitAssignment,
        markAssignmentViewed,
        gradeSubmission,
        sendBroadcast,
        sendMessage,
        remindPendingStudents,
        addDiscussionComment,
        takeAttendance,
        deleteAttendanceSession,
        uploadResource,
        deleteResource,
        incrementResourceDownload,
        createPoll,
        votePoll,
        closePoll,
        removeStudent,
        regenerateClassCode,
        updateClassName,
        updateUserDisplayName,
        markNotificationRead,
        markAllNotificationsRead,
        toggleOffline,
        exportSubmissionsCSV,
        exportMembersCSV,
        exportAttendanceCSV,
        leaveClass,
        resetDemoData
      }}
    >
      {children}
    </StudySyncContext.Provider>
  );
};

export const useStudySync = (): StudySyncContextType => {
  const context = useContext(StudySyncContext);
  if (!context) {
    throw new Error('useStudySync must be used within a StudySyncProvider');
  }
  return context;
};
