import * as admin from 'firebase-admin';
import { onCall, HttpsError } from 'firebase-functions/v2/https';

const db = admin.firestore();

export const recommendLesson = onCall(async (request) => {
  const { studentId, subject = 'fln_literacy', grade = 'Grade 1' } = request.data || {};
  if (!studentId) {
    throw new HttpsError('invalid-argument', 'studentId is required');
  }

  // 1. Fetch completed lessons for student
  const completedSnap = await db
    .collection('lessonCompletions')
    .where('studentId', '==', studentId)
    .get();

  const completedIds = new Set(completedSnap.docs.map((d) => d.data().lessonId));

  // 2. Fetch lessons in subject & grade
  const lessonsSnap = await db
    .collection('lessons')
    .where('grade', '==', grade)
    .where('subject', '==', subject)
    .get();

  if (lessonsSnap.empty) {
    return {
      recommendation: {
        id: 'rec_les_default',
        type: 'lesson',
        title: 'Introduction to Forest Sounds',
        reason: 'Default curriculum starter lesson',
        subject,
        grade,
        targetId: 'les_lit_01',
        difficulty: 'beginner',
        estimatedXP: 30,
      },
    };
  }

  const allLessons = lessonsSnap.docs.map((d) => d.data());

  // 3. Find first uncompleted lesson where prerequisites are met
  for (const l of allLessons) {
    if (completedIds.has(l.lessonId)) continue;
    const prereqs: string[] = l.prerequisiteLessonIds || [];
    const allPrereqsMet = prereqs.every((pid) => completedIds.has(pid));
    if (allPrereqsMet) {
      return {
        recommendation: {
          id: `rec_les_${l.lessonId}`,
          type: 'lesson',
          title: l.title,
          reason: prereqs.length > 0 ? 'Natural continuation following prerequisite mastery' : 'Next recommended topic',
          subject: l.subject,
          grade: l.grade,
          targetId: l.lessonId,
          difficulty: 'beginner',
          estimatedXP: 30,
        },
      };
    }
  }

  const fallback = allLessons[0];
  return {
    recommendation: {
      id: `rec_les_${fallback.lessonId}`,
      type: 'lesson',
      title: fallback.title,
      reason: 'Review core curriculum module',
      subject: fallback.subject,
      grade: fallback.grade,
      targetId: fallback.lessonId,
      difficulty: 'beginner',
      estimatedXP: 30,
    },
  };
});

export const recommendStory = onCall(async (request) => {
  const { studentId, grade = 'Grade 1' } = request.data || {};
  if (!studentId) {
    throw new HttpsError('invalid-argument', 'studentId is required');
  }

  const progressDoc = await db.collection('progress').doc(studentId).get();
  const accuracy = progressDoc.exists ? progressDoc.data()?.accuracyScore || 75 : 75;

  const storiesSnap = await db.collection('stories').where('grade', '==', grade).limit(5).get();
  const stories = storiesSnap.docs.map((d) => d.data());

  const target = stories.length > 0 ? (accuracy < 70 ? stories[0] : stories[1] || stories[0]) : null;

  return {
    recommendation: {
      id: target ? `rec_st_${target.storyId}` : 'rec_st_default',
      type: 'story',
      title: target ? target.title : 'The Little Dove and Morning Breeze',
      reason: accuracy < 70 ? 'Phonics & listening comprehension reinforcement' : 'Enrichment reading reader',
      subject: target ? target.subject : 'fln_literacy',
      grade,
      targetId: target ? target.storyId : 'story_dove_morning_01',
      difficulty: accuracy < 70 ? 'beginner' : 'intermediate',
      estimatedXP: 35,
    },
  };
});

export const recommendWorksheet = onCall(async (request) => {
  const { studentId, grade = 'Grade 1', subject = 'fln_literacy' } = request.data || {};
  if (!studentId) {
    throw new HttpsError('invalid-argument', 'studentId is required');
  }

  const progressDoc = await db.collection('progress').doc(studentId).get();
  const accuracy = progressDoc.exists ? progressDoc.data()?.accuracyScore || 75 : 75;

  return {
    recommendation: {
      id: `rec_ws_${Date.now()}`,
      type: 'worksheet',
      title: accuracy < 70 ? 'Letter Tracing & Association Worksheet' : 'Context Sentence Formation Worksheet',
      reason: accuracy < 70 ? 'Targeted fine-motor letter tracing' : 'Independent sentence writing',
      subject,
      grade,
      targetId: 'ws_trace_vowel_o',
      difficulty: accuracy < 70 ? 'beginner' : 'intermediate',
      estimatedXP: 25,
    },
  };
});

export const recommendQuiz = onCall(async (request) => {
  const { studentId, grade = 'Grade 1', subject = 'fln_literacy' } = request.data || {};
  if (!studentId) {
    throw new HttpsError('invalid-argument', 'studentId is required');
  }

  return {
    recommendation: {
      id: `rec_qz_${Date.now()}`,
      type: 'quiz',
      title: 'Continuous Assessment Milestone Quiz',
      reason: 'Adaptive competency verification',
      subject,
      grade,
      targetId: 'quiz_dumka_animals_g2',
      difficulty: 'intermediate',
      estimatedXP: 40,
    },
  };
});

export const recommendFlashcards = onCall(async (request) => {
  const { studentId, limitCount = 4 } = request.data || {};
  if (!studentId) {
    throw new HttpsError('invalid-argument', 'studentId is required');
  }

  const snap = await db.collection('flashcardsLibrary').limit(limitCount).get();
  const cards = snap.docs.map((d) => d.data());

  return {
    recommendations: cards.map((c) => ({
      id: `rec_fc_${c.cardId}`,
      type: 'flashcard',
      title: `${c.english || 'Word'} (${c.santali || ''})`,
      reason: 'Spaced repetition daily retention',
      subject: c.subject || 'fln_literacy',
      grade: c.grade || 'Grade 1',
      targetId: c.cardId,
      difficulty: c.difficulty || 'beginner',
      estimatedXP: 10,
    })),
  };
});
