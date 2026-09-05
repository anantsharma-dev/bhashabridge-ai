import { quizRepo, quizAttemptRepo } from '../../firebase/repository';
import type { QuizRecord, QuizAttemptRecord } from '../../firebase/types';
import { addXpAndStars } from './progressService';

/**
 * 1. QUIZ CRUD
 */

export async function createQuiz(
  quiz: Omit<QuizRecord, 'id' | 'createdAt'>
): Promise<QuizRecord> {
  const id = `quiz_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
  const record: QuizRecord = {
    ...quiz,
    id,
    createdAt: Date.now(),
  };
  await quizRepo.save(record);
  return record;
}

export async function getQuizById(quizId: string): Promise<QuizRecord | null> {
  const record = await quizRepo.getById(quizId);
  if (record) return record;

  // Fallback default quiz
  return {
    id: quizId,
    title: 'Animals & Nature MTB-MLE Quiz',
    grade: 'Grade 2',
    subject: 'Tribal Language FLN',
    totalPoints: 100,
    timeLimitSeconds: 180,
    questionsJson: JSON.stringify([
      {
        id: 'q1',
        type: 'mcq',
        prompt: 'What is the Santali word for Elephant?',
        promptHindi: 'हाथी को संथाली में क्या कहते हैं?',
        options: ['ᱦᱟᱹᱛᱤ (Hati)', 'ᱰᱟᱝᱜᱽᱨᱟ (Dangra)', 'ᱥᱮᱛᱟ (Seta)', 'ᱢᱮᱨᱚᱢ (Merom)'],
        correctIndex: 0,
        points: 25,
      },
      {
        id: 'q2',
        type: 'mcq',
        prompt: 'Which tree is the sacred tree of Jharkhand forests?',
        promptHindi: 'झारखंड के वनों का पवित्र वृक्ष कौन सा है?',
        options: ['Sal / Sarjom (ᱥᱟᱨᱡᱚᱢ)', 'Neem', 'Banyan', 'Mango'],
        correctIndex: 0,
        points: 25,
      },
    ]),
    createdAt: Date.now() - 86400000 * 5,
  };
}

export async function getQuizzesByGradeAndSubject(
  grade: string,
  subject?: string
): Promise<QuizRecord[]> {
  const list = await quizRepo.queryWhere('grade', '==', grade);
  if (list.length > 0) {
    if (subject) {
      return list.filter((q) => q.subject.toLowerCase().includes(subject.toLowerCase()));
    }
    return list;
  }

  // Pre-cached curriculum quizzes
  return [
    {
      id: 'quiz-animals-gr2',
      title: 'Animals & Birds in Santali & Hindi',
      grade: 'Grade 2',
      subject: 'Tribal Language FLN',
      totalPoints: 100,
      timeLimitSeconds: 180,
      questionsJson: JSON.stringify([
        {
          id: 'q1',
          type: 'mcq',
          prompt: 'What is the Santali word for Elephant?',
          promptHindi: 'हाथी को संथाली में क्या कहते हैं?',
          options: ['ᱦᱟᱹᱛᱤ (Hati)', 'ᱰᱟᱝᱜᱽᱨᱟ (Dangra)', 'ᱥᱮᱛᱟ (Seta)', 'ᱢᱮᱨᱚᱢ (Merom)'],
          correctIndex: 0,
          points: 25,
        },
        {
          id: 'q2',
          type: 'mcq',
          prompt: 'Which animal gives milk and is called Merom in Santali?',
          promptHindi: 'कौन सा जानवर दूध देता है और संथाली में मेरम कहलाता है?',
          options: ['Goat (बकरी)', 'Dog (कुत्ता)', 'Tiger (बाघ)', 'Cat (बिल्ली)'],
          correctIndex: 0,
          points: 25,
        },
      ]),
      createdAt: Date.now() - 86400000 * 3,
    },
    {
      id: 'quiz-math-counting-gr2',
      title: 'Counting 1-20 in Ol Chiki & Devanagari',
      grade: 'Grade 2',
      subject: 'Foundational Numeracy',
      totalPoints: 100,
      timeLimitSeconds: 150,
      questionsJson: JSON.stringify([
        {
          id: 'q1',
          type: 'mcq',
          prompt: 'Count the blocks: 5 + 3 = ?',
          promptHindi: 'गिनें: ५ + ३ = ?',
          options: ['᱘ (Irul - 8)', '᱗ (Eyae - 7)', '᱙ (Are - 9)', '᱖ (Turui - 6)'],
          correctIndex: 0,
          points: 50,
        },
      ]),
      createdAt: Date.now() - 86400000 * 2,
    },
  ];
}

export async function deleteQuiz(quizId: string): Promise<void> {
  await quizRepo.delete(quizId);
}

/**
 * 2. QUIZ ATTEMPTS & SUBMISSIONS
 */

export async function submitQuizAttempt(
  attempt: Omit<QuizAttemptRecord, 'id' | 'timestamp'>
): Promise<{ score: number; passed: boolean; xpEarned: number; starsEarned: number }> {
  const id = `att_${attempt.studentId}_${attempt.quizId}_${Date.now()}`;
  const passed = attempt.percentage >= 60;
  const xpEarned = passed ? 50 : 20;
  const starsEarned = attempt.percentage >= 80 ? 3 : passed ? 2 : 1;

  const record: QuizAttemptRecord = {
    ...attempt,
    id,
    passed,
    xpEarned,
    starsEarned,
    timestamp: Date.now(),
  };

  await quizAttemptRepo.save(record);

  // Automatically award XP & Stars to student progress
  await addXpAndStars(attempt.studentId, attempt.classroomId, xpEarned, starsEarned);

  return {
    score: attempt.score,
    passed,
    xpEarned,
    starsEarned,
  };
}

export async function getQuizAttemptsByStudent(studentId: string): Promise<QuizAttemptRecord[]> {
  const list = await quizAttemptRepo.queryWhere('studentId', '==', studentId);
  return list;
}
