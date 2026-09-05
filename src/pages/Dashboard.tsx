import React, { useState, useEffect } from 'react';
import {
  HeroCard,
  LearningCard,
  ActivityCard,
  type ActivityItem,
  ProgressCard,
  LeaderboardCard,
  DailyRewardsSection,
  TeacherQuickActions,
  QuizDashboardCard,
  CuteElephant,
  CountingBlocks,
  CuteMango,
  StoryBook,
} from '../components/ui';
import { useAuthStore } from '../services/authStore';
import { useAuth } from '../context/AuthContext';
import { useTeacher } from '../hooks/useTeacher';
import { useClassrooms } from '../hooks/useClassrooms';
import { useStudents } from '../hooks/useStudents';
import { useProgress } from '../hooks/useProgress';
import { studentProgressService } from '../services/studentProgressService';
import { contentEngineService } from '../services/contentEngineService';
import { useCurriculumStore } from '../services/curriculum/curriculumStore';
import { ALL_CURRICULUM_LESSONS } from '../data/curriculum';
import { JourneyMapView } from '../components/gamification/JourneyMapView';
import { ConfettiCelebration } from '../components/gamification/ConfettiCelebration';
import { Toast, type ToastType } from '../components/ui/Toast';
import {
  Sparkles,
  Wifi,
  RefreshCw,
  Volume2,
  Bell,
  ShieldCheck,
  Users,
  GraduationCap,
  CalendarCheck,
  BookOpen,
} from 'lucide-react';
import { speechSynthesisService } from '../services/speechSynthesis';
import {
  getStudentProgress,
  getStoryHistory,
} from '../services/firebase/progressService';
import { getAssignmentsByClassroom } from '../services/firebase/classroomService';
import type { AssignmentRecord, StudentProgressRecord } from '../firebase/types';

