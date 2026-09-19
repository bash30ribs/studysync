import React, { useState } from 'react';
import { useStudySync } from '../../store';
import { 
  Copy, 
  Check, 
  Share2, 
  ArrowRight, 
  Sparkles,
  ShieldCheck,
  Mail
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
    // Defer onSuccess so React fully flushes all state setters from createClass
    // before the landing page unmounts and the app shell tries to render.
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
          <p className="text-xs text-[#64748B] dark:text-[#94A3B8]">
            As Class Representative (CR), you will control class assignments, official broadcasts, and submission tracking.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#0F2044] dark:text-white mb-1">
                Your Full Name
              </label>
              <input
                type="text"
                required
                value={crName}
                onChange={(e) => setCrName(e.target.value)}
                placeholder="e.g. Aarav Sharma"
                className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-[#E2E8F0] dark:border-[#1E293B] bg-[#F8FAFC] dark:bg-[#080D1A] text-[#0F2044] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#00B4A6]/20 focus:border-[#00B4A6] dark:focus:border-[#00D2C4]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#0F2044] dark:text-white mb-1">
                College Email
              </label>
              <input
                type="email"
                required
                value={crEmail}
                onChange={(e) => setCrEmail(e.target.value)}
                placeholder="e.g. aarav.s@college.edu"
                className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-[#E2E8F0] dark:border-[#1E293B] bg-[#F8FAFC] dark:bg-[#080D1A] text-[#0F2044] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#00B4A6]/20 focus:border-[#00B4A6] dark:focus:border-[#00D2C4]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#0F2044] dark:text-white mb-1">
              Class Designation Name
            </label>
            <input
              type="text"
              required
              value={className}
              onChange={(e) => setClassName(e.target.value)}
              placeholder="e.g. MECH-3A, CSE-4B, ECE-2C"
              className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-[#E2E8F0] dark:border-[#1E293B] bg-[#F8FAFC] dark:bg-[#080D1A] text-[#0F2044] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#00B4A6]/20 focus:border-[#00B4A6] dark:focus:border-[#00D2C4]"
            />
          </div>

          <div className="p-3 rounded-xl bg-[#E6F8F6] dark:bg-[#00D2C4]/10 border border-[#00B4A6]/20 text-[11px] text-[#0F2044] dark:text-[#F8FAFC]">
            <span className="font-bold text-[#00897B] dark:text-[#00D2C4] block mb-0.5">CR Security:</span>
            A unique 6-character access code will be generated following instant email OTP verification.
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-[#E2E8F0] dark:border-[#1E293B] text-xs font-semibold text-[#64748B] dark:text-[#94A3B8]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-[#00B4A6] dark:bg-[#00D2C4] hover:bg-[#009E91] dark:hover:bg-[#00B4A6] text-white dark:text-[#080D1A] text-xs font-extrabold flex items-center gap-1.5 shadow-xs"
            >
              <span>Continue to Verification</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
      ) : step === 2 ? (
        /* STEP 2: EMAIL OTP VERIFICATION */
        <form onSubmit={handleVerifyAndGenerate} className="space-y-4">
          <div className="p-4 rounded-xl bg-[#F8FAFC] dark:bg-[#15203B]/60 border border-[#E2E8F0] dark:border-[#1E293B] flex items-center gap-3">
            <Mail className="w-5 h-5 text-[#00B4A6] dark:text-[#00D2C4] shrink-0" />
            <div className="min-w-0">
              <span className="text-xs font-bold text-[#0F2044] dark:text-white block">
                Verification Code Sent
              </span>
              <p className="text-[11px] text-[#64748B] dark:text-[#94A3B8] truncate">
                Enter the 6-digit code sent to <strong className="text-[#0F2044] dark:text-white">{crEmail}</strong>
              </p>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#0F2044] dark:text-white mb-1">
              6-Digit OTP Code
            </label>
            <input
              type="text"
              required
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full text-center font-mono text-2xl font-black tracking-widest px-3 py-2.5 rounded-xl border border-[#E2E8F0] dark:border-[#1E293B] bg-[#F8FAFC] dark:bg-[#080D1A] text-[#00897B] dark:text-[#00D2C4] focus:outline-none focus:ring-2 focus:ring-[#00B4A6]"
            />
          </div>

          <div className="flex items-center justify-between text-xs text-[#64748B] dark:text-[#94A3B8]">
            <span>Didn't receive code?</span>
            <button
              type="button"
              onClick={() => showToast('New OTP dispatched to inbox', 'info')}
              className="font-bold text-[#00B4A6] dark:text-[#00D2C4] hover:underline"
            >
              Resend OTP
            </button>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="px-4 py-2 rounded-lg border border-[#E2E8F0] dark:border-[#1E293B] text-xs font-semibold text-[#64748B] dark:text-[#94A3B8]"
            >
              Back
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-[#00B4A6] dark:bg-[#00D2C4] hover:bg-[#009E91] dark:hover:bg-[#00B4A6] text-white dark:text-[#080D1A] text-xs font-extrabold flex items-center gap-1.5 shadow-xs"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Verify & Create Class</span>
            </button>
          </div>
        </form>
      ) : (
        /* STEP 3: SHARE CARD WITH QR CODE & CODE */
        <div className="space-y-4">
          <div className="p-6 rounded-2xl bg-[#0F2044] dark:bg-[#080D1A] text-white text-center space-y-3 border border-[#193166] dark:border-[#1E293B] shadow-xl">
            <span className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider block">
              Official Class Access Code
            </span>

            <div className="font-mono text-3xl font-extrabold tracking-widest text-[#00B4A6] dark:text-[#00D2C4] bg-[#193166] dark:bg-[#15203B] py-3 px-6 rounded-xl border border-[#25427C] dark:border-[#1E293B] inline-block select-all shadow-inner">
              {generatedCode}
            </div>

            <p className="text-xs text-[#94A3B8]">
              Class: <span className="text-white font-bold">{className.toUpperCase()}</span> · CR: {crName}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleCopyCode}
              className="py-2.5 px-3 rounded-lg border border-[#E2E8F0] dark:border-[#1E293B] bg-white dark:bg-[#080D1A] hover:bg-[#F8FAFC] dark:hover:bg-[#15203B] text-xs font-bold text-[#0F2044] dark:text-white flex items-center justify-center gap-1.5 transition-colors shadow-xs"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-[#00B4A6] dark:text-[#00D2C4]" /> : <Copy className="w-3.5 h-3.5 text-[#64748B] dark:text-[#94A3B8]" />}
              <span>{copied ? 'Copied' : 'Copy Code'}</span>
            </button>

            <button
              onClick={handleShareClipboard}
              className="py-2.5 px-3 rounded-lg border border-[#E2E8F0] dark:border-[#1E293B] bg-white dark:bg-[#080D1A] hover:bg-[#F8FAFC] dark:hover:bg-[#15203B] text-xs font-bold text-[#0F2044] dark:text-white flex items-center justify-center gap-1.5 transition-colors shadow-xs"
            >
              <Share2 className="w-3.5 h-3.5 text-[#00B4A6] dark:text-[#00D2C4]" />
              <span>Share Invite</span>
            </button>
          </div>

          <button
            onClick={handleEnterDashboard}
            className="w-full py-2.5 px-4 rounded-lg bg-[#00B4A6] dark:bg-[#00D2C4] hover:bg-[#009E91] dark:hover:bg-[#00B4A6] text-white dark:text-[#080D1A] text-xs font-extrabold flex items-center justify-center gap-1.5 shadow-md transition-all"
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
  const [code, setCode] = useState(currentClass.code);
  const [errorMessage, setErrorMessage] = useState('');

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!code.trim() || !studentName.trim() || !studentEmail.trim()) return;

    const res = joinClass(code, studentName, studentEmail);
    if (res.success) {
      onClose();
      // Defer onSuccess so React fully flushes all state setters from joinClass
      // before the landing page unmounts and the app shell tries to render.
      setTimeout(() => onSuccess(), 0);
    } else {
      setErrorMessage(res.error || 'Code not found. Check with your CR.');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Join Class with Access Code">
      <form onSubmit={handleJoin} className="space-y-4">
        <p className="text-xs text-[#64748B] dark:text-[#94A3B8]">
          Enter your student details and the 6-character alphanumeric code provided by your Class Representative.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-[#0F2044] dark:text-white mb-1">
              Your Full Name
            </label>
            <input
              type="text"
              required
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              placeholder="e.g. Ishan Patel"
              className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-[#E2E8F0] dark:border-[#1E293B] bg-[#F8FAFC] dark:bg-[#080D1A] text-[#0F2044] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#00B4A6]/20 focus:border-[#00B4A6] dark:focus:border-[#00D2C4]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#0F2044] dark:text-white mb-1">
              College Email
            </label>
            <input
              type="email"
              required
              value={studentEmail}
              onChange={(e) => setStudentEmail(e.target.value)}
              placeholder="e.g. ishan.p@college.edu"
              className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-[#E2E8F0] dark:border-[#1E293B] bg-[#F8FAFC] dark:bg-[#080D1A] text-[#0F2044] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#00B4A6]/20 focus:border-[#00B4A6] dark:focus:border-[#00D2C4]"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-[#0F2044] dark:text-white mb-1">
            6-Character Class Code
          </label>
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
            className="w-full text-center font-mono text-xl font-extrabold tracking-widest px-3 py-3 rounded-xl border border-[#E2E8F0] dark:border-[#1E293B] bg-[#F8FAFC] dark:bg-[#080D1A] text-[#00897B] dark:text-[#00D2C4] focus:outline-none focus:ring-2 focus:ring-[#00B4A6]/20 focus:border-[#00B4A6]"
          />
        </div>

        {errorMessage && (
          <div className="p-3 rounded-lg bg-[#FDECEC] dark:bg-[#E63946]/15 border border-[#E63946]/30 text-xs text-[#E63946] dark:text-[#FB7185] font-bold text-center">
            {errorMessage}
          </div>
        )}

        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-[#E2E8F0] dark:border-[#1E293B] text-xs font-semibold text-[#64748B] dark:text-[#94A3B8]"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2 rounded-lg bg-[#00B4A6] dark:bg-[#00D2C4] hover:bg-[#009E91] dark:hover:bg-[#00B4A6] text-white dark:text-[#080D1A] text-xs font-extrabold shadow-xs"
          >
            Join Class
          </button>
        </div>
      </form>
    </Modal>
  );
};;
