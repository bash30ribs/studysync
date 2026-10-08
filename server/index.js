/**
 * StudySync Backend API Server
 * Express server with real file uploads (multer), in-memory sync, and real-time push (SSE)
 */
import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { randomUUID } from 'crypto';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = 3001;

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Serve uploaded files statically with open CORS
const UPLOADS_DIR = path.join(__dirname, 'uploads');
if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });
app.use('/uploads', express.static(UPLOADS_DIR));

// ─── SSE (Real-Time Events) ───────────────────────────────────────────────────
/** @type {Map<string, import('express').Response>} */
const sseClients = new Map();

/**
 * Broadcast an event to all connected SSE clients
 * @param {string} eventType
 * @param {object} data
 */
export function broadcast(eventType, data) {
  const payload = `event: ${eventType}\ndata: ${JSON.stringify(data)}\n\n`;
  for (const [id, res] of sseClients.entries()) {
    try {
      res.write(payload);
    } catch {
      sseClients.delete(id);
    }
  }
}

app.get('/api/events', (req, res) => {
  res.set({
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'Access-Control-Allow-Origin': '*',
    'X-Accel-Buffering': 'no',
  });
  res.flushHeaders();

  const clientId = randomUUID();
  sseClients.set(clientId, res);

  // Send connection confirmation
  res.write(`event: connected\ndata: ${JSON.stringify({ clientId, time: new Date().toISOString() })}\n\n`);

  // Heartbeat every 20s to prevent connection drops
  const heartbeat = setInterval(() => {
    try { res.write(': heartbeat\n\n'); } catch { clearInterval(heartbeat); sseClients.delete(clientId); }
  }, 20000);

  req.on('close', () => {
    clearInterval(heartbeat);
    sseClients.delete(clientId);
  });
});

