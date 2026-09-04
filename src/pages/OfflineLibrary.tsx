import React, { useState } from 'react';
import {
  LibraryHero,
  LibrarySections,
  DownloadManager,
  StorageManagement,
  OfflineReadinessCard,
} from '../components/library';

export const OfflineLibrary: React.FC = () => {
  const [activeSection, setActiveSection] = useState('stories');

  return (
    <div className="min-h-full bg-[#FFFDF7] -m-4 sm:-m-6 lg:-m-8 p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8 font-sans antialiased text-slate-800">
      {/* 1. HERO WITH MASCOT CARRYING BOOKS & STORAGE GAUGE */}
      <LibraryHero usedStorage="1.2 GB" totalStorage="16.0 GB" />

      {/* 2. 8 LIBRARY MEDIA SECTIONS CAROUSEL */}
      <LibrarySections
        activeSection={activeSection}
        onSelectSection={(id) => setActiveSection(id)}
      />

      {/* 3. DOWNLOAD MANAGER & SEARCH FILTER */}
      <DownloadManager />

      {/* 4. STORAGE & LOCAL CACHE MANAGEMENT */}
      <StorageManagement
        usedMB={1240}
        totalMB={16384}
        onClearCache={() => alert('Temporary cache cleared! 85 MB freed.')}
        onUpdateAll={() => alert('All regional packs up to date with latest 2026 syllabus.')}
      />

      {/* 5. 100% OFFLINE READINESS STATUS CARD */}
      <OfflineReadinessCard />
    </div>
  );
};

export default OfflineLibrary;
