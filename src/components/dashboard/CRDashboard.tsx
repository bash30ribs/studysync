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
      <div className="relative rounded-3xl p-6 sm:p-7 bg-gradient-to-br from-[#0F172A] via-[#0D1829] to-[#041D20] text-white border border-slate-700/80 shadow-xl overflow-hidden handcrafted-card">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-teal-500/20 text-teal-300 border border-teal-500/30 flex items-center gap-1.5 shadow-xs">
                <span className="w-2 h-2 rounded-full bg-teal-400 animate-live-pulse" />
                CR Command Deck
              </span>
              <span className="text-slate-400 text-xs font-mono bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-700">
                Cohort: {currentClass.name} · Code: <strong className="text-teal-400">{currentClass.code}</strong>
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight">
              Class Coordinator Operations
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
              Real-time submission monitoring, 1-tap nudge alerts, attendance audit, and class-wide announcements.
            </p>
          </div>

          {/* CR Action Buttons */}
          <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap shrink-0">
            <button
              onClick={() => printAssignmentReport(assignments, currentClass.name)}
              className="btn-secondary text-xs border-slate-700 bg-slate-800/90 text-white hover:bg-slate-700"
              title="Generate printable PDF report of current assignments & cohort status"
            >
              <Printer className="w-4 h-4 text-teal-400" />
              <span>Print Report</span>
            </button>

            <button
              onClick={() => exportSubmissionsCSV()}
              className="btn-secondary text-xs border-slate-700 bg-slate-800/90 text-white hover:bg-slate-700"
            >
              <Download className="w-4 h-4 text-teal-400" />
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

        {/* Decorative background glows */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-teal-500/15 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 -mb-20 w-60 h-60 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />
      </div>

      {/* 2. Key Metrics Bento Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div 
          onClick={() => setActiveTab('members')}
          className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#0F172A] border border-slate-200/90 dark:border-slate-800 shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Enrolled Students
            </span>
            <div className="w-8 h-8 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center border border-teal-500/20">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5 mt-2.5">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-mono">
              {totalStudents}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">members</span>
          </div>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#0F172A] border border-slate-200/90 dark:border-slate-800 shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Pending Submissions
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center border border-amber-500/20">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5 mt-2.5">
            <span className="text-2xl sm:text-3xl font-extrabold text-amber-600 dark:text-amber-400 font-mono">
              {pendingSubmissionsCount}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">awaiting</span>
          </div>
        </div>

        <div 
          onClick={() => setActiveTab('assignments')}
          className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#0F172A] border border-slate-200/90 dark:border-slate-800 shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Active Tasks
            </span>
            <div className="w-8 h-8 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center border border-teal-500/20">
              <FileCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5 mt-2.5">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-mono">
              {activeAssignments.length}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">this week</span>
          </div>
        </div>

        <div 
          onClick={() => setActiveTab('polls')}
          className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#0F172A] border border-slate-200/90 dark:border-slate-800 shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Active Polls
            </span>
            <div className="w-8 h-8 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center border border-teal-500/20">
              <Vote className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5 mt-2.5">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-mono">
              {polls.filter(p => !p.isClosed).length}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">consensus</span>
          </div>
        </div>
      </div>

      {/* 3. Main Dashboard Body */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT 8 COLS: Live Submission Feed & Broadcast Composer */}
        <div className="lg:col-span-8 space-y-6">
          {/* Quick Broadcast Composer */}
          <div className="bg-white dark:bg-[#0E1626] rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white flex items-center gap-2">
                <Megaphone className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                <span>Instant Class Announcement</span>
              </h2>
              <span className="text-[10px] font-semibold text-slate-400 font-mono">
                Notifies all {totalStudents} students
              </span>
            </div>

            <form onSubmit={handleQuickBroadcast} className="flex gap-2">
              <input
                type="text"
                value={broadcastText}
                onChange={(e) => setBroadcastText(e.target.value)}
                placeholder="Post urgent class update (e.g. Schedule change, deadline shift, room update)..."
                className="flex-1 text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-teal-500"
              />
              <button
                type="submit"
                disabled={!broadcastText.trim()}
                className="px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-xs shrink-0"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Broadcast</span>
              </button>
            </form>
          </div>

          {/* Live Submission Feed */}
          <div className="bg-white dark:bg-[#0E1626] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/60 dark:bg-slate-900/40">
              <div>
                <h2 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white flex items-center gap-2">
                  <FileText className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                  <span>Live Assignment Tracking</span>
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Select any row to inspect student submission hashes, download files, or grade work.
                </p>
              </div>
              <span className="text-xs text-emerald-700 dark:text-emerald-300 font-bold flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-500/20">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-live-pulse" />
                Live Sync
              </span>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {assignments.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-500 dark:text-slate-400">
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
                          ? 'bg-teal-50/50 dark:bg-teal-500/10 border-l-4 border-l-teal-500' 
                          : 'hover:bg-slate-50 dark:hover:bg-slate-850/60'
                      }`}
                    >
                      {/* Left info */}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                            {asg.subject}
                          </span>
                          
                          <span
                            className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${
                              relDeadline.isOverdue
                                ? 'text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-500/15'
                                : relDeadline.isUrgent
                                ? 'text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-500/15'
                                : 'text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800'
                            }`}
                          >
                            {relDeadline.label}
                          </span>
                        </div>

                        <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white truncate">
                          {asg.title}
                        </h3>
                      </div>

                      {/* Center Progress Bar */}
                      <div className="w-full md:w-56 space-y-1.5">
                        <div className="flex items-center justify-between text-xs font-bold">
                          <span className="text-slate-800 dark:text-slate-200 font-mono">
                            {submittedCount}/{totalStudents} submitted
                          </span>
                          <span className="text-teal-600 dark:text-teal-400 font-mono">
                            {percent}%
                          </span>
                        </div>

                        <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                          <div
                            className="h-full bg-teal-500 progress-bar-fill rounded-full"
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                      </div>

                      {/* Right Actions */}
                      <div className="flex items-center gap-2 shrink-0" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => remindPendingStudents(asg.id)}
                          title="Send notification to all non-submitters"
                          className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 transition-all shadow-2xs"
                        >
                          <BellRing className="w-3.5 h-3.5 text-amber-500" />
                          <span className="hidden sm:inline">Remind pending</span>
                        </button>

                        <button
                          onClick={() => handleSelectAssignment(asg.id)}
                          className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
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
          <div className="bg-white dark:bg-[#0E1626] rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <Vote className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <span>Class Consensus / Polls</span>
              </h3>
              <button
                onClick={() => setActiveTab('polls')}
                className="text-xs text-teal-600 dark:text-teal-400 hover:underline"
              >
                Manage
              </button>
            </div>

            {polls.slice(0, 1).map(p => {
              const totalVotes = p.options.reduce((sum, o) => sum + o.votes.length, 0);
              return (
                <div key={p.id} className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-2.5">
                  <p className="text-xs font-bold text-slate-900 dark:text-white">
                    {p.question}
                  </p>
                  <div className="space-y-1.5">
                    {p.options.map(opt => {
                      const pct = totalVotes > 0 ? Math.round((opt.votes.length / totalVotes) * 100) : 0;
                      return (
                        <div key={opt.id} className="space-y-1">
                          <div className="flex justify-between text-[11px]">
                            <span className="text-slate-600 dark:text-slate-300 truncate pr-2">{opt.text}</span>
                            <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{pct}%</span>
                          </div>
                          <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                            <div className="h-full bg-purple-500 rounded-full" style={{ width: `${pct}%` }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="text-[10px] text-slate-400 text-right font-mono">
                    Total {totalVotes} student votes cast
                  </div>
                </div>
              );
            })}
          </div>

          {/* Today's Attendance Headcount */}
          <div className="bg-white dark:bg-[#0E1626] rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Attendance Log</span>
              </h3>
              <button
                onClick={() => setActiveTab('attendance')}
                className="text-xs text-teal-600 dark:text-teal-400 hover:underline"
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
                    className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-1.5"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-900 dark:text-white">{att.subject}</span>
                      <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">{pct}% Present</span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
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
