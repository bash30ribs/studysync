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
          <h1 className="text-xl lg:text-2xl font-bold text-black dark:text-white tracking-tight">
            Academic Calendar
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-0.5">
            Assignment deadlines, submission schedules, and class timeline.
          </p>
        </div>

        {/* View Toggle & Nav */}
        <div className="flex items-center gap-3">
          <div className="flex rounded-lg bg-neutral-100 dark:bg-[#1C1C1C] border border-[#DBDBDB] dark:border-[#262626] p-0.5 text-xs font-semibold">
            <button
              onClick={() => setViewMode('month')}
              className={`px-3 py-1.5 rounded-md transition-all ${
                viewMode === 'month'
                  ? 'bg-black dark:bg-white text-white dark:text-black font-semibold'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white'
              }`}
            >
              Month View
            </button>
            <button
              onClick={() => setViewMode('week')}
              className={`px-3 py-1.5 rounded-md transition-all ${
                viewMode === 'week'
                  ? 'bg-black dark:bg-white text-white dark:text-black font-semibold'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white'
              }`}
            >
              Week View
            </button>
          </div>

          <div className="flex items-center gap-1 bg-white dark:bg-[#121212] border border-[#DBDBDB] dark:border-[#262626] rounded-lg p-0.5">
            <button
              onClick={prevMonth}
              aria-label="Previous Month"
              className="p-1.5 text-neutral-500 hover:text-black dark:text-neutral-400 dark:hover:text-white rounded transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs font-bold text-black dark:text-white px-2 min-w-[120px] text-center">
              {monthNames[month]} {year}
            </span>
            <button
              onClick={nextMonth}
              aria-label="Next Month"
              className="p-1.5 text-neutral-500 hover:text-black dark:text-neutral-400 dark:hover:text-white rounded transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 text-xs font-medium text-neutral-500 dark:text-neutral-400">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#0095F6]" />
          <span>Active / Upcoming</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
          <span>Due Today</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#ED4956]" />
          <span>Past Deadline</span>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="ui-card overflow-hidden">
        {/* Day of Week Headers */}
        <div className="grid grid-cols-7 border-b border-[#DBDBDB] dark:border-[#262626] bg-[#FAFAFA] dark:bg-[#121212] text-center py-2.5 text-[11px] font-semibold text-neutral-500 dark:text-neutral-400">
          <div>Sun</div>
          <div>Mon</div>
          <div>Tue</div>
          <div>Wed</div>
          <div>Thu</div>
          <div>Fri</div>
          <div>Sat</div>
        </div>

        {/* Days grid */}
        <div className="grid grid-cols-7 divide-x divide-y divide-[#DBDBDB] dark:divide-[#262626]">
          {/* Empty padding days */}
          {paddingArray.map(i => (
            <div key={`pad-${i}`} className="h-24 sm:h-28 bg-[#FAFAFA]/50 dark:bg-[#000000]/40 p-2" />
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
                    ? 'bg-neutral-100 dark:bg-[#1C1C1C] ring-2 ring-inset ring-[#0095F6]'
                    : 'hover:bg-neutral-50 dark:hover:bg-[#1C1C1C]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`text-xs font-semibold w-6 h-6 flex items-center justify-center rounded-full ${
                      today
                        ? 'bg-[#0095F6] text-white font-bold'
                        : 'text-black dark:text-white'
                    }`}
                  >
                    {day}
                  </span>
                  {dayAsgs.length > 0 && (
                    <span className="text-[10px] font-mono text-[#0095F6] font-bold">
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
                        className={`text-[10px] px-1.5 py-0.5 rounded truncate font-medium ${
                          isOverdue
                            ? 'bg-red-500/15 text-[#ED4956]'
                            : today
                            ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400'
                            : 'bg-neutral-100 dark:bg-[#262626] text-black dark:text-white'
                        }`}
                      >
                        {asg.title}
                      </div>
                    );
                  })}
                  {dayAsgs.length > 2 && (
                    <div className="text-[9px] text-neutral-400 pl-1 font-mono">
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
