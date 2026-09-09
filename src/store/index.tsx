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
  SubmissionProof
} from '../types';
import { 
  INITIAL_CLASS, 
  INITIAL_USERS, 
  INITIAL_ASSIGNMENTS, 
  INITIAL_SUBMISSIONS, 
  INITIAL_BROADCASTS, 
  INITIAL_MESSAGES, 
  INITIAL_NOTIFICATIONS, 
  INITIAL_DISCUSSIONS 
} from '../data/initialData';

interface StudySyncContextType {
  currentUser: User;
  currentClass: ClassGroup;
  allUsers: User[];
  assignments: Assignment[];
  submissions: Submission[];
  broadcasts: Broadcast[];
  messages: Message[];
  notifications: NotificationItem[];
  discussions: DiscussionComment[];
  activeTab: NavTab;
  selectedAssignmentId: string | null;
  selectedStudentId: string | null;
  selectedCalendarDate: string | null;
  isOffline: boolean;
  isRightPanelOpen: boolean;
  isNewAssignmentModalOpen: boolean;
  isSubmitDrawerOpen: boolean;
  toast: { message: string; type: 'success' | 'error' | 'info' } | null;
  
  // Setters & Nav
  setActiveTab: (tab: NavTab) => void;
  setSelectedAssignmentId: (id: string | null) => void;
  setSelectedStudentId: (id: string | null) => void;
  setSelectedCalendarDate: (date: string | null) => void;
  setIsRightPanelOpen: (open: boolean) => void;
  setIsNewAssignmentModalOpen: (open: boolean) => void;
  setIsSubmitDrawerOpen: (open: boolean) => void;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  
  // Actions
  switchRole: (role: UserRole, targetUserId?: string) => void;
  createClass: (name: string, crName: string, crEmail: string) => string;
  joinClass: (code: string, studentName: string, studentEmail: string) => { success: boolean; error?: string };
  createAssignment: (data: { title: string; subject: string; description: string; deadline: string; fileName?: string; fileSize?: string; notifyOnCreate: boolean }) => void;
  submitAssignment: (assignmentId: string, textResponse?: string, file?: { name: string; size: string }) => void;
  markAssignmentViewed: (assignmentId: string) => void;
  sendBroadcast: (content: string) => void;
  sendMessage: (content: string, recipientId: string | null, file?: { name: string }) => void;
  remindPendingStudents: (assignmentId: string) => void;
  addDiscussionComment: (assignmentId: string, content: string) => void;
  removeStudent: (studentId: string) => void;
  regenerateClassCode: () => string;
  updateClassName: (name: string) => void;
  updateUserDisplayName: (name: string) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  toggleOffline: () => void;
  exportSubmissionsCSV: (assignmentId?: string) => void;
  exportMembersCSV: () => void;
  leaveClass: () => void;
  resetDemoData: () => void;
}

const STORAGE_KEY_PREFIX = 'studysync_v1_';

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

const StudySyncContext = createContext<StudySyncContextType | undefined>(undefined);

