import React from 'react';
import { History, Trash2, ChevronRight } from 'lucide-react';
import type { GeneratedContentPackage } from '../../types/contentGenerator';

export interface SavedPackagesModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedPackages: GeneratedContentPackage[];
  onSelect: (pkg: GeneratedContentPackage) => void;
  onDelete: (id: string, e: React.MouseEvent) => void;
}

export const SavedPackagesModal: React.FC<SavedPackagesModalProps> = ({
  isOpen,
  onClose,
  savedPackages,
  onSelect,
  onDelete,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-[28px] max-w-xl w-full p-6 space-y-4 shadow-2xl border border-slate-100 max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <History size={18} className="text-blue-600" />
            <h3 className="text-lg font-extrabold text-slate-900 font-baloo">
              Saved Curriculum Packages
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 font-bold text-sm cursor-pointer"
          >
            ✕
          </button>
        </div>

        <div className="overflow-y-auto flex-1 space-y-2 pr-1">
          {savedPackages.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-500 bg-slate-50 rounded-2xl border border-slate-200">
              No saved packages found in local cache. Generate a new package to save it!
            </div>
          ) : (
            savedPackages.map((pkg) => (
              <div
                key={pkg.id}
                onClick={() => onSelect(pkg)}
                className="p-3.5 rounded-2xl bg-[#FFFDF7] hover:bg-blue-50/60 border border-slate-200 flex items-center justify-between gap-3 cursor-pointer transition-all"
              >
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-900">
                      {pkg.inputs.grade} • {pkg.inputs.subject}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {new Date(pkg.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <h4 className="font-extrabold text-slate-900 text-sm font-baloo truncate">
                    {pkg.inputs.topic}
                  </h4>
                  <p className="text-[11px] text-slate-500">{pkg.inputs.language}</p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={(e) => onDelete(pkg.id, e)}
                    className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 cursor-pointer"
                    title="Delete from cache"
                  >
                    <Trash2 size={14} />
                  </button>
                  <ChevronRight size={16} className="text-slate-400" />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
