import type { DictionaryEntry, LanguageCode, TranslationHistoryItem, TranslationResult } from '../types/translation';
import { languageDetector } from './languageDetector';

// Rich Trilingual Offline MTB-MLE Dictionary (Hindi, Santali Ol Chiki, English, Mundari)
export const BILINGUAL_DICTIONARY: DictionaryEntry[] = [
  // Greetings
  { hindi: 'नमस्ते', santhali: 'ᱡᱚᱦᱟᱨ', roman: 'Johar', english: 'Hello', mundari: 'ᱡᱚᱦᱟᱨ', category: 'greetings' },
  { hindi: 'जोहार', santhali: 'ᱡᱚᱦᱟᱨ', roman: 'Johar', english: 'Greetings', mundari: 'ᱡᱚᱦᱟᱨ', category: 'greetings' },
  { hindi: 'सुप्रभात', santhali: 'ᱥᱟᱹᱜᱩᱱ ᱥᱮᱛᱟᱜ', roman: 'Sagun setag', english: 'Good Morning', mundari: 'ᱥᱟᱹᱜᱩᱱ ᱥᱮᱛᱟᱜ', category: 'greetings' },
  { hindi: 'शुभ संध्या', santhali: 'ᱥᱟᱹᱜᱩᱱ ᱛᱤᱠᱤᱱ', roman: 'Sagun tikin', english: 'Good Evening', mundari: 'ᱥᱟᱹᱜᱩᱱ ᱟᱹᱭᱩᱵ', category: 'greetings' },
  { hindi: 'धन्यवाद', santhali: 'ᱥᱟᱨᱦᱟᱣ', roman: 'Sarhaw', english: 'Thank You', mundari: 'ᱥᱟᱨᱦᱟᱣ', category: 'greetings' },
  { hindi: 'आप कैसे हैं?', santhali: 'ᱪᱮᱫ ᱞᱮᱠᱟ ᱢᱮᱱᱟᱜ ᱵᱤᱱᱟ?', roman: 'Ched leka menag bina?', english: 'How are you?', mundari: 'ᱪᱤᱞᱠᱟᱹ ᱢᱮᱱᱟᱢᱟ?', category: 'greetings' },
  { hindi: 'मैं ठीक हूँ', santhali: 'ᱤᱧ ᱫᱚ ᱵᱷᱟᱹᱜᱤ ᱜᱮ ᱢᱤᱱᱟᱹᱧᱟ', roman: 'Inj do bhagi ge minanja', english: 'I am fine', mundari: 'ᱟᱹᱧ ᱵᱮᱥ ᱜᱮ ᱢᱤᱱᱟᱹᱧᱟ', category: 'greetings' },

  // Classroom Commands
  { hindi: 'बैठ जाओ', santhali: 'ᱫᱩᱲᱩᱵ ᱢᱮ', roman: 'Durub me', english: 'Sit down', mundari: 'ᱫᱩᱵᱩ ᱢᱮ', category: 'commands' },
  { hindi: 'खड़े हो जाओ', santhali: 'ᱛᱤᱸᱜᱩᱱ ᱢᱮ', roman: 'Tingun me', english: 'Stand up', mundari: 'ᱛᱤᱝᱜᱩ ᱢᱮ', category: 'commands' },
  { hindi: 'कॉपी खोलो', santhali: 'ᱠᱷᱟᱛᱟ ᱡᱷᱤᱡᱽ ᱢᱮ', roman: 'Khata jhij me', english: 'Open notebook', mundari: 'ᱠᱷᱟᱛᱟ ᱡᱷᱤᱡᱽ ᱢᱮ', category: 'commands' },
  { hindi: 'किताब पढ़ो', santhali: 'ᱯᱩᱛᱷᱤ ᱯᱟᱲᱦᱟᱣ ᱢᱮ', roman: 'Puthi parhaw me', english: 'Read the book', mundari: 'ᱯᱩᱛᱷᱤ ᱯᱟᱲᱦᱟᱣ ᱢᱮ', category: 'commands' },
  { hindi: 'यहाँ लिखो', santhali: 'ᱱᱚᱸᱰᱮ ᱚᱞ ᱢᱮ', roman: 'Nonde ol me', english: 'Write here', mundari: 'ᱱᱮᱛᱟ ᱚᱞ ᱢᱮ', category: 'commands' },
  { hindi: 'धीरे पढ़ो', santhali: 'ᱵᱟᱹᱭ ᱵᱟᱹᱭ ᱛᱮ ᱯᱟᱲᱦᱟᱣ ᱢᱮ', roman: 'Bay bay te parhaw me', english: 'Read slowly', mundari: 'ᱵᱟᱹᱭ ᱵᱟᱹᱭ ᱛᱮ ᱯᱟᱲᱦᱟᱣ ᱢᱮ', category: 'commands' },
  { hindi: 'साथ मिलकर बोलो', santhali: 'ᱢᱤᱫ ᱥᱟᱶᱛᱮ ᱨᱚᱲ ᱯᱮ', roman: 'Mid sawte ror pe', english: 'Speak together', mundari: 'ᱢᱤᱫ ᱥᱟᱶᱛᱮ ᱠᱟᱡᱤ ᱯᱮ', category: 'commands' },
  { hindi: 'शांत रहो', santhali: 'ᱛᱷᱤᱨ ᱛᱟᱦᱮᱸᱱ ᱢᱮ', roman: 'Thir tahen me', english: 'Keep quiet', mundari: 'ᱛᱷᱤᱨ ᱛᱟᱭᱤᱱ ᱢᱮ', category: 'commands' },
  { hindi: 'ताली बजाओ', santhali: 'ᱛᱟᱹᱲᱤ ᱢᱮ', roman: 'Tari me', english: 'Clap hands', mundari: 'ᱛᱟᱹᱲᱤ ᱢᱮ', category: 'commands' },

  // Animals
  { hindi: 'हाथी', santhali: 'ᱦᱟᱹᱛᱤ', roman: 'Hati', english: 'Elephant', mundari: 'ᱦᱟᱹᱛᱤ', category: 'animals' },
  { hindi: 'बाघ', santhali: 'ᱛᱟᱹᱨᱩᱵ', roman: 'Tarub', english: 'Tiger', mundari: 'ᱠᱩᱞ', category: 'animals' },
  { hindi: 'गाय', santhali: 'ᱰᱟᱝᱜᱽᱨᱟ', roman: 'Dangra', english: 'Cow', mundari: 'ᱩᱨᱤᱜ', category: 'animals' },
  { hindi: 'बकरी', santhali: 'ᱢᱮᱨᱚᱢ', roman: 'Merom', english: 'Goat', mundari: 'ᱢᱮᱨᱚᱢ', category: 'animals' },
  { hindi: 'चिड़िया', santhali: 'ᱪᱮᱬᱮ', roman: 'Chene', english: 'Bird', mundari: 'ᱪᱮᱬᱮ', category: 'animals' },
  { hindi: 'कुत्ता', santhali: 'ᱥᱮᱛᱟ', roman: 'Seta', english: 'Dog', mundari: 'ᱥᱮᱛᱟ', category: 'animals' },
  { hindi: 'बिल्ली', santhali: 'ᱯᱩᱥᱤ', roman: 'Pusi', english: 'Cat', mundari: 'ᱯᱩᱥᱤ', category: 'animals' },
  { hindi: 'मोर', santhali: 'ᱢᱟᱨᱟᱜ', roman: 'Marag', english: 'Peacock', mundari: 'ᱢᱟᱨᱟᱜ', category: 'animals' },
  { hindi: 'हिरण', santhali: 'ᱡᱤᱞ', roman: 'Jil', english: 'Deer', mundari: 'ᱡᱤᱞ', category: 'animals' },
  { hindi: 'भालू', santhali: 'ᱵᱟᱱᱟ', roman: 'Bana', english: 'Bear', mundari: 'ᱵᱟᱱᱟ', category: 'animals' },

  // Fruits & Nature
  { hindi: 'आम', santhali: 'ᱩᱞ', roman: 'Ul', english: 'Mango', mundari: 'ᱩᱞ', category: 'fruits' },
  { hindi: 'केला', santhali: 'ᱠᱟᱭᱨᱟ', roman: 'Kayra', english: 'Banana', mundari: 'ᱠᱟᱫᱚᱞ', category: 'fruits' },
  { hindi: 'अमरूद', santhali: 'ᱵᱮᱞ', roman: 'Bel', english: 'Guava', mundari: 'ᱵᱮᱞ', category: 'fruits' },
  { hindi: 'जामुन', santhali: 'ᱠᱩᱫᱽ', roman: 'Kud', english: 'Blackberry', mundari: 'ᱠᱩᱫᱽ', category: 'fruits' },
  { hindi: 'महुआ', santhali: 'ᱢᱟᱹᱛᱠᱚᱢ', roman: 'Matkom', english: 'Mahua', mundari: 'ᱢᱟᱹᱫᱩᱠᱚᱢ', category: 'fruits' },
  { hindi: 'पेड़', santhali: 'ᱫᱟᱨᱮ', roman: 'Dare', english: 'Tree', mundari: 'ᱫᱟᱨᱩ', category: 'classroom' },
  { hindi: 'पत्ता', santhali: 'ᱥᱟᱠᱟᱢ', roman: 'Sakam', english: 'Leaf', mundari: 'ᱥᱟᱠᱟᱢ', category: 'classroom' },
  { hindi: 'पानी', santhali: 'ᱫᱟᱜ', roman: 'Dag', english: 'Water', mundari: 'ᱫᱟᱜ', category: 'classroom' },
  { hindi: 'फूल', santhali: 'ᱵᱟᱦᱟ', roman: 'Baha', english: 'Flower', mundari: 'ᱵᱟᱦᱟ', category: 'fruits' },

  // Numbers
  { hindi: 'एक', santhali: 'ᱢᱤᱫ', roman: 'Mid', english: 'One', mundari: 'ᱢᱤᱭᱟᱹᱫ', category: 'numbers' },
  { hindi: 'दो', santhali: 'ᱵᱟᱨ', roman: 'Bar', english: 'Two', mundari: 'ᱵᱟᱨᱤᱭᱟ', category: 'numbers' },
  { hindi: 'तीन', santhali: 'ᱯᱮ', roman: 'Pe', english: 'Three', mundari: 'ᱟᱯᱤᱭᱟ', category: 'numbers' },
  { hindi: 'चार', santhali: 'ᱯᱩᱱ', roman: 'Pun', english: 'Four', mundari: 'ᱩᱯᱩᱱᱤᱭᱟ', category: 'numbers' },
  { hindi: 'पाँच', santhali: 'ᱢᱚᱬᱮ', roman: 'Mone', english: 'Five', mundari: 'ᱢᱚᱬᱮᱭᱟ', category: 'numbers' },
  { hindi: 'छह', santhali: 'ᱛᱩᱨᱩᱭ', roman: 'Turuy', english: 'Six', mundari: 'ᱛᱩᱨᱩᱭᱟ', category: 'numbers' },
  { hindi: 'सात', santhali: 'ᱮᱭᱟᱭ', roman: 'Eyay', english: 'Seven', mundari: 'ᱮᱭᱟᱭ', category: 'numbers' },
  { hindi: 'आठ', santhali: 'ᱤᱨᱟᱹᱞ', roman: 'Iral', english: 'Eight', mundari: 'ᱤᱨᱟᱹᱞ', category: 'numbers' },
  { hindi: 'नौ', santhali: 'ᱟᱨᱮ', roman: 'Are', english: 'Nine', mundari: 'ᱟᱨᱮᱭᱟ', category: 'numbers' },
  { hindi: 'दस', santhali: 'ᱜᱮᱞ', roman: 'Gel', english: 'Ten', mundari: 'ᱜᱮᱞᱮᱭᱟ', category: 'numbers' },

  // Classroom Objects & School
  { hindi: 'कलम', santhali: 'ᱠᱚᱞᱚᱢ', roman: 'Kolom', english: 'Pen', mundari: 'ᱠᱚᱞᱚᱢ', category: 'classroom' },
  { hindi: 'किताब', santhali: 'ᱯᱩᱛᱷᱤ', roman: 'Puthi', english: 'Book', mundari: 'ᱯᱩᱛᱷᱤ', category: 'classroom' },
  { hindi: 'स्कूल', santhali: 'ᱟᱥᱲᱟ', roman: 'Asra', english: 'School', mundari: 'ᱟᱥᱲᱟ', category: 'classroom' },
  { hindi: 'शिक्षक', santhali: 'ᱢᱟᱪᱮᱛ', roman: 'Machet', english: 'Teacher', mundari: 'ᱢᱟᱪᱮᱛ', category: 'classroom' },
  { hindi: 'बच्चे', santhali: 'ᱜᱤᱫᱽᱨᱟᱹ', roman: 'Gidra', english: 'Children', mundari: 'ᱦᱚᱯᱚᱱ', category: 'classroom' },
  { hindi: 'दोस्त', santhali: 'ᱜᱟᱛᱮ', roman: 'Gate', english: 'Friend', mundari: 'ᱜᱟᱛᱮ', category: 'classroom' },
  { hindi: 'घर', santhali: 'ᱚᱲᱟᱜ', roman: 'Orag', english: 'Home', mundari: 'ᱚᱲᱟᱜ', category: 'classroom' },
  { hindi: 'गाँव', santhali: 'ᱟᱹᱛᱩ', roman: 'Atu', english: 'Village', mundari: 'ᱦᱟᱹᱛᱩ', category: 'classroom' },
];

