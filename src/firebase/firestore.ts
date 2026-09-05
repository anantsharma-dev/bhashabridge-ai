import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  increment,
  type Unsubscribe,
} from 'firebase/firestore';
import { db } from './config';

// ==========================================
// 1. DATA MODELS & SCHEMAS
// ==========================================

export interface Teacher {
  teacherId: string; // Firebase Auth UID
  name: string;
  email: string;
  phone: string;
  district: string;
  block: string;
  school: string;
  role: 'teacher' | 'admin';
  languagePreference: string;
  avatar: string;
  createdAt: number;
  updatedAt: number;
  lastLogin: number;
}

export interface Student {
  studentId: string;
  teacherId: string;
  classroomId: string;
  rollNumber: number;
  name: string;
  gender: 'male' | 'female' | 'other';
  grade: string;
  motherTongue: string;
  district: string;
  block: string;
  school: string;
  attendance: Record<string, 'present' | 'absent' | 'late'>; // e.g. "2026-09-05": "present"
  avatar: string;
  createdAt: number;
  updatedAt?: number;
}

export interface School {
  schoolId: string;
  district: string;
  block: string;
  schoolName: string;
  udiseCode: string;
  principal: string;
  teachers: string[]; // Teacher UIDs
}

export interface District {
  districtId: string;
  districtName: string;
  blocks: string[];
}

export interface Classroom {
  classroomId: string;
  teacherId: string;
  grade: string;
  section: string;
  subject: string;
  language: string;
  classCode: string; // e.g. DUM-G2-AB12
  studentCount: number;
  createdAt: number;
  updatedAt?: number;
}

// ==========================================
// 2. AUTO CLASS CODE GENERATION
// Example: DUM-G2-AB12
// Based on district + grade + random hash.
// ==========================================

