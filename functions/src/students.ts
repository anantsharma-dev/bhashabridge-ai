import * as admin from 'firebase-admin';
import { onCall, HttpsError } from 'firebase-functions/v2/https';

const db = admin.firestore();

export interface CreateStudentInput {
  classroomId: string;
  rollNumber: number;
  name: string;
  gender: 'male' | 'female' | 'other';
  grade: string;
  motherTongue: string;
  district?: string;
  block?: string;
  school?: string;
  avatar?: string;
}

/**
 * 1. createStudent
 * Callable function to validate and create student document.
 * Increments classroom's studentCount transactionally.
 */
export const createStudent = onCall(async (request) => {
  if (!request.auth) {
    throw new HttpsError('unauthenticated', 'User must be authenticated.');
  }

  const teacherId = request.auth.uid;
  const data = request.data as CreateStudentInput;

  if (!data.classroomId || !data.name || typeof data.rollNumber !== 'number') {
    throw new HttpsError('invalid-argument', 'Missing required student fields (classroomId, name, rollNumber).');
  }

  // Verify teacher owns the classroom
  const classroomRef = db.collection('classrooms').doc(data.classroomId);
  const classroomDoc = await classroomRef.get();

  if (!classroomDoc.exists) {
    throw new HttpsError('not-found', 'Classroom not found.');
  }

  const classroomData = classroomDoc.data();
  if (classroomData?.teacherId !== teacherId && request.auth.token.role !== 'admin') {
    throw new HttpsError('permission-denied', 'Only the classroom teacher can add students.');
  }

  const studentId = `stu_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
  const now = Date.now();

  const studentDoc = {
    studentId,
    teacherId,
    classroomId: data.classroomId,
    rollNumber: data.rollNumber,
    name: data.name.trim(),
    gender: data.gender || 'male',
    grade: data.grade || classroomData?.grade || 'Grade 1',
    motherTongue: data.motherTongue || 'Santali',
    district: data.district || classroomData?.district || 'Dumka',
    block: data.block || classroomData?.block || 'Dumka Sadar',
    school: data.school || classroomData?.school || 'GPS Dumka Tribal Primary School',
    attendance: {},
    avatar: data.avatar || '👦',
    createdAt: now,
    updatedAt: now,
  };

  try {
    await db.runTransaction(async (transaction) => {
      transaction.set(db.collection('students').doc(studentId), studentDoc);
      transaction.update(classroomRef, {
        studentCount: admin.firestore.FieldValue.increment(1),
        updatedAt: now,
      });
    });

    return { success: true, student: studentDoc };
  } catch (error: any) {
    console.error('Error creating student:', error);
    throw new HttpsError('internal', error.message || 'Failed to create student.');
  }
});

/**
 * 2. deleteStudent
 * Callable function to delete student and decrement studentCount.
 */
export const deleteStudent = onCall(async (request) => {
  if (!request.auth) {
    throw new HttpsError('unauthenticated', 'User must be authenticated.');
  }

  const teacherId = request.auth.uid;
  const { studentId, classroomId } = request.data as { studentId: string; classroomId: string };

  if (!studentId || !classroomId) {
    throw new HttpsError('invalid-argument', 'Missing studentId or classroomId.');
  }

  const studentRef = db.collection('students').doc(studentId);
  const studentDoc = await studentRef.get();

  if (!studentDoc.exists) {
    throw new HttpsError('not-found', 'Student not found.');
  }

  const sData = studentDoc.data();
  if (sData?.teacherId !== teacherId && request.auth.token.role !== 'admin') {
    throw new HttpsError('permission-denied', 'You can only delete your own students.');
  }

  const classroomRef = db.collection('classrooms').doc(classroomId);

  try {
    await db.runTransaction(async (transaction) => {
      transaction.delete(studentRef);
      transaction.update(classroomRef, {
        studentCount: admin.firestore.FieldValue.increment(-1),
        updatedAt: Date.now(),
      });
    });

    return { success: true, deletedStudentId: studentId };
  } catch (error: any) {
    console.error('Error deleting student:', error);
    throw new HttpsError('internal', error.message || 'Failed to delete student.');
  }
});

/**
 * 3. updateAttendance
 * Callable function to record attendance for a student on a specific date.
 */
export const updateAttendance = onCall(async (request) => {
  if (!request.auth) {
    throw new HttpsError('unauthenticated', 'User must be authenticated.');
  }

  const teacherId = request.auth.uid;
  const { studentId, dateKey, status } = request.data as {
    studentId: string;
    dateKey: string; // e.g. "2026-09-05"
    status: 'present' | 'absent' | 'late';
  };

  if (!studentId || !dateKey || !status) {
    throw new HttpsError('invalid-argument', 'Missing studentId, dateKey, or status.');
  }

  const studentRef = db.collection('students').doc(studentId);
  const studentDoc = await studentRef.get();

  if (!studentDoc.exists) {
    throw new HttpsError('not-found', 'Student not found.');
  }

  const sData = studentDoc.data();
  if (sData?.teacherId !== teacherId && request.auth.token.role !== 'admin') {
    throw new HttpsError('permission-denied', 'Only the student teacher can record attendance.');
  }

  try {
    await studentRef.update({
      [`attendance.${dateKey}`]: status,
      updatedAt: Date.now(),
    });

    return { success: true, studentId, dateKey, status };
  } catch (error: any) {
    console.error('Error updating attendance:', error);
    throw new HttpsError('internal', error.message || 'Failed to update attendance.');
  }
});
