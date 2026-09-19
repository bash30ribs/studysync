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
    allUsers,
    updateClassName, 
    updateUserDisplayName, 
    regenerateClassCode, 
    exportMembersCSV, 
    leaveClass, 
    resetDemoData,
    setActiveTrustPage,
    transferCR,
    archiveCurrentClass
  } = useStudySync();

  const [classNameInput, setClassNameInput] = useState(currentClass.name);
  const [displayNameInput, setDisplayNameInput] = useState(currentUser.name);
  const [isRegenerateModalOpen, setIsRegenerateModalOpen] = useState(false);
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);

  // Notification preferences — persisted to localStorage
  const [notifAssignment, setNotifAssignment] = useState(() => {
    try { return localStorage.getItem('studysync_notif_assignment') !== 'false'; } catch { return true; }
  });
  const [notifDeadline, setNotifDeadline] = useState(() => {
    try { return localStorage.getItem('studysync_notif_deadline') !== 'false'; } catch { return true; }
  });
  const [notifMessages, setNotifMessages] = useState(() => {
    try { return localStorage.getItem('studysync_notif_messages') !== 'false'; } catch { return true; }
  });

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
    <div className="p-4 lg:p-7 space-y-6 max-w-4xl mx-auto animate-in fade-in duration-150">
      {/* Header */}
      <div>
        <h1 className="text-xl lg:text-2xl font-bold text-black dark:text-white tracking-tight">
          System & Account Settings
        </h1>
        <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-0.5">
          Configure class parameters, security access codes, and notification preferences.
        </p>
      </div>

      {/* Profile Settings */}
      <div className="p-5 sm:p-6 ui-card space-y-4">
        <h2 className="font-bold text-sm text-black dark:text-white">
          Personal Profile
        </h2>

        <form onSubmit={handleUpdateProfile} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-black dark:text-white mb-1">
                Display Name
              </label>
              <input
                type="text"
                value={displayNameInput}
                onChange={(e) => setDisplayNameInput(e.target.value)}
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-[#DBDBDB] dark:border-[#262626] bg-white dark:bg-[#000000] text-black dark:text-white focus:outline-none focus:border-[#0095F6]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-black dark:text-white mb-1">
                Email Address
              </label>
              <input
                type="email"
                disabled
                value={currentUser.email}
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-[#DBDBDB] dark:border-[#262626] bg-neutral-100 dark:bg-[#1C1C1C] text-neutral-500 dark:text-neutral-400 cursor-not-allowed"
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
          <h2 className="font-bold text-sm text-black dark:text-white">
            Class Administration & CR Handover
          </h2>

          {/* CR Handover Tool */}
          <div className="p-4 rounded-xl bg-neutral-50 dark:bg-[#181818] border border-[#DBDBDB] dark:border-[#262626] space-y-3">
            <div>
              <span className="text-xs font-bold text-black dark:text-white block">
                Democratic CR Handover
              </span>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                Transfer full Class Representative authority to another enrolled student upon new semester election.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <select
                id="cr-handover-select"
                defaultValue=""
                className="flex-1 px-3 py-2 text-xs rounded-xl bg-white dark:bg-[#000000] border border-[#DBDBDB] dark:border-[#262626] text-black dark:text-white focus:outline-none focus:border-[#0095F6]"
              >
                <option value="" disabled>Select student to promote to CR...</option>
                {allUsers.filter(u => u.role === 'Student').map(s => (
                  <option key={s.id} value={s.id}>{s.name} ({s.rollNo})</option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => {
                  const selectEl = document.getElementById('cr-handover-select') as HTMLSelectElement;
                  if (selectEl?.value) {
                    transferCR(selectEl.value);
                  }
                }}
                className="btn-primary"
              >
                Transfer CR Role
              </button>
            </div>
          </div>

          {/* Semester Archiving */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-[#DBDBDB] dark:border-[#262626]">
            <div>
              <span className="text-xs font-bold text-black dark:text-white block">
                Semester Archiving
              </span>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                Lock class history in read-only mode for historical grade and submission audits.
              </p>
            </div>
            <button
              onClick={() => archiveCurrentClass()}
              className="btn-secondary self-start sm:self-auto"
            >
              Archive Class
            </button>
          </div>

          <div className="h-px bg-[#DBDBDB] dark:bg-[#262626]" />

          {/* Edit Class Name */}
          <form onSubmit={handleUpdateClassName} className="space-y-2">
            <label className="block text-xs font-bold text-black dark:text-white">
              Class Designation Name
            </label>
            <div className="flex items-center gap-2 max-w-md">
              <input
                type="text"
                value={classNameInput}
                onChange={(e) => setClassNameInput(e.target.value)}
                className="flex-1 text-xs px-3.5 py-2.5 rounded-xl border border-[#DBDBDB] dark:border-[#262626] bg-white dark:bg-[#000000] text-black dark:text-white focus:outline-none focus:border-[#0095F6]"
              />
              <button
                type="submit"
                className="btn-secondary"
              >
                Update Name
              </button>
            </div>
          </form>

          <div className="h-px bg-[#DBDBDB] dark:bg-[#262626]" />

          {/* Regenerate Class Code */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-xs font-bold text-black dark:text-white block">
                Class Access Code: <span className="font-mono text-[#0095F6] font-bold text-sm ml-1">{currentClass.code}</span>
              </span>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                Generate a new 6-character access key if security has been compromised.
              </p>
            </div>
            <button
              onClick={() => setIsRegenerateModalOpen(true)}
              className="btn-secondary self-start sm:self-auto"
            >
              <RotateCw className="w-3.5 h-3.5 text-[#0095F6]" />
              <span>Regenerate Code</span>
            </button>
          </div>
        </div>
      )}

      {/* Trust & Legal Links */}
      <div className="p-5 sm:p-6 ui-card space-y-3">
        <h2 className="font-bold text-sm text-black dark:text-white">
          Trust & Platform Governance
        </h2>
        <p className="text-xs text-neutral-500 dark:text-neutral-400">
          Review academic integrity compliance, GDPR-aware data practices, encryption standards, and live system latency.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-2">
          <button
            onClick={() => setActiveTrustPage('privacy')}
            className="btn-secondary py-2.5 text-xs text-center justify-center"
          >
            Privacy Policy
          </button>
          <button
            onClick={() => setActiveTrustPage('terms')}
            className="btn-secondary py-2.5 text-xs text-center justify-center"
          >
            Terms of Service
          </button>
          <button
            onClick={() => setActiveTrustPage('security')}
            className="btn-secondary py-2.5 text-xs text-center justify-center"
          >
            Security Architecture
          </button>
          <button
            onClick={() => setActiveTrustPage('status')}
            className="btn-secondary py-2.5 text-xs text-center justify-center"
          >
            Status Monitor
          </button>
          <button
            onClick={() => setActiveTrustPage('about')}
            className="btn-secondary py-2.5 text-xs text-center justify-center"
          >
            About Story
          </button>
        </div>
      </div>

      {/* Notification Preferences */}
      <div className="p-5 sm:p-6 ui-card space-y-3">
        <h2 className="font-bold text-sm text-black dark:text-white">
          Notification Preferences
        </h2>
        <p className="text-xs text-neutral-500 dark:text-neutral-400">
          These preferences control which in-app alerts appear for your account.
        </p>

        <div className="space-y-2 text-xs">
          <label className="flex items-center justify-between p-3 rounded-xl bg-neutral-50 dark:bg-[#181818] border border-[#DBDBDB] dark:border-[#262626] cursor-pointer">
            <span className="font-medium text-black dark:text-white">New Assignment Broadcasts</span>
            <input
              type="checkbox"
              checked={notifAssignment}
              onChange={e => {
                setNotifAssignment(e.target.checked);
                localStorage.setItem('studysync_notif_assignment', String(e.target.checked));
              }}
              className="w-4 h-4 text-[#0095F6] rounded focus:ring-[#0095F6]"
            />
          </label>
          <label className="flex items-center justify-between p-3 rounded-xl bg-neutral-50 dark:bg-[#181818] border border-[#DBDBDB] dark:border-[#262626] cursor-pointer">
            <span className="font-medium text-black dark:text-white">Approaching Deadline Reminders (24h &amp; 2h)</span>
            <input
              type="checkbox"
              checked={notifDeadline}
              onChange={e => {
                setNotifDeadline(e.target.checked);
                localStorage.setItem('studysync_notif_deadline', String(e.target.checked));
              }}
              className="w-4 h-4 text-[#0095F6] rounded focus:ring-[#0095F6]"
            />
          </label>
          <label className="flex items-center justify-between p-3 rounded-xl bg-neutral-50 dark:bg-[#181818] border border-[#DBDBDB] dark:border-[#262626] cursor-pointer">
            <span className="font-medium text-black dark:text-white">Direct Messages from CR</span>
            <input
              type="checkbox"
              checked={notifMessages}
              onChange={e => {
                setNotifMessages(e.target.checked);
                localStorage.setItem('studysync_notif_messages', String(e.target.checked));
              }}
              className="w-4 h-4 text-[#0095F6] rounded focus:ring-[#0095F6]"
            />
          </label>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="p-5 sm:p-6 ui-card border-[#ED4956]/40 dark:border-[#ED4956]/40 space-y-4">
        <div className="flex items-center gap-2 text-[#ED4956] font-bold text-sm">
          <ShieldAlert className="w-4 h-4" />
          <span>Danger Zone</span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <p className="text-xs font-bold text-black dark:text-white">
              Reset Demo Dataset
            </p>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              Restore all assignments, student roster, and broadcasts back to pristine MECH-3A demo state.
            </p>
          </div>
          <button
            onClick={() => setIsResetModalOpen(true)}
            className="btn-secondary text-xs self-start sm:self-auto"
          >
            <RefreshCw className="w-3.5 h-3.5 text-[#0095F6]" />
            <span>Reset Demo Data</span>
          </button>
        </div>

        {currentUser.role === 'Student' && (
          <div className="pt-3 border-t border-[#DBDBDB] dark:border-[#262626] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <p className="text-xs font-bold text-[#ED4956]">
                Leave Class
              </p>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Disconnect from {currentClass.name}. You will need the 6-character class code to rejoin.
              </p>
            </div>
            <button
              onClick={() => setIsLeaveModalOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-[#ED4956] hover:bg-red-600 text-white text-xs font-semibold flex items-center gap-1.5 self-start sm:self-auto shadow-xs transition-all"
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
          <p className="text-xs sm:text-sm text-black dark:text-white leading-relaxed">
            Are you sure you want to regenerate the class code for <span className="font-bold">{currentClass.name}</span>?
            The existing code <span className="font-mono text-[#0095F6] font-bold">{currentClass.code}</span> will be invalidated immediately.
          </p>

          <div className="flex justify-end gap-2 pt-2">
            <button
              onClick={() => setIsRegenerateModalOpen(false)}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmRegenerate}
              className="btn-primary"
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
          <p className="text-xs sm:text-sm text-black dark:text-white leading-relaxed">
            Are you sure you want to leave {currentClass.name}? You will lose real-time deadline synchronization.
          </p>
          <div className="flex justify-end gap-2 pt-2">
            <button
              onClick={() => setIsLeaveModalOpen(false)}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                leaveClass();
                setIsLeaveModalOpen(false);
              }}
              className="px-4 py-2 rounded-xl bg-[#ED4956] text-white text-xs font-semibold shadow-xs"
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
          <p className="text-xs sm:text-sm text-black dark:text-white leading-relaxed">
            This will reset all data back to the default MECH-3A demo state with 10 students and active assignments.
          </p>
          <div className="flex justify-end gap-2 pt-2">
            <button
              onClick={() => setIsResetModalOpen(false)}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                resetDemoData();
                setIsResetModalOpen(false);
              }}
              className="btn-primary"
            >
              Confirm Reset
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
