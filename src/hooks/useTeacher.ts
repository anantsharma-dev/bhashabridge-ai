import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  getTeacherProfileDoc,
  updateTeacherProfileDoc,
  listenToTeacherProfile,
  type Teacher,
} from '../firebase/firestore';

export interface UseTeacherReturn {
  teacher: Teacher | null;
  loading: boolean;
  error: string | null;
  updateProfile: (updates: Partial<Teacher>) => Promise<void>;
  reload: () => Promise<void>;
}

export function useTeacher(targetTeacherId?: string): UseTeacherReturn {
  const { user, teacher: authTeacher } = useAuth();
  const effectiveTeacherId = targetTeacherId || user?.uid;

  const [teacher, setTeacher] = useState<Teacher | null>(
    !targetTeacherId ? authTeacher : null
  );
  const [loading, setLoading] = useState<boolean>(!teacher);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!effectiveTeacherId) {
      setTeacher(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    // Subscribe to real-time teacher document updates
    const unsubscribe = listenToTeacherProfile(effectiveTeacherId, (docData) => {
      setTeacher(docData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [effectiveTeacherId]);

  const updateProfile = async (updates: Partial<Teacher>): Promise<void> => {
    if (!effectiveTeacherId) throw new Error('No active teacher ID');
    try {
      await updateTeacherProfileDoc(effectiveTeacherId, updates);
      // Real-time listener will update local state automatically
    } catch (err: any) {
      const msg = err?.message || 'Failed to update teacher profile';
      setError(msg);
      throw err;
    }
  };

  const reload = async (): Promise<void> => {
    if (!effectiveTeacherId) return;
    try {
      setLoading(true);
      const docData = await getTeacherProfileDoc(effectiveTeacherId);
      setTeacher(docData);
    } catch (err: any) {
      setError(err?.message || 'Failed to reload profile');
    } finally {
      setLoading(false);
    }
  };

  return {
    teacher,
    loading,
    error,
    updateProfile,
    reload,
  };
}

export default useTeacher;