const HISTORY_STORAGE_KEY = 'bhashabridge_translation_history';

class TranslationService {
  private history: TranslationHistoryItem[] = [];

  constructor() {
    this.loadHistory();
  }

  private loadHistory() {
    try {
      const saved = localStorage.getItem(HISTORY_STORAGE_KEY);
      if (saved) {
        this.history = JSON.parse(saved);
      }
    } catch {
      this.history = [];
    }
  }

  /**
   * Pre-processes and normalizes input text.
   * Transliterates Roman Hindi to Devanagari and Roman Santali to Ol Chiki.
   */
  public normalizeInput(text: string, from: LanguageCode): { normalizedText: string; effectiveLang: LanguageCode } {
    const clean = text.trim();
    if (!clean) return { normalizedText: '', effectiveLang: from };

    const detected = languageDetector.detectLanguage(clean);

    if (from === 'hindi' && detected.language === 'roman_hindi' && detected.transliteratedText) {
      return { normalizedText: detected.transliteratedText, effectiveLang: 'hindi' };
    }

    if (from === 'santhali' && detected.language === 'roman_santhali' && detected.transliteratedText) {
      return { normalizedText: detected.transliteratedText, effectiveLang: 'santhali' };
    }

    return { normalizedText: clean, effectiveLang: from };
  }

