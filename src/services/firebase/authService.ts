import {
  signInWithPopup,
  signInWithPhoneNumber,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  updateProfile,
  onAuthStateChanged,
  RecaptchaVerifier,
  type ConfirmationResult,
  type User as FirebaseUser,
} from 'firebase/auth';
import { auth, googleProvider, isFirebaseConfigured } from '../firebase';
import type { TeacherProfile, StudentProfile, DistrictAdminProfile } from '../../types/auth';
import { teacherRepo, studentRepo, classroomRepo } from '../../firebase/repository';

let currentConfirmationResult: ConfirmationResult | null = null;
let currentRecaptchaVerifier: RecaptchaVerifier | null = null;

// Default demo profiles for offline/testing
const DEMO_TEACHER: TeacherProfile = {
  id: 'demo-teacher-dumka',
  role: 'teacher',
  displayName: 'Sangeeta Soren',
  email: 'sangeeta.soren@jharkhand.edu.in',
  schoolName: 'GPS Dumka Primary School',
  district: 'Dumka',
  block: 'Shikaripara',
  village: 'Kathikund',
  isFLNMentor: true,
  level: 4,
  xp: 2850,
  provider: 'demo',
};

const DEMO_DISTRICT_ADMIN: DistrictAdminProfile = {
  id: 'admin-dumka-01',
  role: 'district_admin',
  displayName: 'Dr. Rameshwar Hansda',
  email: 'deo.dumka@jharkhand.gov.in',
  phoneNumber: '+919876543210',
  district: 'Dumka',
  state: 'Jharkhand',
  assignedSchoolsCount: 248,
  provider: 'demo',
};

export function setupRecaptchaVerifier(containerId: string): RecaptchaVerifier | null {
  if (!isFirebaseConfigured() || !auth) return null;

  try {
    if (currentRecaptchaVerifier) {
      currentRecaptchaVerifier.clear();
      currentRecaptchaVerifier = null;
    }

    currentRecaptchaVerifier = new RecaptchaVerifier(auth, containerId, {
      size: 'invisible',
      callback: () => {
        // reCAPTCHA solved
      },
      'expired-callback': () => {
        console.warn('reCAPTCHA expired.');
      },
    });

    return currentRecaptchaVerifier;
  } catch (err) {
    console.warn('Recaptcha initialization warning:', err);
    return null;
  }
}

/**
 * 1. TEACHER AUTHENTICATION
 */

export async function signInTeacherWithGoogle(): Promise<TeacherProfile> {
  if (isFirebaseConfigured() && auth && googleProvider) {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      // Check if profile exists in Firestore
      let profile = await teacherRepo.getById(user.uid);
      if (!profile) {
        profile = {
          id: user.uid,
          role: 'teacher',
          displayName: user.displayName || 'Jharkhand FLN Teacher',
          email: user.email || undefined,
          photoURL: user.photoURL || undefined,
          schoolName: 'GPS Dumka Primary School',
          district: 'Dumka',
          block: 'Dumka Sadar',
          isFLNMentor: true,
          level: 1,
          xp: 500,
          provider: 'google',
        };
        await teacherRepo.save(profile);
      }
      return profile;
    } catch (error: any) {
      console.error('Teacher Google sign in error:', error);
      throw new Error(error.message || 'Google sign-in failed.');
    }
  }

  // Offline / Demo Fallback
  await new Promise((resolve) => setTimeout(resolve, 400));
  return DEMO_TEACHER;
}

