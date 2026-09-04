import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  TeacherProfileCard,
  ClassroomOverview,
  StudentList,
  ClassroomAnalytics,
  ClassroomRewards,
  TeacherSettingsForm,
} from '../components/profile';
import { Toast, type ToastType } from '../components/ui/Toast';
import { useAuthStore } from '../services/authStore';
import { LogOut, UserCheck, Star, Award, Sparkles } from 'lucide-react';

export const Profile: React.FC = () => {
  const navigate = useNavigate();
  const { user, role, logout } = useAuthStore();
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);

  const showToast = (message: string, type: ToastType = 'success') => {
    setToast({ message, type });
  };

  const handleLogout = async () => {
    await logout();
    showToast('Signed out of classroom session.', 'info');
    navigate('/login');
  };

  const isTeacher = role === 'teacher' || (!role && true);
  const teacherData = user && user.role === 'teacher' ? user : null;
  const studentData = user && user.role === 'student' ? user : null;

  return (
    <div className="min-h-full bg-[#FFFDF7] -m-4 sm:-m-6 lg:-m-8 p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8 font-sans antialiased text-slate-800">
      {/* TOP SESSION BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-white border border-[#F1EFE8] shadow-2xs">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
          <UserCheck size={16} className="text-emerald-600" />
          <span>Active Session: <strong className="text-slate-900">{user?.role === 'teacher' ? teacherData?.displayName : studentData?.name || 'Sangeeta Soren'}</strong> ({user?.role === 'student' ? 'Student Mode' : 'Teacher Mode'})</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => navigate('/login')}
            className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold cursor-pointer transition-colors"
          >
            Switch Account
          </button>
          <button
            type="button"
            onClick={handleLogout}
            className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors"
          >
            <LogOut size={13} />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* 1. TEACHER OR STUDENT PROFILE HERO CARD */}
      {isTeacher ? (
        <TeacherProfileCard
          name={teacherData?.displayName || 'Sangeeta Soren'}
          role={teacherData?.isFLNMentor ? 'MTB-MLE Senior FLN Mentor' : 'Senior Language Teacher'}
          school={teacherData?.schoolName || 'GPS Dumka Tribal Primary School'}
          district={teacherData?.district || 'Dumka'}
          block={teacherData?.block || 'Ranishwar Block'}
          village={teacherData?.village || 'Barmasia Village'}
          level={teacherData?.level || 8}
          xp={teacherData?.xp || 2450}
        />
      ) : (
        <div className="rounded-[24px] bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100/50 border border-amber-200 p-6 sm:p-8 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
            <div className="text-6xl p-3 rounded-2xl bg-white shadow-xs">
              {studentData?.avatarEmoji || '👦'}
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-200 text-amber-950">
                  {studentData?.grade || 'Grade 2'}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-900 border border-emerald-300">
                  {studentData?.motherTongue || 'Santali'}
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-baloo">
                {studentData?.name || 'Ravi Marandi'}
              </h2>
              <p className="text-sm font-semibold text-slate-600 font-devanagari">
                {studentData?.nativeScript || 'ᱨᱚᱵᱤ ᱢᱟᱨᱟᱱᱰᱤ'} • {studentData?.schoolName || 'GPS Dumka'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 pt-2">
            <div className="p-3 rounded-xl bg-white border border-amber-200 text-center">
              <div className="flex items-center justify-center gap-1 text-amber-600 font-black text-lg">
                <Star size={18} className="fill-amber-500 text-amber-500" />
                <span>{studentData?.stars || 48}</span>
              </div>
              <span className="text-[11px] font-bold text-slate-500">Stars Earned</span>
            </div>

            <div className="p-3 rounded-xl bg-white border border-amber-200 text-center">
              <div className="flex items-center justify-center gap-1 text-purple-600 font-black text-lg">
                <Award size={18} />
                <span>{studentData?.xp || 1240}</span>
              </div>
              <span className="text-[11px] font-bold text-slate-500">Total XP</span>
            </div>

            <div className="p-3 rounded-xl bg-white border border-amber-200 text-center">
              <div className="flex items-center justify-center gap-1 text-orange-600 font-black text-lg">
                <Sparkles size={18} />
                <span>{studentData?.streakDays || 12}d</span>
              </div>
              <span className="text-[11px] font-bold text-slate-500">Day Streak</span>
            </div>
          </div>
        </div>
      )}

      {/* 2. CLASSROOM COHORT OVERVIEW (28 STUDENTS, ATTENDANCE, METRICS) */}
      <ClassroomOverview
        studentCount={28}
        grades="Grade 1 & Grade 2 MTB-MLE"
        attendanceRate={94}
        vocabProgress={78}
        readingProgress={82}
        worksheetsCompleted={42}
      />

      {/* 3. INDIVIDUAL STUDENT MASTERY LIST & BADGES */}
      <StudentList />

      {/* 4. CLASSROOM FLN ANALYTICS & GROWTH */}
      <ClassroomAnalytics />

      {/* 5. CLASSROOM REWARDS, BADGES & MERIT CERTIFICATES */}
      <ClassroomRewards />

      {/* 6. TEACHER PREFERENCES & AI SETTINGS FORM */}
      <TeacherSettingsForm
        onSaveSettings={() => showToast('Classroom preferences saved for Dumka tablet!', 'success')}
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

export default Profile;
