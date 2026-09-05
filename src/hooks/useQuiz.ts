import { useState, useEffect, useCallback } from 'react';
import type { Quiz, Question } from '../types/quiz';
import { quizService } from '../services/quiz.service';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase/config';

export interface UseQuizReturn {
  quiz: Quiz | null;
  questions: Question[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export function useQuiz(quizId?: string): UseQuizReturn {
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDetails = useCallback(async () => {
    if (!quizId) {
      setQuiz(null);
      setQuestions([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const [qData, qsData] = await Promise.all([
        quizService.getQuizById(quizId),
        quizService.getQuizQuestions(quizId),
      ]);
      setQuiz(qData);
      setQuestions(qsData);
    } catch (err: any) {
      setError(err?.message || 'Failed to load quiz');
    } finally {
      setLoading(false);
    }
  }, [quizId]);

  useEffect(() => {
    fetchDetails();

    if (!quizId) return;

    // Real-time listener on quiz doc
    const unsub = onSnapshot(
      doc(db, 'quizzes', quizId),
      (snap) => {
        if (snap.exists()) {
          setQuiz(snap.data() as Quiz);
        }
      },
      (err) => console.warn('Error listening to quiz doc:', err)
    );

    return () => unsub();
  }, [quizId, fetchDetails]);

  return {
    quiz,
    questions,
    loading,
    error,
    refresh: fetchDetails,
  };
}

export default useQuiz;
