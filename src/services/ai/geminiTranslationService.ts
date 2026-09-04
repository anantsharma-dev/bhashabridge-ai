import { translationService } from '../translationService';
import type { LanguageCode, TranslationResult } from '../../types/translation';

export interface GeminiConfig {
  apiKey?: string;
  model: 'gemini-1.5-flash' | 'gemini-1.5-pro';
  temperature: number;
}

class GeminiTranslationService {
  private config: GeminiConfig = {
    apiKey: (import.meta as any).env?.VITE_GEMINI_API_KEY || '',
    model: 'gemini-1.5-flash',
    temperature: 0.3,
  };

  public setApiKey(key: string) {
    this.config.apiKey = key;
  }

  public async translate(
    text: string,
    sourceLang: LanguageCode = 'hindi',
    targetLang: LanguageCode = 'santhali'
  ): Promise<TranslationResult> {
    const isOnline = typeof navigator !== 'undefined' ? navigator.onLine : false;

    // If offline or no API key, use offline dictionary engine
    if (!isOnline || !this.config.apiKey) {
      return translationService.translateText(text, sourceLang, targetLang);
    }

    try {
      // In online mode with key, query Gemini endpoint
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${this.config.model}:generateContent?key=${this.config.apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: `Translate this MTB-MLE primary classroom phrase from ${sourceLang} to ${targetLang}. Return JSON with translatedText and romanPronunciation: "${text}"`,
                  },
                ],
              },
            ],
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.status}`);
      }

      const data = await response.json();
      const rawOutput = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
      const parsed = JSON.parse(rawOutput.replace(/```json|```/g, ''));

      return {
        id: Date.now().toString(),
        sourceText: text,
        sourceLang,
        targetLang,
        translatedText: parsed.translatedText || text,
        romanPronunciation: parsed.romanPronunciation || '',
        confidence: 0.98,
        timestamp: Date.now(),
      };
    } catch {
      // Graceful offline fallback
      return translationService.translateText(text, sourceLang, targetLang);
    }
  }
}

export const geminiTranslationService = new GeminiTranslationService();
export default geminiTranslationService;
