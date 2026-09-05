/**
 * BhashaBridge AI - Production Question Bank Service
 * Multi-criteria curriculum search, import engine, and offline caching.
 */

import {
  collection,
  doc,
  getDocs,
  setDoc,
  query,
  where,
  limit,
  writeBatch,
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { indexedDbEngine } from '../offline/indexedDbEngine';
import type { QuestionBankItem } from '../types/quiz';

export interface QuestionBankFilter {
  subject?: string;
  grade?: string;
  language?: string;
  chapter?: string;
  topic?: string;
  difficulty?: string;
  competency?: string;
  bloomsLevel?: string;
  source?: 'NCERT' | 'NIPUN' | 'JHARKHAND';
  searchQuery?: string;
  limitCount?: number;
}

const DEFAULT_BANK_ITEMS: QuestionBankItem[] = [
  {
    questionId: 'qb_ncert_01',
    subject: 'Language MTB-MLE',
    grade: 'Grade 2',
    language: 'santali',
    chapter: 'Saranda Wildlife',
    topic: 'Forest Animals',
    difficulty: 'easy',
    competency: 'vocabulary',
    bloomsLevel: 'remember',
    question: 'What is the Santali word for Elephant?',
    questionHindi: 'हाथी को संथाली में क्या कहते हैं?',
    questionSanthali: 'ᱦᱟᱹᱛᱤ ᱧᱩᱛᱩᱢ ᱪᱮᱫ ᱠᱟᱱᱟ?',
    options: ['ᱦᱟᱹᱛᱤ (Hati)', 'ᱰᱟᱝᱜᱽᱨᱟ (Dangra)', 'ᱥᱮᱛᱟ (Seta)', 'ᱢᱮᱨᱚᱢ (Merom)'],
    answer: 'ᱦᱟᱹᱛᱤ (Hati)',
    explanation: 'ᱦᱟᱹᱛᱤ (Hati) is the Ol Chiki word for elephant.',
    tags: ['animals', 'vocabulary'],
    source: 'JHARKHAND',
  },
  {
    questionId: 'qb_nipun_02',
    subject: 'Foundational Numeracy',
    grade: 'Grade 1',
    language: 'bilingual',
    chapter: 'Numbers 1-10',
    topic: 'Counting',
    difficulty: 'easy',
    competency: 'numeracy',
    bloomsLevel: 'understand',
    question: 'Which number comes after 4 (ᱯᱩᱱ / चार)?',
    questionHindi: '४ के बाद कौन सी संख्या आती है?',
    questionSanthali: '᱔ ᱛᱟᱭᱚᱢ ᱪᱮᱫ ᱮᱞ ᱦᱤᱡᱩᱜ-ᱟ?',
    options: ['᱕ (More / 5)', '᱓ (Pe / 3)', '᱖ (Turui / 6)', '᱒ (Bar / 2)'],
    answer: '᱕ (More / 5)',
    explanation: '5 (More) succeeds 4.',
    tags: ['counting', 'nipun-math'],
    source: 'NIPUN',
  },
  {
    questionId: 'qb_jh_03',
    subject: 'Tribal Arts & Culture',
    grade: 'Grade 2',
    language: 'hindi',
    chapter: 'Sohrai Motifs',
    topic: 'Folk Art',
    difficulty: 'medium',
    competency: 'art_appreciation',
    bloomsLevel: 'apply',
    question: 'Sohrai paintings are traditionally made using which natural materials?',
    questionHindi: 'सोहराई चित्रकला पारंपरिक रूप से किन प्राकृतिक रंगों से बनाई जाती है?',
    options: ['Natural Ochre and Clay Soils (लाल, पीली और सफेद मिट्टी)', 'Synthetic Acrylic', 'Plastic Emulsion', 'Oil Paints'],
    answer: 'Natural Ochre and Clay Soils (लाल, पीली और सफेद मिट्टी)',
    explanation: 'Indigenous artists in Hazaribagh & Dumka harvest red, yellow, and white clay soils.',
    tags: ['culture', 'art'],
    source: 'JHARKHAND',
  },
];

class QuestionBankService {
  /**
   * 1. Query Question Bank with multi-criteria filtering & search
   */
  public async queryQuestions(filter: QuestionBankFilter = {}): Promise<QuestionBankItem[]> {
    try {
      let q = query(collection(db, 'questionBank'));

      if (filter.subject) {
        q = query(q, where('subject', '==', filter.subject));
      }
      if (filter.grade) {
        q = query(q, where('grade', '==', filter.grade));
      }
      if (filter.source) {
        q = query(q, where('source', '==', filter.source));
      }
      if (filter.difficulty) {
        q = query(q, where('difficulty', '==', filter.difficulty));
      }

      const snap = await getDocs(query(q, limit(filter.limitCount || 50)));

      if (!snap.empty) {
        let items = snap.docs.map((d) => d.data() as QuestionBankItem);
        if (filter.searchQuery) {
          const sq = filter.searchQuery.toLowerCase();
          items = items.filter(
            (it) =>
              it.question.toLowerCase().includes(sq) ||
              (it.questionHindi && it.questionHindi.toLowerCase().includes(sq)) ||
              it.topic.toLowerCase().includes(sq)
          );
        }
        return items;
      }
    } catch (err) {
      console.warn('Firestore question bank query failed, falling back to defaults:', err);
    }

    // Default filtered list
    return DEFAULT_BANK_ITEMS.filter((it) => {
      if (filter.subject && it.subject !== filter.subject) return false;
      if (filter.grade && it.grade !== filter.grade) return false;
      if (filter.source && it.source !== filter.source) return false;
      return true;
    });
  }

  /**
   * 2. Add single question to bank
   */
  public async addQuestion(item: Omit<QuestionBankItem, 'questionId'> & { questionId?: string }): Promise<string> {
    const questionId = item.questionId || `qb_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
    const fullItem: QuestionBankItem = {
      ...item,
      questionId,
    };

    await setDoc(doc(db, 'questionBank', questionId), fullItem);
    await indexedDbEngine.setItem('quizzes' as any, { id: questionId, ...fullItem }).catch(() => {});
    return questionId;
  }

  /**
   * 3. Bulk import questions into bank
   */
  public async importQuestions(questions: QuestionBankItem[]): Promise<number> {
    const batchSize = 400;
    let count = 0;

    for (let i = 0; i < questions.length; i += batchSize) {
      const chunk = questions.slice(i, i + batchSize);
      const batch = writeBatch(db);

      for (const q of chunk) {
        const id = q.questionId || `qb_${Date.now()}_${count}`;
        batch.set(doc(db, 'questionBank', id), { ...q, questionId: id }, { merge: true });
        count++;
      }

      await batch.commit();
    }

    return count;
  }
}

export const questionBankService = new QuestionBankService();
export default questionBankService;
