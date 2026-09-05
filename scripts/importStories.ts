/**
 * BhashaBridge AI - Stories Import Script
 * Imports multilingual folklore and thematic stories into Firestore collection 'stories'.
 */

import { doc, writeBatch } from 'firebase/firestore';
import { db } from '../src/firebase/config';
import { PRODUCTION_STORIES } from '../src/data/curriculumData';

export async function importStories(): Promise<{ storiesCount: number }> {
  console.log('--- Starting Stories Import ---');
  const batch = writeBatch(db);

  let storiesCount = 0;
  for (const s of PRODUCTION_STORIES) {
    const ref = doc(db, 'stories', s.storyId);
    batch.set(ref, s, { merge: true });
    storiesCount++;
  }

  await batch.commit();
  console.log(`Successfully imported ${storiesCount} stories into Firestore.`);

  return { storiesCount };
}

if (typeof process !== 'undefined' && process.argv && process.argv[1]?.includes('importStories')) {
  importStories()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error('Stories import failed:', err);
      process.exit(1);
    });
}
