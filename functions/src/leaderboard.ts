import * as admin from 'firebase-admin';
import { onCall, HttpsError } from 'firebase-functions/v2/https';
import { getKolkataDateString, getKolkataYesterdayString } from './streak';

const db = admin.firestore();

export interface LeaderboardEntryDTO {
  studentId: string;
  classroomId: string;
  studentName: string;
  avatar: string;
  rank: number;
  totalXP: number;
  streak: number;
  attendanceXP: number;
  level: number;
}

/**
 * 1. generateLeaderboard
 * Callable Cloud Function to generate top 10 classroom leaderboard with ties resolved
 */
export const generateLeaderboard = onCall(async (request) => {
  const { classroomId } = (request.data || {}) as { classroomId: string };

  if (!classroomId) {
    throw new HttpsError('invalid-argument', 'classroomId is required.');
  }

  try {
    // 1. Fetch progress records for the classroom
    const progressSnap = await db
      .collection('progress')
      .where('classroomId', '==', classroomId)
      .get();

    if (progressSnap.empty) {
      return { classroomId, leaderboard: [] };
    }

    // 2. Fetch student profiles in batch to retrieve student names & avatars
    const studentIds = progressSnap.docs.map((d) => d.data().studentId || d.id);
    const studentDocsMap: Record<string, { name: string; avatar: string }> = {};

    // Firestore allows 'in' queries up to 30 items; chunk if necessary
    for (let i = 0; i < studentIds.length; i += 30) {
      const chunk = studentIds.slice(i, i + 30);
      if (chunk.length === 0) continue;
      const sSnap = await db.collection('students').where('studentId', 'in', chunk).get();
      sSnap.forEach((sDoc) => {
        const sData = sDoc.data();
        studentDocsMap[sData.studentId || sDoc.id] = {
          name: sData.name || `Student ${sDoc.id}`,
          avatar: sData.avatar || '👦',
        };
      });
    }

    // 3. Transform and Sort: totalXP DESC, then streak DESC, then attendanceXP DESC
    const entries: LeaderboardEntryDTO[] = progressSnap.docs.map((doc) => {
      const data = doc.data();
      const sId = data.studentId || doc.id;
      const meta = studentDocsMap[sId] || { name: `Student ${sId.slice(0, 5)}`, avatar: '🐯' };

      return {
        studentId: sId,
        classroomId,
        studentName: meta.name,
        avatar: meta.avatar,
        rank: 0,
        totalXP: data.totalXP || 0,
        streak: data.streak || 0,
        attendanceXP: data.attendanceXP || 0,
        level: data.level || 1,
      };
    });

    entries.sort((a, b) => {
      if (b.totalXP !== a.totalXP) return b.totalXP - a.totalXP;
      if (b.streak !== a.streak) return b.streak - a.streak;
      return b.attendanceXP - a.attendanceXP;
    });

    // 4. Assign ranks and take top 10
    const top10 = entries.slice(0, 10).map((entry, idx) => ({
      ...entry,
      rank: idx + 1,
    }));

    // 5. Cache into leaderboard collection for high-speed offline query
    const batch = db.batch();
    for (const item of top10) {
      const lbRef = db.collection('leaderboard').doc(`lb_${classroomId}_${item.studentId}`);
      batch.set(
        lbRef,
        {
          ...item,
          updatedAt: Date.now(),
        },
        { merge: true }
      );
    }
    await batch.commit();

    return { classroomId, leaderboard: top10 };
  } catch (err: any) {
    console.error('Error in generateLeaderboard:', err);
    throw new HttpsError('internal', err.message || 'Failed to generate classroom leaderboard.');
  }
});

/**
 * 2. dailyStreakJob
 * Callable/scheduled maintenance task that verifies streaks across all active students
 */
export const dailyStreakJob = onCall(async (request) => {
  const todayStr = getKolkataDateString();
  const yesterdayStr = getKolkataYesterdayString();

  try {
    const activeProgressSnap = await db
      .collection('progress')
      .where('streak', '>', 0)
      .limit(500)
      .get();

    let resetCount = 0;
    const batch = db.batch();

    activeProgressSnap.forEach((doc) => {
      const data = doc.data();
      const lastActive = data.lastActiveDate || '';

      // If neither active today nor yesterday, reset streak to 0
      if (lastActive !== todayStr && lastActive !== yesterdayStr) {
        batch.update(doc.ref, {
          streak: 0,
          updatedAt: Date.now(),
        });
        resetCount++;
      }
    });

    if (resetCount > 0) {
      await batch.commit();
    }

    return {
      success: true,
      today: todayStr,
      checkedCount: activeProgressSnap.size,
      resetCount,
    };
  } catch (err: any) {
    console.error('Error in dailyStreakJob:', err);
    throw new HttpsError('internal', err.message || 'Failed to run daily streak check.');
  }
});
