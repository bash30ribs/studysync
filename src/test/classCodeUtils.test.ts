import { describe, it, expect } from 'vitest';
import { formatClassCode, isValidClassCode, generateClassCode } from '../utils/classCodeUtils';

describe('classCodeUtils', () => {
  it('formats lowercase and spaced input into uppercase hyphenated code', () => {
    expect(formatClassCode('cs 301')).toBe('CS-301');
    expect(formatClassCode('  mech a  ')).toBe('MECH-A');
    expect(formatClassCode('')).toBe('');
  });

  it('validates valid class codes', () => {
    expect(isValidClassCode('CS-301')).toBe(true);
    expect(isValidClassCode('cs-301')).toBe(true);
    expect(isValidClassCode('ME-102')).toBe(true);
    expect(isValidClassCode('ECE-A')).toBe(true);
  });

  it('rejects invalid class codes with special characters or illegal lengths', () => {
    expect(isValidClassCode('')).toBe(false);
    expect(isValidClassCode('A')).toBe(false);
    expect(isValidClassCode('INVALIDCLASSCODEWAYTOOLONG-9999')).toBe(false);
    expect(isValidClassCode('CS@301')).toBe(false);
  });

  it('generates predictable format with prefix', () => {
    const code = generateClassCode('CSE');
    expect(code.startsWith('CSE-')).toBe(true);
    expect(isValidClassCode(code)).toBe(true);
  });
});
