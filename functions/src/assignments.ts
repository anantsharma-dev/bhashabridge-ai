import * as admin from 'firebase-admin';
import { onCall, HttpsError } from 'firebase-functions/v2/https';

const db = admin.firestore();

export interface AssignQuizInput {
  quizId: string;
  teacherId: string;
  classroomId: string;
  assignedDate?: string;
  dueDate: string;
  startTime?: number;
  endTime?: number;
  attemptLimit?: number;
  allowLateSubmission?: boolean;
  allowOfflineAttempt?: boolean;
  students?: string[]; // empty array = all
}

/**
 * 1. Assign Quiz to classroom or selected students
 */
export const assignQuiz = onCall(async (request) => {
  const data = request.data as AssignQuizInput;
  if (!data.quizId || !data.classroomId || !data.dueDate) {
    throw new HttpsError('invalid-argument', 'quizId, classroomId, and dueDate are required');
  }

  const now = Date.now();
  const assignmentId = `asg_quiz_${now}_${Math.random().toString(36).slice(2, 6)}`;
  const assignedDate = data.assignedDate || new Date().toISOString().slice(0, 10);

  // Fetch quiz title for notification
  const quizDoc = await db.collection('quizzes').doc(data.quizId).get();
  const quizTitle = quizDoc.exists ? (quizDoc.data()?.title || 'Quiz') : 'Classroom Assessment';

  const assignmentDoc = {
    assignmentId,
    quizId: data.quizId,
    teacherId: data.teacherId || request.auth?.uid || 'teacher-01',
    classroomId: data.classroomId,
    assignedDate,
    dueDate: data.dueDate,
    startTime: data.startTime || now,
    endTime: data.endTime || (now + 86400000 * 7),
    attemptLimit: data.attemptLimit || 1,
    status: 'active',
    allowLateSubmission: data.allowLateSubmission ?? true,
    allowOfflineAttempt: data.allowOfflineAttempt ?? true,
    students: data.students || [],
    createdAt: now,
    updatedAt: now,
  };

  const batch = db.batch();
  batch.set(db.collection('assignments').doc(assignmentId), assignmentDoc);

  // Create notifications in notification collection
  const notifId = `notif_${assignmentId}`;
  batch.set(db.collection('notifications').doc(notifId), {
    notificationId: notifId,
    classroomId: data.classroomId,
    type: 'quiz_assigned',
    title: 'New Quiz Assigned! 📝',
    message: `Teacher has assigned "${quizTitle}". Due: ${data.dueDate}.`,
    quizId: data.quizId,
    assignmentId,
    createdAt: now,
    read: false,
  });

  await batch.commit();

  return { success: true, assignmentId, title: quizTitle };
});

/**
 * 2. Update Assignment Status
 */
export const updateAssignmentStatus = onCall(async (request) => {
  const { assignmentId, status } = request.data as { assignmentId: string; status: string };
  if (!assignmentId || !status) {
    throw new HttpsError('invalid-argument', 'assignmentId and status are required');
  }

  await db.collection('assignments').doc(assignmentId).update({
    status,
    updatedAt: Date.now(),
  });

  return { success: true, assignmentId, status };
});
