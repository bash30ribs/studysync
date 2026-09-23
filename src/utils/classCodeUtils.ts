/**
 * Formats user input into a clean, normalized class code
 */
export function formatClassCode(input: string): string {
  if (!input) return '';
  return input.trim().toUpperCase().replace(/\s+/g, '-');
}

/**
 * Validates whether a class code conforms to expected format (e.g. CS-301, MECH-A)
 */
export function isValidClassCode(code: string): boolean {
  if (!code) return false;
  const normalized = formatClassCode(code);
  // Alphanumeric with optional single hyphen, 3 to 10 chars
  return /^[A-Z0-9]{2,6}(-[A-Z0-9]{1,5})?$/.test(normalized);
}

/**
 * Generates a random cohort code given a prefix
 */
export function generateClassCode(prefix: string = 'CLASS'): string {
  const cleanPrefix = prefix.trim().toUpperCase().slice(0, 4) || 'CLS';
  const randomSuffix = Math.floor(100 + Math.random() * 900);
  return `${cleanPrefix}-${randomSuffix}`;
}
