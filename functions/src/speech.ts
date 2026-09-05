import * as admin from 'firebase-admin';
import { onCall, HttpsError } from 'firebase-functions/v2/https';
import { calculateLevel, awardBadgeIfNew } from './progress';
import { evaluateStreak, getKolkataDateString } from './streak';

const db = admin.firestore();

export interface CompleteSpeechPracticeInput {
  studentId: string;
  teacherId?: string;
  sentence: string;
  transcript: string;
  accuracy: number; // 0 - 100
  pronunciation: number; // 0 - 100
  fluency?: number; // 0 - 100
  confidence?: number; // 0 - 100
  feedback?: string;
  phonemeErrors?: string[];
  missedWords?: string[];
}

/**
 * 1. completeSpeechPractice
 * Callable Cloud Function to record speech & pronunciation analytics and award speakingXP.
 */
export const completeSpeechPractice = onCall(async (request) => {
  const data = (request.data || {}) as CompleteSpeechPracticeInput;
  const {
    studentId,
    teacherId = 'system',
    sentence,
    transcript,
    accuracy = 80,
    pronunciation = 80,
    fluency = 75,
    confidence = 80,
    feedback = 'Good pronunciation!',
    phonemeErrors = [],
    missedWords = [],
  } = data;

  if (!studentId || !sentence) {
    throw new HttpsError('invalid-argument', 'studentId and sentence are required.');
  }

  const now = Date.now();
  const todayStr = getKolkataDateString();

  // Speaking XP formula: accuracy-weighted (up to 20 XP) + base (5 XP)
  const xpAwarded = Math.max(5, Math.round((accuracy / 100) * 20) + 5);
  const sessionId = `speech_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;

  try {
    // 1. Record in speechSessions
    await db.collection('speechSessions').doc(sessionId).set({
      sessionId,
      studentId,
      teacherId,
      sentence,
      transcript,
      accuracy,
      pronunciation,
      fluency,
      confidence,
      feedback,
      phonemeErrors,
      missedWords,
      createdAt: now,
    });

    // 2. Transactionally update student progress
    const progRef = db.collection('progress').doc(studentId);
    let updatedPronunciationScore = pronunciation;

    await db.runTransaction(async (t) => {
      const pSnap = await t.get(progRef);
      const pData = pSnap.exists ? pSnap.data()! : {};

      const prevPronun = pData.pronunciationScore || 70;
      updatedPronunciationScore = Math.round((prevPronun * 0.7) + (pronunciation * 0.3));

      const newTotalXP = (pData.totalXP || 0) + xpAwarded;
      const newLevel = calculateLevel(newTotalXP).currentLevel;

      const { newStreak } = await evaluateStreak(
        db,
        studentId,
        pData.lastActiveDate || '',
        pData.streak || 0,
        xpAwarded
      );

      t.set(
        progRef,
        {
          studentId,
          speakingXP: (pData.speakingXP || 0) + xpAwarded,
          totalXP: newTotalXP,
          level: newLevel,
          streak: newStreak,
          lastActiveDate: todayStr,
          pronunciationScore: updatedPronunciationScore,
          confidenceScore: Math.round(((pData.confidenceScore || 80) * 0.7) + (confidence * 0.3)),
          updatedAt: now,
        },
        { merge: true }
      );
    });

    // 3. Evaluate Pronunciation Hero badge
    let badgeEarned = false;
    if (updatedPronunciationScore >= 90) {
      badgeEarned = await awardBadgeIfNew(
        studentId,
        'pronunciation_hero',
        'Pronunciation Hero',
        'Achieved 90%+ in indigenous language pronunciation!',
        '🗣️',
        'speaking'
      );
    }

    return {
      success: true,
      studentId,
      sessionId,
      xpAwarded,
      updatedPronunciationScore,
      badgeEarned,
    };
  } catch (err: any) {
    console.error('Error in completeSpeechPractice:', err);
    throw new HttpsError('internal', err.message || 'Failed to record speech practice.');
  }
});
