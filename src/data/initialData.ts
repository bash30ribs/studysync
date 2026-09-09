import { User, ClassGroup, Assignment, Submission, Broadcast, Message, NotificationItem, DiscussionComment } from '../types';

export const INITIAL_CLASS: ClassGroup = {
  id: 'class-mech-3a',
  name: 'MECH-3A',
  code: '7F2K9Q',
  crId: 'user-cr-1',
  crName: 'Aarav Sharma',
  createdAt: '2026-08-01T09:00:00.000Z',
  subjects: [
    'Fluid Mechanics',
    'Applied Physics',
    'Engineering Graphics',
    'Thermodynamics',
    'Material Science',
    'Mathematics III'
  ]
};

export const INITIAL_USERS: User[] = [
  {
    id: 'user-cr-1',
    name: 'Aarav Sharma',
    email: 'aarav.sharma@college.edu',
    role: 'CR',
    classId: 'class-mech-3a',
    joinedAt: '2026-08-01T09:00:00.000Z',
    rollNo: '23ME001',
    lastActive: 'Just now',
    device: 'Linux / Chrome 124'
  },
  {
    id: 'user-stu-1',
    name: 'Ishan Patel',
    email: 'ishan.p@college.edu',
    role: 'Student',
    classId: 'class-mech-3a',
    joinedAt: '2026-08-02T10:15:00.000Z',
    rollNo: '23ME014',
    lastActive: '10 mins ago',
    device: 'macOS / Safari 17'
  },
  {
    id: 'user-stu-2',
    name: 'Neha Kulkarni',
    email: 'neha.k@college.edu',
    role: 'Student',
    classId: 'class-mech-3a',
    joinedAt: '2026-08-02T10:30:00.000Z',
    rollNo: '23ME028',
    lastActive: '15 mins ago',
    device: 'Windows 11 / Chrome 124'
  },
  {
    id: 'user-stu-3',
    name: 'Rohan Verma',
    email: 'rohan.v@college.edu',
    role: 'Student',
    classId: 'class-mech-3a',
    joinedAt: '2026-08-02T11:00:00.000Z',
    rollNo: '23ME042',
    lastActive: '1 hour ago',
    device: 'Android 14 / Chrome Mobile'
  },
  {
    id: 'user-stu-4',
    name: 'Priya Nair',
    email: 'priya.n@college.edu',
    role: 'Student',
    classId: 'class-mech-3a',
    joinedAt: '2026-08-02T11:45:00.000Z',
    rollNo: '23ME035',
    lastActive: '25 mins ago',
    device: 'iOS 17 / Mobile Safari'
  },
  {
    id: 'user-stu-5',
    name: 'Arjun Mehta',
    email: 'arjun.m@college.edu',
    role: 'Student',
    classId: 'class-mech-3a',
    joinedAt: '2026-08-03T09:20:00.000Z',
    rollNo: '23ME009',
    lastActive: '2 hours ago',
    device: 'Windows 10 / Firefox 125'
  },
  {
    id: 'user-stu-6',
    name: 'Sana Qureshi',
    email: 'sana.q@college.edu',
    role: 'Student',
    classId: 'class-mech-3a',
    joinedAt: '2026-08-03T10:05:00.000Z',
    rollNo: '23ME051',
    lastActive: '5 mins ago',
    device: 'macOS / Chrome 124'
  },
  {
    id: 'user-stu-7',
    name: 'Vikram Desai',
    email: 'vikram.d@college.edu',
    role: 'Student',
    classId: 'class-mech-3a',
    joinedAt: '2026-08-03T11:30:00.000Z',
    rollNo: '23ME019',
    lastActive: 'Yesterday',
    device: 'Windows 11 / Edge 124'
  },
  {
    id: 'user-stu-8',
    name: 'Tanvi Joshi',
    email: 'tanvi.j@college.edu',
    role: 'Student',
    classId: 'class-mech-3a',
    joinedAt: '2026-08-04T08:50:00.000Z',
    rollNo: '23ME058',
    lastActive: '3 hours ago',
    device: 'iOS 17 / Chrome Mobile'
  },
  {
    id: 'user-stu-9',
    name: 'Kavya Reddy',
    email: 'kavya.r@college.edu',
    role: 'Student',
    classId: 'class-mech-3a',
    joinedAt: '2026-08-04T12:10:00.000Z',
    rollNo: '23ME022',
    lastActive: '30 mins ago',
    device: 'Android 14 / Firefox Mobile'
  },
  {
    id: 'user-stu-10',
    name: 'Aditya Rao',
    email: 'aditya.r@college.edu',
    role: 'Student',
    classId: 'class-mech-3a',
    joinedAt: '2026-08-05T09:15:00.000Z',
    rollNo: '23ME005',
    lastActive: '3 days ago',
    device: 'Windows 11 / Chrome 124'
  }
];

