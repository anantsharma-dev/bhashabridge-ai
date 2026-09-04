/**
 * BhashaBridge AI — Design System Theme Tokens
 * Inspired by Duolingo, Google Gemini, Khan Academy Kids, and Material Design 3.
 * Centralized Single Source of Truth for all UI components.
 * Tailored for Jharkhand MTB-MLE primary education tablets.
 */

// ==========================================
// 1. COLOR TOKENS
// ==========================================
export const colors = {
  // Brand & Pedagogical Primary Colors
  brand: {
    blue: '#2563EB',        // Primary: Trust, Core UI, Focus
    blueHover: '#1D4ED8',
    blueShadow: '#1E40AF',
    green: '#10B981',       // Success, Correct, NIPUN FLN mastery
    greenHover: '#059669',
    greenShadow: '#047857',
    orange: '#F59E0B',      // Playful action, Vocabulary, Warmth
    orangeHover: '#D97706',
    orangeShadow: '#B45309',
    purple: '#8B5CF6',      // Gemini AI, Offline translation, Magic
    purpleHover: '#7C3AED',
    purpleShadow: '#6D28D9',
    coral: '#F43F5E',       // Daily streak, Alerts, Celebrations
    coralHover: '#E11D48',
    coralShadow: '#BE123C',
    yellow: '#FACC15',      // Badges, Stars, XP Coins
    yellowHover: '#EAB308',
    yellowShadow: '#CA8A04',
  },

  // Soft Educational Pastel Containers (Duolingo & Khan Academy Kids)
  pastel: {
    blue: '#EFF6FF',
    blueBorder: '#BFDBFE',
    green: '#ECFDF5',
    greenBorder: '#A7F3D0',
    orange: '#FFFBEB',
    orangeBorder: '#FDE68A',
    purple: '#FAF5FF',
    purpleBorder: '#DDD6FE',
    coral: '#FFF1F2',
    coralBorder: '#FECDD3',
    yellow: '#FEFCE8',
    yellowBorder: '#FEF08A',
  },

  // Material Design 3 Surfaces
  surface: {
    light: {
      background: '#F8FAFC',
      card: '#FFFFFF',
      subtle: '#F1F5F9',
      border: '#E2E8F0',
      textPrimary: '#0F172A',
      textSecondary: '#475569',
      textMuted: '#94A3B8',
    },
    dark: {
      background: '#0B0F19',
      card: '#161F30',
      subtle: '#1E293B',
      border: '#334155',
      textPrimary: '#F8FAFC',
      textSecondary: '#CBD5E1',
      textMuted: '#64748B',
    },
  },

  // Linguistic Scripts Indication
  scripts: {
    devanagari: {
      name: 'Hindi',
      accent: '#2563EB',
      badgeBg: '#EFF6FF',
      badgeText: '#1E40AF',
    },
    olchiki: {
      name: 'Santhali (Ol Chiki)',
      accent: '#8B5CF6',
      badgeBg: '#FAF5FF',
      badgeText: '#6D28D9',
    },
    warangciti: {
      name: 'Ho (Warang Citi)',
      accent: '#10B981',
      badgeBg: '#ECFDF5',
      badgeText: '#065F46',
    },
    mundari: {
      name: 'Mundari Bani',
      accent: '#F59E0B',
      badgeBg: '#FFFBEB',
      badgeText: '#92400E',
    },
  },

  // Status & Connectivity
  status: {
    online: '#10B981',
    offline: '#F59E0B',
    error: '#F43F5E',
    info: '#3B82F6',
  },
} as const;

// ==========================================
// 2. GRADIENT TOKENS
// ==========================================
export const gradients = {
  gemini: 'linear-gradient(135deg, #2563EB 0%, #7C3AED 50%, #EC4899 100%)',
  geminiSoft: 'linear-gradient(135deg, #EEF2FF 0%, #FAF5FF 50%, #FFF1F2 100%)',
  aurora: 'linear-gradient(135deg, #3B82F6 0%, #10B981 50%, #F59E0B 100%)',
  sunshine: 'linear-gradient(135deg, #F59E0B 0%, #F43F5E 100%)',
  forest: 'linear-gradient(135deg, #10B981 0%, #065F46 100%)',
  banner: 'linear-gradient(135deg, #2563EB 0%, #4F46E5 50%, #7C3AED 100%)',
  geminiClass: 'bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500',
  bannerClass: 'bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600',
} as const;

