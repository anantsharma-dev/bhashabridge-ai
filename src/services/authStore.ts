import { create } from 'zustand';
import { onAuthStateChanged, type User as FirebaseUser } from 'firebase/auth';
import type { AuthUser, TeacherProfile, StudentProfile, UserRole } from '../types/auth';
import { auth, isFirebaseConfigured } from './firebase';
import {
  signInWithGoogleService,
  sendPhoneOtpService,
  verifyPhoneOtpService,
  signInWithEmailService,
  registerWithEmailService,
  loginStudentService,
  signOutService,
  buildDefaultTeacherProfile,
} from './authService';

const AUTH_STORAGE_KEY = 'bhashabridge_auth_session_v1';

interface PhoneState {
  isOtpSent: boolean;
  phoneNumber: string;
  verificationId: string | null;
  countdown: number;
}

interface AuthState {
  user: AuthUser | null;
  role: UserRole | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  authError: string | null;
  phoneState: PhoneState;

  // Actions
  loginWithGoogle: () => Promise<void>;
  sendPhoneOtp: (phoneNumber: string, containerId?: string) => Promise<void>;
  verifyPhoneOtp: (otp: string) => Promise<void>;
  resetPhoneState: () => void;
  loginWithEmail: (email: string, pass: string) => Promise<void>;
  registerWithEmail: (email: string, pass: string, displayName: string, schoolName?: string) => Promise<void>;
  loginStudent: (classroomCode: string, studentId: string, pin: string) => Promise<void>;
  loginDemoTeacher: (preset?: 'sangeeta' | 'birsa') => void;
  loginDemoStudent: (studentId?: string) => void;
  logout: () => Promise<void>;
  clearError: () => void;
  setAuthError: (err: string | null) => void;
  initAuthListener: () => () => void;
}

const getStoredSession = (): { user: AuthUser | null; role: UserRole | null; isAuthenticated: boolean } => {
  if (typeof window === 'undefined') {
    return { user: null, role: null, isAuthenticated: false };
  }
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.user && parsed.role) {
        return {
          user: parsed.user,
          role: parsed.role,
          isAuthenticated: true,
        };
      }
    }
  } catch (err) {
    console.warn('Could not read auth session from storage:', err);
  }
  return { user: null, role: null, isAuthenticated: false };
};

const persistSession = (user: AuthUser | null, role: UserRole | null) => {
  try {
    if (user && role) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({ user, role }));
    } else {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  } catch (err) {
    console.warn('Could not persist auth session:', err);
  }
};

const initialSession = getStoredSession();

