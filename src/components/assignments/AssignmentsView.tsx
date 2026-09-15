import React, { useState } from 'react';
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
  FileCheck2
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
          <h1 className="text-xl lg:text-2xl font-extrabold text-[#0F2044] dark:text-white tracking-tight">
            Assignments Hub
          </h1>
          <p className="text-xs sm:text-sm text-[#64748B] dark:text-[#94A3B8] mt-0.5">
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
            className="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-bold flex items-center gap-1.5 transition-all shadow-2xs"
            title="Download iCalendar format for Apple Calendar, Google Calendar, Outlook"
          >
            <Download className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
            <span>Sync iCal</span>
          </button>

          {currentUser.role === 'CR' && (
            <button
              onClick={() => setIsNewAssignmentModalOpen(true)}
              className="px-3.5 py-2 rounded-lg bg-[#00B4A6] dark:bg-[#00D2C4] hover:bg-[#009E91] dark:hover:bg-[#00B4A6] text-white dark:text-[#080D1A] text-xs font-bold flex items-center gap-1.5 transition-all shadow-md shadow-[#00B4A6]/15"
            >
              <Plus className="w-4 h-4" />
              <span>New Assignment</span>
            </button>
          )}
        </div>
      </div>

      {/* AI Late Submission Pace Alert for CR */}
      {currentUser.role === 'CR' && assignments.length > 0 && (
        <div className="p-3.5 rounded-xl bg-[#FFFBEB] dark:bg-[#D97706]/10 border border-[#FDE68A] dark:border-[#D97706]/20 flex items-start gap-3 animate-in fade-in">
          <AlertTriangle className="w-4 h-4 text-[#D97706] dark:text-[#FBBF24] shrink-0 mt-0.5" />
          <div className="text-xs">
            <span className="font-bold text-[#92400E] dark:text-[#FDE68A]">Pace Alert: Late Submission Predictor</span>
            <p className="text-[#B45309] dark:text-[#FCD34D] mt-0.5 leading-relaxed">
              At current submission velocity, <strong>14 students</strong> are projected to miss the upcoming deadline. A broadcast nudge has been prepared.
            </p>
          </div>
        </div>
      )}

      {/* Filters & Search Row */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#64748B] dark:text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search assignments by title or subject..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-[#E2E7F0] dark:border-[#1E293B] bg-white dark:bg-[#0F172A] text-[#0F2044] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#00B4A6]/20 focus:border-[#00B4A6] dark:focus:border-[#00D2C4] shadow-xs"
          />
        </div>

        {/* Subject Filter */}
        <select
          value={selectedSubject}
          onChange={(e) => setSelectedSubject(e.target.value)}
          className="text-xs px-3 py-2 rounded-lg border border-[#E2E7F0] dark:border-[#1E293B] bg-white dark:bg-[#0F172A] text-[#0F2044] dark:text-white focus:outline-none focus:ring-1 focus:ring-[#00B4A6] shadow-xs"
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
          className="text-xs px-3 py-2 rounded-lg border border-[#E2E7F0] dark:border-[#1E293B] bg-white dark:bg-[#0F172A] text-[#0F2044] dark:text-white focus:outline-none focus:ring-1 focus:ring-[#00B4A6] shadow-xs"
        >
          <option value="all">All Statuses</option>
          <option value="active">Active</option>
          <option value="closed">Closed</option>
        </select>
      </div>

      {/* Table / List of Assignments */}
      <div className="bg-white dark:bg-[#0F172A] border border-[#E2E7F0] dark:border-[#1E293B] rounded-xl shadow-xs overflow-hidden">
        {filteredAssignments.length === 0 ? (
          <div className="py-16 text-center flex flex-col items-center justify-center p-6 space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-[#00B4A6]/10 dark:bg-[#00D2C4]/10 text-[#00B4A6] dark:text-[#00D2C4] flex items-center justify-center">
              <FileCheck2 className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-[#0F2044] dark:text-white">
                Nothing due — enjoy it while it lasts.
              </h3>
              <p className="text-xs text-[#64748B] dark:text-[#94A3B8] max-w-sm mt-1">
                No course assignments are currently due or matching your active search filters.
              </p>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#E2E7F0] dark:border-[#1E293B] bg-[#F8FAFC] dark:bg-[#15203B]/60 text-[10px] font-bold text-[#64748B] dark:text-[#94A3B8] uppercase tracking-wider">
                  <th className="py-3 px-4 sm:px-6">Title & Subject</th>
                  <th className="py-3 px-4">Posted Date</th>
                  <th className="py-3 px-4">Deadline</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 sm:px-6 text-right">
                    {currentUser.role === 'CR' ? 'Submissions' : 'My Status'}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E7F0] dark:divide-[#1E293B] text-xs">
                {filteredAssignments.map(asg => {
                  const isSelected = selectedAssignmentId === asg.id;
                  const asgSubs = submissions.filter(s => s.assignmentId === asg.id && s.status === 'submitted');
                  const isOverdue = new Date(asg.deadline).getTime() < new Date().getTime();
                  const mySub = submissions.find(s => s.assignmentId === asg.id && s.studentId === currentUser.id);

                  return (
                    <React.Fragment key={asg.id}>
                      <tr
                        onClick={() => handleSelectRow(asg.id)}
                        className={`cursor-pointer transition-colors ${
                          isSelected
                            ? 'bg-[#E6F8F6]/60 dark:bg-[#00D2C4]/10 font-medium'
                            : 'hover:bg-[#F8FAFC] dark:hover:bg-[#15203B]/50'
                        }`}
                      >
                        {/* Title & Subject */}
                        <td className="py-3.5 px-4 sm:px-6">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-[#0F2044] dark:text-white truncate max-w-xs sm:max-w-md">
                              {asg.title}
                            </span>
                            {asg.isRecurring && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-[#E6F8F6] dark:bg-[#00D2C4]/15 text-[#00897B] dark:text-[#00D2C4]">
                                <Repeat className="w-3 h-3" />
                                <span>Weekly</span>
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[10px] font-bold text-[#00897B] dark:text-[#00D2C4]">
                              {asg.subject}
                            </span>
                            {asg.aiSummary && (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setActiveSummaryId(activeSummaryId === asg.id ? null : asg.id);
                                }}
                                className="inline-flex items-center gap-1 text-[10px] font-bold text-[#64748B] dark:text-[#94A3B8] hover:text-[#00B4A6] dark:hover:text-[#00D2C4] transition-colors"
                              >
                                <Sparkles className="w-3 h-3" />
                                <span>{activeSummaryId === asg.id ? 'Hide TL;DR' : 'AI Summary'}</span>
                              </button>
                            )}
                          </div>
                        </td>

                        {/* Posted */}
                        <td className="py-3.5 px-4 text-[#64748B] dark:text-[#94A3B8] font-mono">
                          {new Date(asg.postedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                        </td>

                        {/* Deadline */}
                        <td className="py-3.5 px-4 font-mono">
                          <span className={isOverdue && asg.status === 'active' ? 'text-[#E63946] dark:text-[#FB7185] font-bold' : 'text-[#0F2044] dark:text-white'}>
                            {new Date(asg.deadline).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </td>

                        {/* Status pill */}
                        <td className="py-3.5 px-4">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                              asg.status === 'closed'
                                ? 'bg-[#F1F5F9] dark:bg-[#1E293B] text-[#64748B] dark:text-[#94A3B8]'
                                : isOverdue
                                ? 'bg-[#FDECEC] dark:bg-[#E63946]/15 text-[#E63946] dark:text-[#FB7185]'
                                : 'bg-[#E6F8F6] dark:bg-[#00D2C4]/15 text-[#00897B] dark:text-[#00D2C4]'
                            }`}
                          >
                            {asg.status === 'closed' ? 'Closed' : isOverdue ? 'Overdue' : 'Active'}
                          </span>
                        </td>

                        {/* Submissions or My status */}
                        <td className="py-3.5 px-4 sm:px-6 text-right">
                          {currentUser.role === 'CR' ? (
                            <span className="font-mono font-bold text-[#0F2044] dark:text-white">
                              {asgSubs.length}/{totalStudents}
                            </span>
                          ) : (
                            <span
                              className={`font-bold capitalize ${
                                mySub?.status === 'submitted'
                                  ? 'text-[#00897B] dark:text-[#00D2C4]'
                                  : mySub?.status === 'viewed'
                                  ? 'text-[#D97706] dark:text-[#FBBF24]'
                                  : 'text-[#64748B] dark:text-[#94A3B8]'
                              }`}
                            >
                              {mySub?.status || 'Assigned'}
                            </span>
                          )}
                        </td>
                      </tr>

                      {/* Expandable AI TL;DR Summary row */}
                      {activeSummaryId === asg.id && asg.aiSummary && (
                        <tr className="bg-[#F8FAFC] dark:bg-[#15203B]/30 border-b border-[#E2E7F0] dark:border-[#1E293B]">
                          <td colSpan={5} className="p-4 px-6">
                            <div className="p-3 rounded-lg bg-white dark:bg-[#0F172A] border border-[#00B4A6]/30 dark:border-[#00D2C4]/30 space-y-1">
                              <div className="flex items-center gap-1.5 text-xs font-bold text-[#00897B] dark:text-[#00D2C4]">
                                <Sparkles className="w-3.5 h-3.5" />
                                <span>AI 2-Line Assignment TL;DR</span>
                              </div>
                              <p className="text-xs text-[#0F2044] dark:text-white leading-relaxed">
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
            <label className="block text-xs font-bold text-[#0F2044] dark:text-white mb-1">
              Assignment Title
            </label>
            <input
              type="text"
              required
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="e.g. Fluid Mechanics Problem Set 3"
              className="w-full text-xs px-3 py-2.5 rounded-lg border border-[#E2E7F0] dark:border-[#1E293B] bg-[#F8FAFC] dark:bg-[#080D1A] text-[#0F2044] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#00B4A6]/20 focus:border-[#00B4A6]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#0F2044] dark:text-white mb-1">
                Subject
              </label>
              <select
                value={newSubject}
                onChange={(e) => setNewSubject(e.target.value)}
                className="w-full text-xs px-3 py-2.5 rounded-lg border border-[#E2E7F0] dark:border-[#1E293B] bg-[#F8FAFC] dark:bg-[#080D1A] text-[#0F2044] dark:text-white focus:outline-none focus:border-[#00B4A6]"
              >
                {currentClass.subjects.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-[#0F2044] dark:text-white">
                  Deadline Date & Time
                </label>
                <button
                  type="button"
                  onClick={handleApplySmartDeadline}
                  className="text-[10px] font-bold text-[#00B4A6] dark:text-[#00D2C4] hover:underline flex items-center gap-1"
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
                  className="w-full text-xs px-2.5 py-2.5 rounded-lg border border-[#E2E7F0] dark:border-[#1E293B] bg-[#F8FAFC] dark:bg-[#080D1A] text-[#0F2044] dark:text-white focus:outline-none focus:border-[#00B4A6]"
                />
                <input
                  type="time"
                  required
                  value={newDeadlineTime}
                  onChange={(e) => setNewDeadlineTime(e.target.value)}
                  className="w-full text-xs px-2.5 py-2.5 rounded-lg border border-[#E2E7F0] dark:border-[#1E293B] bg-[#F8FAFC] dark:bg-[#080D1A] text-[#0F2044] dark:text-white focus:outline-none focus:border-[#00B4A6]"
                />
              </div>
            </div>
          </div>

          {/* Recurring Assignment toggle */}
          <div className="p-3 rounded-xl bg-[#F8FAFC] dark:bg-[#080D1A] border border-[#E2E7F0] dark:border-[#1E293B] space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Repeat className="w-4 h-4 text-[#00B4A6] dark:text-[#00D2C4]" />
                <span className="text-xs font-bold text-[#0F2044] dark:text-white">
                  Recurring Assignment Schedule
                </span>
              </div>
              <input
                type="checkbox"
                checked={isRecurring}
                onChange={(e) => setIsRecurring(e.target.checked)}
                className="w-4 h-4 text-[#00B4A6] rounded focus:ring-[#00B4A6]"
              />
            </div>
            {isRecurring && (
              <div className="pt-2 border-t border-[#E2E7F0] dark:border-[#1E293B] flex items-center justify-between text-xs text-[#64748B] dark:text-[#94A3B8]">
                <span>Recurrence Cadence:</span>
                <select
                  value={recurrenceRule}
                  onChange={(e) => setRecurrenceRule(e.target.value as 'weekly' | 'biweekly')}
                  className="text-xs px-2 py-1 rounded border border-[#E2E7F0] dark:border-[#1E293B] bg-white dark:bg-[#0F172A] text-[#0F2044] dark:text-white"
                >
                  <option value="weekly">Every Friday 11:59 PM (Weekly)</option>
                  <option value="biweekly">Every 2 Weeks (Bi-weekly)</option>
                </select>
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-[#0F2044] dark:text-white mb-1">
              Instructions & Problem Specifications
            </label>
            <textarea
              rows={3}
              value={newDesc}
              onChange={(e) => setNewDesc(e.target.value)}
              placeholder="Outline problem numbers, format requirements, submission rules..."
              className="w-full text-xs p-3 rounded-lg border border-[#E2E7F0] dark:border-[#1E293B] bg-[#F8FAFC] dark:bg-[#080D1A] text-[#0F2044] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#00B4A6]/20 focus:border-[#00B4A6] resize-none"
            />
          </div>

          {/* Attachment upload */}
          <div>
            <label className="block text-xs font-bold text-[#0F2044] dark:text-white mb-1">
              Attach Reference Document (Optional)
            </label>
            <div 
              onClick={() => {
                setNewFileName('Assgn_Specification_Sheet.pdf');
                setNewFileSize('2.2 MB');
              }}
              className="border-2 border-dashed border-[#CBD5E1] dark:border-[#334155] rounded-xl p-4 text-center cursor-pointer hover:border-[#00B4A6] dark:hover:border-[#00D2C4] transition-colors bg-[#F8FAFC] dark:bg-[#080D1A]"
            >
              {newFileName ? (
                <div className="flex items-center justify-between p-2 rounded bg-[#E6F8F6] dark:bg-[#00D2C4]/15 text-[#00897B] dark:text-[#00D2C4] text-xs font-semibold">
                  <span className="truncate">{newFileName} ({newFileSize})</span>
                  <button 
                    type="button" 
                    onClick={(e) => { e.stopPropagation(); setNewFileName(''); }}
                    className="p-1 text-[#E63946]"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-1.5 text-xs text-[#64748B] dark:text-[#94A3B8]">
                  <UploadCloud className="w-5 h-5 text-[#00B4A6] dark:text-[#00D2C4]" />
                  <span>Click to attach PDF / DWG / Doc (Max 20MB)</span>
                </div>
              )}
            </div>
          </div>

          {/* Notify Toggle */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-[#F8FAFC] dark:bg-[#080D1A] border border-[#E2E7F0] dark:border-[#1E293B]">
            <div>
              <span className="text-xs font-bold text-[#0F2044] dark:text-white block">
                Notify Enrolled Students
              </span>
              <span className="text-[11px] text-[#64748B] dark:text-[#94A3B8]">
                Dispatches instant in-app notification to all enrolled student devices.
              </span>
            </div>
            <input
              type="checkbox"
              checked={notifyToggle}
              onChange={(e) => setNotifyToggle(e.target.checked)}
              className="w-4 h-4 text-[#00B4A6] rounded focus:ring-[#00B4A6]"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              disabled={isPublishing}
              onClick={() => setIsNewAssignmentModalOpen(false)}
              className="px-4 py-2 rounded-lg border border-[#E2E7F0] dark:border-[#1E293B] text-xs font-semibold text-[#64748B] dark:text-[#94A3B8] hover:text-[#0F2044] dark:hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPublishing}
              className="px-5 py-2 rounded-lg bg-[#00B4A6] dark:bg-[#00D2C4] hover:bg-[#009E91] dark:hover:bg-[#00B4A6] disabled:opacity-50 text-white dark:text-[#080D1A] text-xs font-bold shadow-xs flex items-center gap-1.5"
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
