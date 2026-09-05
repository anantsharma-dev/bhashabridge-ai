import { useState, useEffect } from 'react';
import type { AttendanceRecord } from '../types/progress';
import {
  listenToClassroomAttendance,
  recordClassroomAttendance,
  getClassroomAttendanceByDate,
  type AttendanceSubmissionItem,
  type AttendanceDaySummary,
} from '../services/attendance.service';
import { getKolkataDateString } from '../services/progress.service';

export interface UseAttendanceReturn {
  records: AttendanceRecord[];
  loading: boolean;
  error: string | null;
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  summary: AttendanceDaySummary | null;
  submitAttendance: (
    items: AttendanceSubmissionItem[]
  ) => Promise<AttendanceDaySummary>;
  refresh: () => Promise<void>;
}

export function useAttendance(
  classroomId?: string,
  teacherId?: string,
  initialDate?: string
): UseAttendanceReturn {
  const [selectedDate, setSelectedDate] = useState<string>(
    initialDate || getKolkataDateString()
  );
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [summary, setSummary] = useState<AttendanceDaySummary | null>(null);

  useEffect(() => {
    if (!classroomId) {
      setRecords([]);
      setSummary(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const unsubscribe = listenToClassroomAttendance(
      classroomId,
      selectedDate,
      (list) => {
        setRecords(list);

        // Compute day summary
        const total = list.length;
        let present = 0;
        let absent = 0;
        let late = 0;
        let leave = 0;

        list.forEach((r) => {
          if (r.status === 'present') present++;
          else if (r.status === 'absent') absent++;
          else if (r.status === 'late') late++;
          else if (r.status === 'leave') leave++;
        });

        const pct = total > 0 ? Math.round(((present + late * 0.5) / total) * 100) : 100;

        setSummary({
          classroomId,
          date: selectedDate,
          totalStudents: total,
          presentCount: present,
          absentCount: absent,
          lateCount: late,
          leaveCount: leave,
          attendancePercentage: pct,
        });

        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [classroomId, selectedDate]);

  const submitAttendance = async (
    items: AttendanceSubmissionItem[]
  ): Promise<AttendanceDaySummary> => {
    if (!classroomId || !teacherId) {
      throw new Error('classroomId and teacherId are required to submit attendance.');
    }

    try {
      setLoading(true);
      const res = await recordClassroomAttendance(
        teacherId,
        classroomId,
        items,
        selectedDate
      );
      setSummary(res.summary);
      return res.summary;
    } catch (err: any) {
      setError(err?.message || 'Failed to submit attendance');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const refresh = async (): Promise<void> => {
    if (!classroomId) return;
    try {
      setLoading(true);
      const list = await getClassroomAttendanceByDate(classroomId, selectedDate);
      setRecords(list);
    } catch (err: any) {
      setError(err?.message || 'Failed to refresh attendance');
    } finally {
      setLoading(false);
    }
  };

  return {
    records,
    loading,
    error,
    selectedDate,
    setSelectedDate,
    summary,
    submitAttendance,
    refresh,
  };
}

export default useAttendance;
