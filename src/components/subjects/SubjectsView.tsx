import React, { useState } from 'react';
import { useStudySync } from '../../store';
import { 
  BookOpen, 
  Users, 
  UserCheck, 
  Clock, 
  Crown, 
  ShieldCheck, 
  ChevronRight, 
  Search, 
  Filter, 
  Download, 
  BellRing, 
  Sparkles, 
  X, 
  CheckCircle2, 
  AlertTriangle,
  GraduationCap,
  ArrowLeft
} from 'lucide-react';
import { AttendanceSession, Assignment, Submission, User } from '../../types';

export const SubjectsView: React.FC = () => {
  const { 
    currentClass, 
    allUsers, 
    assignments, 
    submissions, 
    attendanceSessions, 
    currentUser,
    assignSubjectCR, 
    showToast,
    remindPendingStudents 
  } = useStudySync();

  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [studentSearch, setStudentSearch] = useState('');
  const [studentFilter, setStudentFilter] = useState<'all' | 'at_risk' | 'pending_sub'>('all');
  const [sentNudgeStudents, setSentNudgeStudents] = useState<Record<string, boolean>>({});
  const [sentNudgeSubjects, setSentNudgeSubjects] = useState<Record<string, boolean>>({});

  const subjects = currentClass?.subjects || [];
  const subjectConfigs = currentClass?.subjectConfigs || {};
  const studentList = allUsers.filter(u => u.role === 'Student');

  // Handle ESC key to go back from student inspection modal
  React.useEffect(() => {
    if (!selectedSubject) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedSubject(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedSubject]);

  // Compute metrics for a given subject
  const getSubjectMetrics = (subjName: string) => {
    const config = subjectConfigs[subjName] || {
      name: subjName,
      code: `SUBJ-${subjName.slice(0, 3).toUpperCase()}`,
      facultyName: 'Faculty In-Charge',
      room: 'Main Hall',
      color: '#0095F6'
    };

    const subjAssignments = assignments.filter(a => a.subject === subjName);
    const subjSessions = attendanceSessions.filter(s => s.subject === subjName);

    // Calculate average attendance for this subject
    let totalPossible = subjSessions.length * studentList.length;
    let totalPresent = 0;
    subjSessions.forEach(sess => {
      sess.records.forEach(r => {
        if (r.status === 'present' || r.status === 'late') {
          totalPresent += 1;
        }
      });
    });
    const avgAttendance = totalPossible > 0 ? Math.round((totalPresent / totalPossible) * 100) : 100;

    // Calculate submission rate for this subject
    const totalSubsNeeded = subjAssignments.length * studentList.length;
    let completedSubs = 0;
    subjAssignments.forEach(asg => {
      const subs = submissions.filter(s => s.assignmentId === asg.id && s.status === 'submitted');
      completedSubs += subs.length;
    });
    const submissionRate = totalSubsNeeded > 0 ? Math.round((completedSubs / totalSubsNeeded) * 100) : 100;
    const pendingSubsCount = Math.max(0, totalSubsNeeded - completedSubs);

    const designatedCr = studentList.find(s => s.id === config.crStudentId) || null;

    return {
      config,
      subjAssignments,
      subjSessions,
      avgAttendance,
      submissionRate,
      pendingSubsCount,
      designatedCr
    };
  };

  // Inspect students for the active subject
  const activeSubjectData = selectedSubject ? getSubjectMetrics(selectedSubject) : null;

  const filteredStudents = studentList.filter(stu => {
    const matchesSearch = 
      stu.name.toLowerCase().includes(studentSearch.toLowerCase()) ||
      (stu.rollNo && stu.rollNo.toLowerCase().includes(studentSearch.toLowerCase())) ||
      stu.email.toLowerCase().includes(studentSearch.toLowerCase());

    if (!matchesSearch) return false;
    if (!selectedSubject || !activeSubjectData) return true;

    // Attendance compliance for this student in this subject
    const stuSessions = activeSubjectData.subjSessions.flatMap(s => s.records.filter(r => r.studentId === stu.id));
    const attended = stuSessions.filter(r => r.status === 'present' || r.status === 'late').length;
    const attPct = stuSessions.length > 0 ? Math.round((attended / stuSessions.length) * 100) : 100;

    // Submissions for this student in this subject
    const stuPending = activeSubjectData.subjAssignments.some(asg => {
      const sub = submissions.find(s => s.assignmentId === asg.id && s.studentId === stu.id);
      return sub?.status !== 'submitted';
    });

    if (studentFilter === 'at_risk') return attPct < 75 && stuSessions.length > 0;
    if (studentFilter === 'pending_sub') return stuPending;
    return true;
  });

  return (
    <div className="p-4 lg:p-7 space-y-6 max-w-6xl mx-auto animate-in fade-in duration-150">
      {/* ── Top Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-black dark:text-white tracking-tight">
              Subject Directory & Subject CRs
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#0095F6]/10 text-[#0095F6] border border-[#0095F6]/30">
              {subjects.length} Subjects
            </span>
          </div>
          <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-0.5">
            Inspect student compliance per subject, manage subject representatives, and monitor classroom velocity.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-3 py-1.5 rounded-xl bg-white dark:bg-[#121212] border border-[#DBDBDB] dark:border-[#262626] text-xs font-semibold text-black dark:text-white flex items-center gap-2">
            <Users className="w-4 h-4 text-[#0095F6]" />
            <span>{studentList.length} Cohort Students</span>
          </div>
        </div>
      </div>

      {/* ── Subjects Grid ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {subjects.map(subjName => {
          const m = getSubjectMetrics(subjName);
          const accentColor = m.config.color || '#0095F6';

          return (
            <div 
              key={subjName}
              className="ui-card p-5 space-y-4 hover:border-neutral-400 dark:hover:border-neutral-600 transition-all flex flex-col justify-between group"
            >
              <div className="space-y-3">
                {/* Header with Color Pill & Code */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span 
                      className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md uppercase tracking-wider"
                      style={{ backgroundColor: `${accentColor}18`, color: accentColor }}
                    >
                      {m.config.code || 'COURSE'}
                    </span>
                    <h3 className="font-bold text-base text-black dark:text-white mt-1.5 tracking-tight group-hover:text-[#0095F6] transition-colors">
                      {subjName}
                    </h3>
                  </div>

                  <div className="w-8 h-8 rounded-lg bg-neutral-100 dark:bg-[#1A1A1A] flex items-center justify-center shrink-0 text-black dark:text-white">
                    <BookOpen className="w-4 h-4" />
                  </div>
                </div>

                {/* Faculty & Venue Details */}
                <div className="text-xs text-neutral-500 dark:text-neutral-400 space-y-0.5">
                  <p className="flex items-center gap-1.5 font-medium text-black dark:text-neutral-200">
                    <GraduationCap className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                    <span>{m.config.facultyName || 'Department Faculty'}</span>
                  </p>
                  <p className="pl-5 text-[11px] text-neutral-400">
                    Venue: {m.config.room || 'Lecture Hall'}
                  </p>
                </div>

                {/* Designated Subject CR Badge */}
                <div className="p-2.5 rounded-xl bg-neutral-50 dark:bg-[#161616] border border-[#DBDBDB] dark:border-[#262626] flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-6 h-6 rounded-full bg-amber-500/15 text-amber-500 flex items-center justify-center text-[10px] font-bold shrink-0">
                      <Crown className="w-3 h-3" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-[10px] text-neutral-400 block font-semibold uppercase tracking-wider">
                        Subject CR
                      </span>
                      <span className="text-xs font-bold text-black dark:text-white truncate block">
                        {m.designatedCr ? m.designatedCr.name : 'Unassigned'}
                      </span>
                    </div>
                  </div>

                  {currentUser.role === 'CR' && (
                    <button
                      onClick={() => setSelectedSubject(subjName)}
                      className="text-[11px] font-semibold text-[#0095F6] hover:underline shrink-0"
                    >
                      {m.designatedCr ? 'Change' : 'Assign'}
                    </button>
                  )}
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-2 gap-2 pt-1 border-t border-[#DBDBDB] dark:border-[#262626] text-xs">
                  <div>
                    <span className="text-[10px] text-neutral-400 block uppercase font-medium">Avg Attendance</span>
                    <span className={`font-mono font-bold ${m.avgAttendance >= 75 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-500'}`}>
                      {m.avgAttendance}%
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-neutral-400 block uppercase font-medium">Submission Rate</span>
                    <span className="font-mono font-bold text-black dark:text-white">
                      {m.submissionRate}%
                    </span>
                  </div>
                </div>
              </div>

                {/* Action Buttons: Look on Students & Remind Pending */}
                <div className="space-y-2 mt-4">
                  {m.pendingSubsCount > 0 && currentUser.role === 'CR' && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        try { navigator.vibrate?.(50); } catch {}
                        m.subjAssignments.forEach(asg => remindPendingStudents(asg.id));
                        setSentNudgeSubjects(prev => ({ ...prev, [subjName]: true }));
                        setTimeout(() => setSentNudgeSubjects(prev => ({ ...prev, [subjName]: false })), 2000);
                      }}
                      className={`w-full py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                        sentNudgeSubjects[subjName]
                          ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/40 shadow-[0_0_8px_#22c55e]'
                          : 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30'
                      }`}
                      title={`Remind all pending students in ${subjName}`}
                    >
                      <BellRing className="w-3.5 h-3.5" />
                      <span>{sentNudgeSubjects[subjName] ? '✓ Reminders Dispatched!' : `Remind Pending (${m.pendingSubsCount})`}</span>
                    </button>
                  )}

                  <button
                    onClick={() => setSelectedSubject(subjName)}
                    className="w-full py-2.5 px-3 rounded-xl bg-neutral-100 dark:bg-[#1A1A1A] hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black text-black dark:text-white text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-xs cursor-pointer"
                  >
                    <span>Look on Students ({studentList.length})</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
            </div>
          );
        })}
      </div>

      {/* ── Modal / Inspector Drawer: Look on Students for Selected Subject ── */}
      {selectedSubject && activeSubjectData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-md animate-in fade-in">
          <div className="bg-white dark:bg-[#121212] border border-[#DBDBDB] dark:border-[#262626] rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            
            {/* Modal Header */}
            <div className="p-5 border-b border-[#DBDBDB] dark:border-[#262626] flex items-center justify-between bg-neutral-50/50 dark:bg-[#161616]/50">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setSelectedSubject(null)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-100 dark:bg-[#262626] hover:bg-neutral-200 dark:hover:bg-[#363636] text-black dark:text-white text-xs font-semibold transition-all cursor-pointer shadow-xs active:scale-95 shrink-0"
                  title="Back to Subjects (Esc)"
                >
                  <ArrowLeft className="w-3.5 h-3.5 stroke-[2.3]" />
                  <span>Back to Subjects</span>
                </button>
                <div 
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm shrink-0"
                  style={{ backgroundColor: activeSubjectData.config.color || '#0095F6' }}
                >
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-base sm:text-lg font-bold text-black dark:text-white">
                      {selectedSubject}
                    </h2>
                    <span className="text-xs font-mono px-2 py-0.5 rounded bg-neutral-200 dark:bg-[#262626] font-semibold text-neutral-700 dark:text-neutral-300">
                      {activeSubjectData.config.code}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    Faculty: {activeSubjectData.config.facultyName} · {activeSubjectData.config.room}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {currentUser.role === 'CR' && activeSubjectData.pendingSubsCount > 0 && (
                  <button
                    onClick={() => {
                      try { navigator.vibrate?.(50); } catch {}
                      activeSubjectData.subjAssignments.forEach(asg => remindPendingStudents(asg.id));
                      setSentNudgeSubjects(prev => ({ ...prev, [selectedSubject]: true }));
                      setTimeout(() => setSentNudgeSubjects(prev => ({ ...prev, [selectedSubject]: false })), 2000);
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                      sentNudgeSubjects[selectedSubject]
                        ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/40 shadow-[0_0_8px_#22c55e]'
                        : 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30'
                    }`}
                    title="Remind all pending students in this subject"
                  >
                    <BellRing className="w-3.5 h-3.5" />
                    <span>{sentNudgeSubjects[selectedSubject] ? '✓ Dispatched!' : 'Remind All Pending'}</span>
                  </button>
                )}
                <button
                  onClick={() => setSelectedSubject(null)}
                  className="p-2 rounded-xl text-neutral-400 hover:text-black dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-[#262626] transition-colors cursor-pointer"
                  title="Close (Esc)"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Subject CR Designation Bar */}
            <div className="px-5 py-3 bg-neutral-100/70 dark:bg-[#181818] border-b border-[#DBDBDB] dark:border-[#262626] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 flex-wrap">
                <Crown className="w-4 h-4 text-amber-500 shrink-0" />
                <span>Current Subject CR:</span>
                <strong className="text-black dark:text-white font-semibold">
                  {activeSubjectData.designatedCr ? activeSubjectData.designatedCr.name : 'None Assigned'}
                </strong>
                {activeSubjectData.designatedCr && (
                  <span className="text-[10px] font-mono text-neutral-400">
                    ({activeSubjectData.designatedCr.rollNo})
                  </span>
                )}
                {/* Remind option if the assigned Subject CR has pending assignment */}
                {activeSubjectData.designatedCr && (() => {
                  const crId = activeSubjectData.designatedCr.id;
                  const crPendingAsgs = activeSubjectData.subjAssignments.filter(a => {
                    const s = submissions.find(sub => sub.assignmentId === a.id && sub.studentId === crId);
                    return s?.status !== 'submitted';
                  });
                  if (crPendingAsgs.length > 0) {
                    return (
                      <div className="flex items-center gap-1.5 ml-2">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/30">
                          {crPendingAsgs.length} pending task{crPendingAsgs.length > 1 ? 's' : ''}
                        </span>
                        {currentUser.role === 'CR' && (
                          <button
                            onClick={() => {
                              try { navigator.vibrate?.(50); } catch {}
                              crPendingAsgs.forEach(a => remindPendingStudents(a.id, undefined, crId));
                              setSentNudgeStudents(prev => ({ ...prev, [crId]: true }));
                              setTimeout(() => setSentNudgeStudents(prev => ({ ...prev, [crId]: false })), 2000);
                            }}
                            className={`px-2 py-1 rounded-lg text-[10px] font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                              sentNudgeStudents[crId]
                                ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/40 shadow-[0_0_8px_#22c55e]'
                                : 'bg-amber-500/15 text-amber-600 dark:text-amber-400 hover:bg-amber-500/25 border border-amber-500/30'
                            }`}
                            title={`Remind Subject CR ${activeSubjectData.designatedCr?.name}`}
                          >
                            <BellRing className="w-3 h-3" />
                            <span>{sentNudgeStudents[crId] ? '✓ Sent!' : 'Remind CR'}</span>
                          </button>
                        )}
                      </div>
                    );
                  }
                  return (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 ml-2">
                      All submitted ✓
                    </span>
                  );
                })()}
              </div>

              {currentUser.role === 'CR' && (
                <div className="flex items-center gap-2">
                  <span className="text-neutral-500">Designate CR:</span>
                  <select
                    value={activeSubjectData.designatedCr?.id || ''}
                    onChange={(e) => {
                      const selected = studentList.find(s => s.id === e.target.value);
                      if (selected) {
                        assignSubjectCR(selectedSubject, selected.id, selected.name);
                      }
                    }}
                    className="text-xs px-2.5 py-1.5 rounded-lg border border-[#DBDBDB] dark:border-[#262626] bg-white dark:bg-[#121212] text-black dark:text-white focus:outline-none focus:border-[#0095F6]"
                  >
                    <option value="">Select student...</option>
                    {studentList.map(stu => (
                      <option key={stu.id} value={stu.id}>
                        {stu.name} ({stu.rollNo})
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* Search & Filter Bar */}
            <div className="p-4 border-b border-[#DBDBDB] dark:border-[#262626] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="relative flex-1 max-w-sm">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input
                  type="text"
                  value={studentSearch}
                  onChange={(e) => setStudentSearch(e.target.value)}
                  placeholder="Search students by name or roll number..."
                  className="w-full text-xs pl-9 pr-3 py-2 rounded-xl border border-[#DBDBDB] dark:border-[#262626] bg-neutral-50 dark:bg-[#181818] text-black dark:text-white placeholder-neutral-400 focus:outline-none focus:border-[#0095F6]"
                />
              </div>

              <div className="flex items-center gap-2">
                <div className="flex rounded-lg bg-neutral-100 dark:bg-[#181818] p-0.5 border border-[#DBDBDB] dark:border-[#262626] text-xs font-semibold">
                  <button
                    onClick={() => setStudentFilter('all')}
                    className={`px-3 py-1 rounded-md transition-all ${
                      studentFilter === 'all'
                        ? 'bg-black dark:bg-white text-white dark:text-black font-bold'
                        : 'text-neutral-500 hover:text-black dark:hover:text-white'
                    }`}
                  >
                    All ({studentList.length})
                  </button>
                  <button
                    onClick={() => setStudentFilter('at_risk')}
                    className={`px-3 py-1 rounded-md transition-all ${
                      studentFilter === 'at_risk'
                        ? 'bg-rose-500 text-white font-bold'
                        : 'text-neutral-500 hover:text-rose-500'
                    }`}
                  >
                    Defaulters (&lt;75%)
                  </button>
                  <button
                    onClick={() => setStudentFilter('pending_sub')}
                    className={`px-3 py-1 rounded-md transition-all ${
                      studentFilter === 'pending_sub'
                        ? 'bg-amber-500 text-white font-bold'
                        : 'text-neutral-500 hover:text-amber-500'
                    }`}
                  >
                    Pending Submissions
                  </button>
                </div>
              </div>
            </div>

            {/* Students List Table */}
            <div className="flex-1 overflow-y-auto divide-y divide-[#EFEFEF] dark:divide-[#262626]">
              {filteredStudents.length === 0 ? (
                <div className="p-12 text-center text-xs text-neutral-400 space-y-2">
                  <p className="font-semibold text-black dark:text-white">No students match filter criteria.</p>
                  <p>Try clearing search or switching filter tabs.</p>
                </div>
              ) : (
                filteredStudents.map(stu => {
                  const isCrForThis = activeSubjectData.config.crStudentId === stu.id;

                  // Student attendance for this subject
                  const stuRecords = activeSubjectData.subjSessions.flatMap(sess =>
                    sess.records.filter(r => r.studentId === stu.id)
                  );
                  const presentCount = stuRecords.filter(r => r.status === 'present' || r.status === 'late').length;
                  const attPct = stuRecords.length > 0 ? Math.round((presentCount / stuRecords.length) * 100) : 100;
                  const isDefaulter = attPct < 75 && stuRecords.length > 0;

                  // Student submissions for this subject
                  const subjAsgIds = activeSubjectData.subjAssignments.map(a => a.id);
                  const stuSubs = submissions.filter(s => subjAsgIds.includes(s.assignmentId) && s.studentId === stu.id);
                  const submittedCount = stuSubs.filter(s => s.status === 'submitted').length;
                  const totalAsg = activeSubjectData.subjAssignments.length;
                  const pendingCount = Math.max(0, totalAsg - submittedCount);

                  return (
                    <div 
                      key={stu.id}
                      className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-neutral-50 dark:hover:bg-[#181818] transition-colors"
                    >
                      {/* Student Info */}
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-9 h-9 rounded-full bg-neutral-200 dark:bg-[#262626] text-black dark:text-white flex items-center justify-center font-bold text-xs shrink-0">
                          {stu.name.charAt(0)}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs sm:text-sm text-black dark:text-white truncate">
                              {stu.name}
                            </span>
                            {isCrForThis && (
                              <span className="px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center gap-1 border border-amber-500/30 shrink-0">
                                <Crown className="w-2.5 h-2.5" />
                                Subject CR
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-neutral-400 font-mono">
                            {stu.rollNo} · {stu.email}
                          </p>
                        </div>
                      </div>

                      {/* Compliance Stats & Action */}
                      <div className="flex items-center gap-4 text-xs">
                        {/* Attendance Pill */}
                        <div className="text-right">
                          <span className="text-[10px] text-neutral-400 block uppercase font-medium">
                            Attendance
                          </span>
                          <span className={`font-mono font-bold ${isDefaulter ? 'text-rose-500' : 'text-emerald-600 dark:text-emerald-400'}`}>
                            {attPct}% ({presentCount}/{stuRecords.length})
                          </span>
                        </div>

                        {/* Submission Pill */}
                        <div className="text-right">
                          <span className="text-[10px] text-neutral-400 block uppercase font-medium">
                            Tasks
                          </span>
                          <span className={`font-mono font-bold ${pendingCount > 0 ? 'text-amber-500' : 'text-neutral-700 dark:text-neutral-300'}`}>
                            {submittedCount}/{totalAsg} submitted
                          </span>
                        </div>

                        {/* Quick Nudge / Designate */}
                        {currentUser.role === 'CR' && (
                          <div className="flex items-center gap-1.5 pl-2 border-l border-[#DBDBDB] dark:border-[#262626]">
                            {!isCrForThis && (
                              <button
                                onClick={() => assignSubjectCR(selectedSubject, stu.id, stu.name)}
                                title="Make this student the Subject CR"
                                className="px-2 py-1 rounded-lg border border-[#DBDBDB] dark:border-[#262626] text-[11px] font-semibold text-neutral-600 dark:text-neutral-300 hover:text-black dark:hover:text-white hover:border-[#0095F6] transition-colors"
                              >
                                Set CR
                              </button>
                            )}

                            {pendingCount > 0 && (
                              <button
                                onClick={() => {
                                  try { navigator.vibrate?.(50); } catch {}
                                  const pendingAsgs = activeSubjectData.subjAssignments.filter(a => {
                                    const s = submissions.find(sub => sub.assignmentId === a.id && sub.studentId === stu.id);
                                    return s?.status !== 'submitted';
                                  });
                                  if (pendingAsgs.length > 0) {
                                    pendingAsgs.forEach(a => remindPendingStudents(a.id, undefined, stu.id));
                                  } else {
                                    showToast(`Reminder sent to ${stu.name}`, 'info');
                                  }
                                  setSentNudgeStudents(prev => ({ ...prev, [stu.id]: true }));
                                  setTimeout(() => {
                                    setSentNudgeStudents(prev => ({ ...prev, [stu.id]: false }));
                                  }, 2000);
                                }}
                                title={`Send submission reminder to ${stu.name} (${pendingCount} pending)`}
                                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                                  sentNudgeStudents[stu.id]
                                    ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/40 shadow-[0_0_8px_#22c55e]'
                                    : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 hover:bg-amber-500/20 border border-amber-500/30'
                                }`}
                              >
                                <BellRing className="w-3.5 h-3.5" />
                                <span>{sentNudgeStudents[stu.id] ? '✓ Sent!' : `Remind (${pendingCount})`}</span>
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-[#DBDBDB] dark:border-[#262626] bg-neutral-50/50 dark:bg-[#161616]/50 flex items-center justify-between text-xs">
              <span className="text-neutral-500">
                Showing {filteredStudents.length} of {studentList.length} enrolled students
              </span>

              <button
                onClick={() => setSelectedSubject(null)}
                className="px-4 py-2 rounded-xl bg-black dark:bg-white text-white dark:text-black text-xs font-bold hover:opacity-90 transition-opacity"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
