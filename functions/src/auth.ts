import * as admin from 'firebase-admin';
import { onCall, HttpsError } from 'firebase-functions/v2/https';

const db = admin.firestore();

export interface TeacherProfileInput {
  name: string;
  email?: string;
  phone?: string;
  district?: string;
  block?: string;
  school?: string;
  languagePreference?: string;
  avatar?: string;
}

/**
 * 1. createTeacherProfile
 * Callable Cloud Function to create/initialize teacher profile in Firestore.
 * Requires authenticated user.
 */
export const createTeacherProfile = onCall(async (request) => {
  if (!request.auth) {
    throw new HttpsError('unauthenticated', 'User must be authenticated to create a teacher profile.');
  }

  const uid = request.auth.uid;
  const data = request.data as TeacherProfileInput;

  if (!data.name || typeof data.name !== 'string' || data.name.trim().length === 0) {
    throw new HttpsError('invalid-argument', 'Teacher name is required.');
  }

  const now = Date.now();
  const teacherDoc = {
    teacherId: uid,
    name: data.name.trim(),
    email: data.email || request.auth.token.email || '',
    phone: data.phone || request.auth.token.phone_number || '',
    district: data.district || 'Dumka',
    block: data.block || 'Dumka Sadar',
    school: data.school || 'GPS Dumka Tribal Primary School',
    role: 'teacher',
    languagePreference: data.languagePreference || 'Hindi + Santali (Ol Chiki)',
    avatar: data.avatar || '👩‍🏫',
    createdAt: now,
    updatedAt: now,
    lastLogin: now,
  };

  try {
    await db.collection('teachers').doc(uid).set(teacherDoc, { merge: true });
    return { success: true, teacher: teacherDoc };
  } catch (error: any) {
    console.error('Error creating teacher profile:', error);
    throw new HttpsError('internal', error.message || 'Failed to create teacher profile.');
  }
});

/**
 * 2. syncTeacherProfile
 * Callable Cloud Function to update and synchronize teacher profile.
 */
export const syncTeacherProfile = onCall(async (request) => {
  if (!request.auth) {
    throw new HttpsError('unauthenticated', 'User must be authenticated.');
  }

  const uid = request.auth.uid;
  const updates = request.data as Partial<TeacherProfileInput>;

  try {
    const docRef = db.collection('teachers').doc(uid);
    const existing = await docRef.get();

    if (!existing.exists) {
      throw new HttpsError('not-found', 'Teacher profile does not exist.');
    }

    const payload: Record<string, any> = {
      updatedAt: Date.now(),
    };

    if (updates.name) payload.name = updates.name.trim();
    if (updates.phone) payload.phone = updates.phone.trim();
    if (updates.district) payload.district = updates.district.trim();
    if (updates.block) payload.block = updates.block.trim();
    if (updates.school) payload.school = updates.school.trim();
    if (updates.languagePreference) payload.languagePreference = updates.languagePreference;
    if (updates.avatar) payload.avatar = updates.avatar;

    await docRef.update(payload);
    const refreshed = await docRef.get();
    return { success: true, teacher: refreshed.data() };
  } catch (error: any) {
    console.error('Error syncing teacher profile:', error);
    throw new HttpsError('internal', error.message || 'Failed to sync teacher profile.');
  }
});
