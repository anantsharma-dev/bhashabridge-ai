import React, { useState, useEffect } from 'react';
import {
  Search,
  Download,
  CheckCircle2,
  RefreshCw,
  Trash2,
  Filter,
  Loader2,
  BookOpen,
  Volume2,
  Languages,
  Sparkles,
} from 'lucide-react';
import {
  downloadPacksService,
  type DownloadablePack,
  type GradePack,
  type DistrictLanguagePack,
  type AudioPack,
  type StoryPack,
} from '../../services/downloadPacksService';

export type DownloadFilter = 'all' | 'downloaded' | 'available' | 'update';
export type PackCategory = 'all' | 'grades' | 'districts' | 'audio' | 'stories';

export interface DownloadManagerProps {
  activeSection?: string;
  onToast?: (message: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
  className?: string;
}

export const DownloadManager: React.FC<DownloadManagerProps> = ({
  activeSection: _activeSection,
  onToast,
  className = '',
}) => {
  const [filter, setFilter] = useState<DownloadFilter>('all');
  const [packCategory, setPackCategory] = useState<PackCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [packs, setPacks] = useState<DownloadablePack[]>([]);
  const [loading, setLoading] = useState(true);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const loadPacks = async () => {
    try {
      const all = await downloadPacksService.getAllPacks();
      setPacks(all);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPacks();
    const unsub = downloadPacksService.subscribe(() => {
      loadPacks();
    });
    return unsub;
  }, []);

  const handleDownload = async (pack: DownloadablePack) => {
    setDownloadingId(pack.id);
    try {
      await downloadPacksService.downloadPack(pack.id);
      onToast?.(`Downloaded "${pack.title}" (${pack.sizeFormatted}) for 100% offline classroom use!`, 'success');
    } catch {
      onToast?.(`Failed to download ${pack.title}`, 'error');
    } finally {
      setDownloadingId(null);
    }
  };

  const handleUpdate = async (pack: DownloadablePack) => {
    setDownloadingId(pack.id);
    try {
      await downloadPacksService.updatePack(pack.id);
      onToast?.(`Updated "${pack.title}" to latest version!`, 'success');
    } catch {
      onToast?.(`Failed to update ${pack.title}`, 'error');
    } finally {
      setDownloadingId(null);
    }
  };

  const handleDelete = async (pack: DownloadablePack) => {
    await downloadPacksService.deletePack(pack.id);
    onToast?.(`Removed "${pack.title}" from offline storage.`, 'info');
  };

  const filteredPacks = packs.filter((p) => {
    // 1. Pack Category Filter
    if (packCategory === 'grades' && p.packType !== 'grade') return false;
    if (packCategory === 'districts' && p.packType !== 'district') return false;
    if (packCategory === 'audio' && p.packType !== 'audio') return false;
    if (packCategory === 'stories' && p.packType !== 'story') return false;

    // 2. Status Filter
    if (filter !== 'all' && p.status !== filter) return false;

    // 3. Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = p.title.toLowerCase().includes(q);
      const matchHindi = p.hindiTitle.toLowerCase().includes(q);
      const matchType = p.packType.toLowerCase().includes(q);
      return matchTitle || matchHindi || matchType;
    }

    return true;
  });

