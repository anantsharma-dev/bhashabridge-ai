import React, { useState } from 'react';
import {
  FlashcardHero,
  CategorySelector,
  FlashcardCard,
  type FlashcardData,
  LearningModeSelector,
  type LearningMode,
  MiniQuiz,
} from '../components/flashcards';
import {
  CuteElephant,
  CuteMango,
  CountingBlocks,
  StoryBook,
} from '../components/ui';

export const Flashcards: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('animals');
  const [activeMode, setActiveMode] = useState<LearningMode>('today');
  const [xp, setXp] = useState(160);

  // Sample Bilingual Flashcards
  const sampleCards: FlashcardData[] = [
    {
      id: 'elephant',
      hindi: 'हाथी',
      santhali: 'ᱦᱟᱹᱛᱤ',
      santhaliLatin: 'Hati',
      english: 'Elephant',
      category: 'Animals',
      illustration: <CuteElephant size={105} />,
      sampleSentenceHindi: 'हाथी बहुत बड़ा और शक्तिशाली पशु है।',
      sampleSentenceSanthali: 'ᱦᱟᱹᱛᱤ ᱫᱚ ᱟᱹᱰᱤ ᱢᱟᱨᱟᱝ ᱡᱤᱵᱽ ᱠᱟᱱᱟᱭ ᱾',
      isMastered: true,
    },
    {
      id: 'mango',
      hindi: 'आम',
      santhali: 'ᱩᱞ',
      santhaliLatin: 'Ul',
      english: 'Mango',
      category: 'Fruits',
      illustration: <CuteMango size={105} />,
      sampleSentenceHindi: 'मीठा रसीला आम झारखंड में खूब फलता है।',
      sampleSentenceSanthali: 'ᱦᱮᱲᱮᱢ ᱩᱞ ᱫᱚ ᱡᱚᱛᱚ ᱠᱷᱚᱱ ᱵᱷᱟᱹᱜᱤ ᱡᱚ ᱠᱟᱱᱟ ᱾',
      isMastered: true,
    },
    {
      id: 'numbers',
      hindi: 'गिनती',
      santhali: 'ᱮᱞ',
      santhaliLatin: 'El',
      english: 'Numbers (1, 2, 3)',
      category: 'Numbers',
      illustration: <CountingBlocks size={105} />,
      sampleSentenceHindi: 'चलो साथ मिलकर दस तक गिनती गिनें।',
      sampleSentenceSanthali: 'ᱪᱮᱞᱟᱵᱚᱱ ᱢᱤᱫ ᱥᱟᱶᱛᱮ ᱜᱮᱞ ᱦᱟᱹᱵᱤᱡ ᱞᱮᱠᱷᱟᱭᱟ ᱾',
      isMastered: false,
    },
    {
      id: 'book',
      hindi: 'किताब',
      santhali: 'ᱯᱩᱛᱷᱤ',
      santhaliLatin: 'Puthi',
      english: 'Story Book',
      category: 'School',
      illustration: <StoryBook size={105} />,
      sampleSentenceHindi: 'आज हम अच्छी कहानियों की किताब पढ़ेंगे।',
      sampleSentenceSanthali: 'ᱛᱮᱦᱮᱧ ᱫᱚ ᱵᱚᱱ ᱠᱟᱹᱦᱱᱤ ᱯᱩᱛᱷᱤ ᱯᱟᱲᱦᱟᱣᱟ ᱾',
      isMastered: false,
    },
  ];

  const handlePlayAudio = (_card: FlashcardData, _slow = false) => {
    // Reward small XP for listening to native pronunciation
    setXp((prev) => Math.min(200, prev + 5));
  };

  return (
    <div className="min-h-full bg-[#FFFDF7] -m-4 sm:-m-6 lg:-m-8 p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8 font-sans antialiased text-slate-800">
      {/* 1. HERO SECTION WITH MASCOT & DAILY XP */}
      <FlashcardHero
        xpCurrent={xp}
        xpGoal={200}
        streakDays={7}
        starsCount={45}
        masteredCount={12}
        totalWords={16}
      />

      {/* 2. THEMATIC CATEGORY SELECTOR CAROUSEL (14 Categories) */}
      <CategorySelector
        activeCategory={activeCategory}
        onSelectCategory={(id) => setActiveCategory(id)}
      />

      {/* 3. LEARNING MODE CHIPS FILTER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <LearningModeSelector
          currentMode={activeMode}
          onSelectMode={(mode) => setActiveMode(mode)}
        />
        <span className="text-xs font-bold text-slate-500 shrink-0">
          Showing 4 of 16 Cards in <strong>{activeCategory.toUpperCase()}</strong>
        </span>
      </div>

      {/* 4. FLASHCARDS GRID OR MINI QUIZ GAME */}
      {activeMode === 'quiz' ? (
        <MiniQuiz onCompleteQuiz={(score) => setXp((prev) => prev + score)} />
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {sampleCards.map((card) => (
              <FlashcardCard
                key={card.id}
                card={card}
                onPlayAudio={handlePlayAudio}
              />
            ))}
          </div>

          {/* Practice Mini Quiz CTA card */}
          <div className="p-5 rounded-[24px] bg-[#FAF5FF] border border-purple-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center sm:text-left">
              <h4 className="text-base font-extrabold text-purple-950 font-baloo">
                Ready to test today's animal vocabulary?
              </h4>
              <p className="text-xs text-purple-800">
                Play the 2-minute picture matching quiz and win <strong>+20 XP</strong>!
              </p>
            </div>
            <button
              type="button"
              onClick={() => setActiveMode('quiz')}
              className="min-h-[44px] px-6 py-2.5 rounded-2xl bg-[#8B5CF6] hover:bg-purple-700 text-white font-bold text-xs shadow-sm cursor-pointer transition-colors shrink-0"
            >
              Start Mini Quiz 🎮
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Flashcards;