  /**
   * Synchronous / Instant offline multilingual translation.
   * Supported: Hindi ↔ Santali, Hindi ↔ English, English ↔ Santali.
   */
  public translateText(
    rawText: string,
    from: LanguageCode = 'hindi',
    to: LanguageCode = 'santhali'
  ): TranslationResult {
    const { normalizedText: cleanText } = this.normalizeInput(rawText, from);

    if (!cleanText) {
      return {
        id: Date.now().toString(),
        sourceText: '',
        sourceLang: from,
        targetLang: to,
        translatedText: '',
        romanPronunciation: '',
        confidence: 1.0,
        timestamp: Date.now(),
      };
    }

    // 1. Direct match in Trilingual Dictionary
    const directMatch = BILINGUAL_DICTIONARY.find((item) => {
      if (from === 'hindi') return item.hindi === cleanText;
      if (from === 'english') return item.english?.toLowerCase() === cleanText.toLowerCase();
      if (from === 'santhali') {
        return item.santhali === cleanText || item.roman.toLowerCase() === cleanText.toLowerCase();
      }
      if (from === 'roman_santhali') return item.roman.toLowerCase() === cleanText.toLowerCase();
      if (from === 'mundari') return item.mundari === cleanText;
      return false;
    });

    if (directMatch) {
      const translated = this.resolveOutput(directMatch, to);
      const res: TranslationResult = {
        id: Date.now().toString(),
        sourceText: cleanText,
        sourceLang: from,
        targetLang: to,
        translatedText: translated.text,
        romanPronunciation: translated.roman,
        hindiMeaning: directMatch.hindi,
        englishMeaning: directMatch.english,
        confidence: 0.99,
        timestamp: Date.now(),
      };
      this.saveHistory(res);
      return res;
    }

    // 2. Word-by-word tokenized translation fallback
    const words = cleanText.split(/(\s+|[,.!?।॥])/);
    const translatedTokens: string[] = [];
    const romanTokens: string[] = [];
    let matchedCount = 0;

    for (const token of words) {
      if (!token.trim() || /^[,.!?।॥\s]+$/.test(token)) {
        translatedTokens.push(token);
        romanTokens.push(token);
        continue;
      }

      const match = BILINGUAL_DICTIONARY.find((item) => {
        if (from === 'hindi') return item.hindi.toLowerCase() === token.toLowerCase();
        if (from === 'english') return item.english?.toLowerCase() === token.toLowerCase();
        if (from === 'santhali') {
          return item.santhali === token || item.roman.toLowerCase() === token.toLowerCase();
        }
        if (from === 'roman_santhali') return item.roman.toLowerCase() === token.toLowerCase();
        if (from === 'mundari') return item.mundari === token;
        return false;
      });

      if (match) {
        matchedCount++;
        const resolved = this.resolveOutput(match, to);
        translatedTokens.push(resolved.text);
        romanTokens.push(resolved.roman);
      } else {
        translatedTokens.push(token);
        romanTokens.push(token);
      }
    }

    const translatedText = translatedTokens.join('');
    const romanPronunciation = romanTokens.join('');

    // If completely unmatched in offline mode, ensure we return meaningful transliterated or bridged text
    let finalText = translatedText;
    if (matchedCount === 0) {
      if (to === 'santhali' && from === 'hindi') {
        finalText = languageDetector.romanSantaliToOlChiki(cleanText);
      } else if (to === 'hindi' && from === 'english') {
        finalText = languageDetector.romanHindiToDevanagari(cleanText);
      }
    }

    const res: TranslationResult = {
      id: Date.now().toString(),
      sourceText: cleanText,
      sourceLang: from,
      targetLang: to,
      translatedText: finalText,
      romanPronunciation: romanPronunciation || cleanText,
      confidence: matchedCount > 0 ? 0.88 : 0.65,
      timestamp: Date.now(),
    };

    this.saveHistory(res);
    return res;
  }

