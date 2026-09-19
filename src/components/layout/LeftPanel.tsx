import React, { useState } from 'react';
import { useStudySync } from '../../store';
import { NavTab } from '../../types';
import { 
  LayoutDashboard, 
  FileText, 
  UserCheck, 
  FolderOpen, 
  BarChart2, 
  CalendarDays, 
  Users, 
  Megaphone, 
  MessageSquare, 
  BarChart3, 
  Settings, 
  Copy, 
  Check, 
  ChevronDown, 
  QrCode, 
  Keyboard, 
  ShieldCheck,
  GraduationCap
} from 'lucide-react';

export const LeftPanel: React.FC = () => {
  const { 
    currentUser, 
    currentClass, 
    classes, 
    switchClass, 
    activeTab, 
    setActiveTab, 
    showToast,
    isOffline,
    assignments,
    broadcasts,
    polls,
    setIsQRCodeOpen,
    setIsShortcutsOpen,
    setActiveTrustPage 
  } = useStudySync();

  const [copied, setCopied] = useState(false);
  const [isClassDropdownOpen, setIsClassDropdownOpen] = useState(false);

  const handleCopyCode = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(currentClass.code);
    setCopied(true);
    showToast(`Class code ${currentClass.code} copied!`, 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  const activeAssignmentsCount = assignments.filter(a => a.status === 'active').length;
  const activePollsCount = polls.filter(p => !p.isClosed).length;

  const navItems: { 
    id: NavTab; 
    label: string; 
    icon: React.FC<{ className?: string }>; 
    crOnly?: boolean;
    badgeCount?: number;
  }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'assignments', label: 'Assignments', icon: FileText, badgeCount: activeAssignmentsCount },
    { id: 'attendance', label: 'Attendance', icon: UserCheck },
    { id: 'resources', label: 'Resource Library', icon: FolderOpen },
    { id: 'polls', label: 'Polls & Decisions', icon: BarChart2, badgeCount: activePollsCount },
    { id: 'calendar', label: 'Calendar', icon: CalendarDays },
    { id: 'members', label: 'Members', icon: Users, crOnly: true },
    { id: 'broadcasts', label: 'Broadcasts', icon: Megaphone, badgeCount: broadcasts.length > 0 ? broadcasts.length : undefined },
    { id: 'messages', label: 'Messages', icon: MessageSquare },
    { id: 'analytics', label: 'Analytics', icon: BarChart3, crOnly: true },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const visibleNav = navItems.filter(item => !item.crOnly || currentUser.role === 'CR');

  return (
    <aside className="w-[240px] md:w-[72px] lg:w-[240px] bg-slate-50/80 dark:bg-[#0B101B] text-slate-700 dark:text-slate-300 flex flex-col justify-between h-full border-r border-slate-200/80 dark:border-slate-800/80 shrink-0 transition-all duration-150 select-none">
      {/* Top: Class Switcher Card */}
      <div className="p-3 lg:p-4 border-b border-slate-200/80 dark:border-slate-800/80 relative">
        {/* Desktop View */}
        <div className="hidden lg:block space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Enrolled Class
            </span>
            <div className="flex items-center gap-1.5 text-[11px] text-teal-700 dark:text-teal-400">
              <span className={`w-1.5 h-1.5 rounded-full ${isOffline ? 'bg-amber-500' : 'bg-teal-500'}`} />
              <span className="font-medium">{isOffline ? 'Offline' : 'Connected'}</span>
            </div>
          </div>

          <button
            onClick={() => setIsClassDropdownOpen(prev => !prev)}
            className="w-full flex items-center justify-between p-2.5 rounded-xl bg-white dark:bg-slate-900/80 hover:bg-slate-100/70 dark:hover:bg-slate-800/60 border border-slate-200/90 dark:border-slate-800 text-left transition-all group shadow-2xs"
          >
            <div className="min-w-0 pr-2">
              <h2 className="text-xs font-semibold text-slate-900 dark:text-white tracking-tight truncate flex items-center gap-1.5">
                <GraduationCap className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400 shrink-0" />
                <span>{currentClass.name}</span>
              </h2>
              <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 block mt-0.5">
                Code: {currentClass.code}
              </span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-200 transition-colors shrink-0" />
          </button>

          {/* Class Dropdown */}
          {isClassDropdownOpen && (
            <div className="absolute left-3 right-3 top-20 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-lg z-50 p-1.5 space-y-1 animate-in fade-in zoom-in-95 duration-100">
              <div className="px-2 py-1 text-[9px] font-semibold text-slate-400 uppercase">
                Switch Class Cohort
              </div>
              {classes.map(c => (
                <button
                  key={c.id}
                  onClick={() => {
                    switchClass(c.id);
                    setIsClassDropdownOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors ${
                    c.id === currentClass.id
                      ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                  }`}
                >
                  <span className="truncate">{c.name}</span>
                  <span className="font-mono text-[10px] text-slate-400">{c.code}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Mini view (Tablet) */}
        <div className="hidden md:flex lg:hidden flex-col items-center gap-1.5">
          <div className="w-9 h-9 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center text-teal-600 dark:text-teal-400 font-bold text-xs shadow-xs">
            {currentClass.name.substring(0, 2)}
          </div>
          <button
            onClick={handleCopyCode}
            title={`Code: ${currentClass.code}`}
            className="p-1 text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-teal-600" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 px-2.5 py-3 space-y-1 overflow-y-auto">
        {visibleNav.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              title={item.label}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs lg:text-sm font-medium transition-all ${
                isActive
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-semibold shadow-2xs border border-slate-200/80 dark:border-slate-800/80'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100/60 dark:hover:bg-slate-900/40'
              } md:justify-center lg:justify-between`}
            >
              <div className="flex items-center gap-2.5">
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-teal-600 dark:text-teal-400' : 'text-slate-400'}`} />
                <span className="hidden lg:inline tracking-tight">{item.label}</span>
              </div>

              {/* Badge count indicator */}
              {item.badgeCount !== undefined && item.badgeCount > 0 && (
                <span className={`hidden lg:inline-flex px-1.5 py-0.5 rounded-full text-[10px] font-semibold leading-none ${
                  isActive
                    ? 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                    : 'bg-slate-200/70 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                }`}>
                  {item.badgeCount}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Quick Utilities Row */}
      <div className="px-3 py-2 border-t border-slate-200/80 dark:border-slate-800/80 hidden lg:flex items-center justify-between text-slate-500 dark:text-slate-400">
        <button
          onClick={() => setIsQRCodeOpen(true)}
          className="flex items-center gap-1.5 text-[11px] hover:text-slate-900 dark:hover:text-slate-200 transition-colors"
          title="Display class join QR code"
        >
          <QrCode className="w-3.5 h-3.5 text-slate-400 hover:text-teal-600 dark:hover:text-teal-400" />
          <span>QR Join</span>
        </button>

        <button
          onClick={() => setIsShortcutsOpen(true)}
          className="flex items-center gap-1 text-[11px] hover:text-slate-900 dark:hover:text-slate-200 transition-colors"
          title="Keyboard shortcuts (? key)"
        >
          <Keyboard className="w-3.5 h-3.5" />
          <span>Shortcuts</span>
        </button>

        <button
          onClick={() => setActiveTrustPage('security')}
          className="text-[11px] hover:text-slate-900 dark:hover:text-slate-200 transition-colors p-1"
          title="Security & Governance"
        >
          <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
        </button>
      </div>

      {/* Bottom Profile & Role Badge */}
      <div className="p-3 lg:p-3.5 border-t border-slate-200/80 dark:border-slate-800/80 bg-slate-100/60 dark:bg-slate-950/60">
        {/* Desktop View */}
        <div className="hidden lg:flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-7 h-7 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 flex items-center justify-center font-bold text-xs shrink-0 border border-slate-300/60 dark:border-slate-700/60">
              {currentUser.name.charAt(0)}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-slate-900 dark:text-white truncate leading-tight">
                {currentUser.name}
              </p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate font-mono">
                {currentUser.rollNo || currentUser.email}
              </p>
            </div>
          </div>

          <span
            className="px-2 py-0.5 rounded-full text-[10px] font-semibold tracking-wide shrink-0 bg-slate-200/80 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-300/70 dark:border-slate-700"
          >
            {currentUser.role}
          </span>
        </div>

        {/* Tablet Mini View */}
        <div className="hidden md:flex lg:hidden flex-col items-center gap-1">
          <div className="w-7 h-7 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center font-bold text-xs border border-slate-300/60 dark:border-slate-700">
            {currentUser.name.charAt(0)}
          </div>
          <span className="text-[9px] font-semibold text-slate-500 dark:text-slate-400">
            {currentUser.role}
          </span>
        </div>
      </div>
    </aside>
  );
};
