import React from 'react';
import { Mic, CheckCircle2, ShieldCheck, X } from 'lucide-react';

export interface MicPermissionPromptProps {
  isOpen: boolean;
  onClose: () => void;
  onRequestPermission: () => void;
}

export const MicPermissionPrompt: React.FC<MicPermissionPromptProps> = ({
  isOpen,
  onClose,
  onRequestPermission,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-[#FFFDF7] rounded-[28px] border border-amber-200 p-6 sm:p-7 max-w-md w-full shadow-2xl space-y-4">
        <div className="flex items-start justify-between">
          <div className="p-3 rounded-2xl bg-amber-100 text-amber-900">
            <Mic size={24} />
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        <div className="space-y-1">
          <h3 className="text-lg font-extrabold text-slate-900 font-baloo">
            Enable Microphone for Classroom Voice Bridge
          </h3>
          <p className="text-xs text-slate-600 font-medium leading-relaxed">
            BhashaBridge listens to spoken Hindi or Santali in real-time to translate for students. Audio is processed offline on your tablet and never uploaded to public advertising servers.
          </p>
        </div>

        <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-1.5 text-xs text-emerald-900">
          <div className="flex items-center gap-1.5 font-bold">
            <ShieldCheck size={14} className="text-emerald-600" />
            <span>100% Student Privacy Compliant</span>
          </div>
          <p className="text-[11px] text-emerald-800">
            Microphone audio stays local in offline mode. Web Speech API is only used during active button hold.
          </p>
        </div>

        <div className="flex items-center justify-end gap-2.5 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              onRequestPermission();
              onClose();
            }}
            className="px-5 py-2.5 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <CheckCircle2 size={14} />
            <span>Allow Microphone</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default MicPermissionPrompt;
