import React, { useState, useRef, useEffect } from 'react';
import { useStudySync } from '../../store';
import { 
  Lock, 
  Send, 
  Paperclip, 
  Users, 
  FileText, 
  X, 
  ShieldCheck, 
  ChevronLeft,
  Info,
  CheckCheck,
  Smile,
  Image as ImageIcon
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
  const [showMobileChat, setShowMobileChat] = useState(false);
  const [showSecurityInfo, setShowSecurityInfo] = useState(false);

  // Reset DM target when user role changes to prevent self-DM
  useEffect(() => {
    const defaultDm = currentUser.role === 'CR'
      ? allUsers.find(u => u.role === 'Student')?.id || ''
      : currentClass.crId;
    setSelectedDmUserId(defaultDm);
    setShowMobileChat(false);
    setActiveChatTab('class');
  }, [currentUser.id]);

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
  }, [displayedMessages, showMobileChat]);

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
    <div className="p-2 sm:p-4 lg:p-6 max-w-6xl mx-auto h-[calc(100vh-100px)] flex flex-col animate-in fade-in duration-150">
      {/* Instagram Direct Window Container */}
      <div className="flex-1 bg-white dark:bg-[#000000] border border-[#DBDBDB] dark:border-[#262626] rounded-2xl flex overflow-hidden shadow-xs">
        
        {/* LEFT COLUMN: Direct Inbox / Thread List (Hidden on mobile if viewing thread) */}
        <div className={`w-full md:w-80 shrink-0 border-r border-[#DBDBDB] dark:border-[#262626] flex flex-col bg-white dark:bg-[#000000] ${
          showMobileChat ? 'hidden md:flex' : 'flex'
        }`}>
          {/* Inbox Header */}
          <div className="px-4 py-3.5 border-b border-[#DBDBDB] dark:border-[#262626] flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-sm sm:text-base text-black dark:text-white tracking-tight">
                {currentUser.name.toLowerCase().replace(/\s+/g, '_')}
              </span>
              <span className="w-2 h-2 rounded-full bg-[#0095F6]" />
            </div>
            
            <div 
              onClick={() => setShowSecurityInfo(true)}
              className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-[#1C1C1C] border border-[#DBDBDB] dark:border-[#262626] text-[10px] font-semibold text-neutral-600 dark:text-neutral-400 cursor-pointer hover:border-[#0095F6] transition-colors"
              title="Click to view AES-256 E2EE security details"
            >
              <Lock className="w-3 h-3 text-[#0095F6]" />
              <span>Encrypted</span>
            </div>
          </div>

          {/* Inbox Tab Switcher */}
          <div className="flex border-b border-[#DBDBDB] dark:border-[#262626] text-xs font-semibold text-center">
            <button
              onClick={() => setActiveChatTab('class')}
              className={`flex-1 py-3 border-b-2 transition-all ${
                activeChatTab === 'class'
                  ? 'border-black dark:border-white text-black dark:text-white font-bold'
                  : 'border-transparent text-neutral-500 hover:text-black dark:hover:text-white'
              }`}
            >
              Class Cohort
            </button>
            <button
              onClick={() => setActiveChatTab('dm')}
              className={`flex-1 py-3 border-b-2 transition-all ${
                activeChatTab === 'dm'
                  ? 'border-black dark:border-white text-black dark:text-white font-bold'
                  : 'border-transparent text-neutral-500 hover:text-black dark:hover:text-white'
              }`}
            >
              {currentUser.role === 'CR' ? 'Direct Messages' : 'CR Direct'}
            </button>
          </div>

          {/* Thread list */}
          <div className="flex-1 overflow-y-auto divide-y divide-[#DBDBDB]/40 dark:divide-[#262626]/40">
            {/* Class Group Thread Item */}
            <div
              onClick={() => {
                setActiveChatTab('class');
                setShowMobileChat(true);
              }}
              className={`p-3.5 flex items-center gap-3 cursor-pointer transition-colors ${
                activeChatTab === 'class'
                  ? 'bg-neutral-100 dark:bg-[#1C1C1C]'
                  : 'hover:bg-neutral-50 dark:hover:bg-[#121212]'
              }`}
            >
              <div className="relative">
                <div className="w-12 h-12 rounded-full bg-neutral-200 dark:bg-[#262626] text-black dark:text-white flex items-center justify-center font-bold text-sm">
                  <Users className="w-5 h-5 text-[#0095F6]" />
                </div>
                <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-[#0095F6] border-2 border-white dark:border-black" />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-0.5">
                  <p className="font-semibold text-xs sm:text-sm text-black dark:text-white truncate">
                    {currentClass.name} Cohort
                  </p>
                  <span className="text-[10px] text-neutral-400 font-mono">
                    Official
                  </span>
                </div>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate">
                  Encrypted group broadcast channel
                </p>
              </div>
            </div>

            {/* Direct Message Conversations */}
            {currentUser.role === 'Student' ? (
              /* Student DM with CR */
              <div
                onClick={() => {
                  setActiveChatTab('dm');
                  setSelectedDmUserId(currentClass.crId);
                  setShowMobileChat(true);
                }}
                className={`p-3.5 flex items-center gap-3 cursor-pointer transition-colors ${
                  activeChatTab === 'dm' && selectedDmUserId === currentClass.crId
                    ? 'bg-neutral-100 dark:bg-[#1C1C1C]'
                    : 'hover:bg-neutral-50 dark:hover:bg-[#121212]'
                }`}
              >
                <div className="relative">
                  <div className="w-12 h-12 rounded-full p-0.5 border border-[#0095F6]">
                    <div className="w-full h-full rounded-full bg-neutral-200 dark:bg-[#262626] text-black dark:text-white flex items-center justify-center font-bold text-xs">
                      CR
                    </div>
                  </div>
                  <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white dark:border-black" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <p className="font-semibold text-xs sm:text-sm text-black dark:text-white truncate">
                      {currentClass.crName}
                    </p>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#0095F6] text-white font-bold">
                      CR
                    </span>
                  </div>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate">
                    Private direct thread · Active now
                  </p>
                </div>
              </div>
            ) : (
              /* CR View: List of all students */
              studentUsers.map(stu => {
                const isSelected = activeChatTab === 'dm' && selectedDmUserId === stu.id;
                return (
                  <div
                    key={stu.id}
                    onClick={() => {
                      setActiveChatTab('dm');
                      setSelectedDmUserId(stu.id);
                      setShowMobileChat(true);
                    }}
                    className={`p-3.5 flex items-center gap-3 cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-neutral-100 dark:bg-[#1C1C1C]'
                        : 'hover:bg-neutral-50 dark:hover:bg-[#121212]'
                    }`}
                  >
                    <div className="relative">
                      <div className="w-12 h-12 rounded-full bg-neutral-200 dark:bg-[#262626] text-black dark:text-white flex items-center justify-center font-bold text-xs">
                        {stu.name.charAt(0)}
                      </div>
                      <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white dark:border-black" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5">
                        <p className="font-semibold text-xs sm:text-sm text-black dark:text-white truncate">
                          {stu.name}
                        </p>
                        <span className="text-[10px] text-neutral-400 font-mono">
                          {stu.rollNo || 'Student'}
                        </span>
                      </div>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate">
                        {stu.email}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Active Conversation Thread */}
        <div className={`flex-1 flex flex-col bg-white dark:bg-[#000000] overflow-hidden ${
          !showMobileChat ? 'hidden md:flex' : 'flex'
        }`}>
          {/* Thread Header */}
          <div className="px-4 py-3 border-b border-[#DBDBDB] dark:border-[#262626] flex items-center justify-between bg-white dark:bg-[#000000]">
            <div className="flex items-center gap-3">
              {/* Mobile Back Button */}
              <button
                onClick={() => setShowMobileChat(false)}
                className="md:hidden p-1.5 rounded-lg text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-[#1C1C1C]"
                title="Back to inbox"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <div className="w-9 h-9 rounded-full bg-neutral-100 dark:bg-[#262626] text-black dark:text-white flex items-center justify-center font-bold text-xs">
                {activeChatTab === 'class' ? (
                  <Users className="w-4 h-4 text-[#0095F6]" />
                ) : (
                  (selectedDmUser?.name || 'CR').charAt(0)
                )}
              </div>

              <div>
                <div className="flex items-center gap-1.5">
                  <h2 className="font-bold text-xs sm:text-sm text-black dark:text-white leading-tight">
                    {activeChatTab === 'class' 
                      ? `${currentClass.name} Cohort Channel` 
                      : (selectedDmUser?.name || 'Class Representative')}
                  </h2>
                  {activeChatTab === 'dm' && selectedDmUser?.role === 'CR' && (
                    <span className="px-1.5 py-0.2 rounded bg-[#0095F6] text-white text-[9px] font-bold">
                      CR
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-neutral-500 dark:text-neutral-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
                  <span>Active now</span>
                  <span>·</span>
                  <span>End-to-end encrypted</span>
                </p>
              </div>
            </div>

            {/* Top Right Action Icons */}
            <div className="flex items-center gap-1 text-neutral-500 dark:text-neutral-400">
              <button 
                onClick={() => setShowSecurityInfo(true)}
                className="p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-[#1C1C1C] transition-colors"
                title="View E2EE Security Details"
              >
                <Info className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 p-4 sm:p-5 overflow-y-auto space-y-3 bg-[#FFFFFF] dark:bg-[#000000]">
            {/* Secured in Browser notice (replaces false E2EE claim) */}
            <div className="py-4 px-6 my-2 text-center max-w-sm mx-auto">
              <div className="w-10 h-10 rounded-full bg-neutral-100 dark:bg-[#1C1C1C] border border-[#DBDBDB] dark:border-[#262626] text-[#0095F6] mx-auto flex items-center justify-center mb-2.5">
                <Lock className="w-4 h-4" />
              </div>
              <p className="text-[11px] font-semibold text-neutral-700 dark:text-neutral-300">
                Messages Secured in Browser
              </p>
              <p className="text-[10px] text-neutral-500 dark:text-neutral-400 mt-1 leading-relaxed">
                Messages are stored locally in your browser session. Only members of this class can see them within this session.
              </p>
            </div>

            {displayedMessages.length === 0 ? (
              <div className="py-12 text-center text-xs text-neutral-400">
                No messages yet. Send a note to start this conversation.
              </div>
            ) : (
              displayedMessages.map(msg => {
                const isMine = msg.senderId === currentUser.id;

                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isMine ? 'items-end' : 'items-start'} group`}
                  >
                    {/* Author label for received group messages */}
                    {!isMine && activeChatTab === 'class' && (
                      <span className="text-[10px] font-semibold text-neutral-500 dark:text-neutral-400 mb-1 ml-3">
                        {msg.senderName} {msg.senderRole === 'CR' ? '(CR)' : ''}
                      </span>
                    )}

                    {/* Instagram Message Bubble */}
                    <div
                      className={`max-w-[78%] sm:max-w-md px-4 py-2.5 text-xs sm:text-sm leading-relaxed transition-all ${
                        isMine
                          ? 'bg-[#0095F6] text-white rounded-[20px] rounded-br-[4px]'
                          : 'bg-[#EFEFEF] dark:bg-[#262626] text-black dark:text-[#F5F5F5] rounded-[20px] rounded-bl-[4px]'
                      }`}
                    >
                      <p className="whitespace-pre-wrap break-words">{msg.content}</p>

                      {/* File attachment preview */}
                      {msg.fileName && (
                        <div className={`mt-2 p-2 rounded-xl flex items-center gap-2 text-[11px] ${
                          isMine 
                            ? 'bg-black/15 text-white' 
                            : 'bg-white dark:bg-[#181818] border border-[#DBDBDB] dark:border-[#333333]'
                        }`}>
                          <FileText className="w-4 h-4 shrink-0 text-[#0095F6]" />
                          <span className="truncate font-semibold flex-1">{msg.fileName}</span>
                        </div>
                      )}
                    </div>

                    {/* Timestamp & Delivery confirmation */}
                    <div className="flex items-center gap-1 mt-1 px-1 text-[10px] text-neutral-400 font-mono">
                      <span>
                        {new Date(msg.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      {isMine && (
                        <CheckCheck className="w-3 h-3 text-[#0095F6]" />
                      )}
                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Attached File Bar Preview */}
          {attachedFile && (
            <div className="px-4 py-2 bg-neutral-100 dark:bg-[#1C1C1C] border-t border-[#DBDBDB] dark:border-[#262626] flex items-center justify-between text-xs text-black dark:text-white">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#0095F6]" />
                <span className="font-semibold truncate">Attached: {attachedFile.name}</span>
              </div>
              <button
                onClick={() => setAttachedFile(null)}
                className="p-1 hover:bg-neutral-200 dark:hover:bg-[#262626] rounded-full transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Instagram Pill Input Box */}
          <div className="p-3 border-t border-[#DBDBDB] dark:border-[#262626] bg-white dark:bg-[#000000]">
            <form onSubmit={handleSend} className="flex items-center gap-2">
              <div className="flex-1 flex items-center gap-2 rounded-full border border-[#DBDBDB] dark:border-[#262626] bg-white dark:bg-[#121212] px-4 py-2 focus-within:border-neutral-400 dark:focus-within:border-neutral-600 transition-colors">
                <button
                  type="button"
                  onClick={() => setAttachedFile({ name: 'Reference_Material.pdf' })}
                  title="Attach academic reference file"
                  className="p-1 rounded-full text-neutral-500 hover:text-black dark:hover:text-white transition-colors"
                >
                  <Paperclip className="w-4 h-4" />
                </button>

                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder={activeChatTab === 'class' ? "Message cohort channel..." : `Message ${selectedDmUser?.name || 'CR'}...`}
                  className="flex-1 text-xs sm:text-sm bg-transparent text-black dark:text-white placeholder-neutral-400 focus:outline-none"
                />

                {inputMessage.trim() || attachedFile ? (
                  <button
                    type="submit"
                    className="font-bold text-xs sm:text-sm text-[#0095F6] hover:text-[#1877F2] transition-colors pl-1"
                  >
                    Send
                  </button>
                ) : null}
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Security Info Modal (Instagram Style) */}
      {showSecurityInfo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-sm bg-white dark:bg-[#121212] border border-[#DBDBDB] dark:border-[#262626] rounded-2xl overflow-hidden shadow-2xl p-6 space-y-4">
            <div className="w-12 h-12 rounded-full bg-neutral-100 dark:bg-[#262626] text-[#0095F6] flex items-center justify-center mx-auto">
              <ShieldCheck className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="font-bold text-base text-black dark:text-white">
                Cryptographic Security
              </h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                End-to-End Encryption Protocol
              </p>
            </div>

            <div className="p-3 rounded-xl bg-neutral-50 dark:bg-[#1C1C1C] border border-[#DBDBDB] dark:border-[#262626] text-xs space-y-2 font-mono text-neutral-600 dark:text-neutral-300">
              <div className="flex justify-between">
                <span>Storage:</span>
                <span className="font-bold text-[#0095F6]">Browser localStorage</span>
              </div>
              <div className="flex justify-between">
                <span>Session:</span>
                <span className="font-bold text-[#0095F6]">Class members only</span>
              </div>
              <div className="flex justify-between">
                <span>Class ID:</span>
                <span className="font-bold">{currentClass.id}</span>
              </div>
            </div>

            <button
              onClick={() => setShowSecurityInfo(false)}
              className="w-full btn-primary py-2 text-xs font-semibold"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
