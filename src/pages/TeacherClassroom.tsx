import React, { useState } from 'react';
import {
  AlertTriangle,
  Plus,
  Printer,
  Sparkles,
  Share2,
  Calendar,
} from 'lucide-react';
import { classroomService } from '../services/classroomService';
import { INITIAL_CLASSROOMS } from '../data/classrooms';
import { Toast, type ToastType } from '../components/ui/Toast';
import type { AttendanceRecord } from '../firebase/types';

export const TeacherClassroom: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    'attendance' | 'assignments' | 'leaderboard' | 'weak_topics' | 'parent_report'
  >('attendance');
  const [classroom] = useState(INITIAL_CLASSROOMS[0]);
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);

  // Attendance state
  const [attendance, setAttendance] = useState<Record<string, 'present' | 'absent' | 'late'>>(() => {
    const init: Record<string, 'present' | 'absent' | 'late'> = {};
    classroom.students.forEach((s, idx) => {
      init[s.id] = idx === 4 ? 'absent' : idx === 2 ? 'late' : 'present';
    });
    return init;
  });

  const weakTopics = classroomService.detectWeakTopics(classroom.code);
  const assignments = classroomService.getAssignments(classroom.code);

  const showToast = (message: string, type: ToastType = 'success') => {
    setToast({ message, type });
  };

  const handleToggleAttendance = (studentId: string, status: 'present' | 'absent' | 'late') => {
    setAttendance((prev) => ({ ...prev, [studentId]: status }));
  };

  const handleSaveAttendance = () => {
    const record: AttendanceRecord = {
      id: `att-${Date.now()}`,
      classroomId: classroom.code,
      date: new Date().toISOString().split('T')[0],
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
    showToast(`Attendance saved for ${classroom.students.length} students! Synced to offline cache.`, 'success');
  };

  const presentCount = Object.values(attendance).filter((s) => s === 'present').length;
  const attendancePercent = Math.round((presentCount / classroom.students.length) * 100);

  return (
    <div className="min-h-full bg-[#FFFDF7] -m-4 sm:-m-6 lg:-m-8 p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8 font-sans antialiased text-slate-800">
      {/* 1. CLASSROOM HERO BANNER */}
      <div className="rounded-[28px] bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 p-6 sm:p-8 text-white shadow-lg space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-black bg-white/20 backdrop-blur-xs text-white uppercase tracking-wider">
                Class Code: {classroom.code}
              </span>
              <span className="text-xs font-semibold text-blue-200">
                {classroom.grades}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black font-baloo">
              {classroom.schoolName}
            </h1>
            <p className="text-xs sm:text-sm text-blue-200 font-medium">
              Teacher Mentor: {classroom.teacherName} • {classroom.block}, {classroom.district}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                navigator.clipboard?.writeText(classroom.code);
                showToast(`Copied classroom code "${classroom.code}" to clipboard!`, 'info');
              }}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center gap-1.5 border border-white/20 cursor-pointer"
            >
              <Share2 size={14} />
              <span>Share Code</span>
            </button>
            <button
              type="button"
              onClick={() => window.print()}
              className="px-4 py-2.5 rounded-xl bg-white text-blue-900 hover:bg-blue-50 font-black text-xs flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <Printer size={14} />
              <span>Print Roster</span>
            </button>
          </div>
        </div>

        {/* Quick Cohort Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/10">
            <span className="text-[11px] font-medium text-blue-200 block">Enrolled Students</span>
            <span className="text-xl font-black text-white">{classroom.students.length} Learners</span>
          </div>
          <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/10">
            <span className="text-[11px] font-medium text-blue-200 block">Today's Attendance</span>
            <span className="text-xl font-black text-emerald-300">{attendancePercent}% Present</span>
          </div>
          <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/10">
            <span className="text-[11px] font-medium text-blue-200 block">Active Assignments</span>
            <span className="text-xl font-black text-white">{assignments.length} Tasks</span>
          </div>
          <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/10">
            <span className="text-[11px] font-medium text-blue-200 block">FLN Competency Alerts</span>
            <span className="text-xl font-black text-amber-300">{weakTopics.length} Focus Areas</span>
          </div>
        </div>
      </div>

      {/* 2. NAVIGATION TABS */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-slate-200">
        {[
          { id: 'attendance', label: 'Daily Attendance' },
          { id: 'assignments', label: 'Homework & Tasks' },
          { id: 'leaderboard', label: 'Student Leaderboard' },
          { id: 'weak_topics', label: 'Weak Topic Detection' },
          { id: 'parent_report', label: 'Parent Progress Card' },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id as any)}
            className={`min-h-[42px] px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-[#2563EB] text-white shadow-2xs'
                : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 3. TAB PANELS */}

      {/* TAB 1: ATTENDANCE */}
      {activeTab === 'attendance' && (
        <div className="rounded-[24px] bg-white border border-[#F1EFE8] p-6 sm:p-7 shadow-[0_4px_20px_rgba(0,0,0,0.04)] space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-lg font-extrabold text-slate-900 font-baloo">
                Classroom Attendance Tracker
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Tap Present, Late, or Absent for each student • Auto-syncs to CRC Dumka Hub
              </p>
            </div>
            <button
              type="button"
              onClick={handleSaveAttendance}
              className="px-5 py-2.5 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-xs shadow-xs cursor-pointer"
            >
              Save & Sync Attendance
            </button>
          </div>

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
                        {student.nativeScript} • PIN: {student.pin}
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

      {/* TAB 2: ASSIGNMENTS */}
      {activeTab === 'assignments' && (
        <div className="rounded-[24px] bg-white border border-[#F1EFE8] p-6 sm:p-7 shadow-[0_4px_20px_rgba(0,0,0,0.04)] space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-lg font-extrabold text-slate-900 font-baloo">
                Classroom Assignments & Homework
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Distribute worksheets and reading exercises to students
              </p>
            </div>
            <button
              type="button"
              onClick={() => showToast('New assignment creation modal opened!', 'info')}
              className="px-4 py-2 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <Plus size={14} />
              <span>Create Task</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {assignments.map((asg) => (
              <div
                key={asg.id}
                className="p-5 rounded-2xl bg-[#FFFDF7] border border-slate-200/80 shadow-2xs space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-900">
                    {asg.subject}
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
                    {asg.submissionsCount}/{classroom.students.length} Turned in
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

      {/* TAB 3: LEADERBOARD */}
      {activeTab === 'leaderboard' && (
        <div className="rounded-[24px] bg-white border border-[#F1EFE8] p-6 sm:p-7 shadow-[0_4px_20px_rgba(0,0,0,0.04)] space-y-5">
          <div className="pb-3 border-b border-slate-100">
            <h3 className="text-lg font-extrabold text-slate-900 font-baloo">
              Classroom FLN Stars & XP Leaderboard
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Celebrates daily effort, tribal vocabulary mastery, and story reading
            </p>
          </div>

          <div className="space-y-3">
            {[...classroom.students]
              .sort((a, b) => b.stars - a.stars)
              .map((student, idx) => (
                <div
                  key={student.id}
                  className="p-4 rounded-2xl bg-[#FFFDF7] border border-slate-200/80 flex items-center justify-between gap-3 shadow-2xs"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-7 h-7 rounded-xl flex items-center justify-center font-black text-xs ${
                        idx === 0
                          ? 'bg-amber-400 text-amber-950 shadow-xs'
                          : idx === 1
                          ? 'bg-slate-300 text-slate-900'
                          : idx === 2
                          ? 'bg-orange-300 text-orange-950'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      #{idx + 1}
                    </span>
                    <span className="text-2xl">{student.avatarEmoji}</span>
                    <div>
                      <h4 className="text-sm font-extrabold text-slate-900 font-baloo">
                        {student.name}
                      </h4>
                      <p className="text-xs font-semibold text-slate-500 font-devanagari">
                        {student.nativeScript}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-xs font-bold">
                    <span className="text-amber-600 flex items-center gap-1">
                      ⭐ {student.stars} Stars
                    </span>
                    <span className="text-purple-600 flex items-center gap-1">
                      <Sparkles size={14} /> {student.xp} XP
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* TAB 4: WEAK TOPICS */}
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
            {weakTopics.map((wt) => (
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
                    onClick={() => showToast('Generated remedial worksheet for this topic!', 'success')}
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

      {/* TAB 5: PARENT PROGRESS CARD */}
      {activeTab === 'parent_report' && (
        <div className="rounded-[24px] bg-white border border-[#F1EFE8] p-6 sm:p-7 shadow-[0_4px_20px_rgba(0,0,0,0.04)] space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-lg font-extrabold text-slate-900 font-baloo">
                Printable Parent-Teacher Progress Report
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Bilingual report card designed for tribal families in Jharkhand
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

          <div className="p-6 rounded-2xl bg-[#FFFDF7] border-2 border-slate-200 space-y-4 max-w-2xl mx-auto text-xs">
            <div className="text-center border-b pb-3 space-y-1">
              <h2 className="text-base font-black text-slate-900 font-baloo">
                झारखंड प्राथमिक विद्यालय — छात्र प्रगति पत्र (Grade 1–2)
              </h2>
              <p className="text-slate-500 font-medium">
                Government Primary School Dumka • NIPUN Bharat MTB-MLE Assessment
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 text-slate-700">
              <div><strong>Student Name:</strong> Ravi Marandi (ᱨᱚᱵᱤ ᱢᱟᱨᱟᱱᱰᱤ)</div>
              <div><strong>Mother Tongue:</strong> Santali (Ol Chiki)</div>
              <div><strong>Attendance Rate:</strong> 94%</div>
              <div><strong>Oral Vocabulary:</strong> 42 Tribal Words Mastered</div>
            </div>

            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 space-y-1">
              <strong>Teacher Note for Parents:</strong>
              <p>
                रवि कक्षा में संताली और हिन्दी दोनों में बहुत रुचि से सीख रहा है। उसने सभी १६ पशुओं के नाम ओल चिकी में पहचान लिए हैं। घर पर भी उसे लोककथाएँ सुनाएँ।
              </p>
            </div>
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
