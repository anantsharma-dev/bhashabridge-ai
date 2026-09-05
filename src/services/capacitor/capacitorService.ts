import { Capacitor } from '@capacitor/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { LocalNotifications } from '@capacitor/local-notifications';
import { Network, type ConnectionStatus } from '@capacitor/network';
import { indexedDbEngine } from '../../offline/indexedDbEngine';

export interface DevicePermissionsStatus {
  microphone: 'granted' | 'denied' | 'prompt' | 'unknown';
  camera: 'granted' | 'denied' | 'prompt' | 'unknown';
  storage: 'granted' | 'denied' | 'prompt' | 'unknown';
  notifications: 'granted' | 'denied' | 'prompt' | 'unknown';
}

export interface NetworkState {
  connected: boolean;
  connectionType: string;
}

class CapacitorService {
  private networkListeners: ((status: NetworkState) => void)[] = [];
  private currentNetworkState: NetworkState = {
    connected: typeof navigator !== 'undefined' ? navigator.onLine : true,
    connectionType: 'unknown',
  };

  constructor() {
    this.initNetworkMonitoring();
  }

  public isNative(): boolean {
    return Capacitor.isNativePlatform();
  }

  public getPlatform(): string {
    return Capacitor.getPlatform();
  }

  // --- 1. NETWORK CONNECTIVITY & OFFLINE DETECTION ---
  private async initNetworkMonitoring() {
    try {
      if (this.isNative()) {
        const status = await Network.getStatus();
        this.currentNetworkState = {
          connected: status.connected,
          connectionType: status.connectionType,
        };

        Network.addListener('networkStatusChange', (s: ConnectionStatus) => {
          this.currentNetworkState = {
            connected: s.connected,
            connectionType: s.connectionType,
          };
          this.notifyNetworkListeners(this.currentNetworkState);
        });
      } else if (typeof window !== 'undefined') {
        const updateOnline = () => {
          this.currentNetworkState = {
            connected: navigator.onLine,
            connectionType: navigator.onLine ? 'wifi' : 'none',
          };
          this.notifyNetworkListeners(this.currentNetworkState);
        };

        window.addEventListener('online', updateOnline);
        window.addEventListener('offline', updateOnline);
      }
    } catch {
      // Fallback
    }
  }

  public async getNetworkStatus(): Promise<NetworkState> {
    if (this.isNative()) {
      try {
        const s = await Network.getStatus();
        return { connected: s.connected, connectionType: s.connectionType };
      } catch {
        // ignore
      }
    }
    return {
      connected: typeof navigator !== 'undefined' ? navigator.onLine : true,
      connectionType: typeof navigator !== 'undefined' && navigator.onLine ? 'wifi' : 'none',
    };
  }

  public onNetworkChange(callback: (status: NetworkState) => void): () => void {
    this.networkListeners.push(callback);
    callback(this.currentNetworkState);
    return () => {
      this.networkListeners = this.networkListeners.filter((l) => l !== callback);
    };
  }

  private notifyNetworkListeners(state: NetworkState) {
    this.networkListeners.forEach((l) => l(state));
  }

  // --- 2. PERMISSIONS (MICROPHONE, CAMERA, STORAGE, NOTIFICATIONS) ---
  public async checkPermissions(): Promise<DevicePermissionsStatus> {
    const status: DevicePermissionsStatus = {
      microphone: 'unknown',
      camera: 'unknown',
      storage: 'unknown',
      notifications: 'unknown',
    };

    // Camera
    try {
      if (this.isNative()) {
        const cam = await Camera.checkPermissions();
        status.camera = cam.camera === 'granted' ? 'granted' : cam.camera === 'denied' ? 'denied' : 'prompt';
      } else if (typeof navigator !== 'undefined' && (navigator as any).permissions) {
        const query = await (navigator as any).permissions.query({ name: 'camera' as any });
        status.camera = query.state;
      }
    } catch {
      status.camera = 'unknown';
    }

    // Microphone
    try {
      if (typeof navigator !== 'undefined' && (navigator as any).permissions) {
        const query = await (navigator as any).permissions.query({ name: 'microphone' as any });
        status.microphone = query.state;
      } else {
        status.microphone = 'granted';
      }
    } catch {
      status.microphone = 'unknown';
    }

    // Notifications
    try {
      if (this.isNative()) {
        const notif = await LocalNotifications.checkPermissions();
        status.notifications = notif.display === 'granted' ? 'granted' : notif.display === 'denied' ? 'denied' : 'prompt';
      } else if (typeof window !== 'undefined' && 'Notification' in window) {
        status.notifications = Notification.permission === 'granted' ? 'granted' : Notification.permission === 'denied' ? 'denied' : 'prompt';
      }
    } catch {
      status.notifications = 'unknown';
    }

    // Storage
    try {
      if (this.isNative()) {
        const fs = await Filesystem.checkPermissions();
        status.storage = fs.publicStorage === 'granted' ? 'granted' : 'prompt';
      } else {
        status.storage = 'granted'; // Web IndexedDB/LocalStorage is implicitly granted
      }
    } catch {
      status.storage = 'granted';
    }

    return status;
  }

