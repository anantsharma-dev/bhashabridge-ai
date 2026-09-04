import React, { useState } from 'react';
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
} from '../components/voice';
import { useThemeStore } from '../components/ui';

export const VoiceTranslation: React.FC = () => {
  const { isOffline, currentLanguage, setCurrentLanguage } = useThemeStore();
  const [sourceLang, setSourceLang] = useState('hindi');
  const [voiceState, setVoiceState] = useState<VoiceState>('idle');
  const [isSpeakingMascot, setIsSpeakingMascot] = useState(false);

  // Active translation state
  const [activeHindi, setActiveHindi] = useState('बच्चों, अपनी किताब का पन्ना नंबर पाँच खोलो।');
  const [activeSanthali, setActiveSanthali] = useState('ᱜᱤᱫᱽᱨᱟᱹ, ᱟᱯᱱᱟᱨ ᱯᱩᱛᱷᱤ ᱨᱮᱭᱟᱜ ᱥᱟᱠᱟᱢ ᱮᱞ ᱢᱚᱬᱮ ᱡᱷᱤᱡᱽ ᱢᱮ ᱾');
  const [activeLatin, setActiveLatin] = useState('Gidra, apnar puthi reyag sakam el mone jhij me.');

  // Conversation history
  const [history, setHistory] = useState<ChatEntry[]>([
    {
      id: '1',
      speaker: 'teacher',
      hindi: 'जोहार बच्चों! आज हम नए पशुओं के नाम सीखेंगे।',
      santhali: 'ᱡᱚᱦᱟᱨ ᱜᱤᱫᱽᱨᱟᱹ! ᱛᱮᱦᱮᱧ ᱫᱚ ᱵᱚᱱ ᱱᱟᱣᱟ ᱡᱤᱵᱽ ᱡᱤᱭᱟᱹᱞᱤ ᱧᱩᱛᱩᱢ ᱪᱮᱫᱚᱜ-ᱟ ᱾',
      santhaliLatin: 'Johar gidra! Tehenj do bon nawa jib jiyali nutum chedoga.',
    },
    {
      id: '2',
      speaker: 'child',
      hindi: 'हाँ मैडम, हम तैयार हैं!',
      santhali: 'ᱦᱮᱸ ᱢᱟᱪᱮᱛ, ᱟᱞᱮ ᱫᱚᱞᱮ ᱥᱟᱯᱲᱟᱣ ᱟᱠᱟᱱᱟ!',
      santhaliLatin: 'Hen machet, ale dole saphraw akana!',
    },
  ]);

  // Voice recording triggers
  const handleStartRecord = () => {
    setVoiceState('listening');
    // Simulate recording duration then processing
    setTimeout(() => {
      setVoiceState('processing');
      setTimeout(() => {
        setVoiceState('speaking');
        setIsSpeakingMascot(true);
        setTimeout(() => {
          setVoiceState('idle');
          setIsSpeakingMascot(false);
        }, 2500);
      }, 1500);
    }, 3000);
  };

  const handleStopRecord = () => {
    setVoiceState('processing');
    setTimeout(() => {
      setVoiceState('speaking');
      setIsSpeakingMascot(true);
      setTimeout(() => {
        setVoiceState('idle');
        setIsSpeakingMascot(false);
      }, 2500);
    }, 1200);
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

    // Append to conversation
    const newEntry: ChatEntry = {
      id: Date.now().toString(),
      speaker: 'teacher',
      hindi: phrase.hindi,
      santhali: phrase.santhali,
      santhaliLatin: phrase.santhaliLatin,
    };
    setHistory((prev) => [newEntry, ...prev]);

    // Simulate audio speaking
    setVoiceState('speaking');
    setIsSpeakingMascot(true);
    setTimeout(() => {
      setVoiceState('idle');
      setIsSpeakingMascot(false);
    }, 2200);
  };

  const handleReplayAudio = (_slow = false) => {
    setIsSpeakingMascot(true);
    setTimeout(() => setIsSpeakingMascot(false), 2500);
  };

  return (
    <div className="min-h-full bg-[#FFFDF7] -m-4 sm:-m-6 lg:-m-8 p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8 font-sans antialiased text-slate-800">
      {/* 1. HERO SECTION */}
      <VoiceHero
        isListening={voiceState === 'listening'}
        onStartSpeaking={handleStartRecord}
      />

      {/* 2. LANGUAGE SELECTOR */}
      <LanguageSelector
        sourceLang={sourceLang}
        targetLang={currentLanguage}
        onSelectTarget={(code) => setCurrentLanguage(code as any)}
        onSwap={handleSwap}
        isOffline={isOffline}
      />

      {/* 3. VOICE RECORDER CARD */}
      <VoiceRecorder
        state={voiceState}
        onStartRecord={handleStartRecord}
        onStopRecord={handleStopRecord}
      />

      {/* 4. CLASSROOM PHRASE LIBRARY */}
      <PhraseLibrary onSelectPhrase={handleSelectPhrase} />

      {/* 5. TRANSLATION RESULT CARD */}
      <TranslationResult
        hindiText={activeHindi}
        santhaliText={activeSanthali}
        santhaliLatin={activeLatin}
        onReplayAudio={handleReplayAudio}
      />

      {/* 6. CONVERSATION MODE */}
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

      {/* 7. OFFLINE STATUS CARD */}
      <OfflineStatusCard />
    </div>
  );
};

export default VoiceTranslation;
