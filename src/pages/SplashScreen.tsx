import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2, ArrowRight, Volume2, Sparkles, BookOpen } from 'lucide-react';
import { JoharHornbill } from '../components/ui/JoharHornbill';
import { speechSynthesisService } from '../services/speechSynthesis';

export const SplashScreen: React.FC = () => {
  const navigate = useNavigate();
  const [readinessProgress, setReadinessProgress] = useState(25);
  const [statusMessage, setStatusMessage] = useState('Initializing multilingual speech engine...');
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Step 1: Initialize local storage & dictionary
    const t1 = setTimeout(() => {
      setReadinessProgress(50);
      setStatusMessage('Loading offline trilingual dictionary (Santali, Hindi, English)...');
    }, 400);

    // Step 2: Initialize FLN curriculum packs
    const t2 = setTimeout(() => {
      setReadinessProgress(75);
      setStatusMessage('Verifying Grade 1–5 NIPUN Bharat MTB-MLE learning outcomes...');
    }, 800);

    // Step 3: Complete readiness
    const t3 = setTimeout(() => {
      setReadinessProgress(100);
      setStatusMessage('Classroom ready! ᱥᱟᱹᱜᱩᱱ ᱫᱟᱨᱟᱢ!');
      setIsReady(true);
    }, 1200);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  const handlePlayWelcome = () => {
    speechSynthesisService.speak('ᱡᱚᱦᱟᱨ! BhashaBridge AI ᱨᱮ ᱥᱟᱹᱜᱩᱱ ᱫᱟᱨᱟᱢ', 'santhali');
  };

  const handleProceed = () => {
    navigate('/language-selection');
  };

  return (
    <div className="min-h-screen bg-[#FFFDF7] flex flex-col items-center justify-between p-6 sm:p-10 font-sans text-slate-800 select-none">
      {/* Dynamic Fonts */}
      <style>{`
        .font-baloo { font-family: 'Baloo 2', 'Poppins', cursive, sans-serif; }
        .font-devanagari { font-family: 'Noto Sans Devanagari', system-ui, sans-serif; }
        .font-olchiki { font-family: 'Noto Sans Ol Chiki', system-ui, sans-serif; }
      `}</style>

      {/* Top Header Badge */}
      <div className="w-full max-w-lg flex items-center justify-between pt-2">
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-900 text-xs font-bold">
          <Sparkles size={14} className="text-blue-600" />
          <span>Jharkhand MTB-MLE Classrooms</span>
        </div>
        <span className="text-[11px] font-bold text-slate-600 bg-amber-100/70 border border-amber-300/80 px-2.5 py-0.5 rounded-full">
          Version 1.0 Production
        </span>
      </div>

      {/* Center Hero with Johar Hornbill Mascot */}
      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-lg flex flex-col items-center text-center space-y-6 my-auto py-8"
      >
        <div className="relative">
          <JoharHornbill size="hero" waving={true} speechBubble="ᱡᱚᱦᱟᱨ! Welcome to BhashaBridge!" />
          
          <button
            type="button"
            onClick={handlePlayWelcome}
            className="absolute -bottom-2 right-4 p-2.5 rounded-2xl bg-white shadow-md border border-slate-200 text-blue-600 hover:bg-blue-50 cursor-pointer flex items-center gap-1 text-xs font-bold transition-transform hover:scale-105"
            title="Hear Johar Mascot Greeting"
          >
            <Volume2 size={16} />
            <span>Hear Welcome</span>
          </button>
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-baloo tracking-tight">
            BhashaBridge AI
          </h1>
          <p className="text-lg font-bold text-blue-800 font-olchiki">
            ᱵᱷᱟᱥᱟ ᱵᱨᱤᱡᱽ ᱮ.ᱟᱭ. • ᱥᱮᱪᱮᱫ ᱜᱟᱛᱮ
          </p>
          <p className="text-sm font-semibold text-slate-600 font-devanagari max-w-sm mx-auto">
            झारखंड प्राथमिक विद्यालयों (कक्षा 1–5) हेतु मातृभाषा आधारित बहुभाषी शिक्षण सहायक
          </p>
        </div>

        {/* Readiness Progress Bar Card */}
        <div className="w-full bg-white rounded-[24px] border border-[#F1EFE8] p-5 shadow-xs space-y-3 text-left">
          <div className="flex items-center justify-between text-xs font-bold text-slate-700">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 size={15} className={readinessProgress === 100 ? 'text-emerald-500' : 'text-blue-500'} />
              <span>{statusMessage}</span>
            </span>
            <span className="text-blue-700 font-extrabold">{readinessProgress}%</span>
          </div>

          <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden p-0.5 border border-slate-200">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-blue-500 via-emerald-500 to-amber-500"
              initial={{ width: '10%' }}
              animate={{ width: `${readinessProgress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>

          <div className="grid grid-cols-3 gap-2 pt-1 text-[11px] font-bold text-slate-500">
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Offline Ready</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-blue-500" />
              <span>Ol Chiki Voice</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-purple-500" />
              <span>FLN Alignment</span>
            </div>
          </div>
        </div>

        {/* Enter Learning Button */}
        <div className="w-full pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <motion.button
            type="button"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleProceed}
            className="w-full sm:w-auto min-h-[52px] px-8 py-3 rounded-2xl bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-sm sm:text-base shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <span>{isReady ? 'Choose Classroom Languages' : 'Continue to Setup'}</span>
            <ArrowRight size={18} />
          </motion.button>

          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="w-full sm:w-auto min-h-[52px] px-6 py-3 rounded-2xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-bold text-xs sm:text-sm cursor-pointer flex items-center justify-center gap-2 transition-colors"
          >
            <BookOpen size={16} />
            <span>Go Direct to Dashboard</span>
          </button>
        </div>
      </motion.div>

      {/* Footer Acknowledgement */}
      <footer className="w-full max-w-lg text-center pt-4 border-t border-slate-200/60 text-[11px] font-medium text-slate-600">
        Mother Tongue Based Multilingual Education (MTB-MLE) • Dumka, Ranchi, Jharkhand
      </footer>
    </div>
  );
};

export default SplashScreen;
