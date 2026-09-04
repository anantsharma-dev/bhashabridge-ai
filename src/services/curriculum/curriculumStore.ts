import { create } from 'zustand';
import { curriculumDb } from './curriculumDb';

export type PackCategory = 'grade' | 'subject' | 'language' | 'audio';

export interface CurriculumPack {
  id: string;
  name: string;
  nativeName: string;
  category: PackCategory;
  sizeMb: number;
  isDownloaded: boolean;
  version: string;
  description: string;
  grades: string;
  subject?: string;
  downloadProgress?: number;
}

export type SyncState = 'synced' | 'syncing' | 'update_available' | 'offline_ready';

interface CurriculumState {
  version: string;
  latestAvailableVersion: string;
  lastSyncTimestamp: number;
  syncState: SyncState;
  syncProgress: number;
  syncStage: string;
  storageUsedMb: number;
  maxStorageMb: number;
  updateNotification: string | null;
  packs: CurriculumPack[];
  initCurriculumStore: () => Promise<void>;
  triggerSync: () => Promise<void>;
  togglePackDownload: (packId: string) => Promise<void>;
  checkForUpdates: () => void;
  dismissNotification: () => void;
}

const DEFAULT_PACKS: CurriculumPack[] = [
  // 1. Language Packs
  {
    id: 'pack-lang-santali',
    name: 'Santali (Ol Chiki) Core Phonics & Grammar',
    nativeName: 'ᱥᱟᱱᱛᱟᱲᱤ ᱚᱞ ᱪᱤᱠᱤ ᱢᱩᱬᱩᱛ ᱟᱲᱟᱝ',
    category: 'language',
    sizeMb: 85,
    isDownloaded: true,
    version: '2026.2.1',
    description: 'Complete Ol Chiki alphabet, stroke orders, and Grade 1–5 core bilingual textbook vocabulary.',
    grades: 'Grade 1–5',
  },
  {
    id: 'pack-lang-ho',
    name: 'Ho (Warang Chiti) Pilot Pack',
    nativeName: 'ᱦᱳ ᱯᱟᱹᱨᱥᱤ ᱟᱨ ᱣᱟᱨᱟᱝ ᱪᱤᱛᱤ',
    category: 'language',
    sizeMb: 45,
    isDownloaded: false,
    version: '2026.1.0',
    description: 'Foundational vocabulary for West Singhbhum Kolhan tribal schools.',
    grades: 'Grade 1–2',
  },
  {
    id: 'pack-lang-mundari',
    name: 'Mundari Language Pack',
    nativeName: 'ᱢᱩᱱᱰᱟᱨᱤ ᱯᱟᱹᱨᱥᱤ ᱥᱮᱪᱮᱫ',
    category: 'language',
    sizeMb: 48,
    isDownloaded: false,
    version: '2026.1.2',
    description: 'Khunti & Ranchi tribal belt bilingual oral vocabulary.',
    grades: 'Grade 1–3',
  },

  // 2. Grade-Wise Packs
  {
    id: 'pack-grade-1',
    name: 'Grade 1 Foundational FLN Pack',
    nativeName: 'ᱯᱩᱭᱞᱩ ᱪᱟᱱᱟᱪ ᱢᱩᱬᱩᱛ ᱥᱮᱪᱮᱫ',
    category: 'grade',
    sizeMb: 65,
    isDownloaded: true,
    version: '2026.2.4',
    description: 'Complete NCERT & JCERT Grade 1 syllabus with 40 interactive flashcard lessons.',
    grades: 'Grade 1',
  },
  {
    id: 'pack-grade-2',
    name: 'Grade 2 Bilingual Story & Reader Pack',
    nativeName: 'ᱫᱚᱥᱟᱨ ᱪᱟᱱᱟᱪ ᱠᱟᱹᱦᱱᱤ ᱯᱩᱛᱷᱤ',
    category: 'grade',
    sizeMb: 75,
    isDownloaded: true,
    version: '2026.2.4',
    description: 'Grade 2 reading passages, family stories, and local tree ecology.',
    grades: 'Grade 2',
  },
  {
    id: 'pack-grade-3-5',
    name: 'Grade 3–5 Advanced MTB-MLE Pack',
    nativeName: 'ᱛᱮᱥᱟᱨ-ᱢᱚᱬᱮᱭᱟᱜ ᱪᱟᱱᱟᱪ ᱥᱮᱪᱮᱫ',
    category: 'grade',
    sizeMb: 110,
    isDownloaded: false,
    version: '2026.2.0',
    description: 'Geography, Tribal Freedom movements (Birsa Munda, Sidho Kanho), and Math 1–100.',
    grades: 'Grade 3–5',
  },

  // 3. Subject Packs
  {
    id: 'pack-subj-math',
    name: 'Math Manipulatives & Counting Pack',
    nativeName: 'ᱞᱮᱠᱷᱟ ᱟᱨ ᱮᱞ ᱠᱷᱮᱞᱚᱸᱰ',
    category: 'subject',
    sizeMb: 50,
    isDownloaded: true,
    version: '2026.1.8',
    description: 'Bilingual number games, currency addition, and concrete object counting.',
    grades: 'Grade 1–3',
    subject: 'Math',
  },
  {
    id: 'pack-subj-evs',
    name: 'Jharkhand Ecology & Nature Pack',
    nativeName: 'ᱡᱷᱟᱨᱠᱷᱚᱸᱰ ᱵᱤᱨ ᱟᱨ ᱥᱤᱨᱡᱚᱱ',
    category: 'subject',
    sizeMb: 60,
    isDownloaded: true,
    version: '2026.2.0',
    description: 'Dalma elephants, Saranda forests, and indigenous water conservation practices.',
    grades: 'Grade 1–5',
    subject: 'EVS',
  },

  // 4. Audio & Voice Models
  {
    id: 'pack-piper-audio',
    name: 'Piper Neural Voice Model (Offline Speech)',
    nativeName: 'ᱯᱟᱭᱯᱚᱨ ᱱᱤᱣᱨᱟᱞ ᱟᱲᱟᱝ ᱢᱚᱰᱮᱞ',
    category: 'audio',
    sizeMb: 120,
    isDownloaded: true,
    version: '2026.1.4',
    description: 'High quality 22kHz offline neural text-to-speech audio files for classroom listening exercises.',
    grades: 'Grade 1–5',
  },
];

