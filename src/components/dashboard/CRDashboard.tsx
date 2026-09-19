import React, { useState } from 'react';
import { useStudySync } from '../../store';
import { AttendanceSession } from '../../types';
import { 
  Plus, 
  Users, 
  Clock, 
  FileCheck, 
  BellRing, 
  ChevronRight, 
  Download,
  Megaphone,
  Vote,
  UserCheck,
  Send,
  FileText,
  Printer
} from 'lucide-react';
import { printAssignmentReport } from '../../utils/exportReports';

export const CRDashboard: React.FC = () => {
  const { 
    currentUser, 
    currentClass, 
    allUsers, 
    assignments, 
    submissions, 
    polls,
    attendanceSessions,
    broadcasts,
    sendBroadcast,
    selectedAssignmentId, 
    setSelectedAssignmentId, 
    setIsRightPanelOpen, 
    setIsNewAssignmentModalOpen,
    remindPendingStudents,
    exportSubmissionsCSV,
    setActiveTab,
    showToast
  } = useStudySync();

  const [broadcastText, setBroadcastText] = useState('');
  const totalStudents = allUsers.filter(u => u.role === 'Student').length;
  
  const activeAssignments = assignments.filter(a => a.status === 'active');
  const totalSubmissionsNeeded = activeAssignments.length * totalStudents;
  const totalSubmissionsCompleted = submissions.filter(s => s.status === 'submitted').length;
  const pendingSubmissionsCount = Math.max(0, totalSubmissionsNeeded - totalSubmissionsCompleted);

  const getRelativeDeadline = (deadlineIso: string) => {
    const diff = new Date(deadlineIso).getTime() - new Date().getTime();
    if (diff < 0) return { label: 'Overdue', isOverdue: true };
    const hours = Math.floor(diff / (1000 * 60 * 60));
    if (hours < 24) return { label: `Due in ${Math.max(1, hours)}h`, isOverdue: false, isUrgent: true };
    const days = Math.floor(hours / 24);
    return { label: `Due in ${days}d`, isOverdue: false, isUrgent: false };
  };

  const handleSelectAssignment = (id: string) => {
    setSelectedAssignmentId(id);
    setIsRightPanelOpen(true);
  };

  const handleQuickBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastText.trim()) return;
    sendBroadcast(broadcastText.trim());
    setBroadcastText('');
    showToast('Broadcast sent to all students', 'success');
  };

  return (
    <div className="p-4 lg:p-7 space-y-6 max-w-7xl mx-auto">
      {/* 1. Executive Hero Header & Actions */}
      <div className="ui-card p-5 sm:p-6 space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-[#EFEFEF] dark:bg-[#262626] text-black dark:text-white flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0095F6]" />
                CR Command Hub
              </span>
              <span className="text-[#8E8E8E] text-xs font-mono px-2 py-0.5 rounded bg-[#EFEFEF] dark:bg-[#262626]">
                Cohort: {currentClass.name} · Code: <strong className="text-[#0095F6]">{currentClass.code}</strong>
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-black dark:text-white tracking-tight">
              Class Coordinator Operations
            </h1>
            <p className="text-xs sm:text-sm text-[#737373] dark:text-[#A8A8A8] max-w-xl leading-relaxed">
              Real-time submission monitoring, 1-tap nudge alerts, attendance audit, and class-wide announcements.
            </p>
          </div>

          {/* CR Action Buttons */}
          <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap shrink-0">
            <button
              onClick={() => printAssignmentReport(assignments, currentClass.name)}
              className="btn-secondary text-xs"
              title="Generate printable PDF report of current assignments & cohort status"
            >
              <Printer className="w-4 h-4 text-[#8E8E8E]" />
              <span>Print Report</span>
            </button>

            <button
              onClick={() => exportSubmissionsCSV()}
              className="btn-secondary text-xs"
            >
              <Download className="w-4 h-4 text-[#8E8E8E]" />
              <span>Export CSV</span>
            </button>

            <button
              onClick={() => setIsNewAssignmentModalOpen(true)}
              className="btn-primary text-xs"
            >
              <Plus className="w-4 h-4" />
              <span>New Assignment</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Key Metrics Bento Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div 
          onClick={() => setActiveTab('members')}
          className="p-4 rounded-xl bg-white dark:bg-[#121212] border border-[#DBDBDB] dark:border-[#262626] hover:border-neutral-400 dark:hover:border-neutral-600 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-[#8E8E8E] uppercase tracking-wider">
              Enrolled Students
            </span>
            <div className="w-8 h-8 rounded-lg bg-[#EFEFEF] dark:bg-[#262626] text-black dark:text-white flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5 mt-2.5">
            <span className="text-2xl font-bold text-black dark:text-white font-mono">
              {totalStudents}
            </span>
            <span className="text-xs text-[#8E8E8E]">members</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-[#121212] border border-[#DBDBDB] dark:border-[#262626] transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-[#8E8E8E] uppercase tracking-wider">
              Pending Submissions
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5 mt-2.5">
            <span className="text-2xl font-bold text-amber-500 font-mono">
              {pendingSubmissionsCount}
            </span>
            <span className="text-xs text-[#8E8E8E]">awaiting</span>
          </div>
        </div>

        <div 
          onClick={() => setActiveTab('assignments')}
          className="p-4 rounded-xl bg-white dark:bg-[#121212] border border-[#DBDBDB] dark:border-[#262626] hover:border-neutral-400 dark:hover:border-neutral-600 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-[#8E8E8E] uppercase tracking-wider">
              Active Tasks
            </span>
            <div className="w-8 h-8 rounded-lg bg-[#0095F6]/10 text-[#0095F6] flex items-center justify-center">
              <FileCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5 mt-2.5">
            <span className="text-2xl font-bold text-black dark:text-white font-mono">
              {activeAssignments.length}
            </span>
            <span className="text-xs text-[#8E8E8E]">this week</span>
          </div>
        </div>

        <div 
          onClick={() => setActiveTab('polls')}
          className="p-4 rounded-xl bg-white dark:bg-[#121212] border border-[#DBDBDB] dark:border-[#262626] hover:border-neutral-400 dark:hover:border-neutral-600 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-[#8E8E8E] uppercase tracking-wider">
              Active Polls
            </span>
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-500 flex items-center justify-center">
              <Vote className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5 mt-2.5">
            <span className="text-2xl font-bold text-black dark:text-white font-mono">
              {polls.filter(p => !p.isClosed).length}
            </span>
            <span className="text-xs text-[#8E8E8E]">consensus</span>
          </div>
        </div>
      </div>

      {/* 3. Main Dashboard Body */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT 8 COLS: Live Submission Feed & Broadcast Composer */}
        <div className="lg:col-span-8 space-y-6">
          {/* Quick Broadcast Composer */}
          <div className="bg-white dark:bg-[#121212] rounded-xl border border-[#DBDBDB] dark:border-[#262626] p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-sm sm:text-base text-black dark:text-white flex items-center gap-2">
                <Megaphone className="w-4 h-4 text-[#0095F6]" />
                <span>Instant Class Announcement</span>
              </h2>
              <span className="text-[10px] font-semibold text-[#8E8E8E] font-mono">
                Notifies all {totalStudents} students
              </span>
            </div>

            <form onSubmit={handleQuickBroadcast} className="flex gap-2">
              <div className="flex-1 flex flex-col gap-1">
                <input
                  type="text"
                  value={broadcastText}
                  onChange={(e) => setBroadcastText(e.target.value.slice(0, 500))}
                  placeholder="Post urgent class update (e.g. Schedule change, deadline shift, room update)..."
                  className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-[#DBDBDB] dark:border-[#262626] bg-[#FAFAFA] dark:bg-[#181818] text-black dark:text-white focus:outline-none focus:border-[#0095F6]"
                />
                <span className={`text-[10px] font-mono self-end ${
                  500 - broadcastText.length < 50 ? 'text-rose-500' : 'text-[#8E8E8E]'
                }`}>
                  {500 - broadcastText.length} chars remaining
                </span>
              </div>
              <button
                type="submit"
                disabled={!broadcastText.trim()}
                className="px-4 py-2.5 rounded-lg bg-[#0095F6] hover:bg-[#1877F2] disabled:opacity-50 text-white font-semibold text-xs flex items-center gap-1.5 transition-all shrink-0 self-start"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Broadcast</span>
              </button>
            </form>
          </div>

          {/* Live Submission Feed */}
          <div className="bg-white dark:bg-[#121212] rounded-xl border border-[#DBDBDB] dark:border-[#262626] overflow-hidden">
            <div className="px-5 py-4 border-b border-[#DBDBDB] dark:border-[#262626] flex items-center justify-between bg-[#FAFAFA] dark:bg-[#181818]">
              <div>
                <h2 className="font-semibold text-sm sm:text-base text-black dark:text-white flex items-center gap-2">
                  <FileText className="w-4 h-4 text-[#0095F6]" />
                  <span>Live Assignment Tracking</span>
                </h2>
                <p className="text-xs text-[#8E8E8E] mt-0.5">
                  Select any row to inspect student submission hashes, download files, or grade work.
                </p>
              </div>
              <span className="text-xs text-[#0095F6] font-semibold flex items-center gap-1.5 bg-[#0095F6]/10 px-2.5 py-1 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0095F6]" />
                Live Sync
              </span>
            </div>

            <div className="divide-y divide-[#EFEFEF] dark:divide-[#262626]">
              {assignments.length === 0 ? (
                <div className="p-8 text-center text-xs text-[#8E8E8E]">
                  No assignments posted yet. Create your first assignment with the button above.
                </div>
              ) : (
                assignments.map(asg => {
                  const relDeadline = getRelativeDeadline(asg.deadline);
                  const asgSubs = submissions.filter(s => s.assignmentId === asg.id && s.status === 'submitted');
                  const submittedCount = asgSubs.length;
                  const percent = totalStudents > 0 ? Math.round((submittedCount / totalStudents) * 100) : 0;
                  const isSelected = selectedAssignmentId === asg.id;

                  return (
                    <div
                      key={asg.id}
                      onClick={() => handleSelectAssignment(asg.id)}
                      className={`p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer transition-all ${
                        isSelected 
                          ? 'bg-[#0095F6]/5 border-l-2 border-l-[#0095F6]' 
                          : 'hover:bg-[#FAFAFA] dark:hover:bg-[#181818]'
                      }`}
                    >
                      {/* Left info */}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#EFEFEF] dark:bg-[#262626] text-black dark:text-white border border-[#DBDBDB] dark:border-[#363636]">
                            {asg.subject}
                          </span>
                          
                          <span
                            className={`text-[11px] font-medium px-2 py-0.5 rounded ${
                              relDeadline.isOverdue
                                ? 'text-rose-600 dark:text-rose-400 bg-rose-500/10'
                                : relDeadline.isUrgent
                                ? 'text-amber-600 dark:text-amber-400 bg-amber-500/10'
                                : 'text-[#8E8E8E] bg-[#EFEFEF] dark:bg-[#262626]'
                            }`}
                          >
                            {relDeadline.label}
                          </span>
                        </div>

                        <h3 className="font-semibold text-sm sm:text-base text-black dark:text-white truncate">
                          {asg.title}
                        </h3>
                      </div>

                      {/* Center Progress Bar */}
                      <div className="w-full md:w-56 space-y-1.5">
                        <div className="flex items-center justify-between text-xs font-semibold">
                          <span className="text-black dark:text-white font-mono">
                            {submittedCount}/{totalStudents} submitted
                          </span>
                          <span className="text-[#0095F6] font-mono">
                            {percent}%
                          </span>
                        </div>

                        <div className="w-full h-1.5 rounded-full bg-[#EFEFEF] dark:bg-[#262626] overflow-hidden">
                          <div
                            className="h-full bg-[#0095F6] rounded-full"
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                      </div>

                      {/* Right Actions */}
                      <div className="flex items-center gap-2 shrink-0" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => remindPendingStudents(asg.id)}
                          title="Send notification to all non-submitters"
                          className="px-3 py-1.5 rounded-lg border border-[#DBDBDB] dark:border-[#262626] bg-white dark:bg-[#121212] hover:bg-[#FAFAFA] dark:hover:bg-[#1C1C1C] text-xs font-medium text-black dark:text-white flex items-center gap-1.5 transition-all"
                        >
                          <BellRing className="w-3.5 h-3.5 text-amber-500" />
                          <span className="hidden sm:inline">Remind pending</span>
                        </button>

                        <button
                          onClick={() => handleSelectAssignment(asg.id)}
                          className="p-1.5 rounded-md hover:bg-[#EFEFEF] dark:hover:bg-[#262626] text-[#8E8E8E] hover:text-black dark:hover:text-white transition-colors"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* RIGHT 4 COLS: Active Polls & Attendance Quick Overview */}
        <div className="lg:col-span-4 space-y-6">
          {/* Active Polls Quick View */}
          <div className="bg-white dark:bg-[#121212] rounded-xl border border-[#DBDBDB] dark:border-[#262626] p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-sm text-black dark:text-white flex items-center gap-2">
                <Vote className="w-4 h-4 text-purple-500" />
                <span>Class Consensus / Polls</span>
              </h3>
              <button
                onClick={() => setActiveTab('polls')}
                className="text-xs text-[#0095F6] hover:underline"
              >
                Manage
              </button>
            </div>

            {polls.slice(0, 1).map(p => {
              const totalVotes = p.options.reduce((sum, o) => sum + o.votes.length, 0);
              return (
                <div key={p.id} className="p-3.5 rounded-lg bg-[#FAFAFA] dark:bg-[#181818] border border-[#DBDBDB] dark:border-[#262626] space-y-2.5">
                  <p className="text-xs font-semibold text-black dark:text-white">
                    {p.question}
                  </p>
                  <div className="space-y-1.5">
                    {p.options.map(opt => {
                      const pct = totalVotes > 0 ? Math.round((opt.votes.length / totalVotes) * 100) : 0;
                      return (
                        <div key={opt.id} className="space-y-1">
                          <div className="flex justify-between text-[11px]">
                            <span className="text-[#737373] dark:text-[#A8A8A8] truncate pr-2">{opt.text}</span>
                            <span className="font-mono font-semibold text-black dark:text-white">{pct}%</span>
                          </div>
                          <div className="w-full h-1 bg-[#EFEFEF] dark:bg-[#262626] rounded-full overflow-hidden">
                            <div className="h-full bg-[#0095F6] rounded-full" style={{ width: `${pct}%` }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="text-[10px] text-[#8E8E8E] text-right font-mono">
                    Total {totalVotes} student votes cast
                  </div>
                </div>
              );
            })}
          </div>

          {/* Today's Attendance Headcount */}
          <div className="bg-white dark:bg-[#121212] rounded-xl border border-[#DBDBDB] dark:border-[#262626] p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-sm text-black dark:text-white flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-emerald-500" />
                <span>Attendance Log</span>
              </h3>
              <button
                onClick={() => setActiveTab('attendance')}
                className="text-xs text-[#0095F6] hover:underline"
              >
                Open view
              </button>
            </div>

            <div className="space-y-2">
              {attendanceSessions.slice(0, 2).map((att: AttendanceSession) => {
                const presentCount = att.records.filter(r => r.status === 'present').length;
                const pct = Math.round((presentCount / att.records.length) * 100);
                return (
                  <div
                    key={att.id}
                    className="p-3 rounded-lg bg-[#FAFAFA] dark:bg-[#181818] border border-[#DBDBDB] dark:border-[#262626] space-y-1.5"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-black dark:text-white">{att.subject}</span>
                      <span className="font-mono text-emerald-600 dark:text-emerald-400 font-semibold">{pct}% Present</span>
                    </div>
                    <p className="text-[11px] text-[#8E8E8E]">
                      {att.topic} · {att.date}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
