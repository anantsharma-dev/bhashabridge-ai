import React, { useState } from 'react';
import { Settings, Volume2, Languages, WifiOff, Bell, Eye, Save, Download } from 'lucide-react';

export interface TeacherSettingsFormProps {
  onSaveSettings?: () => void;
  className?: string;
}

export const TeacherSettingsForm: React.FC<TeacherSettingsFormProps> = ({
  onSaveSettings,
  className = '',
}) => {
  const [primaryLang, setPrimaryLang] = useState('hindi');
  const [motherTongue, setMotherTongue] = useState('santali');
  const [voiceSpeed, setVoiceSpeed] = useState('1.0');
  const [autoSync, setAutoSync] = useState(true);
  const [largeText, setLargeText] = useState(true);
  const [audioFeedback, setAudioFeedback] = useState(true);
  const [dailyReminders, setDailyReminders] = useState(true);

  return (
    <div
      className={`rounded-[24px] bg-white border border-[#F1EFE8] p-6 sm:p-7 shadow-[0_4px_20px_rgba(0,0,0,0.04)] space-y-6 ${className}`}
    >
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <Settings size={20} className="text-blue-600" />
          <h3 className="text-lg font-extrabold text-slate-900 font-baloo">
            Teacher Classroom Preferences & AI Model Settings
          </h3>
        </div>
        <span className="text-xs font-bold text-slate-400">
          Dumka Tablet Configuration
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 1. Language Preferences */}
        <div className="p-4 rounded-2xl bg-[#FFFDF7] border border-slate-200/80 space-y-3">
          <h4 className="text-sm font-extrabold text-slate-900 font-baloo flex items-center gap-1.5">
            <Languages size={16} className="text-blue-600" />
            Classroom Language Setup
          </h4>

          <div className="space-y-2 text-xs font-bold text-slate-700">
            <div>
              <label className="block mb-1 text-slate-500">Classroom Instruction Language:</label>
              <select
                value={primaryLang}
                onChange={(e) => setPrimaryLang(e.target.value)}
                className="w-full min-h-[40px] px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-800"
              >
                <option value="hindi">Hindi (हिन्दी - मानक)</option>
                <option value="english">English (Primary)</option>
              </select>
            </div>

            <div>
              <label className="block mb-1 text-slate-500">Student Mother Tongue (MTB-MLE):</label>
              <select
                value={motherTongue}
                onChange={(e) => setMotherTongue(e.target.value)}
                className="w-full min-h-[40px] px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-800"
              >
                <option value="santali">Santali (Ol Chiki - ᱥᱟᱱᱛᱟᱲᱤ)</option>
                <option value="ho">Ho (Warang Citi - ᱦᱳ)</option>
                <option value="mundari">Mundari (Ol Chiki - ᱢᱩᱱᱰᱟᱨᱤ)</option>
                <option value="kurukh">Kurukh (कुड़ुख़)</option>
              </select>
            </div>
          </div>
        </div>

        {/* 2. Voice & Speech Audio Settings */}
        <div className="p-4 rounded-2xl bg-[#FFFDF7] border border-slate-200/80 space-y-3">
          <h4 className="text-sm font-extrabold text-slate-900 font-baloo flex items-center gap-1.5">
            <Volume2 size={16} className="text-emerald-600" />
            Piper TTS Speech & Audio Speed
          </h4>

          <div className="space-y-3 text-xs font-bold text-slate-700">
            <div>
              <label className="block mb-1 text-slate-500">Classroom Pronunciation Speed:</label>
              <div className="flex items-center gap-2">
                {['0.75', '1.0', '1.25'].map((spd) => (
                  <button
                    key={spd}
                    type="button"
                    onClick={() => setVoiceSpeed(spd)}
                    className={`flex-1 min-h-[38px] rounded-xl font-bold text-xs border cursor-pointer ${
                      voiceSpeed === spd
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-2xs'
                        : 'bg-white text-slate-700 border-slate-200'
                    }`}
                  >
                    {spd}x {spd === '0.75' ? '(Slow)' : spd === '1.0' ? '(Normal)' : '(Fast)'}
                  </button>
                ))}
              </div>
            </div>

            <label className="flex items-center justify-between cursor-pointer pt-1">
              <span className="text-slate-600">Tactile Audio Feedback on Button Taps</span>
              <input
                type="checkbox"
                checked={audioFeedback}
                onChange={(e) => setAudioFeedback(e.target.checked)}
                className="w-4 h-4 text-emerald-600 rounded-sm"
              />
            </label>
          </div>
        </div>

        {/* 3. Offline AI Models & Sync */}
        <div className="p-4 rounded-2xl bg-[#FFFDF7] border border-slate-200/80 space-y-3">
          <h4 className="text-sm font-extrabold text-slate-900 font-baloo flex items-center gap-1.5">
            <WifiOff size={16} className="text-purple-600" />
            Offline Sync & Neural Models
          </h4>

          <div className="space-y-2.5 text-xs font-bold text-slate-700">
            <div className="flex items-center justify-between p-2 rounded-xl bg-purple-50/70 border border-purple-200">
              <span>Whisper ASR + IndicTrans2</span>
              <span className="text-purple-800 text-[11px]">Installed (420 MB)</span>
            </div>

            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-slate-600">Auto Sync when Wi-Fi / Charger connected</span>
              <input
                type="checkbox"
                checked={autoSync}
                onChange={(e) => setAutoSync(e.target.checked)}
                className="w-4 h-4 text-purple-600 rounded-sm"
              />
            </label>

            <button
              type="button"
              className="w-full min-h-[38px] px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 text-purple-900 border border-purple-200 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Download size={14} />
              <span>Check for Model Weights Update</span>
            </button>
          </div>
        </div>

        {/* 4. Accessibility & Classroom Notifications */}
        <div className="p-4 rounded-2xl bg-[#FFFDF7] border border-slate-200/80 space-y-3">
          <h4 className="text-sm font-extrabold text-slate-900 font-baloo flex items-center gap-1.5">
            <Eye size={16} className="text-amber-600" />
            Classroom Accessibility & Alerts
          </h4>

          <div className="space-y-2.5 text-xs font-bold text-slate-700">
            <label className="flex items-center justify-between cursor-pointer">
              <div>
                <span className="block text-slate-800">Enlarged Regional Font Size</span>
                <span className="text-[10px] text-slate-400 font-normal">Slightly larger Hindi & Ol Chiki text for chalkboard viewing</span>
              </div>
              <input
                type="checkbox"
                checked={largeText}
                onChange={(e) => setLargeText(e.target.checked)}
                className="w-4 h-4 text-amber-600 rounded-sm"
              />
            </label>

            <label className="flex items-center justify-between cursor-pointer">
              <div className="flex items-center gap-1.5">
                <Bell size={14} className="text-amber-600" />
                <span className="text-slate-800">Daily Morning Lesson Reminders</span>
              </div>
              <input
                type="checkbox"
                checked={dailyReminders}
                onChange={(e) => setDailyReminders(e.target.checked)}
                className="w-4 h-4 text-amber-600 rounded-sm"
              />
            </label>

            {/* Note: Dark mode toggle hidden for future only as per specifications */}
            <div className="p-2 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-500 font-medium">
              ☀️ High-Contrast Daylight Mode is locked for outdoor rural classroom visibility.
            </div>
          </div>
        </div>
      </div>

      {/* Save Settings Button */}
      <div className="pt-2 flex justify-end">
        <button
          type="button"
          onClick={onSaveSettings}
          className="min-h-[48px] px-8 py-3 rounded-2xl bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-sm shadow-md flex items-center gap-2 cursor-pointer transition-colors"
        >
          <Save size={16} />
          <span>Save Classroom Preferences</span>
        </button>
      </div>
    </div>
  );
};