export const StudySyncProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [allUsers, setAllUsers] = useState<User[]>(() => loadStorage('users', INITIAL_USERS));
  const [currentUser, setCurrentUser] = useState<User>(() => {
    const saved = loadStorage<User | null>('current_user', null);
    return saved || INITIAL_USERS[0];
  });
  const [currentClass, setCurrentClass] = useState<ClassGroup>(() => loadStorage('class', INITIAL_CLASS));
  const [assignments, setAssignments] = useState<Assignment[]>(() => loadStorage('assignments', INITIAL_ASSIGNMENTS));
  const [submissions, setSubmissions] = useState<Submission[]>(() => loadStorage('submissions', INITIAL_SUBMISSIONS));
  const [broadcasts, setBroadcasts] = useState<Broadcast[]>(() => loadStorage('broadcasts', INITIAL_BROADCASTS));
  const [messages, setMessages] = useState<Message[]>(() => loadStorage('messages', INITIAL_MESSAGES));
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => loadStorage('notifications', INITIAL_NOTIFICATIONS));
  const [discussions, setDiscussions] = useState<DiscussionComment[]>(() => loadStorage('discussions', INITIAL_DISCUSSIONS));

  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  const [selectedAssignmentId, setSelectedAssignmentId] = useState<string | null>(assignments[0]?.id || null);
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(allUsers.find(u => u.role === 'Student')?.id || null);
  const [selectedCalendarDate, setSelectedCalendarDate] = useState<string | null>(new Date().toISOString().split('T')[0]);
  const [isOffline, setIsOffline] = useState<boolean>(false);
  const [isRightPanelOpen, setIsRightPanelOpen] = useState<boolean>(false);
  const [isNewAssignmentModalOpen, setIsNewAssignmentModalOpen] = useState<boolean>(false);
  const [isSubmitDrawerOpen, setIsSubmitDrawerOpen] = useState<boolean>(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  // Sync to local storage
  useEffect(() => saveStorage('users', allUsers), [allUsers]);
  useEffect(() => saveStorage('current_user', currentUser), [currentUser]);
  useEffect(() => saveStorage('class', currentClass), [currentClass]);
  useEffect(() => saveStorage('assignments', assignments), [assignments]);
  useEffect(() => saveStorage('submissions', submissions), [submissions]);
  useEffect(() => saveStorage('broadcasts', broadcasts), [broadcasts]);
  useEffect(() => saveStorage('messages', messages), [messages]);
  useEffect(() => saveStorage('notifications', notifications), [notifications]);
  useEffect(() => saveStorage('discussions', discussions), [discussions]);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
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

    setAllUsers([newCr]);
    setCurrentUser(newCr);
    setCurrentClass(newClass);
    setAssignments([]);
    setSubmissions([]);
    setBroadcasts([
      {
        id: 'bc-init-' + Date.now(),
        classId: newClassId,
        content: `Welcome to ${newClass.name}! Join code is ${code}. Official class updates and assignments will be coordinated here.`,
        sentAt: new Date().toISOString(),
        sentBy: newCrId,
        authorName: crName,
        deliveredCount: 1,
        isPinned: true,
        readBy: []
      }
    ]);
    setMessages([
      {
        id: 'msg-init-' + Date.now(),
        classId: newClassId,
        senderId: newCrId,
        senderName: crName,
        senderRole: 'CR',
        recipientId: null,
        content: `Class room ${newClass.name} created. End-to-end encrypted messaging channel is active.`,
        sentAt: new Date().toISOString(),
        readBy: [],
        isEncrypted: true
      }
    ]);
    setNotifications([
      {
        id: 'notif-init-' + Date.now(),
        userId: newCrId,
        type: 'system',
        title: 'Class Created',
        content: `Class ${newClass.name} created successfully. Share code ${code} with your students.`,
        read: false,
        createdAt: new Date().toISOString()
      }
    ]);
    setActiveTab('dashboard');
    showToast(`Class created! Class code: ${code}`, 'success');
    return code;
  };

  const joinClass = (code: string, studentName: string, studentEmail: string): { success: boolean; error?: string } => {
    const cleanCode = code.trim().toUpperCase();
    if (cleanCode !== currentClass.code) {
      return { success: false, error: 'Code not found. Check with your CR.' };
    }

    const newStudentId = 'user-stu-' + Date.now();
    const newStudent: User = {
      id: newStudentId,
      name: studentName,
      email: studentEmail,
      role: 'Student',
      classId: currentClass.id,
      joinedAt: new Date().toISOString(),
      rollNo: `23ME${Math.floor(100 + Math.random() * 899)}`,
      lastActive: 'Just now',
      device: 'Mobile Browser'
    };

    setAllUsers(prev => [...prev, newStudent]);
    setCurrentUser(newStudent);

    // Auto-create assigned submissions for existing active assignments
    const newSubs: Submission[] = assignments.map(asg => ({
      id: `sub-${asg.id}-${newStudentId}`,
      assignmentId: asg.id,
      studentId: newStudentId,
      studentName: studentName,
      studentEmail: studentEmail,
      status: 'assigned'
    }));

    setSubmissions(prev => [...prev, ...newSubs]);
    setNotifications(prev => [
      {
        id: 'notif-join-' + Date.now(),
        userId: newStudentId,
        type: 'system',
        title: 'Joined Class',
        content: `You have joined ${currentClass.name}. All active assignments are synced.`,
        read: false,
        createdAt: new Date().toISOString()
      },
      ...prev
    ]);

    setActiveTab('dashboard');
    showToast(`Successfully joined ${currentClass.name}!`, 'success');
    return { success: true };
  };

  const createAssignment = (data: { 
    title: string; 
    subject: string; 
    description: string; 
    deadline: string; 
    fileName?: string; 
    fileSize?: string; 
    notifyOnCreate: boolean 
  }) => {
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
      notifyOnCreate: data.notifyOnCreate
    };

    // Auto generate 'assigned' submissions for all current students
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
    const proof: SubmissionProof = {
      os: navigator.platform || 'Desktop Client',
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
    
    // Create notifications for CR and Student
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

    const studentNotif: NotificationItem = {
      id: 'notif-sub-stu-' + Date.now(),
      userId: currentUser.id,
      type: 'submission',
      title: 'Submission Confirmed',
      content: `Your submission for ${targetAsg?.title || 'Assignment'} was logged securely.`,
      refId: assignmentId,
      refType: 'assignment',
      read: false,
      createdAt: isoTime
    };

    setNotifications(prev => [crNotif, studentNotif, ...prev]);
    setIsSubmitDrawerOpen(false);
    showToast('Assignment submitted successfully with tamper-evident proof!', 'success');
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
      content: `CR Announcement: ${clean.substring(0, 90)}${clean.length > 90 ? '...' : ''}`,
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
    setCurrentClass(prev => ({
      ...prev,
      code: newCode
    }));
    showToast(`New class code generated: ${newCode}`, 'info');
    return newCode;
  };

  const updateClassName = (name: string) => {
    const clean = name.trim().toUpperCase();
    if (!clean) return;
    setCurrentClass(prev => ({ ...prev, name: clean }));
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

    const headers = ['Student Name', 'Email', 'Assignment', 'Subject', 'Status', 'Submitted At', 'Submission Proof Hash'];
    const rows = targetSubs.map(s => {
      const asg = assignments.find(a => a.id === s.assignmentId);
      return [
        `"${s.studentName}"`,
        `"${s.studentEmail}"`,
        `"${asg?.title || ''}"`,
        `"${asg?.subject || ''}"`,
        `"${s.status.toUpperCase()}"`,
        `"${s.submittedAt ? new Date(s.submittedAt).toLocaleString() : 'N/A'}"`,
        `"${s.proof?.submissionHash || 'N/A'}"`
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
      `"${u.name}"`,
      `"${u.email}"`,
      `"${u.role}"`,
      `"${u.rollNo || ''}"`,
      `"${new Date(u.joinedAt).toLocaleDateString()}"`,
      `"${u.lastActive}"`
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

  const leaveClass = () => {
    setAllUsers(prev => prev.filter(u => u.id !== currentUser.id));
    setSubmissions(prev => prev.filter(s => s.studentId !== currentUser.id));
    const nextUser = allUsers.find(u => u.id !== currentUser.id) || INITIAL_USERS[0];
    setCurrentUser(nextUser);
    showToast('You have left the class', 'info');
  };

  const resetDemoData = () => {
    localStorage.clear();
    setAllUsers(INITIAL_USERS);
    setCurrentUser(INITIAL_USERS[0]);
    setCurrentClass(INITIAL_CLASS);
    setAssignments(INITIAL_ASSIGNMENTS);
    setSubmissions(INITIAL_SUBMISSIONS);
    setBroadcasts(INITIAL_BROADCASTS);
    setMessages(INITIAL_MESSAGES);
    setNotifications(INITIAL_NOTIFICATIONS);
    setDiscussions(INITIAL_DISCUSSIONS);
    setActiveTab('dashboard');
    setSelectedAssignmentId(INITIAL_ASSIGNMENTS[0].id);
    setSelectedStudentId(INITIAL_USERS[1].id);
    showToast('Demo data reset to default MECH-3A state', 'info');
  };

  return (
    <StudySyncContext.Provider
      value={{
        currentUser,
        currentClass,
        allUsers,
        assignments,
        submissions,
        broadcasts,
        messages,
        notifications,
        discussions,
        activeTab,
        selectedAssignmentId,
        selectedStudentId,
        selectedCalendarDate,
        isOffline,
        isRightPanelOpen,
        isNewAssignmentModalOpen,
        isSubmitDrawerOpen,
        toast,
        setActiveTab,
        setSelectedAssignmentId,
        setSelectedStudentId,
        setSelectedCalendarDate,
        setIsRightPanelOpen,
        setIsNewAssignmentModalOpen,
        setIsSubmitDrawerOpen,
        showToast,
        switchRole,
        createClass,
        joinClass,
        createAssignment,
        submitAssignment,
        markAssignmentViewed,
        sendBroadcast,
        sendMessage,
        remindPendingStudents,
        addDiscussionComment,
        removeStudent,
        regenerateClassCode,
        updateClassName,
        updateUserDisplayName,
        markNotificationRead,
        markAllNotificationsRead,
        toggleOffline,
        exportSubmissionsCSV,
        exportMembersCSV,
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
