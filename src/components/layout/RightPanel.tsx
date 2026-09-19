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
  Copy,
  Calendar
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
        fixed inset-y-0 right-0 z-40 w-[360px] bg-white dark:bg-[#121212] border-l border-[#DBDBDB] dark:border-[#262626] flex flex-col h-full shadow-2xl lg:shadow-none lg:static lg:block
        panel-transition
        ${isRightPanelOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
      `}
    >
      {/* Mobile / Tablet close drawer header */}
      <div className="flex lg:hidden items-center justify-between p-3.5 border-b border-[#DBDBDB] dark:border-[#262626] bg-[#FAFAFA] dark:bg-[#181818]">
        <span className="text-xs font-bold text-black dark:text-white uppercase tracking-wider">
          Context Details
        </span>
        <button
          onClick={() => setIsRightPanelOpen(false)}
          className="p-1 rounded-md text-[#8E8E8E] hover:text-black dark:hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto flex flex-col justify-between">
        {/* VIEW 1: BROADCASTS TAB RIGHT PANEL */}
        {activeTab === 'broadcasts' && currentUser.role === 'CR' ? (
          <div className="p-5 space-y-4">
            <div className="border-b border-[#DBDBDB] dark:border-[#262626] pb-3">
              <h3 className="font-semibold text-sm text-black dark:text-white">
                Compose Official Broadcast
              </h3>
              <p className="text-xs text-[#8E8E8E] mt-0.5 leading-relaxed">
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
                  className="w-full text-xs p-3 rounded-lg border border-[#DBDBDB] dark:border-[#262626] bg-[#FAFAFA] dark:bg-[#181818] text-black dark:text-white focus:outline-none focus:border-[#0095F6] resize-none"
                />
                <div className="text-right text-[10px] font-mono text-[#8E8E8E] mt-1">
                  {broadcastInput.length}/500 characters
                </div>
              </div>

              <div className="p-3 rounded-lg bg-[#EFEFEF] dark:bg-[#1C1C1C] border border-[#DBDBDB] dark:border-[#262626] text-xs text-[#262626] dark:text-[#E0E0E0]">
                <span className="font-semibold text-[#0095F6] block mb-0.5">Note:</span>
                Sent broadcasts are cryptographically signed and cannot be deleted.
              </div>

              <button
                type="submit"
                disabled={!broadcastInput.trim()}
                className="w-full py-2.5 px-4 rounded-lg bg-[#0095F6] hover:bg-[#1877F2] disabled:opacity-50 text-white font-semibold text-xs flex items-center justify-center gap-2 transition-all shadow-xs"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send to All Students</span>
              </button>
            </form>
          </div>
        ) : activeTab === 'members' && selectedStudent ? (
          /* VIEW 2: MEMBER PROFILE BREAKDOWN (CR ONLY) */
          <div className="p-5 space-y-4">
            <div className="border-b border-[#DBDBDB] dark:border-[#262626] pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-black dark:bg-white text-white dark:text-black flex items-center justify-center font-bold text-sm shadow-xs">
                  {selectedStudent.name.charAt(0)}
                </div>
                <div className="min-w-0">
                  <h3 className="font-semibold text-sm text-black dark:text-white truncate">
                    {selectedStudent.name}
                  </h3>
                  <p className="text-xs text-[#8E8E8E] font-mono">
                    {selectedStudent.rollNo} · {selectedStudent.email}
                  </p>
                </div>
              </div>
            </div>

            {/* Submission Performance */}
            <div>
              <h4 className="text-[11px] font-semibold text-[#8E8E8E] uppercase tracking-wider mb-2">
                Submission Records
              </h4>
              <div className="space-y-2">
                {assignments.map(asg => {
                  const sub = submissions.find(s => s.assignmentId === asg.id && s.studentId === selectedStudent.id);
                  const isSubmitted = sub?.status === 'submitted';

                  return (
                    <div
                      key={asg.id}
                      className="p-3 rounded-lg border border-[#DBDBDB] dark:border-[#262626] bg-[#FAFAFA] dark:bg-[#181818]"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-black dark:text-white truncate">
                            {asg.title}
                          </p>
                          <p className="text-[10px] text-[#8E8E8E]">
                            {asg.subject}
                          </p>
                        </div>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            isSubmitted
                              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                              : sub?.status === 'viewed'
                              ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                              : 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                          }`}
                        >
                          {sub?.status || 'assigned'}
                        </span>
                      </div>

                      {isSubmitted && sub && (
                        <div className="mt-2.5 pt-2 border-t border-[#DBDBDB] dark:border-[#262626] text-xs space-y-1.5">
                          <div className="flex items-center justify-between text-[#8E8E8E] text-[11px]">
                            <span>Submitted:</span>
                            <span className="font-mono">
                              {new Date(sub.submittedAt || '').toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          {sub.proof && (
                            <div className="flex items-center gap-1.5 text-[10px] text-[#0095F6] font-mono bg-[#0095F6]/10 p-1.5 rounded border border-[#0095F6]/20">
                              <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                              <span className="truncate">Hash: {sub.proof.submissionHash}</span>
                            </div>
                          )}
                          {sub.fileName && (
                            <div className="flex items-center justify-between text-xs text-black dark:text-white bg-white dark:bg-[#121212] p-2 rounded border border-[#DBDBDB] dark:border-[#262626]">
                              <span className="truncate font-medium">{sub.fileName}</span>
                              <Download className="w-3.5 h-3.5 text-[#0095F6] cursor-pointer" />
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
            <div className="p-3 rounded-lg bg-[#FAFAFA] dark:bg-[#181818] border border-[#DBDBDB] dark:border-[#262626] text-xs space-y-1">
              <span className="font-semibold text-black dark:text-white block">
                Device & Activity Audit
              </span>
              <p className="text-[11px] text-[#8E8E8E]">
                Last Device: {selectedStudent.device || 'Desktop Session'}
              </p>
              <p className="text-[11px] text-[#8E8E8E]">
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
                <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-[#EFEFEF] dark:bg-[#262626] text-black dark:text-white border border-[#DBDBDB] dark:border-[#363636]">
                  {selectedAsg.subject}
                </span>
                <span className="text-[11px] font-mono text-[#8E8E8E]">
                  {new Date(selectedAsg.deadline).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>

              <h3 className="font-bold text-base text-black dark:text-white mt-2 leading-snug">
                {selectedAsg.title}
              </h3>

              <p className="text-xs text-[#737373] dark:text-[#A8A8A8] mt-1.5 leading-relaxed">
                {selectedAsg.description}
              </p>

              {/* Attachment link if exists */}
              {selectedAsg.fileName && (
                <div className="mt-3 flex items-center justify-between p-2.5 rounded-lg bg-[#FAFAFA] dark:bg-[#181818] border border-[#DBDBDB] dark:border-[#262626] text-xs">
                  <div className="flex items-center gap-2 truncate">
                    <FileText className="w-4 h-4 text-[#0095F6] shrink-0" />
                    <span className="font-medium text-black dark:text-white truncate">
                      {selectedAsg.fileName}
                    </span>
                    <span className="text-[10px] text-[#8E8E8E]">
                      ({selectedAsg.fileSize})
                    </span>
                  </div>
                  <a
                    href="#"
                    onClick={(e) => { e.preventDefault(); showToast('Attachment downloaded', 'info'); }}
                    className="p-1 rounded text-[#0095F6] hover:bg-[#0095F6]/10 transition-colors"
                    title="Download reference attachment"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}

              {/* Countdown timer for student */}
              {currentUser.role === 'Student' && (
                <div className="mt-3 p-2.5 rounded-lg bg-[#FAFAFA] dark:bg-[#181818] border border-[#DBDBDB] dark:border-[#262626] flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-[#8E8E8E]">
                    <Clock className="w-3.5 h-3.5 text-[#0095F6]" />
                    <span className="font-medium">Time Remaining:</span>
                  </div>
                  <span className="font-mono font-semibold text-black dark:text-white">
                    {countdown}
                  </span>
                </div>
              )}
            </div>

            {/* Submissions / Discussion Toggle */}
            <div className="flex rounded-lg bg-[#EFEFEF] dark:bg-[#262626] p-0.5 border border-[#DBDBDB] dark:border-[#363636]">
              <button
                onClick={() => setActiveTabSub('submissions')}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all ${
                  activeTabSub === 'submissions'
                    ? 'bg-white dark:bg-[#121212] text-black dark:text-white shadow-xs'
                    : 'text-[#8E8E8E]'
                }`}
              >
                {currentUser.role === 'CR' ? 'Submission Status' : 'My Status'}
              </button>
              <button
                onClick={() => setActiveTabSub('discussion')}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all ${
                  activeTabSub === 'discussion'
                    ? 'bg-white dark:bg-[#121212] text-black dark:text-white shadow-xs'
                    : 'text-[#8E8E8E]'
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
                    <div className="flex items-center justify-between text-xs font-semibold text-black dark:text-white mb-2">
                      <span className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                        Submitted ({submittedList.length})
                      </span>
                      <span className="text-[10px] text-[#8E8E8E]">
                        Max: {selectedAsg.maxScore || 20} pts
                      </span>
                    </div>

                    <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                      {submittedList.length === 0 ? (
                        <p className="text-[11px] text-[#8E8E8E] py-2">
                          No submissions logged yet.
                        </p>
                      ) : (
                        submittedList.map(sub => (
                          <div
                            key={sub.id}
                            className="p-2.5 rounded-lg bg-[#FAFAFA] dark:bg-[#181818] border border-[#DBDBDB] dark:border-[#262626] text-xs space-y-2"
                          >
                            <div className="flex items-center justify-between">
                              <div className="min-w-0">
                                <p className="font-semibold text-black dark:text-white truncate">
                                  {sub.studentName}
                                </p>
                                <p className="text-[10px] text-[#8E8E8E] font-mono">
                                  {sub.submittedAt ? new Date(sub.submittedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Logged'}
                                </p>
                              </div>
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                                {sub.grade ? `${sub.grade.score}/${sub.grade.maxScore}` : 'Needs Grade'}
                              </span>
                            </div>

                            {/* Quick Grade Input Form */}
                            <div className="pt-2 border-t border-[#DBDBDB] dark:border-[#262626] flex items-center gap-1.5">
                              <input
                                type="number"
                                placeholder="Score"
                                defaultValue={sub.grade?.score}
                                onBlur={(e) => {
                                  const val = Number(e.target.value);
                                  if (!isNaN(val) && val >= 0) {
                                    gradeSubmission(sub.id, val, selectedAsg.maxScore || 20, sub.grade?.feedback || 'Good work');
                                  }
                                }}
                                className="w-16 px-2 py-1 text-xs rounded bg-white dark:bg-[#121212] border border-[#DBDBDB] dark:border-[#262626] text-black dark:text-white"
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
                                className="flex-1 px-2 py-1 text-xs rounded bg-white dark:bg-[#121212] border border-[#DBDBDB] dark:border-[#262626] text-black dark:text-white"
                              />
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Pending List */}
                  <div>
                    <div className="flex items-center justify-between text-xs font-semibold text-black dark:text-white mb-2">
                      <span className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-amber-500" />
                        Pending ({pendingStudents.length})
                      </span>
                    </div>

                    <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                      {pendingStudents.length === 0 ? (
                        <p className="text-[11px] text-emerald-600 dark:text-emerald-400 py-2 font-medium">
                          All students have submitted!
                        </p>
                      ) : (
                        pendingStudents.map(stu => {
                          const stuSub = asgSubmissions.find(s => s.studentId === stu.id);
                          return (
                            <div
                              key={stu.id}
                              className="flex items-center justify-between p-2 rounded-md bg-[#FAFAFA] dark:bg-[#181818] border border-[#DBDBDB] dark:border-[#262626] text-xs"
                            >
                              <div className="min-w-0">
                                <p className="font-medium text-black dark:text-white truncate">
                                  {stu.name}
                                </p>
                                <p className="text-[10px] text-[#8E8E8E] font-mono">
                                  {stu.rollNo}
                                </p>
                              </div>
                              <span className="text-[10px] font-medium text-amber-600 dark:text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded">
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
                      className="w-full mt-2 py-2 px-3 rounded-lg bg-black hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-200 text-white dark:text-black font-semibold text-xs flex items-center justify-center gap-2 transition-colors shadow-xs"
                    >
                      <BellRing className="w-3.5 h-3.5 text-[#0095F6]" />
                      <span>Remind All Pending ({pendingStudents.length})</span>
                    </button>
                  )}
                </div>
              ) : (
                /* STUDENT VIEW: MY SUBMISSION STATUS & SUBMIT CTA */
                <div className="space-y-3">
                  {mySubmission && mySubmission.status === 'submitted' ? (
                    <div className="p-3.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 space-y-2">
                      <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-semibold text-xs">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Submitted & Verified</span>
                      </div>
                      <p className="text-xs text-black dark:text-white font-medium">
                        {mySubmission.fileName || 'Submission confirmed.'}
                      </p>
                      {mySubmission.proof && (
                        <div className="pt-2 border-t border-emerald-500/20 text-[10px] font-mono text-[#8E8E8E] space-y-1">
                          <div>Time: {new Date(mySubmission.submittedAt || '').toLocaleString()}</div>
                          <div className="truncate">Hash: {mySubmission.proof.submissionHash}</div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 text-xs">
                        <span className="font-semibold text-amber-600 dark:text-amber-400 block mb-1">
                          Action Required
                        </span>
                        <p className="text-[11px] text-[#737373] dark:text-[#A8A8A8]">
                          You have not submitted this task yet. Make sure all solutions are attached before the deadline.
                        </p>
                      </div>

                      <button
                        onClick={() => setIsSubmitDrawerOpen(true)}
                        disabled={isOffline}
                        className="w-full py-2.5 px-4 rounded-lg bg-[#0095F6] hover:bg-[#1877F2] disabled:opacity-50 text-white font-semibold text-xs flex items-center justify-center gap-2 transition-all shadow-xs"
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
                    <div className="text-center py-8 text-xs text-[#8E8E8E]">
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
                              ? 'bg-[#0095F6]/10 border-[#0095F6]/30 text-black dark:text-white'
                              : 'bg-[#FAFAFA] dark:bg-[#181818] border-[#DBDBDB] dark:border-[#262626]'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-1 mb-1">
                            <div className="flex items-center gap-1.5 font-semibold text-black dark:text-white">
                              <span>{comm.authorName}</span>
                              {comm.authorRole === 'CR' && (
                                <span className="px-1 py-0.2 rounded bg-[#0095F6] text-white text-[9px] font-bold">
                                  CR
                                </span>
                              )}
                            </div>
                            <span className="text-[10px] text-[#8E8E8E]">
                              {new Date(comm.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          <p className="text-xs text-[#737373] dark:text-[#A8A8A8] leading-relaxed">
                            {comm.content}
                          </p>
                        </div>
                      ))
                  )}
                </div>

                {/* Comment input */}
                <form onSubmit={handleSendComment} className="flex items-center gap-1.5 pt-2 border-t border-[#DBDBDB] dark:border-[#262626]">
                  <input
                    type="text"
                    value={commentInput}
                    onChange={(e) => setCommentInput(e.target.value)}
                    placeholder="Ask a question about this assignment..."
                    className="flex-1 text-xs px-3 py-2 rounded-lg border border-[#DBDBDB] dark:border-[#262626] bg-[#FAFAFA] dark:bg-[#181818] text-black dark:text-white focus:outline-none focus:border-[#0095F6]"
                  />
                  <button
                    type="submit"
                    disabled={!commentInput.trim()}
                    className="p-2 rounded-lg bg-[#0095F6] text-white hover:bg-[#1877F2] disabled:opacity-50 transition-colors"
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
            <div className="w-12 h-12 rounded-xl bg-[#EFEFEF] dark:bg-[#262626] border border-[#DBDBDB] dark:border-[#363636] flex items-center justify-center text-[#8E8E8E]">
              <Info className="w-6 h-6 text-[#0095F6]" />
            </div>
            <div>
              <h4 className="font-semibold text-sm text-black dark:text-white">
                Context Inspector
              </h4>
              <p className="text-xs text-[#8E8E8E] mt-1 max-w-[220px] leading-relaxed">
                Select an assignment, student record, or broadcast to inspect real-time logs and submission threads.
              </p>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};
