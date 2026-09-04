import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, FileText, Layers, Calendar, Volume2, Languages, Image, Video } from 'lucide-react';

export interface LibrarySectionItem {
  id: string;
  name: string;
  hindiName: string;
  count: string;
  size: string;
  icon: React.ReactNode;
  bgClass: string;
  borderClass: string;
  badgeClass: string;
}

export interface LibrarySectionsProps {
  activeSection: string;
  onSelectSection: (id: string) => void;
  className?: string;
}

export const LibrarySections: React.FC<LibrarySectionsProps> = ({
  activeSection = 'stories',
  onSelectSection,
  className = '',
}) => {
  const sections: LibrarySectionItem[] = [
    {
      id: 'stories',
      name: 'Stories Library',
      hindiName: 'कहानियाँ',
      count: '18 Stories',
      size: '42 MB',
      icon: <BookOpen size={20} className="text-amber-700" />,
      bgClass: 'bg-[#FFFBEB]',
      borderClass: 'border-amber-200',
      badgeClass: 'bg-amber-100 text-amber-900',
    },
    {
      id: 'worksheets',
      name: 'Worksheets Archive',
      hindiName: 'कार्यपत्रक',
      count: '24 Print PDFs',
      size: '18 MB',
      icon: <FileText size={20} className="text-blue-700" />,
      bgClass: 'bg-[#EFF6FF]',
      borderClass: 'border-blue-200',
      badgeClass: 'bg-blue-100 text-blue-900',
    },
    {
      id: 'flashcards',
      name: 'Flashcard Packs',
      hindiName: 'चित्र कार्ड संग्रह',
      count: '12 Packs',
      size: '34 MB',
      icon: <Layers size={20} className="text-emerald-700" />,
      bgClass: 'bg-[#F0FDF4]',
      borderClass: 'border-emerald-200',
      badgeClass: 'bg-emerald-100 text-emerald-900',
    },
    {
      id: 'lessons',
      name: 'Lesson Plans',
      hindiName: 'कक्षा पाठ योजना',
      count: '15 Plans',
      size: '6 MB',
      icon: <Calendar size={20} className="text-purple-700" />,
      bgClass: 'bg-[#FAF5FF]',
      borderClass: 'border-purple-200',
      badgeClass: 'bg-purple-100 text-purple-900',
    },
    {
      id: 'audio',
      name: 'Piper Audio Packs',
      hindiName: 'आवाज़ मॉडल व गीत',
      count: '5 Voice Models',
      size: '180 MB',
      icon: <Volume2 size={20} className="text-rose-700" />,
      bgClass: 'bg-[#FFF1F2]',
      borderClass: 'border-rose-200',
      badgeClass: 'bg-rose-100 text-rose-900',
    },
    {
      id: 'languages',
      name: 'Language Packs',
      hindiName: 'शब्दावली कोष',
      count: '4 Regional Dicts',
      size: '95 MB',
      icon: <Languages size={20} className="text-blue-800" />,
      bgClass: 'bg-[#EFF6FF]',
      borderClass: 'border-blue-200',
      badgeClass: 'bg-blue-100 text-blue-900',
    },
    {
      id: 'illustrations',
      name: 'Illustration Packs',
      hindiName: 'सोहराय व पशु चित्र',
      count: '60 Vector SVGs',
      size: '12 MB',
      icon: <Image size={20} className="text-emerald-800" />,
      bgClass: 'bg-[#ECFDF5]',
      borderClass: 'border-emerald-200',
      badgeClass: 'bg-emerald-100 text-emerald-900',
    },
    {
      id: 'videos',
      name: 'Micro-Learning Videos',
      hindiName: 'छोटे शिक्षण वीडियो',
      count: '8 Offline MP4s',
      size: '320 MB',
      icon: <Video size={20} className="text-amber-800" />,
      bgClass: 'bg-[#FEFCE8]',
      borderClass: 'border-yellow-200',
      badgeClass: 'bg-yellow-100 text-yellow-900',
    },
  ];

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-extrabold text-slate-900 font-baloo">
          Offline Library Sections
        </h3>
        <span className="text-xs text-slate-500 font-medium">
          8 Offline Media Categories
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        {sections.map((sec) => {
          const isSelected = activeSection === sec.id;
          return (
            <motion.button
              key={sec.id}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.96 }}
              type="button"
              onClick={() => onSelectSection(sec.id)}
              className={`p-4 rounded-2xl text-left border transition-all cursor-pointer shadow-2xs ${
                sec.bgClass
              } ${sec.borderClass} ${
                isSelected ? 'ring-2 ring-blue-500 shadow-sm scale-101' : 'hover:shadow-xs'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 rounded-xl bg-white shadow-2xs">
                  {sec.icon}
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${sec.badgeClass}`}>
                  {sec.size}
                </span>
              </div>
              <h4 className="text-sm font-extrabold text-slate-900 font-baloo">
                {sec.name}
              </h4>
              <p className="text-xs font-semibold text-slate-700 font-devanagari">
                {sec.hindiName}
              </p>
              <span className="text-[11px] text-slate-500 font-medium block pt-1">
                {sec.count}
              </span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};
