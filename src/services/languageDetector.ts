export type DetectedLanguageType =
  | 'hindi'
  | 'santhali'
  | 'english'
  | 'roman_hindi'
  | 'roman_santhali';

export interface DetectedLanguageResult {
  language: DetectedLanguageType;
  script: 'Devanagari' | 'Ol Chiki' | 'Latin';
  confidence: number;
  normalizedText: string;
  transliteratedText?: string;
}

// Ol Chiki phoneme mapping table
const ROMAN_TO_OL_CHIKI_MAP: Record<string, string> = {
  // Vowels
  a: 'ᱚ',
  aa: 'ᱟ',
  i: 'ᱤ',
  u: 'ᱩ',
  e: 'ᱮ',
  o: 'ᱳ',

  // Consonants
  t: 'ᱛ',
  g: 'ᱜ',
  ng: 'ᱝ',
  l: 'ᱞ',
  k: 'ᱠ',
  j: 'ᱡ',
  m: 'ᱢ',
  w: 'ᱣ',
  s: 'ᱥ',
  h: 'ᱦ',
  ny: 'ᱧ',
  r: 'ᱨ',
  ch: 'ᱪ',
  d: 'ᱫ',
  n: 'ᱱ',
  p: 'ᱯ',
  b: 'ᱵ',
  y: 'ᱭ',
};

// Common Roman Hindi word map for fast classroom transliteration
const ROMAN_HINDI_DICTIONARY: Record<string, string> = {
  namaste: 'नमस्ते',
  namaskar: 'नमस्कार',
  suprabhat: 'सुप्रभात',
  dhanyawad: 'धन्यवाद',
  dhanyavad: 'धन्यवाद',
  shukriya: 'शुक्रिया',
  aap: 'आप',
  kaise: 'कैसे',
  kaisa: 'कैसा',
  kaisi: 'कैसी',
  ho: 'हो',
  hain: 'हैं',
  hai: 'है',
  theek: 'ठीक',
  kitab: 'किताब',
  pustak: 'पुस्तक',
  padho: 'पढ़ो',
  likho: 'लिखो',
  kholo: 'खोलो',
  baith: 'बैठ',
  jao: 'जाओ',
  khade: 'खड़े',
  shant: 'शांत',
  raho: 'रहो',
  pani: 'पानी',
  khel: 'खेल',
  bacho: 'बच्चों',
  bachon: 'बच्चों',
  shikshak: 'शिक्षक',
  sir: 'सर',
  madam: 'मैडम',
  kya: 'क्या',
  kyun: 'क्यों',
  kahan: 'कहाँ',
  kab: 'कब',
  kaun: 'कौन',
  ek: 'एक',
  do: 'दो',
  teen: 'तीन',
  char: 'चार',
  paanch: 'पाँच',
  chhah: 'छह',
  saat: 'सात',
  aath: 'आठ',
  nau: 'नौ',
  das: 'दस',
  aam: 'आम',
  kela: 'केला',
  hathi: 'हाथी',
  bagh: 'बाघ',
  mor: 'मोर',
  chirya: 'चिड़िया',
  chidiya: 'चिड़िया',
  school: 'स्कूल',
  ghar: 'घर',
  gaon: 'गाँव',
  johar: 'जोहार',
};

// Common Roman Santali words for recognition and mapping
const ROMAN_SANTALI_WORDS = new Set([
  'johar',
  'sagun',
  'setag',
  'tikin',
  'sarhaw',
  'ched',
  'leka',
  'menag',
  'bina',
  'menanja',
  'inj',
  'ale',
  'abowag',
  'durub',
  'tingun',
  'khata',
  'jhij',
  'puthi',
  'parhaw',
  'nonde',
  'ol',
  'bay',
  'te',
  'mid',
  'sawte',
  'ror',
  'thir',
  'tahen',
  'hati',
  'tarub',
  'merom',
  'dangra',
  'chene',
  'seta',
  'pusi',
  'marag',
  'ul',
  'kayra',
  'matkom',
  'bel',
  'kud',
  'asra',
  'machet',
  'gidra',
  'sakam',
  'dare',
  'dag',
  'seled',
  'bhegar',
]);

