// BhashaBridge AI — Production Speech Recognition Service
// Whisper Tiny ONNX integration, continuous listening, VAD silence detection, biquad noise filtering, and timestamps.

import { whisperService, type WhisperWordTimestamp } from './ai/whisperService';

interface IWindow extends Window {
  webkitSpeechRecognition?: any;
  SpeechRecognition?: any;
  webkitAudioContext?: typeof AudioContext;
}

export interface SpeechRecognitionConfig {
  language: string; // 'hi-IN', 'en-IN', 'sat-IN', etc.
  continuous: boolean;
  interimResults: boolean;
  silenceTimeoutMs: number; // 3000 to 5000 ms
  classroomMode: boolean; // Enables 300Hz-3400Hz bandpass and ambient noise gate
}

export interface RecognitionCallbacks {
  onTranscript?: (transcript: string, isFinal: boolean) => void;
  onInterimTranscript?: (interim: string) => void;
  onAudioLevel?: (level: number, frequencyData?: Uint8Array) => void;
  onSilenceDetected?: () => void;
  onTimestamps?: (timestamps: WhisperWordTimestamp[]) => void;
  onError?: (error: string) => void;
  onEnd?: () => void;
}

class SpeechRecognitionService {
  private recognition: any = null;
  private isListeningState: boolean = false;
  private audioContext: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private biquadFilter: BiquadFilterNode | null = null;
  private mediaStream: MediaStream | null = null;
  private mediaRecorder: MediaRecorder | null = null;
  private recordedChunks: Blob[] = [];
  private animationFrameId: number | null = null;
  private silenceTimer: ReturnType<typeof setTimeout> | null = null;
  private callbacks: RecognitionCallbacks = {};

  private config: SpeechRecognitionConfig = {
    language: 'hi-IN',
    continuous: true,
    interimResults: true,
    silenceTimeoutMs: 3500,
    classroomMode: true,
  };

  public getRecordedAudioBlob(): Blob | null {
    if (this.recordedChunks.length === 0) return null;
    return new Blob(this.recordedChunks, { type: 'audio/webm;codecs=opus' });
  }

  public setConfig(newConfig: Partial<SpeechRecognitionConfig>) {
    this.config = { ...this.config, ...newConfig };
    if (newConfig.classroomMode !== undefined) {
      whisperService.setClassroomMode(newConfig.classroomMode);
    }
  }

  public setClassroomMode(enabled: boolean) {
    this.config.classroomMode = enabled;
    whisperService.setClassroomMode(enabled);
  }

  public isClassroomMode(): boolean {
    return this.config.classroomMode;
  }

  public async start(
    callbacks: RecognitionCallbacks = {},
    customLang?: string
  ): Promise<boolean> {
    this.stop();
    this.callbacks = callbacks;
    if (customLang) this.config.language = customLang;

    this.isListeningState = true;
    this.recordedChunks = [];
    this.resetSilenceTimer();

    // 1. Initialize AudioContext with real noise filtering for classroom mode
    try {
      if (typeof navigator !== 'undefined' && navigator.mediaDevices?.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true,
          },
        });
        this.mediaStream = stream;

        const AudioCtx = window.AudioContext || (window as IWindow).webkitAudioContext;
        if (AudioCtx) {
          this.audioContext = new AudioCtx();
          const source = this.audioContext.createMediaStreamSource(stream);

          // In Classroom Mode, insert Biquad Bandpass Filter (300Hz - 3400Hz vocal formant pass)
          if (this.config.classroomMode) {
            this.biquadFilter = this.audioContext.createBiquadFilter();
            this.biquadFilter.type = 'bandpass';
            this.biquadFilter.frequency.value = 1850; // Center frequency
            this.biquadFilter.Q.value = 0.8;
            source.connect(this.biquadFilter);

            this.analyser = this.audioContext.createAnalyser();
            this.analyser.fftSize = 64;
            this.biquadFilter.connect(this.analyser);
          } else {
            this.analyser = this.audioContext.createAnalyser();
            this.analyser.fftSize = 64;
            source.connect(this.analyser);
          }

          this.startWaveformLoop();
        }

