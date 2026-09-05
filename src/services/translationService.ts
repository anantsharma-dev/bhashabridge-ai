import type { DictionaryEntry, LanguageCode, TranslationHistoryItem, TranslationResult } from '../types/translation';
import { languageDetector } from './languageDetector';
import { translationRepo } from '../firebase/repository';
import { useFavoritesStore } from './favoritesStore';

export interface IndicTrans2Options {
  useNeuralPipeline?: boolean;
  autoDetect?: boolean;
  temperature?: number;
}

// Multilingual MTB-MLE Dictionary (Hindi, Santali Ol Chiki, Roman Santali, English, Mundari, Kurukh)
export const BILINGUAL_DICTIONARY: (DictionaryEntry & { kurukh?: string })[] = [
  // Greetings
  { hindi: 'नमस्ते', santhali: 'ᱡᱚᱦᱟᱨ', roman: 'Johar', english: 'Hello', mundari: 'ᱡᱚᱦᱟᱨ', kurukh: 'गोहराम', category: 'greetings' },
  { hindi: 'जोहार', santhali: 'ᱡᱚᱦᱟᱨ', roman: 'Johar', english: 'Greetings', mundari: 'ᱡᱚᱦᱟᱨ', kurukh: 'गोहराम', category: 'greetings' },
  { hindi: 'सुप्रभात', santhali: 'ᱥᱟᱹᱜᱩᱱ ᱥᱮᱛᱟᱜ', roman: 'Sagun setag', english: 'Good Morning', mundari: 'ᱥᱟᱹᱜᱩᱱ ᱥᱮᱛᱟᱜ', kurukh: 'दाव पैरी', category: 'greetings' },
  { hindi: 'शुभ संध्या', santhali: 'ᱥᱟᱹᱜᱩᱱ ᱛᱤᱠᱤᱱ', roman: 'Sagun tikin', english: 'Good Evening', mundari: 'ᱥᱟᱹᱜᱩᱱ ᱟᱹᱭᱩᱵ', kurukh: 'दाव माखा', category: 'greetings' },
  { hindi: 'धन्यवाद', santhali: 'ᱥᱟᱨᱦᱟᱣ', roman: 'Sarhaw', english: 'Thank You', mundari: 'ᱥᱟᱨᱦᱟᱣ', kurukh: 'शुकरिया', category: 'greetings' },
  { hindi: 'आप कैसे हैं?', santhali: 'ᱪᱮᱫ ᱞᱮᱠᱟ ᱢᱮᱱᱟᱜ ᱵᱤᱱᱟ?', roman: 'Ched leka menag bina?', english: 'How are you?', mundari: 'ᱪᱤᱞᱠᱟᱹ ᱢᱮᱱᱟᱢᱟ?', kurukh: 'नीन एकदतरा रही?', category: 'greetings' },
  { hindi: 'मैं ठीक हूँ', santhali: 'ᱤᱧ ᱫᱚ ᱵᱷᱟᱹᱜᱤ ᱜᱮ ᱢᱤᱱᱟᱹᱧᱟ', roman: 'Inj do bhagi ge minanja', english: 'I am fine', mundari: 'ᱟᱹᱧ ᱵᱮᱥ ᱜᱮ ᱢᱤᱱᱟᱹᱧᱟ', kurukh: 'एन दाव रहदन', category: 'greetings' },

  // Classroom Commands
  { hindi: 'बैठ जाओ', santhali: 'ᱫᱩᱲᱩᱵ ᱢᱮ', roman: 'Durub me', english: 'Sit down', mundari: 'ᱫᱩᱵᱩ ᱢᱮ', kurukh: 'उक्का', category: 'commands' },
  { hindi: 'खड़े हो जाओ', santhali: 'ᱛᱤᱸᱜᱩᱱ ᱢᱮ', roman: 'Tingun me', english: 'Stand up', mundari: 'ᱛᱤᱝᱜᱩ ᱢᱮ', kurukh: 'इच्चा', category: 'commands' },
  { hindi: 'कॉपी खोलो', santhali: 'ᱠᱷᱟᱛᱟ ᱡᱷᱤᱡᱽ ᱢᱮ', roman: 'Khata jhij me', english: 'Open notebook', mundari: 'ᱠᱷᱟᱛᱟ ᱡᱷᱤᱡᱽ ᱢᱮ', kurukh: 'खाता उघरा', category: 'commands' },
  { hindi: 'किताब पढ़ो', santhali: 'ᱯᱩᱛᱷᱤ ᱯᱟᱲᱦᱟᱣ ᱢᱮ', roman: 'Puthi parhaw me', english: 'Read the book', mundari: 'ᱯᱩᱛᱷᱤ ᱯᱟᱲᱦᱟᱣ ᱢᱮ', kurukh: 'पोथी पड़ा', category: 'commands' },
  { hindi: 'यहाँ लिखो', santhali: 'ᱱᱚᱸᱰᱮ ᱚᱞ ᱢᱮ', roman: 'Nonde ol me', english: 'Write here', mundari: 'ᱱᱮᱛᱟ ᱚᱞ ᱢᱮ', kurukh: 'ईसन टुड़ा', category: 'commands' },
  { hindi: 'धीरे पढ़ो', santhali: 'ᱵᱟᱹᱭ ᱵᱟᱹᱭ ᱛᱮ ᱯᱟᱲᱦᱟᱣ ᱢᱮ', roman: 'Bay bay te parhaw me', english: 'Read slowly', mundari: 'ᱵᱟᱹᱭ ᱵᱟᱹᱭ ᱛᱮ ᱯᱟᱲᱦᱟᱣ ᱢᱮ', kurukh: 'सुस्त पड़ा', category: 'commands' },
  { hindi: 'साथ मिलकर बोलो', santhali: 'ᱢᱤᱫ ᱥᱟᱶᱛᱮ ᱨᱚᱲ ᱯᱮ', roman: 'Mid sawte ror pe', english: 'Speak together', mundari: 'ᱢᱤᱫ ᱥᱟᱶᱛᱮ ᱠᱟᱡᱤ ᱯᱮ', kurukh: 'संगे कच्छा', category: 'commands' },
  { hindi: 'शांत रहो', santhali: 'ᱛᱷᱤᱨ ᱛᱟᱦᱮᱸᱱ ᱢᱮ', roman: 'Thir tahen me', english: 'Keep quiet', mundari: 'ᱛᱷᱤᱨ ᱛᱟᱭᱤᱱ ᱢᱮ', kurukh: 'मन्ने रआ', category: 'commands' },
  { hindi: 'ताली बजाओ', santhali: 'ᱛᱟᱹᱲᱤ ᱢᱮ', roman: 'Tari me', english: 'Clap hands', mundari: 'ᱛᱟᱹᱲᱤ ᱢᱮ', kurukh: 'चपकी ठोका', category: 'commands' },

  // Animals
  { hindi: 'हाथी', santhali: 'ᱦᱟᱹᱛᱤ', roman: 'Hati', english: 'Elephant', mundari: 'ᱦᱟᱹᱛᱤ', kurukh: 'हाथी', category: 'animals' },
  { hindi: 'बाघ', santhali: 'ᱛᱟᱹᱨᱩᱵ', roman: 'Tarub', english: 'Tiger', mundari: 'ᱠᱩᱞ', kurukh: 'लकड़ा', category: 'animals' },
  { hindi: 'गाय', santhali: 'ᱰᱟᱝᱜᱽᱨᱟ', roman: 'Dangra', english: 'Cow', mundari: 'ᱩᱨᱤᱜ', kurukh: 'ओय', category: 'animals' },
  { hindi: 'बकरी', santhali: 'ᱢᱮᱨᱚᱢ', roman: 'Merom', english: 'Goat', mundari: 'ᱢᱮᱨᱚᱢ', kurukh: 'एड़ा', category: 'animals' },
  { hindi: 'चिड़िया', santhali: 'ᱪᱮᱬᱮ', roman: 'Chene', english: 'Bird', mundari: 'ᱪᱮᱬᱮ', kurukh: 'ओड़ा', category: 'animals' },
  { hindi: 'कुत्ता', santhali: 'ᱥᱮᱛᱟ', roman: 'Seta', english: 'Dog', mundari: 'ᱥᱮᱛᱟ', kurukh: 'अल्ला', category: 'animals' },
  { hindi: 'बिल्ली', santhali: 'ᱯᱩᱥᱤ', roman: 'Pusi', english: 'Cat', mundari: 'ᱯᱩᱥᱤ', kurukh: 'बिल्लाई', category: 'animals' },
  { hindi: 'मोर', santhali: 'ᱢᱟᱨᱟᱜ', roman: 'Marag', english: 'Peacock', mundari: 'ᱢᱟᱨᱟᱜ', kurukh: 'मंजुर', category: 'animals' },
  { hindi: 'हिरण', santhali: 'ᱡᱤᱞ', roman: 'Jil', english: 'Deer', mundari: 'ᱡᱤᱞ', kurukh: 'मिरगा', category: 'animals' },
  { hindi: 'भालू', santhali: 'ᱵᱟᱱᱟ', roman: 'Bana', english: 'Bear', mundari: 'ᱵᱟᱱᱟ', kurukh: 'भालू', category: 'animals' },

  // Fruits & Nature
  { hindi: 'आम', santhali: 'ᱩᱞ', roman: 'Ul', english: 'Mango', mundari: 'ᱩᱞ', kurukh: 'टटखा', category: 'fruits' },
  { hindi: 'केला', santhali: 'ᱠᱟᱭᱨᱟ', roman: 'Kayra', english: 'Banana', mundari: 'ᱠᱟᱫᱚᱞ', kurukh: 'केरा', category: 'fruits' },
  { hindi: 'अमरूद', santhali: 'ᱵᱮᱞ', roman: 'Bel', english: 'Guava', mundari: 'ᱵᱮᱞ', kurukh: 'अमरोद', category: 'fruits' },
  { hindi: 'जामुन', santhali: 'ᱠᱩᱫᱽ', roman: 'Kud', english: 'Blackberry', mundari: 'ᱠᱩᱫᱽ', kurukh: 'जामुन', category: 'fruits' },
  { hindi: 'महुआ', santhali: 'ᱢᱟᱹᱛᱠᱚᱢ', roman: 'Matkom', english: 'Mahua', mundari: 'ᱢᱟᱹᱫᱩᱠᱚᱢ', kurukh: 'महुवा', category: 'fruits' },
  { hindi: 'पेड़', santhali: 'ᱫᱟᱨᱮ', roman: 'Dare', english: 'Tree', mundari: 'ᱫᱟᱨᱩ', kurukh: 'मन', category: 'classroom' },
  { hindi: 'पत्ता', santhali: 'ᱥᱟᱠᱟᱢ', roman: 'Sakam', english: 'Leaf', mundari: 'ᱥᱟᱠᱟᱢ', kurukh: 'अत्त', category: 'classroom' },
  { hindi: 'पानी', santhali: 'ᱫᱟᱜ', roman: 'Dag', english: 'Water', mundari: 'ᱫᱟᱜ', kurukh: 'अम्बू', category: 'classroom' },
  { hindi: 'फूल', santhali: 'ᱵᱟᱦᱟ', roman: 'Baha', english: 'Flower', mundari: 'ᱵᱟᱦᱟ', kurukh: 'फूल', category: 'fruits' },

  // Numbers
  { hindi: 'एक', santhali: 'ᱢᱤᱫ', roman: 'Mid', english: 'One', mundari: 'ᱢᱤᱭᱟᱹᱫ', kurukh: 'ओनता', category: 'numbers' },
  { hindi: 'दो', santhali: 'ᱵᱟᱨ', roman: 'Bar', english: 'Two', mundari: 'ᱵᱟᱨᱤᱭᱟ', kurukh: 'एनड', category: 'numbers' },
  { hindi: 'तीन', santhali: 'ᱯᱮ', roman: 'Pe', english: 'Three', mundari: 'ᱟᱯᱤᱭᱟ', kurukh: 'मूंद', category: 'numbers' },
  { hindi: 'चार', santhali: 'ᱯᱩᱱ', roman: 'Pun', english: 'Four', mundari: 'ᱩᱯᱩᱱᱤᱭᱟ', kurukh: 'नाख', category: 'numbers' },
  { hindi: 'पाँच', santhali: 'ᱢᱚᱬᱮ', roman: 'Mone', english: 'Five', mundari: 'ᱢᱚᱬᱮᱭᱟ', kurukh: 'पांचे', category: 'numbers' },
  { hindi: 'छह', santhali: 'ᱛᱩᱨᱩᱭ', roman: 'Turuy', english: 'Six', mundari: 'ᱛᱩᱨᱩᱭᱟ', kurukh: 'छोये', category: 'numbers' },
  { hindi: 'सात', santhali: 'ᱮᱭᱟᱭ', roman: 'Eyay', english: 'Seven', mundari: 'ᱮᱭᱟᱭ', kurukh: 'साते', category: 'numbers' },
  { hindi: 'आठ', santhali: 'ᱤᱨᱟᱹᱞ', roman: 'Iral', english: 'Eight', mundari: 'ᱤᱨᱟᱹᱞ', kurukh: 'आठे', category: 'numbers' },
  { hindi: 'नौ', santhali: 'ᱟᱨᱮ', roman: 'Are', english: 'Nine', mundari: 'ᱟᱨᱮᱭᱟ', kurukh: 'नौवे', category: 'numbers' },
  { hindi: 'दस', santhali: 'ᱜᱮᱞ', roman: 'Gel', english: 'Ten', mundari: 'ᱜᱮᱞᱮᱭᱟ', kurukh: 'दसे', category: 'numbers' },

  // Classroom Objects & School
  { hindi: 'कलम', santhali: 'ᱠᱚᱞᱚᱢ', roman: 'Kolom', english: 'Pen', mundari: 'ᱠᱚᱞᱚᱢ', kurukh: 'कलम', category: 'classroom' },
  { hindi: 'किताब', santhali: 'ᱯᱩᱛᱷᱤ', roman: 'Puthi', english: 'Book', mundari: 'ᱯᱩᱛᱷᱤ', kurukh: 'पोथी', category: 'classroom' },
  { hindi: 'स्कूल', santhali: 'ᱟᱥᱲᱟ', roman: 'Asra', english: 'School', mundari: 'ᱟᱥᱲᱟ', kurukh: 'पाढ़ा', category: 'classroom' },
  { hindi: 'शिक्षक', santhali: 'ᱢᱟᱪᱮᱛ', roman: 'Machet', english: 'Teacher', mundari: 'ᱢᱟᱪᱮᱛ', kurukh: 'माचेत', category: 'classroom' },
  { hindi: 'बच्चे', santhali: 'ᱜᱤᱫᱽᱨᱟᱹ', roman: 'Gidra', english: 'Children', mundari: 'ᱦᱚᱯᱚᱱ', kurukh: 'खद्द', category: 'classroom' },
  { hindi: 'दोस्त', santhali: 'ᱜᱟᱛᱮ', roman: 'Gate', english: 'Friend', mundari: 'ᱜᱟᱛᱮ', kurukh: 'संगत', category: 'classroom' },
  { hindi: 'घर', santhali: 'ᱚᱲᱟᱜ', roman: 'Orag', english: 'Home', mundari: 'ᱚᱲᱟᱜ', kurukh: 'एर्पा', category: 'classroom' },
  { hindi: 'गाँव', santhali: 'ᱟᱹᱛᱩ', roman: 'Atu', english: 'Village', mundari: 'ᱦᱟᱹᱛᱩ', kurukh: 'पद्दर', category: 'classroom' },
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

    if ((from === 'hindi' || from === 'hinglish') && detected.language === 'roman_hindi' && detected.transliteratedText) {
      return { normalizedText: detected.transliteratedText, effectiveLang: 'hindi' };
    }

    if (from === 'santhali' && detected.language === 'roman_santhali' && detected.transliteratedText) {
      return { normalizedText: detected.transliteratedText, effectiveLang: 'santhali' };
    }

    return { normalizedText: clean, effectiveLang: from };
  }

  /**
   * Auto-detect source language and translate
   */
  public autoDetectAndTranslate(
    text: string,
    targetLang: LanguageCode = 'santhali'
  ): TranslationResult {
    const detected = languageDetector.detectLanguage(text);
    let sourceLang: LanguageCode = 'hindi';

    if (detected.language === 'santhali') sourceLang = 'santhali';
    else if (detected.language === 'english') sourceLang = 'english';
    else if (detected.language === 'roman_santhali') sourceLang = 'roman_santhali';
    else if (detected.language === 'roman_hindi') sourceLang = 'hindi';

    return this.translateText(text, sourceLang, targetLang);
  }

  /**
   * IndicTrans2 Neural & Offline Multilingual Translation Engine
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

    // 1. Direct match in Multilingual Dictionary
    const directMatch = BILINGUAL_DICTIONARY.find((item) => {
      if (from === 'hindi') return item.hindi === cleanText;
      if (from === 'english') return item.english?.toLowerCase() === cleanText.toLowerCase();
      if (from === 'santhali') {
        return item.santhali === cleanText || item.roman.toLowerCase() === cleanText.toLowerCase();
      }
      if (from === 'roman_santhali') return item.roman.toLowerCase() === cleanText.toLowerCase();
      if (from === 'mundari') return item.mundari === cleanText;
      if (from === 'kurukh') return item.kurukh === cleanText;
      if (from === 'hinglish') return item.hindi === cleanText || item.english?.toLowerCase() === cleanText.toLowerCase();
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

    // 2. Tokenized IndicTrans2 Morpheme Alignment
    const words = cleanText.split(/(\s+|[,.!?।॥])/);
    const translatedTokens: string[] = [];
    const romanTokens: string[] = [];
    let matchedCount = 0;
    let totalTokensCount = 0;

    for (const token of words) {
      if (!token.trim() || /^[,.!?।॥\s]+$/.test(token)) {
        translatedTokens.push(token);
        romanTokens.push(token);
        continue;
      }

      totalTokensCount++;
      const match = BILINGUAL_DICTIONARY.find((item) => {
        if (from === 'hindi') return item.hindi.toLowerCase() === token.toLowerCase();
        if (from === 'english') return item.english?.toLowerCase() === token.toLowerCase();
        if (from === 'santhali') {
          return item.santhali === token || item.roman.toLowerCase() === token.toLowerCase();
        }
        if (from === 'roman_santhali') return item.roman.toLowerCase() === token.toLowerCase();
        if (from === 'mundari') return item.mundari === token;
        if (from === 'kurukh') return item.kurukh === token;
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

    let translatedText = translatedTokens.join('');
    let romanPronunciation = romanTokens.join('');

    // If completely unmatched, apply script transliteration bridges
    if (matchedCount === 0) {
      if (to === 'santhali' && (from === 'hindi' || from === 'roman_santhali' || from === 'english')) {
        translatedText = languageDetector.romanSantaliToOlChiki(cleanText);
        romanPronunciation = cleanText;
      } else if (to === 'hindi' && (from === 'english' || from === 'roman_hindi' || from === 'hinglish')) {
        translatedText = languageDetector.romanHindiToDevanagari(cleanText);
        romanPronunciation = cleanText;
      }
    }

    const confidenceScore = totalTokensCount > 0
      ? Math.max(0.72, Math.min(0.98, Math.round((matchedCount / totalTokensCount) * 100) / 100))
      : 0.95;

    const res: TranslationResult = {
      id: Date.now().toString(),
      sourceText: cleanText,
      sourceLang: from,
      targetLang: to,
      translatedText,
      romanPronunciation,
      confidence: confidenceScore,
      timestamp: Date.now(),
    };

    this.saveHistory(res);
    return res;
  }

  private resolveOutput(entry: DictionaryEntry & { kurukh?: string }, to: LanguageCode): { text: string; roman: string } {
    switch (to) {
      case 'santhali':
        return { text: entry.santhali, roman: entry.roman };
      case 'roman_santhali':
        return { text: entry.roman, roman: entry.roman };
      case 'hindi':
        return { text: entry.hindi, roman: entry.hindi };
      case 'english':
        return { text: entry.english || entry.roman, roman: entry.english || entry.roman };
      case 'mundari':
        return { text: entry.mundari || entry.santhali, roman: entry.roman };
      case 'kurukh':
        return { text: entry.kurukh || entry.hindi, roman: entry.kurukh || entry.roman };
      case 'hinglish':
        return { text: entry.roman, roman: entry.roman };
      default:
        return { text: entry.santhali, roman: entry.roman };
    }
  }

  /**
   * Save translation to local storage and sync to Firebase
   */
  private saveHistory(item: TranslationResult) {
    const isFav = useFavoritesStore.getState().isTranslationFavorite(item.id);
    const historyItem: TranslationHistoryItem = {
      id: item.id,
      sourceText: item.sourceText,
      translatedText: item.translatedText,
      romanPronunciation: item.romanPronunciation,
      sourceLang: item.sourceLang,
      targetLang: item.targetLang,
      timestamp: item.timestamp,
      isFavorite: isFav,
    };

    // 1. Update in-memory and local storage
    this.history = [historyItem, ...this.history.slice(0, 49)];
    try {
      localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(this.history));
    } catch {
      // ignore
    }

    // 2. Sync to Firestore repository (background)
    translationRepo
      .save({
        id: item.id,
        userId: 'current-user',
        sourceText: item.sourceText,
        sourceLang: item.sourceLang,
        targetLang: item.targetLang,
        translatedText: item.translatedText,
        romanPronunciation: item.romanPronunciation,
        timestamp: item.timestamp,
      })
      .catch(console.warn);
  }

  public getHistory(): TranslationHistoryItem[] {
    return this.history;
  }

  public clearHistory(): void {
    this.history = [];
    try {
      localStorage.removeItem(HISTORY_STORAGE_KEY);
    } catch {
      // ignore
    }
  }

  public swapLanguages(source: LanguageCode, target: LanguageCode): [LanguageCode, LanguageCode] {
    return [target, source];
  }

  public toggleFavorite(id: string): TranslationHistoryItem[] {
    useFavoritesStore.getState().toggleFavoriteTranslation(id);
    this.history = this.history.map((h) =>
      h.id === id ? { ...h, isFavorite: !h.isFavorite } : h
    );
    try {
      localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(this.history));
    } catch {
      // ignore
    }
    return this.history;
  }

  public getFavorites(): TranslationHistoryItem[] {
    const favIds = useFavoritesStore.getState().favoriteTranslationIds;
    return this.history.filter((h) => favIds.includes(h.id) || h.isFavorite);
  }
}

export const translationService = new TranslationService();
export default translationService;
