/**
 * BhashaBridge AI — Curriculum Engine Types
 * Aligned with NCERT 2024, NIPUN Bharat FLN/FNN, and Jharkhand SCERT MTB-MLE.
 */

export type CurriculumStandard = 'NCERT 2024' | 'NIPUN Bharat' | 'Jharkhand SCERT MTB-MLE';

export type CurriculumGrade = 1 | 2 | 3 | 4 | 5;

export type CurriculumSubject =
  | 'Foundational Literacy'
  | 'Foundational Numeracy'
  | 'EVS'
  | 'History'
  | 'Geography'
  | 'Arts'
  | 'Music'
  | 'Psychology'
  | 'Philosophy for Children'
  | 'Civics'
  | 'Ecology';

export interface LessonVocabularyItem {
  english: string;
  hindi: string;
  santhali: string;
  roman: string;
  partOfSpeech: string;
}

export interface LessonFlashcard {
  id: string;
  english: string;
  hindi: string;
  santhali: string;
  roman: string;
  category: string;
  imageUrl?: string;
}

export interface LessonStory {
  id: string;
  titleEnglish: string;
  titleHindi: string;
  titleSanthali: string;
  titleRoman: string;
  paragraphsEnglish: string[];
  paragraphsHindi: string[];
  paragraphsSanthali: string[];
  paragraphsRoman: string[];
  culturalContext: string;
}

export interface LessonWorksheetTask {
  questionHindi: string;
  questionSanthali: string;
  type: 'tracing' | 'matching' | 'fill_in_blanks' | 'drawing';
  options?: string[];
  answer: string;
}

export interface LessonWorksheet {
  id: string;
  title: string;
  instructionsHindi: string;
  instructionsSanthali: string;
  tasks: LessonWorksheetTask[];
}

export interface LessonQuizQuestion {
  promptHindi: string;
  promptSanthali: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface LessonMiniQuiz {
  id: string;
  title: string;
  questions: LessonQuizQuestion[];
}

export interface LessonAudioNarration {
  durationSeconds: number;
  speedRate: number;
  narratorPersona: 'female_teacher' | 'child_voice';
}

export interface LessonIllustrationMetadata {
  themeIcon: string;
  primaryColor: string;
  bannerIllustration: string;
  altText: string;
}

export interface LessonPronunciationGuide {
  word: string;
  script: 'Ol Chiki' | 'Devanagari';
  phoneticIpa: string;
  romanPhonetic: string;
  audioHint: string;
}

export interface CurriculumLesson {
  id: string;
  grade: CurriculumGrade;
  subject: CurriculumSubject;
  standards: CurriculumStandard[];
  titleEnglish: string;
  titleHindi: string;
  titleSanthali: string;
  titleRoman: string;
  theme: string;
  difficultyLevel: 'Level 1 (Foundational)' | 'Level 2 (Transitional)' | 'Level 3 (Competent)';
  learningObjectives: string[];
  story: LessonStory;
  flashcards: LessonFlashcard[];
  worksheet: LessonWorksheet;
  miniQuiz: LessonMiniQuiz;
  audioNarration: LessonAudioNarration;
  illustrationMetadata: LessonIllustrationMetadata;
  vocabulary: LessonVocabularyItem[];
  pronunciationGuide: LessonPronunciationGuide[];
}
