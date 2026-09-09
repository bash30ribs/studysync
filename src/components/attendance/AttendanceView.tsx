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
            <h1 className="text-xl sm:text-2xl font-bold text-[#0F2044] dark:text-white tracking-tight">
              Attendance Management
            </h1>
            <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-[#E6F8F6] dark:bg-[#00D2C4]/15 text-[#00897B] dark:text-[#00D2C4] border border-[#00B4A6]/20">
              75% Minimum Threshold
            </span>
          </div>
          <p className="text-xs text-[#64748B] dark:text-[#94A3B8] mt-1">
            Official attendance log for {currentClass.name}. Automatically alerts students when below regulatory attendance limits.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={exportAttendanceCSV}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-[#E2E8F0] dark:border-[#1E293B] bg-white dark:bg-[#15203B] text-xs font-semibold text-[#475569] dark:text-[#94A3B8] hover:bg-[#F8FAFC] dark:hover:bg-[#1E293B] transition-all shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>

          {currentUser.role === 'CR' && (
            <button
              onClick={handleOpenTakeModal}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#00B4A6] hover:bg-[#009E91] dark:bg-[#00D2C4] dark:hover:bg-[#00B4A6] text-white dark:text-[#09132B] text-xs font-bold transition-all shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Take Attendance</span>
            </button>
          )}
        </div>
      </div>

      {/* Student Defaulter Warning Banner */}
      {currentUser.role === 'Student' && currentStudentStats.isDefaulter && (
        <div className="p-4 rounded-2xl bg-[#FEF2F2] dark:bg-[#EF4444]/10 border border-[#FCA5A5] dark:border-[#EF4444]/30 flex items-start gap-3.5">
          <AlertTriangle className="w-5 h-5 text-[#DC2626] dark:text-[#F87171] shrink-0 mt-0.5" />
          <div className="flex-1">
            <h4 className="text-xs font-bold text-[#DC2626] dark:text-[#F87171]">
              ⚠️ Attendance Below Mandatory 75% Threshold ({currentStudentStats.percentage}%)
            </h4>
            <p className="text-[11px] text-[#991B1B] dark:text-[#FCA5A5] mt-0.5 leading-relaxed">
              Your overall attendance is currently at <strong>{currentStudentStats.percentage}%</strong> ({currentStudentStats.attendedCount} of {currentStudentStats.totalSessions} sessions). Attend upcoming lectures to prevent exam hall-ticket debarment.
            </p>
          </div>
        </div>
      )}

      {/* Stat Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-[#0F172A] border border-[#E2E8F0] dark:border-[#1E293B] shadow-xs">
          <div className="flex items-center justify-between text-[#64748B] dark:text-[#94A3B8]">
            <span className="text-xs font-medium">
              {currentUser.role === 'CR' ? 'Class Average Attendance' : 'Your Attendance'}
            </span>
            <UserCheck className="w-4 h-4 text-[#00B4A6] dark:text-[#00D2C4]" />
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-bold text-[#0F2044] dark:text-white">
              {currentUser.role === 'CR' ? `${classAvgPercentage}%` : `${currentStudentStats.percentage}%`}
            </span>
            <span className={`text-[11px] font-semibold ${
              (currentUser.role === 'CR' ? classAvgPercentage : currentStudentStats.percentage) >= 75
                ? 'text-[#00B4A6] dark:text-[#00D2C4]'
                : 'text-[#DC2626] dark:text-[#F87171]'
            }`}>
              {(currentUser.role === 'CR' ? classAvgPercentage : currentStudentStats.percentage) >= 75 ? 'Compliant' : 'Below 75%'}
            </span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-[#0F172A] border border-[#E2E8F0] dark:border-[#1E293B] shadow-xs">
          <div className="flex items-center justify-between text-[#64748B] dark:text-[#94A3B8]">
            <span className="text-xs font-medium">Total Sessions Logged</span>
            <BookOpen className="w-4 h-4 text-[#00B4A6] dark:text-[#00D2C4]" />
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-bold text-[#0F2044] dark:text-white">
              {attendanceSessions.length}
            </span>
            <span className="text-[11px] text-[#64748B] dark:text-[#94A3B8]">
              Across {currentClass.subjects.length} subjects
            </span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-[#0F172A] border border-[#E2E8F0] dark:border-[#1E293B] shadow-xs">
          <div className="flex items-center justify-between text-[#64748B] dark:text-[#94A3B8]">
            <span className="text-xs font-medium">
              {currentUser.role === 'CR' ? 'Students on Defaulter Watch' : 'Sessions Attended'}
            </span>
            <ShieldAlert className={`w-4 h-4 ${defaultersCount > 0 ? 'text-[#DC2626]' : 'text-[#00B4A6]'}`} />
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-bold text-[#0F2044] dark:text-white">
              {currentUser.role === 'CR' ? defaultersCount : `${currentStudentStats.attendedCount} / ${currentStudentStats.totalSessions}`}
            </span>
            <span className="text-[11px] text-[#64748B] dark:text-[#94A3B8]">
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
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
              activeSubjectFilter === 'ALL'
                ? 'bg-[#0F2044] dark:bg-[#00D2C4] text-white dark:text-[#09132B] font-bold'
                : 'bg-white dark:bg-[#15203B] text-[#64748B] dark:text-[#94A3B8] border border-[#E2E8F0] dark:border-[#1E293B]'
            }`}
          >
            All Subjects
          </button>
          {currentClass.subjects.map(sub => (
            <button
              key={sub}
              onClick={() => setActiveSubjectFilter(sub)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                activeSubjectFilter === sub
                  ? 'bg-[#0F2044] dark:bg-[#00D2C4] text-white dark:text-[#09132B] font-bold'
                  : 'bg-white dark:bg-[#15203B] text-[#64748B] dark:text-[#94A3B8] border border-[#E2E8F0] dark:border-[#1E293B]'
              }`}
            >
              {sub}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search sessions or topics..."
            className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-white dark:bg-[#15203B] border border-[#E2E8F0] dark:border-[#1E293B] text-xs text-[#0F2044] dark:text-white placeholder-[#94A3B8] focus:outline-none focus:ring-1 focus:ring-[#00B4A6]"
          />
        </div>
      </div>

      {/* Attendance History List */}
      <div className="bg-white dark:bg-[#0F172A] rounded-2xl border border-[#E2E8F0] dark:border-[#1E293B] shadow-xs overflow-hidden">
        <div className="px-5 py-3.5 border-b border-[#E2E8F0] dark:border-[#1E293B] flex items-center justify-between bg-[#F8FAFC]/60 dark:bg-[#15203B]/40">
          <span className="text-xs font-bold text-[#0F2044] dark:text-white uppercase tracking-wider">
            Logged Attendance Sessions ({filteredSessions.length})
          </span>
          <span className="text-[11px] text-[#64748B] dark:text-[#94A3B8]">
            Click row to view session breakdown
          </span>
        </div>

        <div className="divide-y divide-[#E2E8F0] dark:divide-[#1E293B]">
          {filteredSessions.length === 0 ? (
            <div className="py-12 text-center text-xs text-[#64748B] dark:text-[#94A3B8]">
              No attendance sessions recorded yet. CR can click "Take Attendance" to log a lecture.
            </div>
          ) : (
            filteredSessions.map(sess => {
              const presentCount = sess.records.filter(r => r.status === 'present' || r.status === 'late').length;
              const sessionRate = Math.round((presentCount / (sess.records.length || 1)) * 100);
              const myRecord = sess.records.find(r => r.studentId === currentUser.id);

              return (
                <div key={sess.id} className="p-4 hover:bg-[#F8FAFC] dark:hover:bg-[#15203B]/60 transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#E6F8F6] dark:bg-[#00D2C4]/10 text-[#00897B] dark:text-[#00D2C4] flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                        {sessionRate}%
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs sm:text-sm font-bold text-[#0F2044] dark:text-white">
                            {sess.subject}
                          </span>
                          <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded bg-[#F1F5F9] dark:bg-[#1E293B] text-[#64748B] dark:text-[#94A3B8]">
                            {sess.date}
                          </span>
                        </div>
                        <p className="text-xs text-[#64748B] dark:text-[#94A3B8] mt-0.5">
                          {sess.topic} • Conducted by {sess.conductedBy}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {currentUser.role === 'Student' && myRecord && (
                        <span className={`px-2.5 py-1 rounded-md text-xs font-bold capitalize flex items-center gap-1 ${
                          myRecord.status === 'present' 
                            ? 'bg-[#E6F8F6] text-[#00897B] dark:bg-[#00D2C4]/20 dark:text-[#00D2C4]'
                            : myRecord.status === 'absent'
                            ? 'bg-[#FEF2F2] text-[#DC2626] dark:bg-[#EF4444]/20 dark:text-[#F87171]'
                            : 'bg-[#FEF6EC] text-[#D97706] dark:bg-[#F59E0B]/20 dark:text-[#FBBF24]'
                        }`}>
                          {myRecord.status === 'present' && <CheckCircle2 className="w-3.5 h-3.5" />}
                          {myRecord.status === 'absent' && <XCircle className="w-3.5 h-3.5" />}
                          {myRecord.status === 'late' && <Clock className="w-3.5 h-3.5" />}
                          {myRecord.status}
                        </span>
                      )}

                      {currentUser.role === 'CR' && (
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-[#64748B] dark:text-[#94A3B8]">
                            {presentCount} / {sess.records.length} Present
                          </span>
                          <button
                            onClick={() => deleteAttendanceSession(sess.id)}
                            className="p-1.5 rounded-lg text-[#64748B] hover:text-[#DC2626] dark:text-[#94A3B8] hover:bg-[#FEF2F2] dark:hover:bg-[#EF4444]/10 transition-colors"
                            title="Delete session (Undoable)"
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

      {/* CR Take Attendance Modal */}
      {isTakeAttendanceModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-2xl bg-white dark:bg-[#0F172A] rounded-2xl border border-[#E2E8F0] dark:border-[#1E293B] shadow-2xl overflow-hidden">
            <form onSubmit={handleSubmitAttendance}>
              <div className="px-6 py-4 border-b border-[#E2E8F0] dark:border-[#1E293B] flex items-center justify-between bg-[#F8FAFC] dark:bg-[#15203B]/60">
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-[#0F2044] dark:text-white">
                    Take Lecture Attendance
                  </h3>
                  <p className="text-[11px] text-[#64748B] dark:text-[#94A3B8]">
                    Tap any student status pill to toggle Present / Absent / Late
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleMarkAll('present')}
                    className="px-2.5 py-1 text-[11px] font-bold rounded-md bg-[#E6F8F6] dark:bg-[#00D2C4]/15 text-[#00897B] dark:text-[#00D2C4] border border-[#00B4A6]/20"
                  >
                    All Present
                  </button>
                  <button
                    type="button"
                    onClick={() => handleMarkAll('absent')}
                    className="px-2.5 py-1 text-[11px] font-bold rounded-md bg-[#FEF2F2] dark:bg-[#EF4444]/15 text-[#DC2626] dark:text-[#F87171] border border-[#EF4444]/20"
                  >
                    All Absent
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-4 max-h-[65vh] overflow-y-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-[#475569] dark:text-[#94A3B8] mb-1">
                      Subject *
                    </label>
                    <select
                      value={selectedSubject}
                      onChange={(e) => setSelectedSubject(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-[#F8FAFC] dark:bg-[#15203B] border border-[#E2E8F0] dark:border-[#1E293B] text-xs text-[#0F2044] dark:text-white focus:outline-none focus:ring-1 focus:ring-[#00B4A6]"
                    >
                      {currentClass.subjects.map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#475569] dark:text-[#94A3B8] mb-1">
                      Date *
                    </label>
                    <input
                      type="date"
                      value={sessionDate}
                      onChange={(e) => setSessionDate(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-[#F8FAFC] dark:bg-[#15203B] border border-[#E2E8F0] dark:border-[#1E293B] text-xs text-[#0F2044] dark:text-white focus:outline-none focus:ring-1 focus:ring-[#00B4A6]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#475569] dark:text-[#94A3B8] mb-1">
                    Lecture Topic (Optional)
                  </label>
                  <input
                    type="text"
                    value={sessionTopic}
                    onChange={(e) => setSessionTopic(e.target.value)}
                    placeholder="e.g. Unit 3: Heat Exchangers Numerical Problems"
                    className="w-full px-3 py-2 rounded-xl bg-[#F8FAFC] dark:bg-[#15203B] border border-[#E2E8F0] dark:border-[#1E293B] text-xs text-[#0F2044] dark:text-white placeholder-[#94A3B8] focus:outline-none focus:ring-1 focus:ring-[#00B4A6]"
                  />
                </div>

                {/* Roster list */}
                <div className="pt-2">
                  <div className="text-xs font-bold text-[#0F2044] dark:text-white mb-2 flex items-center justify-between">
                    <span>Cohort Roster ({modalRecords.length} Students)</span>
                    <span className="text-[11px] text-[#00897B] dark:text-[#00D2C4] font-semibold">
                      {modalRecords.filter(r => r.status === 'present').length} Present • {modalRecords.filter(r => r.status === 'absent').length} Absent
                    </span>
                  </div>

                  <div className="divide-y divide-[#E2E8F0] dark:divide-[#1E293B] border border-[#E2E8F0] dark:border-[#1E293B] rounded-xl overflow-hidden">
                    {modalRecords.map(rec => (
                      <div key={rec.studentId} className="px-3.5 py-2.5 flex items-center justify-between bg-white dark:bg-[#0B132B]">
                        <div>
                          <span className="text-xs font-bold text-[#0F2044] dark:text-white block">
                            {rec.studentName}
                          </span>
                          <span className="text-[10px] text-[#64748B] dark:text-[#94A3B8] font-mono">
                            {rec.rollNo}
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleToggleStatus(rec.studentId, rec.status)}
                          className={`px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                            rec.status === 'present'
                              ? 'bg-[#E6F8F6] text-[#00897B] dark:bg-[#00D2C4]/20 dark:text-[#00D2C4] border border-[#00B4A6]/30'
                              : rec.status === 'absent'
                              ? 'bg-[#FEF2F2] text-[#DC2626] dark:bg-[#EF4444]/20 dark:text-[#F87171] border border-[#EF4444]/30'
                              : 'bg-[#FEF6EC] text-[#D97706] dark:bg-[#F59E0B]/20 dark:text-[#FBBF24] border border-[#F59E0B]/30'
                          }`}
                        >
                          {rec.status}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="px-6 py-4 border-t border-[#E2E8F0] dark:border-[#1E293B] bg-[#F8FAFC] dark:bg-[#15203B]/40 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsTakeAttendanceModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-[#E2E8F0] dark:border-[#1E293B] text-xs font-medium text-[#475569] dark:text-[#94A3B8]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#00B4A6] hover:bg-[#009E91] dark:bg-[#00D2C4] dark:hover:bg-[#00B4A6] text-white dark:text-[#09132B] text-xs font-bold shadow-xs transition-colors"
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
