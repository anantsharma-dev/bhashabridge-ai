import React from 'react';

interface IllustrationProps {
  size?: number | string;
  className?: string;
  title?: string;
}

/**
 * Cute baby elephant with smiling eyes, raised trunk sprinkling magic dots.
 * Perfect for Grade 1-5 Animals learning tile.
 */
export const CuteElephant: React.FC<IllustrationProps> = ({
  size = 110,
  className = '',
  title = 'Cute Elephant illustration',
}) => {
  return (
    <svg
      viewBox="0 0 120 120"
      width={size}
      height={size}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label={title}
      className={`select-none drop-shadow-sm ${className}`}
    >
      {/* Soft pastel background circle */}
      <circle cx="60" cy="60" r="54" fill="#FFF7ED" />
      <circle cx="60" cy="60" r="48" fill="#FFEDD5" opacity="0.6" />

      {/* Tail */}
      <path
        d="M26 82 C20 78 18 86 22 90"
        stroke="#94A3B8"
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      <circle cx="21" cy="90" r="2.5" fill="#F59E0B" />

      {/* Back foot */}
      <rect x="32" y="82" width="14" height="18" rx="7" fill="#64748B" />
      <rect x="74" y="82" width="14" height="18" rx="7" fill="#64748B" />

      {/* Elephant Body */}
      <ellipse cx="56" cy="74" rx="34" ry="26" fill="#93C5FD" />
      {/* Front feet */}
      <rect x="42" y="84" width="15" height="18" rx="7.5" fill="#60A5FA" />
      <rect x="64" y="84" width="15" height="18" rx="7.5" fill="#60A5FA" />
      {/* Toenails */}
      <circle cx="46" cy="99" r="2" fill="#FFFFFF" />
      <circle cx="53" cy="99" r="2" fill="#FFFFFF" />
      <circle cx="68" cy="99" r="2" fill="#FFFFFF" />
      <circle cx="75" cy="99" r="2" fill="#FFFFFF" />

      {/* Head */}
      <circle cx="78" cy="52" r="22" fill="#93C5FD" />

      {/* Round Elephant Ear with Pink Inner */}
      <ellipse cx="62" cy="50" rx="16" ry="18" fill="#60A5FA" />
      <ellipse cx="62" cy="50" rx="11" ry="13" fill="#FECDD3" />

      {/* Cheerful Smiling Eyes */}
      <ellipse cx="84" cy="46" rx="4" ry="5" fill="#0F172A" />
      <circle cx="85.5" cy="44.5" r="1.5" fill="#FFFFFF" />
      {/* Rosy Blush */}
      <circle cx="81" cy="55" r="4.5" fill="#FB7185" opacity="0.6" />

      {/* Happy Curled Trunk Raised High */}
      <path
        d="M94 56 C104 56 112 48 108 36 C105 28 97 32 99 38"
        stroke="#60A5FA"
        strokeWidth="7"
        strokeLinecap="round"
        fill="none"
      />

      {/* Sprinkling magical droplets / stars from trunk */}
      <circle cx="106" cy="24" r="2.5" fill="#38BDF8" />
      <circle cx="114" cy="30" r="2" fill="#FACC15" />
      <circle cx="98" cy="22" r="1.8" fill="#FB7185" />
      <path
        d="M110 16 L111 20 L115 21 L111 22 L110 26 L109 22 L105 21 L109 20 Z"
        fill="#F59E0B"
      />
    </svg>
  );
};

/**
 * Colorful counting wooden blocks (1, 2, 3) with stars and smiling accents.
 * Perfect for Numbers tile.
 */
