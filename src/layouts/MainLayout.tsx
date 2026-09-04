import { Outlet, NavLink } from 'react-router-dom';
import { TopAppBar } from '../components/ui/TopAppBar';
import { BottomNavigation } from '../components/ui/BottomNavigation';
import {
  Home,
  Mic,
  Languages,
  BookMarked,
  FileText,
  BookOpen,
  Sparkles,
  Library,
  UserCheck,
  Settings,
  Layers,
  GraduationCap,
  HelpCircle,
} from 'lucide-react';
import { cn } from '../utils/utils';

const sidebarItems = [
  { icon: Home, label: 'Dashboard', path: '/dashboard' },
  { icon: Mic, label: 'Voice Translation', path: '/translation/voice' },
  { icon: Languages, label: 'Text Translation', path: '/translation/text' },
  { icon: BookMarked, label: 'Flashcards', path: '/flashcards' },
  { icon: FileText, label: 'Worksheets', path: '/worksheets' },
  { icon: BookOpen, label: 'Stories', path: '/stories' },
  { icon: Sparkles, label: 'Lesson Planner', path: '/lesson-planner' },
  { icon: Library, label: 'Offline Library', path: '/offline-library' },
  { icon: GraduationCap, label: 'Classroom', path: '/classroom' },
  { icon: HelpCircle, label: 'Quizzes', path: '/quiz' },
  { icon: UserCheck, label: 'Teacher Profile', path: '/profile' },
  { icon: Settings, label: 'Settings', path: '/settings' },
  { icon: Layers, label: 'Design System', path: '/design-system' },
];

export const MainLayout = () => {
  return (
    <div className="min-h-screen bg-[#FFFDF7] text-slate-900 flex flex-col md:flex-row transition-colors">
      {/* Tablet Landscape & Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 lg:w-72 bg-white border-r border-[#F1EFE8] p-5 shrink-0 fixed top-0 bottom-0 left-0 z-30 justify-between shadow-xs overflow-y-auto">
        <div className="space-y-6">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3 px-2 py-1">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-primary-blue via-primary-purple to-primary-green flex items-center justify-center text-white font-bold text-xl shadow-md shadow-blue-500/20">
              <Sparkles size={20} />
            </div>
            <div>
              <h1 className="text-lg font-extrabold text-slate-900 dark:text-white font-heading leading-tight">
                BhashaBridge
              </h1>
              <p className="text-[10px] font-bold text-primary-blue dark:text-blue-400 tracking-wider uppercase">
                AI Teaching Assistant
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-3 px-3.5 py-3 rounded-2xl text-sm font-semibold transition-all select-none',
                      isActive
                        ? 'bg-blue-50 dark:bg-blue-950/50 text-primary-blue dark:text-blue-400 shadow-sm border border-blue-200/60 dark:border-blue-800/40'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-200'
                    )
                  }
                >
                  <Icon size={20} />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* FLN MTB-MLE Badge at bottom of sidebar */}
        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
              Jharkhand MTB-MLE
            </span>
            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
              FLN 2026
            </span>
          </div>
          <p className="text-[10px] text-slate-500 dark:text-slate-400">
            Hindi ↔ Santhali (Ol Chiki)
          </p>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col md:pl-64 lg:pl-72 pb-24 md:pb-8 min-w-0">
        <TopAppBar />
        <main className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>

      {/* Mobile / Tablet Portrait Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
};

