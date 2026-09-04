import React, { useState } from 'react';
import { Search, Download, CheckCircle2, RefreshCw, Trash2, Filter } from 'lucide-react';

export type DownloadFilter = 'all' | 'downloaded' | 'available' | 'update';

export interface LibraryItem {
  id: string;
  title: string;
  hindiTitle: string;
  category: string;
  size: string;
  status: 'downloaded' | 'available' | 'update';
  progress?: number;
  grade: string;
  language: string;
}

export interface DownloadManagerProps {
  className?: string;
}

export const DownloadManager: React.FC<DownloadManagerProps> = ({ className = '' }) => {
  const [filter, setFilter] = useState<DownloadFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const items: LibraryItem[] = [
    {
      id: '1',
      title: 'Jharkhand Forest Animals Flashcard Pack',
      hindiTitle: 'झारखंड के वन्य जीव चित्र कार्ड',
      category: 'Flashcards',
      size: '14.2 MB',
      status: 'downloaded',
      grade: 'Grade 2',
      language: 'Hindi + Santali',
    },
    {
      id: '2',
      title: 'The Clever Fox & Sacred Hornbill Storybook',
      hindiTitle: 'चालाक लोमड़ी और पवित्र हॉर्नबिल',
      category: 'Stories',
      size: '8.5 MB',
      status: 'downloaded',
      grade: 'Grade 2',
      language: 'Hindi + Santali',
    },
    {
      id: '3',
      title: 'Ho Language Warang Citi Vocabulary Pack',
      hindiTitle: 'हो भाषा वारंग चिति शब्दावली',
      category: 'Language Packs',
      size: '22.0 MB',
      status: 'update',
      grade: 'Grade 1-3',
      language: 'Hindi + Ho',
    },
    {
      id: '4',
      title: 'Counting Numbers 1-20 Math Worksheets',
      hindiTitle: 'संख्या ज्ञान कार्यपत्रक संग्रह',
      category: 'Worksheets',
      size: '4.8 MB',
      status: 'downloaded',
      grade: 'Grade 1',
      language: 'Hindi + Santali',
    },
    {
      id: '5',
      title: 'Mundari Oral Rhymes & Songs Audio Pack',
      hindiTitle: 'मुंडारी मौखिक कविताएँ व गीत',
      category: 'Audio Packs',
      size: '45.0 MB',
      status: 'available',
      grade: 'Grade 1-5',
      language: 'Hindi + Mundari',
    },
  ];

  const filteredItems = items.filter((item) => {
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

      {/* Items List */}
      <div className="space-y-3">
        {filteredItems.map((item) => (
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
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 cursor-pointer"
                    aria-label="Delete download"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              )}

              {item.status === 'update' && (
                <button
                  type="button"
                  className="min-h-[38px] px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs flex items-center gap-1 shadow-2xs cursor-pointer"
                >
                  <RefreshCw size={13} />
                  <span>Update</span>
                </button>
              )}

              {item.status === 'available' && (
                <button
                  type="button"
                  className="min-h-[38px] px-3.5 py-1.5 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1 shadow-2xs cursor-pointer"
                >
                  <Download size={13} />
                  <span>Download</span>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
