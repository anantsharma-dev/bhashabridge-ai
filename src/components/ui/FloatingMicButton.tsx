import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, Square, Volume2 } from 'lucide-react';
import { cn } from '../../utils/utils';
import { floatingMicTokens, radius, motionPresets } from './theme';

export type MicState = keyof typeof floatingMicTokens.states;

export interface FloatingMicButtonProps {
  state?: MicState;
  onClick?: () => void;
  languageLabel?: string;
  targetLanguageLabel?: string;
  fixed?: boolean; // If true, docks at bottom-right or bottom-center FAB
  size?: keyof typeof floatingMicTokens.sizes;
  className?: string;
}

export const FloatingMicButton: React.FC<FloatingMicButtonProps> = ({
  state = 'idle',
  onClick,
  languageLabel = 'Hindi',
  targetLanguageLabel = 'Santhali',
  fixed = false,
  size = 'hero',
  className,
}) => {
  const isListening = state === 'listening';
  const isProcessing = state === 'processing';
  const isSpeaking = state === 'speaking';

  const currentSize = floatingMicTokens.sizes[size];

  return (
    <div
      className={cn(
        'relative inline-flex flex-col items-center justify-center select-none',
        fixed && 'fixed bottom-24 right-6 md:bottom-8 md:right-8 z-40',
        className
      )}
    >
      {/* Concentric Pulsing Soundwaves when listening */}
      <AnimatePresence>
        {isListening && (
          <>
            <motion.span
              initial={{ scale: 0.9, opacity: 0.8 }}
              animate={{ scale: 1.6, opacity: 0 }}
              transition={{ repeat: Infinity, duration: 1.8, ease: 'easeOut' }}
              className="absolute inset-0 rounded-full bg-rose-500/30 -z-10"
            />
            <motion.span
              initial={{ scale: 0.9, opacity: 0.8 }}
              animate={{ scale: 1.9, opacity: 0 }}
              transition={{ repeat: Infinity, duration: 1.8, delay: 0.5, ease: 'easeOut' }}
              className="absolute inset-0 rounded-full bg-rose-400/20 -z-20"
            />
            <motion.span
              initial={{ scale: 0.9, opacity: 0.8 }}
              animate={{ scale: 2.2, opacity: 0 }}
              transition={{ repeat: Infinity, duration: 1.8, delay: 1.0, ease: 'easeOut' }}
              className="absolute inset-0 rounded-full bg-primary-blue/15 -z-30"
            />
          </>
        )}
      </AnimatePresence>

      {/* Main Tactile Mic Button */}
      <motion.button
        type="button"
        onClick={onClick}
        whileTap={motionPresets.tap}
        whileHover={{ scale: 1.04 }}
        transition={motionPresets.spring}
        className={cn(
          'relative flex items-center justify-center text-white cursor-pointer shadow-xl transition-all',
          radius.classes.pill,
          currentSize.dimensions,
          floatingMicTokens.states[state]
        )}
      >
        {/* Equalizer animation when listening */}
        {isListening ? (
          <div className="flex items-center gap-1">
            {[0.4, 0.9, 0.6, 1, 0.5].map((height, i) => (
              <motion.span
                key={i}
                animate={{
                  scaleY: [0.3, height, 0.3],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 0.7,
                  delay: i * 0.12,
                  ease: 'easeInOut',
                }}
                className="w-1.5 h-7 bg-white rounded-full origin-center"
              />
            ))}
          </div>
        ) : isProcessing ? (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1.2, ease: 'linear' }}
          >
            <Square className="w-8 h-8 text-white animate-pulse" />
          </motion.div>
        ) : isSpeaking ? (
          <Volume2 size={currentSize.iconSize} className="animate-bounce" />
        ) : (
          <Mic size={currentSize.iconSize} strokeWidth={2.2} />
        )}
      </motion.button>

      {/* Floating Pill Label */}
      <div className={cn('mt-3 flex items-center gap-1.5', floatingMicTokens.pill)}>
        <span className={cn('w-2 h-2 rounded-full', isListening ? 'bg-rose-500 animate-ping' : 'bg-emerald-500')} />
        <span>{isListening ? 'Listening...' : `${languageLabel} ➔ ${targetLanguageLabel}`}</span>
      </div>
    </div>
  );
};