// ==========================================
// 3. TYPOGRAPHY TOKENS
// ==========================================
export const typography = {
  fonts: {
    sans: "'Nunito', 'Poppins', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    nunito: "'Nunito', sans-serif",
    heading: "'Poppins', sans-serif",
    devanagari: "'Noto Sans Devanagari', sans-serif",
    olchiki: "'Noto Sans Ol Chiki', sans-serif",
  },
  classes: {
    fontSans: 'font-sans',
    fontNunito: 'font-nunito',
    fontHeading: 'font-heading',
    fontDevanagari: 'font-devanagari',
    fontOlChiki: 'font-olchiki',
  },
  sizes: {
    display: 'text-4xl md:text-5xl font-extrabold tracking-tight font-heading',
    h1: 'text-2xl md:text-3xl font-bold tracking-tight font-heading',
    h2: 'text-xl md:text-2xl font-bold font-heading',
    h3: 'text-lg md:text-xl font-semibold font-heading',
    h4: 'text-base md:text-lg font-semibold font-heading',
    bodyLg: 'text-base md:text-lg font-normal leading-relaxed',
    body: 'text-sm md:text-base font-normal leading-relaxed',
    caption: 'text-xs md:text-sm font-medium',
    muted: 'text-xs text-slate-400 dark:text-slate-500',
    label: 'text-[11px] font-bold tracking-wider uppercase',
  },
  scripts: {
    hindiHeading: 'font-devanagari text-xl md:text-2xl font-bold text-slate-900 dark:text-white',
    hindiBody: 'font-devanagari text-base md:text-lg text-slate-800 dark:text-slate-100 leading-relaxed',
    santhaliHeading: 'font-olchiki text-xl md:text-2xl font-bold text-slate-900 dark:text-white tracking-wide',
    santhaliBody: 'font-olchiki text-lg md:text-xl font-bold text-slate-900 dark:text-white tracking-wide leading-relaxed',
  },
} as const;

// ==========================================
// 4. SPACING TOKENS
// ==========================================
export const spacing = {
  scale: {
    xs: '4px',
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '20px',
    '2xl': '24px',
    '3xl': '32px',
    '4xl': '40px',
    '5xl': '48px',
    '6xl': '64px',
  },
  padding: {
    card: 'p-5 sm:p-6',
    cardLg: 'p-6 sm:p-8',
    cardSm: 'p-3.5 sm:p-4',
    buttonSm: 'px-3.5 py-1.5',
    buttonMd: 'px-5 py-2.5',
    buttonLg: 'px-6 py-3.5',
    buttonXl: 'px-8 py-4',
    input: 'py-3 px-4',
    badge: 'px-2.5 py-1',
    topBar: 'px-4 md:px-8 py-3.5',
    bottomNav: 'px-3 py-2',
  },
  gap: {
    xs: 'gap-1',
    sm: 'gap-2',
    md: 'gap-3',
    lg: 'gap-4',
    xl: 'gap-6',
  },
} as const;

// ==========================================
// 5. BORDER RADIUS TOKENS
// ==========================================
export const radius = {
  none: '0px',
  sm: '8px',
  md: '12px',
  lg: '16px',
  xl: '20px',
  card: '24px',       // Standard MD3 + Duolingo Card Radius
  container: '28px',  // Larger Hero Cards and AI Assistant frames
  pill: '9999px',     // Badges, circular FABs, pills
  classes: {
    card: 'rounded-[24px]',
    container: 'rounded-[28px]',
    pill: 'rounded-full',
    buttonSm: 'rounded-xl',
    buttonMd: 'rounded-2xl',
    buttonLg: 'rounded-2xl',
    buttonXl: 'rounded-3xl',
    input: 'rounded-2xl',
    badge: 'rounded-full',
  },
} as const;

