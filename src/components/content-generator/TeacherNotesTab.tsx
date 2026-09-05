import React from 'react';
import type { TeacherNotesOutput } from '../../types/contentGenerator';

export interface TeacherNotesTabProps {
  teacherNotes: TeacherNotesOutput;
  isEditMode: boolean;
  onUpdate: (updated: TeacherNotesOutput) => void;
}

export const TeacherNotesTab: React.FC<TeacherNotesTabProps> = ({
  teacherNotes,
  isEditMode: _isEditMode,
  onUpdate: _onUpdate,
}) => {
  return (
    <div className="space-y-5">
      <div className="p-4 rounded-2xl bg-purple-50/60 border border-purple-200 space-y-3">
        <h4 className="text-xs font-extrabold text-purple-900 uppercase tracking-wider font-baloo">
          Pedagogical Insights & Classroom Strategies
        </h4>
        <ul className="space-y-1.5 text-xs text-purple-950 font-medium">
          {teacherNotes.pedagogyTips.map((tip, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-600 mt-1.5 shrink-0" />
              <span>{tip}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        {/* Tribal Bridge Advice */}
        <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200 space-y-2">
          <h5 className="font-extrabold text-amber-950 font-baloo text-sm">
            Mother Tongue Bridge Strategies
          </h5>
          <ul className="space-y-1 text-amber-900 font-medium">
            {teacherNotes.tribalBridgeStrategies.map((s, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-600 mt-1.5 shrink-0" />
                <span>{s}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Remedial Interventions */}
        <div className="p-4 rounded-2xl bg-rose-50/60 border border-rose-200 space-y-2">
          <h5 className="font-extrabold text-rose-950 font-baloo text-sm">
            Remedial Steps for Level 1 Learners
          </h5>
          <ul className="space-y-1 text-rose-900 font-medium">
            {teacherNotes.remedialActivities.map((r, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-600 mt-1.5 shrink-0" />
                <span>{r}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Parent Engagement */}
      <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 font-medium space-y-1">
        <span className="font-bold text-emerald-950">Village Parent Engagement Guidance:</span>
        <p>{teacherNotes.parentEngagementTip}</p>
      </div>
    </div>
  );
};
