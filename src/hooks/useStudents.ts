import { useState, useEffect } from 'react';
import {
  createStudentDoc,
  updateStudentDoc,
  deleteStudentDoc,
  updateStudentAttendanceDoc,
  listenToStudentsByClassroom,
  listenToStudentsByTeacher,
  type Student,
} from '../firebase/firestore';

export interface UseStudentsOptions {
  classroomId?: string;
  teacherId?: string;
}

export interface AttendanceSummary {
  totalStudents: number;
  presentCount: number;
  absentCount: number;
  lateCount: number;
  attendanceRate: number; // percentage e.g. 92
}

export interface UseStudentsReturn {
  students: Student[];
  loading: boolean;
  error: string | null;
  addStudent: (studentData: Omit<Student, 'studentId' | 'createdAt'>) => Promise<Student>;
  updateStudent: (studentId: string, updates: Partial<Student>) => Promise<void>;
  removeStudent: (studentId: string, classroomId: string) => Promise<void>;
  markAttendance: (
    studentId: string,
    dateKey: string,
    status: 'present' | 'absent' | 'late'
  ) => Promise<void>;
  getTodayAttendanceSummary: (dateKey?: string) => AttendanceSummary;
}

export function useStudents(options: UseStudentsOptions): UseStudentsReturn {
  const { classroomId, teacherId } = options;
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    let unsubscribe: (() => void) | null = null;

    if (classroomId) {
      unsubscribe = listenToStudentsByClassroom(classroomId, (list) => {
        setStudents(list);
        setLoading(false);
      });
    } else if (teacherId) {
      unsubscribe = listenToStudentsByTeacher(teacherId, (list) => {
        setStudents(list);
        setLoading(false);
      });
    } else {
      setStudents([]);
      setLoading(false);
    }

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [classroomId, teacherId]);

  const addStudent = async (
    studentData: Omit<Student, 'studentId' | 'createdAt'>
  ): Promise<Student> => {
    try {
      const created = await createStudentDoc(studentData);
      return created;
    } catch (err: any) {
      const msg = err?.message || 'Failed to add student';
      setError(msg);
      throw err;
    }
  };

  const updateStudent = async (studentId: string, updates: Partial<Student>): Promise<void> => {
    try {
      await updateStudentDoc(studentId, updates);
    } catch (err: any) {
      const msg = err?.message || 'Failed to update student';
      setError(msg);
      throw err;
    }
  };

  const removeStudent = async (studentId: string, targetClassroomId: string): Promise<void> => {
    try {
      await deleteStudentDoc(studentId, targetClassroomId);
    } catch (err: any) {
      const msg = err?.message || 'Failed to remove student';
      setError(msg);
      throw err;
    }
  };

  const markAttendance = async (
    studentId: string,
    dateKey: string,
    status: 'present' | 'absent' | 'late'
  ): Promise<void> => {
    try {
      await updateStudentAttendanceDoc(studentId, dateKey, status);
    } catch (err: any) {
      const msg = err?.message || 'Failed to record attendance';
      setError(msg);
      throw err;
    }
  };

  const getTodayAttendanceSummary = (
    dateKey: string = new Date().toISOString().slice(0, 10)
  ): AttendanceSummary => {
    const total = students.length;
    if (total === 0) {
      return { totalStudents: 0, presentCount: 0, absentCount: 0, lateCount: 0, attendanceRate: 100 };
    }

    let present = 0;
    let absent = 0;
    let late = 0;

    students.forEach((s) => {
      const status = s.attendance?.[dateKey];
      if (status === 'present') present++;
      else if (status === 'absent') absent++;
      else if (status === 'late') late++;
      else present++; // default to present if unmarked in rural classroom
    });

    const rate = Math.round(((present + late * 0.5) / total) * 100);
    return {
      totalStudents: total,
      presentCount: present,
      absentCount: absent,
      lateCount: late,
      attendanceRate: rate,
    };
  };

  return {
    students,
    loading,
    error,
    addStudent,
    updateStudent,
    removeStudent,
    markAttendance,
    getTodayAttendanceSummary,
  };
}

export default useStudents;
