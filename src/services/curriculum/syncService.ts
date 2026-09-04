export interface MeshPeer {
  id: string;
  name: string;
  type: 'CRC_HOTSPOT' | 'TEACHER_PEER' | 'DIET_SYNC_NODE';
  signalStrength: number; // 0-100
  lastSeenMinutes: number;
  availableVersion: string;
  ipAddress: string;
}

export interface SyncReport {
  timestamp: number;
  peerId: string;
  status: 'SUCCESS' | 'FAILED';
  filesUpdated: number;
  bytesReceived: number;
  checksumVerified: boolean;
}

class SyncService {
  public getNearbyPeers(): MeshPeer[] {
    return [
      {
        id: 'peer-crc-dumka',
        name: 'Dumka CRC Resource Hub',
        type: 'CRC_HOTSPOT',
        signalStrength: 92,
        lastSeenMinutes: 2,
        availableVersion: 'JCERT-2026.3.0-JH',
        ipAddress: '192.168.4.1',
      },
      {
        id: 'peer-shikshak-shanti',
        name: 'Shanti Murmu Tablet (GPS Shikaripara)',
        type: 'TEACHER_PEER',
        signalStrength: 78,
        lastSeenMinutes: 5,
        availableVersion: 'JCERT-2026.2.4-JH',
        ipAddress: '192.168.4.24',
      },
      {
        id: 'peer-diet-ranchi',
        name: 'DIET Regional Sync Gateway',
        type: 'DIET_SYNC_NODE',
        signalStrength: 45,
        lastSeenMinutes: 18,
        availableVersion: 'JCERT-2026.3.2-BETA',
        ipAddress: '10.0.8.1',
      },
    ];
  }

  public async syncWithPeer(peer: MeshPeer, onProgress?: (pct: number) => void): Promise<SyncReport> {
    return new Promise((resolve) => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += 25;
        onProgress?.(progress);
        if (progress >= 100) {
          clearInterval(interval);
          resolve({
            timestamp: Date.now(),
            peerId: peer.id,
            status: 'SUCCESS',
            filesUpdated: 24,
            bytesReceived: 45 * 1024 * 1024,
            checksumVerified: true,
          });
        }
      }, 300);
    });
  }
}

export const syncService = new SyncService();
export default syncService;
