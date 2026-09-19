import React, { useState } from 'react';
import { useStudySync } from '../../store';
import { ClassPoll } from '../../types';
import { 
  BarChart2, 
  Plus, 
  CheckCircle2, 
  Clock, 
  Share2, 
  Copy, 
  Lock, 
  Trash2, 
  Users,
  Check
} from 'lucide-react';

export const PollsView: React.FC = () => {
  const { 
    currentUser, 
    currentClass, 
    allUsers, 
    polls, 
    createPoll, 
    votePoll, 
    closePoll,
    showToast 
  } = useStudySync();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [question, setQuestion] = useState('');
  const [description, setDescription] = useState('');
  const [options, setOptions] = useState<string[]>(['Option 1', 'Option 2']);
  const [expiresHours, setExpiresHours] = useState(24);
  const [copiedPollId, setCopiedPollId] = useState<string | null>(null);

  const studentsCount = allUsers.filter(u => u.role === 'Student').length;

  const handleAddOption = () => {
    if (options.length < 5) {
      setOptions(prev => [...prev, `Option ${prev.length + 1}`]);
    }
  };

  const handleRemoveOption = (index: number) => {
    if (options.length > 2) {
      setOptions(prev => prev.filter((_, i) => i !== index));
    }
  };

  const handleOptionChange = (index: number, val: string) => {
    setOptions(prev => {
      const next = [...prev];
      next[index] = val;
      return next;
    });
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanQuestion = question.trim();
    const cleanOptions = options.map(o => o.trim()).filter(Boolean);

    if (!cleanQuestion || cleanOptions.length < 2) {
      showToast('Please provide a question and at least 2 options', 'error');
      return;
    }

    createPoll({
      question: cleanQuestion,
      description: description.trim(),
      options: cleanOptions,
      expiresHours
    });

    setIsCreateModalOpen(false);
    setQuestion('');
    setDescription('');
    setOptions(['Option 1', 'Option 2']);
  };

  const handleShareToWhatsApp = (poll: ClassPoll) => {
    const totalVotes = poll.options.reduce((acc, opt) => acc + opt.votes.length, 0);
    
    let text = `*${currentClass.name} CLASS VOTE RESULTS*\n`;
    text += `*Question:* ${poll.question}\n`;
    if (poll.description) text += `_${poll.description}_\n`;
    text += `\n*Results (${totalVotes} votes cast):*\n`;

    poll.options.forEach((opt, idx) => {
      const pct = totalVotes === 0 ? 0 : Math.round((opt.votes.length / totalVotes) * 100);
      text += `${idx + 1}. *${opt.text}* — ${pct}% (${opt.votes.length} votes)\n`;
    });

    text += `\n_Coordinated via StudySync • One Class Code_`;

    navigator.clipboard.writeText(text);
    setCopiedPollId(poll.id);
    showToast('Formatted poll results copied for WhatsApp!', 'success');
    setTimeout(() => setCopiedPollId(null), 3000);
  };

  return (
    <div className="p-4 sm:p-6 max-w-5xl mx-auto space-y-6 animate-in fade-in duration-150">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-[#0F2044] dark:text-white tracking-tight">
              Polls & Class Decisions
            </h1>
            <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-[#E6F8F6] dark:bg-[#00D2C4]/15 text-[#00897B] dark:text-[#00D2C4] border border-[#00B4A6]/20">
              Live Decisions
            </span>
          </div>
          <p className="text-xs text-[#64748B] dark:text-[#94A3B8] mt-1">
            Resolve deadline adjustments, extra class timings, and exam venue votes in seconds without 100-message chat debates.
          </p>
        </div>

        {currentUser.role === 'CR' && (
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="btn-primary"
          >
            <Plus className="w-4 h-4" />
            <span>Create Quick Poll</span>
          </button>
        )}
      </div>

      {/* Polls List */}
      <div className="space-y-4">
        {polls.length === 0 ? (
          <div className="py-16 text-center text-xs text-slate-500 dark:text-slate-400 ui-card">
            No active polls right now. CR can create a vote to gather instant class consensus.
          </div>
        ) : (
          polls.map(poll => {
            const totalVotes = poll.options.reduce((acc, opt) => acc + opt.votes.length, 0);
            const hasVoted = poll.options.some(opt => opt.votes.includes(currentUser.id));
            const myVotedOptionId = poll.options.find(opt => opt.votes.includes(currentUser.id))?.id;

            return (
              <div
                key={poll.id}
                className="p-5 ui-card space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        poll.isClosed
                          ? 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                          : 'bg-teal-500/10 dark:bg-teal-500/20 text-teal-700 dark:text-teal-300'
                      }`}>
                        {poll.isClosed ? 'Poll Closed' : 'Active Vote'}
                      </span>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400">
                        Created by {poll.createdByName}
                      </span>
                    </div>

                    <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white mt-1.5">
                      {poll.question}
                    </h3>

                    {poll.description && (
                      <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                        {poll.description}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleShareToWhatsApp(poll)}
                      className="btn-secondary text-xs"
                      title="Copy formatted text to paste into WhatsApp group"
                    >
                      {copiedPollId === poll.id ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                          <span className="text-teal-600 dark:text-teal-400">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Share2 className="w-3.5 h-3.5" />
                          <span>Share to WhatsApp</span>
                        </>
                      )}
                    </button>

                    {currentUser.role === 'CR' && !poll.isClosed && (
                      <button
                        onClick={() => closePoll(poll.id)}
                        className="btn-ghost text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                      >
                        Close
                      </button>
                    )}
                  </div>
                </div>

                {/* Options Vote Bars */}
                <div className="space-y-2.5 pt-1">
                  {poll.options.map(opt => {
                    const isSelected = opt.id === myVotedOptionId;
                    const count = opt.votes.length;
                    const pct = totalVotes === 0 ? 0 : Math.round((count / totalVotes) * 100);

                    return (
                      <button
                        key={opt.id}
                        disabled={poll.isClosed}
                        onClick={() => votePoll(poll.id, opt.id)}
                        className={`w-full relative overflow-hidden text-left p-3.5 rounded-xl border transition-all ${
                          isSelected
                            ? 'border-teal-500 bg-teal-50/60 dark:bg-teal-950/30 dark:border-teal-500'
                            : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 hover:border-slate-300 dark:hover:border-slate-700'
                        }`}
                      >
                        {/* Fill percentage bar */}
                        <div
                          className="absolute inset-y-0 left-0 bg-teal-500/15 dark:bg-teal-500/20 progress-bar-fill pointer-events-none"
                          style={{ width: `${pct}%` }}
                        />

                        <div className="relative z-10 flex items-center justify-between">
                          <div className="flex items-center gap-2.5">
                            <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                              isSelected
                                ? 'border-teal-500 bg-teal-500'
                                : 'border-slate-400 dark:border-slate-600'
                            }`}>
                              {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                            </div>
                            <span className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white">
                              {opt.text}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold font-mono text-slate-900 dark:text-white">
                              {pct}%
                            </span>
                            <span className="text-[11px] text-slate-500 dark:text-slate-400">
                              ({count} {count === 1 ? 'vote' : 'votes'})
                            </span>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Footer status */}
                <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-slate-900 dark:text-white">
                      {totalVotes} of {studentsCount} students voted
                    </span>
                    <span>•</span>
                    <span>{hasVoted ? 'Your vote recorded' : 'Tap an option to vote'}</span>
                  </div>

                  <div className="flex items-center gap-1 font-mono text-[10px]">
                    <Clock className="w-3 h-3" />
                    <span>{poll.isClosed ? 'Voting concluded' : 'Open for class'}</span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Create Poll Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden">
            <form onSubmit={handleCreateSubmit}>
              <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 flex items-center justify-between">
                <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                  Create Class Poll
                </h3>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  Immediate cohort broadcast
                </span>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">
                    Poll Question *
                  </label>
                  <input
                    type="text"
                    required
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder="e.g. When should we submit Assignment 2?"
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">
                    Context / Note (Optional)
                  </label>
                  <input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="e.g. Discussed with Prof. Rao in today's tutorial"
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300">
                      Vote Options ({options.length}/5)
                    </label>
                    {options.length < 5 && (
                      <button
                        type="button"
                        onClick={handleAddOption}
                        className="text-[11px] font-bold text-teal-600 dark:text-teal-400 hover:underline"
                      >
                        + Add Choice
                      </button>
                    )}
                  </div>

                  <div className="space-y-2">
                    {options.map((opt, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <span className="w-5 text-center text-xs font-mono font-bold text-slate-400">
                          {i + 1}.
                        </span>
                        <input
                          type="text"
                          required
                          value={opt}
                          onChange={(e) => handleOptionChange(i, e.target.value)}
                          className="flex-1 px-3 py-1.5 rounded-lg bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                        />
                        {options.length > 2 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveOption(i)}
                            className="p-1 text-slate-400 hover:text-rose-500"
                          >
                            ×
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">
                    Voting Window
                  </label>
                  <select
                    value={expiresHours}
                    onChange={(e) => setExpiresHours(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                  >
                    <option value={6}>6 Hours (Urgent Decision)</option>
                    <option value={24}>24 Hours (Standard 1-Day)</option>
                    <option value={48}>48 Hours (2 Days)</option>
                    <option value={72}>72 Hours (Weekend Vote)</option>
                  </select>
                </div>
              </div>

              <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                >
                  Launch Class Poll
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
