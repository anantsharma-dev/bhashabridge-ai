import { create } from 'zustand';
import type { ChatEntry } from '../components/voice/ConversationMode';

const DB_NAME = 'bhashabridge_db';
const DB_VERSION = 1;
const STORE_CONVERSATIONS = 'conversations';
const STORE_FAVORITES = 'favorites';
const LOCAL_STORAGE_KEY = 'bhashabridge_conversation_cache';

// IndexedDB Helper
class IndexedDbStorage {
  private dbPromise: Promise<IDBDatabase | null> | null = null;

  private init(): Promise<IDBDatabase | null> {
    if (this.dbPromise) return this.dbPromise;

    if (typeof window === 'undefined' || !window.indexedDB) {
      return Promise.resolve(null);
    }

    this.dbPromise = new Promise((resolve) => {
      try {
        const req = window.indexedDB.open(DB_NAME, DB_VERSION);

        req.onupgradeneeded = () => {
          const db = req.result;
          if (!db.objectStoreNames.contains(STORE_CONVERSATIONS)) {
            db.createObjectStore(STORE_CONVERSATIONS, { keyPath: 'id' });
          }
          if (!db.objectStoreNames.contains(STORE_FAVORITES)) {
            db.createObjectStore(STORE_FAVORITES, { keyPath: 'id' });
          }
        };

        req.onsuccess = () => resolve(req.result);
        req.onerror = () => resolve(null);
      } catch {
        resolve(null);
      }
    });

    return this.dbPromise;
  }

  public async saveConversations(items: ChatEntry[]): Promise<void> {
    const db = await this.init();
    if (!db) {
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(items));
      } catch {
        // ignore
      }
      return;
    }

    try {
      const tx = db.transaction([STORE_CONVERSATIONS], 'readwrite');
      const store = tx.objectStore(STORE_CONVERSATIONS);
      await new Promise<void>((resolve, reject) => {
        const clearReq = store.clear();
        clearReq.onsuccess = () => {
          for (const item of items) {
            store.put(item);
          }
          resolve();
        };
        clearReq.onerror = () => reject(clearReq.error);
      });
    } catch {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(items));
    }
  }

  public async loadConversations(): Promise<ChatEntry[]> {
    const db = await this.init();
    if (!db) {
      try {
        const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
        return raw ? JSON.parse(raw) : [];
      } catch {
        return [];
      }
    }

    return new Promise<ChatEntry[]>((resolve) => {
      try {
        const tx = db.transaction([STORE_CONVERSATIONS], 'readonly');
        const store = tx.objectStore(STORE_CONVERSATIONS);
        const req = store.getAll();
        req.onsuccess = () => resolve(req.result || []);
        req.onerror = () => resolve([]);
      } catch {
        try {
          const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
          resolve(raw ? JSON.parse(raw) : []);
        } catch {
          resolve([]);
        }
      }
    });
  }
}

const idbStorage = new IndexedDbStorage();

export interface RecentLanguagePair {
  source: string;
  target: string;
  lastUsed: number;
}

interface ConversationState {
  history: ChatEntry[];
  recentLanguages: RecentLanguagePair[];
  isLoaded: boolean;
  addEntry: (entry: ChatEntry) => void;
  removeEntry: (id: string) => void;
  clearHistory: () => void;
  toggleFavorite: (id: string) => void;
  setRecentLanguages: (source: string, target: string) => void;
  initStore: () => Promise<void>;
}

const DEFAULT_ENTRIES: ChatEntry[] = [
  {
    id: '1',
    speaker: 'teacher',
    hindi: 'जोहार बच्चों! आज हम नए पशुओं के नाम सीखेंगे।',
    santhali: 'ᱡᱚᱦᱟᱨ ᱜᱤᱫᱽᱨᱟᱹ! ᱛᱮᱦᱮᱧ ᱫᱚ ᱵᱚᱱ ᱱᱟᱣᱟ ᱡᱤᱵᱽ ᱡᱤᱭᱟᱹᱞᱤ ᱧᱩᱛᱩᱢ ᱪᱮᱫᱚᱜ-ᱟ ᱾',
    santhaliLatin: 'Johar gidra! Tehenj do bon nawa jib jiyali nutum chedoga.',
  },
  {
    id: '2',
    speaker: 'child',
    hindi: 'हाँ मैडम, हम तैयार हैं!',
    santhali: 'ᱦᱮᱸ ᱢᱟᱪᱮᱛ, ᱟᱞᱮ ᱫᱚᱞᱮ ᱥᱟᱯᱲᱟᱣ ᱟᱠᱟᱱᱟ!',
    santhaliLatin: 'Hen machet, ale dole saphraw akana!',
  },
];

export const useConversationStore = create<ConversationState>((set, get) => ({
  history: DEFAULT_ENTRIES,
  recentLanguages: [
    { source: 'hindi', target: 'santhali', lastUsed: Date.now() },
  ],
  isLoaded: false,

  initStore: async () => {
    const loaded = await idbStorage.loadConversations();
    if (loaded && loaded.length > 0) {
      set({ history: loaded, isLoaded: true });
    } else {
      set({ history: DEFAULT_ENTRIES, isLoaded: true });
      await idbStorage.saveConversations(DEFAULT_ENTRIES);
    }
  },

  addEntry: (entry: ChatEntry) => {
    const next = [entry, ...get().history].slice(0, 40);
    set({ history: next });
    idbStorage.saveConversations(next);
  },

  removeEntry: (id: string) => {
    const next = get().history.filter((h) => h.id !== id);
    set({ history: next });
    idbStorage.saveConversations(next);
  },

  clearHistory: () => {
    set({ history: [] });
    idbStorage.saveConversations([]);
  },

  toggleFavorite: (id: string) => {
    const next = get().history.map((item) =>
      item.id === id ? { ...item, isFavorite: !item.isFavorite } : item
    );
    set({ history: next });
    idbStorage.saveConversations(next);
  },

  setRecentLanguages: (source: string, target: string) => {
    const existing = get().recentLanguages.filter(
      (p) => !(p.source === source && p.target === target)
    );
    set({
      recentLanguages: [{ source, target, lastUsed: Date.now() }, ...existing].slice(0, 5),
    });
  },
}));

export const conversationHistory = {
  getStore: useConversationStore,
  storage: idbStorage,
};

export default conversationHistory;
