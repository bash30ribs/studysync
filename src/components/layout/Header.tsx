import React, { useState, useRef, useEffect } from 'react';
import { useStudySync } from '../../store';
import { 
  Bell, 
  Wifi, 
  WifiOff, 
  CheckCheck, 
  Clock, 
  Megaphone, 
  FileText, 
  CheckCircle, 
  ShieldAlert, 
  Sun, 
  Moon, 
  ChevronDown,
  Search,
  BookOpen,
  Headphones,
  Trophy,
  HelpCircle,
  Smartphone,
  Send
} from 'lucide-react';

interface HeaderProps {
  onOpenLanding?: () => void;
  onOpenSoundscapes?: () => void;
  onOpenAchievements?: () => void;
  onOpenShortcuts?: () => void;
  isDarkMode: boolean;
  setIsDarkMode: (val: boolean | ((prev: boolean) => boolean)) => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  onOpenLanding, 
  onOpenSoundscapes,
  onOpenAchievements,
  onOpenShortcuts,
  isDarkMode, 
  setIsDarkMode 
}) => {
  const { 
    currentUser, 
    currentClass, 
    allUsers, 
    notifications, 
    isOffline, 
    toggleOffline, 
    switchRole, 
    markNotificationRead, 
    markAllNotificationsRead,
    activeTab,
    setActiveTab,
    setSelectedAssignmentId,
    setIsCommandPaletteOpen
  } = useStudySync();

  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isUserSwitcherOpen, setIsUserSwitcherOpen] = useState(false);
  const [showClassCode, setShowClassCode] = useState(false);
  const [syncMinutesAgo, setSyncMinutesAgo] = useState(0);
  const notifRef = useRef<HTMLDivElement>(null);
  const userSwitcherRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setSyncMinutesAgo(prev => prev + 1);
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const syncTimeText = syncMinutesAgo === 0 ? 'just now' : `${syncMinutesAgo}m ago`;

  const unreadCount = notifications.filter(n => !n.read && (n.userId === 'ALL' || n.userId === currentUser.id)).length;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setIsNotifOpen(false);
      }
      if (userSwitcherRef.current && !userSwitcherRef.current.contains(e.target as Node)) {
        setIsUserSwitcherOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getNotifIcon = (type: string) => {
    switch (type) {
      case 'assignment':
        return <FileText className="w-3.5 h-3.5 text-[#0095F6]" />;
      case 'reminder':
        return <Clock className="w-3.5 h-3.5 text-amber-500" />;
      case 'broadcast':
        return <Megaphone className="w-3.5 h-3.5 text-purple-500" />;
      case 'submission':
        return <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />;
      default:
        return <ShieldAlert className="w-3.5 h-3.5 text-neutral-400" />;
    }
  };

  const handleNotificationClick = (n: typeof notifications[0]) => {
    markNotificationRead(n.id);
    if (n.refType === 'assignment' && n.refId) {
      setActiveTab('assignments');
      setSelectedAssignmentId(n.refId);
    } else if (n.refType === 'broadcast') {
      setActiveTab('broadcasts');
    }
    setIsNotifOpen(false);
  };

  return (
    <header className="sticky top-0 z-30 bg-white/95 dark:bg-black/95 backdrop-blur-md border-b border-[#DBDBDB] dark:border-[#262626] px-4 lg:px-6 py-2.5 flex items-center justify-between transition-colors duration-150">
      {/* Left: Class identity & Network sync */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-black dark:bg-white flex items-center justify-center text-white dark:text-black font-extrabold text-xs tracking-tight">
            <BookOpen className="w-4 h-4" />
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-black dark:text-white tracking-tight text-sm leading-none">
              StudySync
            </span>
            <span className="text-[10px] text-[#0095F6] font-semibold tracking-wider uppercase mt-0.5">
              Hub
            </span>
          </div>
        </div>

        <div className="h-4 w-px bg-[#DBDBDB] dark:bg-[#262626] hidden sm:block ml-1" />

        {/* Current Class Badge with masked code */}
        <div className="flex items-center gap-2 px-2.5 py-1 rounded-md bg-[#EFEFEF] dark:bg-[#121212] text-xs border border-[#DBDBDB] dark:border-[#262626]">
          <span className="text-[#8E8E8E] font-medium hidden sm:inline">Class:</span>
          <span className="font-semibold text-black dark:text-white">{currentClass.name}</span>
          <button
            onClick={() => setShowClassCode(prev => !prev)}
            title={showClassCode ? 'Hide join code' : 'Tap to reveal join code'}
            className="font-mono text-[10px] font-semibold text-[#0095F6] bg-white dark:bg-[#262626] px-1.5 py-0.5 rounded border border-[#DBDBDB] dark:border-[#363636] cursor-pointer hover:border-[#0095F6] transition-colors tracking-widest select-none"
          >
            {showClassCode ? currentClass.code : '••••••'}
          </button>
        </div>

        {/* Live Network Sync Pill */}
        <button
          onClick={toggleOffline}
          title={isOffline ? "Offline mode (Click to go online)" : "Connected (Click to toggle offline simulation)"}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
            isOffline 
              ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30' 
              : 'bg-[#EFEFEF] dark:bg-[#121212] text-[#8E8E8E] dark:text-[#A8A8A8] border border-[#DBDBDB] dark:border-[#262626] hover:text-black dark:hover:text-white'
          }`}
        >
          {isOffline ? (
            <>
              <WifiOff className="w-3.5 h-3.5 text-amber-500" />
              <span className="hidden md:inline">Offline</span>
            </>
          ) : (
            <>
              <span className="w-1.5 h-1.5 rounded-full bg-[#0095F6] animate-pulse" />
              <span className="hidden md:inline font-semibold">● Live</span>
            </>
          )}
        </button>

        {/* Subtle Last synced indicator */}
        <span className="text-[10px] text-[#737373] dark:text-[#8E8E8E] hidden lg:inline select-none">
          Last synced: {syncTimeText}
        </span>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        {/* Command Palette Trigger */}
        <button
          onClick={() => setIsCommandPaletteOpen(true)}
          className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-md border border-[#DBDBDB] dark:border-[#262626] bg-[#EFEFEF] dark:bg-[#121212] text-xs text-[#8E8E8E] hover:text-black dark:hover:text-white hover:border-neutral-400 dark:hover:border-neutral-700 transition"
        >
          <Search className="w-3.5 h-3.5 text-[#8E8E8E]" />
          <span className="font-medium">Search or jump...</span>
          <kbd className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-white dark:bg-[#262626] border border-[#DBDBDB] dark:border-[#363636] font-semibold text-[#8E8E8E]">
            ⌘K
          </kbd>
        </button>

        {/* Soundscapes Ambient Focus Button */}
        {onOpenSoundscapes && (
          <button
            onClick={onOpenSoundscapes}
            title="Study Soundscapes (Alt+S)"
            className="w-8 h-8 rounded-md border border-[#DBDBDB] dark:border-[#262626] bg-white dark:bg-[#121212] text-[#737373] dark:text-[#A8A8A8] hover:text-[#0095F6] hover:border-[#0095F6] flex items-center justify-center transition"
          >
            <Headphones className="w-4 h-4" />
          </button>
        )}

        {/* Milestones & Badges Button */}
        {onOpenAchievements && (
          <button
            onClick={onOpenAchievements}
            title="Achievements"
            className="w-8 h-8 rounded-md border border-[#DBDBDB] dark:border-[#262626] bg-white dark:bg-[#121212] text-[#737373] dark:text-[#A8A8A8] hover:text-amber-500 hover:border-amber-500 flex items-center justify-center transition"
          >
            <Trophy className="w-4 h-4" />
          </button>
        )}

        {/* Dark / Light Mode Toggle */}
        <button
          id="theme-toggle"
          data-testid="theme-toggle"
          onClick={() => setIsDarkMode(prev => !prev)}
          aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
          title={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
          className="w-8 h-8 rounded-md border border-[#DBDBDB] dark:border-[#262626] bg-white dark:bg-[#121212] text-[#737373] dark:text-[#A8A8A8] hover:text-black dark:hover:text-white hover:border-[#0095F6] flex items-center justify-center transition cursor-pointer"
        >
          {isDarkMode ? (
            <Sun className="w-4 h-4 text-amber-400" />
          ) : (
            <Moon className="w-4 h-4 text-neutral-800" />
          )}
        </button>

        {/* Keyboard Shortcuts Helper */}
        {onOpenShortcuts && (
          <button
            onClick={onOpenShortcuts}
            title="Keyboard Shortcuts (?)"
            className="hidden sm:flex w-8 h-8 rounded-md border border-[#DBDBDB] dark:border-[#262626] bg-white dark:bg-[#121212] text-[#737373] dark:text-[#A8A8A8] hover:text-black dark:hover:text-white items-center justify-center transition"
          >
            <HelpCircle className="w-4 h-4" />
          </button>
        )}

        {/* Direct Messages */}
        <button
          onClick={() => setActiveTab('messages')}
          aria-label="Direct Messages"
          title="Direct Messages"
          className={`w-8 h-8 rounded-md border border-[#DBDBDB] dark:border-[#262626] bg-white dark:bg-[#121212] flex items-center justify-center transition ${
            activeTab === 'messages'
              ? 'text-[#0095F6] border-[#0095F6]'
              : 'text-[#737373] dark:text-[#A8A8A8] hover:text-black dark:hover:text-white'
          }`}
        >
          <Send className="w-4 h-4" />
        </button>

        {/* Notifications Dropdown */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setIsNotifOpen(prev => !prev)}
            aria-label="Notifications"
            className="relative w-8 h-8 rounded-md border border-[#DBDBDB] dark:border-[#262626] bg-white dark:bg-[#121212] text-[#737373] dark:text-[#A8A8A8] hover:text-black dark:hover:text-white flex items-center justify-center transition"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[16px] h-[16px] px-0.5 rounded-full bg-[#ED4956] text-white text-[9px] font-bold flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>

          {isNotifOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-[#121212] border border-[#DBDBDB] dark:border-[#262626] rounded-xl shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
              <div className="flex items-center justify-between px-4 py-3 border-b border-[#DBDBDB] dark:border-[#262626] bg-[#FAFAFA] dark:bg-[#181818]">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-xs sm:text-sm text-black dark:text-white">Notifications</span>
                  {unreadCount > 0 && (
                    <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-[#0095F6]/15 text-[#0095F6]">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllNotificationsRead}
                    className="text-xs text-[#0095F6] hover:underline flex items-center gap-1 font-semibold"
                  >
                    <CheckCheck className="w-3.5 h-3.5" />
                    Mark all read
                  </button>
                )}
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-[#EFEFEF] dark:divide-[#262626]">
                {notifications.length === 0 ? (
                  <div className="py-8 text-center text-xs text-[#8E8E8E]">
                    No notifications right now.
                  </div>
                ) : (
                  notifications
                    .filter(n => n.userId === 'ALL' || n.userId === currentUser.id)
                    .slice(0, 10)
                    .map(n => (
                      <div
                        key={n.id}
                        onClick={() => handleNotificationClick(n)}
                        className={`px-4 py-3 text-left transition-colors cursor-pointer hover:bg-[#FAFAFA] dark:hover:bg-[#1C1C1C] ${
                          !n.read ? 'bg-[#0095F6]/5' : ''
                        }`}
                      >
                        <div className="flex items-start gap-2.5">
                          <div className="mt-0.5 p-1.5 rounded-md bg-[#EFEFEF] dark:bg-[#262626] shrink-0">
                            {getNotifIcon(n.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <p className="text-xs font-semibold text-black dark:text-white truncate">
                                {n.title}
                              </p>
                              <span className="text-[10px] text-[#8E8E8E] ml-2 shrink-0 font-mono">
                                {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                            <p className="text-xs text-[#737373] dark:text-[#A8A8A8] mt-0.5 line-clamp-2 leading-relaxed">
                              {n.content}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Role & Persona Switcher */}
        <div className="relative" ref={userSwitcherRef}>
          <button
            onClick={() => setIsUserSwitcherOpen(prev => !prev)}
            className="flex items-center gap-2 pl-2 pr-2.5 py-1 rounded-md border border-[#DBDBDB] dark:border-[#262626] bg-white dark:bg-[#121212] hover:bg-[#FAFAFA] dark:hover:bg-[#1C1C1C] transition-all text-xs"
          >
            <div className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[11px] text-white shrink-0 ${
              (currentUser?.role || 'Student') === 'CR'
                ? 'bg-[#0095F6]'
                : 'bg-[#262626] dark:bg-white dark:text-black'
            }`}>
              {(currentUser?.name || 'U').charAt(0)}
            </div>
            <div className="text-left hidden sm:block">
              <span className="font-semibold text-black dark:text-white block leading-tight">
                {(currentUser?.name || 'User').split(' ')[0]}
              </span>
              <span className={`text-[10px] font-medium leading-none block ${
                (currentUser?.role || 'Student') === 'CR' ? 'text-[#0095F6]' : 'text-[#8E8E8E]'
              }`}>
                {currentUser?.role || 'Student'} Mode
              </span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-[#8E8E8E]" />
          </button>

          {isUserSwitcherOpen && (
            <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-[#121212] border border-[#DBDBDB] dark:border-[#262626] rounded-xl shadow-xl z-50 p-2 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
              <div className="px-2.5 py-1.5 mb-1 text-[10px] font-bold text-[#8E8E8E] uppercase tracking-wider">
                Switch Role / Preview Persona
              </div>

              {/* CR Option */}
              <div className="space-y-1">
                {allUsers.filter(u => u.role === 'CR').map(u => (
                  <button
                    key={u.id}
                    onClick={() => {
                      switchRole('CR', u.id);
                      setIsUserSwitcherOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs transition-colors ${
                      currentUser.id === u.id 
                        ? 'bg-[#0095F6]/10 text-[#0095F6] font-semibold border border-[#0095F6]/30' 
                        : 'text-black dark:text-white hover:bg-[#FAFAFA] dark:hover:bg-[#1C1C1C]'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-[#0095F6] text-white flex items-center justify-center text-[10px] font-bold">
                        CR
                      </div>
                      <div className="text-left">
                        <div className="font-semibold text-black dark:text-white">{u.name}</div>
                        <div className="text-[10px] text-[#8E8E8E]">{u.email}</div>
                      </div>
                    </div>
                    <span className="px-1.5 py-0.5 rounded bg-[#0095F6] text-white text-[10px] font-bold">CR</span>
                  </button>
                ))}
              </div>

              <div className="h-px bg-[#DBDBDB] dark:bg-[#262626] my-2" />

              <div className="px-2.5 py-1 text-[10px] font-bold text-[#8E8E8E] uppercase tracking-wider">
                Student Personas
              </div>

              <div className="max-h-48 overflow-y-auto space-y-1 pr-1">
                {allUsers.filter(u => u.role === 'Student').map(u => (
                  <button
                    key={u.id}
                    onClick={() => {
                      switchRole('Student', u.id);
                      setIsUserSwitcherOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors ${
                      currentUser.id === u.id 
                        ? 'bg-[#EFEFEF] dark:bg-[#262626] font-semibold text-black dark:text-white' 
                        : 'text-black dark:text-white hover:bg-[#FAFAFA] dark:hover:bg-[#1C1C1C]'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <div className="w-5 h-5 rounded-full bg-[#DBDBDB] dark:bg-[#363636] text-neutral-800 dark:text-neutral-200 flex items-center justify-center text-[10px] font-semibold">
                        {u.name.charAt(0)}
                      </div>
                      <div className="text-left truncate">
                        <span className="font-medium truncate block text-black dark:text-white">{u.name}</span>
                        <span className="text-[10px] text-[#8E8E8E] block font-mono">{u.rollNo}</span>
                      </div>
                    </div>
                    <span className="text-[10px] text-[#8E8E8E]">Student</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
