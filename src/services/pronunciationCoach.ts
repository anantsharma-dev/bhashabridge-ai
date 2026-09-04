export interface WordFeedback {
  word: string;
  isAccurate: boolean;
  score: number; // 0 to 1
  phoneticTip?: string;
}

export interface PronunciationFeedback {
  overallScore: number; // 0 to 100
  stars: number; // 1, 2, or 3
  feedbackMessage: string;
  feedbackHindi: string;
  feedbackSanthali: string;
  wordBreakdown: WordFeedback[];
  needsPracticeWords: string[];
}

class PronunciationCoach {
  /**
   * Evaluates spoken utterance against target text.
   */
  public evaluate(targetText: string, spokenText: string): PronunciationFeedback {
    const cleanTarget = this.cleanWords(targetText);
    const cleanSpoken = this.cleanWords(spokenText);

    if (cleanTarget.length === 0) {
      return {
        overallScore: 100,
        stars: 3,
        feedbackMessage: 'Great job! Perfect!',
        feedbackHindi: 'शाबाश! बहुत अच्छा उच्चारण!',
        feedbackSanthali: 'ᱟᱹᱰᱤ ᱱᱟᱯᱟᱭ! ᱥᱟᱨᱦᱟᱣ!',
        wordBreakdown: [],
        needsPracticeWords: [],
      };
    }

    const breakdown: WordFeedback[] = [];
    let matchCount = 0;
    const needsPractice: string[] = [];

    cleanTarget.forEach((targetWord) => {
      // Find best match in spoken words
      let bestScore = 0;
      cleanSpoken.forEach((spokenWord) => {
        const sim = this.calculateSimilarity(targetWord, spokenWord);
        if (sim > bestScore) bestScore = sim;
      });

      const isAccurate = bestScore >= 0.75;
      if (isAccurate) matchCount++;
      else needsPractice.push(targetWord);

      breakdown.push({
        word: targetWord,
        isAccurate,
        score: bestScore,
        phoneticTip: !isAccurate ? `Try saying "${targetWord}" slowly` : undefined,
      });
    });

    const overallScore = Math.round((matchCount / cleanTarget.length) * 100);

    let stars = 1;
    let message = 'Keep trying! You are doing great!';
    let hindi = 'अच्छा प्रयास! थोड़ा और अभ्यास करें!';
    let santhali = 'ᱟᱨᱦᱚᱸ ᱨᱚᱲ ᱢᱮ, ᱟᱹᱰᱤ ᱵᱮᱥ ᱦᱩᱭᱩᱜ-ᱟ!';

    if (overallScore >= 80) {
      stars = 3;
      message = 'Johar says: Wonderful pronunciation! ⭐⭐⭐';
      hindi = 'जोहार कहता है: बहुत सुंदर उच्चारण! ⭐⭐⭐';
      santhali = 'ᱡᱚᱦᱟᱨ ᱢᱮᱱᱮᱫ-ᱟ: ᱟᱹᱰᱤ ᱱᱟᱯᱟᱭ ᱨᱚᱲ! ⭐⭐⭐';
    } else if (overallScore >= 50) {
      stars = 2;
      message = 'Good effort! Almost there! ⭐⭐';
      hindi = 'बढ़िया प्रयास! बहुत करीब हैं! ⭐⭐';
      santhali = 'ᱵᱮᱥ ᱠᱩᱨᱩᱢᱩᱴᱩ! ⭐⭐';
    }

    return {
      overallScore,
      stars,
      feedbackMessage: message,
      feedbackHindi: hindi,
      feedbackSanthali: santhali,
      wordBreakdown: breakdown,
      needsPracticeWords: needsPractice,
    };
  }

  private cleanWords(text: string): string[] {
    return text
      .toLowerCase()
      .replace(/[.,!?।॥"']/g, '')
      .split(/\s+/)
      .filter((w) => w.length > 0);
  }

  private calculateSimilarity(s1: string, s2: string): number {
    if (s1 === s2) return 1.0;
    if (!s1 || !s2) return 0.0;

    const longer = s1.length > s2.length ? s1 : s2;
    const shorter = s1.length > s2.length ? s2 : s1;

    if (longer.includes(shorter)) return shorter.length / longer.length;

    // Levenshtein distance
    const matrix: number[][] = [];
    for (let i = 0; i <= longer.length; i++) {
      matrix[i] = [i];
    }
    for (let j = 0; j <= shorter.length; j++) {
      matrix[0][j] = j;
    }

    for (let i = 1; i <= longer.length; i++) {
      for (let j = 1; j <= shorter.length; j++) {
        if (longer[i - 1] === shorter[j - 1]) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }

    const distance = matrix[longer.length][shorter.length];
    return Math.max(0, 1.0 - distance / longer.length);
  }
}

export const pronunciationCoach = new PronunciationCoach();
export default pronunciationCoach;
