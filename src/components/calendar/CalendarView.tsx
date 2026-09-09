import React, { useState } from 'react';
import { useStudySync } from '../../store';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon, 
  Clock 
} from 'lucide-react';

export const CalendarView: React.FC = () => {
  const { 
    assignments, 
    selectedCalendarDate, 
    setSelectedCalendarDate, 
    setSelectedAssignmentId, 
    setIsRightPanelOpen
  } = useStudySync();

  const [viewMode, setViewMode] = useState<'month' | 'week'>('month');
  const [currentMonthDate, setCurrentMonthDate] = useState(new Date());

  const year = currentMonthDate.getFullYear();
  const month = currentMonthDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const prevMonth = () => {
    setCurrentMonthDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentMonthDate(new Date(year, month + 1, 1));
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const getAssignmentsForDay = (day: number) => {
    const dayStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return assignments.filter(a => a.deadline.startsWith(dayStr));
  };

  const isToday = (day: number) => {
    const today = new Date();
    return today.getDate() === day && today.getMonth() === month && today.getFullYear() === year;
  };

  const isSelectedDay = (day: number) => {
    const dayStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return selectedCalendarDate === dayStr;
  };

  const handleSelectDay = (day: number) => {
    const dayStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    setSelectedCalendarDate(dayStr);
    const dayAsgs = getAssignmentsForDay(day);
    if (dayAsgs.length > 0) {
      setSelectedAssignmentId(dayAsgs[0].id);
      setIsRightPanelOpen(true);
    }
  };

  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const paddingArray = Array.from({ length: firstDayOfMonth }, (_, i) => i);

  return (
    <div className="p-4 lg:p-7 space-y-6 max-w-6xl mx-auto">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl lg:text-2xl font-extrabold text-[#0F2044] dark:text-white tracking-tight">
            Academic Calendar
          </h1>
          <p className="text-xs sm:text-sm text-[#64748B] dark:text-[#94A3B8] mt-0.5">
            Assignment deadlines, submission schedules, and class timeline.
          </p>
        </div>

        {/* View Toggle & Nav */}
        <div className="flex items-center gap-3">
          <div className="flex rounded-lg bg-white dark:bg-[#0F172A] border border-[#E2E7F0] dark:border-[#1E293B] p-0.5 text-xs font-semibold shadow-xs">
            <button
              onClick={() => setViewMode('month')}
              className={`px-3 py-1.5 rounded-md transition-all ${
                viewMode === 'month'
                  ? 'bg-[#00B4A6] dark:bg-[#00D2C4] text-white dark:text-[#080D1A]'
                  : 'text-[#64748B] dark:text-[#94A3B8] hover:text-[#0F2044] dark:hover:text-white'
              }`}
            >
              Month View
            </button>
            <button
              onClick={() => setViewMode('week')}
              className={`px-3 py-1.5 rounded-md transition-all ${
                viewMode === 'week'
                  ? 'bg-[#00B4A6] dark:bg-[#00D2C4] text-white dark:text-[#080D1A]'
                  : 'text-[#64748B] dark:text-[#94A3B8] hover:text-[#0F2044] dark:hover:text-white'
              }`}
            >
              Week View
            </button>
          </div>

          <div className="flex items-center gap-1 bg-white dark:bg-[#0F172A] border border-[#E2E7F0] dark:border-[#1E293B] rounded-lg p-0.5 shadow-xs">
            <button
              onClick={prevMonth}
              aria-label="Previous Month"
              className="p-1.5 text-[#64748B] hover:text-[#0F2044] dark:text-[#94A3B8] dark:hover:text-white rounded transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs font-bold text-[#0F2044] dark:text-white px-2 min-w-[120px] text-center">
              {monthNames[month]} {year}
            </span>
            <button
              onClick={nextMonth}
              aria-label="Next Month"
              className="p-1.5 text-[#64748B] hover:text-[#0F2044] dark:text-[#94A3B8] dark:hover:text-white rounded transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 text-xs font-semibold text-[#64748B] dark:text-[#94A3B8]">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#00B4A6] dark:bg-[#00D2C4]" />
          <span>Active / On-Time</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]" />
          <span>Due Today</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#E63946] dark:text-[#FB7185]" />
          <span>Overdue / Past</span>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="bg-white dark:bg-[#0F172A] border border-[#E2E7F0] dark:border-[#1E293B] rounded-xl shadow-xs overflow-hidden">
        {/* Day of Week Headers */}
        <div className="grid grid-cols-7 border-b border-[#E2E7F0] dark:border-[#1E293B] bg-[#F8FAFC] dark:bg-[#15203B]/60 text-center py-2.5 text-[11px] font-bold text-[#64748B] dark:text-[#94A3B8]">
          <div>Sun</div>
          <div>Mon</div>
          <div>Tue</div>
          <div>Wed</div>
          <div>Thu</div>
          <div>Fri</div>
          <div>Sat</div>
        </div>

        {/* Days grid */}
        <div className="grid grid-cols-7 divide-x divide-y divide-[#E2E7F0] dark:divide-[#1E293B]">
          {/* Empty padding days */}
          {paddingArray.map(i => (
            <div key={`pad-${i}`} className="h-24 sm:h-28 bg-[#F8FAFC]/40 dark:bg-[#080D1A]/40 p-2" />
          ))}

          {/* Active days */}
          {daysArray.map(day => {
            const dayAsgs = getAssignmentsForDay(day);
            const today = isToday(day);
            const selected = isSelectedDay(day);

            return (
              <div
                key={day}
                onClick={() => handleSelectDay(day)}
                className={`h-24 sm:h-28 p-2 cursor-pointer transition-colors flex flex-col justify-between ${
                  selected
                    ? 'bg-[#E6F8F6]/40 dark:bg-[#00D2C4]/10 ring-2 ring-inset ring-[#00B4A6] dark:ring-[#00D2C4]'
                    : 'hover:bg-[#F8FAFC] dark:hover:bg-[#15203B]/40'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full ${
                      today
                        ? 'bg-[#00B4A6] dark:bg-[#00D2C4] text-white dark:text-[#080D1A] font-extrabold shadow-xs'
                        : 'text-[#0F2044] dark:text-white'
                    }`}
                  >
                    {day}
                  </span>
                  {dayAsgs.length > 0 && (
                    <span className="text-[10px] font-mono text-[#00897B] dark:text-[#00D2C4] font-extrabold">
                      {dayAsgs.length} due
                    </span>
                  )}
                </div>

                <div className="space-y-1 overflow-hidden">
                  {dayAsgs.slice(0, 2).map(asg => {
                    const isOverdue = new Date(asg.deadline).getTime() < new Date().getTime();
                    return (
                      <div
                        key={asg.id}
                        className={`text-[10px] px-1.5 py-0.5 rounded truncate font-bold ${
                          isOverdue
                            ? 'bg-[#FDECEC] dark:bg-[#E63946]/15 text-[#E63946] dark:text-[#FB7185]'
                            : today
                            ? 'bg-[#FEF6EC] dark:bg-[#F59E0B]/15 text-[#D97706] dark:text-[#FBBF24]'
                            : 'bg-[#E6F8F6] dark:bg-[#00D2C4]/15 text-[#00897B] dark:text-[#00D2C4]'
                        }`}
                      >
                        {asg.title}
                      </div>
                    );
                  })}
                  {dayAsgs.length > 2 && (
                    <div className="text-[9px] text-[#64748B] dark:text-[#94A3B8] pl-1 font-mono">
                      +{dayAsgs.length - 2} more
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
