/**
 * BhashaBridge AI - Attendance Service
 * Production Firestore Service for Classroom Attendance, Realtime Sync, and Offline Operations
 */

import {
  doc,
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  onSnapshot,
  writeBatch,
  type Unsubscribe,
} from 'firebase/firestore';
import { db } from '../firebase/config';
import type { AttendanceRecord, AttendanceStatus, OfflineSyncOperation } from '../types/progress';
import { enqueueOfflineOperation, getKolkataDateString, awardStudentXP } from './progress.service';

export interface AttendanceSubmissionItem {
  studentId: string;
  status: AttendanceStatus;
  remarks?: string;
}

export interface AttendanceDaySummary {
  classroomId: string;
  date: string;
  totalStudents: number;
  presentCount: number;
  absentCount: number;
  lateCount: number;
  leaveCount: number;
  attendancePercentage: number;
}

/**
 * 1. Submit/Save classroom attendance for a specific date
 */
export async function recordClassroomAttendance(
  teacherId: string,
  classroomId: string,
  records: AttendanceSubmissionItem[],
  dateStr?: string
): Promise<{ summary: AttendanceDaySummary; offlineOps: OfflineSyncOperation[] }> {
  const date = dateStr || getKolkataDateString();
  const now = Date.now();
  const offlineOps: OfflineSyncOperation[] = [];

  let presentCount = 0;
  let absentCount = 0;
  let lateCount = 0;
  let leaveCount = 0;

  const batch = writeBatch(db);

  for (const item of records) {
    const { studentId, status, remarks = '' } = item;
    if (!studentId || !status) continue;

    if (status === 'present') presentCount++;
    else if (status === 'absent') absentCount++;
    else if (status === 'late') lateCount++;
    else if (status === 'leave') leaveCount++;

    const docId = `att_${classroomId}_${studentId}_${date}`;
    const attRef = doc(db, 'attendance', docId);

    const recordPayload: AttendanceRecord = {
      attendanceId: docId,
      studentId,
      teacherId,
      classroomId,
      date,
      status,
      checkInTime: now,
      remarks,
      createdAt: now,
      updatedAt: now,
    };

    batch.set(attRef, recordPayload, { merge: true });

    // Track offline operation for each attendance record
    const op = enqueueOfflineOperation('attendance', docId, recordPayload);
    offlineOps.push(op);

    // Update student doc attendance map
    const studentRef = doc(db, 'students', studentId);
    batch.update(studentRef, {
      [`attendance.${date}`]: status,
      updatedAt: now,
    });

    // Award attendanceXP if present (+10) or late (+5)
    if (status === 'present' || status === 'late') {
      const xp = status === 'present' ? 10 : 5;
      awardStudentXP(studentId, xp, 'attendance', docId).catch(() => {});
    }
  }

  await batch.commit();

  const total = records.length;
  const percentage =
    total > 0 ? Math.round(((presentCount + lateCount * 0.5) / total) * 100) : 100;

  const summary: AttendanceDaySummary = {
    classroomId,
    date,
    totalStudents: total,
    presentCount,
    absentCount,
    lateCount,
    leaveCount,
    attendancePercentage: percentage,
  };

  return { summary, offlineOps };
}

/**
 * 2. Fetch classroom attendance records for a specific date
 */
export async function getClassroomAttendanceByDate(
  classroomId: string,
  dateStr?: string
): Promise<AttendanceRecord[]> {
  const date = dateStr || getKolkataDateString();
  try {
    const q = query(
      collection(db, 'attendance'),
      where('classroomId', '==', classroomId),
      where('date', '==', date)
    );
    const snap = await getDocs(q);
    return snap.docs.map((d) => d.data() as AttendanceRecord);
  } catch (err) {
    console.error(`Error fetching attendance for classroom ${classroomId} on ${date}:`, err);
    return [];
  }
}

/**
 * 3. Real-time Classroom Attendance Listener
 */
export function listenToClassroomAttendance(
  classroomId: string,
  dateStr: string,
  callback: (records: AttendanceRecord[]) => void
): Unsubscribe {
  const q = query(
    collection(db, 'attendance'),
    where('classroomId', '==', classroomId),
    where('date', '==', dateStr)
  );

  return onSnapshot(
    q,
    (snapshot) => {
      const records = snapshot.docs.map((d) => d.data() as AttendanceRecord);
      callback(records);
    },
    (err) => {
      console.warn(`Attendance listener error for ${classroomId} on ${dateStr}:`, err);
    }
  );
}

/**
 * 4. Fetch Attendance History for a Student
 */
export async function getStudentAttendanceHistory(
  studentId: string,
  limitCount: number = 30
): Promise<AttendanceRecord[]> {
  try {
    const q = query(
      collection(db, 'attendance'),
      where('studentId', '==', studentId),
      orderBy('date', 'desc'),
      limit(limitCount)
    );
    const snap = await getDocs(q);
    return snap.docs.map((d) => d.data() as AttendanceRecord);
  } catch (err) {
    console.error(`Error fetching attendance history for student ${studentId}:`, err);
    return [];
  }
}

/**
 * 5. Compute Attendance Percentage for a Student
 */
export async function getStudentAttendancePercentage(studentId: string): Promise<number> {
  const history = await getStudentAttendanceHistory(studentId, 60);
  if (history.length === 0) return 100;

  let present = 0;
  history.forEach((rec) => {
    if (rec.status === 'present') present += 1;
    else if (rec.status === 'late') present += 0.5;
  });

  return Math.round((present / history.length) * 100);
}
