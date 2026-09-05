/**
 * BhashaBridge AI - Production Curriculum Data Models
 * Aligned with NCERT Classes 1-5, NIPUN Bharat FLN, SCERT Jharkhand,
 * and Mother Tongue Based Multilingual Education (MTB-MLE) pedagogy.
 */

export type CurriculumBoard = 'NCERT' | 'NIPUN' | 'JHARKHAND_SCERT' | 'MTB_MLE';
export type GradeLevel = 'Grade 1' | 'Grade 2' | 'Grade 3' | 'Grade 4' | 'Grade 5';
export type CurriculumDifficulty = 'beginner' | 'intermediate' | 'advanced';
export type SupportedLanguage = 'santali' | 'hindi' | 'english' | 'bilingual' | 'ho' | 'mundari' | 'kurukh';

export type SubjectCode =
  | 'fln_literacy'
  | 'fln_numeracy'
  | 'evs'
  | 'history_culture'
  | 'geography'
  | 'civics'
  | 'ecology'
  | 'philosophy'
  | 'psychology_sel'
  | 'arts_music'
  | 'english_bridge'
  | 'hindi'
  | 'santali';

// ----------------------------------------------------------------------
// 1. CURRICULUM OVERVIEW & UNITS
// ----------------------------------------------------------------------

export interface Curriculum {
  curriculumId: string;
  board: CurriculumBoard;
  grade: GradeLevel;
  subject: SubjectCode | string;
  unit: string;
  chapter: string;
  chapterNumber: number;
  languageSupport: SupportedLanguage[];
  competencies: string[];
  learningOutcomes: string[];
  estimatedHours: number;
  difficulty: CurriculumDifficulty;
  icon: string;
  color: string;
  updatedAt: number;
}

// ----------------------------------------------------------------------
// 2. SUBJECTS
// ----------------------------------------------------------------------

export interface Subject {
  subjectId: string;
  grade: GradeLevel;
  subjectName: string;
  subjectCode: SubjectCode | string;
  themeColor: string;
  icon: string;
  description: string;
  languageSupport: SupportedLanguage[];
  totalChapters?: number;
  totalLessons?: number;
}

// ----------------------------------------------------------------------
// 3. CHAPTERS
// ----------------------------------------------------------------------

export interface Chapter {
  chapterId: string;
  subjectId: string;
  grade: GradeLevel;
  chapterNumber: number;
  titleHindi: string;
  titleEnglish: string;
  titleSantali: string;
  summary: string;
  keywords: string[];
  difficulty: CurriculumDifficulty;
  estimatedLessons: number;
  learningObjectives: string[];
  unitName?: string;
  prerequisites?: string[];
}

// ----------------------------------------------------------------------
// 4. LESSONS & LESSON GRAPH
// ----------------------------------------------------------------------

export interface Lesson {
  lessonId: string;
  chapterId: string;
  grade: GradeLevel;
  subject: SubjectCode | string;
  language: SupportedLanguage;
  title: string;
  titleHindi?: string;
  titleSantali?: string;
  summary: string;
  competency: string;
  learningObjective: string;
  activityIds: string[];
  storyIds: string[];
  flashcardIds: string[];
  worksheetTemplateIds: string[];
  quizTemplateIds: string[];
  audioIds: string[];
  videoIds: string[];
  ecologyTheme?: string;
  psychologyTheme?: string;
  philosophyTheme?: string;
  historyTheme?: string;
  geographyTheme?: string;
  artTheme?: string;
  prerequisiteLessonIds?: string[];
  nextLessonIds?: string[];
  orderIndex?: number;
  estimatedMinutes?: number;
  createdAt: number;
  updatedAt?: number;
}

export interface LessonGraphNode {
  lessonId: string;
  title: string;
  subject: string;
  grade: GradeLevel;
  prerequisites: string[];
  unlocks: string[];
  competency: string;
}

// ----------------------------------------------------------------------
// 5. NIPUN FLN COMPETENCIES
// ----------------------------------------------------------------------

export interface Competency {
  competencyId: string;
  grade: GradeLevel;
  subject: SubjectCode | string;
  nipunCode: string; // e.g. "L1.1", "M2.4"
  domain: 'reading' | 'writing' | 'numeracy' | 'listening' | 'speaking' | 'sel' | 'inquiry';
  description: string;
  learningOutcome: string;
  assessmentCriteria: string;
}

// ----------------------------------------------------------------------
// 6. MULTILINGUAL VOCABULARY
// ----------------------------------------------------------------------

export interface VocabularyWord {
  wordId: string;
  grade: GradeLevel;
  subject: SubjectCode | string;
  category: string; // e.g. "animals", "birds", "nature", "emotions", "geometry"
  english: string;
  hindi: string;
  santaliOlChiki: string;
  romanSantali: string;
  definition: string;
  phonetics: string;
  audioHindi?: string;
  audioSantali?: string;
  audioEnglish?: string;
  imageUrl?: string;
  difficulty: CurriculumDifficulty;
  exampleSentence: {
    english: string;
    hindi: string;
    santaliOlChiki: string;
    romanSantali?: string;
  };
  relatedLesson: string;
  tags: string[];
}

// ----------------------------------------------------------------------
// 7. STORIES
// ----------------------------------------------------------------------

