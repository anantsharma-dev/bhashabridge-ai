import * as admin from 'firebase-admin';
import { onCall, HttpsError } from 'firebase-functions/v2/https';

const db = admin.firestore();

/**
 * Generate a unique class code: e.g. DUM-G2-AB12
 */
function makeClassCode(district: string, grade: string): string {
  const distPrefix = (district.replace(/[^a-zA-Z]/g, '').slice(0, 3) || 'JHK').toUpperCase();
  const gradeDigits = grade.replace(/\D/g, '');
  const gradeTag = gradeDigits ? `G${gradeDigits}` : 'G1';
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let hash = '';
  for (let i = 0; i < 4; i++) {
    hash += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `${distPrefix}-${gradeTag}-${hash}`;
}

/**
 * 1. generateClassCode
 * Callable function to generate an authentic unique classroom code
 */
export const generateClassCode = onCall(async (request) => {
  if (!request.auth) {
    throw new HttpsError('unauthenticated', 'User must be authenticated.');
  }

  const { district = 'Dumka', grade = 'Grade 1' } = (request.data || {}) as {
    district?: string;
    grade?: string;
  };

  let uniqueCode = '';
  let attempts = 0;

  while (attempts < 5) {
    const candidate = makeClassCode(district, grade);
    const existing = await db
      .collection('classrooms')
      .where('classCode', '==', candidate)
      .limit(1)
      .get();

    if (existing.empty) {
      uniqueCode = candidate;
      break;
    }
    attempts++;
  }

  if (!uniqueCode) {
    throw new HttpsError('internal', 'Failed to generate unique classroom code. Please try again.');
  }

  return { classCode: uniqueCode };
});

/**
 * 2. joinClassroom
 * Callable function for student or teacher to join/verify a classroom via code.
 */
export const joinClassroom = onCall(async (request) => {
  const { classCode, studentName, rollNumber } = (request.data || {}) as {
    classCode: string;
    studentName?: string;
    rollNumber?: number;
  };

  if (!classCode || typeof classCode !== 'string' || classCode.trim().length === 0) {
    throw new HttpsError('invalid-argument', 'Valid classroom code is required.');
  }

  const cleanCode = classCode.trim().toUpperCase();

  try {
    const querySnapshot = await db
      .collection('classrooms')
      .where('classCode', '==', cleanCode)
      .limit(1)
      .get();

    if (querySnapshot.empty) {
      throw new HttpsError('not-found', `No active classroom found with code: ${cleanCode}`);
    }

    const classroomDoc = querySnapshot.docs[0];
    const classroom = classroomDoc.data();

    // If student information is provided and request has auth UID or is anonymous student
    let studentId: string | null = null;
    if (studentName && typeof rollNumber === 'number') {
      studentId = `stu_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
      const now = Date.now();
      const studentDoc = {
        studentId,
        teacherId: classroom.teacherId,
        classroomId: classroomDoc.id,
        rollNumber,
        name: studentName.trim(),
        gender: 'male',
        grade: classroom.grade || 'Grade 1',
        motherTongue: classroom.language || 'Santali',
        district: classroom.district || 'Dumka',
        block: classroom.block || 'Dumka Sadar',
        school: classroom.school || 'GPS Dumka Tribal Primary School',
        attendance: {},
        avatar: '🐯',
        createdAt: now,
        updatedAt: now,
      };

      await db.runTransaction(async (transaction) => {
        transaction.set(db.collection('students').doc(studentId!), studentDoc);
        transaction.update(classroomDoc.ref, {
          studentCount: admin.firestore.FieldValue.increment(1),
          updatedAt: now,
        });
      });
    }

    return {
      success: true,
      classroomId: classroomDoc.id,
      classroom,
      studentId,
    };
  } catch (error: any) {
    if (error instanceof HttpsError) {
      throw error;
    }
    console.error('Error in joinClassroom:', error);
    throw new HttpsError('internal', error.message || 'Failed to join classroom.');
  }
});
