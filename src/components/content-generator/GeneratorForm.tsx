import React from 'react';
import { Layers, Sparkles, Loader2 } from 'lucide-react';
import type {
  ContentGrade,
  ContentSubject,
  ContentDifficulty,
  ContentGeneratorInputs,
} from '../../types/contentGenerator';

export interface GeneratorFormProps {
  inputs: ContentGeneratorInputs;
  onChange: (inputs: ContentGeneratorInputs) => void;
  onGenerate: () => void;
  isGenerating: boolean;
}

const SUGGESTED_TOPICS = [
  'Saranda Forest Wildlife (सारंडा वन्य जीव)',
  'Counting 1-20 with Pebbles (कंकड़ से संख्या गणना)',
  'Sohrai Harvest Art & Festival (सोहराय पर्व व चित्रकला)',
  'Birsa Munda & Tribal Legends (भगवान बिरसा मुंडा गाथा)',
  'Water Cycle & Jharkhand Rivers (स्वर्णरेखा व मयूराक्षी नदी)',
  'Body Parts & Hygiene (शरीर के अंग व स्वच्छता)',
];

const LANGUAGES = [
  'Hindi ↔ Santali (Ol Chiki)',
  'Hindi ↔ Mundari',
  'Hindi ↔ Ho (Warang Chiti)',
  'Hindi ↔ Kurukh (Oraon)',
  'Hindi ↔ English Bridge',
];

export const GeneratorForm: React.FC<GeneratorFormProps> = ({
  inputs,
  onChange,
  onGenerate,
  isGenerating,
}) => {
  return (
    <div className="rounded-[24px] bg-white border border-[#F1EFE8] p-6 sm:p-7 shadow-[0_4px_20px_rgba(0,0,0,0.04)] space-y-5">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center font-bold">
            <Layers size={18} />
          </div>
          <h2 className="text-base sm:text-lg font-extrabold text-slate-900 font-baloo">
            Curriculum Design Parameters
          </h2>
        </div>
        <span className="text-xs font-semibold text-slate-500">
          JHARKHAND JCERT & NEP 2020
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 text-xs">
        {/* Grade */}
        <div className="space-y-1.5">
          <label className="font-bold text-slate-700 block">Class Grade</label>
          <select
            value={inputs.grade}
            onChange={(e) => onChange({ ...inputs, grade: e.target.value as ContentGrade })}
            className="w-full min-h-[42px] px-3 rounded-xl bg-slate-50 border border-slate-200 font-bold text-slate-800 focus:ring-2 focus:ring-blue-400 cursor-pointer"
          >
            {(['Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5'] as ContentGrade[]).map((g) => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>
        </div>

        {/* Subject */}
        <div className="space-y-1.5">
          <label className="font-bold text-slate-700 block">Subject</label>
          <select
            value={inputs.subject}
            onChange={(e) => onChange({ ...inputs, subject: e.target.value as ContentSubject })}
            className="w-full min-h-[42px] px-3 rounded-xl bg-slate-50 border border-slate-200 font-bold text-slate-800 focus:ring-2 focus:ring-blue-400 cursor-pointer"
          >
            {[
              'Foundational Literacy',
              'Mathematics',
              'Environmental Studies (EVS)',
              'Social Studies',
              'Arts & Culture',
              'Science',
            ].map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        {/* Language */}
        <div className="space-y-1.5">
          <label className="font-bold text-slate-700 block">Language Bridge</label>
          <select
            value={inputs.language}
            onChange={(e) => onChange({ ...inputs, language: e.target.value })}
            className="w-full min-h-[42px] px-3 rounded-xl bg-slate-50 border border-slate-200 font-bold text-slate-800 focus:ring-2 focus:ring-blue-400 cursor-pointer"
          >
            {LANGUAGES.map((l) => (
              <option key={l} value={l}>{l}</option>
            ))}
          </select>
        </div>

        {/* Difficulty */}
        <div className="space-y-1.5">
          <label className="font-bold text-slate-700 block">Learner Level</label>
          <select
            value={inputs.difficulty}
            onChange={(e) => onChange({ ...inputs, difficulty: e.target.value as ContentDifficulty })}
            className="w-full min-h-[42px] px-3 rounded-xl bg-slate-50 border border-slate-200 font-bold text-slate-800 focus:ring-2 focus:ring-blue-400 cursor-pointer"
          >
            {[
              'Level 1 (Foundational)',
              'Level 2 (Intermediate)',
              'Level 3 (Fluency)',
            ].map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>

        {/* Topic */}
        <div className="space-y-1.5 sm:col-span-2 lg:col-span-1">
          <label className="font-bold text-slate-700 block">Curriculum Topic</label>
          <input
            type="text"
            value={inputs.topic}
            onChange={(e) => onChange({ ...inputs, topic: e.target.value })}
            placeholder="e.g. Forest Wildlife"
            className="w-full min-h-[42px] px-3 rounded-xl bg-slate-50 border border-slate-200 font-bold text-slate-800 focus:ring-2 focus:ring-blue-400"
          />
        </div>
      </div>

      {/* Suggested Quick Topics */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 text-xs">
        <span className="text-slate-400 font-semibold shrink-0">Quick Topics:</span>
        {SUGGESTED_TOPICS.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => onChange({ ...inputs, topic: t })}
            className={`min-h-[32px] px-3 py-1 rounded-xl font-medium shrink-0 cursor-pointer transition-all border ${
              inputs.topic === t
                ? 'bg-blue-50 border-blue-300 text-blue-900 font-bold'
                : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Footer / Submit */}
      <div className="pt-2 flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Generates 7 integrated curriculum outputs</span>
        </div>

        <button
          type="button"
          disabled={isGenerating}
          onClick={onGenerate}
          className="min-h-[46px] px-6 py-2.5 rounded-2xl bg-[#2563EB] hover:bg-blue-700 text-white font-extrabold text-sm flex items-center gap-2 shadow-[0_4px_14px_rgba(37,99,235,0.3)] transition-all cursor-pointer disabled:opacity-50"
        >
          {isGenerating ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              <span>Generating with Gemini 2.5 Flash...</span>
            </>
          ) : (
            <>
              <Sparkles size={16} className="text-amber-300" />
              <span>Generate Complete Curriculum Package</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
