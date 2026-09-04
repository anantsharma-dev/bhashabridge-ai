import { createBrowserRouter, Navigate } from 'react-router-dom';
import { MainLayout } from '../layouts/MainLayout';
import Dashboard from '../pages/Dashboard';
import VoiceTranslation from '../pages/VoiceTranslation';
import Flashcards from '../pages/Flashcards';
import Worksheets from '../pages/Worksheets';
import LessonPlanner from '../pages/LessonPlanner';
import Stories from '../pages/Stories';
import OfflineLibrary from '../pages/OfflineLibrary';
import Settings from '../pages/Settings';
import Profile from '../pages/Profile';
import DesignSystemShowcase from '../pages/DesignSystemShowcase';

// Placeholder components for other pages
const Placeholder = ({ name }: { name: string }) => (
  <div className="flex items-center justify-center min-h-[60vh] flex-col space-y-4">
    <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200">{name} Page</h2>
    <p className="text-slate-500 dark:text-slate-400 italic">This screen is under development...</p>
  </div>
);

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },
      { path: 'dashboard', element: <Dashboard /> },
      { path: 'design-system', element: <DesignSystemShowcase /> },
      { path: 'translation/voice', element: <VoiceTranslation /> },
      { path: 'translation/text', element: <Placeholder name="Text Translation" /> },
      { path: 'worksheets', element: <Worksheets /> },
      { path: 'flashcards', element: <Flashcards /> },
      { path: 'stories', element: <Stories /> },
      { path: 'lesson-planner', element: <LessonPlanner /> },
      { path: 'offline-library', element: <OfflineLibrary /> },
      { path: 'settings', element: <Settings /> },
      { path: 'profile', element: <Profile /> },
    ],
  },
  {
    path: '/splash',
    element: <Placeholder name="Splash Screen" />,
  },
  {
    path: '/language-selection',
    element: <Placeholder name="Language Selection" />,
  },
]);
