/**
 * Lightweight safe Markdown-to-HTML parser for class broadcast announcements and descriptions
 */

export function parseMarkdown(markdownText: string): string {
  if (!markdownText) return '';

  let html = markdownText
    // Escape standard HTML tags for safety
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    // Headers (# Header)
    .replace(/^### (.*$)/gim, '<h3 class="text-sm font-bold text-slate-100 my-1">$1</h3>')
    .replace(/^## (.*$)/gim, '<h2 class="text-base font-bold text-slate-100 my-1.5">$1</h2>')
    .replace(/^# (.*$)/gim, '<h1 class="text-lg font-extrabold text-slate-100 my-2">$1</h1>')
    // Bold & Italic
    .replace(/\*\*\*(.*?)\*\*\*/gim, '<strong><em>$1</em></strong>')
    .replace(/\*\*(.*?)\*\*/gim, '<strong class="font-bold text-white">$1</strong>')
    .replace(/\*(.*?)\*/gim, '<em class="italic">$1</em>')
    // Inline code (`code`)
    .replace(/`([^`]+)`/gim, '<code class="bg-slate-800 text-teal-300 px-1 py-0.5 rounded text-xs font-mono">$1</code>')
    // Bullet points (* or -)
    .replace(/^\s*[-*]\s+(.*)$/gim, '<li class="ml-4 list-disc text-slate-300 text-xs">$1</li>')
    // Line breaks
    .replace(/\n$/gim, '<br />');

  return html.trim();
}
