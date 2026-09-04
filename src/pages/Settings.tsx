import React, { useState } from 'react';
import { TeacherSettingsForm, TeacherProfileCard } from '../components/profile';
import { Toast, type ToastType } from '../components/ui/Toast';
import { useAuthStore } from '../services/authStore';

export const Settings: React.FC = () => {
  const { user } = useAuthStore();
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);

  const showToast = (message: string, type: ToastType = 'success') => {
    setToast({ message, type });
  };

  const teacherData = user && user.role === 'teacher' ? user : null;

  return (
    <div className="min-h-full bg-[#FFFDF7] -m-4 sm:-m-6 lg:-m-8 p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8 font-sans antialiased text-slate-800">
      {/* Teacher Profile Summary */}
      <TeacherProfileCard
        name={teacherData?.displayName || 'Sangeeta Soren'}
        role={teacherData?.isFLNMentor ? 'MTB-MLE Senior Language Mentor' : 'Primary Language Teacher'}
        school={teacherData?.schoolName || 'GPS Dumka Tribal Primary School'}
        district={teacherData?.district || 'Dumka'}
        block={teacherData?.block || 'Ranishwar Block'}
        village={teacherData?.village || 'Barmasia Village'}
        level={teacherData?.level || 8}
        xp={teacherData?.xp || 2450}
      />

      {/* Teacher Settings Configuration Form */}
      <TeacherSettingsForm
        onSaveSettings={() => showToast('Classroom preferences and offline models saved successfully!', 'success')}
      />

      {/* TOAST FEEDBACK */}
      <Toast
        message={toast?.message ?? null}
        type={toast?.type ?? 'success'}
        onClose={() => setToast(null)}
      />
    </div>
  );
};

export default Settings;
