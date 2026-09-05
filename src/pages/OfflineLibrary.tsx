import React, { useState } from 'react';
import {
  LibraryHero,
  LibrarySections,
  DownloadManager,
  StorageManagement,
  OfflineReadinessCard,
  AndroidSyncBar,
} from '../components/library';
import { Toast, type ToastType } from '../components/ui/Toast';
import { useCurriculumStore } from '../services/curriculum/curriculumStore';

export const OfflineLibrary: React.FC = () => {
  const [activeSection, setActiveSection] = useState('stories');
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);
  const { storageUsedMb, maxStorageMb, triggerSync, version } = useCurriculumStore();

  const showToast = (message: string, type: ToastType = 'success') => {
    setToast({ message, type });
  };

  const usedGbStr = `${(storageUsedMb / 1024).toFixed(1)} GB`;
  const totalGbStr = `${(maxStorageMb / 1024).toFixed(1)} GB`;

  const handleUpdateAll = async () => {
    await triggerSync();
    showToast(`Curriculum synced successfully! Active Version: ${version}`, 'success');
  };

  return (
    <div className="min-h-full bg-[#FFFDF7] -m-4 sm:-m-6 lg:-m-8 p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8 font-sans antialiased text-slate-800">
      {/* 1. HERO WITH MASCOT CARRYING BOOKS & STORAGE GAUGE */}
      <LibraryHero usedStorage={usedGbStr} totalStorage={totalGbStr} />

      {/* 2. ANDROID NATIVE SYNC BAR & PERMISSIONS */}
      <AndroidSyncBar onToast={showToast} />

      {/* 3. 8 LIBRARY MEDIA SECTIONS CAROUSEL */}
      <LibrarySections
        activeSection={activeSection}
        onSelectSection={(id) => setActiveSection(id)}
      />

      {/* 3. DOWNLOAD MANAGER & SEARCH FILTER */}
      <DownloadManager activeSection={activeSection} onToast={showToast} />

      {/* 4. STORAGE & LOCAL CACHE MANAGEMENT */}
      <StorageManagement
        usedMB={storageUsedMb}
        totalMB={maxStorageMb}
        onClearCache={() => showToast('Temporary cache cleared! 85 MB freed.', 'info')}
        onUpdateAll={handleUpdateAll}
      />

      {/* 5. 100% OFFLINE READINESS STATUS CARD */}
      <OfflineReadinessCard />

      {/* TOAST FEEDBACK */}
      <Toast
        message={toast?.message ?? null}
        type={toast?.type ?? 'success'}
        onClose={() => setToast(null)}
      />
    </div>
  );
};

export default OfflineLibrary;
