import { useState, useEffect, useCallback } from 'react';
import type { Subject, CurriculumPack, GradeLevel } from '../types/curriculum';
import { curriculumService } from '../services/curriculum.service';

export interface UseCurriculumReturn {
  subjects: Subject[];
  curriculumPacks: CurriculumPack[];
  loading: boolean;
  error: string | null;
  selectedGrade: GradeLevel;
  setSelectedGrade: (grade: GradeLevel) => void;
  refresh: () => Promise<void>;
}

export function useCurriculum(initialGrade: GradeLevel = 'Grade 1'): UseCurriculumReturn {
  const [selectedGrade, setSelectedGrade] = useState<GradeLevel>(initialGrade);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [curriculumPacks, setCurriculumPacks] = useState<CurriculumPack[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCurriculum = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [subs, packs] = await Promise.all([
        curriculumService.getSubjects(selectedGrade),
        curriculumService.getCurriculumPacks(selectedGrade),
      ]);
      setSubjects(subs);
      setCurriculumPacks(packs);
    } catch (err: any) {
      setError(err?.message || 'Failed to load curriculum');
    } finally {
      setLoading(false);
    }
  }, [selectedGrade]);

  useEffect(() => {
    fetchCurriculum();

    const unsub = curriculumService.listenToSubjects((updated) => {
      setSubjects(updated);
      setLoading(false);
    }, selectedGrade);

    return () => unsub();
  }, [fetchCurriculum, selectedGrade]);

  return {
    subjects,
    curriculumPacks,
    loading,
    error,
    selectedGrade,
    setSelectedGrade,
    refresh: fetchCurriculum,
  };
}

export default useCurriculum;
