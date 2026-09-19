import React from 'react';
import { useStudySync } from '../../store';
import { NavTab } from '../../types';
import {
  Home,
  CheckSquare,
  MessageSquare,
  BarChart2,
  Settings
} from 'lucide-react';

export const MobileNav: React.FC = () => {
  const { activeTab, setActiveTab, assignments, polls } = useStudySync();

  const pendingTasksCount = assignments.filter(a => a.status === 'active').length;

  const tabs: { id: NavTab; label: string; icon: React.FC<{ className?: string }>; badge?: number }[] = [
    { id: 'dashboard', label: 'Home', icon: Home },
    { id: 'assignments', label: 'Tasks', icon: CheckSquare, badge: pendingTasksCount },
    { id: 'messages', label: 'Messages', icon: MessageSquare },
    { id: 'polls', label: 'Polls', icon: BarChart2 },
    { id: 'settings', label: 'More', icon: Settings },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/97 dark:bg-black/97 backdrop-blur-xl border-t border-[#DBDBDB] dark:border-[#262626] pb-safe">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="relative flex flex-col items-center justify-center flex-1 pt-2 pb-1 gap-0.5 text-center transition-all active:scale-90 min-h-[56px]"
            >
              <div className="relative">
                <Icon
                  className={`w-[22px] h-[22px] transition-all ${
                    isActive
                      ? 'text-black dark:text-white stroke-[2.3]'
                      : 'text-[#8E8E8E] dark:text-[#737373] stroke-[1.7]'
                  }`}
                />
                {tab.badge !== undefined && tab.badge > 0 && (
                  <span className="absolute -top-1 -right-1.5 min-w-[14px] h-3.5 px-1 rounded-full bg-[#0095F6] text-white text-[8px] font-bold flex items-center justify-center leading-none">
                    {tab.badge}
                  </span>
                )}
              </div>
              <span className={`text-[10px] leading-none tracking-tight font-medium ${
                isActive
                  ? 'text-black dark:text-white font-semibold'
                  : 'text-[#8E8E8E] dark:text-[#737373]'
              }`}>
                {tab.label}
              </span>
              {/* Active dot indicator */}
              {isActive && (
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-black dark:bg-white" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
