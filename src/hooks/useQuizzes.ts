import { useState, useEffect, useCallback } from 'react';
import type { Quiz } from '../types/quiz';
import type { QuizFilterOptions } from '../services/quiz.service';
import { quizService } from '../services/quiz.service';

export interface UseQuizzesReturn {
  quizzes: Quiz[];
  loading: boolean;
  error: string | null;
  isOffline: boolean;
  offlineQuizzesCount: number;
  refresh: () => Promise<void>;
  createQuiz: (quizData: any, questions: any[]) => Promise<{ quizId: string }>;
  deleteQuiz: (quizId: string) => Promise<void>;
  publishQuiz: (quizId: string) => Promise<void>;
  duplicateQuiz: (quizId: string) => Promise<{ newQuizId: string }>;
  archiveQuiz: (quizId: string) => Promise<void>;
  cacheQuizForOffline: (quizId: string) => Promise<boolean>;
  getOfflineQuizzes: () => Promise<Quiz[]>;
}

export function useQuizzes(options: QuizFilterOptions = {}): UseQuizzesReturn {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [offlineQuizzesCount, setOfflineQuizzesCount] = useState<number>(0);
  const [isOffline, setIsOffline] = useState<boolean>(
    typeof navigator !== 'undefined' ? !navigator.onLine : false
  );

  // Monitor network status
  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const updateOfflineCount = useCallback(async () => {
    try {
      const offline = await quizService.getOfflineQuizzes();
      setOfflineQuizzesCount(offline.length);
    } catch {}
  }, []);

  const fetchQuizzes = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const list = await quizService.getQuizzes(options);
      setQuizzes(list);
      await updateOfflineCount();
    } catch (err: any) {
      setError(err?.message || 'Failed to fetch quizzes');
    } finally {
      setLoading(false);
    }
  }, [options.grade, options.subject, options.status, options.classroomId, options.teacherId, updateOfflineCount]);

  useEffect(() => {
    fetchQuizzes();

    // Listen to real-time updates when online
    const unsub = quizService.listenToQuizzes(options, (items) => {
      setQuizzes(items);
      setLoading(false);
      updateOfflineCount();
    });

    return () => unsub();
  }, [fetchQuizzes, updateOfflineCount]);

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

  const handleDuplicateQuiz = async (quizId: string) => {
    const res = await quizService.duplicateQuiz(quizId);
    await fetchQuizzes();
    return res;
  };

  const handleArchiveQuiz = async (quizId: string) => {
    await quizService.archiveQuiz(quizId);
    await fetchQuizzes();
  };

  const handleCacheQuizForOffline = async (quizId: string) => {
    const res = await quizService.cacheQuizForOffline(quizId);
    await updateOfflineCount();
    return res;
  };

  const handleGetOfflineQuizzes = async () => {
    return await quizService.getOfflineQuizzes();
  };

  return {
    quizzes,
    loading,
    error,
    isOffline,
    offlineQuizzesCount,
    refresh: fetchQuizzes,
    createQuiz: handleCreateQuiz,
    deleteQuiz: handleDeleteQuiz,
    publishQuiz: handlePublishQuiz,
    duplicateQuiz: handleDuplicateQuiz,
    archiveQuiz: handleArchiveQuiz,
    cacheQuizForOffline: handleCacheQuizForOffline,
    getOfflineQuizzes: handleGetOfflineQuizzes,
  };
}

export default useQuizzes;