  public async requestMicrophonePermission(): Promise<boolean> {
    try {
      if (typeof navigator !== 'undefined' && navigator.mediaDevices?.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        stream.getTracks().forEach((track) => track.stop());
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }

  public async requestCameraPermission(): Promise<boolean> {
    try {
      if (this.isNative()) {
        const res = await Camera.requestPermissions({ permissions: ['camera'] });
        return res.camera === 'granted';
      } else if (typeof navigator !== 'undefined' && navigator.mediaDevices?.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        stream.getTracks().forEach((track) => track.stop());
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }

  public async requestNotificationPermission(): Promise<boolean> {
    try {
      if (this.isNative()) {
        const res = await LocalNotifications.requestPermissions();
        return res.display === 'granted';
      } else if (typeof window !== 'undefined' && 'Notification' in window) {
        const res = await Notification.requestPermission();
        return res === 'granted';
      }
      return false;
    } catch {
      return false;
    }
  }

  // --- 3. CAMERA CAPTURE (TEXTBOOK OCR & WORKSHEET SCAN) ---
  public async capturePhoto(): Promise<string | null> {
    try {
      if (this.isNative()) {
        const photo = await Camera.getPhoto({
          quality: 90,
          allowEditing: false,
          resultType: CameraResultType.DataUrl,
          source: CameraSource.Camera,
        });
        return photo.dataUrl || null;
      } else {
        // HTML5 file input fallback
        return new Promise((resolve) => {
          const input = document.createElement('input');
          input.type = 'file';
          input.accept = 'image/*';
          input.capture = 'environment';
          input.onchange = () => {
            const file = input.files?.[0];
            if (!file) return resolve(null);
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = () => resolve(null);
            reader.readAsDataURL(file);
          };
          input.click();
        });
      }
    } catch {
      return null;
    }
  }

  // --- 4. OFFLINE STORAGE & FILESYSTEM ---
  public async saveOfflineFile(path: string, base64OrText: string, isText = false): Promise<string> {
    try {
      if (this.isNative()) {
        const res = await Filesystem.writeFile({
          path,
          data: base64OrText,
          directory: Directory.Data,
          encoding: isText ? Encoding.UTF8 : undefined,
        });
        return res.uri;
      }
    } catch {
      // ignore
    }

    // Web IndexedDB Fallback
    const blob = new Blob([base64OrText], { type: isText ? 'text/plain' : 'application/octet-stream' });
    await indexedDbEngine.cacheBlob(path, blob, isText ? 'text/plain' : 'application/octet-stream');
    return `indexeddb://${path}`;
  }

  public async readOfflineFile(path: string, isText = false): Promise<string | null> {
    try {
      if (this.isNative()) {
        const res = await Filesystem.readFile({
          path,
          directory: Directory.Data,
          encoding: isText ? Encoding.UTF8 : undefined,
        });
        return typeof res.data === 'string' ? res.data : null;
      }
    } catch {
      // ignore
    }

    const cached = await indexedDbEngine.getCachedBlob(path);
    if (cached) {
      return await cached.blob.text();
    }
    return null;
  }

  // --- 5. LOCAL NOTIFICATIONS ---
  public async showNotification(title: string, body: string, id: number = Math.floor(Math.random() * 100000)): Promise<void> {
    try {
      if (this.isNative()) {
        await LocalNotifications.schedule({
          notifications: [
            {
              id,
              title,
              body,
              schedule: { at: new Date(Date.now() + 100) },
              sound: undefined,
              actionTypeId: '',
              extra: null,
            },
          ],
        });
        return;
      }

      if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
        new Notification(title, { body, icon: '/favicon.svg' });
      }
    } catch {
      // ignore
    }
  }
}

export const capacitorService = new CapacitorService();
export default capacitorService;
