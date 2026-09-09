import React, { useState } from 'react';
import { useStudySync } from '../../store';
import { NavTab } from '../../types';
import { 
  LayoutDashboard, 
  FileText, 
  CalendarDays, 
  Users, 
  Megaphone, 
  MessageSquare, 
  BarChart3, 
  Settings, 
  Copy, 
  Check 
} from 'lucide-react';

export const LeftPanel: React.FC = () => {
  const { 
    currentUser, 
    currentClass, 
    activeTab, 
    setActiveTab, 
    showToast,
    isOffline 
  } = useStudySync();

  const [copied, setCopied] = useState(false);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(currentClass.code);
    setCopied(true);
    showToast(`Class code ${currentClass.code} copied to clipboard!`, 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  const navItems: { id: NavTab; label: string; icon: React.FC<{ className?: string }>; crOnly?: boolean }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'assignments', label: 'Assignments', icon: FileText },
    { id: 'calendar', label: 'Calendar', icon: CalendarDays },
    { id: 'members', label: 'Members', icon: Users, crOnly: true },
    { id: 'broadcasts', label: 'Broadcasts', icon: Megaphone },
    { id: 'messages', label: 'Messages', icon: MessageSquare },
    { id: 'analytics', label: 'Analytics', icon: BarChart3, crOnly: true },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const visibleNav = navItems.filter(item => !item.crOnly || currentUser.role === 'CR');

  return (
    <aside className="w-[240px] md:w-[72px] lg:w-[240px] bg-[#0F2044] dark:bg-[#050811] text-white flex flex-col justify-between h-full border-r border-[#193166] dark:border-[#141C2E] shrink-0 transition-all duration-150 select-none">
      {/* Top: Class Card */}
      <div className="p-4 border-b border-[#193166] dark:border-[#141C2E]">
        {/* Full view (Desktop) */}
        <div className="hidden lg:block space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider">
              Enrolled Class
            </span>
            <div className="flex items-center gap-1.5 text-[11px] text-[#00B4A6] dark:text-[#00D2C4]">
              <span className={`w-2 h-2 rounded-full ${isOffline ? 'bg-[#F59E0B]' : 'bg-[#00B4A6] dark:bg-[#00D2C4] animate-live-pulse'}`} />
              <span className="font-semibold">{isOffline ? 'Offline' : 'Live'}</span>
            </div>
          </div>

          <h2 className="text-base font-extrabold text-white tracking-tight truncate">
            {currentClass.name}
          </h2>

          <div className="flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-[#193166]/80 dark:bg-[#0B132B] border border-[#25427C] dark:border-[#1E293B]">
            <div className="flex flex-col">
              <span className="text-[9px] text-[#94A3B8] font-medium leading-tight">Class Code</span>
              <span className="font-mono text-xs font-bold text-[#00B4A6] dark:text-[#00D2C4] tracking-wider leading-tight">
                {currentClass.code}
              </span>
            </div>
            <button
              onClick={handleCopyCode}
              title="Copy class code"
              className="p-1 rounded hover:bg-[#25427C] dark:hover:bg-[#1E293B] text-[#94A3B8] hover:text-white transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-[#00B4A6] dark:text-[#00D2C4]" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Mini view (Tablet) */}
        <div className="hidden md:flex lg:hidden flex-col items-center gap-1.5">
          <div className="w-9 h-9 rounded-lg bg-[#193166] dark:bg-[#0B132B] border border-[#25427C] dark:border-[#1E293B] flex items-center justify-center text-[#00B4A6] dark:text-[#00D2C4] font-extrabold text-xs">
            {currentClass.name.substring(0, 2)}
          </div>
          <button
            onClick={handleCopyCode}
            title={`Code: ${currentClass.code}`}
            className="p-1 text-[#94A3B8] hover:text-[#00B4A6] dark:hover:text-[#00D2C4] transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-[#00B4A6] dark:text-[#00D2C4]" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {visibleNav.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              title={item.label}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs md:text-sm font-semibold transition-all ${
                isActive
                  ? 'bg-[#00B4A6] dark:bg-[#00D2C4] text-white dark:text-[#050811] shadow-md shadow-[#00B4A6]/20'
                  : 'text-[#94A3B8] hover:text-white hover:bg-[#193166]/60 dark:hover:bg-[#141C2E]'
              } md:justify-center lg:justify-start`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span className="hidden lg:inline tracking-tight">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Bottom Profile & Role Badge */}
      <div className="p-3 lg:p-4 border-t border-[#193166] dark:border-[#141C2E] bg-[#09132B] dark:bg-[#03060C]">
        {/* Desktop View */}
        <div className="hidden lg:flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-full bg-[#193166] dark:bg-[#141C2E] text-[#00B4A6] dark:text-[#00D2C4] flex items-center justify-center font-bold text-xs border border-[#25427C] dark:border-[#1E293B] shrink-0 shadow-xs">
              {currentUser.name.charAt(0)}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-white truncate leading-tight">
                {currentUser.name}
              </p>
              <p className="text-[10px] text-[#94A3B8] truncate font-mono">
                {currentUser.rollNo || currentUser.email}
              </p>
            </div>
          </div>

          <span
            className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold tracking-wide shrink-0 ${
              currentUser.role === 'CR'
                ? 'bg-[#00B4A6] dark:bg-[#00D2C4] text-white dark:text-[#09132B]'
                : 'bg-[#193166] dark:bg-[#15203B] text-[#94A3B8] border border-[#25427C] dark:border-[#1E293B]'
            }`}
          >
            {currentUser.role}
          </span>
        </div>

        {/* Tablet Mini View */}
        <div className="hidden md:flex lg:hidden flex-col items-center gap-1">
          <div className="w-8 h-8 rounded-full bg-[#193166] dark:bg-[#141C2E] text-[#00B4A6] dark:text-[#00D2C4] flex items-center justify-center font-bold text-xs border border-[#25427C] dark:border-[#1E293B]">
            {currentUser.name.charAt(0)}
          </div>
          <span className="text-[9px] font-extrabold text-[#00B4A6] dark:text-[#00D2C4]">
            {currentUser.role}
          </span>
        </div>
      </div>
    </aside>
  );
};
