import { storage, isFirebaseConfigured } from './firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { indexedDbEngine } from '../offline/indexedDbEngine';

export interface StorageUploadResult {
  url: string;
  isOffline: boolean;
  path: string;
  sizeBytes: number;
}

class StorageService {
  public async uploadAsset(
    path: string,
    fileBlob: Blob,
    mimeType: string = 'application/octet-stream'
  ): Promise<StorageUploadResult> {
    const isOnline = typeof navigator !== 'undefined' ? navigator.onLine : false;

    // Cache locally in IndexedDB first
    await indexedDbEngine.cacheBlob(path, fileBlob, mimeType);

    if (isFirebaseConfigured() && storage && isOnline) {
      try {
        const storageRef = ref(storage, path);
        const snapshot = await uploadBytes(storageRef, fileBlob, { contentType: mimeType });
        const url = await getDownloadURL(snapshot.ref);
        return {
          url,
          isOffline: false,
          path,
          sizeBytes: fileBlob.size,
        };
      } catch {
        // Fall through to offline blob URL
      }
    }

    // Local offline blob URL
    const localUrl = URL.createObjectURL(fileBlob);
    return {
      url: localUrl,
      isOffline: true,
      path,
      sizeBytes: fileBlob.size,
    };
  }

  public async getAssetUrl(path: string): Promise<string> {
    // 1. Check local IndexedDB cache first
    const cached = await indexedDbEngine.getCachedBlob(path);
    if (cached) {
      return URL.createObjectURL(cached.blob);
    }

    // 2. Fetch from Firebase Storage if online
    const isOnline = typeof navigator !== 'undefined' ? navigator.onLine : false;
    if (isFirebaseConfigured() && storage && isOnline) {
      try {
        const storageRef = ref(storage, path);
        const url = await getDownloadURL(storageRef);
        return url;
      } catch {
        // ignore
      }
    }

    return '';
  }
}

export const storageService = new StorageService();
export default storageService;
