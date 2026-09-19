import React, { useState } from 'react';
import { useStudySync } from '../../store';
import { 
  RotateCw, 
  Download, 
  LogOut, 
  ShieldAlert, 
  RefreshCw 
} from 'lucide-react';
import { Modal } from '../common/Feedback';

export const SettingsView: React.FC = () => {
  const { 
    currentUser, 
    currentClass, 
    updateClassName, 
    updateUserDisplayName, 
    regenerateClassCode, 
    exportMembersCSV, 
    leaveClass, 
    resetDemoData
  } = useStudySync();

  const [classNameInput, setClassNameInput] = useState(currentClass.name);
  const [displayNameInput, setDisplayNameInput] = useState(currentUser.name);
  const [isRegenerateModalOpen, setIsRegenerateModalOpen] = useState(false);
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);

  const handleUpdateClassName = (e: React.FormEvent) => {
    e.preventDefault();
    updateClassName(classNameInput);
  };

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserDisplayName(displayNameInput);
  };

  const handleConfirmRegenerate = () => {
    regenerateClassCode();
    setIsRegenerateModalOpen(false);
  };

  return (
    <div className="p-4 lg:p-7 space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-xl lg:text-2xl font-extrabold text-[#0F2044] dark:text-white tracking-tight">
          System & Account Settings
        </h1>
        <p className="text-xs sm:text-sm text-[#64748B] dark:text-[#94A3B8] mt-0.5">
          Configure class parameters, security access codes, and notification preferences.
        </p>
      </div>

      {/* Profile Settings */}
      <div className="p-5 sm:p-6 rounded-xl bg-white dark:bg-[#0F172A] border border-[#E2E7F0] dark:border-[#1E293B] shadow-xs space-y-4">
        <h2 className="font-bold text-sm text-[#0F2044] dark:text-white">
          Personal Profile
        </h2>

        <form onSubmit={handleUpdateProfile} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#0F2044] dark:text-white mb-1">
                Display Name
              </label>
              <input
                type="text"
                value={displayNameInput}
                onChange={(e) => setDisplayNameInput(e.target.value)}
                className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-[#E2E7F0] dark:border-[#1E293B] bg-[#F8FAFC] dark:bg-[#080D1A] text-[#0F2044] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#00B4A6]/20 focus:border-[#00B4A6] dark:focus:border-[#00D2C4]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#0F2044] dark:text-white mb-1">
                Email Address
              </label>
              <input
                type="email"
                disabled
                value={currentUser.email}
                className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-[#E2E7F0] dark:border-[#1E293B] bg-[#F1F5F9]/70 dark:bg-[#1E293B]/50 text-[#64748B] dark:text-[#94A3B8] cursor-not-allowed"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="btn-primary"
            >
              Save Profile
            </button>
          </div>
        </form>
      </div>

      {/* CR Specific Settings: Handover & Archiving */}
      {currentUser.role === 'CR' && (
        <div className="p-5 sm:p-6 ui-card space-y-5">
          <h2 className="font-bold text-sm text-slate-900 dark:text-white">
            Class Administration & CR Handover
          </h2>

          {/* CR Handover Tool */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 space-y-3">
            <div>
              <span className="text-xs font-bold text-slate-900 dark:text-white block">
                Democratic CR Handover
              </span>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Transfer full Class Representative authority to another enrolled student upon new semester election.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <select
                id="cr-handover-select"
                defaultValue=""
                className="flex-1 px-3 py-2 text-xs rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
              >
                <option value="" disabled>Select student to promote to CR...</option>
                {useStudySync().allUsers.filter(u => u.role === 'Student').map(s => (
                  <option key={s.id} value={s.id}>{s.name} ({s.rollNo})</option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => {
                  const selectEl = document.getElementById('cr-handover-select') as HTMLSelectElement;
                  if (selectEl?.value) {
                    useStudySync().transferCR(selectEl.value);
                  }
                }}
                className="btn-primary"
              >
                Transfer CR Role
              </button>
            </div>
          </div>

          {/* Semester Archiving */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
            <div>
              <span className="text-xs font-bold text-slate-900 dark:text-white block">
                Semester Archiving
              </span>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Lock class history in read-only mode for historical grade and submission audits.
              </p>
            </div>
            <button
              onClick={() => useStudySync().archiveCurrentClass()}
              className="btn-secondary self-start sm:self-auto"
            >
              Archive Class
            </button>
          </div>

          <div className="h-px bg-slate-200 dark:bg-slate-800" />

          {/* Edit Class Name */}
          <form onSubmit={handleUpdateClassName} className="space-y-2">
            <label className="block text-xs font-bold text-slate-900 dark:text-white">
              Class Designation Name
            </label>
            <div className="flex items-center gap-2 max-w-md">
              <input
                type="text"
                value={classNameInput}
                onChange={(e) => setClassNameInput(e.target.value)}
                className="flex-1 text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
              />
              <button
                type="submit"
                className="btn-secondary"
              >
                Update Name
              </button>
            </div>
          </form>

          <div className="h-px bg-slate-200 dark:bg-slate-800" />

          {/* Regenerate Class Code */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-xs font-bold text-slate-900 dark:text-white block">
                Class Access Code: <span className="font-mono text-teal-600 dark:text-teal-400 font-bold text-sm ml-1">{currentClass.code}</span>
              </span>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Generate a new 6-character access key if security has been compromised.
              </p>
            </div>
            <button
              onClick={() => setIsRegenerateModalOpen(true)}
              className="btn-secondary self-start sm:self-auto"
            >
              <RotateCw className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
              <span>Regenerate Code</span>
            </button>
          </div>
        </div>
      )}

      {/* Trust & Legal Links */}
      <div className="p-5 sm:p-6 ui-card space-y-3">
        <h2 className="font-bold text-sm text-slate-900 dark:text-white">
          Trust & Platform Governance
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Review academic integrity compliance, GDPR-aware data practices, encryption standards, and live system latency.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-2">
          <button
            onClick={() => useStudySync().setActiveTrustPage('privacy')}
            className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-800 dark:text-slate-200 hover:border-teal-500 hover:text-teal-600 dark:hover:text-teal-300 transition-colors"
          >
            Privacy Policy
          </button>
          <button
            onClick={() => useStudySync().setActiveTrustPage('terms')}
            className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-800 dark:text-slate-200 hover:border-teal-500 hover:text-teal-600 dark:hover:text-teal-300 transition-colors"
          >
            Terms of Service
          </button>
          <button
            onClick={() => useStudySync().setActiveTrustPage('security')}
            className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-800 dark:text-slate-200 hover:border-teal-500 hover:text-teal-600 dark:hover:text-teal-300 transition-colors"
          >
            Security Architecture
          </button>
          <button
            onClick={() => useStudySync().setActiveTrustPage('status')}
            className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-800 dark:text-slate-200 hover:border-teal-500 hover:text-teal-600 dark:hover:text-teal-300 transition-colors"
          >
            Status Monitor
          </button>
          <button
            onClick={() => useStudySync().setActiveTrustPage('about')}
            className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-800 dark:text-slate-200 hover:border-teal-500 hover:text-teal-600 dark:hover:text-teal-300 transition-colors"
          >
            About Story
          </button>
        </div>
      </div>

      {/* Notification Preferences */}
      <div className="p-5 sm:p-6 rounded-xl bg-white dark:bg-[#0F172A] border border-[#E2E7F0] dark:border-[#1E293B] shadow-xs space-y-3">
        <h2 className="font-bold text-sm text-[#0F2044] dark:text-white">
          Notification Preferences
        </h2>

        <div className="space-y-2 text-xs">
          <label className="flex items-center justify-between p-3 rounded-lg bg-[#F8FAFC] dark:bg-[#080D1A] border border-[#E2E7F0] dark:border-[#1E293B] cursor-pointer">
            <span className="font-medium text-[#0F2044] dark:text-white">New Assignment Broadcasts</span>
            <input type="checkbox" defaultChecked className="w-4 h-4 text-[#00B4A6] rounded focus:ring-[#00B4A6]" />
          </label>
          <label className="flex items-center justify-between p-3 rounded-lg bg-[#F8FAFC] dark:bg-[#080D1A] border border-[#E2E7F0] dark:border-[#1E293B] cursor-pointer">
            <span className="font-medium text-[#0F2044] dark:text-white">Approaching Deadline Reminders (24h & 2h)</span>
            <input type="checkbox" defaultChecked className="w-4 h-4 text-[#00B4A6] rounded focus:ring-[#00B4A6]" />
          </label>
          <label className="flex items-center justify-between p-3 rounded-lg bg-[#F8FAFC] dark:bg-[#080D1A] border border-[#E2E7F0] dark:border-[#1E293B] cursor-pointer">
            <span className="font-medium text-[#0F2044] dark:text-white">Encrypted Direct Messages from CR</span>
            <input type="checkbox" defaultChecked className="w-4 h-4 text-[#00B4A6] rounded focus:ring-[#00B4A6]" />
          </label>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="p-5 sm:p-6 rounded-xl bg-white dark:bg-[#0F172A] border border-[#E63946]/40 dark:border-[#E63946]/30 shadow-xs space-y-4">
        <div className="flex items-center gap-2 text-[#E63946] dark:text-[#FB7185] font-bold text-sm">
          <ShieldAlert className="w-4 h-4" />
          <span>Danger Zone</span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <p className="text-xs font-bold text-[#0F2044] dark:text-white">
              Reset Demo Dataset
            </p>
            <p className="text-xs text-[#64748B] dark:text-[#94A3B8]">
              Restore all assignments, student roster, and broadcasts back to pristine MECH-3A demo state.
            </p>
          </div>
          <button
            onClick={() => setIsResetModalOpen(true)}
            className="px-3.5 py-2 rounded-lg bg-[#F8FAFC] dark:bg-[#080D1A] hover:bg-[#F1F5F9] dark:hover:bg-[#1E293B] text-xs font-bold text-[#0F2044] dark:text-white flex items-center gap-1.5 self-start sm:self-auto border border-[#E2E7F0] dark:border-[#1E293B] transition-all shadow-xs"
          >
            <RefreshCw className="w-3.5 h-3.5 text-[#00B4A6] dark:text-[#00D2C4]" />
            <span>Reset Demo Data</span>
          </button>
        </div>

        {currentUser.role === 'Student' && (
          <div className="pt-3 border-t border-[#E2E7F0] dark:border-[#1E293B] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <p className="text-xs font-bold text-[#E63946] dark:text-[#FB7185]">
                Leave Class
              </p>
              <p className="text-xs text-[#64748B] dark:text-[#94A3B8]">
                Disconnect from {currentClass.name}. You will need the 6-character class code to rejoin.
              </p>
            </div>
            <button
              onClick={() => setIsLeaveModalOpen(true)}
              className="px-3.5 py-2 rounded-lg bg-[#E63946] hover:bg-[#D62839] text-white text-xs font-bold flex items-center gap-1.5 self-start sm:self-auto shadow-xs transition-all"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Leave Class</span>
            </button>
          </div>
        )}
      </div>

      {/* Code Regeneration Warning Modal */}
      <Modal
        isOpen={isRegenerateModalOpen}
        onClose={() => setIsRegenerateModalOpen(false)}
        title="Regenerate Class Code"
      >
        <div className="space-y-4">
          <p className="text-xs sm:text-sm text-[#0F2044] dark:text-white leading-relaxed">
            Are you sure you want to regenerate the class code for <span className="font-bold">{currentClass.name}</span>?
            The existing code <span className="font-mono text-[#00897B] dark:text-[#00D2C4] font-bold">{currentClass.code}</span> will be invalidated immediately.
          </p>

          <div className="flex justify-end gap-2 pt-2">
            <button
              onClick={() => setIsRegenerateModalOpen(false)}
              className="px-4 py-2 rounded-lg border border-[#E2E7F0] dark:border-[#1E293B] text-xs font-semibold text-[#64748B] dark:text-[#94A3B8]"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmRegenerate}
              className="px-4 py-2 rounded-lg bg-[#00B4A6] dark:bg-[#00D2C4] text-white dark:text-[#080D1A] text-xs font-bold shadow-xs"
            >
              Confirm New Code
            </button>
          </div>
        </div>
      </Modal>

      {/* Leave Class Modal */}
      <Modal
        isOpen={isLeaveModalOpen}
        onClose={() => setIsLeaveModalOpen(false)}
        title="Confirm Leave Class"
      >
        <div className="space-y-4">
          <p className="text-xs sm:text-sm text-[#0F2044] dark:text-white leading-relaxed">
            Are you sure you want to leave {currentClass.name}? You will lose real-time deadline synchronization.
          </p>
          <div className="flex justify-end gap-2 pt-2">
            <button
              onClick={() => setIsLeaveModalOpen(false)}
              className="px-4 py-2 rounded-lg border border-[#E2E7F0] dark:border-[#1E293B] text-xs font-semibold text-[#64748B] dark:text-[#94A3B8]"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                leaveClass();
                setIsLeaveModalOpen(false);
              }}
              className="px-4 py-2 rounded-lg bg-[#E63946] text-white text-xs font-bold shadow-xs"
            >
              Confirm Leave
            </button>
          </div>
        </div>
      </Modal>

      {/* Reset Data Modal */}
      <Modal
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
        title="Reset Demo Dataset"
      >
        <div className="space-y-4">
          <p className="text-xs sm:text-sm text-[#0F2044] dark:text-white leading-relaxed">
            This will reset all data back to the default MECH-3A demo state with 10 students and active assignments.
          </p>
          <div className="flex justify-end gap-2 pt-2">
            <button
              onClick={() => setIsResetModalOpen(false)}
              className="px-4 py-2 rounded-lg border border-[#E2E7F0] dark:border-[#1E293B] text-xs font-semibold text-[#64748B] dark:text-[#94A3B8]"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                resetDemoData();
                setIsResetModalOpen(false);
              }}
              className="px-4 py-2 rounded-lg bg-[#00B4A6] dark:bg-[#00D2C4] text-white dark:text-[#080D1A] text-xs font-bold shadow-xs"
            >
              Confirm Reset
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
