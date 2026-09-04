export interface SimplifiedStoryResult {
  originalText: string;
  simplifiedHindi: string;
  simplifiedSanthali: string;
  simplifiedRoman: string;
  targetGrade: 'Grade 1' | 'Grade 2' | 'Grade 3';
  readingPaceWordsPerMin: number;
  highlightedKeywords: { word: string; translation: string; roman: string }[];
  isOfflineFallback: boolean;
}

class StorySimplificationService {
  private apiKey: string = (import.meta as any).env?.VITE_GEMINI_API_KEY || '';
  private isLoading: boolean = false;

  public getIsLoading(): boolean {
    return this.isLoading;
  }

  public async simplifyStory(
    text: string,
    targetGrade: 'Grade 1' | 'Grade 2' | 'Grade 3' = 'Grade 1'
  ): Promise<SimplifiedStoryResult> {
    const isOnline = typeof navigator !== 'undefined' ? navigator.onLine : false;

    if (!isOnline || !this.apiKey) {
      return this.offlineFallbackSimplification(text, targetGrade);
    }

    this.isLoading = true;

    try {
      const prompt = `Simplify the following children's story for ${targetGrade} MTB-MLE primary school students in Jharkhand:
"${text}"
Rules:
1. Use short sentences (5-7 words per sentence).
2. Provide simple Hindi and Santali (Ol Chiki) with Roman guide.
3. Identify 3 key foundational vocabulary words.
Return JSON strictly with: { "simplifiedHindi": "...", "simplifiedSanthali": "...", "simplifiedRoman": "...", "keywords": [{"word":"...", "translation":"...", "roman":"..."}] }`;

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${this.apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
          }),
        }
      );

      if (!response.ok) throw new Error('Simplification request failed');

      const data = await response.json();
      const raw = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
      const parsed = JSON.parse(raw.replace(/```json|```/g, ''));

      this.isLoading = false;
      return {
        originalText: text,
        simplifiedHindi: parsed.simplifiedHindi || text,
        simplifiedSanthali: parsed.simplifiedSanthali || 'ᱟᱞᱮ ᱟᱥᱲᱟ ᱨᱮ ᱠᱟᱹᱦᱱᱤ ᱞᱮ ᱯᱟᱲᱦᱟᱣᱟ ᱾',
        simplifiedRoman: parsed.simplifiedRoman || 'Ale asra re kahni le parhawa.',
        targetGrade,
        readingPaceWordsPerMin: 45,
        highlightedKeywords: parsed.keywords || [
          { word: 'हाथी', translation: 'ᱦᱟᱹᱛᱤ', roman: 'Hati' },
          { word: 'पेड़', translation: 'ᱫᱟᱨᱮ', roman: 'Dare' },
        ],
        isOfflineFallback: false,
      };
    } catch {
      this.isLoading = false;
      return this.offlineFallbackSimplification(text, targetGrade);
    }
  }

  private offlineFallbackSimplification(
    text: string,
    targetGrade: 'Grade 1' | 'Grade 2' | 'Grade 3'
  ): SimplifiedStoryResult {
    // Break into simpler chunks
    const sentences = text.split(/[।!?.\n]+/).filter(Boolean);
    const shortSentences = sentences.slice(0, 3).join('। ') + '।';

    return {
      originalText: text,
      simplifiedHindi: shortSentences || 'एक जंगल में हाथी और मोर रहते थे। दोनों अच्छे दोस्त थे।',
      simplifiedSanthali: 'ᱢᱤᱫ ᱵᱤᱨ ᱨᱮ ᱦᱟᱹᱛᱤ ᱟᱨ ᱢᱟᱨᱟᱜ ᱠᱤᱱ ᱛᱟᱦᱮᱸ ᱠᱟᱱᱟ ᱾ ᱵᱟᱱᱟᱨ ᱜᱮ ᱵᱷᱟᱹᱜᱤ ᱜᱟᱛᱮ ᱠᱤᱱ ᱛᱟᱦᱮᱸ ᱠᱟᱱᱟ ᱾',
      simplifiedRoman: 'Mid bir re hati ar marag kin tahen kana. Banar ge bhagi gate kin tahen kana.',
      targetGrade,
      readingPaceWordsPerMin: 40,
      highlightedKeywords: [
        { word: 'हाथी', translation: 'ᱦᱟᱹᱛᱤ', roman: 'Hati' },
        { word: 'मोर', translation: 'ᱢᱟᱨᱟᱜ', roman: 'Marag' },
        { word: 'दोस्त', translation: 'ᱜᱟᱛᱮ', roman: 'Gate' },
      ],
      isOfflineFallback: true,
    };
  }
}

export const storySimplificationService = new StorySimplificationService();
export default storySimplificationService;
