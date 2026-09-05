import * as admin from 'firebase-admin';
import { onCall, HttpsError } from 'firebase-functions/v2/https';

const db = admin.firestore();

export interface QuestionBankFilter {
  subject?: string;
  grade?: string;
  language?: string;
  chapter?: string;
  topic?: string;
  difficulty?: string;
  competency?: string;
  bloomsLevel?: string;
  source?: string;
  limit?: number;
}

/**
 * 1. Query Question Bank with multi-criteria filters
 */
export const queryQuestionBank = onCall(async (request) => {
  const filter = (request.data || {}) as QuestionBankFilter;
  let q: admin.firestore.Query = db.collection('questionBank');

  if (filter.subject) {
    q = q.where('subject', '==', filter.subject);
  }
  if (filter.grade) {
    q = q.where('grade', '==', filter.grade);
  }
  if (filter.language) {
    q = q.where('language', '==', filter.language);
  }
  if (filter.difficulty) {
    q = q.where('difficulty', '==', filter.difficulty);
  }
  if (filter.source) {
    q = q.where('source', '==', filter.source);
  }

  const maxLimit = Math.min(filter.limit || 50, 100);
  q = q.limit(maxLimit);

  const snapshot = await q.get();
  const items = snapshot.docs.map((d) => d.data());

  return { success: true, count: items.length, items };
});

/**
 * 2. Add single question to bank
 */
export const addQuestionToBank = onCall(async (request) => {
  const data = request.data;
  if (!data.question || !data.subject || !data.grade) {
    throw new HttpsError('invalid-argument', 'Question, subject, and grade are required');
  }

  const questionId = `qb_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
  const item = {
    questionId,
    subject: data.subject,
    grade: data.grade,
    language: data.language || 'hindi',
    chapter: data.chapter || 'General',
    topic: data.topic || 'Foundational',
    difficulty: data.difficulty || 'medium',
    competency: data.competency || 'reading',
    bloomsLevel: data.bloomsLevel || 'remember',
    question: data.question,
    questionHindi: data.questionHindi || '',
    questionSanthali: data.questionSanthali || '',
    options: data.options || [],
    answer: data.answer || '',
    explanation: data.explanation || '',
    audio: data.audio || '',
    image: data.image || '',
    tags: data.tags || [],
    source: data.source || 'JHARKHAND',
    createdAt: Date.now(),
  };

  await db.collection('questionBank').doc(questionId).set(item);
  return { success: true, questionId };
});

/**
 * 3. Bulk Question Bank Importer (NCERT, NIPUN Bharat, Jharkhand MTB-MLE)
 */
export const importQuestionsToBank = onCall(async (request) => {
  const { questions } = request.data as { questions: any[] };
  if (!Array.isArray(questions) || questions.length === 0) {
    throw new HttpsError('invalid-argument', 'Valid questions array is required');
  }

  const batchLimit = 450;
  let importedCount = 0;

  for (let i = 0; i < questions.length; i += batchLimit) {
    const chunk = questions.slice(i, i + batchLimit);
    const batch = db.batch();

    for (const q of chunk) {
      const qId = q.questionId || `qb_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
      const docRef = db.collection('questionBank').doc(qId);
      batch.set(docRef, {
        questionId: qId,
        subject: q.subject || 'Language MTB-MLE',
        grade: q.grade || 'Grade 2',
        language: q.language || 'hindi',
        chapter: q.chapter || 'Unit 1',
        topic: q.topic || 'Literacy',
        difficulty: q.difficulty || 'medium',
        competency: q.competency || 'reading',
        bloomsLevel: q.bloomsLevel || 'remember',
        question: q.question,
        questionHindi: q.questionHindi || '',
        questionSanthali: q.questionSanthali || '',
        options: q.options || [],
        answer: q.answer || '',
        explanation: q.explanation || '',
        audio: q.audio || '',
        image: q.image || '',
        tags: q.tags || [],
        source: q.source || 'JHARKHAND',
        createdAt: Date.now(),
      }, { merge: true });
      importedCount++;
    }

    await batch.commit();
  }

  return { success: true, importedCount };
});
