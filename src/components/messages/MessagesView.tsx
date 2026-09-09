import React, { useState, useRef, useEffect } from 'react';
import { useStudySync } from '../../store';
import { 
  Lock, 
  Send, 
  Paperclip, 
  Users, 
  FileText, 
  X
} from 'lucide-react';

export const MessagesView: React.FC = () => {
  const { 
    currentUser, 
    currentClass, 
    allUsers, 
    messages, 
    sendMessage 
  } = useStudySync();

  const [activeChatTab, setActiveChatTab] = useState<'class' | 'dm'>('class');
  const [selectedDmUserId, setSelectedDmUserId] = useState<string>(
    currentUser.role === 'CR' 
      ? allUsers.find(u => u.role === 'Student')?.id || ''
      : currentClass.crId
  );
  const [inputMessage, setInputMessage] = useState('');
  const [attachedFile, setAttachedFile] = useState<{ name: string } | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const studentUsers = allUsers.filter(u => u.role === 'Student');

  // Filter messages based on active tab
  const displayedMessages = messages.filter(msg => {
    if (activeChatTab === 'class') {
      return msg.recipientId === null;
    } else {
      return (
        (msg.senderId === currentUser.id && msg.recipientId === selectedDmUserId) ||
        (msg.senderId === selectedDmUserId && msg.recipientId === currentUser.id)
      );
    }
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [displayedMessages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() && !attachedFile) return;

    sendMessage(
      inputMessage,
      activeChatTab === 'class' ? null : selectedDmUserId,
      attachedFile || undefined
    );

    setInputMessage('');
    setAttachedFile(null);
  };

  const selectedDmUser = allUsers.find(u => u.id === selectedDmUserId);

  return (
    <div className="p-4 lg:p-7 max-w-6xl mx-auto h-[calc(100vh-110px)] flex flex-col">
      {/* Top Header & Encryption Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E2E7F0] dark:border-[#1E293B]">
        <div>
          <h1 className="text-xl font-extrabold text-[#0F2044] dark:text-white tracking-tight">
            Encrypted Messages
          </h1>
          <p className="text-xs text-[#64748B] dark:text-[#94A3B8]">
            Direct CR inquiries and secure class discussions.
          </p>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E6F8F6] dark:bg-[#00D2C4]/15 text-[#00897B] dark:text-[#00D2C4] text-xs font-bold border border-[#00B4A6]/20 self-start sm:self-auto shadow-xs">
          <Lock className="w-3.5 h-3.5" />
          <span>AES-256 Client Encrypted</span>
        </div>
      </div>

      {/* Main chat layout: Channels / DM list + Active conversation */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4 mt-4 overflow-hidden">
        {/* Left column: Channel selector & DM roster */}
        <div className="bg-white dark:bg-[#0F172A] border border-[#E2E7F0] dark:border-[#1E293B] rounded-xl p-3 flex flex-col gap-3 shadow-xs">
          {/* Main Channel Button */}
          <button
            onClick={() => setActiveChatTab('class')}
            className={`w-full flex items-center justify-between p-2.5 rounded-lg text-xs font-bold transition-all ${
              activeChatTab === 'class'
                ? 'bg-[#00B4A6] dark:bg-[#00D2C4] text-white dark:text-[#080D1A] shadow-xs'
                : 'bg-[#F8FAFC] dark:bg-[#15203B] text-[#0F2044] dark:text-white hover:bg-[#F1F5F9] dark:hover:bg-[#1E293B]'
            }`}
          >
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span>Class Channel</span>
            </div>
            <span className="text-[10px] opacity-80 font-mono">{currentClass.name}</span>
          </button>

          <div className="h-px bg-[#E2E7F0] dark:border-[#1E293B]" />

          {/* DMs Section */}
          <div className="flex-1 flex flex-col overflow-hidden">
            <span className="text-[10px] font-bold text-[#64748B] dark:text-[#94A3B8] uppercase tracking-wider mb-2">
              {currentUser.role === 'CR' ? 'Student Direct Messages' : 'Direct Message CR'}
            </span>

            <div className="flex-1 overflow-y-auto space-y-1 pr-1">
              {currentUser.role === 'Student' ? (
                /* Student only sees CR */
                <button
                  onClick={() => {
                    setActiveChatTab('dm');
                    setSelectedDmUserId(currentClass.crId);
                  }}
                  className={`w-full flex items-center gap-2.5 p-2 rounded-lg text-xs transition-colors ${
                    activeChatTab === 'dm' && selectedDmUserId === currentClass.crId
                      ? 'bg-[#E6F8F6] dark:bg-[#00D2C4]/15 text-[#00897B] dark:text-[#00D2C4] font-bold'
                      : 'text-[#0F2044] dark:text-white hover:bg-[#F8FAFC] dark:hover:bg-[#15203B]'
                  }`}
                >
                  <div className="w-6 h-6 rounded-full bg-[#0F2044] dark:bg-[#00D2C4] text-white dark:text-[#09132B] flex items-center justify-center text-[10px] font-extrabold shadow-xs">
                    CR
                  </div>
                  <div className="text-left truncate">
                    <p className="truncate font-semibold">{currentClass.crName}</p>
                    <p className="text-[10px] text-[#64748B] dark:text-[#94A3B8]">Class Representative</p>
                  </div>
                </button>
              ) : (
                /* CR sees all students */
                studentUsers.map(stu => (
                  <button
                    key={stu.id}
                    onClick={() => {
                      setActiveChatTab('dm');
                      setSelectedDmUserId(stu.id);
                    }}
                    className={`w-full flex items-center gap-2.5 p-2 rounded-lg text-xs transition-colors ${
                      activeChatTab === 'dm' && selectedDmUserId === stu.id
                        ? 'bg-[#E6F8F6] dark:bg-[#00D2C4]/15 text-[#00897B] dark:text-[#00D2C4] font-bold'
                        : 'text-[#0F2044] dark:text-white hover:bg-[#F8FAFC] dark:hover:bg-[#15203B]'
                    }`}
                  >
                    <div className="w-6 h-6 rounded-full bg-[#64748B] dark:bg-[#334155] text-white flex items-center justify-center text-[10px] font-bold">
                      {stu.name.charAt(0)}
                    </div>
                    <div className="text-left truncate">
                      <p className="truncate font-semibold">{stu.name}</p>
                      <p className="text-[10px] text-[#64748B] dark:text-[#94A3B8] font-mono">{stu.rollNo}</p>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right 3 columns: Message Stream & Input */}
        <div className="md:col-span-3 bg-white dark:bg-[#0F172A] border border-[#E2E7F0] dark:border-[#1E293B] rounded-xl flex flex-col overflow-hidden shadow-xs">
          {/* Thread Header */}
          <div className="px-5 py-3 border-b border-[#E2E7F0] dark:border-[#1E293B] flex items-center justify-between bg-[#F8FAFC] dark:bg-[#15203B]/60">
            <div>
              <h2 className="font-bold text-xs sm:text-sm text-[#0F2044] dark:text-white">
                {activeChatTab === 'class' ? `# ${currentClass.name} Class Channel` : `DM with ${selectedDmUser?.name || 'User'}`}
              </h2>
              <p className="text-[11px] text-[#64748B] dark:text-[#94A3B8]">
                {activeChatTab === 'class' ? 'All enrolled members can read and contribute' : 'Private end-to-end encrypted thread'}
              </p>
            </div>
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3">
            {displayedMessages.length === 0 ? (
              <div className="py-12 text-center text-xs text-[#64748B] dark:text-[#94A3B8]">
                No messages yet in this thread. Start the conversation below.
              </div>
            ) : (
              displayedMessages.map(msg => {
                const isMine = msg.senderId === currentUser.id;

                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}
                  >
                    <div className="flex items-center gap-1.5 mb-1 text-[11px] text-[#64748B] dark:text-[#94A3B8]">
                      <span className="font-bold text-[#0F2044] dark:text-white">
                        {isMine ? 'You' : msg.senderName}
                      </span>
                      {msg.senderRole === 'CR' && (
                        <span className="px-1 py-0.2 rounded bg-[#00B4A6] dark:bg-[#00D2C4] text-white dark:text-[#09132B] text-[9px] font-extrabold">
                          CR
                        </span>
                      )}
                      <span>·</span>
                      <span className="font-mono text-[10px]">
                        {new Date(msg.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    <div
                      className={`p-3 rounded-xl max-w-lg text-xs leading-relaxed shadow-xs ${
                        isMine
                          ? 'bg-[#0F2044] dark:bg-[#00D2C4] text-white dark:text-[#080D1A] font-medium rounded-tr-none'
                          : 'bg-[#F8FAFC] dark:bg-[#15203B] text-[#0F2044] dark:text-white border border-[#E2E7F0] dark:border-[#1E293B] rounded-tl-none'
                      }`}
                    >
                      <p>{msg.content}</p>

                      {msg.fileName && (
                        <div className="mt-2 p-2 rounded bg-black/10 flex items-center gap-2 text-[11px]">
                          <FileText className="w-3.5 h-3.5" />
                          <span className="truncate font-semibold">{msg.fileName}</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Attached File Preview */}
          {attachedFile && (
            <div className="px-4 py-2 bg-[#E6F8F6] dark:bg-[#00D2C4]/15 border-t border-[#00B4A6]/20 flex items-center justify-between text-xs text-[#00897B] dark:text-[#00D2C4]">
              <div className="flex items-center gap-1.5">
                <FileText className="w-4 h-4" />
                <span className="font-bold truncate">Attached: {attachedFile.name}</span>
              </div>
              <button
                onClick={() => setAttachedFile(null)}
                className="p-1 hover:bg-black/10 rounded"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Input Box */}
          <form onSubmit={handleSend} className="p-3 border-t border-[#E2E7F0] dark:border-[#1E293B] flex items-center gap-2 bg-[#F8FAFC] dark:bg-[#15203B]/60">
            <button
              type="button"
              onClick={() => setAttachedFile({ name: 'Reference_Notes.pdf' })}
              title="Attach File"
              className="p-2 rounded-lg text-[#64748B] dark:text-[#94A3B8] hover:text-[#0F2044] dark:hover:text-white hover:bg-white dark:hover:bg-[#1E293B] transition-colors"
            >
              <Paperclip className="w-4 h-4" />
            </button>

            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder={activeChatTab === 'class' ? "Message class channel..." : `Message ${selectedDmUser?.name || 'CR'} directly...`}
              className="flex-1 text-xs px-3.5 py-2.5 rounded-lg border border-[#E2E7F0] dark:border-[#1E293B] bg-white dark:bg-[#080D1A] text-[#0F2044] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#00B4A6]/20 focus:border-[#00B4A6] dark:focus:border-[#00D2C4]"
            />

            <button
              type="submit"
              disabled={!inputMessage.trim() && !attachedFile}
              className="p-2.5 rounded-lg bg-[#00B4A6] dark:bg-[#00D2C4] hover:bg-[#009E91] dark:hover:bg-[#00B4A6] disabled:opacity-50 text-white dark:text-[#080D1A] transition-all shadow-xs"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
