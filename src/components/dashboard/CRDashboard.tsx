import React from 'react';
import { useStudySync } from '../../store';
import { 
  Plus, 
  Users, 
  Clock, 
  FileCheck, 
  BellRing, 
  ChevronRight, 
  Download
} from 'lucide-react';

export const CRDashboard: React.FC = () => {
  const { 
    currentUser, 
    currentClass, 
    allUsers, 
    assignments, 
    submissions, 
    selectedAssignmentId, 
    setSelectedAssignmentId, 
    setIsRightPanelOpen, 
    setIsNewAssignmentModalOpen,
    remindPendingStudents,
    exportSubmissionsCSV
  } = useStudySync();

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

  return (
    <div className="p-4 lg:p-7 space-y-6 max-w-6xl mx-auto">
      {/* Top Bar Greeting & CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl lg:text-2xl font-extrabold text-[#0F2044] dark:text-white tracking-tight">
            Class Dashboard · {currentClass.name}
          </h1>
          <p className="text-xs sm:text-sm text-[#64748B] dark:text-[#94A3B8] mt-0.5">
            Real-time submission monitoring and broadcast coordinator.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => exportSubmissionsCSV()}
            className="px-3 py-2 rounded-lg border border-[#E2E7F0] dark:border-[#1E293B] bg-white dark:bg-[#0F172A] hover:bg-[#F8FAFC] dark:hover:bg-[#15203B] text-xs font-semibold text-[#0F2044] dark:text-white flex items-center gap-1.5 transition-all shadow-xs"
          >
            <Download className="w-3.5 h-3.5 text-[#64748B] dark:text-[#94A3B8]" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={() => setIsNewAssignmentModalOpen(true)}
            className="px-3.5 py-2 rounded-lg bg-[#00B4A6] dark:bg-[#00D2C4] hover:bg-[#009E91] dark:hover:bg-[#00B4A6] text-white dark:text-[#080D1A] text-xs font-bold flex items-center gap-1.5 transition-all shadow-md shadow-[#00B4A6]/15"
          >
            <Plus className="w-4 h-4" />
            <span>New Assignment</span>
          </button>
        </div>
      </div>

      {/* 3 Horizontal Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-xl bg-white dark:bg-[#0F172A] border border-[#E2E7F0] dark:border-[#1E293B] shadow-xs flex items-center justify-between transition-all hover:border-[#CBD5E1] dark:hover:border-[#334155]">
          <div>
            <span className="text-xs font-bold text-[#64748B] dark:text-[#94A3B8] block uppercase tracking-wider text-[11px]">
              Total Students
            </span>
            <div className="flex items-baseline gap-1.5 mt-1.5">
              <span className="text-2xl lg:text-3xl font-extrabold text-[#0F2044] dark:text-white font-mono">
                {totalStudents}
              </span>
              <span className="text-xs text-[#64748B] dark:text-[#94A3B8]">enrolled</span>
            </div>
          </div>
          <div className="w-11 h-11 rounded-xl bg-[#E6F8F6] dark:bg-[#00D2C4]/10 text-[#00897B] dark:text-[#00D2C4] flex items-center justify-center border border-[#00B4A6]/20 shadow-xs">
            <Users className="w-5 h-5" />
          </div>
        </div>

        <div className="p-5 rounded-xl bg-white dark:bg-[#0F172A] border border-[#E2E7F0] dark:border-[#1E293B] shadow-xs flex items-center justify-between transition-all hover:border-[#CBD5E1] dark:hover:border-[#334155]">
          <div>
            <span className="text-xs font-bold text-[#64748B] dark:text-[#94A3B8] block uppercase tracking-wider text-[11px]">
              Pending Submissions
            </span>
            <div className="flex items-baseline gap-1.5 mt-1.5">
              <span className="text-2xl lg:text-3xl font-extrabold text-[#D97706] dark:text-[#FBBF24] font-mono">
                {pendingSubmissionsCount}
              </span>
              <span className="text-xs text-[#64748B] dark:text-[#94A3B8]">need action</span>
            </div>
          </div>
          <div className="w-11 h-11 rounded-xl bg-[#FEF6EC] dark:bg-[#F59E0B]/10 text-[#D97706] dark:text-[#FBBF24] flex items-center justify-center border border-[#F59E0B]/20 shadow-xs">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="p-5 rounded-xl bg-white dark:bg-[#0F172A] border border-[#E2E7F0] dark:border-[#1E293B] shadow-xs flex items-center justify-between transition-all hover:border-[#CBD5E1] dark:hover:border-[#334155]">
          <div>
            <span className="text-xs font-bold text-[#64748B] dark:text-[#94A3B8] block uppercase tracking-wider text-[11px]">
              Active Assignments
            </span>
            <div className="flex items-baseline gap-1.5 mt-1.5">
              <span className="text-2xl lg:text-3xl font-extrabold text-[#0F2044] dark:text-white font-mono">
                {activeAssignments.length}
              </span>
              <span className="text-xs text-[#64748B] dark:text-[#94A3B8]">this week</span>
            </div>
          </div>
          <div className="w-11 h-11 rounded-xl bg-[#E6F8F6] dark:bg-[#00D2C4]/10 text-[#00897B] dark:text-[#00D2C4] flex items-center justify-center border border-[#00B4A6]/20 shadow-xs">
            <FileCheck className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Live Submission Feed */}
      <div className="bg-white dark:bg-[#0F172A] border border-[#E2E7F0] dark:border-[#1E293B] rounded-xl shadow-xs overflow-hidden">
        <div className="px-5 py-4 border-b border-[#E2E7F0] dark:border-[#1E293B] flex items-center justify-between bg-[#F8FAFC]/50 dark:bg-[#15203B]/40">
          <div>
            <h2 className="font-extrabold text-sm sm:text-base text-[#0F2044] dark:text-white">
              Live Submission Feed
            </h2>
            <p className="text-xs text-[#64748B] dark:text-[#94A3B8] mt-0.5">
              Select any assignment row to inspect individual student logs in the right panel.
            </p>
          </div>
          <span className="text-xs text-[#00897B] dark:text-[#00D2C4] font-bold flex items-center gap-1.5 bg-[#E6F8F6] dark:bg-[#00D2C4]/10 px-2.5 py-1 rounded-full border border-[#00B4A6]/20">
            <span className="w-2 h-2 rounded-full bg-[#00B4A6] dark:bg-[#00D2C4] animate-live-pulse" />
            Live Sync
          </span>
        </div>

        <div className="divide-y divide-[#E2E7F0] dark:divide-[#1E293B]">
          {assignments.length === 0 ? (
            <div className="p-8 text-center text-xs text-[#64748B] dark:text-[#94A3B8]">
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
                      ? 'bg-[#E6F8F6]/60 dark:bg-[#00D2C4]/10 border-l-4 border-l-[#00B4A6] dark:border-l-[#00D2C4]' 
                      : 'hover:bg-[#F8FAFC] dark:hover:bg-[#15203B]/60'
                  }`}
                >
                  {/* Left info */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#F1F5F9] dark:bg-[#1E293B] text-[#475569] dark:text-[#94A3B8] border border-[#E2E7F0] dark:border-[#334155]">
                        {asg.subject}
                      </span>
                      
                      <span
                        className={`text-xs font-bold px-2 py-0.5 rounded ${
                          relDeadline.isOverdue
                            ? 'text-[#E63946] dark:text-[#FB7185] bg-[#FDECEC] dark:bg-[#E63946]/15'
                            : relDeadline.isUrgent
                            ? 'text-[#D97706] dark:text-[#FBBF24] bg-[#FEF6EC] dark:bg-[#F59E0B]/15'
                            : 'text-[#64748B] dark:text-[#94A3B8] bg-[#F1F5F9] dark:bg-[#1E293B]'
                        }`}
                      >
                        {relDeadline.label}
                      </span>
                    </div>

                    <h3 className="font-bold text-sm sm:text-base text-[#0F2044] dark:text-white mt-1.5 truncate">
                      {asg.title}
                    </h3>
                  </div>

                  {/* Center Progress Bar */}
                  <div className="w-full md:w-64 space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="text-[#0F2044] dark:text-white font-mono">
                        {submittedCount}/{totalStudents} submitted
                      </span>
                      <span className="text-[#00897B] dark:text-[#00D2C4] font-mono">
                        {percent}%
                      </span>
                    </div>

                    <div className="w-full h-2 rounded-full bg-[#E2E7F0] dark:bg-[#1E293B] overflow-hidden">
                      <div
                        className="h-full bg-[#00B4A6] dark:bg-[#00D2C4] progress-bar-fill rounded-full"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>

                  {/* Right Actions */}
                  <div className="flex items-center gap-2 shrink-0" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => remindPendingStudents(asg.id)}
                      title="Send notification to all non-submitters"
                      className="px-2.5 py-1.5 rounded-lg border border-[#E2E7F0] dark:border-[#1E293B] bg-white dark:bg-[#080D1A] hover:bg-[#F8FAFC] dark:hover:bg-[#15203B] text-xs font-semibold text-[#0F2044] dark:text-white flex items-center gap-1.5 transition-all shadow-xs"
                    >
                      <BellRing className="w-3.5 h-3.5 text-[#F59E0B]" />
                      <span className="hidden sm:inline">Remind pending</span>
                    </button>

                    <button
                      onClick={() => handleSelectAssignment(asg.id)}
                      className="p-1.5 rounded-lg hover:bg-[#E2E7F0] dark:hover:bg-[#1E293B] text-[#64748B] hover:text-[#0F2044] dark:hover:text-white transition-colors"
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