const now = new Date();
const todayMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 0).toISOString();
const fridayDeadline = new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000).toISOString();
const pastDeadline = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString();
const nextWeekDeadline = new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000).toISOString();

export const INITIAL_ASSIGNMENTS: Assignment[] = [
  {
    id: 'asg-1',
    classId: 'class-mech-3a',
    title: 'Fluid Mechanics Assignment 2',
    subject: 'Fluid Mechanics',
    description: 'Solve problems 4.1 to 4.8 from Section 4 (Bernoulli Equation & Venturimeter dynamics). Provide clean step-by-step free body diagrams and dimensional verification for each derivation.',
    fileName: 'FM_Assgn_2_Problems.pdf',
    fileSize: '2.4 MB',
    fileUrl: '#',
    deadline: todayMidnight,
    postedAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    createdBy: 'Aarav Sharma',
    status: 'active',
    notifyOnCreate: true
  },
  {
    id: 'asg-2',
    title: 'Physics Lab Report — Unit 4',
    classId: 'class-mech-3a',
    subject: 'Applied Physics',
    description: 'Submit experimental readings and calculated error percentage for the Michelson Interferometer lab session. Include tabular comparisons of standard vs observed wavelength values.',
    fileName: 'Physics_Lab_Format_Template.docx',
    fileSize: '1.1 MB',
    fileUrl: '#',
    deadline: fridayDeadline,
    postedAt: new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    createdBy: 'Aarav Sharma',
    status: 'active',
    notifyOnCreate: true
  },
  {
    id: 'asg-3',
    title: 'Engineering Drawing Sheet 5',
    classId: 'class-mech-3a',
    subject: 'Engineering Graphics',
    description: 'Orthographic projections of isometric component with auxiliary views. Must strictly adhere to first angle projection standard with title block formatting.',
    fileName: 'Isometric_Component_Drawing.dwg',
    fileSize: '4.8 MB',
    fileUrl: '#',
    deadline: pastDeadline,
    postedAt: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    createdBy: 'Aarav Sharma',
    status: 'closed',
    notifyOnCreate: true
  },
  {
    id: 'asg-4',
    title: 'Thermodynamics Problem Set 3',
    classId: 'class-mech-3a',
    subject: 'Thermodynamics',
    description: 'Second Law analysis and Rankine cycle efficiency computation with reheat and regeneration loops. Graph T-s and P-h state plots accurately.',
    fileName: 'Thermo_Problem_Set_3.pdf',
    fileSize: '1.8 MB',
    fileUrl: '#',
    deadline: nextWeekDeadline,
    postedAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    createdBy: 'Aarav Sharma',
    status: 'active',
    notifyOnCreate: true
  }
];

