/**
 * Academic GPA and Weighted Grade Calculator Utilities
 */

export interface CourseGradeItem {
  courseCode: string;
  courseName: string;
  credits: number;
  score: number; // 0 to 100
}

export function scoreToLetter(score: number): string {
  if (score >= 90) return 'A+';
  if (score >= 80) return 'A';
  if (score >= 70) return 'B';
  if (score >= 60) return 'C';
  if (score >= 50) return 'D';
  return 'F';
}

export function scoreToGradePoints(score: number, scale: 4.0 | 10.0 = 10.0): number {
  if (scale === 4.0) {
    if (score >= 90) return 4.0;
    if (score >= 80) return 3.7;
    if (score >= 70) return 3.0;
    if (score >= 60) return 2.0;
    if (score >= 50) return 1.0;
    return 0.0;
  }
  // 10.0 Scale
  return Math.min(10.0, Math.max(0.0, Math.round((score / 10) * 10) / 10));
}

export function calculateWeightedGPA(courses: CourseGradeItem[], scale: 4.0 | 10.0 = 10.0): { gpa: number; totalCredits: number } {
  if (courses.length === 0) return { gpa: 0, totalCredits: 0 };

  let totalPoints = 0;
  let totalCredits = 0;

  courses.forEach((c) => {
    const gradePoint = scoreToGradePoints(c.score, scale);
    totalPoints += gradePoint * c.credits;
    totalCredits += c.credits;
  });

  const gpa = totalCredits > 0 ? Math.round((totalPoints / totalCredits) * 100) / 100 : 0;
  return { gpa, totalCredits };
}
