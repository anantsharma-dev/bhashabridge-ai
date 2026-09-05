import type { CurriculumGrade, CurriculumLesson } from '../../data/curriculum';
import {
  ALL_CURRICULUM_LESSONS,
  getLessonsByGrade,
  searchCurriculumLessons,
} from '../../data/curriculum';

export interface CurriculumLessonData {
  grade: number;
  state: string;
  board: string;
  curriculumFramework: string;
  academicYear: string;
  subjects: {
    id: string;
    name: string;
    languagePair: string;
    chapters: {
      chapterNumber: number;
      titleHindi: string;
      titleSanthali: string;
      titleRoman: string;
      theme: string;
      nipunCompetency: string;
      keyVocabulary: {
        hindi: string;
        santhali: string;
        roman: string;
      }[];
    }[];
  }[];
}

class CurriculumService {
  public getCurriculumByGrade(grade: number): CurriculumLessonData | null {
    if (grade < 1 || grade > 5) return null;
    const lessons = getLessonsByGrade(grade as CurriculumGrade);

    return {
      grade,
      state: 'Jharkhand',
      board: 'JCERT / SCERT',
      curriculumFramework: 'NEP 2020 & NIPUN Bharat FLN',
      academicYear: '2026-27',
      subjects: [
        {
          id: `g${grade}-mle`,
          name: `MTB-MLE Grade ${grade}`,
          languagePair: 'Hindi ↔ Santali (Ol Chiki)',
          chapters: lessons.map((l, index) => ({
            chapterNumber: index + 1,
            titleHindi: l.titleHindi,
            titleSanthali: l.titleSanthali,
            titleRoman: l.titleRoman,
            theme: l.theme,
            nipunCompetency: l.standards.join(' • '),
            keyVocabulary: l.vocabulary.map((v) => ({
              hindi: v.hindi,
              santhali: v.santhali,
              roman: v.roman,
            })),
          })),
        },
      ],
    };
  }

  public getAllGrades(): number[] {
    return [1, 2, 3, 4, 5];
  }

  public getLessons(grade?: number): CurriculumLesson[] {
    if (grade && grade >= 1 && grade <= 5) {
      return getLessonsByGrade(grade as CurriculumGrade);
    }
    return ALL_CURRICULUM_LESSONS;
  }

  public searchCurriculum(query: string) {
    const q = query.trim().toLowerCase();
    if (!q) return [];

    const matchedLessons = searchCurriculumLessons(q);
    const results: {
      grade: number;
      subject: string;
      chapterTitle: string;
      hindi: string;
      santhali: string;
      roman: string;
    }[] = [];

    for (const l of matchedLessons) {
      for (const vocab of l.vocabulary) {
        if (
          vocab.hindi.toLowerCase().includes(q) ||
          vocab.santhali.includes(q) ||
          vocab.roman.toLowerCase().includes(q) ||
          l.titleHindi.toLowerCase().includes(q)
        ) {
          results.push({
            grade: l.grade,
            subject: l.subject,
            chapterTitle: l.titleHindi,
            hindi: vocab.hindi,
            santhali: vocab.santhali,
            roman: vocab.roman,
          });
        }
      }
    }

    return results;
  }
}

export const curriculumService = new CurriculumService();
export default curriculumService;
