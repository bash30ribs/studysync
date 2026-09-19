import React from 'react';
import { useStudySync } from '../../store';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const Toast: React.FC = () => {
  const { toast } = useStudySync();

  if (!toast) return null;

  const bgStyles = {
    success: 'bg-emerald-600 text-white border-emerald-700 shadow-lg shadow-emerald-500/20',
    error: 'bg-[#ED4956] text-white border-red-700 shadow-lg shadow-red-500/20',
    info: 'bg-black dark:bg-[#121212] text-white border-[#262626] shadow-lg'
  }[toast.type];

  const Icon = {
    success: CheckCircle2,
    error: AlertCircle,
    info: Info
  }[toast.type];

  return (
    <div
      className="fixed bottom-5 right-5 z-50 animate-in fade-in slide-in-from-bottom-5 duration-200"
      role="status"
      aria-live="polite"
      aria-atomic="true"
    >
      <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border ${bgStyles} min-w-[300px] max-w-md shadow-2xl`}>
        <Icon className="w-5 h-5 flex-shrink-0" />
        <p className="text-xs sm:text-sm font-bold flex-1">{toast.message}</p>
        {toast.undoAction && (
          <button
            onClick={() => {
              toast.undoAction?.();
            }}
            className="px-2.5 py-1 text-xs font-extrabold uppercase rounded bg-white/20 hover:bg-white/30 text-white tracking-wider transition-colors"
          >
            Undo
          </button>
        )}
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
        className={`bg-white dark:bg-[#121212] w-full ${maxWidth} rounded-2xl border border-[#DBDBDB] dark:border-[#262626] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150`}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#DBDBDB] dark:border-[#262626] bg-[#FAFAFA] dark:bg-[#181818]">
          <h3 className="text-base font-extrabold text-black dark:text-white tracking-tight">{title}</h3>
          <button 
            onClick={onClose}
            className="text-[#8E8E8E] hover:text-black dark:hover:text-white p-1 rounded-lg hover:bg-[#EFEFEF] dark:hover:bg-[#262626] transition-colors"
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
