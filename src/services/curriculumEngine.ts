export type GradeLevel = 'Grade 1' | 'Grade 2' | 'Grade 3' | 'Grade 4' | 'Grade 5';

export type SubjectArea =
  | 'Foundational Literacy'
  | 'Foundational Numeracy'
  | 'English'
  | 'Hindi'
  | 'Santali MTB-MLE'
  | 'EVS'
  | 'History'
  | 'Geography'
  | 'Art'
  | 'Music'
  | 'Psychology'
  | 'Philosophy for Children'
  | 'Civics'
  | 'Ecology & Climate'
  | 'Digital Literacy'
  | 'Critical Thinking';

export interface CurriculumTopic {
  id: string;
  grade: GradeLevel;
  subject: SubjectArea;
  titleHindi: string;
  titleSanthali: string;
  titleEnglish: string;
  ncertChapterMapping: string;
  nipunCompetencyCode: string;
  jcertStandard: string;
  learningOutcomes: string[];
  recommendedPedagogy: string;
  hasAudio: boolean;
  hasWorksheet: boolean;
  hasFlashcards: boolean;
  hasStory: boolean;
  hasQuiz: boolean;
}

export const COMPLETE_CURRICULUM: CurriculumTopic[] = [
  // 1. Foundational Literacy (L1)
  {
    id: 'cur-lit-g1-01',
    grade: 'Grade 1',
    subject: 'Foundational Literacy',
    titleHindi: 'ध्वनि पहचान एवं मातृभाषा अभिवादन',
    titleSanthali: 'ᱥᱟᱰᱮ ᱪᱤᱱᱦᱟᱹᱣ ᱟᱨ ᱡᱚᱦᱟᱨ',
    titleEnglish: 'Phonological Awareness & Johar Greetings',
    ncertChapterMapping: 'NCERT Sarangi Grade 1 - Ch 1',
    nipunCompetencyCode: 'L1.1',
    jcertStandard: 'JCERT Bhasha Setu Grade 1 - Unit 1',
    learningOutcomes: [
      'Recognize initial phonemes in home language (Santali) and Hindi.',
      'Participate in opening classroom Johar greeting rhymes.',
    ],
    recommendedPedagogy: 'Choral repetition and Total Physical Response (TPR) circle time.',
    hasAudio: true,
    hasWorksheet: true,
    hasFlashcards: true,
    hasStory: true,
    hasQuiz: true,
  },
  // 2. Santali MTB-MLE (L2)
  {
    id: 'cur-san-g1-01',
    grade: 'Grade 1',
    subject: 'Santali MTB-MLE',
    titleHindi: 'ओल चिकी वर्णमाला परिचय (अ, त, ग, ल)',
    titleSanthali: 'ᱚᱞ ᱪᱤᱠᱤ ᱟᱠᱷᱚᱨ ᱪᱤᱱᱦᱟᱹᱣ (ᱚ, ᱛ, ᱜ, ᱞ)',
    titleEnglish: 'Ol Chiki Basic Character Tracing',
    ncertChapterMapping: 'MTB-MLE Tribal Primer Ch 1',
    nipunCompetencyCode: 'L1.3',
    jcertStandard: 'JCERT Ol Chiki Pathya Pustak Grade 1',
    learningOutcomes: [
      'Trace basic Ol Chiki letter strokes in sand and on tablet.',
      'Pair letter with native animal or object sound.',
    ],
    recommendedPedagogy: 'Tactile air-tracing and chalk slate work.',
    hasAudio: true,
    hasWorksheet: true,
    hasFlashcards: true,
    hasStory: true,
    hasQuiz: true,
  },
  // 3. Foundational Numeracy (M1)
  {
    id: 'cur-num-g1-01',
    grade: 'Grade 1',
    subject: 'Foundational Numeracy',
    titleHindi: '१ से १० तक मूर्त वस्तुओं से गिनती',
    titleSanthali: '᱑ ᱠᱷᱚᱱ ᱑᱐ ᱫᱷᱟᱹᱵᱤᱡ ᱞᱮᱠᱷᱟ',
    titleEnglish: 'Counting 1 to 10 with Concrete Manipulatives',
    ncertChapterMapping: 'NCERT Joyful Mathematics Grade 1 - Ch 2',
    nipunCompetencyCode: 'M1.2',
    jcertStandard: 'JCERT Ganit Ka Jadu Grade 1',
    learningOutcomes: [
      'Count up to 10 using tamarind seeds, pebbles, and fingers.',
      'Match numerals with bilingual number words (Mid, Bar, Pe).',
    ],
    recommendedPedagogy: 'Concrete-Pictorial-Abstract (CPA) model.',
    hasAudio: true,
    hasWorksheet: true,
    hasFlashcards: true,
    hasStory: false,
    hasQuiz: true,
  },
  // 4. EVS & Ecology
  {
    id: 'cur-evs-g2-01',
    grade: 'Grade 2',
    subject: 'Ecology & Climate',
    titleHindi: 'हमारे आसपास के पेड़ और पवित्र सरना स्थल',
    titleSanthali: 'ᱟᱵᱚ ᱟᱰᱮᱯᱟᱥᱮ ᱫᱟᱨᱮ ᱟᱨ ᱥᱟᱨᱱᱟ ᱴᱷᱟᱶ',
    titleEnglish: 'Local Trees & Sacred Groves (Jaher Than)',
    ncertChapterMapping: 'NCERT Our Environment Grade 2',
    nipunCompetencyCode: 'E2.1',
    jcertStandard: 'JCERT Aas-Paas Grade 2',
    learningOutcomes: [
      'Identify Sal, Mahua, and Karam trees in village surroundings.',
      'Explain traditional tribal water harvesting and conservation beliefs.',
    ],
    recommendedPedagogy: 'Classroom nature walk and elder storytelling.',
    hasAudio: true,
    hasWorksheet: true,
    hasFlashcards: true,
    hasStory: true,
    hasQuiz: true,
  },
  // 5. History & Tribal Heritage
  {
    id: 'cur-his-g3-01',
    grade: 'Grade 3',
    subject: 'History',
    titleHindi: 'भगवान बिरसा मुंडा और उलगुलान की गाथा',
    titleSanthali: 'ᱵᱤᱨᱥᱟᱹ ᱢᱩᱱᱰᱟᱹ ᱟᱨ ᱩᱞᱜᱩᱞᱟᱱ ᱠᱟᱹᱦᱱᱤ',
    titleEnglish: 'Bhagwan Birsa Munda & The Ulgulan Movement',
    ncertChapterMapping: 'NCERT Looking Around Grade 3',
    nipunCompetencyCode: 'H3.2',
    jcertStandard: 'JCERT Hamara Jharkhand Grade 3',
    learningOutcomes: [
      'Narrate the bravery of Birsa Munda in protecting tribal land rights.',
      'Appreciate local freedom fighters like Sidho-Kanho and Tilka Manjhi.',
    ],
    recommendedPedagogy: 'Role-play theatre and illustrated comic reading.',
    hasAudio: true,
    hasWorksheet: true,
    hasFlashcards: true,
    hasStory: true,
    hasQuiz: true,
  },
  // 6. Art & Culture
  {
    id: 'cur-art-g2-01',
    grade: 'Grade 2',
    subject: 'Art',
    titleHindi: 'सोहराय और कोहबर पारंपरिक भित्तिचित्र कला',
    titleSanthali: 'ᱥᱚᱦᱨᱟᱭ ᱟᱨ ᱠᱚᱦᱵᱚᱨ ᱪᱤᱛᱟᱹᱨ ᱦᱩᱱᱟᱹᱨ',
    titleEnglish: 'Sohrai & Khovar Traditional Wall Art',
    ncertChapterMapping: 'NCERT Art Education Grade 2',
    nipunCompetencyCode: 'A2.4',
    jcertStandard: 'JCERT Kala Saurabh Grade 2',
    learningOutcomes: [
      'Draw traditional animal and bird motifs with natural earth tones.',
      'Understand the cultural significance of Cattle Festival (Sohrai).',
    ],
    recommendedPedagogy: 'Clay and natural pigment wall painting on paper.',
    hasAudio: true,
    hasWorksheet: true,
    hasFlashcards: true,
    hasStory: true,
    hasQuiz: false,
  },
];

class CurriculumEngine {
  public getTopicsByGrade(grade: GradeLevel): CurriculumTopic[] {
    return COMPLETE_CURRICULUM.filter((t) => t.grade === grade);
  }

  public getTopicsBySubject(subject: SubjectArea): CurriculumTopic[] {
    return COMPLETE_CURRICULUM.filter((t) => t.subject === subject);
  }

  public getAllTopics(): CurriculumTopic[] {
    return COMPLETE_CURRICULUM;
  }
}

export const curriculumEngine = new CurriculumEngine();
export default curriculumEngine;
