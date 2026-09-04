import React from 'react';
import { motion } from 'framer-motion';

export interface StoryCategory {
  id: string;
  name: string;
  hindiName: string;
  santhaliName: string;
  emoji: string;
  count: number;
  bgColor: string;
  borderColor: string;
}

export interface StoryCategoryGridProps {
  activeCategory: string;
  onSelectCategory: (id: string) => void;
  className?: string;
}

export const StoryCategoryGrid: React.FC<StoryCategoryGridProps> = ({
  activeCategory = 'folk',
  onSelectCategory,
  className = '',
}) => {
  const categories: StoryCategory[] = [
    {
      id: 'folk',
      name: 'Jharkhand Folk Tales',
      hindiName: 'झारखंड की पारंपरिक लोककथाएँ',
      santhaliName: 'ᱥᱟᱱᱛᱟᱲᱤ ᱠᱟᱹᱦᱱᱤ',
      emoji: '🪕',
      count: 14,
      bgColor: 'bg-[#FFF7ED]',
      borderColor: 'border-amber-200',
    },
    {
      id: 'birsa',
      name: 'Birsa Munda & Heroes',
      hindiName: 'धरती आबा बिरसा मुंडा',
      santhaliName: 'ᱵᱤᱨᱥᱟᱹ ᱢᱩᱱᱰᱟ',
      emoji: '🏹',
      count: 8,
      bgColor: 'bg-[#EFF6FF]',
      borderColor: 'border-blue-200',
    },
    {
      id: 'panchatantra',
      name: 'Panchatantra Stories',
      hindiName: 'पंचतंत्र की प्रेरक कथाएँ',
      santhaliName: 'ᱯᱚᱧᱪᱚᱛᱚᱱᱛᱨᱚ',
      emoji: '🦊',
      count: 12,
      bgColor: 'bg-[#FAF5FF]',
      borderColor: 'border-purple-200',
    },
    {
      id: 'nature',
      name: 'Nature & Forest Tales',
      hindiName: 'जंगल, पहाड़ और नदियाँ',
      santhaliName: 'ᱥᱤᱨᱡᱚᱱ ᱟᱨ ᱵᱤᱨ',
      emoji: '🌲',
      count: 10,
      bgColor: 'bg-[#F0FDF4]',
      borderColor: 'border-emerald-200',
    },
    {
      id: 'alphabet',
      name: 'Alphabet Stories',
      hindiName: 'वर्णमाला अक्षर कथाएँ',
      santhaliName: 'ᱚᱞ ᱪᱤᱠᱤ ᱠᱟᱹᱦᱱᱤ',
      emoji: '🔤',
      count: 16,
      bgColor: 'bg-[#FEFCE8]',
      borderColor: 'border-yellow-200',
    },
    {
      id: 'festivals',
      name: 'Festival Stories',
      hindiName: 'सोहराय और करम पूजा',
      santhaliName: 'ᱯᱟᱨᱟᱵᱽ ᱠᱟᱹᱦᱱᱤ',
      emoji: '🎉',
      count: 6,
      bgColor: 'bg-[#FFF1F2]',
      borderColor: 'border-rose-200',
    },
    {
      id: 'moral',
      name: 'Moral Stories',
      hindiName: 'सच्चाई और अच्छाई की सीख',
      santhaliName: 'ᱵᱷᱟᱹᱜᱤ ᱠᱟᱛᱷᱟ',
      emoji: '🌱',
      count: 9,
      bgColor: 'bg-[#F1F5F9]',
      borderColor: 'border-slate-200',
    },
    {
      id: 'animals',
      name: 'Animal Friends',
      hindiName: 'पशु-पक्षियों की कहानियाँ',
      santhaliName: 'ᱡᱤᱵᱽ ᱡᱤᱭᱟᱹᱞᱤ ᱠᱟᱹᱦᱱᱤ',
      emoji: '🐘',
      count: 15,
      bgColor: 'bg-[#FFFBEB]',
      borderColor: 'border-amber-200',
    },
  ];

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-extrabold text-slate-900 font-baloo">
          Story Categories
        </h3>
        <span className="text-xs text-slate-500 font-medium">
          Culturally Grounded MTB-MLE Reading Library
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        {categories.map((cat) => {
          const isSelected = activeCategory === cat.id;
          return (
            <motion.button
              key={cat.id}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.96 }}
              type="button"
              onClick={() => onSelectCategory(cat.id)}
              className={`p-3.5 rounded-2xl text-left border transition-all cursor-pointer shadow-2xs ${
                cat.bgColor
              } ${cat.borderColor} ${
                isSelected ? 'ring-2 ring-blue-500 shadow-sm scale-101' : 'hover:shadow-xs'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-2xl">{cat.emoji}</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/90 text-slate-700">
                  {cat.count} Stories
                </span>
              </div>
              <h4 className="text-sm font-extrabold text-slate-900 font-baloo leading-tight">
                {cat.name}
              </h4>
              <p className="text-xs font-semibold text-slate-700 font-devanagari truncate">
                {cat.hindiName}
              </p>
              <p className="text-[10px] font-semibold text-slate-500 font-olchiki truncate">
                {cat.santhaliName}
              </p>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};