export interface Story {
  storyId: string;
  grade: GradeLevel;
  subject: SubjectCode | string;
  language: SupportedLanguage;
  title: string;
  titleHindi?: string;
  titleSantali?: string;
  author: string;
  summary: string;
  content: string; // Full story or paragraphs
  contentHindi?: string;
  contentSantali?: string;
  moral: string;
  vocabulary: string[]; // wordIds or words
  discussionQuestions: string[];
  activitySuggestions: string[];
  ecologyTheme?: string;
  psychologyTheme?: string;
  philosophyTheme?: string;
  historyTheme?: string;
  geographyTheme?: string;
  artTheme?: string;
  audioId?: string;
  illustrationIds: string[];
  estimatedReadingMinutes: number;
}

// ----------------------------------------------------------------------
// 8. ACTIVITIES
// ----------------------------------------------------------------------

export type ActivityType =
  | 'hands_on'
  | 'group_game'
  | 'oral_discussion'
  | 'drawing_craft'
  | 'outdoor_nature'
  | 'roleplay'
  | 'math_manipulative';

export interface Activity {
  activityId: string;
  grade: GradeLevel;
  subject: SubjectCode | string;
  type: ActivityType;
  title: string;
  titleHindi?: string;
  titleSantali?: string;
  description: string;
  materials: string[];
  duration: number; // minutes
  teacherGuide: string;
  studentInstructions: string;
  learningOutcome: string;
}

// ----------------------------------------------------------------------
// 9. WORKSHEET TEMPLATES
// ----------------------------------------------------------------------

export interface WorksheetQuestionTemplate {
  questionNumber: number;
  instruction: string;
  type: 'tracing' | 'fill_blank' | 'match' | 'drawing' | 'word_search' | 'math_problem';
  prompt: string;
  promptHindi?: string;
  promptSantali?: string;
  sampleAnswer: string;
}

export interface WorksheetTemplate {
  worksheetId: string;
  grade: GradeLevel;
  subject: SubjectCode | string;
  chapter: string;
  difficulty: CurriculumDifficulty;
  templateType: 'fln_daily' | 'weekly_review' | 'activity_sheet' | 'assessment';
  competencies: string[];
  questionTemplates: WorksheetQuestionTemplate[];
  answerKeyTemplate: Record<string, string>;
  downloadUrl?: string;
}

// ----------------------------------------------------------------------
// 10. LESSON PLANS
// ----------------------------------------------------------------------

export interface LessonPlanTemplate {
  templateId: string;
  grade: GradeLevel;
  subject: SubjectCode | string;
  chapter: string;
  duration: number; // minutes, e.g. 40
  objectives: string[];
  materials: string[];
  warmUp: string;
  mainActivity: string;
  assessment: string;
  reflection: string;
  homework: string;
}

// ----------------------------------------------------------------------
// 11. FLASHCARDS LIBRARY
// ----------------------------------------------------------------------

export interface Flashcard {
  cardId: string;
  grade: GradeLevel;
  category: string;
  subject: SubjectCode | string;
  difficulty: CurriculumDifficulty;
  image: string;
  english: string;
  hindi: string;
  santali: string;
  romanSantali: string;
  audioIds?: {
    english?: string;
    hindi?: string;
    santali?: string;
  };
  fact: string;
  didYouKnow: string;
  relatedLesson: string;
}

// ----------------------------------------------------------------------
// 12. MEDIA ASSETS
// ----------------------------------------------------------------------

export interface MediaAsset {
  mediaId: string;
  type: 'audio' | 'image' | 'video' | 'document' | 'illustration';
  language: SupportedLanguage;
  title: string;
  storagePath: string;
  thumbnail?: string;
  duration?: number; // seconds
  offlineDownloadSize: number; // bytes
  license: string;
}

// ----------------------------------------------------------------------
// 13. OFFLINE CURRICULUM PACKS
// ----------------------------------------------------------------------

export type CurriculumPackType =
  | 'grade_pack'
  | 'subject_pack'
  | 'story_pack'
  | 'audio_pack'
  | 'flashcard_pack'
  | 'worksheet_pack';

export interface CurriculumPack {
  packId: string;
  type: CurriculumPackType;
  grade: GradeLevel;
  subject?: SubjectCode | string;
  title: string;
  version: string;
  sizeMB: number;
  downloadUrl: string;
  checksum: string;
  itemCount: number;
  updatedAt: number;
}

// ----------------------------------------------------------------------
// 14. SEARCH & RECOMMENDATIONS
// ----------------------------------------------------------------------

export interface CurriculumSearchFilter {
  query?: string;
  grade?: GradeLevel;
  subject?: SubjectCode | string;
  competency?: string;
  chapter?: string;
  keyword?: string;
  language?: SupportedLanguage;
  theme?: string;
  difficulty?: CurriculumDifficulty;
  limitCount?: number;
}

export interface Recommendation {
  id: string;
  type: 'lesson' | 'story' | 'worksheet' | 'quiz' | 'flashcard' | 'pronunciation';
  title: string;
  reason: string;
  subject: string;
  grade: GradeLevel;
  targetId: string;
  difficulty: CurriculumDifficulty;
  estimatedXP: number;
}

export interface StudentRecommendationSet {
  studentId: string;
  nextLesson?: Recommendation;
  nextStory?: Recommendation;
  nextFlashcards?: Recommendation[];
  nextWorksheet?: Recommendation;
  nextQuiz?: Recommendation;
  pronunciationPractice?: Recommendation;
  generatedAt: number;
}