// ==========================================
// 6. SHADOWS & ELEVATIONS (MD3 + Duolingo 3D)
// ==========================================
export const shadows = {
  elevation: {
    0: 'shadow-none',
    1: 'shadow-sm shadow-slate-200/50 dark:shadow-none',
    2: 'shadow-md shadow-slate-200/70 dark:shadow-none',
    3: 'shadow-lg shadow-slate-200/80 dark:shadow-slate-950/40',
    4: 'shadow-xl shadow-slate-300/60 dark:shadow-slate-950/60',
    5: 'shadow-2xl shadow-slate-400/50 dark:shadow-slate-950/80',
  },
  colored: {
    blue: 'shadow-md shadow-blue-500/20',
    green: 'shadow-md shadow-emerald-500/20',
    orange: 'shadow-md shadow-amber-500/20',
    purple: 'shadow-md shadow-purple-500/20',
    coral: 'shadow-md shadow-rose-500/20',
    gemini: 'shadow-xl shadow-purple-500/15',
  },
  // Duolingo 3D Tactile Push Borders
  tactileBevel: {
    primary: 'border-b-4 border-blue-800 active:border-b-0 active:translate-y-1',
    green: 'border-b-4 border-emerald-800 active:border-b-0 active:translate-y-1',
    orange: 'border-b-4 border-amber-700 active:border-b-0 active:translate-y-1',
    purple: 'border-b-4 border-purple-800 active:border-b-0 active:translate-y-1',
    coral: 'border-b-4 border-rose-800 active:border-b-0 active:translate-y-1',
    secondary: 'border-b-4 border-slate-300 dark:border-slate-800 active:border-b-0 active:translate-y-1',
  },
} as const;

// ==========================================
// 7. GLASSMORPHISM TOKENS
// ==========================================
export const glassmorphism = {
  card: 'bg-white/85 dark:bg-slate-900/85 backdrop-blur-md border border-white/60 dark:border-white/10 shadow-lg shadow-slate-200/20 dark:shadow-none',
  pill: 'bg-white/75 dark:bg-slate-800/75 backdrop-blur-md border border-white/50 dark:border-white/10 shadow-sm',
  topBar: 'bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800',
  bottomNav: 'bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg border-t border-slate-200/80 dark:border-slate-800',
} as const;

// ==========================================
// 8. MOTION & FRAMER MOTION PRESETS
// ==========================================
export const motionPresets = {
  spring: {
    type: 'spring' as const,
    stiffness: 400,
    damping: 25,
  },
  bouncySpring: {
    type: 'spring' as const,
    stiffness: 450,
    damping: 18,
  },
  gentleSpring: {
    type: 'spring' as const,
    stiffness: 300,
    damping: 30,
  },
  tap: { scale: 0.96 },
  hover: { y: -2, transition: { duration: 0.2 } },
  cardHover: { y: -3, transition: { duration: 0.2 } },
  fadeInUp: {
    initial: { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] },
  },
  popIn: {
    initial: { scale: 0.88, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    transition: { type: 'spring', stiffness: 400, damping: 25 },
  },
} as const;

// ==========================================
// 9. COMPONENT SPECIFIC DESIGN TOKENS
// ==========================================

