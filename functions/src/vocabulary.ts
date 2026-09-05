import * as admin from 'firebase-admin';
import { onCall, HttpsError } from 'firebase-functions/v2/https';
import { calculateLevel, awardBadgeIfNew } from './progress';
import { evaluateStreak, getKolkataDateString } from './streak';

const db = admin.firestore();

/**
 * SuperMemo SM-2 Spaced Repetition Algorithm
 * Quality score: 5 (perfect), 4 (good), 3 (pass with difficulty), 2 (fail with memory), 1 (total blackout)
 */
export function calculateSM2(
  quality: number,
  reviewStage: number,
  easeFactor: number,
  previousIntervalDays: number
): {
  newReviewStage: number;
  newEaseFactor: number;
  intervalDays: number;
} {
  const q = Math.max(1, Math.min(5, quality));

  // 1. Calculate new Ease Factor: EF' = EF + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))
  let newEaseFactor = easeFactor + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02));
  if (newEaseFactor < 1.3) newEaseFactor = 1.3;

  let newReviewStage = reviewStage;
  let intervalDays = 1;

  if (q >= 3) {
    // Successful recall
    if (reviewStage === 0) {
      intervalDays = 1;
      newReviewStage = 1;
    } else if (reviewStage === 1) {
      intervalDays = 6;
      newReviewStage = 2;
    } else {
      intervalDays = Math.round(previousIntervalDays * newEaseFactor);
      newReviewStage = reviewStage + 1;
    }
  } else {
    // Failed recall: reset to beginning
    newReviewStage = 0;
    intervalDays = 1;
  }

  return {
    newReviewStage,
    newEaseFactor: Number(newEaseFactor.toFixed(2)),
    intervalDays: Math.max(1, intervalDays),
  };
}

/**
 * 1. completeFlashcard
 * Callable Cloud Function to review a vocabulary flashcard using SM-2
 */
export const completeFlashcard = onCall(async (request) => {
  const {
    studentId,
    wordId,
    language = 'santali',
    wordText = '',
    meaningHindi = '',
    isCorrect = true,
    qualityRating,
  } = (request.data || {}) as {
    studentId: string;
    wordId: string;
    language?: string;
    wordText?: string;
    meaningHindi?: string;
    isCorrect: boolean;
    qualityRating?: number; // 1 - 5
  };

  if (!studentId || !wordId) {
    throw new HttpsError('invalid-argument', 'studentId and wordId are required.');
  }

  const now = Date.now();
  const todayStr = getKolkataDateString();
  const quality = typeof qualityRating === 'number' ? qualityRating : isCorrect ? 5 : 2;

  const vocabDocId = `vocab_${studentId}_${wordId}`;
  const vocabRef = db.collection('vocabularyProgress').doc(vocabDocId);

  try {
    const existingSnap = await vocabRef.get();
    const existing = existingSnap.exists ? existingSnap.data()! : null;

    const currentStage = existing?.reviewStage ?? 0;
    const currentEF = existing?.easeFactor ?? 2.5;
    const currentInterval = existing?.intervalDays ?? 1;
    const prevCorrect = existing?.correctAttempts ?? 0;
    const prevWrong = existing?.wrongAttempts ?? 0;

    const sm2Result = calculateSM2(quality, currentStage, currentEF, currentInterval);

    const nextReviewDateObj = new Date(Date.now() + sm2Result.intervalDays * 24 * 60 * 60 * 1000);
    const nextReviewDate = getKolkataDateString(nextReviewDateObj);

    const newCorrectAttempts = isCorrect ? prevCorrect + 1 : prevCorrect;
    const newWrongAttempts = !isCorrect ? prevWrong + 1 : prevWrong;

    // Word is mastered after stage >= 3 with at least 3 correct recalls
    const wasMastered = existing?.mastered ?? false;
    const isNowMastered = sm2Result.newReviewStage >= 3 && newCorrectAttempts >= 3;
    const justMastered = !wasMastered && isNowMastered;

    // Difficulty score from 1 (easy) to 5 (hard) based on inverse of ease factor
    const difficultyScore = Math.min(5, Math.max(1, Math.round(6 - sm2Result.newEaseFactor)));

    const vocabData = {
      id: vocabDocId,
      studentId,
      wordId,
      language,
      wordText: wordText || existing?.wordText || '',
      meaningHindi: meaningHindi || existing?.meaningHindi || '',
      correctAttempts: newCorrectAttempts,
      wrongAttempts: newWrongAttempts,
      mastered: isNowMastered,
      lastReviewed: now,
      difficultyScore,
      reviewStage: sm2Result.newReviewStage,
      easeFactor: sm2Result.newEaseFactor,
      intervalDays: sm2Result.intervalDays,
      nextReviewDate,
    };

    await vocabRef.set(vocabData, { merge: true });

    // Award +5 vocabularyXP on correct attempt
    const xpAwarded = isCorrect ? 5 : 1;
    const progRef = db.collection('progress').doc(studentId);

    let newTotalXP = 0;
    let newLevel = 1;
    let totalMastered = 0;

    await db.runTransaction(async (t) => {
      const pSnap = await t.get(progRef);
      const pData = pSnap.exists ? pSnap.data()! : {};
      newTotalXP = (pData.totalXP || 0) + xpAwarded;
      newLevel = calculateLevel(newTotalXP).currentLevel;
      totalMastered = (pData.masteredWords || 0) + (justMastered ? 1 : 0);

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
          vocabularyXP: (pData.vocabularyXP || 0) + xpAwarded,
          totalXP: newTotalXP,
          level: newLevel,
          streak: newStreak,
          lastActiveDate: todayStr,
          masteredWords: totalMastered,
          updatedAt: now,
        },
        { merge: true }
      );
    });

    // Check vocabulary badges
    if (totalMastered >= 25) {
      await awardBadgeIfNew(
        studentId,
        'vocab_master',
        'Vocabulary Master',
        'Mastered 25 multilingual words with spaced repetition!',
        '🧠',
        'vocabulary'
      );
    }
    if (totalMastered >= 100) {
      await awardBadgeIfNew(
        studentId,
        '100_words_learned',
        '100 Words Learned',
        'Mastered 100 tribal and curriculum words!',
        '🌟',
        'vocabulary'
      );
    }

    return {
      success: true,
      studentId,
      wordId,
      isCorrect,
      xpAwarded,
      justMastered,
      isMastered: isNowMastered,
      nextReviewDate,
      intervalDays: sm2Result.intervalDays,
      reviewStage: sm2Result.newReviewStage,
      easeFactor: sm2Result.newEaseFactor,
    };
  } catch (err: any) {
    console.error('Error in completeFlashcard:', err);
    throw new HttpsError('internal', err.message || 'Failed to update vocabulary progress.');
  }
});