        // Initialize MediaRecorder for recording audio to send to Whisper Tiny ONNX
        if (typeof MediaRecorder !== 'undefined') {
          try {
            this.mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
            this.mediaRecorder.ondataavailable = (event) => {
              if (event.data && event.data.size > 0) {
                this.recordedChunks.push(event.data);
              }
            };
            this.mediaRecorder.start(250);
          } catch {
            // MediaRecorder standard fallback
          }
        }
      }
    } catch (err) {
      console.warn('Microphone permission / audio context init warning:', err);
    }

    // 2. Initialize Speech Recognition Engine
    const win = typeof window !== 'undefined' ? (window as IWindow) : null;
    const SpeechRecognitionClass = win?.SpeechRecognition || win?.webkitSpeechRecognition;

    if (SpeechRecognitionClass) {
      try {
        const rec = new SpeechRecognitionClass();
        this.recognition = rec;
        rec.continuous = this.config.continuous;
        rec.interimResults = this.config.interimResults;
        rec.lang = this.config.language;

        rec.onresult = (event: any) => {
          this.resetSilenceTimer();

          let interimStr = '';
          let finalStr = '';

          for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
              finalStr += event.results[i][0].transcript;
            } else {
              interimStr += event.results[i][0].transcript;
            }
          }

          if (interimStr) {
            this.callbacks.onInterimTranscript?.(interimStr);
            this.callbacks.onTranscript?.(interimStr, false);
          }

          if (finalStr) {
            this.callbacks.onTranscript?.(finalStr, true);

            // Generate timestamps for recognized final segment
            const timestamps = whisperService.generateWordTimestamps(finalStr, 2.5, 0.95);
            this.callbacks.onTimestamps?.(timestamps);
          }
        };

        rec.onerror = (e: any) => {
          const errMsg = e.error || 'Speech recognition error';
          this.callbacks.onError?.(errMsg);
        };

        rec.onend = () => {
          // In continuous mode, restart recognition if still listening
          if (this.isListeningState && this.config.continuous) {
            try {
              rec.start();
            } catch {
              this.stop();
            }
          } else if (this.isListeningState) {
            this.stop();
          }
        };

        rec.start();
        return true;
      } catch (err: any) {
        console.warn('SpeechRecognition start notice:', err);
      }
    }

    return true;
  }

  public stop() {
    this.isListeningState = false;
    this.clearSilenceTimer();

    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }

    if (this.recognition) {
      try {
        this.recognition.stop();
      } catch {
        // ignore
      }
      this.recognition = null;
    }

    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
      try {
        this.mediaRecorder.stop();
      } catch {
        // ignore
      }
    }

    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach((track) => track.stop());
      this.mediaStream = null;
    }

    if (this.audioContext) {
      this.audioContext.close().catch(() => {});
      this.audioContext = null;
      this.analyser = null;
      this.biquadFilter = null;
    }

    // Process recorded audio through Whisper Tiny ONNX
    const audioBlob = this.getRecordedAudioBlob();
    if (audioBlob && audioBlob.size > 500) {
      whisperService
        .transcribeAudio(audioBlob, this.config.language.startsWith('en') ? 'en' : 'hi')
        .then((result) => {
          if (result && result.text) {
            this.callbacks.onTranscript?.(result.text, true);
            if (result.timestamps) {
              this.callbacks.onTimestamps?.(result.timestamps);
            }
          }
        })
        .catch(console.warn);
    }

    this.callbacks.onEnd?.();
  }

  private resetSilenceTimer() {
    this.clearSilenceTimer();
    this.silenceTimer = setTimeout(() => {
      if (this.isListeningState) {
        this.callbacks.onSilenceDetected?.();
        this.stop();
      }
    }, this.config.silenceTimeoutMs);
  }

  private clearSilenceTimer() {
    if (this.silenceTimer) {
      clearTimeout(this.silenceTimer);
      this.silenceTimer = null;
    }
  }

  private startWaveformLoop() {
    if (!this.analyser) return;

    const bufferLength = this.analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const checkAudio = () => {
      if (!this.isListeningState || !this.analyser) return;

      this.analyser.getByteFrequencyData(dataArray);
      let sum = 0;
      for (let i = 0; i < bufferLength; i++) {
        sum += dataArray[i];
      }
      const avg = sum / bufferLength;
      const normalizedLevel = Math.min(1.0, avg / 128);

      // Noise floor gate: only consider level > 0.12 as speech in classroom mode
      const threshold = this.config.classroomMode ? 0.12 : 0.08;
      if (normalizedLevel > threshold) {
        this.resetSilenceTimer();
      }

      this.callbacks.onAudioLevel?.(normalizedLevel, dataArray);
      this.animationFrameId = requestAnimationFrame(checkAudio);
    };

    this.animationFrameId = requestAnimationFrame(checkAudio);
  }

  public isListening(): boolean {
    return this.isListeningState;
  }
}

export const speechRecognitionService = new SpeechRecognitionService();
export default speechRecognitionService;
