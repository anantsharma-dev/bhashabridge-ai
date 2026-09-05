import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, Volume2, ArrowRight, Sparkles, GraduationCap, UserCheck } from 'lucide-react';
import { useThemeStore } from '../components/ui/themeStore';
import { useAuthStore } from '../services/authStore';
import { speechSynthesisService } from '../services/speechSynthesis';
import { JoharHornbill } from '../components/ui/JoharHornbill';

interface LanguageOption {
  code: string;
  name: string;
  nativeName: string;
  script: string;
  region: string;
  greetingAudioText: string;
  audioLang: string;
  badge?: string;
  accentColor: string;
  bgColor: string;
  borderColor: string;
}

const PRIMARY_LANGUAGES: LanguageOption[] = [
  {
    code: 'santhali',
    name: 'Santali',
    nativeName: 'ᱥᱟᱱᱛᱟᱲᱤ',
    script: 'Ol Chiki (ᱚᱞ ᱪᱤᱠᱤ)',
    region: 'Santhal Pargana (Dumka, Godda, Jamtara)',
    greetingAudioText: 'ᱡᱚᱦᱟᱨ! ᱥᱟᱱᱛᱟᱲᱤ ᱛᱮ ᱥᱮᱪᱮᱫᱚᱜ ᱢᱮ',
    audioLang: 'santhali',
    badge: 'Primary MTB-MLE',
    accentColor: '#10B981',
    bgColor: 'bg-emerald-50/70',
    borderColor: 'border-emerald-300',
  },
  {
    code: 'hindi',
    name: 'Hindi',
    nativeName: 'हिन्दी',
    script: 'Devanagari (देवनागरी)',
    region: 'State Curriculum Language (झारखंड)',
    greetingAudioText: 'नमस्ते! हिंदी और संथाली में सीखें',
    audioLang: 'hindi',
    badge: 'Curriculum Base',
    accentColor: '#2563EB',
    bgColor: 'bg-blue-50/70',
    borderColor: 'border-blue-300',
  },
  {
    code: 'english',
    name: 'English',
    nativeName: 'English',
    script: 'Latin Script',
    region: 'FLN Global Foundation Language',
    greetingAudioText: 'Hello and welcome to BhashaBridge',
    audioLang: 'english',
    badge: 'NIPUN FLN',
    accentColor: '#8B5CF6',
    bgColor: 'bg-purple-50/70',
    borderColor: 'border-purple-300',
  },
];

const TRIBAL_LANGUAGES: LanguageOption[] = [
  {
    code: 'mundari',
    name: 'Mundari',
    nativeName: 'ᱢᱩᱱᱰᱟᱨᱤ (मुंडारी)',
    script: 'Ol Onor / Nagari',
    region: 'Khunti, Ranchi & Tamar Plateau',
    greetingAudioText: 'ᱡᱚᱦᱟᱨ! ᱢᱩᱱᱰᱟᱨᱤ ᱛᱮ ᱥᱮᱪᱮᱫ ᱮᱛᱚᱦᱚᱵᱽ ᱢᱮ',
    audioLang: 'santhali',
    badge: 'Tribal Cohort',
    accentColor: '#F59E0B',
    bgColor: 'bg-amber-50/70',
    borderColor: 'border-amber-300',
  },
  {
    code: 'ho',
    name: 'Ho',
    nativeName: 'ᱦᱳ (हो)',
    script: 'Warang Citi (ᱣᱟᱨᱟᱝ ᱪᱤᱛᱤ)',
    region: 'Kolhan Division (Chaibasa, Singbhum)',
    greetingAudioText: 'ᱡᱚᱦᱟᱨ! ᱦᱳ ᱯᱟᱹᱨᱥᱤ ᱛᱮ ᱥᱮᱪᱮᱫ ᱢᱮ',
    audioLang: 'santhali',
    badge: 'Warang Citi Ready',
    accentColor: '#F97316',
    bgColor: 'bg-orange-50/70',
    borderColor: 'border-orange-300',
  },
  {
    code: 'kurukh',
    name: 'Kurukh (Oraon)',
    nativeName: 'ᱠᱩᱲᱩᱠᱷ (कुडुख़)',
    script: 'Tolong Siki / Devanagari',
    region: 'Gumla, Lohardaga & Latehar',
    greetingAudioText: 'नमस्ते! कुडुख़ भाषा में सीखें',
    audioLang: 'hindi',
    badge: 'Oraon Heritage',
    accentColor: '#EC4899',
    bgColor: 'bg-pink-50/70',
    borderColor: 'border-pink-300',
  },
  {
    code: 'nagpuri',
    name: 'Nagpuri (Sadri)',
    nativeName: 'नागपुरी (সাদরি)',
    script: 'Devanagari / Kaithi',
    region: 'Chota Nagpur Lingua Franca',
    greetingAudioText: 'जोहार! नागपुरी और संथाली में सीखें',
    audioLang: 'hindi',
    badge: 'Regional Bridge',
    accentColor: '#06B6D4',
    bgColor: 'bg-cyan-50/70',
    borderColor: 'border-cyan-300',
  },
];

