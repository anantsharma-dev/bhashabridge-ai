/**
 * BhashaBridge AI - Curriculum Import Script
 * Imports Subjects, Chapters, and Curriculum Packs into Firestore.
 */

import { doc, writeBatch } from 'firebase/firestore';
import { db } from '../src/firebase/config';
import {
  PRODUCTION_SUBJECTS,
  PRODUCTION_CHAPTERS,
  PRODUCTION_CURRICULUM_PACKS,
} from '../src/data/curriculumData';

export async function importCurriculum(): Promise<{
  subjectsCount: number;
  chaptersCount: number;
  packsCount: number;
}> {
  console.log('--- Starting Curriculum Import ---');
  const batch = writeBatch(db);

  let subjectsCount = 0;
  for (const s of PRODUCTION_SUBJECTS) {
    const ref = doc(db, 'subjects', s.subjectId);
    batch.set(ref, s, { merge: true });
    subjectsCount++;
  }

  let chaptersCount = 0;
  for (const ch of PRODUCTION_CHAPTERS) {
    const ref = doc(db, 'chapters', ch.chapterId);
    batch.set(ref, ch, { merge: true });
    chaptersCount++;
  }

  let packsCount = 0;
  for (const p of PRODUCTION_CURRICULUM_PACKS) {
    const ref = doc(db, 'curriculumPacks', p.packId);
    batch.set(ref, p, { merge: true });
    packsCount++;
  }

  await batch.commit();
  console.log(`Successfully imported:
  - ${subjectsCount} Subjects
  - ${chaptersCount} Chapters
  - ${packsCount} Curriculum Packs`);

  return { subjectsCount, chaptersCount, packsCount };
}

// Auto-run when executed directly
if (typeof process !== 'undefined' && process.argv && process.argv[1]?.includes('importCurriculum')) {
  importCurriculum()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error('Import failed:', err);
      process.exit(1);
    });
}
