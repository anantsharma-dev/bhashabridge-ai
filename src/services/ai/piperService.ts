export interface PiperVoiceModel {
  id: string;
  name: string;
  language: string;
  sampleRateHz: number;
  sizeMb: number;
  isReady: boolean;
}

class PiperService {
  private activeVoice: string = 'piper-santali-olchiki';
  private models: PiperVoiceModel[] = [
    {
      id: 'piper-santali-olchiki',
      name: 'Santali (Ol Chiki) Female Native',
      language: 'sat',
      sampleRateHz: 22050,
      sizeMb: 48,
      isReady: true,
    },
    {
      id: 'piper-hindi-teacher',
      name: 'Hindi Classroom Teacher',
      language: 'hi',
      sampleRateHz: 22050,
      sizeMb: 52,
      isReady: true,
    },
  ];

  public getAvailableVoices(): PiperVoiceModel[] {
    return this.models;
  }

  public getActiveVoice(): string {
    return this.activeVoice;
  }

  public setActiveVoice(voiceId: string): void {
    this.activeVoice = voiceId;
  }

  public async synthesizeSpeech(
    text: string,
    options: { rate?: number; pitch?: number } = {}
  ): Promise<boolean> {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = options.rate ?? 1.0;
      utterance.pitch = options.pitch ?? 1.0;
      utterance.lang = 'hi-IN';
      window.speechSynthesis.speak(utterance);
      return true;
    }
    return false;
  }
}

export const piperService = new PiperService();
export default piperService;
