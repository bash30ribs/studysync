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
      localStorage.removeItem('studysync_v2_current_user');
      localStorage.removeItem('studysync_v2_class');
      sessionStorage.removeItem('studysync_entered');
    } catch {}
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-white dark:bg-black text-[#262626] dark:text-[#F5F5F5] flex flex-col items-center justify-center p-6 text-center">
          <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-500 flex items-center justify-center mb-4">
            <AlertCircle className="w-8 h-8" />
          </div>
          <h1 className="text-xl font-bold text-black dark:text-white mb-2">
            Something went wrong loading this view
          </h1>
          <p className="text-xs text-[#737373] dark:text-[#8E8E8E] max-w-md mb-6 leading-relaxed">
            A temporary rendering glitch occurred. Click below to recover and reset to your clean class workspace.
          </p>
          <button
            onClick={this.handleReset}
            className="px-5 py-2.5 rounded-xl bg-[#0095F6] hover:bg-[#1877F2] text-white text-xs font-bold flex items-center gap-2 transition-all shadow-md"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Reset & Reload Workspace</span>
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
