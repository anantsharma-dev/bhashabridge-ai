import { useState, useEffect } from 'react';
import {
  createClassroomDoc,
  updateClassroomDoc,
  deleteClassroomDoc,
  getClassroomByCode,
  listenToClassroomsByTeacher,
  generateClassCode,
  type Classroom,
} from '../firebase/firestore';

export interface UseClassroomsReturn {
  classrooms: Classroom[];
  loading: boolean;
  error: string | null;
  addClassroom: (
    classroomData: Omit<Classroom, 'classroomId' | 'classCode' | 'createdAt' | 'studentCount'> & {
      district?: string;
      customCode?: string;
    }
  ) => Promise<Classroom>;
  updateClassroom: (classroomId: string, updates: Partial<Classroom>) => Promise<void>;
  removeClassroom: (classroomId: string) => Promise<void>;
  findByJoinCode: (code: string) => Promise<Classroom | null>;
  generateNewCode: (district: string, grade: string) => string;
}

export function useClassrooms(teacherId?: string): UseClassroomsReturn {
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!teacherId) {
      setClassrooms([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const unsubscribe = listenToClassroomsByTeacher(teacherId, (list) => {
      setClassrooms(list);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [teacherId]);

  const addClassroom = async (
    data: Omit<Classroom, 'classroomId' | 'classCode' | 'createdAt' | 'studentCount'> & {
      district?: string;
      customCode?: string;
    }
  ): Promise<Classroom> => {
    try {
      const code = data.customCode || generateClassCode(data.district || 'DUM', data.grade);
      const created = await createClassroomDoc({
        ...data,
        classCode: code,
      });
      return created;
    } catch (err: any) {
      const msg = err?.message || 'Failed to create classroom';
      setError(msg);
      throw err;
    }
  };

  const updateClassroom = async (
    classroomId: string,
    updates: Partial<Classroom>
  ): Promise<void> => {
    try {
      await updateClassroomDoc(classroomId, updates);
    } catch (err: any) {
      const msg = err?.message || 'Failed to update classroom';
      setError(msg);
      throw err;
    }
  };

  const removeClassroom = async (classroomId: string): Promise<void> => {
    try {
      await deleteClassroomDoc(classroomId);
    } catch (err: any) {
      const msg = err?.message || 'Failed to delete classroom';
      setError(msg);
      throw err;
    }
  };

  const findByJoinCode = async (code: string): Promise<Classroom | null> => {
    try {
      return await getClassroomByCode(code);
    } catch (err: any) {
      setError(err?.message || 'Failed to find classroom by code');
      return null;
    }
  };

  const generateNewCode = (district: string, grade: string): string => {
    return generateClassCode(district, grade);
  };

  return {
    classrooms,
    loading,
    error,
    addClassroom,
    updateClassroom,
    removeClassroom,
    findByJoinCode,
    generateNewCode,
  };
}

export default useClassrooms;
