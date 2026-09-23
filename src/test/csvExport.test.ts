import { describe, it, expect } from 'vitest';
import { escapeCSV } from '../utils/exportReports';

describe('escapeCSV sanitization', () => {
  it('escapes regular strings with double quotes', () => {
    expect(escapeCSV('Computer Science')).toBe('"Computer Science"');
  });

  it('escapes embedded double quotes by doubling them', () => {
    expect(escapeCSV('Assignment "Project Alpha"')).toBe('"Assignment ""Project Alpha"""');
  });

  it('handles null and undefined safely', () => {
    expect(escapeCSV(null)).toBe('""');
    expect(escapeCSV(undefined)).toBe('""');
  });

  it('handles numbers properly', () => {
    expect(escapeCSV(100)).toBe('"100"');
  });

  it('neutralizes spreadsheet formula injection characters (=, +, -, @)', () => {
    expect(escapeCSV('=SUM(A1:A10)')).toBe('"\'=SUM(A1:A10)"');
    expect(escapeCSV('+123456789')).toBe('"\'+123456789"');
    expect(escapeCSV('-500')).toBe('"\'-500"');
    expect(escapeCSV('@malicious')).toBe('"\'@malicious"');
  });
});
