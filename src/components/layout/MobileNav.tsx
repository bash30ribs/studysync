import React from 'react';
import { useStudySync } from '../../store';
import { NavTab } from '../../types';
import { 
  Home, 
  CheckSquare, 
  UserCheck, 
  BarChart2, 
  Settings,
  Bell
} from 'lucide-react';

export const MobileNav: React.FC = () => {
  const { activeTab, setActiveTab, assignments, polls } = useStudySync();

  const pendingTasksCount = assignments.filter(a => a.status === 'active').length;
  const activePollsCount = polls.filter(p => !p.isClosed).length;

  const tabs: { id: NavTab; label: string; icon: React.FC<{ className?: string }>; badge?: number }[] = [
    { id: 'dashboard', label: 'Home', icon: Home },
    { id: 'assignments', label: 'Tasks', icon: CheckSquare, badge: pendingTasksCount },
    { id: 'attendance', label: 'Attendance', icon: UserCheck },
    { id: 'polls', label: 'Polls', icon: BarChart2, badge: activePollsCount },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-black/95 backdrop-blur-lg border-t border-[#DBDBDB] dark:border-[#262626] pb-safe">
      <div className="flex items-center justify-around h-14 max-w-md mx-auto px-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="relative flex flex-col items-center justify-center flex-1 py-1 text-center transition-opacity active:opacity-60"
            >
              <div className="relative">
                <Icon 
                  className={`w-6 h-6 transition-transform ${
                    isActive 
                      ? 'text-black dark:text-white stroke-[2.5] scale-105' 
                      : 'text-[#737373] dark:text-[#A8A8A8] stroke-[1.8]'
                  }`} 
                />
                {tab.badge !== undefined && tab.badge > 0 && (
                  <span className="absolute -top-1 -right-2 min-w-4 h-4 px-1 rounded-full bg-[#FF3040] text-white text-[9px] font-bold flex items-center justify-center leading-none">
                    {tab.badge}
                  </span>
                )}
              </div>
              <span className={`text-[10px] mt-0.5 tracking-tight ${
                isActive 
                  ? 'font-bold text-black dark:text-white' 
                  : 'font-normal text-[#737373] dark:text-[#A8A8A8]'
              }`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
