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
import { flashcardService } from '../services/flashcardService';
import { useFavoritesStore } from '../services/favoritesStore';
import { audioService } from '../services/audioService';

export const Flashcards: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('animals');
  const [activeMode, setActiveMode] = useState<LearningMode>('today');
  const [xp, setXp] = useState(160);

  const {
    favoriteCardIds,
    masteredCardIds,
    toggleFavoriteCard,
    toggleMasteredCard,
    isCardMastered,
  } = useFavoritesStore();

  const rawCards = flashcardService.getCardsByCategory(activeCategory);
  const displayedCards = flashcardService
    .filterCardsByMode(rawCards, activeMode, favoriteCardIds, masteredCardIds)
    .map((c) => ({
      ...c,
      isMastered: isCardMastered(c.id),
    }));

  const handlePlayAudio = (card: FlashcardData, slow = false) => {
    // Reward small XP for listening to native pronunciation
    setXp((prev) => Math.min(200, prev + 5));
    audioService.playTranslation(card.hindi, 'hindi', { slow });
  };

  const handleToggleFav = (id: string) => {
    toggleFavoriteCard(id);
  };

  return (
    <div className="min-h-full bg-[#FFFDF7] -m-4 sm:-m-6 lg:-m-8 p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8 font-sans antialiased text-slate-800">
      {/* 1. HERO SECTION WITH MASCOT & DAILY XP */}
      <FlashcardHero
        xpCurrent={xp}
        xpGoal={200}
        streakDays={7}
        starsCount={45}
        masteredCount={masteredCardIds.length}
        totalWords={rawCards.length > 0 ? rawCards.length : 16}
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
          Showing {displayedCards.length} of {rawCards.length} Cards in <strong>{activeCategory.toUpperCase()}</strong>
        </span>
      </div>

      {/* 4. FLASHCARDS GRID OR MINI QUIZ GAME */}
      {activeMode === 'quiz' ? (
        <MiniQuiz
          category={activeCategory}
          onCompleteQuiz={(score) => setXp((prev) => prev + score)}
        />
      ) : (
        <div className="space-y-4">
          {displayedCards.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-3xl border border-slate-200 text-slate-500 space-y-2">
              <p className="font-bold text-base">No flashcards found in this filter</p>
              <p className="text-xs text-slate-400">
                Try switching learning modes or select another category above.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {displayedCards.map((card) => (
                <FlashcardCard
                  key={card.id}
                  card={card}
                  onPlayAudio={handlePlayAudio}
                  onToggleFavorite={handleToggleFav}
                />
              ))}
            </div>
          )}

          {/* Practice Mini Quiz CTA card */}
          <div className="p-5 rounded-[24px] bg-[#FAF5FF] border border-purple-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center sm:text-left">
              <h4 className="text-base font-extrabold text-purple-950 font-baloo">
                Ready to test today's {activeCategory} vocabulary?
              </h4>
              <p className="text-xs text-purple-800">
                Play the 2-minute picture matching quiz and win <strong>+20 XP</strong>!
              </p>
            </div>
            <div className="flex items-center gap-2">
              {displayedCards.length > 0 && (
                <button
                  type="button"
                  onClick={() => toggleMasteredCard(displayedCards[0].id)}
                  className="min-h-[44px] px-4 py-2.5 rounded-2xl bg-white hover:bg-purple-50 text-purple-800 border border-purple-300 font-bold text-xs cursor-pointer transition-colors"
                >
                  Mark Mastered ✓
                </button>
              )}
              <button
                type="button"
                onClick={() => setActiveMode('quiz')}
                className="min-h-[44px] px-6 py-2.5 rounded-2xl bg-[#8B5CF6] hover:bg-purple-700 text-white font-bold text-xs shadow-sm cursor-pointer transition-colors shrink-0"
              >
                Start Mini Quiz 🎮
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Flashcards;
