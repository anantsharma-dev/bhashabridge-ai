import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  sendPasswordResetEmail,
  sendEmailVerification,
  updateProfile,
  onAuthStateChanged,
  type User,
  type UserCredential,
} from 'firebase/auth';
import { auth, googleProvider } from './config';
import {
  createTeacherProfileDoc,
  getTeacherProfileDoc,
  updateTeacherProfileDoc,
  type Teacher,
} from './firestore';

// ==========================================
// 1. TEACHER EMAIL + PASSWORD SIGN IN
// ==========================================

export async function signInWithEmail(
  email: string,
  password: string
): Promise<{ user: User; teacher: Teacher | null }> {
  const credential: UserCredential = await signInWithEmailAndPassword(auth, email.trim(), password);
  const user = credential.user;

  // Retrieve or ensure teacher document exists
  let teacher = await getTeacherProfileDoc(user.uid);
  if (teacher) {
    await updateTeacherProfileDoc(user.uid, { lastLogin: Date.now() });
  } else {
    // Automatically create teacher profile if missing
    teacher = await createTeacherProfileDoc(user.uid, {
      name: user.displayName || 'Jharkhand Teacher',
      email: user.email || '',
      role: 'teacher',
    });
  }

  return { user, teacher };
}

// ==========================================
// 2. TEACHER EMAIL + PASSWORD SIGN UP
// Every authenticated teacher receives Firebase UID.
// Teacher document automatically created in Firestore after signup.
// ==========================================

export async function signUpWithEmail(
  email: string,
  password: string,
  profileData: Partial<Teacher>
): Promise<{ user: User; teacher: Teacher }> {
  const credential: UserCredential = await createUserWithEmailAndPassword(
    auth,
    email.trim(),
    password
  );
  const user = credential.user;

  // Set Auth display name
  if (profileData.name) {
    await updateProfile(user, { displayName: profileData.name });
  }

  // Send email verification
  try {
    await sendEmailVerification(user);
  } catch (err) {
    console.warn('Verification email dispatch notice:', err);
  }

  // Automatically create Firestore document for teacher
  const teacher = await createTeacherProfileDoc(user.uid, {
    ...profileData,
    email: user.email || email,
    name: profileData.name || user.displayName || 'Jharkhand Teacher',
    role: 'teacher',
  });

  return { user, teacher };
}

// ==========================================
// 3. GOOGLE SIGN IN
// Automatically creates or updates teacher document
// ==========================================

export async function signInWithGoogle(
  extraProfileData?: Partial<Teacher>
): Promise<{ user: User; teacher: Teacher }> {
  const credential: UserCredential = await signInWithPopup(auth, googleProvider);
  const user = credential.user;

  let teacher = await getTeacherProfileDoc(user.uid);

  if (!teacher) {
    // Automatically create teacher profile for first-time Google sign in
    teacher = await createTeacherProfileDoc(user.uid, {
      name: user.displayName || 'Primary Teacher',
      email: user.email || '',
      avatar: user.photoURL || '👩‍🏫',
      role: 'teacher',
      district: extraProfileData?.district || 'Dumka',
      block: extraProfileData?.block || 'Dumka Sadar',
      school: extraProfileData?.school || 'GPS Dumka Tribal Primary School',
      languagePreference: extraProfileData?.languagePreference || 'Hindi + Santali (Ol Chiki)',
      ...extraProfileData,
    });
  } else {
    await updateTeacherProfileDoc(user.uid, {
      lastLogin: Date.now(),
      avatar: user.photoURL || teacher.avatar,
    });
  }

  return { user, teacher };
}

// ==========================================
// 4. PASSWORD RESET
// ==========================================

export async function sendPasswordReset(email: string): Promise<void> {
  await sendPasswordResetEmail(auth, email.trim());
}

// ==========================================
// 5. EMAIL VERIFICATION
// ==========================================

export async function verifyTeacherEmail(): Promise<void> {
  if (auth.currentUser) {
    await sendEmailVerification(auth.currentUser);
  } else {
    throw new Error('No authenticated user to verify.');
  }
}

// ==========================================
// 6. SIGN OUT
// ==========================================

export async function signOutUser(): Promise<void> {
  await signOut(auth);
}

// ==========================================
// 7. JWT SESSION & REFRESH TOKENS
// ==========================================

export async function getIdToken(forceRefresh: boolean = false): Promise<string | null> {
  if (!auth.currentUser) return null;
  return auth.currentUser.getIdToken(forceRefresh);
}

export function getCurrentUser(): User | null {
  return auth.currentUser;
}

// ==========================================
// 8. AUTH STATE LISTENER
// ==========================================

export function onAuthChange(callback: (user: User | null) => void): () => void {
  return onAuthStateChanged(auth, callback);
}
