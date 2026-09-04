export type LanguageCode = 'hindi' | 'santhali' | 'english' | 'roman_santhali' | 'roman_hindi' | 'mundari';

export interface LanguageOption {
  code: LanguageCode;
  name: string;
  nativeName: string;
  script: string;
  description: string;
}

export const LANGUAGE_OPTIONS: LanguageOption[] = [
  { code: 'hindi', name: 'Hindi', nativeName: 'हिन्दी', script: 'Devanagari', description: 'मानक हिन्दी' },
  { code: 'santhali', name: 'Santhali', nativeName: 'ᱥᱟᱱᱛᱟᱲᱤ', script: 'Ol Chiki', description: 'ᱚᱞ ᱪᱤᱠᱤ' },
  { code: 'english', name: 'English', nativeName: 'English', script: 'Latin', description: 'Classroom English' },
  { code: 'roman_santhali', name: 'Roman Santhali', nativeName: 'Roman Santali', script: 'Latin', description: 'Phonetic' },
  { code: 'mundari', name: 'Mundari', nativeName: 'ᱢᱩᱱᱰᱟᱨᱤ', script: 'Ol Chiki', description: 'ᱢᱩᱱᱰᱟᱨᱤ (Pilot)' },
];

export interface AudioMetadata {
  durationMs?: number;
  voiceModel?: string;
  speed?: number;
  isOnlineVoice?: boolean;
}

export interface TranslationResult {
  id: string;
  sourceText: string;
  sourceLang: LanguageCode;
  targetLang: LanguageCode;
  translatedText: string;
  romanPronunciation: string;
  hindiMeaning?: string;
  englishMeaning?: string;
  confidence: number;
  timestamp: number;
  audioMetadata?: AudioMetadata;
}

export interface TranslationHistoryItem {
  id: string;
  sourceText: string;
  translatedText: string;
  romanPronunciation: string;
  sourceLang: LanguageCode;
  targetLang: LanguageCode;
  timestamp: number;
  isFavorite?: boolean;
  audioMetadata?: AudioMetadata;
}

export interface DictionaryEntry {
  hindi: string;
  santhali: string;
  roman: string;
  english?: string;
  mundari?: string;
  category: 'animals' | 'fruits' | 'numbers' | 'greetings' | 'commands' | 'classroom';
}
