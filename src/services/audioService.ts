export interface AudioPlayOptions {
  slow?: boolean;
  rate?: number;
  pitch?: number;
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (err: unknown) => void;
}

class AudioService {
  private isPlaying: boolean = false;
  private currentUtterance: SpeechSynthesisUtterance | null = null;

  public playTranslation(text: string, lang: string = 'hindi', options: AudioPlayOptions = {}): boolean {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      if (options.onError) options.onError(new Error('Speech synthesis not supported in this browser'));
      return false;
    }

    try {
      this.stopAudio();

      const utterance = new SpeechSynthesisUtterance(text);
      this.currentUtterance = utterance;

      // Rate: 0.75 for slow pronunciation, 1.0 default
      utterance.rate = options.slow ? 0.75 : (options.rate ?? 1.0);
      utterance.pitch = options.pitch ?? 1.0;

      // Select voice: try to match Hindi / Indic voice
      const voices = window.speechSynthesis.getVoices();
      if (lang === 'hindi' || lang === 'santhali' || lang === 'mundari') {
        const hindiVoice = voices.find((v) => v.lang.startsWith('hi') || v.lang.includes('IN'));
        if (hindiVoice) {
          utterance.voice = hindiVoice;
        }
      }

      utterance.onstart = () => {
        this.isPlaying = true;
        options.onStart?.();
      };

      utterance.onend = () => {
        this.isPlaying = false;
        this.currentUtterance = null;
        options.onEnd?.();
      };

      utterance.onerror = (e) => {
        this.isPlaying = false;
        this.currentUtterance = null;
        options.onError?.(e);
      };

      window.speechSynthesis.speak(utterance);
      return true;
    } catch (err) {
      this.isPlaying = false;
      options.onError?.(err);
      return false;
    }
  }

  public stopAudio(): void {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    this.isPlaying = false;
    this.currentUtterance = null;
  }

  public pauseAudio(): void {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.pause();
    }
  }

  public resumeAudio(): void {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.resume();
    }
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  public getCurrentUtterance(): SpeechSynthesisUtterance | null {
    return this.currentUtterance;
  }
}

export const audioService = new AudioService();
export default audioService;
