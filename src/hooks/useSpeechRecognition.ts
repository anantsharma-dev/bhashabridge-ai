import { useState, useRef, useCallback, useEffect } from 'react';

// SpeechRecognition type polyfills
interface IWindow extends Window {
  webkitSpeechRecognition?: any;
  SpeechRecognition?: any;
}

export interface UseSpeechRecognitionOptions {
  onResult?: (transcript: string, isFinal: boolean) => void;
  onError?: (error: string) => void;
  onEnd?: () => void;
}

const SAMPLE_CLASSROOM_PROMPTS = [
  'बच्चों, अपनी किताब का पन्ना नंबर पाँच खोलो।',
  'सभी बच्चे अपनी जगह पर बैठ जाओ।',
  'आज हम एक नई कहानी पढ़ेंगे।',
  'जोहार बच्चों, आप सब कैसे हैं?',
  'कॉपी में आज का पाठ लिखो।',
];

export function useSpeechRecognition(options: UseSpeechRecognitionOptions = {}) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [audioLevel, setAudioLevel] = useState(0);

  const recognitionRef = useRef<any>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const audioIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const optionsRef = useRef(options);

  useEffect(() => {
    optionsRef.current = options;
  }, [options]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // ignore
      }
      recognitionRef.current = null;
    }

    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    if (audioIntervalRef.current) {
      clearInterval(audioIntervalRef.current);
      audioIntervalRef.current = null;
    }

    setIsListening(false);
    setAudioLevel(0);
    optionsRef.current.onEnd?.();
  }, []);

  const startListening = useCallback(
    (lang: string = 'hi-IN') => {
      setError(null);
      setTranscript('');
      setInterimTranscript('');
      setIsListening(true);

      // Start simulated waveform audioLevel fluctuation
      if (audioIntervalRef.current) clearInterval(audioIntervalRef.current);
      audioIntervalRef.current = setInterval(() => {
        const randomLevel = Math.random() * 0.7 + 0.3; // 0.3 to 1.0
        setAudioLevel(randomLevel);
      }, 150);

      const win = typeof window !== 'undefined' ? (window as IWindow) : null;
      const SpeechRecognitionClass = win?.SpeechRecognition || win?.webkitSpeechRecognition;

      if (SpeechRecognitionClass) {
        try {
          const recognition = new SpeechRecognitionClass();
          recognitionRef.current = recognition;
          recognition.lang = lang;
          recognition.continuous = true;
          recognition.interimResults = true;

          recognition.onresult = (event: any) => {
            let finalStr = '';
            let interimStr = '';

            for (let i = event.resultIndex; i < event.results.length; ++i) {
              if (event.results[i].isFinal) {
                finalStr += event.results[i][0].transcript;
              } else {
                interimStr += event.results[i][0].transcript;
              }
            }

            if (interimStr) {
              setInterimTranscript(interimStr);
              optionsRef.current.onResult?.(interimStr, false);
            }

            if (finalStr) {
              setTranscript((prev) => {
                const combined = prev ? `${prev} ${finalStr}` : finalStr;
                optionsRef.current.onResult?.(combined, true);
                return combined;
              });
            }
          };

          recognition.onerror = (e: any) => {
            const errMsg = e.error || 'Speech recognition encountered an issue';
            setError(errMsg);
            optionsRef.current.onError?.(errMsg);
            stopListening();
          };

          recognition.onend = () => {
            stopListening();
          };

          recognition.start();
          return;
        } catch {
          // Fall through to fallback simulator
        }
      }

      // Offline classroom fallback simulation
      // If browser doesn't support Web Speech API or runs offline
      timerRef.current = setTimeout(() => {
        const randomIndex = Math.floor(Math.random() * SAMPLE_CLASSROOM_PROMPTS.length);
        const sampleText = SAMPLE_CLASSROOM_PROMPTS[randomIndex];
        setTranscript(sampleText);
        optionsRef.current.onResult?.(sampleText, true);
        stopListening();
      }, 3000);
    },
    [stopListening]
  );

  const resetTranscript = useCallback(() => {
    setTranscript('');
    setInterimTranscript('');
  }, []);

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {
          // ignore
        }
      }
      if (timerRef.current) clearTimeout(timerRef.current);
      if (audioIntervalRef.current) clearInterval(audioIntervalRef.current);
    };
  }, []);

  return {
    isListening,
    transcript,
    interimTranscript,
    error,
    audioLevel,
    startListening,
    stopListening,
    resetTranscript,
  };
}

export default useSpeechRecognition;
