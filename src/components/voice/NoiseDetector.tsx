import React, { useState, useEffect } from 'react';
import { Volume2, AlertTriangle, CheckCircle2 } from 'lucide-react';

export interface NoiseDetectorProps {
  isListening?: boolean;
  className?: string;
}

export const NoiseDetector: React.FC<NoiseDetectorProps> = ({
  isListening = false,
  className = '',
}) => {
  const [decibels, setDecibels] = useState(45);

  useEffect(() => {
    if (!isListening) {
      setDecibels(38);
      return;
    }

    const interval = setInterval(() => {
      // Fluctuate between 45 and 75 dB
      const level = Math.floor(45 + Math.random() * 28);
      setDecibels(level);
    }, 400);

    return () => clearInterval(interval);
  }, [isListening]);

  const getNoiseStatus = (db: number) => {
    if (db < 55) {
      return {
        label: 'Optimal Quiet',
        hindi: 'शांत वातावरण',
        color: 'text-emerald-700 bg-emerald-50 border-emerald-200',
        icon: <CheckCircle2 size={13} className="text-emerald-600" />,
        tip: 'Microphone clarity is 100%. Speak naturally.',
      };
    }
    if (db < 72) {
      return {
        label: 'Moderate Classroom',
        hindi: 'सामान्य कक्षा शोर',
        color: 'text-amber-700 bg-amber-50 border-amber-200',
        icon: <Volume2 size={13} className="text-amber-600" />,
        tip: 'Hold tablet 1 foot away for best recognition.',
      };
    }
    return {
      label: 'High Ambient Noise',
      hindi: 'अधिक कक्षा शोर',
      color: 'text-rose-700 bg-rose-50 border-rose-200',
      icon: <AlertTriangle size={13} className="text-rose-600" />,
      tip: 'Ask students for quiet or bring mic closer.',
    };
  };

  const status = getNoiseStatus(decibels);

  return (
    <div
      className={`p-3.5 rounded-2xl bg-white border border-[#F1EFE8] shadow-2xs flex items-center justify-between gap-3 text-xs ${className}`}
    >
      <div className="flex items-center gap-2.5">
        <span className={`p-1.5 rounded-xl border flex items-center gap-1 font-bold ${status.color}`}>
          {status.icon}
          <span>{decibels} dB</span>
        </span>
        <div>
          <div className="flex items-center gap-1.5 font-extrabold text-slate-900">
            <span>{status.label}</span>
            <span className="text-slate-400 font-normal">({status.hindi})</span>
          </div>
          <p className="text-[11px] text-slate-500 font-medium">{status.tip}</p>
        </div>
      </div>

      <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden shrink-0 hidden sm:block">
        <div
          className={`h-full transition-all duration-300 ${
            decibels < 55 ? 'bg-emerald-500' : decibels < 72 ? 'bg-amber-500' : 'bg-rose-500'
          }`}
          style={{ width: `${Math.min(100, (decibels / 90) * 100)}%` }}
        />
      </div>
    </div>
  );
};

export default NoiseDetector;