// Button Design Tokens
export const buttonTokens = {
  base: 'inline-flex items-center justify-center select-none font-semibold transition-all duration-150 cursor-pointer disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-blue focus-visible:ring-offset-2',
  variants: {
    primary: 'bg-primary-blue text-white hover:bg-blue-600 shadow-md shadow-blue-500/20 active:shadow-sm',
    green: 'bg-primary-green text-white hover:bg-emerald-600 shadow-md shadow-emerald-500/20 active:shadow-sm',
    orange: 'bg-primary-orange text-white hover:bg-amber-600 shadow-md shadow-amber-500/20 active:shadow-sm',
    purple: 'bg-primary-purple text-white hover:bg-violet-600 shadow-md shadow-purple-500/20 active:shadow-sm',
    coral: 'bg-primary-coral text-white hover:bg-rose-600 shadow-md shadow-rose-500/20 active:shadow-sm',
    secondary: 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 hover:bg-slate-200 dark:hover:bg-slate-700',
    outline: 'bg-transparent border-2 border-slate-200 dark:border-slate-700 hover:border-primary-blue text-slate-700 dark:text-slate-200 hover:text-primary-blue',
    ghost: 'bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800/80 text-slate-700 dark:text-slate-200',
    glass: 'bg-white/75 dark:bg-slate-800/75 backdrop-blur-md border border-white/50 dark:border-white/10 text-slate-800 dark:text-slate-100 hover:bg-white/90 dark:hover:bg-slate-800/90 shadow-sm',
    gemini: 'bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 text-white shadow-md shadow-purple-500/25 hover:opacity-95',
  },
  tactile: shadows.tactileBevel,
  sizes: {
    sm: `${spacing.padding.buttonSm} text-xs ${radius.classes.buttonSm} gap-1.5`,
    md: `${spacing.padding.buttonMd} text-sm ${radius.classes.buttonMd} gap-2`,
    lg: `${spacing.padding.buttonLg} text-base ${radius.classes.buttonLg} gap-2.5`,
    xl: `${spacing.padding.buttonXl} text-lg ${radius.classes.buttonXl} gap-3 font-bold`,
    icon: 'p-3 rounded-2xl aspect-square justify-center',
  },
} as const;

// Card Design Tokens
export const cardTokens = {
  base: `${radius.classes.card} ${spacing.padding.card} transition-all duration-200`,
  variants: {
    default: 'bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 shadow-sm shadow-slate-200/50 dark:shadow-none',
    glass: glassmorphism.card,
    'pastel-blue': 'bg-blue-50/70 dark:bg-blue-950/20 border border-blue-200/70 dark:border-blue-800/40 text-slate-800 dark:text-slate-100',
    'pastel-green': 'bg-emerald-50/70 dark:bg-emerald-950/20 border border-emerald-200/70 dark:border-emerald-800/40 text-slate-800 dark:text-slate-100',
    'pastel-orange': 'bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200/70 dark:border-amber-800/40 text-slate-800 dark:text-slate-100',
    'pastel-purple': 'bg-purple-50/70 dark:bg-purple-950/20 border border-purple-200/70 dark:border-purple-800/40 text-slate-800 dark:text-slate-100',
    'pastel-coral': 'bg-rose-50/70 dark:bg-rose-950/20 border border-rose-200/70 dark:border-rose-800/40 text-slate-800 dark:text-slate-100',
    'pastel-yellow': 'bg-yellow-50/70 dark:bg-yellow-950/20 border border-yellow-200/70 dark:border-yellow-800/40 text-slate-800 dark:text-slate-100',
    gemini: 'relative bg-white dark:bg-slate-900 border border-transparent before:absolute before:inset-0 before:-z-10 before:rounded-[24px] before:p-[1.5px] before:bg-gradient-to-r before:from-blue-500 before:via-purple-500 before:to-pink-500 shadow-lg shadow-purple-500/5',
  },
} as const;

// Input & Textarea Design Tokens
export const inputTokens = {
  base: `w-full bg-white dark:bg-slate-900 border text-slate-900 dark:text-slate-100 ${radius.classes.input} ${spacing.padding.input} text-sm transition-all focus:outline-none focus:ring-2 focus:ring-primary-blue/30 focus:border-primary-blue shadow-sm`,
  borderNormal: 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700',
  borderError: 'border-rose-400 focus:border-rose-500 focus:ring-rose-500/20',
  label: 'block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5',
  helper: 'text-xs text-slate-500 dark:text-slate-400 mt-1',
  error: 'text-xs font-medium text-rose-500 mt-1',
  scripts: {
    default: typography.classes.fontSans,
    devanagari: `${typography.classes.fontDevanagari} text-base`,
    olchiki: `${typography.classes.fontOlChiki} text-base tracking-wide`,
  },
} as const;

