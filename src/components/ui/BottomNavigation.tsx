import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Mic, Languages, FileText, Sparkles, Settings } from 'lucide-react';
import { cn } from '../../utils/utils';
import { bottomNavTokens, motionPresets } from './theme';

export interface NavItem {
  icon: React.ElementType;
  label: string;
  path: string;
  badge?: string | number;
  highlight?: boolean;
}

const defaultNavItems: NavItem[] = [
  { icon: Home, label: 'Home', path: '/dashboard' },
  { icon: Mic, label: 'Voice', path: '/translation/voice', highlight: true },
  { icon: Languages, label: 'Translate', path: '/translation/text' },
  { icon: FileText, label: 'Worksheets', path: '/worksheets' },
  { icon: Sparkles, label: 'Planner', path: '/lesson-planner' },
  { icon: Settings, label: 'Settings', path: '/settings' },
];

export interface BottomNavigationProps {
  items?: NavItem[];
  className?: string;
}

export const BottomNavigation: React.FC<BottomNavigationProps> = ({
  items = defaultNavItems,
  className,
}) => {
  const location = useLocation();

  return (
    <nav className={cn(bottomNavTokens.container, className)}>
      <div className={bottomNavTokens.innerWrapper}>
        {items.map((item) => {
          const isActive = location.pathname.startsWith(item.path);
          const Icon = item.icon;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                bottomNavTokens.item,
                isActive
                  ? 'text-primary-blue dark:text-blue-400 font-bold'
                  : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'
              )}
            >
              {/* Active Background Pill Indicator */}
              {isActive && (
                <motion.div
                  layoutId="bottomNavIndicator"
                  className={bottomNavTokens.activeIndicator}
                  transition={motionPresets.spring}
                />
              )}

              {/* Icon with subtle bounce on active */}
              <motion.div
                whileTap={motionPresets.tap}
                className={cn(
                  'relative p-1 rounded-xl',
                  item.highlight && 'text-primary-blue'
                )}
              >
                <Icon
                  size={22}
                  strokeWidth={isActive ? 2.5 : 2}
                  className={cn(isActive && 'scale-105 transition-transform')}
                />
                {item.badge && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </motion.div>

              <span className={bottomNavTokens.label}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

