/**
 * BhashaBridge AI - Progress & Gamification Service
 * Production Firestore Service for Student XP, Levels, Badges, and Offline Operations
 */

import {
  doc,
  getDoc,
  setDoc,
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  onSnapshot,
  type Unsubscribe,
} from 'firebase/firestore';
import { db } from '../firebase/config';
import type {
  StudentProgress,
  Badge,
  DailyActivity,
  LevelInfo,
  OfflineSyncOperation,
  ActivityType,
} from '../types/progress';

const OFFLINE_QUEUE_KEY = 'bhashabridge_offline_sync_queue_v1';

/**
 * Persist an operation to the local offline sync queue
 */
export function enqueueOfflineOperation(
  collectionName: string,
  documentId: string,
  payload: Record<string, any>
): OfflineSyncOperation {
  const operation: OfflineSyncOperation = {
    operationId: `op_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    collection: collectionName,
    documentId,
    payload,
    timestamp: Date.now(),
    status: 'pending',
  };

  try {
    const existingRaw = localStorage.getItem(OFFLINE_QUEUE_KEY);
    const existing: OfflineSyncOperation[] = existingRaw ? JSON.parse(existingRaw) : [];
    existing.push(operation);
    localStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify(existing.slice(-200)));
  } catch (err) {
    console.warn('Could not cache offline operation:', err);
  }

  // Also push to Firestore offlineSyncQueue collection if online
  try {
    setDoc(doc(db, 'offlineSyncQueue', operation.operationId), operation).catch(() => {});
  } catch {}

  return operation;
}

// Precomputed XP thresholds for Levels 0 to 50
const LEVEL_THRESHOLDS: number[] = (() => {
  const list = [0, 100, 250, 500, 900, 1400];
  for (let lvl = 6; lvl <= 50; lvl++) {
    const prev = list[lvl - 1];
    const delta = 500 + (lvl - 5) * 120;
    list.push(prev + delta);
  }
  return list;
})();

/**
 * Pure client-side level calculator matching Cloud Function logic
 */
export function calculateLevel(totalXP: number): LevelInfo {
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
  const progressPercentage =
    diff > 0 ? Math.min(100, Math.max(0, Math.round(((safeXP - currentLevelBaseXP) / diff) * 100))) : 100;

  return {
    currentLevel,
    currentXP: safeXP,
    currentLevelBaseXP,
    nextLevelXP,
    progressPercentage,
  };
}

/**
 * Get current date string in Asia/Kolkata timezone (YYYY-MM-DD)
 */
export function getKolkataDateString(date: Date = new Date()): string {
  const kolkataOffsetMs = 5.5 * 60 * 60 * 1000;
  const kolkataDate = new Date(date.getTime() + kolkataOffsetMs);
  return kolkataDate.toISOString().slice(0, 10);
}

/**
 * 1. Fetch Student Progress document
 */
export async function getStudentProgress(studentId: string): Promise<StudentProgress | null> {
  try {
    const docRef = doc(db, 'progress', studentId);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) return null;
    return docSnap.data() as StudentProgress;
  } catch (err) {
    console.error(`Error fetching progress for student ${studentId}:`, err);
    return null;
  }
}

/**
 * 2. Real-time Student Progress Listener
 */
export function listenToStudentProgress(
  studentId: string,
  callback: (progress: StudentProgress | null) => void
): Unsubscribe {
  const docRef = doc(db, 'progress', studentId);
  return onSnapshot(
    docRef,
    (snapshot) => {
      if (snapshot.exists()) {
        callback(snapshot.data() as StudentProgress);
      } else {
        callback(null);
      }
    },
    (err) => {
      console.warn(`Progress listener error for ${studentId}:`, err);
    }
  );
}

/**
 * 3. Award XP directly to student progress
 */
export async function awardStudentXP(
  studentId: string,
  xpAmount: number,
  xpCategory: ActivityType = 'teacher_bonus',
  activityIdRef: string = 'manual',
  score?: number,
  durationSeconds: number = 60
): Promise<{ newTotalXP: number; levelInfo: LevelInfo; offlineOp: OfflineSyncOperation }> {
  const now = Date.now();
  const todayStr = getKolkataDateString();
  const progRef = doc(db, 'progress', studentId);

  const existing = await getStudentProgress(studentId);
  const prevTotal = existing?.totalXP || 0;
  const newTotal = prevTotal + xpAmount;
  const levelInfo = calculateLevel(newTotal);

  const categoryFieldMap: Record<ActivityType, keyof StudentProgress> = {
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
  const prevCategoryXP = (existing ? (existing[specificField] as number) : 0) || 0;

  // Streak logic
  let newStreak = existing?.streak || 0;
  const lastActive = existing?.lastActiveDate || '';
  if (lastActive !== todayStr) {
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const yesterdayStr = getKolkataDateString(yesterday);
    newStreak = lastActive === yesterdayStr ? newStreak + 1 : 1;
  }

  const updatedPayload: Partial<StudentProgress> = {
    studentId,
    teacherId: existing?.teacherId || 'system',
    classroomId: existing?.classroomId || 'default',
    grade: existing?.grade || 'Grade 2',
    [specificField]: prevCategoryXP + xpAmount,
    totalXP: newTotal,
    level: levelInfo.currentLevel,
    streak: newStreak,
    lastActiveDate: todayStr,
    masteredWords: existing?.masteredWords || 0,
    completedStories: existing?.completedStories || 0,
    completedWorksheets: existing?.completedWorksheets || 0,
    completedQuizzes: existing?.completedQuizzes || 0,
    pronunciationScore: existing?.pronunciationScore || 75,
    readingFluency: existing?.readingFluency || 60,
    confidenceScore: existing?.confidenceScore || 80,
    accuracyScore: existing?.accuracyScore || 80,
    attentionScore: existing?.attentionScore || 85,
    createdAt: existing?.createdAt || now,
    updatedAt: now,
  };

  // 1. Enqueue offline operation
  const offlineOp = enqueueOfflineOperation('progress', studentId, updatedPayload);

  // 2. Write to Firestore
  await setDoc(progRef, updatedPayload, { merge: true });

  // 3. Log dailyActivity
  const activityId = `act_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
  const activityData: DailyActivity = {
    activityId,
    studentId,
    teacherId: existing?.teacherId || 'system',
    activityType: xpCategory,
    activityIdRef,
    xpEarned: xpAmount,
    durationSeconds,
    score,
    createdAt: now,
  };
  setDoc(doc(db, 'dailyActivity', activityId), activityData).catch(console.warn);

  return { newTotalXP: newTotal, levelInfo, offlineOp };
}

/**
 * 4. Update cognitive & mastery scores
 */
export async function updateStudentProgress(
  studentId: string,
  updates: Partial<StudentProgress>
): Promise<OfflineSyncOperation> {
  const progRef = doc(db, 'progress', studentId);
  const payload = {
    ...updates,
    updatedAt: Date.now(),
  };

  const offlineOp = enqueueOfflineOperation('progress', studentId, payload);
  await setDoc(progRef, payload, { merge: true });
  return offlineOp;
}

/**
 * 5. Fetch all badges earned by a student
 */
export async function getStudentBadges(studentId: string): Promise<Badge[]> {
  try {
    const q = query(
      collection(db, 'badges'),
      where('studentId', '==', studentId)
    );
    const snap = await getDocs(q);
    return snap.docs.map((d) => d.data() as Badge);
  } catch (err) {
    console.error(`Error fetching badges for student ${studentId}:`, err);
    return [];
  }
}

/**
 * 6. Real-time Student Badges Listener
 */
export function listenToStudentBadges(
  studentId: string,
  callback: (badges: Badge[]) => void
): Unsubscribe {
  const q = query(
    collection(db, 'badges'),
    where('studentId', '==', studentId)
  );

  return onSnapshot(
    q,
    (snapshot) => {
      const list = snapshot.docs.map((d) => d.data() as Badge);
      callback(list);
    },
    (err) => {
      console.warn(`Badges listener error for ${studentId}:`, err);
    }
  );
}

/**
 * 7. Fetch Recent Daily Activities for Student
 */
export async function getStudentRecentActivities(
  studentId: string,
  limitCount: number = 10
): Promise<DailyActivity[]> {
  try {
    const q = query(
      collection(db, 'dailyActivity'),
      where('studentId', '==', studentId),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    );
    const snap = await getDocs(q);
    return snap.docs.map((d) => d.data() as DailyActivity);
  } catch (err) {
    console.error(`Error fetching activities for ${studentId}:`, err);
    return [];
  }
}
