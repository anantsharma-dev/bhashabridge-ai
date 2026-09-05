import * as admin from 'firebase-admin';
import { onCall, HttpsError } from 'firebase-functions/v2/https';

const db = admin.firestore();

interface OfflineAttemptPayload {
  attemptId: string;
  quizId: string;
  studentId: string;
  classroomId: string;
  teacherId?: string;
  startedAt: number;
  submittedAt: number;
  timeTakenSeconds: number;
  answers: Array<{
    questionId: string;
    userAnswer: any;
    timeSpentSeconds?: number;
  }>;
}

/**
 * 1. Sync Offline Quiz Attempt with Conflict Resolution & Atomic Grading
 */
export const syncOfflineAttempt = onCall(async (request) => {
  const data = request.data as OfflineAttemptPayload;
  if (!data.attemptId || !data.quizId || !data.studentId) {
    throw new HttpsError('invalid-argument', 'attemptId, quizId, and studentId are required');
  }

  // Check if attempt was already processed to prevent duplicate scoring
  const existingSnap = await db.collection('quizAttempts').doc(data.attemptId).get();
  if (existingSnap.exists && existingSnap.data()?.syncStatus === 'synced') {
    return { success: true, attemptId: data.attemptId, status: 'already_synced' };
  }

  // Fetch Questions for Evaluation
  const questionsSnap = await db.collection('quizQuestions').where('quizId', '==', data.quizId).get();
  const questionsMap = new Map<string, any>();
  questionsSnap.forEach((d) => questionsMap.set(d.id, d.data()));

  let totalPossible = 0;
  let scoreEarned = 0;
  let correctCount = 0;
  let wrongCount = 0;
  let skippedCount = 0;

  const evaluatedAnswers = (data.answers || []).map((item) => {
    const q = questionsMap.get(item.questionId);
    const points = q ? (q.points || 10) : 10;
    totalPossible += points;

    if (item.userAnswer === undefined || item.userAnswer === null || item.userAnswer === '') {
      skippedCount++;
      return {
        questionId: item.questionId,
        userAnswer: null,
        isCorrect: false,
        pointsEarned: 0,
        timeSpentSeconds: item.timeSpentSeconds || 0,
      };
    }

    const expected = q?.correctAnswer ?? '';
    const isCorrect = String(expected).trim().toLowerCase() === String(item.userAnswer).trim().toLowerCase();

    if (isCorrect) {
      correctCount++;
      scoreEarned += points;
      return {
        questionId: item.questionId,
        userAnswer: item.userAnswer,
        isCorrect: true,
        pointsEarned: points,
        timeSpentSeconds: item.timeSpentSeconds || 0,
      };
    } else {
      wrongCount++;
      return {
        questionId: item.questionId,
        userAnswer: item.userAnswer,
        isCorrect: false,
        pointsEarned: 0,
        timeSpentSeconds: item.timeSpentSeconds || 0,
      };
    }
  });

  if (totalPossible === 0) totalPossible = 100;
  const percentage = Math.round((scoreEarned / totalPossible) * 100);
  const passed = percentage >= 60;
  const earnedXP = passed ? 40 : 15;

  const now = Date.now();
  const attemptDoc = {
    attemptId: data.attemptId,
    quizId: data.quizId,
    studentId: data.studentId,
    teacherId: data.teacherId || 'teacher-01',
    classroomId: data.classroomId || 'class_dumka_g2',
    startedAt: data.startedAt || (now - 60000),
    submittedAt: data.submittedAt || now,
    timeTakenSeconds: data.timeTakenSeconds || 60,
    score: scoreEarned,
    percentage,
    passed,
    answers: evaluatedAnswers,
    correctCount,
    wrongCount,
    skippedCount,
    earnedXP,
    deviceOffline: true,
    syncStatus: 'synced',
    syncedAt: now,
  };

  const batch = db.batch();
  batch.set(db.collection('quizAttempts').doc(data.attemptId), attemptDoc);

  // Update Progress atomically
  const progressRef = db.collection('progress').doc(data.studentId);
  batch.set(
    progressRef,
    {
      totalXP: admin.firestore.FieldValue.increment(earnedXP),
      quizXP: admin.firestore.FieldValue.increment(earnedXP),
      completedQuizzes: admin.firestore.FieldValue.increment(1),
      updatedAt: now,
    },
    { merge: true }
  );

  await batch.commit();

  return { success: true, attemptId: data.attemptId, percentage, earnedXP, passed };
});

/**
 * 2. Resume In-Progress Quiz Attempt: Fetches auto-saved partial progress
 */
export const resumeAttempt = onCall(async (request) => {
  const { attemptId } = request.data as { attemptId: string };
  if (!attemptId) throw new HttpsError('invalid-argument', 'attemptId is required');

  const snap = await db.collection('inProgressAttempts').doc(attemptId).get();
  if (!snap.exists) {
    return { success: true, hasExistingAttempt: false };
  }

  const attempt = snap.data();
  return {
    success: true,
    hasExistingAttempt: true,
    attempt,
  };
});
