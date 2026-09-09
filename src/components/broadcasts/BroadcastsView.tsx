import React from 'react';
import { useStudySync } from '../../store';
import { 
  Megaphone, 
  ShieldCheck, 
  CheckCheck, 
  Clock, 
  Plus
} from 'lucide-react';

export const BroadcastsView: React.FC = () => {
  const { 
    currentUser, 
    broadcasts, 
    allUsers, 
    setIsRightPanelOpen 
  } = useStudySync();

  const totalStudents = allUsers.filter(u => u.role === 'Student').length;

  return (
    <div className="p-4 lg:p-7 space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl lg:text-2xl font-extrabold text-[#0F2044] dark:text-white tracking-tight">
            Official Broadcasts
          </h1>
          <p className="text-xs sm:text-sm text-[#64748B] dark:text-[#94A3B8] mt-0.5">
            Immutable CR class-wide announcements delivered to all enrolled student devices.
          </p>
        </div>

        {currentUser.role === 'CR' && (
          <button
            onClick={() => setIsRightPanelOpen(true)}
            className="px-3.5 py-2 rounded-lg bg-[#00B4A6] dark:bg-[#00D2C4] hover:bg-[#009E91] dark:hover:bg-[#00B4A6] text-white dark:text-[#080D1A] text-xs font-bold flex items-center gap-1.5 transition-all shadow-md shadow-[#00B4A6]/15 self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Compose Broadcast</span>
          </button>
        )}
      </div>

      {/* Broadcasts Feed */}
      <div className="space-y-4">
        {broadcasts.length === 0 ? (
          <div className="p-12 text-center text-xs text-[#64748B] dark:text-[#94A3B8] bg-white dark:bg-[#0F172A] rounded-xl border border-[#E2E7F0] dark:border-[#1E293B]">
            No official broadcasts sent yet.
          </div>
        ) : (
          broadcasts.map((bc, idx) => {
            const isUnread = currentUser.role === 'Student' && !bc.readBy.includes(currentUser.id) && idx === 0;

            return (
              <div
                key={bc.id}
                className={`p-5 rounded-xl bg-white dark:bg-[#0F172A] border shadow-xs transition-all ${
                  isUnread
                    ? 'border-l-4 border-l-[#00B4A6] dark:border-l-[#00D2C4] border-y-[#E2E7F0] border-r-[#E2E7F0] dark:border-y-[#1E293B] dark:border-r-[#1E293B]'
                    : 'border-[#E2E7F0] dark:border-[#1E293B]'
                }`}
              >
                {/* Top meta */}
                <div className="flex items-center justify-between gap-2 pb-3 border-b border-[#E2E7F0] dark:border-[#1E293B]">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-[#E6F8F6] dark:bg-[#00D2C4]/15 text-[#00897B] dark:text-[#00D2C4] flex items-center justify-center font-bold">
                      <Megaphone className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-bold text-xs text-[#0F2044] dark:text-white">
                        {bc.authorName}
                      </span>
                      <span className="ml-2 px-1.5 py-0.2 rounded bg-[#00B4A6] dark:bg-[#00D2C4] text-white dark:text-[#09132B] text-[9px] font-extrabold">
                        CR
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-[#64748B] dark:text-[#94A3B8] font-mono">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {new Date(bc.sentAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </span>
                    {currentUser.role === 'CR' && (
                      <span className="flex items-center gap-1 text-[#00897B] dark:text-[#00D2C4] font-bold hidden sm:flex">
                        <CheckCheck className="w-3.5 h-3.5" />
                        Delivered to {totalStudents}
                      </span>
                    )}
                  </div>
                </div>

                {/* Content */}
                <p className={`mt-3 text-xs sm:text-sm text-[#0F2044] dark:text-white leading-relaxed ${isUnread ? 'font-semibold' : ''}`}>
                  {bc.content}
                </p>

                {/* Bottom verification badge */}
                <div className="mt-4 pt-2.5 border-t border-[#E2E7F0] dark:border-[#1E293B] flex items-center justify-between text-[11px] text-[#64748B] dark:text-[#94A3B8]">
                  <div className="flex items-center gap-1 text-[#00897B] dark:text-[#00D2C4] font-medium">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Cryptographically verified CR dispatch</span>
                  </div>
                  <span className="font-mono text-[10px]">ID: {bc.id}</span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
