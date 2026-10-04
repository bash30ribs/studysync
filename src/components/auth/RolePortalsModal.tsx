import React, { useState } from 'react';
import { useStudySync } from '../../store';
import { UserRole } from '../../types';
import { 
  GraduationCap, 
  Crown, 
  Users, 
  ShieldCheck, 
  ArrowRight, 
  Check, 
  Lock, 
  Search, 
  Sparkles, 
  AlertTriangle,
  FileCheck2,
  HeartHandshake,
  CheckCircle2,
  X
} from 'lucide-react';

interface RolePortalsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEnterApp?: () => void;
  initialRole?: UserRole;
}

export const RolePortalsModal: React.FC<RolePortalsModalProps> = ({
  isOpen,
  onClose,
  onEnterApp,
  initialRole = 'Faculty'
}) => {
  const { allUsers, switchRole, currentClass, showToast } = useStudySync();
  const [selectedRoleTab, setSelectedRoleTab] = useState<UserRole>(initialRole);
  const [studentSearch, setStudentSearch] = useState('');

  // Credentials / demo fields
  const [facultyEmail, setFacultyEmail] = useState('m.sundaram@college.edu');
  const [facultyPin, setFacultyPin] = useState('FAC-4091');
  const [crEmail, setCrEmail] = useState('ribhav.cr@college.edu');
  const [crPasscode, setCrPasscode] = useState('CR-7F2K');
  const [selectedStudentId, setSelectedStudentId] = useState<string>('user-stu-1');

  if (!isOpen) return null;

  const facultyUser = allUsers.find(u => u.role === 'Faculty') || {
    id: 'user-fac-1',
    name: 'Dr. Meenakshi Sundaram',
    email: 'm.sundaram@college.edu',
    role: 'Faculty',
    designation: 'Professor & Core Faculty Incharge'
  };

  const crUser = allUsers.find(u => u.role === 'CR') || {
    id: 'user-cr-1',
    name: 'Ribhav Sharma',
    email: 'ribhav.cr@college.edu',
    role: 'CR',
    rollNo: '23ME001'
  };

  const studentUsers = allUsers.filter(u => u.role === 'Student');

  const filteredStudents = studentUsers.filter(s => 
    s.name.toLowerCase().includes(studentSearch.toLowerCase()) ||
    (s.rollNo && s.rollNo.toLowerCase().includes(studentSearch.toLowerCase())) ||
    s.email.toLowerCase().includes(studentSearch.toLowerCase())
  );

  const handleEnterFaculty = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    switchRole('Faculty', facultyUser.id);
    showToast(`Welcome, Dr. Sundaram. Faculty Oversight Console unlocked.`, 'success');
    onClose();
    if (onEnterApp) onEnterApp();
  };

  const handleEnterCR = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    switchRole('CR', crUser.id);
    showToast(`Welcome, Ribhav! Class Coordination Console active.`, 'success');
    onClose();
    if (onEnterApp) onEnterApp();
  };

  const handleEnterStudent = (studentIdToUse?: string) => {
    const targetId = studentIdToUse || selectedStudentId;
    const targetStudent = studentUsers.find(s => s.id === targetId) || studentUsers[0];
    switchRole('Student', targetStudent.id);
    showToast(`Welcome ${targetStudent.name}! Student Workspace loaded.`, 'success');
    onClose();
    if (onEnterApp) onEnterApp();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="w-full max-w-4xl bg-white dark:bg-[#0F0F0F] border border-[#DBDBDB] dark:border-[#262626] rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        role="dialog"
        aria-modal="true"
      >
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-[#EAEAEA] dark:border-[#202020] flex items-center justify-between bg-[#FAFAFA] dark:bg-[#141414]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#0095F6] to-indigo-600 flex items-center justify-center text-white shadow-sm">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-black dark:text-white">
                  StudySync Institutional Access Portal
                </h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-bold border border-emerald-500/30">
                  Cohort {currentClass.name}
                </span>
              </div>
              <p className="text-xs text-[#737373] dark:text-[#A8A8A8] mt-0.5">
                Choose your authorized institutional persona. Permissions and views adapt in real-time.
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-xl text-[#737373] hover:text-black dark:hover:text-white hover:bg-[#EFEFEF] dark:hover:bg-[#1E1E1E] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 3 Portal Role Switcher Tabs */}
        <div className="px-6 pt-4 pb-2 bg-[#FAFAFA]/50 dark:bg-[#141414]/50 border-b border-[#EAEAEA] dark:border-[#202020]">
          <div className="grid grid-cols-3 gap-2 p-1 bg-[#EBEBEB] dark:bg-[#1E1E1E] rounded-2xl">
            {/* 1. Faculty Tab */}
            <button
              onClick={() => setSelectedRoleTab('Faculty')}
              className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold transition-all ${
                selectedRoleTab === 'Faculty'
                  ? 'bg-white dark:bg-[#0A0A0A] text-purple-600 dark:text-purple-400 shadow-sm border border-purple-500/30'
                  : 'text-[#737373] dark:text-[#A8A8A8] hover:text-black dark:hover:text-white'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>1. Core Faculty Incharge</span>
            </button>

            {/* 2. CR Tab */}
            <button
              onClick={() => setSelectedRoleTab('CR')}
              className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold transition-all ${
                selectedRoleTab === 'CR'
                  ? 'bg-white dark:bg-[#0A0A0A] text-[#0095F6] shadow-sm border border-[#0095F6]/30'
                  : 'text-[#737373] dark:text-[#A8A8A8] hover:text-black dark:hover:text-white'
              }`}
            >
              <Crown className="w-4 h-4 text-amber-500" />
              <span>2. Class Representative (CR)</span>
            </button>

            {/* 3. Student Tab */}
            <button
              onClick={() => setSelectedRoleTab('Student')}
              className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold transition-all ${
                selectedRoleTab === 'Student'
                  ? 'bg-white dark:bg-[#0A0A0A] text-emerald-600 dark:text-emerald-400 shadow-sm border border-emerald-500/30'
                  : 'text-[#737373] dark:text-[#A8A8A8] hover:text-black dark:hover:text-white'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>3. Student Cohort ({studentUsers.length})</span>
            </button>
          </div>
        </div>

        {/* Portal Body Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* ══════════════════════════════════════════════════════════
              PORTAL 1: CORE FACULTY INCHARGE
              ══════════════════════════════════════════════════════════ */}
          {selectedRoleTab === 'Faculty' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-purple-500/10 border border-purple-500/25">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-purple-600 text-white flex items-center justify-center font-bold text-lg shadow-sm shrink-0">
                    👨‍🏫
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-black dark:text-white">
                        {facultyUser.name}
                      </h3>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-purple-600 text-white">
                        FACULTY INCHARGE
                      </span>
                    </div>
                    <p className="text-xs text-[#737373] dark:text-[#A8A8A8] mt-0.5">
                      {facultyUser.designation} · {facultyUser.email}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleEnterFaculty()}
                  className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all shrink-0 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Launch Faculty Portal</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Exclusive Faculty Powers Banner */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400 mb-3 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Administrative Superpowers (Hidden from CR & Students)</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3.5 rounded-xl bg-[#FAFAFA] dark:bg-[#161616] border border-[#EAEAEA] dark:border-[#262626] space-y-1">
                    <div className="flex items-center gap-2 font-bold text-black dark:text-white">
                      <HeartHandshake className="w-4 h-4 text-rose-500 shrink-0" />
                      <span>Confidential Student Grievance Desk</span>
                    </div>
                    <p className="text-[11px] text-[#737373] dark:text-[#A8A8A8] leading-relaxed">
                      Review confidential and anonymous student distress messages that CRs and peers cannot access.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#FAFAFA] dark:bg-[#161616] border border-[#EAEAEA] dark:border-[#262626] space-y-1">
                    <div className="flex items-center gap-2 font-bold text-black dark:text-white">
                      <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
                      <span>At-Risk Student Intervention Engine</span>
                    </div>
                    <p className="text-[11px] text-[#737373] dark:text-[#A8A8A8] leading-relaxed">
                      Instant flags for students with attendance &lt; 75% or 3+ overdue tasks. Issue official academic alerts.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#FAFAFA] dark:bg-[#161616] border border-[#EAEAEA] dark:border-[#262626] space-y-1">
                    <div className="flex items-center gap-2 font-bold text-black dark:text-white">
                      <FileCheck2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>NEP 2020 Holistic Accreditation</span>
                    </div>
                    <p className="text-[11px] text-[#737373] dark:text-[#A8A8A8] leading-relaxed">
                      Sole authorization to sign off on student hackathons, clubs, certifications, and degree activity credits.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#FAFAFA] dark:bg-[#161616] border border-[#EAEAEA] dark:border-[#262626] space-y-1">
                    <div className="flex items-center gap-2 font-bold text-black dark:text-white">
                      <ShieldCheck className="w-4 h-4 text-indigo-500 shrink-0" />
                      <span>Cryptographic Compliance Audit Logs</span>
                    </div>
                    <p className="text-[11px] text-[#737373] dark:text-[#A8A8A8] leading-relaxed">
                      Immutable trail of attendance alterations, submission IP hashes, and CR broadcast delivery logs.
                    </p>
                  </div>
                </div>
              </div>

              {/* Quick Institutional Login Form */}
              <form onSubmit={handleEnterFaculty} className="p-4 rounded-2xl bg-[#FAFAFA] dark:bg-[#161616] border border-[#EAEAEA] dark:border-[#262626] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-black dark:text-white">Faculty Credentials Authentication</span>
                  <span className="text-[11px] text-purple-600 dark:text-purple-400 font-semibold">Institutional SSO Active</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-[#737373] dark:text-[#A8A8A8] mb-1">
                      Faculty Institutional Email
                    </label>
                    <input 
                      type="email" 
                      value={facultyEmail}
                      onChange={(e) => setFacultyEmail(e.target.value)}
                      className="w-full text-xs px-3 py-2 rounded-xl border border-[#DBDBDB] dark:border-[#2C2C2C] bg-white dark:bg-[#101010] text-black dark:text-white"
                      placeholder="m.sundaram@college.edu"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-[#737373] dark:text-[#A8A8A8] mb-1">
                      Faculty Keycard PIN
                    </label>
                    <input 
                      type="password" 
                      value={facultyPin}
                      onChange={(e) => setFacultyPin(e.target.value)}
                      className="w-full text-xs px-3 py-2 rounded-xl border border-[#DBDBDB] dark:border-[#2C2C2C] bg-white dark:bg-[#101010] text-black dark:text-white font-mono"
                      placeholder="••••••••"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Verify Credentials & Enter Faculty Console</span>
                </button>
              </form>
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════
              PORTAL 2: CLASS REPRESENTATIVE (CR)
              ══════════════════════════════════════════════════════════ */}
          {selectedRoleTab === 'CR' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-[#0095F6]/10 border border-[#0095F6]/25">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-[#0095F6] text-white flex items-center justify-center font-bold text-lg shadow-sm shrink-0">
                    <Crown className="w-6 h-6 text-amber-300" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-black dark:text-white">
                        {crUser.name}
                      </h3>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-[#0095F6] text-white">
                        CLASS REPRESENTATIVE
                      </span>
                    </div>
                    <p className="text-xs text-[#737373] dark:text-[#A8A8A8] mt-0.5">
                      Roll {crUser.rollNo} · {crUser.email} · Cohort Operations
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleEnterCR()}
                  className="px-5 py-2.5 rounded-xl bg-[#0095F6] hover:bg-[#1877F2] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all shrink-0 cursor-pointer"
                >
                  <Crown className="w-4 h-4 text-amber-300" />
                  <span>Launch CR Dashboard</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* CR Responsibilities */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#0095F6] mb-3 flex items-center gap-1.5">
                  <Crown className="w-4 h-4 text-amber-500" />
                  <span>CR Operational Toolkit</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3.5 rounded-xl bg-[#FAFAFA] dark:bg-[#161616] border border-[#EAEAEA] dark:border-[#262626] space-y-1">
                    <span className="font-bold text-black dark:text-white block">Task & Subtask Orchestration</span>
                    <p className="text-[11px] text-[#737373] dark:text-[#A8A8A8] leading-relaxed">
                      Publish tasks with step-by-step subtasks, mandatory checklists, and time budgets for the cohort.
                    </p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-[#FAFAFA] dark:bg-[#161616] border border-[#EAEAEA] dark:border-[#262626] space-y-1">
                    <span className="font-bold text-black dark:text-white block">Cohort Attendance Registry</span>
                    <p className="text-[11px] text-[#737373] dark:text-[#A8A8A8] leading-relaxed">
                      Mark daily subject sessions, generate absent lists, and export official CSV registers for the HOD.
                    </p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-[#FAFAFA] dark:bg-[#161616] border border-[#EAEAEA] dark:border-[#262626] space-y-1">
                    <span className="font-bold text-black dark:text-white block">Official Broadcasts & Nudges</span>
                    <p className="text-[11px] text-[#737373] dark:text-[#A8A8A8] leading-relaxed">
                      Send urgent announcements and trigger automated 1-click reminders to pending students.
                    </p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-[#FAFAFA] dark:bg-[#161616] border border-[#EAEAEA] dark:border-[#262626] space-y-1">
                    <span className="font-bold text-black dark:text-white block">Class Polls & Consensus</span>
                    <p className="text-[11px] text-[#737373] dark:text-[#A8A8A8] leading-relaxed">
                      Vote on reschedule slots, elective options, and industrial visit preferences with real-time tallying.
                    </p>
                  </div>
                </div>
              </div>

              {/* CR Form */}
              <form onSubmit={handleEnterCR} className="p-4 rounded-2xl bg-[#FAFAFA] dark:bg-[#161616] border border-[#EAEAEA] dark:border-[#262626] space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-[#737373] dark:text-[#A8A8A8] mb-1">
                      CR Email Address
                    </label>
                    <input 
                      type="email" 
                      value={crEmail}
                      onChange={(e) => setCrEmail(e.target.value)}
                      className="w-full text-xs px-3 py-2 rounded-xl border border-[#DBDBDB] dark:border-[#2C2C2C] bg-white dark:bg-[#101010] text-black dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-[#737373] dark:text-[#A8A8A8] mb-1">
                      Class Passcode ({currentClass.code})
                    </label>
                    <input 
                      type="password" 
                      value={crPasscode}
                      onChange={(e) => setCrPasscode(e.target.value)}
                      className="w-full text-xs px-3 py-2 rounded-xl border border-[#DBDBDB] dark:border-[#2C2C2C] bg-white dark:bg-[#101010] text-black dark:text-white font-mono"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-[#0095F6] hover:bg-[#1877F2] text-white font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Verify & Enter as Class Representative</span>
                </button>
              </form>
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════
              PORTAL 3: STUDENT COHORT
              ══════════════════════════════════════════════════════════ */}
          {selectedRoleTab === 'Student' && (
            <div className="space-y-5 animate-in fade-in duration-150">
              {/* Search & Student Filter */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-sm font-bold text-black dark:text-white">
                    Select Student Persona ({filteredStudents.length} of {studentUsers.length})
                  </h3>
                  <p className="text-xs text-[#737373] dark:text-[#A8A8A8]">
                    Click any student to view their personal tasks, subtask checklist, attendance gauge, and holistic growth.
                  </p>
                </div>

                <div className="relative w-full sm:w-64">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#737373]" />
                  <input
                    type="text"
                    value={studentSearch}
                    onChange={(e) => setStudentSearch(e.target.value)}
                    placeholder="Search name or roll number..."
                    className="w-full text-xs pl-8 pr-3 py-2 rounded-xl border border-[#DBDBDB] dark:border-[#2C2C2C] bg-white dark:bg-[#121212] text-black dark:text-white focus:outline-none focus:border-[#0095F6]"
                  />
                </div>
              </div>

              {/* Student Cards Grid (Scrollable list of 48 realistic students) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 max-h-[360px] overflow-y-auto pr-1">
                {filteredStudents.map((stu) => {
                  const isSelected = stu.id === selectedStudentId;
                  const points = stu.holisticPoints || 100;
                  return (
                    <div
                      key={stu.id}
                      onClick={() => {
                        setSelectedStudentId(stu.id);
                        handleEnterStudent(stu.id);
                      }}
                      className={`p-3 rounded-2xl border text-left cursor-pointer transition-all hover:scale-[1.01] ${
                        isSelected
                          ? 'bg-emerald-500/10 border-emerald-500/40 text-black dark:text-white'
                          : 'bg-[#FAFAFA] dark:bg-[#141414] border-[#EAEAEA] dark:border-[#222222] hover:border-neutral-400 dark:hover:border-neutral-600'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="text-xs font-bold truncate text-black dark:text-white">
                            {stu.name}
                          </p>
                          <p className="text-[10px] font-mono text-[#737373] dark:text-[#A8A8A8]">
                            {stu.rollNo} · {stu.lastActive}
                          </p>
                        </div>
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 shrink-0 font-mono">
                          {points} pts
                        </span>
                      </div>
                      <div className="mt-2 pt-2 border-t border-[#EAEAEA] dark:border-[#222222] flex items-center justify-between text-[10px] text-[#737373]">
                        <span className="truncate">{stu.email}</span>
                        <span className="text-[#0095F6] font-bold">Login &rarr;</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-[#EAEAEA] dark:border-[#202020] bg-[#FAFAFA] dark:bg-[#141414] flex items-center justify-between text-xs text-[#737373] dark:text-[#A8A8A8]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>50 Total Personas in Cohort MECH-3A (1 Faculty, 1 CR, 48 Students)</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-[#DBDBDB] dark:border-[#262626] font-semibold text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
