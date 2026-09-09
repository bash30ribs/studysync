import React from 'react';
import { useStudySync } from '../../store';
import { 
  Megaphone, 
  Clock, 
  CheckCircle2, 
  Eye, 
  Upload, 
  ArrowRight,
  Calendar
} from 'lucide-react';

export const StudentDashboard: React.FC = () => {
  const { 
    currentUser, 
    assignments, 
    submissions, 
    broadcasts, 
    selectedAssignmentId, 
    setSelectedAssignmentId, 
    setIsRightPanelOpen, 
    setIsSubmitDrawerOpen,
    markAssignmentViewed,
    setActiveTab,
    isOffline
  } = useStudySync();

  const latestBroadcast = broadcasts[0];

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

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case 'submitted':
        return (
          <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-[#E6F8F6] dark:bg-[#00D2C4]/15 text-[#00897B] dark:text-[#00D2C4] border border-[#00B4A6]/20">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Submitted
          </span>
        );
      case 'viewed':
        return (
          <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-[#FEF6EC] dark:bg-[#F59E0B]/15 text-[#D97706] dark:text-[#FBBF24] border border-[#F59E0B]/20">
            <Eye className="w-3.5 h-3.5" />
            Viewed
          </span>
        );
      default:
        return (
          <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-[#F1F5F9] dark:bg-[#1E293B] text-[#64748B] dark:text-[#94A3B8] border border-[#E2E7F0] dark:border-[#334155]">
            <Clock className="w-3.5 h-3.5" />
            Assigned
          </span>
        );
    }
  };

  // Upcoming 3-day lookahead
  const nowTime = new Date().getTime();
  const threeDaysFromNow = nowTime + 3 * 24 * 60 * 60 * 1000;
  const upcomingDeadlines = assignments
    .filter(a => {
      const d = new Date(a.deadline).getTime();
      return d >= nowTime && d <= threeDaysFromNow;
    })
    .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime());

  return (
    <div className="p-4 lg:p-7 space-y-6 max-w-6xl mx-auto">
      {/* Pinned Broadcast Banner */}
      {latestBroadcast && (
        <div className="p-4 sm:p-5 rounded-xl bg-[#0F2044] dark:bg-[#0F172A] text-white border border-[#193166] dark:border-[#1E293B] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-lg bg-[#193166] dark:bg-[#080D1A] text-[#00B4A6] dark:text-[#00D2C4] shrink-0 mt-0.5 border border-[#25427C] dark:border-[#1E293B]">
              <Megaphone className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-extrabold text-[#00B4A6] dark:text-[#00D2C4] tracking-wider uppercase">
                  Official Announcement
                </span>
                <span className="text-[11px] text-[#94A3B8] font-mono">
                  {new Date(latestBroadcast.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-white mt-1 leading-relaxed">
                {latestBroadcast.content}
              </p>
            </div>
          </div>

          <button
            onClick={() => setActiveTab('broadcasts')}
            className="self-end sm:self-center px-3 py-1.5 rounded-lg bg-[#193166] hover:bg-[#25427C] dark:bg-[#15203B] dark:hover:bg-[#1E293B] text-white text-xs font-semibold flex items-center gap-1.5 shrink-0 transition-colors border border-[#25427C] dark:border-[#334155]"
          >
            <span>All Updates</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Main Grid: My Tasks & Upcoming Lookahead */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: My Tasks List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-extrabold text-[#0F2044] dark:text-white tracking-tight">
                My Course Tasks
              </h2>
              <p className="text-xs text-[#64748B] dark:text-[#94A3B8]">
                Auto-advances from Assigned to Viewed to Submitted upon your action.
              </p>
            </div>
            <span className="text-xs font-bold text-[#64748B] dark:text-[#94A3B8]">
              {assignments.length} total tasks
            </span>
          </div>

          <div className="space-y-3">
            {assignments.length === 0 ? (
              <div className="p-8 text-center text-xs text-[#64748B] dark:text-[#94A3B8] bg-white dark:bg-[#0F172A] rounded-xl border border-[#E2E7F0] dark:border-[#1E293B]">
                No pending tasks right now. You are completely caught up!
              </div>
            ) : (
              assignments.map(asg => {
                const sub = submissions.find(s => s.assignmentId === asg.id && s.studentId === currentUser.id);
                const isOverdue = new Date(asg.deadline).getTime() < new Date().getTime() && sub?.status !== 'submitted';
                const isSelected = selectedAssignmentId === asg.id;

                return (
                  <div
                    key={asg.id}
                    onClick={() => handleSelectTask(asg.id)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-white dark:bg-[#0F172A] border-[#00B4A6] dark:border-[#00D2C4] shadow-sm ring-1 ring-[#00B4A6]/20'
                        : 'bg-white dark:bg-[#0F172A] border-[#E2E7F0] dark:border-[#1E293B] hover:border-[#CBD5E1] dark:hover:border-[#334155]'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#F1F5F9] dark:bg-[#1E293B] text-[#475569] dark:text-[#94A3B8] border border-[#E2E7F0] dark:border-[#334155]">
                            {asg.subject}
                          </span>

                          <span
                            className={`text-xs font-bold px-2 py-0.5 rounded ${
                              isOverdue
                                ? 'text-[#E63946] dark:text-[#FB7185] bg-[#FDECEC] dark:bg-[#E63946]/15'
                                : 'text-[#64748B] dark:text-[#94A3B8] bg-[#F1F5F9] dark:bg-[#1E293B]'
                            }`}
                          >
                            Due {new Date(asg.deadline).toLocaleDateString(undefined, { weekday: 'short', hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>

                        <h3 className="font-bold text-sm sm:text-base text-[#0F2044] dark:text-white mt-1.5 truncate">
                          {asg.title}
                        </h3>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                        {getStatusBadge(sub?.status)}

                        {sub?.status !== 'submitted' && (
                          <button
                            onClick={(e) => handleOpenSubmit(asg.id, e)}
                            disabled={isOffline}
                            className="px-3 py-1.5 rounded-lg bg-[#00B4A6] dark:bg-[#00D2C4] hover:bg-[#009E91] dark:hover:bg-[#00B4A6] disabled:opacity-50 text-white dark:text-[#080D1A] text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs"
                          >
                            <Upload className="w-3.5 h-3.5" />
                            <span>Submit</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Col: 3-Day Upcoming Deadlines */}
        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-extrabold text-[#0F2044] dark:text-white tracking-tight">
              Upcoming Deadlines
            </h2>
            <p className="text-xs text-[#64748B] dark:text-[#94A3B8]">
              3-day schedule lookahead.
            </p>
          </div>

          <div className="bg-white dark:bg-[#0F172A] border border-[#E2E7F0] dark:border-[#1E293B] rounded-xl p-4 space-y-3 shadow-xs">
            {upcomingDeadlines.length === 0 ? (
              <p className="text-xs text-[#64748B] dark:text-[#94A3B8] py-4 text-center">
                No immediate deadlines in the next 72 hours.
              </p>
            ) : (
              upcomingDeadlines.map(asg => (
                <div
                  key={asg.id}
                  onClick={() => handleSelectTask(asg.id)}
                  className="p-3 rounded-lg bg-[#F8FAFC] dark:bg-[#15203B]/60 border border-[#E2E7F0] dark:border-[#1E293B] hover:border-[#00B4A6] dark:hover:border-[#00D2C4] cursor-pointer transition-colors"
                >
                  <div className="flex items-center justify-between text-[11px] mb-1">
                    <span className="font-bold text-[#00897B] dark:text-[#00D2C4]">{asg.subject}</span>
                    <span className="font-mono text-[#64748B] dark:text-[#94A3B8]">
                      {new Date(asg.deadline).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-[#0F2044] dark:text-white truncate">
                    {asg.title}
                  </p>
                </div>
              ))
            )}

            <button
              onClick={() => setActiveTab('calendar')}
              className="w-full py-2 px-3 rounded-lg border border-[#E2E7F0] dark:border-[#1E293B] text-xs font-semibold text-[#0F2044] dark:text-white hover:bg-[#F8FAFC] dark:hover:bg-[#15203B] flex items-center justify-center gap-1.5 transition-colors"
            >
              <Calendar className="w-3.5 h-3.5 text-[#00B4A6] dark:text-[#00D2C4]" />
              <span>Open Class Calendar</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
