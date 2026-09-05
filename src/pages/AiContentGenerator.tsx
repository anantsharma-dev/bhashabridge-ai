import React, { useState, useEffect } from 'react';
import {
  Clock,
  BookOpen,
  Layers,
  FileText,
  HelpCircle,
  Award,
  Sparkles,
  Edit3,
  Save,
} from 'lucide-react';
import type {
  ContentGeneratorInputs,
  GeneratedContentPackage,
} from '../types/contentGenerator';
import { geminiContentGeneratorService } from '../services/ai/geminiContentGeneratorService';
import { aiContentRepository } from '../services/aiContentRepository';
import { Toast, type ToastType } from '../components/ui/Toast';
import {
  GeneratorHeader,
  GeneratorForm,
  LessonPlanTab,
  StoryTab,
  FlashcardsTab,
  WorksheetTab,
  QuizTab,
  VocabularyTab,
  TeacherNotesTab,
  SavedPackagesModal,
} from '../components/content-generator';

export const AiContentGenerator: React.FC = () => {
  const [inputs, setInputs] = useState<ContentGeneratorInputs>({
    grade: 'Grade 2',
    subject: 'Environmental Studies (EVS)',
    topic: 'Saranda Forest Wildlife (सारंडा वन्य जीव)',
    language: 'Hindi ↔ Santali (Ol Chiki)',
    difficulty: 'Level 1 (Foundational)',
  });

  const [currentPackage, setCurrentPackage] = useState<GeneratedContentPackage | null>(null);
  const [activeTab, setActiveTab] = useState<
    'lessonPlan' | 'story' | 'flashcards' | 'worksheet' | 'quiz' | 'vocabulary' | 'teacherNotes'
  >('lessonPlan');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [savedPackages, setSavedPackages] = useState<GeneratedContentPackage[]>([]);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);

  const showToast = (message: string, type: ToastType = 'success') => {
    setToast({ message, type });
  };

  const loadSavedPackages = async () => {
    try {
      const list = await aiContentRepository.getAllPackages();
      setSavedPackages(list);
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    loadSavedPackages();
    const initial = geminiContentGeneratorService.buildOfflinePackage(inputs);
    setCurrentPackage(initial);
  }, []);

  const handleGenerate = async () => {
    if (!inputs.topic.trim()) {
      showToast('Please specify a lesson topic before generating.', 'warning');
      return;
    }

    setIsGenerating(true);
    try {
      const result = await geminiContentGeneratorService.generateCurriculumContent(inputs);
      setCurrentPackage(result.package);
      setIsEditMode(false);
      await loadSavedPackages();

      if (result.isAiGenerated) {
        showToast(`Curriculum package generated via ${result.modelUsed}!`, 'success');
      } else {
        showToast('NEP-aligned curriculum generated via Offline Engine!', 'success');
      }
    } catch {
      showToast('Failed to generate content. Using offline fallback.', 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveEdits = async () => {
    if (!currentPackage) return;
    const editedPkg: GeneratedContentPackage = {
      ...currentPackage,
      isTeacherEdited: true,
      updatedAt: Date.now(),
    };
    await aiContentRepository.savePackage(editedPkg);
    setCurrentPackage(editedPkg);
    setIsEditMode(false);
    await loadSavedPackages();
    showToast('Teacher customizations saved to SQLite, IndexedDB & Cloud!', 'success');
  };

  const handlePrint = () => {
    window.print();
  };

  const handleSelectHistoryPackage = (pkg: GeneratedContentPackage) => {
    setCurrentPackage(pkg);
    setInputs(pkg.inputs);
    setShowHistoryModal(false);
    showToast(`Loaded curriculum package: "${pkg.inputs.topic}"`, 'info');
  };

  const handleDeleteHistoryPackage = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    await aiContentRepository.deletePackage(id);
    await loadSavedPackages();
    showToast('Package removed from local cache.', 'info');
  };

  return (
    <div className="min-h-full bg-[#FFFDF7] -m-4 sm:-m-6 lg:-m-8 p-4 sm:p-6 lg:p-8 space-y-6 font-sans antialiased text-slate-800">
      {/* 1. HEADER BANNER */}
      <GeneratorHeader
        savedCount={savedPackages.length}
        onOpenHistory={() => setShowHistoryModal(true)}
        onPrint={handlePrint}
      />

      {/* 2. INPUT CONFIGURATION FORM */}
      <GeneratorForm
        inputs={inputs}
        onChange={setInputs}
        onGenerate={handleGenerate}
        isGenerating={isGenerating}
      />

      {/* 3. PACKAGE CONTROLS & 7-OUTPUT TABS */}
      {currentPackage && (
        <div className="rounded-[24px] bg-white border border-[#F1EFE8] p-6 sm:p-7 shadow-[0_4px_20px_rgba(0,0,0,0.04)] space-y-6">
          {/* Header Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-emerald-100 text-emerald-900">
                  {currentPackage.inputs.grade} • {currentPackage.inputs.subject}
                </span>
                <span className="text-xs text-slate-500 font-semibold">
                  Model: <strong className="text-blue-600">{currentPackage.modelUsed}</strong>
                </span>
                {currentPackage.isTeacherEdited && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900">
                    Teacher Customized
                  </span>
                )}
              </div>
              <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 font-baloo leading-tight mt-1">
                {currentPackage.lessonPlan.title}
              </h3>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsEditMode(!isEditMode)}
                className={`min-h-[40px] px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all border ${
                  isEditMode
                    ? 'bg-amber-500 text-white border-amber-600'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
                }`}
              >
                <Edit3 size={14} />
                <span>{isEditMode ? 'Exit Edit Mode' : 'Edit Package'}</span>
              </button>

              {isEditMode && (
                <button
                  type="button"
                  onClick={handleSaveEdits}
                  className="min-h-[40px] px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-2xs cursor-pointer"
                >
                  <Save size={14} />
                  <span>Save Edits</span>
                </button>
              )}
            </div>
          </div>

          {/* 7 Output Navigation Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-slate-100">
            {[
              { id: 'lessonPlan', label: '1. Lesson Plan', icon: Clock },
              { id: 'story', label: '2. Bilingual Story', icon: BookOpen },
              { id: 'flashcards', label: `3. Flashcards (${currentPackage.flashcards.length})`, icon: Layers },
              { id: 'worksheet', label: '4. Worksheet', icon: FileText },
              { id: 'quiz', label: `5. Quiz (${currentPackage.quiz.questions.length}Q)`, icon: HelpCircle },
              { id: 'vocabulary', label: `6. Vocabulary (${currentPackage.vocabulary.length})`, icon: Award },
              { id: 'teacherNotes', label: '7. Teacher Notes', icon: Sparkles },
            ].map((tab) => {
              const Icon = tab.icon;
              const isSelected = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`min-h-[40px] px-3.5 py-1 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shrink-0 transition-all ${
                    isSelected
                      ? 'bg-[#2563EB] text-white shadow-2xs'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <Icon size={14} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* ACTIVE TAB CONTENT */}
          {activeTab === 'lessonPlan' && (
            <LessonPlanTab
              lessonPlan={currentPackage.lessonPlan}
              isEditMode={isEditMode}
              onUpdate={(updated) =>
                setCurrentPackage({ ...currentPackage, lessonPlan: updated })
              }
            />
          )}

          {activeTab === 'story' && (
            <StoryTab
              story={currentPackage.story}
              isEditMode={isEditMode}
              onUpdate={(updated) => setCurrentPackage({ ...currentPackage, story: updated })}
            />
          )}

          {activeTab === 'flashcards' && (
            <FlashcardsTab
              flashcards={currentPackage.flashcards}
              isEditMode={isEditMode}
              onUpdate={(updated) =>
                setCurrentPackage({ ...currentPackage, flashcards: updated })
              }
            />
          )}

          {activeTab === 'worksheet' && (
            <WorksheetTab
              worksheet={currentPackage.worksheet}
              isEditMode={isEditMode}
              onUpdate={(updated) =>
                setCurrentPackage({ ...currentPackage, worksheet: updated })
              }
            />
          )}

          {activeTab === 'quiz' && (
            <QuizTab
              quiz={currentPackage.quiz}
              isEditMode={isEditMode}
              onUpdate={(updated) => setCurrentPackage({ ...currentPackage, quiz: updated })}
            />
          )}

          {activeTab === 'vocabulary' && (
            <VocabularyTab
              vocabulary={currentPackage.vocabulary}
              isEditMode={isEditMode}
              onUpdate={(updated) =>
                setCurrentPackage({ ...currentPackage, vocabulary: updated })
              }
            />
          )}

          {activeTab === 'teacherNotes' && (
            <TeacherNotesTab
              teacherNotes={currentPackage.teacherNotes}
              isEditMode={isEditMode}
              onUpdate={(updated) =>
                setCurrentPackage({ ...currentPackage, teacherNotes: updated })
              }
            />
          )}
        </div>
      )}

      {/* 4. SAVED PACKAGES MODAL */}
      <SavedPackagesModal
        isOpen={showHistoryModal}
        onClose={() => setShowHistoryModal(false)}
        savedPackages={savedPackages}
        onSelect={handleSelectHistoryPackage}
        onDelete={handleDeleteHistoryPackage}
      />

      {/* TOAST FEEDBACK */}
      <Toast
        message={toast?.message ?? null}
        type={toast?.type ?? 'success'}
        onClose={() => setToast(null)}
      />
    </div>
  );
};

export default AiContentGenerator;
