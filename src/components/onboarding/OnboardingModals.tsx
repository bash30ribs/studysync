import React, { useState } from 'react';
import { useStudySync } from '../../store';
import { 
  Copy, 
  Check, 
  Share2, 
  ArrowRight, 
  Sparkles,
  ShieldCheck,
  Mail,
  Crown,
  Users,
  Key
} from 'lucide-react';
import { Modal } from '../common/Feedback';

export const CreateClassModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}> = ({ isOpen, onClose, onSuccess }) => {
  const { createClass, showToast } = useStudySync();

  const [step, setStep] = useState<1 | 2 | 3>(1); // 1 = Details, 2 = Email OTP, 3 = Success
  const [crName, setCrName] = useState('Aarav Sharma');
  const [crEmail, setCrEmail] = useState('aarav.sharma@college.edu');
  const [className, setClassName] = useState('MECH-3A');
  const [otp, setOtp] = useState('849201');
  const [generatedCode, setGeneratedCode] = useState('');
  const [copied, setCopied] = useState(false);

  const handleProceedToOTP = (e: React.FormEvent) => {
    e.preventDefault();
    if (!className.trim() || !crName.trim() || !crEmail.trim()) return;
    setStep(2);
    showToast(`Verification code dispatched to ${crEmail}`, 'info');
  };

  const handleVerifyAndGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    const code = createClass(className, crName, crEmail);
    setGeneratedCode(code);
    setStep(3);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(generatedCode);
    setCopied(true);
    showToast(`Code ${generatedCode} copied!`, 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShareClipboard = () => {
    const shareMessage = `Join our official ${className.toUpperCase()} class on StudySync!\nClass Code: ${generatedCode}\nLink: https://studysync.app/join`;
    navigator.clipboard.writeText(shareMessage);
    showToast('Class invitation template copied to clipboard!', 'success');
  };

  const handleEnterDashboard = () => {
    onClose();
    setTimeout(() => onSuccess(), 0);
    setStep(1);
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={step === 1 ? "Create New Class" : step === 2 ? "Verify Institutional Email" : "Class Created Successfully"}
    >
      {step === 1 ? (
        <form onSubmit={handleProceedToOTP} className="space-y-4">
          <p className="text-xs text-[#737373] dark:text-[#A8A8A8]">
            As Class Representative (CR), you will control class assignments, official broadcasts, attendance registry, and cohort compliance.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-black dark:text-white mb-1">
                Your Full Name
              </label>
              <input
                type="text"
                required
                value={crName}
                onChange={(e) => setCrName(e.target.value)}
                placeholder="e.g. Aarav Sharma"
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-[#DBDBDB] dark:border-[#262626] bg-[#FAFAFA] dark:bg-[#121212] text-black dark:text-white focus:outline-none focus:border-[#0095F6]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-black dark:text-white mb-1">
                College Email
              </label>
              <input
                type="email"
                required
                value={crEmail}
                onChange={(e) => setCrEmail(e.target.value)}
                placeholder="e.g. aarav.s@college.edu"
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-[#DBDBDB] dark:border-[#262626] bg-[#FAFAFA] dark:bg-[#121212] text-black dark:text-white focus:outline-none focus:border-[#0095F6]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-black dark:text-white mb-1">
              Class Designation Name
            </label>
            <input
              type="text"
              required
              value={className}
              onChange={(e) => setClassName(e.target.value)}
              placeholder="e.g. MECH-3A, CSE-4B, ECE-2C"
              className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-[#DBDBDB] dark:border-[#262626] bg-[#FAFAFA] dark:bg-[#121212] text-black dark:text-white focus:outline-none focus:border-[#0095F6]"
            />
          </div>

          <div className="p-3 rounded-xl bg-[#0095F6]/10 border border-[#0095F6]/20 text-[11px] text-black dark:text-white">
            <span className="font-bold text-[#0095F6] block mb-0.5">CR Security:</span>
            A unique 6-character access code will be generated following instant email OTP verification.
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-[#DBDBDB] dark:border-[#262626] text-xs font-semibold text-neutral-600 dark:text-neutral-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-[#0095F6] hover:bg-[#1877F2] text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
            >
              <span>Continue to Verification</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
      ) : step === 2 ? (
        /* STEP 2: EMAIL OTP VERIFICATION */
        <form onSubmit={handleVerifyAndGenerate} className="space-y-4">
          <div className="p-4 rounded-xl bg-neutral-50 dark:bg-[#161616] border border-[#DBDBDB] dark:border-[#262626] flex items-center gap-3">
            <Mail className="w-5 h-5 text-[#0095F6] shrink-0" />
            <div className="min-w-0">
              <span className="text-xs font-bold text-black dark:text-white block">
                Verification Code Sent
              </span>
              <p className="text-[11px] text-[#737373] dark:text-[#A8A8A8] truncate">
                Enter the 6-digit code sent to <strong className="text-black dark:text-white">{crEmail}</strong>
              </p>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-black dark:text-white mb-1">
              6-Digit OTP Code
            </label>
            <input
              type="text"
              required
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full text-center font-mono text-2xl font-black tracking-widest px-3 py-2.5 rounded-xl border border-[#DBDBDB] dark:border-[#262626] bg-[#FAFAFA] dark:bg-[#121212] text-[#0095F6] focus:outline-none focus:border-[#0095F6]"
            />
          </div>

          <div className="flex items-center justify-between text-xs text-[#737373] dark:text-[#A8A8A8]">
            <span>Didn't receive code?</span>
            <button
              type="button"
              onClick={() => showToast('New OTP dispatched to inbox', 'info')}
              className="font-bold text-[#0095F6] hover:underline"
            >
              Resend OTP
            </button>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="px-4 py-2 rounded-xl border border-[#DBDBDB] dark:border-[#262626] text-xs font-semibold text-neutral-600 dark:text-neutral-400"
            >
              Back
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-[#0095F6] hover:bg-[#1877F2] text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Verify & Create Class</span>
            </button>
          </div>
        </form>
      ) : (
        /* STEP 3: SHARE CARD WITH QR CODE & CODE */
        <div className="space-y-4">
          <div className="p-6 rounded-2xl bg-neutral-900 text-white text-center space-y-3 border border-neutral-800 shadow-xl">
            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">
              Official Class Access Code
            </span>

            <div className="font-mono text-3xl font-extrabold tracking-widest text-[#0095F6] bg-black py-3 px-6 rounded-xl border border-neutral-800 inline-block select-all shadow-inner">
              {generatedCode}
            </div>

            <p className="text-xs text-neutral-400">
              Class: <span className="text-white font-bold">{className.toUpperCase()}</span> · CR: {crName}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleCopyCode}
              className="py-2.5 px-3 rounded-xl border border-[#DBDBDB] dark:border-[#262626] bg-white dark:bg-[#121212] hover:bg-neutral-50 dark:hover:bg-[#181818] text-xs font-bold text-black dark:text-white flex items-center justify-center gap-1.5 transition-colors shadow-xs"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-[#0095F6]" /> : <Copy className="w-3.5 h-3.5 text-[#8E8E8E]" />}
              <span>{copied ? 'Copied' : 'Copy Code'}</span>
            </button>

            <button
              onClick={handleShareClipboard}
              className="py-2.5 px-3 rounded-xl border border-[#DBDBDB] dark:border-[#262626] bg-white dark:bg-[#121212] hover:bg-neutral-50 dark:hover:bg-[#181818] text-xs font-bold text-black dark:text-white flex items-center justify-center gap-1.5 transition-colors shadow-xs"
            >
              <Share2 className="w-3.5 h-3.5 text-[#0095F6]" />
              <span>Share Invite</span>
            </button>
          </div>

          <button
            onClick={handleEnterDashboard}
            className="w-full py-2.5 px-4 rounded-xl bg-[#0095F6] hover:bg-[#1877F2] text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-md transition-all"
          >
            <span>Enter CR Dashboard</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </Modal>
  );
};

export const JoinClassModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}> = ({ isOpen, onClose, onSuccess }) => {
  const { currentClass, joinClass, showToast } = useStudySync();

  const [studentName, setStudentName] = useState('Ishan Patel');
  const [studentEmail, setStudentEmail] = useState('ishan.p@college.edu');
  const [code, setCode] = useState(() => currentClass?.code || '7F2K9Q');
  const [errorMessage, setErrorMessage] = useState('');

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const cleanCode = (code || '').trim();
    const cleanName = (studentName || '').trim();
    const cleanEmail = (studentEmail || '').trim();

    if (!cleanCode || !cleanName || !cleanEmail) return;

    const res = joinClass(cleanCode, cleanName, cleanEmail);
    if (res.success) {
      onClose();
      setTimeout(() => onSuccess(), 0);
    } else {
      setErrorMessage(res.error || 'Code not found. Check with your CR.');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Join Class with Access Code">
      <form onSubmit={handleJoin} className="space-y-4">
        <p className="text-xs text-[#737373] dark:text-[#A8A8A8]">
          Enter your student details and the 6-character alphanumeric code provided by your Class Representative.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-black dark:text-white mb-1">
              Your Full Name
            </label>
            <input
              type="text"
              required
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              placeholder="e.g. Ishan Patel"
              className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-[#DBDBDB] dark:border-[#262626] bg-[#FAFAFA] dark:bg-[#121212] text-black dark:text-white focus:outline-none focus:border-[#0095F6]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-black dark:text-white mb-1">
              College Email
            </label>
            <input
              type="email"
              required
              value={studentEmail}
              onChange={(e) => setStudentEmail(e.target.value)}
              placeholder="e.g. ishan.p@college.edu"
              className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-[#DBDBDB] dark:border-[#262626] bg-[#FAFAFA] dark:bg-[#121212] text-black dark:text-white focus:outline-none focus:border-[#0095F6]"
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-xs font-bold text-black dark:text-white">
              6-Character Class Code
            </label>
            <button
              type="button"
              onClick={() => {
                setCode('7F2K9Q');
                setErrorMessage('');
              }}
              className="text-[11px] text-[#0095F6] hover:underline font-semibold"
            >
              Fill Demo Code (7F2K9Q)
            </button>
          </div>
          <input
            type="text"
            required
            maxLength={6}
            value={code}
            onChange={(e) => {
              setCode(e.target.value.toUpperCase());
              setErrorMessage('');
            }}
            placeholder="e.g. 7F2K9Q"
            className="w-full text-center font-mono text-xl font-extrabold tracking-widest px-3 py-3 rounded-xl border border-[#DBDBDB] dark:border-[#262626] bg-[#FAFAFA] dark:bg-[#121212] text-[#0095F6] focus:outline-none focus:border-[#0095F6]"
          />
        </div>

        {errorMessage && (
          <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/30 text-xs text-rose-600 dark:text-rose-400 font-semibold text-center">
            {errorMessage}
          </div>
        )}

        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-[#DBDBDB] dark:border-[#262626] text-xs font-semibold text-neutral-600 dark:text-neutral-400"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2 rounded-xl bg-[#0095F6] hover:bg-[#1877F2] text-white text-xs font-bold shadow-sm transition-all"
          >
            Join Class
          </button>
        </div>
      </form>
    </Modal>
  );
};

export const FastLoginModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onEnterApp: () => void;
  onOpenJoin: () => void;
  onOpenCreate: () => void;
}> = ({ isOpen, onClose, onEnterApp, onOpenJoin, onOpenCreate }) => {
  const { switchRole, allUsers, currentClass } = useStudySync();

  if (!isOpen) return null;

  const crUser = allUsers.find(u => u.role === 'CR') || {
    id: 'user-cr-1',
    name: 'Aarav Sharma',
    email: 'aarav.sharma@college.edu',
    role: 'CR'
  };

  const studentUser = allUsers.find(u => u.role === 'Student') || {
    id: 'user-stu-1',
    name: 'Ishan Patel',
    email: 'ishan.p@college.edu',
    role: 'Student',
    rollNo: '23ME014'
  };

  const handleLoginCR = () => {
    switchRole('CR', crUser.id);
    onClose();
    setTimeout(() => onEnterApp(), 0);
  };

  const handleLoginStudent = () => {
    switchRole('Student', studentUser.id);
    onClose();
    setTimeout(() => onEnterApp(), 0);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Log In & Select Persona">
      <div className="space-y-4">
        <p className="text-xs text-[#737373] dark:text-[#A8A8A8]">
          Choose an instant role to enter the <strong className="text-black dark:text-white">{currentClass?.name || 'MECH-3A'}</strong> workspace immediately:
        </p>

        {/* 1. CR Option */}
        <div 
          onClick={handleLoginCR}
          className="p-4 rounded-xl border border-[#0095F6]/40 bg-[#0095F6]/5 hover:bg-[#0095F6]/10 transition-all cursor-pointer flex items-center justify-between group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#0095F6] text-white flex items-center justify-center font-bold text-sm shadow-sm">
              <Crown className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-black dark:text-white">{crUser.name}</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#0095F6] text-white">CR</span>
              </div>
              <p className="text-xs text-[#737373] dark:text-[#A8A8A8]">
                {crUser.email} · Full Class Coordination Privileges
              </p>
            </div>
          </div>
          <button className="px-3 py-1.5 rounded-lg bg-[#0095F6] text-white text-xs font-bold group-hover:bg-[#1877F2] transition-colors">
            Enter as CR
          </button>
        </div>

        {/* 2. Student Option */}
        <div 
          onClick={handleLoginStudent}
          className="p-4 rounded-xl border border-[#DBDBDB] dark:border-[#262626] bg-[#FAFAFA] dark:bg-[#161616] hover:border-neutral-400 dark:hover:border-neutral-600 transition-all cursor-pointer flex items-center justify-between group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-neutral-800 text-white flex items-center justify-center font-bold text-sm shadow-sm">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-black dark:text-white">{studentUser.name}</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-neutral-200 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200">Student</span>
              </div>
              <p className="text-xs text-[#737373] dark:text-[#A8A8A8]">
                {studentUser.email} · Task Submissions & Attendance
              </p>
            </div>
          </div>
          <button className="px-3 py-1.5 rounded-lg border border-[#DBDBDB] dark:border-[#262626] text-xs font-semibold text-black dark:text-white hover:bg-white dark:hover:bg-black transition-colors">
            Enter as Student
          </button>
        </div>

        {/* Other actions */}
        <div className="pt-2 border-t border-[#DBDBDB] dark:border-[#262626] flex items-center justify-between text-xs">
          <button
            onClick={() => {
              onClose();
              onOpenJoin();
            }}
            className="flex items-center gap-1.5 text-[#0095F6] hover:underline font-semibold"
          >
            <Key className="w-3.5 h-3.5" />
            <span>Join with 6-digit code</span>
          </button>

          <button
            onClick={() => {
              onClose();
              onOpenCreate();
            }}
            className="text-neutral-500 hover:text-black dark:hover:text-white transition-colors"
          >
            Create new class
          </button>
        </div>
      </div>
    </Modal>
  );
};
