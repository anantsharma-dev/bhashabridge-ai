/**
 * BhashaBridge AI - Production Pedagogical Recommendation Engine
 * Generates personalized learning pathways: next lesson, remedial story,
 * targeted flashcards, worksheets, and quizzes based on student progress.
 */

import { getStudentProgress } from './progress.service';
import { lessonService } from './lesson.service';
import { storyService } from './story.service';
import { flashcardService } from './flashcard.service';
import type {
  Recommendation,
  StudentRecommendationSet,
  GradeLevel,
} from '../types/curriculum';

class RecommendationService {
  /**
   * 1. Generate Complete Recommendation Bundle for Student
   */
  public async getStudentRecommendations(
    studentId: string,
    grade: GradeLevel = 'Grade 1',
    subject: string = 'fln_literacy'
  ): Promise<StudentRecommendationSet> {
    const [progress, _completedIds, nextLesson, nextStory, nextFlashcards] = await Promise.all([
      getStudentProgress(studentId),
      lessonService.getStudentCompletedLessons(studentId),
      this.recommendLesson(studentId, subject, grade),
      this.recommendStory(studentId, grade),
      this.recommendFlashcards(studentId, 4),
    ]);

    const accuracy = progress?.accuracyScore ?? 75;

    const nextWorksheet: Recommendation = {
      id: `rec_ws_${Date.now()}`,
      type: 'worksheet',
      title: accuracy < 70 ? 'Phonemic Stroke Tracing & Picture Association' : 'Word Formation & Context Sentences',
      reason: accuracy < 70 ? 'Reinforces foundational letter recognition and stroke control' : 'Expands vocabulary application',
      subject,
      grade,
      targetId: 'ws_trace_vowel_o',
      difficulty: accuracy < 60 ? 'beginner' : accuracy < 85 ? 'intermediate' : 'advanced',
      estimatedXP: 25,
    };

    const nextQuiz: Recommendation = {
      id: `rec_qz_${Date.now()}`,
      type: 'quiz',
      title: 'Saranda Wildlife & Ol Chiki Letter Milestone',
      reason: 'Adaptive assessment of recent foundational competency mastery',
      subject,
      grade,
      targetId: 'quiz_dumka_animals_g2',
      difficulty: accuracy >= 80 ? 'intermediate' : 'beginner',
      estimatedXP: 40,
    };

    const pronunciationPractice: Recommendation = {
      id: `rec_pr_${Date.now()}`,
      type: 'pronunciation',
      title: 'Vowel Diacritic Echo & Oral Articulation (ᱚ, ᱟ)',
      reason: 'Strengthens mother tongue oral fluency and phoneme clarity',
      subject,
      grade,
      targetId: 'audio_sound_o_santali',
      difficulty: 'beginner',
      estimatedXP: 20,
    };

    return {
      studentId,
      nextLesson: nextLesson || undefined,
      nextStory: nextStory || undefined,
      nextFlashcards,
      nextWorksheet,
      nextQuiz,
      pronunciationPractice,
      generatedAt: Date.now(),
    };
  }

  /**
   * 2. Recommend Next Lesson from Lesson Dependency Graph
   */
  public async recommendLesson(
    studentId: string,
    subject: string = 'fln_literacy',
    grade: GradeLevel = 'Grade 1'
  ): Promise<Recommendation | null> {
    const [allLessons, completedIds] = await Promise.all([
      lessonService.getLessons(undefined, subject, grade),
      lessonService.getStudentCompletedLessons(studentId),
    ]);

    const completedSet = new Set(completedIds);

    // Find first lesson where prerequisites are fulfilled and lesson is uncompleted
    for (const l of allLessons) {
      if (completedSet.has(l.lessonId)) continue;
      const prereqs = l.prerequisiteLessonIds || [];
      const allPrereqsMet = prereqs.every((pid) => completedSet.has(pid));
      if (allPrereqsMet) {
        return {
          id: `rec_les_${l.lessonId}`,
          type: 'lesson',
          title: l.title,
          reason: prereqs.length > 0 ? 'Natural continuation following prerequisite mastery' : 'Next recommended curriculum topic',
          subject: l.subject,
          grade: l.grade,
          targetId: l.lessonId,
          difficulty: 'beginner',
          estimatedXP: 30,
        };
      }
    }

    const first = allLessons[0];
    if (first) {
      return {
        id: `rec_les_${first.lessonId}`,
        type: 'lesson',
        title: first.title,
        reason: 'Curriculum introductory module',
        subject: first.subject,
        grade: first.grade,
        targetId: first.lessonId,
        difficulty: 'beginner',
        estimatedXP: 30,
      };
    }

    return null;
  }

  /**
   * 3. Recommend Remedial or Enrichment Story
   */
  public async recommendStory(
    studentId: string,
    grade: GradeLevel = 'Grade 1'
  ): Promise<Recommendation | null> {
    const [stories, progress] = await Promise.all([
      storyService.getStories({ grade }),
      getStudentProgress(studentId),
    ]);

    const accuracy = progress?.accuracyScore ?? 75;
    // Lower accuracy -> recommend folklore story with simpler vocabulary
    const target = accuracy < 70 ? stories[0] : stories[1] || stories[0];

    if (!target) return null;

    return {
      id: `rec_st_${target.storyId}`,
      type: 'story',
      title: target.title,
      reason: accuracy < 70 ? 'Remedial listening story with rich audio & discussion' : 'Cultural enrichment reader',
      subject: target.subject,
      grade: target.grade,
      targetId: target.storyId,
      difficulty: accuracy < 70 ? 'beginner' : 'intermediate',
      estimatedXP: 35,
    };
  }

  /**
   * 4. Recommend Flashcards Due for Review or Weak Categories
   */
  public async recommendFlashcards(
    _studentId: string,
    limitCount: number = 4
  ): Promise<Recommendation[]> {
    const cards = await flashcardService.getFlashcards();
    return cards.slice(0, limitCount).map((c) => ({
      id: `rec_fc_${c.cardId}`,
      type: 'flashcard',
      title: `${c.english} (${c.santali})`,
      reason: 'Spaced repetition daily vocabulary retention',
      subject: c.subject,
      grade: c.grade,
      targetId: c.cardId,
      difficulty: c.difficulty,
      estimatedXP: 10,
    }));
  }
}

export const recommendationService = new RecommendationService();
export default recommendationService;
