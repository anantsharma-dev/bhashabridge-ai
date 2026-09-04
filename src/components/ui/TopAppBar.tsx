import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Wifi, WifiOff, Globe, Bell, Sparkles } from 'lucide-react';
import { useThemeStore } from './themeStore';
import { useAuthStore } from '../../services/authStore';
import type { TeacherProfile, StudentProfile } from '../../types/auth';
import { cn } from '../../utils/utils';
import { topAppBarTokens } from './theme';

export interface TopAppBarProps {
  teacherName?: string;
  schoolName?: string;
  avatarLetter?: string;
  className?: string;
}

export const TopAppBar: React.FC<TopAppBarProps> = ({
  teacherName = 'Sangeeta Soren',
  schoolName = 'GPS Dumka Tribal School',
  avatarLetter = 'S',
  className,
}) => {
  const navigate = useNavigate();
  const { isOffline, currentLanguage, setCurrentLanguage } = useThemeStore();
  const { user, role } = useAuthStore();

  const isStudent = role === 'student';
  const studentUser = isStudent ? (user as StudentProfile | null) : null;
  const teacherUser = !isStudent ? (user as TeacherProfile | null) : null;

  const displayName = isStudent
    ? studentUser?.name || 'Ravi Marandi'
    : teacherUser?.displayName || teacherName;

  const displaySchool = isStudent
    ? studentUser?.schoolName || schoolName
    : teacherUser?.schoolName || schoolName;

  const displayAvatar = isStudent
    ? studentUser?.avatarEmoji || '👦'
    : (teacherUser?.displayName?.[0] || avatarLetter).toUpperCase();

  const languages = [
    { code: 'santhali', label: 'ᱥᱟᱱᱛᱟᱲᱤ', sub: 'Santhali' },
    { code: 'ho', label: 'Warang Citi', sub: 'Ho' },
    { code: 'mundari', label: 'ᱢᱩᱱᱰᱟᱨᱤ', sub: 'Mundari' },
  ] as const;

  return (
    <header className={cn(topAppBarTokens.header, className)}>
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
        {/* Left: Brand / Teacher Profile Badge */}
        <div
          onClick={() => navigate('/profile')}
          className="flex items-center gap-3 cursor-pointer group select-none"
          title="View Profile & Classroom"
        >
          <div className="relative">
            <div className={cn(topAppBarTokens.avatar, 'group-hover:scale-105 transition-transform')}>
              {displayAvatar}
            </div>
            <span
              className={cn(
                'absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-white',
                isOffline ? 'bg-amber-500' : 'bg-emerald-500'
              )}
            />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm md:text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors font-heading leading-tight">
                {displayName}
              </h2>
              <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                {isStudent ? (
                  <>⭐ {studentUser?.stars || 48} Stars</>
                ) : (
                  <><Sparkles size={10} /> FLN Mentor</>
                )}
              </span>
            </div>
            <p className="text-xs text-slate-500 leading-tight">
              {displaySchool}
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

          {/* Settings / Profile link */}
          <button
            type="button"
            onClick={() => navigate('/settings')}
            className={cn(topAppBarTokens.iconButton)}
            title="Classroom Settings"
          >
            <Bell size={18} className="text-slate-600" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-500" />
          </button>
        </div>
      </div>
    </header>
  );
};