// Badge & Chip Tokens
export const badgeTokens = {
  base: `inline-flex items-center justify-center font-medium ${radius.classes.badge} border transition-all select-none`,
  variants: {
    blue: 'bg-blue-50 text-primary-blue border-blue-200/80 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800/60',
    green: 'bg-emerald-50 text-emerald-700 border-emerald-200/80 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/60',
    orange: 'bg-amber-50 text-amber-800 border-amber-200/80 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/60',
    purple: 'bg-purple-50 text-primary-purple border-purple-200/80 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-800/60',
    coral: 'bg-rose-50 text-rose-700 border-rose-200/80 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800/60',
    yellow: 'bg-yellow-50 text-yellow-800 border-yellow-200/80 dark:bg-yellow-950/40 dark:text-yellow-300 dark:border-yellow-800/60',
    neutral: 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700',
    gemini: 'bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 text-purple-700 dark:text-purple-300 border-purple-300/50 dark:border-purple-700/50 shadow-sm',
  },
  sizes: {
    sm: 'text-[10px] px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5',
    lg: 'text-sm px-3.5 py-1.5 gap-2 font-semibold',
  },
} as const;

// Floating Mic Tokens
export const floatingMicTokens = {
  sizes: {
    md: { dimensions: 'w-16 h-16', iconSize: 26 },
    lg: { dimensions: 'w-20 h-20', iconSize: 32 },
    hero: { dimensions: 'w-24 h-24', iconSize: 40 },
  },
  states: {
    idle: 'bg-primary-blue hover:bg-blue-600 border-4 border-blue-200/90 dark:border-blue-700 shadow-blue-500/30',
    listening: 'bg-rose-500 border-4 border-rose-300 shadow-rose-500/40',
    processing: 'bg-gradient-to-r from-blue-600 to-purple-600 border-4 border-purple-300 shadow-purple-500/30',
    speaking: 'bg-emerald-500 border-4 border-emerald-300 shadow-emerald-500/30',
  },
  pill: `${radius.classes.pill} px-3 py-1 bg-white/95 dark:bg-slate-800/95 border border-slate-200 dark:border-slate-700 shadow-sm text-xs font-semibold text-slate-700 dark:text-slate-200`,
} as const;

// AI Assistant Bubble Tokens
export const aiBubbleTokens = {
  container: 'relative w-full max-w-2xl',
  outerFrame: `${radius.classes.container} p-[2px] bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 shadow-xl shadow-purple-500/10`,
  innerCard: `${radius.classes.card} bg-white dark:bg-slate-900 p-5 md:p-6 space-y-4`,
  mascotBox: 'w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 via-purple-600 to-pink-500 p-0.5 flex items-center justify-center shadow-md shadow-purple-500/20',
  mascotInner: 'w-full h-full bg-white dark:bg-slate-900 rounded-[14px] flex items-center justify-center',
  sourceBox: 'p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800',
  targetBox: 'p-4 rounded-2xl bg-purple-50/70 dark:bg-purple-950/30 border border-purple-200/80 dark:border-purple-800/50',
} as const;

// Top App Bar Tokens
export const topAppBarTokens = {
  header: `sticky top-0 z-30 w-full ${glassmorphism.topBar} ${spacing.padding.topBar} transition-colors`,
  avatar: 'w-10 h-10 md:w-11 md:h-11 rounded-2xl bg-gradient-to-tr from-primary-purple via-blue-600 to-primary-green flex items-center justify-center text-white font-bold text-base md:text-lg shadow-md shadow-purple-500/15',
  languagePill: 'hidden lg:flex items-center gap-1 p-1 rounded-2xl bg-slate-100 dark:bg-slate-800/70 border border-slate-200/60 dark:border-slate-700',
  iconButton: 'p-2 md:p-2.5 rounded-2xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 transition-colors cursor-pointer',
} as const;

