import { useState, useEffect, useCallback } from 'react';
import type { Quiz } from '../types/quiz';
import type { QuizFilterOptions } from '../services/quiz.service';
import { quizService } from '../services/quiz.service';

export interface UseQuizzesReturn {
  quizzes: Quiz[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  createQuiz: (quizData: any, questions: any[]) => Promise<{ quizId: string }>;
  deleteQuiz: (quizId: string) => Promise<void>;
  publishQuiz: (quizId: string) => Promise<void>;
}

export function useQuizzes(options: QuizFilterOptions = {}): UseQuizzesReturn {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchQuizzes = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const list = await quizService.getQuizzes(options);
      setQuizzes(list);
    } catch (err: any) {
      setError(err?.message || 'Failed to fetch quizzes');
    } finally {
      setLoading(false);
    }
  }, [options.grade, options.subject, options.status, options.classroomId, options.teacherId]);

  useEffect(() => {
    fetchQuizzes();

    const unsub = quizService.listenToQuizzes(options, (items) => {
      setQuizzes(items);
      setLoading(false);
    });

    return () => unsub();
  }, [fetchQuizzes]);

  const handleCreateQuiz = async (quizData: any, questions: any[]) => {
    const res = await quizService.createQuiz(quizData, questions);
    await fetchQuizzes();
    return res;
  };

  const handleDeleteQuiz = async (quizId: string) => {
    await quizService.deleteQuiz(quizId);
    await fetchQuizzes();
  };

  const handlePublishQuiz = async (quizId: string) => {
    await quizService.publishQuiz(quizId);
    await fetchQuizzes();
  };

  return {
    quizzes,
    loading,
    error,
    refresh: fetchQuizzes,
    createQuiz: handleCreateQuiz,
    deleteQuiz: handleDeleteQuiz,
    publishQuiz: handlePublishQuiz,
  };
}

export default useQuizzes;
