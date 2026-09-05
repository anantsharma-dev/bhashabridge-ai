import React, { useState, useEffect } from 'react';
import {
  Wifi,
  WifiOff,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  Mic,
  Camera,
  HardDrive,
  Bell,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  FileText,
} from 'lucide-react';
import { capacitorService, type DevicePermissionsStatus, type NetworkState } from '../../services/capacitor/capacitorService';
import { offlineSyncQueueEngine, type SyncStats } from '../../offline/syncQueueEngine';
import { sqliteEngine, type ConflictAuditRecord } from '../../offline/sqliteEngine';

export interface AndroidSyncBarProps {
  onToast?: (message: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
  className?: string;
}

export const AndroidSyncBar: React.FC<AndroidSyncBarProps> = ({ onToast, className = '' }) => {
  const [network, setNetwork] = useState<NetworkState>({ connected: true, connectionType: 'wifi' });
  const [syncStats, setSyncStats] = useState<SyncStats>({
    pendingCount: 0,
    failedCount: 0,
    totalProcessed: 0,
    lastSyncTime: null,
    isOnline: true,
    isSyncing: false,
  });
  const [permissions, setPermissions] = useState<DevicePermissionsStatus>({
    microphone: 'unknown',
    camera: 'unknown',
    storage: 'unknown',
    notifications: 'unknown',
  });
  const [conflictLogs, setConflictLogs] = useState<ConflictAuditRecord[]>([]);
  const [showConflicts, setShowConflicts] = useState(false);
  const [showPermissions, setShowPermissions] = useState(false);
  const [isSyncingManual, setIsSyncingManual] = useState(false);

  useEffect(() => {
    // 1. Subscribe to network status
    const unsubNet = capacitorService.onNetworkChange((s) => setNetwork(s));

    // 2. Subscribe to sync stats
    const unsubSync = offlineSyncQueueEngine.onQueueChange((stats) => setSyncStats(stats));

    // 3. Check permissions
    capacitorService.checkPermissions().then(setPermissions);

    // 4. Load conflict logs
    loadConflictLogs();

    return () => {
      unsubNet();
      unsubSync();
    };
  }, []);

  const loadConflictLogs = async () => {
    try {
      const logs = await sqliteEngine.selectAll<ConflictAuditRecord>('conflict_audit_log');
      setConflictLogs(logs);
    } catch {
      // ignore
    }
  };

  const handleManualSync = async () => {
    if (!network.connected) {
      onToast?.('Cannot synchronize while offline. Please connect to WiFi or mobile network.', 'warning');
      return;
    }
    setIsSyncingManual(true);
    try {
      const res = await offlineSyncQueueEngine.processQueue();
      await loadConflictLogs();
      onToast?.(`Sync finished: ${res.synced} records synced, ${res.failed} retries.`, 'success');
    } finally {
      setIsSyncingManual(false);
    }
  };

  const handleRetryFailed = async () => {
    const res = await offlineSyncQueueEngine.retryFailedItems();
    onToast?.(`Re-queued ${res.retried} failed items with exponential backoff!`, 'info');
  };

  const handleRequestMic = async () => {
    const ok = await capacitorService.requestMicrophonePermission();
    const p = await capacitorService.checkPermissions();
    setPermissions(p);
    if (ok) onToast?.('Microphone permission granted for speech recognition!', 'success');
    else onToast?.('Microphone permission denied or prompt skipped.', 'warning');
  };

  const handleRequestCamera = async () => {
    const ok = await capacitorService.requestCameraPermission();
    const p = await capacitorService.checkPermissions();
    setPermissions(p);
    if (ok) onToast?.('Camera permission granted for textbook OCR!', 'success');
    else onToast?.('Camera permission denied or prompt skipped.', 'warning');
  };

  const handleRequestNotif = async () => {
    const ok = await capacitorService.requestNotificationPermission();
    const p = await capacitorService.checkPermissions();
    setPermissions(p);
    if (ok) onToast?.('Notification permission granted for sync alerts!', 'success');
    else onToast?.('Notification permission denied.', 'warning');
  };

  const handleTestCameraCapture = async () => {
    onToast?.('Opening camera for offline textbook OCR scanning...', 'info');
    const photoUrl = await capacitorService.capturePhoto();
    if (photoUrl) {
      onToast?.('Page captured successfully! Image saved to offline storage cache.', 'success');
    }
  };

  const isNative = capacitorService.isNative();

  return (
    <div
      className={`rounded-[24px] bg-white border border-[#F1EFE8] p-5 sm:p-6 shadow-[0_4px_20px_rgba(0,0,0,0.04)] space-y-4 ${className}`}
    >
      {/* Top Banner: Network & Sync Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div
            className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${
              network.connected
                ? 'bg-emerald-100 text-emerald-800'
                : 'bg-amber-100 text-amber-900'
            }`}
          >
            {network.connected ? <Wifi size={22} /> : <WifiOff size={22} />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-extrabold text-slate-900 font-baloo leading-tight">
                {network.connected ? 'Classroom Online (Live Sync Active)' : 'Offline Mode (Local Storage)'}
              </h3>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                  network.connected
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-amber-100 text-amber-900'
                }`}
              >
                {network.connected ? `Connected • ${network.connectionType.toUpperCase()}` : 'No Cellular / WiFi'}
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              {isNative ? 'Capacitor Android Hybrid Engine' : 'Progressive Web App Architecture'} • SQLite + IndexedDB Storage
            </p>
          </div>
        </div>

        {/* Sync Controls */}
        <div className="flex items-center gap-2">
          {syncStats.failedCount > 0 && (
            <button
              type="button"
              onClick={handleRetryFailed}
              className="min-h-[40px] px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold text-xs flex items-center gap-1.5 border border-amber-200 cursor-pointer"
            >
              <AlertTriangle size={14} className="text-amber-600" />
              <span>Retry Failed ({syncStats.failedCount})</span>
            </button>
          )}

          <button
            type="button"
            disabled={!network.connected || isSyncingManual || syncStats.isSyncing}
            onClick={handleManualSync}
            className="min-h-[40px] px-4 py-1.5 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-2xs cursor-pointer disabled:opacity-50"
          >
            <RefreshCw
              size={14}
              className={isSyncingManual || syncStats.isSyncing ? 'animate-spin' : ''}
            />
            <span>{isSyncingManual || syncStats.isSyncing ? 'Syncing...' : 'Sync Now'}</span>
          </button>
        </div>
      </div>

      {/* Sync Queue Summary Chips */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-0.5">
          <span className="text-slate-400 font-medium">Pending Queue</span>
          <p className="font-extrabold text-slate-800 font-baloo text-base">
            {syncStats.pendingCount} records
          </p>
        </div>
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-0.5">
          <span className="text-slate-400 font-medium">Synced Lifetime</span>
          <p className="font-extrabold text-emerald-700 font-baloo text-base">
            {syncStats.totalProcessed} records
          </p>
        </div>
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-0.5">
          <span className="text-slate-400 font-medium">Conflict Resolutions</span>
          <p className="font-extrabold text-indigo-700 font-baloo text-base">
            {conflictLogs.length} logged
          </p>
        </div>
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-0.5">
          <span className="text-slate-400 font-medium">Last Cloud Push</span>
          <p className="font-extrabold text-slate-800 font-baloo text-base">
            {syncStats.lastSyncTime ? new Date(syncStats.lastSyncTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Never'}
          </p>
        </div>
      </div>

      {/* Accordion Controls for Permissions & Conflict Logs */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-100 text-xs">
        <button
          type="button"
          onClick={() => setShowPermissions(!showPermissions)}
          className="font-bold text-slate-700 hover:text-blue-600 flex items-center gap-1.5 cursor-pointer py-1"
        >
          <ShieldCheck size={15} className="text-blue-600" />
          <span>Android Hardware & Permissions</span>
          {showPermissions ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>

        <button
          type="button"
          onClick={() => setShowConflicts(!showConflicts)}
          className="font-bold text-slate-700 hover:text-indigo-600 flex items-center gap-1.5 cursor-pointer py-1"
        >
          <FileText size={15} className="text-indigo-600" />
          <span>SQLite Conflict Audit Log ({conflictLogs.length})</span>
          {showConflicts ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
      </div>

      {/* Collapsible Section 1: Android Hardware Permissions */}
      {showPermissions && (
        <div className="p-4 rounded-2xl bg-[#FFFDF7] border border-slate-200/80 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-extrabold text-slate-800 font-baloo">
              Device Permissions Matrix
            </h4>
            <span className="text-[11px] text-slate-500 font-medium">
              Android 14+ / Tablet Certified
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Microphone */}
            <div className="p-3 rounded-xl bg-white border border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Mic size={16} className="text-amber-600" />
                <div>
                  <p className="font-bold text-slate-800 text-xs">Microphone</p>
                  <p className="text-[10px] text-slate-500">Whisper ASR</p>
                </div>
              </div>
              {permissions.microphone === 'granted' ? (
                <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-1">
                  <CheckCircle2 size={13} /> Granted
                </span>
              ) : (
                <button
                  type="button"
                  onClick={handleRequestMic}
                  className="px-2.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-600 text-white font-bold text-[10px] cursor-pointer"
                >
                  Allow
                </button>
              )}
            </div>

            {/* Camera */}
            <div className="p-3 rounded-xl bg-white border border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Camera size={16} className="text-blue-600" />
                <div>
                  <p className="font-bold text-slate-800 text-xs">Camera</p>
                  <p className="text-[10px] text-slate-500">Textbook OCR</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                {permissions.camera === 'granted' ? (
                  <button
                    type="button"
                    onClick={handleTestCameraCapture}
                    className="px-2 py-0.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 font-bold text-[10px] cursor-pointer"
                    title="Scan a book page"
                  >
                    Scan OCR
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleRequestCamera}
                    className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-[10px] cursor-pointer"
                  >
                    Allow
                  </button>
                )}
              </div>
            </div>

            {/* Storage */}
            <div className="p-3 rounded-xl bg-white border border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <HardDrive size={16} className="text-emerald-600" />
                <div>
                  <p className="font-bold text-slate-800 text-xs">Offline Storage</p>
                  <p className="text-[10px] text-slate-500">SQLite + Blobs</p>
                </div>
              </div>
              <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-1">
                <CheckCircle2 size={13} /> Active
              </span>
            </div>

            {/* Notifications */}
            <div className="p-3 rounded-xl bg-white border border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell size={16} className="text-purple-600" />
                <div>
                  <p className="font-bold text-slate-800 text-xs">Notifications</p>
                  <p className="text-[10px] text-slate-500">Sync & Downloads</p>
                </div>
              </div>
              {permissions.notifications === 'granted' ? (
                <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-1">
                  <CheckCircle2 size={13} /> Enabled
                </span>
              ) : (
                <button
                  type="button"
                  onClick={handleRequestNotif}
                  className="px-2.5 py-1 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-bold text-[10px] cursor-pointer"
                >
                  Enable
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Collapsible Section 2: Conflict Audit Log */}
      {showConflicts && (
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-extrabold text-slate-800 font-baloo">
              Conflict Resolution Audit Trail (SQLite)
            </h4>
            <span className="text-[11px] text-slate-500 font-medium">
              Last-Write-Wins & Smart Merge
            </span>
          </div>

          {conflictLogs.length === 0 ? (
            <div className="p-4 text-center text-xs text-slate-500 bg-white rounded-xl border border-slate-200">
              Zero sync conflicts detected. All local changes match server state cleanly.
            </div>
          ) : (
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {conflictLogs.map((log) => (
                <div
                  key={log.id}
                  className="p-2.5 rounded-xl bg-white border border-slate-200 text-xs flex items-center justify-between gap-3"
                >
                  <div className="min-w-0">
                    <p className="font-bold text-slate-800 truncate">
                      {log.entityType} / {log.entityId}
                    </p>
                    <p className="text-[10px] text-slate-500">
                      Resolved via <strong>{log.strategy}</strong> • Client v{log.clientVersion} vs Server v{log.serverVersion}
                    </p>
                  </div>
                  <span className="text-[10px] font-semibold text-slate-400 shrink-0">
                    {new Date(log.resolvedAt).toLocaleTimeString()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AndroidSyncBar;
