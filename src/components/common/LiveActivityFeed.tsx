/**
 * LiveActivityFeed — real-time sidebar/panel showing backend events
 * Shown as a floating toast-like feed and in the dashboard
 */
import React, { useState, useEffect, useCallback } from 'react';
import { ActivityEntry, fetchActivity } from '../../utils/api';
import { useBackendSSE } from '../../hooks/useBackendSSE';
import {
  Activity,
  Upload,
  FileCheck,
  BookOpen,
  CheckCircle2,
  Wifi,
  WifiOff,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Clock
} from 'lucide-react';

function relativeTime(isoStr: string): string {
  const diff = Date.now() - new Date(isoStr).getTime();
  if (diff < 60000) return 'just now';
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
  return new Date(isoStr).toLocaleDateString();
}

function eventIcon(type: ActivityEntry['type']) {
  switch (type) {
    case 'submission': return <FileCheck className="w-3.5 h-3.5 text-emerald-500" />;
    case 'assignment_file_upload': return <Upload className="w-3.5 h-3.5 text-[#0095F6]" />;
    case 'assignment_created': return <BookOpen className="w-3.5 h-3.5 text-amber-500" />;
    case 'resource_upload': return <CheckCircle2 className="w-3.5 h-3.5 text-purple-500" />;
    default: return <Activity className="w-3.5 h-3.5 text-neutral-400" />;
  }
}

function eventColor(type: ActivityEntry['type']): string {
  switch (type) {
    case 'submission': return 'border-l-emerald-500 bg-emerald-500/5';
    case 'assignment_file_upload': return 'border-l-[#0095F6] bg-[#0095F6]/5';
    case 'assignment_created': return 'border-l-amber-500 bg-amber-500/5';
    case 'resource_upload': return 'border-l-purple-500 bg-purple-500/5';
    default: return 'border-l-neutral-300 dark:border-l-neutral-700';
  }
}

interface Props {
  compact?: boolean; // compact = just the badge/indicator; full = card with full list
  maxItems?: number;
}

export const LiveActivityFeed: React.FC<Props> = ({ compact = false, maxItems = 20 }) => {
  const [activities, setActivities] = useState<ActivityEntry[]>([]);
  const [connected, setConnected] = useState(false);
  const [newCount, setNewCount] = useState(0);
  const [expanded, setExpanded] = useState(!compact);
  const [backendAvailable, setBackendAvailable] = useState(false);

  // Load initial activity
  useEffect(() => {
    fetchActivity().then(data => {
      if (data.length > 0) {
        setActivities(data);
        setBackendAvailable(true);
      }
    });
  }, []);

  const handleActivity = useCallback((entry: ActivityEntry) => {
    setBackendAvailable(true);
    setActivities(prev => {
      if (prev.find(a => a.id === entry.id)) return prev;
      return [entry, ...prev].slice(0, maxItems);
    });
    if (!expanded || compact) {
      setNewCount(n => n + 1);
    }
  }, [expanded, compact, maxItems]);

  useBackendSSE({
    onConnected: () => { setConnected(true); setBackendAvailable(true); },
    onActivity: handleActivity,
  });

  if (!backendAvailable && activities.length === 0) {
    return null; // Don't show if backend is not running
  }

  if (compact) {
    return (
      <button
        onClick={() => { setExpanded(e => !e); setNewCount(0); }}
        className="relative flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white dark:bg-[#121212] border border-[#DBDBDB] dark:border-[#262626] text-xs font-semibold text-neutral-700 dark:text-neutral-300 hover:border-neutral-400 transition-colors"
        title="Activity feed"
      >
        <span className={`w-1.5 h-1.5 rounded-full ${connected ? 'bg-emerald-500 animate-pulse' : 'bg-neutral-400'}`} />
        <Activity className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Activity Feed</span>
        {newCount > 0 && (
          <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-[#0095F6] text-white text-[9px] font-bold flex items-center justify-center">
            {newCount}
          </span>
        )}
      </button>
    );
  }

  return (
    <div className="ui-card overflow-hidden">
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-3 border-b border-[#DBDBDB] dark:border-[#262626] cursor-pointer select-none"
        onClick={() => { setExpanded(e => !e); setNewCount(0); }}
      >
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full ${connected ? 'bg-emerald-500 animate-pulse' : 'bg-neutral-400'}`} />
            {connected ? (
              <Wifi className="w-3.5 h-3.5 text-emerald-500" />
            ) : (
              <WifiOff className="w-3.5 h-3.5 text-neutral-400" />
            )}
          </div>
          <span className="text-xs font-bold text-black dark:text-white">Activity Feed</span>
          {newCount > 0 && (
            <span className="px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-[#0095F6] text-white">
              +{newCount} new
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-neutral-500">{activities.length} events</span>
          {expanded ? <ChevronUp className="w-3.5 h-3.5 text-neutral-400" /> : <ChevronDown className="w-3.5 h-3.5 text-neutral-400" />}
        </div>
      </div>

      {/* Activity List */}
      {expanded && (
        <div className="max-h-72 overflow-y-auto divide-y divide-[#DBDBDB] dark:divide-[#262626]">
          {activities.length === 0 ? (
            <div className="px-4 py-8 text-center text-xs text-neutral-400">
              <Activity className="w-5 h-5 mx-auto mb-2 opacity-40" />
              No activity yet. Submit an assignment or upload a resource to see live updates.
            </div>
          ) : (
            activities.map(entry => (
              <div
                key={entry.id}
                className={`flex items-start gap-3 px-4 py-2.5 border-l-2 ${eventColor(entry.type)} transition-colors hover:bg-neutral-50 dark:hover:bg-[#1C1C1C]`}
              >
                <div className="mt-0.5 shrink-0">{eventIcon(entry.type)}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-black dark:text-white truncate">{entry.actor}</p>
                  <p className="text-[11px] text-neutral-500 dark:text-neutral-400 line-clamp-2 leading-relaxed">{entry.detail}</p>
                </div>
                <div className="shrink-0 flex flex-col items-end gap-1">
                  <span className="text-[10px] text-neutral-400 flex items-center gap-0.5">
                    <Clock className="w-2.5 h-2.5" />
                    {relativeTime(entry.ts)}
                  </span>
                  {entry.fileUrl && (
                    <a
                      href={entry.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={e => e.stopPropagation()}
                      className="text-[10px] text-[#0095F6] hover:underline flex items-center gap-0.5 font-medium"
                    >
                      View <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};
