import { 
  User, 
  ClassGroup, 
  Assignment, 
  Submission, 
  Broadcast, 
  Message, 
  NotificationItem, 
  DiscussionComment,
  AttendanceSession,
  ResourceItem,
  ClassPoll,
  HolisticActivity,
  GrievanceConfidentialItem,
  FacultyAuditEntry
} from '../types';

export const INITIAL_CLASS: ClassGroup = {
  id: 'class-mech-3a',
  name: 'MECH-3A',
  code: '7F2K9Q',
  crId: 'user-cr-1',
  crName: 'Ribhav Sharma',
  createdAt: '2026-08-01T09:00:00.000Z',
  subjects: [
    'Fluid Mechanics',
    'Applied Physics',
    'Engineering Graphics',
    'Thermodynamics',
    'Material Science',
    'Mathematics III'
  ],
  subjectConfigs: {
    'Fluid Mechanics': {
      name: 'Fluid Mechanics',
      code: 'ME301',
      crStudentId: 'user-stu-1',
      crStudentName: 'Ishan Patel',
      facultyName: 'Dr. P. K. Rao',
      room: 'Hall 302',
      color: '#0EA5E9'
    },
    'Applied Physics': {
      name: 'Applied Physics',
      code: 'PH301',
      crStudentId: 'user-stu-2',
      crStudentName: 'Neha Kulkarni',
      facultyName: 'Dr. Meenakshi S.',
      room: 'Physics Lab 1',
      color: '#8B5CF6'
    },
    'Engineering Graphics': {
      name: 'Engineering Graphics',
      code: 'ME302',
      crStudentId: 'user-stu-3',
      crStudentName: 'Rohan Verma',
      facultyName: 'Prof. K. N. Murthy',
      room: 'CAD Suite B',
      color: '#10B981'
    },
    'Thermodynamics': {
      name: 'Thermodynamics',
      code: 'ME303',
      crStudentId: 'user-stu-4',
      crStudentName: 'Priya Sharma',
      facultyName: 'Dr. A. Sengupta',
      room: 'Lecture Hall 2',
      color: '#F59E0B'
    },
    'Material Science': {
      name: 'Material Science',
      code: 'ME304',
      crStudentId: 'user-stu-5',
      crStudentName: 'Aditya Nair',
      facultyName: 'Dr. V. Deshmukh',
      room: 'Metallurgy Hall',
      color: '#F43F5E'
    },
    'Mathematics III': {
      name: 'Mathematics III',
      code: 'MA301',
      crStudentId: 'user-stu-6',
      crStudentName: 'Tanvi Joshi',
      facultyName: 'Prof. S. Banerjee',
      room: 'Seminar Room 4',
      color: '#0095F6'
    }
  }
};

