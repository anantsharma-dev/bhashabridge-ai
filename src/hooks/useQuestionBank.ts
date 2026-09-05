import { useState, useEffect, useCallback } from 'react';
import type { QuestionBankItem } from '../types/quiz';
import type { QuestionBankFilter } from '../services/questionBank.service';
import { questionBankService } from '../services/questionBank.service';

export interface UseQuestionBankReturn {
  questions: QuestionBankItem[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  filterQuestions: (newFilter: QuestionBankFilter) => Promise<void>;
  addQuestion: (item: any) => Promise<string>;
}

export function useQuestionBank(initialFilter: QuestionBankFilter = {}): UseQuestionBankReturn {
  const [filter, setFilter] = useState<QuestionBankFilter>(initialFilter);
  const [questions, setQuestions] = useState<QuestionBankItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchQuestions = useCallback(async (currentFilter: QuestionBankFilter) => {
    try {
      setLoading(true);
      setError(null);
      const items = await questionBankService.queryQuestions(currentFilter);
      setQuestions(items);
    } catch (err: any) {
      setError(err?.message || 'Failed to query question bank');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchQuestions(filter);
  }, [fetchQuestions, filter]);

  const handleFilter = async (newFilter: QuestionBankFilter) => {
    setFilter(newFilter);
    await fetchQuestions(newFilter);
  };

  const handleAddQuestion = async (item: any) => {
    const id = await questionBankService.addQuestion(item);
    await fetchQuestions(filter);
    return id;
  };

  return {
    questions,
    loading,
    error,
    refresh: () => fetchQuestions(filter),
    filterQuestions: handleFilter,
    addQuestion: handleAddQuestion,
  };
}

export default useQuestionBank;
