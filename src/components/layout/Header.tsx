import React, { useState, useRef, useEffect } from 'react';
import { useStudySync } from '../../store';
import { 
  Bell, 
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
  Send,
  ArrowLeft,
  Shield,
  KeyRound,
  GraduationCap
} from 'lucide-react';

interface HeaderProps {
  onOpenLanding?: () => void;
  onOpenSoundscapes?: () => void;
  onOpenAchievements?: () => void;
  onOpenShortcuts?: () => void;
  onOpenRolePortals?: () => void;
  isDarkMode: boolean;
  setIsDarkMode: (val: boolean | ((prev: boolean) => boolean)) => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  onOpenLanding, 
  onOpenSoundscapes,
  onOpenAchievements,
  onOpenShortcuts,
  onOpenRolePortals,
  isDarkMode, 
  setIsDarkMode 
}) => {
  const { 
    currentUser, 
    currentClass, 
    allUsers, 
    notifications, 
    switchRole, 
    markNotificationRead, 
    markAllNotificationsRead,
    activeTab,
    setActiveTab,
    canGoBack,
    goBack,
    setSelectedAssignmentId,
    setIsCommandPaletteOpen
  } = useStudySync();

  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isUserSwitcherOpen, setIsUserSwitcherOpen] = useState(false);
  const [showClassCode, setShowClassCode] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const userSwitcherRef = useRef<HTMLDivElement>(null);

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
        {canGoBack && (
          <button
            onClick={goBack}
            id="nav-back-button"
            data-testid="nav-back-button"
            title="Go Back (Alt+← or Backspace)"
            aria-label="Go Back"
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold text-black dark:text-white bg-[#EFEFEF] dark:bg-[#1A1A1A] hover:bg-[#E5E5E5] dark:hover:bg-[#262626] border border-[#DBDBDB] dark:border-[#262626] transition-all cursor-pointer shadow-xs active:scale-95 shrink-0"
          >
            <ArrowLeft className="w-3.5 h-3.5 stroke-[2.3]" />
            <span className="hidden sm:inline">Back</span>
          </button>
        )}

        <button
          type="button"
          onClick={onOpenLanding}
          id="header-brand-button"
          data-testid="header-brand-button"
          title="Return to StudySync Landing Page"
          aria-label="StudySync Hub - Return to Landing Page"
          className="flex items-center gap-2.5 px-2 py-1.5 -mx-1.5 -my-1 rounded-lg group cursor-pointer text-left transition-all duration-150 active:scale-95 hover:bg-[#EFEFEF] dark:hover:bg-[#1A1A1A] border border-transparent hover:border-[#DBDBDB] dark:hover:border-[#262626] focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#0095F6]"
        >
          <div className="w-8 h-8 rounded-lg bg-black dark:bg-white flex items-center justify-center text-white dark:text-black font-extrabold text-xs tracking-tight group-hover:scale-105 transition-transform duration-150 shadow-xs">
            <BookOpen className="w-4 h-4" />
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-black dark:text-white tracking-tight text-sm leading-none group-hover:text-[#0095F6] transition-colors">
              StudySync
            </span>
            <span className="text-[10px] text-[#0095F6] font-semibold tracking-wider uppercase mt-0.5">
              Hub
            </span>
          </div>
        </button>

        <div className="h-4 w-px bg-[#DBDBDB] dark:bg-[#262626] hidden sm:block ml-1" />

        {/* Current Class Badge with masked code */}
        <div className="flex items-center gap-2 px-2.5 py-1 rounded-md bg-[#EFEFEF] dark:bg-[#121212] text-xs border border-[#DBDBDB] dark:border-[#262626]">
          <span className="text-[#52525b] dark:text-[#A8A8A8] font-medium hidden sm:inline">Class:</span>
          <span className="font-semibold text-black dark:text-white">{currentClass.name}</span>
          <button
            onClick={() => setShowClassCode(prev => !prev)}
            title={showClassCode ? 'Hide join code' : 'Tap to reveal join code'}
            className="font-mono text-[10px] font-bold text-[#0284c7] dark:text-[#38bdf8] bg-white dark:bg-[#262626] px-1.5 py-0.5 rounded border border-[#DBDBDB] dark:border-[#363636] cursor-pointer hover:border-neutral-400 dark:hover:border-neutral-500 transition-colors tracking-widest select-none"
          >
            {showClassCode ? currentClass.code : '••••••'}
          </button>
        </div>
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
              currentUser?.role === 'Faculty'
                ? 'bg-purple-600'
                : currentUser?.role === 'CR'
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
                currentUser?.role === 'Faculty' 
                  ? 'text-purple-600 dark:text-purple-400 font-semibold' 
                  : currentUser?.role === 'CR' 
                  ? 'text-[#0095F6]' 
                  : 'text-[#8E8E8E]'
              }`}>
                {currentUser?.role === 'Faculty' ? 'Faculty Incharge' : `${currentUser?.role || 'Student'} Mode`}
              </span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-[#8E8E8E]" />
          </button>

          {isUserSwitcherOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-[#121212] border border-[#DBDBDB] dark:border-[#262626] rounded-xl shadow-xl z-50 p-2 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
              {/* Dedicated 3 Portals CTA */}
              <div className="p-1 mb-2 border-b border-[#DBDBDB] dark:border-[#262626]">
                <button
                  onClick={() => {
                    setIsUserSwitcherOpen(false);
                    onOpenRolePortals?.();
                  }}
                  className="w-full py-2 px-3 rounded-lg bg-gradient-to-r from-purple-600 via-indigo-600 to-[#0095F6] hover:opacity-95 text-white font-semibold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-opacity"
                >
                  <KeyRound className="w-3.5 h-3.5" />
                  <span>Open 3-Role Login Portals</span>
                </button>
              </div>

              {/* SECTION 1: FACULTY INCHARGE (DEAN/ADMIN) */}
              <div className="space-y-1 mb-2">
                <div className="px-2.5 py-1 text-[10px] font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider flex items-center gap-1">
                  <Shield className="w-3 h-3" />
                  <span>Faculty Incharge (Institutional Admin)</span>
                </div>
                {allUsers.filter(u => u.role === 'Faculty').map(u => (
                  <button
                    key={u.id}
                    onClick={() => {
                      switchRole('Faculty', u.id);
                      setIsUserSwitcherOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs transition-colors ${
                      currentUser.id === u.id 
                        ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400 font-semibold border border-purple-500/30' 
                        : 'text-black dark:text-white hover:bg-[#FAFAFA] dark:hover:bg-[#1C1C1C]'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-purple-600 text-white flex items-center justify-center text-[10px] font-bold">
                        FAC
                      </div>
                      <div className="text-left">
                        <div className="font-semibold text-black dark:text-white">{u.name}</div>
                        <div className="text-[10px] text-[#8E8E8E]">{u.designation || 'Faculty Incharge'} • {u.officeRoom || 'ME-302'}</div>
                      </div>
                    </div>
                    <span className="px-1.5 py-0.5 rounded bg-purple-600 text-white text-[10px] font-bold">Faculty</span>
                  </button>
                ))}
              </div>

              {/* SECTION 2: CLASS REPRESENTATIVE */}
              <div className="space-y-1 mb-2 pt-1 border-t border-[#DBDBDB] dark:border-[#262626]">
                <div className="px-2.5 py-1 text-[10px] font-bold text-[#0095F6] uppercase tracking-wider">
                  Class Representative (CR)
                </div>
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
                        <div className="text-[10px] text-[#8E8E8E]">{u.rollNo} • {u.email}</div>
                      </div>
                    </div>
                    <span className="px-1.5 py-0.5 rounded bg-[#0095F6] text-white text-[10px] font-bold">CR</span>
                  </button>
                ))}
              </div>

              {/* SECTION 3: STUDENT COHORT */}
              <div className="pt-1 border-t border-[#DBDBDB] dark:border-[#262626]">
                <div className="px-2.5 py-1 text-[10px] font-bold text-[#8E8E8E] uppercase tracking-wider flex justify-between items-center">
                  <span>Student Cohort ({allUsers.filter(u => u.role === 'Student').length})</span>
                  <span className="text-[9px] text-[#0095F6]">Scroll for all 48</span>
                </div>

                <div className="max-h-44 overflow-y-auto space-y-1 pr-1">
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
                          <span className="text-[10px] text-[#8E8E8E] block font-mono">{u.rollNo} • {u.device || 'Mobile'}</span>
                        </div>
                      </div>
                      <span className="text-[10px] text-[#8E8E8E] shrink-0">{u.holisticPoints || 0} pts</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
