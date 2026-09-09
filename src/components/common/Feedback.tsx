import React from 'react';
import { useStudySync } from '../../store';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const Toast: React.FC = () => {
  const { toast } = useStudySync();

  if (!toast) return null;

  const bgStyles = {
    success: 'bg-[#00B4A6] dark:bg-[#00D2C4] text-white dark:text-[#080D1A] border-[#009E91] dark:border-[#00B4A6] shadow-lg shadow-[#00B4A6]/20',
    error: 'bg-[#E63946] text-white border-[#D62839] shadow-lg shadow-[#E63946]/20',
    info: 'bg-[#0F2044] dark:bg-[#15203B] text-white border-[#193166] dark:border-[#25427C] shadow-lg'
  }[toast.type];

  const Icon = {
    success: CheckCircle2,
    error: AlertCircle,
    info: Info
  }[toast.type];

  return (
    <div className="fixed bottom-5 right-5 z-50 animate-in fade-in slide-in-from-bottom-5 duration-200">
      <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border ${bgStyles} min-w-[300px] max-w-md`}>
        <Icon className="w-5 h-5 flex-shrink-0" />
        <p className="text-xs sm:text-sm font-bold flex-1">{toast.message}</p>
      </div>
    </div>
  );
};

export const Modal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  maxWidth?: string;
}> = ({ isOpen, onClose, title, children, maxWidth = 'max-w-xl' }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className={`bg-white dark:bg-[#0F172A] w-full ${maxWidth} rounded-2xl border border-[#E2E7F0] dark:border-[#1E293B] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150`}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E2E7F0] dark:border-[#1E293B] bg-[#F8FAFC]/60 dark:bg-[#15203B]/40">
          <h3 className="text-base font-extrabold text-[#0F2044] dark:text-white tracking-tight">{title}</h3>
          <button 
            onClick={onClose}
            className="text-[#64748B] hover:text-[#0F2044] dark:text-[#94A3B8] dark:hover:text-white p-1 rounded-lg hover:bg-[#F1F5F9] dark:hover:bg-[#1E293B] transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 max-h-[82vh] overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
};
