import React, { useState } from 'react';
import { useStudySync } from '../../store';
import { NavTab } from '../../types';
import { 
  Home, 
  CheckSquare, 
  UserCheck, 
  Folder, 
  BarChart2, 
  Calendar, 
  Users, 
  Megaphone, 
  MessageSquare, 
  TrendingUp, 
  Settings, 
  Copy, 
  Check, 
  ChevronDown, 
  QrCode, 
  Keyboard, 
  Shield,
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
  const [showCode, setShowCode] = useState(false);

  // Safe fallback values
  const userName = currentUser?.name || 'User';
  const className = currentClass?.name || 'Cohort';
  const classCode = currentClass?.code || 'CODE';

  // Deterministic avatar color from name
  const avatarColors = [
    'bg-[#0095F6]', 'bg-purple-500', 'bg-emerald-500', 'bg-amber-500', 'bg-rose-500', 'bg-indigo-500'
  ];
  const charCode = userName.length > 0 ? userName.charCodeAt(0) : 0;
  const avatarColor = avatarColors[charCode % avatarColors.length];

  const handleCopyCode = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(classCode);
    setCopied(true);
    showToast(`Class code ${classCode} copied!`, 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  const activeAssignmentsCount = (assignments || []).filter(a => a?.status === 'active').length;
  const activePollsCount = (polls || []).filter(p => !p?.isClosed).length;
  const activeBroadcastsCount = (broadcasts || []).length;

  const navItems: { 
    id: NavTab; 
    label: string; 
    icon: React.FC<{ className?: string }>; 
    crOnly?: boolean;
    badgeCount?: number;
  }[] = [
    { id: 'dashboard', label: 'Home', icon: Home },
    { id: 'assignments', label: 'Tasks', icon: CheckSquare, badgeCount: activeAssignmentsCount },
    { id: 'attendance', label: 'Attendance', icon: UserCheck },
    { id: 'subjects', label: 'Subjects & CRs', icon: GraduationCap },
    { id: 'resources', label: 'Resources', icon: Folder },
    { id: 'polls', label: 'Polls & Consensus', icon: BarChart2, badgeCount: activePollsCount },
    { id: 'calendar', label: 'Calendar', icon: Calendar },
    { id: 'members', label: 'Roster', icon: Users, crOnly: true },
    { id: 'broadcasts', label: 'Broadcasts', icon: Megaphone, badgeCount: activeBroadcastsCount > 0 ? activeBroadcastsCount : undefined },
    { id: 'messages', label: 'Direct Messages', icon: MessageSquare },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp, crOnly: true },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const userRole = currentUser?.role || 'CR';
  const visibleNav = navItems.filter(item => !item.crOnly || userRole === 'CR');

  return (
    <aside className="hidden md:flex w-[68px] lg:w-[236px] bg-white dark:bg-black text-[#262626] dark:text-[#F5F5F5] flex-col justify-between h-full border-r border-[#DBDBDB] dark:border-[#262626] shrink-0 transition-all duration-150 select-none">
      {/* Top: Class Switcher Card */}
      <div className="p-3 lg:p-4 border-b border-[#DBDBDB] dark:border-[#262626] relative">
        {/* Desktop View */}
        <div className="hidden lg:block space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-semibold text-[#737373] dark:text-[#A8A8A8] uppercase tracking-wider">
              Class Cohort
            </span>
            <div className="flex items-center gap-1.5 text-[11px] text-[#737373] dark:text-[#A8A8A8]">
              <span className={`w-2 h-2 rounded-full ${isOffline ? 'bg-amber-500' : 'bg-emerald-500'}`} />
              <span className="font-medium">{isOffline ? 'Offline' : 'Live'}</span>
            </div>
          </div>

          <button
            onClick={() => setIsClassDropdownOpen(prev => !prev)}
            className="w-full flex items-center justify-between p-2.5 rounded-xl bg-[#F5F5F5] dark:bg-[#121212] hover:bg-[#EFEFEF] dark:hover:bg-[#1E1E1E] text-left transition-all group border border-[#DBDBDB] dark:border-[#262626]"
          >
            <div className="min-w-0 pr-2">
              <h2 className="text-xs font-bold text-black dark:text-white tracking-tight truncate flex items-center gap-1.5">
                <GraduationCap className="w-3.5 h-3.5 text-[#0095F6] shrink-0" />
                <span>{className}</span>
              </h2>
              <button
                onClick={e => { e.stopPropagation(); setShowCode(p => !p); }}
                className="text-[10px] font-mono text-[#737373] dark:text-[#A8A8A8] mt-0.5 hover:text-[#0095F6] transition-colors tracking-widest"
                title={showCode ? 'Click to hide' : 'Click to reveal class code'}
              >
                Code: {showCode ? classCode : '••••••'}
              </button>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-[#737373] dark:text-[#A8A8A8] group-hover:text-black dark:group-hover:text-white transition-colors shrink-0" />
          </button>

          {/* Class Dropdown */}
          {isClassDropdownOpen && (
            <div className="absolute left-3 right-3 top-[88px] bg-white dark:bg-[#121212] border border-[#DBDBDB] dark:border-[#262626] rounded-xl shadow-xl z-50 p-1.5 space-y-1 animate-in fade-in zoom-in-95 duration-100">
              <div className="px-2 py-1 text-[9px] font-semibold text-[#737373] dark:text-[#A8A8A8] uppercase">
                Switch Class
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
                      ? 'bg-[#EFEFEF] dark:bg-[#262626] text-black dark:text-white font-bold'
                      : 'text-[#262626] dark:text-[#E0E0E0] hover:bg-[#F7F7F7] dark:hover:bg-[#1E1E1E]'
                  }`}
                >
                  <span className="truncate">{c.name}</span>
                  <span className="font-mono text-[10px] text-[#737373]">{c.code}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Mini view (Tablet) */}
        <div className="flex lg:hidden flex-col items-center gap-1.5">
          <div className="w-9 h-9 rounded-xl bg-[#EFEFEF] dark:bg-[#1E1E1E] flex items-center justify-center text-[#0095F6] font-bold text-xs">
            {className.slice(0, 2)}
          </div>
          <button
            onClick={handleCopyCode}
            title={`Code: ${classCode}`}
            className="p-1 text-[#737373] hover:text-black dark:hover:text-white transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-[#0095F6]" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Navigation Items */}
      <nav aria-label="Main Navigation" className="flex-1 px-2 py-3 space-y-0.5 overflow-y-auto">
        {visibleNav.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              title={item.label}
              aria-label={item.label}
              aria-current={isActive ? 'page' : undefined}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs lg:text-[13px] font-medium transition-all relative ${
                isActive
                  ? 'text-black dark:text-white bg-[#F5F5F5] dark:bg-[#1A1A1A] font-semibold'
                  : 'text-[#737373] dark:text-[#A8A8A8] hover:text-black dark:hover:text-white hover:bg-[#F7F7F7] dark:hover:bg-[#0F0F0F]'
              } justify-center lg:justify-start`}
            >
              {/* Left active indicator bar */}
              {isActive && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-full bg-black dark:bg-white" />
              )}
              <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'stroke-[2.2]' : 'stroke-[1.7]'}`} />
              <span className="hidden lg:inline tracking-tight">{item.label}</span>
              {/* Badge */}
              {item.badgeCount !== undefined && item.badgeCount > 0 && (
                <span className="hidden lg:inline-flex ml-auto px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-[#0095F6] text-white min-w-4 justify-center">
                  {item.badgeCount}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Quick Utilities Row */}
      <div className="px-3 py-2.5 border-t border-[#DBDBDB] dark:border-[#262626] hidden lg:flex items-center justify-between text-[#737373] dark:text-[#A8A8A8]">
        <button
          onClick={() => setIsQRCodeOpen(true)}
          className="flex items-center gap-1.5 text-[11px] hover:text-black dark:hover:text-white transition-colors"
          title="Display class join QR code"
        >
          <QrCode className="w-3.5 h-3.5" />
          <span>QR Join</span>
        </button>

        <button
          onClick={() => setIsShortcutsOpen(true)}
          className="flex items-center gap-1 text-[11px] hover:text-black dark:hover:text-white transition-colors"
          title="Keyboard shortcuts (? key)"
        >
          <Keyboard className="w-3.5 h-3.5" />
          <span>Shortcuts</span>
        </button>

        <button
          onClick={() => setActiveTrustPage('security')}
          className="text-[11px] hover:text-black dark:hover:text-white transition-colors p-1"
          title="Security & Governance"
        >
          <Shield className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Bottom Profile & Role Badge */}
      <div className="p-3 border-t border-[#DBDBDB] dark:border-[#262626]">
        {/* Desktop View */}
        <div className="hidden lg:flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className={`w-8 h-8 rounded-full ${avatarColor} text-white flex items-center justify-center font-bold text-xs shrink-0`}>
              {userName.charAt(0)}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-black dark:text-white truncate leading-tight">
                {userName}
              </p>
              <p className="text-[10px] text-[#737373] dark:text-[#A8A8A8] truncate font-mono">
                {currentUser?.rollNo || currentUser?.email || 'Student'}
              </p>
            </div>
          </div>
          <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold tracking-wide shrink-0 ${
            (currentUser?.role || 'Student') === 'CR'
              ? 'bg-[#0095F6]/15 text-[#0095F6]'
              : 'bg-[#EFEFEF] dark:bg-[#262626] text-[#737373] dark:text-[#A8A8A8]'
          }`}>
            {currentUser?.role || 'Student'}
          </span>
        </div>

        {/* Tablet Mini View */}
        <div className="flex lg:hidden flex-col items-center gap-1">
          <div className={`w-7 h-7 rounded-full ${avatarColor} text-white flex items-center justify-center font-bold text-xs`}>
            {userName.charAt(0)}
          </div>
          <span className="text-[9px] font-bold text-[#737373]">{currentUser?.role || 'Student'}</span>
        </div>
      </div>
    </aside>
  );
};
