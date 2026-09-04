import React from 'react';
import { CheckCircle2, Lock } from 'lucide-react';
import { JOURNEY_STOPS } from '../../services/gamificationService';

export interface JourneyMapViewProps {
  currentXp: number;
  className?: string;
}

export const JourneyMapView: React.FC<JourneyMapViewProps> = ({
  currentXp,
  className = '',
}) => {
  return (
    <div
      className={`rounded-[24px] bg-white border border-[#F1EFE8] p-6 sm:p-7 shadow-[0_4px_20px_rgba(0,0,0,0.04)] space-y-5 ${className}`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
        <div>
          <h3 className="text-lg font-extrabold text-slate-900 font-baloo">
            Jharkhand Sal Forest Learning Journey
          </h3>
          <p className="text-xs text-slate-500 font-medium">
            Explore cultural sites and tribal regions as you master foundational vocabulary
          </p>
        </div>
        <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-900 self-start sm:self-auto">
          {currentXp} Explorer XP
        </span>
      </div>

      {/* Visual Stops Trail */}
      <div className="relative pl-6 sm:pl-8 border-l-2 border-dashed border-amber-300 space-y-6 my-4">
        {JOURNEY_STOPS.map((stop) => {
          const isReached = currentXp >= stop.requiredXp;
          return (
            <div key={stop.id} className="relative group">
              {/* Dot icon */}
              <div
                className={`absolute -left-[35px] sm:-left-[43px] top-1 w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all ${
                  isReached
                    ? 'bg-emerald-500 border-white text-white shadow-md'
                    : 'bg-slate-100 border-slate-300 text-slate-400'
                }`}
              >
                {isReached ? <CheckCircle2 size={16} /> : <Lock size={14} />}
              </div>

              {/* Stop Card */}
              <div
                className={`p-4 rounded-2xl border transition-all ${
                  isReached
                    ? 'bg-[#FFFDF7] border-amber-200 shadow-2xs'
                    : 'bg-slate-50/70 border-slate-200 opacity-60'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-amber-900 font-baloo">
                      {stop.name}
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-white border border-slate-200 text-[10px] font-bold text-slate-600">
                      {stop.district} District
                    </span>
                  </div>
                  <span className="text-[11px] font-bold text-slate-500">
                    {stop.requiredXp} XP
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-1">{stop.culturalNote}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default JourneyMapView;
