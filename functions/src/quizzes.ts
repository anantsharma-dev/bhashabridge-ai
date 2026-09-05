import * as admin from 'firebase-admin';
import { onCall, HttpsError } from 'firebase-functions/v2/https';

const db = admin.firestore();

export interface CreateQuizData {
  teacherId: string;
  classroomId: string;
  title: string;
  description?: string;
  grade: string;
  subject: string;
  language: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced' | 'adaptive';
  curriculumBoard?: 'NCERT' | 'NIPUN' | 'JHARKHAND';
  chapter?: string;
  competency?: string;
  timeLimitMinutes?: number;
  shuffleQuestions?: boolean;
  negativeMarking?: boolean;
  passingMarks?: number;
  questions: Array<{
    type: string;
    question: string;
    questionHindi?: string;
    questionSanthali?: string;
    options?: string[];
    correctAnswer: any;
    explanation?: string;
    difficulty?: 'easy' | 'medium' | 'hard';
    competency?: string;
    bloomsLevel?: string;
    audioUrl?: string;
    imageUrl?: string;
    hint?: string;
    tags?: string[];
    points?: number;
    language?: string;
  }>;
}

/**
 * 1. Create a new Quiz with atomic question indexing
 */
export const createQuiz = onCall(async (request) => {
  const data = request.data as CreateQuizData;
  if (!data.title || !data.grade || !data.subject) {
    throw new HttpsError('invalid-argument', 'Title, grade, and subject are required');
  }

  const now = Date.now();
  const quizId = `quiz_${now}_${Math.random().toString(36).slice(2, 7)}`;
  const questions = data.questions || [];

  let totalMarks = 0;
  const questionRecords = questions.map((q, idx) => {
    const qPoints = q.points ?? 10;
    totalMarks += qPoints;
    const qId = `q_${quizId}_${idx + 1}`;
    return {
      questionId: qId,
      quizId,
      type: q.type || 'multiple_choice',
      question: q.question,
      questionHindi: q.questionHindi || '',
      questionSanthali: q.questionSanthali || '',
      options: q.options || [],
      correctAnswer: q.correctAnswer,
      explanation: q.explanation || '',
      difficulty: q.difficulty || 'medium',
      competency: q.competency || 'reading',
      bloomsLevel: q.bloomsLevel || 'remember',
      audioUrl: q.audioUrl || '',
      imageUrl: q.imageUrl || '',
      hint: q.hint || '',
      tags: q.tags || [],
      points: qPoints,
      language: q.language || data.language || 'hindi',
    };
  });

  const passingMarks = data.passingMarks ?? Math.round(totalMarks * 0.6);

  const quizDoc = {
    quizId,
    teacherId: data.teacherId || request.auth?.uid || 'teacher-01',
    classroomId: data.classroomId || 'class_dumka_g2',
    title: data.title,
    description: data.description || '',
    grade: data.grade,
    subject: data.subject,
    language: data.language || 'hindi',
    difficulty: data.difficulty || 'intermediate',
    curriculumBoard: data.curriculumBoard || 'JHARKHAND',
    chapter: data.chapter || 'Foundational Assessment',
    competency: data.competency || 'FLN Literacy & Numeracy',
    totalMarks,
    timeLimitMinutes: data.timeLimitMinutes || 15,
    shuffleQuestions: data.shuffleQuestions ?? false,
    negativeMarking: data.negativeMarking ?? false,
    passingMarks,
    status: 'draft',
    questionCount: questionRecords.length,
    createdAt: now,
    updatedAt: now,
  };

  const batch = db.batch();
  batch.set(db.collection('quizzes').doc(quizId), quizDoc);

  for (const q of questionRecords) {
    batch.set(db.collection('quizQuestions').doc(q.questionId), q);
  }

  await batch.commit();

  return { success: true, quizId, totalMarks, questionCount: questionRecords.length };
});

/**
 * 2. Publish Quiz: Changes status to 'published' and stamps publishedAt
 */
export const publishQuiz = onCall(async (request) => {
  const { quizId } = request.data as { quizId: string };
  if (!quizId) throw new HttpsError('invalid-argument', 'quizId is required');

  const now = Date.now();
  await db.collection('quizzes').doc(quizId).update({
    status: 'published',
    publishedAt: now,
    updatedAt: now,
  });

  return { success: true, quizId, status: 'published', publishedAt: now };
});

/**
 * 3. Delete Quiz: Removes quiz and its associated questions
 */
export const deleteQuiz = onCall(async (request) => {
  const { quizId } = request.data as { quizId: string };
  if (!quizId) throw new HttpsError('invalid-argument', 'quizId is required');

  const questionsSnap = await db.collection('quizQuestions').where('quizId', '==', quizId).get();
  const batch = db.batch();

  questionsSnap.forEach((doc) => batch.delete(doc.ref));
  batch.delete(db.collection('quizzes').doc(quizId));

  await batch.commit();
  return { success: true, quizId };
});

/**
 * 4. Duplicate Quiz: Creates a full copy of an existing quiz with all questions
 */
export const duplicateQuiz = onCall(async (request) => {
  const { quizId } = request.data as { quizId: string };
  if (!quizId) throw new HttpsError('invalid-argument', 'quizId is required');

  const sourceSnap = await db.collection('quizzes').doc(quizId).get();
  if (!sourceSnap.exists) throw new HttpsError('not-found', 'Source quiz not found');

  const sourceData = sourceSnap.data()!;
  const now = Date.now();
  const newQuizId = `quiz_${now}_${Math.random().toString(36).slice(2, 7)}`;

  const newQuizData = {
    ...sourceData,
    quizId: newQuizId,
    title: `${sourceData.title} (Copy)`,
    status: 'draft',
    createdAt: now,
    updatedAt: now,
    publishedAt: null,
  };

  const questionsSnap = await db.collection('quizQuestions').where('quizId', '==', quizId).get();
  const batch = db.batch();
  batch.set(db.collection('quizzes').doc(newQuizId), newQuizData);

  let idx = 1;
  questionsSnap.forEach((doc) => {
    const qData = doc.data();
    const newQId = `q_${newQuizId}_${idx++}`;
    batch.set(db.collection('quizQuestions').doc(newQId), {
      ...qData,
      questionId: newQId,
      quizId: newQuizId,
    });
  });

  await batch.commit();
  return { success: true, newQuizId, title: newQuizData.title };
});

/**
 * 5. Archive Quiz
 */
export const archiveQuiz = onCall(async (request) => {
  const { quizId } = request.data as { quizId: string };
  if (!quizId) throw new HttpsError('invalid-argument', 'quizId is required');

  const now = Date.now();
  await db.collection('quizzes').doc(quizId).update({
    status: 'archived',
    updatedAt: now,
  });

  return { success: true, quizId, status: 'archived' };
});
