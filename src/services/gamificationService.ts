export interface BadgeItem {
  id: string;
  name: string;
  hindiName: string;
  santhaliName: string;
  description: string;
  icon: string;
  category: 'attendance' | 'vocabulary' | 'stories' | 'quizzes' | 'streak';
  unlocked: boolean;
  unlockedAt?: number;
}

export interface HornbillEvolution {
  stage: number;
  title: string;
  hindiTitle: string;
  minXp: number;
  description: string;
  perks: string[];
  emoji: string;
}

export interface JourneyStop {
  id: string;
  name: string;
  district: string;
  requiredXp: number;
  completed: boolean;
  culturalNote: string;
}

export const HORNBILL_STAGES: HornbillEvolution[] = [
  {
    stage: 1,
    title: 'Hatchling Johar',
    hindiTitle: 'नन्हा जोहार',
    minXp: 0,
    description: 'Curious baby hornbill learning its first tribal sounds in Jharkhand.',
    perks: ['Daily greeting audio', 'Basic flashcard practice'],
    emoji: '🐣',
  },
  {
    stage: 2,
    title: 'Forest Fledgling',
    hindiTitle: 'जंगल का साथी',
    minXp: 300,
    description: 'Spreading wings across Sal and Mahua trees, learning Ol Chiki letters.',
    perks: ['Unlock 5 regional story audiobooks', '+5% XP bonus'],
    emoji: '🐥',
  },
  {
    stage: 3,
    title: 'Village Forest Guide',
    hindiTitle: 'गाँव का मार्गदर्शक',
    minXp: 800,
    description: 'Guiding students across rivers, festivals, and folk storytellers.',
    perks: ['Unlock custom Hornbill avatars', 'Pronunciation helper unlocked'],
    emoji: '🦅',
  },
  {
    stage: 4,
    title: 'Scholar Hornbill (Machet Johar)',
    hindiTitle: 'विद्वान जोहार शिक्षक',
    minXp: 1800,
    description: 'Master of multilingual MTB-MLE and guardian of Santhali heritage.',
    perks: ['Mastery golden certificate', 'Unlimited offline voice translation'],
    emoji: '🦉',
  },
];

export const JOURNEY_STOPS: JourneyStop[] = [
  {
    id: 'stop-1',
    name: 'Ranchi Forest Circle',
    district: 'Ranchi',
    requiredXp: 0,
    completed: true,
    culturalNote: 'Birsa Munda Smriti Udyan and vibrant weekly Haat bazaars.',
  },
  {
    id: 'stop-2',
    name: 'Khunti Ulihatu Trail',
    district: 'Khunti',
    requiredXp: 250,
    completed: true,
    culturalNote: 'Birthplace of Bhagwan Birsa Munda surrounded by sacred Sarna groves.',
  },
  {
    id: 'stop-3',
    name: 'Saranda Forest Canopy',
    district: 'West Singhbhum',
    requiredXp: 600,
    completed: true,
    culturalNote: 'The legendary "Land of 700 hills" rich in Ho tribal folklore and dancing peacocks.',
  },
  {
    id: 'stop-4',
    name: 'Dumka Mayurakshi Valley',
    district: 'Dumka',
    requiredXp: 1200,
    completed: false,
    culturalNote: 'The cultural capital of Santhal Pargana with vibrant Sohrai paintings and Ol Chiki literature.',
  },
  {
    id: 'stop-5',
    name: 'Parasnath Sacred Summit',
    district: 'Giridih',
    requiredXp: 2000,
    completed: false,
    culturalNote: 'Highest mountain peak in Jharkhand with ancient biodiversity.',
  },
];

export const ALL_BADGES: BadgeItem[] = [
  {
    id: 'badge-starter',
    name: 'Johar Welcome',
    hindiName: 'जोहार स्वागत',
    santhaliName: 'ᱡᱚᱦᱟᱨ ᱮᱛᱚᱦᱚᱵ',
    description: 'Logged into BhashaBridge classroom for the first time.',
    icon: '👋',
    category: 'attendance',
    unlocked: true,
  },
  {
    id: 'badge-olchiki',
    name: 'Ol Chiki Scribe',
    hindiName: 'ओल चिकी लेखक',
    santhaliName: 'ᱚᱞ ᱪᱤᱠᱤ ᱪᱮᱫᱚᱜᱤᱡ',
    description: 'Successfully traced and mastered 10 Ol Chiki alphabets.',
    icon: '✍️',
    category: 'vocabulary',
    unlocked: true,
  },
  {
    id: 'badge-story',
    name: 'Folk Storyteller',
    hindiName: 'कथावाचक',
    santhaliName: 'ᱠᱟᱹᱦᱱᱤ ᱞᱟᱹᱭᱤᱡ',
    description: 'Read and answered comprehension questions for 3 Santhali stories.',
    icon: '📖',
    category: 'stories',
    unlocked: true,
  },
  {
    id: 'badge-streak7',
    name: '7-Day Sal Tree Streak',
    hindiName: '७ दिवसीय सतत अभ्यास',
    santhaliName: '᱗ ᱢᱟᱦᱟᱸ ᱞᱮᱛᱟᱲ',
    description: 'Practiced multilingual lessons for 7 consecutive days.',
    icon: '🔥',
    category: 'streak',
    unlocked: true,
  },
  {
    id: 'badge-quiz-master',
    name: 'FLN Quiz Master',
    hindiName: 'प्रश्नोत्तरी विजेता',
    santhaliName: 'ᱠᱩᱠᱞᱤ ᱡᱤᱛᱠᱟᱹᱨᱤᱭᱟᱹ',
    description: 'Scored 100% on any classroom curriculum quiz.',
    icon: '🏆',
    category: 'quizzes',
    unlocked: false,
  },
  {
    id: 'badge-nature',
    name: 'Jharkhand Forest Guardian',
    hindiName: 'वन्य जीव मित्र',
    santhaliName: 'ᱵᱤᱨ ᱡᱤᱭᱟᱹᱞᱤ ᱜᱟᱛᱮ',
    description: 'Mastered all 16 animals and forest tree vocabulary words.',
    icon: '🌿',
    category: 'vocabulary',
    unlocked: false,
  },
];

class GamificationService {
  public getHornbillEvolution(xp: number): HornbillEvolution {
    const stages = [...HORNBILL_STAGES].reverse();
    return stages.find((s) => xp >= s.minXp) || HORNBILL_STAGES[0];
  }

  public getBadges(): BadgeItem[] {
    return ALL_BADGES;
  }

  public getJourneyStops(currentXp: number): JourneyStop[] {
    return JOURNEY_STOPS.map((stop) => ({
      ...stop,
      completed: currentXp >= stop.requiredXp,
    }));
  }
}

export const gamificationService = new GamificationService();
export default gamificationService;
