/**
 * Text and string manipulation utilities for academic resources and announcements
 */

export function truncateText(text: string, maxLength = 100, suffix = '...'): string {
  if (!text || text.length <= maxLength) return text || '';
  return text.slice(0, maxLength).trim() + suffix;
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function calculateReadTimeMinutes(text: string, wordsPerMinute = 200): number {
  if (!text) return 1;
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / wordsPerMinute));
}

export function capitalizeWords(text: string): string {
  if (!text) return '';
  return text
    .toLowerCase()
    .split(' ')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}
