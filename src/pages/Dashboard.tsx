import React, { useState } from 'react';
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
import { useAuthStore } from '../services/authStore';
import { contentEngineService } from '../services/contentEngineService';
import { classroomService } from '../services/classroomService';
import { useCurriculumStore } from '../services/curriculum/curriculumStore';
import { JourneyMapView } from '../components/gamification/JourneyMapView';
import { ConfettiCelebration } from '../components/gamification/ConfettiCelebration';
import { Toast, type ToastType } from '../components/ui/Toast';
import {
  Sparkles,
  Wifi,
  RefreshCw,
  Volume2,
  Bell,
} from 'lucide-react';
import { speechSynthesisService } from '../services/speechSynthesis';

export const Dashboard: React.FC = () => {
  const { user } = useAuthStore();
  const { syncState, triggerSync, version } = useCurriculumStore();
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);

  const dailyWord = contentEngineService.getDailyWord();
  const dailyFact = contentEngineService.getDailyFact();
  const assignments = classroomService.getAssignments('JH-DUMKA-01');

  const studentUser = user && user.role === 'student' ? user : null;
  const currentXp = studentUser?.xp || (user && user.role === 'teacher' ? user.xp : 1240);

  const showToast = (message: string, type: ToastType = 'success') => {
    setToast({ message, type });
  };

  const handleSyncNow = async () => {
    showToast('Initiating differential sync with CRC Dumka Hub...', 'info');
    await triggerSync();
    showToast(`Classroom synced successfully! Active curriculum: ${version}`, 'success');
  };

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
      {showConfetti && <ConfettiCelebration onDone={() => setShowConfetti(false)} />}

      {/* Font styles */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Baloo+2:wght@500;600;700;800&family=Noto+Sans+Devanagari:wght@400;500;600;700&family=Noto+Sans+Ol+Chiki:wght@400;600;700&display=swap');
        .font-baloo { font-family: 'Baloo 2', 'Poppins', cursive, sans-serif; }
        .font-devanagari { font-family: 'Noto Sans Devanagari', system-ui, sans-serif; }
        .font-olchiki { font-family: 'Noto Sans Ol Chiki', system-ui, sans-serif; }
      `}</style>

      {/* OFFLINE SYNC STATUS BANNER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-2xl bg-emerald-50/80 border border-emerald-200 shadow-2xs">
        <div className="flex items-center gap-2.5">
          <span className="p-2 rounded-xl bg-emerald-100 text-emerald-800">
            <Wifi size={16} />
          </span>
          <div>
            <span className="text-xs font-extrabold text-emerald-950 block">
              100% Offline Classroom Ready • Version {version}
            </span>
            <p className="text-[11px] text-emerald-800 font-medium">
              All 14 Vocabulary Packs and Story Audio are cached on this Dumka tablet.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleSyncNow}
          className="self-start sm:self-auto px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-2xs cursor-pointer transition-colors"
        >
          <RefreshCw size={13} className={syncState === 'syncing' ? 'animate-spin' : ''} />
          <span>{syncState === 'syncing' ? 'Syncing...' : 'Sync CRC Updates'}</span>
        </button>
      </div>

      {/* SECTION 1: TOP GREETING HERO CARD */}
      <HeroCard />

      {/* SECTION 1B: DAILY TRILINGUAL WORD & CULTURAL FACT */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Daily Word */}
        <div className="p-5 rounded-[24px] bg-white border border-[#F1EFE8] shadow-2xs space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-100 text-amber-900 uppercase">
              Today's Word of the Day (ᱛᱮᱦᱮᱧᱟᱜ ᱟᱹᱲᱟᱹ)
            </span>
            <button
              type="button"
              onClick={() => speechSynthesisService.speak(dailyWord.wordHindi, 'hindi')}
              className="p-1 rounded-lg text-slate-400 hover:text-amber-600 cursor-pointer"
              title="Pronounce word"
            >
              <Volume2 size={16} />
            </button>
          </div>

          <div className="flex items-baseline gap-3">
            <h3 className="text-2xl font-black text-slate-900 font-baloo">
              {dailyWord.wordHindi}
            </h3>
            <span className="text-xl font-bold text-blue-700 font-olchiki">
              {dailyWord.wordSanthali}
            </span>
            <span className="text-xs font-semibold text-slate-500">
              ({dailyWord.wordLatin} • {dailyWord.wordEnglish})
            </span>
          </div>

          <p className="text-xs font-medium text-slate-600 leading-relaxed">
            <strong>Sentence:</strong> {dailyWord.sentenceHindi}
          </p>

          <div className="pt-1 text-[11px] text-amber-800 bg-amber-50/70 p-2.5 rounded-xl border border-amber-200">
            <strong>Cultural Fact:</strong> {dailyWord.culturalFact}
          </div>
        </div>

        {/* Daily Fact / Announcement */}
        <div className="p-5 rounded-[24px] bg-white border border-[#F1EFE8] shadow-2xs space-y-3 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-xl bg-purple-100 text-purple-900">
                <Sparkles size={14} />
              </span>
              <span className="text-xs font-black text-purple-950 uppercase">
                Jharkhand Heritage Insight
              </span>
            </div>
            <p className="text-sm font-semibold text-slate-800 leading-relaxed">
              {dailyFact}
            </p>
          </div>

          <div className="p-3 rounded-2xl bg-blue-50/70 border border-blue-200 flex items-center justify-between text-xs text-blue-900">
            <div className="flex items-center gap-2">
              <Bell size={14} className="text-blue-600" />
              <span>Tomorrow: Cattle Festival (Sohrai) Folk Story Reading</span>
            </div>
            <button
              type="button"
              onClick={() => {
                setShowConfetti(true);
                showToast('Milestone celebration triggered! 🌟', 'success');
              }}
              className="font-bold text-blue-700 hover:underline cursor-pointer"
            >
              Celebrate 🎉
            </button>
          </div>
        </div>
      </div>

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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {activities.map((activity) => (
            <ActivityCard key={activity.id} activity={activity} />
          ))}
        </div>
      </section>

      {/* SECTION 3B: HOMEWORK & RECENT CLASSROOM TASKS */}
      <div className="p-6 rounded-[24px] bg-white border border-[#F1EFE8] shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base sm:text-lg font-extrabold text-slate-900 font-baloo">
              Active Classroom Tasks & Homework
            </h3>
            <p className="text-xs text-slate-500">
              Assigned by Sangeeta Soren for GPS Dumka Primary Class
            </p>
          </div>
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900">
            {assignments.length} Pending
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {assignments.map((asg) => (
            <div
              key={asg.id}
              className="p-3.5 rounded-2xl bg-[#FFFDF7] border border-slate-200/80 flex items-center justify-between gap-3 text-xs"
            >
              <div className="space-y-0.5">
                <span className="text-[10px] font-bold text-purple-700 block">
                  {asg.subject} • Due {asg.dueDate}
                </span>
                <h4 className="font-extrabold text-slate-900">{asg.title}</h4>
                <p className="text-slate-500 text-[11px]">{asg.description}</p>
              </div>
              <button
                type="button"
                onClick={() => showToast(`Opening task: ${asg.title}`, 'info')}
                className="px-3 py-1.5 rounded-xl bg-blue-50 text-blue-800 border border-blue-200 font-bold hover:bg-blue-100 cursor-pointer shrink-0"
              >
                Start
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 4: NIPUN BHARAT PROGRESS CARD */}
      <ProgressCard />

      {/* SECTION 4B: FOREST JOURNEY MAP VIEW */}
      <JourneyMapView currentXp={currentXp} />

      {/* SECTION 5: DAILY REWARDS SECTION */}
      <DailyRewardsSection />

      {/* SECTION 6: TEACHER QUICK ACTIONS */}
      <TeacherQuickActions />

      {/* TOAST FEEDBACK */}
      <Toast
        message={toast?.message ?? null}
        type={toast?.type ?? 'success'}
        onClose={() => setToast(null)}
      />
    </div>
  );
};

export default Dashboard;
