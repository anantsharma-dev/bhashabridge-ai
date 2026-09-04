import React from 'react';
import { motion } from 'framer-motion';
import { HardDrive, WifiOff, Sparkles } from 'lucide-react';
import { JoharHornbill } from '../ui/JoharHornbill';

export interface LibraryHeroProps {
  usedStorage?: string;
  totalStorage?: string;
  className?: string;
}

export const LibraryHero: React.FC<LibraryHeroProps> = ({
  usedStorage = '1.2 GB',
  totalStorage = '16.0 GB',
  className = '',
}) => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className={`rounded-[24px] bg-gradient-to-br from-[#FFFDF7] via-[#FFF9EE] to-[#FEF3C7]/40 border border-[#FED7AA]/70 p-6 sm:p-8 shadow-[0_4px_24px_rgba(245,158,11,0.07)] relative overflow-hidden ${className}`}
    >
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 sm:gap-8">
        <div className="space-y-4 max-w-xl text-left">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#ECFDF5] text-emerald-900 border border-emerald-200 shadow-2xs">
              <WifiOff size={13} className="text-emerald-600" />
              100% Offline Classroom Storage
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#EFF6FF] text-blue-900 border border-blue-200 shadow-2xs">
              <Sparkles size={13} className="text-blue-600" />
              Pre-loaded FLN Curriculum
            </span>
          </div>

          <div className="space-y-1.5">
            <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-baloo leading-tight">
              Your Offline Classroom Library
            </h1>
            <p className="text-base sm:text-lg text-slate-700 font-devanagari font-medium">
              ऑफ़लाइन शिक्षण सामग्री संग्रह • ᱵᱤᱱ-ᱤᱱᱴᱟᱨᱱᱮᱴ ᱯᱩᱛᱷᱤ ᱵᱟᱠᱷᱚᱞ
            </p>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-sans">
              All stories, printable worksheets, bilingual flashcards, Piper audio voice packs, and AI models work without any internet connection.
            </p>
          </div>

          {/* Storage Bar Pill */}
          <div className="p-3.5 rounded-2xl bg-white/90 border border-amber-200/80 max-w-md space-y-1.5">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-slate-700 flex items-center gap-1.5">
                <HardDrive size={14} className="text-amber-600" />
                Tablet Internal Storage
              </span>
              <span className="text-amber-900 font-baloo text-sm">
                {usedStorage} Used / {totalStorage} Total
              </span>
            </div>
            <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden p-0.5">
              <div
                className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-emerald-500"
                style={{ width: '8.5%' }}
              />
            </div>
          </div>
        </div>

        {/* Right: Johar mascot carrying books */}
        <div className="shrink-0 flex items-center justify-center">
          <JoharHornbill
            size="hero"
            waving={true}
            speechBubble="Books ready offline! 📚"
            className="transform hover:scale-105 transition-transform"
          />
        </div>
      </div>
    </motion.section>
  );
};