// ─── Multer config ─────────────────────────────────────────────────────────────
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOADS_DIR),
  filename: (_req, file, cb) => {
    const safe = file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_');
    cb(null, `${Date.now()}_${safe}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50 MB
  fileFilter: (_req, file, cb) => {
    const allowed = ['.pdf', '.doc', '.docx', '.zip', '.png', '.jpg', '.jpeg', '.webp', '.dwg', '.xlsx', '.pptx', '.txt'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowed.includes(ext) || !ext) cb(null, true);
    else cb(new Error(`File type ${ext} not allowed`));
  }
});

// ─── In-Memory State ─────────────────────────────────────────────────────────
/** @type {Array<{id: string, type: string, actor: string, detail: string, ts: string, fileUrl?: string}>} */
let activityLog = [];

function logActivity(type, actor, detail, fileUrl = null) {
  const entry = { id: randomUUID(), type, actor, detail, ts: new Date().toISOString(), fileUrl };
  activityLog.unshift(entry);
  if (activityLog.length > 200) activityLog = activityLog.slice(0, 200);
  broadcast('activity', entry);
  return entry;
}

// Assignments
let assignments = [
  {
    id: 'a1',
    title: 'Fluid Mechanics — Lab Experiment 4',
    subject: 'Fluid Mechanics',
    due: 'Tomorrow · 5:00 PM',
    deadline: new Date(Date.now() + 86400000).toISOString(),
    submitted: 34,
    total: 48,
    status: 'active',
    hash: '0x7f4a8d1c',
    fileName: 'Fluid_Mechanics_Lab4_Brief.pdf',
    fileSize: '1.8 MB',
    fileUrl: null,
    postedAt: new Date(Date.now() - 86400000).toISOString(),
    createdBy: 'Ribhav Sharma (CR)'
  },
  {
    id: 'a2',
    title: 'Engineering Maths — Assignment 3',
    subject: 'Engineering Maths',
    due: 'Friday · 11:59 PM',
    deadline: new Date(Date.now() + 3 * 86400000).toISOString(),
    submitted: 28,
    total: 48,
    status: 'active',
    hash: '0x2c8e9f5b',
    fileName: 'Maths_Assignment3_Problems.pdf',
    fileSize: '950 KB',
    fileUrl: null,
    postedAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    createdBy: 'Ribhav Sharma (CR)'
  },
  {
    id: 'a3',
    title: 'Data Structures — Viva Submission',
    subject: 'Data Structures',
    due: 'Next Monday · 9:00 AM',
    deadline: new Date(Date.now() + 6 * 86400000).toISOString(),
    submitted: 12,
    total: 48,
    status: 'active',
    hash: '0x9b3a7e2d',
    fileName: 'DSA_Viva_Rubric_Questions.pdf',
    fileSize: '1.2 MB',
    fileUrl: null,
    postedAt: new Date(Date.now() - 3 * 86400000).toISOString(),
    createdBy: 'Ribhav Sharma (CR)'
  }
];

// Submissions
let submissions = [
  { id: 'sub1', student: 'Aaditya Verma', code: 'CS21571', assignment: 'Fluid Mechanics — Lab 4', assignmentId: 'a1', ts: '2 min ago', hash: '0x7f4a8d1c3e9b2a6f', status: 'verified', fileName: 'Aaditya_Verma_Exp4.pdf', fileSize: '2.1 MB' },
  { id: 'sub2', student: 'Sneha Nair', code: 'CS21566', assignment: 'Fluid Mechanics — Lab 4', assignmentId: 'a1', ts: '14 min ago', hash: '0x2c8e9f5b7a1d4e3c', status: 'verified', fileName: 'Sneha_FM_Lab4.pdf', fileSize: '1.9 MB' },
  { id: 'sub3', student: 'Priya Desai', code: 'CS21538', assignment: 'Fluid Mechanics — Lab 4', assignmentId: 'a1', ts: '32 min ago', hash: '0x9b3a7e2d5f8c1a4b', status: 'verified', fileName: 'Priya_FM4.pdf', fileSize: '3.4 MB' }
];

// Broadcasts
let broadcasts = [
  { id: 'b1', author: 'Ribhav Sharma', role: 'CR', code: 'CS21532', text: 'Fluid Mechanics Lab 4 submission portal closes tomorrow at 5:00 PM. 34 of 48 submitted. Check the Assignment Tracker for real-time status.', time: '2h ago', pinned: true, reactions: 12, status: 'approved' },
  { id: 'b2', author: 'Ribhav Sharma', role: 'CR', code: 'CS21532', text: 'Viva dates for Fluid Mechanics will be decided via poll. Please vote by tonight — anonymous, one vote per student.', time: '5h ago', pinned: true, reactions: 24, status: 'approved' },
  { id: 'b3', author: 'Dr. M. Sundaram', role: 'Faculty', code: 'EMP-AIML-004', text: 'Unit 3 notes uploaded to the Academic Vault. Lab manual revision is available for download.', time: '1d ago', pinned: false, reactions: 18, status: 'approved' },
  { id: 'b4', author: 'Ribhav Sharma', role: 'CR', code: 'CS21532', text: 'Attendance radar updated after Monday sessions. 4 defaulters flagged below 75% — check your personal radar.', time: '2d ago', pinned: false, reactions: 9, status: 'approved' },
  { id: 'b5', author: 'Ribhav Sharma', role: 'CR', code: 'CS21532', text: 'Reminder: fee payment window closes this Friday. Please check your portal.', time: '15m ago', pinned: false, reactions: 0, status: 'pending' },
  { id: 'b6', author: 'Ribhav Sharma', role: 'CR', code: 'CS21532', text: 'Requesting department to reschedule Wednesday lab — conflicts with mid-term review.', time: '30m ago', pinned: false, reactions: 0, status: 'pending' }
];

// Growth Activities (AICTE 100-Points Portfolio)
let growthActivities = [
  { id: 'gw1', studentName: 'Aaditya Verma', rollNo: 'CS21571', title: 'AWS Cloud Solutions Architect Certification', category: 'Certifications & MOOCs', points: 20, status: 'approved', verifiedBy: 'Dr. M. Sundaram', ts: '2 days ago', fileUrl: null, fileName: 'AWS_Solutions_Architect.pdf' },
  { id: 'gw2', studentName: 'Aaditya Verma', rollNo: 'CS21571', title: 'Smart India Hackathon 2025 Regional Winner', category: 'Hackathons & Competitions', points: 25, status: 'approved', verifiedBy: 'Dr. M. Sundaram', ts: '1 week ago', fileUrl: null, fileName: 'SIH2025_Winner_Certificate.pdf' },
  { id: 'gw3', studentName: 'Aaditya Verma', rollNo: 'CS21571', title: 'IEEE International Student Paper on Edge ML', category: 'Research & Publications', points: 15, status: 'pending_approval', verifiedBy: null, ts: 'Yesterday', fileUrl: null, fileName: 'IEEE_Paper_Proof.pdf' },
  { id: 'gw4', studentName: 'Sneha Nair', rollNo: 'CS21566', title: 'NPTEL Deep Learning with Distinction (Top 5%)', category: 'Certifications & MOOCs', points: 20, status: 'pending_approval', verifiedBy: null, ts: '3 hours ago', fileUrl: null, fileName: 'NPTEL_DeepLearning_Score.pdf' },
  { id: 'gw5', studentName: 'Rohan Kulkarni', rollNo: 'CS21554', title: 'Summer Research Internship at C-DAC (8 Weeks)', category: 'Internships', points: 20, status: 'pending_approval', verifiedBy: null, ts: '5 hours ago', fileUrl: null, fileName: 'CDAC_Internship_Certificate.pdf' }
];

// Resources
let resources = [];

// ─── Routes ───────────────────────────────────────────────────────────────────

/** GET /api/health */
app.get('/api/health', (_req, res) => {
  res.json({ ok: true, time: new Date().toISOString(), clients: sseClients.size });
});

/** GET /api/activity — recent event log */
app.get('/api/activity', (_req, res) => {
  res.json(activityLog.slice(0, 50));
});

// ─── ASSIGNMENTS ROUTES ───────────────────────────────────────────────────────

/** GET /api/assignments */
app.get('/api/assignments', (_req, res) => {
  res.json(assignments);
});

/**
 * POST /api/assignments
 * Handles assignment creation with optional file attachment
 */
app.post('/api/assignments', upload.single('file'), (req, res) => {
  try {
    const {
      title,
      subject,
      due,
      deadline,
      description = '',
      createdBy = 'Ribhav Sharma (CR)',
      role = 'CR',
      isRecurring = 'false',
      recurrenceRule,
      subtasks
    } = req.body;

    if (!title) {
      return res.status(400).json({ error: 'Assignment title is required' });
    }

    let fileName = null;
    let fileSize = null;
    let fileUrl = null;

    if (req.file) {
      fileName = req.file.originalname;
      const kb = req.file.size / 1024;
      fileSize = kb > 1024 ? `${(kb / 1024).toFixed(1)} MB` : `${kb.toFixed(0)} KB`;
      fileUrl = `http://localhost:${PORT}/uploads/${req.file.filename}`;
    } else if (req.body.fileName) {
      fileName = req.body.fileName;
      fileSize = req.body.fileSize || '1.8 MB';
    }

    const newAssignment = {
      id: 'a' + Date.now(),
      title: title.trim(),
      subject: subject || 'General',
      due: due || 'Tomorrow · 5:00 PM',
      deadline: deadline || new Date(Date.now() + 86400000).toISOString(),
      description,
      submitted: 0,
      total: 48,
      status: 'active',
      hash: '0x' + randomUUID().slice(0, 8),
      fileName,
      fileSize,
      fileUrl,
      postedAt: new Date().toISOString(),
      createdBy,
      isRecurring: isRecurring === 'true' || isRecurring === true,
      recurrenceRule,
      subtasks: typeof subtasks === 'string' ? JSON.parse(subtasks || '[]') : (subtasks || [])
    };

    assignments.unshift(newAssignment);

    // Log & SSE Broadcast to all connected students and CRs
    logActivity(
      'assignment_created',
      createdBy,
      `New assignment posted: "${newAssignment.title}" (${newAssignment.subject})${fileName ? ` · Attached: ${fileName}` : ''}`,
      fileUrl
    );

    // Broadcast specific assignment event
    broadcast('assignment_created', newAssignment);

    res.status(201).json({ ok: true, assignment: newAssignment });
  } catch (err) {
    console.error('Error creating assignment:', err);
    res.status(500).json({ error: err.message });
  }
});

