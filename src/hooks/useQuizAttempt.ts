import { useState, useEffect, useRef, useCallback } from 'react';
import type { Quiz, Question, QuizResult, QuizAttemptAnswer } from '../types/quiz';
import { quizService } from '../services/quiz.service';

export interface UseQuizAttemptProps {
  quizId: string;
  studentId: string;
  classroomId?: string;
  teacherId?: string;
  onComplete?: (result: QuizResult) => void;
}

export interface UseQuizAttemptReturn {
  quiz: Quiz | null;
  questions: Question[];
  currentQuestion: Question | null;
  currentIndex: number;
  answers: Record<string, any>;
  timeRemainingSeconds: number;
  loading: boolean;
  isSubmitting: boolean;
  result: QuizResult | null;
  setAnswer: (questionId: string, answer: any) => void;
  goToQuestion: (index: number) => void;
  nextQuestion: () => void;
  prevQuestion: () => void;
  submitQuiz: () => Promise<QuizResult | null>;
}

export function useQuizAttempt({
  quizId,
  studentId,
  classroomId = 'class_dumka_g2',
  teacherId = 'teacher-01',
  onComplete,
}: UseQuizAttemptProps): UseQuizAttemptReturn {
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [timeRemainingSeconds, setTimeRemainingSeconds] = useState<number>(900); // 15 mins default
  const [loading, setLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [result, setResult] = useState<QuizResult | null>(null);

  const attemptIdRef = useRef<string>(`att_${studentId}_${quizId}_${Date.now()}`);
  const startTimeRef = useRef<number>(Date.now());
  const timerRef = useRef<any>(null);
  const autoSaveTimerRef = useRef<any>(null);

  // 1. Initial Load & Resume Safe Attempt
  useEffect(() => {
    let isMounted = true;

    async function loadQuizData() {
      try {
        setLoading(true);
        const [q, qs] = await Promise.all([
          quizService.getQuizById(quizId),
          quizService.getQuizQuestions(quizId),
        ]);

        if (!isMounted) return;
        setQuiz(q);
        setQuestions(qs);

        const initialTime = (q?.timeLimitMinutes || 15) * 60;
        setTimeRemainingSeconds(initialTime);

        // Check if there was an in-progress auto-saved attempt
        const existing = await quizService.getAutoSavedAttempt(attemptIdRef.current);
        if (existing && existing.answers) {
          setAnswers(existing.answers);
          if (existing.timeRemainingSeconds) {
            setTimeRemainingSeconds(existing.timeRemainingSeconds);
          }
        }
      } catch (err) {
        console.warn('Error initializing quiz attempt:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadQuizData();
    return () => {
      isMounted = false;
    };
  }, [quizId]);

  // 2. Timer Countdown & Auto-Save Every 10 Seconds
  useEffect(() => {
    if (loading || isSubmitting || result) return;

    timerRef.current = setInterval(() => {
      setTimeRemainingSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    autoSaveTimerRef.current = setInterval(() => {
      quizService.autoSaveAttempt(attemptIdRef.current, {
        quizId,
        studentId,
        classroomId,
        answers,
        timeRemainingSeconds,
      });
    }, 10000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (autoSaveTimerRef.current) clearInterval(autoSaveTimerRef.current);
    };
  }, [loading, isSubmitting, result, answers, timeRemainingSeconds, quizId, studentId, classroomId]);

  const setAnswer = (questionId: string, answer: any) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }));
  };

  const goToQuestion = (index: number) => {
    if (index >= 0 && index < questions.length) {
      setCurrentIndex(index);
    }
  };

  const nextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((i) => i + 1);
    }
  };

  const prevQuestion = () => {
    if (currentIndex > 0) {
      setCurrentIndex((i) => i - 1);
    }
  };

  const submitQuiz = useCallback(async (): Promise<QuizResult | null> => {
    if (isSubmitting || result) return result;

    try {
      setIsSubmitting(true);
      if (timerRef.current) clearInterval(timerRef.current);
      if (autoSaveTimerRef.current) clearInterval(autoSaveTimerRef.current);

      const totalAllowed = (quiz?.timeLimitMinutes || 15) * 60;
      const timeTaken = Math.max(10, totalAllowed - timeRemainingSeconds);

      let totalPoints = 0;
      let earnedPoints = 0;
      let correctCount = 0;
      let wrongCount = 0;
      let skippedCount = 0;

      const formattedAnswers: QuizAttemptAnswer[] = questions.map((q) => {
        const pts = q.points || 10;
        totalPoints += pts;

        const ans = answers[q.questionId];
        if (ans === undefined || ans === null || ans === '') {
          skippedCount++;
          return {
            questionId: q.questionId,
            userAnswer: null,
            isCorrect: false,
            pointsEarned: 0,
            timeSpentSeconds: Math.round(timeTaken / (questions.length || 1)),
          };
        }

        const expStr = String(q.correctAnswer).trim().toLowerCase();
        const ansStr = String(ans).trim().toLowerCase();
        const isMatch = expStr === ansStr || expStr.includes(ansStr) || ansStr.includes(expStr);

        if (isMatch) {
          correctCount++;
          earnedPoints += pts;
        } else {
          wrongCount++;
        }

        return {
          questionId: q.questionId,
          userAnswer: ans,
          isCorrect: isMatch,
          pointsEarned: isMatch ? pts : 0,
          timeSpentSeconds: Math.round(timeTaken / (questions.length || 1)),
        };
      });

      if (totalPoints === 0) totalPoints = 100;
      const percentage = Math.round((earnedPoints / totalPoints) * 100);
      const passed = percentage >= 60;
      const earnedXP = passed ? 40 : 15;

      const attemptPayload = {
        attemptId: attemptIdRef.current,
        quizId,
        studentId,
        teacherId,
        classroomId,
        startedAt: startTimeRef.current,
        timeTakenSeconds: timeTaken,
        score: earnedPoints,
        percentage,
        passed,
        answers: formattedAnswers,
        correctCount,
        wrongCount,
        skippedCount,
        earnedXP,
        deviceOffline: typeof navigator !== 'undefined' && !navigator.onLine,
        syncStatus: 'synced' as const,
      };

      const res = await quizService.submitAttempt(attemptPayload);
      setResult(res);
      onComplete?.(res);
      return res;
    } catch (err) {
      console.error('Error submitting quiz attempt:', err);
      return null;
    } finally {
      setIsSubmitting(false);
    }
  }, [isSubmitting, result, quiz, timeRemainingSeconds, questions, answers, quizId, studentId, teacherId, classroomId, onComplete]);

  const handleAutoSubmit = () => {
    submitQuiz();
  };

  return {
    quiz,
    questions,
    currentQuestion: questions[currentIndex] || null,
    currentIndex,
    answers,
    timeRemainingSeconds,
    loading,
    isSubmitting,
    result,
    setAnswer,
    goToQuestion,
    nextQuestion,
    prevQuestion,
    submitQuiz,
  };
}

export default useQuizAttempt;
