import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Clock, Star, RotateCcw, HelpCircle } from 'lucide-react';

export type LearningMode = 'today' | 'recent' | 'favorites' | 'practice' | 'quiz';

export interface LearningModeSelectorProps {
  currentMode: LearningMode;
  onSelectMode: (mode: LearningMode) => void;
  className?: string;
}

export const LearningModeSelector: React.FC<LearningModeSelectorProps> = ({
  currentMode = 'today',
  onSelectMode,
  className = '',
}) => {
  const modes = [
    { id: 'today', label: "Today's Words", icon: Sparkles, color: 'text-amber-600' },
    { id: 'recent', label: 'Recently Learned', icon: Clock, color: 'text-blue-600' },
    { id: 'favorites', label: 'Starred Favorites', icon: Star, color: 'text-yellow-600' },
    { id: 'practice', label: 'Practice Again', icon: RotateCcw, color: 'text-emerald-600' },
    { id: 'quiz', label: 'Mini Quiz Game', icon: HelpCircle, color: 'text-purple-600' },
  ] as const;

  return (
    <div className={`flex items-center gap-2 overflow-x-auto pb-2 pt-1 no-scrollbar ${className}`}>
      {modes.map((mode) => {
        const Icon = mode.icon;
        const isActive = currentMode === mode.id;
        return (
          <motion.button
            key={mode.id}
            whileTap={{ scale: 0.95 }}
            type="button"
            onClick={() => onSelectMode(mode.id as LearningMode)}
            className={`min-h-[44px] px-4 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 shrink-0 border ${
              isActive
                ? 'bg-[#2563EB] text-white border-blue-600 shadow-sm'
                : 'bg-white hover:bg-slate-50 text-slate-700 border-[#F1EFE8] shadow-2xs'
            }`}
          >
            <Icon size={16} className={isActive ? 'text-white' : mode.color} />
            <span>{mode.label}</span>
          </motion.button>
        );
      })}
    </div>
  );
};
