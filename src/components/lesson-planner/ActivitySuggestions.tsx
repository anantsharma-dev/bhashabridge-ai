import React from 'react';
import { motion } from 'framer-motion';
import { Gamepad2, Music, Palette, Mic, Users2, Trees, BookOpen } from 'lucide-react';

export interface ActivitySuggestionItem {
  id: string;
  type: string;
  title: string;
  hindiTitle: string;
  description: string;
  icon: React.ReactNode;
  bgClass: string;
  borderClass: string;
  badgeClass: string;
}

export interface ActivitySuggestionsProps {
  className?: string;
}

export const ActivitySuggestions: React.FC<ActivitySuggestionsProps> = ({ className = '' }) => {
  const suggestions: ActivitySuggestionItem[] = [
    {
      id: 'game',
      type: 'Classroom Game',
      title: 'Animal Sound Mimic',
      hindiTitle: 'पशु आवाज़ व पहचान खेल',
      description: 'Children imitate an animal and classmates guess in Santali and Hindi.',
      icon: <Gamepad2 size={20} className="text-amber-700" />,
      bgClass: 'bg-[#FFFBEB]',
      borderClass: 'border-amber-200',
      badgeClass: 'bg-amber-100 text-amber-900',
    },
    {
      id: 'song',
      type: 'Traditional Song',
      title: 'Santhali Birds Rhyme',
      hindiTitle: 'ᱥᱮᱨᱢᱟ ᱨᱮ ᱪᱮᱬᱮ ᱩᱰᱟᱹᱣᱜ-ᱟ',
      description: 'Rhythmic action song with hand gestures mimicking birds flying over Dumka hills.',
      icon: <Music size={20} className="text-blue-700" />,
      bgClass: 'bg-[#EFF6FF]',
      borderClass: 'border-blue-200',
      badgeClass: 'bg-blue-100 text-blue-900',
    },
    {
      id: 'drawing',
      type: 'Drawing & Art',
      title: 'Sohrai Animal Painting',
      hindiTitle: 'पारंपरिक सोहराय पशु चित्रकारी',
      description: 'Draw favorite domestic animal with simple geometric Sohrai border patterns.',
      icon: <Palette size={20} className="text-emerald-700" />,
      bgClass: 'bg-[#F0FDF4]',
      borderClass: 'border-emerald-200',
      badgeClass: 'bg-emerald-100 text-emerald-900',
    },
    {
      id: 'speaking',
      type: 'Speaking Dialogue',
      title: 'Classroom Pair Dialogue',
      hindiTitle: 'युगल संवाद अभ्यास',
      description: '"Am do okoy?" (Who are you?) - "Inj do hati!" (I am elephant!).',
      icon: <Mic size={20} className="text-purple-700" />,
      bgClass: 'bg-[#FAF5FF]',
      borderClass: 'border-purple-200',
      badgeClass: 'bg-purple-100 text-purple-900',
    },
    {
      id: 'pair',
      type: 'Pair Activity',
      title: 'Card Flash Exchange',
      hindiTitle: 'कार्ड विनिमय गतिविधि',
      description: 'Partners show each other Ol Chiki flashcards and quiz the pronunciation.',
      icon: <Users2 size={20} className="text-rose-700" />,
      bgClass: 'bg-[#FFF1F2]',
      borderClass: 'border-rose-200',
      badgeClass: 'bg-rose-100 text-rose-900',
    },
    {
      id: 'outdoor',
      type: 'Outdoor Activity',
      title: 'Sal Forest Nature Walk',
      hindiTitle: 'विद्यालय प्रांगण प्रकृति भ्रमण',
      description: 'Walk around school courtyard identifying leaves, birds, and insects in mother tongue.',
      icon: <Trees size={20} className="text-emerald-800" />,
      bgClass: 'bg-[#ECFDF5]',
      borderClass: 'border-emerald-200',
      badgeClass: 'bg-emerald-100 text-emerald-900',
    },
    {
      id: 'story',
      type: 'Storytelling',
      title: 'Grandmother Folktale Circle',
      hindiTitle: 'दादी-नानी की लोककथा चक्र',
      description: 'Interactive storytelling about the loyal dog and tribal hunter.',
      icon: <BookOpen size={20} className="text-amber-800" />,
      bgClass: 'bg-[#FEFCE8]',
      borderClass: 'border-yellow-200',
      badgeClass: 'bg-yellow-100 text-yellow-900',
    },
  ];

  return (
    <div
      className={`rounded-[24px] bg-white border border-[#F1EFE8] p-6 sm:p-7 shadow-[0_4px_20px_rgba(0,0,0,0.04)] space-y-4 ${className}`}
    >
      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
        <div>
          <h3 className="text-lg font-extrabold text-slate-900 font-baloo">
            AI Pedagogical Activity Suggestions
          </h3>
          <p className="text-xs text-slate-500 font-medium">
            Multi-sensory games, songs, drawing & tribal storytelling modules
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {suggestions.map((item) => (
          <motion.div
            key={item.id}
            whileHover={{ y: -2 }}
            className={`p-4 rounded-2xl border ${item.bgClass} ${item.borderClass} space-y-2 shadow-2xs`}
          >
            <div className="flex items-center justify-between">
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${item.badgeClass}`}>
                {item.type}
              </span>
              <div className="p-1.5 rounded-xl bg-white shadow-2xs">
                {item.icon}
              </div>
            </div>

            <div className="space-y-0.5">
              <h4 className="text-sm font-extrabold text-slate-900 font-baloo">
                {item.title}
              </h4>
              <p className="text-xs font-semibold text-slate-700 font-devanagari">
                {item.hindiTitle}
              </p>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              {item.description}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