/**
 * POST /api/upload/assignment-file
 * Upload a file for an assignment (CR posting)
 */
app.post('/api/upload/assignment-file', upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file provided' });

  const { uploader = 'Unknown', role = 'CR', assignmentTitle = 'Untitled' } = req.body;
  const fileUrl = `/uploads/${req.file.filename}`;
  const fileSizeKB = req.file.size / 1024;
  const fileSizeFmt = fileSizeKB > 1024
    ? `${(fileSizeKB / 1024).toFixed(1)} MB`
    : `${fileSizeKB.toFixed(0)} KB`;

  const fullUrl = `http://localhost:${PORT}${fileUrl}`;

  logActivity(
    'assignment_file_upload',
    uploader,
    `${role} uploaded assignment file: "${req.file.originalname}" for "${assignmentTitle}"`,
    fullUrl
  );

  res.json({
    ok: true,
    fileName: req.file.originalname,
    storedName: req.file.filename,
    fileUrl: fullUrl,
    fileSize: fileSizeFmt,
  });
});

// ─── SUBMISSIONS ROUTES ───────────────────────────────────────────────────────

/** GET /api/submissions */
app.get('/api/submissions', (_req, res) => {
  res.json(submissions);
});

/**
 * POST /api/submit & /api/upload/submission
 * Student submits their assignment file or solution
 */
