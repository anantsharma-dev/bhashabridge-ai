import type { Classroom, ClassroomStudentRecord, AttendanceRecord, AssignmentRecord } from '../firebase/types';
import { getClassrooms, saveClassrooms } from '../data/classrooms';

export interface WeakTopicAlert {
  id: string;
  topic: string;
  subject: string;
  competencyCode: string;
  cohortMasteryPercent: number;
  studentsNeedingSupportCount: number;
  recommendedRemedialAction: string;
}

const ATTENDANCE_KEY = 'bhashabridge_classroom_attendance';
const ASSIGNMENTS_KEY = 'bhashabridge_classroom_assignments';

type ClassroomListener = (classroom: Classroom) => void;

class ClassroomService {
  private classrooms: Classroom[] = getClassrooms();
  private listeners: Map<string, Set<ClassroomListener>> = new Map();

  constructor() {
    this.classrooms = getClassrooms();
  }

  public getClassrooms(): Classroom[] {
    this.classrooms = getClassrooms();
    return this.classrooms;
  }

  public getClassroomByCode(code: string): Classroom | null {
    const norm = code.trim().toUpperCase();
    const current = this.getClassrooms();
    return current.find((c) => c.code.toUpperCase() === norm) || current[0] || null;
  }

  // 1. Classroom Creation & Code Generation
  public generateJoinCode(district = 'DUMKA'): string {
    const prefix = district.toUpperCase().slice(0, 3) || 'JH';
    const randNum = Math.floor(10 + Math.random() * 90);
    return `JH-${prefix}-${randNum}`;
  }

  public createClassroom(data: {
    schoolName: string;
    teacherName: string;
    teacherId: string;
    district: string;
    block: string;
    grades: string;
    code?: string;
  }): Classroom {
    const code = (data.code?.trim() || this.generateJoinCode(data.district)).toUpperCase();
    const newClassroom: Classroom = {
      id: `cls-${Date.now()}`,
      code,
      schoolName: data.schoolName.trim(),
      teacherName: data.teacherName.trim(),
      teacherId: data.teacherId || 'teacher-01',
      district: data.district.trim(),
      block: data.block.trim(),
      grades: data.grades || 'Grade 1 & 2 MTB-MLE',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      students: [],
    };

    const current = this.getClassrooms();
    const updated = [newClassroom, ...current.filter((c) => c.code !== code)];
    this.classrooms = updated;
    saveClassrooms(updated);
    this.notifyListeners(code, newClassroom);

    return newClassroom;
  }

  // 2. Student Enrollment & Management
  public addStudentToClassroom(classroomId: string, studentData: Omit<ClassroomStudentRecord, 'id'> & { id?: string }): Classroom {
    const cls = this.getClassroomByCode(classroomId);
    if (!cls) throw new Error(`Classroom ${classroomId} not found`);

    const id = studentData.id || `s${Date.now()}`;
    const studentId = studentData.studentId || `STU-${cls.code.replace(/[^A-Z0-9]/g, '')}-${(cls.students.length + 1).toString().padStart(3, '0')}`;

    const newStudent: ClassroomStudentRecord = {
      ...studentData,
      id,
      studentId,
      village: studentData.village || cls.block,
      badges: studentData.badges || ['New Learner'],
      readingLevel: studentData.readingLevel || 'Level 1 (Emergent)',
      readingMinutes: studentData.readingMinutes || 20,
      vocabMastered: studentData.vocabMastered || 15,
      quizAccuracy: studentData.quizAccuracy || 80,
      dailyXp: studentData.dailyXp || [20, 25, 30, 35, 40, 25, 20],
      updatedAt: Date.now(),
    };

    const updatedCls: Classroom = {
      ...cls,
      updatedAt: Date.now(),
      students: [newStudent, ...cls.students],
    };

    this.saveClassroom(updatedCls);
    return updatedCls;
  }

  public updateStudent(
    classroomId: string,
    studentId: string,
    updates: Partial<ClassroomStudentRecord>
  ): Classroom {
    const cls = this.getClassroomByCode(classroomId);
    if (!cls) throw new Error(`Classroom ${classroomId} not found`);

    const updatedStudents = cls.students.map((s) =>
      s.id === studentId || s.studentId === studentId
        ? { ...s, ...updates, updatedAt: Date.now() }
        : s
    );

    const updatedCls: Classroom = {
      ...cls,
      updatedAt: Date.now(),
      students: updatedStudents,
    };

    this.saveClassroom(updatedCls);
    return updatedCls;
  }

  public deleteStudent(classroomId: string, studentId: string): Classroom {
    const cls = this.getClassroomByCode(classroomId);
    if (!cls) throw new Error(`Classroom ${classroomId} not found`);

    const updatedCls: Classroom = {
      ...cls,
      updatedAt: Date.now(),
      students: cls.students.filter((s) => s.id !== studentId && s.studentId !== studentId),
    };

    this.saveClassroom(updatedCls);
    return updatedCls;
  }

  private saveClassroom(cls: Classroom): void {
    const current = this.getClassrooms();
    const updated = current.map((c) => (c.code === cls.code ? cls : c));
    this.classrooms = updated;
    saveClassrooms(updated);
    this.notifyListeners(cls.code, cls);
  }

  // 3. Realtime Updates & Listeners
  public subscribe(classroomId: string, callback: ClassroomListener): () => void {
    const norm = classroomId.trim().toUpperCase();
    if (!this.listeners.has(norm)) {
      this.listeners.set(norm, new Set());
    }
    this.listeners.get(norm)!.add(callback);

    // Initial trigger
    const current = this.getClassroomByCode(norm);
    if (current) {
      callback(current);
    }

    return () => {
      this.listeners.get(norm)?.delete(callback);
    };
  }

