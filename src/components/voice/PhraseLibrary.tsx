import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Sparkles } from 'lucide-react';

export interface PhraseItem {
  id: string;
  hindi: string;
  santhali: string;
  santhaliLatin: string;
  category: string;
  color: string;
}

export interface PhraseLibraryProps {
  onSelectPhrase: (phrase: PhraseItem) => void;
  className?: string;
}

export const PhraseLibrary: React.FC<PhraseLibraryProps> = ({
  onSelectPhrase,
  className = '',
}) => {
  const phrases: PhraseItem[] = [
    {
      id: 'johar',
      hindi: 'नमस्ते (जोहार)',
      santhali: 'ᱡᱚᱦᱟᱨ',
      santhaliLatin: 'Johar',
      category: 'Greeting',
      color: 'bg-[#FFFBEB] hover:bg-[#FEF3C7] border-amber-200 text-amber-950',
    },
    {
      id: 'morning',
      hindi: 'सुप्रभात',
      santhali: 'ᱥᱟᱹᱜᱩᱱ ᱥᱮᱛᱟᱜ',
      santhaliLatin: 'Sagun setag',
      category: 'Greeting',
      color: 'bg-[#EFF6FF] hover:bg-[#DBEAFE] border-blue-200 text-blue-950',
    },
    {
      id: 'sit',
      hindi: 'सभी बच्चे साथ बैठो',
      santhali: 'ᱫᱩᱲᱩᱵ ᱢᱮ',
      santhaliLatin: 'Durub me',
      category: 'Command',
      color: 'bg-[#F0FDF4] hover:bg-[#DCFCE7] border-emerald-200 text-emerald-950',
    },
    {
      id: 'notebook',
      hindi: 'अपनी कॉपी खोलो',
      santhali: 'ᱠᱷᱟᱛᱟ ᱡᱷᱤᱡᱽ ᱢᱮ',
      santhaliLatin: 'Khata jhij me',
      category: 'Command',
      color: 'bg-[#FAF5FF] hover:bg-[#F3E8FF] border-purple-200 text-purple-950',
    },
    {
      id: 'count',
      hindi: 'एक से दस तक गिनो',
      santhali: 'ᱜᱮᱞ ᱦᱟᱹᱵᱤᱡ ᱞᱮᱠᱷᱟᱭ ᱢᱮ',
      santhaliLatin: 'Gel habij lekhay me',
      category: 'Math',
      color: 'bg-[#FFF7ED] hover:bg-[#FFEDD5] border-orange-200 text-orange-950',
    },
    {
      id: 'read',
      hindi: 'धीरे-धीरे पढ़ो',
      santhali: 'ᱵᱟᱹᱭ ᱵᱟᱹᱭ ᱛᱮ ᱯᱟᱲᱦᱟᱣ ᱢᱮ',
      santhaliLatin: 'Bay bay te parhaw me',
      category: 'Reading',
      color: 'bg-[#EFF6FF] hover:bg-[#DBEAFE] border-blue-200 text-blue-950',
    },
    {
      id: 'write',
      hindi: 'यहाँ सुंदर लिखो',
      santhali: 'ᱱᱚᱸᱰᱮ ᱚᱞ ᱢᱮ',
      santhaliLatin: 'Nonde ol me',
      category: 'Writing',
      color: 'bg-[#FEFCE8] hover:bg-[#FEF08A] border-yellow-200 text-yellow-950',
    },
  ];

  return (
    <div
      className={`rounded-[24px] bg-white border border-[#F1EFE8] p-5 sm:p-6 shadow-[0_4px_20px_rgba(0,0,0,0.04)] space-y-3 ${className}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BookOpen size={18} className="text-amber-600" />
          <h3 className="text-base font-extrabold text-slate-900 font-baloo">
            Classroom Phrase Library
          </h3>
          <span className="text-xs font-semibold text-slate-500 font-devanagari hidden sm:inline">
            (कक्षा के लिए त्वरित वाक्य)
          </span>
        </div>
        <span className="text-xs text-blue-600 font-bold flex items-center gap-1">
          <Sparkles size={12} /> Tap phrase to speak
        </span>
      </div>

      {/* Horizontal Scrollable Colorful Chips */}
      <div className="flex items-center gap-2.5 overflow-x-auto pb-2 pt-1 no-scrollbar">
        {phrases.map((phrase) => (
          <motion.button
            key={phrase.id}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.95 }}
            type="button"
            onClick={() => onSelectPhrase(phrase)}
            className={`min-h-[48px] px-4 py-2 rounded-2xl border text-left shrink-0 cursor-pointer shadow-2xs transition-all ${phrase.color}`}
          >
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold font-devanagari">
                {phrase.hindi}
              </span>
              <span className="text-xs font-bold font-olchiki opacity-85">
                • {phrase.santhali}
              </span>
            </div>
            <span className="text-[10px] text-slate-500 font-medium block">
              {phrase.santhaliLatin}
            </span>
          </motion.button>
        ))}
      </div>
    </div>
  );
};
