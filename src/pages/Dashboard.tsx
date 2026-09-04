import React from 'react';
import {
  HeroCard,
  LearningCard,
  ActivityCard,
  type ActivityItem,
  ProgressCard,
  DailyRewardsSection,
  TeacherQuickActions,
  CuteElephant,
  CountingBlocks,
  CuteMango,
  StoryBook,
} from '../components/ui';

export const Dashboard: React.FC = () => {
  // Today's Educational Activity Tiles (Duolingo ABC Style)
  const activities: ActivityItem[] = [
    {
      id: 'animals',
      title: 'Animals',
      hindiTitle: 'जानवर (हाथी, गाय, बकरी)',
      santhaliTitle: 'ᱡᱤᱵᱽ ᱡᱤᱭᱟᱹᱞᱤ (ᱦᱟᱹᱛᱤ, ᱰᱟᱝᱜᱽᱨᱟ)',
      subtitle: '12 new sounds & names',
      tag: 'Flashcards',
      illustration: <CuteElephant size={105} />,
      accentColor: '#F59E0B',
      bgColor: 'bg-[#FFFBEB]',
      borderColor: 'border-amber-200/80',
      buttonBg: '#F59E0B',
      route: '/flashcards',
    },
    {
      id: 'numbers',
      title: 'Numbers 1–20',
      hindiTitle: 'गिनती (एक, दो, तीन)',
      santhaliTitle: 'ᱮᱞ (ᱢᱤᱫ, ᱵᱟᱨ, ᱯᱮ)',
      subtitle: 'Count & match objects',
      tag: 'Math FLN',
      illustration: <CountingBlocks size={105} />,
      accentColor: '#2563EB',
      bgColor: 'bg-[#EFF6FF]',
      borderColor: 'border-blue-200/80',
      buttonBg: '#2563EB',
      route: '/flashcards',
    },
    {
      id: 'fruits',
      title: 'Sweet Fruits',
      hindiTitle: 'फल (आम, केला, अमरूद)',
      santhaliTitle: 'ᱡᱚ (ᱩᱞ, ᱠᱟᱭᱨᱟ)',
      subtitle: 'Sweet tastes & colors',
      tag: 'Vocabulary',
      illustration: <CuteMango size={105} />,
      accentColor: '#22C55E',
      bgColor: 'bg-[#F0FDF4]',
      borderColor: 'border-emerald-200/80',
      buttonBg: '#22C55E',
      route: '/flashcards',
    },
    {
      id: 'stories',
      title: 'Folk Stories',
      hindiTitle: 'लोक कथाएँ (चालाक लोमड़ी)',
      santhaliTitle: 'ᱠᱟᱹᱦᱱᱤ (ᱛᱟᱹᱨᱩᱵ ᱟᱨ ᱪᱮᱬᱮ)',
      subtitle: 'Traditional Dumka tales',
      tag: 'Read Along',
      illustration: <StoryBook size={105} />,
      accentColor: '#8B5CF6',
      bgColor: 'bg-[#FAF5FF]',
      borderColor: 'border-purple-200/80',
      buttonBg: '#8B5CF6',
      route: '/stories',
    },
  ];

  return (
    <div className="min-h-full bg-[#FFFDF7] -m-4 sm:-m-6 lg:-m-8 p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8 font-sans antialiased text-slate-800">
      {/* Dynamic Font Loader for Baloo 2 Headings & Regional Scripts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Baloo+2:wght@500;600;700;800&family=Noto+Sans+Devanagari:wght@400;500;600;700&family=Noto+Sans+Ol+Chiki:wght@400;600;700&display=swap');
        .font-baloo {
          font-family: 'Baloo 2', 'Poppins', cursive, sans-serif;
        }
        .font-devanagari {
          font-family: 'Noto Sans Devanagari', system-ui, sans-serif;
        }
        .font-olchiki {
          font-family: 'Noto Sans Ol Chiki', system-ui, sans-serif;
        }
      `}</style>

      {/* SECTION 1: TOP GREETING HERO CARD */}
      <HeroCard />

      {/* SECTION 2: CONTINUE LEARNING CARD */}
      <LearningCard
        title="Animals in Hindi & Santhali"
        hindiTitle="वन्य एवं घरेलू पशु (गाय, बकरी, हाथी, बाघ)"
        santhaliTitle="ᱵᱤᱨ ᱟᱨ ᱚᱲᱟᱜ ᱡᱤᱵᱽ ᱡᱤᱭᱟᱹᱞᱤ (Bir ar orag jib jiyali)"
        duration="12 mins"
        progressPercent={75}
        wordsMastered="12 of 16 Words Mastered"
        targetLink="/flashcards"
      />

      {/* SECTION 3: TODAY'S ACTIVITIES (Duolingo ABC Style 4 Lesson Tiles) */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#FEF3C7] text-amber-900 border border-amber-300">
                Interactive Modules
              </span>
              <span className="text-xs font-medium text-slate-500">
                Grade 1–2 Classroom Lessons
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-baloo">
              Today's Activities
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            Bilingual visual cards & multi-sensory lessons
          </p>
        </div>

        {/* 4 Colorful Activity Cards Grid: Tablet landscape 4 cols, tablet portrait 2 cols, mobile 1 col */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {activities.map((activity) => (
            <ActivityCard key={activity.id} activity={activity} />
          ))}
        </div>
      </section>

      {/* SECTION 4: NIPUN BHARAT PROGRESS CARD */}
      <ProgressCard />

      {/* SECTION 5: DAILY REWARDS SECTION */}
      <DailyRewardsSection />

      {/* SECTION 6: TEACHER QUICK ACTIONS */}
      <TeacherQuickActions />
    </div>
  );
};

export default Dashboard;