// Bottom Navigation Tokens
export const bottomNavTokens = {
  container: `fixed bottom-0 left-0 right-0 z-40 ${glassmorphism.bottomNav} ${spacing.padding.bottomNav} md:hidden shadow-lg`,
  innerWrapper: 'max-w-md mx-auto flex items-center justify-around',
  item: 'relative flex flex-col items-center justify-center p-1.5 min-w-[54px] rounded-2xl transition-all select-none',
  activeIndicator: 'absolute inset-0 bg-blue-50 dark:bg-blue-950/50 rounded-2xl -z-10 border border-blue-200/50 dark:border-blue-800/40',
  label: 'text-[10px] tracking-tight mt-0.5 font-medium',
} as const;

// Skeleton Tokens
export const skeletonTokens = {
  base: 'animate-pulse bg-slate-200/80 dark:bg-slate-800/80',
  card: `${radius.classes.card} p-6 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-4 shadow-sm`,
  flashcard: `${radius.classes.container} h-56 p-6 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 flex flex-col items-center justify-center space-y-3 shadow-sm`,
} as const;

// Dashboard Screen Tokens
export const dashboardTokens = {
  heroBanner: `${radius.classes.container} p-6 md:p-8 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 text-white shadow-xl shadow-blue-500/15 relative overflow-hidden`,
  weatherChip: 'inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold text-white border border-white/30 select-none',
  offlineSyncBreathing: 'inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/25 backdrop-blur-md border border-emerald-300/40 text-xs font-bold text-emerald-100 select-none shadow-sm',
  offlineBreathingDot: 'w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping shrink-0',
  offlineStaticDot: 'w-2.5 h-2.5 rounded-full bg-emerald-400 shrink-0',
  statPill: 'flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-white/20 backdrop-blur-md text-xs font-bold text-white border border-white/25 select-none shadow-sm',
  flnCard: `${radius.classes.container} p-6 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-md shadow-slate-200/40 dark:shadow-none space-y-4`,
  aiCard: `${radius.classes.container} p-6 relative bg-white dark:bg-slate-900 border border-transparent before:absolute before:inset-0 before:-z-10 before:rounded-[28px] before:p-[1.5px] before:bg-gradient-to-r before:from-blue-500 before:via-purple-500 before:to-pink-500 shadow-xl shadow-purple-500/10 space-y-4`,
  illustrationBox: 'relative w-full h-52 sm:h-60 rounded-[24px] overflow-hidden bg-gradient-to-br from-amber-50 via-orange-50 to-emerald-50 dark:from-slate-800/90 dark:via-slate-900 dark:to-slate-800/90 flex items-center justify-center border border-amber-200/70 dark:border-slate-700/60 shadow-inner',
  illustrationSvgColors: {
    sun: '#F59E0B',
    treeLeaf: '#10B981',
    treeTrunk: '#854D0E',
    chalkboard: '#064E3B',
    boardBorder: '#78350F',
    textWhite: '#FFFFFF',
    textYellow: '#FEF08A',
    sohraiAccent: '#EA580C',
    studentDress: '#2563EB',
    teacherSari: '#8B5CF6',
  },
  streakChip: 'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-amber-400 text-amber-950 font-bold text-xs select-none shadow-sm',
  xpChip: 'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-purple-500/30 backdrop-blur-md text-white font-bold text-xs border border-purple-300/30 select-none shadow-sm',
  quickActionCard: `${radius.classes.container} min-h-[210px] p-6 text-white border-0 flex flex-col justify-between overflow-hidden relative shadow-lg`,
  activityCard: `${radius.classes.card} p-5 flex flex-col items-center text-center space-y-2.5 transition-all select-none`,
  progressRing: {
    size: 58,
    strokeWidth: 6,
    track: '#E2E8F0',
    trackDark: '#334155',
    indicator: '#10B981',
    indicatorBlue: '#2563EB',
  },
} as const;