  private resolveOutput(entry: DictionaryEntry, to: LanguageCode): { text: string; roman: string } {
    switch (to) {
      case 'santhali':
        return { text: entry.santhali, roman: entry.roman };
      case 'roman_santhali':
        return { text: entry.roman, roman: entry.roman };
      case 'english':
        return { text: entry.english || entry.roman, roman: entry.english || entry.roman };
      case 'mundari':
        return { text: entry.mundari || entry.santhali, roman: entry.roman };
      case 'hindi':
      default:
        return { text: entry.hindi, roman: entry.roman };
    }
  }

  public swapLanguages(source: LanguageCode, target: LanguageCode): [LanguageCode, LanguageCode] {
    return [target, source];
  }

  public saveHistory(item: TranslationResult) {
    if (!item.sourceText || !item.translatedText) return;

    const historyItem: TranslationHistoryItem = {
      id: item.id,
      sourceText: item.sourceText,
      translatedText: item.translatedText,
      romanPronunciation: item.romanPronunciation,
      sourceLang: item.sourceLang,
      targetLang: item.targetLang,
      timestamp: item.timestamp,
      isFavorite: false,
    };

    // Keep last 15 unique translations
    this.history = [historyItem, ...this.history.filter((h) => h.sourceText !== item.sourceText)].slice(0, 15);

    try {
      localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(this.history));
    } catch {
      // ignore
    }
  }

  public getHistory(): TranslationHistoryItem[] {
    return this.history;
  }

  public clearHistory() {
    this.history = [];
    try {
      localStorage.removeItem(HISTORY_STORAGE_KEY);
    } catch {
      // ignore
    }
  }

  public toggleFavorite(id: string): TranslationHistoryItem[] {
    this.history = this.history.map((item) =>
      item.id === id ? { ...item, isFavorite: !item.isFavorite } : item
    );
    try {
      localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(this.history));
    } catch {
      // ignore
    }
    return this.history;
  }

  public getFavorites(): TranslationHistoryItem[] {
    return this.history.filter((item) => item.isFavorite);
  }
}

export const translationService = new TranslationService();
export default translationService;
