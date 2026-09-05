import * as admin from 'firebase-admin';
import { onCall, HttpsError } from 'firebase-functions/v2/https';
import { evaluateStreak, getKolkataDateString } from './streak';

const db = admin.firestore();

// Precompute XP thresholds for Levels 0 to 50
const LEVEL_THRESHOLDS: number[] = (() => {
  const list = [0, 100, 250, 500, 900, 1400];
  for (let lvl = 6; lvl <= 50; lvl++) {
    const prev = list[lvl - 1];
    const delta = 500 + (lvl - 5) * 120;
    list.push(prev + delta);
  }
  return list;
})();

export interface LevelCalculationResult {
  currentLevel: number;
  currentXP: number;
  currentLevelBaseXP: number;
  nextLevelXP: number;
  progressPercentage: number;
}

/**
 * Pure function to calculate level from totalXP
 */
export function calculateLevel(totalXP: number): LevelCalculationResult {
  const safeXP = Math.max(0, totalXP || 0);
  let currentLevel = 0;

  for (let lvl = 1; lvl < LEVEL_THRESHOLDS.length; lvl++) {
    if (safeXP >= LEVEL_THRESHOLDS[lvl]) {
      currentLevel = lvl;
    } else {
      break;
    }
  }

  const currentLevelBaseXP = LEVEL_THRESHOLDS[currentLevel] || 0;
  const nextLevelXP = LEVEL_THRESHOLDS[currentLevel + 1] || Math.round(currentLevelBaseXP * 1.25);
  const diff = nextLevelXP - currentLevelBaseXP;
  const progressPercentage = diff > 0 ? Math.min(100, Math.max(0, Math.round(((safeXP - currentLevelBaseXP) / diff) * 100))) : 100;

  return {
    currentLevel,
    currentXP: safeXP,
    currentLevelBaseXP,
    nextLevelXP,
    progressPercentage,
  };
}

/**
 * Helper to award badge if not already unlocked
 */
export async function awardBadgeIfNew(
  studentId: string,
  badgeId: string,
  title: string,
  description: string,
  icon: string,
  category: string
): Promise<boolean> {
  const docId = `badge_${studentId}_${badgeId}`;
  const badgeRef = db.collection('badges').doc(docId);
  const snap = await badgeRef.get();

  if (snap.exists) {
    return false; // Already earned
  }

  await badgeRef.set({
    badgeId,
    studentId,
    title,
    description,
    icon,
    category,
    earnedAt: Date.now(),
  });

  return true;
}

/**
 * Evaluate all automatic achievement badges for a student
 */
export async function evaluateBadges(
  studentId: string,
  progress: Record<string, any>,
  extraContext?: {
    activityType?: string;
    score?: number;
    ecologyTheme?: boolean;
    artTheme?: boolean;
  }
): Promise<string[]> {
  const newBadgesEarned: string[] = [];

  const checks = [
    {
      condition: (progress.completedStories || 0) >= 1,
      id: 'first_story',
      title: 'First Story Reader',
      desc: 'Completed your first bilingual Jharkhand folk story!',
      icon: '📖',
      category: 'story',
    },
    {
      condition: (progress.completedStories || 0) >= 10,
      id: 'reading_champion',
      title: 'Reading Champion',
      desc: 'Completed 10 stories in Ol Chiki and Devanagari!',
      icon: '🏆',
      category: 'story',
    },
    {
      condition: (progress.masteredWords || 0) >= 25,
      id: 'vocab_master',
      title: 'Vocabulary Master',
      desc: 'Mastered 25 multilingual words with spaced repetition.',
      icon: '🧠',
      category: 'vocabulary',
    },
    {
      condition: (progress.masteredWords || 0) >= 100,
      id: '100_words_learned',
      title: '100 Words Learned',
      desc: 'Mastered 100 tribal and curriculum words.',
      icon: '🌟',
      category: 'vocabulary',
    },
    {
      condition: (progress.streak || 0) >= 7,
      id: '7_day_streak',
      title: '7 Day Streak',
      desc: 'Practiced consistently for 7 days in a row!',
      icon: '🔥',
      category: 'streak',
    },
    {
      condition: (progress.streak || 0) >= 30,
      id: '30_day_streak',
      title: '30 Day Streak',
      desc: 'A full month of daily classroom learning!',
      icon: '⚡',
      category: 'streak',
    },
    {
      condition: extraContext?.activityType === 'quiz' && (extraContext?.score || 0) >= 100,
      id: 'perfect_quiz',
      title: 'Perfect Quiz',
      desc: 'Scored 100% on a classroom FLN quiz!',
      icon: '🎯',
      category: 'quiz',
    },
    {
      condition: (progress.pronunciationScore || 0) >= 90,
      id: 'pronunciation_hero',
      title: 'Pronunciation Hero',
      desc: 'Achieved 90%+ accuracy in Santali & Hindi speech practice!',
      icon: '🗣️',
      category: 'speaking',
    },
    {
      condition: !!extraContext?.ecologyTheme,
      id: 'eco_explorer',
      title: 'Eco Explorer',
      desc: 'Completed Jharkhand Sal forest ecology theme!',
      icon: '🌲',
      category: 'eco',
    },
    {
      condition: !!extraContext?.artTheme,
      id: 'art_explorer',
      title: 'Art Explorer',
      desc: 'Mastered Sohrai & Khovar indigenous art activities!',
      icon: '🎨',
      category: 'art',
    },
  ];

  for (const item of checks) {
    if (item.condition) {
      const awarded = await awardBadgeIfNew(
        studentId,
        item.id,
        item.title,
        item.desc,
        item.icon,
        item.category
      );
      if (awarded) newBadgesEarned.push(item.id);
    }
  }

  return newBadgesEarned;
}

