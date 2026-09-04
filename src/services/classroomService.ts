import type { Classroom, ClassroomStudentRecord, AttendanceRecord, AssignmentRecord } from '../firebase/types';
import { INITIAL_CLASSROOMS } from '../data/classrooms';

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

class ClassroomService {
  private classrooms: Classroom[] = INITIAL_CLASSROOMS;

  public getClassrooms(): Classroom[] {
    return this.classrooms;
  }

  public getClassroomByCode(code: string): Classroom | null {
    return this.classrooms.find((c) => c.code === code) || this.classrooms[0];
  }

  // Attendance management
  public getAttendanceHistory(classroomId: string): AttendanceRecord[] {
    if (typeof window === 'undefined') return [];
    try {
      const raw = localStorage.getItem(`${ATTENDANCE_KEY}_${classroomId}`);
      if (raw) return JSON.parse(raw);
    } catch {
      // ignore
    }
    return [
      {
        id: 'att-today',
        classroomId,
        date: new Date().toISOString().split('T')[0],
        teacherId: 'teacher-dumka-01',
        records: [
          { studentId: 's1', studentName: 'Ravi Marandi', status: 'present' },
          { studentId: 's2', studentName: 'Pooja Hansda', status: 'present' },
          { studentId: 's3', studentName: 'Amit Murmu', status: 'late' },
          { studentId: 's4', studentName: 'Sunita Hembrom', status: 'present' },
          { studentId: 's5', studentName: 'Karan Tudu', status: 'absent' },
        ],
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

  // Assignments & Homework
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

  // Weak Topic Detection (FLN Gap Analysis)
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

  // Student Enrollment
  public addStudentToClassroom(classroomId: string, student: ClassroomStudentRecord): Classroom {
    const cls = this.getClassroomByCode(classroomId) || this.classrooms[0];
    const updated = {
      ...cls,
      students: [student, ...cls.students],
    };
    this.classrooms = this.classrooms.map((c) => (c.code === cls.code ? updated : c));
    return updated;
  }
}

export const classroomService = new ClassroomService();
export default classroomService;
