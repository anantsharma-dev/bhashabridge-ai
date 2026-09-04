import {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  signInWithPhoneNumber,
  RecaptchaVerifier,
  type ConfirmationResult,
  sendPasswordResetEmail,
  updateProfile,
} from 'firebase/auth';
import { auth, googleProvider, isFirebaseConfigured } from './firebase';
import type { TeacherProfile, StudentProfile } from '../types/auth';
import { validateStudentLogin } from '../data/classrooms';

// Keep track of active phone confirmation result
let currentConfirmationResult: ConfirmationResult | null = null;
let currentRecaptchaVerifier: RecaptchaVerifier | null = null;

/**
 * Creates default teacher profile metadata
 */
export function buildDefaultTeacherProfile(params: {
  id: string;
  displayName?: string | null;
  email?: string | null;
  phoneNumber?: string | null;
  photoURL?: string | null;
  provider: 'google' | 'phone' | 'password' | 'demo';
}): TeacherProfile {
  return {
    id: params.id,
    role: 'teacher',
    displayName: params.displayName || 'Sangeeta Soren',
    email: params.email || undefined,
    phoneNumber: params.phoneNumber || undefined,
    photoURL: params.photoURL || undefined,
    schoolName: 'GPS Dumka Tribal Primary School',
    district: 'Dumka',
    block: 'Ranishwar Block',
    village: 'Barmasia Village',
    isFLNMentor: true,
    level: 8,
    xp: 2450,
    provider: params.provider,
  };
}

/**
 * Google Sign-in for Teachers
 */
export async function signInWithGoogleService(): Promise<TeacherProfile> {
  if (isFirebaseConfigured() && auth && googleProvider) {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      return buildDefaultTeacherProfile({
        id: user.uid,
        displayName: user.displayName || 'Teacher',
        email: user.email,
        photoURL: user.photoURL,
        provider: 'google',
      });
    } catch (error: any) {
      console.error('Google Sign-In Error:', error);
      throw new Error(error.message || 'Google Sign-In failed. Please try again.');
    }
  }

  // Offline / Demo Fallback Mode
  await new Promise((resolve) => setTimeout(resolve, 800));
  return buildDefaultTeacherProfile({
    id: 'demo-google-teacher-01',
    displayName: 'Sangeeta Soren',
    email: 'sangeeta.soren.fln@jharkhand.edu.in',
    photoURL: undefined,
    provider: 'demo',
  });
}

/**
 * Setup RecaptchaVerifier for Phone OTP
 */
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
        // reCAPTCHA solved - allow signInWithPhoneNumber
      },
      'expired-callback': () => {
        console.warn('reCAPTCHA expired. Please reset.');
      },
    });

    return currentRecaptchaVerifier;
  } catch (err) {
    console.warn('Could not initialize RecaptchaVerifier:', err);
    return null;
  }
}

/**
 * Send Phone OTP
 */
export async function sendPhoneOtpService(
  phoneNumber: string,
  containerId: string
): Promise<{ success: boolean; verificationId?: string; isDemo?: boolean }> {
  // Normalize phone number (E.164 format)
  let formattedNumber = phoneNumber.trim().replace(/\s+/g, '');
  if (!formattedNumber.startsWith('+')) {
    if (formattedNumber.length === 10) {
      formattedNumber = `+91${formattedNumber}`;
    } else {
      formattedNumber = `+${formattedNumber}`;
    }
  }

  if (isFirebaseConfigured() && auth) {
    try {
      let verifier = currentRecaptchaVerifier;
      if (!verifier) {
        verifier = setupRecaptchaVerifier(containerId);
      }
      if (!verifier) {
        throw new Error('Unable to initialize SMS verification.');
      }

      const confirmation = await signInWithPhoneNumber(auth, formattedNumber, verifier);
      currentConfirmationResult = confirmation;
      return { success: true, verificationId: confirmation.verificationId, isDemo: false };
    } catch (err: any) {
      console.error('Phone OTP error:', err);
      // Reset recaptcha if failed
      if (currentRecaptchaVerifier) {
        currentRecaptchaVerifier.clear();
        currentRecaptchaVerifier = null;
      }
      throw new Error(err.message || 'Failed to send SMS OTP. Please check the mobile number.');
    }
  }

  // Offline / Demo Mode
  await new Promise((resolve) => setTimeout(resolve, 600));
  return { success: true, verificationId: 'demo-verification-id', isDemo: true };
}

/**
 * Verify Phone OTP
 */
