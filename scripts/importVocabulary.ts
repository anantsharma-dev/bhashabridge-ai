/**
 * BhashaBridge AI - Vocabulary Import Script
 * Imports multilingual vocabulary words into Firestore collection 'vocabulary'.
 */

import { doc, writeBatch } from 'firebase/firestore';
import { db } from '../src/firebase/config';
import { PRODUCTION_VOCABULARY } from '../src/data/curriculumData';

export async function importVocabulary(): Promise<{ wordsCount: number }> {
  console.log('--- Starting Vocabulary Import ---');
  const batch = writeBatch(db);

  let wordsCount = 0;
  for (const w of PRODUCTION_VOCABULARY) {
    const ref = doc(db, 'vocabulary', w.wordId);
    batch.set(ref, w, { merge: true });
    wordsCount++;
  }

  await batch.commit();
  console.log(`Successfully imported ${wordsCount} vocabulary words into Firestore.`);

  return { wordsCount };
}

if (typeof process !== 'undefined' && process.argv && process.argv[1]?.includes('importVocabulary')) {
  importVocabulary()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error('Vocabulary import failed:', err);
      process.exit(1);
    });
}
