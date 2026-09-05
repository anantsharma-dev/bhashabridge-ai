/**
 * BhashaBridge AI - Leaderboard Service
 * Production Firestore Service for Classroom Rankings, Realtime Listeners, and Tie-breaking
 */

import {
  collection,
  query,
  where,
  getDocs,
  onSnapshot,
  doc,
  getDoc,
  type Unsubscribe,
} from 'firebase/firestore';
import { db } from '../firebase/config';
import type { LeaderboardEntry } from '../types/progress';

/**
 * 1. Fetch Top 10 Classroom Leaderboard
 */
export async function getClassroomLeaderboard(
  classroomId: string
): Promise<LeaderboardEntry[]> {
  try {
    // Check cached leaderboard collection first
    const qCache = query(
      collection(db, 'leaderboard'),
      where('classroomId', '==', classroomId)
    );
    const cacheSnap = await getDocs(qCache);

    if (!cacheSnap.empty) {
      const items = cacheSnap.docs.map((d) => d.data() as LeaderboardEntry);
      items.sort((a, b) => {
        if (b.totalXP !== a.totalXP) return b.totalXP - a.totalXP;
        if (b.streak !== a.streak) return b.streak - a.streak;
        return b.attendanceXP - a.attendanceXP;
      });
      return items.slice(0, 10).map((it, idx) => ({ ...it, rank: idx + 1 }));
    }

    // Fallback: Query progress collection directly and aggregate
    const qProg = query(
      collection(db, 'progress'),
      where('classroomId', '==', classroomId)
    );
    const progSnap = await getDocs(qProg);

    if (progSnap.empty) return [];

    const entries: LeaderboardEntry[] = [];

    for (const pDoc of progSnap.docs) {
      const pData = pDoc.data();
      const sId = pData.studentId || pDoc.id;

      let studentName = `Student ${sId.slice(0, 5)}`;
      let avatar = '👦';

      try {
        const sSnap = await getDoc(doc(db, 'students', sId));
        if (sSnap.exists()) {
          const sData = sSnap.data();
          studentName = sData.name || studentName;
          avatar = sData.avatar || avatar;
        }
      } catch {}

      entries.push({
        studentId: sId,
        classroomId,
        studentName,
        avatar,
        rank: 0,
        totalXP: pData.totalXP || 0,
        streak: pData.streak || 0,
        attendanceXP: pData.attendanceXP || 0,
        level: pData.level || 1,
      });
    }

    entries.sort((a, b) => {
      if (b.totalXP !== a.totalXP) return b.totalXP - a.totalXP;
      if (b.streak !== a.streak) return b.streak - a.streak;
      return b.attendanceXP - a.attendanceXP;
    });

    return entries.slice(0, 10).map((item, idx) => ({ ...item, rank: idx + 1 }));
  } catch (err) {
    console.error(`Error fetching leaderboard for classroom ${classroomId}:`, err);
    return [];
  }
}

/**
 * 2. Real-time Classroom Leaderboard Listener
 */
export function listenToClassroomLeaderboard(
  classroomId: string,
  callback: (leaderboard: LeaderboardEntry[]) => void
): Unsubscribe {
  const q = query(
    collection(db, 'leaderboard'),
    where('classroomId', '==', classroomId)
  );

  return onSnapshot(
    q,
    (snapshot) => {
      const entries = snapshot.docs.map((d) => d.data() as LeaderboardEntry);
      entries.sort((a, b) => {
        if (b.totalXP !== a.totalXP) return b.totalXP - a.totalXP;
        if (b.streak !== a.streak) return b.streak - a.streak;
        return b.attendanceXP - a.attendanceXP;
      });
      const top10 = entries.slice(0, 10).map((it, idx) => ({ ...it, rank: idx + 1 }));
      callback(top10);
    },
    (err) => {
      console.warn(`Leaderboard listener error for classroom ${classroomId}:`, err);
    }
  );
}
