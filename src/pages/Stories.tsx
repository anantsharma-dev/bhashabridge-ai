import React, { useState } from 'react';
import {
  StoryHero,
  StoryCategoryGrid,
  StoryReader,
  ReadingAssistant,
  ReadingProgressCard,
} from '../components/stories';

export const Stories: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('folk');
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);
  const [activeWordIdx, setActiveWordIdx] = useState(0);

  const handleTogglePlay = () => {
    setIsPlaying(!isPlaying);
    if (!isPlaying) {
      // Advance word highlighting
      const interval = setInterval(() => {
        setActiveWordIdx((prev) => {
          if (prev >= 14) {
            clearInterval(interval);
            setIsPlaying(false);
            return 0;
          }
          return prev + 1;
        });
      }, 500 / playbackSpeed);
    }
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
        onOpenDictionary={() => alert('Opening Santhali-Hindi Classroom Dictionary...')}
      />

      {/* 3. INTERACTIVE STORY READER WITH KARAOKE HIGHLIGHTING */}
      <StoryReader
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
    </div>
  );
};

export default Stories;
