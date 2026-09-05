import { useState, useEffect, useCallback } from 'react';
import type { StudentRecommendationSet, GradeLevel } from '../types/curriculum';
import { recommendationService } from '../services/recommendation.service';

export interface UseRecommendationsProps {
  studentId: string;
  grade?: GradeLevel;
  subject?: string;
}

export interface UseRecommendationsReturn {
  recommendations: StudentRecommendationSet | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export function useRecommendations({
  studentId,
  grade = 'Grade 1',
  subject = 'fln_literacy',
}: UseRecommendationsProps): UseRecommendationsReturn {
  const [recommendations, setRecommendations] = useState<StudentRecommendationSet | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRecommendations = useCallback(async () => {
    if (!studentId) return;
    try {
      setLoading(true);
      setError(null);
      const set = await recommendationService.getStudentRecommendations(studentId, grade, subject);
      setRecommendations(set);
    } catch (err: any) {
      setError(err?.message || 'Failed to load recommendations');
    } finally {
      setLoading(false);
    }
  }, [studentId, grade, subject]);

  useEffect(() => {
    fetchRecommendations();
  }, [fetchRecommendations]);

  return {
    recommendations,
    loading,
    error,
    refresh: fetchRecommendations,
  };
}

export default useRecommendations;
