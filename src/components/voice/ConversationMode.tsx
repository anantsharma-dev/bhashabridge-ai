import React from 'react';
import { motion } from 'framer-motion';
import { Volume2 } from 'lucide-react';
import { JoharHornbill } from '../ui/JoharHornbill';

export interface ChatEntry {
  id: string;
  speaker: 'teacher' | 'child';
  hindi: string;
  santhali: string;
  santhaliLatin: string;
  isFavorite?: boolean;
  timestamp?: number;
}

export interface ConversationModeProps {
  history: ChatEntry[];
  isSpeaking?: boolean;
  onPlayEntry: (entry: ChatEntry) => void;
  className?: string;
}

export const ConversationMode: React.FC<ConversationModeProps> = ({
  history,
  isSpeaking = false,
  onPlayEntry,
  className = '',
}) => {
  return (
    <div
      className={`rounded-[24px] bg-white border border-[#F1EFE8] p-5 sm:p-6 shadow-[0_4px_20px_rgba(0,0,0,0.04)] space-y-4 ${className}`}
    >
      {/* Header with Mascot reaction */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
        <div>
          <h3 className="text-base font-extrabold text-slate-900 font-baloo">
            Classroom Conversation Dialogue
          </h3>
          <p className="text-xs text-slate-500 font-medium">
            Real-time bilingual teacher-student classroom exchange
          </p>
        </div>

        {/* Mascot Reacts */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-amber-900 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
            {isSpeaking ? 'Mascot Speaking...' : 'Johar Assistant Active'}
          </span>
          <JoharHornbill size="sm" waving={isSpeaking} />
        </div>
      </div>

      {/* Bubbles Container */}
      <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
        {history.map((entry) => {
          const isTeacher = entry.speaker === 'teacher';
          return (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex flex-col ${isTeacher ? 'items-start' : 'items-end'}`}
            >
              <div
                className={`max-w-md p-4 rounded-2xl border shadow-xs space-y-1.5 ${
                  isTeacher
                    ? 'bg-[#EFF6FF] border-blue-200 text-slate-900 rounded-bl-xs'
                    : 'bg-[#FAF5FF] border-purple-200 text-slate-900 rounded-br-xs'
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
                    <span>{isTeacher ? '👩‍🏫 Teacher' : '🧒 Student'}</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => onPlayEntry(entry)}
                    className="text-slate-400 hover:text-slate-700 p-1 rounded-full cursor-pointer"
                    aria-label="Play audio"
                  >
                    <Volume2 size={14} />
                  </button>
                </div>

                <p className="text-sm font-bold font-devanagari">
                  {entry.hindi}
                </p>
                <p className="text-sm font-bold font-olchiki text-emerald-800">
                  {entry.santhali}
                </p>
                <p className="text-xs text-slate-500 italic">
                  {entry.santhaliLatin}
                </p>
              </div>
            </motion.div>
          );
        })}

        {/* Animated Speech dots if speaking */}
        {isSpeaking && (
          <div className="flex items-center gap-1.5 p-3 rounded-2xl bg-slate-50 w-24">
            <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" />
            <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce [animation-delay:0.2s]" />
            <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce [animation-delay:0.4s]" />
          </div>
        )}
      </div>
    </div>
  );
};
