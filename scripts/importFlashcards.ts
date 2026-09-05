/**
 * BhashaBridge AI - Flashcards Import Script
 * Imports flashcards with cultural facts into Firestore collection 'flashcardsLibrary'.
 */

import { doc, writeBatch } from 'firebase/firestore';
import { db } from '../src/firebase/config';
import { PRODUCTION_FLASHCARDS } from '../src/data/curriculumData';

export async function importFlashcards(): Promise<{ flashcardsCount: number }> {
  console.log('--- Starting Flashcards Import ---');
  const batch = writeBatch(db);

  let flashcardsCount = 0;
  for (const c of PRODUCTION_FLASHCARDS) {
    const ref = doc(db, 'flashcardsLibrary', c.cardId);
    batch.set(ref, c, { merge: true });
    flashcardsCount++;
  }

  await batch.commit();
  console.log(`Successfully imported ${flashcardsCount} flashcards into Firestore.`);

  return { flashcardsCount };
}

if (typeof process !== 'undefined' && process.argv && process.argv[1]?.includes('importFlashcards')) {
  importFlashcards()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error('Flashcards import failed:', err);
      process.exit(1);
    });
}
