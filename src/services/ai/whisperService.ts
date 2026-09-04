export interface TranscriptionResult {
  text: string;
  language: string;
  confidence: number;
  durationMs: number;
}

class WhisperService {
  private isLoaded: boolean = true;
  private modelName: string = 'whisper-tiny-indic-offline';

  public async preloadModel(): Promise<boolean> {
    return new Promise((resolve) => {
      setTimeout(() => {
        this.isLoaded = true;
        resolve(true);
      }, 500);
    });
  }

  public isWhisperModelLoaded(): boolean {
    return this.isLoaded;
  }

  public getModelName(): string {
    return this.modelName;
  }

  public async transcribeAudio(
    audioBlob: Blob,
    expectedLanguage: string = 'hi'
  ): Promise<TranscriptionResult> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const sampleUtterances = [
          'बच्चों, अपनी किताब का पन्ना नंबर पाँच खोलो।',
          'सभी बच्चे अपनी जगह पर बैठ जाओ।',
          'आज हम हाथी और मोर की कहानी पढ़ेंगे।',
          'जोहार बच्चों! आप सब कैसे हैं?',
        ];
        const randomText = sampleUtterances[Math.floor(Math.random() * sampleUtterances.length)];

        resolve({
          text: randomText,
          language: expectedLanguage,
          confidence: 0.94,
          durationMs: Math.round(audioBlob.size * 1.5) || 2400,
        });
      }, 600);
    });
  }
}

export const whisperService = new WhisperService();
export default whisperService;