export const CountingBlocks: React.FC<IllustrationProps> = ({
  size = 110,
  className = '',
  title = 'Counting Blocks illustration',
}) => {
  return (
    <svg
      viewBox="0 0 120 120"
      width={size}
      height={size}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label={title}
      className={`select-none drop-shadow-sm ${className}`}
    >
      {/* Soft pastel background circle */}
      <circle cx="60" cy="60" r="54" fill="#EFF6FF" />
      <circle cx="60" cy="60" r="48" fill="#DBEAFE" opacity="0.6" />

      {/* Block 1 (Blue base block - bottom left) */}
      <g>
        <rect x="22" y="66" width="34" height="34" rx="8" fill="#2563EB" />
        <rect x="25" y="69" width="28" height="28" rx="6" fill="#3B82F6" />
        <text
          x="39"
          y="89"
          fill="#FFFFFF"
          fontFamily="system-ui, sans-serif"
          fontSize="20"
          fontWeight="900"
          textAnchor="middle"
        >
          1
        </text>
      </g>

      {/* Block 2 (Green base block - bottom right) */}
      <g>
        <rect x="62" y="66" width="34" height="34" rx="8" fill="#16A34A" />
        <rect x="65" y="69" width="28" height="28" rx="6" fill="#22C55E" />
        <text
          x="79"
          y="89"
          fill="#FFFFFF"
          fontFamily="system-ui, sans-serif"
          fontSize="20"
          fontWeight="900"
          textAnchor="middle"
        >
          2
        </text>
      </g>

      {/* Block 3 (Orange/Yellow top block - center stacked) */}
      <g transform="rotate(-3 60 44)">
        <rect x="42" y="28" width="36" height="36" rx="9" fill="#D97706" />
        <rect x="45" y="31" width="30" height="30" rx="7" fill="#F59E0B" />
        <text
          x="60"
          y="53"
          fill="#FFFFFF"
          fontFamily="system-ui, sans-serif"
          fontSize="22"
          fontWeight="900"
          textAnchor="middle"
        >
          3
        </text>
      </g>

      {/* Decorative cheerful elements */}
      {/* Floating gold star */}
      <path
        d="M26 38 L28 44 L34 45 L29 49 L31 55 L26 51 L21 55 L23 49 L18 45 L24 44 Z"
        fill="#FACC15"
      />
      {/* Floating confetti dots */}
      <circle cx="94" cy="38" r="3" fill="#FB7185" />
      <circle cx="88" cy="28" r="2.5" fill="#38BDF8" />
      <circle cx="102" cy="50" r="2" fill="#22C55E" />
    </svg>
  );
};

/**
 * Smiling sweet golden mango with leaf and blushing cheeks.
 * Perfect for Fruits tile.
 */
export const CuteMango: React.FC<IllustrationProps> = ({
  size = 110,
  className = '',
  title = 'Sweet Mango illustration',
}) => {
  return (
    <svg
      viewBox="0 0 120 120"
      width={size}
      height={size}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label={title}
      className={`select-none drop-shadow-sm ${className}`}
    >
      {/* Soft pastel background circle */}
      <circle cx="60" cy="60" r="54" fill="#F0FDF4" />
      <circle cx="60" cy="60" r="48" fill="#DCFCE7" opacity="0.6" />

      {/* Stem */}
      <path
        d="M60 22 C61 15 65 14 68 12"
        stroke="#78350F"
        strokeWidth="4"
        strokeLinecap="round"
      />

      {/* Glossy Green Mango Leaf */}
      <path
        d="M62 20 C76 12 90 18 94 28 C82 32 70 26 62 20 Z"
        fill="#22C55E"
      />
      <path
        d="M65 21 C74 20 84 22 91 27"
        stroke="#86EFAC"
        strokeWidth="1.5"
        strokeLinecap="round"
      />

      {/* Plump Golden Mango Body */}
      <path
        d="M58 24 C78 24 96 44 94 72 C92 94 74 104 54 102 C32 100 24 82 28 58 C32 38 42 24 58 24 Z"
        fill="#FBBF24"
      />
      {/* Soft warm gradient belly glow */}
      <path
        d="M62 28 C76 30 90 48 88 72 C86 90 72 98 56 96 C42 94 36 84 38 64 C42 46 50 30 62 28 Z"
        fill="#F59E0B"
        opacity="0.3"
      />

      {/* Big Friendly Eyes */}
      <ellipse cx="48" cy="60" rx="4" ry="5.5" fill="#0F172A" />
      <circle cx="49.5" cy="58.5" r="1.8" fill="#FFFFFF" />
      <ellipse cx="68" cy="60" rx="4" ry="5.5" fill="#0F172A" />
      <circle cx="69.5" cy="58.5" r="1.8" fill="#FFFFFF" />

      {/* Sweet Smile */}
      <path
        d="M52 68 Q58 76 64 68"
        stroke="#78350F"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />

      {/* Rosy Cheeks */}
      <circle cx="42" cy="68" r="4.5" fill="#FB7185" opacity="0.75" />
      <circle cx="74" cy="68" r="4.5" fill="#FB7185" opacity="0.75" />

      {/* Sparkle highlights */}
      <circle cx="40" cy="40" r="3" fill="#FFFFFF" opacity="0.8" />
      <circle cx="46" cy="34" r="1.5" fill="#FFFFFF" opacity="0.8" />
    </svg>
  );
};

/**
 * Open magic storybook with floating stars, cheerful pictures.
 * Perfect for Stories tile.
 */
