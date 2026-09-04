import React from 'react';
import { motion } from 'framer-motion';

export interface JoharHornbillProps {
  size?: 'sm' | 'md' | 'lg' | 'hero';
  waving?: boolean;
  speechBubble?: string;
  className?: string;
}

export const JoharHornbill: React.FC<JoharHornbillProps> = ({
  size = 'md',
  waving = true,
  speechBubble,
  className = '',
}) => {
  const sizeMap = {
    sm: 64,
    md: 96,
    lg: 130,
    hero: 168,
  };

  const dim = sizeMap[size];

  return (
    <div className={`relative inline-flex flex-col items-center select-none ${className}`}>
      {/* Speech Bubble for Greetings */}
      {speechBubble && (
        <motion.div
          initial={{ opacity: 0, y: 8, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="mb-2.5 px-3.5 py-1.5 bg-white rounded-2xl shadow-sm border border-amber-200/80 text-xs font-bold text-amber-900 font-baloo flex items-center gap-1.5 relative z-10"
        >
          <span>{speechBubble}</span>
          <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white border-b border-r border-amber-200/80 rotate-45" />
        </motion.div>
      )}

      {/* Mascot Animated Character */}
      <motion.div
        animate={waving ? { y: [0, -5, 0] } : undefined}
        transition={{
          repeat: Infinity,
          duration: 2.6,
          ease: 'easeInOut',
        }}
        className="relative"
        style={{ width: dim, height: dim }}
      >
        <svg
          viewBox="0 0 160 160"
          width={dim}
          height={dim}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-label="Johar Hornbill mascot waving hello"
          role="img"
          className="w-full h-full drop-shadow-sm"
        >
          {/* Warm Golden Halo Circle */}
          <circle cx="80" cy="80" r="72" fill="#FEF3C7" opacity="0.65" />
          <circle cx="80" cy="80" r="64" fill="#FDE68A" opacity="0.4" />

          {/* Tail Feathers */}
          <path d="M42 112 C30 118 20 128 16 136 C26 135 38 130 46 122 Z" fill="#1E293B" />
          <path d="M48 116 C38 126 30 136 28 144 C38 140 48 132 54 124 Z" fill="#F59E0B" />

          {/* Feet */}
          <path
            d="M68 136 L68 146 M74 136 L74 146 M88 136 L88 146 M94 136 L94 146"
            stroke="#D97706"
            strokeWidth="4"
            strokeLinecap="round"
          />
          <path
            d="M64 146 L76 146 M84 146 L96 146"
            stroke="#D97706"
            strokeWidth="3.5"
            strokeLinecap="round"
          />

          {/* Chubby Hornbill Body */}
          <ellipse cx="82" cy="104" rx="36" ry="34" fill="#334155" />
          {/* Soft Cream Belly */}
          <ellipse cx="88" cy="107" rx="24" ry="24" fill="#FFFDF7" />

          {/* Head */}
          <circle cx="88" cy="62" r="32" fill="#334155" />

          {/* Cheerful Sohrai Headband / Feather Crown */}
          <path
            d="M64 48 Q88 40 112 48"
            stroke="#F59E0B"
            strokeWidth="5"
            strokeLinecap="round"
          />
          {/* Crown Feathers (Ruby, Emerald, Gold) */}
          <polygon points="76,38 80,24 84,38" fill="#FB7185" />
          <polygon points="86,36 90,20 94,36" fill="#22C55E" />
          <polygon points="96,38 100,24 104,38" fill="#FACC15" />

          {/* Hornbill Casque (Distinctive Curved Top Ridge) */}
          <path
            d="M92 40 C106 32 128 36 144 48 C132 46 112 44 92 46 Z"
            fill="#FB923C"
          />
          <path
            d="M94 43 C108 36 124 40 138 48 C126 47 110 46 94 47 Z"
            fill="#F97316"
          />

          {/* Main Friendly Curved Beak */}
          <path
            d="M94 48 C116 50 148 62 152 74 C138 73 118 68 96 64 Z"
            fill="#FBBF24"
          />
          {/* Lower Beak with Sweet Smile */}
          <path
            d="M96 64 C116 68 138 74 146 76 C130 80 112 76 96 70 Z"
            fill="#F59E0B"
          />
          {/* Mouth Smile Arc */}
          <path
            d="M96 64 Q120 70 148 75"
            stroke="#D97706"
            strokeWidth="2"
            strokeLinecap="round"
          />

          {/* Big Sparkling Eye (Khan Academy Kids style) */}
          <circle cx="84" cy="58" r="11" fill="#FFFFFF" />
          <circle cx="85" cy="58" r="7.5" fill="#0F172A" />
          <circle cx="87.5" cy="55.5" r="3" fill="#FFFFFF" />
          <circle cx="83.5" cy="61" r="1.5" fill="#FFFFFF" />

          {/* Rosy Blush Cheek */}
          <circle cx="78" cy="71" r="6" fill="#FB7185" opacity="0.65" />

          {/* Resting Left Wing */}
          <path
            d="M54 94 C50 108 58 122 70 126 C64 118 60 108 62 96 Z"
            fill="#1E293B"
          />

          {/* Waving Right Wing with Children's Joyful Wave Motion */}
          <g>
            <path
              d="M108 92 C120 86 134 72 138 58 C130 64 122 76 112 88 Z"
              fill="#2563EB"
            />
            <path
              d="M112 88 C122 78 132 66 136 56 C130 60 124 72 116 82 Z"
              fill="#38BDF8"
            />
            {/* Soft Emerald Tip on Wing */}
            <path
              d="M136 56 C138 52 142 52 144 56 C142 62 138 66 134 68 Z"
              fill="#22C55E"
            />
          </g>

          {/* Waving Motion Lines */}
          <path
            d="M144 44 C148 48 149 54 146 60"
            stroke="#F59E0B"
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M152 46 C157 52 158 60 154 68"
            stroke="#FBBF24"
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
          />
        </svg>
      </motion.div>
    </div>
  );
};
