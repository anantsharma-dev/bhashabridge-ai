import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Mic, FileText, BookOpen, Sparkles, ArrowUpRight } from 'lucide-react';

export interface QuickActionItem {
  id: string;
  title: string;
  hindiTitle: string;
  subtitle: string;
  route: string;
  icon: React.ReactNode;
  bgClass: string;
  borderClass: string;
  iconBgClass: string;
  textClass: string;
}

export interface TeacherQuickActionsProps {
  className?: string;
}

export const TeacherQuickActions: React.FC<TeacherQuickActionsProps> = ({
  className = '',
}) => {
  const actions: QuickActionItem[] = [
    {
      id: 'voice',
      title: 'Voice Translation',
      hindiTitle: 'ध्वनि अनुवाद',
      subtitle: 'Hindi ↔ Santhali speech',
      route: '/translation/voice',
      icon: <Mic size={22} className="text-blue-600" />,
      bgClass: 'bg-[#EFF6FF] hover:bg-[#DBEAFE]/80 active:bg-[#BFDBFE]',
      borderClass: 'border-blue-200/80',
      iconBgClass: 'bg-blue-100 text-blue-700',
      textClass: 'text-blue-950',
    },
    {
      id: 'worksheet',
      title: 'Create Worksheet',
      hindiTitle: 'कार्यपत्रक निर्माण',
      subtitle: 'Printable FLN exercises',
      route: '/worksheets',
      icon: <FileText size={22} className="text-emerald-600" />,
      bgClass: 'bg-[#F0FDF4] hover:bg-[#DCFCE7]/80 active:bg-[#BBF7D0]',
      borderClass: 'border-emerald-200/80',
      iconBgClass: 'bg-emerald-100 text-emerald-700',
      textClass: 'text-emerald-950',
    },
    {
      id: 'flashcards',
      title: 'Flashcards',
      hindiTitle: 'चित्र कार्ड',
      subtitle: 'Visual bilingual cards',
      route: '/flashcards',
      icon: <BookOpen size={22} className="text-amber-600" />,
      bgClass: 'bg-[#FFFBEB] hover:bg-[#FEF3C7]/80 active:bg-[#FDE68A]',
      borderClass: 'border-amber-200/80',
      iconBgClass: 'bg-amber-100 text-amber-700',
      textClass: 'text-amber-950',
    },
    {
      id: 'planner',
      title: 'Lesson Planner',
      hindiTitle: 'पाठ योजना',
      subtitle: 'AI multilingual planner',
      route: '/lesson-planner',
      icon: <Sparkles size={22} className="text-purple-600" />,
      bgClass: 'bg-[#FAF5FF] hover:bg-[#F3E8FF]/80 active:bg-[#E9D5FF]',
      borderClass: 'border-purple-200/80',
      iconBgClass: 'bg-purple-100 text-purple-700',
      textClass: 'text-purple-950',
    },
  ];

  return (
    <div
      className={`rounded-[24px] bg-white border border-[#F1EFE8] p-6 sm:p-7 shadow-[0_4px_20px_rgba(0,0,0,0.04)] space-y-6 ${className}`}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#EFF6FF] text-blue-800 border border-blue-200">
              Teacher Toolkit
            </span>
            <span className="text-xs font-medium text-slate-500">
              One-Tap Classroom Actions
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-baloo">
            Teacher Quick Actions
          </h2>
        </div>
        <p className="text-xs text-slate-500 font-medium">
          Instant tools for bilingual classroom activities
        </p>
      </div>

      {/* Grid of 4 Large Action Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {actions.map((action) => (
          <Link
            key={action.id}
            to={action.route}
            className="block group select-none focus:outline-hidden focus:ring-2 focus:ring-blue-400 rounded-2xl"
          >
            <motion.div
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.15 }}
              className={`min-h-[84px] p-4 sm:p-5 rounded-2xl border transition-all flex items-center justify-between gap-3 shadow-2xs ${action.bgClass} ${action.borderClass}`}
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-2xs ${action.iconBgClass}`}
                >
                  {action.icon}
                </div>
                <div className="space-y-0.5 min-w-0">
                  <h3 className={`text-base font-extrabold font-baloo truncate ${action.textClass}`}>
                    {action.title}
                  </h3>
                  <p className="text-xs font-semibold text-slate-600 font-devanagari truncate">
                    {action.hindiTitle}
                  </p>
                  <p className="text-[11px] text-slate-500 truncate">
                    {action.subtitle}
                  </p>
                </div>
              </div>

              <div className="shrink-0 w-8 h-8 rounded-full bg-white/80 flex items-center justify-center text-slate-400 group-hover:text-slate-800 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shadow-2xs">
                <ArrowUpRight size={16} />
              </div>
            </motion.div>
          </Link>
        ))}
      </div>
    </div>
  );
};
