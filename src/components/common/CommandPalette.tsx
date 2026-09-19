import React, { useState, useEffect, useRef } from 'react';
import { useStudySync, ThemeAccent } from '../../store';
import { NavTab, UserRole } from '../../types';
import { 
  Search, 
  LayoutDashboard, 
  FileText, 
  Calendar, 
  Users, 
  Megaphone, 
  MessageSquare, 
  BarChart3, 
  Settings, 
  Plus, 
  BellRing, 
  Download, 
  Wifi, 
  UserCheck, 
  Sparkles, 
  Palette,
  ArrowRight,
  Command
} from 'lucide-react';

interface CommandItem {
  id: string;
  category: 'Navigation' | 'Actions' | 'Personas' | 'Theme Accent';
  label: string;
  shortcut?: string;
  icon: React.FC<{ className?: string }>;
  perform: () => void;
}

export const CommandPalette: React.FC = () => {
  const {
    isCommandPaletteOpen,
    setIsCommandPaletteOpen,
    setActiveTab,
    setIsNewAssignmentModalOpen,
    setIsRightPanelOpen,
    allUsers,
    switchRole,
    remindPendingStudents,
    assignments,
    exportSubmissionsCSV,
    exportMembersCSV,
    toggleOffline,
    setThemeAccent,
    themeAccent,
    currentUser
  } = useStudySync();

  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isCommandPaletteOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isCommandPaletteOpen]);

  if (!isCommandPaletteOpen) return null;

  const items: CommandItem[] = [
    // Navigation
    {
      id: 'nav-dash',
      category: 'Navigation',
      label: 'Go to Dashboard',
      shortcut: '1',
      icon: LayoutDashboard,
      perform: () => setActiveTab('dashboard')
    },
    {
      id: 'nav-asg',
      category: 'Navigation',
      label: 'Go to Assignments Hub',
      shortcut: '2',
      icon: FileText,
      perform: () => setActiveTab('assignments')
    },
    {
      id: 'nav-attendance',
      category: 'Navigation',
      label: 'Go to Attendance Logger (75% Tracker)',
      shortcut: 'A',
      icon: UserCheck,
      perform: () => setActiveTab('attendance')
    },
    {
      id: 'nav-resources',
      category: 'Navigation',
      label: 'Go to Resource Library (PYQs, Notes)',
      shortcut: 'R',
      icon: Sparkles,
      perform: () => setActiveTab('resources')
    },
    {
      id: 'nav-polls',
      category: 'Navigation',
      label: 'Go to Polls & Quick Decisions',
      shortcut: 'P',
      icon: BarChart3,
      perform: () => setActiveTab('polls')
    },
    {
      id: 'nav-cal',
      category: 'Navigation',
      label: 'Go to Academic Calendar',
      icon: Calendar,
      perform: () => setActiveTab('calendar')
    },
    {
      id: 'nav-members',
      category: 'Navigation',
      label: 'Go to Class Roster & Members',
      icon: Users,
      perform: () => setActiveTab('members')
    },
    {
      id: 'nav-broadcasts',
      category: 'Navigation',
      label: 'Go to Official Broadcasts',
      shortcut: 'B',
      icon: Megaphone,
      perform: () => setActiveTab('broadcasts')
    },
    {
      id: 'nav-messages',
      category: 'Navigation',
      label: 'Go to Encrypted Messages',
      icon: MessageSquare,
      perform: () => setActiveTab('messages')
    },
    {
      id: 'nav-analytics',
      category: 'Navigation',
      label: 'Go to Class Analytics & Health',
      icon: BarChart3,
      perform: () => setActiveTab('analytics')
    },
    {
      id: 'nav-settings',
      category: 'Navigation',
      label: 'Go to Settings & CR Handover',
      icon: Settings,
      perform: () => setActiveTab('settings')
    },

    // Actions
    ...(currentUser.role === 'CR' ? [
      {
        id: 'act-new-asg',
        category: 'Actions' as const,
        label: 'Post New Assignment',
        shortcut: 'N',
        icon: Plus,
        perform: () => setIsNewAssignmentModalOpen(true)
      },
      {
        id: 'act-remind',
        category: 'Actions' as const,
        label: 'Remind All Pending Students',
        icon: BellRing,
        perform: () => {
          if (assignments[0]) remindPendingStudents(assignments[0].id);
        }
      },
      {
        id: 'act-export-subs',
        category: 'Actions' as const,
        label: 'Export Submissions to CSV',
        icon: Download,
        perform: () => exportSubmissionsCSV()
      },
      {
        id: 'act-export-roster',
        category: 'Actions' as const,
        label: 'Export Student Roster to CSV',
        icon: Download,
        perform: () => exportMembersCSV()
      }
    ] : []),
    {
      id: 'act-offline',
      category: 'Actions',
      label: 'Toggle Network Offline Mode',
      icon: Wifi,
      perform: () => toggleOffline()
    },

    // Theme Accents
    {
      id: 'theme-blue',
      category: 'Theme Accent',
      label: 'Set Accent: Instagram Blue',
      icon: Palette,
      perform: () => setThemeAccent('blue')
    },
    {
      id: 'theme-cyan',
      category: 'Theme Accent',
      label: 'Set Accent: Electric Cyan',
      icon: Palette,
      perform: () => setThemeAccent('cyan')
    },
    {
      id: 'theme-indigo',
      category: 'Theme Accent',
      label: 'Set Accent: Linear Indigo',
      icon: Palette,
      perform: () => setThemeAccent('indigo')
    },
    {
      id: 'theme-emerald',
      category: 'Theme Accent',
      label: 'Set Accent: Emerald Green',
      icon: Palette,
      perform: () => setThemeAccent('emerald')
    },
    {
      id: 'theme-amber',
      category: 'Theme Accent',
      label: 'Set Accent: Warm Amber',
      icon: Palette,
      perform: () => setThemeAccent('amber')
    },

    // Persona Switching
    ...allUsers.slice(0, 4).map(u => ({
      id: `persona-${u.id}`,
      category: 'Personas' as const,
      label: `Switch to ${u.name} (${u.role})`,
      icon: UserCheck,
      perform: () => switchRole(u.role, u.id)
    }))
  ];

  const filteredItems = items.filter(item => 
    item.label.toLowerCase().includes(query.toLowerCase()) ||
    item.category.toLowerCase().includes(query.toLowerCase())
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % (filteredItems.length || 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + filteredItems.length) % (filteredItems.length || 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const selected = filteredItems[selectedIndex];
      if (selected) {
        selected.perform();
        setIsCommandPaletteOpen(false);
      }
    }
  };

  return (
    <div 
      onClick={() => setIsCommandPaletteOpen(false)}
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150"
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-xl bg-white dark:bg-[#0F172A] rounded-2xl border border-[#E2E7F0] dark:border-[#1E293B] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-100"
      >
        {/* Search Bar Input */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-[#E2E7F0] dark:border-[#1E293B] bg-[#F8FAFC]/50 dark:bg-[#15203B]/40">
          <Search className="w-5 h-5 text-[#64748B] dark:text-[#94A3B8] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Type a command, search modules, switch persona, or change theme..."
            className="flex-1 bg-transparent text-xs sm:text-sm text-[#0F2044] dark:text-white placeholder-[#94A3B8] focus:outline-none"
          />
          <kbd className="hidden sm:inline-flex items-center gap-0.5 px-2 py-0.5 rounded text-[10px] font-mono font-bold text-[#64748B] dark:text-[#94A3B8] bg-[#E2E8F0] dark:bg-[#1E293B] border border-[#CBD5E1] dark:border-[#334155]">
            ESC
          </kbd>
        </div>

        {/* List of Actions */}
        <div className="max-h-96 overflow-y-auto p-2 space-y-1">
          {filteredItems.length === 0 ? (
            <div className="py-10 text-center text-xs text-[#64748B] dark:text-[#94A3B8]">
              No commands found matching "{query}".
            </div>
          ) : (
            filteredItems.map((item, idx) => {
              const Icon = item.icon;
              const isSelected = selectedIndex === idx;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    item.perform();
                    setIsCommandPaletteOpen(false);
                  }}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs transition-colors text-left ${
                    isSelected
                      ? 'bg-[#E6F8F6] dark:bg-[#00D2C4]/15 text-[#00897B] dark:text-[#00D2C4] font-bold'
                      : 'text-[#0F2044] dark:text-white hover:bg-[#F8FAFC] dark:hover:bg-[#15203B]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-1.5 rounded-lg ${isSelected ? 'bg-[#00B4A6]/20 dark:bg-[#00D2C4]/20' : 'bg-[#F1F5F9] dark:bg-[#1E293B]'}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="block font-semibold">{item.label}</span>
                      <span className="text-[10px] text-[#64748B] dark:text-[#94A3B8] font-normal">{item.category}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {item.shortcut && (
                      <kbd className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-black/5 dark:bg-white/10 text-[#64748B] dark:text-[#94A3B8]">
                        {item.shortcut}
                      </kbd>
                    )}
                    <ArrowRight className="w-3.5 h-3.5 opacity-60" />
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Footer info */}
        <div className="px-4 py-2 border-t border-[#E2E7F0] dark:border-[#1E293B] bg-[#F8FAFC] dark:bg-[#15203B]/60 flex items-center justify-between text-[11px] text-[#64748B] dark:text-[#94A3B8]">
          <div className="flex items-center gap-3">
            <span>↑↓ to navigate</span>
            <span>↵ to select</span>
            <span>ESC to close</span>
          </div>
          <span className="font-mono text-[10px]">StudySync v2.4</span>
        </div>
      </div>
    </div>
  );
};
