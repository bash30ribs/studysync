import React from 'react';
import { useStudySync } from '../../store';
import { NavTab } from '../../types';
import { 
  LayoutDashboard, 
  FileText, 
  MessageSquare, 
  Calendar,
  Layers
} from 'lucide-react';

export const MobileNav: React.FC = () => {
  const { activeTab, setActiveTab, setIsRightPanelOpen, currentUser } = useStudySync();

  const tabs: { id: NavTab; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'dashboard', label: 'Home', icon: LayoutDashboard },
    { id: 'assignments', label: 'Tasks', icon: FileText },
    { id: 'messages', label: 'Chat', icon: MessageSquare },
    { id: 'calendar', label: 'Calendar', icon: Calendar },
  ];

  return (
    <div className="md:hidden fixed bottom-0 inset-x-0 bg-white dark:bg-[#111827] border-t border-[#E2E7F0] dark:border-[#374151] z-30 px-3 py-2 flex items-center justify-around">
      {tabs.map(tab => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id);
              setIsRightPanelOpen(false);
            }}
            className={`flex flex-col items-center gap-1 text-[11px] font-medium transition-colors ${
              isActive
                ? 'text-[#00B4A6]'
                : 'text-[#64748B] dark:text-[#9CA3AF]'
            }`}
          >
            <Icon className="w-5 h-5" />
            <span>{tab.label}</span>
          </button>
        );
      })}

      <button
        onClick={() => setIsRightPanelOpen(true)}
        className="flex flex-col items-center gap-1 text-[11px] font-medium text-[#64748B] dark:text-[#9CA3AF]"
      >
        <Layers className="w-5 h-5" />
        <span>Details</span>
      </button>
    </div>
  );
};
