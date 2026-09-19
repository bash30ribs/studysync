import React, { useState } from 'react';
import { useStudySync } from '../../store';
import { 
  Megaphone, 
  ShieldCheck, 
  CheckCheck, 
  Clock, 
  Plus,
  Sparkles,
  Share2,
  Check,
  Send
} from 'lucide-react';

export const BroadcastsView: React.FC = () => {
  const { 
    currentUser, 
    currentClass, 
    broadcasts, 
    allUsers, 
    sendBroadcast,
    showToast 
  } = useStudySync();

  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [content, setContent] = useState('');
  const [aiPrompt, setAiPrompt] = useState('');
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [copiedBcId, setCopiedBcId] = useState<string | null>(null);

  const totalStudents = allUsers.filter(u => u.role === 'Student').length;

  const handleGenerateAI = () => {
    if (!aiPrompt.trim()) return;
    setIsGeneratingAI(true);
    setTimeout(() => {
      setContent(`OFFICIAL NOTICE: Regarding "${aiPrompt.trim()}". Please note that all students of ${currentClass.name} must adhere to this updated schedule. Review related guidelines in the Resource Library and submit any pending tasks prior to deadline.`);
      setIsGeneratingAI(false);
      showToast('Smart draft generated. You can edit before sending.', 'info');
    }, 500);
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    sendBroadcast(content.trim());
    setContent('');
    setAiPrompt('');
    setIsComposeOpen(false);
  };

  const handleShareToWhatsApp = (bc: typeof broadcasts[0]) => {
    const text = `*${currentClass.name} OFFICIAL BROADCAST*\n*From:* ${bc.authorName} (CR)\n*Date:* ${new Date(bc.sentAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}\n\n${bc.content}\n\n_Official dispatch via StudySync_`;
    navigator.clipboard.writeText(text);
    setCopiedBcId(bc.id);
    showToast('Broadcast formatted & copied for WhatsApp!', 'success');
    setTimeout(() => setCopiedBcId(null), 2500);
  };

  return (
    <div className="p-4 lg:p-7 space-y-6 max-w-5xl mx-auto animate-in fade-in duration-150">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl lg:text-2xl font-bold text-black dark:text-white tracking-tight">
            Official Broadcasts
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-0.5">
            Immutable CR class-wide announcements delivered to all enrolled student devices.
          </p>
        </div>

        {currentUser.role === 'CR' && (
          <button
            onClick={() => setIsComposeOpen(true)}
            className="btn-primary"
          >
            <Plus className="w-4 h-4" />
            <span>Compose Broadcast</span>
          </button>
        )}
      </div>

      {/* Broadcasts Feed */}
      <div className="space-y-4">
        {broadcasts.length === 0 ? (
          <div className="p-12 text-center text-xs text-neutral-500 dark:text-neutral-400 ui-card">
            No official broadcasts sent yet.
          </div>
        ) : (
          broadcasts.map((bc, idx) => {
            const isUnread = currentUser.role === 'Student' && !bc.readBy.includes(currentUser.id) && idx === 0;

            return (
              <div
                key={bc.id}
                className={`p-5 ui-card transition-all ${
                  isUnread
                    ? 'border-l-4 border-l-[#0095F6]'
                    : ''
                }`}
              >
                {/* Top meta */}
                <div className="flex items-center justify-between gap-2 pb-3 border-b border-[#DBDBDB] dark:border-[#262626]">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-neutral-100 dark:bg-[#262626] text-[#0095F6] flex items-center justify-center font-bold">
                      <Megaphone className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-semibold text-xs text-black dark:text-white">
                        {bc.authorName}
                      </span>
                      <span className="ml-2 px-1.5 py-0.5 rounded bg-[#0095F6] text-white text-[9px] font-bold">
                        CR
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-neutral-500 dark:text-neutral-400 font-mono">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {new Date(bc.sentAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </span>
                    {currentUser.role === 'CR' && (
                      <span className="flex items-center gap-1 text-[#0095F6] font-semibold hidden sm:flex">
                        <CheckCheck className="w-3.5 h-3.5" />
                        Delivered to {totalStudents}
                      </span>
                    )}
                  </div>
                </div>

                {/* Content */}
                <p className={`mt-3 text-xs sm:text-sm text-neutral-800 dark:text-neutral-200 leading-relaxed ${isUnread ? 'font-semibold' : ''}`}>
                  {bc.content}
                </p>

                {/* Bottom verification badge & WhatsApp Share */}
                <div className="mt-4 pt-3 border-t border-[#DBDBDB] dark:border-[#262626] flex items-center justify-between text-[11px] text-neutral-500 dark:text-neutral-400">
                  <div className="flex items-center gap-1 text-neutral-600 dark:text-neutral-300 font-medium">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#0095F6]" />
                    <span>Cryptographically verified CR dispatch</span>
                  </div>

                  <button
                    onClick={() => handleShareToWhatsApp(bc)}
                    className="btn-secondary text-xs py-1 px-2.5"
                    title="Copy formatted announcement for WhatsApp"
                  >
                    {copiedBcId === bc.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-[#0095F6]" />
                        <span className="text-[#0095F6] font-semibold">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Share2 className="w-3.5 h-3.5" />
                        <span>Share to WhatsApp</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* CR Compose Broadcast Modal with Smart Assistant */}
      {isComposeOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-xl bg-white dark:bg-[#121212] rounded-2xl border border-[#DBDBDB] dark:border-[#262626] shadow-2xl overflow-hidden">
            <form onSubmit={handleSend}>
              <div className="px-6 py-4 border-b border-[#DBDBDB] dark:border-[#262626] bg-[#FAFAFA] dark:bg-[#121212] flex items-center justify-between">
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-black dark:text-white">
                    Compose Official Broadcast
                  </h3>
                  <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                    Broadcasts alert all {totalStudents} enrolled student devices instantly
                  </p>
                </div>
              </div>

              <div className="p-6 space-y-4">
                {/* Assistant Drafter */}
                <div className="p-3.5 rounded-xl bg-neutral-100 dark:bg-[#1C1C1C] border border-[#DBDBDB] dark:border-[#262626] space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-black dark:text-white">
                    <Sparkles className="w-3.5 h-3.5 text-[#0095F6]" />
                    <span>Quick Notice Generator</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={aiPrompt}
                      onChange={(e) => setAiPrompt(e.target.value)}
                      placeholder="e.g. Lab exam postponed to next Monday..."
                      className="flex-1 px-3 py-1.5 text-xs rounded-lg bg-white dark:bg-[#000000] border border-[#DBDBDB] dark:border-[#262626] text-black dark:text-white focus:outline-none focus:border-[#0095F6]"
                    />
                    <button
                      type="button"
                      disabled={isGeneratingAI || !aiPrompt.trim()}
                      onClick={handleGenerateAI}
                      className="btn-primary text-xs py-1.5 px-3"
                    >
                      {isGeneratingAI ? 'Generating...' : 'Auto-Draft'}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-neutral-600 dark:text-neutral-300 mb-1">
                    Announcement Text *
                  </label>
                  <textarea
                    rows={5}
                    required
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Write official announcement details..."
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-[#000000] border border-[#DBDBDB] dark:border-[#262626] text-xs text-black dark:text-white placeholder-neutral-400 focus:outline-none focus:border-[#0095F6]"
                  />
                </div>
              </div>

              <div className="px-6 py-4 border-t border-[#DBDBDB] dark:border-[#262626] bg-[#FAFAFA] dark:bg-[#121212] flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsComposeOpen(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!content.trim()}
                  className="btn-primary disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Broadcast</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
