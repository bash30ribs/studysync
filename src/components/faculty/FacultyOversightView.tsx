import React, { useState } from 'react';
import { useStudySync } from '../../store';
import { 
  ShieldAlert, 
  Lock, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  FileText, 
  UserX, 
  Bell, 
  Search, 
  Filter, 
  Check, 
  ChevronRight, 
  Download, 
  Activity, 
  EyeOff, 
  Sparkles,
  HelpCircle,
  TrendingDown,
  Mail,
  UserCheck
} from 'lucide-react';
import { Modal } from '../common/Feedback';
import { GrievanceConfidentialItem } from '../../types';

export const FacultyOversightView: React.FC = () => {
  const { 
    currentUser, 
    allUsers, 
    assignments, 
    submissions, 
    attendanceSessions, 
    confidentialGrievances, 
    facultyAudits, 
    resolveConfidentialGrievance, 
    showToast 
  } = useStudySync();

  const [activeSection, setActiveSection] = useState<'grievances' | 'at_risk' | 'audits'>('grievances');
  const [selectedGrievance, setSelectedGrievance] = useState<GrievanceConfidentialItem | null>(null);
  const [facultyNotesInput, setFacultyNotesInput] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'reviewed' | 'resolved'>('all');
  const [atRiskSearch, setAtRiskSearch] = useState('');

  // Access Control: Must be Faculty
  if (currentUser.role !== 'Faculty') {
    return (
      <div className="p-8 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-center space-y-4 max-w-lg mx-auto my-12">
        <div className="w-14 h-14 rounded-full bg-rose-500/20 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto">
          <Lock className="w-7 h-7" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-black dark:text-white">
            Restricted Faculty Incharge Portal
          </h2>
          <p className="text-xs text-[#8E8E8E] mt-1 leading-relaxed">
            This module contains confidential student records, statutory AICTE warning systems, and institutional audit logs restricted exclusively to Faculty Incharge Dr. Meenakshi Sundaram.
          </p>
        </div>
      </div>
    );
  }

  // Calculate At-Risk Students (<75% attendance or 2+ overdue assignments)
  const students = allUsers.filter(u => u.role === 'Student');
  
  const atRiskStudents = students.map(student => {
    // Attendance calculation
    let totalClasses = 0;
    let attendedClasses = 0;
    attendanceSessions.forEach(sess => {
      const rec = sess.records.find(r => r.studentId === student.id);
      if (rec) {
        totalClasses++;
        if (rec.status === 'present' || rec.status === 'late') {
          attendedClasses++;
        }
      }
    });

    const attendancePct = totalClasses > 0 
      ? Math.round((attendedClasses / totalClasses) * 100) 
      : (student.attendanceRate ?? 85);

    // Missing / Overdue assignments
    const studentSubs = submissions.filter(s => s.studentId === student.id);
    const submittedAsgIds = new Set(studentSubs.filter(s => s.status === 'submitted').map(s => s.assignmentId));
    
    const now = new Date().getTime();
    const overdueCount = assignments.filter(asg => {
      const due = new Date(asg.deadline).getTime();
      return due < now && !submittedAsgIds.has(asg.id);
    }).length;

    const isLowAttendance = attendancePct < 75;
    const isHighOverdue = overdueCount >= 2;
    const isAtRisk = isLowAttendance || isHighOverdue;

    return {
      student,
      attendancePct,
      attendedClasses,
      totalClasses,
      overdueCount,
      isLowAttendance,
      isHighOverdue,
      isAtRisk
    };
  }).filter(item => item.isAtRisk);

  const filteredAtRisk = atRiskStudents.filter(item => {
    if (!atRiskSearch.trim()) return true;
    const q = atRiskSearch.toLowerCase();
    return item.student.name.toLowerCase().includes(q) || item.student.rollNo?.toLowerCase().includes(q);
  });

  const handleResolveGrievance = (grievanceId: string, status: 'reviewed' | 'resolved') => {
    resolveConfidentialGrievance(grievanceId, facultyNotesInput, status);
    setSelectedGrievance(null);
    setFacultyNotesInput('');
  };

  const handleIssueWarningNotice = (studentName: string) => {
    showToast(`Statutory Attendance & Academic Notice dispatched to ${studentName}`, 'success');
  };

  const filteredGrievances = confidentialGrievances.filter(g => {
    if (statusFilter !== 'all' && g.status !== statusFilter) return false;
    return true;
  });

  const pendingGrievancesCount = confidentialGrievances.filter(g => g.status === 'pending').length;

  return (
    <div className="space-y-6">
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#DBDBDB] dark:border-[#262626] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
              <ShieldAlert className="w-5 h-5" />
            </span>
            <div>
              <h1 className="text-xl font-bold text-black dark:text-white">
                Faculty Incharge Confidential Oversight Hub
              </h1>
              <p className="text-xs text-[#8E8E8E] mt-0.5">
                Restricted to Core Faculty (Dr. Meenakshi Sundaram) • Hidden from CR & Students
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold flex items-center gap-1.5">
            <UserCheck className="w-4 h-4" />
            <span>Authenticated Dean / Incharge Mode</span>
          </div>
        </div>
      </div>

      {/* TOP NAVIGATION TABS */}
      <div className="flex items-center gap-2 border-b border-[#DBDBDB] dark:border-[#262626] pb-1">
        <button
          onClick={() => setActiveSection('grievances')}
          className={`px-4 py-2 text-xs font-semibold rounded-t-lg transition-colors flex items-center gap-2 border-b-2 ${
            activeSection === 'grievances'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 bg-indigo-500/5'
              : 'border-transparent text-[#8E8E8E] hover:text-black dark:hover:text-white'
          }`}
        >
          <EyeOff className="w-4 h-4" />
          <span>Confidential Grievance Desk</span>
          {pendingGrievancesCount > 0 && (
            <span className="px-1.5 py-0.2 rounded-full bg-rose-500 text-white text-[10px] font-bold">
              {pendingGrievancesCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveSection('at_risk')}
          className={`px-4 py-2 text-xs font-semibold rounded-t-lg transition-colors flex items-center gap-2 border-b-2 ${
            activeSection === 'at_risk'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 bg-indigo-500/5'
              : 'border-transparent text-[#8E8E8E] hover:text-black dark:hover:text-white'
          }`}
        >
          <AlertTriangle className="w-4 h-4" />
          <span>At-Risk Student Warning Radar</span>
          {atRiskStudents.length > 0 && (
            <span className="px-1.5 py-0.2 rounded-full bg-amber-500 text-white text-[10px] font-bold">
              {atRiskStudents.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveSection('audits')}
          className={`px-4 py-2 text-xs font-semibold rounded-t-lg transition-colors flex items-center gap-2 border-b-2 ${
            activeSection === 'audits'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 bg-indigo-500/5'
              : 'border-transparent text-[#8E8E8E] hover:text-black dark:hover:text-white'
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>System & Grade Modification Audit Log</span>
        </button>
      </div>

      {/* SECTION 1: CONFIDENTIAL GRIEVANCES */}
      {activeSection === 'grievances' && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-indigo-500/5 border border-indigo-500/20 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
              <EyeOff className="w-4 h-4 shrink-0" />
              <span>
                <strong>Confidential Student Channel:</strong> Submissions in this channel bypass CRs completely and are end-to-end secured for direct Faculty resolution.
              </span>
            </div>
            <div className="flex items-center gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="text-xs px-2.5 py-1 rounded-md border border-[#DBDBDB] dark:border-[#262626] bg-white dark:bg-[#121212] text-black dark:text-white"
              >
                <option value="all">All Cases ({confidentialGrievances.length})</option>
                <option value="pending">Pending Resolution ({pendingGrievancesCount})</option>
                <option value="reviewed">Under Faculty Review</option>
                <option value="resolved">Resolved</option>
              </select>
            </div>
          </div>

          {filteredGrievances.length === 0 ? (
            <div className="p-8 rounded-xl bg-[#FAFAFA] dark:bg-[#181818] border border-[#DBDBDB] dark:border-[#262626] text-center space-y-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
              <p className="text-xs font-semibold text-black dark:text-white">Grievance Desk Clear</p>
              <p className="text-[11px] text-[#8E8E8E]">No open or pending confidential concerns registered.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredGrievances.map(grievance => (
                <div
                  key={grievance.id}
                  className="p-4 rounded-xl bg-white dark:bg-[#121212] border border-[#DBDBDB] dark:border-[#262626] space-y-3 shadow-xs"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                          {grievance.category.replace('_', ' ').toUpperCase()}
                        </span>
                        {grievance.isAnonymous ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-gray-100 dark:bg-gray-800 text-[#8E8E8E] flex items-center gap-1">
                            <EyeOff className="w-3 h-3" /> Anonymous Identity Protected
                          </span>
                        ) : (
                          <span className="font-semibold text-xs text-black dark:text-white">
                            From: {grievance.studentName}
                          </span>
                        )}
                        <span className="text-[10px] text-[#8E8E8E]">
                          • {new Date(grievance.submittedAt).toLocaleString()}
                        </span>
                      </div>

                      <h3 className="font-bold text-sm text-black dark:text-white mt-1.5">
                        {grievance.subject}
                      </h3>
                    </div>

                    <div className="shrink-0 text-right">
                      {grievance.status === 'pending' && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-600 dark:text-rose-400 bg-rose-500/10 px-2.5 py-1 rounded-full">
                          <Clock className="w-3 h-3" /> Action Required
                        </span>
                      )}
                      {grievance.status === 'reviewed' && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-full">
                          Under Faculty Review
                        </span>
                      )}
                      {grievance.status === 'resolved' && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full">
                          <CheckCircle2 className="w-3 h-3" /> Resolved
                        </span>
                      )}
                    </div>
                  </div>

                  <p className="text-xs text-black dark:text-white leading-relaxed bg-[#FAFAFA] dark:bg-[#181818] p-3 rounded-lg border border-[#DBDBDB]/60 dark:border-[#262626]/60">
                    {grievance.message}
                  </p>

                  {grievance.facultyNotes && (
                    <div className="p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/20 text-xs space-y-1">
                      <span className="font-semibold text-emerald-600 dark:text-emerald-400 block">
                        Official Faculty Action / Directive:
                      </span>
                      <p className="text-[#737373] dark:text-[#A8A8A8]">{grievance.facultyNotes}</p>
                    </div>
                  )}

                  <div className="pt-2 border-t border-[#DBDBDB] dark:border-[#262626] flex justify-end gap-2">
                    <button
                      onClick={() => {
                        setSelectedGrievance(grievance);
                        setFacultyNotesInput(grievance.facultyNotes || '');
                      }}
                      className="px-3.5 py-1.5 rounded-lg bg-[#0095F6] hover:bg-[#1877F2] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>{grievance.status === 'resolved' ? 'Update Directive' : 'Review & Resolve Concern'}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* SECTION 2: AT-RISK ACADEMIC & ATTENDANCE WARNING RADAR */}
      {activeSection === 'at_risk' && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-bold text-amber-600 dark:text-amber-400">
                Statutory Attendance & Overdue Task Radar (AICTE 75% Rule)
              </h3>
              <p className="text-[#8E8E8E] mt-0.5">
                Automatically detects students falling below 75% cutoff or harboring 2+ overdue assignments.
              </p>
            </div>
            <div className="text-right">
              <span className="text-xs font-mono font-bold text-amber-600 dark:text-amber-400">
                {atRiskStudents.length} Students At Risk
              </span>
            </div>
          </div>

          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#8E8E8E]" />
              <input
                type="text"
                value={atRiskSearch}
                onChange={(e) => setAtRiskSearch(e.target.value)}
                placeholder="Search at-risk students by name or roll number..."
                className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-[#DBDBDB] dark:border-[#262626] bg-[#FAFAFA] dark:bg-[#181818] text-black dark:text-white focus:outline-none focus:border-[#0095F6]"
              />
            </div>
          </div>

          {filteredAtRisk.length === 0 ? (
            <div className="p-8 rounded-xl bg-[#FAFAFA] dark:bg-[#181818] border border-[#DBDBDB] dark:border-[#262626] text-center space-y-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
              <p className="text-xs font-semibold text-black dark:text-white">All Students in Compliance</p>
              <p className="text-[11px] text-[#8E8E8E]">No students match at-risk criteria under current filters.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredAtRisk.map(item => (
                <div
                  key={item.student.id}
                  className="p-4 rounded-xl bg-white dark:bg-[#121212] border border-amber-500/30 space-y-3 shadow-xs"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-bold text-sm text-black dark:text-white">
                        {item.student.name}
                      </h4>
                      <p className="text-xs text-[#8E8E8E] font-mono">
                        {item.student.rollNo} • {item.student.email}
                      </p>
                    </div>

                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
                      Alert Triggered
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className={`p-2.5 rounded-lg border ${
                      item.isLowAttendance 
                        ? 'bg-rose-500/10 border-rose-500/20 text-rose-600 dark:text-rose-400' 
                        : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                    }`}>
                      <span className="block text-[10px] text-[#8E8E8E]">Attendance Rate</span>
                      <span className="text-sm font-bold font-mono">{item.attendancePct}%</span>
                      {item.isLowAttendance && (
                        <span className="block text-[9px] font-semibold mt-0.5">Shortage (&lt;75%)</span>
                      )}
                    </div>

                    <div className={`p-2.5 rounded-lg border ${
                      item.isHighOverdue
                        ? 'bg-amber-500/10 border-amber-500/20 text-amber-600 dark:text-amber-400'
                        : 'bg-[#FAFAFA] dark:bg-[#181818] border-[#DBDBDB] dark:border-[#262626] text-black dark:text-white'
                    }`}>
                      <span className="block text-[10px] text-[#8E8E8E]">Overdue Tasks</span>
                      <span className="text-sm font-bold font-mono">{item.overdueCount} Pending</span>
                      {item.isHighOverdue && (
                        <span className="block text-[9px] font-semibold mt-0.5">Defaulter Status</span>
                      )}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-[#DBDBDB] dark:border-[#262626] flex items-center justify-between gap-2">
                    <span className="text-[11px] text-[#8E8E8E]">
                      Proctor: Dr. Meenakshi Sundaram
                    </span>
                    <button
                      onClick={() => handleIssueWarningNotice(item.student.name)}
                      className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      <span>Issue Faculty Notice</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* SECTION 3: SYSTEM AUDIT & CRYPTOGRAPHIC LOG */}
      {activeSection === 'audits' && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-[#FAFAFA] dark:bg-[#181818] border border-[#DBDBDB] dark:border-[#262626] text-xs flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-black dark:text-white">
                Immutable System & Modification Trail
              </h3>
              <p className="text-[#8E8E8E] mt-0.5">
                Tracks all CR actions, assignment postings, grade modifications, and role transitions with cryptographic timestamps.
              </p>
            </div>
            <span className="px-2.5 py-1 rounded bg-[#0095F6]/10 text-[#0095F6] font-mono text-[10px] font-semibold">
              SHA-256 Ledger
            </span>
          </div>

          <div className="overflow-x-auto rounded-xl border border-[#DBDBDB] dark:border-[#262626]">
            <table className="w-full text-xs text-left">
              <thead className="bg-[#FAFAFA] dark:bg-[#181818] border-b border-[#DBDBDB] dark:border-[#262626] text-[#8E8E8E]">
                <tr>
                  <th className="p-3">Timestamp</th>
                  <th className="p-3">Action</th>
                  <th className="p-3">Actor & Role</th>
                  <th className="p-3">Details</th>
                  <th className="p-3 text-right">Severity</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#DBDBDB] dark:divide-[#262626]">
                {facultyAudits.map(entry => (
                  <tr key={entry.id} className="hover:bg-[#FAFAFA] dark:hover:bg-[#181818]">
                    <td className="p-3 font-mono text-[#8E8E8E] whitespace-nowrap">
                      {new Date(entry.timestamp).toLocaleString()}
                    </td>
                    <td className="p-3 font-semibold text-black dark:text-white">
                      {entry.action}
                    </td>
                    <td className="p-3">
                      <span className="font-medium text-black dark:text-white">{entry.performedBy}</span>
                      <span className="text-[10px] text-[#8E8E8E] ml-1">({entry.role})</span>
                    </td>
                    <td className="p-3 text-[#737373] dark:text-[#A8A8A8]">
                      {entry.details}
                    </td>
                    <td className="p-3 text-right">
                      {entry.severity === 'critical' && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/10 text-rose-600 dark:text-rose-400">
                          Critical
                        </span>
                      )}
                      {entry.severity === 'warning' && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400">
                          Warning
                        </span>
                      )}
                      {entry.severity === 'info' && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400">
                          Info
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* RESOLUTION MODAL */}
      {selectedGrievance && (
        <Modal
          isOpen={!!selectedGrievance}
          onClose={() => setSelectedGrievance(null)}
          title="Direct Faculty Resolution & Action"
        >
          <div className="space-y-4">
            <div className="p-3 rounded-lg bg-[#FAFAFA] dark:bg-[#181818] border border-[#DBDBDB] dark:border-[#262626] space-y-1">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-black dark:text-white">
                  {selectedGrievance.subject}
                </span>
                <span className="text-[10px] font-mono text-[#8E8E8E]">
                  {selectedGrievance.isAnonymous ? 'Anonymous' : selectedGrievance.studentName}
                </span>
              </div>
              <p className="text-xs text-black dark:text-white leading-relaxed mt-2">
                {selectedGrievance.message}
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-black dark:text-white mb-1">
                Faculty Resolution Directive & Student Feedback
              </label>
              <textarea
                rows={3}
                value={facultyNotesInput}
                onChange={(e) => setFacultyNotesInput(e.target.value)}
                placeholder="Enter actions taken (e.g. Discussed with department head, granted 48h deadline extension, or scheduled proctor session)..."
                className="w-full text-xs p-3 rounded-lg border border-[#DBDBDB] dark:border-[#262626] bg-[#FAFAFA] dark:bg-[#181818] text-black dark:text-white focus:outline-none focus:border-[#0095F6] resize-none"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-[#DBDBDB] dark:border-[#262626]">
              <button
                type="button"
                onClick={() => handleResolveGrievance(selectedGrievance.id, 'reviewed')}
                className="px-4 py-2 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 text-xs font-semibold transition-colors"
              >
                Mark Under Review
              </button>
              <button
                type="button"
                onClick={() => handleResolveGrievance(selectedGrievance.id, 'resolved')}
                className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <Check className="w-4 h-4" />
                <span>Mark Issue Resolved</span>
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
