import React from 'react';
import {
  TeacherProfileCard,
  ClassroomOverview,
  StudentList,
  ClassroomAnalytics,
  ClassroomRewards,
} from '../components/profile';

export const Profile: React.FC = () => {
  return (
    <div className="min-h-full bg-[#FFFDF7] -m-4 sm:-m-6 lg:-m-8 p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8 font-sans antialiased text-slate-800">
      {/* 1. TEACHER PROFILE HERO CARD */}
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
    </div>
  );
};

export default Profile;
