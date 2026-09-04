import type { Classroom, ClassroomStudentRecord } from '../types/auth';

/**
 * Seed data for Jharkhand MTB-MLE Classrooms (Grade 1 & 2)
 * Used for Student Classroom Code + Student ID + PIN authentication
 * and teacher classroom sync.
 */
export const INITIAL_CLASSROOMS: Classroom[] = [
  {
    code: 'JH-DUMKA-01',
    schoolName: 'GPS Dumka Tribal Primary School',
    teacherName: 'Sangeeta Soren',
    teacherId: 'teacher-dumka-01',
    district: 'Dumka',
    block: 'Ranishwar Block',
    grades: 'Grade 1 & Grade 2 MTB-MLE',
    students: [
      {
        id: 's1',
        name: 'Ravi Marandi',
        nativeScript: 'ᱨᱚᱵᱤ ᱢᱟᱨᱟᱱᱰᱤ',
        pin: '1234',
        grade: 'Grade 2',
        motherTongue: 'Santali (Ol Chiki)',
        avatarEmoji: '👦',
        stars: 48,
        xp: 1240,
        badge: 'star',
      },
      {
        id: 's2',
        name: 'Pooja Hansda',
        nativeScript: 'ᱯᱩᱡᱟ ᱦᱟᱸᱥᱫᱟᱜ',
        pin: '2345',
        grade: 'Grade 2',
        motherTongue: 'Santali (Ol Chiki)',
        avatarEmoji: '👧',
        stars: 42,
        xp: 1110,
        badge: 'star',
      },
      {
        id: 's3',
        name: 'Amit Murmu',
        nativeScript: 'ᱚᱢᱤᱛ ᱢᱩᱨᱢᱩ',
        pin: '3456',
        grade: 'Grade 1',
        motherTongue: 'Santali (Ol Chiki)',
        avatarEmoji: '👦',
        stars: 28,
        xp: 750,
        badge: 'needs_help',
      },
      {
        id: 's4',
        name: 'Sunita Hembrom',
        nativeScript: 'ᱥᱩᱱᱤᱛᱟ ᱦᱮᱢᱵᱽᱨᱚᱢ',
        pin: '4567',
        grade: 'Grade 1',
        motherTongue: 'Santali (Ol Chiki)',
        avatarEmoji: '👧',
        stars: 36,
        xp: 920,
        badge: 'on_track',
      },
      {
        id: 's5',
        name: 'Babulal Tudu',
        nativeScript: 'ᱵᱟᱹᱵᱩᱞᱟᱞ ᱴᱩᱰᱩ',
        pin: '5678',
        grade: 'Grade 1',
        motherTongue: 'Santali (Ol Chiki)',
        avatarEmoji: '👦',
        stars: 31,
        xp: 810,
        badge: 'on_track',
      },
      {
        id: 's6',
        name: 'Malati Soren',
        nativeScript: 'ᱢᱟᱞᱚᱛᱤ ᱥᱚᱨᱮᱱ',
        pin: '6789',
        grade: 'Grade 2',
        motherTongue: 'Santali (Ol Chiki)',
        avatarEmoji: '👧',
        stars: 45,
        xp: 1180,
        badge: 'star',
      },
    ],
  },
  {
    code: 'JH-RANCHI-02',
    schoolName: 'Govt Model Primary School, Bundu',
    teacherName: 'Birsa Munda',
    teacherId: 'teacher-ranchi-02',
    district: 'Ranchi',
    block: 'Bundu Block',
    grades: 'Grade 2 & Grade 3 MTB-MLE',
    students: [
      {
        id: 's101',
        name: 'Arjun Hembrom',
        nativeScript: 'ᱟᱨᱡᱩᱱ ᱦᱮᱢᱵᱽᱨᱚᱢ',
        pin: '1111',
        grade: 'Grade 2',
        motherTongue: 'Santali (Ol Chiki)',
        avatarEmoji: '👦',
        stars: 34,
        xp: 890,
        badge: 'on_track',
      },
      {
        id: 's102',
        name: 'Champa Kisku',
        nativeScript: 'ᱪᱟᱢᱯᱟ ᱠᱤᱥᱠᱩ',
        pin: '2222',
        grade: 'Grade 3',
        motherTongue: 'Santali (Ol Chiki)',
        avatarEmoji: '👧',
        stars: 52,
        xp: 1390,
        badge: 'star',
      },
    ],
  },
];

const STORAGE_KEY = 'bhashabridge_classrooms_v1';

/**
 * Get all classrooms (from local storage if modified, or fallback to default)
 */
export function getClassrooms(): Classroom[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Could not read classrooms from localStorage', e);
  }
  return INITIAL_CLASSROOMS;
}

/**
 * Find classroom by code (case-insensitive)
 */
export function findClassroom(code: string): Classroom | undefined {
  const norm = code.trim().toUpperCase();
  return getClassrooms().find((c) => c.code.toUpperCase() === norm);
}

/**
 * Find student in a classroom by student ID
 */
export function findStudent(classroomCode: string, studentId: string): { classroom: Classroom; student: ClassroomStudentRecord } | null {
  const classroom = findClassroom(classroomCode);
  if (!classroom) return null;

  const normId = studentId.trim().toLowerCase();
  const student = classroom.students.find(
    (s) => s.id.toLowerCase() === normId || s.name.toLowerCase() === studentId.trim().toLowerCase()
  );

  if (!student) return null;
  return { classroom, student };
}

/**
 * Validate Student login credentials
 */
export function validateStudentLogin(
  classroomCode: string,
  studentId: string,
  pin: string
): { success: boolean; error?: string; classroom?: Classroom; student?: ClassroomStudentRecord } {
  const normCode = classroomCode.trim().toUpperCase();
  if (!normCode) {
    return { success: false, error: 'Please enter your Classroom Code (उदा. JH-DUMKA-01)' };
  }

  const classroom = findClassroom(normCode);
  if (!classroom) {
    return {
      success: false,
      error: `Classroom code "${normCode}" not found. Try demo code "JH-DUMKA-01".`,
    };
  }

  const normId = studentId.trim().toLowerCase();
  if (!normId) {
    return { success: false, error: 'Please enter your Student ID or select your name.' };
  }

  const student = classroom.students.find(
    (s) => s.id.toLowerCase() === normId || s.name.toLowerCase() === studentId.trim().toLowerCase()
  );

  if (!student) {
    return {
      success: false,
      error: `Student ID "${studentId}" not found in ${classroom.schoolName}.`,
    };
  }

  if (student.pin !== pin.trim()) {
    return { success: false, error: 'Incorrect 4-digit PIN. Please try again or ask your teacher.' };
  }

  return { success: true, classroom, student };
}
