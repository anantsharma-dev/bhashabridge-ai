import React from 'react';
import { motion } from 'framer-motion';

export interface CategoryItem {
  id: string;
  name: string;
  hindiName: string;
  santhaliName: string;
  iconEmoji: string;
  count: number;
  bgColor: string;
  borderColor: string;
  accentColor: string;
}

export interface CategorySelectorProps {
  activeCategory: string;
  onSelectCategory: (id: string) => void;
  className?: string;
}

export const CategorySelector: React.FC<CategorySelectorProps> = ({
  activeCategory = 'animals',
  onSelectCategory,
  className = '',
}) => {
  const categories: CategoryItem[] = [
    {
      id: 'animals',
      name: 'Animals',
      hindiName: 'जानवर',
      santhaliName: 'ᱡᱤᱵᱽ ᱡᱤᱭᱟᱹᱞᱤ',
      iconEmoji: '🐘',
      count: 16,
      bgColor: 'bg-[#FFF7ED]',
      borderColor: 'border-amber-200',
      accentColor: '#F59E0B',
    },
    {
      id: 'birds',
      name: 'Birds of Jharkhand',
      hindiName: 'झारखंड के पक्षी',
      santhaliName: 'ᱪᱮᱬᱮ',
      iconEmoji: '🦚',
      count: 12,
      bgColor: 'bg-[#EFF6FF]',
      borderColor: 'border-blue-200',
      accentColor: '#2563EB',
    },
    {
      id: 'fruits',
      name: 'Fruits',
      hindiName: 'फल',
      santhaliName: 'ᱡᱚ',
      iconEmoji: '🥭',
      count: 14,
      bgColor: 'bg-[#F0FDF4]',
      borderColor: 'border-emerald-200',
      accentColor: '#22C55E',
    },
    {
      id: 'vegetables',
      name: 'Vegetables',
      hindiName: 'सब्जियाँ',
      santhaliName: 'ᱩᱛᱩ ᱟᱲᱟᱜ',
      iconEmoji: '🥕',
      count: 15,
      bgColor: 'bg-[#FEFCE8]',
      borderColor: 'border-yellow-200',
      accentColor: '#CA8A04',
    },
    {
      id: 'body',
      name: 'Body Parts',
      hindiName: 'शरीर के अंग',
      santhaliName: 'ᱦᱚᱲᱢᱚ ᱦᱟᱹᱴᱤᱧ',
      iconEmoji: '👀',
      count: 18,
      bgColor: 'bg-[#FFF1F2]',
      borderColor: 'border-rose-200',
      accentColor: '#E11D48',
    },
    {
      id: 'family',
      name: 'Family',
      hindiName: 'परिवार',
      santhaliName: 'ᱜᱷᱟᱨᱚᱸᱡᱽ',
      iconEmoji: '👨‍👩‍👧',
      count: 12,
      bgColor: 'bg-[#FAF5FF]',
      borderColor: 'border-purple-200',
      accentColor: '#8B5CF6',
    },
    {
      id: 'nature',
      name: 'Nature',
      hindiName: 'प्रकृति व जंगल',
      santhaliName: 'ᱥᱤᱨᱡᱚᱱ',
      iconEmoji: '🌳',
      count: 16,
      bgColor: 'bg-[#F0FDF4]',
      borderColor: 'border-emerald-200',
      accentColor: '#16A34A',
    },
    {
      id: 'numbers',
      name: 'Numbers',
      hindiName: 'गिनती (1-20)',
      santhaliName: 'ᱮᱞ',
      iconEmoji: '🔢',
      count: 20,
      bgColor: 'bg-[#EFF6FF]',
      borderColor: 'border-blue-200',
      accentColor: '#2563EB',
    },
    {
      id: 'colors',
      name: 'Colors',
      hindiName: 'रंग',
      santhaliName: 'ᱨᱚᱝ',
      iconEmoji: '🎨',
      count: 10,
      bgColor: 'bg-[#FFFBEB]',
      borderColor: 'border-amber-200',
      accentColor: '#F59E0B',
    },
    {
      id: 'objects',
      name: 'Daily Objects',
      hindiName: 'दैनिक वस्तुएँ',
      santhaliName: 'ᱫᱤᱱᱟᱹᱢ ᱡᱤᱱᱤᱥ',
      iconEmoji: '🪑',
      count: 18,
      bgColor: 'bg-[#F1F5F9]',
      borderColor: 'border-slate-200',
      accentColor: '#475569',
    },
    {
      id: 'festivals',
      name: 'Festivals',
      hindiName: 'सोहराय व करम',
      santhaliName: 'ᱯᱟᱨᱟᱵᱽ',
      iconEmoji: '🪘',
      count: 8,
      bgColor: 'bg-[#FFF7ED]',
      borderColor: 'border-orange-200',
      accentColor: '#EA580C',
    },
    {
      id: 'school',
      name: 'School Objects',
      hindiName: 'विद्यालय की वस्तुएँ',
      santhaliName: 'ᱟᱥᱲᱟ ᱡᱤᱱᱤᱥ',
      iconEmoji: '🎒',
      count: 14,
      bgColor: 'bg-[#EFF6FF]',
      borderColor: 'border-blue-200',
      accentColor: '#0284C7',
    },
    {
      id: 'transport',
      name: 'Transportation',
      hindiName: 'वाहनों के नाम',
      santhaliName: 'ᱜᱟᱹᱰᱤ',
      iconEmoji: '🚌',
      count: 10,
      bgColor: 'bg-[#FEFCE8]',
      borderColor: 'border-yellow-200',
      accentColor: '#D97706',
    },
    {
      id: 'occupations',
      name: 'Occupations',
      hindiName: 'व्यवसाय व काम',
      santhaliName: 'ᱠᱟᱹᱢᱤ',
      iconEmoji: '🌾',
      count: 12,
      bgColor: 'bg-[#F0FDF4]',
      borderColor: 'border-emerald-200',
      accentColor: '#059669',
    },
  ];

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-extrabold text-slate-900 font-baloo">
          Vocabulary Categories
        </h3>
        <span className="text-xs text-slate-500 font-medium">
          14 Thematic Grade 1-5 Modules
        </span>
      </div>

      {/* Horizontal Scrollable Carousel for Categories */}
      <div className="flex items-center gap-3 overflow-x-auto pb-3 pt-1 no-scrollbar">
        {categories.map((cat) => {
          const isSelected = activeCategory === cat.id;
          return (
            <motion.button
              key={cat.id}
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.95 }}
              type="button"
              onClick={() => onSelectCategory(cat.id)}
              className={`rounded-[20px] p-3.5 min-w-[140px] text-left shrink-0 border transition-all cursor-pointer shadow-xs ${
                cat.bgColor
              } ${cat.borderColor} ${
                isSelected ? 'ring-3 ring-blue-400 shadow-md scale-102' : 'hover:shadow-sm'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl">{cat.iconEmoji}</span>
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-white/90 text-slate-700 border border-slate-200/60">
                  {cat.count}
                </span>
              </div>
              <h4 className="text-sm font-extrabold text-slate-900 font-baloo truncate">
                {cat.name}
              </h4>
              <p className="text-xs font-semibold text-slate-700 font-devanagari truncate">
                {cat.hindiName}
              </p>
              <p className="text-[11px] font-semibold text-slate-500 font-olchiki truncate">
                {cat.santhaliName}
              </p>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};