export const LanguageSelectionScreen: React.FC = () => {
  const navigate = useNavigate();
  const { currentLanguage, setCurrentLanguage } = useThemeStore();
  const { role, loginDemoTeacher, loginDemoStudent } = useAuthStore();

  const [selectedLang, setSelectedLang] = useState<string>(currentLanguage || 'santhali');
  const [selectedGrade, setSelectedGrade] = useState<string>('Grade 2');
  const [selectedRole, setSelectedRole] = useState<'teacher' | 'student'>(role === 'student' ? 'student' : 'teacher');

  const handleHearGreeting = (e: React.MouseEvent, opt: LanguageOption) => {
    e.stopPropagation();
    speechSynthesisService.speak(opt.greetingAudioText, opt.audioLang);
  };

  const handleStart = () => {
    setCurrentLanguage(selectedLang as any);
    if (selectedRole === 'teacher') {
      loginDemoTeacher('sangeeta');
    } else {
      loginDemoStudent('s1');
    }
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#FFFDF7] p-4 sm:p-8 lg:p-12 font-sans text-slate-800 space-y-8 max-w-5xl mx-auto select-none">
      {/* Dynamic Fonts */}
      <style>{`
        .font-baloo { font-family: 'Baloo 2', 'Poppins', cursive, sans-serif; }
        .font-devanagari { font-family: 'Noto Sans Devanagari', system-ui, sans-serif; }
        .font-olchiki { font-family: 'Noto Sans Ol Chiki', system-ui, sans-serif; }
      `}</style>

      {/* Top Banner with Mascot */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white rounded-[24px] border border-[#F1EFE8] p-6 shadow-xs">
        <div className="space-y-1.5 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-blue-100 text-blue-900 text-xs font-bold">
            <Sparkles size={13} className="text-blue-600" />
            <span>Classroom Language Configuration</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-baloo">
            Select Your Learning Language
          </h1>
          <p className="text-sm font-semibold text-slate-600 font-devanagari">
            अपनी शिक्षण भाषा चुनें • ᱟᱢᱟᱜ ᱥᱮᱪᱮᱫ ᱯᱟᱹᱨᱥᱤ ᱵᱟᱪᱷᱟᱣ ᱢᱮ
          </p>
        </div>

        <div className="shrink-0">
          <JoharHornbill size="md" speechBubble="Choose your mother tongue! 🦜" />
        </div>
      </div>

      {/* 1. PRIMARY LANGUAGES SECTION */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-extrabold text-slate-900 font-baloo">
            Primary Classroom Languages (FLN Stage)
          </h2>
          <span className="text-xs font-bold text-slate-500">
            Santali Ol Chiki • Hindi • English
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {PRIMARY_LANGUAGES.map((opt) => {
            const isSelected = selectedLang === opt.code;
            return (
              <motion.div
                key={opt.code}
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedLang(opt.code)}
                className={`rounded-[24px] p-5 border-2 transition-all cursor-pointer relative shadow-xs ${
                  opt.bgColor
                } ${isSelected ? `${opt.borderColor} ring-3 ring-blue-400 shadow-md` : 'border-slate-200/80 hover:border-slate-300'}`}
              >
                {/* Active checkmark */}
                {isSelected && (
                  <div className="absolute top-4 right-4 w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-xs">
                    <Check size={14} strokeWidth={3} />
                  </div>
                )}

                <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-white text-slate-700 border border-slate-200">
                  {opt.badge}
                </span>

                <div className="mt-3 space-y-1">
                  <h3 className="text-xl font-extrabold text-slate-900 font-baloo">
                    {opt.name}
                  </h3>
                  <div className="text-2xl font-black text-slate-900 font-olchiki">
                    {opt.nativeName}
                  </div>
                  <p className="text-xs font-bold text-slate-600">
                    Script: {opt.script}
                  </p>
                  <p className="text-[11px] text-slate-500 line-clamp-1">
                    {opt.region}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={(e) => handleHearGreeting(e, opt)}
                    className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-800 text-xs font-bold flex items-center gap-1.5 shadow-2xs border border-slate-200 cursor-pointer"
                  >
                    <Volume2 size={14} className="text-blue-600" />
                    <span>Hear Audio</span>
                  </button>
                  <span className="text-xs font-extrabold text-blue-700">
                    {isSelected ? 'Active ✓' : 'Select'}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* 2. EXPANDABLE TRIBAL LANGUAGES SECTION */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-extrabold text-slate-900 font-baloo">
            Tribal Heritage Languages (Jharkhand Regional Cohorts)
          </h2>
          <span className="text-xs font-bold text-slate-500">
            Mundari • Ho • Kurukh • Nagpuri
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {TRIBAL_LANGUAGES.map((opt) => {
            const isSelected = selectedLang === opt.code;
            return (
              <motion.div
                key={opt.code}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedLang(opt.code)}
                className={`rounded-[22px] p-4 border transition-all cursor-pointer relative shadow-xs ${
                  opt.bgColor
                } ${isSelected ? `${opt.borderColor} ring-3 ring-amber-400 shadow-md` : 'border-slate-200/80 hover:border-slate-300'}`}
              >
                {isSelected && (
                  <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-amber-600 text-white flex items-center justify-center">
                    <Check size={12} strokeWidth={3} />
                  </div>
                )}

                <span className="text-[9px] font-extrabold px-2 py-0.5 rounded-full bg-white text-slate-700 border border-slate-200">
                  {opt.badge}
                </span>

                <div className="mt-2.5 space-y-0.5">
                  <h4 className="text-base font-extrabold text-slate-900 font-baloo">
                    {opt.name}
                  </h4>
                  <div className="text-lg font-bold text-slate-800 font-olchiki">
                    {opt.nativeName}
                  </div>
                  <p className="text-[11px] text-slate-500">
                    {opt.region}
                  </p>
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-200/60 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={(e) => handleHearGreeting(e, opt)}
                    className="p-1.5 rounded-lg bg-white text-slate-700 hover:text-blue-600 border border-slate-200 cursor-pointer"
                    title="Pronounce greeting"
                  >
                    <Volume2 size={14} />
                  </button>
                  <span className="text-[11px] font-bold text-slate-600">
                    {isSelected ? 'Selected' : 'Choose'}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* 3. CLASSROOM SETTINGS: GRADE & USER ROLE */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white rounded-[24px] border border-[#F1EFE8] p-6 shadow-xs">
        {/* Grade Selection */}
        <div className="space-y-3">
          <label className="text-sm font-extrabold text-slate-900 font-baloo block">
            Select Class / Grade Level (कक्षा)
          </label>
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
            {['Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5'].map((grd) => (
              <button
                key={grd}
                type="button"
                onClick={() => setSelectedGrade(grd)}
                className={`min-h-[44px] px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedGrade === grd
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                {grd}
              </button>
            ))}
          </div>
          <p className="text-xs text-slate-500 font-medium">
            Active: <strong>{selectedGrade} MTB-MLE Foundational Literacy</strong>
          </p>
        </div>

        {/* User Role Selection */}
        <div className="space-y-3">
          <label className="text-sm font-extrabold text-slate-900 font-baloo block">
            Who is using the app? (भूमिका)
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setSelectedRole('teacher')}
              className={`min-h-[48px] p-3 rounded-2xl border text-left flex items-center gap-3 transition-all cursor-pointer ${
                selectedRole === 'teacher'
                  ? 'bg-blue-50 border-blue-400 ring-2 ring-blue-300'
                  : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                <GraduationCap size={20} />
              </div>
              <div>
                <div className="text-xs font-extrabold text-slate-900">Teacher (शिक्षक)</div>
                <div className="text-[10px] text-slate-500">Lesson Plans & Worksheets</div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setSelectedRole('student')}
              className={`min-h-[48px] p-3 rounded-2xl border text-left flex items-center gap-3 transition-all cursor-pointer ${
                selectedRole === 'student'
                  ? 'bg-emerald-50 border-emerald-400 ring-2 ring-emerald-300'
                  : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                <UserCheck size={20} />
              </div>
              <div>
                <div className="text-xs font-extrabold text-slate-900">Student (विद्यार्थी)</div>
                <div className="text-[10px] text-slate-500">Flashcards & Stories</div>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
        <button
          type="button"
          onClick={() => navigate('/splash')}
          className="text-xs font-bold text-slate-500 hover:text-slate-800 cursor-pointer"
        >
          ← Back to Welcome Splash
        </button>

        <motion.button
          type="button"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleStart}
          className="w-full sm:w-auto min-h-[52px] px-10 py-3.5 rounded-2xl bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-base shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2"
        >
          <span>Start Learning • ᱮᱛᱚᱦᱚᱵᱽ ᱢᱮ</span>
          <ArrowRight size={18} />
        </motion.button>
      </div>
    </div>
  );
};

export default LanguageSelectionScreen;
