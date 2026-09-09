import React, { useState } from 'react';
import { useStudySync } from '../../store';
import { 
  X, 
  UploadCloud, 
  ShieldCheck, 
  CheckCircle2
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const SubmitDrawer: React.FC = () => {
  const { 
    currentUser, 
    assignments, 
    selectedAssignmentId, 
    isSubmitDrawerOpen, 
    setIsSubmitDrawerOpen, 
    submitAssignment,
    isOffline,
    showToast
  } = useStudySync();

  const [textNote, setTextNote] = useState('');
  const [fileName, setFileName] = useState(`${currentUser.name.replace(/\s+/g, '_')}_Assignment.pdf`);
  const [fileSize, setFileSize] = useState('2.4 MB');
  const [hasConfirmed, setHasConfirmed] = useState(true);

  if (!isSubmitDrawerOpen || !selectedAssignmentId) return null;

  const targetAsg = assignments.find(a => a.id === selectedAssignmentId);
  if (!targetAsg) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isOffline) {
      showToast('Cannot submit in offline mode. Reconnect first.', 'error');
      return;
    }

    submitAssignment(selectedAssignmentId, textNote, {
      name: fileName,
      size: fileSize
    });

    try {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#00B4A6', '#0F2044', '#F4A261']
      });
    } catch {
      // ignore
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white dark:bg-[#0F172A] w-full max-w-lg rounded-2xl border border-[#E2E7F0] dark:border-[#1E293B] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E2E7F0] dark:border-[#1E293B] bg-[#F8FAFC]/60 dark:bg-[#15203B]/40">
          <div>
            <h3 className="text-base font-extrabold text-[#0F2044] dark:text-white">
              Submit Assignment
            </h3>
            <p className="text-xs text-[#64748B] dark:text-[#94A3B8] mt-0.5 truncate max-w-sm font-medium">
              {targetAsg.title} · {targetAsg.subject}
            </p>
          </div>
          <button
            onClick={() => setIsSubmitDrawerOpen(false)}
            className="text-[#64748B] hover:text-[#0F2044] dark:text-[#94A3B8] dark:hover:text-white p-1 rounded-lg hover:bg-[#F1F5F9] dark:hover:bg-[#1E293B] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* File Upload zone */}
          <div>
            <label className="block text-xs font-bold text-[#0F2044] dark:text-white mb-1.5">
              Upload Document / Solution Sheet
            </label>
            <div
              onClick={() => {
                setFileName(`${currentUser.name.replace(/\s+/g, '_')}_Final_Solution.pdf`);
                setFileSize('3.1 MB');
              }}
              className="border-2 border-dashed border-[#00B4A6]/50 dark:border-[#00D2C4]/40 bg-[#E6F8F6]/20 dark:bg-[#00D2C4]/5 rounded-xl p-5 text-center cursor-pointer hover:bg-[#E6F8F6]/40 dark:hover:bg-[#00D2C4]/10 transition-colors"
            >
              <div className="flex flex-col items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-[#E6F8F6] dark:bg-[#00D2C4]/20 text-[#00897B] dark:text-[#00D2C4] flex items-center justify-center shadow-xs">
                  <UploadCloud className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-[#0F2044] dark:text-white">
                    {fileName}
                  </p>
                  <p className="text-[11px] text-[#64748B] dark:text-[#94A3B8] mt-0.5">
                    {fileSize} · PDF, DOCX, DWG or ZIP accepted
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Submission Note */}
          <div>
            <label className="block text-xs font-bold text-[#0F2044] dark:text-white mb-1">
              Submission Comments / Notes (Optional)
            </label>
            <textarea
              rows={2}
              value={textNote}
              onChange={(e) => setTextNote(e.target.value)}
              placeholder="e.g. Completed all derivations with step diagrams."
              className="w-full text-xs p-3 rounded-lg border border-[#E2E7F0] dark:border-[#1E293B] bg-[#F8FAFC] dark:bg-[#080D1A] text-[#0F2044] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#00B4A6]/20 focus:border-[#00B4A6] resize-none"
            />
          </div>

          {/* Tamper Evident Verification Box */}
          <div className="p-3 rounded-xl bg-[#F8FAFC] dark:bg-[#080D1A] border border-[#E2E7F0] dark:border-[#1E293B] space-y-1 text-[11px]">
            <div className="flex items-center gap-1.5 font-bold text-[#00897B] dark:text-[#00D2C4]">
              <ShieldCheck className="w-4 h-4" />
              <span>Tamper-Evident Verification Proof</span>
            </div>
            <p className="text-[#64748B] dark:text-[#94A3B8] leading-relaxed">
              An immutable cryptographic timestamp and client signature hash will be logged for your CR upon submission.
            </p>
          </div>

          {/* Confirmation checkbox */}
          <label className="flex items-center gap-2.5 text-xs text-[#0F2044] dark:text-white cursor-pointer select-none">
            <input
              type="checkbox"
              required
              checked={hasConfirmed}
              onChange={(e) => setHasConfirmed(e.target.checked)}
              className="w-4 h-4 text-[#00B4A6] rounded focus:ring-[#00B4A6]"
            />
            <span className="font-medium">I confirm this is my own academic work for {targetAsg.subject}.</span>
          </label>

          {/* Action buttons */}
          <div className="flex justify-end gap-2 pt-2 border-t border-[#E2E7F0] dark:border-[#1E293B]">
            <button
              type="button"
              onClick={() => setIsSubmitDrawerOpen(false)}
              className="px-4 py-2 rounded-lg border border-[#E2E7F0] dark:border-[#1E293B] text-xs font-semibold text-[#64748B] dark:text-[#94A3B8] hover:text-[#0F2044] dark:hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isOffline || !hasConfirmed}
              className="px-5 py-2 rounded-lg bg-[#00B4A6] dark:bg-[#00D2C4] hover:bg-[#009E91] dark:hover:bg-[#00B4A6] disabled:opacity-50 text-white dark:text-[#080D1A] text-xs font-extrabold flex items-center gap-1.5 shadow-md transition-all"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Confirm & Submit</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
