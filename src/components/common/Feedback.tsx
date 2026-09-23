import React, { useState, useEffect, useRef } from 'react';
import { useStudySync } from '../../store';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

interface ActiveToast {
  id: string;
  message: string;
  type: 'success' | 'warning' | 'error' | 'info';
  undoAction?: () => void;
}

export const Toast: React.FC = () => {
  const { toast } = useStudySync();
  const [toastList, setToastList] = useState<ActiveToast[]>([]);
  const lastToastRef = useRef<string | null>(null);

  useEffect(() => {
    if (toast && toast.message !== lastToastRef.current) {
      lastToastRef.current = toast.message;
      const id = Date.now().toString() + Math.random().toString(36).substring(2, 5);
      const newToast: ActiveToast = {
        id,
        message: toast.message,
        type: (toast.type === 'error' ? 'error' : toast.type === 'info' ? 'info' : 'success'),
        undoAction: toast.undoAction
      };

      setToastList(prev => [...prev.slice(-2), newToast]); // Max 3 stacked

      // Auto-dismiss 3s
      const timer = setTimeout(() => {
        setToastList(prev => prev.filter(t => t.id !== id));
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [toast]);

  if (toastList.length === 0) return null;

  return (
    <div
      className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none"
      role="status"
      aria-live="polite"
      aria-atomic="true"
    >
      {toastList.map(t => {
        const borderVariant = {
          success: 'border-l-4 border-l-emerald-500',
          warning: 'border-l-4 border-l-amber-500',
          error: 'border-l-4 border-l-rose-500',
          info: 'border-l-4 border-l-[#0095F6]'
        }[t.type];

        const Icon = {
          success: CheckCircle2,
          warning: AlertCircle,
          error: AlertCircle,
          info: Info
        }[t.type];

        return (
          <div
            key={t.id}
            className={`pointer-events-auto flex items-center justify-between gap-3 px-4 py-3 rounded-xl bg-[#0A0A0A] border border-[#1A1A1A] ${borderVariant} shadow-2xl transition-all duration-200 animate-in slide-in-from-right fade-in`}
          >
            <div className="flex items-center gap-2.5 min-w-0 flex-1">
              <Icon className="w-4 h-4 text-white shrink-0" />
              <p className="text-xs sm:text-sm font-semibold text-white truncate">
                {t.message}
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {t.undoAction && (
                <button
                  onClick={() => {
                    t.undoAction?.();
                    setToastList(prev => prev.filter(item => item.id !== t.id));
                  }}
                  className="px-2 py-0.5 text-xs font-bold uppercase rounded bg-white/10 hover:bg-white/20 text-white tracking-wider transition-colors cursor-pointer"
                >
                  Undo
                </button>
              )}
              <button
                onClick={() => setToastList(prev => prev.filter(item => item.id !== t.id))}
                className="p-1 rounded-md text-neutral-400 hover:text-white transition-colors cursor-pointer"
                title="Dismiss"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        );
      })}
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
