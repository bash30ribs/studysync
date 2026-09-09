import React, { useState, useEffect } from 'react';
import { useStudySync } from '../../store';
import { 
  X, 
  FileText, 
  CheckCircle2, 
  Clock, 
  BellRing, 
  Send, 
  Download, 
  ShieldCheck, 
  Upload, 
  Info,
  Check,
  Copy
} from 'lucide-react';

export const RightPanel: React.FC = () => {
  const {
    currentUser,
    currentClass,
    allUsers,
    assignments,
    submissions,
    discussions,
    activeTab,
    selectedAssignmentId,
    selectedStudentId,
    isRightPanelOpen,
    setIsRightPanelOpen,
    remindPendingStudents,
    addDiscussionComment,
    sendBroadcast,
    setIsSubmitDrawerOpen,
    gradeSubmission,
    showToast,
    isOffline
  } = useStudySync();

  const [activeTabSub, setActiveTabSub] = useState<'submissions' | 'discussion'>('submissions');
  const [commentInput, setCommentInput] = useState('');
  const [broadcastInput, setBroadcastInput] = useState('');
  const [countdown, setCountdown] = useState<string>('');

  const selectedAsg = assignments.find(a => a.id === selectedAssignmentId);
  const selectedStudent = allUsers.find(u => u.id === selectedStudentId);

  // Live countdown timer for selected assignment
  useEffect(() => {
    if (!selectedAsg) return;

    const updateTimer = () => {
      const now = new Date().getTime();
      const due = new Date(selectedAsg.deadline).getTime();
      const diff = due - now;

      if (diff <= 0) {
        setCountdown('Deadline Passed');
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const secs = Math.floor((diff % (1000 * 60)) / 1000);

      if (days > 0) {
        setCountdown(`${days}d ${hours}h ${mins}m`);
      } else {
        setCountdown(`${hours}h ${mins}m ${secs}s`);
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [selectedAsg]);

  const handleSendComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAssignmentId || !commentInput.trim()) return;
    addDiscussionComment(selectedAssignmentId, commentInput);
    setCommentInput('');
  };

  const handleSendBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastInput.trim()) return;
    sendBroadcast(broadcastInput);
    setBroadcastInput('');
  };

  // Submissions breakdown for selected assignment
  const asgSubmissions = submissions.filter(s => s.assignmentId === selectedAssignmentId);
  const submittedList = asgSubmissions.filter(s => s.status === 'submitted');
  const submittedStudentIds = new Set(submittedList.map(s => s.studentId));
  
  const pendingStudents = allUsers
    .filter(u => u.role === 'Student')
    .filter(u => !submittedStudentIds.has(u.id));

  const mySubmission = selectedAsg 
    ? submissions.find(s => s.assignmentId === selectedAsg.id && s.studentId === currentUser.id)
    : null;

  return (
    <aside
      className={`
        fixed inset-y-0 right-0 z-40 w-[360px] bg-white dark:bg-[#0B132B] border-l border-[#E2E8F0] dark:border-[#1E293B] flex flex-col h-full shadow-2xl lg:shadow-none lg:static lg:block
        panel-transition
        ${isRightPanelOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
      `}
    >
      {/* Mobile / Tablet close drawer header */}
      <div className="flex lg:hidden items-center justify-between p-3.5 border-b border-[#E2E8F0] dark:border-[#1E293B] bg-[#F8FAFC] dark:bg-[#080D1A]">
        <span className="text-xs font-bold text-[#0F2044] dark:text-white uppercase tracking-wider">
          Context Details
        </span>
        <button
          onClick={() => setIsRightPanelOpen(false)}
          className="p-1 rounded-md text-[#64748B] hover:text-[#0F2044] dark:hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto flex flex-col justify-between">
        {/* VIEW 1: BROADCASTS TAB RIGHT PANEL */}
        {activeTab === 'broadcasts' && currentUser.role === 'CR' ? (
          <div className="p-5 space-y-4">
            <div className="border-b border-[#E2E8F0] dark:border-[#1E293B] pb-3">
              <h3 className="font-bold text-sm text-[#0F2044] dark:text-white">
                Compose Official Broadcast
              </h3>
              <p className="text-xs text-[#64748B] dark:text-[#94A3B8] mt-0.5 leading-relaxed">
                Broadcasts notify all enrolled students immediately. Immutable for accountability.
              </p>
            </div>

            <form onSubmit={handleSendBroadcast} className="space-y-3">
              <div className="relative">
                <textarea
                  value={broadcastInput}
                  onChange={(e) => setBroadcastInput(e.target.value.slice(0, 500))}
                  rows={6}
                  placeholder="Write clear class announcement (e.g. Schedule changes, lab guidelines, urgent notices)..."
                  className="w-full text-xs p-3 rounded-lg border border-[#E2E8F0] dark:border-[#1E293B] bg-[#F8FAFC] dark:bg-[#080D1A] text-[#0F2044] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#00B4A6]/20 focus:border-[#00B4A6] dark:focus:border-[#00D2C4] resize-none"
                />
                <div className="text-right text-[10px] font-mono text-[#64748B] dark:text-[#94A3B8] mt-1">
                  {broadcastInput.length}/500 characters
                </div>
              </div>

              <div className="p-3 rounded-lg bg-[#E6F8F6] dark:bg-[#00D2C4]/10 border border-[#00B4A6]/20 dark:border-[#00D2C4]/20 text-xs text-[#0F2044] dark:text-[#F8FAFC]">
                <span className="font-bold text-[#00897B] dark:text-[#00D2C4] block mb-0.5">Note:</span>
                Sent broadcasts are cryptographically signed and cannot be deleted.
              </div>

              <button
                type="submit"
                disabled={!broadcastInput.trim()}
                className="w-full py-2.5 px-4 rounded-lg bg-[#00B4A6] dark:bg-[#00D2C4] hover:bg-[#009E91] dark:hover:bg-[#00B4A6] disabled:opacity-50 text-white dark:text-[#080D1A] font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-xs"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send to All Students</span>
              </button>
            </form>
          </div>
        ) : activeTab === 'members' && selectedStudent ? (
          /* VIEW 2: MEMBER PROFILE BREAKDOWN (CR ONLY) */
          <div className="p-5 space-y-4">
            <div className="border-b border-[#E2E8F0] dark:border-[#1E293B] pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#0F2044] dark:bg-[#00D2C4] text-white dark:text-[#09132B] flex items-center justify-center font-extrabold text-sm shadow-xs">
                  {selectedStudent.name.charAt(0)}
                </div>
                <div className="min-w-0">
                  <h3 className="font-bold text-sm text-[#0F2044] dark:text-white truncate">
                    {selectedStudent.name}
                  </h3>
                  <p className="text-xs text-[#64748B] dark:text-[#94A3B8] font-mono">
                    {selectedStudent.rollNo} · {selectedStudent.email}
                  </p>
                </div>
              </div>
            </div>

            {/* Submission Performance */}
            <div>
              <h4 className="text-[11px] font-bold text-[#64748B] dark:text-[#94A3B8] uppercase tracking-wider mb-2">
                Submission Records
              </h4>
              <div className="space-y-2">
                {assignments.map(asg => {
                  const sub = submissions.find(s => s.assignmentId === asg.id && s.studentId === selectedStudent.id);
                  const isSubmitted = sub?.status === 'submitted';

                  return (
                    <div
                      key={asg.id}
                      className="p-3 rounded-lg border border-[#E2E8F0] dark:border-[#1E293B] bg-[#F8FAFC] dark:bg-[#0F172A]"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-[#0F2044] dark:text-white truncate">
                            {asg.title}
                          </p>
                          <p className="text-[10px] text-[#64748B] dark:text-[#94A3B8]">
                            {asg.subject}
                          </p>
                        </div>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider ${
                            isSubmitted
                              ? 'bg-[#E6F8F6] dark:bg-[#00D2C4]/15 text-[#00897B] dark:text-[#00D2C4]'
                              : sub?.status === 'viewed'
                              ? 'bg-[#FEF6EC] dark:bg-[#F59E0B]/15 text-[#D97706] dark:text-[#FBBF24]'
                              : 'bg-[#FDECEC] dark:bg-[#E63946]/15 text-[#E63946] dark:text-[#FB7185]'
                          }`}
                        >
                          {sub?.status || 'assigned'}
                        </span>
                      </div>

                      {isSubmitted && sub && (
                        <div className="mt-2.5 pt-2 border-t border-[#E2E7F0] dark:border-[#1E293B] text-xs space-y-1.5">
                          <div className="flex items-center justify-between text-[#64748B] dark:text-[#94A3B8] text-[11px]">
                            <span>Submitted:</span>
                            <span className="font-mono">
                              {new Date(sub.submittedAt || '').toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          {sub.proof && (
                            <div className="flex items-center gap-1.5 text-[10px] text-[#00B4A6] dark:text-[#00D2C4] font-mono bg-[#E6F8F6]/50 dark:bg-[#00D2C4]/10 p-1.5 rounded border border-[#00B4A6]/20">
                              <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                              <span className="truncate">Hash: {sub.proof.submissionHash}</span>
                            </div>
                          )}
                          {sub.fileName && (
                            <div className="flex items-center justify-between text-xs text-[#0F2044] dark:text-white bg-white dark:bg-[#080D1A] p-2 rounded border border-[#E2E8F0] dark:border-[#1E293B]">
                              <span className="truncate font-medium">{sub.fileName}</span>
                              <Download className="w-3.5 h-3.5 text-[#00B4A6] dark:text-[#00D2C4] cursor-pointer" />
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Device Info */}
            <div className="p-3 rounded-lg bg-[#F8FAFC] dark:bg-[#0F172A] border border-[#E2E7F0] dark:border-[#1E293B] text-xs space-y-1">
              <span className="font-bold text-[#0F2044] dark:text-white block">
                Device & Activity Audit
              </span>
              <p className="text-[11px] text-[#64748B] dark:text-[#94A3B8]">
                Last Device: {selectedStudent.device || 'Desktop Session'}
              </p>
              <p className="text-[11px] text-[#64748B] dark:text-[#94A3B8]">
                Joined: {new Date(selectedStudent.joinedAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        ) : selectedAsg ? (
          /* VIEW 3: ASSIGNMENT DETAILS & SUBMISSIONS / DISCUSSION */
          <div className="p-5 space-y-4">
            {/* Header info */}
            <div>
              <div className="flex items-center justify-between gap-2">
                <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-[#E6F8F6] dark:bg-[#00D2C4]/15 text-[#00897B] dark:text-[#00D2C4] border border-[#00B4A6]/20">
                  {selectedAsg.subject}
                </span>
                <span className="text-[11px] font-mono text-[#64748B] dark:text-[#94A3B8]">
                  {new Date(selectedAsg.deadline).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>

              <h3 className="font-extrabold text-base text-[#0F2044] dark:text-white mt-2 leading-snug">
                {selectedAsg.title}
              </h3>

              <p className="text-xs text-[#475569] dark:text-[#94A3B8] mt-1.5 leading-relaxed">
                {selectedAsg.description}
              </p>

              {/* Attachment link if exists */}
              {selectedAsg.fileName && (
                <div className="mt-3 flex items-center justify-between p-2.5 rounded-lg bg-[#F8FAFC] dark:bg-[#0F172A] border border-[#E2E8F0] dark:border-[#1E293B] text-xs">
                  <div className="flex items-center gap-2 truncate">
                    <FileText className="w-4 h-4 text-[#00B4A6] dark:text-[#00D2C4] shrink-0" />
                    <span className="font-semibold text-[#0F2044] dark:text-white truncate">
                      {selectedAsg.fileName}
                    </span>
                    <span className="text-[10px] text-[#64748B] dark:text-[#94A3B8]">
                      ({selectedAsg.fileSize})
                    </span>
                  </div>
                  <a
                    href="#"
                    onClick={(e) => { e.preventDefault(); showToast('Attachment downloaded', 'info'); }}
                    className="p-1 rounded text-[#00B4A6] dark:text-[#00D2C4] hover:bg-[#E6F8F6] dark:hover:bg-[#00D2C4]/20 transition-colors"
                    title="Download reference attachment"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}

              {/* Countdown timer for student */}
              {currentUser.role === 'Student' && (
                <div className="mt-3 p-2.5 rounded-lg bg-[#F8FAFC] dark:bg-[#0F172A] border border-[#E2E8F0] dark:border-[#1E293B] flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-[#64748B] dark:text-[#94A3B8]">
                    <Clock className="w-3.5 h-3.5 text-[#00B4A6] dark:text-[#00D2C4]" />
                    <span className="font-medium">Time Remaining:</span>
                  </div>
                  <span className="font-mono font-bold text-[#0F2044] dark:text-white">
                    {countdown}
                  </span>
                </div>
              )}
            </div>

            {/* Submissions / Discussion Toggle */}
            <div className="flex rounded-lg bg-[#F1F5F9] dark:bg-[#080D1A] p-0.5 border border-[#E2E8F0] dark:border-[#1E293B]">
              <button
                onClick={() => setActiveTabSub('submissions')}
                className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all ${
                  activeTabSub === 'submissions'
                    ? 'bg-white dark:bg-[#15203B] text-[#0F2044] dark:text-white shadow-xs'
                    : 'text-[#64748B] dark:text-[#94A3B8]'
                }`}
              >
                {currentUser.role === 'CR' ? 'Submission Status' : 'My Status'}
              </button>
              <button
                onClick={() => setActiveTabSub('discussion')}
                className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all ${
                  activeTabSub === 'discussion'
                    ? 'bg-white dark:bg-[#15203B] text-[#0F2044] dark:text-white shadow-xs'
                    : 'text-[#64748B] dark:text-[#94A3B8]'
                }`}
              >
                Discussion ({discussions.filter(d => d.assignmentId === selectedAsg.id).length})
              </button>
            </div>

            {/* TAB CONTENT */}
            {activeTabSub === 'submissions' ? (
              currentUser.role === 'CR' ? (
                /* CR VIEW: SUBMITTED & PENDING LISTS */
                <div className="space-y-4">
                  {/* Submitted List */}
                  <div>
                    <div className="flex items-center justify-between text-xs font-bold text-[#0F2044] dark:text-white mb-2">
                      <span className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#00B4A6] dark:text-[#00D2C4]" />
                        Submitted ({submittedList.length})
                      </span>
                      <span className="text-[10px] text-[#64748B] dark:text-[#94A3B8]">
                        Max: {selectedAsg.maxScore || 20} pts
                      </span>
                    </div>

                    <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                      {submittedList.length === 0 ? (
                        <p className="text-[11px] text-[#64748B] dark:text-[#94A3B8] py-2">
                          No submissions logged yet.
                        </p>
                      ) : (
                        submittedList.map(sub => (
                          <div
                            key={sub.id}
                            className="p-2.5 rounded-xl bg-[#F8FAFC] dark:bg-[#0F172A] border border-[#E2E8F0] dark:border-[#1E293B] text-xs space-y-2"
                          >
                            <div className="flex items-center justify-between">
                              <div className="min-w-0">
                                <p className="font-bold text-[#0F2044] dark:text-white truncate">
                                  {sub.studentName}
                                </p>
                                <p className="text-[10px] text-[#64748B] dark:text-[#94A3B8] font-mono">
                                  {sub.submittedAt ? new Date(sub.submittedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Logged'}
                                </p>
                              </div>
                              <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-[#E6F8F6] dark:bg-[#00D2C4]/20 text-[#00897B] dark:text-[#00D2C4]">
                                {sub.grade ? `${sub.grade.score}/${sub.grade.maxScore}` : 'Needs Grade'}
                              </span>
                            </div>

                            {/* Quick Grade Input Form */}
                            <div className="pt-2 border-t border-[#E2E8F0] dark:border-[#1E293B] flex items-center gap-1.5">
                              <input
                                type="number"
                                placeholder={`Score`}
                                defaultValue={sub.grade?.score}
                                onBlur={(e) => {
                                  const val = Number(e.target.value);
                                  if (!isNaN(val) && val >= 0) {
                                    gradeSubmission(sub.id, val, selectedAsg.maxScore || 20, sub.grade?.feedback || 'Good work');
                                  }
                                }}
                                className="w-16 px-2 py-1 text-xs rounded bg-white dark:bg-[#080D1A] border border-[#CBD5E1] dark:border-[#334155] text-[#0F2044] dark:text-white"
                              />
                              <input
                                type="text"
                                placeholder="Feedback note..."
                                defaultValue={sub.grade?.feedback}
                                onBlur={(e) => {
                                  if (e.target.value.trim()) {
                                    gradeSubmission(sub.id, sub.grade?.score || 18, selectedAsg.maxScore || 20, e.target.value.trim());
                                  }
                                }}
                                className="flex-1 px-2 py-1 text-xs rounded bg-white dark:bg-[#080D1A] border border-[#CBD5E1] dark:border-[#334155] text-[#0F2044] dark:text-white"
                              />
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Pending List */}
                  <div>
                    <div className="flex items-center justify-between text-xs font-bold text-[#0F2044] dark:text-white mb-2">
                      <span className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-[#F59E0B]" />
                        Pending ({pendingStudents.length})
                      </span>
                    </div>

                    <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                      {pendingStudents.length === 0 ? (
                        <p className="text-[11px] text-[#00B4A6] dark:text-[#00D2C4] py-2 font-bold">
                          All students have submitted!
                        </p>
                      ) : (
                        pendingStudents.map(stu => {
                          const stuSub = asgSubmissions.find(s => s.studentId === stu.id);
                          return (
                            <div
                              key={stu.id}
                              className="flex items-center justify-between p-2 rounded-lg bg-[#F8FAFC] dark:bg-[#0F172A] border border-[#E2E8F0] dark:border-[#1E293B] text-xs"
                            >
                              <div className="min-w-0">
                                <p className="font-semibold text-[#0F2044] dark:text-white truncate">
                                  {stu.name}
                                </p>
                                <p className="text-[10px] text-[#64748B] dark:text-[#94A3B8] font-mono">
                                  {stu.rollNo}
                                </p>
                              </div>
                              <span className="text-[10px] font-bold text-[#D97706] dark:text-[#FBBF24] bg-[#FEF6EC] dark:bg-[#F59E0B]/15 px-1.5 py-0.5 rounded">
                                {stuSub?.status === 'viewed' ? 'Viewed' : 'Not opened'}
                              </span>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>

                  {/* Remind all button */}
                  {pendingStudents.length > 0 && (
                    <button
                      onClick={() => remindPendingStudents(selectedAsg.id)}
                      className="w-full mt-2 py-2 px-3 rounded-lg bg-[#0F2044] dark:bg-[#15203B] hover:bg-[#193166] dark:hover:bg-[#1E293B] text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-xs border border-transparent dark:border-[#25427C]"
                    >
                      <BellRing className="w-3.5 h-3.5 text-[#00B4A6] dark:text-[#00D2C4]" />
                      <span>Remind All Pending ({pendingStudents.length})</span>
                    </button>
                  )}
                </div>
              ) : (
                /* STUDENT VIEW: MY SUBMISSION STATUS & SUBMIT CTA */
                <div className="space-y-3">
                  {mySubmission && mySubmission.status === 'submitted' ? (
                    <div className="p-3.5 rounded-lg bg-[#E6F8F6] dark:bg-[#00D2C4]/10 border border-[#00B4A6]/30 dark:border-[#00D2C4]/30 space-y-2">
                      <div className="flex items-center gap-2 text-[#00897B] dark:text-[#00D2C4] font-bold text-xs">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Submitted & Verified</span>
                      </div>
                      <p className="text-xs text-[#0F2044] dark:text-white font-medium">
                        {mySubmission.fileName || 'Submission confirmed.'}
                      </p>
                      {mySubmission.proof && (
                        <div className="pt-2 border-t border-[#00B4A6]/20 dark:border-[#00D2C4]/20 text-[10px] font-mono text-[#475569] dark:text-[#94A3B8] space-y-1">
                          <div>Time: {new Date(mySubmission.submittedAt || '').toLocaleString()}</div>
                          <div className="truncate">Hash: {mySubmission.proof.submissionHash}</div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="p-3 rounded-lg bg-[#FEF6EC] dark:bg-[#F59E0B]/15 border border-[#F59E0B]/30 text-xs">
                        <span className="font-bold text-[#D97706] dark:text-[#FBBF24] block mb-1">
                          Action Required
                        </span>
                        <p className="text-[11px] text-[#475569] dark:text-[#94A3B8]">
                          You have not submitted this task yet. Make sure all solutions are attached before the deadline.
                        </p>
                      </div>

                      <button
                        onClick={() => setIsSubmitDrawerOpen(true)}
                        disabled={isOffline}
                        className="w-full py-2.5 px-4 rounded-lg bg-[#00B4A6] dark:bg-[#00D2C4] hover:bg-[#009E91] dark:hover:bg-[#00B4A6] disabled:opacity-50 text-white dark:text-[#080D1A] font-extrabold text-xs flex items-center justify-center gap-2 transition-all shadow-xs"
                      >
                        <Upload className="w-4 h-4" />
                        <span>Submit Assignment</span>
                      </button>
                    </div>
                  )}
                </div>
              )
            ) : (
              /* TAB 2: PER-ASSIGNMENT DISCUSSION THREAD */
              <div className="space-y-3 flex flex-col h-72">
                <div className="flex-1 overflow-y-auto space-y-2 pr-1">
                  {discussions.filter(d => d.assignmentId === selectedAsg.id).length === 0 ? (
                    <div className="text-center py-8 text-xs text-[#64748B] dark:text-[#94A3B8]">
                      No questions asked yet. Post a question for this assignment.
                    </div>
                  ) : (
                    discussions
                      .filter(d => d.assignmentId === selectedAsg.id)
                      .map(comm => (
                        <div
                          key={comm.id}
                          className={`p-2.5 rounded-lg border text-xs ${
                            comm.authorRole === 'CR'
                              ? 'bg-[#E6F8F6] dark:bg-[#00D2C4]/10 border-[#00B4A6]/30 dark:border-[#00D2C4]/30'
                              : 'bg-[#F8FAFC] dark:bg-[#0F172A] border-[#E2E8F0] dark:border-[#1E293B]'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-1 mb-1">
                            <div className="flex items-center gap-1.5 font-bold text-[#0F2044] dark:text-white">
                              <span>{comm.authorName}</span>
                              {comm.authorRole === 'CR' && (
                                <span className="px-1 py-0.2 rounded bg-[#00B4A6] dark:bg-[#00D2C4] text-white dark:text-[#09132B] text-[9px] font-extrabold">
                                  CR
                                </span>
                              )}
                            </div>
                            <span className="text-[10px] text-[#64748B] dark:text-[#94A3B8]">
                              {new Date(comm.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          <p className="text-xs text-[#0F2044] dark:text-[#F8FAFC] leading-relaxed">
                            {comm.content}
                          </p>
                        </div>
                      ))
                  )}
                </div>

                {/* Comment input */}
                <form onSubmit={handleSendComment} className="flex items-center gap-1.5 pt-2 border-t border-[#E2E8F0] dark:border-[#1E293B]">
                  <input
                    type="text"
                    value={commentInput}
                    onChange={(e) => setCommentInput(e.target.value)}
                    placeholder="Ask a question about this assignment..."
                    className="flex-1 text-xs px-3 py-2 rounded-lg border border-[#E2E8F0] dark:border-[#1E293B] bg-[#F8FAFC] dark:bg-[#080D1A] text-[#0F2044] dark:text-white focus:outline-none focus:ring-1 focus:ring-[#00B4A6]"
                  />
                  <button
                    type="submit"
                    disabled={!commentInput.trim()}
                    className="p-2 rounded-lg bg-[#00B4A6] dark:bg-[#00D2C4] text-white dark:text-[#080D1A] hover:bg-[#009E91] disabled:opacity-50 transition-colors"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              </div>
            )}
          </div>
        ) : (
          /* VIEW 4: DEFAULT EMPTY STATE */
          <div className="p-6 text-center flex flex-col items-center justify-center my-auto space-y-3">
            <div className="w-12 h-12 rounded-xl bg-[#F1F5F9] dark:bg-[#0F172A] border border-[#E2E8F0] dark:border-[#1E293B] flex items-center justify-center text-[#64748B] dark:text-[#94A3B8] shadow-xs">
              <Info className="w-6 h-6 text-[#00B4A6] dark:text-[#00D2C4]" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-[#0F2044] dark:text-white">
                Context Inspector
              </h4>
              <p className="text-xs text-[#64748B] dark:text-[#94A3B8] mt-1 max-w-[220px]">
                Select an assignment, student record, or calendar day to inspect real-time logs and submission threads.
              </p>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};
