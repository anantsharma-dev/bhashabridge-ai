import React from 'react';
import { motion } from 'framer-motion';
import { Mic, Sparkles, Volume2 } from 'lucide-react';
import { JoharHornbill } from '../ui/JoharHornbill';

export interface VoiceHeroProps {
  onStartSpeaking?: () => void;
  isListening?: boolean;
  className?: string;
}

export const VoiceHero: React.FC<VoiceHeroProps> = ({
  onStartSpeaking,
  isListening = false,
  className = '',
}) => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`rounded-[24px] bg-gradient-to-br from-[#FFFDF7] via-[#FFF8EB] to-[#FEF3C7]/40 border border-[#FED7AA]/70 p-6 sm:p-8 shadow-[0_4px_24px_rgba(245,158,11,0.07)] relative overflow-hidden ${className}`}
    >
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 sm:gap-8">
        {/* Left: Text & CTA */}
        <div className="space-y-4 max-w-xl text-left">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#EFF6FF] text-blue-900 border border-blue-200">
              <Sparkles size={13} className="text-blue-600" />
              Live Speech-to-Speech
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#ECFDF5] text-emerald-800 border border-emerald-200">
              <Volume2 size={13} className="text-emerald-600" />
              Bilingual Audio Assistant
            </span>
          </div>

          <div className="space-y-1.5">
            <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-baloo leading-tight">
              Let's Speak Together!
            </h1>
            <p className="text-base sm:text-lg text-slate-700 font-devanagari font-medium">
              आओ मिलकर बोलें! • ᱪᱮᱞᱟᱵᱚᱱ ᱨᱚᱯᱚᱲᱟ!
            </p>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-sans pt-1">
              Hindi ↔ Santali classroom conversations made easy with instant offline speech translation.
            </p>
          </div>

          {/* Large Rounded Start Speaking Button (Min 48px height) */}
          <div className="pt-2">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.96 }}
              type="button"
              onClick={onStartSpeaking}
              className={`min-h-[52px] px-8 py-3.5 rounded-2xl font-bold text-base shadow-md flex items-center gap-3 cursor-pointer transition-colors ${
                isListening
                  ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-500/20 animate-pulse'
                  : 'bg-[#2563EB] hover:bg-blue-700 text-white shadow-blue-500/20'
              }`}
              aria-label="Start Speaking Button"
            >
              <Mic size={20} className={isListening ? 'animate-bounce' : ''} />
              <span>{isListening ? 'Listening to Classroom...' : 'Start Speaking'}</span>
            </motion.button>
          </div>
        </div>

        {/* Right: Mascot Illustration */}
        <div className="shrink-0 flex items-center justify-center">
          <JoharHornbill
            size="hero"
            waving={true}
            speechBubble={isListening ? "I'm listening! 👂" : "Say something in Hindi! 🎙️"}
            className="transform hover:scale-105 transition-transform"
          />
        </div>
      </div>
    </motion.section>
  );
};
