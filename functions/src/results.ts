import * as admin from 'firebase-admin';
import { onCall, HttpsError } from 'firebase-functions/v2/https';

const db = admin.firestore();

interface SubmitQuizInput {
  attemptId?: string;
  quizId: string;
  studentId: string;
  teacherId?: string;
  classroomId?: string;
  timeTakenSeconds?: number;
  deviceOffline?: boolean;
  answers: Array<{
    questionId: string;
    userAnswer: any;
    timeSpentSeconds?: number;
  }>;
}

/**
 * Normalizes answer comparison for strings, arrays, or objects
 */
function checkAnswerMatch(expected: any, given: any): boolean {
  if (given === undefined || given === null) return false;

  if (typeof expected === 'string' && typeof given === 'string') {
    const expClean = expected.trim().toLowerCase();
    const givClean = given.trim().toLowerCase();
    return expClean === givClean || expClean.includes(givClean) || givClean.includes(expClean);
  }

  if (Array.isArray(expected) && Array.isArray(given)) {
    if (expected.length !== given.length) return false;
    return expected.every((val, i) => String(val).trim().toLowerCase() === String(given[i]).trim().toLowerCase());
  }

  if (typeof expected === 'object' && typeof given === 'object') {
    const expKeys = Object.keys(expected);
    return expKeys.every((k) => String(expected[k]).trim().toLowerCase() === String(given[k] || '').trim().toLowerCase());
  }

  return String(expected).trim().toLowerCase() === String(given).trim().toLowerCase();
}

/**
 * Evaluate and Submit Quiz with full Competency, Bloom's Taxonomy, and Adaptive Analytics
 */
