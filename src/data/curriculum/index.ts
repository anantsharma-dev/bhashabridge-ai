/**
 * BhashaBridge AI — Master Curriculum Registry
 * Standards: NCERT 2024, NIPUN Bharat FLN/FNN, Jharkhand SCERT MTB-MLE.
 * Covers Grade 1 to 5 across 11 MTB-MLE subjects.
 */

import type { CurriculumGrade, CurriculumLesson, CurriculumSubject } from './types';
import { grade1Lessons } from './grade1';
import { grade2Lessons } from './grade2';
import { grade3Lessons } from './grade3';
import { grade4Lessons } from './grade4';
import { grade5Lessons } from './grade5';

export * from './types';
export * from './grade1';
export * from './grade2';
export * from './grade3';
export * from './grade4';
export * from './grade5';

export const ALL_CURRICULUM_LESSONS: CurriculumLesson[] = [
  ...grade1Lessons,
  ...grade2Lessons,
  ...grade3Lessons,
  ...grade4Lessons,
  ...grade5Lessons,
];

export function getAllCurriculumLessons(): CurriculumLesson[] {
  return ALL_CURRICULUM_LESSONS;
}

export function getLessonsByGrade(grade: CurriculumGrade): CurriculumLesson[] {
  return ALL_CURRICULUM_LESSONS.filter((lesson) => lesson.grade === grade);
}

export function getLessonsBySubject(subject: CurriculumSubject): CurriculumLesson[] {
  return ALL_CURRICULUM_LESSONS.filter((lesson) => lesson.subject === subject);
}

export function getLessonById(id: string): CurriculumLesson | undefined {
  return ALL_CURRICULUM_LESSONS.find((lesson) => lesson.id === id);
}

export function searchCurriculumLessons(query: string): CurriculumLesson[] {
  const q = query.trim().toLowerCase();
  if (!q) return ALL_CURRICULUM_LESSONS;

  return ALL_CURRICULUM_LESSONS.filter((lesson) => {
    return (
      lesson.titleEnglish.toLowerCase().includes(q) ||
      lesson.titleHindi.toLowerCase().includes(q) ||
      lesson.titleSanthali.includes(q) ||
      lesson.titleRoman.toLowerCase().includes(q) ||
      lesson.subject.toLowerCase().includes(q) ||
      lesson.theme.toLowerCase().includes(q) ||
      lesson.vocabulary.some(
        (v) =>
          v.english.toLowerCase().includes(q) ||
          v.hindi.toLowerCase().includes(q) ||
          v.santhali.includes(q) ||
          v.roman.toLowerCase().includes(q)
      )
    );
  });
}

export function getCurriculumStats() {
  const totalLessons = ALL_CURRICULUM_LESSONS.length;
  let totalFlashcards = 0;
  let totalWorksheets = 0;
  let totalQuizzes = 0;

  for (const l of ALL_CURRICULUM_LESSONS) {
    totalFlashcards += l.flashcards.length;
    if (l.worksheet) totalWorksheets += 1;
    if (l.miniQuiz) totalQuizzes += 1;
  }

  return {
    totalLessons,
    totalStories: totalLessons,
    totalFlashcards,
    totalWorksheets,
    totalQuizzes,
    gradesCovered: [1, 2, 3, 4, 5],
  };
}
