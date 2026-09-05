import { useState, useEffect, useCallback } from 'react';
import type { Flashcard, GradeLevel, SubjectCode, CurriculumDifficulty } from '../types/curriculum';
import { flashcardService } from '../services/flashcard.service';

export interface UseFlashcardsProps {
  grade?: GradeLevel;
  subject?: SubjectCode | string;
  category?: string;
  difficulty?: CurriculumDifficulty;
  relatedLesson?: string;
}

export interface UseFlashcardsReturn {
  flashcards: Flashcard[];
  loading: boolean;
  error: string | null;
  selectedCategory: string | null;
  setSelectedCategory: (category: string | null) => void;
  refresh: () => Promise<void>;
}

export function useFlashcards({
  grade = 'Grade 1',
  subject,
  category,
  difficulty,
  relatedLesson,
}: UseFlashcardsProps = {}): UseFlashcardsReturn {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(category || null);
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFlashcards = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const list = await flashcardService.getFlashcards({
        grade,
        subject,
        category: selectedCategory || undefined,
        difficulty,
        relatedLesson,
      });
      setFlashcards(list);
    } catch (err: any) {
      setError(err?.message || 'Failed to fetch flashcards');
    } finally {
      setLoading(false);
    }
  }, [grade, subject, selectedCategory, difficulty, relatedLesson]);

  useEffect(() => {
    fetchFlashcards();

    const unsub = flashcardService.listenToFlashcards(grade, (updated) => {
      if (selectedCategory) {
        setFlashcards(updated.filter((c) => c.category === selectedCategory));
      } else {
        setFlashcards(updated);
      }
      setLoading(false);
    });

    return () => unsub();
  }, [fetchFlashcards, grade, selectedCategory]);

  return {
    flashcards,
    loading,
    error,
    selectedCategory,
    setSelectedCategory,
    refresh: fetchFlashcards,
  };
}

export default useFlashcards;
