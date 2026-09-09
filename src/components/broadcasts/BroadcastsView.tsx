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
      showToast('AI draft generated! You can edit before sending.', 'info');
    }, 600);
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
          <h1 className="text-xl lg:text-2xl font-extrabold text-[#0F2044] dark:text-white tracking-tight">
            Official Broadcasts
          </h1>
          <p className="text-xs sm:text-sm text-[#64748B] dark:text-[#94A3B8] mt-0.5">
            Immutable CR class-wide announcements delivered to all enrolled student devices.
          </p>
        </div>

        {currentUser.role === 'CR' && (
          <button
            onClick={() => setIsComposeOpen(true)}
            className="px-4 py-2 rounded-xl bg-[#00B4A6] dark:bg-[#00D2C4] hover:bg-[#009E91] dark:hover:bg-[#00B4A6] text-white dark:text-[#080D1A] text-xs font-bold flex items-center gap-1.5 transition-all shadow-md shadow-[#00B4A6]/15 self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Compose Broadcast</span>
          </button>
        )}
      </div>

      {/* Broadcasts Feed */}
      <div className="space-y-4">
        {broadcasts.length === 0 ? (
          <div className="p-12 text-center text-xs text-[#64748B] dark:text-[#94A3B8] bg-white dark:bg-[#0F172A] rounded-2xl border border-[#E2E8F0] dark:border-[#1E293B]">
            No official broadcasts sent yet.
          </div>
        ) : (
          broadcasts.map((bc, idx) => {
            const isUnread = currentUser.role === 'Student' && !bc.readBy.includes(currentUser.id) && idx === 0;

            return (
              <div
                key={bc.id}
                className={`p-5 rounded-2xl bg-white dark:bg-[#0F172A] border shadow-xs transition-all ${
                  isUnread
                    ? 'border-l-4 border-l-[#00B4A6] dark:border-l-[#00D2C4] border-y-[#E2E8F0] border-r-[#E2E8F0] dark:border-y-[#1E293B] dark:border-r-[#1E293B]'
                    : 'border-[#E2E8F0] dark:border-[#1E293B]'
                }`}
              >
                {/* Top meta */}
                <div className="flex items-center justify-between gap-2 pb-3 border-b border-[#E2E8F0] dark:border-[#1E293B]">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-[#E6F8F6] dark:bg-[#00D2C4]/15 text-[#00897B] dark:text-[#00D2C4] flex items-center justify-center font-bold">
                      <Megaphone className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-bold text-xs text-[#0F2044] dark:text-white">
                        {bc.authorName}
                      </span>
                      <span className="ml-2 px-1.5 py-0.2 rounded bg-[#00B4A6] dark:bg-[#00D2C4] text-white dark:text-[#09132B] text-[9px] font-extrabold">
                        CR
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-[#64748B] dark:text-[#94A3B8] font-mono">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {new Date(bc.sentAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </span>
                    {currentUser.role === 'CR' && (
                      <span className="flex items-center gap-1 text-[#00897B] dark:text-[#00D2C4] font-bold hidden sm:flex">
                        <CheckCheck className="w-3.5 h-3.5" />
                        Delivered to {totalStudents}
                      </span>
                    )}
                  </div>
                </div>

                {/* Content */}
                <p className={`mt-3 text-xs sm:text-sm text-[#0F2044] dark:text-white leading-relaxed ${isUnread ? 'font-semibold' : ''}`}>
                  {bc.content}
                </p>

                {/* Bottom verification badge & WhatsApp Share */}
                <div className="mt-4 pt-2.5 border-t border-[#E2E8F0] dark:border-[#1E293B] flex items-center justify-between text-[11px] text-[#64748B] dark:text-[#94A3B8]">
                  <div className="flex items-center gap-1 text-[#00897B] dark:text-[#00D2C4] font-medium">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Cryptographically verified CR dispatch</span>
                  </div>

                  <button
                    onClick={() => handleShareToWhatsApp(bc)}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#F1F5F9] dark:bg-[#1E293B] hover:bg-[#E2E8F0] dark:hover:bg-[#334155] text-xs font-semibold text-[#0F2044] dark:text-white transition-colors"
                    title="Copy formatted announcement for WhatsApp"
                  >
                    {copiedBcId === bc.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-[#00B4A6] dark:text-[#00D2C4]" />
                        <span className="text-[#00B4A6] dark:text-[#00D2C4]">Copied!</span>
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

      {/* CR Compose Broadcast Modal with AI Assistant */}
      {isComposeOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-xl bg-white dark:bg-[#0F172A] rounded-2xl border border-[#E2E8F0] dark:border-[#1E293B] shadow-2xl overflow-hidden">
            <form onSubmit={handleSend}>
              <div className="px-6 py-4 border-b border-[#E2E8F0] dark:border-[#1E293B] bg-[#F8FAFC] dark:bg-[#15203B]/60 flex items-center justify-between">
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-[#0F2044] dark:text-white">
                    Compose Official Broadcast
                  </h3>
                  <p className="text-[11px] text-[#64748B] dark:text-[#94A3B8]">
                    Broadcasts alert all {totalStudents} enrolled student devices instantly
                  </p>
                </div>
              </div>

              <div className="p-6 space-y-4">
                {/* AI Broadcast Drafter */}
                <div className="p-3.5 rounded-xl bg-[#E6F8F6]/60 dark:bg-[#00D2C4]/10 border border-[#00B4A6]/20 space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#00897B] dark:text-[#00D2C4]">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>AI Broadcast Drafter</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={aiPrompt}
                      onChange={(e) => setAiPrompt(e.target.value)}
                      placeholder="Type a brief prompt (e.g. Lab exam postponed to next Monday)..."
                      className="flex-1 px-3 py-1.5 text-xs rounded-lg bg-white dark:bg-[#0B132B] border border-[#CBD5E1] dark:border-[#334155] text-[#0F2044] dark:text-white focus:outline-none"
                    />
                    <button
                      type="button"
                      disabled={isGeneratingAI || !aiPrompt.trim()}
                      onClick={handleGenerateAI}
                      className="px-3 py-1.5 rounded-lg bg-[#00B4A6] dark:bg-[#00D2C4] text-white dark:text-[#09132B] font-bold text-xs hover:opacity-90 disabled:opacity-50 transition-opacity shrink-0"
                    >
                      {isGeneratingAI ? 'Drafting...' : 'Draft with AI'}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#475569] dark:text-[#94A3B8] mb-1">
                    Announcement Text *
                  </label>
                  <textarea
                    rows={5}
                    required
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Write official announcement details..."
                    className="w-full px-3 py-2 rounded-xl bg-[#F8FAFC] dark:bg-[#15203B] border border-[#E2E8F0] dark:border-[#1E293B] text-xs text-[#0F2044] dark:text-white placeholder-[#94A3B8] focus:outline-none focus:ring-1 focus:ring-[#00B4A6]"
                  />
                </div>
              </div>

              <div className="px-6 py-4 border-t border-[#E2E8F0] dark:border-[#1E293B] bg-[#F8FAFC] dark:bg-[#15203B]/40 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsComposeOpen(false)}
                  className="px-4 py-2 rounded-xl border border-[#E2E8F0] dark:border-[#1E293B] text-xs font-medium text-[#475569] dark:text-[#94A3B8]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!content.trim()}
                  className="px-5 py-2 rounded-xl bg-[#00B4A6] hover:bg-[#009E91] dark:bg-[#00D2C4] dark:hover:bg-[#00B4A6] disabled:opacity-50 text-white dark:text-[#09132B] text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5"
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
