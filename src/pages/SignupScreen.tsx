import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Mail,
  Lock,
  User,
  School,
  MapPin,
  Globe,
  ArrowRight,
  AlertCircle,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { JoharHornbill } from '../components/ui/JoharHornbill';

const JHARKHAND_DISTRICTS = [
  'Dumka',
  'Ranchi',
  'East Singhbhum (Jamshedpur)',
  'West Singhbhum (Chaibasa)',
  'Pakur',
  'Sahibganj',
  'Deoghar',
  'Godda',
  'Jamtara',
  'Bokaro',
  'Dhanbad',
  'Giridih',
  'Hazaribagh',
  'Ramgarh',
  'Khunti',
  'Gumla',
  'Simdega',
  'Lohardaga',
  'Latehar',
  'Palamu',
  'Garhwa',
  'Koderma',
  'Chatra',
  'Seraikela Kharsawan',
];

export const SignupScreen: React.FC = () => {
  const navigate = useNavigate();
  const { signup, loginWithGoogle, loading, error, clearError } = useAuth();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [district, setDistrict] = useState('Dumka');
  const [block, setBlock] = useState('Dumka Sadar');
  const [school, setSchool] = useState('GPS Dumka Tribal Primary School');
  const [languagePreference, setLanguagePreference] = useState('Hindi + Santali (Ol Chiki)');
  const [formValidation, setFormValidation] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setFormValidation(null);

    if (password.length < 6) {
      setFormValidation('Password must be at least 6 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setFormValidation('Passwords do not match.');
      return;
    }

    try {
      await signup(email, password, {
        name: fullName.trim(),
        district,
        block: block.trim(),
        school: school.trim(),
        languagePreference,
        role: 'teacher',
        avatar: '👩‍🏫',
      });
      navigate('/dashboard', { replace: true });
    } catch {
      // Error handled by AuthContext
    }
  };

  const handleGoogleSignup = async () => {
    try {
      clearError();
      await loginWithGoogle({
        district,
        block: block.trim(),
        school: school.trim(),
        languagePreference,
      });
      navigate('/dashboard', { replace: true });
    } catch {
      // Error handled by AuthContext
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFDF7] p-4 sm:p-8 flex flex-col items-center justify-center font-sans text-slate-800 select-none">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-xl space-y-6"
      >
        {/* Mascot & Header */}
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-1">
            <JoharHornbill size="md" waving={true} speechBubble="Welcome Teacher! 🌸" />
          </div>
          <h1 className="text-3xl font-black text-slate-900 font-baloo">
            Join BhashaBridge AI
          </h1>
          <p className="text-sm font-semibold text-slate-600">
            झारखंड प्राथमिक शिक्षक पंजीकरण (Teacher Registration)
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-[24px] border border-[#F1EFE8] p-6 sm:p-8 shadow-xs space-y-6">
          {/* Quick Google Sign In */}
          <button
            type="button"
            disabled={loading}
            onClick={handleGoogleSignup}
            className="w-full min-h-[48px] px-6 py-2.5 rounded-2xl bg-white hover:bg-slate-50 text-slate-800 border-2 border-slate-200 font-bold text-sm shadow-2xs flex items-center justify-center gap-3 cursor-pointer transition-all disabled:opacity-50"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.35 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.35 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
              />
            </svg>
            <span>Register with Google</span>
          </button>

          <div className="relative flex items-center justify-center">
            <div className="border-t border-slate-200 w-full" />
            <span className="bg-white px-3 text-xs font-bold text-slate-400 uppercase tracking-wider absolute">
              or fill details
            </span>
          </div>

          {/* Validation or Auth Error */}
          {(formValidation || error) && (
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold flex items-center gap-2">
              <AlertCircle size={16} className="shrink-0 text-rose-600" />
              <span>{formValidation || error}</span>
            </div>
          )}

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Full Name */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Full Name (शिक्षक का नाम) *
                </label>
                <div className="relative">
                  <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Sangeeta Soren"
                    required
                    className="w-full min-h-[44px] pl-10 pr-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold focus:ring-2 focus:ring-blue-400"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Email Address *
                </label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="teacher@jharkhand.edu.in"
                    required
                    className="w-full min-h-[44px] pl-10 pr-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold focus:ring-2 focus:ring-blue-400"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Password */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Password (पासवर्ड) *
                </label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min 6 characters"
                    required
                    className="w-full min-h-[44px] pl-10 pr-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold focus:ring-2 focus:ring-blue-400"
                  />
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Confirm Password *
                </label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter password"
                    required
                    className="w-full min-h-[44px] pl-10 pr-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold focus:ring-2 focus:ring-blue-400"
                  />
                </div>
              </div>
            </div>

            {/* District & Block */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  District (जिला) *
                </label>
                <div className="relative">
                  <MapPin size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <select
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="w-full min-h-[44px] pl-10 pr-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold focus:ring-2 focus:ring-blue-400 cursor-pointer"
                  >
                    {JHARKHAND_DISTRICTS.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Block (प्रखंड) *
                </label>
                <input
                  type="text"
                  value={block}
                  onChange={(e) => setBlock(e.target.value)}
                  placeholder="Dumka Sadar"
                  required
                  className="w-full min-h-[44px] px-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold focus:ring-2 focus:ring-blue-400"
                />
              </div>
            </div>

            {/* School Name */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                School Name (विद्यालय का नाम) *
              </label>
              <div className="relative">
                <School size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={school}
                  onChange={(e) => setSchool(e.target.value)}
                  placeholder="GPS Dumka Tribal Primary School"
                  required
                  className="w-full min-h-[44px] pl-10 pr-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold focus:ring-2 focus:ring-blue-400"
                />
              </div>
            </div>

            {/* Language Preference */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Classroom Language Medium (भाषा माध्यम)
              </label>
              <div className="relative">
                <Globe size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <select
                  value={languagePreference}
                  onChange={(e) => setLanguagePreference(e.target.value)}
                  className="w-full min-h-[44px] pl-10 pr-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold focus:ring-2 focus:ring-blue-400 cursor-pointer"
                >
                  <option value="Hindi + Santali (Ol Chiki)">Hindi + Santali (Ol Chiki / ᱚᱞ ᱪᱤᱠᱤ)</option>
                  <option value="Hindi + Mundari">Hindi + Mundari (मुंडारी)</option>
                  <option value="Hindi + Kurukh (Oraon)">Hindi + Kurukh / Oraon (कुड़ुख़)</option>
                  <option value="Hindi + Ho (Warang Citi)">Hindi + Ho (Warang Citi / ᱣᱟᱨᱟᱝ ᱪᱤᱛᱤ)</option>
                  <option value="Hindi + English">Hindi + English</option>
                </select>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full min-h-[48px] mt-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm cursor-pointer shadow-xs disabled:opacity-50 flex items-center justify-center gap-2 transition-colors"
            >
              {loading ? (
                <span>Creating Teacher Account...</span>
              ) : (
                <>
                  <span>Create Account & Enter Portal</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          {/* Link back to Login */}
          <div className="pt-2 text-center text-xs font-semibold text-slate-600">
            Already have a teacher account?{' '}
            <Link to="/login" className="text-blue-600 hover:underline font-bold">
              Sign In here
            </Link>
          </div>
        </div>

        {/* Footer info */}
        <div className="text-center text-xs text-slate-400">
          Supported by Jharkhand MTB-MLE Multilingual Education Framework • 2026
        </div>
      </motion.div>
    </div>
  );
};

export default SignupScreen;
