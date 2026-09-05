import * as admin from 'firebase-admin';
import { onCall, HttpsError } from 'firebase-functions/v2/https';
import { calculateLevel, awardBadgeIfNew } from './progress';
import { evaluateStreak, getKolkataDateString } from './streak';

const db = admin.firestore();

export interface CompleteStoryInput {
  studentId: string;
  storyId: string;
  language?: string;
  readingTimeSeconds: number;
  wordsRead: number;
  accuracy: number; // 0 - 100
  pronunciation?: number; // 0 - 100
  confidence?: number; // 0 - 100
  questionsCorrect?: number;
  newVocabularyLearned?: number;
  ecologyThemeCompleted?: boolean;
  artThemeCompleted?: boolean;
}

/**
 * 1. completeStory
 * Callable Cloud Function to record reading sessions and update story progress & FLN fluency.
 */
export const completeStory = onCall(async (request) => {
  const data = (request.data || {}) as CompleteStoryInput;
  const {
    studentId,
    storyId,
    language = 'santali',
    readingTimeSeconds = 120,
    wordsRead = 40,
    accuracy = 85,
    pronunciation = 80,
    confidence = 85,
    ecologyThemeCompleted = false,
    artThemeCompleted = false,
  } = data;

  if (!studentId || !storyId) {
    throw new HttpsError('invalid-argument', 'studentId and storyId are required.');
  }

  const now = Date.now();
  const todayStr = getKolkataDateString();

  // Words Per Minute (WPM) fluency calculation
  const minutes = Math.max(0.1, readingTimeSeconds / 60);
  const fluencyWPM = Math.min(250, Math.round(wordsRead / minutes));

  // XP: Base Story XP (+30) + Reading Volume XP (1 per 4 words, min 10)
  const baseStoryXP = 30;
  const volumeReadingXP = Math.max(10, Math.floor(wordsRead / 4));
  const totalAwardedXP = baseStoryXP + volumeReadingXP;

  const sessionId = `read_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;

  try {
    // 1. Record in readingSessions
    await db.collection('readingSessions').doc(sessionId).set({
      sessionId,
      studentId,
      storyId,
      readingTime: readingTimeSeconds,
      wordsRead,
      accuracy,
      fluency: fluencyWPM,
      pronunciation,
      confidence,
      createdAt: now,
    });

    // 2. Transactionally update student progress
    const progRef = db.collection('progress').doc(studentId);
    let newCompletedStories = 1;
    let newTotalXP = 0;

    await db.runTransaction(async (t) => {
      const pSnap = await t.get(progRef);
      const pData = pSnap.exists ? pSnap.data()! : {};

      newCompletedStories = (pData.completedStories || 0) + 1;
      const prevFluency = pData.readingFluency || 50;
      const prevAccuracy = pData.accuracyScore || 80;

      // Running averages
      const updatedFluency = Math.round((prevFluency * 0.7) + (fluencyWPM * 0.3));
      const updatedAccuracy = Math.round((prevAccuracy * 0.7) + (accuracy * 0.3));

      newTotalXP = (pData.totalXP || 0) + totalAwardedXP;
      const newLevel = calculateLevel(newTotalXP).currentLevel;

      const { newStreak } = await evaluateStreak(
        db,
        studentId,
        pData.lastActiveDate || '',
        pData.streak || 0,
        totalAwardedXP
      );

      t.set(
        progRef,
        {
          studentId,
          storyXP: (pData.storyXP || 0) + baseStoryXP,
          readingXP: (pData.readingXP || 0) + volumeReadingXP,
          totalXP: newTotalXP,
          level: newLevel,
          streak: newStreak,
          lastActiveDate: todayStr,
          completedStories: newCompletedStories,
          readingFluency: updatedFluency,
          accuracyScore: updatedAccuracy,
          confidenceScore: Math.round(((pData.confidenceScore || 80) * 0.7) + (confidence * 0.3)),
          updatedAt: now,
        },
        { merge: true }
      );
    });

    // 3. Evaluate Badges
    const badgesUnlocked: string[] = [];
    if (newCompletedStories >= 1) {
      const b1 = await awardBadgeIfNew(
        studentId,
        'first_story',
        'First Story Reader',
        'Read your first bilingual Jharkhand story!',
        '📖',
        'story'
      );
      if (b1) badgesUnlocked.push('first_story');
    }

    if (newCompletedStories >= 10) {
      const b2 = await awardBadgeIfNew(
        studentId,
        'reading_champion',
        'Reading Champion',
        'Read 10 tribal and bilingual folk stories!',
        '🏆',
        'story'
      );
      if (b2) badgesUnlocked.push('reading_champion');
    }

    if (ecologyThemeCompleted) {
      const b3 = await awardBadgeIfNew(
        studentId,
        'eco_explorer',
        'Eco Explorer',
        'Learned Jharkhand Sal forest ecology & folklore!',
        '🌲',
        'eco'
      );
      if (b3) badgesUnlocked.push('eco_explorer');
    }

    if (artThemeCompleted) {
      const b4 = await awardBadgeIfNew(
        studentId,
        'art_explorer',
        'Art Explorer',
        'Explored Sohrai & Khovar indigenous cultural art!',
        '🎨',
        'art'
      );
      if (b4) badgesUnlocked.push('art_explorer');
    }

    return {
      success: true,
      studentId,
      storyId,
      language,
      sessionId,
      fluencyWPM,
      totalAwardedXP,
      newCompletedStories,
      badgesUnlocked,
    };
  } catch (err: any) {
    console.error('Error in completeStory:', err);
    throw new HttpsError('internal', err.message || 'Failed to record story completion.');
  }
});
