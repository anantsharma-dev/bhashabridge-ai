import { useState, useEffect, useCallback } from 'react';
import type { Story, GradeLevel, SupportedLanguage, SubjectCode } from '../types/curriculum';
import { storyService } from '../services/story.service';

export interface UseStoriesProps {
  initialGrade?: GradeLevel;
  subject?: SubjectCode | string;
  language?: SupportedLanguage;
}

export interface UseStoriesReturn {
  stories: Story[];
  loading: boolean;
  error: string | null;
  selectedGrade: GradeLevel;
  setSelectedGrade: (grade: GradeLevel) => void;
  refresh: () => Promise<void>;
}

export function useStories({
  initialGrade = 'Grade 1',
  subject,
  language,
}: UseStoriesProps = {}): UseStoriesReturn {
  const [selectedGrade, setSelectedGrade] = useState<GradeLevel>(initialGrade);
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStories = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const list = await storyService.getStories({
        grade: selectedGrade,
        subject,
        language,
      });
      setStories(list);
    } catch (err: any) {
      setError(err?.message || 'Failed to fetch stories');
    } finally {
      setLoading(false);
    }
  }, [selectedGrade, subject, language]);

  useEffect(() => {
    fetchStories();

    const unsub = storyService.listenToStories(selectedGrade, (updated) => {
      setStories(updated);
      setLoading(false);
    });

    return () => unsub();
  }, [fetchStories, selectedGrade]);

  return {
    stories,
    loading,
    error,
    selectedGrade,
    setSelectedGrade,
    refresh: fetchStories,
  };
}

export default useStories;
