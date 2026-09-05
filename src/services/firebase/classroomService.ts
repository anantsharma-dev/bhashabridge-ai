import { classroomRepo, assignmentRepo, attendanceRepo } from '../../firebase/repository';
import type { Classroom, ClassroomStudentRecord } from '../../types/auth';
import type { AssignmentRecord, AttendanceRecord } from '../../firebase/types';

/**
 * 1. CLASSROOM CRUD
 */

export async function createClassroom(
  teacherId: string,
  classroomData: Omit<Classroom, 'id'>
): Promise<Classroom> {
  const cleanCode = classroomData.code.trim().toUpperCase();
  const id = `cls_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
  const classroom: Classroom = {
    ...classroomData,
    id,
    code: cleanCode,
    teacherId,
  };
  await classroomRepo.save(classroom);
  return classroom;
}

export async function getClassroomById(classroomId: string): Promise<Classroom | null> {
  return classroomRepo.getById(classroomId);
}

export async function getClassroomByCode(code: string): Promise<Classroom | null> {
  const clean = code.trim().toUpperCase();
  const list = await classroomRepo.queryWhere('code', '==', clean);
  if (list.length > 0) return list[0];

  // Also check by id
  const byId = await classroomRepo.getById(clean);
  if (byId) return byId;

  // Fallback demo classroom
  if (clean === 'JH-DUMKA-01' || clean === 'RNC-402') {
    return {
      id: clean,
      code: clean,
      schoolName: 'GPS Dumka Tribal Primary School',
      teacherName: 'Sangeeta Soren',
      teacherId: 'teacher-dumka-01',
      district: 'Dumka',
      block: 'Shikaripara',
      grades: 'Grade 1–2',
      students: [],
    };
  }

  return null;
}

export async function getClassroomsByTeacher(teacherId: string): Promise<Classroom[]> {
  const classrooms = await classroomRepo.queryWhere('teacherId', '==', teacherId);
  if (classrooms.length > 0) return classrooms;

  // Return primary default classroom
  return [
    {
      id: 'JH-DUMKA-01',
      code: 'JH-DUMKA-01',
      schoolName: 'GPS Dumka Tribal Primary School',
      teacherName: 'Sangeeta Soren',
      teacherId,
      district: 'Dumka',
      block: 'Shikaripara',
      grades: 'Grade 1–2',
      students: [],
    },
  ];
}

export async function updateClassroom(
  classroomId: string,
  updates: Partial<Classroom>
): Promise<Classroom> {
  const existing = await classroomRepo.getById(classroomId);
  const updated: Classroom = {
    id: classroomId,
    code: updates.code || existing?.code || classroomId,
    schoolName: updates.schoolName || existing?.schoolName || 'GPS Dumka Tribal Primary School',
    teacherName: updates.teacherName || existing?.teacherName || 'Sangeeta Soren',
    teacherId: updates.teacherId || existing?.teacherId || 'teacher-01',
    district: updates.district || existing?.district || 'Dumka',
    block: updates.block || existing?.block || 'Shikaripara',
    grades: updates.grades || existing?.grades || 'Grade 2',
    students: updates.students || existing?.students || [],
  };
  await classroomRepo.save(updated);
  return updated;
}

export async function deleteClassroom(classroomId: string): Promise<void> {
  await classroomRepo.delete(classroomId);
}

/**
 * 2. ASSIGNMENTS CRUD
 */

export async function createAssignment(
  assignment: Omit<AssignmentRecord, 'id' | 'createdAt'>
): Promise<AssignmentRecord> {
  const id = `asg_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
  const record: AssignmentRecord = {
    ...assignment,
    id,
    createdAt: Date.now(),
  };
  await assignmentRepo.save(record);
  return record;
}

export async function getAssignmentsByClassroom(classroomId: string): Promise<AssignmentRecord[]> {
  const list = await assignmentRepo.queryWhere('classroomId', '==', classroomId);
  if (list.length > 0) return list;

  // Fallback initial classroom assignments
  return [
    {
      id: 'asg-01',
      classroomId,
      title: 'Animals in Hindi & Santhali Flashcards',
      description: 'Practice 10 animal names and record your pronunciation in Ol Chiki.',
      subject: 'Language (MTB-MLE)',
      grade: 'Grade 2',
      dueDate: new Date(Date.now() + 86400000 * 2).toISOString().slice(0, 10),
      assignedBy: 'Sangeeta Soren',
      submissionsCount: 16,
      createdAt: Date.now() - 86400000,
    },
    {
      id: 'asg-02',
      classroomId,
      title: 'Sohrai Art Shapes & Numbers Worksheet',
      description: 'Count tribal motifs and complete tracing activity sheet.',
      subject: 'Numeracy (FNN)',
      grade: 'Grade 2',
      dueDate: new Date(Date.now() + 86400000 * 3).toISOString().slice(0, 10),
      assignedBy: 'Sangeeta Soren',
      submissionsCount: 12,
      createdAt: Date.now() - 86400000 * 2,
    },
    {
      id: 'asg-03',
      classroomId,
      title: 'The Wise Elephant of Dalma (Read Along)',
      description: 'Listen to the Santali story and answer 3 comprehension questions.',
      subject: 'Stories & Culture',
      grade: 'Grade 2',
      dueDate: new Date(Date.now() + 86400000 * 4).toISOString().slice(0, 10),
      assignedBy: 'Sangeeta Soren',
      submissionsCount: 19,
      createdAt: Date.now() - 86400000 * 3,
    },
  ];
}