export const Dashboard: React.FC = () => {
  const { user: firebaseUser } = useAuth();
  const { user: storeUser } = useAuthStore();
  const effectiveTeacherId = firebaseUser?.uid || (storeUser?.role === 'teacher' ? storeUser.id : undefined);

  // Live Firebase Custom Hooks
  const { teacher } = useTeacher(effectiveTeacherId);
  const { classrooms } = useClassrooms(effectiveTeacherId);
  const { students, getTodayAttendanceSummary } = useStudents({ teacherId: effectiveTeacherId });

  const teacherName =
    teacher?.name ||
    firebaseUser?.displayName ||
    (storeUser?.role === 'teacher' ? storeUser.displayName : 'Sangeeta Soren');
  const schoolName =
    teacher?.school ||
    (storeUser && 'schoolName' in storeUser ? storeUser.schoolName : 'GPS Dumka Tribal Primary School');
  const districtName =
    teacher?.district ||
    (storeUser && 'district' in storeUser ? storeUser.district : 'Dumka');

  const totalClassroomsCount = classrooms.length > 0 ? classrooms.length : 1;
  const totalStudentsCount =
    students.length > 0
      ? students.length
      : classrooms.reduce((acc, c) => acc + (c.studentCount || 0), 0) || 28;
  const attendanceSummary = getTodayAttendanceSummary();

  const activeClassroomId = classrooms[0]?.classroomId || 'class_dumka_g2';
  const activeStudentId = storeUser?.role === 'student' ? storeUser.id : 'stu_dumka_1';
  const { progress: realProgress, xp: realXP, streak: realStreak } = useProgress(activeStudentId);

  const { syncState, triggerSync, version } = useCurriculumStore();
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);

  // Live Firestore State
  const [liveProgress, setLiveProgress] = useState<StudentProgressRecord | null>(null);
  const [assignments, setAssignments] = useState<AssignmentRecord[]>([]);
  const [continueTitle, setContinueTitle] = useState('Animals in Hindi & Santhali');
  const [continueSubtitle, setContinueSubtitle] = useState('12 of 16 Words Mastered');
  const [continueProgressPercent, setContinueProgressPercent] = useState(75);

  const dailyWord = contentEngineService.getDailyWord();
  const dailyFact = contentEngineService.getDailyFact();

  const studentUser = storeUser && storeUser.role === 'student' ? storeUser : null;
  const currentXp = realProgress?.totalXP || realXP || liveProgress?.totalXp || studentUser?.xp || (storeUser && storeUser.role === 'teacher' ? storeUser.xp : 1240);
  const streakDays = realProgress?.streak || realStreak || 5;
  const currentStars = liveProgress?.starsCount || studentUser?.stars || 18;

  useEffect(() => {
    const userId = firebaseUser?.uid || storeUser?.id || 's1';
    const classroomCode = (storeUser && 'classroomCode' in storeUser && storeUser.classroomCode) ? storeUser.classroomCode : 'JH-DUMKA-01';

    // 1. Fetch live student progress from Firestore
    getStudentProgress(userId).then((prog) => {
      if (prog) setLiveProgress(prog);
    }).catch(console.warn);

    // 2. Fetch live assignments from Firestore
    getAssignmentsByClassroom(classroomCode).then((asgs) => {
      if (asgs && asgs.length > 0) setAssignments(asgs);
    }).catch(console.warn);

    // 3. Sync offline queue when online
    studentProgressService.syncOfflineQueueWhenOnline().catch(console.warn);

    // 4. Fetch recent story progress for Continue Learning
    getStoryHistory(userId).then((history) => {
      if (history && history.length > 0) {
        const recent = history[0];
        setContinueTitle(recent.storyTitle);
        setContinueSubtitle(`${recent.pagesRead} of ${recent.totalPages} Pages Read`);
        setContinueProgressPercent(Math.min(100, Math.round((recent.pagesRead / recent.totalPages) * 100)));
      }
    }).catch(console.warn);
  }, [firebaseUser, storeUser]);

  const showToast = (message: string, type: ToastType = 'success') => {
    setToast({ message, type });
  };

  const handleSyncNow = async () => {
    showToast('Initiating differential sync with CRC Dumka Hub...', 'info');
    await triggerSync();
    showToast(`Classroom synced successfully! Active curriculum: ${version}`, 'success');
  };

  const primaryLesson = ALL_CURRICULUM_LESSONS[0];
  const numLesson = ALL_CURRICULUM_LESSONS[1];
  const artLesson = ALL_CURRICULUM_LESSONS[2];
  const storyLesson = ALL_CURRICULUM_LESSONS[3];

  // Today's Educational Activity Tiles from Master Curriculum Engine
  const activities: ActivityItem[] = [
    {
      id: primaryLesson.id,
      title: primaryLesson.titleEnglish,
      hindiTitle: primaryLesson.titleHindi,
      santhaliTitle: primaryLesson.titleSanthali,
      subtitle: `${primaryLesson.vocabulary.length} words • ${primaryLesson.theme}`,
      tag: 'FLN Literacy',
      illustration: <CuteElephant size={105} />,
      accentColor: '#F59E0B',
      bgColor: 'bg-[#FFFBEB]',
      borderColor: 'border-amber-200/80',
      buttonBg: '#F59E0B',
      route: '/flashcards',
    },
    {
      id: numLesson.id,
      title: numLesson.titleEnglish,
      hindiTitle: numLesson.titleHindi,
      santhaliTitle: numLesson.titleSanthali,
      subtitle: `${numLesson.vocabulary.length} numbers • CPA method`,
      tag: 'Math FLN',
      illustration: <CountingBlocks size={105} />,
      accentColor: '#2563EB',
      bgColor: 'bg-[#EFF6FF]',
      borderColor: 'border-blue-200/80',
      buttonBg: '#2563EB',
      route: '/flashcards',
    },
    {
      id: artLesson.id,
      title: artLesson.titleEnglish,
      hindiTitle: artLesson.titleHindi,
      santhaliTitle: artLesson.titleSanthali,
      subtitle: 'Sohrai Earth Motifs',
      tag: 'Tribal Arts',
      illustration: <CuteMango size={105} />,
      accentColor: '#22C55E',
      bgColor: 'bg-[#F0FDF4]',
      borderColor: 'border-emerald-200/80',
      buttonBg: '#22C55E',
      route: '/worksheets',
    },
    {
      id: storyLesson.id,
      title: storyLesson.titleEnglish,
      hindiTitle: storyLesson.titleHindi,
      santhaliTitle: storyLesson.titleSanthali,
      subtitle: 'Bilingual Reader',
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
      <HeroCard
        teacherName={teacherName}
        schoolName={schoolName}
        districtName={districtName}
      />

      {/* SECTION 1A: LIVE CLASSROOM & TEACHER FIRESTORE METRICS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Metric 1: Teacher Profile */}
        <div className="p-4 rounded-[24px] bg-white border border-[#F1EFE8] shadow-2xs space-y-2">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-blue-100 text-blue-700">
              <GraduationCap size={16} />
            </span>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Teacher
            </span>
          </div>
          <div>
            <div className="text-base font-extrabold text-slate-900 truncate">
              {teacherName}
            </div>
            <div className="text-[11px] text-slate-500 truncate font-medium">
              {schoolName}
            </div>
          </div>
        </div>

        {/* Metric 2: Active Classrooms */}
        <div className="p-4 rounded-[24px] bg-white border border-[#F1EFE8] shadow-2xs space-y-2">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-purple-100 text-purple-700">
              <BookOpen size={16} />
            </span>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Classrooms
            </span>
          </div>
          <div>
            <div className="text-base font-extrabold text-slate-900">
              {totalClassroomsCount} Active
            </div>
            <div className="text-[11px] text-slate-500 font-medium">
              {districtName} District
            </div>
          </div>
        </div>

        {/* Metric 3: Enrolled Students */}
        <div className="p-4 rounded-[24px] bg-white border border-[#F1EFE8] shadow-2xs space-y-2">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-emerald-100 text-emerald-700">
              <Users size={16} />
            </span>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Enrolled Students
            </span>
          </div>
          <div>
            <div className="text-base font-extrabold text-slate-900">
              {totalStudentsCount} Students
            </div>
            <div className="text-[11px] text-slate-500 font-medium">
              Santali & Hindi Medium
            </div>
          </div>
        </div>

        {/* Metric 4: Today's Attendance */}
        <div className="p-4 rounded-[24px] bg-white border border-[#F1EFE8] shadow-2xs space-y-2">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-amber-100 text-amber-700">
              <CalendarCheck size={16} />
            </span>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Today's Attendance
            </span>
          </div>
          <div>
            <div className="text-base font-extrabold text-slate-900">
              {attendanceSummary.totalStudents > 0
                ? `${attendanceSummary.attendanceRate}%`
                : '96%'}
            </div>
            <div className="text-[11px] text-slate-500 font-medium truncate">
              {attendanceSummary.totalStudents > 0
                ? `${attendanceSummary.presentCount} of ${attendanceSummary.totalStudents} Present`
                : '27 of 28 Present'}
            </div>
          </div>
        </div>
      </div>

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

      {/* DISTRICT ADMIN OVERSIGHT BANNER (WHEN LOGGED IN AS DISTRICT ADMIN) */}
      {storeUser?.role === 'district_admin' && (
        <div className="p-4 rounded-2xl bg-purple-50 border border-purple-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <span className="p-2 rounded-xl bg-purple-100 text-purple-800">
              <ShieldCheck size={18} />
            </span>
            <div>
              <span className="font-extrabold text-purple-950 block text-sm">
                District Administrator Oversight • {(storeUser as any).district || 'Dumka'}
              </span>
              <p className="text-purple-800 font-medium text-[11px]">
                Active monitoring for 248 MTB-MLE Primary Schools • FLN Target Rate: 85%
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => showToast('District Analytics report generated for Dumka.', 'info')}
            className="px-3 py-1.5 rounded-xl bg-purple-700 text-white font-bold hover:bg-purple-800 cursor-pointer self-start sm:self-auto"
          >
            Export District FLN Report
          </button>
        </div>
      )}

      {/* SECTION 2: CONTINUE LEARNING CARD */}
      <LearningCard
        title={continueTitle || primaryLesson.titleEnglish}
        hindiTitle={primaryLesson.titleHindi}
        santhaliTitle={`${primaryLesson.titleSanthali} (${primaryLesson.titleRoman})`}
        duration="12 mins"
        progressPercent={continueProgressPercent}
        wordsMastered={continueSubtitle}
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

      {/* SECTION 3C: CLASSROOM QUIZ & ASSESSMENT PLATFORM */}
      <QuizDashboardCard
        teacherId={effectiveTeacherId}
        classroomId={activeClassroomId}
        assignedCount={assignments.length || 3}
        completedTodayCount={24}
        averageScore={realProgress?.accuracyScore || 84}
        pendingCount={4}
        weeklyAccuracy={82}
        weakCompetencies={[
          { name: 'Ol Chiki Consonant Conjuncts (L1.4)', score: 58 },
          { name: 'Number Regrouping within 50 (M2.1)', score: 64 },
        ]}
        onNotification={(msg, type) => {
          showToast(msg, type);
          if (type === 'success') setShowConfetti(true);
        }}
      />

      {/* SECTION 4: NIPUN BHARAT PROGRESS CARD */}
      <ProgressCard
        vocabularyMastered={realProgress?.masteredWords || liveProgress?.masteredWordsCount || 28}
        readingCards={realProgress?.completedStories || liveProgress?.storiesCompletedCount || 8}
        accuracyScore={realProgress?.accuracyScore || 82}
        readingFluency={realProgress?.readingFluency || 64}
        pronunciationScore={realProgress?.pronunciationScore || 78}
      />

      {/* SECTION 4B: FOREST JOURNEY MAP VIEW */}
      <JourneyMapView currentXp={currentXp} />

      {/* SECTION 5: DAILY REWARDS SECTION */}
      <DailyRewardsSection
        starsCount={currentStars}
        streakDays={streakDays}
      />

      {/* SECTION 5B: REAL CLASSROOM LEADERBOARD (TOP 5) */}
      <LeaderboardCard
        classroomId={activeClassroomId}
        currentStudentId={activeStudentId}
        limitCount={5}
        onNotification={(msg, type) => {
          showToast(msg, type);
          if (type === 'success') setShowConfetti(true);
        }}
      />

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
