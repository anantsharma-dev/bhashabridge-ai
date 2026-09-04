import grade1Data from '../../data/curriculum/grade1/lessons.json';
import grade2Data from '../../data/curriculum/grade2/lessons.json';
import grade3Data from '../../data/curriculum/grade3/lessons.json';
import grade4Data from '../../data/curriculum/grade4/lessons.json';
import grade5Data from '../../data/curriculum/grade5/lessons.json';

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

const GRADE_DATABASE: Record<number, CurriculumLessonData> = {
  1: grade1Data as CurriculumLessonData,
  2: grade2Data as CurriculumLessonData,
  3: grade3Data as CurriculumLessonData,
  4: grade4Data as CurriculumLessonData,
  5: grade5Data as CurriculumLessonData,
};

class CurriculumService {
  public getCurriculumByGrade(grade: number): CurriculumLessonData | null {
    return GRADE_DATABASE[grade] || null;
  }

  public getAllGrades(): number[] {
    return [1, 2, 3, 4, 5];
  }

  public searchCurriculum(query: string) {
    const q = query.trim().toLowerCase();
    if (!q) return [];

    const results: {
      grade: number;
      subject: string;
      chapterTitle: string;
      hindi: string;
      santhali: string;
      roman: string;
    }[] = [];

    for (const [gradeStr, data] of Object.entries(GRADE_DATABASE)) {
      const grade = parseInt(gradeStr, 10);
      for (const subj of data.subjects) {
        for (const chap of subj.chapters) {
          for (const vocab of chap.keyVocabulary) {
            if (
              vocab.hindi.toLowerCase().includes(q) ||
              vocab.santhali.includes(q) ||
              vocab.roman.toLowerCase().includes(q) ||
              chap.titleHindi.toLowerCase().includes(q)
            ) {
              results.push({
                grade,
                subject: subj.name,
                chapterTitle: chap.titleHindi,
                hindi: vocab.hindi,
                santhali: vocab.santhali,
                roman: vocab.roman,
              });
            }
          }
        }
      }
    }

    return results;
  }
}

export const curriculumService = new CurriculumService();
export default curriculumService;
