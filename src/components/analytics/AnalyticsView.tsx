import React from 'react';
import { useStudySync } from '../../store';
import { 
  Download
} from 'lucide-react';

export const AnalyticsView: React.FC = () => {
  const { 
    currentClass, 
    allUsers, 
    assignments, 
    submissions, 
    exportSubmissionsCSV 
  } = useStudySync();

  const studentUsers = allUsers.filter(u => u.role === 'Student');
  const totalStudents = studentUsers.length;
  const totalAssignments = assignments.length;

  // Student submission rates
  const studentStats = studentUsers.map(stu => {
    const submittedCount = submissions.filter(s => s.studentId === stu.id && s.status === 'submitted').length;
    const rate = totalAssignments > 0 ? (submittedCount / totalAssignments) * 100 : 0;
    return {
      ...stu,
      submittedCount,
      rate: Math.round(rate)
    };
  });

  const activeStudents = studentStats.filter(s => s.rate >= 50);
  const ghostStudents = studentStats.filter(s => s.rate < 25);

  // Subject-wise performance
  const subjectStats = currentClass.subjects.map(subj => {
    const subjAsgs = assignments.filter(a => a.subject === subj);
    if (subjAsgs.length === 0) return { subject: subj, rate: 0, count: 0 };
    
    let totalSubjSubs = 0;
    subjAsgs.forEach(a => {
      totalSubjSubs += submissions.filter(s => s.assignmentId === a.id && s.status === 'submitted').length;
    });

    const possible = subjAsgs.length * totalStudents;
    const rate = possible > 0 ? Math.round((totalSubjSubs / possible) * 100) : 0;
    return { subject: subj, rate, count: subjAsgs.length };
  });

  // Most missed assignments
  const mostMissed = assignments
    .map(asg => {
      const submitted = submissions.filter(s => s.assignmentId === asg.id && s.status === 'submitted').length;
      const missed = totalStudents - submitted;
      return {
        ...asg,
        submitted,
        missed
      };
    })
    .sort((a, b) => b.missed - a.missed);

  return (
    <div className="p-4 lg:p-7 space-y-6 max-w-6xl mx-auto animate-in fade-in duration-150">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl lg:text-2xl font-bold text-black dark:text-white tracking-tight">
            Class Analytics & Performance
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-0.5">
            Cohort submission metrics, subject compliance, and student engagement.
          </p>
        </div>

        <button
          onClick={() => exportSubmissionsCSV()}
          className="btn-secondary self-start sm:self-auto"
        >
          <Download className="w-3.5 h-3.5 text-neutral-500 dark:text-neutral-400" />
          <span>Export Analytics Report</span>
        </button>
      </div>

      {/* Top Stat Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        {/* Class Health Score */}
        <div className="p-5 ui-card">
          <span className="text-[11px] font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider block">
            Class Health Score
          </span>
          <div className="flex items-baseline gap-1.5 mt-1.5">
            <span className="text-3xl font-bold text-[#0095F6] font-mono">
              88/100
            </span>
            <span className="text-xs text-[#0095F6] font-semibold">Healthy</span>
          </div>
          <p className="text-[10px] text-neutral-500 dark:text-neutral-400 mt-1">
            Submissions, attendance & on-time rate
          </p>
        </div>

        <div className="p-5 ui-card">
          <span className="text-[11px] font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider block">
            Average Submission Rate
          </span>
          <div className="flex items-baseline gap-1.5 mt-1.5">
            <span className="text-3xl font-bold text-black dark:text-white font-mono">
              {Math.round(studentStats.reduce((acc, s) => acc + s.rate, 0) / (studentStats.length || 1))}%
            </span>
            <span className="text-xs text-neutral-500 dark:text-neutral-400">overall cohort</span>
          </div>
          <p className="text-[10px] text-neutral-500 dark:text-neutral-400 mt-1">
            {activeStudents.length} active submitters
          </p>
        </div>

        <div className="p-5 ui-card">
          <span className="text-[11px] font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider block">
            Needs Attention Watchlist
          </span>
          <div className="flex items-baseline gap-1.5 mt-1.5">
            <span className="text-3xl font-bold text-[#ED4956] font-mono">
              {ghostStudents.length}
            </span>
            <span className="text-xs text-neutral-500 dark:text-neutral-400">&lt; 25% submissions</span>
          </div>
          <p className="text-[10px] text-[#ED4956] mt-1">
            Requires CR personal follow-up
          </p>
        </div>

        <div className="p-5 ui-card">
          <span className="text-[11px] font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider block">
            Assignments Monitored
          </span>
          <div className="flex items-baseline gap-1.5 mt-1.5">
            <span className="text-3xl font-bold text-black dark:text-white font-mono">
              {totalAssignments}
            </span>
            <span className="text-xs text-neutral-500 dark:text-neutral-400">active tasks</span>
          </div>
          <p className="text-[10px] text-neutral-500 dark:text-neutral-400 mt-1">
            Across {currentClass.subjects.length} subjects
          </p>
        </div>
      </div>

      {/* Hourly Submission Heatmap */}
      <div className="p-5 ui-card space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
          <div>
            <h3 className="text-sm font-bold text-black dark:text-white">
              Hourly Submission Activity Heatmap
            </h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              Reveals peak submission hours (8 PM - 11 PM) to guide broadcast and deadline scheduling.
            </p>
          </div>
          <span className="text-[11px] font-semibold text-[#0095F6] bg-[#0095F6]/10 px-2.5 py-1 rounded-full self-start">
            Peak: 9 PM — 11 PM IST
          </span>
        </div>

        <div className="grid grid-cols-6 sm:grid-cols-12 gap-1.5 pt-2">
          {[
            { hour: '12 AM', intensity: 2 },
            { hour: '2 AM', intensity: 0 },
            { hour: '4 AM', intensity: 0 },
            { hour: '6 AM', intensity: 1 },
            { hour: '8 AM', intensity: 2 },
            { hour: '10 AM', intensity: 3 },
            { hour: '12 PM', intensity: 3 },
            { hour: '2 PM', intensity: 4 },
            { hour: '4 PM', intensity: 4 },
            { hour: '6 PM', intensity: 5 },
            { hour: '8 PM', intensity: 8 },
            { hour: '10 PM', intensity: 9 },
          ].map((h, i) => (
            <div key={i} className="flex flex-col items-center gap-1">
              <div 
                className={`w-full h-12 rounded-lg transition-all ${
                  h.intensity >= 8 ? 'bg-[#0095F6]' :
                  h.intensity >= 5 ? 'bg-[#0095F6]/75' :
                  h.intensity >= 3 ? 'bg-[#0095F6]/45' :
                  h.intensity >= 1 ? 'bg-[#0095F6]/20' :
                  'bg-neutral-100 dark:bg-[#1C1C1C]'
                }`}
                title={`${h.hour}: ${h.intensity * 4} submissions logged`}
              />
              <span className="text-[9px] font-mono text-neutral-500 dark:text-neutral-400">
                {h.hour}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Grid: 4-Week Trend & Subject Bars */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 4-Week Submission Rate Trend */}
        <div className="p-5 ui-card">
          <div className="flex items-center justify-between pb-3 border-b border-[#DBDBDB] dark:border-[#262626]">
            <h2 className="font-bold text-sm text-black dark:text-white">
              4-Week Submission Rate Trend
            </h2>
            <span className="text-xs font-mono text-[#0095F6] font-bold">
              +14% vs Month 1
            </span>
          </div>

          <div className="mt-6 h-48 flex items-end justify-between gap-4 px-3">
            {[
              { week: 'Week 1', rate: 62 },
              { week: 'Week 2', rate: 75 },
              { week: 'Week 3', rate: 68 },
              { week: 'Week 4 (Current)', rate: 84 },
            ].map(item => (
              <div key={item.week} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                <span className="text-xs font-mono font-semibold text-black dark:text-white">
                  {item.rate}%
                </span>
                <div className="w-full bg-neutral-100 dark:bg-[#1C1C1C] rounded-t-lg h-32 flex items-end overflow-hidden">
                  <div
                    className="w-full bg-[#0095F6] rounded-t-lg progress-bar-fill hover:bg-[#1877F2] transition-all"
                    style={{ height: `${item.rate}%` }}
                  />
                </div>
                <span className="text-[10px] font-semibold text-neutral-500 dark:text-neutral-400 text-center truncate">
                  {item.week}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Subject-Wise Compliance */}
        <div className="p-5 ui-card">
          <div className="flex items-center justify-between pb-3 border-b border-[#DBDBDB] dark:border-[#262626]">
            <h2 className="font-bold text-sm text-black dark:text-white">
              Subject-Wise Turnout Compliance
            </h2>
            <span className="text-xs text-neutral-500 dark:text-neutral-400">
              All semester modules
            </span>
          </div>

          <div className="mt-4 space-y-3.5">
            {subjectStats.map(s => (
              <div key={s.subject} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-medium">
                  <span className="text-black dark:text-white truncate">
                    {s.subject}
                  </span>
                  <span className="font-mono text-[#0095F6] font-bold">
                    {s.rate}%
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-neutral-100 dark:bg-[#1C1C1C] overflow-hidden">
                  <div
                    className="h-full bg-[#0095F6] rounded-full progress-bar-fill"
                    style={{ width: `${s.rate}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Ranked Most Missed Assignments & Alert Watchlist */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Most Missed Leaderboard */}
        <div className="p-5 ui-card">
          <h2 className="font-bold text-sm text-black dark:text-white mb-3">
            Most Missed Assignments
          </h2>
          <div className="space-y-2">
            {mostMissed.map((asg, idx) => (
              <div
                key={asg.id}
                className="p-3 rounded-lg bg-neutral-50 dark:bg-[#181818] border border-[#DBDBDB] dark:border-[#262626] flex items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="font-mono font-bold text-neutral-400 w-4">
                    #{idx + 1}
                  </span>
                  <div className="min-w-0">
                    <p className="font-semibold text-black dark:text-white truncate">
                      {asg.title}
                    </p>
                    <p className="text-[10px] text-neutral-500 dark:text-neutral-400">
                      {asg.subject}
                    </p>
                  </div>
                </div>
                <span className="font-mono text-[#ED4956] font-semibold shrink-0 bg-red-500/10 px-2 py-0.5 rounded">
                  {asg.missed} pending
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Watchlist */}
        <div className="p-5 ui-card">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-sm text-black dark:text-white">
              Watchlist (&lt;25% submissions)
            </h2>
            <span className="px-2 py-0.5 rounded bg-red-500/10 text-[#ED4956] text-[10px] font-bold uppercase">
              Action Needed
            </span>
          </div>

          <div className="space-y-2">
            {ghostStudents.length === 0 ? (
              <p className="text-xs text-[#0095F6] py-6 text-center font-semibold">
                All students currently have healthy submission rates!
              </p>
            ) : (
              ghostStudents.map(stu => (
                <div
                  key={stu.id}
                  className="p-3 rounded-lg bg-neutral-50 dark:bg-[#181818] border border-[#DBDBDB] dark:border-[#262626] flex items-center justify-between text-xs"
                >
                  <div>
                    <p className="font-semibold text-black dark:text-white">
                      {stu.name}
                    </p>
                    <p className="text-[10px] text-neutral-500 dark:text-neutral-400 font-mono">
                      {stu.rollNo} · {stu.email}
                    </p>
                  </div>
                  <span className="font-mono font-bold text-[#ED4956] bg-red-500/10 px-2 py-0.5 rounded">
                    {stu.rate}% rate
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
