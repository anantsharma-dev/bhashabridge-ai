import React from 'react';
import { HardDrive, Trash2, RefreshCw } from 'lucide-react';

export interface StorageManagementProps {
  usedMB?: number;
  totalMB?: number;
  onClearCache?: () => void;
  onUpdateAll?: () => void;
  className?: string;
}

export const StorageManagement: React.FC<StorageManagementProps> = ({
  usedMB = 1240,
  totalMB = 16384,
  onClearCache,
  onUpdateAll,
  className = '',
}) => {
  const percentUsed = Math.round((usedMB / totalMB) * 100);
  const freeGB = ((totalMB - usedMB) / 1024).toFixed(1);
  const usedGB = (usedMB / 1024).toFixed(1);

  return (
    <div
      className={`rounded-[24px] bg-white border border-[#F1EFE8] p-6 sm:p-7 shadow-[0_4px_20px_rgba(0,0,0,0.04)] space-y-5 ${className}`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
        <div>
          <h3 className="text-lg font-extrabold text-slate-900 font-baloo">
            Storage & Local Cache Management
          </h3>
          <p className="text-xs text-slate-500 font-medium">
            Manage on-device offline storage for uninterrupted rural classroom teaching
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onUpdateAll}
            className="min-h-[40px] px-3.5 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-900 font-bold text-xs flex items-center gap-1.5 border border-blue-200 cursor-pointer"
          >
            <RefreshCw size={14} />
            <span>Update All Packs</span>
          </button>
          <button
            type="button"
            onClick={onClearCache}
            className="min-h-[40px] px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-700 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
          >
            <Trash2 size={14} />
            <span>Clear Unused Cache</span>
          </button>
        </div>
      </div>

      {/* Storage Visual Gauge */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-bold text-slate-700">
          <span className="flex items-center gap-1.5">
            <HardDrive size={14} className="text-emerald-600" />
            Internal eMMC Memory
          </span>
          <span>
            {usedGB} GB used ({percentUsed}%) • <strong>{freeGB} GB available</strong>
          </span>
        </div>

        <div className="h-4 w-full bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200 flex">
          <div
            className="h-full rounded-l-full bg-emerald-500"
            style={{ width: `${percentUsed}%` }}
          />
          <div
            className="h-full rounded-r-full bg-slate-200"
            style={{ width: `${100 - percentUsed}%` }}
          />
        </div>
      </div>

      {/* Storage Breakdown Chips */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-0.5">
          <span className="text-slate-400 font-medium">Stories & Worksheets</span>
          <p className="font-extrabold text-slate-800 font-baloo text-sm">60 MB</p>
        </div>
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-0.5">
          <span className="text-slate-400 font-medium">Flashcards & Images</span>
          <p className="font-extrabold text-slate-800 font-baloo text-sm">46 MB</p>
        </div>
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-0.5">
          <span className="text-slate-400 font-medium">Piper Voice Models</span>
          <p className="font-extrabold text-slate-800 font-baloo text-sm">180 MB</p>
        </div>
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-0.5">
          <span className="text-slate-400 font-medium">Neural Translation Engine</span>
          <p className="font-extrabold text-slate-800 font-baloo text-sm">380 MB</p>
        </div>
      </div>
    </div>
  );
};