// 10. Hornbill AI Mascot "Johar AI" Tokens
export const mascotTokens = {
  container: 'relative inline-flex items-center justify-center select-none',
  colors: {
    beak: '#F59E0B',
    beakDark: '#D97706',
    casque: '#EA580C',
    body: '#1F2937',
    belly: '#F8FAFC',
    eye: '#1E293B',
    eyeHighlight: '#FFFFFF',
    cheek: '#F43F5E',
    featherAccent: '#10B981',
    sohraiCrown: '#FACC15',
  },
  dialogueBubble: 'p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-slate-900 border border-amber-200/80 dark:border-slate-800 shadow-md text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-100 relative',
  dialogueArrow: 'w-3 h-3 bg-white dark:bg-slate-900 border-b border-l border-amber-200/80 dark:border-slate-800 transform rotate-45 absolute -bottom-1.5 left-6',
} as const;

// 11. Subtle Sohrai & Khovar Tribal Art Patterns
export const tribalArtTokens = {
  colors: {
    ochre: '#C27803',
    terracotta: '#C85A32',
    charcoal: '#2C2C2C',
    riceCream: '#FBF8F1',
    forestGreen: '#1E5B3A',
    skyBlue: '#2B6CB0',
  },
  borderPattern: 'border-b-2 border-dashed border-amber-300/80 dark:border-amber-700/60',
  cardHeaderPattern: 'relative overflow-hidden before:absolute before:top-0 before:left-0 before:right-0 before:h-1.5 before:bg-gradient-to-r before:from-amber-500 before:via-orange-500 before:to-emerald-500',
} as const;

// 12. Voice Translation Screen Tokens
export const voiceScreenTokens = {
  container: 'space-y-6 max-w-4xl mx-auto pb-12',
  heroMicCard: `${radius.classes.container} p-6 sm:p-8 bg-gradient-to-b from-blue-50/70 via-white to-purple-50/70 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 border border-blue-100 dark:border-slate-800 shadow-xl flex flex-col items-center justify-center text-center relative overflow-hidden`,
  waveformBox: 'flex items-center justify-center gap-1.5 h-10 my-3',
  waveformBar: 'w-1.5 rounded-full bg-primary-blue dark:bg-blue-400 origin-bottom transition-all',
  bubbleUser: `${radius.classes.card} p-5 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm max-w-md self-start space-y-2`,
  bubbleTarget: `${radius.classes.card} p-5 bg-purple-50/90 dark:bg-purple-950/50 border border-purple-200/80 dark:border-purple-800/60 shadow-sm max-w-md self-end space-y-2`,
} as const;

// 13. Flashcard Screen Tokens
export const flashcardTokens = {
  container: 'space-y-6 max-w-3xl mx-auto pb-12',
  mainCard: `${radius.classes.container} min-h-[420px] p-6 sm:p-8 bg-white dark:bg-slate-900 border-2 border-slate-200/80 dark:border-slate-800 shadow-xl flex flex-col items-center justify-between text-center select-none relative overflow-hidden`,
  illustrationFrame: 'w-52 h-52 sm:w-60 sm:h-60 rounded-[28px] bg-gradient-to-tr from-amber-50 via-orange-50 to-emerald-50 dark:from-slate-800 dark:via-slate-800 dark:to-slate-700/80 border border-amber-200/70 dark:border-slate-700 flex items-center justify-center p-4 shadow-inner relative',
  actionPill: 'px-5 py-3 rounded-2xl font-bold text-sm select-none cursor-pointer flex items-center gap-2',
} as const;

// 14. Worksheets Screen Tokens
export const worksheetTokens = {
  container: 'space-y-6 max-w-4xl mx-auto pb-12',
  paperPreview: 'bg-white text-slate-900 shadow-2xl rounded-[24px] border border-slate-200 p-8 sm:p-12 max-w-3xl mx-auto space-y-6 font-sans relative overflow-hidden',
  exerciseBox: 'p-4 sm:p-5 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/40 space-y-3',
  nipunBadge: 'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800',
} as const;

// 15. Story Library Tokens
export const storyTokens = {
  storyCard: `${radius.classes.container} p-5 sm:p-6 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-4 hover:shadow-md transition-all`,
  storyBadge: 'inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-900 border border-amber-300 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800',
} as const;


