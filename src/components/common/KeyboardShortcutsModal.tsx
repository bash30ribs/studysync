import React, { useState } from 'react';
import { Keyboard, X, Search, Command } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

interface ShortcutItem {
  keys: string[];
  description: string;
  category: 'Navigation' | 'Actions' | 'View & Filter' | 'Focus & Tools';
}

const SHORTCUTS: ShortcutItem[] = [
  { keys: ['⌘', 'K'], description: 'Open Global Command Palette', category: 'Navigation' },
  { keys: ['G', 'D'], description: 'Navigate to Main Dashboard', category: 'Navigation' },
  { keys: ['G', 'A'], description: 'Navigate to Assignments Hub', category: 'Navigation' },
  { keys: ['G', 'C'], description: 'Navigate to Class Schedule Calendar', category: 'Navigation' },
  { keys: ['G', 'R'], description: 'Navigate to Academic Resources', category: 'Navigation' },
  { keys: ['G', 'P'], description: 'Navigate to Class Polls & Consensus', category: 'Navigation' },
  { keys: ['G', 'M'], description: 'Navigate to Roster / Members', category: 'Navigation' },
  { keys: ['N', 'A'], description: 'Quick New Assignment Modal', category: 'Actions' },
  { keys: ['N', 'B'], description: 'Create Emergency Class Broadcast', category: 'Actions' },
  { keys: ['N', 'P'], description: 'Create New Instant Poll', category: 'Actions' },
  { keys: ['/'], description: 'Focus Search Filter input', category: 'View & Filter' },
  { keys: ['Esc'], description: 'Close current modal or clear search', category: 'View & Filter' },
  { keys: ['Alt', 'T'], description: 'Toggle Dynamic Theme Accents', category: 'Focus & Tools' },
  { keys: ['Alt', 'S'], description: 'Open Focus Soundscapes Synthesizer', category: 'Focus & Tools' },
  { keys: ['?'], description: 'Open this Keyboard Shortcuts Cheat Sheet', category: 'Focus & Tools' },
];

export const KeyboardShortcutsModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [search, setSearch] = useState('');

  if (!isOpen) return null;

  const filteredShortcuts = SHORTCUTS.filter(
    (s) =>
      s.description.toLowerCase().includes(search.toLowerCase()) ||
      s.keys.join(' ').toLowerCase().includes(search.toLowerCase()) ||
      s.category.toLowerCase().includes(search.toLowerCase())
  );

  const categories = ['Navigation', 'Actions', 'View & Filter', 'Focus & Tools'] as const;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="shortcuts-title"
    >
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/90">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-indigo-500/20 text-indigo-400">
              <Keyboard className="w-5 h-5" />
            </div>
            <div>
              <h2 id="shortcuts-title" className="text-base font-semibold text-white">Keyboard Shortcuts</h2>
              <p className="text-xs text-slate-400">Power-user keybindings for high velocity class management</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Input */}
        <div className="p-4 border-b border-slate-800 bg-slate-950/40">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search shortcuts (e.g. 'calendar', 'broadcast', 'Cmd+K')..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-800/80 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              autoFocus
            />
          </div>
        </div>

        {/* Shortcuts List */}
        <div className="p-6 overflow-y-auto space-y-6 divide-y divide-slate-800/60">
          {categories.map((category) => {
            const items = filteredShortcuts.filter((item) => item.category === category);
            if (items.length === 0) return null;

            return (
              <div key={category} className="pt-4 first:pt-0">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-indigo-400 mb-3 flex items-center gap-1.5">
                  <Command className="w-3.5 h-3.5" /> {category}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                  {items.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-2.5 rounded-xl bg-slate-800/40 border border-slate-800/80 hover:bg-slate-800/70 transition"
                    >
                      <span className="text-xs text-slate-300 pr-2">{item.description}</span>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        {item.keys.map((k, kIdx) => (
                          <kbd
                            key={kIdx}
                            className="px-2 py-1 text-xs font-mono font-semibold bg-slate-900 border border-slate-700 text-slate-200 rounded-md shadow-inner"
                          >
                            {k}
                          </kbd>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-900/60 flex items-center justify-between text-xs text-slate-500">
          <span>Tip: Press <kbd className="font-mono text-slate-300 bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700">?</kbd> anywhere to bring up this menu</span>
          <button onClick={onClose} className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium transition">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
