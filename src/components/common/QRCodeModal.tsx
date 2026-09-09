import React, { useState } from 'react';
import { useStudySync } from '../../store';
import { QrCode, Copy, Check, X, Smartphone, Sparkles } from 'lucide-react';

export const QRCodeModal: React.FC = () => {
  const { isQRCodeOpen, setIsQRCodeOpen, currentClass, showToast } = useStudySync();
  const [isCopied, setIsCopied] = useState(false);

  if (!isQRCodeOpen) return null;

  const joinUrl = `https://studysync.app/join/${currentClass.code}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(joinUrl);
    setIsCopied(true);
    showToast('Class join link copied!', 'success');
    setTimeout(() => setIsCopied(false), 2500);
  };

  return (
    <div 
      onClick={() => setIsQRCodeOpen(false)}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-150"
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md bg-white dark:bg-[#0F172A] rounded-3xl border border-[#E2E8F0] dark:border-[#1E293B] shadow-2xl p-6 sm:p-8 text-center space-y-5"
      >
        <div className="flex items-center justify-between">
          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#E6F8F6] dark:bg-[#00D2C4]/15 text-[#00897B] dark:text-[#00D2C4] border border-[#00B4A6]/20">
            Lecture Projector Mode
          </span>
          <button
            onClick={() => setIsQRCodeOpen(false)}
            className="p-1 rounded-lg text-[#64748B] hover:text-[#0F2044] dark:text-[#94A3B8] dark:hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div>
          <h3 className="text-lg font-bold text-[#0F2044] dark:text-white">
            Join {currentClass.name}
          </h3>
          <p className="text-xs text-[#64748B] dark:text-[#94A3B8] mt-1">
            Scan with your phone camera to automatically sync cohort assignments and attendance.
          </p>
        </div>

        {/* Vector SVG QR Code Representation */}
        <div className="p-6 bg-white rounded-2xl border-2 border-[#E2E8F0] dark:border-[#334155] shadow-inner inline-block mx-auto">
          <svg
            className="w-48 h-48 sm:w-56 sm:h-56 text-[#0F2044]"
            viewBox="0 0 100 100"
            fill="currentColor"
          >
            {/* Corner Squares */}
            <rect x="10" y="10" width="24" height="24" rx="2" fill="#0F2044" />
            <rect x="14" y="14" width="16" height="16" fill="white" />
            <rect x="18" y="18" width="8" height="8" fill="#00B4A6" />

            <rect x="66" y="10" width="24" height="24" rx="2" fill="#0F2044" />
            <rect x="70" y="14" width="16" height="16" fill="white" />
            <rect x="74" y="18" width="8" height="8" fill="#00B4A6" />

            <rect x="10" y="66" width="24" height="24" rx="2" fill="#0F2044" />
            <rect x="14" y="70" width="16" height="16" fill="white" />
            <rect x="18" y="74" width="8" height="8" fill="#00B4A6" />

            {/* Data Pattern Grid */}
            <rect x="38" y="12" width="6" height="6" fill="#0F2044" />
            <rect x="48" y="12" width="6" height="6" fill="#0F2044" />
            <rect x="38" y="24" width="6" height="6" fill="#0F2044" />
            <rect x="52" y="24" width="6" height="6" fill="#0F2044" />

            <rect x="12" y="38" width="6" height="6" fill="#0F2044" />
            <rect x="24" y="38" width="6" height="6" fill="#0F2044" />
            <rect x="38" y="38" width="8" height="8" fill="#00B4A6" />
            <rect x="54" y="38" width="6" height="6" fill="#0F2044" />
            <rect x="66" y="38" width="6" height="6" fill="#0F2044" />
            <rect x="80" y="38" width="6" height="6" fill="#0F2044" />

            <rect x="38" y="52" width="6" height="6" fill="#0F2044" />
            <rect x="48" y="52" width="8" height="8" fill="#00B4A6" />
            <rect x="62" y="52" width="6" height="6" fill="#0F2044" />
            <rect x="76" y="52" width="6" height="6" fill="#0F2044" />

            <rect x="38" y="66" width="6" height="6" fill="#0F2044" />
            <rect x="52" y="66" width="6" height="6" fill="#0F2044" />
            <rect x="66" y="66" width="6" height="6" fill="#0F2044" />
            <rect x="78" y="66" width="6" height="6" fill="#0F2044" />

            <rect x="38" y="78" width="6" height="6" fill="#0F2044" />
            <rect x="50" y="78" width="6" height="6" fill="#0F2044" />
            <rect x="64" y="78" width="6" height="6" fill="#0F2044" />
            <rect x="78" y="78" width="6" height="6" fill="#0F2044" />
          </svg>
        </div>

        {/* 6-digit Code Display */}
        <div className="space-y-2">
          <div className="text-[11px] font-bold text-[#64748B] dark:text-[#94A3B8] uppercase tracking-wider">
            Or Enter Code Manually
          </div>
          <div className="font-mono text-2xl sm:text-3xl font-black tracking-widest text-[#0F2044] dark:text-white bg-[#F8FAFC] dark:bg-[#15203B] py-2 px-4 rounded-xl border border-[#E2E8F0] dark:border-[#1E293B] inline-block">
            {currentClass.code}
          </div>
        </div>

        <button
          onClick={handleCopyLink}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#0F2044] dark:bg-[#00D2C4] text-white dark:text-[#09132B] font-bold text-xs hover:opacity-90 transition-opacity shadow-xs"
        >
          {isCopied ? (
            <>
              <Check className="w-4 h-4" />
              <span>Invite Link Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              <span>Copy Direct Invite Link</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
