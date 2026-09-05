import React, { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { User } from 'firebase/auth';
import {
  signInWithEmail,
  signUpWithEmail,
  signInWithGoogle,
  signOutUser,
  sendPasswordReset,
  verifyTeacherEmail,
  onAuthChange,
} from '../firebase/auth';
import {
  getTeacherProfileDoc,
  listenToTeacherProfile,
  type Teacher,
} from '../firebase/firestore';

export interface AuthContextType {
  user: User | null;
  teacher: Teacher | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, teacherData: Partial<Teacher>) => Promise<void>;
  loginWithGoogle: (extraData?: Partial<Teacher>) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  verifyEmail: () => Promise<void>;
  currentTeacher: () => Teacher | null;
  listenToAuthChanges: (callback: (user: User | null, teacher: Teacher | null) => void) => () => void;
  refreshTeacherProfile: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [teacher, setTeacher] = useState<Teacher | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let teacherUnsub: (() => void) | null = null;

    // Listen to Firebase Auth state changes
    const authUnsub = onAuthChange(async (firebaseUser) => {
      setUser(firebaseUser);

      if (teacherUnsub) {
        teacherUnsub();
        teacherUnsub = null;
      }

      if (firebaseUser) {
        // Set up real-time listener to the teacher's Firestore profile
        teacherUnsub = listenToTeacherProfile(firebaseUser.uid, (teacherDoc) => {
          setTeacher(teacherDoc);
          setLoading(false);
        });
      } else {
        setTeacher(null);
        setLoading(false);
      }
    });

    return () => {
      authUnsub();
      if (teacherUnsub) teacherUnsub();
    };
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      const res = await signInWithEmail(email, password);
      setUser(res.user);
      setTeacher(res.teacher);
    } catch (err: any) {
      const msg = err?.message || 'Login failed. Please check credentials.';
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (
    email: string,
    password: string,
    teacherData: Partial<Teacher>
  ): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      const res = await signUpWithEmail(email, password, teacherData);
      setUser(res.user);
      setTeacher(res.teacher);
    } catch (err: any) {
      const msg = err?.message || 'Signup failed. Please try again.';
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogleAuth = async (extraData?: Partial<Teacher>): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      const res = await signInWithGoogle(extraData);
      setUser(res.user);
      setTeacher(res.teacher);
    } catch (err: any) {
      const msg = err?.message || 'Google login failed.';
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      await signOutUser();
      setUser(null);
      setTeacher(null);
    } catch (err: any) {
      setError(err?.message || 'Sign out failed.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email: string): Promise<void> => {
    try {
      setError(null);
      await sendPasswordReset(email);
    } catch (err: any) {
      setError(err?.message || 'Could not send password reset email.');
      throw err;
    }
  };

  const verifyEmail = async (): Promise<void> => {
    try {
      setError(null);
      await verifyTeacherEmail();
    } catch (err: any) {
      setError(err?.message || 'Could not send verification email.');
      throw err;
    }
  };

  const currentTeacher = (): Teacher | null => {
    return teacher;
  };

  const listenToAuthChanges = (
    callback: (user: User | null, teacher: Teacher | null) => void
  ): (() => void) => {
    return onAuthChange(async (u) => {
      let t: Teacher | null = null;
      if (u) {
        t = await getTeacherProfileDoc(u.uid);
      }
      callback(u, t);
    });
  };

  const refreshTeacherProfile = async (): Promise<void> => {
    if (user) {
      const refreshed = await getTeacherProfileDoc(user.uid);
      setTeacher(refreshed);
    }
  };

  const clearError = () => {
    setError(null);
  };

  const value: AuthContextType = {
    user,
    teacher,
    loading,
    error,
    login,
    signup,
    loginWithGoogle: loginWithGoogleAuth,
    logout,
    resetPassword,
    verifyEmail,
    currentTeacher,
    listenToAuthChanges,
    refreshTeacherProfile,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