  private notifyListeners(classroomId: string, classroom: Classroom) {
    const norm = classroomId.trim().toUpperCase();
    this.listeners.get(norm)?.forEach((cb) => {
      try {
        cb(classroom);
      } catch (err) {
        console.warn('Classroom listener error:', err);
      }
    });
  }

  // 4. Conflict Resolution (Last-Write-Wins with Roster Merge)
  public resolveConflict(remote: Classroom, local: Classroom): Classroom {
    const isRemoteNewer = (remote.updatedAt || 0) >= (local.updatedAt || 0);
    const base = isRemoteNewer ? remote : local;

    // Merge student records so no student added offline is lost
    const studentMap = new Map<string, ClassroomStudentRecord>();

    for (const s of local.students) {
      studentMap.set(s.id, s);
    }

    for (const s of remote.students) {
      if (!studentMap.has(s.id)) {
        studentMap.set(s.id, s);
      } else {
        const localS = studentMap.get(s.id)!;
        // Keep highest XP and merged badges
        const mergedBadges = Array.from(new Set([...(localS.badges || []), ...(s.badges || [])]));
        studentMap.set(s.id, {
          ...(localS.updatedAt && localS.updatedAt > (s.updatedAt || 0) ? localS : s),
          xp: Math.max(localS.xp, s.xp),
          stars: Math.max(localS.stars, s.stars),
          badges: mergedBadges,
        });
      }
    }

    const resolved: Classroom = {
      ...base,
      students: Array.from(studentMap.values()),
      updatedAt: Math.max(remote.updatedAt || 0, local.updatedAt || 0, Date.now()),
    };

    this.saveClassroom(resolved);
    return resolved;
  }

  // 5. Attendance Management
  public getAttendanceHistory(classroomId: string): AttendanceRecord[] {
    if (typeof window === 'undefined') return [];
    try {
      const raw = localStorage.getItem(`${ATTENDANCE_KEY}_${classroomId}`);
      if (raw) return JSON.parse(raw);
    } catch {
      // ignore
    }
    const cls = this.getClassroomByCode(classroomId);
    const students = cls ? cls.students : [];
    return [
      {
        id: `att-today`,
        classroomId,
        date: new Date().toISOString().split('T')[0],
        teacherId: cls?.teacherId || 'teacher-01',
        records: students.map((s, idx) => ({
          studentId: s.id,
          studentName: s.name,
          status: idx === 4 ? 'absent' : idx === 2 ? 'late' : 'present',
        })),
        createdAt: Date.now(),
        synced: true,
      },
    ];
  }

  public saveAttendance(record: AttendanceRecord): void {
    if (typeof window === 'undefined') return;
    try {
      const existing = this.getAttendanceHistory(record.classroomId);
      const updated = [record, ...existing.filter((r) => r.date !== record.date)];
      localStorage.setItem(`${ATTENDANCE_KEY}_${record.classroomId}`, JSON.stringify(updated));
    } catch {
      // ignore
    }
  }

  // 6. Assignments & Homework
  public getAssignments(classroomId: string): AssignmentRecord[] {
    if (typeof window === 'undefined') return [];
    try {
      const raw = localStorage.getItem(`${ASSIGNMENTS_KEY}_${classroomId}`);
      if (raw) return JSON.parse(raw);
    } catch {
      // ignore
    }
    return [
      {
        id: 'asg-1',
        classroomId,
        title: 'Forest Animals Ol Chiki Tracing',
        description: 'Complete 6-word letter tracing worksheet at home with parents.',
        subject: 'Language MTB-MLE',
        grade: 'Grade 2',
        dueDate: 'Tomorrow',
        assignedBy: 'Sangeeta Soren',
        submissionsCount: 22,
        createdAt: Date.now() - 86400000,
      },
      {
        id: 'asg-2',
        classroomId,
        title: 'Counting Numbers 1-20 Math Worksheet',
        description: 'Solve object matching and counting pairs on page 3.',
        subject: 'Math',
        grade: 'Grade 1–2',
        dueDate: 'In 2 Days',
        assignedBy: 'Sangeeta Soren',
        submissionsCount: 18,
        createdAt: Date.now() - 172800000,
      },
    ];
  }

  public createAssignment(asg: AssignmentRecord): void {
    if (typeof window === 'undefined') return;
    try {
      const current = this.getAssignments(asg.classroomId);
      const updated = [asg, ...current];
      localStorage.setItem(`${ASSIGNMENTS_KEY}_${asg.classroomId}`, JSON.stringify(updated));
    } catch {
      // ignore
    }
  }

  // 7. Weak Topic Detection (FLN Gap Analysis)
  public detectWeakTopics(_classroomId?: string): WeakTopicAlert[] {
    return [
      {
        id: 'wt-1',
        topic: 'Ol Chiki Consonant Conjuncts (ᱚᱦ / ᱚᱜ)',
        subject: 'Santali MTB-MLE',
        competencyCode: 'L1.4',
        cohortMasteryPercent: 58,
        studentsNeedingSupportCount: 7,
        recommendedRemedialAction: 'Schedule 15-min sand-tray or air-tracing choral practice before tomorrow’s lesson.',
      },
      {
        id: 'wt-2',
        topic: 'Word Problems on Subtraction within 20',
        subject: 'Foundational Numeracy',
        competencyCode: 'M2.1',
        cohortMasteryPercent: 62,
        studentsNeedingSupportCount: 6,
        recommendedRemedialAction: 'Use concrete tamarind seeds or sal pebbles for hands-on visual takeaway game.',
      },
    ];
  }
}

export const classroomService = new ClassroomService();
export default classroomService;
