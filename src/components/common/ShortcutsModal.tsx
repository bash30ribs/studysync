import React from 'react';
import { useStudySync } from '../../store';
import { Command, Keyboard, X } from 'lucide-react';

export const ShortcutsModal: React.FC = () => {
  const { isShortcutsOpen, setIsShortcutsOpen, currentUser } = useStudySync();

  if (!isShortcutsOpen) return null;

  const shortcutGroups = [
    {
      title: 'Global Navigation & Command',
      items: [
        { key: '⌘K / Ctrl+K', desc: 'Open Command Palette (Search, Personas, Actions)' },
        { key: '?', desc: 'Show this Keyboard Shortcuts cheat sheet' },
        { key: 'Esc', desc: 'Close any active drawer, modal, or overlay' }
      ]
    },
    {
      title: 'Quick Module Shortcuts',
      items: [
        { key: 'N', desc: currentUser.role === 'CR' ? 'Post new class assignment' : 'Open assignment submission drawer' },
        { key: 'B', desc: 'Jump to Official Broadcasts feed' },
        { key: 'A', desc: 'Jump to Attendance Management' },
        { key: 'P', desc: 'Jump to Polls & Decisions' },
        { key: 'R', desc: 'Jump to Resource Library' }
      ]
    },
    {
      title: 'Navigation Numbers (In Command Palette)',
      items: [
        { key: '1 - 8', desc: 'Jump directly to numbered sidebar tabs' },
        { key: '↑ / ↓', desc: 'Navigate command suggestions' },
        { key: '↵ Enter', desc: 'Execute selected command' }
      ]
    }
  ];

  return (
    <div 
      onClick={() => setIsShortcutsOpen(false)}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150"
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg bg-white dark:bg-[#0F172A] rounded-2xl border border-[#E2E8F0] dark:border-[#1E293B] shadow-2xl overflow-hidden"
      >
        <div className="px-5 py-4 border-b border-[#E2E8F0] dark:border-[#1E293B] bg-[#F8FAFC] dark:bg-[#15203B]/60 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Keyboard className="w-4 h-4 text-[#00B4A6] dark:text-[#00D2C4]" />
            <h3 className="text-sm font-bold text-[#0F2044] dark:text-white">
              Keyboard Shortcuts Cheat Sheet
            </h3>
          </div>
          <button
            onClick={() => setIsShortcutsOpen(false)}
            className="p-1 rounded-lg text-[#64748B] hover:text-[#0F2044] dark:text-[#94A3B8] dark:hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
          {shortcutGroups.map((grp, i) => (
            <div key={i} className="space-y-2">
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#64748B] dark:text-[#94A3B8]">
                {grp.title}
              </h4>
              <div className="divide-y divide-[#E2E8F0] dark:divide-[#1E293B] border border-[#E2E8F0] dark:border-[#1E293B] rounded-xl overflow-hidden">
                {grp.items.map((item, idx) => (
                  <div key={idx} className="px-3.5 py-2 flex items-center justify-between bg-white dark:bg-[#0B132B]">
                    <span className="text-xs text-[#334155] dark:text-[#CBD5E1]">
                      {item.desc}
                    </span>
                    <kbd className="px-2 py-0.5 rounded text-[11px] font-mono font-bold text-[#0F2044] dark:text-white bg-[#F1F5F9] dark:bg-[#1E293B] border border-[#CBD5E1] dark:border-[#334155] shrink-0">
                      {item.key}
                    </kbd>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="px-5 py-3 border-t border-[#E2E8F0] dark:border-[#1E293B] bg-[#F8FAFC] dark:bg-[#15203B]/40 flex items-center justify-between text-[11px] text-[#64748B] dark:text-[#94A3B8]">
          <span>Press ESC anytime to exit</span>
          <span className="font-mono text-[10px]">StudySync Pro v2.4</span>
        </div>
      </div>
    </div>
  );
};
