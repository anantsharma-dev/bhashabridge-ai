import { useState, useEffect } from 'react';
import type { VocabularyProgress } from '../types/progress';
import {
  listenToStudentVocabulary,
  getDueVocabularyReviews,
  reviewVocabularyWord,
} from '../services/vocabulary.service';

export interface UseVocabularyProgressReturn {
  vocabularyList: VocabularyProgress[];
  dueReviews: VocabularyProgress[];
  masteredCount: number;
  learningCount: number;
  loading: boolean;
  error: string | null;
  reviewWord: (
    wordId: string,
    isCorrect: boolean,
    language?: string,
    wordText?: string,
    meaningHindi?: string,
    qualityRating?: number
  ) => Promise<void>;
  refreshDueReviews: () => Promise<void>;
}

export function useVocabularyProgress(studentId?: string): UseVocabularyProgressReturn {
  const [vocabularyList, setVocabularyList] = useState<VocabularyProgress[]>([]);
  const [dueReviews, setDueReviews] = useState<VocabularyProgress[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!studentId) {
      setVocabularyList([]);
      setDueReviews([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    // 1. Live vocabulary snapshot listener
    const unsubVocab = listenToStudentVocabulary(studentId, (list) => {
      setVocabularyList(list);
      setLoading(false);
    });

    // 2. Load due reviews for today
    getDueVocabularyReviews(studentId)
      .then((due) => setDueReviews(due))
      .catch((err) => console.warn('Could not load due reviews:', err));

    return () => unsubVocab();
  }, [studentId]);

  const reviewWordHandler = async (
    wordId: string,
    isCorrect: boolean,
    language: string = 'santali',
    wordText?: string,
    meaningHindi?: string,
    qualityRating?: number
  ): Promise<void> => {
    if (!studentId) return;
    try {
      await reviewVocabularyWord(
        studentId,
        wordId,
        language,
        isCorrect,
        wordText,
        meaningHindi,
        qualityRating
      );
      // Refresh due reviews
      const due = await getDueVocabularyReviews(studentId);
      setDueReviews(due);
    } catch (err: any) {
      setError(err?.message || 'Failed to review vocabulary word');
      throw err;
    }
  };

  const refreshDueReviews = async (): Promise<void> => {
    if (!studentId) return;
    const due = await getDueVocabularyReviews(studentId);
    setDueReviews(due);
  };

  const masteredCount = vocabularyList.filter((v) => v.mastered).length;
  const learningCount = vocabularyList.filter((v) => !v.mastered).length;

  return {
    vocabularyList,
    dueReviews,
    masteredCount,
    learningCount,
    loading,
    error,
    reviewWord: reviewWordHandler,
    refreshDueReviews,
  };
}

export default useVocabularyProgress;
