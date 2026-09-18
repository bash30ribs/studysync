/**
 * Deterministic color generator for subject badges and student avatars
 */

const PALETTES = [
  { bg: 'bg-teal-500/15', text: 'text-teal-400', border: 'border-teal-500/30', gradient: 'from-teal-500 to-emerald-600' },
  { bg: 'bg-indigo-500/15', text: 'text-indigo-400', border: 'border-indigo-500/30', gradient: 'from-indigo-500 to-purple-600' },
  { bg: 'bg-amber-500/15', text: 'text-amber-400', border: 'border-amber-500/30', gradient: 'from-amber-500 to-orange-600' },
  { bg: 'bg-rose-500/15', text: 'text-rose-400', border: 'border-rose-500/30', gradient: 'from-rose-500 to-pink-600' },
  { bg: 'bg-cyan-500/15', text: 'text-cyan-400', border: 'border-cyan-500/30', gradient: 'from-cyan-500 to-blue-600' },
  { bg: 'bg-purple-500/15', text: 'text-purple-400', border: 'border-purple-500/30', gradient: 'from-purple-500 to-violet-600' },
];

export function getDeterministicColor(identifier: string) {
  if (!identifier) return PALETTES[0];
  let hash = 0;
  for (let i = 0; i < identifier.length; i++) {
    hash = identifier.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % PALETTES.length;
  return PALETTES[index];
}

export function getAvatarGradient(name: string): string {
  return getDeterministicColor(name).gradient;
}
