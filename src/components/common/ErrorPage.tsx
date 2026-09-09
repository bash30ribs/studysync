import React from 'react';
import { useStudySync } from '../../store';
import { AlertCircle, ArrowLeft, Home, RefreshCw } from 'lucide-react';

interface ErrorPageProps {
  code?: '404' | '500';
  title?: string;
  message?: string;
  onReset?: () => void;
}

export const ErrorPage: React.FC<ErrorPageProps> = ({
  code = '404',
  title = 'Module Not Found',
  message = 'The requested academic section or assignment identifier does not exist in this semester cohort.',
  onReset
}) => {
  const { setActiveTab } = useStudySync();

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center space-y-4 animate-in fade-in duration-150">
      <div className="w-16 h-16 rounded-2xl bg-[#FEF2F2] dark:bg-[#EF4444]/10 border border-[#EF4444]/30 flex items-center justify-center text-[#DC2626] dark:text-[#F87171]">
        <AlertCircle className="w-8 h-8" />
      </div>

      <span className="font-mono text-xs font-bold px-2.5 py-1 rounded bg-[#F1F5F9] dark:bg-[#1E293B] text-[#64748B] dark:text-[#94A3B8]">
        HTTP {code}
      </span>

      <h2 className="text-xl font-bold text-[#0F2044] dark:text-white">
        {title}
      </h2>

      <p className="text-xs text-[#64748B] dark:text-[#94A3B8] max-w-md leading-relaxed">
        {message}
      </p>

      <div className="flex items-center gap-3 pt-2">
        <button
          onClick={() => setActiveTab('dashboard')}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0F2044] dark:bg-[#00D2C4] text-white dark:text-[#09132B] font-bold text-xs shadow-xs hover:opacity-90 transition-opacity"
        >
          <Home className="w-4 h-4" />
          <span>Return to Dashboard</span>
        </button>

        {onReset && (
          <button
            onClick={onReset}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-[#E2E8F0] dark:border-[#1E293B] bg-white dark:bg-[#15203B] text-[#475569] dark:text-[#94A3B8] font-semibold text-xs hover:bg-[#F8FAFC] transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Retry</span>
          </button>
        )}
      </div>
    </div>
  );
};