export const StoryBook: React.FC<IllustrationProps> = ({
  size = 110,
  className = '',
  title = 'Story Book illustration',
}) => {
  return (
    <svg
      viewBox="0 0 120 120"
      width={size}
      height={size}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label={title}
      className={`select-none drop-shadow-sm ${className}`}
    >
      {/* Soft pastel background circle */}
      <circle cx="60" cy="60" r="54" fill="#FAF5FF" />
      <circle cx="60" cy="60" r="48" fill="#F3E8FF" opacity="0.6" />

      {/* Book Outer Cover (Royal Purple/Blue) */}
      <path
        d="M18 78 C36 72 56 74 60 77 C64 74 84 72 102 78 L98 48 C82 42 64 44 60 47 C56 44 38 42 22 48 Z"
        fill="#8B5CF6"
      />

      {/* Book Pages (Warm White / Cream) */}
      <path
        d="M20 74 C38 68 56 70 60 74 C64 70 82 68 100 74 L97 44 C81 38 63 40 60 44 C57 40 39 38 23 44 Z"
        fill="#FFFDF7"
      />
      {/* Page Spine Shadow */}
      <line x1="60" y1="44" x2="60" y2="74" stroke="#E2E8F0" strokeWidth="2" />

      {/* Left Page: Cute Tree & Sun sketch */}
      <circle cx="34" cy="52" r="4" fill="#FBBF24" />
      <path d="M46 64 L46 58" stroke="#78350F" strokeWidth="2" strokeLinecap="round" />
      <circle cx="46" cy="54" r="6" fill="#22C55E" />

      {/* Right Page: Little Bird & Story lines */}
      <path d="M72 52 Q76 48 82 52 Q76 56 72 52" fill="#FB7185" />
      <line x1="70" y1="60" x2="88" y2="60" stroke="#CBD5E1" strokeWidth="2" strokeLinecap="round" />
      <line x1="70" y1="65" x2="84" y2="65" stroke="#CBD5E1" strokeWidth="2" strokeLinecap="round" />

      {/* Red Bookmark Ribbon */}
      <path d="M60 74 L60 84 L64 81 L68 84 L68 74" fill="#EF4444" />

      {/* Floating Magic Stars */}
      <path
        d="M50 26 L52 30 L56 31 L53 34 L54 38 L50 35 L46 38 L47 34 L44 31 L48 30 Z"
        fill="#FACC15"
      />
      <circle cx="70" cy="28" r="2.5" fill="#38BDF8" />
      <circle cx="32" cy="34" r="2" fill="#F43F5E" />
      <circle cx="86" cy="34" r="2" fill="#A855F7" />
    </svg>
  );
};

/**
 * Palash Flower (पलाश - Flame of the Forest).
 * Jharkhand State Flower badge for daily mother tongue achievement.
 */
export const PalashFlowerBadge: React.FC<IllustrationProps> = ({
  size = 72,
  className = '',
  title = 'Palash Flower Badge',
}) => {
  return (
    <svg
      viewBox="0 0 80 80"
      width={size}
      height={size}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label={title}
      className={`select-none drop-shadow-sm ${className}`}
    >
      {/* Outer decorative ring */}
      <circle cx="40" cy="40" r="38" fill="#FFF1F2" stroke="#FECDD3" strokeWidth="2.5" />
      <circle cx="40" cy="40" r="33" fill="#FFE4E6" opacity="0.6" />

      {/* Palash Petals (Flaming Orange-Red curved parrot-beak petals) */}
      {/* Center Top Petal (Standard petal) */}
      <path
        d="M40 16 C34 26 34 38 40 44 C46 38 46 26 40 16 Z"
        fill="#EA580C"
      />
      <path
        d="M40 18 C36 26 36 34 40 40 C44 34 44 26 40 18 Z"
        fill="#F97316"
      />

      {/* Left Wing Petal */}
      <path
        d="M40 42 C30 38 20 42 16 52 C26 55 36 50 40 42 Z"
        fill="#DC2626"
      />
      <path
        d="M38 43 C30 40 23 44 20 50 C27 52 34 48 38 43 Z"
        fill="#EF4444"
      />

      {/* Right Wing Petal */}
      <path
        d="M40 42 C50 38 60 42 64 52 C54 55 44 50 40 42 Z"
        fill="#DC2626"
      />
      <path
        d="M42 43 C50 40 57 44 60 50 C53 52 46 48 42 43 Z"
        fill="#EF4444"
      />

      {/* Keel / Beak curved center */}
      <path
        d="M40 38 C35 48 37 58 40 64 C43 58 45 48 40 38 Z"
        fill="#F59E0B"
      />

      {/* Golden Sparkling Core */}
      <circle cx="40" cy="42" r="5" fill="#FEF08A" />
      <circle cx="40" cy="42" r="2.5" fill="#B45309" />
    </svg>
  );
};

/**
 * Sal Leaf (साल पत्ता - Sacred Tree of Jharkhand).
 * Symbol of enduring nature and reading milestone.
 */
