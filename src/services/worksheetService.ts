import type { WorksheetConfig } from '../components/worksheets/WorksheetGeneratorForm';

export interface WorksheetQuestion {
  id: string;
  questionNumber: number;
  promptHindi: string;
  promptSanthali: string;
  type: 'matching' | 'tracing' | 'fill_blank' | 'counting';
  leftItem?: { textHindi: string; textSanthali: string; icon?: string };
  rightItem?: { textHindi: string; textSanthali: string };
  answerGuide: string;
}

export interface GeneratedWorksheet {
  id: string;
  title: string;
  titleSanthali: string;
  config: WorksheetConfig;
  instructionsHindi: string;
  instructionsSanthali: string;
  questions: WorksheetQuestion[];
  createdAt: number;
}

const STORAGE_KEY = 'bhashabridge_worksheets_cache';

class WorksheetService {
  public generateWorksheet(config: WorksheetConfig): GeneratedWorksheet {
    const id = `ws-${Date.now()}`;
    const count = config.questionCount || 6;

    let questions: WorksheetQuestion[] = [];

    if (config.subject.includes('Math')) {
      questions = this.generateMathQuestions(count);
    } else if (config.subject.includes('EVS')) {
      questions = this.generateEvsQuestions(count);
    } else {
      questions = this.generateLanguageQuestions(count);
    }

    const titleSanthali = config.topic.includes('Animal')
      ? 'ᱵᱤᱨ ᱟᱨ ᱚᱲᱟᱜ ᱡᱤᱵᱽ ᱡᱤᱭᱟᱹᱞᱤ'
      : config.topic.includes('Number')
      ? 'ᱞᱮᱠᱷᱟ ᱮᱞ ᱯᱟᱲᱦᱟᱣ'
      : 'ᱟᱥᱲᱟ ᱨᱮᱭᱟᱜ ᱠᱟᱛᱷᱟ';

    const worksheet: GeneratedWorksheet = {
      id,
      title: `${config.topic} — ${config.grade} MTB-MLE अभ्यास पत्र`,
      titleSanthali,
      config,
      instructionsHindi: 'निर्देश: बाईं ओर के शब्दों को दाईं ओर के सही संथाली (Ol Chiki) शब्दों से रेखा खींचकर मिलाएँ।',
      instructionsSanthali: 'ᱟᱹᱫᱮᱥ: ᱞᱮᱸᱜᱟ ᱯᱟᱦᱴᱟ ᱨᱮᱭᱟᱜ ᱥᱟᱵᱟᱫ ᱠᱚ ᱡᱚᱡᱚᱢ ᱯᱟᱦᱴᱟ ᱨᱮᱭᱟᱜ ᱥᱟᱹᱨᱤ ᱚᱞ ᱪᱤᱠᱤ ᱥᱟᱵᱟᱫ ᱥᱟᱞᱟᱜ ᱛᱚᱞ ᱢᱮ ᱾',
      questions,
      createdAt: Date.now(),
    };

    this.saveWorksheet(worksheet);
    return worksheet;
  }

  private generateLanguageQuestions(count: number): WorksheetQuestion[] {
    const pool = [
      { h: 'हाथी', s: 'ᱦᱟᱹᱛᱤ', r: 'Hati', icon: '🐘' },
      { h: 'बाघ', s: 'ᱛᱟᱹᱨᱩᱵ', r: 'Tarub', icon: '🐅' },
      { h: 'आम', s: 'ᱩᱞ', r: 'Ul', icon: '🥭' },
      { h: 'मोर', s: 'ᱢᱟᱨᱟᱜ', r: 'Marag', icon: '🦚' },
      { h: 'किताब', s: 'ᱯᱩᱛᱷᱤ', r: 'Puthi', icon: '📖' },
      { h: 'बकरी', s: 'ᱢᱮᱨᱚᱢ', r: 'Merom', icon: '🐐' },
      { h: 'चिड़िया', s: 'ᱪᱮᱬᱮ', r: 'Chene', icon: '🐦' },
      { h: 'पेड़', s: 'ᱫᱟᱨᱮ', r: 'Dare', icon: '🌳' },
    ];

    return pool.slice(0, count).map((item, idx) => ({
      id: `q-${idx + 1}`,
      questionNumber: idx + 1,
      promptHindi: `"${item.h}" का संथाली रूप पहचानें`,
      promptSanthali: `"${item.h}" ᱨᱮᱭᱟᱜ ᱥᱟᱱᱛᱟᱲᱤ ᱨᱩᱯ ᱪᱤᱱᱦᱟᱹᱣ ᱢᱮ`,
      type: 'matching',
      leftItem: { textHindi: item.h, textSanthali: item.r, icon: item.icon },
      rightItem: { textHindi: item.h, textSanthali: item.s },
      answerGuide: `${item.h} = ${item.s} (${item.r})`,
    }));
  }