/**
 * 1. awardXP
 * Callable Cloud Function to award XP to a student and update totalXP, level, streak, and activities.
 */
export const awardXP = onCall(async (request) => {
  const {
    studentId,
    xpAmount,
    xpCategory = 'teacher_bonus',
    activityIdRef = 'manual',
    durationSeconds = 60,
    score,
    metadata = {},
  } = (request.data || {}) as {
    studentId: string;
    xpAmount: number;
    xpCategory:
      | 'flashcard'
      | 'story'
      | 'worksheet'
      | 'quiz'
      | 'reading'
      | 'speech'
      | 'attendance'
      | 'teacher_bonus';
    activityIdRef?: string;
    durationSeconds?: number;
    score?: number;
    metadata?: Record<string, any>;
  };

  if (!studentId || typeof xpAmount !== 'number' || xpAmount <= 0) {
    throw new HttpsError('invalid-argument', 'Valid studentId and positive xpAmount are required.');
  }

  const now = Date.now();
  const todayStr = getKolkataDateString();
  const progressRef = db.collection('progress').doc(studentId);

  try {
    const studentDoc = await db.collection('students').doc(studentId).get();
    const studentData = studentDoc.data() || {};
    const classroomId = studentData.classroomId || 'default_classroom';
    const teacherId = studentData.teacherId || (request.auth?.uid || 'system');
    const grade = studentData.grade || 'Grade 2';

    let updatedProgress: Record<string, any> = {};
    let newBadges: string[] = [];

    await db.runTransaction(async (transaction) => {
      const progressSnap = await transaction.get(progressRef);
      const existing = progressSnap.exists ? progressSnap.data()! : {};

      // Map xpCategory to specific field
      const categoryFieldMap: Record<string, string> = {
        flashcard: 'vocabularyXP',
        story: 'storyXP',
        worksheet: 'writingXP',
        quiz: 'quizXP',
        reading: 'readingXP',
        speech: 'speakingXP',
        attendance: 'attendanceXP',
        teacher_bonus: 'readingXP',
      };

      const specificField = categoryFieldMap[xpCategory] || 'vocabularyXP';
      const prevTotal = existing.totalXP || 0;
      const newTotal = prevTotal + xpAmount;
      const prevCategoryXP = existing[specificField] || 0;

      // Evaluate streak
      const prevActiveDate = existing.lastActiveDate || '';
      const prevStreak = existing.streak || 0;
      const { newStreak } = await evaluateStreak(db, studentId, prevActiveDate, prevStreak, xpAmount);

      // Recalculate level
      const levelInfo = calculateLevel(newTotal);

      updatedProgress = {
        studentId,
        teacherId,
        classroomId,
        grade,
        readingXP: existing.readingXP || 0,
        vocabularyXP: existing.vocabularyXP || 0,
        quizXP: existing.quizXP || 0,
        storyXP: existing.storyXP || 0,
        speakingXP: existing.speakingXP || 0,
        writingXP: existing.writingXP || 0,
        attendanceXP: existing.attendanceXP || 0,
        [specificField]: prevCategoryXP + xpAmount,
        totalXP: newTotal,
        level: levelInfo.currentLevel,
        streak: newStreak,
        lastActiveDate: todayStr,
        masteredWords: existing.masteredWords || 0,
        completedStories: existing.completedStories || 0,
        completedWorksheets: existing.completedWorksheets || 0,
        completedQuizzes: existing.completedQuizzes || 0,
        pronunciationScore: existing.pronunciationScore || 75,
        readingFluency: existing.readingFluency || 60,
        confidenceScore: existing.confidenceScore || 80,
        accuracyScore: existing.accuracyScore || 80,
        attentionScore: existing.attentionScore || 85,
        createdAt: existing.createdAt || now,
        updatedAt: now,
      };

      transaction.set(progressRef, updatedProgress, { merge: true });

      // Log daily activity
      const activityId = `act_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
      transaction.set(db.collection('dailyActivity').doc(activityId), {
        activityId,
        studentId,
        teacherId,
        activityType: xpCategory,
        activityIdRef,
        xpEarned: xpAmount,
        durationSeconds: durationSeconds || 60,
        score: typeof score === 'number' ? score : null,
        createdAt: now,
      });
    });

    // Check badges
    newBadges = await evaluateBadges(studentId, updatedProgress, {
      activityType: xpCategory,
      score,
      ecologyTheme: metadata.ecologyTheme,
      artTheme: metadata.artTheme,
    });

    const levelInfo = calculateLevel(updatedProgress.totalXP);

    return {
      success: true,
      studentId,
      xpAwarded: xpAmount,
      totalXP: updatedProgress.totalXP,
      levelInfo,
      streak: updatedProgress.streak,
      newBadgesEarned: newBadges,
    };
  } catch (error: any) {
    console.error('Error in awardXP:', error);
    throw new HttpsError('internal', error.message || 'Failed to award XP.');
  }
});

/**
 * 2. calculateLevel (Callable wrapper)
 */
export const calculateLevelCallable = onCall((request) => {
  const totalXP = (request.data?.totalXP as number) || 0;
  return calculateLevel(totalXP);
});

/**
 * 3. updateProgress
 * Callable function to update cognitive/mastery scores
 */
export const updateProgress = onCall(async (request) => {
  const { studentId, updates } = (request.data || {}) as {
    studentId: string;
    updates: Record<string, any>;
  };

  if (!studentId || !updates) {
    throw new HttpsError('invalid-argument', 'studentId and updates are required.');
  }

  try {
    const progressRef = db.collection('progress').doc(studentId);
    await progressRef.set(
      {
        ...updates,
        updatedAt: Date.now(),
      },
      { merge: true }
    );

    const refreshed = await progressRef.get();
    return { success: true, progress: refreshed.data() };
  } catch (err: any) {
    console.error('Error in updateProgress:', err);
    throw new HttpsError('internal', err.message || 'Failed to update progress.');
  }
});

/**
 * 4. completeWorksheet
 * Awards +25 XP and increments completedWorksheets
 */
export const completeWorksheet = onCall(async (request) => {
  const { studentId, worksheetId, score = 100 } = (request.data || {}) as {
    studentId: string;
    worksheetId: string;
    score?: number;
  };

  if (!studentId || !worksheetId) {
    throw new HttpsError('invalid-argument', 'studentId and worksheetId are required.');
  }

  const xpEarned = 25;
  const progressRef = db.collection('progress').doc(studentId);

  try {
    await db.runTransaction(async (transaction) => {
      const snap = await transaction.get(progressRef);
      const existing = snap.exists ? snap.data()! : {};
      const newTotal = (existing.totalXP || 0) + xpEarned;
      const newLevel = calculateLevel(newTotal).currentLevel;

      transaction.set(
        progressRef,
        {
          studentId,
          writingXP: (existing.writingXP || 0) + xpEarned,
          totalXP: newTotal,
          level: newLevel,
          completedWorksheets: (existing.completedWorksheets || 0) + 1,
          updatedAt: Date.now(),
        },
        { merge: true }
      );

      const activityId = `act_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
      transaction.set(db.collection('dailyActivity').doc(activityId), {
        activityId,
        studentId,
        teacherId: existing.teacherId || 'system',
        activityType: 'worksheet',
        activityIdRef: worksheetId,
        xpEarned,
        durationSeconds: 120,
        score,
        createdAt: Date.now(),
      });
    });

    return { success: true, xpEarned, worksheetId, score };
  } catch (err: any) {
    console.error('Error in completeWorksheet:', err);
    throw new HttpsError('internal', err.message || 'Failed to complete worksheet.');
  }
});