const STORAGE_KEY = 'bhashabridge_curriculum_store';

const getInitialData = () => {
  if (typeof window === 'undefined') {
    return {
      version: 'JCERT-2026.2.4-JH',
      lastSyncTimestamp: Date.now() - 3600000 * 24 * 2,
      packs: DEFAULT_PACKS,
    };
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // ignore
  }
  return {
    version: 'JCERT-2026.2.4-JH',
    lastSyncTimestamp: Date.now() - 3600000 * 24 * 2,
    packs: DEFAULT_PACKS,
  };
};

export const useCurriculumStore = create<CurriculumState>((set, get) => {
  const initial = getInitialData();
  const calculateStorage = (packs: CurriculumPack[]) =>
    packs.filter((p) => p.isDownloaded).reduce((acc, p) => acc + p.sizeMb, 0);

  return {
    version: initial.version,
    latestAvailableVersion: 'JCERT-2026.3.0-JH-STABLE',
    lastSyncTimestamp: initial.lastSyncTimestamp,
    syncState: 'offline_ready',
    syncProgress: 0,
    syncStage: 'Ready for classroom use',
    storageUsedMb: calculateStorage(initial.packs),
    maxStorageMb: 2048, // 2 GB allocated
    updateNotification: 'New 2026-27 JCERT Tribal Curriculum Pack available for download.',
    packs: initial.packs,

    initCurriculumStore: async () => {
      const idbPacks = await curriculumDb.getPacks();
      if (idbPacks && idbPacks.length > 0) {
        set({ packs: idbPacks, storageUsedMb: calculateStorage(idbPacks) });
      } else {
        await curriculumDb.savePacks(DEFAULT_PACKS);
      }
    },

    triggerSync: async () => {
      set({
        syncState: 'syncing',
        syncProgress: 10,
        syncStage: 'Connecting to CRC Dumka Hub...',
      });

      return new Promise<void>((resolve) => {
        setTimeout(() => {
          set({ syncProgress: 35, syncStage: 'Verifying differential package checksums...' });
        }, 350);

        setTimeout(() => {
          set({ syncProgress: 70, syncStage: 'Downloading Santali Grade 1-5 updates...' });
        }, 700);

        setTimeout(async () => {
          const now = Date.now();
          const currentPacks = get().packs.map((p) => ({ ...p, isDownloaded: true }));
          const used = calculateStorage(currentPacks);

          set({
            syncState: 'synced',
            syncProgress: 100,
            syncStage: 'Sync completed! All regional packs updated.',
            lastSyncTimestamp: now,
            version: 'JCERT-2026.3.0-JH-STABLE',
            packs: currentPacks,
            storageUsedMb: used,
            updateNotification: null,
          });

          await curriculumDb.savePacks(currentPacks);

          try {
            localStorage.setItem(
              STORAGE_KEY,
              JSON.stringify({
                version: 'JCERT-2026.3.0-JH-STABLE',
                lastSyncTimestamp: now,
                packs: currentPacks,
              })
            );
          } catch {
            // ignore
          }

          resolve();
        }, 1200);
      });
    },

    togglePackDownload: async (packId: string) => {
      const updatedPacks = get().packs.map((p) =>
        p.id === packId ? { ...p, isDownloaded: !p.isDownloaded } : p
      );
      const used = calculateStorage(updatedPacks);
      set({ packs: updatedPacks, storageUsedMb: used });

      await curriculumDb.savePacks(updatedPacks);

      try {
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({
            version: get().version,
            lastSyncTimestamp: get().lastSyncTimestamp,
            packs: updatedPacks,
          })
        );
      } catch {
        // ignore
      }
    },

    checkForUpdates: () => {
      set({
        updateNotification: 'Checked CRC Hub: 1 update available (Grade 3–5 Advanced Pack v2026.2.0).',
        syncState: 'update_available',
      });
    },

    dismissNotification: () => {
      set({ updateNotification: null });
    },
  };
});