export async function sendTeacherPhoneOtp(
  phoneNumber: string,
  containerId = 'recaptcha-container'
): Promise<{ success: boolean; verificationId?: string }> {
  let formatted = phoneNumber.trim().replace(/\s+/g, '');
  if (!formatted.startsWith('+')) {
    formatted = formatted.length === 10 ? `+91${formatted}` : `+${formatted}`;
  }

  if (isFirebaseConfigured() && auth) {
    try {
      let verifier = currentRecaptchaVerifier;
      if (!verifier) {
        verifier = setupRecaptchaVerifier(containerId);
      }
      if (!verifier) throw new Error('Could not setup reCAPTCHA verifier.');

      const confirmation = await signInWithPhoneNumber(auth, formatted, verifier);
      currentConfirmationResult = confirmation;
      return { success: true, verificationId: confirmation.verificationId };
    } catch (err: any) {
      console.error('Phone OTP error:', err);
      throw new Error(err.message || 'Failed to send SMS OTP.');
    }
  }

  // Offline demo
  await new Promise((resolve) => setTimeout(resolve, 400));
  return { success: true, verificationId: 'demo-sms-id' };
}

export async function verifyTeacherPhoneOtp(
  otp: string,
  phoneNumber: string
): Promise<TeacherProfile> {
  const cleanOtp = otp.trim();

  if (isFirebaseConfigured() && auth && currentConfirmationResult) {
    try {
      const result = await currentConfirmationResult.confirm(cleanOtp);
      const user = result.user;

      let profile = await teacherRepo.getById(user.uid);
      if (!profile) {
        profile = {
          id: user.uid,
          role: 'teacher',
          displayName: user.displayName || 'Jharkhand FLN Teacher',
          phoneNumber: user.phoneNumber || phoneNumber,
          schoolName: 'GPS Dumka Primary School',
          district: 'Dumka',
          isFLNMentor: true,
          level: 1,
          xp: 500,
          provider: 'phone',
        };
        await teacherRepo.save(profile);
      }
      return profile;
    } catch (err: any) {
      console.error('Verify OTP error:', err);
      throw new Error(err.message || 'Invalid SMS OTP.');
    }
  }

  // Offline demo
  await new Promise((resolve) => setTimeout(resolve, 400));
  if (cleanOtp.length < 4) throw new Error('Please enter valid 6-digit OTP.');
  return {
    ...DEMO_TEACHER,
    phoneNumber,
    provider: 'phone',
  };
}

export async function signInTeacherWithEmail(
  email: string,
  pass: string
): Promise<TeacherProfile> {
  if (isFirebaseConfigured() && auth) {
    try {
      const cred = await signInWithEmailAndPassword(auth, email.trim(), pass);
      const user = cred.user;
      let profile = await teacherRepo.getById(user.uid);
      if (!profile) {
        profile = {
          id: user.uid,
          role: 'teacher',
          displayName: user.displayName || email.split('@')[0],
          email: user.email || email,
          schoolName: 'GPS Dumka Primary School',
          district: 'Dumka',
          isFLNMentor: true,
          level: 1,
          xp: 500,
          provider: 'password',
        };
        await teacherRepo.save(profile);
      }
      return profile;
    } catch (err: any) {
      console.error('Email sign in error:', err);
      throw new Error(err.message || 'Invalid email or password.');
    }
  }

  // Offline demo
  await new Promise((resolve) => setTimeout(resolve, 400));
  return {
    ...DEMO_TEACHER,
    email,
    displayName: email.split('@')[0] || DEMO_TEACHER.displayName,
    provider: 'password',
  };
}

export async function registerTeacherWithEmail(
  email: string,
  pass: string,
  displayName: string,
  schoolName = 'GPS Dumka Primary School',
  district = 'Dumka'
): Promise<TeacherProfile> {
  if (isFirebaseConfigured() && auth) {
    try {
      const cred = await createUserWithEmailAndPassword(auth, email.trim(), pass);
      const user = cred.user;
      if (displayName) {
        await updateProfile(user, { displayName });
      }
      const profile: TeacherProfile = {
        id: user.uid,
        role: 'teacher',
        displayName: displayName || user.displayName || 'Teacher',
        email: user.email || email,
        schoolName,
        district,
        isFLNMentor: true,
        level: 1,
        xp: 100,
        provider: 'password',
      };
      await teacherRepo.save(profile);
      return profile;
    } catch (err: any) {
      console.error('Teacher register error:', err);
      throw new Error(err.message || 'Registration failed.');
    }
  }

  // Offline demo
  await new Promise((resolve) => setTimeout(resolve, 400));
  return {
    id: `teacher-${Date.now()}`,
    role: 'teacher',
    displayName: displayName || 'Teacher',
    email,
    schoolName,
    district,
    isFLNMentor: true,
    level: 1,
    xp: 100,
    provider: 'demo',
  };
}

