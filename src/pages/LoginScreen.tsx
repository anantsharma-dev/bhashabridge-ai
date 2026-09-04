import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  GraduationCap,
  UserCheck,
  Phone,
  Mail,
  Lock,
  ArrowRight,
  AlertCircle,
  KeyRound,
} from 'lucide-react';
import { useAuthStore } from '../services/authStore';
import { JoharHornbill } from '../components/ui/JoharHornbill';

export const LoginScreen: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as any)?.from?.pathname || '/dashboard';

  const {
    loginWithGoogle,
    sendPhoneOtp,
    verifyPhoneOtp,
    loginWithEmail,
    registerWithEmail,
    loginStudent,
    loginDemoTeacher,
    loginDemoStudent,
    phoneState,
    authError,
    isLoading,
    clearError,
  } = useAuthStore();

  const [activeTab, setActiveTab] = useState<'teacher' | 'student'>('teacher');
  const [teacherAuthMethod, setTeacherAuthMethod] = useState<'google' | 'phone' | 'email'>('google');

  // Phone state
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpCode, setOtpCode] = useState('');

  // Email state
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [schoolName, setSchoolName] = useState('GPS Dumka Tribal Primary School');

  // Student state
  const [classroomCode, setClassroomCode] = useState('JH-DUMKA-01');
  const [studentId, setStudentId] = useState('s1');
  const [pin, setPin] = useState('');

  const handleGoogleSignIn = async () => {
    try {
      clearError();
      await loginWithGoogle();
      navigate(from, { replace: true });
    } catch {
      // error handled in store
    }
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber.trim()) return;
    try {
      clearError();
      await sendPhoneOtp(phoneNumber);
    } catch {
      // error handled in store
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpCode.trim()) return;
    try {
      clearError();
      await verifyPhoneOtp(otpCode);
      navigate(from, { replace: true });
    } catch {
      // error handled in store
    }
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      clearError();
      if (isRegister) {
        await registerWithEmail(email, password, displayName, schoolName);
      } else {
        await loginWithEmail(email, password);
      }
      navigate(from, { replace: true });
    } catch {
      // error handled in store
    }
  };

  const handleStudentLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      clearError();
      await loginStudent(classroomCode, studentId, pin);
      navigate(from, { replace: true });
    } catch {
      // error handled in store
    }
  };

  const handleQuickDemoTeacher = (preset: 'sangeeta' | 'birsa') => {
    loginDemoTeacher(preset);
    navigate(from, { replace: true });
  };

  const handleQuickDemoStudent = (id: string) => {
    loginDemoStudent(id);
    navigate(from, { replace: true });
  };

  return (
    <div className="min-h-screen bg-[#FFFDF7] p-4 sm:p-8 flex flex-col items-center justify-center font-sans text-slate-800 select-none">
      {/* Dynamic Fonts */}
      <style>{`
        .font-baloo { font-family: 'Baloo 2', 'Poppins', cursive, sans-serif; }
        .font-devanagari { font-family: 'Noto Sans Devanagari', system-ui, sans-serif; }
        .font-olchiki { font-family: 'Noto Sans Ol Chiki', system-ui, sans-serif; }
      `}</style>

      <div id="recaptcha-container" />

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg space-y-6"
      >
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-1">
            <JoharHornbill size="md" waving={true} speechBubble="Johar! Please sign in 🦜" />
          </div>
          <h1 className="text-3xl font-black text-slate-900 font-baloo">
            BhashaBridge AI
          </h1>
          <p className="text-sm font-semibold text-slate-600 font-devanagari">
            झारखंड प्राथमिक विद्यालय बहुभाषी कक्षा लॉगिन
          </p>
        </div>

        {/* Primary Role Tabs */}
        <div className="p-1 rounded-2xl bg-slate-200/80 grid grid-cols-2 gap-1">
          <button
            type="button"
            onClick={() => {
              setActiveTab('teacher');
              clearError();
            }}
            className={`min-h-[46px] rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeTab === 'teacher'
                ? 'bg-white text-blue-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <GraduationCap size={18} />
            <span>Teacher (शिक्षक)</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('student');
              clearError();
            }}
            className={`min-h-[46px] rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeTab === 'student'
                ? 'bg-white text-emerald-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <UserCheck size={18} />
            <span>Student (विद्यार्थी)</span>
          </button>
        </div>

        {/* Error Banner */}
        {authError && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold flex items-center gap-2"
          >
            <AlertCircle size={16} className="shrink-0 text-rose-600" />
            <span>{authError}</span>
          </motion.div>
        )}

        {/* TEACHER TAB */}
        {activeTab === 'teacher' ? (
          <div className="bg-white rounded-[24px] border border-[#F1EFE8] p-6 shadow-xs space-y-6">
            {/* Teacher Auth Method Pills */}
            <div className="flex items-center justify-center gap-2 border-b border-slate-100 pb-4">
              <button
                type="button"
                onClick={() => setTeacherAuthMethod('google')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  teacherAuthMethod === 'google'
                    ? 'bg-blue-100 text-blue-800 border border-blue-200'
                    : 'bg-slate-50 text-slate-600'
                }`}
              >
                Google
              </button>
              <button
                type="button"
                onClick={() => setTeacherAuthMethod('phone')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  teacherAuthMethod === 'phone'
                    ? 'bg-blue-100 text-blue-800 border border-blue-200'
                    : 'bg-slate-50 text-slate-600'
                }`}
              >
                Mobile OTP
              </button>
              <button
                type="button"
                onClick={() => setTeacherAuthMethod('email')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  teacherAuthMethod === 'email'
                    ? 'bg-blue-100 text-blue-800 border border-blue-200'
                    : 'bg-slate-50 text-slate-600'
                }`}
              >
                Email
              </button>
            </div>

            {/* Method 1: Google Sign In */}
            {teacherAuthMethod === 'google' && (
              <div className="space-y-4 text-center">
                <p className="text-xs text-slate-500 font-medium">
                  Sign in securely with your Jharkhand Department of Education or Google account.
                </p>

                <button
                  type="button"
                  disabled={isLoading}
                  onClick={handleGoogleSignIn}
                  className="w-full min-h-[50px] px-6 py-3 rounded-2xl bg-white hover:bg-slate-50 text-slate-800 border-2 border-slate-200 font-bold text-sm shadow-2xs flex items-center justify-center gap-3 cursor-pointer transition-all disabled:opacity-50"
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
                  <span>{isLoading ? 'Connecting...' : 'Continue with Google'}</span>
                </button>
              </div>
            )}

            {/* Method 2: Mobile OTP */}
            {teacherAuthMethod === 'phone' && (
              <div className="space-y-4">
                {!phoneState.isOtpSent ? (
                  <form onSubmit={handleSendOtp} className="space-y-3">
                    <label className="text-xs font-bold text-slate-700 block">
                      Mobile Number (मोबाइल नंबर)
                    </label>
                    <div className="relative">
                      <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="tel"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="+91 98765 43210"
                        className="w-full min-h-[46px] pl-10 pr-4 rounded-xl bg-slate-50 border border-slate-200 text-sm font-semibold focus:ring-2 focus:ring-blue-400"
                        required
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={isLoading || !phoneNumber.trim()}
                      className="w-full min-h-[48px] rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs cursor-pointer shadow-xs disabled:opacity-50"
                    >
                      {isLoading ? 'Sending SMS...' : 'Send OTP Code'}
                    </button>
                  </form>
                ) : (
                  <form onSubmit={handleVerifyOtp} className="space-y-3">
                    <label className="text-xs font-bold text-slate-700 block">
                      Enter 6-Digit OTP sent to {phoneNumber}
                    </label>
                    <input
                      type="text"
                      maxLength={6}
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value)}
                      placeholder="123456"
                      className="w-full min-h-[48px] px-4 text-center tracking-widest text-lg font-bold rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-blue-400"
                      required
                    />
                    <button
                      type="submit"
                      disabled={isLoading || otpCode.length < 4}
                      className="w-full min-h-[48px] rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs cursor-pointer shadow-xs disabled:opacity-50"
                    >
                      {isLoading ? 'Verifying...' : 'Verify & Enter Classroom'}
                    </button>
                  </form>
                )}
              </div>
            )}

            {/* Method 3: Email & Password */}
            {teacherAuthMethod === 'email' && (
              <form onSubmit={handleEmailSubmit} className="space-y-3">
                {isRegister && (
                  <>
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">
                        Teacher Full Name
                      </label>
                      <input
                        type="text"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        placeholder="Sangeeta Soren"
                        className="w-full min-h-[44px] px-3.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-semibold"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">
                        School Name
                      </label>
                      <input
                        type="text"
                        value={schoolName}
                        onChange={(e) => setSchoolName(e.target.value)}
                        placeholder="GPS Dumka Tribal School"
                        className="w-full min-h-[44px] px-3.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-semibold"
                        required
                      />
                    </div>
                  </>
                )}

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="teacher@jharkhand.edu.in"
                      className="w-full min-h-[44px] pl-10 pr-4 rounded-xl bg-slate-50 border border-slate-200 text-sm font-semibold"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full min-h-[44px] pl-10 pr-4 rounded-xl bg-slate-50 border border-slate-200 text-sm font-semibold"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full min-h-[48px] rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs cursor-pointer shadow-xs disabled:opacity-50"
                >
                  {isLoading ? 'Processing...' : isRegister ? 'Register Teacher Account' : 'Sign In'}
                </button>

                <div className="text-center pt-1">
                  <button
                    type="button"
                    onClick={() => setIsRegister(!isRegister)}
                    className="text-xs font-bold text-blue-600 hover:underline cursor-pointer"
                  >
                    {isRegister ? 'Already registered? Sign In' : 'New Teacher? Create Account'}
                  </button>
                </div>
              </form>
            )}

            {/* Quick Demo Logins */}
            <div className="pt-4 border-t border-slate-100 space-y-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Instant Offline Testing (One-Click)
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickDemoTeacher('sangeeta')}
                  className="p-2 rounded-xl bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-200 text-xs font-bold text-left cursor-pointer transition-colors"
                >
                  <div className="font-extrabold">Sangeeta Soren</div>
                  <div className="text-[10px] text-slate-400">Dumka Block (Grade 1 & 2)</div>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickDemoTeacher('birsa')}
                  className="p-2 rounded-xl bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-200 text-xs font-bold text-left cursor-pointer transition-colors"
                >
                  <div className="font-extrabold">Birsa Besra</div>
                  <div className="text-[10px] text-slate-400">Bundu Block (Grade 2 & 3)</div>
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* STUDENT TAB */
          <div className="bg-white rounded-[24px] border border-[#F1EFE8] p-6 shadow-xs space-y-6">
            <form onSubmit={handleStudentLogin} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Classroom Code (कक्षा कोड)
                </label>
                <div className="relative">
                  <KeyRound size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={classroomCode}
                    onChange={(e) => setClassroomCode(e.target.value.toUpperCase())}
                    placeholder="JH-DUMKA-01"
                    className="w-full min-h-[46px] pl-10 pr-4 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold uppercase focus:ring-2 focus:ring-emerald-400"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Student Name or ID (विद्यार्थी)
                </label>
                <select
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  className="w-full min-h-[46px] px-3.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-semibold focus:ring-2 focus:ring-emerald-400 cursor-pointer"
                >
                  <option value="s1">👦 Ravi Marandi (ᱨᱚᱵᱤ ᱢᱟᱨᱟᱱᱰᱤ) — PIN: 1234</option>
                  <option value="s2">👧 Pooja Hansda (ᱯᱩᱡᱟ ᱦᱟᱸᱥᱫᱟᱜ) — PIN: 2345</option>
                  <option value="s3">👦 Amit Murmu (ᱚᱢᱤᱛ ᱢᱩᱨᱢᱩ) — PIN: 3456</option>
                  <option value="s4">👧 Sunita Hembrom (ᱥᱩᱱᱤᱛᱟ ᱦᱮᱢᱵᱽᱨᱚᱢ) — PIN: 4567</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  4-Digit Secret PIN (४-अंकीय पिन)
                </label>
                <input
                  type="password"
                  maxLength={4}
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  placeholder="••••"
                  className="w-full min-h-[48px] text-center tracking-widest text-2xl font-bold rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-emerald-400"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isLoading || pin.length < 4}
                className="w-full min-h-[50px] rounded-2xl bg-[#10B981] hover:bg-emerald-600 text-white font-bold text-sm shadow-md cursor-pointer transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <span>Enter Classroom • ᱵᱚᱞᱚᱱ ᱢᱮ</span>
                <ArrowRight size={18} />
              </button>
            </form>

            {/* Quick Demo Student */}
            <div className="pt-4 border-t border-slate-100 space-y-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Instant Student Access (Demo)
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickDemoStudent('s1')}
                  className="p-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 text-xs font-bold text-left cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-1 font-extrabold">
                    <span>👦 Ravi Marandi</span>
                  </div>
                  <div className="text-[10px] text-emerald-700">⭐ 48 Stars • Grade 2</div>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickDemoStudent('s2')}
                  className="p-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 text-xs font-bold text-left cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-1 font-extrabold">
                    <span>👧 Pooja Hansda</span>
                  </div>
                  <div className="text-[10px] text-emerald-700">⭐ 42 Stars • Grade 2</div>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Back to Dashboard Link */}
        <div className="text-center pt-2">
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="text-xs font-bold text-slate-500 hover:text-slate-800 cursor-pointer"
          >
            ← Continue as Guest to Dashboard
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginScreen;
