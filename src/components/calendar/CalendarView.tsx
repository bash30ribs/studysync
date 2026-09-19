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
          <div className="flex rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-0.5 text-xs font-semibold shadow-xs">
            <button
              onClick={() => setViewMode('month')}
              className={`px-3 py-1.5 rounded-md transition-all ${
                viewMode === 'month'
                  ? 'bg-teal-500 text-white dark:text-slate-950 font-bold shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Month View
            </button>
            <button
              onClick={() => setViewMode('week')}
              className={`px-3 py-1.5 rounded-md transition-all ${
                viewMode === 'week'
                  ? 'bg-teal-500 text-white dark:text-slate-950 font-bold shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Week View
            </button>
          </div>

          <div className="flex items-center gap-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-0.5 shadow-xs">
            <button
              onClick={prevMonth}
              aria-label="Previous Month"
              className="p-1.5 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white rounded transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs font-bold text-slate-900 dark:text-white px-2 min-w-[120px] text-center">
              {monthNames[month]} {year}
            </span>
            <button
              onClick={nextMonth}
              aria-label="Next Month"
              className="p-1.5 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white rounded transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 text-xs font-semibold text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-teal-500" />
          <span>Active / On-Time</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
          <span>Due Today</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
          <span>Overdue / Past</span>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="ui-card overflow-hidden">
        {/* Day of Week Headers */}
        <div className="grid grid-cols-7 border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/60 text-center py-2.5 text-[11px] font-bold text-slate-500 dark:text-slate-400">
          <div>Sun</div>
          <div>Mon</div>
          <div>Tue</div>
          <div>Wed</div>
          <div>Thu</div>
          <div>Fri</div>
          <div>Sat</div>
        </div>

        {/* Days grid */}
        <div className="grid grid-cols-7 divide-x divide-y divide-slate-200 dark:divide-slate-800">
          {/* Empty padding days */}
          {paddingArray.map(i => (
            <div key={`pad-${i}`} className="h-24 sm:h-28 bg-slate-50/30 dark:bg-slate-950/30 p-2" />
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
                    ? 'bg-teal-500/10 ring-2 ring-inset ring-teal-500'
                    : 'hover:bg-slate-50 dark:hover:bg-slate-800/40'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full ${
                      today
                        ? 'bg-teal-500 text-white dark:text-slate-950 font-extrabold shadow-xs'
                        : 'text-slate-800 dark:text-slate-100'
                    }`}
                  >
                    {day}
                  </span>
                  {dayAsgs.length > 0 && (
                    <span className="text-[10px] font-mono text-teal-600 dark:text-teal-400 font-extrabold">
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
                            ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400'
                            : today
                            ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400'
                            : 'bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300'
                        }`}
                      >
                        {asg.title}
                      </div>
                    );
                  })}
                  {dayAsgs.length > 2 && (
                    <div className="text-[9px] text-slate-400 pl-1 font-mono">
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
