import React, { useState, useEffect } from 'react';
import {
  VoiceHero,
  LanguageSelector,
  VoiceRecorder,
  type VoiceState,
  TranslationResult,
  PhraseLibrary,
  type PhraseItem,
  ConversationMode,
  type ChatEntry,
  OfflineStatusCard,
  PronunciationCoachCard,
  VoiceSettingsModal,
  WaveformVisualizer,
  NoiseDetector,
  MicPermissionPrompt,
} from '../components/voice';
import { useThemeStore } from '../components/ui';
import { speechRecognitionService } from '../services/speechRecognition';
import { speechSynthesisService } from '../services/speechSynthesis';
import { languageDetector } from '../services/languageDetector';
import { useConversationStore } from '../services/conversationHistory';
import { Toast, type ToastType } from '../components/ui/Toast';
import { geminiTranslationService } from '../services/ai/geminiTranslationService';
import type { LanguageCode } from '../types/translation';

export const VoiceTranslation: React.FC = () => {
  const { isOffline, currentLanguage, setCurrentLanguage } = useThemeStore();
  const [sourceLang, setSourceLang] = useState<string>('hindi');
  const [voiceState, setVoiceState] = useState<VoiceState>('idle');
  const [isSpeakingMascot, setIsSpeakingMascot] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isMicPromptOpen, setIsMicPromptOpen] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);

  // Active translation state
  const [activeHindi, setActiveHindi] = useState('बच्चों, अपनी किताब का पन्ना नंबर पाँच खोलो।');
  const [activeSanthali, setActiveSanthali] = useState('ᱜᱤᱫᱽᱨᱟᱹ, ᱟᱯᱱᱟᱨ ᱯᱩᱛᱷᱤ ᱨᱮᱭᱟᱜ ᱥᱟᱠᱟᱢ ᱮᱞ ᱢᱚᱬᱮ ᱡᱷᱤᱡᱽ ᱢᱮ ᱾');
  const [activeLatin, setActiveLatin] = useState('Gidra, apnar puthi reyag sakam el mone jhij me.');

  // IndexedDB + Zustand conversation history
  const { history, addEntry, initStore } = useConversationStore();

  useEffect(() => {
    initStore();
  }, [initStore]);

  // Clean up audio on unmount
  useEffect(() => {
    return () => {
      speechRecognitionService.stop();
      speechSynthesisService.cancel();
    };
  }, []);

  const handleProcessSpeech = async (spokenText: string) => {
    const text = spokenText.trim();
    if (!text) return;

    setVoiceState('processing');

    try {
      let resolvedSource = sourceLang;
      if (sourceLang === 'auto') {
        const detected = languageDetector.detectLanguage(text);
        resolvedSource =
          detected.language === 'santhali' || detected.language === 'roman_santhali'
            ? 'santali'
            : detected.language === 'english'
            ? 'english'
            : 'hindi';
      }

      let targetCode: LanguageCode = (currentLanguage as LanguageCode) || 'santhali';
      if (resolvedSource === targetCode) {
        targetCode = resolvedSource === 'hindi' ? 'santhali' : 'hindi';
      }
      const sourceCode: LanguageCode = (resolvedSource as LanguageCode) || 'hindi';

      const res = await geminiTranslationService.translate(text, sourceCode, targetCode);

      setActiveHindi(res.sourceText);
      setActiveSanthali(res.translatedText);
      setActiveLatin(res.romanPronunciation);

      // Save to IndexedDB conversation history
      const newEntry: ChatEntry = {
        id: Date.now().toString(),
        speaker: 'teacher',
        hindi: res.sourceText,
        santhali: res.translatedText,
        santhaliLatin: res.romanPronunciation,
      };
      addEntry(newEntry);

      // Speak translation with Google Neural / Piper voice
      setVoiceState('speaking');
      setIsSpeakingMascot(true);

      speechSynthesisService.speak(res.translatedText, targetCode, {
        onEnd: () => {
          setVoiceState('idle');
          setIsSpeakingMascot(false);
        },
        onError: () => {
          setVoiceState('idle');
          setIsSpeakingMascot(false);
        },
      });
    } catch {
      setVoiceState('idle');
      setToast({
        message: 'Could not process voice input. Please try again or tap a phrase below.',
        type: 'error',
      });
    }
  };

  // Voice recording with continuous recognition & silence detection (3.5s)
  const handleStartRecord = () => {
    setVoiceState('listening');

    const recogLang =
      sourceLang === 'english'
        ? 'en-IN'
        : sourceLang === 'hindi'
        ? 'hi-IN'
        : 'hi-IN';

    speechRecognitionService.start(
      {
        onTranscript: (transcript, isFinal) => {
          if (isFinal && transcript.trim()) {
            handleProcessSpeech(transcript);
          }
        },
        onSilenceDetected: () => {
          if (voiceState === 'listening') {
            setVoiceState('processing');
          }
        },
        onError: () => {
          setVoiceState('error');
          setIsMicPromptOpen(true);
          setToast({
            message: 'Microphone permission needed or voice input unavailable. Please grant microphone access.',
            type: 'warning',
          });
        },
        onEnd: () => {
          if (voiceState === 'listening') {
            setVoiceState('idle');
          }
        },
      },
      recogLang
    );
  };

  const handleStopRecord = () => {
    speechRecognitionService.stop();
  };

  const handleSwap = () => {
    const temp = sourceLang;
    setSourceLang(currentLanguage);
    setCurrentLanguage(temp as any);
  };

  const handleSelectPhrase = (phrase: PhraseItem) => {
    setActiveHindi(phrase.hindi);
    setActiveSanthali(phrase.santhali);
    setActiveLatin(phrase.santhaliLatin);

    const newEntry: ChatEntry = {
      id: Date.now().toString(),
      speaker: 'teacher',
      hindi: phrase.hindi,
      santhali: phrase.santhali,
      santhaliLatin: phrase.santhaliLatin,
    };
    addEntry(newEntry);

    // Speak phrase
    setVoiceState('speaking');
    setIsSpeakingMascot(true);
    speechSynthesisService.speak(phrase.santhali, currentLanguage, {
      onEnd: () => {
        setVoiceState('idle');
        setIsSpeakingMascot(false);
      },
      onError: () => {
        setVoiceState('idle');
        setIsSpeakingMascot(false);
      },
    });
  };

  const handleReplayAudio = (slow = false) => {
    setIsSpeakingMascot(true);
    speechSynthesisService.speak(activeSanthali, currentLanguage, {
      slow,
      onEnd: () => setIsSpeakingMascot(false),
      onError: () => setIsSpeakingMascot(false),
    });
  };

  return (
    <div className="min-h-full bg-[#FFFDF7] -m-4 sm:-m-6 lg:-m-8 p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8 font-sans antialiased text-slate-800">
      {/* 1. HERO SECTION */}
      <VoiceHero
        isListening={voiceState === 'listening'}
        onStartSpeaking={handleStartRecord}
      />

      {/* 2. LANGUAGE SELECTOR WITH VOICE SETTINGS TRIGGER */}
      <div className="space-y-2">
        <LanguageSelector
          sourceLang={sourceLang}
          targetLang={currentLanguage}
          onSelectSource={(code) => setSourceLang(code)}
          onSelectTarget={(code) => setCurrentLanguage(code as any)}
          onSwap={handleSwap}
          isOffline={isOffline}
        />
        <div className="flex justify-end pr-2">
          <button
            type="button"
            onClick={() => setIsSettingsOpen(true)}
            className="text-xs font-bold text-slate-500 hover:text-blue-600 flex items-center gap-1.5 cursor-pointer py-1 px-2.5 rounded-xl hover:bg-slate-100 transition-colors"
          >
            <span>⚙️ Configure Neural Voice & Speed</span>
          </button>
        </div>
      </div>

      {/* 3. VOICE RECORDER CARD (Silence Detection & Waveform) */}
      <div className="space-y-3">
        <VoiceRecorder
          state={voiceState}
          onStartRecord={handleStartRecord}
          onStopRecord={handleStopRecord}
        />
        {voiceState === 'listening' && (
          <div className="p-3 rounded-2xl bg-white border border-rose-200 shadow-xs space-y-2">
            <div className="text-[11px] font-bold text-rose-800 text-center">
              🎙️ Live Classroom Speech Waveform
            </div>
            <WaveformVisualizer isActive={true} />
          </div>
        )}
        <NoiseDetector isListening={voiceState === 'listening'} />
      </div>

      {/* 4. CLASSROOM PHRASE LIBRARY */}
      <PhraseLibrary onSelectPhrase={handleSelectPhrase} />

      {/* 5. TRANSLATION RESULT CARD */}
      <TranslationResult
        hindiText={activeHindi}
        santhaliText={activeSanthali}
        santhaliLatin={activeLatin}
        onReplayAudio={handleReplayAudio}
      />

      {/* 6. PRONUNCIATION COACH CARD ("Repeat after Johar") */}
      <PronunciationCoachCard
        targetPhrase={activeSanthali}
        romanPhrase={activeLatin}
        lang={currentLanguage}
      />

      {/* 7. CONVERSATION MODE (IndexedDB Persistent Dialogue) */}
      <ConversationMode
        history={history}
        isSpeaking={isSpeakingMascot}
        onPlayEntry={(entry) => handleSelectPhrase({
          id: entry.id,
          hindi: entry.hindi,
          santhali: entry.santhali,
          santhaliLatin: entry.santhaliLatin,
          category: 'Conversation',
          color: '',
        })}
      />

      {/* 8. OFFLINE STATUS CARD */}
      <OfflineStatusCard />

      {/* 9. VOICE SETTINGS MODAL */}
      <VoiceSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />

      {/* 10. MIC PERMISSION PROMPT MODAL */}
      <MicPermissionPrompt
        isOpen={isMicPromptOpen}
        onClose={() => setIsMicPromptOpen(false)}
        onRequestPermission={handleStartRecord}
      />

      {/* TOAST FEEDBACK */}
      <Toast
        message={toast?.message ?? null}
        type={toast?.type ?? 'info'}
        onClose={() => setToast(null)}
      />
    </div>
  );
};

export default VoiceTranslation;
