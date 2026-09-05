export type ContentGrade = 'Grade 1' | 'Grade 2' | 'Grade 3' | 'Grade 4' | 'Grade 5';

export type ContentSubject =
  | 'Foundational Literacy'
  | 'Mathematics'
  | 'Environmental Studies (EVS)'
  | 'Social Studies'
  | 'Arts & Culture'
  | 'Science';

export type ContentDifficulty =
  | 'Level 1 (Foundational)'
  | 'Level 2 (Intermediate)'
  | 'Level 3 (Fluency)';

export interface ContentGeneratorInputs {
  grade: ContentGrade;
  subject: ContentSubject;
  topic: string;
  language: string;
  difficulty: ContentDifficulty;
}

export interface LessonPlanPhase {
  phase: number;
  name: string;
  duration: string;
  teacherAction: string;
  studentAction: string;
  languageBridgeTip: string;
}

export interface LessonPlanOutput {
  title: string;
  learningOutcomes: string[];
  duration: string;
  phases: LessonPlanPhase[];
  materialsNeeded: string[];
  nepAlignment: string;
}

export interface StoryParagraph {
  paragraphNumber: number;
  textPrimary: string;
  textBridge: string;
  olChikiOrNativeScript?: string;
  pronunciationGuide?: string;
}

export interface StoryOutput {
  title: string;
  hindiTitle: string;
  tribalTitle: string;
  theme: string;
  paragraphs: StoryParagraph[];
  comprehensionQuestions: Array<{ question: string; answer: string }>;
  moral: string;
}

export interface FlashcardItem {
  id: string;
  frontWord: string;
  hindiWord: string;
  tribalWord: string;
  scriptNative: string;
  phonetic: string;
  englishWord: string;
  exampleSentence: string;
  funFact: string;
  category: string;
}

export interface WorksheetQuestion {
  id: string;
  prompt: string;
  options?: string[];
  answer: string;
}

export interface WorksheetSection {
  sectionTitle: string;
  activityType: 'matching' | 'fill-blanks' | 'drawing' | 'multiple-choice';
  questions: WorksheetQuestion[];
}

export interface WorksheetOutput {
  title: string;
  hindiTitle: string;
  instructions: string;
  sections: WorksheetSection[];
  teacherAnswerKey: string[];
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  languageHint: string;
}

export interface QuizOutput {
  quizTitle: string;
  questions: QuizQuestion[];
}

export interface VocabularyItem {
  id: string;
  termHindi: string;
  termTribal: string;
  termScript: string;
  termEnglish: string;
  partOfSpeech: string;
  definition: string;
  audioCue: string;
}

export interface TeacherNotesOutput {
  pedagogyTips: string[];
  tribalBridgeStrategies: string[];
  commonMisconceptions: string[];
  remedialActivities: string[];
  parentEngagementTip: string;
}

export interface GeneratedContentPackage {
  id: string;
  inputs: ContentGeneratorInputs;
  lessonPlan: LessonPlanOutput;
  story: StoryOutput;
  flashcards: FlashcardItem[];
  worksheet: WorksheetOutput;
  quiz: QuizOutput;
  vocabulary: VocabularyItem[];
  teacherNotes: TeacherNotesOutput;
  isAiGenerated: boolean;
  modelUsed: string;
  isTeacherEdited: boolean;
  createdAt: number;
  updatedAt: number;
}
