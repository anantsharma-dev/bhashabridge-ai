export type VoiceMode = 'online' | 'offline';

export interface VoiceSettings {
  mode: VoiceMode;
  rate: number; // 0.5 to 1.5, default 1.0 (or 0.75 for slow)
  pitch: number; // 0.5 to 1.5, default 1.0
  volume: number; // 0 to 1.0, default 1.0
  preferredHindiVoice?: string;
  preferredEnglishVoice?: string;
}

export interface SpeechPlayOptions {
  slow?: boolean;
  rate?: number;
  pitch?: number;
  volume?: number;
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (err: unknown) => void;
}

class SpeechSynthesisService {
  private settings: VoiceSettings = {
    mode: 'online',
    rate: 1.0,
    pitch: 1.0,
    volume: 1.0,
  };

  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private isSpeakingState: boolean = false;

  constructor() {
    this.loadSettings();
  }

  private loadSettings() {
    if (typeof window === 'undefined') return;
    try {
      const saved = localStorage.getItem('bhashabridge_voice_settings');
      if (saved) {
        this.settings = { ...this.settings, ...JSON.parse(saved) };
      }
    } catch {
      // ignore
    }
  }

  public getSettings(): VoiceSettings {
    return { ...this.settings };
  }

  public updateSettings(newSettings: Partial<VoiceSettings>) {
    this.settings = { ...this.settings, ...newSettings };
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('bhashabridge_voice_settings', JSON.stringify(this.settings));
      } catch {
        // ignore
      }
    }
  }

  public setVoiceMode(mode: VoiceMode) {
    this.updateSettings({ mode });
  }

  public getAvailableVoices(): SpeechSynthesisVoice[] {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return [];
    return window.speechSynthesis.getVoices();
  }

  /**
   * High-quality speech synthesis with online Google Neural / Indic voice selection
   * and offline Piper phonetic simulation fallback.
   */
  public speak(
    text: string,
    lang: string = 'hindi',
    options: SpeechPlayOptions = {}
  ): Promise<boolean> {
    return new Promise((resolve) => {
      if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
        options.onError?.(new Error('Speech synthesis not supported in this browser'));
        resolve(false);
        return;
      }

      try {
        this.cancel();

        const cleanText = text.trim();
        if (!cleanText) {
          resolve(false);
          return;
        }

        const utterance = new SpeechSynthesisUtterance(cleanText);
        this.currentUtterance = utterance;

        // Apply rates: slow mode uses 0.75x for clear phonetics
        const effectiveRate = options.slow
          ? 0.75
          : options.rate ?? this.settings.rate;
        utterance.rate = effectiveRate;
        utterance.pitch = options.pitch ?? this.settings.pitch;
        utterance.volume = options.volume ?? this.settings.volume;

        const voices = window.speechSynthesis.getVoices();

        // 1. Language and Voice selection (Prioritizing Natural Google Neural voices)
        if (lang === 'english') {
          utterance.lang = 'en-IN';
          // Find natural / Google English voice if online
          if (this.settings.mode === 'online') {
            const naturalVoice = voices.find(
              (v) =>
                v.lang.startsWith('en') &&
                (v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('India'))
            );
            if (naturalVoice) utterance.voice = naturalVoice;
          }
        } else if (lang === 'hindi') {
          utterance.lang = 'hi-IN';
          if (this.settings.mode === 'online') {
            const naturalHindi = voices.find(
              (v) =>
                v.lang.startsWith('hi') &&
                (v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('हिन्दी'))
            );
            if (naturalHindi) utterance.voice = naturalHindi;
          }
        } else {
          // Santali / Mundari / Tribal languages
          // If offline mode is chosen or fallback: use Piper simulation phonetic pitch
          utterance.lang = 'hi-IN';
          if (this.settings.mode === 'offline') {
            utterance.pitch = 1.05; // Piper model timbre adjustment
          }
        }

        utterance.onstart = () => {
          this.isSpeakingState = true;
          options.onStart?.();
        };

        utterance.onend = () => {
          this.isSpeakingState = false;
          this.currentUtterance = null;
          options.onEnd?.();
          resolve(true);
        };

        utterance.onerror = (e) => {
          this.isSpeakingState = false;
          this.currentUtterance = null;
          options.onError?.(e);
          resolve(false);
        };

        window.speechSynthesis.speak(utterance);
      } catch (err) {
        this.isSpeakingState = false;
        options.onError?.(err);
        resolve(false);
      }
    });
  }

  public cancel() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    this.isSpeakingState = false;
    this.currentUtterance = null;
  }

  public pause() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.pause();
    }
  }

  public resume() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.resume();
    }
  }

  public isSpeaking(): boolean {
    return this.isSpeakingState;
  }

  public getCurrentUtterance(): SpeechSynthesisUtterance | null {
    return this.currentUtterance;
  }
}

export const speechSynthesisService = new SpeechSynthesisService();
export default speechSynthesisService;