class LanguageDetector {
  /**
   * Detects the language and script of input text.
   */
  public detectLanguage(rawText: string): DetectedLanguageResult {
    const text = rawText.trim();
    if (!text) {
      return {
        language: 'hindi',
        script: 'Devanagari',
        confidence: 1.0,
        normalizedText: '',
      };
    }

    // 1. Check for Devanagari script (U+0900 to U+097F)
    const devanagariCount = (text.match(/[\u0900-\u097F]/g) || []).length;
    // 2. Check for Ol Chiki script (U+1C50 to U+1C7F)
    const olChikiCount = (text.match(/[\u1C50-\u1C7F]/g) || []).length;

    const totalChars = text.replace(/\s+/g, '').length || 1;

    if (olChikiCount / totalChars > 0.3) {
      return {
        language: 'santhali',
        script: 'Ol Chiki',
        confidence: 0.98,
        normalizedText: text,
      };
    }

    if (devanagariCount / totalChars > 0.3) {
      return {
        language: 'hindi',
        script: 'Devanagari',
        confidence: 0.98,
        normalizedText: text,
      };
    }

    // 3. Text is in Latin/Roman script. Differentiate English vs Roman Hindi vs Roman Santali
    const words = text
      .toLowerCase()
      .replace(/[.,!?।॥"']/g, '')
      .split(/\s+/)
      .filter(Boolean);

    let santaliScore = 0;
    let romanHindiScore = 0;

    for (const w of words) {
      if (ROMAN_SANTALI_WORDS.has(w)) {
        santaliScore++;
      }
      if (ROMAN_HINDI_DICTIONARY[w]) {
        romanHindiScore++;
      }
    }

    if (santaliScore > 0 && santaliScore >= romanHindiScore) {
      const transliterated = this.romanSantaliToOlChiki(text);
      return {
        language: 'roman_santhali',
        script: 'Latin',
        confidence: 0.85,
        normalizedText: text,
        transliteratedText: transliterated,
      };
    }

    if (romanHindiScore > 0 && romanHindiScore > santaliScore) {
      const transliterated = this.romanHindiToDevanagari(text);
      return {
        language: 'roman_hindi',
        script: 'Latin',
        confidence: 0.88,
        normalizedText: text,
        transliteratedText: transliterated,
      };
    }

    // Default to English if Latin and no distinct tribal/Hindi tokens
    return {
      language: 'english',
      script: 'Latin',
      confidence: 0.82,
      normalizedText: text,
    };
  }

  /**
   * Converts Roman Hindi into proper Devanagari script.
   */
  public romanHindiToDevanagari(text: string): string {
    const tokens = text.split(/(\s+|[,.!?।॥])/);
    return tokens
      .map((tok) => {
        const lower = tok.toLowerCase().trim();
        if (ROMAN_HINDI_DICTIONARY[lower]) {
          return ROMAN_HINDI_DICTIONARY[lower];
        }
        return tok;
      })
      .join('');
  }

  /**
   * Converts Roman Santali into Ol Chiki script characters where possible.
   */
  public romanSantaliToOlChiki(text: string): string {
    // Check whole-word / dictionary terms first
    const knownTerms: Record<string, string> = {
      johar: 'ᱡᱚᱦᱟᱨ',
      sarhaw: 'ᱥᱟᱨᱦᱟᱣ',
      hati: 'ᱦᱟᱹᱛᱤ',
      tarub: 'ᱛᱟᱹᱨᱩᱵ',
      merom: 'ᱢᱮᱨᱚᱢ',
      ul: 'ᱩᱞ',
      matkom: 'ᱢᱟᱹᱛᱠᱚᱢ',
      chene: 'ᱪᱮᱬᱮ',
      marag: 'ᱢᱟᱨᱟᱜ',
      puthi: 'ᱯᱩᱛᱷᱤ',
      asra: 'ᱟᱥᱲᱟ',
      machet: 'ᱢᱟᱪᱮᱛ',
      gidra: 'ᱜᱤᱫᱽᱨᱟᱹ',
      dare: 'ᱫᱟᱨᱮ',
      dag: 'ᱫᱟᱜ',
      mid: 'ᱢᱤᱫ',
      bar: 'ᱵᱟᱨ',
      pe: 'ᱯᱮ',
      pun: 'ᱯᱩᱱ',
      mone: 'ᱢᱚᱬᱮ',
      turuy: 'ᱛᱩᱨᱩᱭ',
      eyay: 'ᱮᱭᱟᱭ',
      iral: 'ᱤᱨᱟᱹᱞ',
      are: 'ᱟᱨᱮ',
      gel: 'ᱜᱮᱞ',
    };

    const tokens = text.split(/(\s+|[,.!?])/);
    return tokens
      .map((tok) => {
        const lower = tok.toLowerCase().trim();
        if (knownTerms[lower]) {
          return knownTerms[lower];
        }

        // Letter-by-letter fallback mapping
        let mapped = '';
        let i = 0;
        while (i < lower.length) {
          const twoChar = lower.slice(i, i + 2);
          if (ROMAN_TO_OL_CHIKI_MAP[twoChar]) {
            mapped += ROMAN_TO_OL_CHIKI_MAP[twoChar];
            i += 2;
          } else if (ROMAN_TO_OL_CHIKI_MAP[lower[i]]) {
            mapped += ROMAN_TO_OL_CHIKI_MAP[lower[i]];
            i++;
          } else {
            mapped += lower[i];
            i++;
          }
        }
        return mapped || tok;
      })
      .join('');
  }
}

export const languageDetector = new LanguageDetector();
export default languageDetector;
