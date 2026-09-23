import React, { useState, useRef } from 'react';
import { useStudySync } from '../../store';
import { 
  Plus, 
  Search, 
  UploadCloud, 
  X,
  Sparkles,
  Repeat,
  AlertTriangle,
  Clock,
  Loader2,
  Calendar,
  Download,
  FileCheck2,
  BellRing,
  FileText
} from 'lucide-react';
import { Modal } from '../common/Feedback';
import { generateAssignmentsICS, downloadICSFile } from '../../utils/calendarExport';

export const AssignmentsView: React.FC = () => {
  const { 
    currentUser, 
    currentClass, 
    allUsers, 
    assignments, 
    submissions, 
    selectedAssignmentId, 
    setSelectedAssignmentId, 
    setIsRightPanelOpen,
    isNewAssignmentModalOpen,
    setIsNewAssignmentModalOpen,
    createAssignment,
    markAssignmentViewed,
    remindPendingStudents,
    showToast
  } = useStudySync();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'deadline' | 'posted' | 'title'>('deadline');

  // Form state for new assignment
  const [newTitle, setNewTitle] = useState('');
  const [newSubject, setNewSubject] = useState(currentClass.subjects[0] || 'General');
  const [newDesc, setNewDesc] = useState('');
  const [newDeadlineDate, setNewDeadlineDate] = useState('');
  const [newDeadlineTime, setNewDeadlineTime] = useState('23:59');
  const [newFileName, setNewFileName] = useState('');
  const [newFileSize, setNewFileSize] = useState('');
  const [notifyToggle, setNotifyToggle] = useState(true);
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurrenceRule, setRecurrenceRule] = useState<'weekly' | 'biweekly'>('weekly');
  const [isPublishing, setIsPublishing] = useState(false);
  const [activeSummaryId, setActiveSummaryId] = useState<string | null>(null);

  // Feature 1: AI Nudge Scheduler state
  const [smartNudgeScheduled, setSmartNudgeScheduled] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    try {
      assignments.forEach(a => {
        if (localStorage.getItem('ai_nudge_' + a.id) === 'true') {
          initial[a.id] = true;
        }
      });
    } catch {}
    return initial;
  });

  const handleToggleSmartNudge = (asgId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const nextVal = !smartNudgeScheduled[asgId];
    setSmartNudgeScheduled(prev => ({ ...prev, [asgId]: nextVal }));
    try {
      if (nextVal) {
        localStorage.setItem('ai_nudge_' + asgId, 'true');
      } else {
        localStorage.removeItem('ai_nudge_' + asgId);
      }
    } catch {}
    showToast('Nudge auto-scheduled for 24h before deadline if <60% submitted', 'info');
  };

  // Nudge button micro-interactions
  const [sentNudges, setSentNudges] = useState<Record<string, boolean>>({});

  const handleDirectNudge = (asgId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try { navigator.vibrate?.(50); } catch {}
    remindPendingStudents(asgId);
    setSentNudges(prev => ({ ...prev, [asgId]: true }));
    setTimeout(() => {
      setSentNudges(prev => ({ ...prev, [asgId]: false }));
    }, 2000);
  };

  // Mobile swipe-left gesture (Priority 5)
  const [swipedRowId, setSwipedRowId] = useState<string | null>(null);
  const rowTouchStartX = useRef<number>(0);

  const handleRowTouchStart = (e: React.TouchEvent) => {
    rowTouchStartX.current = e.touches[0].clientX;
  };

  const handleRowTouchMove = (asgId: string, e: React.TouchEvent) => {
    const currentX = e.touches[0].clientX;
    const diff = currentX - rowTouchStartX.current;
    if (diff < -60) {
      setSwipedRowId(asgId);
    } else if (diff > 20) {
      setSwipedRowId(null);
    }
  };

  const handleRowTouchEnd = () => {
    rowTouchStartX.current = 0;
  };

  const totalStudents = allUsers.filter(u => u.role === 'Student').length;

  const handleApplySmartDeadline = () => {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 5);
    const dateString = targetDate.toISOString().split('T')[0];
    setNewDeadlineDate(dateString);
    setNewDeadlineTime('23:59');
    showToast('AI Smart Suggestion: Set 5-day deadline based on cohort turnaround history.', 'info');
  };

  const filteredAssignments = assignments
    .filter(a => {
      const matchQuery = a.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         a.subject.toLowerCase().includes(searchQuery.toLowerCase());
      const matchSubject = selectedSubject === 'all' || a.subject === selectedSubject;
      const matchStatus = selectedStatus === 'all' || a.status === selectedStatus;
      return matchQuery && matchSubject && matchStatus;
    })
    .sort((a, b) => {
      if (sortBy === 'deadline') {
        return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
      }
      if (sortBy === 'posted') {
        return new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime();
      }
      return a.title.localeCompare(b.title);
    });

  const handleCreateAssignmentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDeadlineDate) return;

    setIsPublishing(true);
    // Simulate optimistic creation delay
    await new Promise(r => setTimeout(r, 400));

    const fullDeadline = new Date(`${newDeadlineDate}T${newDeadlineTime || '23:59'}:00`).toISOString();

    createAssignment({
      title: newTitle.trim(),
      subject: newSubject,
      description: newDesc.trim() || 'No additional instructions provided.',
      deadline: fullDeadline,
      fileName: newFileName || undefined,
      fileSize: newFileSize || undefined,
      notifyOnCreate: notifyToggle,
      isRecurring,
      recurrenceRule: isRecurring ? recurrenceRule : undefined
    });

    setIsPublishing(false);
    setIsNewAssignmentModalOpen(false);
    setNewTitle('');
    setNewDesc('');
    setNewDeadlineDate('');
    setNewFileName('');
    setNewFileSize('');
    setIsRecurring(false);
  };

  const handleSelectRow = (id: string) => {
    setSelectedAssignmentId(id);
    if (currentUser.role === 'Student') {
      markAssignmentViewed(id);
    }
    setIsRightPanelOpen(true);
  };

  return (
    <div className="p-4 lg:p-7 space-y-6 max-w-6xl mx-auto">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl lg:text-2xl font-bold text-black dark:text-white tracking-tight">
            Assignments Hub
          </h1>
          <p className="text-xs sm:text-sm text-[#8E8E8E] mt-0.5">
            Manage course problem sets, lab reports, and verify submissions.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => {
              const icsContent = generateAssignmentsICS(assignments, currentClass.name);
              downloadICSFile(icsContent, `${currentClass.name.toLowerCase().replace(/\s+/g, '-')}-assignments.ics`);
              showToast('Exported calendar (.ics) with reminder alarms!', 'success');
            }}
            className="btn-secondary text-xs"
            title="Download iCalendar format for Apple Calendar, Google Calendar, Outlook"
          >
            <Download className="w-3.5 h-3.5 text-[#0095F6]" />
            <span>Sync iCal</span>
          </button>

          {currentUser.role === 'CR' && (
            <button
              onClick={() => setIsNewAssignmentModalOpen(true)}
              className="btn-primary text-xs"
            >
              <Plus className="w-4 h-4" />
              <span>New Assignment</span>
            </button>
          )}
        </div>
      </div>

      {/* Pace Alert for CR */}
      {currentUser.role === 'CR' && assignments.length > 0 && (
        <div className="p-3.5 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-start gap-3">
          <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
          <div className="text-xs">
            <span className="font-semibold text-amber-600 dark:text-amber-400">Pace Alert: Late Submission Predictor</span>
            <p className="text-[#737373] dark:text-[#A8A8A8] mt-0.5 leading-relaxed">
              At current submission velocity, <strong>14 students</strong> are projected to miss the upcoming deadline. A broadcast nudge has been prepared.
            </p>
          </div>
        </div>
      )}

      {/* Filters & Search Row */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#8E8E8E] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search assignments by title or subject..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-[#DBDBDB] dark:border-[#262626] bg-white dark:bg-[#121212] text-black dark:text-white focus:outline-none focus:border-[#0095F6] shadow-2xs"
          />
        </div>

        {/* Subject Filter */}
        <select
          value={selectedSubject}
          onChange={(e) => setSelectedSubject(e.target.value)}
          className="text-xs px-3 py-2 rounded-lg border border-[#DBDBDB] dark:border-[#262626] bg-white dark:bg-[#121212] text-black dark:text-white focus:outline-none focus:border-[#0095F6] shadow-2xs"
        >
          <option value="all">All Subjects</option>
          {currentClass.subjects.map(s => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>

        {/* Status Filter */}
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="text-xs px-3 py-2 rounded-lg border border-[#DBDBDB] dark:border-[#262626] bg-white dark:bg-[#121212] text-black dark:text-white focus:outline-none focus:border-[#0095F6] shadow-2xs"
        >
          <option value="all">All Statuses</option>
          <option value="active">Active</option>
          <option value="closed">Closed</option>
        </select>
      </div>

      {/* Table / List of Assignments */}
      <div className="bg-white dark:bg-[#121212] border border-[#DBDBDB] dark:border-[#262626] rounded-xl shadow-xs overflow-hidden">
        {filteredAssignments.length === 0 ? (
          <div className="py-16 text-center flex flex-col items-center justify-center p-6 space-y-2">
            <FileText className="w-8 h-8 text-[#3A3A3A] mx-auto mb-1" />
            <p className="text-sm font-semibold text-[#3A3A3A]">
              No assignments yet. Create one above. ✏️
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#DBDBDB] dark:border-[#262626] bg-[#FAFAFA] dark:bg-[#181818] text-[10px] font-semibold text-[#8E8E8E] uppercase tracking-wider">
                  <th className="py-3 px-4 sm:px-6">Title & Subject</th>
                  <th className="py-3 px-4">Posted Date</th>
                  <th className="py-3 px-4">Deadline</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 sm:px-6 text-right">
                    {currentUser.role === 'CR' ? 'Submissions & Nudge' : 'My Status'}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EFEFEF] dark:divide-[#262626] text-xs">
                {filteredAssignments.map(asg => {
                  const isSelected = selectedAssignmentId === asg.id;
                  const asgSubs = submissions.filter(s => s.assignmentId === asg.id && s.status === 'submitted');
                  const isOverdue = new Date(asg.deadline).getTime() < new Date().getTime();
                  const mySub = submissions.find(s => s.assignmentId === asg.id && s.studentId === currentUser.id);

                  // Feature 1: AI Nudge Scheduler logic
                  const timeRemainingHours = (new Date(asg.deadline).getTime() - Date.now()) / (1000 * 60 * 60);
                  const submissionRate = totalStudents > 0 ? asgSubs.length / totalStudents : 0;
                  const isAutoEligible = timeRemainingHours > 0 && timeRemainingHours < 24 && submissionRate < 0.6;
                  const isScheduled = isAutoEligible || smartNudgeScheduled[asg.id];
                  const pendingCount = Math.max(0, totalStudents - asgSubs.length);
                  const isNudgeSent = sentNudges[asg.id];
                  const isSwiped = swipedRowId === asg.id;

                  return (
                    <React.Fragment key={asg.id}>
                      <tr
                        onClick={() => handleSelectRow(asg.id)}
                        onTouchStart={handleRowTouchStart}
                        onTouchMove={(e) => handleRowTouchMove(asg.id, e)}
                        onTouchEnd={handleRowTouchEnd}
                        style={{
                          transform: isSwiped ? 'translateX(-80px)' : 'none',
                          transition: 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
                        }}
                        className={`cursor-pointer transition-colors relative ${
                          isSelected
                            ? 'bg-[#0095F6]/10 font-medium'
                            : 'hover:bg-[#FAFAFA] dark:hover:bg-[#181818]'
                        }`}
                      >
                        {/* Title & Subject */}
                        <td className="py-3.5 px-4 sm:px-6">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-sm text-black dark:text-white truncate max-w-xs sm:max-w-md">
                              {asg.title}
                            </span>
                            {asg.isRecurring && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-[#EFEFEF] dark:bg-[#262626] text-black dark:text-white">
                                <Repeat className="w-3 h-3" />
                                <span>Weekly</span>
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 mt-1 flex-wrap">
                            <span className="text-[10px] font-semibold text-[#0095F6]">
                              {asg.subject}
                            </span>

                            {/* Feature 1: AI Scheduled badge */}
                            {isScheduled && (
                              <span
                                onClick={(e) => {
                                  e.stopPropagation();
                                  showToast('Nudge auto-scheduled for 24h before deadline if <60% submitted', 'info');
                                }}
                                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#0095F6]/15 text-[#0095F6] border border-[#0095F6]/30 cursor-pointer shadow-2xs"
                                title="Nudge auto-scheduled for 24h before deadline if <60% submitted"
                              >
                                AI Scheduled ✦
                              </span>
                            )}

                            {/* Feature 1: 🤖 Smart Nudge Button (CR Only) */}
                            {currentUser.role === 'CR' && (
                              <button
                                type="button"
                                onClick={(e) => handleToggleSmartNudge(asg.id, e)}
                                className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold border border-[#DBDBDB] dark:border-[#262626] bg-[#FAFAFA] dark:bg-[#1A1A1A] hover:border-[#0095F6] text-black dark:text-white transition-colors cursor-pointer"
                                title="Nudge auto-scheduled for 24h before deadline if <60% submitted"
                              >
                                <span>🤖 Smart Nudge</span>
                              </button>
                            )}

                            {asg.aiSummary && (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setActiveSummaryId(activeSummaryId === asg.id ? null : asg.id);
                                }}
                                className="inline-flex items-center gap-1 text-[10px] font-medium text-[#8E8E8E] hover:text-[#0095F6] transition-colors cursor-pointer"
                              >
                                <Sparkles className="w-3 h-3" />
                                <span>{activeSummaryId === asg.id ? 'Hide TL;DR' : 'AI Summary'}</span>
                              </button>
                            )}
                          </div>
                        </td>

                        {/* Posted */}
                        <td className="py-3.5 px-4 text-[#8E8E8E] font-mono">
                          {new Date(asg.postedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                        </td>

                        {/* Deadline */}
                        <td className="py-3.5 px-4 font-mono">
                          <span className={isOverdue && asg.status === 'active' ? 'text-[#ED4956] font-semibold' : 'text-black dark:text-white'}>
                            {new Date(asg.deadline).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </td>

                        {/* Status pill */}
                        <td className="py-3.5 px-4">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider ${
                              asg.status === 'closed'
                                ? 'bg-[#EFEFEF] dark:bg-[#262626] text-[#8E8E8E]'
                                : isOverdue
                                ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                                : 'bg-[#0095F6]/10 text-[#0095F6]'
                            }`}
                          >
                            {asg.status === 'closed' ? 'Closed' : isOverdue ? 'Overdue' : 'Active'}
                          </span>
                        </td>

                        {/* Submissions or My status + Priority 4 Nudge button */}
                        <td className="py-3.5 px-4 sm:px-6 text-right">
                          {currentUser.role === 'CR' ? (
                            <div className="flex items-center justify-end gap-2">
                              <span className="font-mono font-semibold text-black dark:text-white">
                                {asgSubs.length}/{totalStudents}
                              </span>
                              {pendingCount > 0 && (
                                <button
                                  type="button"
                                  onClick={(e) => handleDirectNudge(asg.id, e)}
                                  className={`px-2.5 py-1 rounded-md text-[11px] font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                                    isNudgeSent
                                      ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/40 shadow-[0_0_8px_#22c55e]'
                                      : 'border border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400'
                                  }`}
                                  title="Send nudge to pending students"
                                >
                                  <BellRing className="w-3 h-3" />
                                  <span>{isNudgeSent ? '✓ Sent!' : 'Nudge'}</span>
                                </button>
                              )}
                              {/* Mobile swiped reveal action */}
                              {isSwiped && (
                                <button
                                  type="button"
                                  onClick={(e) => handleDirectNudge(asg.id, e)}
                                  className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-[#0095F6] text-white transition-all shadow-xs cursor-pointer ml-1"
                                >
                                  Nudge
                                </button>
                              )}
                            </div>
                          ) : (
                            <span
                              className={`font-semibold capitalize ${
                                mySub?.status === 'submitted'
                                  ? 'text-emerald-600 dark:text-emerald-400'
                                  : mySub?.status === 'viewed'
                                  ? 'text-amber-600 dark:text-amber-400'
                                  : 'text-[#8E8E8E]'
                              }`}
                            >
                              {mySub?.status || 'Assigned'}
                            </span>
                          )}
                        </td>
                      </tr>

                      {/* Expandable AI TL;DR Summary row */}
                      {activeSummaryId === asg.id && asg.aiSummary && (
                        <tr className="bg-[#FAFAFA] dark:bg-[#181818] border-b border-[#DBDBDB] dark:border-[#262626]">
                          <td colSpan={5} className="p-4 px-6">
                            <div className="p-3 rounded-lg bg-white dark:bg-[#121212] border border-[#DBDBDB] dark:border-[#262626] space-y-1">
                              <div className="flex items-center gap-1.5 text-xs font-semibold text-[#0095F6]">
                                <Sparkles className="w-3.5 h-3.5" />
                                <span>AI 2-Line Assignment TL;DR</span>
                              </div>
                              <p className="text-xs text-black dark:text-white leading-relaxed">
                                {asg.aiSummary}
                              </p>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* NEW ASSIGNMENT MODAL (CR ONLY) */}
      <Modal
        isOpen={isNewAssignmentModalOpen}
        onClose={() => setIsNewAssignmentModalOpen(false)}
        title="Post New Class Assignment"
      >
        <form onSubmit={handleCreateAssignmentSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-black dark:text-white mb-1">
              Assignment Title
            </label>
            <input
              type="text"
              required
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="e.g. Fluid Mechanics Problem Set 3"
              className="w-full text-xs px-3 py-2.5 rounded-lg border border-[#DBDBDB] dark:border-[#262626] bg-[#FAFAFA] dark:bg-[#181818] text-black dark:text-white focus:outline-none focus:border-[#0095F6]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-black dark:text-white mb-1">
                Subject
              </label>
              <select
                value={newSubject}
                onChange={(e) => setNewSubject(e.target.value)}
                className="w-full text-xs px-3 py-2.5 rounded-lg border border-[#DBDBDB] dark:border-[#262626] bg-[#FAFAFA] dark:bg-[#181818] text-black dark:text-white focus:outline-none focus:border-[#0095F6]"
              >
                {currentClass.subjects.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-black dark:text-white">
                  Deadline Date & Time
                </label>
                <button
                  type="button"
                  onClick={handleApplySmartDeadline}
                  className="text-[10px] font-semibold text-[#0095F6] hover:underline flex items-center gap-1"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>AI Suggest</span>
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="date"
                  required
                  value={newDeadlineDate}
                  onChange={(e) => setNewDeadlineDate(e.target.value)}
                  className="w-full text-xs px-2.5 py-2.5 rounded-lg border border-[#DBDBDB] dark:border-[#262626] bg-[#FAFAFA] dark:bg-[#181818] text-black dark:text-white focus:outline-none focus:border-[#0095F6]"
                />
                <input
                  type="time"
                  required
                  value={newDeadlineTime}
                  onChange={(e) => setNewDeadlineTime(e.target.value)}
                  className="w-full text-xs px-2.5 py-2.5 rounded-lg border border-[#DBDBDB] dark:border-[#262626] bg-[#FAFAFA] dark:bg-[#181818] text-black dark:text-white focus:outline-none focus:border-[#0095F6]"
                />
              </div>
            </div>
          </div>

          {/* Recurring Assignment toggle */}
          <div className="p-3 rounded-lg bg-[#FAFAFA] dark:bg-[#181818] border border-[#DBDBDB] dark:border-[#262626] space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Repeat className="w-4 h-4 text-[#0095F6]" />
                <span className="text-xs font-semibold text-black dark:text-white">
                  Recurring Assignment Schedule
                </span>
              </div>
              <input
                type="checkbox"
                checked={isRecurring}
                onChange={(e) => setIsRecurring(e.target.checked)}
                className="w-4 h-4 text-[#0095F6] rounded"
              />
            </div>
            {isRecurring && (
              <div className="pt-2 border-t border-[#DBDBDB] dark:border-[#262626] flex items-center justify-between text-xs text-[#8E8E8E]">
                <span>Recurrence Cadence:</span>
                <select
                  value={recurrenceRule}
                  onChange={(e) => setRecurrenceRule(e.target.value as 'weekly' | 'biweekly')}
                  className="text-xs px-2 py-1 rounded border border-[#DBDBDB] dark:border-[#262626] bg-white dark:bg-[#121212] text-black dark:text-white"
                >
                  <option value="weekly">Every Friday 11:59 PM (Weekly)</option>
                  <option value="biweekly">Every 2 Weeks (Bi-weekly)</option>
                </select>
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-black dark:text-white mb-1">
              Instructions & Problem Specifications
            </label>
            <textarea
              rows={3}
              value={newDesc}
              onChange={(e) => setNewDesc(e.target.value)}
              placeholder="Outline problem numbers, format requirements, submission rules..."
              className="w-full text-xs p-3 rounded-lg border border-[#DBDBDB] dark:border-[#262626] bg-[#FAFAFA] dark:bg-[#181818] text-black dark:text-white focus:outline-none focus:border-[#0095F6] resize-none"
            />
          </div>

          {/* Attachment upload */}
          <div>
            <label className="block text-xs font-semibold text-black dark:text-white mb-1">
              Attach Reference Document (Optional)
            </label>
            <div 
              onClick={() => {
                setNewFileName('Assgn_Specification_Sheet.pdf');
                setNewFileSize('2.2 MB');
              }}
              className="border-2 border-dashed border-[#DBDBDB] dark:border-[#262626] rounded-xl p-4 text-center cursor-pointer hover:border-[#0095F6] transition-colors bg-[#FAFAFA] dark:bg-[#181818]"
            >
              {newFileName ? (
                <div className="flex items-center justify-between p-2 rounded bg-[#0095F6]/10 text-[#0095F6] text-xs font-medium">
                  <span className="truncate">{newFileName} ({newFileSize})</span>
                  <button 
                    type="button" 
                    onClick={(e) => { e.stopPropagation(); setNewFileName(''); }}
                    className="p-1 text-[#ED4956]"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-1.5 text-xs text-[#8E8E8E]">
                  <UploadCloud className="w-5 h-5 text-[#0095F6]" />
                  <span>Click to attach PDF / DWG / Doc (Max 20MB)</span>
                </div>
              )}
            </div>
          </div>

          {/* Notify Toggle */}
          <div className="flex items-center justify-between p-3 rounded-lg bg-[#FAFAFA] dark:bg-[#181818] border border-[#DBDBDB] dark:border-[#262626]">
            <div>
              <span className="text-xs font-semibold text-black dark:text-white block">
                Notify Enrolled Students
              </span>
              <span className="text-[11px] text-[#8E8E8E]">
                Dispatches instant notification to all enrolled student devices.
              </span>
            </div>
            <input
              type="checkbox"
              checked={notifyToggle}
              onChange={(e) => setNotifyToggle(e.target.checked)}
              className="w-4 h-4 text-[#0095F6] rounded"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              disabled={isPublishing}
              onClick={() => setIsNewAssignmentModalOpen(false)}
              className="px-4 py-2 rounded-lg border border-[#DBDBDB] dark:border-[#262626] text-xs font-semibold text-[#8E8E8E] hover:text-black dark:hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPublishing}
              className="px-5 py-2 rounded-lg bg-[#0095F6] hover:bg-[#1877F2] disabled:opacity-50 text-white text-xs font-semibold flex items-center gap-1.5"
            >
              {isPublishing && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              <span>{isPublishing ? 'Publishing...' : 'Publish Assignment'}</span>
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