export const INITIAL_USERS: User[] = [
  {
    id: 'user-cr-1',
    name: 'Ribhav Sharma',
    email: 'ribhav.cr@college.edu',
    role: 'CR',
    classId: 'class-mech-3a',
    joinedAt: '2026-08-01T09:00:00.000Z',
    rollNo: '23ME001',
    lastActive: 'Just now',
    device: 'Linux / Chrome 124',
    holisticPoints: 185
  },
  {
    id: 'user-fac-1',
    name: 'Dr. Meenakshi Sundaram',
    email: 'm.sundaram@college.edu',
    role: 'Faculty',
    classId: 'class-mech-3a',
    joinedAt: '2026-07-15T08:00:00.000Z',
    designation: 'Professor & Core Faculty Incharge',
    department: 'Mechanical Engineering & Academic Dean Office',
    officeRoom: 'Tech Block 3, Room 412',
    lastActive: 'Active now',
    device: 'macOS / Safari 17.5'
  },
  {
    id: 'user-stu-1',
    name: 'Ishan Patel',
    email: 'ishan.p@college.edu',
    role: 'Student',
    classId: 'class-mech-3a',
    joinedAt: '2026-08-02T10:15:00.000Z',
    rollNo: '23ME002',
    lastActive: '10 mins ago',
    device: 'macOS / Safari 17',
    holisticPoints: 180
  },
  {
    id: 'user-stu-2',
    name: 'Neha Kulkarni',
    email: 'neha.k@college.edu',
    role: 'Student',
    classId: 'class-mech-3a',
    joinedAt: '2026-08-02T10:30:00.000Z',
    rollNo: '23ME003',
    lastActive: '15 mins ago',
    device: 'Windows 11 / Chrome 124',
    holisticPoints: 210
  },
  {
    id: 'user-stu-3',
    name: 'Rohan Verma',
    email: 'rohan.v@college.edu',
    role: 'Student',
    classId: 'class-mech-3a',
    joinedAt: '2026-08-02T11:00:00.000Z',
    rollNo: '23ME004',
    lastActive: '1 hour ago',
    device: 'Android 14 / Chrome Mobile',
    holisticPoints: 140
  },
  {
    id: 'user-stu-4',
    name: 'Priya Nair',
    email: 'priya.n@college.edu',
    role: 'Student',
    classId: 'class-mech-3a',
    joinedAt: '2026-08-02T11:45:00.000Z',
    rollNo: '23ME005',
    lastActive: '25 mins ago',
    device: 'iOS 17 / Mobile Safari',
    holisticPoints: 260
  },
  {
    id: 'user-stu-5',
    name: 'Arjun Mehta',
    email: 'arjun.m@college.edu',
    role: 'Student',
    classId: 'class-mech-3a',
    joinedAt: '2026-08-03T09:20:00.000Z',
    rollNo: '23ME006',
    lastActive: '2 hours ago',
    device: 'Windows 10 / Firefox 125',
    holisticPoints: 110
  },
  {
    id: 'user-stu-6',
    name: 'Sana Qureshi',
    email: 'sana.q@college.edu',
    role: 'Student',
    classId: 'class-mech-3a',
    joinedAt: '2026-08-03T10:05:00.000Z',
    rollNo: '23ME007',
    lastActive: '5 mins ago',
    device: 'macOS / Chrome 124',
    holisticPoints: 195
  },
  {
    id: 'user-stu-7',
    name: 'Vikram Desai',
    email: 'vikram.d@college.edu',
    role: 'Student',
    classId: 'class-mech-3a',
    joinedAt: '2026-08-03T11:30:00.000Z',
    rollNo: '23ME008',
    lastActive: 'Yesterday',
    device: 'Windows 11 / Edge 124',
    holisticPoints: 90
  },
  {
    id: 'user-stu-8',
    name: 'Tanvi Joshi',
    email: 'tanvi.j@college.edu',
    role: 'Student',
    classId: 'class-mech-3a',
    joinedAt: '2026-08-04T08:50:00.000Z',
    rollNo: '23ME009',
    lastActive: '3 hours ago',
    device: 'iOS 17 / Chrome Mobile',
    holisticPoints: 225
  },
  {
    id: 'user-stu-9',
    name: 'Kavya Reddy',
    email: 'kavya.r@college.edu',
    role: 'Student',
    classId: 'class-mech-3a',
    joinedAt: '2026-08-04T12:10:00.000Z',
    rollNo: '23ME010',
    lastActive: '30 mins ago',
    device: 'Android 14 / Firefox Mobile',
    holisticPoints: 175
  },
  {
    id: 'user-stu-10',
    name: 'Aditya Rao',
    email: 'aditya.r@college.edu',
    role: 'Student',
    classId: 'class-mech-3a',
    joinedAt: '2026-08-05T09:15:00.000Z',
    rollNo: '23ME011',
    lastActive: '3 days ago',
    device: 'Windows 11 / Chrome 124',
    holisticPoints: 65
  },
  {
    id: 'user-stu-11',
    name: 'Ananya Deshmukh',
    email: 'ananya.d@college.edu',
    role: 'Student',
    classId: 'class-mech-3a',
    joinedAt: '2026-08-05T10:00:00.000Z',
    rollNo: '23ME012',
    lastActive: '12 mins ago',
    device: 'macOS / Chrome 124',
    holisticPoints: 240
  },
  {
    id: 'user-stu-12',
    name: 'Harsh Vardhan',
    email: 'harsh.v@college.edu',
    role: 'Student',
    classId: 'class-mech-3a',
    joinedAt: '2026-08-05T11:20:00.000Z',
    rollNo: '23ME013',
    lastActive: '45 mins ago',
    device: 'Windows 11 / Chrome 124',
    holisticPoints: 130
  },
  {
    id: 'user-stu-13',
    name: 'Sneha Nambiar',
    email: 'sneha.n@college.edu',
    role: 'Student',
    classId: 'class-mech-3a',
    joinedAt: '2026-08-05T12:00:00.000Z',
    rollNo: '23ME014',
    lastActive: '20 mins ago',
    device: 'iOS 17 / Safari',
    holisticPoints: 215
  },
  {
    id: 'user-stu-14',
    name: 'Kartik Iyer',
    email: 'kartik.i@college.edu',
    role: 'Student',
    classId: 'class-mech-3a',
    joinedAt: '2026-08-06T09:00:00.000Z',
    rollNo: '23ME015',
    lastActive: '1 hour ago',
    device: 'Android 14 / Brave',
    holisticPoints: 185
  },
  {
    id: 'user-stu-15',
    name: 'Pooja Hegde',
    email: 'pooja.h@college.edu',
    role: 'Student',
    classId: 'class-mech-3a',
    joinedAt: '2026-08-06T10:15:00.000Z',
    rollNo: '23ME016',
    lastActive: '4 hours ago',
    device: 'Windows 11 / Edge 124',
    holisticPoints: 160
  },
  {
    id: 'user-stu-16',
    name: 'Siddharth Ghosh',
    email: 'siddharth.g@college.edu',
    role: 'Student',
    classId: 'class-mech-3a',
    joinedAt: '2026-08-06T11:30:00.000Z',
    rollNo: '23ME017',
    lastActive: '8 mins ago',
    device: 'Linux / Firefox 125',
    holisticPoints: 280
  },
  {
    id: 'user-stu-17',
    name: 'Divya Pillai',
    email: 'divya.p@college.edu',
    role: 'Student',
    classId: 'class-mech-3a',
    joinedAt: '2026-08-06T13:40:00.000Z',
    rollNo: '23ME018',
    lastActive: '35 mins ago',
    device: 'macOS / Safari 17',
    holisticPoints: 190
  },
  {
    id: 'user-stu-18',
    name: 'Manav Malhotra',
    email: 'manav.m@college.edu',
    role: 'Student',
    classId: 'class-mech-3a',
    joinedAt: '2026-08-07T08:50:00.000Z',
    rollNo: '23ME019',
    lastActive: 'Yesterday',
    device: 'Windows 10 / Chrome 124',
    holisticPoints: 75
  },
  {
    id: 'user-stu-19',
    name: 'Ritu Sen',
    email: 'ritu.s@college.edu',
    role: 'Student',
    classId: 'class-mech-3a',
    joinedAt: '2026-08-07T09:30:00.000Z',
    rollNo: '23ME020',
    lastActive: '50 mins ago',
    device: 'Android 14 / Chrome Mobile',
    holisticPoints: 145
  },
  {
    id: 'user-stu-20',
    name: 'Varun Chawla',
    email: 'varun.c@college.edu',
    role: 'Student',
    classId: 'class-mech-3a',
    joinedAt: '2026-08-07T10:45:00.000Z',
    rollNo: '23ME021',
    lastActive: '2 hours ago',
    device: 'Windows 11 / Chrome 124',
    holisticPoints: 170
  },
  {
    id: 'user-stu-21',
    name: 'Shreya Mukherjee',
    email: 'shreya.m@college.edu',
    role: 'Student',
    classId: 'class-mech-3a',
    joinedAt: '2026-08-07T11:15:00.000Z',
    rollNo: '23ME022',
    lastActive: '15 mins ago',
    device: 'macOS / Chrome 124',
    holisticPoints: 230
  },
  {
    id: 'user-stu-22',
    name: 'Pranav Bhat',
    email: 'pranav.b@college.edu',
    role: 'Student',
    classId: 'class-mech-3a',
    joinedAt: '2026-08-08T09:00:00.000Z',
    rollNo: '23ME023',
    lastActive: '1 hour ago',
    device: 'iOS 17 / Safari',
    holisticPoints: 155
  },
  {
    id: 'user-stu-23',
    name: 'Meera Namboodiri',
    email: 'meera.n@college.edu',
    role: 'Student',
    classId: 'class-mech-3a',
    joinedAt: '2026-08-08T10:10:00.000Z',
    rollNo: '23ME024',
    lastActive: '25 mins ago',
    device: 'macOS / Safari 17',
    holisticPoints: 200
  },
  {
    id: 'user-stu-24',
    name: 'Nikhil Tiwari',
    email: 'nikhil.t@college.edu',
    role: 'Student',
    classId: 'class-mech-3a',
    joinedAt: '2026-08-08T11:45:00.000Z',
    rollNo: '23ME025',
    lastActive: '3 hours ago',
    device: 'Windows 11 / Chrome 124',
    holisticPoints: 120
  },
  {
    id: 'user-stu-25',
    name: 'Swati Agarwal',
    email: 'swati.a@college.edu',
    role: 'Student',
    classId: 'class-mech-3a',
    joinedAt: '2026-08-09T08:40:00.000Z',
    rollNo: '23ME026',
    lastActive: '40 mins ago',
    device: 'Android 14 / Chrome Mobile',
    holisticPoints: 165
  },
  {
    id: 'user-stu-26',
    name: 'Chirag Solanki',
    email: 'chirag.s@college.edu',
    role: 'Student',
    classId: 'class-mech-3a',
    joinedAt: '2026-08-09T09:50:00.000Z',
    rollNo: '23ME027',
    lastActive: '1 hour ago',
    device: 'Windows 10 / Firefox 125',
    holisticPoints: 135
  },
  {
    id: 'user-stu-27',
    name: 'Ishita Bose',
    email: 'ishita.b@college.edu',
    role: 'Student',
    classId: 'class-mech-3a',
    joinedAt: '2026-08-09T11:00:00.000Z',
    rollNo: '23ME028',
    lastActive: '18 mins ago',
    device: 'macOS / Chrome 124',
    holisticPoints: 250
  },
  {
    id: 'user-stu-28',
    name: 'Rahul Saini',
    email: 'rahul.s@college.edu',
    role: 'Student',
    classId: 'class-mech-3a',
    joinedAt: '2026-08-10T09:20:00.000Z',
    rollNo: '23ME029',
    lastActive: '5 hours ago',
    device: 'Android 14 / Brave',
    holisticPoints: 115
  },
  {
    id: 'user-stu-29',
    name: 'Lavanya Sundar',
    email: 'lavanya.s@college.edu',
    role: 'Student',
    classId: 'class-mech-3a',
    joinedAt: '2026-08-10T10:30:00.000Z',
    rollNo: '23ME030',
    lastActive: '22 mins ago',
    device: 'iOS 17 / Safari',
    holisticPoints: 210
  },
  {
    id: 'user-stu-30',
    name: 'Gourav Pandey',
    email: 'gourav.p@college.edu',
    role: 'Student',
    classId: 'class-mech-3a',
    joinedAt: '2026-08-10T12:10:00.000Z',
    rollNo: '23ME031',
    lastActive: '2 days ago',
    device: 'Windows 11 / Edge 124',
    holisticPoints: 80
  },
  {
    id: 'user-stu-31',
    name: 'Deepa Kulkarni',
    email: 'deepa.k@college.edu',
    role: 'Student',
    classId: 'class-mech-3a',
    joinedAt: '2026-08-11T09:00:00.000Z',
    rollNo: '23ME032',
    lastActive: '30 mins ago',
    device: 'Windows 11 / Chrome 124',
    holisticPoints: 175
  },
  {
    id: 'user-stu-32',
    name: 'Kunal Kapoor',
    email: 'kunal.k@college.edu',
    role: 'Student',
    classId: 'class-mech-3a',
    joinedAt: '2026-08-11T10:15:00.000Z',
    rollNo: '23ME033',
    lastActive: '1 hour ago',
    device: 'macOS / Safari 17',
    holisticPoints: 190
  },
  {
    id: 'user-stu-33',
    name: 'Ankit Jaiswal',
    email: 'ankit.j@college.edu',
    role: 'Student',
    classId: 'class-mech-3a',
    joinedAt: '2026-08-11T11:45:00.000Z',
    rollNo: '23ME034',
    lastActive: '2 hours ago',
    device: 'Android 14 / Chrome Mobile',
    holisticPoints: 140
  },
  {
    id: 'user-stu-34',
    name: 'Bhavna Rathi',
    email: 'bhavna.r@college.edu',
    role: 'Student',
    classId: 'class-mech-3a',
    joinedAt: '2026-08-12T09:10:00.000Z',
    rollNo: '23ME035',
    lastActive: '14 mins ago',
    device: 'iOS 17 / Safari',
    holisticPoints: 220
  },
  {
    id: 'user-stu-35',
    name: 'Tushar Saxena',
    email: 'tushar.s@college.edu',
    role: 'Student',
    classId: 'class-mech-3a',
    joinedAt: '2026-08-12T10:20:00.000Z',
    rollNo: '23ME036',
    lastActive: '4 hours ago',
    device: 'Windows 11 / Chrome 124',
    holisticPoints: 150
  },
  {
    id: 'user-stu-36',
    name: 'Smriti Mandhana',
    email: 'smriti.m@college.edu',
    role: 'Student',
    classId: 'class-mech-3a',
    joinedAt: '2026-08-12T11:40:00.000Z',
    rollNo: '23ME037',
    lastActive: '10 mins ago',
    device: 'macOS / Chrome 124',
    holisticPoints: 270
  },
  {
    id: 'user-stu-37',
    name: 'Ayushmaan Kaul',
    email: 'ayushmaan.k@college.edu',
    role: 'Student',
    classId: 'class-mech-3a',
    joinedAt: '2026-08-13T09:00:00.000Z',
    rollNo: '23ME038',
    lastActive: '3 hours ago',
    device: 'Windows 10 / Firefox 125',
    holisticPoints: 160
  },
  {
    id: 'user-stu-38',
    name: 'Payal Trivedi',
    email: 'payal.t@college.edu',
    role: 'Student',
    classId: 'class-mech-3a',
    joinedAt: '2026-08-13T10:30:00.000Z',
    rollNo: '23ME039',
    lastActive: '45 mins ago',
    device: 'Android 14 / Chrome Mobile',
    holisticPoints: 180
  },
  {
    id: 'user-stu-39',
    name: 'Yashwant Singhania',
    email: 'yashwant.s@college.edu',
    role: 'Student',
    classId: 'class-mech-3a',
    joinedAt: '2026-08-13T12:00:00.000Z',
    rollNo: '23ME040',
    lastActive: '1 day ago',
    device: 'Windows 11 / Chrome 124',
    holisticPoints: 130
  },
  {
    id: 'user-stu-40',
    name: 'Kritika Mishra',
    email: 'kritika.m@college.edu',
    role: 'Student',
    classId: 'class-mech-3a',
    joinedAt: '2026-08-14T08:50:00.000Z',
    rollNo: '23ME041',
    lastActive: '16 mins ago',
    device: 'iOS 17 / Safari',
    holisticPoints: 205
  },
  {
    id: 'user-stu-41',
    name: 'Omkar Patil',
    email: 'omkar.p@college.edu',
    role: 'Student',
    classId: 'class-mech-3a',
    joinedAt: '2026-08-14T10:00:00.000Z',
    rollNo: '23ME042',
    lastActive: '3 hours ago',
    device: 'Android 14 / Firefox',
    holisticPoints: 125
  },
  {
    id: 'user-stu-42',
    name: 'Nandini Roy',
    email: 'nandini.r@college.edu',
    role: 'Student',
    classId: 'class-mech-3a',
    joinedAt: '2026-08-14T11:15:00.000Z',
    rollNo: '23ME043',
    lastActive: '28 mins ago',
    device: 'macOS / Safari 17',
    holisticPoints: 195
  },
  {
    id: 'user-stu-43',
    name: 'Tarun Vohra',
    email: 'tarun.v@college.edu',
    role: 'Student',
    classId: 'class-mech-3a',
    joinedAt: '2026-08-15T09:30:00.000Z',
    rollNo: '23ME044',
    lastActive: '3 days ago',
    device: 'Windows 11 / Edge 124',
    holisticPoints: 70
  },
  {
    id: 'user-stu-44',
    name: 'Aishwarya Shenoy',
    email: 'aishwarya.s@college.edu',
    role: 'Student',
    classId: 'class-mech-3a',
    joinedAt: '2026-08-15T10:45:00.000Z',
    rollNo: '23ME045',
    lastActive: '12 mins ago',
    device: 'macOS / Chrome 124',
    holisticPoints: 245
  },
  {
    id: 'user-stu-45',
    name: 'Mohit Chauhan',
    email: 'mohit.c@college.edu',
    role: 'Student',
    classId: 'class-mech-3a',
    joinedAt: '2026-08-15T12:00:00.000Z',
    rollNo: '23ME046',
    lastActive: '2 hours ago',
    device: 'Windows 11 / Chrome 124',
    holisticPoints: 140
  },
  {
    id: 'user-stu-46',
    name: 'Riya Bhardwaj',
    email: 'riya.b@college.edu',
    role: 'Student',
    classId: 'class-mech-3a',
    joinedAt: '2026-08-16T09:15:00.000Z',
    rollNo: '23ME047',
    lastActive: '24 mins ago',
    device: 'iOS 17 / Safari',
    holisticPoints: 215
  },
  {
    id: 'user-stu-47',
    name: 'Gaurav Dutta',
    email: 'gaurav.d@college.edu',
    role: 'Student',
    classId: 'class-mech-3a',
    joinedAt: '2026-08-16T10:30:00.000Z',
    rollNo: '23ME048',
    lastActive: '1 hour ago',
    device: 'Android 14 / Chrome Mobile',
    holisticPoints: 160
  },
  {
    id: 'user-stu-48',
    name: 'Trisha Banerjee',
    email: 'trisha.b@college.edu',
    role: 'Student',
    classId: 'class-mech-3a',
    joinedAt: '2026-08-16T11:45:00.000Z',
    rollNo: '23ME049',
    lastActive: '15 mins ago',
    device: 'macOS / Safari 17',
    holisticPoints: 235
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
    createdBy: 'Ribhav Sharma',
    status: 'active',
    notifyOnCreate: true,
    subtasks: [
      { id: 'st-1-1', title: 'Derive Bernoulli energy equation for Venturi tube', estimatedMinutes: 45, mandatory: true },
      { id: 'st-1-2', title: 'Solve problems 4.1 to 4.4 (differential manometer head)', estimatedMinutes: 60, mandatory: true },
      { id: 'st-1-3', title: 'Plot discharge coefficient vs Reynolds number curve', estimatedMinutes: 30, mandatory: false },
      { id: 'st-1-4', title: 'Format PDF with cover sheet and unit check verification', estimatedMinutes: 15, mandatory: true }
    ]
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
    createdBy: 'Ribhav Sharma',
    status: 'active',
    notifyOnCreate: true,
    subtasks: [
      { id: 'st-2-1', title: 'Tabulate Michelson interferometer fringe count data', estimatedMinutes: 30, mandatory: true },
      { id: 'st-2-2', title: 'Compute laser wavelength and percentage error estimation', estimatedMinutes: 40, mandatory: true },
      { id: 'st-2-3', title: 'Attach labeled apparatus schematic & sample raw data sheet', estimatedMinutes: 20, mandatory: true }
    ]
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
    createdBy: 'Ribhav Sharma',
    status: 'closed',
    notifyOnCreate: true,
    subtasks: [
      { id: 'st-3-1', title: 'Draft front and top orthographic views with 1:1 scale', estimatedMinutes: 90, mandatory: true },
      { id: 'st-3-2', title: 'Construct auxiliary section plane on inclined face', estimatedMinutes: 60, mandatory: true },
      { id: 'st-3-3', title: 'Complete standard title block and surface roughness symbols', estimatedMinutes: 25, mandatory: true }
    ]
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
    createdBy: 'Ribhav Sharma',
    status: 'active',
    notifyOnCreate: true,
    subtasks: [
      { id: 'st-4-1', title: 'Calculate turbine work and condenser heat rejection', estimatedMinutes: 50, mandatory: true },
      { id: 'st-4-2', title: 'Determine thermal efficiency of reheat Rankine cycle', estimatedMinutes: 45, mandatory: true },
      { id: 'st-4-3', title: 'Plot state points on Mollier h-s chart', estimatedMinutes: 35, mandatory: false }
    ]
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

export const INITIAL_CLASSES: ClassGroup[] = [
  INITIAL_CLASS,
  {
    id: 'class-cs-e102',
    name: 'CS-E102 (AI Elective)',
    code: '9P4X2A',
    crId: 'user-cr-1',
    crName: 'Aarav Sharma',
    createdAt: '2026-08-05T09:00:00.000Z',
    subjects: ['Machine Learning', 'Python Programming', 'Linear Algebra']
  },
  {
    id: 'class-robo-lab',
    name: 'ROBO-LAB Batch B',
    code: '3L8Y7W',
    crId: 'user-cr-1',
    crName: 'Aarav Sharma',
    createdAt: '2026-08-10T09:00:00.000Z',
    subjects: ['Microcontroller Systems', 'Kinematics', 'Embedded C']
  }
];

export const INITIAL_ATTENDANCE: AttendanceSession[] = [
  {
    id: 'att-1',
    classId: 'class-mech-3a',
    date: '2026-09-08',
    subject: 'Fluid Mechanics',
    topic: 'Navier-Stokes Equation Derivation',
    conductedBy: 'Prof. S. Rao',
    createdAt: new Date(now.getTime() - 48 * 60 * 60 * 1000).toISOString(),
    records: [
      { studentId: 'user-stu-1', studentName: 'Ishan Patel', rollNo: '23ME014', status: 'present' },
      { studentId: 'user-stu-2', studentName: 'Neha Kulkarni', rollNo: '23ME028', status: 'present' },
      { studentId: 'user-stu-3', studentName: 'Rohan Verma', rollNo: '23ME045', status: 'present' },
      { studentId: 'user-stu-4', studentName: 'Priya Nair', rollNo: '23ME039', status: 'present' },
      { studentId: 'user-stu-5', studentName: 'Ananya Deshmukh', rollNo: '23ME008', status: 'present' },
      { studentId: 'user-stu-6', studentName: 'Kabir Mehta', rollNo: '23ME022', status: 'late' },
      { studentId: 'user-stu-7', studentName: 'Tanvi Iyer', rollNo: '23ME056', status: 'present' },
      { studentId: 'user-stu-8', studentName: 'Aditya Gupta', rollNo: '23ME003', status: 'absent' },
      { studentId: 'user-stu-9', studentName: 'Sneha Reddy', rollNo: '23ME049', status: 'absent' },
      { studentId: 'user-stu-10', studentName: 'Vikram Joshi', rollNo: '23ME062', status: 'absent' }
    ]
  },
  {
    id: 'att-2',
    classId: 'class-mech-3a',
    date: '2026-09-09',
    subject: 'Thermodynamics',
    topic: 'Brayton Cycle & Gas Turbine Efficiency',
    conductedBy: 'Dr. V. Menon',
    createdAt: new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString(),
    records: [
      { studentId: 'user-stu-1', studentName: 'Ishan Patel', rollNo: '23ME014', status: 'present' },
      { studentId: 'user-stu-2', studentName: 'Neha Kulkarni', rollNo: '23ME028', status: 'present' },
      { studentId: 'user-stu-3', studentName: 'Rohan Verma', rollNo: '23ME045', status: 'present' },
      { studentId: 'user-stu-4', studentName: 'Priya Nair', rollNo: '23ME039', status: 'present' },
      { studentId: 'user-stu-5', studentName: 'Ananya Deshmukh', rollNo: '23ME008', status: 'present' },
      { studentId: 'user-stu-6', studentName: 'Kabir Mehta', rollNo: '23ME022', status: 'present' },
      { studentId: 'user-stu-7', studentName: 'Tanvi Iyer', rollNo: '23ME056', status: 'present' },
      { studentId: 'user-stu-8', studentName: 'Aditya Gupta', rollNo: '23ME003', status: 'present' },
      { studentId: 'user-stu-9', studentName: 'Sneha Reddy', rollNo: '23ME049', status: 'absent' },
      { studentId: 'user-stu-10', studentName: 'Vikram Joshi', rollNo: '23ME062', status: 'absent' }
    ]
  }
];

export const INITIAL_RESOURCES: ResourceItem[] = [
  {
    id: 'res-1',
    classId: 'class-mech-3a',
    title: 'Mid-Sem 2025 Solved PYQ Paper',
    subject: 'Fluid Mechanics',
    category: 'pyq',
    description: 'Complete step-by-step solved previous year question paper with marking scheme.',
    fileName: 'FM_Midsem_2025_Solved.pdf',
    fileSize: '4.8 MB',
    uploadedBy: 'user-cr-1',
    uploadedByName: 'Aarav Sharma (CR)',
    uploadedAt: '2026-09-02T11:00:00.000Z',
    downloadsCount: 38
  },
  {
    id: 'res-2',
    classId: 'class-mech-3a',
    title: 'Steam Tables & Mollier Diagram Reference',
    subject: 'Thermodynamics',
    category: 'formula',
    description: 'Official approved steam tables reference sheet for midterm and final examinations.',
    fileName: 'Thermo_Steam_Tables_2026.pdf',
    fileSize: '2.1 MB',
    uploadedBy: 'user-cr-1',
    uploadedByName: 'Aarav Sharma (CR)',
    uploadedAt: '2026-09-03T14:30:00.000Z',
    downloadsCount: 42
  },
  {
    id: 'res-3',
    classId: 'class-mech-3a',
    title: 'Unit 3: Navier-Stokes Handwritten Lecture Notes',
    subject: 'Fluid Mechanics',
    category: 'notes',
    description: 'Comprehensive handwritten lecture notes covering cylindrical coordinates and boundary layer theory.',
    fileName: 'FM_Unit3_LectureNotes.pdf',
    fileSize: '12.4 MB',
    uploadedBy: 'user-stu-2',
    uploadedByName: 'Neha Kulkarni',
    uploadedAt: '2026-09-05T16:00:00.000Z',
    downloadsCount: 29
  },
  {
    id: 'res-4',
    classId: 'class-mech-3a',
    title: 'CAD Lab Manual & Isometric Dimensioning Guide',
    subject: 'Engineering Graphics',
    category: 'lab',
    description: 'Standard CAD drawing templates and tolerance limits for weekly lab submissions.',
    fileName: 'CAD_Lab_Manual_v3.pdf',
    fileSize: '6.2 MB',
    uploadedBy: 'user-cr-1',
    uploadedByName: 'Aarav Sharma (CR)',
    uploadedAt: '2026-09-06T09:15:00.000Z',
    downloadsCount: 34
  }
];

export const INITIAL_POLLS: ClassPoll[] = [
  {
    id: 'poll-1',
    classId: 'class-mech-3a',
    question: 'When should we submit Fluid Mechanics Assignment 2?',
    description: 'Prof. Rao offered an optional extension if the majority agrees.',
    options: [
      { id: 'opt-1', text: 'Thursday 11:59 PM (As Scheduled)', votes: ['user-stu-1', 'user-stu-2', 'user-stu-5'] },
      { id: 'opt-2', text: 'Friday 5:00 PM (After Lab Session)', votes: ['user-stu-3', 'user-stu-4', 'user-stu-6', 'user-stu-7', 'user-stu-8'] },
      { id: 'opt-3', text: 'Saturday 11:59 PM (Weekend Window)', votes: ['user-stu-9', 'user-stu-10'] }
    ],
    createdBy: 'user-cr-1',
    createdByName: 'Ribhav Sharma',
    createdAt: new Date(now.getTime() - 14 * 60 * 60 * 1000).toISOString(),
    expiresAt: new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString(),
    isClosed: false
  }
];

export const INITIAL_HOLISTIC_ACTIVITIES: HolisticActivity[] = [
  {
    id: 'act-1',
    studentId: 'user-stu-16',
    studentName: 'Siddharth Ghosh',
    studentRollNo: '23ME017',
    title: 'Smart India Hackathon 2026 — Finalist (Hardware Edition)',
    category: 'hackathon',
    description: 'Built an IoT-based smart agricultural pipeline monitoring device with predictive sensor telemetry.',
    organizationOrEvent: 'Ministry of Education Innovation Cell / AICTE',
    date: '2026-09-12',
    proofUrl: 'https://sih.gov.in/certificate/MECH-SIH26-8812',
    points: 40,
    status: 'approved',
    facultyRemarks: 'Exceptional prototype design. 40 NEP activity points awarded.',
    approvedBy: 'Dr. Meenakshi Sundaram',
    approvedAt: '2026-09-15T11:00:00.000Z'
  },
  {
    id: 'act-2',
    studentId: 'user-stu-4',
    studentName: 'Priya Nair',
    studentRollNo: '23ME005',
    title: 'SAE Baja Collegiate Design Series — Chassis Lead',
    category: 'leadership',
    description: 'Led a team of 14 students designing the chromoly roll cage and impact absorption geometry in ANSYS.',
    organizationOrEvent: 'Society of Automotive Engineers (SAE India)',
    date: '2026-09-18',
    proofUrl: 'https://saeindia.org/teams/mech-baja-2026',
    points: 35,
    status: 'approved',
    facultyRemarks: 'Verified structural telemetry and crash simulations. Approved.',
    approvedBy: 'Dr. Meenakshi Sundaram',
    approvedAt: '2026-09-20T14:30:00.000Z'
  },
  {
    id: 'act-3',
    studentId: 'user-stu-27',
    studentName: 'Ishita Bose',
    studentRollNo: '23ME028',
    title: 'AWS Certified Cloud Practitioner (CLF-C02)',
    category: 'certification',
    description: 'Scored 890/1000 in official AWS Cloud Architecture and automated microservices certification.',
    organizationOrEvent: 'Amazon Web Services Training & Certification',
    date: '2026-09-24',
    proofUrl: 'https://aws.amazon.com/verification/CLF890912',
    points: 25,
    status: 'approved',
    facultyRemarks: 'Industry-standard accreditation verified.',
    approvedBy: 'Dr. Meenakshi Sundaram',
    approvedAt: '2026-09-25T09:15:00.000Z'
  },
  {
    id: 'act-4',
    studentId: 'user-stu-36',
    studentName: 'Smriti Mandhana',
    studentRollNo: '23ME037',
    title: 'Inter-University Cricket Championship — Gold Medalist',
    category: 'sports_cultural',
    description: 'Captained the college varsity team to victory in the All-India Inter-University Zonal Trophy.',
    organizationOrEvent: 'Association of Indian Universities (AIU)',
    date: '2026-09-28',
    proofUrl: 'https://sports.university.edu/medals/2026/cricket-gold',
    points: 30,
    status: 'approved',
    facultyRemarks: 'Outstanding sporting achievement brought university laurels.',
    approvedBy: 'Dr. Meenakshi Sundaram',
    approvedAt: '2026-09-30T16:00:00.000Z'
  },
  {
    id: 'act-5',
    studentId: 'user-stu-11',
    studentName: 'Ananya Deshmukh',
    studentRollNo: '23ME012',
    title: 'NSS Mega Blood Donation & Thalassemia Screening Drive Lead',
    category: 'social_impact',
    description: 'Coordinated mobilization across 3 blocks, registering 340+ voluntary blood donors in 48 hours.',
    organizationOrEvent: 'National Service Scheme (NSS) Unit 4',
    date: '2026-10-01',
    proofUrl: 'https://nss.gov.in/camp/reports/2026-bl-4',
    points: 20,
    status: 'pending_approval',
    facultyRemarks: undefined
  },
  {
    id: 'act-6',
    studentId: 'user-stu-1',
    studentName: 'Ishan Patel',
    studentRollNo: '23ME002',
    title: 'Research Paper: Microchannel Heat Sink Optimization in Electronics',
    category: 'research',
    description: 'Submitted manuscript to ASME Journal of Thermal Science and Engineering Applications.',
    organizationOrEvent: 'ASME Student Chapter',
    date: '2026-10-02',
    proofUrl: 'https://asme.org/papers/draft-99120',
    points: 30,
    status: 'pending_approval',
    facultyRemarks: undefined
  },
  {
    id: 'act-7',
    studentId: 'user-stu-8',
    studentName: 'Tanvi Joshi',
    studentRollNo: '23ME009',
    title: 'National Robotics Competition — Best Autonomous Algorithm',
    category: 'hackathon',
    description: 'Engineered SLAM LiDAR path-planning algorithm for industrial AGV navigation maze.',
    organizationOrEvent: 'IIT Bombay Techfest',
    date: '2026-10-03',
    proofUrl: 'https://techfest.org/certificates/2026-robo-slam',
    points: 25,
    status: 'pending_approval',
    facultyRemarks: undefined
  }
];

export const INITIAL_CONFIDENTIAL_GRIEVANCES: GrievanceConfidentialItem[] = [
  {
    id: 'grv-1',
    studentId: 'user-stu-10',
    studentName: 'Aditya Rao (Confidential)',
    isAnonymous: false,
    category: 'attendance_dispute',
    subject: 'Hospitalization during Midterm Lab Sessions & Medical Exemption',
    message: 'Respected Dr. Sundaram, I was admitted to the hospital with viral pneumonia for 8 days. I submitted medical papers to the office, but my Applied Physics attendance reflects 62% which bars me from midterms. Requesting faculty exemption review.',
    submittedAt: '2026-10-01T14:20:00.000Z',
    status: 'pending',
    facultyNotes: 'Hospital discharge summary received via email. Need to notify Dr. Rao.'
  },
  {
    id: 'grv-2',
    studentId: 'user-stu-43',
    studentName: 'Anonymous Student',
    isAnonymous: true,
    category: 'academic_stress',
    subject: 'High pressure due to overlapping 3-day lab deadlines',
    message: 'Three subjects have scheduled comprehensive lab reports on the exact same Friday afternoon. Students are working past 3 AM without sleep. Could the faculty council please enforce a distributed deadline policy?',
    submittedAt: '2026-10-02T19:40:00.000Z',
    status: 'reviewed',
    facultyNotes: 'Discussed with HOD. We will stagger Thermo and Fluid Mechanics reports by 72 hours.'
  },
  {
    id: 'grv-3',
    studentId: 'user-stu-18',
    studentName: 'Manav Malhotra (Confidential)',
    isAnonymous: false,
    category: 'facility_lab',
    subject: 'CAD Lab System 14 malfunctioning graphical driver crashes',
    message: 'System 14 in the CAD Suite repeatedly crashes during AutoCAD 3D rendering, corrupting saved work right before export. CR was informed but lab technician has not serviced it.',
    submittedAt: '2026-10-03T11:10:00.000Z',
    status: 'resolved',
    facultyNotes: 'Lab technician replaced RAM and updated GPU drivers on Oct 4.'
  }
];

export const INITIAL_FACULTY_AUDITS: FacultyAuditEntry[] = [
  {
    id: 'aud-1',
    timestamp: '2026-10-04T18:45:00.000Z',
    action: 'Attendance Modification Audit',
    performedBy: 'Prof. K. N. Murthy',
    role: 'Faculty',
    details: 'CAD Lab Batch B session modified: 3 absent marks corrected to present after verifying lab sign-in register.',
    severity: 'info'
  },
  {
    id: 'aud-2',
    timestamp: '2026-10-04T15:20:00.000Z',
    action: 'Broadcast Notice Dispatched',
    performedBy: 'Ribhav Sharma (CR)',
    role: 'CR',
    details: 'Urgent notice dispatched to all 48 students regarding Midterm Seating Matrix. 100% delivered.',
    severity: 'info'
  },
  {
    id: 'aud-3',
    timestamp: '2026-10-03T21:10:00.000Z',
    action: 'Low Attendance Warning Generated',
    performedBy: 'System Engine',
    role: 'Faculty',
    details: '5 students flagged under 75% statutory minimum attendance threshold (Aditya Rao, Vikram Desai, Manav Malhotra, Gourav Pandey, Tarun Vohra).',
    severity: 'warning'
  },
  {
    id: 'aud-4',
    timestamp: '2026-10-02T10:00:00.000Z',
    action: 'Cryptographic Hash Verification Check',
    performedBy: 'System Integrity Sentinel',
    role: 'Faculty',
    details: 'Verified 42 student submission proof hashes against browser canvas fingerprints. No tampering detected.',
    severity: 'info'
  }
];


