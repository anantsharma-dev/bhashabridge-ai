import { create } from 'zustand';

export type ThemeMode = 'light' | 'dark' | 'system';
export type TargetLanguage = 'santhali' | 'ho' | 'mundari' | 'kudukh';

interface ThemeState {
  theme: ThemeMode;
  isDark: boolean;
  isOffline: boolean;
  currentLanguage: TargetLanguage;
  setTheme: (mode: ThemeMode) => void;
  toggleDark: () => void;
  setOffline: (offline: boolean) => void;
  setCurrentLanguage: (lang: TargetLanguage) => void;
}

const getInitialDark = (): boolean => {
  if (typeof window === 'undefined') return false;
  const saved = localStorage.getItem('bb-theme') as ThemeMode | null;
  if (saved === 'dark') return true;
  if (saved === 'light') return false;
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
};

export const useThemeStore = create<ThemeState>((set, get) => {
  const initialDark = getInitialDark();
  if (typeof document !== 'undefined') {
    if (initialDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }

  // Set up online/offline listeners
  if (typeof window !== 'undefined') {
    window.addEventListener('online', () => set({ isOffline: false }));
    window.addEventListener('offline', () => set({ isOffline: true }));
  }

  return {
    theme: (typeof window !== 'undefined' && (localStorage.getItem('bb-theme') as ThemeMode)) || 'light',
    isDark: initialDark,
    isOffline: typeof navigator !== 'undefined' ? !navigator.onLine : false,
    currentLanguage: 'santhali',

    setTheme: (mode: ThemeMode) => {
      let isDark = false;
      if (mode === 'dark') {
        isDark = true;
      } else if (mode === 'system') {
        isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      }

      localStorage.setItem('bb-theme', mode);
      if (isDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }

      set({ theme: mode, isDark });
    },

    toggleDark: () => {
      const nextDark = !get().isDark;
      const nextMode: ThemeMode = nextDark ? 'dark' : 'light';
      localStorage.setItem('bb-theme', nextMode);
      if (nextDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      set({ theme: nextMode, isDark: nextDark });
    },

    setOffline: (offline: boolean) => set({ isOffline: offline }),

    setCurrentLanguage: (lang: TargetLanguage) => set({ currentLanguage: lang }),
  };
});