  return (
    <div
      className={`rounded-[24px] bg-white border border-[#F1EFE8] p-6 sm:p-7 shadow-[0_4px_20px_rgba(0,0,0,0.04)] space-y-5 ${className}`}
    >
      {/* Category Pills Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div>
          <h3 className="text-lg font-extrabold text-slate-900 font-baloo">
            Offline Download Packs
          </h3>
          <p className="text-xs text-slate-500 font-medium">
            JCERT 2026-27 Curriculum Packs • Tribal Languages • Kokoro Voices • Folk Stories
          </p>
        </div>

        {/* Category Selector Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1">
          {[
            { id: 'all', label: 'All Packs', icon: Sparkles },
            { id: 'grades', label: 'Grade Packs (1-5)', icon: BookOpen },
            { id: 'districts', label: 'District Languages', icon: Languages },
            { id: 'audio', label: 'Kokoro Audio', icon: Volume2 },
            { id: 'stories', label: 'Story Packs', icon: BookOpen },
          ].map((cat) => {
            const Icon = cat.icon;
            const isSelected = packCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setPackCategory(cat.id as PackCategory)}
                className={`min-h-[38px] px-3 py-1 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shrink-0 transition-all ${
                  isSelected
                    ? 'bg-[#2563EB] text-white shadow-2xs'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200'
                }`}
              >
                <Icon size={14} />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Search & Filter Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search grade, district, Kokoro voices..."
            className="w-full min-h-[44px] pl-10 pr-4 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-medium focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Status Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1">
          <Filter size={14} className="text-slate-400 mr-1 hidden sm:inline shrink-0" />
          {(['all', 'downloaded', 'available', 'update'] as DownloadFilter[]).map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={`min-h-[38px] px-3.5 py-1 rounded-xl text-xs font-bold capitalize transition-all cursor-pointer shrink-0 ${
                filter === f
                  ? 'bg-slate-800 text-white shadow-2xs'
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
        {loading ? (
          <div className="p-8 text-center text-slate-500 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm flex items-center justify-center gap-2">
            <Loader2 size={16} className="animate-spin text-blue-600" />
            <span>Loading offline download packs from SQLite database...</span>
          </div>
        ) : filteredPacks.length === 0 ? (
          <div className="p-8 text-center text-slate-500 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-medium">
            No offline packs match the selected category or filter.
          </div>
        ) : (
          filteredPacks.map((pack) => {
            const isProcessing = downloadingId === pack.id || pack.status === 'downloading';

            return (
              <div
                key={pack.id}
                className="p-4 rounded-2xl bg-[#FFFDF7] border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs"
              >
                <div className="space-y-1.5 min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                        pack.packType === 'grade'
                          ? 'bg-amber-100 text-amber-900'
                          : pack.packType === 'district'
                          ? 'bg-emerald-100 text-emerald-900'
                          : pack.packType === 'audio'
                          ? 'bg-purple-100 text-purple-900'
                          : 'bg-blue-100 text-blue-900'
                      }`}
                    >
                      {pack.packType === 'grade'
                        ? (pack as GradePack).grade
                        : pack.packType === 'district'
                        ? (pack as DistrictLanguagePack).district
                        : pack.packType === 'audio'
                        ? (pack as AudioPack).modelFormat
                        : 'Illustrated Storybook'}
                    </span>
                    <span className="text-[11px] font-semibold text-slate-500">
                      v{pack.version} • {pack.sizeFormatted}
                    </span>
                  </div>

                  <h4 className="text-sm sm:text-base font-extrabold text-slate-900 font-baloo leading-tight">
                    {pack.title}
                  </h4>
                  <p className="text-xs font-semibold text-slate-600 font-devanagari">
                    {pack.hindiTitle}
                  </p>

                  {/* Metadata Chips based on pack type */}
                  <div className="flex items-center gap-2 pt-0.5 text-[11px] text-slate-500">
                    {pack.packType === 'grade' && (
                      <span>
                        {(pack as GradePack).lessonsCount} Lessons • {(pack as GradePack).worksheetsCount} Worksheets • {(pack as GradePack).flashcardsCount} Flashcards
                      </span>
                    )}
                    {pack.packType === 'district' && (
                      <span>
                        {(pack as DistrictLanguagePack).vocabularyCount} Vocab Words • Script: {(pack as DistrictLanguagePack).script}
                      </span>
                    )}
                    {pack.packType === 'audio' && (
                      <span>
                        Voice: {(pack as AudioPack).voiceType.toUpperCase()} • Sample Rate: {(pack as AudioPack).sampleRate}
                      </span>
                    )}
                    {pack.packType === 'story' && (
                      <span>
                        {(pack as StoryPack).pageCount} Pages • {(pack as StoryPack).illustrationsCount} Sohrai Artworks • Audio Included
                      </span>
                    )}
                  </div>

                  {/* Realtime Progress Bar for downloading packs */}
                  {pack.status === 'downloading' && (
                    <div className="pt-2 space-y-1">
                      <div className="flex items-center justify-between text-[11px] font-bold text-blue-700">
                        <span>Downloading to offline SQLite store...</span>
                        <span>{pack.progressPercent}%</span>
                      </div>
                      <div className="h-2 w-full bg-blue-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-600 transition-all duration-200"
                          style={{ width: `${pack.progressPercent}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Right Actions */}
                <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 shrink-0">
                  {pack.status === 'downloaded' && (
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1.5 rounded-xl border border-emerald-200">
                        <CheckCircle2 size={13} /> Installed
                      </span>
                      <button
                        type="button"
                        onClick={() => handleDelete(pack)}
                        className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 cursor-pointer transition-colors"
                        title="Delete from offline storage"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  )}

                  {pack.status === 'update' && (
                    <button
                      type="button"
                      disabled={isProcessing}
                      onClick={() => handleUpdate(pack)}
                      className="min-h-[40px] px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-2xs cursor-pointer disabled:opacity-50"
                    >
                      {isProcessing ? <Loader2 size={13} className="animate-spin" /> : <RefreshCw size={13} />}
                      <span>{isProcessing ? 'Updating...' : 'Update Pack'}</span>
                    </button>
                  )}

                  {pack.status === 'available' && (
                    <button
                      type="button"
                      disabled={isProcessing}
                      onClick={() => handleDownload(pack)}
                      className="min-h-[40px] px-4 py-1.5 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-2xs cursor-pointer disabled:opacity-50"
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
