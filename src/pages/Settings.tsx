import React from 'react';
import { TeacherSettingsForm, TeacherProfileCard } from '../components/profile';

export const Settings: React.FC = () => {
  return (
    <div className="min-h-full bg-[#FFFDF7] -m-4 sm:-m-6 lg:-m-8 p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8 font-sans antialiased text-slate-800">
      {/* Teacher Profile Summary */}
      <TeacherProfileCard
        name="Sangeeta Soren"
        role="MTB-MLE Senior Language Mentor"
        school="GPS Dumka Tribal Primary School"
        district="Dumka"
        block="Ranishwar Block"
        village="Barmasia Village"
        level={8}
        xp={2450}
      />

      {/* Teacher Settings Configuration Form */}
      <TeacherSettingsForm
        onSaveSettings={() => alert('Classroom preferences and offline models saved successfully!')}
      />
    </div>
  );
};

export default Settings;
