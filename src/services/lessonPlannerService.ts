import type { LessonPlanConfig } from '../components/lesson-planner/LessonBuilderForm';

export interface TimelinePhase {
  phase: number;
  duration: string;
  titleHindi: string;
  titleSanthali: string;
  description: string;
  teacherPrompt: string;
  studentAction: string;
  materialsNeeded: string[];
}

export interface GeneratedLessonPlan {
  id: string;
  title: string;
  config: LessonPlanConfig;
  phases: TimelinePhase[];
  learningOutcomes: string[];
  nepStandard: string;
  createdAt: number;
}

const STORAGE_KEY = 'bhashabridge_lesson_plans';

class LessonPlannerService {
  public generateLessonPlan(config: LessonPlanConfig): GeneratedLessonPlan {
    const id = `plan-${Date.now()}`;

    const phases: TimelinePhase[] = [
      {
        phase: 1,
        duration: '5 Mins',
        titleHindi: 'जोहार बैठक एवं आत्मीय स्वागत',
        titleSanthali: 'ᱡᱚᱦᱟᱨ ᱫᱩᱲᱩᱵ ᱟᱨ ᱥᱟᱨᱦᱟᱣ',
        description: 'Warm classroom opening circle in tribal language to establish emotional comfort and psychological safety.',
        teacherPrompt: '“ᱥᱟᱹᱜᱩᱱ ᱥᱮᱛᱟᱜ ᱜᱤᱫᱽᱨᱟᱹ! ᱛᱮᱦᱮᱧ ᱫᱚ ᱟᱞᱮ ᱪᱮᱫ ᱵᱚᱱ ᱪᱮᱫᱚᱜ-ᱟ?” (सुप्रभात बच्चों! आज हम क्या सीखेंगे?)',
        studentAction: 'Children greet the teacher and classmates with Johar gesture.',
        materialsNeeded: ['Classroom circle rug', 'Johar mascot puppet'],
      },
      {
        phase: 2,
        duration: '7 Mins',
        titleHindi: 'मातृभाषा में मौखिक कथावाचन',
        titleSanthali: 'ᱟᱭᱳ ᱟᱲᱟᱝ ᱛᱮ ᱠᱟᱹᱦᱱᱤ ᱞᱟᱹᱭ',
        description: 'Short 2-minute folk fable introducing vocabulary in Santali / Ho / Mundari natural context.',
        teacherPrompt: 'Narrate story of animals in Jharkhand sal forests using expressive tone.',
        studentAction: 'Listen actively and identify familiar sounds and animal names.',
        materialsNeeded: ['Picture storybook', 'Flashcard illustrations'],
      },
      {
        phase: 3,
        duration: '6 Mins',
        titleHindi: 'ओल चिकी लिपि एवं ध्वनि परिचय',
        titleSanthali: 'ᱚᱞ ᱪᱤᱠᱤ ᱟᱠᱷᱚᱨ ᱟᱨ ᱥᱟᱰᱮ ᱪᱤᱱᱦᱟᱹᱣ',
        description: 'Show Ol Chiki characters on board with phonetic pronunciation chant.',
        teacherPrompt: 'Demonstrate letter tracing on blackboard and tablet screen.',
        studentAction: 'Air-trace characters and echo choral sounds.',
        materialsNeeded: ['Chalkboard', 'Ol Chiki flashcards'],
      },
      {
        phase: 4,
        duration: '7 Mins',
        titleHindi: 'द्विभाषी सेतु अनुवाद (Hindi ↔ Santali)',
        titleSanthali: 'ᱵᱟᱨ ᱟᱲᱟᱝ ᱛᱮ ᱯᱟᱹᱨᱥᱤ ᱥᱮᱛᱩ ᱛᱚᱞ',
        description: 'Bridge mother tongue terms with Hindi equivalents using BhashaBridge audio model.',
        teacherPrompt: 'Play Piper TTS native pronunciation at 0.75x speed.',
        studentAction: 'Pair Hindi words with Ol Chiki cards.',
        materialsNeeded: ['BhashaBridge tablet audio', 'Vocabulary bilingual chart'],
      },
      {
        phase: 5,
        duration: '8 Mins',
        titleHindi: 'गतिविधि आधारित खेल अभ्यास',
        titleSanthali: 'ᱠᱷᱮᱞᱚᱸᱰ ᱛᱮ ᱪᱮᱫᱚᱜ',
        description: 'Interactive TPR (Total Physical Response) classroom game.',
        teacherPrompt: 'Call out an animal name; students act out its sound and movement.',
        studentAction: 'Group role-play and mime.',
        materialsNeeded: ['Animal masks', 'Action prompt cards'],
      },
      {
        phase: 6,
        duration: '5 Mins',
        titleHindi: 'कार्यपत्रक अभ्यास (Worksheet)',
        titleSanthali: 'ᱠᱟᱹᱢᱤ ᱥᱟᱠᱟᱢ ᱚᱞ',
        description: 'Distribute printable A4 bilingual worksheets for tracing and matching.',
        teacherPrompt: 'Guide children to trace Ol Chiki letters and match pictures.',
        studentAction: 'Complete individual tracing worksheets.',
        materialsNeeded: ['Printed A4 worksheets', 'Crayons / pencils'],
      },
      {
        phase: 7,
        duration: '4 Mins',
        titleHindi: 'समीक्षा, जोहार एवं गृहकार्य',
        titleSanthali: 'ᱢᱩᱪᱟᱹᱫ ᱥᱟᱨᱦᱟᱣ ᱟᱨ ᱚᱲᱟᱜ ᱠᱟᱹᱢᱤ',
        description: 'Praise student efforts, assign family story prompt, and conclude.',
        teacherPrompt: '“ᱟᱹᱰᱤ ᱱᱟᱯᱟᱭ ᱜᱤᱫᱽᱨᱟᱹ! ᱛᱮᱦᱮᱧ ᱫᱚ ᱵᱚᱱ ᱟᱹᱰᱤ ᱱᱟᱣᱟ ᱠᱟᱛᱷᱟ ᱵᱚᱱ ᱪᱮᱫ ᱠᱮᱫ-ᱟ ᱾”',
        studentAction: 'Sing closing goodbye rhyme and receive star stickers.',
        materialsNeeded: ['Star stickers', 'Parent engagement diary'],
      },
    ];

    const plan: GeneratedLessonPlan = {
      id,
      title: `${config.topic} — ${config.grade} MTB-MLE Lesson Plan`,
      config,
      phases,
      learningOutcomes: [
        'Recognize and pronounce 6 tribal vocabulary words accurately.',
        'Bridge concepts between home language and Hindi curriculum textbooks.',
        'Attain NIPUN Bharat Foundational Literacy competency L2.4.',
      ],
      nepStandard: 'NEP 2020 Clause 4.11 — Mother Tongue / Regional Language Instruction in Primary Education',
      createdAt: Date.now(),
    };

    this.saveLessonPlan(plan);
    return plan;
  }

  public getSavedLessonPlans(): GeneratedLessonPlan[] {
    if (typeof window === 'undefined') return [];
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch {
      // ignore
    }
    return [];
  }

  public saveLessonPlan(plan: GeneratedLessonPlan) {
    if (typeof window === 'undefined') return;
    try {
      const existing = this.getSavedLessonPlans();
      const updated = [plan, ...existing.filter((p) => p.id !== plan.id)].slice(0, 15);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // ignore
    }
  }
}

export const lessonPlannerService = new LessonPlannerService();
export default lessonPlannerService;