export const SalLeafBadge: React.FC<IllustrationProps> = ({
  size = 72,
  className = '',
  title = 'Sal Leaf Badge',
}) => {
  return (
    <svg
      viewBox="0 0 80 80"
      width={size}
      height={size}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label={title}
      className={`select-none drop-shadow-sm ${className}`}
    >
      {/* Outer decorative ring */}
      <circle cx="40" cy="40" r="38" fill="#F0FDF4" stroke="#BBF7D0" strokeWidth="2.5" />
      <circle cx="40" cy="40" r="33" fill="#DCFCE7" opacity="0.6" />

      {/* Sal Leaf Stem */}
      <path
        d="M40 68 C40 60 40 50 40 20"
        stroke="#15803D"
        strokeWidth="3.5"
        strokeLinecap="round"
      />

      {/* Lush Green Sal Leaf Body */}
      <path
        d="M40 18 C24 28 20 46 32 58 C36 62 40 64 40 64 C40 64 44 62 48 58 C60 46 56 28 40 18 Z"
        fill="#22C55E"
      />
      {/* Subtle leaf vein highlights */}
      <path
        d="M40 28 L32 35 M40 36 L28 44 M40 44 L32 52 M40 28 L48 35 M40 36 L52 44 M40 44 L48 52"
        stroke="#86EFAC"
        strokeWidth="2"
        strokeLinecap="round"
      />

      {/* Glistening Morning Dewdrop with Star Spark */}
      <circle cx="48" cy="38" r="4" fill="#E0F2FE" />
      <circle cx="48" cy="38" r="2.5" fill="#38BDF8" opacity="0.8" />
      <circle cx="49" cy="37" r="1" fill="#FFFFFF" />
    </svg>
  );
};

/**
 * Smiling 5-pointed golden star with rays and cute ribbon.
 */
export const StarRewardBadge: React.FC<IllustrationProps> = ({
  size = 72,
  className = '',
  title = 'Stars Reward Badge',
}) => {
  return (
    <svg
      viewBox="0 0 80 80"
      width={size}
      height={size}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label={title}
      className={`select-none drop-shadow-sm ${className}`}
    >
      <circle cx="40" cy="40" r="38" fill="#FEFCE8" stroke="#FEF08A" strokeWidth="2.5" />

      {/* Cute Ribbon Tail */}
      <path d="M32 54 L26 70 L34 66 L40 70 L38 54 Z" fill="#F59E0B" />
      <path d="M48 54 L54 70 L46 66 L40 70 L42 54 Z" fill="#D97706" />

      {/* Star Body */}
      <path
        d="M40 14 L46 29 L62 31 L50 42 L53 58 L40 50 L27 58 L30 42 L18 31 L34 29 Z"
        fill="#FACC15"
        stroke="#EAB308"
        strokeWidth="2"
        strokeLinejoin="round"
      />

      {/* Cute Eyes on Star */}
      <circle cx="36" cy="36" r="2.5" fill="#0F172A" />
      <circle cx="44" cy="36" r="2.5" fill="#0F172A" />
      <circle cx="37" cy="35" r="0.8" fill="#FFFFFF" />
      <circle cx="45" cy="35" r="0.8" fill="#FFFFFF" />

      {/* Sweet Smile */}
      <path d="M38 41 Q40 44 42 41" stroke="#854D0E" strokeWidth="1.8" strokeLinecap="round" />

      {/* Cheeks */}
      <circle cx="33" cy="39" r="2" fill="#FB7185" opacity="0.8" />
      <circle cx="47" cy="39" r="2" fill="#FB7185" opacity="0.8" />
    </svg>
  );
};

/**
 * Friendly flame buddy representing streak days with cheerful smile.
 */
export const StreakFlameBadge: React.FC<IllustrationProps> = ({
  size = 72,
  className = '',
  title = 'Daily Streak Flame Badge',
}) => {
  return (
    <svg
      viewBox="0 0 80 80"
      width={size}
      height={size}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label={title}
      className={`select-none drop-shadow-sm ${className}`}
    >
      <circle cx="40" cy="40" r="38" fill="#FFF7ED" stroke="#FED7AA" strokeWidth="2.5" />

      {/* Outer Flame (Orange) */}
      <path
        d="M40 16 C46 26 56 34 58 48 C60 60 52 68 40 68 C28 68 20 60 22 48 C24 38 32 30 36 24 C38 28 40 32 38 38 C42 32 42 22 40 16 Z"
        fill="#F97316"
      />

      {/* Inner Flame (Warm Yellow) */}
      <path
        d="M40 32 C44 38 48 44 48 52 C48 58 44 64 40 64 C36 64 32 58 32 52 C32 46 36 40 38 36 C39 38 40 40 39 44 C41 40 41 34 40 32 Z"
        fill="#FDE047"
      />

      {/* Cute Eyes */}
      <circle cx="37" cy="50" r="1.8" fill="#78350F" />
      <circle cx="43" cy="50" r="1.8" fill="#78350F" />

      {/* Smile */}
      <path d="M38 54 Q40 56 42 54" stroke="#78350F" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
};