const handleSubmission = (req, res) => {
  const {
    studentName = 'Student',
    studentId = 'CS21571',
    assignmentId = 'a1',
    assignmentTitle = 'Assignment',
    textNote = ''
  } = req.body;

  let fileUrl = null;
  let fileName = textNote ? null : 'Solution.pdf';
  let fileSize = '—';

  if (req.file) {
    fileUrl = `http://localhost:${PORT}/uploads/${req.file.filename}`;
    fileName = req.file.originalname;
    const kb = req.file.size / 1024;
    fileSize = kb > 1024 ? `${(kb / 1024).toFixed(1)} MB` : `${kb.toFixed(0)} KB`;
  }

  const hash = '0x' + randomUUID().replace(/-/g, '').substring(0, 16);
  const isoTime = new Date().toISOString();

  // Update in-memory assignment submission counter
  const targetAsg = assignments.find(a => a.id === assignmentId || a.title === assignmentTitle);
  if (targetAsg) {
    targetAsg.submitted = Math.min(targetAsg.total, (targetAsg.submitted || 0) + 1);
  }

  const newSub = {
    id: 'sub' + Date.now(),
    student: studentName,
    code: studentId,
    assignment: assignmentTitle,
    assignmentId,
    fileName,
    fileUrl,
    fileSize,
    ts: 'Just now',
    submittedAt: isoTime,
    hash,
    status: 'verified',
    textNote
  };

  submissions = [newSub, ...submissions.filter(s => !(s.code === studentId && s.assignmentId === assignmentId))];

  logActivity(
    'submission',
    studentName,
    `Submitted "${assignmentTitle}"${fileName ? ` (${fileName})` : ''} · Immutable receipt ${hash.slice(0, 10)}…`,
    fileUrl
  );

  // Broadcast specific submission event for instant UI update
  broadcast('submission', {
    ...newSub,
    assignmentSubmittedCount: targetAsg ? targetAsg.submitted : undefined,
    assignmentTotalCount: targetAsg ? targetAsg.total : 48
  });

  res.json({
    ok: true,
    submittedAt: isoTime,
    submissionHash: hash,
    fileName,
    fileUrl,
    fileSize,
    submission: newSub
  });
};

app.post('/api/submit', upload.single('file'), handleSubmission);
app.post('/api/upload/submission', upload.single('file'), handleSubmission);

// ─── BROADCASTS ROUTES ───────────────────────────────────────────────────────

/** GET /api/broadcasts */
app.get('/api/broadcasts', (_req, res) => {
  res.json(broadcasts);
});

/** POST /api/broadcasts */
app.post('/api/broadcasts', (req, res) => {
  const { author = 'Ribhav Sharma', role = 'CR', code = 'CS21532', text, pinned = true } = req.body;
  if (!text || !text.trim()) {
    return res.status(400).json({ error: 'Broadcast message text is required' });
  }

  const newBroadcast = {
    id: 'b' + Date.now(),
    author,
    role,
    code,
    text: text.trim(),
    time: 'Just now',
    pinned: pinned === true || pinned === 'true',
    reactions: 0,
    status: role === 'Faculty' ? 'approved' : 'approved' // Live immediately for students & logged for HOD
  };

  broadcasts.unshift(newBroadcast);

  logActivity('broadcast', author, `${role} broadcast notice: "${newBroadcast.text.slice(0, 60)}${newBroadcast.text.length > 60 ? '…' : ''}"`);
  broadcast('broadcast', newBroadcast);

  res.status(201).json({ ok: true, broadcast: newBroadcast });
});

