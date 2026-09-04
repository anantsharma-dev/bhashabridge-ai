import React from 'react';
import { motion } from 'framer-motion';
import { Printer, Download, Save, Copy, Users, CheckCircle2, BookOpen } from 'lucide-react';
import type { GeneratedWorksheet } from '../../services/worksheetService';
import { CuteElephant, CuteMango, CountingBlocks } from '../ui/DashboardIllustrations';

export interface WorksheetPreviewProps {
  worksheet?: GeneratedWorksheet;
  title?: string;
  grade?: string;
  subject?: string;
  competency?: string;
  onDownloadPdf?: () => void;
  onSaveOffline?: () => void;
  onDuplicate?: () => void;
  onAssign?: () => void;
  className?: string;
}

export const WorksheetPreview: React.FC<WorksheetPreviewProps> = ({
  worksheet,
  title = 'Wild & Domestic Animals • ᱵᱤᱨ ᱟᱨ ᱚᱲᱟᱜ ᱡᱤᱵᱽ ᱡᱤᱭᱟᱹᱞᱤ',
  grade = 'Grade 2',
  subject = 'Language MTB-MLE (Hindi + Santali)',
  competency = 'FLN Competency L2.3: Picture Matching & Letter Tracing',
  onDownloadPdf,
  onSaveOffline,
  onDuplicate,
  onAssign,
  className = '',
}) => {
  const displayTitle = worksheet?.title || title;
  const displayGrade = worksheet?.config?.grade || grade;
  const displaySubject = worksheet?.config?.subject || subject;
  const displayCompetency = worksheet?.config?.nipunCompetency || competency;
  const questions = worksheet?.questions || [];

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Teacher Actions Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-white border border-[#F1EFE8] shadow-xs">
        <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
          <CheckCircle2 size={16} className="text-emerald-600" />
          A4 Printable Preview Ready (8.27" × 11.69")
        </span>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={onDownloadPdf}
            className="min-h-[40px] px-4 py-2 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <Download size={15} />
            <span>Download PDF</span>
          </button>

          <button
            type="button"
            onClick={onDownloadPdf}
            className="min-h-[40px] px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
          >
            <Printer size={15} />
            <span>Print</span>
          </button>

          <button
            type="button"
            onClick={onSaveOffline}
            className="min-h-[40px] px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
          >
            <Save size={15} />
            <span>Save Offline</span>
          </button>

          <button
            type="button"
            onClick={onDuplicate}
            className="min-h-[40px] px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
          >
            <Copy size={15} />
            <span>Duplicate</span>
          </button>

          <button
            type="button"
            onClick={onAssign}
            className="min-h-[40px] px-3.5 py-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-800 border border-purple-200 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
          >
            <Users size={15} />
            <span>Assign to Class</span>
          </button>
        </div>
      </div>

      {/* Printable A4 Paper Surface */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto rounded-[24px] bg-white border-2 border-slate-200 p-8 sm:p-12 shadow-xl space-y-8 font-sans text-slate-900 print:shadow-none print:border-none print:m-0 print:p-4"
      >
        {/* Paper Header (School & Student Info) */}
        <div className="border-b-2 border-slate-900 pb-4 space-y-3">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <div>
              <span className="text-[11px] font-bold text-blue-800 uppercase tracking-widest">
                GPS Dumka Tribal Block • Jharkhand Primary Education
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold font-baloo">
                {displayTitle}
              </h2>
            </div>
            <div className="text-right shrink-0">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300">
                {displayGrade} • {displaySubject}
              </span>
            </div>
          </div>

          <div className="text-xs text-slate-500 font-medium">
            Competency: <strong>{displayCompetency}</strong>
          </div>

          {/* Student Name & Date Lines */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2 text-xs font-bold text-slate-700">
            <div className="border-b border-dotted border-slate-400 pb-1">
              विद्यार्थी का नाम (Name): ________________
            </div>
            <div className="border-b border-dotted border-slate-400 pb-1">
              दिनांक (Date): ____________
            </div>
            <div className="border-b border-dotted border-slate-400 pb-1">
              कक्षा (Grade): {displayGrade}
            </div>
            <div className="border-b border-dotted border-slate-400 pb-1">
              अंक (Score): ___ / 10
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200 text-xs text-amber-950 space-y-0.5">
          <p className="font-bold font-devanagari">
            {worksheet?.instructionsHindi || 'निर्देश: बाईं ओर के शब्दों को दाईं ओर के सही संथाली (Ol Chiki) शब्दों से रेखा खींचकर मिलाएँ।'}
          </p>
          <p className="font-semibold font-olchiki text-amber-900">
            {worksheet?.instructionsSanthali || 'ᱟᱹᱫᱮᱥ: ᱞᱮᱸᱜᱟ ᱯᱟᱦᱴᱟ ᱨᱮᱭᱟᱜ ᱥᱟᱵᱟᱫ ᱠᱚ ᱡᱚᱡᱚᱢ ᱯᱟᱦᱴᱟ ᱨᱮᱭᱟᱜ ᱥᱟᱹᱨᱤ ᱚᱞ ᱪᱤᱠᱤ ᱥᱟᱵᱟᱫ ᱥᱟᱞᱟᱜ ᱛᱚᱞ ᱢᱮ ᱾'}
          </p>
        </div>

        {/* DYNAMIC EXERCISES SECTION */}
        {questions.length > 0 ? (
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
                1
              </span>
              <h3 className="text-base font-extrabold font-devanagari">
                अभ्यास प्रश्न (Bilingual Practice Exercises):
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {questions.map((q, idx) => (
                <div
                  key={q.id || idx}
                  className="p-4 rounded-2xl border border-slate-200 bg-[#FFFDF7] space-y-2 flex flex-col justify-between"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-800 text-[11px] font-bold flex items-center justify-center shrink-0">
                        {idx + 1}
                      </span>
                      <span className="text-xs font-bold text-slate-800 font-devanagari">
                        {q.promptHindi}
                      </span>
                    </div>
                    {q.leftItem?.icon && (
                      <span className="text-2xl">{q.leftItem.icon}</span>
                    )}
                  </div>

                  <p className="text-xs font-semibold text-slate-600 font-olchiki pl-7">
                    {q.promptSanthali}
                  </p>

                  <div className="pt-2 border-t border-dashed border-slate-300 flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-700">
                      {q.leftItem?.textHindi || `Option A`}
                    </span>
                    <span className="font-black font-olchiki text-blue-900 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200">
                      [ &nbsp; ] {q.rightItem?.textSanthali || ''}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* Default Illustrative Exercises */
          <div className="space-y-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
                  1
                </span>
                <h3 className="text-base font-extrabold font-devanagari">
                  चित्र देखकर सही संथाली (ओल चिकी) शब्द से मिलाएँ (Match Pictures with Words):
                </h3>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 p-4 rounded-2xl bg-[#FFFDF7] border border-slate-200">
                <div className="p-3 rounded-xl border border-dashed border-amber-300 bg-amber-50/50 flex flex-col items-center text-center space-y-2">
                  <CuteElephant size={65} />
                  <span className="text-xs font-bold text-slate-800">हाथी (Elephant)</span>
                  <div className="w-full border-t border-slate-300 pt-1 text-xs font-extrabold font-olchiki text-blue-900">
                    [ ] ᱦᱟᱹᱛᱤ (Hati)
                  </div>
                </div>

                <div className="p-3 rounded-xl border border-dashed border-emerald-300 bg-emerald-50/50 flex flex-col items-center text-center space-y-2">
                  <CuteMango size={65} />
                  <span className="text-xs font-bold text-slate-800">आम (Mango)</span>
                  <div className="w-full border-t border-slate-300 pt-1 text-xs font-extrabold font-olchiki text-emerald-900">
                    [ ] ᱩᱞ (Ul)
                  </div>
                </div>

                <div className="p-3 rounded-xl border border-dashed border-blue-300 bg-blue-50/50 flex flex-col items-center text-center space-y-2">
                  <CountingBlocks size={65} />
                  <span className="text-xs font-bold text-slate-800">गिनती (Numbers)</span>
                  <div className="w-full border-t border-slate-300 pt-1 text-xs font-extrabold font-olchiki text-purple-900">
                    [ ] ᱮᱞ (El)
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* EXERCISE 2: TRACING LETTERS & OL CHIKI WORDS */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center">
              2
            </span>
            <h3 className="text-base font-extrabold font-devanagari">
              सुंदर अक्षरों पर पेंसिल फेरें (Trace the Ol Chiki & Hindi Words):
            </h3>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs font-bold text-slate-600">
                <span>हाथी • Elephant</span>
                <span className="font-olchiki text-sm font-bold text-emerald-800">ᱦᱟᱹᱛᱤ</span>
              </div>
              <div className="h-10 border-b border-dashed border-slate-400 flex items-center px-2 text-xl font-bold tracking-widest text-slate-400 font-olchiki select-none">
                ᱦ ᱟᱹ ᱛ ᱤ . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs font-bold text-slate-600">
                <span>आम • Mango</span>
                <span className="font-olchiki text-sm font-bold text-emerald-800">ᱩᱞ</span>
              </div>
              <div className="h-10 border-b border-dashed border-slate-400 flex items-center px-2 text-xl font-bold tracking-widest text-slate-400 font-olchiki select-none">
                ᱩ ᱞ . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
              </div>
            </div>
          </div>
        </div>

        {/* Paper Footer */}
        <div className="border-t border-slate-200 pt-4 flex items-center justify-between text-[11px] text-slate-400">
          <span className="flex items-center gap-1.5">
            <BookOpen size={13} />
            BhashaBridge AI • Offline FLN Worksheet Generator
          </span>
          <span>Approved for Dumka & Ranchi MTB-MLE Classrooms</span>
        </div>
      </motion.div>
    </div>
  );
};

export default WorksheetPreview;
