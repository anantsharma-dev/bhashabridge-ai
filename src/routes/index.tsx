import { createBrowserRouter, Navigate } from 'react-router-dom';
import { MainLayout } from '../layouts/MainLayout';
import Dashboard from '../pages/Dashboard';
import VoiceTranslation from '../pages/VoiceTranslation';
import TextTranslation from '../pages/TextTranslation';
import Flashcards from '../pages/Flashcards';
import Worksheets from '../pages/Worksheets';
import LessonPlanner from '../pages/LessonPlanner';
import Stories from '../pages/Stories';
import OfflineLibrary from '../pages/OfflineLibrary';
import Settings from '../pages/Settings';
import Profile from '../pages/Profile';
import DesignSystemShowcase from '../pages/DesignSystemShowcase';
import SplashScreen from '../pages/SplashScreen';
import LanguageSelectionScreen from '../pages/LanguageSelectionScreen';
import LoginScreen from '../pages/LoginScreen';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },
      { path: 'dashboard', element: <Dashboard /> },
      { path: 'design-system', element: <DesignSystemShowcase /> },
      { path: 'translation/voice', element: <VoiceTranslation /> },
      { path: 'translation/text', element: <TextTranslation /> },
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
    element: <SplashScreen />,
  },
  {
    path: '/language-selection',
    element: <LanguageSelectionScreen />,
  },
  {
    path: '/login',
    element: <LoginScreen />,
  },
]);
