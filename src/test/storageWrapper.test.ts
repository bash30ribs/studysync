import { describe, it, expect, beforeEach } from 'vitest';
import { SafeStorage } from '../utils/storageWrapper';

describe('SafeStorage utility', () => {
  let storage: SafeStorage;

  beforeEach(() => {
    storage = new SafeStorage();
  });

  it('should store and retrieve typed objects', () => {
    storage.set('user_pref', { theme: 'dark', compactMode: true });
    const result = storage.get('user_pref', { theme: 'light', compactMode: false });

    expect(result.theme).toBe('dark');
    expect(result.compactMode).toBe(true);
  });

  it('should return default value for non-existent keys', () => {
    const result = storage.get('missing_key', 'fallback');
    expect(result).toBe('fallback');
  });

  it('should remove items correctly', () => {
    storage.set('temp', '123');
    storage.remove('temp');
    expect(storage.get('temp', 'default')).toBe('default');
  });
});
