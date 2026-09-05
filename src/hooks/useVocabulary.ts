import { useState, useEffect, useCallback } from 'react';
import type { VocabularyWord, GradeLevel, SubjectCode } from '../types/curriculum';
import { vocabularyService } from '../services/vocabulary.service';

export interface UseVocabularyProps {
  grade?: GradeLevel;
  subject?: SubjectCode | string;
  category?: string;
  relatedLesson?: string;
}

export interface UseVocabularyReturn {
  words: VocabularyWord[];
  categories: string[];
  loading: boolean;
  error: string | null;
  search: (term: string) => Promise<VocabularyWord[]>;
  refresh: () => Promise<void>;
}

export function useVocabulary(props: UseVocabularyProps = {}): UseVocabularyReturn {
  const [words, setWords] = useState<VocabularyWord[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchVocabulary = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [list, cats] = await Promise.all([
        vocabularyService.getVocabularyWords(props),
        vocabularyService.getCategories(),
      ]);
      setWords(list);
      setCategories(cats);
    } catch (err: any) {
      setError(err?.message || 'Failed to fetch vocabulary');
    } finally {
      setLoading(false);
    }
  }, [props.grade, props.subject, props.category, props.relatedLesson]);

  useEffect(() => {
    fetchVocabulary();
  }, [fetchVocabulary]);

  const handleSearch = async (term: string) => {
    return await vocabularyService.searchVocabulary(term);
  };

  return {
    words,
    categories,
    loading,
    error,
    search: handleSearch,
    refresh: fetchVocabulary,
  };
}

export default useVocabulary;
