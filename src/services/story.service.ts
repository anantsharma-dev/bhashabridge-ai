/**
 * BhashaBridge AI - Production Story Service
 * Queries multilingual curriculum stories, themes, and discussions
 * with Firestore listeners and IndexedDB offline caching.
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
import type { Story, GradeLevel, SupportedLanguage, SubjectCode } from '../types/curriculum';
import { PRODUCTION_STORIES } from '../data/curriculumData';

class StoryService {
  /**
   * 1. Get Stories with Multi-filters
   */
  public async getStories(options: {
    grade?: GradeLevel;
    subject?: SubjectCode | string;
    language?: SupportedLanguage;
    theme?: string;
  } = {}): Promise<Story[]> {
    try {
      let q = query(collection(db, 'stories'));
      if (options.grade) {
        q = query(q, where('grade', '==', options.grade));
      }
      if (options.subject) {
        q = query(q, where('subject', '==', options.subject));
      }
      if (options.language) {
        q = query(q, where('language', '==', options.language));
      }

      const snap = await getDocs(q);
      if (!snap.empty) {
        const stories = snap.docs.map((d) => d.data() as Story);
        for (const st of stories) {
          indexedDbEngine.setItem('stories' as any, { id: `story_${st.storyId}`, ...st }).catch(() => {});
        }
        return stories;
      }
    } catch (err) {
      console.warn('Firestore getStories failed, using offline cache:', err);
    }

    try {
      const cached = await indexedDbEngine.getAll<any>('stories');
      const filtered = cached.filter((st) => {
        if (options.grade && st.grade !== options.grade) return false;
        if (options.subject && st.subject !== options.subject) return false;
        if (options.language && st.language !== options.language) return false;
        return st && st.storyId;
      });
      if (filtered.length > 0) return filtered;
    } catch {}

    return PRODUCTION_STORIES.filter((st) => {
      if (options.grade && st.grade !== options.grade) return false;
      if (options.subject && st.subject !== options.subject) return false;
      if (options.language && st.language !== options.language) return false;
      return true;
    });
  }

  /**
   * 2. Real-time Story Listener
   */
  public listenToStories(
    grade: GradeLevel,
    callback: (stories: Story[]) => void
  ): Unsubscribe {
    const q = query(collection(db, 'stories'), where('grade', '==', grade));
    return onSnapshot(
      q,
      (snap) => {
        const list = snap.docs.map((d) => d.data() as Story);
        callback(list);
      },
      (err) => console.warn('Error listening to stories:', err)
    );
  }

  /**
   * 3. Get Single Story by ID
   */
  public async getStoryById(storyId: string): Promise<Story | null> {
    try {
      const snap = await getDoc(doc(db, 'stories', storyId));
      if (snap.exists()) {
        const data = snap.data() as Story;
        indexedDbEngine.setItem('stories' as any, { id: `story_${data.storyId}`, ...data }).catch(() => {});
        return data;
      }
    } catch {
      const cached = await indexedDbEngine.getItem<Story>('stories', `story_${storyId}`);
      if (cached) return cached;
    }

    return PRODUCTION_STORIES.find((s) => s.storyId === storyId) || null;
  }

  /**
   * 4. Query Stories by Pedagogical Theme (Ecology, SEL, Philosophy, History)
   */
  public async getStoriesByTheme(
    themeCategory: 'ecology' | 'psychology' | 'philosophy' | 'history' | 'geography' | 'art',
    themeKeyword: string
  ): Promise<Story[]> {
    const all = await this.getStories();
    const cleanKey = themeKeyword.toLowerCase();
    return all.filter((s) => {
      const target =
        themeCategory === 'ecology'
          ? s.ecologyTheme
          : themeCategory === 'psychology'
          ? s.psychologyTheme
          : themeCategory === 'philosophy'
          ? s.philosophyTheme
          : themeCategory === 'history'
          ? s.historyTheme
          : themeCategory === 'geography'
          ? s.geographyTheme
          : s.artTheme;

      return target && target.toLowerCase().includes(cleanKey);
    });
  }
}

export const storyService = new StoryService();
export default storyService;
