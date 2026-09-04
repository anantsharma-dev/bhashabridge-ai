import { create } from 'zustand';

interface FavoritesState {
  favoriteCardIds: string[];
  masteredCardIds: string[];
  favoriteWorksheetIds: string[];
  toggleFavoriteCard: (id: string) => void;
  toggleMasteredCard: (id: string) => void;
  toggleFavoriteWorksheet: (id: string) => void;
  isCardFavorite: (id: string) => boolean;
  isCardMastered: (id: string) => boolean;
}

const STORAGE_KEY = 'bhashabridge_favorites_data';

const getInitialState = () => {
  if (typeof window === 'undefined') {
    return {
      favoriteCardIds: ['elephant', 'mango'],
      masteredCardIds: ['elephant', 'mango'],
      favoriteWorksheetIds: [],
    };
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch {
    // fallback
  }

  return {
    favoriteCardIds: ['elephant', 'mango'],
    masteredCardIds: ['elephant', 'mango'],
    favoriteWorksheetIds: [],
  };
};

export const useFavoritesStore = create<FavoritesState>((set, get) => {
  const initial = getInitialState();

  const persist = (nextState: Partial<FavoritesState>) => {
    try {
      const current = {
        favoriteCardIds: nextState.favoriteCardIds ?? get().favoriteCardIds,
        masteredCardIds: nextState.masteredCardIds ?? get().masteredCardIds,
        favoriteWorksheetIds: nextState.favoriteWorksheetIds ?? get().favoriteWorksheetIds,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
    } catch {
      // ignore
    }
  };

  return {
    favoriteCardIds: initial.favoriteCardIds,
    masteredCardIds: initial.masteredCardIds,
    favoriteWorksheetIds: initial.favoriteWorksheetIds,

    toggleFavoriteCard: (id: string) => {
      const { favoriteCardIds } = get();
      const updated = favoriteCardIds.includes(id)
        ? favoriteCardIds.filter((item) => item !== id)
        : [...favoriteCardIds, id];
      set({ favoriteCardIds: updated });
      persist({ favoriteCardIds: updated });
    },

    toggleMasteredCard: (id: string) => {
      const { masteredCardIds } = get();
      const updated = masteredCardIds.includes(id)
        ? masteredCardIds.filter((item) => item !== id)
        : [...masteredCardIds, id];
      set({ masteredCardIds: updated });
      persist({ masteredCardIds: updated });
    },

    toggleFavoriteWorksheet: (id: string) => {
      const { favoriteWorksheetIds } = get();
      const updated = favoriteWorksheetIds.includes(id)
        ? favoriteWorksheetIds.filter((item) => item !== id)
        : [...favoriteWorksheetIds, id];
      set({ favoriteWorksheetIds: updated });
      persist({ favoriteWorksheetIds: updated });
    },

    isCardFavorite: (id: string) => {
      return get().favoriteCardIds.includes(id);
    },

    isCardMastered: (id: string) => {
      return get().masteredCardIds.includes(id);
    },
  };
});