/**
 * 2. DISTRICT ADMINISTRATOR AUTHENTICATION
 */

export async function signInDistrictAdmin(
  email: string,
  pass: string
): Promise<DistrictAdminProfile> {
  if (isFirebaseConfigured() && auth) {
    try {
      const cred = await signInWithEmailAndPassword(auth, email.trim(), pass);
      const user = cred.user;
      return {
        id: user.uid,
        role: 'district_admin',
        displayName: user.displayName || 'District Education Officer',
        email: user.email || email,
        district: 'Dumka',
        state: 'Jharkhand',
        assignedSchoolsCount: 248,
        provider: 'password',
      };
    } catch (err: any) {
      console.error('District admin sign in error:', err);
      throw new Error(err.message || 'District Admin authentication failed.');
    }
  }

  // Offline demo
  await new Promise((resolve) => setTimeout(resolve, 400));
  return {
    ...DEMO_DISTRICT_ADMIN,
    email,
    provider: 'password',
  };
}

export async function sendDistrictAdminPhoneOtp(
  phoneNumber: string,
  containerId = 'recaptcha-container'
): Promise<{ success: boolean; verificationId?: string }> {
  return sendTeacherPhoneOtp(phoneNumber, containerId);
}

export async function verifyDistrictAdminPhoneOtp(
  otp: string,
  phoneNumber: string,
  district = 'Dumka'
): Promise<DistrictAdminProfile> {
  const cleanOtp = otp.trim();
  if (cleanOtp.length < 4) throw new Error('Please enter valid OTP.');

  if (isFirebaseConfigured() && auth && currentConfirmationResult) {
    try {
      const result = await currentConfirmationResult.confirm(cleanOtp);
      const user = result.user;
      return {
        id: user.uid,
        role: 'district_admin',
        displayName: user.displayName || 'District Education Officer',
        phoneNumber: user.phoneNumber || phoneNumber,
        district,
        state: 'Jharkhand',
        assignedSchoolsCount: 248,
        provider: 'phone',
      };
    } catch (err: any) {
      throw new Error(err.message || 'Invalid OTP code.');
    }
  }

  return {
    ...DEMO_DISTRICT_ADMIN,
    phoneNumber,
    district,
    provider: 'phone',
  };
}

/**
 * 3. STUDENT AUTHENTICATION (Classroom Code + Student ID + PIN)
 * Students NEVER create accounts. They join through classroom codes generated by teachers.
 */

