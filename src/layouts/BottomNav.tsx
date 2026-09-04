import { Link, useLocation } from 'react-router-dom';
import { Home, Mic, Languages, FileText, BookOpen, Settings } from 'lucide-react';
import { cn } from '../utils/utils';

const navItems = [
  { icon: Home, label: 'Home', path: '/dashboard' },
  { icon: Mic, label: 'Speak', path: '/translation/voice' },
  { icon: Languages, label: 'Translate', path: '/translation/text' },
  { icon: FileText, label: 'Materials', path: '/worksheets' },
  { icon: BookOpen, label: 'Library', path: '/offline-library' },
  { icon: Settings, label: 'Settings', path: '/settings' },
];

export const BottomNav = () => {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 px-4 py-2 flex justify-around items-center md:hidden z-50">
      {navItems.map((item) => {
        const isActive = location.pathname === item.path;
        const Icon = item.icon;

        return (
          <Link
            key={item.path}
            to={item.path}
            className={cn(
              'flex flex-col items-center gap-1 p-2 rounded-xl transition-all',
              isActive ? 'text-primary-blue' : 'text-slate-400'
            )}
          >
            <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
            <span className="text-[10px] font-medium">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
};
