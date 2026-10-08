/**
 * useBackendSSE — React hook for Server-Sent Events from StudySync backend
 * Connects to /api/events and dispatches updates to callbacks
 */
import { useEffect, useRef, useCallback } from 'react';
import { API_BASE, ActivityEntry, BackendAssignment, BackendBroadcast, BackendGrowthActivity } from '../utils/api';

export interface SSESubmissionEvent {
  id?: string;
  studentId?: string;
  studentName?: string;
  student?: string;
  code?: string;
  assignmentId?: string;
  assignmentTitle?: string;
  assignment?: string;
  fileName?: string | null;
  fileUrl?: string | null;
  fileSize?: string;
  submittedAt?: string;
  submissionHash?: string;
  hash?: string;
  assignmentSubmittedCount?: number;
  assignmentTotalCount?: number;
}

export interface SSEResourceEvent {
  id: string;
  title: string;
  subject: string;
  category: string;
  fileName: string;
  fileUrl: string | null;
  fileSize: string;
  uploadedByName: string;
  uploadedAt: string;
  downloadsCount: number;
}

interface SSECallbacks {
  onActivity?: (entry: ActivityEntry) => void;
  onSubmission?: (ev: SSESubmissionEvent) => void;
  onAssignmentCreated?: (asg: BackendAssignment) => void;
  onBroadcast?: (bc: BackendBroadcast) => void;
  onGrowthActivity?: (act: BackendGrowthActivity) => void;
  onResource?: (ev: SSEResourceEvent) => void;
  onConnected?: () => void;
}

export function useBackendSSE(callbacks: SSECallbacks, enabled = true) {
  const esRef = useRef<EventSource | null>(null);
  const cbRef = useRef(callbacks);
  cbRef.current = callbacks;

  const connect = useCallback(() => {
    if (!enabled) return;
    if (esRef.current) {
      esRef.current.close();
    }

    try {
      const es = new EventSource(`${API_BASE}/api/events`);
      esRef.current = es;

      es.addEventListener('connected', () => {
        cbRef.current.onConnected?.();
      });

      es.addEventListener('activity', (e) => {
        try {
          const data = JSON.parse(e.data) as ActivityEntry;
          cbRef.current.onActivity?.(data);
        } catch { /* ignore */ }
      });

      es.addEventListener('submission', (e) => {
        try {
          const data = JSON.parse(e.data) as SSESubmissionEvent;
          cbRef.current.onSubmission?.(data);
        } catch { /* ignore */ }
      });

      es.addEventListener('assignment_created', (e) => {
        try {
          const data = JSON.parse(e.data) as BackendAssignment;
          cbRef.current.onAssignmentCreated?.(data);
        } catch { /* ignore */ }
      });

      es.addEventListener('broadcast', (e) => {
        try {
          const data = JSON.parse(e.data) as BackendBroadcast;
          cbRef.current.onBroadcast?.(data);
        } catch { /* ignore */ }
      });

      es.addEventListener('growth_activity', (e) => {
        try {
          const data = JSON.parse(e.data) as BackendGrowthActivity;
          cbRef.current.onGrowthActivity?.(data);
        } catch { /* ignore */ }
      });

      es.addEventListener('resource', (e) => {
        try {
          const data = JSON.parse(e.data) as SSEResourceEvent;
          cbRef.current.onResource?.(data);
        } catch { /* ignore */ }
      });

      es.onerror = () => {
        es.close();
        esRef.current = null;
        // Reconnect after 4 seconds
        setTimeout(connect, 4000);
      };
    } catch {
      // Backend not running
    }
  }, [enabled]);

  useEffect(() => {
    connect();
    return () => {
      esRef.current?.close();
      esRef.current = null;
    };
  }, [connect]);
}
