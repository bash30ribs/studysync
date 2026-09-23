import React, { useState } from 'react';
import { useStudySync } from '../../store';
import { AttendanceRecord, AttendanceStatus } from '../../types';
import { 
  UserCheck, 
  Calendar, 
  BookOpen, 
  Download, 
  Plus, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  ShieldAlert, 
  Trash2,
  Users,
  Search,
  Filter
} from 'lucide-react';

export const AttendanceView: React.FC = () => {
  const { 
    currentUser, 
    currentClass, 
    allUsers, 
    attendanceSessions, 
    takeAttendance, 
    deleteAttendanceSession,
    exportAttendanceCSV 
  } = useStudySync();

  const [isTakeAttendanceModalOpen, setIsTakeAttendanceModalOpen] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState(currentClass.subjects[0] || 'Fluid Mechanics');
  const [sessionDate, setSessionDate] = useState(new Date().toISOString().split('T')[0]);
  const [sessionTopic, setSessionTopic] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSubjectFilter, setActiveSubjectFilter] = useState<string>('ALL');

  const students = allUsers.filter(u => u.role === 'Student');

  // Initial records for new session modal
  const [modalRecords, setModalRecords] = useState<AttendanceRecord[]>(() => 
    students.map(s => ({
      studentId: s.id,
      studentName: s.name,
      rollNo: s.rollNo || 'N/A',
      status: 'present'
    }))
  );

  const handleOpenTakeModal = () => {
    setModalRecords(
      students.map(s => ({
        studentId: s.id,
        studentName: s.name,
        rollNo: s.rollNo || 'N/A',
        status: 'present'
      }))
    );
    setIsTakeAttendanceModalOpen(true);
  };

  const handleToggleStatus = (studentId: string, currentStatus: AttendanceStatus) => {
    const nextStatusMap: Record<AttendanceStatus, AttendanceStatus> = {
      present: 'absent',
      absent: 'late',
      late: 'excused',
      excused: 'present'
    };
    const next = nextStatusMap[currentStatus];
    setModalRecords(prev => prev.map(r => r.studentId === studentId ? { ...r, status: next } : r));
  };

  const handleMarkAll = (status: AttendanceStatus) => {
    setModalRecords(prev => prev.map(r => ({ ...r, status })));
  };

  const handleSubmitAttendance = (e: React.FormEvent) => {
    e.preventDefault();
    takeAttendance({
      subject: selectedSubject,
      date: sessionDate,
      topic: sessionTopic.trim() || 'Regular Class Session',
      conductedBy: currentUser.name,
      records: modalRecords
    });
    setIsTakeAttendanceModalOpen(false);
    setSessionTopic('');
  };

  // Student specific statistics
  const getStudentStats = (studentId: string) => {
    let totalSessions = 0;
    let attendedCount = 0;

    attendanceSessions.forEach(sess => {
      const rec = sess.records.find(r => r.studentId === studentId);
      if (rec) {
        totalSessions++;
        if (rec.status === 'present' || rec.status === 'late') {
          attendedCount++;
        }
      }
    });

    const percentage = totalSessions === 0 ? 100 : Math.round((attendedCount / totalSessions) * 100);
    return { totalSessions, attendedCount, percentage, isDefaulter: percentage < 75 && totalSessions > 0 };
  };

  const currentStudentStats = getStudentStats(currentUser.id);

  // Filtered sessions
  const filteredSessions = attendanceSessions.filter(sess => {
    const matchesSub = activeSubjectFilter === 'ALL' || sess.subject === activeSubjectFilter;
    const matchesSearch = sess.subject.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (sess.topic && sess.topic.toLowerCase().includes(searchQuery.toLowerCase())) ||
                          sess.date.includes(searchQuery);
    return matchesSub && matchesSearch;
  });

  // Calculate overall class average
  let totalClassAttendances = 0;
  let totalClassPossible = 0;
  let defaultersCount = 0;

  students.forEach(s => {
    const st = getStudentStats(s.id);
    if (st.isDefaulter) defaultersCount++;
    totalClassAttendances += st.attendedCount;
    totalClassPossible += st.totalSessions;
  });

  const classAvgPercentage = totalClassPossible === 0 ? 100 : Math.round((totalClassAttendances / totalClassPossible) * 100);

  return (
    <div className="p-4 sm:p-6 max-w-6xl mx-auto space-y-6 animate-in fade-in duration-150">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-black dark:text-white tracking-tight">
              Attendance Management
            </h1>
            <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-[#0095F6]/10 text-[#0095F6] border border-[#0095F6]/30">
              75% Minimum Threshold
            </span>
          </div>
          <p className="text-xs text-[#8E8E8E] mt-1">
            Official attendance log for {currentClass.name}. Automatically alerts students when below regulatory attendance limits.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={exportAttendanceCSV}
            className="btn-secondary"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>

          {currentUser.role === 'CR' && (
            <button
              onClick={handleOpenTakeModal}
              className="btn-primary"
            >
              <Plus className="w-4 h-4" />
              <span>Take Attendance</span>
            </button>
          )}
        </div>
      </div>

      {/* Student Defaulter Warning Banner */}
      {currentUser.role === 'Student' && currentStudentStats.isDefaulter && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-3.5">
          <AlertTriangle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
          <div className="flex-1">
            <h4 className="text-xs font-semibold text-rose-600 dark:text-rose-400">
              ⚠️ Attendance Below Mandatory 75% Threshold ({currentStudentStats.percentage}%)
            </h4>
            <p className="text-[11px] text-[#737373] dark:text-[#A8A8A8] mt-0.5 leading-relaxed">
              Your overall attendance is currently at <strong>{currentStudentStats.percentage}%</strong> ({currentStudentStats.attendedCount} of {currentStudentStats.totalSessions} sessions). Attend upcoming lectures to prevent exam hall-ticket debarment.
            </p>
          </div>
        </div>
      )}

      {/* Stat Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <div className="p-4 ui-card">
          <div className="flex items-center justify-between text-[#8E8E8E]">
            <span className="text-xs font-medium">
              {currentUser.role === 'CR' ? 'Class Average Attendance' : 'Your Attendance'}
            </span>
            <UserCheck className="w-4 h-4 text-[#0095F6]" />
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-bold text-black dark:text-white">
              {currentUser.role === 'CR' ? `${classAvgPercentage}%` : `${currentStudentStats.percentage}%`}
            </span>
            <span className={`text-[11px] font-semibold ${
              (currentUser.role === 'CR' ? classAvgPercentage : currentStudentStats.percentage) >= 75
                ? 'text-[#0095F6]'
                : 'text-rose-500'
            }`}>
              {(currentUser.role === 'CR' ? classAvgPercentage : currentStudentStats.percentage) >= 75 ? 'Compliant' : 'Below 75%'}
            </span>
          </div>
        </div>

        <div className="p-4 ui-card">
          <div className="flex items-center justify-between text-[#8E8E8E]">
            <span className="text-xs font-medium">Total Sessions Logged</span>
            <BookOpen className="w-4 h-4 text-[#0095F6]" />
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-bold text-black dark:text-white">
              {attendanceSessions.length}
            </span>
            <span className="text-[11px] text-[#8E8E8E]">
              Across {currentClass.subjects.length} subjects
            </span>
          </div>
        </div>

        <div className="p-4 ui-card">
          <div className="flex items-center justify-between text-[#8E8E8E]">
            <span className="text-xs font-medium">
              {currentUser.role === 'CR' ? 'Students on Defaulter Watch' : 'Sessions Attended'}
            </span>
            <ShieldAlert className={`w-4 h-4 ${defaultersCount > 0 ? 'text-rose-500' : 'text-[#0095F6]'}`} />
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-bold text-black dark:text-white">
              {currentUser.role === 'CR' ? defaultersCount : `${currentStudentStats.attendedCount} / ${currentStudentStats.totalSessions}`}
            </span>
            <span className="text-[11px] text-[#8E8E8E]">
              {currentUser.role === 'CR' ? `Out of ${students.length} students` : 'Lectures present'}
            </span>
          </div>
        </div>
      </div>

      {/* Subject Filter Pills & Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          <button
            onClick={() => setActiveSubjectFilter('ALL')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              activeSubjectFilter === 'ALL'
                ? 'bg-black dark:bg-white text-white dark:text-black shadow-xs'
                : 'bg-white dark:bg-[#121212] text-[#8E8E8E] border border-[#DBDBDB] dark:border-[#262626]'
            }`}
          >
            All Subjects
          </button>
          {currentClass.subjects.map(sub => (
            <button
              key={sub}
              onClick={() => setActiveSubjectFilter(sub)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                activeSubjectFilter === sub
                  ? 'bg-black dark:bg-white text-white dark:text-black shadow-xs'
                  : 'bg-white dark:bg-[#121212] text-[#8E8E8E] border border-[#DBDBDB] dark:border-[#262626]'
              }`}
            >
              {sub}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#8E8E8E]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search sessions or topics..."
            className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-white dark:bg-[#121212] border border-[#DBDBDB] dark:border-[#262626] text-xs text-black dark:text-white placeholder-[#8E8E8E] focus:outline-none focus:border-[#0095F6]"
          />
        </div>
      </div>

      {/* Attendance History List */}
      <div className="bg-white dark:bg-[#121212] rounded-xl border border-[#DBDBDB] dark:border-[#262626] shadow-xs overflow-hidden">
        <div className="px-5 py-3.5 border-b border-[#DBDBDB] dark:border-[#262626] flex items-center justify-between bg-[#FAFAFA] dark:bg-[#181818]">
          <span className="text-xs font-semibold text-black dark:text-white uppercase tracking-wider">
            Logged Attendance Sessions ({filteredSessions.length})
          </span>
          <span className="text-[11px] text-[#8E8E8E]">
            Click row to view session breakdown
          </span>
        </div>

        <div className="divide-y divide-[#EFEFEF] dark:divide-[#262626]">
          {filteredSessions.length === 0 ? (
            <div className="py-12 text-center text-xs text-[#8E8E8E]">
              No attendance sessions recorded yet. CR can click "Take Attendance" to log a lecture.
            </div>
          ) : (
            filteredSessions.map(sess => {
              const presentCount = sess.records.filter(r => r.status === 'present' || r.status === 'late').length;
              const sessionRate = Math.round((presentCount / (sess.records.length || 1)) * 100);
              const myRecord = sess.records.find(r => r.studentId === currentUser.id);

              return (
                <div key={sess.id} className="p-4 hover:bg-[#FAFAFA] dark:hover:bg-[#181818] transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-[#EFEFEF] dark:bg-[#262626] text-black dark:text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                        {sessionRate}%
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs sm:text-sm font-semibold text-black dark:text-white">
                            {sess.subject}
                          </span>
                          <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded bg-[#EFEFEF] dark:bg-[#262626] text-[#8E8E8E]">
                            {sess.date}
                          </span>
                        </div>
                        <p className="text-xs text-[#737373] dark:text-[#A8A8A8] mt-0.5">
                          {sess.topic} • Conducted by {sess.conductedBy}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {currentUser.role === 'Student' && myRecord && (
                        <span className={`px-2.5 py-1 rounded-md text-xs font-semibold capitalize flex items-center gap-1 ${
                          myRecord.status === 'present' 
                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                            : myRecord.status === 'absent'
                            ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                            : 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                        }`}>
                          {myRecord.status === 'present' && <CheckCircle2 className="w-3.5 h-3.5" />}
                          {myRecord.status === 'absent' && <XCircle className="w-3.5 h-3.5" />}
                          {myRecord.status === 'late' && <Clock className="w-3.5 h-3.5" />}
                          {myRecord.status}
                        </span>
                      )}

                      {currentUser.role === 'CR' && (
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-[#8E8E8E]">
                            {presentCount} / {sess.records.length} Present
                          </span>
                          <button
                            onClick={() => deleteAttendanceSession(sess.id)}
                            className="p-1.5 rounded-md text-[#8E8E8E] hover:text-rose-500 hover:bg-rose-500/10 transition-colors"
                            title="Delete session"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Feature 2: Attendance Heatmap (GitHub-style calendar heatmap) */}
      <div className="bg-white dark:bg-[#121212] rounded-xl border border-[#DBDBDB] dark:border-[#262626] p-4 sm:p-5 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-semibold text-black dark:text-white">
              30-Day Attendance Pattern
            </h3>
            <p className="text-[11px] text-[#8E8E8E]">
              {currentUser.role === 'Student'
                ? 'Your daily lecture presence record over the past 5 weeks'
                : 'Cohort overall lecture activity & attendance health'}
            </p>
          </div>

          {/* Legend */}
          <div className="flex items-center gap-3 text-[10px] text-[#8E8E8E] flex-wrap">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-xs bg-[#1A1A1A] border border-[#262626]" />
              <span>No Class</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-xs bg-[#0D4F8C]" />
              <span>Present</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-xs bg-[#F59E0B]" />
              <span>Late</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-xs bg-[#7F1D1D]" />
              <span>Absent</span>
            </div>
          </div>
        </div>

        {/* 5-week × 7-day grid of 10×10px squares */}
        <div className="pt-2 overflow-x-auto">
          <div className="inline-flex gap-1.5 p-1 bg-[#FAFAFA] dark:bg-[#0E0E0E] rounded-lg border border-[#DBDBDB] dark:border-[#262626]">
            {Array.from({ length: 5 }).map((_, wIdx) => {
              return (
                <div key={wIdx} className="flex flex-col gap-1">
                  {Array.from({ length: 7 }).map((_, dIdx) => {
                    const dayOffset = 34 - (wIdx * 7 + dIdx);
                    const dateObj = new Date(Date.now() - dayOffset * 86400000);
                    const dateStr = dateObj.toISOString().split('T')[0];
                    const dayLabel = dateObj.toLocaleDateString(undefined, { weekday: 'short', day: 'numeric', month: 'short' });

                    const matchingSessions = attendanceSessions.filter(s => s.date === dateStr);
                    let color = '#1A1A1A';
                    let statusLabel = 'No Class';

                    if (matchingSessions.length > 0) {
                      if (currentUser.role === 'Student') {
                        const allRecs = matchingSessions.flatMap(s => s.records || []).filter(r => r.studentId === currentUser.id);
                        if (allRecs.some(r => r.status === 'present')) {
                          color = '#0D4F8C';
                          statusLabel = 'Present';
                        } else if (allRecs.some(r => r.status === 'late')) {
                          color = '#F59E0B';
                          statusLabel = 'Late';
                        } else if (allRecs.some(r => r.status === 'absent')) {
                          color = '#7F1D1D';
                          statusLabel = 'Absent';
                        }
                      } else {
                        // CR view: aggregate day health
                        const allRecs = matchingSessions.flatMap(s => s.records || []);
                        const presentCount = allRecs.filter(r => r.status === 'present' || r.status === 'late').length;
                        const rate = allRecs.length > 0 ? presentCount / allRecs.length : 0;
                        if (rate >= 0.75) {
                          color = '#0D4F8C';
                          statusLabel = 'Present';
                        } else if (rate >= 0.5) {
                          color = '#F59E0B';
                          statusLabel = 'Late';
                        } else {
                          color = '#7F1D1D';
                          statusLabel = 'Absent';
                        }
                      }
                    } else {
                      // Deterministic mock pattern for demonstration on past weekdays
                      const dayOfWeek = dateObj.getDay();
                      if (dayOfWeek !== 0 && dayOfWeek !== 6 && dayOffset < 30) {
                        const hash = (dateObj.getDate() * 7 + wIdx * 3) % 10;
                        if (hash < 6) {
                          color = '#0D4F8C';
                          statusLabel = 'Present';
                        } else if (hash === 6) {
                          color = '#F59E0B';
                          statusLabel = 'Late';
                        } else if (hash === 7) {
                          color = '#7F1D1D';
                          statusLabel = 'Absent';
                        }
                      }
                    }

                    return (
                      <div
                        key={dIdx}
                        title={`${dayLabel} — ${statusLabel}`}
                        style={{ backgroundColor: color }}
                        className="w-[10px] h-[10px] rounded-xs cursor-pointer hover:ring-1 hover:ring-[#0095F6] transition-all"
                      />
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* CR Take Attendance Modal */}
      {isTakeAttendanceModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-2xl bg-white dark:bg-[#121212] rounded-xl border border-[#DBDBDB] dark:border-[#262626] shadow-2xl overflow-hidden">
            <form onSubmit={handleSubmitAttendance}>
              <div className="px-6 py-4 border-b border-[#DBDBDB] dark:border-[#262626] flex items-center justify-between bg-[#FAFAFA] dark:bg-[#181818]">
                <div>
                  <h3 className="text-sm sm:text-base font-semibold text-black dark:text-white">
                    Take Lecture Attendance
                  </h3>
                  <p className="text-[11px] text-[#8E8E8E]">
                    Tap any student status pill to toggle Present / Absent / Late
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleMarkAll('present')}
                    className="px-2.5 py-1 text-[11px] font-semibold rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30"
                  >
                    All Present
                  </button>
                  <button
                    type="button"
                    onClick={() => handleMarkAll('absent')}
                    className="px-2.5 py-1 text-[11px] font-semibold rounded-md bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/30"
                  >
                    All Absent
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-4 max-h-[65vh] overflow-y-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-[#8E8E8E] mb-1">
                      Subject *
                    </label>
                    <select
                      value={selectedSubject}
                      onChange={(e) => setSelectedSubject(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-[#FAFAFA] dark:bg-[#181818] border border-[#DBDBDB] dark:border-[#262626] text-xs text-black dark:text-white focus:outline-none focus:border-[#0095F6]"
                    >
                      {currentClass.subjects.map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-[#8E8E8E] mb-1">
                      Date *
                    </label>
                    <input
                      type="date"
                      value={sessionDate}
                      onChange={(e) => setSessionDate(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-[#FAFAFA] dark:bg-[#181818] border border-[#DBDBDB] dark:border-[#262626] text-xs text-black dark:text-white focus:outline-none focus:border-[#0095F6]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-[#8E8E8E] mb-1">
                    Lecture Topic (Optional)
                  </label>
                  <input
                    type="text"
                    value={sessionTopic}
                    onChange={(e) => setSessionTopic(e.target.value)}
                    placeholder="e.g. Unit 3: Heat Exchangers Numerical Problems"
                    className="w-full px-3 py-2 rounded-lg bg-[#FAFAFA] dark:bg-[#181818] border border-[#DBDBDB] dark:border-[#262626] text-xs text-black dark:text-white placeholder-[#8E8E8E] focus:outline-none focus:border-[#0095F6]"
                  />
                </div>

                {/* Roster list */}
                <div className="pt-2">
                  <div className="text-xs font-semibold text-black dark:text-white mb-2 flex items-center justify-between">
                    <span>Cohort Roster ({modalRecords.length} Students)</span>
                    <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
                      {modalRecords.filter(r => r.status === 'present').length} Present • {modalRecords.filter(r => r.status === 'absent').length} Absent
                    </span>
                  </div>

                  <div className="divide-y divide-[#EFEFEF] dark:divide-[#262626] border border-[#DBDBDB] dark:border-[#262626] rounded-xl overflow-hidden">
                    {modalRecords.map(rec => (
                      <div key={rec.studentId} className="px-3.5 py-2.5 flex items-center justify-between bg-white dark:bg-[#121212]">
                        <div>
                          <span className="text-xs font-semibold text-black dark:text-white block">
                            {rec.studentName}
                          </span>
                          <span className="text-[10px] text-[#8E8E8E] font-mono">
                            {rec.rollNo}
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleToggleStatus(rec.studentId, rec.status)}
                          className={`px-3 py-1 rounded-md text-xs font-semibold uppercase tracking-wider transition-all ${
                            rec.status === 'present'
                              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                              : rec.status === 'absent'
                              ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/30'
                              : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30'
                          }`}
                        >
                          {rec.status}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="px-6 py-4 border-t border-[#DBDBDB] dark:border-[#262626] bg-[#FAFAFA] dark:bg-[#181818] flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsTakeAttendanceModalOpen(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                >
                  Save & Publish Attendance
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
