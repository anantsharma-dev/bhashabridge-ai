import React, { useState } from 'react';
import {
  WorksheetHero,
  WorksheetGeneratorForm,
  type WorksheetConfig,
  WorksheetPreview,
  RecentWorksheets,
} from '../components/worksheets';

export const Worksheets: React.FC = () => {
  const [config, setConfig] = useState<WorksheetConfig>({
    grade: 'Grade 2',
    subject: 'Language (भाषा)',
    language: 'Hindi + Santali (Ol Chiki)',
    topic: 'Animals & Nature',
    difficulty: 'Foundational (सरल)',
    nipunCompetency: 'L2.3 Letter Tracing & Script Recognition',
    questionCount: 6,
    illustrationStyle: 'Coloring Outline (बच्चे रंग भरें)',
    isOffline: true,
    type: 'Vocabulary Matching',
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedCount, setGeneratedCount] = useState(1);

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setGeneratedCount((prev) => prev + 1);
    }, 1200);
  };

  const handleDownloadPdf = () => {
    window.print();
  };

  return (
    <div className="min-h-full bg-[#FFFDF7] -m-4 sm:-m-6 lg:-m-8 p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8 font-sans antialiased text-slate-800">
      {/* 1. HERO BANNER */}
      <WorksheetHero onGenerateClick={handleGenerate} />

      {/* 2. GENERATOR SETTINGS FORM */}
      <WorksheetGeneratorForm
        config={config}
        onChangeConfig={(newCfg) => setConfig((prev) => ({ ...prev, ...newCfg }))}
        onGenerate={handleGenerate}
        isGenerating={isGenerating}
      />

      {/* 3. PRINTABLE A4 PREVIEW */}
      <WorksheetPreview
        key={generatedCount}
        title={`${config.topic} • ᱵᱤᱨ ᱟᱨ ᱚᱲᱟᱜ ᱡᱤᱵᱽ ᱡᱤᱭᱟᱹᱞᱤ`}
        grade={config.grade}
        subject={config.subject}
        competency={config.nipunCompetency}
        onDownloadPdf={handleDownloadPdf}
        onSaveOffline={() => alert('Worksheet saved to tablet offline storage!')}
        onDuplicate={() => alert('Worksheet duplicated for editing!')}
        onAssign={() => alert('Worksheet assigned to Grade 2 MTB-MLE classroom!')}
      />

      {/* 4. RECENT WORKSHEETS CARDS */}
      <RecentWorksheets />
    </div>
  );
};

export default Worksheets;
