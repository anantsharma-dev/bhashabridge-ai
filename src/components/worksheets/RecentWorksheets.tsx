import React from 'react';
import { motion } from 'framer-motion';
import { Printer, WifiOff, Calendar, ArrowRight } from 'lucide-react';

export interface RecentWorksheetItem {
  id: string;
  title: string;
  hindiTitle: string;
  subject: string;
  grade: string;
  date: string;
  isOffline: boolean;
  type: string;
}

export interface RecentWorksheetsProps {
  onSelectWorksheet?: (id: string) => void;
  className?: string;
}

export const RecentWorksheets: React.FC<RecentWorksheetsProps> = ({
  onSelectWorksheet,
  className = '',
}) => {
  const worksheets: RecentWorksheetItem[] = [
    {
      id: 'ws-1',
      title: 'Wild & Domestic Animals',
      hindiTitle: 'वन्य एवं घरेलू पशु',
      subject: 'Language',
      grade: 'Grade 2',
      date: 'Today, 09:15 AM',
      isOffline: true,
      type: 'Matching & Tracing',
    },
    {
      id: 'ws-2',
      title: 'Numbers 1 to 20 Counting',
      hindiTitle: 'एक से बीस तक गिनती',
      subject: 'Mathematics',
      grade: 'Grade 1',
      date: 'Yesterday',
      isOffline: true,
      type: 'Counting Objects',
    },
    {
      id: 'ws-3',
      title: 'Sweet Fruits & Village Trees',
      hindiTitle: 'फल और गाँव के पेड़',
      subject: 'EVS',
      grade: 'Grade 2',
      date: '3 Days Ago',
      isOffline: true,
      type: 'Coloring & Vocabulary',
    },
  ];

  return (
    <div
      className={`rounded-[24px] bg-white border border-[#F1EFE8] p-6 sm:p-7 shadow-[0_4px_20px_rgba(0,0,0,0.04)] space-y-4 ${className}`}
    >
      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
        <div>
          <h3 className="text-lg font-extrabold text-slate-900 font-baloo">
            Recently Generated Worksheets
          </h3>
          <p className="text-xs text-slate-500 font-medium">
            Saved on local tablet storage for printing anytime
          </p>
        </div>
        <span className="text-xs font-bold text-blue-600 cursor-pointer hover:underline flex items-center gap-1">
          <span>View Archive</span>
          <ArrowRight size={13} />
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {worksheets.map((item) => (
          <motion.div
            key={item.id}
            whileHover={{ y: -3 }}
            className="p-4 rounded-2xl bg-[#FFFDF7] border border-slate-200/80 shadow-2xs flex flex-col justify-between space-y-3 cursor-pointer select-none"
            onClick={() => onSelectWorksheet && onSelectWorksheet(item.id)}
          >
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-900">
                  {item.grade} • {item.subject}
                </span>
                {item.isOffline && (
                  <span className="text-[10px] text-emerald-700 font-bold flex items-center gap-1">
                    <WifiOff size={11} /> Offline
                  </span>
                )}
              </div>

              <h4 className="text-sm font-extrabold text-slate-900 font-baloo line-clamp-1">
                {item.title}
              </h4>
              <p className="text-xs font-semibold text-slate-700 font-devanagari">
                {item.hindiTitle}
              </p>
              <p className="text-[11px] text-slate-500">
                Type: {item.type}
              </p>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
              <span className="text-[11px] text-slate-400 flex items-center gap-1">
                <Calendar size={12} /> {item.date}
              </span>
              <button
                type="button"
                className="p-1.5 rounded-lg bg-slate-100 hover:bg-blue-100 text-slate-700 hover:text-blue-700 cursor-pointer"
                aria-label="Print worksheet"
              >
                <Printer size={14} />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
