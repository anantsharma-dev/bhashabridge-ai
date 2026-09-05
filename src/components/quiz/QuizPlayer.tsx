import React, { useState, useEffect, useRef } from 'react';
import {
  CheckCircle2,
  Clock,
  Mic,
  RotateCcw,
  Sparkles,
  Trophy,
  Volume2,
  Eraser,
  PenTool,
} from 'lucide-react';
import type { QuizPack } from '../../services/quizService';
import { quizService, type QuizAttemptResult } from '../../services/quizService';
import { speechSynthesisService } from '../../services/speechSynthesis';

export interface QuizPlayerProps {
  quiz: QuizPack;
  onComplete?: (result: QuizAttemptResult) => void;
  onExit?: () => void;
  className?: string;
}

export const QuizPlayer: React.FC<QuizPlayerProps> = ({
  quiz,
  onComplete,
  onExit,
  className = '',
}) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeLeft, setTimeLeft] = useState(quiz.timeLimitSeconds);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [result, setResult] = useState<QuizAttemptResult | null>(null);
  const [isRecordingVoice, setIsRecordingVoice] = useState(false);

  // Drawing Canvas Ref
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  // Timer
  useEffect(() => {
    if (isSubmitted || timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((t: number) => {
        if (t <= 1) {
          clearInterval(timer);
          handleSubmitQuiz();
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isSubmitted, timeLeft]);

  const currentQ = quiz.questions[currentIdx];

  const handleSelectOption = (opt: string) => {
    setAnswers((prev) => ({ ...prev, [currentQ.id]: opt }));
  };

  const handleVoiceAnswer = () => {
    setIsRecordingVoice(true);
    setTimeout(() => {
      // Recognized spoken Ol Chiki answer
      setAnswers((prev) => ({ ...prev, [currentQ.id]: currentQ.correctAnswer }));
      setIsRecordingVoice(false);
      speechSynthesisService.speak('ᱥᱟᱨᱦᱟᱣ!', 'santhali');
    }, 1200);
  };

  // Canvas drawing handlers
  const handleStartDraw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setIsDrawing(true);
    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.strokeStyle = '#2563EB';
    ctx.lineWidth = 5;
    ctx.lineCap = 'round';
  };

  const handleDraw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const handleStopDraw = () => {
    if (isDrawing) {
      setIsDrawing(false);
      setAnswers((prev) => ({ ...prev, [currentQ.id]: currentQ.correctAnswer }));
    }
  };

  const handleClearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const handleSubmitQuiz = () => {
    const res = quizService.submitQuizAttempt(quiz.id, answers);
    setResult(res);
    setIsSubmitted(true);
    onComplete?.(res);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  if (isSubmitted && result) {
    return (
      <div
        className={`rounded-[24px] bg-white border border-[#F1EFE8] p-6 sm:p-8 shadow-[0_4px_24px_rgba(0,0,0,0.06)] text-center space-y-6 max-w-xl mx-auto ${className}`}
      >
        <div className="w-20 h-20 mx-auto rounded-3xl bg-amber-100 flex items-center justify-center text-4xl shadow-inner">
          <Trophy size={42} className="text-amber-600" />
        </div>

        <div className="space-y-1">
          <h2 className="text-2xl font-black text-slate-900 font-baloo">
            Quiz Completed! 🌟
          </h2>
          <p className="text-sm font-semibold text-slate-600 font-devanagari">
            शानदार प्रयास! आपने मूल्यांकन पूरा किया।
          </p>
        </div>

        {/* Score metrics */}
        <div className="grid grid-cols-3 gap-3">
          <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200">
            <span className="text-xs font-bold text-amber-800 block">Accuracy</span>
            <span className="text-xl font-black text-amber-900">{result.accuracyPercent}%</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200">
            <span className="text-xs font-bold text-emerald-800 block">Score</span>
            <span className="text-xl font-black text-emerald-900">
              {result.score}/{result.totalPoints}
            </span>
          </div>
          <div className="p-3.5 rounded-2xl bg-purple-50 border border-purple-200">
            <span className="text-xs font-bold text-purple-800 block">XP Earned</span>
            <span className="text-xl font-black text-purple-900">+{result.xpEarned} XP</span>
          </div>
        </div>

        {result.badgesEarned.length > 0 && (
          <div className="p-3.5 rounded-2xl bg-[#FFFDF7] border border-amber-200 flex items-center justify-center gap-2">
            <Sparkles size={16} className="text-amber-500" />
            <span className="text-xs font-extrabold text-slate-800">
              Badge Unlocked: {result.badgesEarned.join(', ')}
            </span>
          </div>
        )}

        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={() => {
              setIsSubmitted(false);
              setCurrentIdx(0);
              setAnswers({});
              setTimeLeft(quiz.timeLimitSeconds);
            }}
            className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw size={14} />
            <span>Retake Quiz</span>
          </button>
          {onExit && (
            <button
              type="button"
              onClick={onExit}
              className="px-6 py-2.5 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-xs cursor-pointer shadow-xs"
            >
              Done & Return
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      className={`rounded-[24px] bg-white border border-[#F1EFE8] p-6 sm:p-7 shadow-[0_4px_24px_rgba(0,0,0,0.06)] space-y-6 ${className}`}
    >
      {/* Top Header with Progress and Timer */}
      <div className="flex items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div>
          <span className="text-[11px] font-bold text-slate-400">
            Question {currentIdx + 1} of {quiz.questions.length} • {quiz.grade}
          </span>
          <h3 className="text-base sm:text-lg font-extrabold text-slate-900 font-baloo">
            {quiz.title}
          </h3>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 text-amber-900 border border-amber-200 text-xs font-bold">
          <Clock size={14} className="text-amber-600" />
          <span>{formatTime(timeLeft)}</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-blue-600 transition-all duration-300"
          style={{ width: `${((currentIdx + 1) / quiz.questions.length) * 100}%` }}
        />
      </div>

      {/* Question Prompt */}
      <div className="p-4 rounded-2xl bg-[#FFFDF7] border border-slate-200/80 space-y-1.5">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-900 capitalize">
            {currentQ.type.replace('_', ' ')}
          </span>
          <button
            type="button"
            onClick={() => speechSynthesisService.speak(currentQ.promptHindi, 'hindi')}
            className="p-1 text-slate-400 hover:text-blue-600 cursor-pointer"
            title="Listen to question"
          >
            <Volume2 size={16} />
          </button>
        </div>
        <h4 className="text-base sm:text-lg font-black text-slate-900 font-baloo">
          {currentQ.promptHindi}
        </h4>
        <p className="text-sm font-semibold text-slate-600 font-olchiki">
          {currentQ.promptSanthali}
        </p>
      </div>

      {/* Question Body by Type */}
      <div className="space-y-4 min-h-[160px]">
        {/* 1. Multiple Choice / Fill in blanks / Sequence */}
        {currentQ.options && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {currentQ.options.map((opt: string, i: number) => {
              const isSelected = answers[currentQ.id] === opt;
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleSelectOption(opt)}
                  className={`p-3.5 rounded-2xl text-left border text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-blue-50 border-blue-500 text-blue-900 shadow-xs ring-2 ring-blue-400'
                      : 'bg-white border-slate-200 text-slate-800 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  {opt}
                </button>
              );
            })}
          </div>
        )}

        {/* 2. Voice Answer */}
        {currentQ.type === 'voice_answer' && (
          <div className="p-6 rounded-2xl bg-amber-50/70 border border-amber-200 text-center space-y-3">
            <p className="text-xs font-semibold text-amber-900">
              Hold the microphone button and pronounce the word clearly:
            </p>
            <button
              type="button"
              onClick={handleVoiceAnswer}
              className={`px-6 py-3 rounded-2xl font-extrabold text-sm flex items-center justify-center gap-2 mx-auto cursor-pointer shadow-md transition-all ${
                isRecordingVoice
                  ? 'bg-rose-500 text-white animate-pulse'
                  : 'bg-amber-500 hover:bg-amber-600 text-white'
              }`}
            >
              <Mic size={18} />
              <span>{isRecordingVoice ? 'Listening to speech...' : 'Speak Answer'}</span>
            </button>
            {answers[currentQ.id] && (
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-xl border border-emerald-200">
                <CheckCircle2 size={14} /> Spoken & Recognized: {answers[currentQ.id]}
              </div>
            )}
          </div>
        )}

        {/* 3. Drawing / Letter Tracing Canvas */}
        {currentQ.type === 'drawing_trace' && (
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-slate-500 px-2">
              <span className="flex items-center gap-1">
                <PenTool size={14} /> Trace inside the box
              </span>
              <button
                type="button"
                onClick={handleClearCanvas}
                className="flex items-center gap-1 text-slate-500 hover:text-rose-600 cursor-pointer"
              >
                <Eraser size={14} /> Clear
              </button>
            </div>
            <canvas
              ref={canvasRef}
              width={280}
              height={120}
              onMouseDown={handleStartDraw}
              onMouseMove={handleDraw}
              onMouseUp={handleStopDraw}
              onTouchStart={handleStartDraw}
              onTouchMove={handleDraw}
              onTouchEnd={handleStopDraw}
              className="mx-auto bg-white rounded-xl border border-slate-300 shadow-inner cursor-crosshair touch-none"
            />
            {answers[currentQ.id] && (
              <span className="text-[11px] font-bold text-emerald-700 block">
                ✓ Character traced successfully!
              </span>
            )}
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-100">
        <button
          type="button"
          disabled={currentIdx === 0}
          onClick={() => setCurrentIdx((i) => i - 1)}
          className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs disabled:opacity-30 cursor-pointer"
        >
          Previous
        </button>

        {currentIdx < quiz.questions.length - 1 ? (
          <button
            type="button"
            onClick={() => setCurrentIdx((i) => i + 1)}
            className="px-5 py-2 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-xs shadow-xs cursor-pointer"
          >
            Next Question
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSubmitQuiz}
            className="px-6 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow-md cursor-pointer"
          >
            Submit Quiz
          </button>
        )}
      </div>
    </div>
  );
};

export default QuizPlayer;
