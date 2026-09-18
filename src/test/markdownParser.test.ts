import { describe, it, expect } from 'vitest';
import { parseMarkdown } from '../utils/markdownParser';

describe('markdownParser utility', () => {
  it('should parse headers correctly', () => {
    const md = '# Urgent Announcement\n## Midterm Schedule';
    const html = parseMarkdown(md);
    expect(html).toContain('<h1');
    expect(html).toContain('Urgent Announcement');
    expect(html).toContain('<h2');
    expect(html).toContain('Midterm Schedule');
  });

  it('should parse bold, italic and code blocks', () => {
    const md = 'Submit to **Canvas** and check `index.ts`';
    const html = parseMarkdown(md);
    expect(html).toContain('<strong class="font-bold text-white">Canvas</strong>');
    expect(html).toContain('<code class="bg-slate-800 text-teal-300 px-1 py-0.5 rounded text-xs font-mono">index.ts</code>');
  });

  it('should sanitize raw script tags against XSS', () => {
    const md = '<script>alert("xss")</script>';
    const html = parseMarkdown(md);
    expect(html).not.toContain('<script>');
    expect(html).toContain('&lt;script&gt;');
  });
});