export const INITIAL_SUBMISSIONS: Submission[] = [
  // Assignment 1 (Fluid Mechanics)
  {
    id: 'sub-1-1',
    assignmentId: 'asg-1',
    studentId: 'user-stu-1',
    studentName: 'Ishan Patel',
    studentEmail: 'ishan.p@college.edu',
    status: 'submitted',
    submittedAt: new Date(now.getTime() - 4 * 60 * 60 * 1000).toISOString(),
    viewedAt: new Date(now.getTime() - 12 * 60 * 60 * 1000).toISOString(),
    textResponse: 'Completed all 8 derivations with Bernoulli equations.',
    fileName: 'Ishan_Patel_FM_Assgn2.pdf',
    fileSize: '3.2 MB',
    proof: {
      os: 'macOS 14.4',
      browser: 'Safari 17.4',
      submissionHash: 'a7f92b0c3d4e1f82c3b4a5e6d7f80912',
      timestamp: new Date(now.getTime() - 4 * 60 * 60 * 1000).toISOString()
    }
  },
  {
    id: 'sub-1-2',
    assignmentId: 'asg-1',
    studentId: 'user-stu-2',
    studentName: 'Neha Kulkarni',
    studentEmail: 'neha.k@college.edu',
    status: 'submitted',
    submittedAt: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString(),
    viewedAt: new Date(now.getTime() - 6 * 60 * 60 * 1000).toISOString(),
    textResponse: 'Verified dimensional consistency on page 4.',
    fileName: 'Neha_Kulkarni_FM_A2.pdf',
    fileSize: '2.8 MB',
    proof: {
      os: 'Windows 11',
      browser: 'Chrome 124.0',
      submissionHash: 'b8e10c4d2e5f6a91d4c5b6f7e8a91023',
      timestamp: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString()
    }
  },
  {
    id: 'sub-1-3',
    assignmentId: 'asg-1',
    studentId: 'user-stu-3',
    studentName: 'Rohan Verma',
    studentEmail: 'rohan.v@college.edu',
    status: 'viewed',
    viewedAt: new Date(now.getTime() - 1 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'sub-1-4',
    assignmentId: 'asg-1',
    studentId: 'user-stu-4',
    studentName: 'Priya Nair',
    studentEmail: 'priya.n@college.edu',
    status: 'submitted',
    submittedAt: new Date(now.getTime() - 30 * 60 * 1000).toISOString(),
    viewedAt: new Date(now.getTime() - 5 * 60 * 60 * 1000).toISOString(),
    textResponse: 'Attached handwritten scan in PDF.',
    fileName: 'Priya_Nair_FM2.pdf',
    fileSize: '4.1 MB',
    proof: {
      os: 'iOS 17.4',
      browser: 'Mobile Safari',
      submissionHash: 'c9f21d5e3f6a7b02e5d6c7a8f9b02134',
      timestamp: new Date(now.getTime() - 30 * 60 * 1000).toISOString()
    }
  },
  {
    id: 'sub-1-5',
    assignmentId: 'asg-1',
    studentId: 'user-stu-5',
    studentName: 'Arjun Mehta',
    studentEmail: 'arjun.m@college.edu',
    status: 'assigned'
  },
  {
    id: 'sub-1-6',
    assignmentId: 'asg-1',
    studentId: 'user-stu-6',
    studentName: 'Sana Qureshi',
    studentEmail: 'sana.q@college.edu',
    status: 'submitted',
    submittedAt: new Date(now.getTime() - 10 * 60 * 1000).toISOString(),
    viewedAt: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString(),
    fileName: 'Sana_Qureshi_FM_Report.pdf',
    fileSize: '3.0 MB',
    proof: {
      os: 'macOS 14.3',
      browser: 'Chrome 124.0',
      submissionHash: 'd0a32e6f4a7b8c13f6e7d8b9a0c13245',
      timestamp: new Date(now.getTime() - 10 * 60 * 1000).toISOString()
    }
  },
  {
    id: 'sub-1-7',
    assignmentId: 'asg-1',
    studentId: 'user-stu-7',
    studentName: 'Vikram Desai',
    studentEmail: 'vikram.d@college.edu',
    status: 'assigned'
  },
  {
    id: 'sub-1-8',
    assignmentId: 'asg-1',
    studentId: 'user-stu-8',
    studentName: 'Tanvi Joshi',
    studentEmail: 'tanvi.j@college.edu',
    status: 'viewed',
    viewedAt: new Date(now.getTime() - 45 * 60 * 1000).toISOString()
  },
  {
    id: 'sub-1-9',
    assignmentId: 'asg-1',
    studentId: 'user-stu-9',
    studentName: 'Kavya Reddy',
    studentEmail: 'kavya.r@college.edu',
    status: 'assigned'
  },
  {
    id: 'sub-1-10',
    assignmentId: 'asg-1',
    studentId: 'user-stu-10',
    studentName: 'Aditya Rao',
    studentEmail: 'aditya.r@college.edu',
    status: 'assigned'
  },

  // Assignment 2 (Physics Lab Report)
  {
    id: 'sub-2-1',
    assignmentId: 'asg-2',
    studentId: 'user-stu-1',
    studentName: 'Ishan Patel',
    studentEmail: 'ishan.p@college.edu',
    status: 'submitted',
    submittedAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    viewedAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    fileName: 'Ishan_Physics_Lab_4.docx',
    fileSize: '1.4 MB',
    proof: {
      os: 'macOS 14.4',
      browser: 'Safari 17.4',
      submissionHash: 'e1b43f7a5b8c9d24a7f8e9c0b1d24356',
      timestamp: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString()
    }
  },
  {
    id: 'sub-2-2',
    assignmentId: 'asg-2',
    studentId: 'user-stu-2',
    studentName: 'Neha Kulkarni',
    studentEmail: 'neha.k@college.edu',
    status: 'submitted',
    submittedAt: new Date(now.getTime() - 18 * 60 * 60 * 1000).toISOString(),
    viewedAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    fileName: 'Neha_Applied_Physics_Lab4.docx',
    fileSize: '1.2 MB',
    proof: {
      os: 'Windows 11',
      browser: 'Chrome 124.0',
      submissionHash: 'f2c54a8b6c9d0e35b8a9f0d1c2e35467',
      timestamp: new Date(now.getTime() - 18 * 60 * 60 * 1000).toISOString()
    }
  },
  {
    id: 'sub-2-3',
    assignmentId: 'asg-2',
    studentId: 'user-stu-3',
    studentName: 'Rohan Verma',
    studentEmail: 'rohan.v@college.edu',
    status: 'submitted',
    submittedAt: new Date(now.getTime() - 12 * 60 * 60 * 1000).toISOString(),
    viewedAt: new Date(now.getTime() - 20 * 60 * 60 * 1000).toISOString(),
    fileName: 'Rohan_Verma_Physics_Lab.pdf',
    fileSize: '1.9 MB',
    proof: {
      os: 'Android 14',
      browser: 'Chrome Mobile',
      submissionHash: '03d65b9c7d0e1f46c9b0a1e2d3f46578',
      timestamp: new Date(now.getTime() - 12 * 60 * 60 * 1000).toISOString()
    }
  },
  {
    id: 'sub-2-4',
    assignmentId: 'asg-2',
    studentId: 'user-stu-4',
    studentName: 'Priya Nair',
    studentEmail: 'priya.n@college.edu',
    status: 'submitted',
    submittedAt: new Date(now.getTime() - 8 * 60 * 60 * 1000).toISOString(),
    viewedAt: new Date(now.getTime() - 16 * 60 * 60 * 1000).toISOString(),
    fileName: 'Priya_Nair_Lab4.docx',
    fileSize: '1.1 MB',
    proof: {
      os: 'iOS 17.4',
      browser: 'Mobile Safari',
      submissionHash: '14e76c0d8e1f2a57d0c1b2f3e4a57689',
      timestamp: new Date(now.getTime() - 8 * 60 * 60 * 1000).toISOString()
    }
  },

  // Assignment 3 (Engineering Drawing - Closed)
  {
    id: 'sub-3-1',
    assignmentId: 'asg-3',
    studentId: 'user-stu-1',
    studentName: 'Ishan Patel',
    studentEmail: 'ishan.p@college.edu',
    status: 'submitted',
    submittedAt: pastDeadline,
    fileName: 'Ishan_Sheet5.dwg',
    proof: {
      os: 'macOS 14.4',
      browser: 'Safari 17.4',
      submissionHash: '25f87d1e9f2a3b68e1d2c3a4f5b68790',
      timestamp: pastDeadline
    }
  },
  {
    id: 'sub-3-2',
    assignmentId: 'asg-3',
    studentId: 'user-stu-2',
    studentName: 'Neha Kulkarni',
    studentEmail: 'neha.k@college.edu',
    status: 'submitted',
    submittedAt: pastDeadline,
    fileName: 'Neha_Sheet5.dwg',
    proof: {
      os: 'Windows 11',
      browser: 'Chrome 124.0',
      submissionHash: '36a98e2f0a3b4c79f2e3d4b5a6c79801',
      timestamp: pastDeadline
    }
  }
];

export const INITIAL_BROADCASTS: Broadcast[] = [
  {
    id: 'bc-1',
    classId: 'class-mech-3a',
    content: 'Fee submission deadline has been extended to this Friday. Original deadline was Wednesday. Please confirm by replying in the class channel.',
    sentAt: new Date(now.getTime() - 3 * 60 * 60 * 1000).toISOString(),
    sentBy: 'user-cr-1',
    authorName: 'Aarav Sharma',
    deliveredCount: 32,
    isPinned: true,
    readBy: ['user-stu-1', 'user-stu-2', 'user-stu-4', 'user-stu-6']
  },
  {
    id: 'bc-2',
    classId: 'class-mech-3a',
    content: 'Attendance tomorrow is compulsory for the Industry Guest Lecture on Turbo-Machinery. Proxy will result in a formal complaint to the HOD.',
    sentAt: new Date(now.getTime() - 26 * 60 * 60 * 1000).toISOString(),
    sentBy: 'user-cr-1',
    authorName: 'Aarav Sharma',
    deliveredCount: 32,
    isPinned: false,
    readBy: ['user-stu-1', 'user-stu-2', 'user-stu-3', 'user-stu-4', 'user-stu-5', 'user-stu-6', 'user-stu-8']
  },
  {
    id: 'bc-3',
    classId: 'class-mech-3a',
    content: 'Internal Assessment Schedule for next week has been released by Dean Office. Check dates in calendar.',
    sentAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    sentBy: 'user-cr-1',
    authorName: 'Aarav Sharma',
    deliveredCount: 32,
    isPinned: false,
    readBy: ['user-stu-1', 'user-stu-2', 'user-stu-3', 'user-stu-4', 'user-stu-5', 'user-stu-6', 'user-stu-7', 'user-stu-8', 'user-stu-9']
  }
];

export const INITIAL_MESSAGES: Message[] = [
  {
    id: 'msg-1',
    classId: 'class-mech-3a',
    senderId: 'user-cr-1',
    senderName: 'Aarav Sharma',
    senderRole: 'CR',
    recipientId: null,
    content: 'Please make sure all Fluid Mechanics submissions include the units in question 4.3 or Professor Rao will deduct 2 marks.',
    sentAt: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString(),
    readBy: ['user-stu-1', 'user-stu-2', 'user-stu-4'],
    isEncrypted: true
  },
  {
    id: 'msg-2',
    classId: 'class-mech-3a',
    senderId: 'user-stu-2',
    senderName: 'Neha Kulkarni',
    senderRole: 'Student',
    recipientId: null,
    content: 'Noted Aarav. Are we allowed to submit handwritten scans for the derivations?',
    sentAt: new Date(now.getTime() - 110 * 60 * 1000).toISOString(),
    readBy: ['user-cr-1', 'user-stu-1', 'user-stu-4'],
    isEncrypted: true
  },
  {
    id: 'msg-3',
    classId: 'class-mech-3a',
    senderId: 'user-cr-1',
    senderName: 'Aarav Sharma',
    senderRole: 'CR',
    recipientId: null,
    content: 'Yes, clear PDF scans with high contrast are completely accepted.',
    sentAt: new Date(now.getTime() - 95 * 60 * 1000).toISOString(),
    readBy: ['user-stu-1', 'user-stu-2', 'user-stu-4'],
    isEncrypted: true
  },
  {
    id: 'msg-4',
    classId: 'class-mech-3a',
    senderId: 'user-stu-1',
    senderName: 'Ishan Patel',
    senderRole: 'Student',
    recipientId: null,
    content: 'Just uploaded mine. Thanks for clarifying.',
    sentAt: new Date(now.getTime() - 60 * 60 * 1000).toISOString(),
    readBy: ['user-cr-1', 'user-stu-2'],
    isEncrypted: true
  },
  // Direct Messages between Student (Ishan) and CR (Aarav)
  {
    id: 'msg-dm-1',
    classId: 'class-mech-3a',
    senderId: 'user-stu-1',
    senderName: 'Ishan Patel',
    senderRole: 'Student',
    recipientId: 'user-cr-1',
    content: 'Hi Aarav, can I request an exemption for the Thermo test due to the varsity basketball tournament?',
    sentAt: new Date(now.getTime() - 5 * 60 * 60 * 1000).toISOString(),
    readBy: ['user-cr-1'],
    isEncrypted: true
  },
  {
    id: 'msg-dm-2',
    classId: 'class-mech-3a',
    senderId: 'user-cr-1',
    senderName: 'Aarav Sharma',
    senderRole: 'CR',
    recipientId: 'user-stu-1',
    content: 'Send me the official sports department letter by today evening, and I will forward it to the faculty advisor.',
    sentAt: new Date(now.getTime() - 4 * 60 * 60 * 1000).toISOString(),
    readBy: ['user-stu-1'],
    isEncrypted: true
  }
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    userId: 'ALL',
    type: 'broadcast',
    title: 'Class Broadcast',
    content: 'CR: Fee submission deadline has been extended to this Friday.',
    refId: 'bc-1',
    refType: 'broadcast',
    read: false,
    createdAt: new Date(now.getTime() - 3 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'notif-2',
    userId: 'user-stu-3',
    type: 'reminder',
    title: 'Submission Reminder',
    content: 'Reminder: You have not submitted Fluid Mechanics Assignment 2 — due today.',
    refId: 'asg-1',
    refType: 'assignment',
    read: false,
    createdAt: new Date(now.getTime() - 1 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'notif-3',
    userId: 'ALL',
    type: 'assignment',
    title: 'New Assignment Posted',
    content: 'Thermodynamics Problem Set 3 — due in 5 days.',
    refId: 'asg-4',
    refType: 'assignment',
    read: false,
    createdAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'notif-4',
    userId: 'user-cr-1',
    type: 'submission',
    title: 'Submission Received',
    content: 'Priya Nair submitted Fluid Mechanics Assignment 2.',
    refId: 'asg-1',
    refType: 'assignment',
    read: true,
    createdAt: new Date(now.getTime() - 30 * 60 * 1000).toISOString()
  }
];

export const INITIAL_DISCUSSIONS: DiscussionComment[] = [
  {
    id: 'comm-1',
    assignmentId: 'asg-1',
    authorId: 'user-stu-3',
    authorName: 'Rohan Verma',
    authorRole: 'Student',
    content: 'For Problem 4.4, are we assuming frictionless pipe flow or standard Darcy friction factor?',
    createdAt: new Date(now.getTime() - 3 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'comm-2',
    assignmentId: 'asg-1',
    authorId: 'user-cr-1',
    authorName: 'Aarav Sharma',
    authorRole: 'CR',
    content: 'Confirmed with Professor Rao: assume frictionless pipe flow unless roughness coefficient is explicitly provided.',
    createdAt: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'comm-3',
    assignmentId: 'asg-2',
    authorId: 'user-stu-2',
    authorName: 'Neha Kulkarni',
    authorRole: 'Student',
    content: 'Should we attach the original reading sheet signed by the lab instructor as an appendix?',
    createdAt: new Date(now.getTime() - 20 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'comm-4',
    assignmentId: 'asg-2',
    authorId: 'user-cr-1',
    authorName: 'Aarav Sharma',
    authorRole: 'CR',
    content: 'Yes, mandatory appendix on page 5.',
    createdAt: new Date(now.getTime() - 19 * 60 * 60 * 1000).toISOString()
  }
];
