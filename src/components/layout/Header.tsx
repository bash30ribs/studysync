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
  Check,
  Search
} from 'lucide-react';

interface HeaderProps {
  onOpenLanding?: () => void;
  isDarkMode: boolean;
  setIsDarkMode: (val: boolean | ((prev: boolean) => boolean)) => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenLanding, isDarkMode, setIsDarkMode }) => {
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
        return <FileText className="w-3.5 h-3.5 text-[#00B4A6] dark:text-[#00D2C4]" />;
      case 'reminder':
        return <Clock className="w-3.5 h-3.5 text-[#F59E0B]" />;
      case 'broadcast':
        return <Megaphone className="w-3.5 h-3.5 text-[#00B4A6] dark:text-[#00D2C4]" />;
      case 'submission':
        return <CheckCircle className="w-3.5 h-3.5 text-[#00B4A6] dark:text-[#00D2C4]" />;
      default:
        return <ShieldAlert className="w-3.5 h-3.5 text-[#64748B]" />;
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
    <header className="sticky top-0 z-30 bg-white/90 dark:bg-[#0B132B]/95 backdrop-blur-md border-b border-[#E2E8F0] dark:border-[#1E293B] px-4 lg:px-6 py-2.5 flex items-center justify-between shadow-xs transition-colors duration-150">
      {/* Left: Class identity & Network sync */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#0F2044] dark:bg-[#00D2C4] flex items-center justify-center text-white dark:text-[#09132B] font-extrabold text-xs tracking-tight shadow-xs">
            SS
          </div>
          <span className="font-bold text-[#0F2044] dark:text-white tracking-tight text-sm sm:text-base hidden sm:inline">
            StudySync
          </span>
        </div>

        <div className="h-4 w-px bg-[#E2E8F0] dark:bg-[#1E293B] hidden sm:block" />

        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#F1F5F9] dark:bg-[#15203B] text-xs font-medium border border-[#E2E8F0] dark:border-[#1E293B]">
          <span className="text-[#64748B] dark:text-[#94A3B8]">Class:</span>
          <span className="font-bold text-[#0F2044] dark:text-white">{currentClass.name}</span>
          <span className="font-mono text-[11px] font-bold text-[#00B4A6] dark:text-[#00D2C4] bg-white dark:bg-[#080D1A] px-1.5 py-0.5 rounded border border-[#E2E8F0] dark:border-[#1E293B] ml-1">
            {currentClass.code}
          </span>
        </div>

        {/* Network sync indicator */}
        <button
          onClick={toggleOffline}
          title={isOffline ? "Simulated offline mode (Click to go online)" : "Live connected (Click to simulate offline)"}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
            isOffline 
              ? 'bg-[#FEF6EC] dark:bg-[#F59E0B]/15 text-[#D97706] dark:text-[#FBBF24] border border-[#F59E0B]/30 hover:bg-[#F59E0B]/20' 
              : 'bg-[#E6F8F6] dark:bg-[#00D2C4]/10 text-[#00897B] dark:text-[#00D2C4] border border-[#00B4A6]/25 hover:bg-[#00B4A6]/15'
          }`}
        >
          {isOffline ? (
            <>
              <WifiOff className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Offline Mode</span>
            </>
          ) : (
            <>
              <span className="w-2 h-2 rounded-full bg-[#00B4A6] dark:bg-[#00D2C4] animate-live-pulse" />
              <span className="hidden md:inline font-semibold">Live Sync</span>
            </>
          )}
        </button>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 sm:gap-2.5">
        {/* Command Palette Trigger */}
        <button
          onClick={() => setIsCommandPaletteOpen(true)}
          className="hidden md:flex items-center gap-2 px-2.5 py-1.5 rounded-lg border border-[#E2E8F0] dark:border-[#1E293B] bg-[#F8FAFC] dark:bg-[#15203B] text-xs text-[#64748B] dark:text-[#94A3B8] hover:text-[#0F2044] dark:hover:text-white transition-all shadow-xs"
        >
          <Search className="w-3.5 h-3.5 text-[#00B4A6] dark:text-[#00D2C4]" />
          <span>Search & Actions</span>
          <kbd className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-white dark:bg-[#080D1A] border border-[#CBD5E1] dark:border-[#334155] font-bold">
            ⌘K
          </kbd>
        </button>

        {/* Landing Page Button */}
        {onOpenLanding && (
          <button
            onClick={onOpenLanding}
            className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-[#E2E8F0] dark:border-[#1E293B] text-xs font-medium text-[#475569] dark:text-[#94A3B8] hover:text-[#0F2044] dark:hover:text-white hover:bg-[#F1F5F9] dark:hover:bg-[#15203B] transition-all"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#00B4A6] dark:text-[#00D2C4]" />
            <span>Marketing Page</span>
          </button>
        )}

        {/* Dark / Light Mode Toggle */}
        <button
          onClick={() => setIsDarkMode(prev => !prev)}
          aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
          title={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
          className="p-1.5 rounded-lg border border-[#E2E8F0] dark:border-[#1E293B] bg-white dark:bg-[#15203B] text-[#475569] hover:text-[#0F2044] dark:text-[#94A3B8] dark:hover:text-white hover:bg-[#F1F5F9] transition-all shadow-xs"
        >
          {isDarkMode ? (
            <Sun className="w-4 h-4 text-[#FBBF24]" />
          ) : (
            <Moon className="w-4 h-4 text-[#0F2044]" />
          )}
        </button>

        {/* Notifications Dropdown */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setIsNotifOpen(prev => !prev)}
            aria-label="Notifications"
            className="relative p-1.5 rounded-lg border border-[#E2E8F0] dark:border-[#1E293B] bg-white dark:bg-[#15203B] text-[#475569] hover:text-[#0F2044] dark:text-[#94A3B8] dark:hover:text-white hover:bg-[#F1F5F9] transition-all shadow-xs"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[17px] h-[17px] px-1 rounded-full bg-[#E63946] text-white text-[10px] font-bold flex items-center justify-center shadow-xs">
                {unreadCount}
              </span>
            )}
          </button>

          {isNotifOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-[#0F172A] border border-[#E2E8F0] dark:border-[#1E293B] rounded-xl shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
              <div className="flex items-center justify-between px-4 py-3 border-b border-[#E2E8F0] dark:border-[#1E293B] bg-[#F8FAFC] dark:bg-[#15203B]/60">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-xs sm:text-sm text-[#0F2044] dark:text-white">Notifications</span>
                  {unreadCount > 0 && (
                    <span className="px-1.5 py-0.5 text-[10px] font-bold bg-[#00B4A6]/15 dark:bg-[#00D2C4]/20 text-[#00897B] dark:text-[#00D2C4] rounded">
                      {unreadCount} unread
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllNotificationsRead}
                    className="text-xs text-[#00B4A6] dark:text-[#00D2C4] hover:underline flex items-center gap-1 font-semibold"
                  >
                    <CheckCheck className="w-3.5 h-3.5" />
                    Mark all read
                  </button>
                )}
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-[#E2E8F0] dark:divide-[#1E293B]">
                {notifications.length === 0 ? (
                  <div className="py-8 text-center text-xs text-[#64748B] dark:text-[#94A3B8]">
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
                        className={`px-4 py-3 text-left transition-colors cursor-pointer hover:bg-[#F8FAFC] dark:hover:bg-[#15203B]/80 ${
                          !n.read ? 'bg-[#E6F8F6]/50 dark:bg-[#00D2C4]/5' : ''
                        }`}
                      >
                        <div className="flex items-start gap-2.5">
                          <div className="mt-0.5 p-1 rounded-md bg-white dark:bg-[#080D1A] border border-[#E2E8F0] dark:border-[#1E293B] shadow-xs shrink-0">
                            {getNotifIcon(n.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <p className="text-xs font-bold text-[#0F2044] dark:text-white truncate">
                                {n.title}
                              </p>
                              <span className="text-[10px] text-[#64748B] dark:text-[#94A3B8] ml-2 shrink-0 font-mono">
                                {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                            <p className="text-xs text-[#475569] dark:text-[#94A3B8] mt-0.5 line-clamp-2">
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
            className="flex items-center gap-2 pl-2 pr-2.5 py-1 rounded-lg border border-[#E2E7F0] dark:border-[#1E293B] bg-white dark:bg-[#15203B] hover:bg-[#F1F5F9] dark:hover:bg-[#1E293B] transition-all text-xs shadow-xs"
          >
            <div className="w-6 h-6 rounded-full bg-[#0F2044] dark:bg-[#00D2C4] text-white dark:text-[#09132B] flex items-center justify-center font-bold text-[11px] shadow-xs shrink-0">
              {currentUser.name.charAt(0)}
            </div>
            <div className="text-left hidden sm:block">
              <span className="font-bold text-[#0F2044] dark:text-white block leading-tight">
                {currentUser.name.split(' ')[0]}
              </span>
              <span className={`text-[10px] font-semibold leading-none block ${currentUser.role === 'CR' ? 'text-[#00B4A6] dark:text-[#00D2C4]' : 'text-[#64748B] dark:text-[#94A3B8]'}`}>
                {currentUser.role} View
              </span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-[#64748B] dark:text-[#94A3B8]" />
          </button>

          {isUserSwitcherOpen && (
            <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-[#0F172A] border border-[#E2E8F0] dark:border-[#1E293B] rounded-xl shadow-2xl z-50 p-2 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
              <div className="px-2.5 py-1.5 mb-1 text-[10px] font-bold text-[#64748B] dark:text-[#94A3B8] uppercase tracking-wider">
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
                        ? 'bg-[#E6F8F6] dark:bg-[#00D2C4]/15 text-[#00897B] dark:text-[#00D2C4] font-bold' 
                        : 'text-[#0F2044] dark:text-white hover:bg-[#F8FAFC] dark:hover:bg-[#15203B]'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full bg-[#0F2044] dark:bg-[#00D2C4] text-white dark:text-[#09132B] flex items-center justify-center text-[10px] font-extrabold">
                        CR
                      </div>
                      <div className="text-left">
                        <div className="font-semibold">{u.name}</div>
                        <div className="text-[10px] text-[#64748B] dark:text-[#94A3B8]">{u.email}</div>
                      </div>
                    </div>
                    <span className="px-1.5 py-0.5 rounded bg-[#00B4A6] dark:bg-[#00D2C4] text-white dark:text-[#09132B] text-[10px] font-extrabold">CR</span>
                  </button>
                ))}
              </div>

              <div className="h-px bg-[#E2E7F0] dark:bg-[#1E293B] my-2" />

              <div className="px-2.5 py-1 text-[10px] font-bold text-[#64748B] dark:text-[#94A3B8] uppercase tracking-wider">
                Student Personas
              </div>

              <div className="max-h-48 overflow-y-auto space-y-1">
                {allUsers.filter(u => u.role === 'Student').map(u => (
                  <button
                    key={u.id}
                    onClick={() => {
                      switchRole('Student', u.id);
                      setIsUserSwitcherOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors ${
                      currentUser.id === u.id 
                        ? 'bg-[#E6F8F6] dark:bg-[#00D2C4]/15 text-[#00897B] dark:text-[#00D2C4] font-bold' 
                        : 'text-[#0F2044] dark:text-white hover:bg-[#F8FAFC] dark:hover:bg-[#15203B]'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <div className="w-5 h-5 rounded-full bg-[#64748B] dark:bg-[#334155] text-white flex items-center justify-center text-[10px] font-medium">
                        {u.name.charAt(0)}
                      </div>
                      <div className="text-left truncate">
                        <span className="font-medium truncate block">{u.name}</span>
                        <span className="text-[10px] text-[#64748B] dark:text-[#94A3B8] block font-mono">{u.rollNo}</span>
                      </div>
                    </div>
                    <span className="text-[10px] text-[#64748B] dark:text-[#94A3B8]">Student</span>
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
