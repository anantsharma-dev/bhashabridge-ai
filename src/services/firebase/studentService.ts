import { studentRepo, classroomRepo } from '../../firebase/repository';
import type { StudentRecord } from '../../firebase/types';
import type { StudentProfile } from '../../types/auth';

/**
 * Create a student record (teachers create students; students never create accounts)
 */
export async function createStudent(
  teacherId: string,
  studentData: Omit<StudentRecord, 'id' | 'createdAt'>
): Promise<StudentRecord> {
  const newId = `stu_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
  const record: StudentRecord = {
    ...studentData,
    id: newId,
    teacherId,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };

  await studentRepo.save(record as any);

  // If classroomCode is set, update classroom student roster
  if (studentData.classroomCode) {
    const classrooms = await classroomRepo.queryWhere('code', '==', studentData.classroomCode);
    if (classrooms.length > 0) {
      const cls = classrooms[0];
      const students = cls.students || [];
      students.push({
        id: newId,
        name: record.name,
        nativeScript: record.nativeScript,
        pin: record.pin,
        grade: record.grade,
        motherTongue: record.motherTongue,
        avatarEmoji: record.avatarEmoji,
        stars: record.stars,
        xp: record.xp,
        badge: record.badge,
      });
      await classroomRepo.save({ ...cls, students });
    }
  }

  return record;
}

/**
 * Batch create multiple students for a classroom roster
 */
export async function batchCreateStudents(
  teacherId: string,
  classroomId: string,
  studentsList: Array<Omit<StudentRecord, 'id' | 'createdAt' | 'classroomId' | 'teacherId'>>
): Promise<StudentRecord[]> {
  const created: StudentRecord[] = [];
  for (const item of studentsList) {
    const res = await createStudent(teacherId, {
      ...item,
      classroomId,
      teacherId,
    });
    created.push(res);
  }
  return created;
}

/**
 * Fetch student by ID
 */
export async function getStudentById(studentId: string): Promise<StudentRecord | null> {
  const record = await studentRepo.getById(studentId);
  return record as unknown as StudentRecord | null;
}

/**
 * Fetch all students in a classroom
 */
export async function getStudentsByClassroom(classroomCodeOrId: string): Promise<StudentRecord[]> {
  // Query by classroomCode or classroomId
  const byCode = await studentRepo.queryWhere('classroomCode', '==', classroomCodeOrId);
  if (byCode.length > 0) return byCode as unknown as StudentRecord[];

  const byId = await studentRepo.queryWhere('classroomId', '==', classroomCodeOrId);
  if (byId.length > 0) return byId as unknown as StudentRecord[];

  // Check classroom embedded roster
  const cls = await classroomRepo.getById(classroomCodeOrId);
  if (cls && cls.students) {
    return cls.students.map((s) => ({
      id: s.id,
      name: s.name,
      pin: s.pin,
      classroomCode: cls.code,
      classroomId: cls.id || cls.code,
      schoolName: cls.schoolName,
      grade: s.grade,
      motherTongue: s.motherTongue,
      nativeScript: s.nativeScript,
      avatarEmoji: s.avatarEmoji,
      stars: s.stars,
      xp: s.xp,
      streakDays: 4,
      badge: s.badge,
      teacherId: cls.teacherId,
      createdAt: Date.now(),
    }));
  }

  // Fallback Dumka primary roster
  return [
    {
      id: 's1',
      name: 'Salma Soren (ᱥᱟᱞᱢᱟ ᱥᱚᱨᱮᱱ)',
      pin: '1234',
      classroomCode: 'JH-DUMKA-01',
      classroomId: 'JH-DUMKA-01',
      schoolName: 'GPS Dumka Tribal Primary School',
      grade: 'Grade 2',
      motherTongue: 'Santhali',
      nativeScript: 'Ol Chiki',
      avatarEmoji: '🐯',
      stars: 18,
      xp: 620,
      streakDays: 5,
      badge: 'star',
      teacherId: 'teacher-dumka-01',
      createdAt: Date.now() - 86400000 * 30,
    },
    {
      id: 's2',
      name: 'Birsa Besra (ᱵᱤᱨᱥᱟ ᱵᱮᱥᱨᱟ)',
      pin: '1234',
      classroomCode: 'JH-DUMKA-01',
      classroomId: 'JH-DUMKA-01',
      schoolName: 'GPS Dumka Tribal Primary School',
      grade: 'Grade 2',
      motherTongue: 'Santhali',
      nativeScript: 'Ol Chiki',
      avatarEmoji: '🐘',
      stars: 12,
      xp: 410,
      streakDays: 3,
      badge: 'on_track',
      teacherId: 'teacher-dumka-01',
      createdAt: Date.now() - 86400000 * 30,
    },
    {
      id: 's3',
      name: 'Kanu Hansda (ᱠᱟᱹᱱᱩ ᱦᱟᱸᱥᱫᱟ)',
      pin: '1234',
      classroomCode: 'JH-DUMKA-01',
      classroomId: 'JH-DUMKA-01',
      schoolName: 'GPS Dumka Tribal Primary School',
      grade: 'Grade 2',
      motherTongue: 'Santhali',
      nativeScript: 'Ol Chiki',
      avatarEmoji: '🦜',
      stars: 9,
      xp: 310,
      streakDays: 2,
      badge: 'needs_help',
      teacherId: 'teacher-dumka-01',
      createdAt: Date.now() - 86400000 * 30,
    },
  ];
}

/**
 * Update student record
 */
export async function updateStudent(
  studentId: string,
  updates: Partial<StudentRecord>
): Promise<StudentRecord> {
  const existing = await getStudentById(studentId);
  const updated: StudentRecord = {
    id: studentId,
    name: updates.name || existing?.name || 'Student',
    pin: updates.pin || existing?.pin || '1234',
    classroomCode: updates.classroomCode || existing?.classroomCode || 'JH-DUMKA-01',
    classroomId: updates.classroomId || existing?.classroomId || 'JH-DUMKA-01',
    schoolName: updates.schoolName || existing?.schoolName || 'GPS Dumka Primary School',
    grade: updates.grade || existing?.grade || 'Grade 2',
    motherTongue: updates.motherTongue || existing?.motherTongue || 'Santhali',
    nativeScript: updates.nativeScript || existing?.nativeScript || 'Ol Chiki',
    avatarEmoji: updates.avatarEmoji || existing?.avatarEmoji || '🐯',
    stars: updates.stars !== undefined ? updates.stars : existing?.stars ?? 0,
    xp: updates.xp !== undefined ? updates.xp : existing?.xp ?? 0,
    streakDays: updates.streakDays !== undefined ? updates.streakDays : existing?.streakDays ?? 1,
    badge: updates.badge !== undefined ? updates.badge : existing?.badge ?? 'on_track',
    teacherId: updates.teacherId || existing?.teacherId || 'teacher-dumka-01',
    createdAt: existing?.createdAt || Date.now(),
    updatedAt: Date.now(),
  };

  await studentRepo.save(updated as any);
  return updated;
}

/**
 * Delete student record
 */
export async function deleteStudent(studentId: string): Promise<void> {
  await studentRepo.delete(studentId);
}

/**
 * Student joins classroom with Code and 4-digit PIN
 */
export async function joinClassroomByCode(
  code: string,
  studentId: string,
  pin: string
): Promise<StudentProfile> {
  const cleanCode = code.trim().toUpperCase();
  const students = await getStudentsByClassroom(cleanCode);
  const found = students.find(
    (s) => s.id.toLowerCase() === studentId.trim().toLowerCase() || s.name.toLowerCase() === studentId.trim().toLowerCase()
  );

  if (!found) {
    throw new Error(`Student ${studentId} not found in classroom ${cleanCode}. Please ask your teacher.`);
  }

  if (found.pin && found.pin !== pin.trim()) {
    throw new Error('Incorrect 4-digit PIN.');
  }

  return {
    id: found.id,
    role: 'student',
    name: found.name,
    nativeScript: found.nativeScript,
    classroomCode: found.classroomCode,
    schoolName: found.schoolName,
    grade: found.grade,
    motherTongue: found.motherTongue,
    avatarEmoji: found.avatarEmoji,
    stars: found.stars,
    xp: found.xp,
    streakDays: found.streakDays,
    badge: found.badge,
  };
}