/**
 * 5. completeQuiz
 * Awards +40 XP on pass and logs attempt
 */
export const completeQuiz = onCall(async (request) => {
  const { studentId, quizId, score, totalQuestions, passed } = (request.data || {}) as {
    studentId: string;
    quizId: string;
    score: number;
    totalQuestions: number;
    passed: boolean;
  };

  if (!studentId || !quizId) {
    throw new HttpsError('invalid-argument', 'studentId and quizId are required.');
  }

  const xpEarned = passed ? 40 : 15;
  const progressRef = db.collection('progress').doc(studentId);

  try {
    await db.runTransaction(async (transaction) => {
      const snap = await transaction.get(progressRef);
      const existing = snap.exists ? snap.data()! : {};
      const newTotal = (existing.totalXP || 0) + xpEarned;
      const newLevel = calculateLevel(newTotal).currentLevel;

      transaction.set(
        progressRef,
        {
          studentId,
          quizXP: (existing.quizXP || 0) + xpEarned,
          totalXP: newTotal,
          level: newLevel,
          completedQuizzes: (existing.completedQuizzes || 0) + 1,
          accuracyScore: Math.round(((existing.accuracyScore || 80) + (score / totalQuestions) * 100) / 2),
          updatedAt: Date.now(),
        },
        { merge: true }
      );
    });

    // Check perfect quiz badge
    if (score === totalQuestions) {
      await awardBadgeIfNew(studentId, 'perfect_quiz', 'Perfect Quiz', 'Scored 100% on a quiz!', '🎯', 'quiz');
    }

    return { success: true, xpEarned, quizId, passed };
  } catch (err: any) {
    console.error('Error in completeQuiz:', err);
    throw new HttpsError('internal', err.message || 'Failed to complete quiz.');
  }
});
