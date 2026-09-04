import { Play, Pause, RotateCcw, Snail, Book } from 'lucide-react';

export interface ReadingAssistantProps {
  isPlaying: boolean;
  onTogglePlay: () => void;
  speed: number;
  onChangeSpeed: (newSpeed: number) => void;
  onRepeatSentence: () => void;
  onOpenDictionary: () => void;
  className?: string;
}

export const ReadingAssistant: React.FC<ReadingAssistantProps> = ({
  isPlaying,
  onTogglePlay,
  speed = 1.0,
  onChangeSpeed,
  onRepeatSentence,
  onOpenDictionary,
  className = '',
}) => {
  return (
    <div
      className={`rounded-[24px] bg-[#EFF6FF] border border-blue-200 p-4 sm:p-5 shadow-xs flex flex-wrap items-center justify-between gap-4 select-none ${className}`}
    >
      {/* Left: Play/Pause Primary Action */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onTogglePlay}
          className="w-12 h-12 rounded-2xl bg-[#2563EB] hover:bg-blue-700 text-white flex items-center justify-center shadow-md cursor-pointer transition-colors"
          aria-label={isPlaying ? 'Pause reading' : 'Play reading'}
        >
          {isPlaying ? <Pause size={20} className="fill-white" /> : <Play size={20} className="fill-white ml-0.5" />}
        </button>

        <div className="space-y-0.5">
          <h4 className="text-sm font-extrabold text-blue-950 font-baloo">
            {isPlaying ? 'Reading in Progress...' : 'Audio Read Along Buddy'}
          </h4>
          <p className="text-xs text-blue-800/80 font-medium">
            Natural Piper Voice Model • Synchronized highlighting
          </p>
        </div>
      </div>

      {/* Right Controls: Speed, Repeat, Dictionary */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Speed Toggle (Normal 1.0x vs Slow 0.75x) */}
        <button
          type="button"
          onClick={() => onChangeSpeed(speed === 1.0 ? 0.75 : 1.0)}
          className="min-h-[44px] px-3.5 py-2 rounded-xl bg-white hover:bg-blue-50 text-blue-900 border border-blue-200 font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-2xs"
          aria-label="Toggle playback speed"
        >
          <Snail size={16} className="text-blue-600" />
          <span>Speed: {speed}x</span>
        </button>

        {/* Repeat Sentence */}
        <button
          type="button"
          onClick={onRepeatSentence}
          className="min-h-[44px] px-3.5 py-2 rounded-xl bg-white hover:bg-blue-50 text-blue-900 border border-blue-200 font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-2xs"
          aria-label="Repeat current sentence"
        >
          <RotateCcw size={15} />
          <span>Repeat</span>
        </button>

        {/* Dictionary Popup */}
        <button
          type="button"
          onClick={onOpenDictionary}
          className="min-h-[44px] px-3.5 py-2 rounded-xl bg-white hover:bg-blue-50 text-blue-900 border border-blue-200 font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-2xs"
          aria-label="Open bilingual dictionary"
        >
          <Book size={15} />
          <span>Glossary</span>
        </button>
      </div>
    </div>
  );
};
