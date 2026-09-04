import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, Star, CheckCircle2, XCircle, RotateCcw } from 'lucide-react';
import { JoharHornbill } from '../ui/JoharHornbill';
import { CuteElephant, CuteMango, CountingBlocks, StoryBook } from '../ui/DashboardIllustrations';

export interface MiniQuizProps {
  onCompleteQuiz?: (score: number) => void;
  className?: string;
}

export const MiniQuiz: React.FC<MiniQuizProps> = ({
  onCompleteQuiz,
  className = '',
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState(0);
  const [isQuizComplete, setIsQuizComplete] = useState(false);

  const quizQuestions = [
    {
      id: 'q1',
      promptAudio: 'ᱦᱟᱹᱛᱤ (Hati)',
      promptHindi: 'हाथी (Elephant)',
      instruction: 'Listen to the Santali word and tap the matching animal:',
      correctId: 'elephant',
      options: [
        { id: 'elephant', label: 'ᱦᱟᱹᱛᱤ (Elephant)', illustration: <CuteElephant size={80} /> },
        { id: 'mango', label: 'ᱩᱞ (Mango)', illustration: <CuteMango size={80} /> },
        { id: 'blocks', label: 'ᱮᱞ (Blocks)', illustration: <CountingBlocks size={80} /> },
      ],
    },
    {
      id: 'q2',
      promptAudio: 'ᱩᱞ (Ul)',
      promptHindi: 'आम (Mango)',
      instruction: 'Match the delicious sweet fruit in Santali:',
      correctId: 'mango',
      options: [
        { id: 'book', label: 'ᱯᱩᱛᱷᱤ (Book)', illustration: <StoryBook size={80} /> },
        { id: 'mango', label: 'ᱩᱞ (Mango)', illustration: <CuteMango size={80} /> },
        { id: 'elephant', label: 'ᱦᱟᱹᱛᱤ (Elephant)', illustration: <CuteElephant size={80} /> },
      ],
    },
  ];

  const currentQ = quizQuestions[currentStep];

  const handleSelectOption = (optionId: string) => {
    if (isAnswered) return;
    setSelectedOption(optionId);
    setIsAnswered(true);

    const correct = optionId === currentQ.correctId;
    setIsCorrect(correct);
    if (correct) {
      setScore((prev) => prev + 10);
    }
  };

  const handleNext = () => {
    if (currentStep < quizQuestions.length - 1) {
      setCurrentStep((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
      setIsCorrect(false);
    } else {
      setIsQuizComplete(true);
      if (onCompleteQuiz) onCompleteQuiz(score + (isCorrect ? 10 : 0));
    }
  };

  const handleRestart = () => {
    setCurrentStep(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setIsCorrect(false);
    setScore(0);
    setIsQuizComplete(false);
  };

  return (
    <div
      className={`rounded-[24px] bg-white border border-[#F1EFE8] p-6 sm:p-8 shadow-[0_4px_20px_rgba(0,0,0,0.04)] space-y-6 ${className}`}
    >
      {/* Celebration Screen when complete */}
      <AnimatePresence>
        {isQuizComplete ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-8 space-y-5"
          >
            <div className="flex justify-center">
              <JoharHornbill
                size="hero"
                waving={true}
                speechBubble="Shabash! Great Job! 🎉"
              />
            </div>

            <div className="space-y-2">
              <span className="text-4xl">⭐⭐⭐</span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-baloo">
                Quiz Completed!
              </h3>
              <p className="text-base font-bold text-emerald-800 font-devanagari">
                शानदार! आपने 20 में से {score} अंक प्राप्त किए!
              </p>
              <p className="text-sm text-slate-500">
                You earned <strong>+20 XP</strong> and <strong>2 Stars</strong> for your vocabulary streak!
              </p>
            </div>

            <button
              type="button"
              onClick={handleRestart}
              className="min-h-[48px] px-8 py-3 rounded-2xl bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-sm shadow-md cursor-pointer inline-flex items-center gap-2"
            >
              <RotateCcw size={16} />
              <span>Play Quiz Again</span>
            </button>
          </motion.div>
        ) : (
          /* Active Question Screen */
          <div className="space-y-6">
            {/* Top Bar: Progress & Score */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#FAF5FF] text-purple-900 border border-purple-200">
                  Question {currentStep + 1} of {quizQuestions.length}
                </span>
                <span className="text-xs font-semibold text-slate-500">
                  Mini Vocabulary Quiz
                </span>
              </div>

              <span className="text-sm font-extrabold text-amber-900 flex items-center gap-1">
                <Star size={16} className="fill-amber-400 text-amber-400" />
                Score: {score} XP
              </span>
            </div>

            {/* Prompt Card */}
            <div className="rounded-2xl bg-[#EFF6FF] border border-blue-200 p-5 text-center space-y-2">
              <p className="text-xs font-bold text-blue-800 uppercase tracking-wider">
                {currentQ.instruction}
              </p>
              <div className="flex items-center justify-center gap-3 pt-1">
                <h3 className="text-3xl font-extrabold text-blue-950 font-olchiki">
                  {currentQ.promptAudio}
                </h3>
                <button
                  type="button"
                  className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-xs cursor-pointer hover:bg-blue-700"
                  aria-label="Play quiz audio"
                >
                  <Volume2 size={18} />
                </button>
              </div>
              <p className="text-sm font-medium text-slate-600 font-devanagari">
                ({currentQ.promptHindi})
              </p>
            </div>

            {/* Options Grid (3 choices with illustrations) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {currentQ.options.map((opt) => {
                const isSelected = selectedOption === opt.id;
                let optionStyle = 'bg-white border-[#F1EFE8] hover:border-blue-300';
                if (isAnswered) {
                  if (opt.id === currentQ.correctId) {
                    optionStyle = 'bg-[#ECFDF5] border-emerald-400 ring-2 ring-emerald-400';
                  } else if (isSelected) {
                    optionStyle = 'bg-[#FFF1F2] border-rose-400 ring-2 ring-rose-400';
                  }
                }

                return (
                  <motion.button
                    key={opt.id}
                    whileHover={{ scale: isAnswered ? 1 : 1.03 }}
                    whileTap={{ scale: isAnswered ? 1 : 0.97 }}
                    type="button"
                    disabled={isAnswered}
                    onClick={() => handleSelectOption(opt.id)}
                    className={`rounded-2xl p-5 border-2 text-center flex flex-col items-center justify-between min-h-[170px] cursor-pointer shadow-xs transition-all ${optionStyle}`}
                  >
                    <div className="py-2">{opt.illustration}</div>
                    <span className="text-xs font-bold text-slate-800 mt-2">
                      {opt.label}
                    </span>
                  </motion.button>
                );
              })}
            </div>

            {/* Answer Feedback Banner */}
            {isAnswered && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-4 rounded-2xl flex items-center justify-between gap-3 border ${
                  isCorrect
                    ? 'bg-[#ECFDF5] border-emerald-300 text-emerald-950'
                    : 'bg-[#FFF1F2] border-rose-300 text-rose-950'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  {isCorrect ? (
                    <CheckCircle2 size={22} className="text-emerald-600 shrink-0" />
                  ) : (
                    <XCircle size={22} className="text-rose-600 shrink-0" />
                  )}
                  <div>
                    <h4 className="text-sm font-bold">
                      {isCorrect ? 'Correct! Shabash! 🌟' : 'Try again next time!'}
                    </h4>
                    <p className="text-xs opacity-85">
                      {isCorrect
                        ? '+10 XP added to daily vocabulary goal.'
                        : `The correct answer is ${currentQ.promptHindi}.`}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleNext}
                  className="min-h-[44px] px-6 py-2 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-xs shadow-xs cursor-pointer shrink-0"
                >
                  {currentStep < quizQuestions.length - 1 ? 'Next Question →' : 'See Results 🏆'}
                </button>
              </motion.div>
            )}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
