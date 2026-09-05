import { useState, useEffect, useCallback } from 'react';
import type { QuizResult, QuizReportCard } from '../types/quiz';
import { resultsService } from '../services/results.service';

export interface UseQuizResultsReturn {
  results: QuizResult[];
  reportCard: QuizReportCard | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  generateReport: () => Promise<QuizReportCard>;
}

export function useQuizResults(studentId?: string, classroomId?: string): UseQuizResultsReturn {
  const [results, setResults] = useState<QuizResult[]>([]);
  const [reportCard, setReportCard] = useState<QuizReportCard | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchResults = useCallback(async () => {
    if (!studentId) {
      setResults([]);
      setReportCard(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const [list, report] = await Promise.all([
        resultsService.getResultsByStudent(studentId),
        resultsService.generateReportCard(studentId, classroomId),
      ]);
      setResults(list);
      setReportCard(report);
    } catch (err: any) {
      setError(err?.message || 'Failed to fetch quiz results');
    } finally {
      setLoading(false);
    }
  }, [studentId, classroomId]);

  useEffect(() => {
    fetchResults();

    if (!studentId) return;

    const unsub = resultsService.listenToStudentResults(studentId, (items) => {
      setResults(items);
      setLoading(false);
    });

    return () => unsub();
  }, [studentId, fetchResults]);

  const handleGenerateReport = async () => {
    if (!studentId) throw new Error('Student ID required');
    const rep = await resultsService.generateReportCard(studentId, classroomId);
    setReportCard(rep);
    return rep;
  };

  return {
    results,
    reportCard,
    loading,
    error,
    refresh: fetchResults,
    generateReport: handleGenerateReport,
  };
}

export default useQuizResults;
