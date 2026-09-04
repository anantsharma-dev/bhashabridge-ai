import type { LessonPlanConfig } from '../../components/lesson-planner/LessonBuilderForm';
import { lessonPlannerService, type GeneratedLessonPlan } from '../lessonPlannerService';
import { LESSON_PLAN_PROMPT, SYSTEM_PROMPT_MTB_MLE } from './promptTemplates';

export interface GeminiLessonPlanResponse {
  plan: GeneratedLessonPlan;
  isAiGenerated: boolean;
  modelUsed: string;
}

class GeminiLessonPlannerService {
  private apiKey: string = (import.meta as any).env?.VITE_GEMINI_API_KEY || '';
  private model: string = 'gemini-1.5-flash';
  private isLoading: boolean = false;

  public setApiKey(key: string) {
    this.apiKey = key;
  }

  public getIsLoading(): boolean {
    return this.isLoading;
  }

  public async generateLessonPlan(config: LessonPlanConfig): Promise<GeminiLessonPlanResponse> {
    const isOnline = typeof navigator !== 'undefined' ? navigator.onLine : false;

    // Offline fallback
    if (!isOnline || !this.apiKey) {
      const offlinePlan = lessonPlannerService.generateLessonPlan(config);
      return {
        plan: offlinePlan,
        isAiGenerated: false,
        modelUsed: 'offline-nep-template-engine',
      };
    }

    this.isLoading = true;

    try {
      const prompt = `${SYSTEM_PROMPT_MTB_MLE}\n\n${LESSON_PLAN_PROMPT(
        config.topic,
        config.grade,
        config.duration
      )}\nReturn strictly a valid JSON object matching the 9-phase GeneratedLessonPlan schema.`;

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
        throw new Error(`Gemini Lesson Planner error: ${response.status}`);
      }

      const data = await response.json();
      const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
      const parsed = JSON.parse(rawText.replace(/```json|```/g, ''));

      this.isLoading = false;
      return {
        plan: {
          id: `ai-plan-${Date.now()}`,
          title: parsed.title || `${config.topic} — ${config.grade} MTB-MLE Plan`,
          config,
          phases: parsed.phases || lessonPlannerService.generateLessonPlan(config).phases,
          learningOutcomes: parsed.learningOutcomes || [
            'Master bilingual classroom vocabulary.',
            'Bridge oral mother tongue into standard Hindi curriculum.',
          ],
          nepStandard: parsed.nepStandard || 'NEP 2020 Primary Education MTB-MLE Framework',
          createdAt: Date.now(),
        },
        isAiGenerated: true,
        modelUsed: this.model,
      };
    } catch {
      this.isLoading = false;
      const offlinePlan = lessonPlannerService.generateLessonPlan(config);
      return {
        plan: offlinePlan,
        isAiGenerated: false,
        modelUsed: 'offline-nep-fallback',
      };
    }
  }
}

export const geminiLessonPlannerService = new GeminiLessonPlannerService();
export default geminiLessonPlannerService;
