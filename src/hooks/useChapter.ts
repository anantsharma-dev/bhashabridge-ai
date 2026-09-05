import { useState, useEffect, useCallback } from 'react';
import type { Chapter, Lesson } from '../types/curriculum';
import { curriculumService } from '../services/curriculum.service';
import { lessonService } from '../services/lesson.service';

export interface UseChapterReturn {
  chapter: Chapter | null;
  lessons: Lesson[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export function useChapter(chapterId: string): UseChapterReturn {
  const [chapter, setChapter] = useState<Chapter | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchChapterData = useCallback(async () => {
    if (!chapterId) return;
    try {
      setLoading(true);
      setError(null);
      const [ch, les] = await Promise.all([
        curriculumService.getChapterById(chapterId),
        lessonService.getLessons(chapterId),
      ]);
      setChapter(ch);
      setLessons(les);
    } catch (err: any) {
      setError(err?.message || 'Failed to fetch chapter');
    } finally {
      setLoading(false);
    }
  }, [chapterId]);

  useEffect(() => {
    fetchChapterData();
  }, [fetchChapterData]);

  return {
    chapter,
    lessons,
    loading,
    error,
    refresh: fetchChapterData,
  };
}

export default useChapter;
