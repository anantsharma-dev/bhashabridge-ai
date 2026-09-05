import React from 'react';
import type { WorksheetOutput } from '../../types/contentGenerator';

export interface WorksheetTabProps {
  worksheet: WorksheetOutput;
  isEditMode: boolean;
  onUpdate: (updated: WorksheetOutput) => void;
}

export const WorksheetTab: React.FC<WorksheetTabProps> = ({
  worksheet,
  isEditMode,
  onUpdate,
}) => {
  return (
    <div className="space-y-6">
      <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-2">
        <div className="flex items-center justify-between">
          {isEditMode ? (
            <input
              type="text"
              value={worksheet.title}
              onChange={(e) => onUpdate({ ...worksheet, title: e.target.value })}
              className="text-base font-extrabold text-slate-900 font-baloo border border-slate-200 rounded p-1 w-full"
            />
          ) : (
            <h4 className="text-base font-extrabold text-slate-900 font-baloo">
              {worksheet.title}
            </h4>
          )}
          <span className="text-xs font-bold px-2.5 py-1 rounded-xl bg-slate-100 text-slate-700 shrink-0 ml-2">
            Print-Ready
          </span>
        </div>
        <p className="text-xs text-slate-600 font-medium">
          {worksheet.instructions}
        </p>
      </div>

      {/* Sections */}
      <div className="space-y-4">
        {worksheet.sections.map((section, idx) => (
          <div
            key={idx}
            className="p-5 rounded-2xl bg-[#FFFDF7] border border-slate-200 space-y-3 shadow-2xs"
          >
            <div className="flex items-center justify-between">
              <h5 className="font-extrabold text-slate-900 text-sm font-baloo">
                {section.sectionTitle}
              </h5>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-900 uppercase">
                {section.activityType}
              </span>
            </div>

            <div className="space-y-2">
              {section.questions.map((q) => (
                <div
                  key={q.id}
                  className="p-3 rounded-xl bg-white border border-slate-200 flex items-center justify-between gap-3 text-xs"
                >
                  <span className="font-medium text-slate-800">{q.prompt}</span>
                  <span className="font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded-lg border border-dashed border-slate-300">
                    {q.answer}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Teacher Answer Key */}
      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
        <span className="font-bold text-slate-800">Teacher Evaluation Answer Key:</span>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-600 font-medium">
          {worksheet.teacherAnswerKey.map((key, i) => (
            <div key={i} className="p-2 bg-white rounded-lg border border-slate-200">
              {key}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
