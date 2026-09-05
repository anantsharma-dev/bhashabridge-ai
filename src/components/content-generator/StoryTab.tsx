import React from 'react';
import { Sparkles } from 'lucide-react';
import type { StoryOutput } from '../../types/contentGenerator';

export interface StoryTabProps {
  story: StoryOutput;
  isEditMode: boolean;
  onUpdate: (updated: StoryOutput) => void;
}

export const StoryTab: React.FC<StoryTabProps> = ({ story, isEditMode, onUpdate }) => {
  return (
    <div className="space-y-5">
      <div className="p-4 rounded-2xl bg-[#FFFDF7] border border-amber-200/80 space-y-1">
        <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-700">
          Folklore & Ecology Theme: {story.theme}
        </span>
        <h4 className="text-lg font-extrabold text-slate-900 font-baloo">
          {story.hindiTitle}
        </h4>
        <p className="text-xs font-bold text-slate-600 font-devanagari">
          {story.tribalTitle}
        </p>
      </div>

      <div className="space-y-4">
        {story.paragraphs.map((p, idx) => (
          <div
            key={p.paragraphNumber}
            className="p-4 rounded-2xl bg-white border border-slate-200 space-y-2 shadow-2xs"
          >
            <div className="flex items-center justify-between text-xs text-slate-400 font-bold">
              <span>Paragraph {p.paragraphNumber}</span>
              {p.pronunciationGuide && (
                <span className="italic text-slate-500 font-normal">
                  Phonetic Guide: {p.pronunciationGuide}
                </span>
              )}
            </div>

            <div className="space-y-2 text-sm leading-relaxed">
              {isEditMode ? (
                <>
                  <textarea
                    rows={2}
                    value={p.textPrimary}
                    onChange={(e) => {
                      const copy = [...story.paragraphs];
                      copy[idx].textPrimary = e.target.value;
                      onUpdate({ ...story, paragraphs: copy });
                    }}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                  />
                  <textarea
                    rows={2}
                    value={p.textBridge}
                    onChange={(e) => {
                      const copy = [...story.paragraphs];
                      copy[idx].textBridge = e.target.value;
                      onUpdate({ ...story, paragraphs: copy });
                    }}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                  />
                </>
              ) : (
                <>
                  <p className="font-semibold text-slate-800 font-devanagari">
                    {p.textPrimary}
                  </p>
                  <p className="font-bold text-blue-900 bg-blue-50/50 p-2 rounded-xl border border-blue-100 text-xs">
                    {p.textBridge}
                  </p>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Comprehension Questions */}
      <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200 space-y-3">
        <h4 className="text-xs font-extrabold text-emerald-900 uppercase tracking-wider font-baloo">
          Classroom Comprehension Checks
        </h4>
        <div className="space-y-2 text-xs">
          {story.comprehensionQuestions.map((q, i) => (
            <div key={i} className="p-2.5 rounded-xl bg-white border border-emerald-200 space-y-1">
              <p className="font-bold text-slate-900">{q.question}</p>
              <p className="text-emerald-800 font-medium">उत्तर: {q.answer}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Moral */}
      <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 font-bold flex items-center gap-2">
        <Sparkles size={16} className="text-amber-600 shrink-0" />
        <span>Moral: {story.moral}</span>
      </div>
    </div>
  );
};
