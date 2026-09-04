import React from 'react';
import { motion } from 'framer-motion';
import { Wifi, WifiOff, Moon, Sun, Globe, Bell, Sparkles } from 'lucide-react';
import { useThemeStore } from './themeStore';
import { cn } from '../../utils/utils';
import { topAppBarTokens, motionPresets } from './theme';

export interface TopAppBarProps {
  teacherName?: string;
  schoolName?: string;
  avatarLetter?: string;
  className?: string;
}

export const TopAppBar: React.FC<TopAppBarProps> = ({
  teacherName = 'Sangeeta Soren',
  schoolName = 'GPS Dumka, Jharkhand',
  avatarLetter = 'S',
  className,
}) => {
  const { isDark, toggleDark, isOffline, currentLanguage, setCurrentLanguage } = useThemeStore();

  const languages = [
    { code: 'santhali', label: 'ᱥᱟᱱᱛᱟᱲᱤ', sub: 'Santhali' },
    { code: 'ho', label: 'Warang Citi', sub: 'Ho' },
    { code: 'mundari', label: 'ᱢᱩᱱᱰᱟᱨᱤ', sub: 'Mundari' },
  ] as const;

  return (
    <header className={cn(topAppBarTokens.header, className)}>
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
        {/* Left: Brand / Teacher Profile Badge */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className={topAppBarTokens.avatar}>
              {avatarLetter}
            </div>
            <span
              className={cn(
                'absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-white dark:border-slate-900',
                isOffline ? 'bg-amber-500' : 'bg-emerald-500'
              )}
            />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm md:text-base font-bold text-slate-900 dark:text-white font-heading leading-tight">
                {teacherName}
              </h2>
              <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                <Sparkles size={10} /> FLN Mentor
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-tight">
              {schoolName}
            </p>
          </div>
        </div>

        {/* Center: Language Quick Toggle Pill for Tablets */}
        <div className={topAppBarTokens.languagePill}>
          <span className="text-xs text-slate-400 pl-2 pr-1 flex items-center gap-1">
            <Globe size={13} /> Lang:
          </span>
          {languages.map((lang) => {
            const isSelected = currentLanguage === lang.code;
            return (
              <button
                key={lang.code}
                type="button"
                onClick={() => setCurrentLanguage(lang.code)}
                className={cn(
                  'px-3 py-1 rounded-xl text-xs font-semibold transition-all cursor-pointer',
                  isSelected
                    ? 'bg-white dark:bg-slate-900 text-primary-blue shadow-sm font-bold'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                )}
              >
                <span>{lang.sub}</span>
              </button>
            );
          })}
        </div>

        {/* Right: Offline Indicator, Theme Switch & Action Icons */}
        <div className="flex items-center gap-2 md:gap-3">
          {/* Offline / Online Badge */}
          <div
            className={cn(
              'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border transition-all',
              isOffline
                ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-800'
                : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800'
            )}
            title={isOffline ? 'Running on local offline models (Piper TTS & IndicTrans2)' : 'Connected to school network'}
          >
            {isOffline ? <WifiOff size={13} /> : <Wifi size={13} />}
            <span className="hidden sm:inline">
              {isOffline ? 'Offline Mode (Active)' : 'Online Synced'}
            </span>
          </div>

          {/* Dark Mode Toggle */}
          <motion.button
            type="button"
            whileTap={motionPresets.tap}
            onClick={toggleDark}
            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            className={topAppBarTokens.iconButton}
          >
            {isDark ? (
              <Sun size={18} className="text-amber-400" />
            ) : (
              <Moon size={18} className="text-slate-600" />
            )}
          </motion.button>

          {/* Notification Button */}
          <button
            type="button"
            className={cn(topAppBarTokens.iconButton, 'relative')}
          >
            <Bell size={18} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500" />
          </button>
        </div>
      </div>
    </header>
  );
};

