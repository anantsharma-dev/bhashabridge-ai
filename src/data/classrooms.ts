import type { Classroom, ClassroomStudentRecord } from '../types/auth';

/**
 * Seed data for Jharkhand MTB-MLE Classrooms (Grade 1 & 2)
 * Used for Student Classroom Code + Student ID + PIN authentication
 * and teacher classroom sync.
 */
export const INITIAL_CLASSROOMS: Classroom[] = [
  {
    id: 'JH-DUMKA-01',
    code: 'JH-DUMKA-01',
    schoolName: 'GPS Dumka Tribal Primary School',
    teacherName: 'Sangeeta Soren',
    teacherId: 'teacher-dumka-01',
    district: 'Dumka',
    block: 'Ranishwar Block',
    grades: 'Grade 1 & Grade 2 MTB-MLE',
    createdAt: Date.now() - 30 * 86400000,
    updatedAt: Date.now(),
    students: [
      {
        id: 's1',
        studentId: 'STU-DUM-001',
        name: 'Ravi Marandi',
        nativeScript: 'ᱨᱚᱵᱤ ᱢᱟᱨᱟᱱᱰᱤ',
        pin: '1234',
        grade: 'Grade 2',
        motherTongue: 'Santali (Ol Chiki)',
        village: 'Kathikund',
        avatarEmoji: '👦',
        stars: 48,
        xp: 1240,
        badge: 'star',
        badges: ['FLN Star', 'Ol Chiki Reader', 'Seed Counter'],
        readingLevel: 'Level 2 (Transitional)',
        readingMinutes: 52,
        vocabMastered: 42,
        quizAccuracy: 92,
        dailyXp: [45, 60, 90, 75, 110, 85, 50],
      },
      {
        id: 's2',
        studentId: 'STU-DUM-002',
        name: 'Pooja Hansda',
        nativeScript: 'ᱯᱩᱡᱟ ᱦᱟᱸᱥᱫᱟᱜ',
        pin: '2345',
        grade: 'Grade 2',
        motherTongue: 'Santali (Ol Chiki)',
        village: 'Masalia',
        avatarEmoji: '👧',
        stars: 42,
        xp: 1110,
        badge: 'star',
        badges: ['Story Master', 'Sohrai Artist'],
        readingLevel: 'Level 2 (Transitional)',
        readingMinutes: 46,
        vocabMastered: 38,
        quizAccuracy: 88,
        dailyXp: [40, 55, 70, 65, 95, 80, 45],
      },
      {
        id: 's3',
        studentId: 'STU-DUM-003',
        name: 'Amit Murmu',
        nativeScript: 'ᱚᱢᱤᱛ ᱢᱩᱨᱢᱩ',
        pin: '3456',
        grade: 'Grade 1',
        motherTongue: 'Santali (Ol Chiki)',
        village: 'Shikaripara',
        avatarEmoji: '👦',
        stars: 28,
        xp: 750,
        badge: 'needs_help',
        badges: ['Curious Learner'],
        readingLevel: 'Level 1 (Emergent)',
        readingMinutes: 28,
        vocabMastered: 24,
        quizAccuracy: 64,
        dailyXp: [25, 30, 45, 40, 50, 40, 20],
      },
      {
        id: 's4',
        studentId: 'STU-DUM-004',
        name: 'Sunita Hembrom',
        nativeScript: 'ᱥᱩᱱᱤᱛᱟ ᱦᱮᱢᱵᱽᱨᱚᱢ',
        pin: '4567',
        grade: 'Grade 1',
        motherTongue: 'Santali (Ol Chiki)',
        village: 'Jama',
        avatarEmoji: '👧',
        stars: 36,
        xp: 920,
        badge: 'on_track',
        badges: ['Vocabulary Explorer', 'Tumdak Drummer'],
        readingLevel: 'Level 1 (Emergent)',
        readingMinutes: 36,
        vocabMastered: 31,
        quizAccuracy: 82,
        dailyXp: [30, 40, 55, 50, 70, 55, 35],
      },
      {
        id: 's5',
        studentId: 'STU-DUM-005',
        name: 'Babulal Tudu',
        nativeScript: 'ᱵᱟᱹᱵᱩᱞᱟᱞ ᱴᱩᱰᱩ',
        pin: '5678',
        grade: 'Grade 1',
        motherTongue: 'Santali (Ol Chiki)',
        village: 'Raneshwar',
        avatarEmoji: '👦',
        stars: 31,
        xp: 810,
        badge: 'on_track',
        badges: ['Attendance Champion'],
        readingLevel: 'Level 1 (Emergent)',
        readingMinutes: 32,
        vocabMastered: 27,
        quizAccuracy: 78,
        dailyXp: [30, 35, 45, 45, 60, 50, 25],
      },
      {
        id: 's6',
        studentId: 'STU-DUM-006',
        name: 'Malati Soren',
        nativeScript: 'ᱢᱟᱞᱚᱛᱤ ᱥᱚᱨᱮᱱ',
        pin: '6789',
        grade: 'Grade 2',
        motherTongue: 'Santali (Ol Chiki)',
        village: 'Kathikund',
        avatarEmoji: '👧',
        stars: 45,
        xp: 1180,
        badge: 'star',
        badges: ['FLN Star', 'Nature Guard'],
        readingLevel: 'Level 2 (Transitional)',
        readingMinutes: 48,
        vocabMastered: 40,
        quizAccuracy: 90,
        dailyXp: [40, 50, 75, 70, 100, 75, 40],
      },
    ],
  },
  {
    id: 'JH-RANCHI-02',
    code: 'JH-RANCHI-02',
    schoolName: 'Govt Model Primary School, Bundu',
    teacherName: 'Birsa Munda',
    teacherId: 'teacher-ranchi-02',
    district: 'Ranchi',
    block: 'Bundu Block',
    grades: 'Grade 2 & Grade 3 MTB-MLE',
    createdAt: Date.now() - 45 * 86400000,
    updatedAt: Date.now(),
    students: [
      {
        id: 's101',
        studentId: 'STU-RNC-101',
        name: 'Arjun Hembrom',
        nativeScript: 'ᱟᱨᱡᱩᱱ ᱦᱮᱢᱵᱽᱨᱚᱢ',
        pin: '1111',
        grade: 'Grade 2',
        motherTongue: 'Santali (Ol Chiki)',
        village: 'Bundu',
        avatarEmoji: '👦',
        stars: 34,
        xp: 890,
        badge: 'on_track',
        badges: ['Math Wizard'],
        readingLevel: 'Level 2 (Transitional)',
        readingMinutes: 38,
        vocabMastered: 33,
        quizAccuracy: 84,
        dailyXp: [35, 45, 55, 50, 65, 60, 30],
      },
      {
        id: 's102',
        studentId: 'STU-RNC-102',
        name: 'Champa Kisku',
        nativeScript: 'ᱪᱟᱢᱯᱟ ᱠᱤᱥᱠᱩ',
        pin: '2222',
        grade: 'Grade 3',
        motherTongue: 'Santali (Ol Chiki)',
        village: 'Tamar',
        avatarEmoji: '👧',
        stars: 52,
        xp: 1390,
        badge: 'star',
        badges: ['FLN Star', 'Birsa Scholar', 'Hul Hero'],
        readingLevel: 'Level 3 (Fluent)',
        readingMinutes: 58,
        vocabMastered: 48,
        quizAccuracy: 95,
        dailyXp: [50, 70, 95, 85, 120, 90, 60],
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

export function saveClassrooms(classrooms: Classroom[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(classrooms));
  } catch (e) {
    console.warn('Could not save classrooms to localStorage', e);
  }
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
