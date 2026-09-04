import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Sparkles, WifiOff, HelpCircle } from 'lucide-react';
import type { LanguageCode, TranslationHistoryItem, TranslationResult } from '../types/translation';
import { translationService } from '../services/translationService';
import { geminiTranslationService } from '../services/ai/geminiTranslationService';
import { speechSynthesisService } from '../services/speechSynthesis';
import { PronunciationCoachCard } from '../components/voice/PronunciationCoachCard';
import {
  LanguagePills,
  TranslationInputCard,
  TranslationOutputCard,
  TranslationHistory,
  FavoritePhrases,
} from '../components/translation';

export const TextTranslation: React.FC = () => {
  const [sourceLang, setSourceLang] = useState<LanguageCode>('hindi');
  const [targetLang, setTargetLang] = useState<LanguageCode>('santhali');
  const [inputText, setInputText] = useState('');
  const [result, setResult] = useState<TranslationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState<TranslationHistoryItem[]>(() => translationService.getHistory());
  const [favorites, setFavorites] = useState<TranslationHistoryItem[]>(() => translationService.getFavorites());

  const handleTranslate = async () => {
    if (!inputText.trim()) return;
    setIsLoading(true);

    try {
      const res = await geminiTranslationService.translate(inputText, sourceLang, targetLang);
      setResult(res);
      setHistory(translationService.getHistory());
    } catch {
      const res = translationService.translateText(inputText, sourceLang, targetLang);
      setResult(res);
      setHistory(translationService.getHistory());
    } finally {
      setIsLoading(false);
    }
  };

  const handleSwap = async () => {
    const [newSource, newTarget] = translationService.swapLanguages(sourceLang, targetLang);
    setSourceLang(newSource);
    setTargetLang(newTarget);

    if (result && result.translatedText) {
      setInputText(result.translatedText);
      try {
        const res = await geminiTranslationService.translate(result.translatedText, newSource, newTarget);
        setResult(res);
      } catch {
        const res = translationService.translateText(result.translatedText, newSource, newTarget);
        setResult(res);
      }
    }
  };

  const handleToggleFavorite = (id: string) => {
    const updated = translationService.toggleFavorite(id);
    setHistory([...updated]);
    setFavorites(translationService.getFavorites());
  };

  const handleClearHistory = () => {
    translationService.clearHistory();
    setHistory([]);
  };

  const handleSelectHistory = (item: TranslationHistoryItem) => {
    setInputText(item.sourceText);
    setSourceLang(item.sourceLang);
    setTargetLang(item.targetLang);
    setResult({
      id: item.id,
      sourceText: item.sourceText,
      sourceLang: item.sourceLang,
      targetLang: item.targetLang,
      translatedText: item.translatedText,
      romanPronunciation: item.romanPronunciation,
      confidence: 0.98,
      timestamp: item.timestamp,
    });
  };

  const handleSampleClick = async (sampleText: string) => {
    setInputText(sampleText);
    setSourceLang('hindi');
    setTargetLang('santhali');
    setIsLoading(true);

    try {
      const res = await geminiTranslationService.translate(sampleText, 'hindi', 'santhali');
      setResult(res);
      setHistory(translationService.getHistory());
    } catch {
      const res = translationService.translateText(sampleText, 'hindi', 'santhali');
      setResult(res);
      setHistory(translationService.getHistory());
    } finally {
      setIsLoading(false);
    }
  };

  const handlePlayAudio = (text: string, lang: LanguageCode, slow: boolean = false) => {
    speechSynthesisService.speak(text, lang, { slow });
  };

  const isCurrentFavorite = result ? favorites.some((f) => f.id === result.id) : false;

  return (
    <div className="min-h-screen bg-[#FFFDF7] p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/90 backdrop-blur-md p-6 rounded-[28px] border-2 border-emerald-100 shadow-sm"
      >
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-2xl bg-emerald-100 text-emerald-800">
              <BookOpen size={24} />
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Classroom Text Translation
            </h1>
          </div>
          <p className="text-sm font-semibold text-slate-600">
            पाठ अनुवाद • Instant offline MTB-MLE translation between Hindi and Jharkhand tribal languages
          </p>
        </div>

        {/* Offline Badge & Tips */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold shadow-xs">
            <WifiOff size={14} className="text-emerald-600" />
            <span>100% Offline Active</span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-amber-50 text-amber-900 border border-amber-200 text-xs font-bold shadow-xs">
            <Sparkles size={14} className="text-amber-600" />
            <span>SCERT Grade 1–5 Vocab</span>
          </div>
        </div>
      </motion.div>

      {/* Language Selector Pills */}
      <LanguagePills
        sourceLang={sourceLang}
        targetLang={targetLang}
        onSelectSource={setSourceLang}
        onSelectTarget={setTargetLang}
        onSwap={handleSwap}
      />

      {/* Main Dual Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        {/* Left: Input */}
        <TranslationInputCard
          inputText={inputText}
          onChangeInput={setInputText}
          onTranslate={handleTranslate}
          onClear={() => setInputText('')}
          sourceLang={sourceLang}
          isLoading={isLoading}
        />

        {/* Right: Output */}
        <TranslationOutputCard
          result={result}
          targetLang={targetLang}
          isLoading={isLoading}
          onPlayAudio={handlePlayAudio}
          onToggleFavorite={handleToggleFavorite}
          isFavorite={isCurrentFavorite}
          onSampleClick={handleSampleClick}
        />
      </div>

      {/* Pronunciation Coach for Spoken Practice */}
      {result && result.translatedText && (
        <PronunciationCoachCard
          targetPhrase={result.translatedText}
          romanPhrase={result.romanPronunciation}
          lang={targetLang}
        />
      )}

      {/* Favorite Phrases Section */}
      <FavoritePhrases
        favorites={favorites}
        onSelect={handleSelectHistory}
        onPlayAudio={(text, lang) => handlePlayAudio(text, lang, false)}
        onToggleFavorite={handleToggleFavorite}
      />

      {/* Translation History Section */}
      <TranslationHistory
        history={history}
        onSelect={handleSelectHistory}
        onToggleFavorite={handleToggleFavorite}
        onClearHistory={handleClearHistory}
      />

      {/* Bottom Educational Hint */}
      <div className="p-4 rounded-2xl bg-blue-50/80 border border-blue-200 flex items-center gap-3 text-xs text-blue-900">
        <HelpCircle size={18} className="text-blue-600 shrink-0" />
        <p>
          <span className="font-bold">Teacher Tip:</span> Use the romanized pronunciation guide in Ol Chiki to practice reading aloud together with primary grade students before switching to script writing.
        </p>
      </div>
    </div>
  );
};

export default TextTranslation;
