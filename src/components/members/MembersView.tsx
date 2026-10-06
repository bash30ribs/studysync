import React, { useState } from 'react';
import { useStudySync } from '../../store';
import { User } from '../../types';
import { 
  Search, 
  Download, 
  Trash2,
  Users,
  UserPlus,
  GraduationCap,
  Copy,
  Check,
  LogIn,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  Building,
  Shield,
  Eye
} from 'lucide-react';
import { Modal } from '../common/Feedback';
import { 
  POPULAR_DEPARTMENTS, 
  FACULTY_DESIGNATIONS, 
  generateStudentRollNo, 
  generateStudentUid, 
  generateTeacherUid 
} from '../../utils/edutrackUid';

export const MembersView: React.FC = () => {
  const { 
    allUsers, 
    assignments, 
    submissions, 
    selectedStudentId, 
    setSelectedStudentId, 
    setIsRightPanelOpen, 
    removeUser,
    addStudent,
    addFaculty,
    switchRole,
    exportMembersCSV,
    showToast
  } = useStudySync();

  // Navigation & Filtering
  const [activeTab, setActiveTab] = useState<'students' | 'faculty' | 'all'>('students');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState<string>('ALL');
  const [showAtRiskOnly, setShowAtRiskOnly] = useState(false);

  // Modals state
  const [isAddStudentOpen, setIsAddStudentOpen] = useState(false);
  const [isAddFacultyOpen, setIsAddFacultyOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<{ id: string; name: string; role: string } | null>(null);
  const [generatedCredentials, setGeneratedCredentials] = useState<{ user: User; tempPassword?: string } | null>(null);

  // Form states - Add Student
  const [studentName, setStudentName] = useState('');
  const [studentDept, setStudentDept] = useState('CSE');
  const [studentRollNo, setStudentRollNo] = useState('');
  const [studentEmail, setStudentEmail] = useState('');
  const [studentPhone, setStudentPhone] = useState('');
  const [studentGuardianPhone, setStudentGuardianPhone] = useState('');

  // Form states - Add Faculty
  const [facultyName, setFacultyName] = useState('');
  const [facultyDept, setFacultyDept] = useState('CSE');
  const [facultyDesignation, setFacultyDesignation] = useState('Assistant Professor');
  const [facultyOffice, setFacultyOffice] = useState('');
  const [facultyEmail, setFacultyEmail] = useState('');
  const [facultyPhone, setFacultyPhone] = useState('');

  // Clipboard copy state
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    showToast('Copied to clipboard!', 'info');
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // Student list & computations
  const studentList = allUsers.filter(u => u.role === 'Student');
  const facultyList = allUsers.filter(u => u.role === 'Faculty');

  // EWS (Early Warning System) computation inspired by EduTrack
  const getStudentEWS = (stu: User) => {
    const totalAsg = assignments.length;
    const submittedCount = submissions.filter(s => s.studentId === stu.id && s.status === 'submitted').length;
    const submissionRate = totalAsg > 0 ? (submittedCount / totalAsg) * 100 : 100;
    const attendanceRate = stu.attendanceRate !== undefined ? stu.attendanceRate : 88;

    if (attendanceRate < 75 || (totalAsg >= 2 && submittedCount === 0)) {
      return { status: 'danger', label: 'High Risk (EWS)', color: 'text-rose-600 dark:text-rose-400 bg-rose-500/10 border-rose-500/30' };
    }
    if (attendanceRate < 80 || submissionRate < 50) {
      return { status: 'warning', label: 'Monitor', color: 'text-amber-600 dark:text-amber-400 bg-amber-500/10 border-amber-500/30' };
    }
    return { status: 'good', label: 'On Track', color: 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/30' };
  };

  // Filtered lists
  const filterUser = (u: User) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = !q || 
      u.name.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      (u.rollNo && u.rollNo.toLowerCase().includes(q)) ||
      (u.uid && u.uid.toLowerCase().includes(q)) ||
      (u.department && u.department.toLowerCase().includes(q));

    const matchesDept = selectedDept === 'ALL' || (u.department || 'CSE').toUpperCase() === selectedDept;

    if (showAtRiskOnly && u.role === 'Student') {
      const ews = getStudentEWS(u);
      if (ews.status === 'good') return false;
    }

    return matchesSearch && matchesDept;
  };

  const filteredStudents = studentList.filter(filterUser);
  const filteredFaculty = facultyList.filter(filterUser);
  const filteredAll = allUsers.filter(filterUser);

  const handleSelectStudent = (id: string) => {
    setSelectedStudentId(id);
    setIsRightPanelOpen(true);
  };

  const handleAutoGenerateRollNo = () => {
    const generated = generateStudentRollNo(studentDept, allUsers);
    setStudentRollNo(generated);
    showToast(`Generated roll number: ${generated}`, 'info');
  };

  const handleCreateStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName.trim()) {
      showToast('Student name is required', 'error');
      return;
    }

    const created = addStudent({
      name: studentName,
      department: studentDept,
      rollNo: studentRollNo,
      email: studentEmail,
      phone: studentPhone,
      guardianPhone: studentGuardianPhone
    });

    setIsAddStudentOpen(false);
    setStudentName('');
    setStudentRollNo('');
    setStudentEmail('');
    setStudentPhone('');
    setStudentGuardianPhone('');

    // Open credentials modal
    setGeneratedCredentials({ user: created, tempPassword: created.tempPassword });
  };

  const handleCreateFaculty = (e: React.FormEvent) => {
    e.preventDefault();
    if (!facultyName.trim()) {
      showToast('Faculty name is required', 'error');
      return;
    }

    const created = addFaculty({
      name: facultyName,
      department: facultyDept,
      designation: facultyDesignation,
      officeRoom: facultyOffice,
      email: facultyEmail,
      phone: facultyPhone
    });

    setIsAddFacultyOpen(false);
    setFacultyName('');
    setFacultyOffice('');
    setFacultyEmail('');
    setFacultyPhone('');

    // Open credentials modal
    setGeneratedCredentials({ user: created, tempPassword: created.tempPassword });
  };

  const confirmDelete = () => {
    if (userToDelete) {
      removeUser(userToDelete.id);
      setUserToDelete(null);
    }
  };

  return (
    <div className="p-4 lg:p-7 space-y-6 max-w-7xl mx-auto">
      {/* ── Top Header Bar ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl lg:text-2xl font-bold text-black dark:text-white tracking-tight">
              Class Roster & Members
            </h1>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#0095F6]/10 text-[#0095F6] border border-[#0095F6]/30">
              <span className="sr-only">EduTrack Integration</span>
              <span aria-hidden="true">RFC Directory Protocol</span>
            </span>
          </div>
          <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-0.5">
            Manage enrolled students, monitor overall submission rates, and inspect student activity.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setIsAddStudentOpen(true)}
            id="btn-add-student"
            className="btn-primary flex items-center gap-1.5 shadow-xs text-xs cursor-pointer"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Add Student</span>
          </button>

          <button
            onClick={() => setIsAddFacultyOpen(true)}
            id="btn-add-faculty"
            className="btn-secondary flex items-center gap-1.5 text-xs cursor-pointer"
          >
            <GraduationCap className="w-3.5 h-3.5 text-[#0095F6]" />
            <span>Add Faculty</span>
          </button>

          <button
            onClick={exportMembersCSV}
            title="Export full directory as CSV"
            className="btn-secondary flex items-center gap-1.5 text-xs cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-neutral-500 dark:text-neutral-400" />
            <span>Export Roster (CSV)</span>
          </button>
        </div>
      </div>

      {/* ── Directory Tabs & Stats ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#DBDBDB] dark:border-[#262626]">
        <div className="flex items-center gap-2 sm:gap-6 overflow-x-auto pb-px">
          <button
            onClick={() => setActiveTab('students')}
            className={`pb-3 text-xs sm:text-sm font-semibold flex items-center gap-2 transition-colors relative cursor-pointer ${
              activeTab === 'students'
                ? 'text-[#0095F6] border-b-2 border-[#0095F6]'
                : 'text-neutral-500 hover:text-black dark:hover:text-white'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Students</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono bg-neutral-100 dark:bg-[#1E1E1E] text-neutral-600 dark:text-neutral-300">
              {studentList.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('faculty')}
            className={`pb-3 text-xs sm:text-sm font-semibold flex items-center gap-2 transition-colors relative cursor-pointer ${
              activeTab === 'faculty'
                ? 'text-[#0095F6] border-b-2 border-[#0095F6]'
                : 'text-neutral-500 hover:text-black dark:hover:text-white'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>Faculty & Teachers</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono bg-neutral-100 dark:bg-[#1E1E1E] text-neutral-600 dark:text-neutral-300">
              {facultyList.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('all')}
            className={`pb-3 text-xs sm:text-sm font-semibold flex items-center gap-2 transition-colors relative cursor-pointer ${
              activeTab === 'all'
                ? 'text-[#0095F6] border-b-2 border-[#0095F6]'
                : 'text-neutral-500 hover:text-black dark:hover:text-white'
            }`}
          >
            <Shield className="w-4 h-4" />
            <span>All Directory</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono bg-neutral-100 dark:bg-[#1E1E1E] text-neutral-600 dark:text-neutral-300">
              {allUsers.length}
            </span>
          </button>
        </div>

        {/* EWS At-Risk Quick Filter for Students */}
        {activeTab === 'students' && (
          <button
            onClick={() => setShowAtRiskOnly(prev => !prev)}
            className={`text-xs px-2.5 py-1 rounded-lg border transition-all flex items-center gap-1.5 cursor-pointer self-start sm:self-auto mb-2 sm:mb-0 ${
              showAtRiskOnly
                ? 'bg-rose-500/10 border-rose-500/40 text-rose-600 dark:text-rose-400 font-semibold'
                : 'border-[#DBDBDB] dark:border-[#262626] bg-white dark:bg-[#121212] text-neutral-600 dark:text-neutral-300 hover:text-black dark:hover:text-white'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
            <span>{showAtRiskOnly ? 'Showing At-Risk Students Only' : 'Filter At-Risk Students (EWS)'}</span>
          </button>
        )}
      </div>

      {/* ── Search & Filter Controls ── */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, roll no, email, or UID..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-[#DBDBDB] dark:border-[#262626] bg-white dark:bg-[#121212] text-black dark:text-white placeholder-neutral-400 focus:outline-none focus:border-[#0095F6] shadow-xs"
          />
        </div>

        {/* Department Filter */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-neutral-500 dark:text-neutral-400 hidden md:inline">Dept:</span>
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="px-3 py-1.5 text-xs rounded-xl border border-[#DBDBDB] dark:border-[#262626] bg-white dark:bg-[#121212] text-black dark:text-white focus:outline-none focus:border-[#0095F6] cursor-pointer"
          >
            <option value="ALL">All Departments</option>
            {POPULAR_DEPARTMENTS.map(d => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>
      </div>

      {/* ── Table Container ── */}
      <div className="ui-card overflow-hidden">
        <div className="overflow-x-auto">
          {activeTab === 'students' ? (
            /* STUDENTS TABLE */
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#DBDBDB] dark:border-[#262626] bg-[#FAFAFA] dark:bg-[#121212] text-[10px] font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                  <th className="py-3 px-4 sm:px-6">Student</th>
                  <th className="py-3 px-4">Roll Number</th>
                  <th className="py-3 px-4">Department</th>
                  <th className="py-3 px-4">EWS Health</th>
                  <th className="py-3 px-4">Submission Rate</th>
                  <th className="py-3 px-4">Last Active</th>
                  <th className="py-3 px-4 sm:px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#DBDBDB] dark:divide-[#262626] text-xs">
                {filteredStudents.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-16 text-center">
                      <div className="flex flex-col items-center justify-center space-y-2">
                        <Users className="w-8 h-8 text-[#8E8E8E] mx-auto mb-1" />
                        <p className="text-sm font-semibold text-black dark:text-white">
                          No students found matching your criteria.
                        </p>
                        <p className="text-xs text-neutral-500">
                          Click "+ Add Student" to register a student with an institutional UID.
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredStudents.map(stu => {
                    const isSelected = selectedStudentId === stu.id;
                    const totalAsg = assignments.length;
                    const submittedCount = submissions.filter(s => s.studentId === stu.id && s.status === 'submitted').length;
                    const ratePercent = totalAsg > 0 ? Math.round((submittedCount / totalAsg) * 100) : 0;
                    const ews = getStudentEWS(stu);

                    return (
                      <tr
                        key={stu.id}
                        onClick={() => handleSelectStudent(stu.id)}
                        className={`cursor-pointer transition-colors ${
                          isSelected
                            ? 'bg-neutral-100 dark:bg-[#1C1C1C] font-medium'
                            : 'hover:bg-neutral-50 dark:hover:bg-[#181818]'
                        }`}
                      >
                        {/* Name & Avatar */}
                        <td className="py-3.5 px-4 sm:px-6">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-[#0095F6]/10 text-[#0095F6] flex items-center justify-center font-bold text-xs shrink-0 border border-[#0095F6]/20">
                              {stu.name.charAt(0)}
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-1.5">
                                <p className="font-semibold text-sm text-black dark:text-white truncate">
                                  {stu.name}
                                </p>
                                {stu.uid && (
                                  <span className="font-mono text-[9px] px-1.5 py-0.2 rounded bg-neutral-100 dark:bg-[#222] text-neutral-500 border border-[#DBDBDB] dark:border-[#333]">
                                    {stu.uid}
                                  </span>
                                )}
                              </div>
                              <p className="text-[11px] text-neutral-500 dark:text-neutral-400 truncate">
                                {stu.email}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Roll No */}
                        <td className="py-3.5 px-4 font-mono font-semibold text-black dark:text-white">
                          {stu.rollNo || 'N/A'}
                        </td>

                        {/* Department */}
                        <td className="py-3.5 px-4">
                          <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-neutral-100 dark:bg-[#1A1A1A] text-neutral-700 dark:text-neutral-300 border border-[#DBDBDB] dark:border-[#262626]">
                            {stu.department || 'CSE'}
                          </span>
                        </td>

                        {/* EWS Health Status */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-1.5">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${ews.color}`}>
                              {ews.label}
                            </span>
                            <span className="text-[10px] text-neutral-500 font-mono">
                              ({stu.attendanceRate || 88}%)
                            </span>
                          </div>
                        </td>

                        {/* Submission Rate Bar */}
                        <td className="py-3.5 px-4">
                          <div className="w-32 space-y-1">
                            <div className="flex items-center justify-between text-[11px]">
                              <span className="font-mono text-black dark:text-white font-semibold">
                                {submittedCount}/{totalAsg}
                              </span>
                              <span className="font-mono font-bold text-[#0095F6]">
                                {ratePercent}%
                              </span>
                            </div>
                            <div className="w-full h-1.5 rounded-full bg-neutral-200 dark:bg-[#262626] overflow-hidden">
                              <div
                                className="h-full bg-[#0095F6] progress-bar-fill rounded-full"
                                style={{ width: `${ratePercent}%` }}
                              />
                            </div>
                          </div>
                        </td>

                        {/* Last Active */}
                        <td className="py-3.5 px-4 text-neutral-500 dark:text-neutral-400 text-[11px]">
                          {stu.lastActive}
                        </td>

                        {/* Actions */}
                        <td className="py-3.5 px-4 sm:px-6 text-right" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => switchRole('Student', stu.id)}
                              title={`Switch view to test as ${stu.name}`}
                              className="p-1.5 rounded-lg text-neutral-500 hover:text-[#0095F6] hover:bg-neutral-100 dark:hover:bg-[#262626] transition-colors cursor-pointer"
                            >
                              <LogIn className="w-3.5 h-3.5" />
                            </button>

                            <button
                              onClick={() => handleSelectStudent(stu.id)}
                              title="Inspect student submission records"
                              className="p-1.5 rounded-lg text-neutral-500 hover:text-black dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-[#262626] transition-colors cursor-pointer"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>

                            <button
                              onClick={() => setUserToDelete({ id: stu.id, name: stu.name, role: 'Student' })}
                              title="Remove student from class"
                              className="p-1.5 rounded-lg text-neutral-400 hover:text-[#ED4956] hover:bg-neutral-100 dark:hover:bg-[#262626] transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          ) : activeTab === 'faculty' ? (
            /* FACULTY TABLE */
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#DBDBDB] dark:border-[#262626] bg-[#FAFAFA] dark:bg-[#121212] text-[10px] font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                  <th className="py-3 px-4 sm:px-6">Faculty Member</th>
                  <th className="py-3 px-4">Department</th>
                  <th className="py-3 px-4">Designation</th>
                  <th className="py-3 px-4">Office / Cabin</th>
                  <th className="py-3 px-4">Contact Phone</th>
                  <th className="py-3 px-4">Joined Date</th>
                  <th className="py-3 px-4 sm:px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#DBDBDB] dark:divide-[#262626] text-xs">
                {filteredFaculty.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-16 text-center">
                      <div className="flex flex-col items-center justify-center space-y-2">
                        <GraduationCap className="w-8 h-8 text-[#8E8E8E] mx-auto mb-1" />
                        <p className="text-sm font-semibold text-black dark:text-white">
                          No faculty members found.
                        </p>
                        <p className="text-xs text-neutral-500">
                          Click "+ Add Faculty" to onboard teachers and department in-charges.
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredFaculty.map(fac => (
                    <tr
                      key={fac.id}
                      className="hover:bg-neutral-50 dark:hover:bg-[#181818] transition-colors"
                    >
                      {/* Name & Avatar */}
                      <td className="py-3.5 px-4 sm:px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold text-xs shrink-0 border border-purple-500/20">
                            {fac.name.charAt(0)}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <p className="font-semibold text-sm text-black dark:text-white truncate">
                                {fac.name}
                              </p>
                              {fac.uid && (
                                <span className="font-mono text-[9px] px-1.5 py-0.2 rounded bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 font-semibold">
                                  {fac.uid}
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-neutral-500 dark:text-neutral-400 truncate">
                              {fac.email}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Department */}
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-neutral-100 dark:bg-[#1A1A1A] text-neutral-700 dark:text-neutral-300 border border-[#DBDBDB] dark:border-[#262626]">
                          {fac.department || 'CSE'}
                        </span>
                      </td>

                      {/* Designation */}
                      <td className="py-3.5 px-4 font-medium text-black dark:text-white">
                        {fac.designation || 'Faculty Incharge'}
                      </td>

                      {/* Office Room */}
                      <td className="py-3.5 px-4 text-neutral-500 dark:text-neutral-400 text-xs">
                        <div className="flex items-center gap-1">
                          <Building className="w-3.5 h-3.5 text-neutral-400" />
                          <span>{fac.officeRoom || 'Cabin 204'}</span>
                        </div>
                      </td>

                      {/* Phone */}
                      <td className="py-3.5 px-4 text-neutral-500 dark:text-neutral-400 font-mono text-[11px]">
                        {fac.phone || '+91 98765-43210'}
                      </td>

                      {/* Joined Date */}
                      <td className="py-3.5 px-4 text-neutral-500 dark:text-neutral-400 font-mono text-[11px]">
                        {new Date(fac.joinedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 sm:px-6 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => switchRole('Faculty', fac.id)}
                            title={`Switch view to test as ${fac.name}`}
                            className="p-1.5 rounded-lg text-neutral-500 hover:text-purple-600 hover:bg-neutral-100 dark:hover:bg-[#262626] transition-colors cursor-pointer"
                          >
                            <LogIn className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => setUserToDelete({ id: fac.id, name: fac.name, role: 'Faculty' })}
                            title="Remove faculty member"
                            className="p-1.5 rounded-lg text-neutral-400 hover:text-[#ED4956] hover:bg-neutral-100 dark:hover:bg-[#262626] transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          ) : (
            /* ALL DIRECTORY TABLE */
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#DBDBDB] dark:border-[#262626] bg-[#FAFAFA] dark:bg-[#121212] text-[10px] font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                  <th className="py-3 px-4 sm:px-6">Member</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Portal UID</th>
                  <th className="py-3 px-4">Department</th>
                  <th className="py-3 px-4">Last Active</th>
                  <th className="py-3 px-4 sm:px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#DBDBDB] dark:divide-[#262626] text-xs">
                {filteredAll.map(u => (
                  <tr key={u.id} className="hover:bg-neutral-50 dark:hover:bg-[#181818] transition-colors">
                    <td className="py-3.5 px-4 sm:px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-neutral-200 dark:bg-[#262626] text-black dark:text-white flex items-center justify-center font-bold text-xs shrink-0">
                          {u.name.charAt(0)}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-sm text-black dark:text-white truncate">
                            {u.name}
                          </p>
                          <p className="text-[11px] text-neutral-500 dark:text-neutral-400 truncate">
                            {u.email}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        u.role === 'CR' 
                          ? 'bg-[#0095F6]/10 text-[#0095F6] border border-[#0095F6]/30'
                          : u.role === 'Faculty'
                          ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/30'
                          : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                      }`}>
                        {u.role}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 font-mono text-neutral-500 text-xs">
                      {u.uid || u.rollNo || 'N/A'}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-neutral-100 dark:bg-[#1A1A1A] text-neutral-700 dark:text-neutral-300 border border-[#DBDBDB] dark:border-[#262626]">
                        {u.department || 'CSE'}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-neutral-500 dark:text-neutral-400 text-xs">
                      {u.lastActive}
                    </td>

                    <td className="py-3.5 px-4 sm:px-6 text-right">
                      <button
                        onClick={() => switchRole(u.role, u.id)}
                        title={`Switch view to test as ${u.name}`}
                        className="p-1.5 rounded-lg text-neutral-500 hover:text-[#0095F6] hover:bg-neutral-100 dark:hover:bg-[#262626] transition-colors cursor-pointer"
                      >
                        <LogIn className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* ── MODAL 1: ADD STUDENT (EduTrack Style) ── */}
      <Modal
        isOpen={isAddStudentOpen}
        onClose={() => setIsAddStudentOpen(false)}
        title="Enroll New Student"
      >
        <form onSubmit={handleCreateStudent} className="space-y-4">
          <div className="flex items-center gap-2 p-2.5 rounded-xl bg-[#0095F6]/10 border border-[#0095F6]/20 text-[#0095F6] text-xs">
            <Sparkles className="w-4 h-4 shrink-0" />
            <span>RFC Directory: Automatic UID and secure credentials will be issued upon registration.</span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-black dark:text-white mb-1">
              Full Name <span className="text-[#ED4956]">*</span>
            </label>
            <input
              type="text"
              required
              id="student-name-input"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              placeholder="e.g. Wilson Gaikwad"
              className="w-full text-xs p-2.5 rounded-xl border border-[#DBDBDB] dark:border-[#262626] bg-white dark:bg-[#181818] text-black dark:text-white focus:outline-none focus:border-[#0095F6]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-black dark:text-white mb-1">
                Department
              </label>
              <select
                value={studentDept}
                onChange={(e) => setStudentDept(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-[#DBDBDB] dark:border-[#262626] bg-white dark:bg-[#181818] text-black dark:text-white focus:outline-none focus:border-[#0095F6]"
              >
                {POPULAR_DEPARTMENTS.map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-black dark:text-white">
                  Roll Number
                </label>
                <button
                  type="button"
                  onClick={handleAutoGenerateRollNo}
                  className="text-[10px] text-[#0095F6] hover:underline font-semibold cursor-pointer"
                >
                  ✨ Auto-Generate
                </button>
              </div>
              <input
                type="text"
                value={studentRollNo}
                onChange={(e) => setStudentRollNo(e.target.value)}
                placeholder="e.g. CSE26001"
                className="w-full text-xs p-2.5 rounded-xl border border-[#DBDBDB] dark:border-[#262626] bg-white dark:bg-[#181818] text-black dark:text-white focus:outline-none focus:border-[#0095F6] font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-black dark:text-white mb-1">
              Institutional Email (Optional)
            </label>
            <input
              type="email"
              value={studentEmail}
              onChange={(e) => setStudentEmail(e.target.value)}
              placeholder="Leave blank to auto-generate from Portal UID"
              className="w-full text-xs p-2.5 rounded-xl border border-[#DBDBDB] dark:border-[#262626] bg-white dark:bg-[#181818] text-black dark:text-white focus:outline-none focus:border-[#0095F6]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-black dark:text-white mb-1">
                Student Phone (Optional)
              </label>
              <input
                type="tel"
                value={studentPhone}
                onChange={(e) => setStudentPhone(e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full text-xs p-2.5 rounded-xl border border-[#DBDBDB] dark:border-[#262626] bg-white dark:bg-[#181818] text-black dark:text-white focus:outline-none focus:border-[#0095F6]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-black dark:text-white mb-1">
                Parent / Guardian Phone
              </label>
              <input
                type="tel"
                value={studentGuardianPhone}
                onChange={(e) => setStudentGuardianPhone(e.target.value)}
                placeholder="+91 83737 11116"
                className="w-full text-xs p-2.5 rounded-xl border border-[#DBDBDB] dark:border-[#262626] bg-white dark:bg-[#181818] text-black dark:text-white focus:outline-none focus:border-[#0095F6]"
              />
            </div>
          </div>

          {/* Real-time EduTrack UID preview */}
          {studentName.trim() && (
            <div className="p-3 rounded-xl bg-neutral-100 dark:bg-[#1C1C1C] border border-[#DBDBDB] dark:border-[#262626] text-xs flex items-center justify-between">
              <div>
                <span className="text-neutral-500 block text-[10px]">Predicted Institutional UID:</span>
                <span className="font-mono font-bold text-[#0095F6] text-sm">
                  {generateStudentUid(studentName, studentDept, allUsers)}
                </span>
              </div>
              <span className="text-[10px] text-neutral-400">Standard RFC-Academic UID</span>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-3 border-t border-[#DBDBDB] dark:border-[#262626]">
            <button
              type="button"
              onClick={() => setIsAddStudentOpen(false)}
              className="btn-secondary cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              id="submit-create-student"
              className="btn-primary flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Enroll Student & Issue Credentials</span>
            </button>
          </div>
        </form>
      </Modal>

      {/* ── MODAL 2: ADD FACULTY / TEACHER ── */}
      <Modal
        isOpen={isAddFacultyOpen}
        onClose={() => setIsAddFacultyOpen(false)}
        title="Add Faculty / Teacher"
      >
        <form onSubmit={handleCreateFaculty} className="space-y-4">
          <div className="flex items-center gap-2 p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-600 dark:text-purple-400 text-xs">
            <Sparkles className="w-4 h-4 shrink-0" />
            <span>Faculty Onboarding: Faculty UID (EMP-...) and institutional role will be assigned.</span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-black dark:text-white mb-1">
              Full Name <span className="text-[#ED4956]">*</span>
            </label>
            <input
              type="text"
              required
              id="faculty-name-input"
              value={facultyName}
              onChange={(e) => setFacultyName(e.target.value)}
              placeholder="e.g. Dr. Andrew Tate"
              className="w-full text-xs p-2.5 rounded-xl border border-[#DBDBDB] dark:border-[#262626] bg-white dark:bg-[#181818] text-black dark:text-white focus:outline-none focus:border-[#0095F6]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-black dark:text-white mb-1">
                Department
              </label>
              <select
                value={facultyDept}
                onChange={(e) => setFacultyDept(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-[#DBDBDB] dark:border-[#262626] bg-white dark:bg-[#181818] text-black dark:text-white focus:outline-none focus:border-[#0095F6]"
              >
                {POPULAR_DEPARTMENTS.map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-black dark:text-white mb-1">
                Designation
              </label>
              <select
                value={facultyDesignation}
                onChange={(e) => setFacultyDesignation(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-[#DBDBDB] dark:border-[#262626] bg-white dark:bg-[#181818] text-black dark:text-white focus:outline-none focus:border-[#0095F6]"
              >
                {FACULTY_DESIGNATIONS.map(des => (
                  <option key={des} value={des}>{des}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-black dark:text-white mb-1">
                Office / Cabin Room
              </label>
              <input
                type="text"
                value={facultyOffice}
                onChange={(e) => setFacultyOffice(e.target.value)}
                placeholder="e.g. Cabin 302, Academic Block"
                className="w-full text-xs p-2.5 rounded-xl border border-[#DBDBDB] dark:border-[#262626] bg-white dark:bg-[#181818] text-black dark:text-white focus:outline-none focus:border-[#0095F6]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-black dark:text-white mb-1">
                Contact Phone
              </label>
              <input
                type="tel"
                value={facultyPhone}
                onChange={(e) => setFacultyPhone(e.target.value)}
                placeholder="+91 98888 77777"
                className="w-full text-xs p-2.5 rounded-xl border border-[#DBDBDB] dark:border-[#262626] bg-white dark:bg-[#181818] text-black dark:text-white focus:outline-none focus:border-[#0095F6]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-black dark:text-white mb-1">
              Official Email (Optional)
            </label>
            <input
              type="email"
              value={facultyEmail}
              onChange={(e) => setFacultyEmail(e.target.value)}
              placeholder="Leave blank to auto-generate institutional email"
              className="w-full text-xs p-2.5 rounded-xl border border-[#DBDBDB] dark:border-[#262626] bg-white dark:bg-[#181818] text-black dark:text-white focus:outline-none focus:border-[#0095F6]"
            />
          </div>

          {/* Real-time EduTrack UID preview */}
          {facultyName.trim() && (
            <div className="p-3 rounded-xl bg-purple-500/5 border border-purple-500/20 text-xs flex items-center justify-between">
              <div>
                <span className="text-neutral-500 block text-[10px]">Predicted Faculty UID:</span>
                <span className="font-mono font-bold text-purple-600 dark:text-purple-400 text-sm">
                  {generateTeacherUid(facultyName, facultyDept, allUsers)}
                </span>
              </div>
              <span className="text-[10px] text-neutral-400">Employee Format</span>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-3 border-t border-[#DBDBDB] dark:border-[#262626]">
            <button
              type="button"
              onClick={() => setIsAddFacultyOpen(false)}
              className="btn-secondary cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              id="submit-create-faculty"
              className="btn-primary bg-purple-600 hover:bg-purple-700 flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Add Faculty & Generate Credentials</span>
            </button>
          </div>
        </form>
      </Modal>

      {/* ── MODAL 3: CREDENTIALS GENERATED CARD (EduTrack Card) ── */}
      <Modal
        isOpen={!!generatedCredentials}
        onClose={() => setGeneratedCredentials(null)}
        title="Access Credentials Generated"
      >
        {generatedCredentials && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-medium">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-500" />
              <span>
                Account successfully created! Save and share these credentials with the user.
              </span>
            </div>

            {/* Credential Slip Card */}
            <div className="p-4 rounded-xl border border-[#DBDBDB] dark:border-[#262626] bg-[#FAFAFA] dark:bg-[#181818] space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between border-b border-[#DBDBDB] dark:border-[#262626] pb-2">
                <span className="text-[10px] text-neutral-500 uppercase tracking-wider font-sans font-bold">
                  {generatedCredentials.user.role} Profile Slip
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] bg-[#0095F6]/10 text-[#0095F6] font-bold font-sans">
                  {generatedCredentials.user.department || 'CSE'}
                </span>
              </div>

              <div>
                <span className="text-neutral-400 text-[10px] block font-sans">Full Name:</span>
                <span className="font-bold text-black dark:text-white font-sans text-sm">
                  {generatedCredentials.user.name}
                </span>
              </div>

              {/* Portal UID */}
              <div className="flex items-center justify-between p-2 rounded-lg bg-white dark:bg-[#121212] border border-[#DBDBDB] dark:border-[#262626]">
                <div>
                  <span className="text-neutral-400 text-[10px] block font-sans">Institutional Portal UID:</span>
                  <span className="font-bold text-[#0095F6]">
                    {generatedCredentials.user.uid || generatedCredentials.user.id}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => copyToClipboard(generatedCredentials.user.uid || '', 'uid')}
                  className="p-1.5 rounded hover:bg-neutral-100 dark:hover:bg-[#222] transition-colors cursor-pointer text-neutral-500"
                  title="Copy UID"
                >
                  {copiedKey === 'uid' ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

              {/* Roll No / Designation */}
              {generatedCredentials.user.role === 'Student' ? (
                <div className="flex items-center justify-between p-2 rounded-lg bg-white dark:bg-[#121212] border border-[#DBDBDB] dark:border-[#262626]">
                  <div>
                    <span className="text-neutral-400 text-[10px] block font-sans">Roll Number:</span>
                    <span className="font-bold text-black dark:text-white">
                      {generatedCredentials.user.rollNo || 'N/A'}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(generatedCredentials.user.rollNo || '', 'roll')}
                    className="p-1.5 rounded hover:bg-neutral-100 dark:hover:bg-[#222] transition-colors cursor-pointer text-neutral-500"
                    title="Copy Roll Number"
                  >
                    {copiedKey === 'roll' ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              ) : (
                <div className="p-2 rounded-lg bg-white dark:bg-[#121212] border border-[#DBDBDB] dark:border-[#262626]">
                  <span className="text-neutral-400 text-[10px] block font-sans">Designation & Office:</span>
                  <span className="font-semibold text-black dark:text-white font-sans">
                    {generatedCredentials.user.designation} · {generatedCredentials.user.officeRoom}
                  </span>
                </div>
              )}

              {/* Login Email */}
              <div className="flex items-center justify-between p-2 rounded-lg bg-white dark:bg-[#121212] border border-[#DBDBDB] dark:border-[#262626]">
                <div>
                  <span className="text-neutral-400 text-[10px] block font-sans">Login Email:</span>
                  <span className="font-semibold text-black dark:text-white">
                    {generatedCredentials.user.email}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => copyToClipboard(generatedCredentials.user.email, 'email')}
                  className="p-1.5 rounded hover:bg-neutral-100 dark:hover:bg-[#222] transition-colors cursor-pointer text-neutral-500"
                  title="Copy Email"
                >
                  {copiedKey === 'email' ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

              {/* Temporary Password */}
              <div className="flex items-center justify-between p-2 rounded-lg bg-emerald-500/5 border border-emerald-500/20">
                <div>
                  <span className="text-neutral-400 text-[10px] block font-sans">Temporary Password:</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">
                    {generatedCredentials.tempPassword || 'StudySync@2026!'}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => copyToClipboard(generatedCredentials.tempPassword || 'StudySync@2026!', 'pwd')}
                  className="p-1.5 rounded hover:bg-neutral-100 dark:hover:bg-[#222] transition-colors cursor-pointer text-neutral-500"
                  title="Copy Password"
                >
                  {copiedKey === 'pwd' ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  const slip = `StudySync Access Credentials\nName: ${generatedCredentials.user.name}\nRole: ${generatedCredentials.user.role}\nPortal UID: ${generatedCredentials.user.uid || ''}\nRoll No: ${generatedCredentials.user.rollNo || ''}\nEmail: ${generatedCredentials.user.email}\nTemporary Password: ${generatedCredentials.tempPassword || ''}`;
                  copyToClipboard(slip, 'all');
                }}
                className="btn-secondary w-full sm:w-auto flex items-center justify-center gap-1.5 cursor-pointer text-xs"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>{copiedKey === 'all' ? 'Copied Full Slip!' : 'Copy Full Credentials'}</span>
              </button>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => {
                    switchRole(generatedCredentials.user.role, generatedCredentials.user.id);
                    setGeneratedCredentials(null);
                  }}
                  className="btn-primary w-full sm:w-auto flex items-center justify-center gap-1.5 cursor-pointer text-xs shadow-xs"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Test as {generatedCredentials.user.name}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setGeneratedCredentials(null)}
                  className="btn-secondary px-4 py-2 cursor-pointer text-xs"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* ── MODAL 4: CONFIRM REMOVAL ── */}
      <Modal
        isOpen={!!userToDelete}
        onClose={() => setUserToDelete(null)}
        title={`Confirm ${userToDelete?.role || 'Member'} Removal`}
      >
        <div className="space-y-4">
          <p className="text-xs sm:text-sm text-neutral-800 dark:text-neutral-200">
            Are you sure you want to remove <span className="font-bold">{userToDelete?.name}</span> from the class roster?
            Their active profile and associated records will be disconnected.
          </p>

          <div className="flex justify-end gap-2 pt-2">
            <button
              onClick={() => setUserToDelete(null)}
              className="btn-secondary cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={confirmDelete}
              className="px-4 py-2 rounded-xl bg-[#ED4956] hover:bg-red-600 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            >
              Remove {userToDelete?.role || 'Member'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
