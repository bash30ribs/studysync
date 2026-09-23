import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useStudySync } from '../../store';
import { getRelativeDeadline } from '../../utils/deadlineUtils';
import { getTopStudentStreaks } from '../../utils/streakUtils';
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
  CheckCircle2,
  GraduationCap,
  Share2,
  RefreshCw
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
    submitAssignment,
    setActiveTab,
    showToast
  } = useStudySync();

  const safeClass = currentClass || { name: 'Cohort', code: 'CODE' };
  const safeUsers = Array.isArray(allUsers) ? allUsers : [];
  const safeAssignments = Array.isArray(assignments) ? assignments : [];
  const safeSubmissions = Array.isArray(submissions) ? submissions : [];

  const [broadcastText, setBroadcastText] = useState('');
  const totalStudents = safeUsers.filter(u => u.role === 'Student').length;
  
  const activeAssignments = safeAssignments.filter(a => a.status === 'active');
  const totalSubmissionsNeeded = activeAssignments.length * totalStudents;
  const totalSubmissionsCompleted = safeSubmissions.filter(s => s.status === 'submitted').length;
  const pendingSubmissionsCount = Math.max(0, totalSubmissionsNeeded - totalSubmissionsCompleted);

  // Animated metric counters with easeOutCubic over 600ms
  const [displayEnrolled, setDisplayEnrolled] = useState(0);
  const [displaySubjects, setDisplaySubjects] = useState(0);
  const [displayPending, setDisplayPending] = useState(0);
  const [displayDeadlines, setDisplayDeadlines] = useState(0);

  const runCounterAnimation = useCallback(() => {
    const duration = 600;
    const startTime = performance.now();
    const targetEnrolled = totalStudents;
    const targetSubjects = (safeClass.subjects || []).length || 6;
    const targetPending = pendingSubmissionsCount;
    const targetDeadlines = activeAssignments.length;

    const step = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // easeOutCubic: 1 - (1 - t)^3
      const ease = 1 - Math.pow(1 - progress, 3);

      setDisplayEnrolled(Math.round(ease * targetEnrolled));
      setDisplaySubjects(Math.round(ease * targetSubjects));
      setDisplayPending(Math.round(ease * targetPending));
      setDisplayDeadlines(Math.round(ease * targetDeadlines));

      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };
    requestAnimationFrame(step);
  }, [totalStudents, safeClass.subjects, pendingSubmissionsCount, activeAssignments.length]);

  useEffect(() => {
    runCounterAnimation();
  }, [runCounterAnimation]);

  // Pull-to-refresh on mobile
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const touchStartY = useRef(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (typeof window !== 'undefined' && window.scrollY <= 5) {
      touchStartY.current = e.touches[0].clientY;
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartY.current > 0) {
      const currentY = e.touches[0].clientY;
      const diff = currentY - touchStartY.current;
      if (diff > 0) {
        setPullDistance(Math.min(diff * 0.5, 70));
      }
    }
  };

  const handleTouchEnd = () => {
    if (pullDistance >= 50) {
      setIsRefreshing(true);
      runCounterAnimation();
      showToast('Workspace refreshed', 'info');
      setTimeout(() => {
        setIsRefreshing(false);
        setPullDistance(0);
      }, 500);
    } else {
      setPullDistance(0);
    }
    touchStartY.current = 0;
  };

  // Nudge button micro-interactions state: Record<asgId, boolean>
  const [sentNudgeIds, setSentNudgeIds] = useState<Record<string, boolean>>({});

  const handleNudge = (asgId: string) => {
    try {
      navigator.vibrate?.(50);
    } catch {}
    remindPendingStudents(asgId);
    setSentNudgeIds(prev => ({ ...prev, [asgId]: true }));
    setTimeout(() => {
      setSentNudgeIds(prev => ({ ...prev, [asgId]: false }));
    }, 2000);
  };

  // Live Submission Pulse (Demo Mode: every 28 seconds simulate 1 new submission)
  const [pulsingAsgId, setPulsingAsgId] = useState<string | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      // Find candidate assignment not fully submitted
      const candidate = safeAssignments.find(asg => {
        const asgSubs = safeSubmissions.filter(s => s.assignmentId === asg.id && s.status === 'submitted');
        return asgSubs.length < totalStudents;
      });

      if (candidate) {
        const asgSubs = safeSubmissions.filter(s => s.assignmentId === candidate.id && s.status === 'submitted');
        const submittedStudentIds = new Set(asgSubs.map(s => s.studentId));
        const unsubmittedStudent = safeUsers.find(u => u.role === 'Student' && !submittedStudentIds.has(u.id));

        if (unsubmittedStudent) {
          submitAssignment(candidate.id, `Submitted by ${unsubmittedStudent.name}`, {
            name: `${candidate.title.toLowerCase().replace(/\s+/g, '_')}_submission.pdf`,
            size: '1.8 MB'
          });

          // Flash progress bar green for 600ms
          setPulsingAsgId(candidate.id);
          setTimeout(() => setPulsingAsgId(null), 600);

          showToast(`✓ New submission — ${unsubmittedStudent.name}`, 'success');
        }
      }
    }, 28000);

    return () => clearInterval(interval);
  }, [safeAssignments, safeSubmissions, totalStudents, safeUsers, submitAssignment, showToast]);

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
  const actionableAssignments = safeAssignments
    .map(asg => {
      const asgSubs = safeSubmissions.filter(s => s.assignmentId === asg.id && s.status === 'submitted');
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

  // Feature 5 — WhatsApp Share Summary
  const handleShareWhatsAppUpdate = () => {
    const overdueNames = actionableAssignments
      .filter(a => a.relDeadline.isOverdue)
      .map(a => a.title);
    const overdueText = overdueNames.length > 0 ? overdueNames.join(', ') : 'None';
    const avgSubmissionRate = actionableAssignments.length > 0
      ? Math.round(actionableAssignments.reduce((acc, a) => acc + a.percent, 0) / actionableAssignments.length)
      : 100;

    const summaryText = `📚 *${safeClass.name} Class Update*\n🔔 ${pendingSubmissionsCount} assignments pending\n⚠️ Overdue: ${overdueText}\n📊 Avg submission rate: ${avgSubmissionRate}%\n— via StudySync`;

    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      window.open(`https://wa.me/?text=${encodeURIComponent(summaryText)}`, '_blank');
    } else {
      if (navigator.clipboard) {
        navigator.clipboard.writeText(summaryText);
      }
      showToast('Summary copied! Paste in WhatsApp', 'success');
    }
  };

  // Feature 3 — Top 3 Student Streaks for Class Momentum
  const topStreaks = getTopStudentStreaks(safeUsers, safeAssignments, safeSubmissions);

  return (
    <div 
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto space-y-6 relative"
    >
      {/* Pull-to-refresh spinner indicator */}
      {(pullDistance > 0 || isRefreshing) && (
        <div 
          className="flex items-center justify-center py-2 transition-transform duration-150"
          style={{ transform: `translateY(${Math.min(pullDistance, 40)}px)` }}
        >
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white dark:bg-[#1A1A1A] border border-[#DBDBDB] dark:border-[#262626] shadow-sm text-xs font-semibold text-[#0095F6]">
            <RefreshCw className={`w-3.5 h-3.5 ${pullDistance > 50 || isRefreshing ? 'animate-spin' : ''}`} />
            <span>{isRefreshing ? 'Refreshing...' : pullDistance > 50 ? 'Release to refresh' : 'Pull to refresh'}</span>
          </div>
        </div>
      )}

      {/* 1. Clean Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#DBDBDB] dark:border-[#262626]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-black dark:text-white tracking-tight">
              Class Overview
            </h1>
            <span className="text-xs font-mono font-medium px-2 py-0.5 rounded bg-[#EFEFEF] dark:bg-[#262626] text-[#737373] dark:text-[#A8A8A8]">
              {safeClass.name || 'Cohort'}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[#737373] dark:text-[#8E8E8E] mt-1">
            Focus on pending submissions, quick announcements, and urgent deadlines.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
          {/* Feature 5: WhatsApp Share Summary Button */}
          <button
            onClick={handleShareWhatsAppUpdate}
            className="btn-secondary text-xs flex items-center gap-1.5"
            title="Share cohort update"
          >
            <Share2 className="w-3.5 h-3.5 text-emerald-500" />
            <span>📤 Share Update</span>
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

      {/* 2. Focused Metrics with easeOutCubic Animated Counters */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div 
          onClick={() => setActiveTab('members')}
          className="p-4 rounded-xl bg-white dark:bg-[#121212] border border-[#DBDBDB] dark:border-[#262626] hover:border-[#8E8E8E] dark:hover:border-[#3E3E3E] transition-all cursor-pointer group shadow-2xs"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-[#8E8E8E] uppercase tracking-wider">
              Enrolled
            </span>
            <Users className="w-4 h-4 text-[#8E8E8E] group-hover:text-black dark:group-hover:text-white transition-colors" />
          </div>
          <div className="flex items-baseline gap-1.5 mt-2">
            <span className="text-2xl font-bold text-black dark:text-white font-mono">
              {displayEnrolled}
            </span>
            <span className="text-xs text-[#8E8E8E]">students</span>
          </div>
        </div>

        <div 
          onClick={() => setActiveTab('subjects')}
          className="p-4 rounded-xl bg-white dark:bg-[#121212] border border-[#DBDBDB] dark:border-[#262626] hover:border-[#0095F6] dark:hover:border-[#0095F6] transition-all cursor-pointer group shadow-2xs"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-[#0095F6] uppercase tracking-wider">
              Subjects
            </span>
            <GraduationCap className="w-4 h-4 text-[#0095F6] group-hover:scale-110 transition-transform" />
          </div>
          <div className="flex items-baseline gap-1.5 mt-2">
            <span className="text-2xl font-bold text-black dark:text-white font-mono">
              {displaySubjects}
            </span>
            <span className="text-xs text-[#8E8E8E]">manage CRs</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-[#121212] border border-[#DBDBDB] dark:border-[#262626] shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-[#8E8E8E] uppercase tracking-wider">
              Pending
            </span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="flex items-baseline gap-1.5 mt-2">
            <span className="text-2xl font-bold text-amber-500 font-mono">
              {displayPending}
            </span>
            <span className="text-xs text-[#8E8E8E]">pending</span>
          </div>
        </div>

        <div 
          onClick={() => setActiveTab('assignments')}
          className="p-4 rounded-xl bg-white dark:bg-[#121212] border border-[#DBDBDB] dark:border-[#262626] hover:border-[#8E8E8E] dark:hover:border-[#3E3E3E] transition-all cursor-pointer group shadow-2xs"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-[#8E8E8E] uppercase tracking-wider">
              Deadlines
            </span>
            <FileCheck className="w-4 h-4 text-[#0095F6] group-hover:text-[#1877F2] transition-colors" />
          </div>
          <div className="flex items-baseline gap-1.5 mt-2">
            <span className="text-2xl font-bold text-black dark:text-white font-mono">
              {displayDeadlines}
            </span>
            <span className="text-xs text-[#8E8E8E]">active</span>
          </div>
        </div>
      </div>

      {/* Feature 3: Class Momentum Row (Top 3 Student Streaks) */}
      <div className="p-3.5 sm:p-4 rounded-xl bg-white dark:bg-[#121212] border border-[#DBDBDB] dark:border-[#262626] flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-black dark:text-white uppercase tracking-wider flex items-center gap-1.5">
            <span>⚡ Class Momentum</span>
          </span>
          <span className="text-[11px] text-[#8E8E8E]">Top on-time submission streaks</span>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {topStreaks.map(({ student, streak }) => {
            const initials = student.name
              .split(' ')
              .map(n => n[0])
              .join('')
              .toUpperCase();
            return (
              <div
                key={student.id}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#FAFAFA] dark:bg-[#181818] border border-[#DBDBDB] dark:border-[#262626] text-xs"
              >
                <span className="w-5 h-5 rounded-full bg-[#0095F6]/15 text-[#0095F6] font-bold text-[10px] flex items-center justify-center">
                  {initials}
                </span>
                <span className="font-semibold text-black dark:text-white truncate max-w-[100px]">
                  {student.name.split(' ')[0]}
                </span>
                <span className="font-bold text-amber-500 font-mono text-[11px]">
                  🔥 {streak}
                </span>
              </div>
            );
          })}
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
            Broadcast to cohort · {totalStudents} members
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
            className="px-4 py-2.5 rounded-lg bg-[#0095F6] hover:bg-[#1877F2] disabled:opacity-40 text-white font-semibold text-xs flex items-center gap-1.5 transition-all shrink-0 cursor-pointer"
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
            className="text-xs text-[#0095F6] hover:underline flex items-center gap-1 font-medium cursor-pointer"
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
              const isPulsing = pulsingAsgId === asg.id;
              const isNudgeSent = sentNudgeIds[asg.id];

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

                  {/* Center: Clean Progress with Feature 4 green flash pulse */}
                  <div className="w-full md:w-48 space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[#8E8E8E] font-mono">
                        {asg.submittedCount}/{totalStudents} submitted
                      </span>
                      <span className="font-mono font-semibold text-black dark:text-white">
                        {asg.percent}%
                      </span>
                    </div>

                    <div 
                      className={`w-full h-1.5 rounded-full bg-[#EFEFEF] dark:bg-[#262626] overflow-hidden transition-all duration-300 ${
                        isPulsing ? 'shadow-[0_0_8px_#22c55e] ring-1 ring-emerald-500' : ''
                      }`}
                    >
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          isPulsing ? 'bg-emerald-500' : 'bg-[#0095F6]'
                        }`}
                        style={{ width: `${asg.percent}%` }}
                      />
                    </div>
                  </div>

                  {/* Right: Nudge Button with Priority 4 Micro-Interaction */}
                  <div className="flex items-center gap-2 shrink-0" onClick={(e) => e.stopPropagation()}>
                    {asg.pendingCount > 0 ? (
                      <button
                        onClick={() => handleNudge(asg.id)}
                        className={`px-3 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition-all duration-200 cursor-pointer ${
                          isNudgeSent
                            ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/40 shadow-[0_0_8px_#22c55e]'
                            : 'border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400'
                        }`}
                      >
                        <BellRing className="w-3.5 h-3.5" />
                        <span>{isNudgeSent ? '✓ Sent!' : `Nudge ${asg.pendingCount} pending`}</span>
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