  private generateMathQuestions(count: number): WorksheetQuestion[] {
    const numWords = [
      { h: '1 (एक)', s: '᱑ (ᱢᱤᱫ)', r: 'Mid' },
      { h: '2 (दो)', s: '᱒ (ᱵᱟᱨ)', r: 'Bar' },
      { h: '3 (तीन)', s: '᱓ (ᱯᱮ)', r: 'Pe' },
      { h: '4 (चार)', s: '᱔ (ᱯᱩᱱ)', r: 'Pun' },
      { h: '5 (पाँच)', s: '᱕ (ᱢᱚᱬᱮ)', r: 'Mone' },
      { h: '6 (छह)', s: '᱖ (ᱛᱩᱨᱩᱭ)', r: 'Turuy' },
    ];

    return numWords.slice(0, count).map((item, idx) => ({
      id: `qm-${idx + 1}`,
      questionNumber: idx + 1,
      promptHindi: `गिनती मिलाएँ: ${item.h}`,
      promptSanthali: `ᱮᱞ ᱛᱚᱞ ᱢᱮ: ${item.s}`,
      type: 'counting',
      leftItem: { textHindi: item.h, textSanthali: item.r },
      rightItem: { textHindi: item.h, textSanthali: item.s },
      answerGuide: `${item.h} = ${item.s}`,
    }));
  }

  private generateEvsQuestions(count: number): WorksheetQuestion[] {
    const evsItems = [
      { h: 'साल / सखुआ का पेड़', s: 'ᱥᱟᱨᱡᱚᱢ ᱫᱟᱨᱮ', r: 'Sarjom dare', icon: '🌲' },
      { h: 'महुआ का फूल', s: 'ᱢᱟᱹᱛᱠᱚᱢ ᱵᱟᱦᱟ', r: 'Matkom baha', icon: '🌸' },
      { h: 'पलाश का फूल', s: 'ᱢᱩᱨᱩᱫ ᱵᱟᱦᱟ', r: 'Murud baha', icon: '🌺' },
      { h: 'नदी का जल', s: 'ᱜᱟᱰᱟ ᱫᱟᱜ', r: 'Gada dag', icon: '💧' },
      { h: 'पहाड़', s: 'ᱵᱩᱨᱩ', r: 'Buru', icon: '⛰️' },
    ];

    return evsItems.slice(0, count).map((item, idx) => ({
      id: `qevs-${idx + 1}`,
      questionNumber: idx + 1,
      promptHindi: `प्रकृति मिलान: ${item.h}`,
      promptSanthali: `ᱥᱤᱨᱡᱚᱱ ᱛᱚᱞ ᱢᱮ: ${item.s}`,
      type: 'matching',
      leftItem: { textHindi: item.h, textSanthali: item.r, icon: item.icon },
      rightItem: { textHindi: item.h, textSanthali: item.s },
      answerGuide: `${item.h} = ${item.s}`,
    }));
  }

  public getSavedWorksheets(): GeneratedWorksheet[] {
    if (typeof window === 'undefined') return [];
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch {
      // ignore
    }
    return [];
  }

  public saveWorksheet(worksheet: GeneratedWorksheet) {
    if (typeof window === 'undefined') return;
    try {
      const existing = this.getSavedWorksheets();
      const updated = [worksheet, ...existing.filter((w) => w.id !== worksheet.id)].slice(0, 20);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // ignore
    }
  }
}

export const worksheetService = new WorksheetService();
export default worksheetService;