export const submitQuiz = onCall(async (request) => {
  const data = request.data as SubmitQuizInput;
  if (!data.quizId || !data.studentId || !Array.isArray(data.answers)) {
    throw new HttpsError('invalid-argument', 'quizId, studentId, and answers array are required');
  }

  const now = Date.now();
  const attemptId = data.attemptId || `att_${data.studentId}_${data.quizId}_${now}`;

  // 1. Fetch Quiz doc & Questions
  const quizDoc = await db.collection('quizzes').doc(data.quizId).get();
  const quizData = quizDoc.exists ? quizDoc.data() : null;

  const questionsSnap = await db.collection('quizQuestions').where('quizId', '==', data.quizId).get();
  const questionsMap = new Map<string, any>();
  questionsSnap.forEach((d) => questionsMap.set(d.id, d.data()));

  let totalPossible = 0;
  let scoreEarned = 0;
  let correctCount = 0;
  let wrongCount = 0;
  let skippedCount = 0;

  const competencyTotals: Record<string, { possible: number; earned: number }> = {};
  const bloomsTotals: Record<string, { possible: number; earned: number }> = {};
  const topicTotals: Record<string, { possible: number; earned: number }> = {};

  const evaluatedAnswers: any[] = [];
  const mistakes: any[] = [];
  let readingPoints = 0;
  let vocabularyPoints = 0;

  for (const item of data.answers) {
    const q = questionsMap.get(item.questionId);
    const points = q ? (q.points || 10) : 10;
    totalPossible += points;

    const competency = (q?.competency || 'reading').toLowerCase();
    const blooms = (q?.bloomsLevel || 'remember').toLowerCase();
    const topic = (q?.topic || quizData?.chapter || 'General').toLowerCase();

    if (!competencyTotals[competency]) competencyTotals[competency] = { possible: 0, earned: 0 };
    if (!bloomsTotals[blooms]) bloomsTotals[blooms] = { possible: 0, earned: 0 };
    if (!topicTotals[topic]) topicTotals[topic] = { possible: 0, earned: 0 };

    competencyTotals[competency].possible += points;
    bloomsTotals[blooms].possible += points;
    topicTotals[topic].possible += points;

    if (item.userAnswer === undefined || item.userAnswer === null || item.userAnswer === '') {
      skippedCount++;
      evaluatedAnswers.push({
        questionId: item.questionId,
        userAnswer: null,
        isCorrect: false,
        pointsEarned: 0,
        timeSpentSeconds: item.timeSpentSeconds || 0,
      });
      continue;
    }

    const expected = q?.correctAnswer ?? '';
    const isCorrect = checkAnswerMatch(expected, item.userAnswer);

    if (isCorrect) {
      correctCount++;
      scoreEarned += points;
      competencyTotals[competency].earned += points;
      bloomsTotals[blooms].earned += points;
      topicTotals[topic].earned += points;

      if (competency.includes('reading') || competency.includes('comprehension')) {
        readingPoints += points;
      }
      if (competency.includes('vocab')) {
        vocabularyPoints += points;
      }

      evaluatedAnswers.push({
        questionId: item.questionId,
        userAnswer: item.userAnswer,
        isCorrect: true,
        pointsEarned: points,
        timeSpentSeconds: item.timeSpentSeconds || 0,
      });
    } else {
      wrongCount++;
      let mistakeCategory: 'weak_vocabulary' | 'weak_phoneme' | 'weak_grammar' | 'conceptual' = 'conceptual';
      if (competency.includes('vocab')) mistakeCategory = 'weak_vocabulary';
      else if (competency.includes('speak') || competency.includes('phoneme')) mistakeCategory = 'weak_phoneme';
      else if (competency.includes('gram')) mistakeCategory = 'weak_grammar';

      mistakes.push({
        questionId: item.questionId,
        question: q?.question || 'Question',
        userAnswer: item.userAnswer,
        correctAnswer: expected,
        explanation: q?.explanation || 'Review the lesson vocabulary.',
        category: mistakeCategory,
      });

      evaluatedAnswers.push({
        questionId: item.questionId,
        userAnswer: item.userAnswer,
        isCorrect: false,
        pointsEarned: 0,
        timeSpentSeconds: item.timeSpentSeconds || 0,
      });
    }
  }

  // Fallback if no questions in DB
  if (totalPossible === 0) totalPossible = 100;

  const percentage = Math.round((scoreEarned / totalPossible) * 100);
  const passingMarks = quizData?.passingMarks ?? Math.round(totalPossible * 0.6);
  const passed = scoreEarned >= passingMarks;

  // XP Rules: +40 XP on passing, +15 XP on attempt
  const earnedXP = passed ? 40 : 15;

  // 2. Build Competency and Bloom Percentages
  const competencyScores: Record<string, number> = {};
  for (const [key, val] of Object.entries(competencyTotals)) {
    competencyScores[key] = val.possible > 0 ? Math.round((val.earned / val.possible) * 100) : 0;
  }

  const bloomsScores: Record<string, number> = {};
  for (const [key, val] of Object.entries(bloomsTotals)) {
    bloomsScores[key] = val.possible > 0 ? Math.round((val.earned / val.possible) * 100) : 0;
  }

  const topicScores: Record<string, number> = {};
  for (const [key, val] of Object.entries(topicTotals)) {
    topicScores[key] = val.possible > 0 ? Math.round((val.earned / val.possible) * 100) : 0;
  }

  // 3. Generate Strengths & Pedagogical Recommendations
  const strengths: string[] = [];
  if (percentage >= 90) strengths.push('Mastery Level FLN Understanding 🌟');
  if (correctCount > 0 && wrongCount === 0) strengths.push('Flawless Execution 🎯');
  for (const [comp, score] of Object.entries(competencyScores)) {
    if (score >= 80) strengths.push(`Strong ${comp.toUpperCase()} proficiency (${score}%)`);
  }

  const recommendations = {
    nextStoryRecommendation: percentage < 70 ? 'The Clever Fox of Saranda Forest' : 'Jharkhand Birds & Trees Bilingual Reader',
    nextFlashcardCategory: percentage < 70 ? 'Foundational Animals & Birds' : 'Advanced Ol Chiki Vowel Conjuncts',
    nextWorksheetDifficulty: percentage >= 85 ? 'advanced' : percentage >= 60 ? 'intermediate' : 'beginner',
    remedialNotes: mistakes.length > 0 ? `Review ${mistakes.length} mistakes with targeted phoneme and vocabulary cards.` : 'Ready for the next competency milestone!',
  };

  // 4. Save to quizAttempts
  const teacherId = data.teacherId || quizData?.teacherId || 'teacher-01';
  const classroomId = data.classroomId || quizData?.classroomId || 'class_dumka_g2';

  const attemptDoc = {
    attemptId,
    quizId: data.quizId,
    studentId: data.studentId,
    teacherId,
    classroomId,
    startedAt: now - ((data.timeTakenSeconds || 60) * 1000),
    submittedAt: now,
    timeTakenSeconds: data.timeTakenSeconds || 60,
    score: scoreEarned,
    percentage,
    passed,
    answers: evaluatedAnswers,
    correctCount,
    wrongCount,
    skippedCount,
    earnedXP,
    deviceOffline: data.deviceOffline ?? false,
    syncStatus: 'synced',
  };

  const resultId = `res_${attemptId}`;
  const resultDoc = {
    resultId,
    studentId: data.studentId,
    quizId: data.quizId,
    teacherId,
    classroomId,
    competencyScores,
    topicScores,
    bloomsScores,
    mistakes,
    strengths,
    recommendations,
    generatedAt: now,
  };

  const batch = db.batch();
  batch.set(db.collection('quizAttempts').doc(attemptId), attemptDoc);
  batch.set(db.collection('quizResults').doc(resultId), resultDoc);

  // 5. Update student progress doc atomically
  const progressRef = db.collection('progress').doc(data.studentId);
  batch.set(
    progressRef,
    {
      totalXP: admin.firestore.FieldValue.increment(earnedXP),
      quizXP: admin.firestore.FieldValue.increment(earnedXP),
      readingXP: admin.firestore.FieldValue.increment(readingPoints),
      vocabularyXP: admin.firestore.FieldValue.increment(vocabularyPoints),
      completedQuizzes: admin.firestore.FieldValue.increment(1),
      updatedAt: now,
    },
    { merge: true }
  );

  // 6. Update Adaptive Difficulty Profile
  const adaptiveRef = db.collection('adaptiveProfiles').doc(`${data.studentId}_${quizData?.subject || 'general'}`);
  const nextDiff = percentage > 85 ? 'advanced' : percentage < 50 ? 'beginner' : 'intermediate';

  batch.set(
    adaptiveRef,
    {
      studentId: data.studentId,
      subject: quizData?.subject || 'general',
      currentDifficulty: quizData?.difficulty || 'intermediate',
      recommendedNextDifficulty: nextDiff,
      rollingAccuracy: percentage,
      totalAttempts: admin.firestore.FieldValue.increment(1),
      updatedAt: now,
    },
    { merge: true }
  );

  await batch.commit();

  return {
    success: true,
    attemptId,
    resultId,
    score: scoreEarned,
    totalPossible,
    percentage,
    passed,
    earnedXP,
    correctCount,
    wrongCount,
    skippedCount,
    competencyScores,
    bloomsScores,
    recommendations,
  };
});

/**
 * Alias for evaluateQuiz
 */
export const evaluateQuiz = submitQuiz;
