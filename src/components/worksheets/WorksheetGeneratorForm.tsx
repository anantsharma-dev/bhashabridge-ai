import { Sparkles, Sliders } from 'lucide-react';

export interface WorksheetConfig {
  grade: string;
  subject: string;
  language: string;
  topic: string;
  difficulty: string;
  nipunCompetency: string;
  questionCount: number;
  illustrationStyle: string;
  isOffline: boolean;
  type: string;
}

export interface WorksheetGeneratorFormProps {
  config: WorksheetConfig;
  onChangeConfig: (newConfig: Partial<WorksheetConfig>) => void;
  onGenerate: () => void;
  isGenerating?: boolean;
  className?: string;
}

export const WorksheetGeneratorForm: React.FC<WorksheetGeneratorFormProps> = ({
  config,
  onChangeConfig,
  onGenerate,
  isGenerating = false,
  className = '',
}) => {
  const grades = ['Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5'];
  const subjects = ['Language (भाषा)', 'Math (गणित)', 'EVS (पर्यावरण)'];
  const languages = ['Hindi + Santali (Ol Chiki)', 'Hindi + Ho', 'Hindi + Mundari'];
  const topics = ['Animals & Nature', 'Numbers 1–20', 'Fruits & Vegetables', 'My Family & Village'];
  const difficulties = ['Foundational (सरल)', 'Standard (मध्यम)', 'Enrichment (अभ्यास)'];
  const competencies = [
    'L1.2 Oral & Visual Vocabulary',
    'L2.3 Letter Tracing & Script Recognition',
    'N1.4 Number Matching & Counting Objects',
    'L3.1 Simple Bilingual Story Comprehension',
  ];
  const styles = ['Coloring Outline (बच्चे रंग भरें)', 'Clean Cartoon Vector', 'Minimalist Black & White'];
  const types = [
    'Vocabulary Matching',
    'Number Counting',
    'Letter Tracing (Ol Chiki)',
    'Story Comprehension',
    'Coloring & Words',
  ];

  return (
    <div
      className={`rounded-[24px] bg-white border border-[#F1EFE8] p-6 sm:p-7 shadow-[0_4px_20px_rgba(0,0,0,0.04)] space-y-6 ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <Sliders size={20} className="text-blue-600" />
          <h3 className="text-lg font-extrabold text-slate-900 font-baloo">
            AI Worksheet Generator Settings
          </h3>
        </div>

        {/* Offline Toggle */}
        <label className="inline-flex items-center gap-2 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={config.isOffline}
            onChange={(e) => onChangeConfig({ isOffline: e.target.checked })}
            className="sr-only peer"
          />
          <div className="w-9 h-5 bg-slate-200 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500 relative" />
          <span className="text-xs font-bold text-slate-700">100% Offline AI</span>
        </label>
      </div>

      {/* Grid of Options */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* Grade */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Target Grade:
          </label>
          <select
            value={config.grade}
            onChange={(e) => onChangeConfig({ grade: e.target.value })}
            className="w-full min-h-[44px] px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold text-slate-800 focus:ring-2 focus:ring-blue-400 cursor-pointer"
          >
            {grades.map((g) => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>
        </div>

        {/* Subject */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Classroom Subject:
          </label>
          <select
            value={config.subject}
            onChange={(e) => onChangeConfig({ subject: e.target.value })}
            className="w-full min-h-[44px] px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold text-slate-800 focus:ring-2 focus:ring-blue-400 cursor-pointer"
          >
            {subjects.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        {/* Language Pair */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Bilingual Language:
          </label>
          <select
            value={config.language}
            onChange={(e) => onChangeConfig({ language: e.target.value })}
            className="w-full min-h-[44px] px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold text-slate-800 focus:ring-2 focus:ring-blue-400 cursor-pointer"
          >
            {languages.map((l) => (
              <option key={l} value={l}>{l}</option>
            ))}
          </select>
        </div>

        {/* Topic */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Lesson Topic:
          </label>
          <select
            value={config.topic}
            onChange={(e) => onChangeConfig({ topic: e.target.value })}
            className="w-full min-h-[44px] px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold text-slate-800 focus:ring-2 focus:ring-blue-400 cursor-pointer"
          >
            {topics.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>

        {/* Worksheet Type */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Activity Type:
          </label>
          <select
            value={config.type}
            onChange={(e) => onChangeConfig({ type: e.target.value })}
            className="w-full min-h-[44px] px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold text-slate-800 focus:ring-2 focus:ring-blue-400 cursor-pointer"
          >
            {types.map((ty) => (
              <option key={ty} value={ty}>{ty}</option>
            ))}
          </select>
        </div>

        {/* Difficulty */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Difficulty Level:
          </label>
          <select
            value={config.difficulty}
            onChange={(e) => onChangeConfig({ difficulty: e.target.value })}
            className="w-full min-h-[44px] px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold text-slate-800 focus:ring-2 focus:ring-blue-400 cursor-pointer"
          >
            {difficulties.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Competency & Style Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
            NIPUN Bharat Competency:
          </label>
          <select
            value={config.nipunCompetency}
            onChange={(e) => onChangeConfig({ nipunCompetency: e.target.value })}
            className="w-full min-h-[44px] px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800 focus:ring-2 focus:ring-blue-400 cursor-pointer"
          >
            {competencies.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Illustration Style:
          </label>
          <select
            value={config.illustrationStyle}
            onChange={(e) => onChangeConfig({ illustrationStyle: e.target.value })}
            className="w-full min-h-[44px] px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800 focus:ring-2 focus:ring-blue-400 cursor-pointer"
          >
            {styles.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Generate CTA Button */}
      <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
        <span className="text-xs text-slate-500 font-medium">
          Ready to generate 6 activity items with full Ol Chiki + Hindi bilingual typography.
        </span>

        <button
          type="button"
          onClick={onGenerate}
          disabled={isGenerating}
          className="min-h-[48px] px-8 py-3 rounded-2xl bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-sm shadow-md shadow-blue-500/20 cursor-pointer flex items-center gap-2 transition-colors disabled:opacity-50 shrink-0"
        >
          <Sparkles size={16} className={isGenerating ? 'animate-spin' : ''} />
          <span>{isGenerating ? 'Generating Worksheet...' : 'Generate New Worksheet'}</span>
        </button>
      </div>
    </div>
  );
};