export function generateClassCode(district: string, grade: string): string {
  // District 3-letter prefix (e.g. Dumka -> DUM, Ranchi -> RAN)
  const distPrefix = (district.replace(/[^a-zA-Z]/g, '').slice(0, 3) || 'JHK').toUpperCase();

  // Grade clean abbreviation (e.g. "Grade 2" -> "G2", "2" -> "G2")
  const gradeDigits = grade.replace(/\D/g, '');
  const gradeTag = gradeDigits ? `G${gradeDigits}` : 'G1';

  // 4-character alphanumeric hash
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let hash = '';
  for (let i = 0; i < 4; i++) {
    hash += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return `${distPrefix}-${gradeTag}-${hash}`;
}

// ==========================================
// 3. TEACHER OPERATIONS
// ==========================================

export const teachersCol = collection(db, 'teachers');

export async function createTeacherProfileDoc(
  teacherId: string,
  data: Partial<Teacher>
): Promise<Teacher> {
  const teacherDocRef = doc(db, 'teachers', teacherId);
  const now = Date.now();

  const profile: Teacher = {
    teacherId,
    name: data.name || 'Jharkhand Primary Teacher',
    email: data.email || '',
    phone: data.phone || '',
    district: data.district || 'Dumka',
    block: data.block || 'Dumka Sadar',
    school: data.school || 'GPS Dumka Tribal Primary School',
    role: data.role || 'teacher',
    languagePreference: data.languagePreference || 'Hindi + Santali (Ol Chiki)',
    avatar: data.avatar || '👩‍🏫',
    createdAt: data.createdAt || now,
    updatedAt: now,
    lastLogin: now,
  };

  await setDoc(teacherDocRef, profile, { merge: true });
  return profile;
}

export async function getTeacherProfileDoc(teacherId: string): Promise<Teacher | null> {
  const docRef = doc(db, 'teachers', teacherId);
  const snap = await getDoc(docRef);
  if (snap.exists()) {
    return snap.data() as Teacher;
  }
  return null;
}

export async function updateTeacherProfileDoc(
  teacherId: string,
  updates: Partial<Teacher>
): Promise<void> {
  const docRef = doc(db, 'teachers', teacherId);
  await updateDoc(docRef, {
    ...updates,
    updatedAt: Date.now(),
  });
}

export function listenToTeacherProfile(
  teacherId: string,
  callback: (teacher: Teacher | null) => void
): Unsubscribe {
  const docRef = doc(db, 'teachers', teacherId);
  return onSnapshot(
    docRef,
    (snap) => {
      if (snap.exists()) {
        callback(snap.data() as Teacher);
      } else {
        callback(null);
      }
    },
    (err) => {
      console.warn('Teacher snapshot listener warning:', err);
    }
  );
}

// ==========================================
// 4. CLASSROOM OPERATIONS
// ==========================================

export const classroomsCol = collection(db, 'classrooms');

export async function createClassroomDoc(
  data: Omit<Classroom, 'classroomId' | 'classCode' | 'createdAt' | 'studentCount'> & {
    classCode?: string;
  }
): Promise<Classroom> {
  const classroomId = `cls_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
  const classCode = data.classCode || generateClassCode('DUM', data.grade);
  const now = Date.now();

  const classroom: Classroom = {
    classroomId,
    teacherId: data.teacherId,
    grade: data.grade,
    section: data.section || 'A',
    subject: data.subject || 'All Subjects (MTB-MLE)',
    language: data.language || 'Hindi + Santali (Ol Chiki)',
    classCode,
    studentCount: 0,
    createdAt: now,
    updatedAt: now,
  };

  await setDoc(doc(db, 'classrooms', classroomId), classroom);
  return classroom;
}

export async function getClassroomDoc(classroomId: string): Promise<Classroom | null> {
  const snap = await getDoc(doc(db, 'classrooms', classroomId));
  return snap.exists() ? (snap.data() as Classroom) : null;
}

export async function getClassroomsByTeacher(teacherId: string): Promise<Classroom[]> {
  const q = query(
    classroomsCol,
    where('teacherId', '==', teacherId),
    orderBy('createdAt', 'desc')
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => d.data() as Classroom);
}

export async function getClassroomByCode(classCode: string): Promise<Classroom | null> {
  const q = query(classroomsCol, where('classCode', '==', classCode.trim().toUpperCase()));
  const snap = await getDocs(q);
  if (!snap.empty) {
    return snap.docs[0].data() as Classroom;
  }
  return null;
}

export async function updateClassroomDoc(
  classroomId: string,
  updates: Partial<Classroom>
): Promise<void> {
  await updateDoc(doc(db, 'classrooms', classroomId), {
    ...updates,
    updatedAt: Date.now(),
  });
}

export async function deleteClassroomDoc(classroomId: string): Promise<void> {
  await deleteDoc(doc(db, 'classrooms', classroomId));
}

export function listenToClassroomsByTeacher(
  teacherId: string,
  callback: (classrooms: Classroom[]) => void
): Unsubscribe {
  const q = query(
    classroomsCol,
    where('teacherId', '==', teacherId),
    orderBy('createdAt', 'desc')
  );
  return onSnapshot(
    q,
    (snap) => {
      const list = snap.docs.map((d) => d.data() as Classroom);
      callback(list);
    },
    (err) => {
      console.warn('Classrooms listener warning:', err);
    }
  );
}

// ==========================================
// 5. STUDENT OPERATIONS
// ==========================================

export const studentsCol = collection(db, 'students');

export async function createStudentDoc(
  data: Omit<Student, 'studentId' | 'createdAt'>
): Promise<Student> {
  const studentId = `stu_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
  const now = Date.now();

  const student: Student = {
    ...data,
    studentId,
    attendance: data.attendance || {},
    createdAt: now,
    updatedAt: now,
  };

  await setDoc(doc(db, 'students', studentId), student);

  // Increment studentCount in classroom
  try {
    await updateDoc(doc(db, 'classrooms', data.classroomId), {
      studentCount: increment(1),
      updatedAt: now,
    });
  } catch (err) {
    console.warn('Could not increment classroom studentCount:', err);
  }

  return student;
}

export async function getStudentDoc(studentId: string): Promise<Student | null> {
  const snap = await getDoc(doc(db, 'students', studentId));
  return snap.exists() ? (snap.data() as Student) : null;
}

export async function getStudentsByClassroom(classroomId: string): Promise<Student[]> {
  const q = query(
    studentsCol,
    where('classroomId', '==', classroomId),
    orderBy('rollNumber', 'asc')
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => d.data() as Student);
}

export async function getStudentsByTeacher(teacherId: string): Promise<Student[]> {
  const q = query(studentsCol, where('teacherId', '==', teacherId));
  const snap = await getDocs(q);
  return snap.docs.map((d) => d.data() as Student);
}

export async function updateStudentDoc(
  studentId: string,
  updates: Partial<Student>
): Promise<void> {
  await updateDoc(doc(db, 'students', studentId), {
    ...updates,
    updatedAt: Date.now(),
  });
}

export async function updateStudentAttendanceDoc(
  studentId: string,
  dateKey: string,
  status: 'present' | 'absent' | 'late'
): Promise<void> {
  const studentRef = doc(db, 'students', studentId);
  await updateDoc(studentRef, {
    [`attendance.${dateKey}`]: status,
    updatedAt: Date.now(),
  });
}

export async function deleteStudentDoc(studentId: string, classroomId: string): Promise<void> {
  await deleteDoc(doc(db, 'students', studentId));

  // Decrement studentCount in classroom
  try {
    await updateDoc(doc(db, 'classrooms', classroomId), {
      studentCount: increment(-1),
      updatedAt: Date.now(),
    });
  } catch (err) {
    console.warn('Could not decrement classroom studentCount:', err);
  }
}

export function listenToStudentsByClassroom(
  classroomId: string,
  callback: (students: Student[]) => void
): Unsubscribe {
  const q = query(
    studentsCol,
    where('classroomId', '==', classroomId),
    orderBy('rollNumber', 'asc')
  );
  return onSnapshot(
    q,
    (snap) => {
      const list = snap.docs.map((d) => d.data() as Student);
      callback(list);
    },
    (err) => {
      console.warn('Students by classroom listener warning:', err);
    }
  );
}

export function listenToStudentsByTeacher(
  teacherId: string,
  callback: (students: Student[]) => void
): Unsubscribe {
  const q = query(studentsCol, where('teacherId', '==', teacherId));
  return onSnapshot(
    q,
    (snap) => {
      const list = snap.docs.map((d) => d.data() as Student);
      callback(list);
    },
    (err) => {
      console.warn('Students by teacher listener warning:', err);
    }
  );
}

// ==========================================
// 6. SCHOOLS & DISTRICTS OPERATIONS
// ==========================================

export const schoolsCol = collection(db, 'schools');
export const districtsCol = collection(db, 'districts');

export async function createSchoolDoc(school: School): Promise<void> {
  await setDoc(doc(db, 'schools', school.schoolId), school, { merge: true });
}

export async function getSchoolDoc(schoolId: string): Promise<School | null> {
  const snap = await getDoc(doc(db, 'schools', schoolId));
  return snap.exists() ? (snap.data() as School) : null;
}

export async function getSchoolsByDistrict(district: string): Promise<School[]> {
  const q = query(schoolsCol, where('district', '==', district));
  const snap = await getDocs(q);
  return snap.docs.map((d) => d.data() as School);
}

export async function createDistrictDoc(district: District): Promise<void> {
  await setDoc(doc(db, 'districts', district.districtId), district, { merge: true });
}

export async function getDistrictDoc(districtId: string): Promise<District | null> {
  const snap = await getDoc(doc(db, 'districts', districtId));
  return snap.exists() ? (snap.data() as District) : null;
}

export async function getAllDistricts(): Promise<District[]> {
  const snap = await getDocs(districtsCol);
  return snap.docs.map((d) => d.data() as District);
}
