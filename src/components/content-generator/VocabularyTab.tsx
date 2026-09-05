import React from 'react';
import { Volume2 } from 'lucide-react';
import type { VocabularyItem } from '../../types/contentGenerator';

export interface VocabularyTabProps {
  vocabulary: VocabularyItem[];
  isEditMode: boolean;
  onUpdate: (updated: VocabularyItem[]) => void;
}

export const VocabularyTab: React.FC<VocabularyTabProps> = ({
  vocabulary,
  isEditMode: _isEditMode,
  onUpdate: _onUpdate,
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-extrabold text-slate-900 font-baloo">
          Core Multilingual Vocabulary Cards
        </h4>
        <span className="text-xs text-slate-500">Bilingual Dictionary Entries</span>
      </div>

      <div className="space-y-2.5">
        {vocabulary.map((voc) => (
          <div
            key={voc.id}
            className="p-3.5 rounded-2xl bg-white border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
                <Volume2 size={18} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h5 className="font-extrabold text-slate-900 text-sm font-baloo">
                    {voc.termHindi} • {voc.termScript} ({voc.termTribal})
                  </h5>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600">
                    {voc.partOfSpeech}
                  </span>
                </div>
                <p className="text-xs text-slate-600 font-medium">{voc.definition}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-auto">
              <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg">
                English: {voc.termEnglish}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
