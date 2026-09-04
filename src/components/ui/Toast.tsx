import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastProps {
  message: string | null;
  type?: ToastType;
  durationMs?: number;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({
  message,
  type = 'success',
  durationMs = 3200,
  onClose,
}) => {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => {
      onClose();
    }, durationMs);
    return () => clearTimeout(timer);
  }, [message, durationMs, onClose]);

  if (!message) return null;

  const config = {
    success: {
      bg: 'bg-[#1E293B] text-white',
      border: 'border-emerald-500/50',
      icon: <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />,
    },
    error: {
      bg: 'bg-rose-950 text-white',
      border: 'border-rose-500/50',
      icon: <AlertCircle size={18} className="text-rose-400 shrink-0" />,
    },
    info: {
      bg: 'bg-slate-900 text-white',
      border: 'border-blue-500/50',
      icon: <Info size={18} className="text-blue-400 shrink-0" />,
    },
    warning: {
      bg: 'bg-amber-950 text-white',
      border: 'border-amber-500/50',
      icon: <AlertTriangle size={18} className="text-amber-400 shrink-0" />,
    },
  }[type];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className={`fixed bottom-20 left-1/2 -translate-x-1/2 sm:bottom-8 sm:left-auto sm:right-8 sm:translate-x-0 z-50 flex items-center gap-3 px-4 py-3 rounded-2xl shadow-xl border ${config.border} ${config.bg} text-xs sm:text-sm font-semibold max-w-sm`}
        role="status"
        aria-live="polite"
      >
        {config.icon}
        <span className="flex-1">{message}</span>
        <button
          type="button"
          onClick={onClose}
          className="p-1 rounded-lg hover:bg-white/15 text-white/70 hover:text-white transition-colors cursor-pointer"
          aria-label="Dismiss message"
        >
          <X size={15} />
        </button>
      </motion.div>
    </AnimatePresence>
  );
};
