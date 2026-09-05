import React from 'react';
import type { FlashcardItem } from '../../types/contentGenerator';

export interface FlashcardsTabProps {
  flashcards: FlashcardItem[];
  isEditMode: boolean;
  onUpdate: (updated: FlashcardItem[]) => void;
}

export const FlashcardsTab: React.FC<FlashcardsTabProps> = ({
  flashcards,
  isEditMode,
  onUpdate,
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-extrabold text-slate-900 font-baloo">
          Multilingual Flashcard Deck ({flashcards.length} Cards)
        </h4>
        <span className="text-xs text-slate-500">Phonetic guide & Ol Chiki script</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {flashcards.map((card, idx) => (
          <div
            key={card.id}
            className="p-4 rounded-2xl bg-[#FFFDF7] border border-slate-200/90 shadow-2xs space-y-2 flex flex-col justify-between"
          >
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-100 text-blue-900">
                  {card.category}
                </span>
                <span className="text-[10px] font-bold text-slate-400">
                  /{card.phonetic}/
                </span>
              </div>

              {isEditMode ? (
                <div className="space-y-1 pt-1">
                  <input
                    type="text"
                    value={card.frontWord}
                    onChange={(e) => {
                      const copy = [...flashcards];
                      copy[idx].frontWord = e.target.value;
                      onUpdate(copy);
                    }}
                    className="w-full text-xs font-bold p-1 border border-slate-200 rounded"
                    placeholder="Front Word"
                  />
                  <input
                    type="text"
                    value={card.hindiWord}
                    onChange={(e) => {
                      const copy = [...flashcards];
                      copy[idx].hindiWord = e.target.value;
                      onUpdate(copy);
                    }}
                    className="w-full text-xs p-1 border border-slate-200 rounded"
                    placeholder="Hindi"
                  />
                  <input
                    type="text"
                    value={card.scriptNative}
                    onChange={(e) => {
                      const copy = [...flashcards];
                      copy[idx].scriptNative = e.target.value;
                      onUpdate(copy);
                    }}
                    className="w-full text-xs text-blue-700 font-bold p-1 border border-slate-200 rounded"
                    placeholder="Script"
                  />
                </div>
              ) : (
                <>
                  <h5 className="text-base font-extrabold text-slate-900 font-baloo leading-tight">
                    {card.frontWord}
                  </h5>
                  <p className="text-xs font-bold text-slate-600 font-devanagari">
                    {card.hindiWord}
                  </p>
                  <p className="text-sm font-extrabold text-blue-700">
                    {card.scriptNative}
                  </p>
                </>
              )}
            </div>

            <div className="pt-2 border-t border-slate-100 space-y-1 text-[11px]">
              <p className="text-slate-600 italic">"{card.exampleSentence}"</p>
              <p className="text-[10px] text-amber-800 bg-amber-50 p-1.5 rounded-lg">
                💡 {card.funFact}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
