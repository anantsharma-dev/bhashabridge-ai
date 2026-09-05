/**
 * BhashaBridge AI - Production Activity Service
 * Queries experiential activities, teacher guides, manipulatives,
 * and hands-on learning tasks with Firestore & IndexedDB offline cache.
 */

import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  onSnapshot,
  type Unsubscribe,
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { indexedDbEngine } from '../offline/indexedDbEngine';
import type { Activity, GradeLevel, SubjectCode, ActivityType } from '../types/curriculum';
import { PRODUCTION_ACTIVITIES } from '../data/curriculumData';

class ActivityService {
  /**
   * 1. Get Activities with Multi-filters
   */
  public async getActivities(options: {
    grade?: GradeLevel;
    subject?: SubjectCode | string;
    type?: ActivityType;
  } = {}): Promise<Activity[]> {
    try {
      let q = query(collection(db, 'activities'));
      if (options.grade) q = query(q, where('grade', '==', options.grade));
      if (options.subject) q = query(q, where('subject', '==', options.subject));
      if (options.type) q = query(q, where('type', '==', options.type));

      const snap = await getDocs(q);
      if (!snap.empty) {
        const list = snap.docs.map((d) => d.data() as Activity);
        for (const a of list) {
          indexedDbEngine.setItem('activities' as any, { id: `act_${a.activityId}`, ...a }).catch(() => {});
        }
        return list;
      }
    } catch (err) {
      console.warn('Firestore getActivities failed, trying offline cache:', err);
    }

    try {
      const cached = await indexedDbEngine.getAll<any>('activities');
      const filtered = cached.filter((a) => {
        if (options.grade && a.grade !== options.grade) return false;
        if (options.subject && a.subject !== options.subject) return false;
        if (options.type && a.type !== options.type) return false;
        return a && a.activityId;
      });
      if (filtered.length > 0) return filtered;
    } catch {}

    return PRODUCTION_ACTIVITIES.filter((a) => {
      if (options.grade && a.grade !== options.grade) return false;
      if (options.subject && a.subject !== options.subject) return false;
      if (options.type && a.type !== options.type) return false;
      return true;
    });
  }

  /**
   * 2. Real-time Activity Listener
   */
  public listenToActivities(
    grade: GradeLevel,
    callback: (activities: Activity[]) => void
  ): Unsubscribe {
    const q = query(collection(db, 'activities'), where('grade', '==', grade));
    return onSnapshot(
      q,
      (snap) => {
        const list = snap.docs.map((d) => d.data() as Activity);
        callback(list);
      },
      (err) => console.warn('Error listening to activities:', err)
    );
  }

  /**
   * 3. Get Single Activity by ID
   */
  public async getActivityById(activityId: string): Promise<Activity | null> {
    try {
      const snap = await getDoc(doc(db, 'activities', activityId));
      if (snap.exists()) {
        const data = snap.data() as Activity;
        indexedDbEngine.setItem('activities' as any, { id: `act_${data.activityId}`, ...data }).catch(() => {});
        return data;
      }
    } catch {
      const cached = await indexedDbEngine.getItem<Activity>('activities', `act_${activityId}`);
      if (cached) return cached;
    }

    return PRODUCTION_ACTIVITIES.find((a) => a.activityId === activityId) || null;
  }
}

export const activityService = new ActivityService();
export default activityService;
