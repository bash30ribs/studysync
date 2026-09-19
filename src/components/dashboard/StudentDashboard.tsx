import React, { useState } from 'react';
import { useStudySync } from '../../store';
import { AttendanceSession } from '../../types';
import { 
  Megaphone, 
  Clock, 
  CheckCircle2, 
  Eye, 
  Upload, 
  ArrowRight,
  Vote,
  FileDown,
  MessageSquare,
  Send,
  Download,
  FileText,
  UserCheck,
  Flame,
  Sparkles,
  Headphones,
  Trophy,
  Zap
} from 'lucide-react';

export const StudentDashboard: React.FC = () => {
  const { 
    currentUser, 
    currentClass,
    assignments, 
    submissions, 
    broadcasts, 
    polls,
    resources,
    attendanceSessions,
    messages,
    sendMessage,
    votePoll,
    selectedAssignmentId, 
    setSelectedAssignmentId, 
    setIsRightPanelOpen, 
    setIsSubmitDrawerOpen,
    markAssignmentViewed,
    setActiveTab,
    showToast,
    isOffline
  } = useStudySync();

  const [taskFilter, setTaskFilter] = useState<'all' | 'pending' | 'submitted'>('all');
  const [quickMsg, setQuickMsg] = useState('');

  const latestBroadcast = broadcasts[0];
  const activePoll = polls.find(p => !p.isClosed) || polls[0];
  const recentResources = resources.slice(0, 3);

  // Compute student attendance stats
  let totalAttSessions = 0;
  let attendedSessions = 0;
  attendanceSessions.forEach((session: AttendanceSession) => {
    const rec = session.records.find(r => r.studentId === currentUser.id);
    if (rec) {
      totalAttSessions += 1;
      if (rec.status === 'present' || rec.status === 'late') {
        attendedSessions += 1;
      }
    }
  });
  const attendancePct = totalAttSessions > 0 ? Math.round((attendedSessions / totalAttSessions) * 100) : 100;

  const handleSelectTask = (asgId: string) => {
    setSelectedAssignmentId(asgId);
    markAssignmentViewed(asgId);
    setIsRightPanelOpen(true);
  };

  const handleOpenSubmit = (asgId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedAssignmentId(asgId);
    markAssignmentViewed(asgId);
    setIsSubmitDrawerOpen(true);
  };

  const handleQuickSendMsg = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickMsg.trim()) return;
    sendMessage(quickMsg.trim(), null);
    setQuickMsg('');
    showToast('Message sent to class feed', 'success');
  };

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case 'submitted':
        return (
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-500/30">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Submitted
          </span>
        );
      case 'viewed':
        return (
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 dark:bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-500/30">
            <Eye className="w-3.5 h-3.5" />
            Viewed
          </span>
        );
      default:
        return (
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
            <Clock className="w-3.5 h-3.5" />
            Assigned
          </span>
        );
    }
  };

  // Filter tasks
  const filteredAssignments = assignments.filter(asg => {
    const sub = submissions.find(s => s.assignmentId === asg.id && s.studentId === currentUser.id);
    const isSubmitted = sub?.status === 'submitted';
    if (taskFilter === 'pending') return !isSubmitted;
    if (taskFilter === 'submitted') return isSubmitted;
    return true;
  });

  const pendingCount = assignments.filter(asg => {
    const sub = submissions.find(s => s.assignmentId === asg.id && s.studentId === currentUser.id);
    return sub?.status !== 'submitted';
  }).length;

  const submittedCount = assignments.length - pendingCount;

  return (
    <div className="p-4 lg:p-7 space-y-6 max-w-7xl mx-auto">
      {/* 1. Personalized Hero Header & Quick Momentum Deck */}
      <div className="ui-card p-5 sm:p-6 space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-[#EFEFEF] dark:bg-[#262626] text-black dark:text-white flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#0095F6]" />
                {currentClass.name}
              </span>
              <span className="text-[#8E8E8E] text-xs font-mono px-2 py-0.5 rounded bg-[#EFEFEF] dark:bg-[#262626]">
                Roll #{currentUser.rollNo}
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl font-bold text-black dark:text-white tracking-tight">
              Good {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 18 ? 'Afternoon' : 'Evening'}, {currentUser.name.split(' ')[0]}
            </h1>
            <p className="text-xs sm:text-sm text-[#737373] dark:text-[#A8A8A8] max-w-xl leading-relaxed">
              You have <strong className="text-black dark:text-white font-semibold">{pendingCount} assignments</strong> pending this week.
            </p>
          </div>

          {/* Quick Metrics Deck */}
          <div className="grid grid-cols-3 gap-2 sm:gap-3 shrink-0">
            {/* Pending Tasks */}
            <div 
              onClick={() => setTaskFilter('pending')}
              className={`p-3 rounded-lg border transition-all cursor-pointer text-center ${
                taskFilter === 'pending'
                  ? 'bg-[#0095F6]/10 border-[#0095F6]/40 text-[#0095F6]'
                  : 'bg-[#FAFAFA] dark:bg-[#181818] border-[#DBDBDB] dark:border-[#262626] hover:border-neutral-400 dark:hover:border-neutral-600'
              }`}
            >
              <div className="text-xl sm:text-2xl font-bold font-mono text-black dark:text-white">
                {pendingCount}
              </div>
              <div className="text-[10px] font-semibold text-[#8E8E8E] uppercase tracking-wider mt-0.5">
                To Submit
              </div>
            </div>

            {/* Attendance % */}
            <div 
              onClick={() => setActiveTab('attendance')}
              className="p-3 rounded-lg bg-[#FAFAFA] dark:bg-[#181818] border border-[#DBDBDB] dark:border-[#262626] hover:border-neutral-400 dark:hover:border-neutral-600 text-center cursor-pointer transition-all"
            >
              <div className="text-xl sm:text-2xl font-bold font-mono text-black dark:text-white">
                {attendancePct}%
              </div>
              <div className="text-[10px] font-semibold text-[#8E8E8E] uppercase tracking-wider mt-0.5">
                Attendance
              </div>
            </div>

            {/* Active Polls */}
            <div 
              onClick={() => setActiveTab('polls')}
              className="p-3 rounded-lg bg-[#FAFAFA] dark:bg-[#181818] border border-[#DBDBDB] dark:border-[#262626] hover:border-neutral-400 dark:hover:border-neutral-600 text-center cursor-pointer transition-all"
            >
              <div className="text-xl sm:text-2xl font-bold font-mono text-black dark:text-white">
                {polls.filter(p => !p.isClosed).length}
              </div>
              <div className="text-[10px] font-semibold text-[#8E8E8E] uppercase tracking-wider mt-0.5">
                Consensus
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Quick Action Dock */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
        <button
          onClick={() => {
            const firstPending = assignments.find(a => {
              const sub = submissions.find(s => s.assignmentId === a.id && s.studentId === currentUser.id);
              return sub?.status !== 'submitted';
            });
            if (firstPending) {
              setSelectedAssignmentId(firstPending.id);
              setIsSubmitDrawerOpen(true);
            } else {
              showToast('You have submitted all pending tasks!', 'success');
            }
          }}
          className="p-3 rounded-lg bg-white dark:bg-[#121212] border border-[#DBDBDB] dark:border-[#262626] hover:border-[#0095F6]/50 text-left transition-all group flex items-center gap-3 cursor-pointer"
        >
          <div className="w-8 h-8 rounded-md bg-[#0095F6]/10 text-[#0095F6] flex items-center justify-center shrink-0">
            <Upload className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <span className="text-xs font-semibold text-black dark:text-white block truncate">
              Submit Task
            </span>
            <span className="text-[11px] text-[#8E8E8E] font-medium">
              {pendingCount} remaining
            </span>
          </div>
        </button>

        <button
          onClick={() => setActiveTab('polls')}
          className="p-3 rounded-lg bg-white dark:bg-[#121212] border border-[#DBDBDB] dark:border-[#262626] hover:border-[#0095F6]/50 text-left transition-all group flex items-center gap-3 cursor-pointer"
        >
          <div className="w-8 h-8 rounded-md bg-[#0095F6]/10 text-[#0095F6] flex items-center justify-center shrink-0">
            <Vote className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <span className="text-xs font-semibold text-black dark:text-white block truncate">
              Class Decisions
            </span>
            <span className="text-[11px] text-[#8E8E8E] font-medium">
              Vote on dates
            </span>
          </div>
        </button>

        <button
          onClick={() => setActiveTab('resources')}
          className="p-3 rounded-lg bg-white dark:bg-[#121212] border border-[#DBDBDB] dark:border-[#262626] hover:border-[#0095F6]/50 text-left transition-all group flex items-center gap-3 cursor-pointer"
        >
          <div className="w-8 h-8 rounded-md bg-[#0095F6]/10 text-[#0095F6] flex items-center justify-center shrink-0">
            <FileDown className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <span className="text-xs font-semibold text-black dark:text-white block truncate">
              Notes & PYQs
            </span>
            <span className="text-[11px] text-[#8E8E8E] font-medium">
              {resources.length} available
            </span>
          </div>
        </button>

        <button
          onClick={() => setActiveTab('messages')}
          className="p-3 rounded-lg bg-white dark:bg-[#121212] border border-[#DBDBDB] dark:border-[#262626] hover:border-[#0095F6]/50 text-left transition-all group flex items-center gap-3 cursor-pointer"
        >
          <div className="w-8 h-8 rounded-md bg-[#0095F6]/10 text-[#0095F6] flex items-center justify-center shrink-0">
            <MessageSquare className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <span className="text-xs font-semibold text-black dark:text-white block truncate">
              Ask CR / Class
            </span>
            <span className="text-[11px] text-[#8E8E8E] font-medium">
              Direct chat
            </span>
          </div>
        </button>
      </div>

      {/* 3. Pinned Urgent CR Announcement Banner */}
      {latestBroadcast && (
        <div className="p-4 sm:p-5 rounded-xl bg-white dark:bg-[#121212] border border-[#DBDBDB] dark:border-[#262626] flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all">
          <div className="flex items-start gap-3.5">
            <div className="p-2 rounded-md bg-[#0095F6]/10 text-[#0095F6] shrink-0 mt-0.5">
              <Megaphone className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-[#0095F6] tracking-wider uppercase">
                  Class Announcement
                </span>
                <span className="text-[11px] text-[#8E8E8E] font-mono">
                  {new Date(latestBroadcast.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-black dark:text-white mt-1 leading-relaxed font-medium">
                {latestBroadcast.content}
              </p>
            </div>
          </div>

          <button
            onClick={() => setActiveTab('broadcasts')}
            className="self-end sm:self-center px-3 py-1.5 rounded-lg bg-[#EFEFEF] hover:bg-[#DBDBDB] dark:bg-[#262626] dark:hover:bg-[#363636] text-black dark:text-white text-xs font-semibold flex items-center gap-1.5 shrink-0 transition-all border border-[#DBDBDB] dark:border-[#363636]"
          >
            <span>All Updates</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* 4. Main Bento Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT 8 COLS: Tasks, Live Poll, and Study Materials */}
        <div className="lg:col-span-8 space-y-6">
          {/* SECTION A: COURSE TASKS & ASSIGNMENTS */}
          <div className="bg-white dark:bg-[#121212] rounded-xl border border-[#DBDBDB] dark:border-[#262626] p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-black dark:text-white tracking-tight flex items-center gap-2">
                  <FileText className="w-4 h-4 text-[#0095F6]" />
                  <span>My Active Assignments</span>
                </h2>
                <p className="text-xs text-[#8E8E8E]">
                  Click any assignment to view instructions, discuss questions, or submit work.
                </p>
              </div>

              {/* Filter Tabs */}
              <div className="flex rounded-lg bg-[#EFEFEF] dark:bg-[#262626] p-1 border border-[#DBDBDB] dark:border-[#363636] text-xs font-semibold self-start sm:self-center">
                <button
                  onClick={() => setTaskFilter('all')}
                  className={`px-3 py-1 rounded-md transition-all ${
                    taskFilter === 'all'
                      ? 'bg-white dark:bg-[#121212] text-black dark:text-white shadow-xs font-semibold'
                      : 'text-[#8E8E8E]'
                  }`}
                >
                  All ({assignments.length})
                </button>
                <button
                  onClick={() => setTaskFilter('pending')}
                  className={`px-3 py-1 rounded-md transition-all ${
                    taskFilter === 'pending'
                      ? 'bg-white dark:bg-[#121212] text-black dark:text-white shadow-xs font-semibold'
                      : 'text-[#8E8E8E]'
                  }`}
                >
                  Pending ({pendingCount})
                </button>
                <button
                  onClick={() => setTaskFilter('submitted')}
                  className={`px-3 py-1 rounded-md transition-all ${
                    taskFilter === 'submitted'
                      ? 'bg-white dark:bg-[#121212] text-black dark:text-white shadow-xs font-semibold'
                      : 'text-[#8E8E8E]'
                  }`}
                >
                  Submitted ({submittedCount})
                </button>
              </div>
            </div>

            {/* Task List */}
            <div className="space-y-3">
              {filteredAssignments.length === 0 ? (
                <div className="p-8 text-center text-xs text-[#8E8E8E] bg-[#FAFAFA] dark:bg-[#181818] rounded-lg border border-[#DBDBDB] dark:border-[#262626]">
                  No assignments in this category. You are all caught up!
                </div>
              ) : (
                filteredAssignments.map(asg => {
                  const sub = submissions.find(s => s.assignmentId === asg.id && s.studentId === currentUser.id);
                  const isSubmitted = sub?.status === 'submitted';
                  const isOverdue = new Date(asg.deadline).getTime() < new Date().getTime() && !isSubmitted;
                  const isSelected = selectedAssignmentId === asg.id;

                  return (
                    <div
                      key={asg.id}
                      onClick={() => handleSelectTask(asg.id)}
                      className={`p-4 rounded-lg border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#0095F6]/5 border-[#0095F6] ring-1 ring-[#0095F6]'
                          : 'bg-[#FAFAFA] dark:bg-[#181818] border-[#DBDBDB] dark:border-[#262626] hover:border-neutral-400 dark:hover:border-neutral-600'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#EFEFEF] dark:bg-[#262626] text-black dark:text-white border border-[#DBDBDB] dark:border-[#363636]">
                              {asg.subject}
                            </span>

                            <span
                              className={`text-[11px] font-medium px-2 py-0.5 rounded ${
                                isOverdue
                                  ? 'text-rose-600 dark:text-rose-400 bg-rose-500/10 border border-rose-500/30'
                                  : 'text-[#8E8E8E] bg-[#EFEFEF] dark:bg-[#262626]'
                              }`}
                            >
                              Due {new Date(asg.deadline).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>

                          <h3 className="font-semibold text-sm sm:text-base text-black dark:text-white truncate">
                            {asg.title}
                          </h3>

                          <p className="text-xs text-[#737373] dark:text-[#A8A8A8] mt-1 line-clamp-1">
                            {asg.description}
                          </p>
                        </div>

                        {/* Status badge & Submit CTA */}
                        <div className="flex items-center gap-2.5 self-end sm:self-center shrink-0">
                          {getStatusBadge(sub?.status)}

                          {!isSubmitted ? (
                            <button
                              onClick={(e) => handleOpenSubmit(asg.id, e)}
                              disabled={isOffline}
                              className="px-3.5 py-1.5 rounded-lg bg-[#0095F6] hover:bg-[#1877F2] disabled:opacity-50 text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs"
                            >
                              <Upload className="w-3.5 h-3.5" />
                              <span>Submit</span>
                            </button>
                          ) : (
                            <span className="text-[11px] font-mono text-[#8E8E8E]">
                              Verified
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* SECTION B: LIVE CLASS DECISION / POLL */}
          {activePoll && (
            <div className="bg-white dark:bg-[#121212] rounded-xl border border-[#DBDBDB] dark:border-[#262626] p-5 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-md bg-[#0095F6]/10 text-[#0095F6]">
                    <Vote className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm text-black dark:text-white">
                      Active Class Decision
                    </h3>
                    <p className="text-[11px] text-[#8E8E8E]">
                      Vote directly below to reach class consensus.
                    </p>
                  </div>
                </div>

                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#0095F6]/10 text-[#0095F6] border border-[#0095F6]/30">
                  Live Poll
                </span>
              </div>

              <div className="p-3.5 rounded-lg bg-[#FAFAFA] dark:bg-[#181818] border border-[#DBDBDB] dark:border-[#262626] space-y-3">
                <p className="text-xs sm:text-sm font-semibold text-black dark:text-white">
                  {activePoll.question}
                </p>

                {activePoll.description && (
                  <p className="text-xs text-[#8E8E8E]">
                    {activePoll.description}
                  </p>
                )}

                {/* Poll Options with 1-click voting */}
                <div className="space-y-2">
                  {activePoll.options.map(opt => {
                    const totalVotes = activePoll.options.reduce((sum, o) => sum + o.votes.length, 0);
                    const pct = totalVotes > 0 ? Math.round((opt.votes.length / totalVotes) * 100) : 0;
                    const hasVotedThis = opt.votes.includes(currentUser.id);

                    return (
                      <div
                        key={opt.id}
                        onClick={() => votePoll(activePoll.id, opt.id)}
                        className={`relative p-3 rounded-lg border transition-all cursor-pointer overflow-hidden ${
                          hasVotedThis
                            ? 'bg-[#0095F6]/10 border-[#0095F6] text-[#0095F6] font-semibold'
                            : 'bg-white dark:bg-[#121212] border-[#DBDBDB] dark:border-[#262626] hover:border-neutral-400 dark:hover:border-neutral-600'
                        }`}
                      >
                        {/* Fill bar */}
                        <div 
                          className="absolute inset-y-0 left-0 bg-[#0095F6]/15 transition-all duration-500"
                          style={{ width: `${pct}%` }}
                        />

                        <div className="relative z-10 flex items-center justify-between text-xs">
                          <span className="truncate pr-2 font-medium">
                            {opt.text}
                          </span>
                          <div className="flex items-center gap-2 shrink-0 font-mono text-[11px]">
                            {hasVotedThis && (
                              <span className="text-[#0095F6] font-bold text-[10px] uppercase">
                                Your Vote
                              </span>
                            )}
                            <span className="font-semibold text-black dark:text-white">
                              {pct}% ({opt.votes.length})
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* SECTION C: TOP STUDY MATERIALS & NOTES */}
          <div className="bg-white dark:bg-[#121212] rounded-xl border border-[#DBDBDB] dark:border-[#262626] p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-sm text-black dark:text-white flex items-center gap-2">
                  <FileDown className="w-4 h-4 text-[#0095F6]" />
                  <span>Shared Class Notes & PYQs</span>
                </h3>
                <p className="text-[11px] text-[#8E8E8E]">
                  Instant 1-click access to peer-verified materials.
                </p>
              </div>

              <button
                onClick={() => setActiveTab('resources')}
                className="text-xs font-semibold text-[#0095F6] hover:underline flex items-center gap-1"
              >
                <span>View all ({resources.length})</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {recentResources.map(res => (
                <div
                  key={res.id}
                  className="p-3 rounded-lg bg-[#FAFAFA] dark:bg-[#181818] border border-[#DBDBDB] dark:border-[#262626] hover:border-neutral-400 dark:hover:border-neutral-600 transition-all flex flex-col justify-between"
                >
                  <div>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#EFEFEF] dark:bg-[#262626] text-black dark:text-white uppercase tracking-wider">
                      {res.category}
                    </span>
                    <h4 className="text-xs font-semibold text-black dark:text-white mt-2 line-clamp-2 leading-snug">
                      {res.title}
                    </h4>
                    <span className="text-[10px] text-[#8E8E8E] block mt-1">
                      {res.subject} · {res.fileSize}
                    </span>
                  </div>

                  <button
                    onClick={() => showToast(`Downloaded ${res.fileName}`, 'success')}
                    className="mt-3 w-full py-1.5 rounded-md bg-white dark:bg-[#121212] hover:bg-[#FAFAFA] dark:hover:bg-[#1C1C1C] text-black dark:text-white border border-[#DBDBDB] dark:border-[#262626] text-xs font-medium flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Download className="w-3 h-3 text-[#0095F6]" />
                    <span>Download</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT 4 COLS: Attendance, Daily Schedule & Live Q&A preview */}
        <div className="lg:col-span-4 space-y-6">
          {/* WIDGET 1: ATTENDANCE STATUS */}
          <div className="bg-white dark:bg-[#121212] rounded-xl border border-[#DBDBDB] dark:border-[#262626] p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-sm text-black dark:text-white flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-emerald-500" />
                <span>Attendance Health</span>
              </h3>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                attendancePct >= 75
                  ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                  : 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
              }`}>
                {attendancePct >= 75 ? 'Safe (>75%)' : 'Low Attendance'}
              </span>
            </div>

            <div className="p-4 rounded-lg bg-[#FAFAFA] dark:bg-[#181818] border border-[#DBDBDB] dark:border-[#262626] flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold font-mono text-black dark:text-white">
                  {attendancePct}%
                </div>
                <div className="text-xs text-[#8E8E8E] mt-0.5">
                  {attendedSessions} of {totalAttSessions} classes attended
                </div>
              </div>

              <div className="w-12 h-12 rounded-full border-2 border-emerald-500 flex items-center justify-center font-bold text-xs text-black dark:text-white font-mono">
                {attendedSessions}/{totalAttSessions}
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-[10px] font-semibold text-[#8E8E8E] uppercase tracking-wider block">
                Recent Sessions
              </span>
              {attendanceSessions.slice(0, 2).map((att: AttendanceSession) => {
                const rec = att.records.find(r => r.studentId === currentUser.id);
                return (
                  <div
                    key={att.id}
                    className="p-2.5 rounded-lg bg-[#FAFAFA] dark:bg-[#181818] border border-[#DBDBDB] dark:border-[#262626] flex items-center justify-between text-xs"
                  >
                    <div className="min-w-0 pr-2">
                      <p className="font-medium text-black dark:text-white truncate">
                        {att.subject}
                      </p>
                      <p className="text-[10px] text-[#8E8E8E]">
                        {att.date} · {att.topic}
                      </p>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-medium shrink-0 ${
                      rec?.status === 'present'
                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                        : 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                    }`}>
                      {rec?.status === 'present' ? 'Present' : 'Absent'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* WIDGET 2: CLASS Q&A & RECENT MESSAGES */}
          <div className="bg-white dark:bg-[#121212] rounded-xl border border-[#DBDBDB] dark:border-[#262626] p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-sm text-black dark:text-white flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-purple-500" />
                <span>Class Discussion Feed</span>
              </h3>
              <button
                onClick={() => setActiveTab('messages')}
                className="text-xs text-[#0095F6] hover:underline"
              >
                Expand
              </button>
            </div>

            <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
              {messages.slice(-3).map(m => (
                <div
                  key={m.id}
                  className="p-2.5 rounded-lg bg-[#FAFAFA] dark:bg-[#181818] border border-[#DBDBDB] dark:border-[#262626] text-xs space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-black dark:text-white flex items-center gap-1.5">
                      {m.senderName}
                      {m.senderRole === 'CR' && (
                        <span className="px-1 py-0.2 rounded bg-[#0095F6] text-white text-[9px] font-bold">
                          CR
                        </span>
                      )}
                    </span>
                    <span className="text-[10px] text-[#8E8E8E] font-mono">
                      {new Date(m.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-[#737373] dark:text-[#A8A8A8] line-clamp-2 leading-relaxed">
                    {m.content}
                  </p>
                </div>
              ))}
            </div>

            {/* Quick send form right on dashboard */}
            <form onSubmit={handleQuickSendMsg} className="flex items-center gap-1.5 pt-2 border-t border-[#DBDBDB] dark:border-[#262626]">
              <input
                type="text"
                value={quickMsg}
                onChange={(e) => setQuickMsg(e.target.value)}
                placeholder="Ask a question or reply..."
                className="flex-1 text-xs px-3 py-2 rounded-lg border border-[#DBDBDB] dark:border-[#262626] bg-[#FAFAFA] dark:bg-[#181818] text-black dark:text-white focus:outline-none focus:border-[#0095F6]"
              />
              <button
                type="submit"
                disabled={!quickMsg.trim()}
                className="p-2 rounded-lg bg-[#0095F6] hover:bg-[#1877F2] disabled:opacity-50 text-white transition-colors"
                title="Send to class chat"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