export async function verifyPhoneOtpService(
  otp: string,
  phoneNumber: string
): Promise<TeacherProfile> {
  const cleanOtp = otp.trim();

  if (isFirebaseConfigured() && auth && currentConfirmationResult) {
    try {
      const result = await currentConfirmationResult.confirm(cleanOtp);
      const user = result.user;
      return buildDefaultTeacherProfile({
        id: user.uid,
        displayName: user.displayName || 'Jharkhand FLN Teacher',
        phoneNumber: user.phoneNumber || phoneNumber,
        provider: 'phone',
      });
    } catch (err: any) {
      console.error('Verify OTP error:', err);
      throw new Error(err.message || 'Invalid OTP code. Please check and try again.');
    }
  }

  // Offline / Demo fallback: Allow '123456' or any 6-digit OTP in demo mode
  await new Promise((resolve) => setTimeout(resolve, 600));
  if (cleanOtp.length < 4) {
    throw new Error('Please enter the complete OTP code.');
  }

  return buildDefaultTeacherProfile({
    id: `demo-phone-${phoneNumber.slice(-4)}`,
    displayName: 'Birsa Besra',
    phoneNumber,
    provider: 'demo',
  });
}

/**
 * Email & Password Sign-in for Teachers
 */
export async function signInWithEmailService(
  email: string,
  pass: string
): Promise<TeacherProfile> {
  if (isFirebaseConfigured() && auth) {
    try {
      const cred = await signInWithEmailAndPassword(auth, email.trim(), pass);
      const user = cred.user;
      return buildDefaultTeacherProfile({
        id: user.uid,
        displayName: user.displayName || email.split('@')[0],
        email: user.email,
        photoURL: user.photoURL,
        provider: 'password',
      });
    } catch (err: any) {
      console.error('Email sign in error:', err);
      let msg = 'Failed to sign in. Please verify your email and password.';
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password') {
        msg = 'Incorrect email or password.';
      } else if (err.code === 'auth/user-not-found') {
        msg = 'No teacher registered with this email.';
      } else if (err.code === 'auth/invalid-email') {
        msg = 'Please enter a valid email address.';
      }
      throw new Error(msg);
    }
  }

  // Offline / Demo mode
  await new Promise((resolve) => setTimeout(resolve, 600));
  if (!email || !pass) {
    throw new Error('Please provide email and password.');
  }
  if (pass.length < 6) {
    throw new Error('Password must be at least 6 characters.');
  }

  return buildDefaultTeacherProfile({
    id: 'demo-email-teacher-01',
    displayName: email.split('@')[0] || 'Sangeeta Soren',
    email,
    provider: 'demo',
  });
}

/**
 * Email & Password Registration for Teachers
 */
export async function registerWithEmailService(
  email: string,
  pass: string,
  displayName: string,
  schoolName?: string
): Promise<TeacherProfile> {
  if (isFirebaseConfigured() && auth) {
    try {
      const cred = await createUserWithEmailAndPassword(auth, email.trim(), pass);
      const user = cred.user;
      if (displayName) {
        await updateProfile(user, { displayName });
      }
      const profile = buildDefaultTeacherProfile({
        id: user.uid,
        displayName: displayName || user.displayName || 'Teacher',
        email: user.email,
        provider: 'password',
      });
      if (schoolName) {
        profile.schoolName = schoolName;
      }
      return profile;
    } catch (err: any) {
      console.error('Register error:', err);
      let msg = 'Registration failed. Please try again.';
      if (err.code === 'auth/email-already-in-use') {
        msg = 'This email is already registered. Please sign in instead.';
      } else if (err.code === 'auth/weak-password') {
        msg = 'Password should be at least 6 characters.';
      }
      throw new Error(msg);
    }
  }

  // Offline / Demo mode
  await new Promise((resolve) => setTimeout(resolve, 600));
  const profile = buildDefaultTeacherProfile({
    id: `demo-teacher-${Date.now()}`,
    displayName: displayName || 'New Teacher',
    email,
    provider: 'demo',
  });
  if (schoolName) profile.schoolName = schoolName;
  return profile;
}

/**
 * Reset Password Email
 */
export async function sendPasswordResetService(email: string): Promise<void> {
  if (isFirebaseConfigured() && auth) {
    await sendPasswordResetEmail(auth, email.trim());
    return;
  }
  await new Promise((resolve) => setTimeout(resolve, 500));
}

/**
 * Student Login Service (Classroom Code + Student ID + 4-digit PIN)
 */
export async function loginStudentService(
  classroomCode: string,
  studentId: string,
  pin: string
): Promise<StudentProfile> {
  await new Promise((resolve) => setTimeout(resolve, 500)); // Realistic touch response

  const validation = validateStudentLogin(classroomCode, studentId, pin);
  if (!validation.success || !validation.student || !validation.classroom) {
    throw new Error(validation.error || 'Student authentication failed.');
  }

  const { student, classroom } = validation;
  const profile: StudentProfile = {
    id: student.id,
    role: 'student',
    name: student.name,
    nativeScript: student.nativeScript,
    classroomCode: classroom.code,
    schoolName: classroom.schoolName,
    grade: student.grade,
    motherTongue: student.motherTongue,
    avatarEmoji: student.avatarEmoji,
    stars: student.stars,
    xp: student.xp,
    streakDays: 4,
    badge: student.badge,
  };

  return profile;
}

/**
 * Global Sign Out
 */
export async function signOutService(): Promise<void> {
  if (isFirebaseConfigured() && auth) {
    try {
      await firebaseSignOut(auth);
    } catch (err) {
      console.warn('Sign out warning:', err);
    }
  }
}
