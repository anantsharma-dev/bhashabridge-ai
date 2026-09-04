import React from 'react';
import { CheckCircle2, ShieldCheck, Cpu, Clock, Award } from 'lucide-react';

export interface OfflineReadinessCardProps {
  className?: string;
}

export const OfflineReadinessCard: React.FC<OfflineReadinessCardProps> = ({ className = '' }) => {
  return (
    <div
      className={`rounded-[24px] bg-[#F0FDF4] border border-[#BBF7D0] p-6 sm:p-7 shadow-[0_4px_20px_rgba(0,0,0,0.04)] space-y-4 ${className}`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-emerald-200/60">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-emerald-200 text-emerald-950 flex items-center justify-center font-bold">
            <ShieldCheck size={22} />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-slate-900 font-baloo leading-tight">
              Classroom Offline Readiness Score: 100%
            </h3>
            <p className="text-xs text-emerald-800 font-medium">
              Tested & Certified for Tribal Primary Schools with No Cellular Coverage
            </p>
          </div>
        </div>

        <span className="self-start sm:self-auto px-3.5 py-1 rounded-full bg-emerald-100 text-emerald-900 font-bold text-xs border border-emerald-300">
          Dumka Block Ready
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
        <div className="p-3.5 rounded-2xl bg-white border border-emerald-200 space-y-1">
          <div className="flex items-center gap-1.5 font-bold text-slate-800">
            <CheckCircle2 size={15} className="text-emerald-600" />
            <span>Whisper ASR</span>
          </div>
          <p className="text-slate-500 font-medium">v2.1 Tiny Model (Installed)</p>
        </div>

        <div className="p-3.5 rounded-2xl bg-white border border-emerald-200 space-y-1">
          <div className="flex items-center gap-1.5 font-bold text-slate-800">
            <CheckCircle2 size={15} className="text-emerald-600" />
            <span>Piper TTS</span>
          </div>
          <p className="text-slate-500 font-medium">Hindi + Santali Voices (Installed)</p>
        </div>

        <div className="p-3.5 rounded-2xl bg-white border border-emerald-200 space-y-1">
          <div className="flex items-center gap-1.5 font-bold text-slate-800">
            <Cpu size={15} className="text-emerald-600" />
            <span>IndicTrans2</span>
          </div>
          <p className="text-slate-500 font-medium">Local ONNX Neural Weights</p>
        </div>

        <div className="p-3.5 rounded-2xl bg-white border border-emerald-200 space-y-1">
          <div className="flex items-center gap-1.5 font-bold text-slate-800">
            <Award size={15} className="text-emerald-600" />
            <span>FLN Curriculum</span>
          </div>
          <p className="text-slate-500 font-medium">Jharkhand MTB-MLE 2026</p>
        </div>
      </div>

      <div className="pt-1 flex items-center justify-between text-xs text-emerald-900 font-medium border-t border-emerald-200/50">
        <span className="flex items-center gap-1.5">
          <Clock size={13} className="text-emerald-600" />
          Last Synced with State Server: <strong>Today at 08:30 AM (Bilingual Pack v4.2)</strong>
        </span>
        <span className="text-emerald-700 font-bold hidden sm:inline">Zero Latency Local Execution</span>
      </div>
    </div>
  );
};
