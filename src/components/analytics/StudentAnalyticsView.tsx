import React from 'react';
import { useStudySync } from '../../store';
import { TrendingUp, CheckCircle2, Clock, XCircle, UserCheck, BarChart2, AlertTriangle } from 'lucide-react';

export const StudentAnalyticsView: React.FC = () => {
  const { currentUser, assignments, submissions, attendanceSessions, currentClass } = useStudySync();

  const mySubmissions = submissions.filter(s => s.studentId === currentUser.id);
  const totalAssignments = assignments.length;
  const submitted = mySubmissions.filter(s => s.status === 'submitted').length;
  const missed = mySubmissions.filter(s => s.status === 'assigned' || s.status === 'missed').length;
  const submissionRate = totalAssignments > 0 ? Math.round((submitted / totalAssignments) * 100) : 0;

  const myAttendanceRecords = attendanceSessions.flatMap(sess =>
    sess.records.filter(r => r.studentId === currentUser.id).map(r => ({ ...r, subject: sess.subject }))
  );
  const totalClasses = myAttendanceRecords.length;
  const presentCount = myAttendanceRecords.filter(r => r.status === 'present' || r.status === 'late').length;
  const attendancePct = totalClasses > 0 ? Math.round((presentCount / totalClasses) * 100) : 0;
  const isDefaulterRisk = attendancePct < 75 && totalClasses > 0;

  const gradedSubs = mySubmissions.filter(s => s.grade);
  const avgScore = gradedSubs.length > 0
    ? Math.round(gradedSubs.reduce((acc, s) => acc + ((s.grade!.score / s.grade!.maxScore) * 100), 0) / gradedSubs.length)
    : null;

  const subjectStats = currentClass.subjects.map(subj => {
    const subjAsgs = assignments.filter(a => a.subject === subj);
    const submittedForSubj = mySubmissions.filter(s =>
      s.status === 'submitted' && subjAsgs.some(a => a.id === s.assignmentId)
    ).length;
    const rate = subjAsgs.length > 0 ? Math.round((submittedForSubj / subjAsgs.length) * 100) : 0;
    return { subject: subj, total: subjAsgs.length, submitted: submittedForSubj, rate };
  }).filter(s => s.total > 0);

  return (
    <div className="p-4 lg:p-7 space-y-6 max-w-5xl mx-auto animate-in fade-in duration-150">
      <div>
        <h1 className="text-xl lg:text-2xl font-bold text-black dark:text-white tracking-tight">My Performance Report</h1>
        <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-0.5">
          Personal grade tracker for {currentUser?.name || 'Student'} · {currentClass?.name || 'Cohort'}
        </p>
      </div>

      {isDefaulterRisk && (
        <div className="flex items-start gap-3 p-4 rounded-xl bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/30 text-rose-700 dark:text-rose-400">
          <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
          <div>
            <p className="text-xs font-bold">Defaulter Risk — Attendance below 75%</p>
            <p className="text-xs mt-0.5 opacity-80">Your current attendance is {attendancePct}%. Maintain above 75% to avoid the defaulter list.</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Submission Rate', value: `${submissionRate}%`, sub: `${submitted} of ${totalAssignments} submitted`, icon: CheckCircle2, color: 'text-[#0095F6]', valColor: 'text-black dark:text-white' },
          { label: 'Attendance', value: `${attendancePct}%`, sub: `${presentCount} of ${totalClasses} classes`, icon: UserCheck, color: isDefaulterRisk ? 'text-rose-500' : 'text-emerald-500', valColor: isDefaulterRisk ? 'text-rose-500' : 'text-black dark:text-white' },
          { label: 'Avg Score', value: avgScore !== null ? `${avgScore}%` : 'N/A', sub: `${gradedSubs.length} graded`, icon: TrendingUp, color: 'text-purple-500', valColor: 'text-black dark:text-white' },
          { label: 'Missed', value: String(missed), sub: 'not submitted', icon: XCircle, color: 'text-amber-500', valColor: 'text-amber-500' },
        ].map(({ label, value, sub, icon: Icon, color, valColor }) => (
          <div key={label} className="p-4 rounded-xl bg-white dark:bg-[#121212] border border-[#DBDBDB] dark:border-[#262626]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-semibold text-[#8E8E8E] uppercase tracking-wider">{label}</span>
              <Icon className={`w-4 h-4 ${color}`} />
            </div>
            <span className={`text-2xl font-bold font-mono ${valColor}`}>{value}</span>
            <p className="text-[10px] text-[#8E8E8E] mt-1">{sub}</p>
          </div>
        ))}
      </div>

      {subjectStats.length > 0 && (
        <div className="bg-white dark:bg-[#121212] rounded-xl border border-[#DBDBDB] dark:border-[#262626] overflow-hidden">
          <div className="px-5 py-4 border-b border-[#DBDBDB] dark:border-[#262626] bg-[#FAFAFA] dark:bg-[#181818] flex items-center gap-2">
            <BarChart2 className="w-4 h-4 text-[#0095F6]" />
            <h2 className="font-semibold text-sm text-black dark:text-white">Subject-wise Performance</h2>
          </div>
          <div className="divide-y divide-[#EFEFEF] dark:divide-[#262626]">
            {subjectStats.map(stat => (
              <div key={stat.subject} className="px-5 py-3.5 flex items-center gap-4">
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-black dark:text-white truncate">{stat.subject}</p>
                  <p className="text-[10px] text-[#8E8E8E]">{stat.submitted}/{stat.total} submitted</p>
                </div>
                <div className="w-32 space-y-1">
                  <div className="flex justify-between text-[10px] font-mono">
                    <span className="text-[#8E8E8E]">Progress</span>
                    <span className={`font-bold ${stat.rate === 100 ? 'text-emerald-500' : stat.rate < 50 ? 'text-rose-500' : 'text-[#0095F6]'}`}>{stat.rate}%</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-[#EFEFEF] dark:bg-[#262626] overflow-hidden">
                    <div className={`h-full rounded-full ${stat.rate === 100 ? 'bg-emerald-500' : stat.rate < 50 ? 'bg-rose-500' : 'bg-[#0095F6]'}`} style={{ width: `${stat.rate}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {gradedSubs.length > 0 && (
        <div className="bg-white dark:bg-[#121212] rounded-xl border border-[#DBDBDB] dark:border-[#262626] overflow-hidden">
          <div className="px-5 py-4 border-b border-[#DBDBDB] dark:border-[#262626] bg-[#FAFAFA] dark:bg-[#181818] flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <h2 className="font-semibold text-sm text-black dark:text-white">Graded Submissions</h2>
          </div>
          <div className="divide-y divide-[#EFEFEF] dark:divide-[#262626]">
            {gradedSubs.map(sub => {
              const asg = assignments.find(a => a.id === sub.assignmentId);
              const pct = Math.round((sub.grade!.score / sub.grade!.maxScore) * 100);
              return (
                <div key={sub.id} className="px-5 py-3.5 flex items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-black dark:text-white truncate">{asg?.title || 'Assignment'}</p>
                    <p className="text-[10px] text-[#8E8E8E]">{asg?.subject} · Graded by {sub.grade?.gradedBy}</p>
                    {sub.grade?.feedback && <p className="text-[10px] text-neutral-500 mt-0.5 italic">"{sub.grade.feedback}"</p>}
                  </div>
                  <div className="text-right shrink-0">
                    <span className={`text-sm font-bold font-mono ${pct >= 80 ? 'text-emerald-500' : pct >= 50 ? 'text-[#0095F6]' : 'text-rose-500'}`}>
                      {sub.grade!.score}/{sub.grade!.maxScore}
                    </span>
                    <p className="text-[10px] text-[#8E8E8E] font-mono">{pct}%</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {totalAssignments === 0 && (
        <div className="py-16 text-center text-xs text-[#8E8E8E]">
          <Clock className="w-8 h-8 mx-auto mb-3 text-neutral-300 dark:text-neutral-600" />
          No assignments posted yet. Check back once your CR has posted work.
        </div>
      )}
    </div>
  );
};
