import React from 'react';
import { Sparkles, Settings2 } from 'lucide-react';

export interface LessonPlanConfig {
  grade: string;
  subject: string;
  language: string;
  topic: string;
  duration: string;
  learningObjective: string;
  nipunCompetency: string;
  classStrength: number;
  isOffline: boolean;
}

export interface LessonBuilderFormProps {
  config: LessonPlanConfig;
  onChangeConfig: (newConfig: Partial<LessonPlanConfig>) => void;
  onGeneratePlan: () => void;
  isGenerating?: boolean;
  className?: string;
}

export const LessonBuilderForm: React.FC<LessonBuilderFormProps> = ({
  config,
  onChangeConfig,
  onGeneratePlan,
  isGenerating = false,
  className = '',
}) => {
  const grades = ['Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5'];
  const subjects = ['Language MTB-MLE', 'Mathematics', 'Environmental Studies', 'Arts & Culture'];
  const languages = ['Hindi ↔ Santali (Ol Chiki)', 'Hindi ↔ Ho', 'Hindi ↔ Mundari'];
  const durations = ['30 Minutes', '45 Minutes', '60 Minutes'];

  return (
    <div
      className={`rounded-[24px] bg-white border border-[#F1EFE8] p-6 sm:p-7 shadow-[0_4px_20px_rgba(0,0,0,0.04)] space-y-6 ${className}`}
    >
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <Settings2 size={20} className="text-purple-600" />
          <h3 className="text-lg font-extrabold text-slate-900 font-baloo">
            Lesson Parameters & Objectives
          </h3>
        </div>

        {/* Offline Mode Toggle */}
        <label className="inline-flex items-center gap-2 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={config.isOffline}
            onChange={(e) => onChangeConfig({ isOffline: e.target.checked })}
            className="sr-only peer"
          />
          <div className="w-9 h-5 bg-slate-200 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500 relative" />
          <span className="text-xs font-bold text-slate-700">Offline Generator</span>
        </label>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Grade */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Class Grade:
          </label>
          <select
            value={config.grade}
            onChange={(e) => onChangeConfig({ grade: e.target.value })}
            className="w-full min-h-[44px] px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold text-slate-800 focus:ring-2 focus:ring-purple-400 cursor-pointer"
          >
            {grades.map((g) => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>
        </div>

        {/* Subject */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Subject:
          </label>
          <select
            value={config.subject}
            onChange={(e) => onChangeConfig({ subject: e.target.value })}
            className="w-full min-h-[44px] px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold text-slate-800 focus:ring-2 focus:ring-purple-400 cursor-pointer"
          >
            {subjects.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        {/* Language */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Language Pair:
          </label>
          <select
            value={config.language}
            onChange={(e) => onChangeConfig({ language: e.target.value })}
            className="w-full min-h-[44px] px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold text-slate-800 focus:ring-2 focus:ring-purple-400 cursor-pointer"
          >
            {languages.map((l) => (
              <option key={l} value={l}>{l}</option>
            ))}
          </select>
        </div>

        {/* Duration */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Lesson Duration:
          </label>
          <select
            value={config.duration}
            onChange={(e) => onChangeConfig({ duration: e.target.value })}
            className="w-full min-h-[44px] px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold text-slate-800 focus:ring-2 focus:ring-purple-400 cursor-pointer"
          >
            {durations.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
        {/* Topic Input */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Lesson Topic / Theme:
          </label>
          <input
            type="text"
            value={config.topic}
            onChange={(e) => onChangeConfig({ topic: e.target.value })}
            className="w-full min-h-[44px] px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold text-slate-800 focus:ring-2 focus:ring-purple-400"
            placeholder="e.g. Wild and Domestic Animals"
          />
        </div>

        {/* NIPUN Competency */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
            NIPUN Bharat Target Competency:
          </label>
          <input
            type="text"
            value={config.nipunCompetency}
            onChange={(e) => onChangeConfig({ nipunCompetency: e.target.value })}
            className="w-full min-h-[44px] px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800 focus:ring-2 focus:ring-purple-400"
            placeholder="e.g. L2.4 Bilingual Story Comprehension"
          />
        </div>
      </div>

      {/* Generate Button */}
      <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
        <span className="text-xs text-slate-500 font-medium">
          Class Strength: <strong>{config.classStrength} students</strong> • Dumka Block Primary Curriculum
        </span>

        <button
          type="button"
          onClick={onGeneratePlan}
          disabled={isGenerating}
          className="min-h-[48px] px-8 py-3 rounded-2xl bg-[#8B5CF6] hover:bg-purple-700 text-white font-bold text-sm shadow-md shadow-purple-500/20 cursor-pointer flex items-center gap-2 transition-colors disabled:opacity-50 shrink-0"
        >
          <Sparkles size={16} className={isGenerating ? 'animate-spin' : ''} />
          <span>{isGenerating ? 'AI Architecting Plan...' : 'Generate 45-Min Lesson Plan'}</span>
        </button>
      </div>
    </div>
  );
};
