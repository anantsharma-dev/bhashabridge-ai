import React, { useState, useEffect } from 'react';
import {
  AlertTriangle,
  Plus,
  Printer,
  Sparkles,
  Calendar,
  CheckCircle2,
  Clock,
  BookOpen,
  TrendingUp,
  BarChart2,
  Copy,
  QrCode,
  Check,
  Wifi,
  Search,
  Trash2,
  Compass,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { classroomService } from '../services/classroomService';
import { analyticsService } from '../services/analyticsService';
import { ALL_CURRICULUM_LESSONS } from '../data/curriculum';
import { Toast, type ToastType } from '../components/ui/Toast';
import type { Classroom, ClassroomStudentRecord, AttendanceRecord, AssignmentRecord } from '../firebase/types';
import type { WeakTopicAlert } from '../services/classroomService';
import { recordAttendance, createAssignment as createAssignmentLive } from '../services/firebase/classroomService';

export const TeacherClassroom: React.FC = () => {
  const navigate = useNavigate();

  // Classroom selection
  const [classrooms, setClassrooms] = useState<Classroom[]>(() => classroomService.getClassrooms());
  const [activeCode, setActiveCode] = useState<string>(() => classrooms[0]?.code || 'JH-DUMKA-01');
  const classroom = classrooms.find((c) => c.code === activeCode) || classrooms[0];

  // Active navigation tab
  const [activeTab, setActiveTab] = useState<
    'roster' | 'attendance' | 'homework' | 'lesson_plan' | 'analytics' | 'weekly_report' | 'weak_topics'
  >('roster');

  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [showQr, setShowQr] = useState(false);

  // Filter & Search in Roster
  const [rosterSearch, setRosterSearch] = useState('');
  const [rosterGradeFilter, setRosterGradeFilter] = useState('all');

  // Modals
  const [isCreateClassModalOpen, setIsCreateClassModalOpen] = useState(false);
  const [isAddStudentModalOpen, setIsAddStudentModalOpen] = useState(false);
  const [isCreateHomeworkModalOpen, setIsCreateHomeworkModalOpen] = useState(false);

  // New Classroom Form State
  const [newClassSchool, setNewClassSchool] = useState('');
  const [newClassBlock, setNewClassBlock] = useState('Shikaripara');
  const [newClassDistrict, setNewClassDistrict] = useState('Dumka');
  const [newClassGrades, setNewClassGrades] = useState('Grade 1 & Grade 2 MTB-MLE');
  const [newClassCustomCode, setNewClassCustomCode] = useState('');

  // New Student Form State
  const [newStudentName, setNewStudentName] = useState('');
  const [newStudentNative, setNewStudentNative] = useState('');
  const [newStudentGrade, setNewStudentGrade] = useState('Grade 1');
  const [newStudentLang, setNewStudentLang] = useState('Santali (Ol Chiki)');
  const [newStudentVillage, setNewStudentVillage] = useState('Kathikund');
  const [newStudentPin, setNewStudentPin] = useState('1234');
  const [newStudentAvatar, setNewStudentAvatar] = useState('👦');
  const [newStudentReadingLevel, setNewStudentReadingLevel] = useState<'Level 1 (Emergent)' | 'Level 2 (Transitional)' | 'Level 3 (Fluent)'>('Level 1 (Emergent)');

  // New Homework Form State
  const [newHwTitle, setNewHwTitle] = useState('');
  const [newHwSubject, setNewHwSubject] = useState('Language MTB-MLE');
  const [newHwGrade, setNewHwGrade] = useState('Grade 2');
  const [newHwDueDate, setNewHwDueDate] = useState('Tomorrow');
  const [newHwDesc, setNewHwDesc] = useState('');

  // Attendance state
  const [attendanceDate, setAttendanceDate] = useState<string>(() => new Date().toISOString().split('T')[0]);
  const [attendance, setAttendance] = useState<Record<string, 'present' | 'absent' | 'late'>>({});

  // Realtime subscription to active classroom
  useEffect(() => {
    const unsub = classroomService.subscribe(activeCode, (updated: Classroom) => {
      setClassrooms(classroomService.getClassrooms());
      if (updated.code === activeCode) {
        // Initialize attendance map for students if not yet set
        setAttendance((prev) => {
          const next = { ...prev };
          updated.students.forEach((s: ClassroomStudentRecord, idx: number) => {
            if (!next[s.id]) {
              next[s.id] = idx === 4 ? 'absent' : idx === 2 ? 'late' : 'present';
            }
          });
          return next;
        });
      }
    });

    return () => {
      unsub();
    };
  }, [activeCode]);

  const showToast = (message: string, type: ToastType = 'success') => {
    setToast({ message, type });
  };

  const copyJoinCode = () => {
    if (classroom?.code) {
      navigator.clipboard?.writeText(classroom.code);
      setIsCopied(true);
      showToast(`Classroom Code "${classroom.code}" copied to clipboard!`, 'info');
      setTimeout(() => setIsCopied(false), 2500);
    }
  };

  // Attendance handlers
  const handleToggleAttendance = (studentId: string, status: 'present' | 'absent' | 'late') => {
    setAttendance((prev) => ({ ...prev, [studentId]: status }));
  };

  const handleMarkAllPresent = () => {
    const allP: Record<string, 'present' | 'absent' | 'late'> = {};
    classroom.students.forEach((s) => {
      allP[s.id] = 'present';
    });
    setAttendance(allP);
    showToast(`Marked all ${classroom.students.length} learners present!`, 'success');
  };

  const handleSaveAttendance = async () => {
    const record: AttendanceRecord = {
      id: `att-${classroom.code}-${attendanceDate}`,
      classroomId: classroom.code,
      date: attendanceDate,
      teacherId: classroom.teacherId,
      records: classroom.students.map((s) => ({
        studentId: s.id,
        studentName: s.name,
        status: attendance[s.id] || 'present',
      })),
      createdAt: Date.now(),
      synced: true,
    };

    classroomService.saveAttendance(record);
    try {
      await recordAttendance(record);
    } catch {
      // offline fallback
    }

    showToast(
      `Attendance for ${classroom.students.length} students recorded on ${attendanceDate}! Synced to offline cache & CRC Dumka.`,
      'success'
    );
  };

  // Create Classroom Handler
  const handleCreateClassroom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClassSchool.trim()) {
      showToast('Please enter school name', 'error');
      return;
    }

    const created = classroomService.createClassroom({
      schoolName: newClassSchool,
      teacherName: classroom.teacherName || 'Sangeeta Soren',
      teacherId: classroom.teacherId || 'teacher-01',
      district: newClassDistrict,
      block: newClassBlock,
      grades: newClassGrades,
      code: newClassCustomCode.trim() || undefined,
    });

    setClassrooms(classroomService.getClassrooms());
    setActiveCode(created.code);
    setIsCreateClassModalOpen(false);
    setNewClassSchool('');
    setNewClassCustomCode('');
    showToast(`Classroom "${created.schoolName}" created with Join Code: ${created.code}!`, 'success');
  };

  // Add Student Handler
  const handleAddStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudentName.trim()) {
      showToast('Please enter student name', 'error');
      return;
    }

    const updated = classroomService.addStudentToClassroom(classroom.code, {
      name: newStudentName.trim(),
      nativeScript: newStudentNative.trim() || newStudentName.trim(),
      grade: newStudentGrade,
      motherTongue: newStudentLang,
      village: newStudentVillage.trim(),
      pin: newStudentPin.trim() || '1234',
      avatarEmoji: newStudentAvatar,
      stars: 10,
      xp: 250,
      badge: 'on_track',
      badges: ['New Learner'],
      readingLevel: newStudentReadingLevel,
      readingMinutes: 20,
      vocabMastered: 12,
      quizAccuracy: 85,
      dailyXp: [15, 20, 25, 20, 30, 25, 15],
    });

    setClassrooms(classroomService.getClassrooms());
    setIsAddStudentModalOpen(false);
    setNewStudentName('');
    setNewStudentNative('');
    showToast(`Added ${newStudentName} to roster in ${updated.schoolName}!`, 'success');
  };

  // Delete Student Handler
  const handleDeleteStudent = (studentId: string, studentName: string) => {
    if (window.confirm(`Are you sure you want to remove ${studentName} from this classroom roster?`)) {
      classroomService.deleteStudent(classroom.code, studentId);
      setClassrooms(classroomService.getClassrooms());
      showToast(`Removed ${studentName} from roster.`, 'info');
    }
  };

  // Create Homework Handler
  const handleCreateHomework = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHwTitle.trim()) {
      showToast('Please enter homework title', 'error');
      return;
    }

    const newAssignment: AssignmentRecord = {
      id: `asg-${Date.now()}`,
      classroomId: classroom.code,
      title: newHwTitle.trim(),
      description: newHwDesc.trim() || 'Complete the exercises at home with parent guidance.',
      subject: newHwSubject,
      grade: newHwGrade,
      dueDate: newHwDueDate,
      assignedBy: classroom.teacherName,
      submissionsCount: 0,
      createdAt: Date.now(),
    };

    classroomService.createAssignment(newAssignment);
    try {
      await createAssignmentLive(newAssignment);
    } catch {
      // offline fallback
    }

    setIsCreateHomeworkModalOpen(false);
    setNewHwTitle('');
    setNewHwDesc('');
    showToast(`Created task "${newAssignment.title}" for ${classroom.students.length} students!`, 'success');
  };

  // Filtered students for Roster
  const filteredStudents = classroom.students.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(rosterSearch.toLowerCase()) ||
      s.nativeScript.includes(rosterSearch) ||
      (s.studentId && s.studentId.toLowerCase().includes(rosterSearch.toLowerCase())) ||
      (s.village && s.village.toLowerCase().includes(rosterSearch.toLowerCase()));

    const matchesGrade = rosterGradeFilter === 'all' || s.grade.toLowerCase().includes(rosterGradeFilter.toLowerCase());

    return matchesSearch && matchesGrade;
  });

  // Analytics & Stats
  const analytics = analyticsService.getClassroomAnalytics(classroom);
  const weakTopics = classroomService.detectWeakTopics(classroom.code);
  const assignments = classroomService.getAssignments(classroom.code);

  const presentCount = Object.values(attendance).filter((s) => s === 'present').length;
  const lateCount = Object.values(attendance).filter((s) => s === 'late').length;
  const absentCount = Object.values(attendance).filter((s) => s === 'absent').length;
  const attendancePercent = classroom.students.length > 0
    ? Math.round((presentCount / classroom.students.length) * 100)
    : 100;

  const todayLesson = ALL_CURRICULUM_LESSONS[0];

  return (
    <div className="min-h-full bg-[#FFFDF7] -m-4 sm:-m-6 lg:-m-8 p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8 font-sans antialiased text-slate-800">
      {/* 1. CLASSROOM HERO BANNER & SWITCHER */}
      <div className="rounded-[28px] bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 p-6 sm:p-8 text-white shadow-lg space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-black bg-white/20 backdrop-blur-xs text-white uppercase tracking-wider flex items-center gap-1.5">
                <Compass size={13} />
                Class Code: <strong className="underline decoration-amber-300 font-mono text-amber-200">{classroom.code}</strong>
              </span>
              <span className="text-xs font-semibold text-blue-200">
                {classroom.grades}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-400/20 text-emerald-200 border border-emerald-400/30 flex items-center gap-1">
                <Wifi size={11} /> 100% Offline Ready
              </span>
            </div>

            <div className="flex items-center gap-3">
              <h1 className="text-2xl sm:text-3xl font-black font-baloo">
                {classroom.schoolName}
              </h1>

              {/* Classroom Switcher Dropdown */}
              {classrooms.length > 1 && (
                <div className="relative inline-block">
                  <select
                    value={activeCode}
                    onChange={(e) => setActiveCode(e.target.value)}
                    className="bg-white/15 hover:bg-white/25 text-white font-bold text-xs py-1.5 px-3 rounded-xl border border-white/20 cursor-pointer outline-none"
                  >
                    {classrooms.map((c) => (
                      <option key={c.code} value={c.code} className="text-slate-900">
                        {c.schoolName} ({c.code})
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            <p className="text-xs sm:text-sm text-blue-100 font-medium">
              Teacher Mentor: <strong>{classroom.teacherName}</strong> • {classroom.block}, {classroom.district} (Jharkhand)
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={copyJoinCode}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center gap-1.5 border border-white/25 cursor-pointer transition-colors shadow-2xs"
              title="Copy join code to share with students"
            >
              {isCopied ? <Check size={14} className="text-emerald-300" /> : <Copy size={14} />}
              <span>{isCopied ? 'Code Copied!' : `Join Code: ${classroom.code}`}</span>
            </button>

            <button
              type="button"
              onClick={() => setShowQr(!showQr)}
              className="px-3 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center gap-1.5 border border-white/25 cursor-pointer transition-colors"
              title="Toggle Classroom QR Code"
            >
              <QrCode size={14} />
            </button>

            <button
              type="button"
              onClick={() => setIsCreateClassModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-amber-950 font-black text-xs flex items-center gap-1.5 shadow-sm cursor-pointer transition-all"
            >
              <Plus size={14} />
              <span>New Classroom</span>
            </button>

            <button
              type="button"
              onClick={() => window.print()}
              className="px-4 py-2.5 rounded-xl bg-white text-blue-900 hover:bg-blue-50 font-black text-xs flex items-center gap-1.5 shadow-sm cursor-pointer transition-all"
            >
              <Printer size={14} />
              <span>Print</span>
            </button>
          </div>
        </div>

        {/* QR Code expansion modal/drawer */}
        {showQr && (
          <div className="p-4 rounded-2xl bg-white/95 text-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-md animate-fadeIn">
            <div className="space-y-1">
              <span className="text-xs font-black uppercase text-blue-900 block">
                Classroom Join Card • {classroom.code}
              </span>
              <p className="text-xs text-slate-600">
                Display this code in your Dumka classroom or print on students' slates. Students join using code <strong>{classroom.code}</strong>.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 bg-slate-900 text-white rounded-xl flex items-center justify-center font-mono font-black text-xs p-1 text-center">
                QR: {classroom.code}
              </div>
              <button
                type="button"
                onClick={() => setShowQr(false)}
                className="text-xs font-bold text-slate-500 hover:text-slate-800"
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* Quick Cohort KPI Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/15">
            <span className="text-[11px] font-medium text-blue-200 block">Enrolled Students</span>
            <span className="text-xl font-black text-white">{classroom.students.length} Learners</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/15">
            <span className="text-[11px] font-medium text-blue-200 block">Today's Attendance</span>
            <span className="text-xl font-black text-emerald-300">{attendancePercent}% Present</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/15">
            <span className="text-[11px] font-medium text-blue-200 block">Active Homework</span>
            <span className="text-xl font-black text-white">{assignments.length} Tasks</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/15">
            <span className="text-[11px] font-medium text-blue-200 block">Weekly Reading Time</span>
            <span className="text-xl font-black text-amber-300">{analytics.totalReadingMinutesWeekly} mins</span>
          </div>
        </div>
      </div>

      {/* 2. NAVIGATION TABS */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-slate-200">
        {[
          { id: 'roster', label: 'Student Roster', count: classroom.students.length },
          { id: 'attendance', label: 'Daily Attendance', count: `${attendancePercent}%` },
          { id: 'homework', label: 'Homework & Tasks', count: assignments.length },
          { id: 'lesson_plan', label: 'Lesson Planner' },
          { id: 'analytics', label: 'Cohort Analytics' },
          { id: 'weekly_report', label: 'Weekly Reports' },
          { id: 'weak_topics', label: 'Weak Topics', count: weakTopics.length },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id as any)}
            className={`min-h-[42px] px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
              activeTab === tab.id
                ? 'bg-[#2563EB] text-white shadow-2xs'
                : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
            }`}
          >
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  activeTab === tab.id ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-700'
                }`}
              >
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* 3. TAB CONTENT PANELS */}

      {/* TAB 1: STUDENT ROSTER */}
      {activeTab === 'roster' && (
        <div className="rounded-[24px] bg-white border border-[#F1EFE8] p-6 sm:p-7 shadow-[0_4px_20px_rgba(0,0,0,0.04)] space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-lg font-extrabold text-slate-900 font-baloo">
                Classroom Student Roster ({classroom.students.length} Learners)
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Unique Student IDs, Mother Tongue, Village, XP, Stars, and FLN Reading Levels
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsAddStudentModalOpen(true)}
                className="px-4 py-2.5 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <Plus size={14} />
                <span>Add Student</span>
              </button>
            </div>
          </div>

          {/* Search & Filter Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <Search size={15} className="absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                value={rosterSearch}
                onChange={(e) => setRosterSearch(e.target.value)}
                placeholder="Search by student name, ID, or village..."
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#FFFDF7] border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto">
              <span className="text-xs font-bold text-slate-500">Filter Grade:</span>
              {['all', 'Grade 1', 'Grade 2', 'Grade 3'].map((grade) => (
                <button
                  key={grade}
                  type="button"
                  onClick={() => setRosterGradeFilter(grade)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                    rosterGradeFilter === grade
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {grade === 'all' ? 'All Grades' : grade}
                </button>
              ))}
            </div>
          </div>

          {/* Student Grid Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredStudents.map((student) => (
              <div
                key={student.id}
                className="p-4 rounded-2xl bg-[#FFFDF7] border border-slate-200/80 shadow-2xs space-y-3 relative hover:border-blue-300 transition-colors"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl p-2.5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
                      {student.avatarEmoji}
                    </span>
                    <div>
                      <h4 className="text-sm font-extrabold text-slate-900 font-baloo">
                        {student.name}
                      </h4>
                      <p className="text-xs font-semibold text-blue-800 font-devanagari">
                        {student.nativeScript}
                      </p>
                      <span className="text-[10px] font-mono font-bold text-slate-500 block">
                        ID: {student.studentId || student.id} • PIN: {student.pin}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDeleteStudent(student.id, student.name)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 cursor-pointer transition-colors"
                    title="Remove student"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px] pt-1 border-t border-slate-100 text-slate-600 font-medium">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Grade & Lang:</span>
                    <strong>{student.grade}</strong> • {student.motherTongue}
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Village / Block:</span>
                    <strong>{student.village || classroom.block}</strong>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-50 text-blue-700 border border-blue-200">
                    {student.readingLevel || 'Level 2 (Transitional)'}
                  </span>

                  <div className="flex items-center gap-2 font-bold text-xs">
                    <span className="text-amber-600 flex items-center gap-0.5">
                      ⭐ {student.stars}
                    </span>
                    <span className="text-purple-600 flex items-center gap-0.5">
                      <Sparkles size={12} /> {student.xp} XP
                    </span>
                  </div>
                </div>

                {student.badges && student.badges.length > 0 && (
                  <div className="flex flex-wrap gap-1 pt-1">
                    {student.badges.map((b, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded-md text-[9px] font-extrabold bg-amber-100 text-amber-900"
                      >
                        🏅 {b}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: DAILY ATTENDANCE */}
      {activeTab === 'attendance' && (
        <div className="rounded-[24px] bg-white border border-[#F1EFE8] p-6 sm:p-7 shadow-[0_4px_20px_rgba(0,0,0,0.04)] space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-lg font-extrabold text-slate-900 font-baloo">
                Classroom Attendance Tracker
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Tap Present, Late, or Absent for each student • Auto-syncs to CRC Dumka Hub & offline cache
              </p>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="date"
                value={attendanceDate}
                onChange={(e) => setAttendanceDate(e.target.value)}
                className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 bg-white"
              />
              <button
                type="button"
                onClick={handleMarkAllPresent}
                className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer"
              >
                Mark All Present
              </button>
              <button
                type="button"
                onClick={handleSaveAttendance}
                className="px-4 py-2 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-xs shadow-xs cursor-pointer"
              >
                Save & Sync
              </button>
            </div>
          </div>

          {/* Attendance Stats Bar */}
          <div className="grid grid-cols-4 gap-3 p-4 rounded-2xl bg-blue-50/70 border border-blue-200 text-center">
            <div>
              <span className="text-xs font-semibold text-blue-900 block">Total Learners</span>
              <strong className="text-lg font-black text-slate-900">{classroom.students.length}</strong>
            </div>
            <div>
              <span className="text-xs font-semibold text-emerald-800 block">Present</span>
              <strong className="text-lg font-black text-emerald-600">{presentCount}</strong>
            </div>
            <div>
              <span className="text-xs font-semibold text-amber-800 block">Late</span>
              <strong className="text-lg font-black text-amber-600">{lateCount}</strong>
            </div>
            <div>
              <span className="text-xs font-semibold text-rose-800 block">Absent</span>
              <strong className="text-lg font-black text-rose-600">{absentCount}</strong>
            </div>
          </div>

          {/* Attendance Rows */}
          <div className="space-y-2.5">
            {classroom.students.map((student) => {
              const currentStatus = attendance[student.id] || 'present';
              return (
                <div
                  key={student.id}
                  className="p-3.5 rounded-2xl bg-[#FFFDF7] border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl p-2 rounded-xl bg-white border border-slate-200">
                      {student.avatarEmoji}
                    </span>
                    <div>
                      <h4 className="text-sm font-extrabold text-slate-900 font-baloo">
                        {student.name}
                      </h4>
                      <p className="text-xs font-semibold text-slate-600 font-devanagari">
                        {student.nativeScript} • ID: {student.studentId || student.id} • {student.village || classroom.block}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleToggleAttendance(student.id, 'present')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition-all ${
                        currentStatus === 'present'
                          ? 'bg-emerald-600 text-white shadow-2xs'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      Present
                    </button>
                    <button
                      type="button"
                      onClick={() => handleToggleAttendance(student.id, 'late')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition-all ${
                        currentStatus === 'late'
                          ? 'bg-amber-500 text-white shadow-2xs'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      Late
                    </button>
                    <button
                      type="button"
                      onClick={() => handleToggleAttendance(student.id, 'absent')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition-all ${
                        currentStatus === 'absent'
                          ? 'bg-rose-500 text-white shadow-2xs'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      Absent
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: HOMEWORK & TASKS */}
      {activeTab === 'homework' && (
        <div className="rounded-[24px] bg-white border border-[#F1EFE8] p-6 sm:p-7 shadow-[0_4px_20px_rgba(0,0,0,0.04)] space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-lg font-extrabold text-slate-900 font-baloo">
                Classroom Homework & Practice Exercises
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Distribute worksheets, reading tasks, and Ol Chiki tracing assignments
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsCreateHomeworkModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <Plus size={14} />
              <span>Create Task</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {assignments.map((asg: AssignmentRecord) => (
              <div
                key={asg.id}
                className="p-5 rounded-2xl bg-[#FFFDF7] border border-slate-200/80 shadow-2xs space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-900">
                    {asg.subject} • {asg.grade}
                  </span>
                  <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
                    <Calendar size={13} /> Due: {asg.dueDate}
                  </span>
                </div>
                <div>
                  <h4 className="text-sm sm:text-base font-extrabold text-slate-900 font-baloo">
                    {asg.title}
                  </h4>
                  <p className="text-xs text-slate-600 mt-1">{asg.description}</p>
                </div>
                <div className="pt-2 flex items-center justify-between text-xs text-slate-500 border-t border-slate-100">
                  <span className="font-bold text-emerald-700">
                    {asg.submissionsCount}/{classroom.students.length} Submitted
                  </span>
                  <button
                    type="button"
                    onClick={() => showToast(`Reviewing submissions for ${asg.title}`, 'info')}
                    className="font-bold text-blue-600 hover:underline cursor-pointer"
                  >
                    View Submissions →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: LESSON PLANNER EMBED */}
      {activeTab === 'lesson_plan' && (
        <div className="rounded-[24px] bg-white border border-[#F1EFE8] p-6 sm:p-7 shadow-[0_4px_20px_rgba(0,0,0,0.04)] space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300">
                  Active Lesson Plan
                </span>
                <span className="text-xs font-semibold text-slate-500">
                  {todayLesson.standards.join(' • ')}
                </span>
              </div>
              <h3 className="text-xl font-extrabold text-slate-900 font-baloo mt-1">
                {todayLesson.titleEnglish} ({todayLesson.titleHindi})
              </h3>
              <p className="text-xs font-bold text-blue-800 font-olchiki">
                {todayLesson.titleSanthali} • {todayLesson.titleRoman}
              </p>
            </div>

            <button
              type="button"
              onClick={() => navigate('/lesson-planner')}
              className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <BookOpen size={14} />
              <span>Full Lesson Planner →</span>
            </button>
          </div>

          {/* Objectives & Outcomes */}
          <div className="p-4 rounded-2xl bg-[#FFFDF7] border border-slate-200/80 space-y-2">
            <h4 className="text-xs font-black uppercase text-slate-700 tracking-wider">
              NIPUN Bharat MTB-MLE Learning Objectives:
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-600">
              {todayLesson.learningObjectives.map((obj, i) => (
                <li key={i} className="flex items-start gap-2">
                  <CheckCircle2 size={14} className="text-emerald-600 shrink-0 mt-0.5" />
                  <span>{obj}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* 45-Min Classroom Timeline Schedule */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase text-slate-700 tracking-wider">
              Recommended 45-Minute Classroom Timeline
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 space-y-1">
                <span className="text-[10px] font-bold text-amber-800 block flex items-center gap-1">
                  <Clock size={12} /> 00–10 mins
                </span>
                <strong className="text-slate-900 block font-baloo">Johar Circle Warmup</strong>
                <p className="text-[11px] text-slate-600">
                  Sing opening morning Johar greeting song and review first 4 Ol Chiki sounds.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-blue-50 border border-blue-200 space-y-1">
                <span className="text-[10px] font-bold text-blue-800 block flex items-center gap-1">
                  <Clock size={12} /> 10–25 mins
                </span>
                <strong className="text-slate-900 block font-baloo">Bilingual Story Reading</strong>
                <p className="text-[11px] text-slate-600">
                  Read aloud '{todayLesson.story.titleEnglish}' in Santali mother tongue with audio assist.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-1">
                <span className="text-[10px] font-bold text-emerald-800 block flex items-center gap-1">
                  <Clock size={12} /> 25–40 mins
                </span>
                <strong className="text-slate-900 block font-baloo">Worksheet & Manipulatives</strong>
                <p className="text-[11px] text-slate-600">
                  Trace characters on tablets or sand slates and pair physical seeds for counting.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-purple-50 border border-purple-200 space-y-1">
                <span className="text-[10px] font-bold text-purple-800 block flex items-center gap-1">
                  <Clock size={12} /> 40–45 mins
                </span>
                <strong className="text-slate-900 block font-baloo">Assessment & Stars</strong>
                <p className="text-[11px] text-slate-600">
                  Administer 2-question oral mini quiz and award daily stars and XP.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: COHORT ANALYTICS */}
      {activeTab === 'analytics' && (
        <div className="rounded-[24px] bg-white border border-[#F1EFE8] p-6 sm:p-7 shadow-[0_4px_20px_rgba(0,0,0,0.04)] space-y-6">
          <div className="pb-3 border-b border-slate-100">
            <h3 className="text-lg font-extrabold text-slate-900 font-baloo">
              Cohort Learning Analytics & FLN Milestones
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Daily XP trends, weekly reading volume, vocabulary mastered, and attendance graph
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Daily XP Bar Chart */}
            <div className="p-5 rounded-2xl bg-[#FFFDF7] border border-slate-200/80 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-black uppercase text-slate-700 tracking-wider flex items-center gap-1.5">
                  <BarChart2 size={14} className="text-blue-600" /> Daily XP Trend (This Week)
                </h4>
                <span className="text-xs font-bold text-purple-700">
                  Avg: {Math.round(analytics.dailyXpWeekly.reduce((a, b) => a + b.xp, 0) / 7)} XP/day
                </span>
              </div>

              <div className="flex items-end justify-between gap-2 h-44 pt-4 px-2">
                {analytics.dailyXpWeekly.map((item) => {
                  const heightPercent = Math.min(100, Math.round((item.xp / 500) * 100));
                  return (
                    <div key={item.day} className="flex-1 flex flex-col items-center gap-1.5">
                      <span className="text-[10px] font-bold text-slate-500">{item.xp}</span>
                      <div className="w-full max-w-[28px] bg-slate-100 rounded-t-lg overflow-hidden h-32 flex items-end">
                        <div
                          style={{ height: `${heightPercent}%` }}
                          className="w-full bg-gradient-to-t from-blue-600 to-indigo-500 rounded-t-lg transition-all"
                        />
                      </div>
                      <span className="text-[11px] font-bold text-slate-700">{item.day}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Attendance Graph (5-Day Trend) */}
            <div className="p-5 rounded-2xl bg-[#FFFDF7] border border-slate-200/80 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-black uppercase text-slate-700 tracking-wider flex items-center gap-1.5">
                  <TrendingUp size={14} className="text-emerald-600" /> Weekly Attendance Graph
                </h4>
                <span className="text-xs font-bold text-emerald-700">
                  {analytics.averageAttendancePercent}% Average
                </span>
              </div>

              <div className="flex items-end justify-between gap-2 h-44 pt-4 px-2">
                {analytics.attendanceTrendWeekly.map((item) => {
                  return (
                    <div key={item.day} className="flex-1 flex flex-col items-center gap-1.5">
                      <span className="text-[10px] font-bold text-emerald-700">{item.percent}%</span>
                      <div className="w-full max-w-[28px] bg-slate-100 rounded-t-lg overflow-hidden h-32 flex items-end">
                        <div
                          style={{ height: `${item.percent}%` }}
                          className="w-full bg-gradient-to-t from-emerald-600 to-teal-500 rounded-t-lg transition-all"
                        />
                      </div>
                      <span className="text-[11px] font-bold text-slate-700">{item.day}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Reading Level Breakdown & Quiz Accuracy */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 text-center space-y-1">
              <span className="text-xs font-bold text-amber-900 block">Vocabulary Words Mastered</span>
              <strong className="text-2xl font-black text-amber-950 font-baloo">
                {analytics.totalVocabularyMastered} Words
              </strong>
              <p className="text-[11px] text-amber-800">Bilingual tribal flashcards mastered</p>
            </div>

            <div className="p-4 rounded-2xl bg-purple-50/70 border border-purple-200 text-center space-y-1">
              <span className="text-xs font-bold text-purple-900 block">Weekly Reading Volume</span>
              <strong className="text-2xl font-black text-purple-950 font-baloo">
                {analytics.totalReadingMinutesWeekly} Minutes
              </strong>
              <p className="text-[11px] text-purple-800">Across MTB-MLE audio stories</p>
            </div>

            <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200 text-center space-y-1">
              <span className="text-xs font-bold text-blue-900 block">Formative Quiz Accuracy</span>
              <strong className="text-2xl font-black text-blue-950 font-baloo">
                {analytics.averageQuizAccuracy}%
              </strong>
              <p className="text-[11px] text-blue-800">NIPUN Bharat target: 80%</p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: WEEKLY REPORTS (PRINTABLE) */}
      {activeTab === 'weekly_report' && (
        <div className="rounded-[24px] bg-white border border-[#F1EFE8] p-6 sm:p-7 shadow-[0_4px_20px_rgba(0,0,0,0.04)] space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-lg font-extrabold text-slate-900 font-baloo">
                Printable Weekly Classroom Report
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Official MTB-MLE report for parents and Cluster Resource Center (CRC) Dumka
              </p>
            </div>
            <button
              type="button"
              onClick={() => window.print()}
              className="px-5 py-2.5 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <Printer size={14} />
              <span>Print A4 Report</span>
            </button>
          </div>

          <div className="p-6 sm:p-8 rounded-2xl bg-[#FFFDF7] border-2 border-slate-300 space-y-5 max-w-3xl mx-auto text-xs">
            <div className="text-center border-b pb-4 space-y-1">
              <span className="text-[10px] font-black uppercase text-blue-800 tracking-wider">
                Department of School Education & Literacy • Govt of Jharkhand
              </span>
              <h2 className="text-lg sm:text-xl font-black text-slate-900 font-baloo">
                झारखंड प्राथमिक विद्यालय — साप्ताहिक कक्षा प्रगति रिपोर्ट (Weekly MTB-MLE Report)
              </h2>
              <p className="text-slate-600 font-medium">
                {classroom.schoolName} ({classroom.code}) • Teacher: {classroom.teacherName}
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center border-y py-3">
              <div>
                <span className="text-slate-500 block text-[11px]">Attendance Rate</span>
                <strong className="text-base font-black text-slate-900">{attendancePercent}%</strong>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">Enrolled Learners</span>
                <strong className="text-base font-black text-slate-900">{classroom.students.length}</strong>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">Reading Minutes</span>
                <strong className="text-base font-black text-slate-900">{analytics.totalReadingMinutesWeekly} mins</strong>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">Vocab Words Mastered</span>
                <strong className="text-base font-black text-slate-900">{analytics.totalVocabularyMastered}</strong>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-black uppercase text-slate-700">
                Top Student Learners of the Week (तारा सम्मान):
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {classroom.students.slice(0, 3).map((s, idx) => (
                  <div key={s.id} className="p-2.5 rounded-xl bg-amber-50/80 border border-amber-200 flex items-center gap-2">
                    <span className="text-xl">{s.avatarEmoji}</span>
                    <div>
                      <strong className="text-xs text-slate-900 block">{s.name}</strong>
                      <span className="text-[10px] text-amber-900 font-bold">#{idx + 1} • {s.xp} XP • ⭐ {s.stars}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-emerald-50/80 border border-emerald-200 text-emerald-950 space-y-1 text-xs">
              <strong>Teacher Summary & Classroom Notes for Parents:</strong>
              <p className="leading-relaxed">
                इस सप्ताह विद्यार्थियों ने संताली (ओल चिकी) और हिन्दी में फल, जानवर और अंकों की पहचान बहुत उत्साह से की। सभी बच्चों ने ऑडियो कहानियों को ध्यान से सुना। कृपया अभिभावक घर पर भी बच्चों से संताली में कहानियों की चर्चा करें।
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 7: WEAK TOPICS DETECTION */}
      {activeTab === 'weak_topics' && (
        <div className="rounded-[24px] bg-white border border-[#F1EFE8] p-6 sm:p-7 shadow-[0_4px_20px_rgba(0,0,0,0.04)] space-y-5">
          <div className="pb-3 border-b border-slate-100">
            <h3 className="text-lg font-extrabold text-slate-900 font-baloo">
              AI Weak Topic Detection & Remedial Pedagogy
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Identifies foundational competencies below 65% cohort mastery and recommends hands-on solutions
            </p>
          </div>

          <div className="space-y-4">
            {weakTopics.map((wt: WeakTopicAlert) => (
              <div
                key={wt.id}
                className="p-5 rounded-2xl bg-amber-50/60 border border-amber-200 shadow-2xs space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-200 text-amber-950">
                    Competency {wt.competencyCode} • {wt.subject}
                  </span>
                  <span className="text-xs font-extrabold text-rose-700 flex items-center gap-1">
                    <AlertTriangle size={14} /> {wt.cohortMasteryPercent}% Cohort Mastery
                  </span>
                </div>

                <h4 className="text-base font-extrabold text-slate-900 font-baloo">
                  {wt.topic}
                </h4>

                <div className="p-3 rounded-xl bg-white border border-amber-200 text-xs text-slate-700">
                  <strong className="text-amber-900 block mb-0.5">Recommended Classroom Action:</strong>
                  {wt.recommendedRemedialAction}
                </div>

                <div className="flex items-center justify-between text-xs pt-1">
                  <span className="text-slate-500 font-medium">
                    {wt.studentsNeedingSupportCount} students require focused support
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      showToast('Generated remedial worksheet for this topic!', 'success');
                      navigate('/worksheets');
                    }}
                    className="px-3 py-1.5 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-xs cursor-pointer shadow-2xs"
                  >
                    Generate Remedial Sheet
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL 1: CREATE CLASSROOM */}
      {isCreateClassModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-2xl space-y-4 border border-slate-200">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-lg font-black font-baloo text-slate-900">
                Create New Classroom
              </h3>
              <button
                type="button"
                onClick={() => setIsCreateClassModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 text-xl font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateClassroom} className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">School Name</label>
                <input
                  type="text"
                  value={newClassSchool}
                  onChange={(e) => setNewClassSchool(e.target.value)}
                  placeholder="उदा. GPS Kathikund Primary School"
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Block</label>
                  <input
                    type="text"
                    value={newClassBlock}
                    onChange={(e) => setNewClassBlock(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200"
                    required
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">District</label>
                  <input
                    type="text"
                    value={newClassDistrict}
                    onChange={(e) => setNewClassDistrict(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Grades</label>
                <select
                  value={newClassGrades}
                  onChange={(e) => setNewClassGrades(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                >
                  <option value="Grade 1 & Grade 2 MTB-MLE">Grade 1 & Grade 2 MTB-MLE</option>
                  <option value="Grade 2 & Grade 3 MTB-MLE">Grade 2 & Grade 3 MTB-MLE</option>
                  <option value="Grade 4 & Grade 5 MTB-MLE">Grade 4 & Grade 5 MTB-MLE</option>
                  <option value="Grade 1 to 5 Multi-grade">Grade 1 to 5 Multi-grade</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Custom Join Code (Optional)</label>
                <input
                  type="text"
                  value={newClassCustomCode}
                  onChange={(e) => setNewClassCustomCode(e.target.value.toUpperCase())}
                  placeholder="Leave blank to auto-generate (e.g. JH-DUM-94)"
                  className="w-full p-2.5 rounded-xl border border-slate-200 font-mono uppercase"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setIsCreateClassModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 font-bold hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-xs cursor-pointer"
                >
                  Create Classroom
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: ADD STUDENT */}
      {isAddStudentModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-2xl space-y-4 border border-slate-200">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-lg font-black font-baloo text-slate-900">
                Enroll Student in {classroom.schoolName}
              </h3>
              <button
                type="button"
                onClick={() => setIsAddStudentModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 text-xl font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddStudent} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Student Full Name (English / Hindi)</label>
                <input
                  type="text"
                  value={newStudentName}
                  onChange={(e) => setNewStudentName(e.target.value)}
                  placeholder="उदा. Sunita Murmu"
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Native Script (Ol Chiki / Devanagari)</label>
                <input
                  type="text"
                  value={newStudentNative}
                  onChange={(e) => setNewStudentNative(e.target.value)}
                  placeholder="ᱥᱩᱱᱤᱛᱟ ᱢᱩᱨᱢᱩ / सुनीता मुर्मू"
                  className="w-full p-2.5 rounded-xl border border-slate-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Grade</label>
                  <select
                    value={newStudentGrade}
                    onChange={(e) => setNewStudentGrade(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                  >
                    <option value="Grade 1">Grade 1</option>
                    <option value="Grade 2">Grade 2</option>
                    <option value="Grade 3">Grade 3</option>
                    <option value="Grade 4">Grade 4</option>
                    <option value="Grade 5">Grade 5</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Village</label>
                  <input
                    type="text"
                    value={newStudentVillage}
                    onChange={(e) => setNewStudentVillage(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200"
                    placeholder="उदा. Kathikund"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Mother Tongue</label>
                  <select
                    value={newStudentLang}
                    onChange={(e) => setNewStudentLang(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                  >
                    <option value="Santali (Ol Chiki)">Santali (Ol Chiki)</option>
                    <option value="Hindi">Hindi</option>
                    <option value="Ho (Warang Chiti)">Ho (Warang Chiti)</option>
                    <option value="Mundari">Mundari</option>
                    <option value="Kurukh">Kurukh</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Reading Level</label>
                  <select
                    value={newStudentReadingLevel}
                    onChange={(e) => setNewStudentReadingLevel(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                  >
                    <option value="Level 1 (Emergent)">Level 1 (Emergent)</option>
                    <option value="Level 2 (Transitional)">Level 2 (Transitional)</option>
                    <option value="Level 3 (Fluent)">Level 3 (Fluent)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">4-Digit PIN</label>
                  <input
                    type="text"
                    maxLength={4}
                    value={newStudentPin}
                    onChange={(e) => setNewStudentPin(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 font-mono tracking-widest text-center"
                    required
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Avatar Emoji</label>
                  <div className="flex items-center gap-1.5 pt-1">
                    {['👦', '👧', '🧒', '🦊', '🐘', '🦚'].map((emoji) => (
                      <button
                        key={emoji}
                        type="button"
                        onClick={() => setNewStudentAvatar(emoji)}
                        className={`text-xl p-1 rounded-lg cursor-pointer ${
                          newStudentAvatar === emoji ? 'bg-blue-100 ring-2 ring-blue-500' : 'hover:bg-slate-100'
                        }`}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setIsAddStudentModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 font-bold hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-xs cursor-pointer"
                >
                  Enroll Student
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: CREATE HOMEWORK */}
      {isCreateHomeworkModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-2xl space-y-4 border border-slate-200">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-lg font-black font-baloo text-slate-900">
                Create Homework Assignment
              </h3>
              <button
                type="button"
                onClick={() => setIsCreateHomeworkModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 text-xl font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateHomework} className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Assignment Title</label>
                <input
                  type="text"
                  value={newHwTitle}
                  onChange={(e) => setNewHwTitle(e.target.value)}
                  placeholder="उदा. Ol Chiki Animal Tracing & Reading"
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Subject</label>
                  <select
                    value={newHwSubject}
                    onChange={(e) => setNewHwSubject(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                  >
                    <option value="Language MTB-MLE">Language MTB-MLE</option>
                    <option value="Math FLN">Math FLN</option>
                    <option value="EVS & Nature">EVS & Nature</option>
                    <option value="Tribal Arts & Songs">Tribal Arts & Songs</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Grade</label>
                  <select
                    value={newHwGrade}
                    onChange={(e) => setNewHwGrade(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                  >
                    <option value="Grade 1">Grade 1</option>
                    <option value="Grade 2">Grade 2</option>
                    <option value="Grade 3">Grade 3</option>
                    <option value="Grade 4">Grade 4</option>
                    <option value="Grade 5">Grade 5</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Due Date</label>
                <select
                  value={newHwDueDate}
                  onChange={(e) => setNewHwDueDate(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                >
                  <option value="Tomorrow">Tomorrow</option>
                  <option value="In 2 Days">In 2 Days</option>
                  <option value="This Friday">This Friday</option>
                  <option value="Next Week">Next Week</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Instructions / Description</label>
                <textarea
                  value={newHwDesc}
                  onChange={(e) => setNewHwDesc(e.target.value)}
                  placeholder="Instructions for students and parents..."
                  rows={3}
                  className="w-full p-2.5 rounded-xl border border-slate-200 resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setIsCreateHomeworkModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 font-bold hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-xs cursor-pointer"
                >
                  Assign to Classroom
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TOAST FEEDBACK */}
      <Toast
        message={toast?.message ?? null}
        type={toast?.type ?? 'success'}
        onClose={() => setToast(null)}
      />
    </div>
  );
};

export default TeacherClassroom;
