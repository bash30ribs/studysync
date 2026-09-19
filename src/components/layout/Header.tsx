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
  Sparkles,
  Search,
  BookOpen,
  Headphones,
  Trophy,
  HelpCircle
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
    setActiveTab,
    setSelectedAssignmentId,
    setIsCommandPaletteOpen
  } = useStudySync();

  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isUserSwitcherOpen, setIsUserSwitcherOpen] = useState(false);
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
        return <FileText className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />;
      case 'reminder':
        return <Clock className="w-3.5 h-3.5 text-amber-500" />;
      case 'broadcast':
        return <Megaphone className="w-3.5 h-3.5 text-indigo-500" />;
      case 'submission':
        return <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />;
      default:
        return <ShieldAlert className="w-3.5 h-3.5 text-slate-400" />;
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
    <header className="sticky top-0 z-30 bg-white/85 dark:bg-[#090E1A]/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 px-4 lg:px-6 py-2.5 flex items-center justify-between shadow-xs transition-colors duration-150">
      {/* Left: Class identity & Network sync */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center text-white font-extrabold text-xs tracking-tight shadow-sm shadow-teal-500/20">
            <BookOpen className="w-4 h-4" />
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-slate-900 dark:text-white tracking-tight text-sm leading-none">
              StudySync
            </span>
            <span className="text-[10px] text-teal-600 dark:text-teal-400 font-semibold tracking-wider uppercase mt-0.5">
              Class Hub
            </span>
          </div>
        </div>

        <div className="h-5 w-px bg-slate-200 dark:bg-slate-800 hidden sm:block ml-1" />

        {/* Current Class Badge */}
        <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-slate-100/90 dark:bg-slate-800/70 text-xs border border-slate-200 dark:border-slate-700/60 shadow-2xs">
          <span className="text-slate-500 dark:text-slate-400 font-medium">Class:</span>
          <span className="font-bold text-slate-900 dark:text-white">{currentClass.name}</span>
          <span className="font-mono text-[11px] font-bold text-teal-700 dark:text-teal-300 bg-white dark:bg-slate-900 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700">
            {currentClass.code}
          </span>
        </div>

        {/* Live Network Sync Pill */}
        <button
          onClick={toggleOffline}
          title={isOffline ? "Simulated offline mode (Click to go online)" : "Live connected (Click to simulate offline)"}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
            isOffline 
              ? 'bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-300 dark:border-amber-500/30 hover:bg-amber-100/80' 
              : 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-500/25 hover:bg-emerald-100/80'
          }`}
        >
          {isOffline ? (
            <>
              <WifiOff className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              <span className="hidden md:inline">Offline Mode</span>
            </>
          ) : (
            <>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-live-pulse" />
              <span className="hidden md:inline">Live Sync</span>
            </>
          )}
        </button>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2">
        {/* Command Palette Trigger */}
        <button
          onClick={() => setIsCommandPaletteOpen(true)}
          className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-100/70 dark:bg-slate-900 text-xs text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:border-slate-300 dark:hover:border-slate-700 transition"
        >
          <Search className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
          <span className="font-medium">Search or jump...</span>
          <kbd className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-semibold text-slate-500 dark:text-slate-400">
            ⌘K
          </kbd>
        </button>

        {/* Soundscapes Ambient Focus Button */}
        {onOpenSoundscapes && (
          <button
            onClick={onOpenSoundscapes}
            title="Study Soundscapes (Alt+S)"
            className="w-8 h-8 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:text-teal-600 dark:hover:text-teal-400 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center justify-center transition"
          >
            <Headphones className="w-4 h-4" />
          </button>
        )}

        {/* Milestones & Badges Button */}
        {onOpenAchievements && (
          <button
            onClick={onOpenAchievements}
            title="Quests & Achievements"
            className="w-8 h-8 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-amber-500 hover:bg-amber-50 dark:hover:bg-slate-800 flex items-center justify-center transition"
          >
            <Trophy className="w-4 h-4" />
          </button>
        )}

        {/* Dark / Light Mode Toggle */}
        <button
          onClick={() => setIsDarkMode(prev => !prev)}
          aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
          title={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
          className="w-8 h-8 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center justify-center transition"
        >
          {isDarkMode ? (
            <Sun className="w-4 h-4 text-amber-400" />
          ) : (
            <Moon className="w-4 h-4 text-slate-700" />
          )}
        </button>

        {/* Keyboard Shortcuts Helper */}
        {onOpenShortcuts && (
          <button
            onClick={onOpenShortcuts}
            title="Keyboard Shortcuts (?)"
            className="hidden sm:flex w-8 h-8 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800 items-center justify-center transition"
          >
            <HelpCircle className="w-4 h-4" />
          </button>
        )}

        {/* Notifications Dropdown */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setIsNotifOpen(prev => !prev)}
            aria-label="Notifications"
            className="relative w-8 h-8 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center justify-center transition"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[16px] h-[16px] px-0.5 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>

          {isNotifOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-[#0E1626] border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
              <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/60">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">Notifications</span>
                  {unreadCount > 0 && (
                    <span className="px-1.5 py-0.5 text-[10px] font-bold bg-teal-50 dark:bg-teal-500/20 text-teal-700 dark:text-teal-300 rounded-full border border-teal-200 dark:border-teal-700/50">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllNotificationsRead}
                    className="text-xs text-teal-600 dark:text-teal-400 hover:underline flex items-center gap-1 font-semibold"
                  >
                    <CheckCheck className="w-3.5 h-3.5" />
                    Mark all read
                  </button>
                )}
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/80">
                {notifications.length === 0 ? (
                  <div className="py-8 text-center text-xs text-slate-500 dark:text-slate-400">
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
                        className={`px-4 py-3 text-left transition-colors cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/60 ${
                          !n.read ? 'bg-teal-50/40 dark:bg-teal-500/5' : ''
                        }`}
                      >
                        <div className="flex items-start gap-2.5">
                          <div className="mt-0.5 p-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs shrink-0">
                            {getNotifIcon(n.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                                {n.title}
                              </p>
                              <span className="text-[10px] text-slate-500 dark:text-slate-400 ml-2 shrink-0 font-mono">
                                {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                            <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5 line-clamp-2 leading-relaxed">
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
            className="flex items-center gap-2 pl-2 pr-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all text-xs shadow-2xs"
          >
            <div className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[11px] shadow-xs shrink-0 text-white ${
              currentUser.role === 'CR'
                ? 'bg-gradient-to-br from-teal-500 to-emerald-600'
                : 'bg-gradient-to-br from-indigo-500 to-purple-600'
            }`}>
              {currentUser.name.charAt(0)}
            </div>
            <div className="text-left hidden sm:block">
              <span className="font-bold text-slate-900 dark:text-white block leading-tight">
                {currentUser.name.split(' ')[0]}
              </span>
              <span className={`text-[10px] font-bold leading-none block ${
                currentUser.role === 'CR' ? 'text-teal-600 dark:text-teal-400' : 'text-slate-500 dark:text-slate-400'
              }`}>
                {currentUser.role} Mode
              </span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
          </button>

          {isUserSwitcherOpen && (
            <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-[#0E1626] border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xl z-50 p-2 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
              <div className="px-2.5 py-1.5 mb-1 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
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
                        ? 'bg-teal-50 dark:bg-teal-500/15 text-teal-800 dark:text-teal-300 font-bold border border-teal-200 dark:border-teal-700/50' 
                        : 'text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-800/80'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-teal-500 to-emerald-600 text-white flex items-center justify-center text-[10px] font-extrabold shadow-xs">
                        CR
                      </div>
                      <div className="text-left">
                        <div className="font-semibold text-slate-900 dark:text-white">{u.name}</div>
                        <div className="text-[10px] text-slate-500 dark:text-slate-400">{u.email}</div>
                      </div>
                    </div>
                    <span className="px-1.5 py-0.5 rounded bg-teal-600 text-white text-[10px] font-extrabold shadow-2xs">CR</span>
                  </button>
                ))}
              </div>

              <div className="h-px bg-slate-200 dark:bg-slate-800 my-2" />

              <div className="px-2.5 py-1 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
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
                        ? 'bg-indigo-50 dark:bg-indigo-500/15 text-indigo-800 dark:text-indigo-300 font-bold border border-indigo-200 dark:border-indigo-700/50' 
                        : 'text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-800/80'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <div className="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 flex items-center justify-center text-[10px] font-semibold">
                        {u.name.charAt(0)}
                      </div>
                      <div className="text-left truncate">
                        <span className="font-medium truncate block text-slate-900 dark:text-white">{u.name}</span>
                        <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-mono">{u.rollNo}</span>
                      </div>
                    </div>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500">Student</span>
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
