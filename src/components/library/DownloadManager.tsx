import React, { useState, useEffect } from 'react';
import { Search, Download, CheckCircle2, RefreshCw, Trash2, Filter, Loader2 } from 'lucide-react';

export type DownloadFilter = 'all' | 'downloaded' | 'available' | 'update';

export interface LibraryItem {
  id: string;
  section: string; // 'stories' | 'worksheets' | 'flashcards' | 'lessons' | 'audio' | 'languages' | 'illustrations' | 'videos'
  title: string;
  hindiTitle: string;
  category: string;
  size: string;
  status: 'downloaded' | 'available' | 'update';
  grade: string;
  language: string;
}

export interface DownloadManagerProps {
  activeSection?: string;
  onToast?: (message: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
  className?: string;
}

const INITIAL_LIBRARY_ITEMS: LibraryItem[] = [
  // Stories
  {
    id: 'story-1',
    section: 'stories',
    title: 'The Clever Fox & Sacred Hornbill Storybook',
    hindiTitle: 'चालाक लोमड़ी और पवित्र हॉर्नबिल',
    category: 'Stories',
    size: '8.5 MB',
    status: 'downloaded',
    grade: 'Grade 2',
    language: 'Hindi + Santali',
  },
  {
    id: 'story-2',
    section: 'stories',
    title: 'Birsa Munda: The Forest Guardian',
    hindiTitle: 'भगवान बिरसा मुंडा: जंगल के रक्षक',
    category: 'Stories',
    size: '12.4 MB',
    status: 'downloaded',
    grade: 'Grade 3',
    language: 'Hindi + Santali',
  },
  {
    id: 'story-3',
    section: 'stories',
    title: 'Sohrai Cattle Festival Folk Tale',
    hindiTitle: 'सोहराय पर्व की पारंपरिक लोककथा',
    category: 'Stories',
    size: '6.2 MB',
    status: 'available',
    grade: 'Grade 2',
    language: 'Santali (Ol Chiki)',
  },
  // Worksheets
  {
    id: 'ws-1',
    section: 'worksheets',
    title: 'Counting Numbers 1-20 Math Worksheets',
    hindiTitle: 'संख्या ज्ञान कार्यपत्रक संग्रह (१-२०)',
    category: 'Worksheets',
    size: '4.8 MB',
    status: 'downloaded',
    grade: 'Grade 1',
    language: 'Hindi + Santali',
  },
  {
    id: 'ws-2',
    section: 'worksheets',
    title: 'Wild Animals Ol Chiki Letter Tracing Kit',
    hindiTitle: 'वन्य जीव ओल चिकी अनुरेखण अभ्यास',
    category: 'Worksheets',
    size: '7.1 MB',
    status: 'downloaded',
    grade: 'Grade 2',
    language: 'Santali (Ol Chiki)',
  },
  {
    id: 'ws-3',
    section: 'worksheets',
    title: 'Family & Relatives Matching Worksheet',
    hindiTitle: 'परिवार एवं रिश्ते मिलान कार्यपत्रक',
    category: 'Worksheets',
    size: '3.9 MB',
    status: 'available',
    grade: 'Grade 1',
    language: 'Hindi + Santali',
  },
  // Flashcards
  {
    id: 'fc-1',
    section: 'flashcards',
    title: 'Jharkhand Forest Animals Flashcard Pack',
    hindiTitle: 'झारखंड के वन्य जीव चित्र कार्ड (१६ कार्ड)',
    category: 'Flashcards',
    size: '14.2 MB',
    status: 'downloaded',
    grade: 'Grade 2',
    language: 'Hindi + Santali',
  },
  {
    id: 'fc-2',
    section: 'flashcards',
    title: 'Birds & Insects 16-Card Vocabulary Deck',
    hindiTitle: 'पक्षी एवं कीट पतंग शब्दावली',
    category: 'Flashcards',
    size: '11.8 MB',
    status: 'downloaded',
    grade: 'Grade 1',
    language: 'Santali + Hindi',
  },
  {
    id: 'fc-3',
    section: 'flashcards',
    title: 'Tribal Musical Instruments (Tamak, Tumdak)',
    hindiTitle: 'पारंपरिक वाद्य यंत्र (टमक, तुमदाक)',
    category: 'Flashcards',
    size: '9.4 MB',
    status: 'update',
    grade: 'Grade 3',
    language: 'Santali + Ho',
  },
  // Lessons
  {
    id: 'les-1',
    section: 'lessons',
    title: 'NEP 9-Phase Bilingual Animals Lesson Plan',
    hindiTitle: 'एनईपी ९-चरणीय द्विभाषी पाठ योजना (पशु)',
    category: 'Lesson Plans',
    size: '2.1 MB',
    status: 'downloaded',
    grade: 'Grade 2',
    language: 'Hindi + Santali',
  },
  {
    id: 'les-2',
    section: 'lessons',
    title: 'FLN Math: Concrete Pebble Counting Routine',
    hindiTitle: 'एफएलएन गणित: कंकड़ व बीज गणना पाठ',
    category: 'Lesson Plans',
    size: '1.8 MB',
    status: 'available',
    grade: 'Grade 1',
    language: 'Santali + Hindi',
  },
  // Audio
  {
    id: 'aud-1',
    section: 'audio',
    title: 'Piper Neural Voice Model (Santali Phonics)',
    hindiTitle: 'पाइपर न्यूरल आवाज़ मॉडल (संताली ध्वनियाँ)',
    category: 'Piper Audio',
    size: '120.0 MB',
    status: 'downloaded',
    grade: 'Grade 1-5',
    language: 'Santali Piper 22kHz',
  },
  {
    id: 'aud-2',
    section: 'audio',
    title: 'Mundari Oral Rhymes & Folk Songs Audio Pack',
    hindiTitle: 'मुंडारी मौखिक कविताएँ व लोकगीत संग्रह',
    category: 'Piper Audio',
    size: '45.0 MB',
    status: 'available',
    grade: 'Grade 1-5',
    language: 'Hindi + Mundari',
  },
  // Languages
  {
    id: 'lang-1',
    section: 'languages',
    title: 'Santali (Ol Chiki) Core Phonics & Grammar',
    hindiTitle: 'संताली ओल चिकी मुख्य व्याकरण व शब्दकोष',
    category: 'Language Packs',
    size: '85.0 MB',
    status: 'downloaded',
    grade: 'Grade 1-5',
    language: 'Santali (Ol Chiki)',
  },
  {
    id: 'lang-2',
    section: 'languages',
    title: 'Ho Language Warang Chiti Vocabulary Pack',
    hindiTitle: 'हो भाषा वारंग चिति शब्दावली कोष',
    category: 'Language Packs',
    size: '22.0 MB',
    status: 'update',
    grade: 'Grade 1-3',
    language: 'Hindi + Ho',
  },
  {
    id: 'lang-3',
    section: 'languages',
    title: 'Kurukh (Oraon) Foundation Dictionary',
    hindiTitle: 'कुड़ुख (उरांव) प्राथमिक शब्दकोश',
    category: 'Language Packs',
    size: '18.5 MB',
    status: 'available',
    grade: 'Grade 1-3',
    language: 'Kurukh + Hindi',
  },
  // Illustrations
  {
    id: 'ill-1',
    section: 'illustrations',
    title: 'Sohrai Wall Art & Tribal Motifs Vector Kit',
    hindiTitle: 'सोहराय भित्तिचित्र व जनजातीय प्रतीक',
    category: 'Illustrations',
    size: '12.0 MB',
    status: 'downloaded',
    grade: 'Grade 1-5',
    language: 'Visual Arts',
  },
  // Videos
  {
    id: 'vid-1',
    section: 'videos',
    title: 'Ol Chiki Letter Stroke Order Animated Guide',
    hindiTitle: 'ओल चिकी वर्णमाला रेखांकन वीडियो गाइड',
    category: 'Videos',
    size: '95.0 MB',
    status: 'available',
    grade: 'Grade 1',
    language: 'Santali Audio',
  },
];

const STORAGE_KEY = 'bhashabridge_library_user_items';

export const DownloadManager: React.FC<DownloadManagerProps> = ({
  activeSection,
  onToast,
  className = '',
}) => {
  const [filter, setFilter] = useState<DownloadFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [items, setItems] = useState<LibraryItem[]>(() => {
    if (typeof window === 'undefined') return INITIAL_LIBRARY_ITEMS;
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return INITIAL_LIBRARY_ITEMS;
  });
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // ignore
    }
  }, [items]);

  const handleDownload = (id: string, name: string) => {
    setDownloadingId(id);
    setTimeout(() => {
      setItems((prev) =>
        prev.map((item) => (item.id === id ? { ...item, status: 'downloaded' as const } : item))
      );
      setDownloadingId(null);
      onToast?.(`Downloaded "${name}" for 100% offline classroom use!`, 'success');
    }, 600);
  };

  const handleUpdate = (id: string, name: string) => {
    setDownloadingId(id);
    setTimeout(() => {
      setItems((prev) =>
        prev.map((item) => (item.id === id ? { ...item, status: 'downloaded' as const } : item))
      );
      setDownloadingId(null);
      onToast?.(`Updated "${name}" to latest JCERT 2026-27 release!`, 'success');
    }, 600);
  };

  const handleDelete = (id: string, name: string) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: 'available' as const } : item))
    );
    onToast?.(`Removed "${name}" from offline cache.`, 'info');
  };

  const filteredItems = items.filter((item) => {
    if (activeSection && activeSection !== 'all' && item.section !== activeSection) {
      return false;
    }
    if (filter !== 'all' && item.status !== filter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        item.title.toLowerCase().includes(q) ||
        item.hindiTitle.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div
      className={`rounded-[24px] bg-white border border-[#F1EFE8] p-6 sm:p-7 shadow-[0_4px_20px_rgba(0,0,0,0.04)] space-y-5 ${className}`}
    >
      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search stories, worksheets, packs..."
            className="w-full min-h-[44px] pl-10 pr-4 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-medium focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1">
          <Filter size={14} className="text-slate-400 mr-1 hidden sm:inline shrink-0" />
          {(['all', 'downloaded', 'available', 'update'] as DownloadFilter[]).map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={`min-h-[38px] px-3.5 py-1 rounded-xl text-xs font-bold capitalize transition-all cursor-pointer shrink-0 ${
                filter === f
                  ? 'bg-[#2563EB] text-white shadow-2xs'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200'
              }`}
            >
              {f === 'update' ? 'Needs Update' : f}
            </button>
          ))}
        </div>
      </div>

      {activeSection && activeSection !== 'all' && (
        <div className="flex items-center justify-between px-3.5 py-2 rounded-xl bg-amber-50/70 border border-amber-200 text-xs text-amber-900 font-medium">
          <span>Filtering by category: <strong className="capitalize">{activeSection}</strong></span>
          <span className="text-[11px] text-amber-700">{filteredItems.length} resources found</span>
        </div>
      )}

      {/* Items List */}
      <div className="space-y-3">
        {filteredItems.length === 0 ? (
          <div className="p-8 text-center text-slate-500 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-medium">
            No offline resources match the selected filter. Try switching categories or changing filter options.
          </div>
        ) : (
          filteredItems.map((item) => {
            const isProcessing = downloadingId === item.id;
            return (
              <div
                key={item.id}
                className="p-4 rounded-2xl bg-[#FFFDF7] border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs"
              >
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-900">
                      {item.category}
                    </span>
                    <span className="text-[11px] font-semibold text-slate-500">
                      {item.grade} • {item.language}
                    </span>
                  </div>
                  <h4 className="text-sm sm:text-base font-extrabold text-slate-900 font-baloo leading-tight">
                    {item.title}
                  </h4>
                  <p className="text-xs font-semibold text-slate-600 font-devanagari">
                    {item.hindiTitle}
                  </p>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                  <span className="text-xs font-bold text-slate-500">
                    {item.size}
                  </span>

                  {item.status === 'downloaded' && (
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-xl border border-emerald-200">
                        <CheckCircle2 size={13} /> Installed
                      </span>
                      <button
                        type="button"
                        onClick={() => handleDelete(item.id, item.title)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 cursor-pointer transition-colors"
                        aria-label={`Delete ${item.title}`}
                        title="Delete from offline cache"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  )}

                  {item.status === 'update' && (
                    <button
                      type="button"
                      disabled={isProcessing}
                      onClick={() => handleUpdate(item.id, item.title)}
                      className="min-h-[38px] px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-2xs cursor-pointer disabled:opacity-50"
                    >
                      {isProcessing ? <Loader2 size={13} className="animate-spin" /> : <RefreshCw size={13} />}
                      <span>{isProcessing ? 'Updating...' : 'Update'}</span>
                    </button>
                  )}

                  {item.status === 'available' && (
                    <button
                      type="button"
                      disabled={isProcessing}
                      onClick={() => handleDownload(item.id, item.title)}
                      className="min-h-[38px] px-3.5 py-1.5 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-2xs cursor-pointer disabled:opacity-50"
                    >
                      {isProcessing ? <Loader2 size={13} className="animate-spin" /> : <Download size={13} />}
                      <span>{isProcessing ? 'Downloading...' : 'Download'}</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default DownloadManager;
