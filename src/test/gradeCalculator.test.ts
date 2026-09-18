import { describe, it, expect } from 'vitest';
import { calculateWeightedGPA, scoreToLetter, scoreToGradePoints } from '../utils/gradeCalculator';

describe('gradeCalculator utility', () => {
  it('should accurately convert scores to letter grades', () => {
    expect(scoreToLetter(95)).toBe('A+');
    expect(scoreToLetter(82)).toBe('A');
    expect(scoreToLetter(74)).toBe('B');
    expect(scoreToLetter(61)).toBe('C');
    expect(scoreToLetter(52)).toBe('D');
    expect(scoreToLetter(40)).toBe('F');
  });

  it('should calculate weighted GPA on a 10.0 scale', () => {
    const courses = [
      { courseCode: 'CS101', courseName: 'Intro to CS', credits: 4, score: 90 }, // 9.0 * 4 = 36
      { courseCode: 'MA101', courseName: 'Calculus', credits: 4, score: 80 },    // 8.0 * 4 = 32
      { courseCode: 'PH101', courseName: 'Physics', credits: 2, score: 70 },     // 7.0 * 2 = 14
    ];
    // Total points = 82 / 10 credits = 8.2 GPA
    const result = calculateWeightedGPA(courses, 10.0);
    expect(result.gpa).toBe(8.2);
    expect(result.totalCredits).toBe(10);
  });

  it('should calculate weighted GPA on a 4.0 scale', () => {
    const courses = [
      { courseCode: 'CS101', courseName: 'Intro to CS', credits: 3, score: 95 }, // 4.0 * 3 = 12
      { courseCode: 'MA101', courseName: 'Calculus', credits: 3, score: 75 },    // 3.0 * 3 = 9
    ];
    // Total points = 21 / 6 credits = 3.5 GPA
    const result = calculateWeightedGPA(courses, 4.0);
    expect(result.gpa).toBe(3.5);
  });
});
