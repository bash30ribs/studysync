import React, { useState } from 'react';
import { useStudySync } from '../../store';
import { getRelativeDeadline } from '../../utils/deadlineUtils';
import { 
  Plus, 
  Users, 
  Clock, 
  FileCheck, 
  BellRing, 
  ChevronRight, 
  Megaphone,
  Send,
  ArrowRight,
  CheckCircle2
} from 'lucide-react';

export const CRDashboard: React.FC = () => {
  const { 
    currentClass, 
    allUsers, 
    assignments, 
    submissions, 
    sendBroadcast, 
    setSelectedAssignmentId, 
    setIsRightPanelOpen, 
    setIsNewAssignmentModalOpen,
    remindPendingStudents,
    setActiveTab,
    showToast
  } = useStudySync();

  const [broadcastText, setBroadcastText] = useState('');
  const totalStudents = allUsers.filter(u => u.role === 'Student').length;
  
  const activeAssignments = assignments.filter(a => a.status === 'active');
  const totalSubmissionsNeeded = activeAssignments.length * totalStudents;
  const totalSubmissionsCompleted = submissions.filter(s => s.status === 'submitted').length;
  const pendingSubmissionsCount = Math.max(0, totalSubmissionsNeeded - totalSubmissionsCompleted);

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

  // Filter assignments that need attention (active or have pending submissions)
  const actionableAssignments = assignments
    .map(asg => {
      const asgSubs = submissions.filter(s => s.assignmentId === asg.id && s.status === 'submitted');
      const pendingCount = Math.max(0, totalStudents - asgSubs.length);
      const relDeadline = getRelativeDeadline(asg.deadline);
      return {
        ...asg,
        submittedCount: asgSubs.length,
        pendingCount,
        percent: totalStudents > 0 ? Math.round((asgSubs.length / totalStudents) * 100) : 0,
        relDeadline
      };
    })
    // Sort: overdue first, then soonest deadline
    .sort((a, b) => {
      if (a.relDeadline.isOverdue && !b.relDeadline.isOverdue) return -1;
      if (!a.relDeadline.isOverdue && b.relDeadline.isOverdue) return 1;
      return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
    });

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto space-y-6">
      {/* 1. Clean Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#DBDBDB] dark:border-[#262626]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-black dark:text-white tracking-tight">
              Class Overview
            </h1>
            <span className="text-xs font-mono font-medium px-2 py-0.5 rounded bg-[#EFEFEF] dark:bg-[#262626] text-[#737373] dark:text-[#A8A8A8]">
              {currentClass.name}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[#737373] dark:text-[#8E8E8E] mt-1">
            Focus on pending submissions, quick announcements, and urgent deadlines.
          </p>
        </div>

        <button
          onClick={() => setIsNewAssignmentModalOpen(true)}
          className="btn-primary text-xs self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Assignment</span>
        </button>
      </div>

      {/* 2. Focused Metrics (3 numbers only) */}
      <div className="grid grid-cols-3 gap-3 sm:gap-4">
        <div 
          onClick={() => setActiveTab('members')}
          className="p-4 rounded-xl bg-white dark:bg-[#121212] border border-[#DBDBDB] dark:border-[#262626] hover:border-[#8E8E8E] dark:hover:border-[#3E3E3E] transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-[#8E8E8E] uppercase tracking-wider">
              Enrolled
            </span>
            <Users className="w-4 h-4 text-[#8E8E8E] group-hover:text-black dark:group-hover:text-white transition-colors" />
          </div>
          <div className="flex items-baseline gap-1.5 mt-2">
            <span className="text-2xl font-bold text-black dark:text-white font-mono">
              {totalStudents}
            </span>
            <span className="text-xs text-[#8E8E8E]">students</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-[#121212] border border-[#DBDBDB] dark:border-[#262626]">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-[#8E8E8E] uppercase tracking-wider">
              Pending
            </span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="flex items-baseline gap-1.5 mt-2">
            <span className="text-2xl font-bold text-amber-500 font-mono">
              {pendingSubmissionsCount}
            </span>
            <span className="text-xs text-[#8E8E8E]">to chase</span>
          </div>
        </div>

        <div 
          onClick={() => setActiveTab('assignments')}
          className="p-4 rounded-xl bg-white dark:bg-[#121212] border border-[#DBDBDB] dark:border-[#262626] hover:border-[#8E8E8E] dark:hover:border-[#3E3E3E] transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-[#8E8E8E] uppercase tracking-wider">
              Deadlines
            </span>
            <FileCheck className="w-4 h-4 text-[#0095F6] group-hover:text-[#1877F2] transition-colors" />
          </div>
          <div className="flex items-baseline gap-1.5 mt-2">
            <span className="text-2xl font-bold text-black dark:text-white font-mono">
              {activeAssignments.length}
            </span>
            <span className="text-xs text-[#8E8E8E]">active</span>
          </div>
        </div>
      </div>

      {/* 3. Fast Broadcast Box */}
      <div className="bg-white dark:bg-[#121212] rounded-xl border border-[#DBDBDB] dark:border-[#262626] p-4 sm:p-5 space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-xs sm:text-sm text-black dark:text-white flex items-center gap-2">
            <Megaphone className="w-4 h-4 text-[#0095F6]" />
            <span>Send Quick Class Announcement</span>
          </h2>
          <span className="text-[11px] text-[#8E8E8E]">
            Notifies all {totalStudents} students
          </span>
        </div>

        <form onSubmit={handleQuickBroadcast} className="flex gap-2">
          <input
            type="text"
            value={broadcastText}
            onChange={(e) => setBroadcastText(e.target.value.slice(0, 500))}
            placeholder="Post urgent class update (e.g. room change, schedule, submission alert)..."
            className="flex-1 text-xs px-3.5 py-2.5 rounded-lg border border-[#DBDBDB] dark:border-[#262626] bg-[#FAFAFA] dark:bg-[#181818] text-black dark:text-white placeholder-[#8E8E8E] focus:outline-none focus:border-[#0095F6] transition-colors"
          />
          <button
            type="submit"
            disabled={!broadcastText.trim()}
            className="px-4 py-2.5 rounded-lg bg-[#0095F6] hover:bg-[#1877F2] disabled:opacity-40 text-white font-semibold text-xs flex items-center gap-1.5 transition-all shrink-0"
          >
            <Send className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Post</span>
          </button>
        </form>
      </div>

      {/* 4. Action Queue: Deadlines & Submissions */}
      <div className="bg-white dark:bg-[#121212] rounded-xl border border-[#DBDBDB] dark:border-[#262626] overflow-hidden">
        <div className="px-5 py-3.5 border-b border-[#DBDBDB] dark:border-[#262626] flex items-center justify-between bg-[#FAFAFA] dark:bg-[#181818]">
          <h2 className="font-semibold text-xs sm:text-sm text-black dark:text-white flex items-center gap-2">
            <span>Action Required · Submissions to Track</span>
          </h2>
          <button
            onClick={() => setActiveTab('assignments')}
            className="text-xs text-[#0095F6] hover:underline flex items-center gap-1 font-medium"
          >
            <span>All Tasks</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        <div className="divide-y divide-[#EFEFEF] dark:divide-[#262626]">
          {actionableAssignments.length === 0 ? (
            <div className="p-8 text-center space-y-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
              <p className="text-sm font-semibold text-black dark:text-white">All caught up!</p>
              <p className="text-xs text-[#8E8E8E]">No active assignments require attention right now.</p>
            </div>
          ) : (
            actionableAssignments.map(asg => {
              return (
                <div
                  key={asg.id}
                  onClick={() => handleSelectAssignment(asg.id)}
                  className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer hover:bg-[#FAFAFA] dark:hover:bg-[#181818] transition-all"
                >
                  {/* Left: Info */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#EFEFEF] dark:bg-[#262626] text-black dark:text-white">
                        {asg.subject}
                      </span>
                      
                      <span
                        className={`text-[11px] font-medium px-2 py-0.5 rounded ${
                          asg.relDeadline.isOverdue
                            ? 'text-rose-600 dark:text-rose-400 bg-rose-500/10'
                            : asg.relDeadline.isUrgent
                            ? 'text-amber-600 dark:text-amber-400 bg-amber-500/10'
                            : 'text-[#8E8E8E] bg-[#EFEFEF] dark:bg-[#262626]'
                        }`}
                      >
                        {asg.relDeadline.label}
                      </span>
                    </div>

                    <h3 className="font-semibold text-sm text-black dark:text-white truncate">
                      {asg.title}
                    </h3>
                  </div>

                  {/* Center: Clean Progress */}
                  <div className="w-full md:w-48 space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[#8E8E8E] font-mono">
                        {asg.submittedCount}/{totalStudents} submitted
                      </span>
                      <span className="font-mono font-semibold text-black dark:text-white">
                        {asg.percent}%
                      </span>
                    </div>

                    <div className="w-full h-1.5 rounded-full bg-[#EFEFEF] dark:bg-[#262626] overflow-hidden">
                      <div
                        className="h-full bg-[#0095F6] rounded-full transition-all duration-300"
                        style={{ width: `${asg.percent}%` }}
                      />
                    </div>
                  </div>

                  {/* Right: Nudge Button */}
                  <div className="flex items-center gap-2 shrink-0" onClick={(e) => e.stopPropagation()}>
                    {asg.pendingCount > 0 ? (
                      <button
                        onClick={() => remindPendingStudents(asg.id)}
                        className="px-3 py-1.5 rounded-lg border border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 text-xs font-semibold text-amber-600 dark:text-amber-400 flex items-center gap-1.5 transition-all"
                      >
                        <BellRing className="w-3.5 h-3.5" />
                        <span>Nudge {asg.pendingCount} pending</span>
                      </button>
                    ) : (
                      <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold px-2 py-1 bg-emerald-500/10 rounded-md">
                        Complete
                      </span>
                    )}

                    <button
                      onClick={() => handleSelectAssignment(asg.id)}
                      className="p-1.5 rounded-md hover:bg-[#EFEFEF] dark:hover:bg-[#262626] text-[#8E8E8E] hover:text-black dark:hover:text-white transition-colors"
                      title="View details"
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
  );
};
