import React from 'react';
import { CheckCircle2, HardDrive, Languages, Cpu, Volume2, Mic } from 'lucide-react';

export interface OfflineStatusCardProps {
  className?: string;
}

export const OfflineStatusCard: React.FC<OfflineStatusCardProps> = ({ className = '' }) => {
  return (
    <div
      className={`rounded-[24px] bg-[#F0FDF4] border border-[#BBF7D0] p-5 sm:p-6 shadow-[0_4px_20px_rgba(0,0,0,0.04)] space-y-4 ${className}`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-emerald-200/60">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-emerald-200 text-emerald-900 flex items-center justify-center">
            <CheckCircle2 size={18} />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-slate-900 font-baloo leading-tight">
              100% Offline Neural Voice Engine Ready
            </h3>
            <p className="text-xs text-emerald-800 font-medium">
              Zero Internet Required • Fast On-Device Inference
            </p>
          </div>
        </div>

        <span className="self-start sm:self-auto px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 font-bold text-xs border border-emerald-300">
          Dumka Tablet Verified
        </span>
      </div>

      {/* Grid of 4 Status Points */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="p-3 rounded-2xl bg-white/80 border border-emerald-200/80 space-y-1">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
            <Mic size={14} className="text-emerald-600" />
            <span>Whisper Ready</span>
          </div>
          <p className="text-[11px] text-slate-500 font-medium">Speech-to-Text Tiny</p>
        </div>

        <div className="p-3 rounded-2xl bg-white/80 border border-emerald-200/80 space-y-1">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
            <Volume2 size={14} className="text-emerald-600" />
            <span>Piper TTS Ready</span>
          </div>
          <p className="text-[11px] text-slate-500 font-medium">Bilingual Natural Audio</p>
        </div>

        <div className="p-3 rounded-2xl bg-white/80 border border-emerald-200/80 space-y-1">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
            <Cpu size={14} className="text-emerald-600" />
            <span>IndicTrans2</span>
          </div>
          <p className="text-[11px] text-slate-500 font-medium">Tribal MT Weights</p>
        </div>

        <div className="p-3 rounded-2xl bg-white/80 border border-emerald-200/80 space-y-1">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
            <HardDrive size={14} className="text-emerald-600" />
            <span>Storage Used</span>
          </div>
          <p className="text-[11px] text-slate-500 font-medium">420 MB / 4.0 GB</p>
        </div>
      </div>

      <div className="flex items-center gap-2 pt-1 text-xs text-emerald-900 font-medium">
        <Languages size={14} className="text-emerald-700 shrink-0" />
        <span>Downloaded Languages: <strong>Hindi, Santali (Ol Chiki), Ho, Mundari, Kurukh</strong></span>
      </div>
    </div>
  );
};
