export type UserRole = 'teacher' | 'student' | 'district_admin';

export interface TeacherProfile {
  id: string;
  role: 'teacher';
  displayName: string;
  email?: string;
  phoneNumber?: string;
  photoURL?: string;
  schoolName: string;
  district: string;
  block?: string;
  village?: string;
  isFLNMentor: boolean;
  level: number;
  xp: number;
  provider: 'google' | 'phone' | 'password' | 'demo';
}

export interface StudentProfile {
  id: string;
  role: 'student';
  name: string;
  nativeScript: string;
  classroomCode: string;
  schoolName: string;
  grade: string;
  motherTongue: string;
  avatarEmoji: string;
  stars: number;
  xp: number;
  streakDays: number;
  badge?: 'star' | 'needs_help' | 'on_track';
}

export interface DistrictAdminProfile {
  id: string;
  role: 'district_admin';
  displayName: string;
  email?: string;
  phoneNumber?: string;
  photoURL?: string;
  district: string;
  state: string;
  assignedSchoolsCount: number;
  provider: 'phone' | 'password' | 'demo' | 'google';
}

export type AuthUser = TeacherProfile | StudentProfile | DistrictAdminProfile;

export interface ClassroomStudentRecord {
  id: string;
  name: string;
  nativeScript: string;
  pin: string; // 4-digit PIN
  grade: string;
  motherTongue: string;
  avatarEmoji: string;
  stars: number;
  xp: number;
  badge?: 'star' | 'needs_help' | 'on_track';
}

export interface Classroom {
  id?: string;
  code: string;
  schoolName: string;
  teacherName: string;
  teacherId: string;
  district: string;
  block: string;
  grades: string;
  students: ClassroomStudentRecord[];
}

export interface PhoneOtpState {
  verificationId: string | null;
  phoneNumber: string;
  isOtpSent: boolean;
  isVerifying: boolean;
  resendCountdown: number;
}
