import React, { useState } from 'react';
import {
  PlannerHero,
  LessonBuilderForm,
  type LessonPlanConfig,
  LessonTimeline,
  ActivitySuggestions,
  ClassroomMaterials,
} from '../components/lesson-planner';

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

  const [isGenerating, setIsGenerating] = useState(false);

  const handleGeneratePlan = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
    }, 1200);
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
      <LessonTimeline />

      {/* 4. MULTI-SENSORY ACTIVITY SUGGESTIONS */}
      <ActivitySuggestions />

      {/* 5. CLASSROOM TEACHING MATERIALS & EXPORT */}
      <ClassroomMaterials
        onSaveOffline={() => alert('Lesson plan saved to offline library!')}
        onDownloadPdf={() => window.print()}
        onAssignToClass={() => alert('Assigned to GPS Dumka Grade 2 classroom!')}
        onDuplicate={() => alert('Plan duplicated for modification!')}
      />
    </div>
  );
};

export default LessonPlanner;
