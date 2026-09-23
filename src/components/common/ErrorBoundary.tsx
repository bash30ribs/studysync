import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('StudySync Uncaught UI Error:', error, errorInfo);
  }

  private handleReset = () => {
    try {
      const keysToRemove: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k && (k.startsWith('studysync') || k.includes('studysync'))) {
          keysToRemove.push(k);
        }
      }
      keysToRemove.forEach(k => localStorage.removeItem(k));
      sessionStorage.clear();
    } catch {}
    window.location.reload();
  };

  private handleReturnToLanding = () => {
    try {
      sessionStorage.removeItem('studysync_entered');
    } catch {}
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-white dark:bg-black text-[#262626] dark:text-[#F5F5F5] flex flex-col items-center justify-center p-6 text-center animate-in fade-in">
          <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-500 flex items-center justify-center mb-4 shadow-sm">
            <AlertCircle className="w-8 h-8" />
          </div>
          <h1 className="text-xl font-bold text-black dark:text-white mb-2">
            Something went wrong loading this view
          </h1>
          <p className="text-xs text-[#737373] dark:text-[#8E8E8E] max-w-md mb-4 leading-relaxed">
            A temporary rendering glitch occurred. Click below to recover and reset to your clean class workspace.
          </p>

          {this.state.error && (
            <div className="mb-6 p-3 rounded-xl bg-neutral-100 dark:bg-[#161616] border border-neutral-200 dark:border-neutral-800 text-left max-w-md w-full overflow-x-auto text-[11px] font-mono text-neutral-600 dark:text-neutral-400">
              <span className="font-bold text-rose-500 block mb-1">Diagnostic Detail:</span>
              <p className="break-words">{this.state.error.message || String(this.state.error)}</p>
            </div>
          )}

          <div className="flex flex-col sm:flex-row items-center gap-3">
            <button
              onClick={this.handleReset}
              className="px-5 py-2.5 rounded-xl bg-[#0095F6] hover:bg-[#1877F2] text-white text-xs font-bold flex items-center gap-2 transition-all shadow-md"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Reset & Reload Workspace</span>
            </button>

            <button
              onClick={this.handleReturnToLanding}
              className="px-5 py-2.5 rounded-xl border border-[#DBDBDB] dark:border-[#262626] bg-white dark:bg-[#121212] hover:bg-neutral-100 dark:hover:bg-[#1E1E1E] text-black dark:text-white text-xs font-semibold transition-all"
            >
              Return to Landing Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