export async function deleteAssignment(assignmentId: string): Promise<void> {
  await assignmentRepo.delete(assignmentId);
}

/**
 * 3. ATTENDANCE CRUD
 */

export async function recordAttendance(
  attendance: Omit<AttendanceRecord, 'id' | 'createdAt' | 'synced'>
): Promise<AttendanceRecord> {
  const id = `att_${attendance.classroomId}_${attendance.date}`;
  const record: AttendanceRecord = {
    ...attendance,
    id,
    createdAt: Date.now(),
    synced: true,
  };
  await attendanceRepo.save(record);
  return record;
}

export async function getAttendanceByDate(
  classroomId: string,
  date: string
): Promise<AttendanceRecord | null> {
  const id = `att_${classroomId}_${date}`;
  const record = await attendanceRepo.getById(id);
  if (record) return record;

  const queried = await attendanceRepo.queryWhere('date', '==', date);
  const found = queried.find((a) => a.classroomId === classroomId);
  return found || null;
}

export async function getAttendanceHistory(
  classroomId: string,
  limitDays = 14
): Promise<AttendanceRecord[]> {
  const list = await attendanceRepo.queryWhere('classroomId', '==', classroomId);
  if (list.length > 0) {
    return list.slice(0, limitDays);
  }

  // Generate realistic recent attendance records for offline/demo
  const records: AttendanceRecord[] = [];
  for (let i = 0; i < Math.min(limitDays, 7); i++) {
    const d = new Date(Date.now() - 86400000 * i).toISOString().slice(0, 10);
    records.push({
      id: `att_${classroomId}_${d}`,
      classroomId,
      date: d,
      teacherId: 'teacher-01',
      records: [
        { studentId: 's1', studentName: 'Salma Soren', status: 'present' },
        { studentId: 's2', studentName: 'Birsa Besra', status: 'present' },
        { studentId: 's3', studentName: 'Kanu Hansda', status: i === 2 ? 'late' : 'present' },
      ],
      createdAt: Date.now() - 86400000 * i,
      synced: true,
    });
  }
  return records;
}

/**
 * 4. REALTIME STUDENT MANAGEMENT & SUBSCRIPTION
 */

export async function addStudentToClassroomLive(
  classroomId: string,
  student: ClassroomStudentRecord
): Promise<Classroom> {
  const cls = await getClassroomByCode(classroomId) || await getClassroomById(classroomId);
  if (!cls) throw new Error(`Classroom ${classroomId} not found`);

  const updated: Classroom = {
    ...cls,
    updatedAt: Date.now(),
    students: [student, ...cls.students],
  };

  await classroomRepo.save(updated);
  return updated;
}

export async function updateStudentInClassroomLive(
  classroomId: string,
  studentId: string,
  updates: Partial<ClassroomStudentRecord>
): Promise<Classroom> {
  const cls = await getClassroomByCode(classroomId) || await getClassroomById(classroomId);
  if (!cls) throw new Error(`Classroom ${classroomId} not found`);

  const updatedStudents = cls.students.map((s) =>
    s.id === studentId || s.studentId === studentId
      ? { ...s, ...updates, updatedAt: Date.now() }
      : s
  );

  const updated: Classroom = {
    ...cls,
    updatedAt: Date.now(),
    students: updatedStudents,
  };

  await classroomRepo.save(updated);
  return updated;
}

export async function deleteStudentFromClassroomLive(
  classroomId: string,
  studentId: string
): Promise<Classroom> {
  const cls = await getClassroomByCode(classroomId) || await getClassroomById(classroomId);
  if (!cls) throw new Error(`Classroom ${classroomId} not found`);

  const updated: Classroom = {
    ...cls,
    updatedAt: Date.now(),
    students: cls.students.filter((s) => s.id !== studentId && s.studentId !== studentId),
  };

  await classroomRepo.save(updated);
  return updated;
}

export function subscribeToClassroomLive(
  classroomId: string,
  onUpdate: (c: Classroom) => void
): () => void {
  const norm = classroomId.trim().toUpperCase();
  return classroomRepo.subscribeById(norm, (item) => {
    if (item) {
      onUpdate(item);
    }
  });
}
