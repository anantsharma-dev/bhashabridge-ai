import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, Volume2, Star, RotateCcw, CheckCircle2, AlertCircle } from 'lucide-react';
import { pronunciationCoach, type PronunciationFeedback } from '../../services/pronunciationCoach';
import { speechRecognitionService } from '../../services/speechRecognition';
import { speechSynthesisService } from '../../services/speechSynthesis';
import { JoharHornbill } from '../ui/JoharHornbill';

export interface PronunciationCoachCardProps {
  targetPhrase: string;
  romanPhrase?: string;
  lang?: string;
  className?: string;
}

export const PronunciationCoachCard: React.FC<PronunciationCoachCardProps> = ({
  targetPhrase,
  romanPhrase,
  lang = 'santhali',
  className = '',
}) => {
  const [isListening, setIsListening] = useState(false);
  const [spokenText, setSpokenText] = useState('');
  const [feedback, setFeedback] = useState<PronunciationFeedback | null>(null);

  const handleHearTarget = () => {
    speechSynthesisService.speak(targetPhrase, lang, { slow: true });
  };

  const handleStartPractice = () => {
    setSpokenText('');
    setFeedback(null);
    setIsListening(true);

    speechRecognitionService.start(
      {
        onTranscript: (transcript, isFinal) => {
          setSpokenText(transcript);
          if (isFinal) {
            setIsListening(false);
            const res = pronunciationCoach.evaluate(targetPhrase, transcript);
            setFeedback(res);
          }
        },
        onSilenceDetected: () => {
          setIsListening(false);
        },
        onError: () => {
          setIsListening(false);
        },
        onEnd: () => {
          setIsListening(false);
        },
      },
      lang === 'hindi' ? 'hi-IN' : 'en-IN'
    );
  };

  const handleStopPractice = () => {
    speechRecognitionService.stop();
    setIsListening(false);
    if (spokenText) {
      const res = pronunciationCoach.evaluate(targetPhrase, spokenText);
      setFeedback(res);
    }
  };

  return (
    <div
      className={`rounded-[24px] bg-[#FFFDF7] border-2 border-amber-200/80 p-5 sm:p-6 shadow-sm space-y-4 ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-amber-100">
        <div className="flex items-center gap-2">
          <span className="w-8 h-8 rounded-full bg-amber-100 text-amber-800 font-bold flex items-center justify-center text-sm shadow-xs">
            🗣️
          </span>
          <div>
            <h4 className="text-sm font-extrabold text-slate-900 font-baloo">
              Pronunciation Coach • बोलकर अभ्यास करें
            </h4>
            <p className="text-[11px] text-amber-800 font-medium">
              Repeat after Johar for gentle pronunciation feedback
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={handleHearTarget}
            className="px-3 py-1.5 rounded-xl bg-white hover:bg-amber-50 text-amber-900 border border-amber-200 text-xs font-bold flex items-center gap-1.5 shadow-2xs cursor-pointer transition-colors"
          >
            <Volume2 size={14} className="text-amber-600" />
            <span>Hear First</span>
          </button>
        </div>
      </div>

      {/* Target Phrase Display */}
      <div className="p-3.5 rounded-2xl bg-white border border-amber-100 space-y-1">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
          Practice Phrase:
        </span>
        <p className="text-lg sm:text-xl font-extrabold text-slate-900 font-devanagari">
          {targetPhrase}
        </p>
        {romanPhrase && (
          <p className="text-xs text-amber-800 italic font-semibold">
            🗣️ {romanPhrase}
          </p>
        )}
      </div>

      {/* Mic Record Action */}
      <div className="flex flex-col items-center justify-center py-2 space-y-3">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.92 }}
          type="button"
          onClick={isListening ? handleStopPractice : handleStartPractice}
          className={`min-h-[48px] px-6 py-2.5 rounded-2xl font-bold text-xs flex items-center gap-2 cursor-pointer shadow-sm transition-all ${
            isListening
              ? 'bg-rose-500 hover:bg-rose-600 text-white animate-pulse'
              : 'bg-emerald-600 hover:bg-emerald-700 text-white'
          }`}
        >
          <Mic size={16} />
          <span>{isListening ? 'Listening... Tap to Done' : 'Press & Repeat Sentence'}</span>
        </motion.button>

        {isListening && (
          <p className="text-xs text-rose-600 font-medium animate-pulse">
            Johar is listening carefully to your pronunciation...
          </p>
        )}

        {spokenText && !feedback && !isListening && (
          <p className="text-xs text-slate-600 italic">
            You said: "{spokenText}"
          </p>
        )}
      </div>

      {/* Gentle Feedback Result */}
      <AnimatePresence>
        {feedback && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="p-4 rounded-2xl bg-[#F0FDF4] border border-emerald-200 space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex">
                  {[1, 2, 3].map((star) => (
                    <Star
                      key={star}
                      size={18}
                      className={
                        star <= feedback.stars
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-slate-300'
                      }
                    />
                  ))}
                </div>
                <span className="text-xs font-bold text-emerald-900">
                  {feedback.overallScore}% Match
                </span>
              </div>

              <JoharHornbill size="sm" waving={feedback.stars >= 2} />
            </div>

            <div className="space-y-1">
              <p className="text-xs font-extrabold text-emerald-950 font-devanagari">
                {feedback.feedbackHindi}
              </p>
              <p className="text-[11px] text-emerald-800">
                {feedback.feedbackMessage}
              </p>
            </div>

            {/* Word breakdown chips */}
            {feedback.wordBreakdown.length > 0 && (
              <div className="pt-2 border-t border-emerald-100 flex flex-wrap gap-1.5">
                {feedback.wordBreakdown.map((wb, idx) => (
                  <span
                    key={idx}
                    className={`px-2.5 py-1 rounded-xl text-xs font-bold flex items-center gap-1 ${
                      wb.isAccurate
                        ? 'bg-white text-emerald-800 border border-emerald-300'
                        : 'bg-amber-100 text-amber-900 border border-amber-300'
                    }`}
                  >
                    {wb.isAccurate ? (
                      <CheckCircle2 size={12} className="text-emerald-600" />
                    ) : (
                      <AlertCircle size={12} className="text-amber-600" />
                    )}
                    <span>{wb.word}</span>
                  </span>
                ))}
              </div>
            )}

            <div className="pt-1 flex justify-end">
              <button
                type="button"
                onClick={handleStartPractice}
                className="text-xs font-bold text-emerald-700 hover:text-emerald-900 flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw size={12} />
                <span>Try Again</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PronunciationCoachCard;
