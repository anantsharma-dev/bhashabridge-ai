import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Mic, Square, Loader2, Volume2, Activity, AlertCircle } from 'lucide-react';

export type VoiceState = 'idle' | 'listening' | 'processing' | 'speaking' | 'error';

export interface VoiceRecorderProps {
  state: VoiceState;
  onStartRecord: () => void;
  onStopRecord: () => void;
  className?: string;
}

export const VoiceRecorder: React.FC<VoiceRecorderProps> = ({
  state = 'idle',
  onStartRecord,
  onStopRecord,
  className = '',
}) => {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    if (state !== 'listening') return;
    const start = Date.now();
    const interval = setInterval(() => {
      setSeconds(Math.floor((Date.now() - start) / 1000));
    }, 1000);
    return () => {
      clearInterval(interval);
      setSeconds(0);
    };
  }, [state]);

  const formatTimer = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const stateColors = {
    idle: {
      bg: 'bg-white',
      border: 'border-[#F1EFE8]',
      button: 'bg-[#2563EB] hover:bg-blue-700 text-white shadow-blue-500/20',
      label: 'Tap to Speak',
      hindiLabel: 'बोलने के लिए दबाएँ',
    },
    listening: {
      bg: 'bg-[#FFF1F2]',
      border: 'border-rose-200',
      button: 'bg-rose-500 hover:bg-rose-600 text-white shadow-rose-500/30 animate-pulse',
      label: 'Listening to Teacher...',
      hindiLabel: 'आवाज़ सुन रहे हैं...',
    },
    processing: {
      bg: 'bg-[#FAF5FF]',
      border: 'border-purple-200',
      button: 'bg-purple-600 text-white shadow-purple-500/20',
      label: 'Translating Phrase...',
      hindiLabel: 'अनुवाद किया जा रहा है...',
    },
    speaking: {
      bg: 'bg-[#ECFDF5]',
      border: 'border-emerald-200',
      button: 'bg-emerald-600 text-white shadow-emerald-500/20',
      label: 'Speaking in Santali...',
      hindiLabel: 'संथाली में बोल रहे हैं...',
    },
    error: {
      bg: 'bg-[#FFFBEB]',
      border: 'border-amber-300',
      button: 'bg-amber-600 hover:bg-amber-700 text-white shadow-amber-500/25',
      label: 'Could not hear clearly',
      hindiLabel: 'कृपया दोबारा बोलें (Tap to retry)',
    },
  };

  const currentConf = stateColors[state];

  return (
    <div
      className={`rounded-[24px] ${currentConf.bg} border ${currentConf.border} p-6 sm:p-8 shadow-[0_4px_20px_rgba(0,0,0,0.04)] text-center space-y-6 transition-all duration-300 ${className}`}
    >
      {/* Top Indicators: Live Timer + Noise level */}
      <div className="flex items-center justify-between max-w-sm mx-auto text-xs font-bold text-slate-500">
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 border border-slate-200">
          <Activity size={13} className="text-emerald-500" />
          <span>Classroom Noise: <strong>Low</strong></span>
        </div>
        <div className="px-3 py-1 rounded-full bg-slate-100 border border-slate-200 font-mono">
          ⏱️ {formatTimer(seconds)}
        </div>
      </div>

      {/* Large Circular Microphone Button */}
      <div className="flex flex-col items-center justify-center space-y-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.94 }}
          type="button"
          onClick={state === 'listening' ? onStopRecord : onStartRecord}
          className={`w-24 h-24 sm:w-28 sm:h-28 rounded-full flex items-center justify-center cursor-pointer shadow-lg transition-all ${currentConf.button}`}
          aria-label={currentConf.label}
        >
          {state === 'idle' && <Mic size={40} className="fill-white" />}
          {state === 'listening' && <Square size={34} className="fill-white" />}
          {state === 'processing' && <Loader2 size={38} className="animate-spin" />}
          {state === 'speaking' && <Volume2 size={38} className="animate-bounce" />}
          {state === 'error' && <AlertCircle size={38} className="text-white" />}
        </motion.button>

        <div className="space-y-1">
          <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-baloo">
            {currentConf.label}
          </h3>
          <p className="text-sm font-semibold text-slate-600 font-devanagari">
            {currentConf.hindiLabel}
          </p>
        </div>
      </div>

      {/* Animated Live Waveform */}
      <div className="flex items-center justify-center gap-1.5 h-12 max-w-xs mx-auto">
        {[0.3, 0.6, 0.9, 0.4, 0.8, 1.0, 0.7, 0.9, 0.3, 0.8, 0.5, 0.9, 0.4, 0.7].map((h, i) => (
          <motion.span
            key={i}
            animate={
              state === 'listening'
                ? { scaleY: [0.2, h, 0.2] }
                : state === 'speaking'
                ? { scaleY: [0.3, 0.8, 0.3] }
                : state === 'processing'
                ? { scaleY: [0.4, 0.4, 0.4] }
                : { scaleY: 0.2 }
            }
            transition={{
              repeat: Infinity,
              duration: 0.6,
              delay: i * 0.06,
              ease: 'easeInOut',
            }}
            className={`w-1.5 rounded-full origin-bottom transition-colors ${
              state === 'listening'
                ? 'bg-rose-500'
                : state === 'speaking'
                ? 'bg-emerald-500'
                : state === 'processing'
                ? 'bg-purple-500'
                : 'bg-slate-300'
            }`}
            style={{ height: '36px' }}
          />
        ))}
      </div>

      <p className="text-xs text-slate-400 font-medium">
        Whisper Tiny Speech-to-Text • IndicTrans2 Neural MT • Piper TTS (100% Offline)
      </p>
    </div>
  );
};
