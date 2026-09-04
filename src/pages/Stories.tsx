import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Volume2, BookOpen, Sparkles } from 'lucide-react';
import {
  StoryHero,
  StoryCategoryGrid,
  StoryReader,
  ReadingAssistant,
  ReadingProgressCard,
} from '../components/stories';
import { audioService } from '../services/audioService';
import { storiesService } from '../services/storiesService';
import { speechSynthesisService } from '../services/speechSynthesis';

const GLOSSARY_TERMS = [
  { santhali: 'ᱦᱟᱹᱛᱤ', roman: 'Hati', hindi: 'हाथी', english: 'Elephant' },
  { santhali: 'ᱛᱟᱹᱨᱩᱵ', roman: 'Tarub', hindi: 'बाघ', english: 'Tiger' },
  { santhali: 'ᱢᱟᱹᱛᱠᱚᱢ', roman: 'Matkom', hindi: 'महुआ', english: 'Mahua Tree' },
  { santhali: 'ᱵᱤᱨ', roman: 'Bir', hindi: 'जंगल', english: 'Forest' },
  { santhali: 'ᱪᱮᱬᱮ', roman: 'Chene', hindi: 'चिड़िया', english: 'Bird' },
  { santhali: 'ᱢᱟᱨᱟᱜ', roman: 'Marag', hindi: 'मोर', english: 'Peacock' },
  { santhali: 'ᱯᱩᱛᱷᱤ', roman: 'Puthi', hindi: 'किताब', english: 'Book' },
  { santhali: 'ᱟᱥᱲᱟ', roman: 'Asra', hindi: 'स्कूल', english: 'School' },
  { santhali: 'ᱢᱟᱪᱮᱛ', roman: 'Machet', hindi: 'शिक्षक', english: 'Teacher' },
  { santhali: 'ᱫᱟᱜ', roman: 'Dag', hindi: 'पानी / बारिश', english: 'Water / Rain' },
];

export const Stories: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('folk');
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);
  const [activeWordIdx, setActiveWordIdx] = useState(0);
  const [isGlossaryOpen, setIsGlossaryOpen] = useState(false);

  const activeStories = storiesService.getStoriesByCategory(activeCategory);
  const activeStory = activeStories[0] || storiesService.getAllStories()[0];

  const handleTogglePlay = () => {
    if (isPlaying) {
      audioService.stopAudio();
      setIsPlaying(false);
      return;
    }

    setIsPlaying(true);
    const textToRead = activeStory?.pages[0]?.paragraphHindi || 'एक समय की बात है, दलमा के घने जंगल में एक बड़ा हाथी रहता था।';

    audioService.playTranslation(textToRead, 'hindi', {
      slow: playbackSpeed < 1,
      onEnd: () => {
        setIsPlaying(false);
        setActiveWordIdx(0);
      },
    });

    const interval = setInterval(() => {
      setActiveWordIdx((prev) => {
        if (prev >= 14 || !audioService.getIsPlaying()) {
          clearInterval(interval);
          setIsPlaying(false);
          return 0;
        }
        return prev + 1;
      });
    }, (500 / playbackSpeed));
  };

  return (
    <div className="min-h-full bg-[#FFFDF7] -m-4 sm:-m-6 lg:-m-8 p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8 font-sans antialiased text-slate-800">
      {/* 1. HERO WITH MASCOT UNDER TREE */}
      <StoryHero onContinueReading={handleTogglePlay} />

      {/* 2. AUDIO ASSISTANT CONTROLS */}
      <ReadingAssistant
        isPlaying={isPlaying}
        onTogglePlay={handleTogglePlay}
        speed={playbackSpeed}
        onChangeSpeed={(spd) => setPlaybackSpeed(spd)}
        onRepeatSentence={() => setActiveWordIdx(0)}
        onOpenDictionary={() => setIsGlossaryOpen(true)}
      />

      {/* 3. INTERACTIVE STORY READER WITH KARAOKE HIGHLIGHTING */}
      <StoryReader
        story={activeStory}
        storyTitle={`${activeStory.titleHindi} • ${activeStory.titleSanthali}`}
        isPlaying={isPlaying}
        activeWordIndex={activeWordIdx}
        onWordClick={(w) => console.log('Tapped word:', w)}
        onFinishStory={() => setIsPlaying(false)}
      />

      {/* 4. THEMATIC STORY CATEGORIES (8 MODULES) */}
      <StoryCategoryGrid
        activeCategory={activeCategory}
        onSelectCategory={(id) => setActiveCategory(id)}
      />

      {/* 5. READING PROGRESS & METRICS */}
      <ReadingProgressCard
        booksCompleted={6}
        minutesRead={48}
        wordsLearned={32}
        daysActive={4}
      />

      {/* 6. BILINGUAL CLASSROOM GLOSSARY MODAL */}
      <AnimatePresence>
        {isGlossaryOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="w-full max-w-2xl bg-white rounded-[28px] border border-[#F1EFE8] shadow-2xl p-6 sm:p-8 space-y-6 max-h-[85vh] flex flex-col"
            >
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 shrink-0">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-2xl bg-blue-100 flex items-center justify-center text-blue-700">
                    <BookOpen size={20} />
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 font-baloo">
                      Classroom Glossary • कक्षा शब्दकोश
                    </h3>
                    <p className="text-xs text-slate-500 font-medium">
                      Santali (Ol Chiki) ↔ Hindi ↔ English Vocabulary
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsGlossaryOpen(false)}
                  className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center cursor-pointer"
                  aria-label="Close glossary"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="overflow-y-auto flex-1 pr-1 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {GLOSSARY_TERMS.map((term, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-2xl bg-[#FFFDF7] border border-[#F1EFE8] hover:border-blue-200 transition-all flex items-center justify-between gap-3 shadow-2xs"
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-bold text-emerald-800 font-olchiki">
                            {term.santhali}
                          </span>
                          <span className="text-xs text-slate-500 italic">
                            ({term.roman})
                          </span>
                        </div>
                        <p className="text-sm font-semibold text-slate-800 font-devanagari">
                          {term.hindi}
                        </p>
                        <p className="text-xs text-slate-400 font-medium font-heading">
                          {term.english}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => speechSynthesisService.speak(term.santhali, 'santhali')}
                        className="w-9 h-9 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 flex items-center justify-center shrink-0 cursor-pointer shadow-2xs"
                        aria-label={`Pronounce ${term.hindi}`}
                      >
                        <Volume2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 shrink-0">
                <span className="flex items-center gap-1 font-medium">
                  <Sparkles size={14} className="text-amber-500" /> Tap speaker icon to hear authentic pronunciation
                </span>
                <button
                  type="button"
                  onClick={() => setIsGlossaryOpen(false)}
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold cursor-pointer"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Stories;
