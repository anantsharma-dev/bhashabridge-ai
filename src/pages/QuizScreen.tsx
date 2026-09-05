import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, Sparkles, Play } from 'lucide-react';
import { QuizPlayer } from '../components/quiz/QuizPlayer';
import { quizService, type QuizPack, type QuizAttemptResult } from '../services/quizService';
import { JoharHornbill } from '../components/ui/JoharHornbill';
import { Toast, type ToastType } from '../components/ui/Toast';

export const QuizScreen: React.FC = () => {
  const [selectedQuiz, setSelectedQuiz] = useState<QuizPack | null>(null);
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);
  const quizzes = quizService.getQuizzes();

  const handleQuizComplete = (res: QuizAttemptResult) => {
    setToast({
      message: `Completed with ${res.accuracyPercent}% accuracy! +${res.xpEarned} XP added to your profile!`,
      type: 'success',
    });
  };

  return (
    <div className="min-h-full bg-[#FFFDF7] -m-4 sm:-m-6 lg:-m-8 p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8 font-sans antialiased text-slate-800">
      {/* 1. HERO BANNER */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-[28px] bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 p-6 sm:p-8 text-white shadow-lg relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6"
      >
        <div className="space-y-2 max-w-xl text-center md:text-left">
          <span className="px-3 py-1 rounded-full text-xs font-black bg-white/20 backdrop-blur-xs text-white uppercase tracking-wider inline-block">
            FLN Interactive Assessment
          </span>
          <h1 className="text-2xl sm:text-4xl font-black font-baloo leading-tight">
            Classroom Multilingual Quizzes
          </h1>
          <p className="text-xs sm:text-sm text-amber-100 font-medium">
            Test oral recognition, letter tracing in Ol Chiki, and NIPUN Bharat foundational literacy skills through bite-sized interactive challenges.
          </p>
        </div>

        <div className="shrink-0 flex items-center justify-center">
          <JoharHornbill size="hero" speechBubble="Ready to earn quiz stars? 🌟" />
        </div>
      </motion.div>

      {/* 2. ACTIVE QUIZ PLAYER OR QUIZ CATALOG */}
      {selectedQuiz ? (
        <div className="space-y-4">
          <button
            type="button"
            onClick={() => setSelectedQuiz(null)}
            className="text-xs font-bold text-slate-500 hover:text-blue-600 flex items-center gap-1.5 cursor-pointer"
          >
            ← Back to All Quizzes
          </button>
          <QuizPlayer
            quiz={selectedQuiz}
            onComplete={handleQuizComplete}
            onExit={() => setSelectedQuiz(null)}
          />
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 font-baloo">
                Available Curriculum Quizzes
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Offline interactive packs for Grade 1–2 classrooms
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {quizzes.map((q: QuizPack) => (
              <div
                key={q.id}
                className="p-5 rounded-2xl bg-white border border-[#F1EFE8] shadow-2xs hover:shadow-xs transition-all space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-900">
                      {q.grade}
                    </span>
                    <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
                      <Clock size={13} /> {Math.round(q.timeLimitSeconds / 60)} Mins
                    </span>
                  </div>

                  <div>
                    <h4 className="text-base font-extrabold text-slate-900 font-baloo">
                      {q.title}
                    </h4>
                    <p className="text-xs font-semibold text-slate-600 font-devanagari">
                      {q.hindiTitle}
                    </p>
                  </div>

                  <p className="text-xs text-slate-500">
                    {q.questions.length} questions • Multiple Choice, Ol Chiki Tracing & Voice Answer
                  </p>
                </div>

                <div className="pt-2 flex items-center justify-between border-t border-slate-100">
                  <span className="text-xs font-bold text-purple-700 flex items-center gap-1">
                    <Sparkles size={14} /> +45 Max XP
                  </span>

                  <button
                    type="button"
                    onClick={() => setSelectedQuiz(q)}
                    className="px-4 py-2 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-2xs cursor-pointer transition-colors"
                  >
                    <Play size={13} />
                    <span>Start Quiz</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TOAST FEEDBACK */}
      <Toast
        message={toast?.message ?? null}
        type={toast?.type ?? 'success'}
        onClose={() => setToast(null)}
      />
    </div>
  );
};

export default QuizScreen;
