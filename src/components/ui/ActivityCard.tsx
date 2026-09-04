import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Play } from 'lucide-react';

export interface ActivityItem {
  id: string;
  title: string;
  hindiTitle: string;
  santhaliTitle?: string;
  subtitle: string;
  illustration: React.ReactNode;
  accentColor: string; // e.g. '#F59E0B'
  bgColor: string; // pastel tint e.g. '#FFFDF7'
  borderColor: string;
  buttonBg: string;
  route: string;
  tag: string;
}

export interface ActivityCardProps {
  activity: ActivityItem;
  className?: string;
}

export const ActivityCard: React.FC<ActivityCardProps> = ({
  activity,
  className = '',
}) => {
  return (
    <Link to={activity.route} className="block group select-none">
      <motion.div
        whileHover={{ y: -4 }}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.2 }}
        className={`rounded-[24px] p-5 sm:p-6 border transition-all flex flex-col justify-between h-full shadow-[0_4px_16px_rgba(0,0,0,0.03)] group-hover:shadow-md ${activity.bgColor} ${activity.borderColor} ${className}`}
      >
        {/* Top Tag & Header */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span
              className="text-[11px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full text-white shadow-xs"
              style={{ backgroundColor: activity.accentColor }}
            >
              {activity.tag}
            </span>
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: activity.accentColor }} />
          </div>

          {/* Centered Illustration Placeholder */}
          <div className="flex items-center justify-center py-2">
            <div className="transform group-hover:scale-105 transition-transform duration-200">
              {activity.illustration}
            </div>
          </div>

          {/* Titles */}
          <div className="text-center space-y-1">
            <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-baloo leading-tight">
              {activity.title}
            </h3>
            <p className="text-base font-bold text-slate-800 font-devanagari">
              {activity.hindiTitle}
            </p>
            {activity.santhaliTitle && (
              <p className="text-xs font-semibold text-slate-500 font-olchiki">
                {activity.santhaliTitle}
              </p>
            )}
            <p className="text-xs text-slate-500 font-medium pt-1">
              {activity.subtitle}
            </p>
          </div>
        </div>

        {/* Bottom Play Button (Min 48px height, rounded-2xl, tactile) */}
        <div className="pt-5">
          <div
            className="w-full min-h-[48px] rounded-2xl flex items-center justify-center gap-2 text-white font-bold text-sm shadow-sm transition-opacity group-hover:opacity-95"
            style={{ backgroundColor: activity.buttonBg }}
          >
            <Play size={16} className="fill-white" />
            <span>Start Activity</span>
          </div>
        </div>
      </motion.div>
    </Link>
  );
};
