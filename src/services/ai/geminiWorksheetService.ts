import type { WorksheetConfig } from '../../components/worksheets/WorksheetGeneratorForm';
import { worksheetService, type GeneratedWorksheet } from '../worksheetService';
import { WORKSHEET_PROMPT, SYSTEM_PROMPT_MTB_MLE } from './promptTemplates';

export interface GeminiWorksheetResponse {
  worksheet: GeneratedWorksheet;
  isAiGenerated: boolean;
  modelUsed: string;
}

class GeminiWorksheetService {
  private apiKey: string = (import.meta as any).env?.VITE_GEMINI_API_KEY || '';
  private model: string = 'gemini-1.5-flash';
  private isLoading: boolean = false;

  public setApiKey(key: string) {
    this.apiKey = key;
  }

  public getIsLoading(): boolean {
    return this.isLoading;
  }

  /**
   * Generates a pedagogical worksheet using Gemini online or local offline generator.
   */
  public async generateWorksheet(config: WorksheetConfig): Promise<GeminiWorksheetResponse> {
    const isOnline = typeof navigator !== 'undefined' ? navigator.onLine : false;

    // Offline fallback
    if (!isOnline || !this.apiKey) {
      const offlineWs = worksheetService.generateWorksheet(config);
      return {
        worksheet: offlineWs,
        isAiGenerated: false,
        modelUsed: 'offline-template-engine',
      };
    }

    this.isLoading = true;

    try {
      const prompt = `${SYSTEM_PROMPT_MTB_MLE}\n\n${WORKSHEET_PROMPT(
        config.grade,
        config.subject,
        config.topic
      )}\nReturn strictly a valid JSON object matching the GeneratedWorksheet schema.`;

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${this.model}:generateContent?key=${this.apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Gemini Worksheet API error: ${response.status}`);
      }

      const data = await response.json();
      const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
      const parsed = JSON.parse(rawText.replace(/```json|```/g, ''));

      this.isLoading = false;
      return {
        worksheet: {
          id: `ai-ws-${Date.now()}`,
          title: parsed.title || `${config.topic} — ${config.grade} AI Worksheet`,
          titleSanthali: parsed.titleSanthali || 'ᱟᱥᱲᱟ ᱨᱮᱭᱟᱜ ᱠᱟᱛᱷᱟ',
          config,
          instructionsHindi: parsed.instructionsHindi || 'निर्देश: सही उत्तर चुनें और लिखें।',
          instructionsSanthali: parsed.instructionsSanthali || 'ᱟᱹᱫᱮᱥ: ᱥᱟᱹᱨᱤ ᱛᱮᱞᱟ ᱵᱟᱪᱷᱟᱣ ᱢᱮ ᱾',
          questions: parsed.questions || worksheetService.generateWorksheet(config).questions,
          createdAt: Date.now(),
        },
        isAiGenerated: true,
        modelUsed: this.model,
      };
    } catch {
      this.isLoading = false;
      // Graceful offline fallback
      const offlineWs = worksheetService.generateWorksheet(config);
      return {
        worksheet: offlineWs,
        isAiGenerated: false,
        modelUsed: 'offline-template-fallback',
      };
    }
  }
}

export const geminiWorksheetService = new GeminiWorksheetService();
export default geminiWorksheetService;
