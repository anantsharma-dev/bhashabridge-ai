import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Sliders, X, Check } from 'lucide-react';
import { speechSynthesisService, type VoiceMode } from '../../services/speechSynthesis';

export interface VoiceSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  className?: string;
}

export const VoiceSettingsModal: React.FC<VoiceSettingsModalProps> = ({
  isOpen,
  onClose,
  className = '',
}) => {
  const currentSettings = speechSynthesisService.getSettings();
  const [mode, setMode] = useState<VoiceMode>(currentSettings.mode);
  const [rate, setRate] = useState<number>(currentSettings.rate);
  const [pitch, setPitch] = useState<number>(currentSettings.pitch);

  const handleSave = () => {
    speechSynthesisService.updateSettings({ mode, rate, pitch });
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className={`w-full max-w-md bg-[#FFFDF7] rounded-[28px] border-2 border-amber-200 shadow-xl p-6 space-y-5 ${className}`}
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-amber-100">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center">
                  <Sliders size={16} />
                </span>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 font-baloo">
                    AI Voice & Synthesis Settings
                  </h3>
                  <p className="text-[11px] text-slate-500">Configure neural voices & playback speeds</p>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Voice Mode Selector */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 block">Synthesis Voice Engine:</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setMode('online')}
                  className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                    mode === 'online'
                      ? 'bg-blue-50 border-blue-400 text-blue-900 shadow-xs'
                      : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold">Google Neural</span>
                    {mode === 'online' && <Check size={14} className="text-blue-600" />}
                  </div>
                  <span className="text-[10px] text-slate-500 block mt-0.5">
                    Ultra-natural Indic voices (Online)
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setMode('offline')}
                  className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                    mode === 'offline'
                      ? 'bg-emerald-50 border-emerald-400 text-emerald-900 shadow-xs'
                      : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold">Piper Offline</span>
                    {mode === 'offline' && <Check size={14} className="text-emerald-600" />}
                  </div>
                  <span className="text-[10px] text-slate-500 block mt-0.5">
                    Fast 100% on-device fallback
                  </span>
                </button>
              </div>
            </div>

            {/* Speech Rate (Classroom Turtle vs Normal) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                <span>Classroom Speaking Rate:</span>
                <span className="text-blue-700 font-mono">{rate}x</span>
              </div>
              <div className="flex items-center gap-2">
                {[0.75, 0.9, 1.0, 1.2].map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRate(r)}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                      rate === r
                        ? 'bg-amber-100 border-amber-300 text-amber-900'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {r === 0.75 ? '0.75x 🐢' : `${r}x`}
                  </button>
                ))}
              </div>
            </div>

            {/* Voice Pitch */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                <span>Teacher Voice Tone / Pitch:</span>
                <span className="text-blue-700 font-mono">{pitch}x</span>
              </div>
              <div className="flex items-center gap-2">
                {[0.9, 1.0, 1.1].map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPitch(p)}
                    className={`flex-1 py-1.5 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                      pitch === p
                        ? 'bg-amber-100 border-amber-300 text-amber-900'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {p === 1.0 ? 'Natural (1.0x)' : `${p}x`}
                  </button>
                ))}
              </div>
            </div>

            {/* Silence Detection Info */}
            <div className="p-3 rounded-2xl bg-amber-50/60 border border-amber-200/80 text-[11px] text-amber-900 space-y-1">
              <div className="flex items-center gap-1.5 font-bold">
                <Sparkles size={13} className="text-amber-600" />
                <span>Smart Silence Detection: 3.5 Seconds</span>
              </div>
              <p className="text-slate-600">
                Recording auto-stops when the child or teacher stops speaking for 3.5s.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs cursor-pointer shadow-xs"
              >
                Save Preferences
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default VoiceSettingsModal;
