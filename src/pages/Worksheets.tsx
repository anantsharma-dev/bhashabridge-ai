import React, { useState } from 'react';
import {
  WorksheetHero,
  WorksheetGeneratorForm,
  type WorksheetConfig,
  WorksheetPreview,
  RecentWorksheets,
} from '../components/worksheets';
import { Toast, type ToastType } from '../components/ui/Toast';
import { worksheetService, type GeneratedWorksheet } from '../services/worksheetService';
import { geminiWorksheetService } from '../services/ai/geminiWorksheetService';

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

  const [currentWorksheet, setCurrentWorksheet] = useState<GeneratedWorksheet>(() =>
    worksheetService.generateWorksheet(config)
  );
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedCount, setGeneratedCount] = useState(1);
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);

  const showToast = (message: string, type: ToastType = 'success') => {
    setToast({ message, type });
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const res = await geminiWorksheetService.generateWorksheet(config);
      setCurrentWorksheet(res.worksheet);
      setGeneratedCount((prev) => prev + 1);
      showToast(
        res.isAiGenerated
          ? 'AI generated new multilingual worksheet with Gemini!'
          : 'New bilingual worksheet generated from curriculum pack!',
        'success'
      );
    } catch {
      const fallback = worksheetService.generateWorksheet(config);
      setCurrentWorksheet(fallback);
      setGeneratedCount((prev) => prev + 1);
      showToast('Worksheet generated offline!', 'info');
    } finally {
      setIsGenerating(false);
    }
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
        worksheet={currentWorksheet}
        title={`${config.topic} • ᱵᱤᱨ ᱟᱨ ᱚᱲᱟᱜ ᱡᱤᱵᱽ ᱡᱤᱭᱟᱹᱞᱤ`}
        grade={config.grade}
        subject={config.subject}
        competency={config.nipunCompetency}
        onDownloadPdf={handleDownloadPdf}
        onSaveOffline={() => showToast('Worksheet saved to tablet offline storage!', 'success')}
        onDuplicate={() => showToast('Worksheet duplicated for editing!', 'info')}
        onAssign={() => showToast('Worksheet assigned to Grade 2 MTB-MLE classroom!', 'success')}
      />

      {/* 4. RECENT WORKSHEETS CARDS */}
      <RecentWorksheets />

      {/* TOAST FEEDBACK */}
      <Toast
        message={toast?.message ?? null}
        type={toast?.type ?? 'success'}
        onClose={() => setToast(null)}
      />
    </div>
  );
};

export default Worksheets;
