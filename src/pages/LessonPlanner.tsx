import React, { useState } from 'react';
import {
  PlannerHero,
  LessonBuilderForm,
  type LessonPlanConfig,
  LessonTimeline,
  ActivitySuggestions,
  ClassroomMaterials,
} from '../components/lesson-planner';
import { Toast, type ToastType } from '../components/ui/Toast';
import { lessonPlannerService, type GeneratedLessonPlan } from '../services/lessonPlannerService';
import { geminiLessonPlannerService } from '../services/ai/geminiLessonPlannerService';

export const LessonPlanner: React.FC = () => {
  const [config, setConfig] = useState<LessonPlanConfig>({
    grade: 'Grade 2',
    subject: 'Language MTB-MLE',
    language: 'Hindi ↔ Santali (Ol Chiki)',
    topic: 'Wild and Domestic Animals',
    duration: '45 Minutes',
    learningObjective: 'Master 6 local animal words in Ol Chiki and participate in bilingual storytelling.',
    nipunCompetency: 'L2.4 Bilingual Story Comprehension & Oral Vocabulary',
    classStrength: 25,
    isOffline: true,
  });

  const [currentPlan, setCurrentPlan] = useState<GeneratedLessonPlan>(() =>
    lessonPlannerService.generateLessonPlan({
      grade: 'Grade 2',
      subject: 'Language MTB-MLE',
      language: 'Hindi ↔ Santali (Ol Chiki)',
      topic: 'Wild and Domestic Animals',
      duration: '45 Minutes',
      learningObjective: 'Master 6 local animal words in Ol Chiki and participate in bilingual storytelling.',
      nipunCompetency: 'L2.4 Bilingual Story Comprehension & Oral Vocabulary',
      classStrength: 25,
      isOffline: true,
    })
  );
  const [isGenerating, setIsGenerating] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);

  const showToast = (message: string, type: ToastType = 'success') => {
    setToast({ message, type });
  };

  const handleGeneratePlan = async () => {
    setIsGenerating(true);
    try {
      const response = await geminiLessonPlannerService.generateLessonPlan(config);
      setCurrentPlan(response.plan);
      if (response.isAiGenerated) {
        showToast(`AI Lesson Plan generated with ${response.modelUsed}!`, 'success');
      } else {
        showToast('NEP-aligned MTB-MLE lesson plan generated offline!', 'success');
      }
    } catch {
      const offline = lessonPlannerService.generateLessonPlan(config);
      setCurrentPlan(offline);
      showToast('Generated using offline NEP curriculum engine.', 'info');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-full bg-[#FFFDF7] -m-4 sm:-m-6 lg:-m-8 p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8 font-sans antialiased text-slate-800">
      {/* 1. HERO BANNER */}
      <PlannerHero onCreatePlanClick={handleGeneratePlan} />

      {/* 2. LESSON BUILDER PARAMETERS FORM */}
      <LessonBuilderForm
        config={config}
        onChangeConfig={(newCfg) => setConfig((prev) => ({ ...prev, ...newCfg }))}
        onGeneratePlan={handleGeneratePlan}
        isGenerating={isGenerating}
      />

      {/* 3. STEP-BY-STEP CLASSROOM TIMELINE (9 PHASES) */}
      <LessonTimeline plan={currentPlan} />

      {/* 4. MULTI-SENSORY ACTIVITY SUGGESTIONS */}
      <ActivitySuggestions />

      {/* 5. CLASSROOM TEACHING MATERIALS & EXPORT */}
      <ClassroomMaterials
        plan={currentPlan}
        onSaveOffline={() => {
          lessonPlannerService.saveLessonPlan(currentPlan);
          showToast(`Saved "${currentPlan.title}" to offline library!`, 'success');
        }}
        onDownloadPdf={() => window.print()}
        onAssignToClass={() => showToast(`Assigned "${currentPlan.title}" to Dumka GPS Grade 2 classroom!`, 'success')}
        onDuplicate={() => {
          const dup: GeneratedLessonPlan = {
            ...currentPlan,
            id: `plan-dup-${Date.now()}`,
            title: `${currentPlan.title} (Copy)`,
            createdAt: Date.now(),
          };
          lessonPlannerService.saveLessonPlan(dup);
          setCurrentPlan(dup);
          showToast('Lesson plan duplicated and ready for editing!', 'info');
        }}
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

export default LessonPlanner;
