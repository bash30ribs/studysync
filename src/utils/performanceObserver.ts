/**
 * Lightweight performance metrics and interaction duration observer for client-side routing
 */

export interface InteractionMetric {
  name: string;
  durationMs: number;
  timestamp: number;
}

const metricsLog: InteractionMetric[] = [];

export function measureInteraction(name: string, callback: () => void) {
  if (typeof performance === 'undefined') {
    callback();
    return;
  }

  const start = performance.now();
  try {
    callback();
  } finally {
    const durationMs = performance.now() - start;
    metricsLog.push({
      name,
      durationMs: Math.round(durationMs * 100) / 100,
      timestamp: Date.now(),
    });
    // Cap memory log
    if (metricsLog.length > 50) {
      metricsLog.shift();
    }
  }
}

export function getInteractionMetrics(): InteractionMetric[] {
  return [...metricsLog];
}
