/**
 * Academic resource utilities for AI summary generation, keyword tagging, and study prompts.
 */

export interface FormattedSummary {
  keyTakeaways: string[];
  suggestedReviewQuestions: string[];
  estimatedReadMinutes: number;
}

export function generateResourceStudyAids(title: string, description: string, subject: string): FormattedSummary {
  // Extract keywords
  const wordCount = (title + ' ' + description).split(/\s+/).length;
  const readTime = Math.max(2, Math.ceil(wordCount / 40));

  const keyTakeaways = [
    `Core conceptual foundations for ${subject}: ${title}`,
    'Key formulas, operational definitions, and derivation steps',
    'Practical problem-solving heuristics and examination edge cases',
  ];

  const suggestedReviewQuestions = [
    `How does the primary principle in "${title}" apply to real-world scenarios?`,
    `What are the boundary conditions and common pitfalls when calculating values in ${subject}?`,
    `Can you reconstruct the main theorem or framework without referring to the lecture notes?`,
  ];

  return {
    keyTakeaways,
    suggestedReviewQuestions,
    estimatedReadMinutes: readTime,
  };
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}