export const useAuthStore = create<AuthState>((set, get) => ({
  user: initialSession.user,
  role: initialSession.role,
  isAuthenticated: initialSession.isAuthenticated,
  isLoading: false,
  authError: null,
  phoneState: {
    isOtpSent: false,
    phoneNumber: '',
    verificationId: null,
    countdown: 0,
  },

  clearError: () => set({ authError: null }),
  setAuthError: (authError: string | null) => set({ authError }),

  resetPhoneState: () =>
    set({
      phoneState: {
        isOtpSent: false,
        phoneNumber: '',
        verificationId: null,
        countdown: 0,
      },
    }),

  // Google Login for Teachers
  loginWithGoogle: async () => {
    set({ isLoading: true, authError: null });
    try {
      const teacher = await signInWithGoogleService();
      persistSession(teacher, 'teacher');
      set({
        user: teacher,
        role: 'teacher',
        isAuthenticated: true,
        isLoading: false,
        authError: null,
      });
    } catch (err: any) {
      set({
        isLoading: false,
        authError: err.message || 'Google Login failed.',
      });
      throw err;
    }
  },

  // Phone OTP Login - Step 1: Send OTP
  sendPhoneOtp: async (phoneNumber: string, containerId = 'recaptcha-container') => {
    set({ isLoading: true, authError: null });
    try {
      const res = await sendPhoneOtpService(phoneNumber, containerId);
      set({
        isLoading: false,
        phoneState: {
          isOtpSent: true,
          phoneNumber,
          verificationId: res.verificationId || null,
          countdown: 30,
        },
      });
    } catch (err: any) {
      set({
        isLoading: false,
        authError: err.message || 'Failed to send OTP to mobile number.',
      });
      throw err;
    }
  },

  // Phone OTP Login - Step 2: Verify OTP
  verifyPhoneOtp: async (otp: string) => {
    set({ isLoading: true, authError: null });
    const { phoneNumber } = get().phoneState;
    try {
      const teacher = await verifyPhoneOtpService(otp, phoneNumber);
      persistSession(teacher, 'teacher');
      set({
        user: teacher,
        role: 'teacher',
        isAuthenticated: true,
        isLoading: false,
        authError: null,
        phoneState: {
          isOtpSent: false,
          phoneNumber: '',
          verificationId: null,
          countdown: 0,
        },
      });
    } catch (err: any) {
      set({
        isLoading: false,
        authError: err.message || 'OTP verification failed.',
      });
      throw err;
    }
  },

  // Email & Password Login for Teachers
  loginWithEmail: async (email: string, pass: string) => {
    set({ isLoading: true, authError: null });
    try {
      const teacher = await signInWithEmailService(email, pass);
      persistSession(teacher, 'teacher');
      set({
        user: teacher,
        role: 'teacher',
        isAuthenticated: true,
        isLoading: false,
        authError: null,
      });
    } catch (err: any) {
      set({
        isLoading: false,
        authError: err.message || 'Email login failed.',
      });
      throw err;
    }
  },

  // Email & Password Register for Teachers
  registerWithEmail: async (email: string, pass: string, displayName: string, schoolName?: string) => {
    set({ isLoading: true, authError: null });
    try {
      const teacher = await registerWithEmailService(email, pass, displayName, schoolName);
      persistSession(teacher, 'teacher');
      set({
        user: teacher,
        role: 'teacher',
        isAuthenticated: true,
        isLoading: false,
        authError: null,
      });
    } catch (err: any) {
      set({
        isLoading: false,
        authError: err.message || 'Teacher registration failed.',
      });
      throw err;
    }
  },

  // Student Login (Classroom Code + Student ID + 4-digit PIN)
  loginStudent: async (classroomCode: string, studentId: string, pin: string) => {
    set({ isLoading: true, authError: null });
    try {
      const student = await loginStudentService(classroomCode, studentId, pin);
      persistSession(student, 'student');
      set({
        user: student,
        role: 'student',
        isAuthenticated: true,
        isLoading: false,
        authError: null,
      });
    } catch (err: any) {
      set({
        isLoading: false,
        authError: err.message || 'Student login failed.',
      });
      throw err;
    }
  },

  // Instant Demo Teacher login for testing / review
  loginDemoTeacher: (preset = 'sangeeta') => {
    const teacher: TeacherProfile =
      preset === 'birsa'
        ? {
            id: 'teacher-birsa-02',
            role: 'teacher',
            displayName: 'Birsa Besra',
            email: 'birsa.besra@jharkhand.edu.in',
            schoolName: 'Govt Model Primary School, Bundu',
            district: 'Ranchi',
            block: 'Bundu Block',
            village: 'Bundu Village',
            isFLNMentor: true,
            level: 7,
            xp: 2180,
            provider: 'demo',
          }
        : {
            id: 'teacher-sangeeta-01',
            role: 'teacher',
            displayName: 'Sangeeta Soren',
            email: 'sangeeta.soren.fln@jharkhand.edu.in',
            schoolName: 'GPS Dumka Tribal Primary School',
            district: 'Dumka',
            block: 'Ranishwar Block',
            village: 'Barmasia Village',
            isFLNMentor: true,
            level: 8,
            xp: 2450,
            provider: 'demo',
          };

    persistSession(teacher, 'teacher');
    set({
      user: teacher,
      role: 'teacher',
      isAuthenticated: true,
      isLoading: false,
      authError: null,
    });
  },

  // Instant Demo Student login for testing / review
  loginDemoStudent: (studentId = 's1') => {
    const isPooja = studentId === 's2';
    const student: StudentProfile = isPooja
      ? {
          id: 's2',
          role: 'student',
          name: 'Pooja Hansda',
          nativeScript: 'ᱯᱩᱡᱟ ᱦᱟᱸᱥᱫᱟᱜ',
          classroomCode: 'JH-DUMKA-01',
          schoolName: 'GPS Dumka Tribal Primary School',
          grade: 'Grade 2',
          motherTongue: 'Santali (Ol Chiki)',
          avatarEmoji: '👧',
          stars: 42,
          xp: 1110,
          streakDays: 4,
          badge: 'star',
        }
      : {
          id: 's1',
          role: 'student',
          name: 'Ravi Marandi',
          nativeScript: 'ᱨᱚᱵᱤ ᱢᱟᱨᱟᱱᱰᱤ',
          classroomCode: 'JH-DUMKA-01',
          schoolName: 'GPS Dumka Tribal Primary School',
          grade: 'Grade 2',
          motherTongue: 'Santali (Ol Chiki)',
          avatarEmoji: '👦',
          stars: 48,
          xp: 1240,
          streakDays: 5,
          badge: 'star',
        };

    persistSession(student, 'student');
    set({
      user: student,
      role: 'student',
      isAuthenticated: true,
      isLoading: false,
      authError: null,
    });
  },

  // Logout clears state and persistent storage
  logout: async () => {
    set({ isLoading: true });
    try {
      await signOutService();
    } finally {
      persistSession(null, null);
      set({
        user: null,
        role: null,
        isAuthenticated: false,
        isLoading: false,
        authError: null,
        phoneState: {
          isOtpSent: false,
          phoneNumber: '',
          verificationId: null,
          countdown: 0,
        },
      });
    }
  },

  // Initialize Firebase Auth State listener
  initAuthListener: () => {
    if (!isFirebaseConfigured() || !auth) {
      return () => {};
    }

    const unsubscribe = onAuthStateChanged(auth, (firebaseUser: FirebaseUser | null) => {
      const currentRole = get().role;

      // If user signed out via Firebase, and was logged in as teacher, clear teacher session
      if (!firebaseUser && currentRole === 'teacher') {
        const currentUser = get().user as TeacherProfile | null;
        // If it was a demo provider session, keep it unless explicitly logged out
        if (currentUser && currentUser.provider !== 'demo') {
          persistSession(null, null);
          set({ user: null, role: null, isAuthenticated: false });
        }
      } else if (firebaseUser) {
        // Hydrate or update teacher profile from Firebase User
        const teacher = buildDefaultTeacherProfile({
          id: firebaseUser.uid,
          displayName: firebaseUser.displayName || 'Teacher',
          email: firebaseUser.email,
          phoneNumber: firebaseUser.phoneNumber,
          photoURL: firebaseUser.photoURL,
          provider: firebaseUser.phoneNumber ? 'phone' : firebaseUser.email ? 'password' : 'google',
        });
        persistSession(teacher, 'teacher');
        set({
          user: teacher,
          role: 'teacher',
          isAuthenticated: true,
          isLoading: false,
        });
      }
    });

    return unsubscribe;
  },
}));
