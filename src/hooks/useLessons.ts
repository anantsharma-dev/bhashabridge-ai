import { useState, useEffect, useCallback } from 'react';
import type { Lesson, GradeLevel, SubjectCode } from '../types/curriculum';
import { lessonService } from '../services/lesson.service';

export interface UseLessonsProps {
  chapterId?: string;
  subject?: SubjectCode | string;
  grade?: GradeLevel;
  studentId?: string;
}

export interface UseLessonsReturn {
  lessons: Lesson[];
  loading: boolean;
  error: string | null;
  completedLessonIds: string[];
  completeLesson: (lessonId: string, timeSpentMinutes?: number) => Promise<{ success: boolean; earnedXP: number }>;
  refresh: () => Promise<void>;
}

export function useLessons({
  chapterId,
  subject,
  grade,
  studentId = 'std_demo_01',
}: UseLessonsProps = {}): UseLessonsReturn {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [completedLessonIds, setCompletedLessonIds] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLessons = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [list, completed] = await Promise.all([
        lessonService.getLessons(chapterId, subject, grade),
        studentId ? lessonService.getStudentCompletedLessons(studentId) : Promise.resolve([]),
      ]);
      setLessons(list);
      setCompletedLessonIds(completed);
    } catch (err: any) {
      setError(err?.message || 'Failed to fetch lessons');
    } finally {
      setLoading(false);
    }
  }, [chapterId, subject, grade, studentId]);

  useEffect(() => {
    fetchLessons();

    if (chapterId) {
      const unsub = lessonService.listenToLessons(chapterId, (updated) => {
        setLessons(updated);
        setLoading(false);
      });
      return () => unsub();
    }
  }, [fetchLessons, chapterId]);

  const handleCompleteLesson = async (lessonId: string, timeSpentMinutes?: number) => {
    const res = await lessonService.completeLesson(studentId, lessonId, timeSpentMinutes);
    setCompletedLessonIds((prev) => (prev.includes(lessonId) ? prev : [...prev, lessonId]));
    return res;
  };

  return {
    lessons,
    loading,
    error,
    completedLessonIds,
    completeLesson: handleCompleteLesson,
    refresh: fetchLessons,
  };
}

export default useLessons;
