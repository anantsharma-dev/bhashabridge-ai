import React from 'react';
import { Download, Save, Copy, Users, BookOpen, FileText, Music, Box, BookMarked } from 'lucide-react';

export interface ClassroomMaterialsProps {
  onSaveOffline?: () => void;
  onDownloadPdf?: () => void;
  onAssignToClass?: () => void;
  onDuplicate?: () => void;
  className?: string;
}

export const ClassroomMaterials: React.FC<ClassroomMaterialsProps> = ({
  onSaveOffline,
  onDownloadPdf,
  onAssignToClass,
  onDuplicate,
  className = '',
}) => {
  const materials = [
    {
      name: 'Animals Bilingual Flashcard Pack',
      count: '16 Cards',
      icon: <BookOpen size={16} className="text-amber-600" />,
      tag: 'Flashcards',
      color: 'bg-amber-50 border-amber-200 text-amber-900',
    },
    {
      name: 'Matching & Tracing Worksheet PDF',
      count: 'A4 Printable',
      icon: <FileText size={16} className="text-blue-600" />,
      tag: 'Worksheet',
      color: 'bg-blue-50 border-blue-200 text-blue-900',
    },
    {
      name: 'Real Classroom Objects (Clay, Leaves)',
      count: 'Physical Kit',
      icon: <Box size={16} className="text-emerald-600" />,
      tag: 'Hands-on',
      color: 'bg-emerald-50 border-emerald-200 text-emerald-900',
    },
    {
      name: 'Santhali Traditional Bird Audio Song',
      count: '2:15 Mins MP3',
      icon: <Music size={16} className="text-purple-600" />,
      tag: 'Audio Piper',
      color: 'bg-purple-50 border-purple-200 text-purple-900',
    },
    {
      name: 'The Clever Fox Bilingual Storybook',
      count: '6 Illustrated Pages',
      icon: <BookMarked size={16} className="text-rose-600" />,
      tag: 'Storybook',
      color: 'bg-rose-50 border-rose-200 text-rose-900',
    },
  ];

  return (
    <div
      className={`rounded-[24px] bg-white border border-[#F1EFE8] p-6 sm:p-7 shadow-[0_4px_20px_rgba(0,0,0,0.04)] space-y-5 ${className}`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-100">
        <div>
          <h3 className="text-lg font-extrabold text-slate-900 font-baloo">
            Required Classroom Teaching Kit & Materials
          </h3>
          <p className="text-xs text-slate-500 font-medium">
            Everything teacher needs ready for tomorrow morning
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={onDownloadPdf}
            className="min-h-[40px] px-3.5 py-2 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <Download size={14} />
            <span>Export PDF</span>
          </button>

          <button
            type="button"
            onClick={onSaveOffline}
            className="min-h-[40px] px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
          >
            <Save size={14} />
            <span>Save Offline</span>
          </button>

          <button
            type="button"
            onClick={onAssignToClass}
            className="min-h-[40px] px-3.5 py-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-800 border border-purple-200 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
          >
            <Users size={14} />
            <span>Assign to Class</span>
          </button>

          <button
            type="button"
            onClick={onDuplicate}
            className="min-h-[40px] px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1 cursor-pointer"
          >
            <Copy size={14} />
            <span>Duplicate</span>
          </button>
        </div>
      </div>

      {/* Materials List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {materials.map((m, idx) => (
          <div
            key={idx}
            className="p-3.5 rounded-2xl bg-[#FFFDF7] border border-slate-200/80 flex items-center justify-between gap-3 shadow-2xs"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="p-2 rounded-xl bg-white border border-slate-200 shadow-2xs shrink-0">
                {m.icon}
              </div>
              <div className="min-w-0">
                <h4 className="text-xs font-bold text-slate-900 truncate">
                  {m.name}
                </h4>
                <span className="text-[10px] text-slate-500 font-medium">
                  {m.count}
                </span>
              </div>
            </div>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border shrink-0 ${m.color}`}>
              {m.tag}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
