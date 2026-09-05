/**
 * BhashaBridge AI - Lessons Import Script
 * Imports curriculum lessons and NIPUN FLN competencies into Firestore.
 */

import { doc, writeBatch } from 'firebase/firestore';
import { db } from '../src/firebase/config';
import { PRODUCTION_LESSONS, PRODUCTION_COMPETENCIES } from '../src/data/curriculumData';

export async function importLessons(): Promise<{ lessonsCount: number; competenciesCount: number }> {
  console.log('--- Starting Lessons & Competencies Import ---');
  const batch = writeBatch(db);

  let lessonsCount = 0;
  for (const l of PRODUCTION_LESSONS) {
    const ref = doc(db, 'lessons', l.lessonId);
    batch.set(ref, l, { merge: true });
    lessonsCount++;
  }

  let competenciesCount = 0;
  for (const comp of PRODUCTION_COMPETENCIES) {
    const ref = doc(db, 'competencies', comp.competencyId);
    batch.set(ref, comp, { merge: true });
    competenciesCount++;
  }

  await batch.commit();
  console.log(`Successfully imported:
  - ${lessonsCount} Lessons
  - ${competenciesCount} NIPUN Competencies`);

  return { lessonsCount, competenciesCount };
}

if (typeof process !== 'undefined' && process.argv && process.argv[1]?.includes('importLessons')) {
  importLessons()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error('Lessons import failed:', err);
      process.exit(1);
    });
}
