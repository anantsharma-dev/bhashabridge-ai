import React from 'react';
import { CheckCircle2, Sparkles } from 'lucide-react';
import type { LessonPlanOutput } from '../../types/contentGenerator';

export interface LessonPlanTabProps {
  lessonPlan: LessonPlanOutput;
  isEditMode: boolean;
  onUpdate: (updated: LessonPlanOutput) => void;
}

export const LessonPlanTab: React.FC<LessonPlanTabProps> = ({
  lessonPlan,
  isEditMode,
  onUpdate,
}) => {
  return (
    <div className="space-y-6">
      {/* Learning Outcomes */}
      <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-100 space-y-2">
        <h4 className="text-xs font-extrabold text-blue-900 uppercase tracking-wider font-baloo">
          NIPUN Bharat Learning Outcomes
        </h4>
        <ul className="space-y-1 text-xs text-blue-950 font-medium">
          {lessonPlan.learningOutcomes.map((outcome, idx) => (
            <li key={idx} className="flex items-start gap-2">
              <CheckCircle2 size={14} className="text-blue-600 shrink-0 mt-0.5" />
              {isEditMode ? (
                <input
                  type="text"
                  value={outcome}
                  onChange={(e) => {
                    const copy = [...lessonPlan.learningOutcomes];
                    copy[idx] = e.target.value;
                    onUpdate({ ...lessonPlan, learningOutcomes: copy });
                  }}
                  className="w-full bg-white border border-blue-200 rounded-lg px-2 py-1 text-xs"
                />
              ) : (
                <span>{outcome}</span>
              )}
            </li>
          ))}
        </ul>
      </div>

      {/* 45-Min Phases Timeline */}
      <div className="space-y-4">
        <h4 className="text-sm font-extrabold text-slate-900 font-baloo">
          45-Minute 5-Phase Classroom Timeline
        </h4>

        <div className="space-y-3">
          {lessonPlan.phases.map((phase, idx) => (
            <div
              key={phase.phase}
              className="p-4 rounded-2xl bg-[#FFFDF7] border border-slate-200/80 space-y-2 shadow-2xs"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-extrabold flex items-center justify-center">
                    {phase.phase}
                  </span>
                  <h5 className="font-extrabold text-slate-900 text-sm font-baloo">
                    {phase.name}
                  </h5>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700">
                  {phase.duration}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs pt-1">
                <div className="p-3 rounded-xl bg-white border border-slate-200 space-y-1">
                  <span className="font-bold text-blue-700">Teacher Action:</span>
                  {isEditMode ? (
                    <textarea
                      rows={2}
                      value={phase.teacherAction}
                      onChange={(e) => {
                        const copy = [...lessonPlan.phases];
                        copy[idx].teacherAction = e.target.value;
                        onUpdate({ ...lessonPlan, phases: copy });
                      }}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs"
                    />
                  ) : (
                    <p className="text-slate-600 font-medium">{phase.teacherAction}</p>
                  )}
                </div>

                <div className="p-3 rounded-xl bg-white border border-slate-200 space-y-1">
                  <span className="font-bold text-emerald-700">Student Response:</span>
                  {isEditMode ? (
                    <textarea
                      rows={2}
                      value={phase.studentAction}
                      onChange={(e) => {
                        const copy = [...lessonPlan.phases];
                        copy[idx].studentAction = e.target.value;
                        onUpdate({ ...lessonPlan, phases: copy });
                      }}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs"
                    />
                  ) : (
                    <p className="text-slate-600 font-medium">{phase.studentAction}</p>
                  )}
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-amber-50/70 border border-amber-200/80 text-xs text-amber-900 font-medium flex items-center gap-2">
                <Sparkles size={14} className="text-amber-600 shrink-0" />
                <span><strong>Language Bridge Tip:</strong> {phase.languageBridgeTip}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Materials Needed */}
      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
        <span className="font-extrabold text-slate-800 font-baloo">Classroom Materials Needed:</span>
        <div className="flex flex-wrap gap-2">
          {lessonPlan.materialsNeeded.map((mat, i) => (
            <span
              key={i}
              className="px-3 py-1 rounded-xl bg-white border border-slate-200 font-bold text-slate-700 shadow-2xs"
            >
              {mat}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
