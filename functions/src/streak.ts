import * as admin from 'firebase-admin';

/**
 * Get current date string (YYYY-MM-DD) in Asia/Kolkata timezone
 */
export function getKolkataDateString(date: Date = new Date()): string {
  // Asia/Kolkata is UTC+5:30
  const kolkataOffsetMs = 5.5 * 60 * 60 * 1000;
  const kolkataDate = new Date(date.getTime() + kolkataOffsetMs);
  return kolkataDate.toISOString().slice(0, 10);
}

/**
 * Get yesterday's date string in Asia/Kolkata
 */
export function getKolkataYesterdayString(): string {
  const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
  return getKolkataDateString(yesterday);
}

/**
 * Update daily streak for a student when they earn XP
 * Returns { newStreak, isNewDay }
 */
export async function evaluateStreak(
  db: admin.firestore.Firestore,
  studentId: string,
  lastActiveDate: string,
  currentStreak: number,
  xpEarned: number
): Promise<{ newStreak: number; todayStr: string }> {
  const todayStr = getKolkataDateString();
  const yesterdayStr = getKolkataYesterdayString();

  let newStreak = currentStreak;

  if (lastActiveDate === todayStr) {
    // Already active today, streak remains the same
    newStreak = Math.max(1, currentStreak);
  } else if (lastActiveDate === yesterdayStr) {
    // Consecutive day, increment streak
    newStreak = currentStreak + 1;
  } else {
    // Streak broken or brand new student
    newStreak = 1;
  }

  // Record into streakHistory
  try {
    const historyDocId = `streak_${studentId}_${todayStr}`;
    await db.collection('streakHistory').doc(historyDocId).set(
      {
        id: historyDocId,
        studentId,
        date: todayStr,
        completedToday: true,
        xpEarned: admin.firestore.FieldValue.increment(xpEarned),
        timestamp: Date.now(),
      },
      { merge: true }
    );
  } catch (err) {
    console.error('Failed to log streakHistory:', err);
  }

  return { newStreak, todayStr };
}
