/**
 * BhashaBridge AI - Activities Import Script
 * Imports experiential activities, worksheet templates, and lesson plans into Firestore.
 */

import { doc, writeBatch } from 'firebase/firestore';
import { db } from '../src/firebase/config';
import {
  PRODUCTION_ACTIVITIES,
  PRODUCTION_WORKSHEETS,
  PRODUCTION_LESSON_PLANS,
} from '../src/data/curriculumData';

export async function importActivities(): Promise<{
  activitiesCount: number;
  worksheetsCount: number;
  lessonPlansCount: number;
}> {
  console.log('--- Starting Activities, Worksheets & Lesson Plans Import ---');
  const batch = writeBatch(db);

  let activitiesCount = 0;
  for (const a of PRODUCTION_ACTIVITIES) {
    const ref = doc(db, 'activities', a.activityId);
    batch.set(ref, a, { merge: true });
    activitiesCount++;
  }

  let worksheetsCount = 0;
  for (const ws of PRODUCTION_WORKSHEETS) {
    const ref = doc(db, 'worksheetsTemplates', ws.worksheetId);
    batch.set(ref, ws, { merge: true });
    worksheetsCount++;
  }

  let lessonPlansCount = 0;
  for (const lp of PRODUCTION_LESSON_PLANS) {
    const ref = doc(db, 'lessonPlans', lp.templateId);
    batch.set(ref, lp, { merge: true });
    lessonPlansCount++;
  }

  await batch.commit();
  console.log(`Successfully imported:
  - ${activitiesCount} Activities
  - ${worksheetsCount} Worksheet Templates
  - ${lessonPlansCount} Lesson Plan Templates`);

  return { activitiesCount, worksheetsCount, lessonPlansCount };
}

if (typeof process !== 'undefined' && process.argv && process.argv[1]?.includes('importActivities')) {
  importActivities()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error('Activities import failed:', err);
      process.exit(1);
    });
}
