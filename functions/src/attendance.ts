import * as admin from 'firebase-admin';
import { onCall, HttpsError } from 'firebase-functions/v2/https';
import { getKolkataDateString } from './streak';
import { calculateLevel } from './progress';

const db = admin.firestore();

export interface StudentAttendanceInput {
  studentId: string;
  status: 'present' | 'absent' | 'late' | 'leave';
  remarks?: string;
}

export interface MarkAttendanceRequestData {
  classroomId: string;
  date?: string; // YYYY-MM-DD (defaults to today in Asia/Kolkata)
  records: StudentAttendanceInput[];
}

/**
 * 1. markAttendance
 * Callable Cloud Function to record classroom attendance, award attendanceXP, and compute stats.
 */
export const markAttendance = onCall(async (request) => {
  if (!request.auth) {
    throw new HttpsError('unauthenticated', 'Teacher must be authenticated to mark attendance.');
  }

  const teacherId = request.auth.uid;
  const { classroomId, date, records } = (request.data || {}) as MarkAttendanceRequestData;

  if (!classroomId || !Array.isArray(records) || records.length === 0) {
    throw new HttpsError('invalid-argument', 'classroomId and non-empty records array are required.');
  }

  const targetDate = date || getKolkataDateString();
  const now = Date.now();

  let presentCount = 0;
  let absentCount = 0;
  let lateCount = 0;
  let leaveCount = 0;

  try {
    const batch = db.batch();

    for (const rec of records) {
      const { studentId, status, remarks = '' } = rec;
      if (!studentId || !status) continue;

      if (status === 'present') presentCount++;
      else if (status === 'absent') absentCount++;
      else if (status === 'late') lateCount++;
      else if (status === 'leave') leaveCount++;

      const attDocId = `att_${classroomId}_${studentId}_${targetDate}`;
      const attRef = db.collection('attendance').doc(attDocId);

      batch.set(
        attRef,
        {
          attendanceId: attDocId,
          studentId,
          teacherId,
          classroomId,
          date: targetDate,
          status,
          checkInTime: now,
          remarks,
          createdAt: now,
          updatedAt: now,
        },
        { merge: true }
      );

      // Update student document attendance map
      const studentRef = db.collection('students').doc(studentId);
      batch.update(studentRef, {
        [`attendance.${targetDate}`]: status,
        updatedAt: now,
      });

      // If present or late, update student's attendanceXP in progress
      if (status === 'present' || status === 'late') {
        const xpBonus = status === 'present' ? 10 : 5;
        const progRef = db.collection('progress').doc(studentId);

        // Run progress update
        progRef.get().then((pSnap) => {
          const pData = pSnap.data() || {};
          const newAttendanceXP = (pData.attendanceXP || 0) + xpBonus;
          const newTotal = (pData.totalXP || 0) + xpBonus;
          const newLevel = calculateLevel(newTotal).currentLevel;

          progRef.set(
            {
              studentId,
              attendanceXP: newAttendanceXP,
              totalXP: newTotal,
              level: newLevel,
              lastActiveDate: targetDate,
              updatedAt: now,
            },
            { merge: true }
          );
        }).catch((err) => console.warn(`Progress update deferred for ${studentId}:`, err));
      }
    }

    await batch.commit();

    const totalStudents = records.length;
    const attendancePercentage =
      totalStudents > 0
        ? Math.round(((presentCount + lateCount * 0.5) / totalStudents) * 100)
        : 100;

    return {
      success: true,
      classroomId,
      date: targetDate,
      totalMarked: totalStudents,
      presentCount,
      absentCount,
      lateCount,
      leaveCount,
      attendancePercentage,
    };
  } catch (err: any) {
    console.error('Error in markAttendance:', err);
    throw new HttpsError('internal', err.message || 'Failed to record attendance.');
  }
});