/** POST /api/broadcasts/:id/approve */
app.post('/api/broadcasts/:id/approve', (req, res) => {
  const bc = broadcasts.find(b => b.id === req.params.id);
  if (!bc) return res.status(404).json({ error: 'Broadcast not found' });
  bc.status = 'approved';
  logActivity('broadcast_approval', 'Faculty Incharge', `Approved official broadcast: "${bc.text.slice(0, 50)}…"`);
  broadcast('broadcast_approved', bc);
  res.json({ ok: true, broadcast: bc });
});

// ─── GROWTH & AICTE PORTFOLIO ROUTES ──────────────────────────────────────────

/** GET /api/growth */
app.get('/api/growth', (_req, res) => {
  res.json(growthActivities);
});

/** POST /api/growth (Submit activity or certificate) */
app.post('/api/growth', upload.single('file'), (req, res) => {
  const {
    studentName = 'Aaditya Verma',
    rollNo = 'CS21571',
    title,
    category = 'Certifications & MOOCs',
    points = 15
  } = req.body;

  if (!title) return res.status(400).json({ error: 'Activity title is required' });

  let fileUrl = null;
  let fileName = null;
  if (req.file) {
    fileUrl = `http://localhost:${PORT}/uploads/${req.file.filename}`;
    fileName = req.file.originalname;
  }

  const activity = {
    id: 'gw' + Date.now(),
    studentName,
    rollNo,
    title: title.trim(),
    category,
    points: Number(points) || 10,
    status: 'pending_approval',
    verifiedBy: null,
    ts: 'Just now',
    fileName,
    fileUrl
  };

  growthActivities.unshift(activity);

  logActivity('growth_submission', studentName, `Submitted AICTE growth activity: "${activity.title}" (${category} · ${activity.points} pts)`, fileUrl);
  broadcast('growth_activity', activity);

  res.status(201).json({ ok: true, activity });
});

/** POST /api/growth/:id/approve */
app.post('/api/growth/:id/approve', (req, res) => {
  const act = growthActivities.find(g => g.id === req.params.id);
  if (!act) return res.status(404).json({ error: 'Activity not found' });
  act.status = 'approved';
  act.verifiedBy = 'Dr. M. Sundaram';

  logActivity('growth_approval', 'Dr. M. Sundaram', `Accredited ${act.points} AICTE points for ${act.studentName}: "${act.title}"`);
  broadcast('growth_approved', act);

  res.json({ ok: true, activity: act });
});

// ─── RESOURCES ROUTES ─────────────────────────────────────────────────────────

/** POST /api/upload/resource */
app.post('/api/upload/resource', upload.single('file'), (req, res) => {
  const { uploader = 'Unknown', title = 'Resource', subject = '', category = 'notes' } = req.body;

  let fileUrl = null;
  let fileName = req.body.fileName || title.replace(/\s+/g, '_') + '.pdf';
  let fileSize = '—';

  if (req.file) {
    fileUrl = `http://localhost:${PORT}/uploads/${req.file.filename}`;
    fileName = req.file.originalname;
    const kb = req.file.size / 1024;
    fileSize = kb > 1024 ? `${(kb / 1024).toFixed(1)} MB` : `${kb.toFixed(0)} KB`;
  }

  const resourceId = 'res-' + Date.now();

  logActivity(
    'resource_upload',
    uploader,
    `Uploaded resource: "${title}" (${subject} · ${category})${fileName ? ` — ${fileName}` : ''}`,
    fileUrl
  );

  const resItem = {
    id: resourceId,
    title,
    subject,
    category,
    fileName,
    fileUrl,
    fileSize,
    uploadedByName: uploader,
    uploadedAt: new Date().toISOString(),
    downloadsCount: 0,
  };

  resources.unshift(resItem);
  broadcast('resource', resItem);

  res.json({ ok: true, id: resourceId, fileName, fileUrl, fileSize, resource: resItem });
});

// ─── ERROR HANDLER ───────────────────────────────────────────────────────────
app.use((err, _req, res, _next) => {
  console.error('[StudySync Server Error]', err.message);
  res.status(400).json({ error: err.message });
});

// ─── START SERVER ─────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🚀 StudySync Backend running on http://localhost:${PORT}`);
  console.log(`   📁 File uploads: ${UPLOADS_DIR}`);
  console.log(`   📡 SSE endpoint: http://localhost:${PORT}/api/events`);
  console.log(`   🏥 Health:       http://localhost:${PORT}/api/health\n`);
});
