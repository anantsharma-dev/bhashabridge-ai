import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Volume2, Copy, Check } from 'lucide-react';
import { cn } from '../../utils/utils';
import { aiBubbleTokens, typography, motionPresets } from './theme';

export interface AiAssistantBubbleProps {
  hindiText?: string;
  santhaliText?: string;
  santhaliLatin?: string;
  explanation?: string;
  isStreaming?: boolean;
  onPlayAudio?: () => void;
  className?: string;
}

export const AiAssistantBubble: React.FC<AiAssistantBubbleProps> = ({
  hindiText = 'नमस्ते बच्चों! आज हम जंगल के जानवरों के बारे में सीखेंगे।',
  santhaliText = 'ᱡᱚᱦᱟᱨ ᱜᱤᱫᱽᱨᱟᱹ! ᱛᱮᱦᱮᱧ ᱫᱚ ᱵᱤᱨ ᱨᱤᱱ ᱡᱤᱵᱽ ᱡᱤᱭᱟᱹᱞᱤ ᱵᱟᱵᱚᱛ ᱵᱚ ᱪᱮᱫ-ᱟ᱾',
  santhaliLatin = 'Johar gidra! Tehenj do bir rin jib jiyali babot bo ched-a.',
  explanation,
  isStreaming = false,
  onPlayAudio,
  className,
}) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(`${hindiText}\n${santhaliText}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      {...motionPresets.fadeInUp}
      className={cn(aiBubbleTokens.container, className)}
    >
      {/* Outer Gemini Cosmic Gradient Glow Frame */}
      <div className={aiBubbleTokens.outerFrame}>
        <div className={aiBubbleTokens.innerCard}>
          {/* Header with Mascot Avatar and Gemini Sparkle */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Mascot / Gemini Sparkle Icon */}
              <div className={aiBubbleTokens.mascotBox}>
                <div className={aiBubbleTokens.mascotInner}>
                  <Sparkles className="w-5 h-5 text-purple-600 dark:text-purple-400 animate-pulse" />
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className={cn('text-sm font-bold text-slate-900 dark:text-white', typography.classes.fontHeading)}>
                    BhashaAI Assistant
                  </span>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                    Gemini MTB-MLE
                  </span>
                </div>
                <p className="text-xs text-slate-400">Offline Neural Translation • IndicTrans2</p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-1.5">
              {onPlayAudio && (
                <button
                  type="button"
                  onClick={onPlayAudio}
                  title="Listen pronunciation (Piper TTS)"
                  className="p-2 rounded-xl text-slate-500 hover:text-primary-blue hover:bg-blue-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <Volume2 size={18} />
                </button>
              )}
              <button
                type="button"
                onClick={handleCopy}
                title="Copy translation"
                className="p-2 rounded-xl text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                {copied ? <Check size={18} className="text-emerald-500" /> : <Copy size={18} />}
              </button>
            </div>
          </div>

          {/* Translation Cards: Source Hindi & Target Santhali */}
          <div className="space-y-3">
            {/* Hindi Source Box */}
            <div className={aiBubbleTokens.sourceBox}>
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                Hindi (शिक्षक का कथन)
              </span>
              <p className={typography.scripts.hindiBody}>
                {hindiText}
              </p>
            </div>

            {/* Santhali Target Box with Ol Chiki font */}
            <div className={aiBubbleTokens.targetBox}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11px] font-semibold text-purple-700 dark:text-purple-300 uppercase tracking-wider">
                  Santhali (Ol Chiki • ᱥᱟᱱᱛᱟᱲᱤ)
                </span>
                <span className="text-[10px] font-medium text-purple-600/80 dark:text-purple-400">
                  Grade 1-3 FLN Aligned
                </span>
              </div>

              {isStreaming ? (
                <div className="flex items-center gap-1.5 py-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-purple-600 animate-bounce" />
                  <span className="w-2.5 h-2.5 rounded-full bg-purple-600 animate-bounce [animation-delay:0.15s]" />
                  <span className="w-2.5 h-2.5 rounded-full bg-purple-600 animate-bounce [animation-delay:0.3s]" />
                </div>
              ) : (
                <>
                  <p className={typography.scripts.santhaliHeading}>
                    {santhaliText}
                  </p>
                  {santhaliLatin && (
                    <p className="text-xs text-purple-700/80 dark:text-purple-300/80 italic mt-1 font-sans">
                      "{santhaliLatin}"
                    </p>
                  )}
                </>
              )}
            </div>

            {/* Educational pedagogical explanation if available */}
            {explanation && (
              <p className="text-xs text-slate-500 dark:text-slate-400 px-1 italic">
                💡 {explanation}
              </p>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