export async function loginStudentWithClassroomCode(
  classroomCode: string,
  studentId: string,
  pin: string
): Promise<StudentProfile> {
  await new Promise((resolve) => setTimeout(resolve, 350));

  const cleanCode = classroomCode.trim().toUpperCase();
  const cleanStudentId = studentId.trim().toLowerCase();
  const cleanPin = pin.trim();

  if (!cleanCode) throw new Error('Please enter classroom code.');
  if (!cleanStudentId) throw new Error('Please enter your student ID or roll number.');
  if (!cleanPin) throw new Error('Please enter 4-digit PIN.');

  // Query Firestore for classroom
  const classrooms = await classroomRepo.queryWhere('code', '==', cleanCode);
  const classroom = classrooms.length > 0 ? classrooms[0] : null;

  if (classroom) {
    // Check inside classroom students list
    const foundStudent = classroom.students?.find(
      (s) => s.id.toLowerCase() === cleanStudentId || s.name.toLowerCase() === cleanStudentId
    );

    if (foundStudent) {
      if (foundStudent.pin && foundStudent.pin !== cleanPin) {
        throw new Error('Incorrect 4-digit student PIN. Please ask your teacher.');
      }

      return {
        id: foundStudent.id,
        role: 'student',
        name: foundStudent.name,
        nativeScript: foundStudent.nativeScript || 'Ol Chiki',
        classroomCode: classroom.code,
        schoolName: classroom.schoolName,
        grade: foundStudent.grade || classroom.grades || 'Grade 2',
        motherTongue: foundStudent.motherTongue || 'Santhali',
        avatarEmoji: foundStudent.avatarEmoji || '🐯',
        stars: foundStudent.stars || 15,
        xp: foundStudent.xp || 450,
        streakDays: 4,
        badge: foundStudent.badge || 'on_track',
      };
    }
  }

  // Also check students collection directly
  const directStudents = await studentRepo.queryWhere('id', '==', cleanStudentId);
  if (directStudents.length > 0) {
    const s = directStudents[0];
    return {
      id: s.id,
      role: 'student',
      name: s.name,
      nativeScript: s.nativeScript,
      classroomCode: cleanCode,
      schoolName: s.schoolName || 'GPS Dumka Primary School',
      grade: s.grade,
      motherTongue: s.motherTongue,
      avatarEmoji: s.avatarEmoji,
      stars: s.stars,
      xp: s.xp,
      streakDays: s.streakDays,
      badge: s.badge,
    };
  }

  // Fallback demo students for offline classroom use
  const demoRoster: Record<string, StudentProfile> = {
    s1: {
      id: 's1',
      role: 'student',
      name: 'Salma Soren (ᱥᱟᱞᱢᱟ)',
      nativeScript: 'Ol Chiki',
      classroomCode: cleanCode,
      schoolName: 'GPS Dumka Primary School',
      grade: 'Grade 2',
      motherTongue: 'Santhali',
      avatarEmoji: '🐯',
      stars: 18,
      xp: 620,
      streakDays: 5,
      badge: 'star',
    },
    s2: {
      id: 's2',
      role: 'student',
      name: 'Birsa Besra (ᱵᱤᱨᱥᱟ)',
      nativeScript: 'Ol Chiki',
      classroomCode: cleanCode,
      schoolName: 'GPS Dumka Primary School',
      grade: 'Grade 2',
      motherTongue: 'Santhali',
      avatarEmoji: '🐘',
      stars: 12,
      xp: 410,
      streakDays: 3,
      badge: 'on_track',
    },
    s3: {
      id: 's3',
      role: 'student',
      name: 'Kanu Hansda (ᱠᱟᱹᱱᱩ)',
      nativeScript: 'Ol Chiki',
      classroomCode: cleanCode,
      schoolName: 'GPS Dumka Primary School',
      grade: 'Grade 2',
      motherTongue: 'Santhali',
      avatarEmoji: '🦜',
      stars: 9,
      xp: 310,
      streakDays: 2,
      badge: 'needs_help',
    },
  };

  const student = demoRoster[cleanStudentId];
  if (student) {
    return student;
  }

  // If unknown, create temporary student session for the classroom
  return {
    id: cleanStudentId,
    role: 'student',
    name: `Student (${cleanStudentId.toUpperCase()})`,
    nativeScript: 'Ol Chiki',
    classroomCode: cleanCode,
    schoolName: 'GPS Dumka Primary School',
    grade: 'Grade 2',
    motherTongue: 'Santhali',
    avatarEmoji: '🌟',
    stars: 5,
    xp: 150,
    streakDays: 1,
    badge: 'on_track',
  };
}

/**
 * Global Sign Out
 */
export async function signOutUser(): Promise<void> {
  if (isFirebaseConfigured() && auth) {
    try {
      await firebaseSignOut(auth);
    } catch (err) {
      console.warn('Signout warning:', err);
    }
  }
}

/**
 * Subscribe to Firebase Auth changes
 */
export function subscribeToAuthChanges(callback: (user: FirebaseUser | null) => void): () => void {
  if (!isFirebaseConfigured() || !auth) {
    return () => {};
  }
  return onAuthStateChanged(auth, callback);
}
