import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import type { QuizOutput } from '../../types/contentGenerator';

export interface QuizTabProps {
  quiz: QuizOutput;
  isEditMode: boolean;
  onUpdate: (updated: QuizOutput) => void;
}

export const QuizTab: React.FC<QuizTabProps> = ({ quiz, isEditMode: _isEditMode, onUpdate: _onUpdate }) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-extrabold text-slate-900 font-baloo">
          {quiz.quizTitle}
        </h4>
        <span className="text-xs text-slate-500">Interactive Assessment</span>
      </div>

      <div className="space-y-4">
        {quiz.questions.map((q, idx) => (
          <div
            key={q.id}
            className="p-4 rounded-2xl bg-[#FFFDF7] border border-slate-200/90 space-y-3 shadow-2xs"
          >
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-xs font-extrabold flex items-center justify-center">
                {idx + 1}
              </span>
              <h5 className="font-bold text-slate-900 text-sm font-baloo">
                {q.question}
              </h5>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {q.options.map((opt, optIdx) => {
                const isCorrect = optIdx === q.correctIndex;
                return (
                  <div
                    key={optIdx}
                    className={`p-2.5 rounded-xl border font-semibold flex items-center justify-between ${
                      isCorrect
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-950 font-bold'
                        : 'bg-white border-slate-200 text-slate-700'
                    }`}
                  >
                    <span>{opt}</span>
                    {isCorrect && (
                      <CheckCircle2 size={15} className="text-emerald-600 shrink-0" />
                    )}
                  </div>
                );
              })}
            </div>

            <div className="p-2.5 rounded-xl bg-blue-50/60 border border-blue-100 text-xs text-blue-900 flex items-center justify-between">
              <span>💡 <strong>Reasoning:</strong> {q.explanation}</span>
              <span className="text-[11px] font-bold text-blue-700">{q.languageHint}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
