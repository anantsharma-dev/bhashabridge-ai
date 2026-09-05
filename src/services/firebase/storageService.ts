import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage, isFirebaseConfigured } from '../firebase';
import { indexedDbEngine } from '../../offline/indexedDbEngine';

export async function uploadWorksheetPdf(
  file: Blob | File,
  filename: string,
  teacherId: string
): Promise<string> {
  const isOnline = typeof navigator !== 'undefined' ? navigator.onLine : true;
  const path = `worksheets/${teacherId}/${Date.now()}_${filename}`;

  if (isFirebaseConfigured() && storage && isOnline) {
    try {
      const storageRef = ref(storage, path);
      const snap = await uploadBytes(storageRef, file, { contentType: 'application/pdf' });
      return await getDownloadURL(snap.ref);
    } catch (err) {
      console.warn('Firebase Storage upload failed, caching locally:', err);
    }
  }

  // Offline / IndexedDB Blob storage
  await indexedDbEngine.cacheBlob(path, file, 'application/pdf');
  return URL.createObjectURL(file);
}

export async function uploadStudentAudio(
  audioBlob: Blob,
  studentId: string,
  activityId: string
): Promise<string> {
  const isOnline = typeof navigator !== 'undefined' ? navigator.onLine : true;
  const path = `audio/${studentId}/${activityId}_${Date.now()}.webm`;

  if (isFirebaseConfigured() && storage && isOnline) {
    try {
      const storageRef = ref(storage, path);
      const snap = await uploadBytes(storageRef, audioBlob, { contentType: 'audio/webm' });
      return await getDownloadURL(snap.ref);
    } catch (err) {
      console.warn('Audio storage upload warning:', err);
    }
  }

  // Cache in IndexedDB offline store
  await indexedDbEngine.cacheBlob(path, audioBlob, 'audio/webm');
  return URL.createObjectURL(audioBlob);
}

export async function uploadProfileAvatar(
  file: Blob | File,
  userId: string
): Promise<string> {
  const isOnline = typeof navigator !== 'undefined' ? navigator.onLine : true;
  const path = `avatars/${userId}_${Date.now()}.jpg`;

  if (isFirebaseConfigured() && storage && isOnline) {
    try {
      const storageRef = ref(storage, path);
      const snap = await uploadBytes(storageRef, file, { contentType: file.type || 'image/jpeg' });
      return await getDownloadURL(snap.ref);
    } catch (err) {
      console.warn('Avatar upload warning:', err);
    }
  }

  await indexedDbEngine.cacheBlob(path, file, file.type || 'image/jpeg');
  return URL.createObjectURL(file);
}

export async function uploadLearningAsset(
  file: Blob | File,
  storagePath: string
): Promise<string> {
  const isOnline = typeof navigator !== 'undefined' ? navigator.onLine : true;

  if (isFirebaseConfigured() && storage && isOnline) {
    try {
      const storageRef = ref(storage, storagePath);
      const snap = await uploadBytes(storageRef, file);
      return await getDownloadURL(snap.ref);
    } catch (err) {
      console.warn('Asset upload warning:', err);
    }
  }

  await indexedDbEngine.cacheBlob(storagePath, file, file.type || 'application/octet-stream');
  return URL.createObjectURL(file);
}

export async function deleteStorageFile(path: string): Promise<void> {
  if (isFirebaseConfigured() && storage) {
    try {
      const storageRef = ref(storage, path);
      await deleteObject(storageRef);
    } catch (err) {
      console.warn('Delete storage file warning:', err);
    }
  }
}

export async function getCachedBlob(path: string): Promise<Blob | null> {
  const cached = await indexedDbEngine.getCachedBlob(path);
  return cached ? cached.blob : null;
}
