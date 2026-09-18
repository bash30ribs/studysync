/**
 * Typed LocalStorage wrapper with expiration TTL support and fallback
 */

interface StorageEnvelope<T> {
  value: T;
  expiresAt: number | null; // Unix timestamp in ms
}

export class SafeStorage {
  private memoryCache: Map<string, string> = new Map();

  public set<T>(key: string, value: T, ttlMinutes?: number): boolean {
    const expiresAt = ttlMinutes ? Date.now() + ttlMinutes * 60 * 1000 : null;
    const envelope: StorageEnvelope<T> = { value, expiresAt };
    const serialized = JSON.stringify(envelope);

    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(key, serialized);
      }
      this.memoryCache.set(key, serialized);
      return true;
    } catch {
      this.memoryCache.set(key, serialized);
      return false;
    }
  }

  public get<T>(key: string, defaultValue: T): T {
    try {
      let itemStr: string | null = null;
      if (typeof localStorage !== 'undefined') {
        itemStr = localStorage.getItem(key);
      }
      if (!itemStr) {
        itemStr = this.memoryCache.get(key) || null;
      }
      if (!itemStr) return defaultValue;

      const envelope: StorageEnvelope<T> = JSON.parse(itemStr);
      if (envelope.expiresAt && Date.now() > envelope.expiresAt) {
        this.remove(key);
        return defaultValue;
      }
      return envelope.value;
    } catch {
      return defaultValue;
    }
  }

  public remove(key: string) {
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.removeItem(key);
      }
      this.memoryCache.delete(key);
    } catch {
      this.memoryCache.delete(key);
    }
  }
}

export const safeStorage = new SafeStorage();
