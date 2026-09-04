import React from 'react';
import { X, CheckCircle2, Trophy } from 'lucide-react';
import { HORNBILL_STAGES } from '../../services/gamificationService';

export interface HornbillEvolutionModalProps {
  isOpen: boolean;
  currentXp: number;
  onClose: () => void;
}

export const HornbillEvolutionModal: React.FC<HornbillEvolutionModalProps> = ({
  isOpen,
  currentXp,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-[#FFFDF7] rounded-[28px] border border-amber-200 p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-6">
        <div className="flex items-center justify-between pb-2 border-b border-amber-100">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-2xl bg-amber-100 text-amber-900">
              <Trophy size={20} />
            </span>
            <div>
              <h3 className="text-lg font-black text-slate-900 font-baloo">
                Johar Hornbill Companion Evolution
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Current Learning Score: {currentXp} XP
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-xl text-slate-400 hover:text-slate-600 cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        <div className="space-y-3">
          {HORNBILL_STAGES.map((stg) => {
            const isUnlocked = currentXp >= stg.minXp;
            return (
              <div
                key={stg.stage}
                className={`p-4 rounded-2xl border transition-all flex items-start gap-4 ${
                  isUnlocked
                    ? 'bg-white border-amber-300 shadow-2xs'
                    : 'bg-slate-50/70 border-slate-200 opacity-60'
                }`}
              >
                <div className="text-4xl p-2 rounded-2xl bg-amber-50 shrink-0">
                  {stg.emoji}
                </div>
                <div className="space-y-1 flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-extrabold text-slate-900 font-baloo">
                      Stage {stg.stage}: {stg.title}
                    </h4>
                    {isUnlocked ? (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-900 flex items-center gap-1">
                        <CheckCircle2 size={10} /> Active
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold text-slate-500">
                        Requires {stg.minXp} XP
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-600">{stg.description}</p>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {stg.perks.map((p, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded-md bg-amber-50 text-[10px] font-bold text-amber-900 border border-amber-200"
                      >
                        ✓ {p}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <button
          type="button"
          onClick={onClose}
          className="w-full py-3 rounded-2xl bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-xs shadow-xs cursor-pointer"
        >
          Keep Learning & Growing
        </button>
      </div>
    </div>
  );
};

export default HornbillEvolutionModal;
