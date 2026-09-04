import React from 'react';
import { motion } from 'framer-motion';
import { mascotTokens } from './theme';
import { cn } from '../../utils/utils';

export type MascotMood = 'happy' | 'listening' | 'explaining' | 'celebrating';
export type MascotSize = 'sm' | 'md' | 'lg' | 'hero';

export interface JoharMascotProps {
  mood?: MascotMood;
  size?: MascotSize;
  dialogue?: string;
  className?: string;
}

export const JoharMascot: React.FC<JoharMascotProps> = ({
  mood = 'happy',
  size = 'md',
  dialogue,
  className,
}) => {
  const sizeMap = {
    sm: 40,
    md: 56,
    lg: 84,
    hero: 120,
  };

  const dim = sizeMap[size];

  return (
    <div className={cn(mascotTokens.container, 'flex-col items-center gap-2', className)}>
      {/* Dialogue Bubble if specified */}
      {dialogue && (
        <motion.div
          initial={{ opacity: 0, y: 6, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          className={mascotTokens.dialogueBubble}
        >
          <p>{dialogue}</p>
          <div className={mascotTokens.dialogueArrow} />
        </motion.div>
      )}

      {/* Vector Animated Hornbill Mascot */}
      <motion.div
        animate={
          mood === 'celebrating'
            ? { y: [0, -6, 0], rotate: [0, -3, 3, 0] }
            : mood === 'listening'
            ? { scale: [1, 1.04, 1] }
            : { y: [0, -3, 0] }
        }
        transition={{
          repeat: Infinity,
          duration: mood === 'celebrating' ? 1.2 : 2.5,
          ease: 'easeInOut',
        }}
        className="relative cursor-pointer select-none"
      >
        <svg
          width={dim}
          height={dim}
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Outer Glow / Halo */}
          <circle cx="50" cy="50" r="46" fill="#FEF3C7" opacity="0.6" />

          {/* Hornbill Body */}
          <path
            d="M32,78 C32,54 44,40 58,40 C72,40 82,52 82,78 C82,88 70,92 57,92 C42,92 32,88 32,78 Z"
            fill={mascotTokens.colors.body}
          />
          {/* White Belly */}
          <path
            d="M44,72 C44,58 52,50 62,50 C72,50 74,58 74,72 C74,86 66,88 59,88 C50,88 44,84 44,72 Z"
            fill={mascotTokens.colors.belly}
          />

          {/* Head & Feathers */}
          <circle cx="55" cy="36" r="22" fill={mascotTokens.colors.body} />

          {/* Tribal Sohrai Headband / Crown */}
          <path d="M40,24 Q55,18 70,24" stroke={mascotTokens.colors.sohraiCrown} strokeWidth="4" strokeLinecap="round" />
          <polygon points="53,16 57,10 61,16" fill="#EF4444" />
          <polygon points="45,18 48,12 51,18" fill="#10B981" />
          <polygon points="63,18 66,12 69,18" fill="#3B82F6" />

          {/* Large Friendly Eye */}
          <circle cx="60" cy="34" r="7" fill={mascotTokens.colors.eyeHighlight} />
          <circle cx="61" cy="34" r="4.5" fill={mascotTokens.colors.eye} />
          <circle cx="62.5" cy="32.5" r="1.5" fill={mascotTokens.colors.eyeHighlight} />

          {/* Rosy Cheerful Cheek */}
          <circle cx="66" cy="42" r="3.5" fill={mascotTokens.colors.cheek} opacity="0.8" />

          {/* Iconic Hornbill Beak with Casque */}
          {/* Casque (Top ridge) */}
          <path
            d="M58,22 C68,18 80,22 88,28 C82,27 70,26 58,26 Z"
            fill={mascotTokens.colors.casque}
          />
          {/* Main Curved Beak */}
          <path
            d="M60,26 C75,27 92,34 96,44 C88,43 74,40 60,38 Z"
            fill={mascotTokens.colors.beak}
          />
          {/* Beak Lower Jaw */}
          <path
            d="M60,38 C72,40 85,44 92,45 C80,48 68,46 60,43 Z"
            fill={mascotTokens.colors.beakDark}
          />

          {/* Wing with Emerald Tribal Feather Tip */}
          <path
            d="M36,65 C34,75 38,82 46,85 C42,80 40,72 42,65 Z"
            fill={mascotTokens.colors.featherAccent}
          />

          {/* Small feet */}
          <path d="M46,92 L46,96 M50,92 L50,96 M64,92 L64,96 M68,92 L68,96" stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      </motion.div>
    </div>
  );
};
