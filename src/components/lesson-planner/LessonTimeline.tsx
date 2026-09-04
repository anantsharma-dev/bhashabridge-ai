import React, { useState } from 'react';
import { Clock, Edit3, ChevronDown, ChevronUp } from 'lucide-react';

export interface TimelineStep {
  id: string;
  phase: string;
  duration: string;
  titleHindi: string;
  titleEnglish: string;
  activityDescription: string;
  teacherPrompt: string;
  color: string;
}

export interface LessonTimelineProps {
  className?: string;
}

export const LessonTimeline: React.FC<LessonTimelineProps> = ({ className = '' }) => {
  const [expandedId, setExpandedId] = useState<string | null>('1');

  const timelineSteps: TimelineStep[] = [
    {
      id: '1',
      phase: '1. Introduction',
      duration: '5 Mins',
      titleEnglish: 'Johar Welcome & Classroom Check-in',
      titleHindi: 'जोहार अभिवादन एवं स्वागत',
      activityDescription: 'Teacher greets students in Santali ("Johar gidra!") and initiates a friendly weather/mood check.',
      teacherPrompt: 'Greet: "ᱡᱚᱦᱟᱨ ᱜᱤᱫᱽᱨᱟᱹ! ᱛᱮᱦᱮᱧ ᱫᱚ ᱵᱚᱱ ᱱᱟᱣᱟ ᱡᱤᱵᱽ ᱡᱤᱭᱟᱹᱞᱤ ᱧᱩᱛᱩᱢ ᱪᱮᱫᱚᱜ-ᱟ ᱾"',
      color: 'border-amber-400 bg-amber-50/60',
    },
    {
      id: '2',
      phase: '2. Warm-up',
      duration: '5 Mins',
      titleEnglish: 'Santhali Animal Riddle Game',
      titleHindi: 'पशुओं की पारंपरिक पहेली',
      activityDescription: 'Oral riddle: "Who has large ears and sprinkles water with its trunk? (ᱦᱟᱹᱛᱤ / हाथी)".',
      teacherPrompt: 'Ask: "ᱚᱠᱚᱭᱟᱜ ᱢᱟᱨᱟᱝ ᱞᱩᱛᱩᱨ ᱟᱨ ᱥᱩᱸᱰ ᱢᱮᱱᱟᱜ-ᱟ?" (Who has big ears and trunk?)',
      color: 'border-blue-400 bg-blue-50/60',
    },
    {
      id: '3',
      phase: '3. Story Time',
      duration: '10 Mins',
      titleEnglish: 'Bilingual Folk Tale: The Clever Fox & Elephant',
      titleHindi: 'लोककथा: चालाक लोमड़ी और हाथी',
      activityDescription: 'Interactive reading with picture flashcards highlighting tribal forest animals.',
      teacherPrompt: 'Narrate story in Hindi and point out the Santali names for characters.',
      color: 'border-purple-400 bg-purple-50/60',
    },
    {
      id: '4',
      phase: '4. Vocabulary',
      duration: '8 Mins',
      titleEnglish: '6 New Animal Words in Ol Chiki',
      titleHindi: 'छह नए पशुओं के नाम ओल चिकी में',
      activityDescription: 'Direct instruction with Ol Chiki flashcards: Hati (Elephant), Kul (Tiger), Gai (Cow), etc.',
      teacherPrompt: 'Repeat each word 3 times with rhythm and hand gestures.',
      color: 'border-emerald-400 bg-emerald-50/60',
    },
    {
      id: '5',
      phase: '5. Activity',
      duration: '10 Mins',
      titleEnglish: 'Animal Sound Mimic & Match Game',
      titleHindi: 'पशु आवाज़ व अभिनय खेल',
      activityDescription: 'Students make animal sounds and peer groups guess the name in Santali and Hindi.',
      teacherPrompt: 'Group students in pairs: One makes sound, other points to the Ol Chiki flashcard.',
      color: 'border-orange-400 bg-orange-50/60',
    },
    {
      id: '6',
      phase: '6. Practice',
      duration: '10 Mins',
      titleEnglish: 'Worksheet Matching & Letter Tracing',
      titleHindi: 'कार्यपत्रक अभ्यास व अक्षर अनुरेखण',
      activityDescription: 'Students complete the 6-question printed worksheet matching animal pictures to words.',
      teacherPrompt: 'Walk around providing individual guidance to students needing support in Ol Chiki writing.',
      color: 'border-blue-400 bg-blue-50/60',
    },
    {
      id: '7',
      phase: '7. Assessment',
      duration: '5 Mins',
      titleEnglish: 'Quick Thumbs Up / Thumbs Down Oral Check',
      titleHindi: 'त्वरित मौखिक मूल्यांकन',
      activityDescription: 'Informal formative check: Teacher says "Hati means cow?" Students respond thumbs up/down.',
      teacherPrompt: 'Record student mastery rate in teacher classroom log.',
      color: 'border-rose-400 bg-rose-50/60',
    },
    {
      id: '8',
      phase: '8. Homework',
      duration: '2 Mins',
      titleEnglish: 'Family Story Reflection',
      titleHindi: 'घर पर दादा-दादी से पशु कहानी सुनना',
      activityDescription: 'Ask parents or grandparents for a local Santhali folktale about birds or animals.',
      teacherPrompt: 'Tell children: "Share one animal story from your village tomorrow!"',
      color: 'border-amber-400 bg-amber-50/60',
    },
    {
      id: '9',
      phase: '9. Teacher Reflection',
      duration: 'Post-Class',
      titleEnglish: 'Pedagogical Self-Assessment Notes',
      titleHindi: 'शिक्षक चिंतन एवं मूल्यांकन डायरी',
      activityDescription: 'Notes space for what worked well and which children require additional phonics support.',
      teacherPrompt: 'Reflection note: 22/25 students correctly pronounced "ᱦᱟᱹᱛᱤ" on first attempt.',
      color: 'border-slate-400 bg-slate-50/60',
    },
  ];

  return (
    <div
      className={`rounded-[24px] bg-white border border-[#F1EFE8] p-6 sm:p-7 shadow-[0_4px_20px_rgba(0,0,0,0.04)] space-y-6 ${className}`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#FAF5FF] text-purple-900 border border-purple-200">
              Generated Timeline
            </span>
            <span className="text-xs font-medium text-slate-500">
              Total Duration: 45 Minutes
            </span>
          </div>
          <h3 className="text-xl font-extrabold text-slate-900 font-baloo mt-1">
            Step-by-Step Classroom Timeline (Editable)
          </h3>
        </div>

        <button
          type="button"
          className="self-start sm:self-auto min-h-[38px] px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
        >
          <Edit3 size={14} />
          <span>Customize Schedule</span>
        </button>
      </div>

      {/* Timeline Steps Accordion */}
      <div className="space-y-3">
        {timelineSteps.map((step) => {
          const isExpanded = expandedId === step.id;
          return (
            <div
              key={step.id}
              className={`rounded-2xl border-l-4 border p-4 transition-all ${step.color}`}
            >
              <div
                className="flex items-center justify-between cursor-pointer select-none"
                onClick={() => setExpandedId(isExpanded ? null : step.id)}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xs font-extrabold px-2.5 py-1 rounded-full bg-white text-slate-800 shadow-2xs border border-slate-200">
                    {step.phase}
                  </span>
                  <div>
                    <h4 className="text-sm font-extrabold text-slate-900 font-baloo">
                      {step.titleEnglish}
                    </h4>
                    <p className="text-xs font-semibold text-slate-600 font-devanagari">
                      {step.titleHindi}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
                    <Clock size={13} /> {step.duration}
                  </span>
                  {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </div>
              </div>

              {/* Expanded details */}
              {isExpanded && (
                <div className="mt-3 pt-3 border-t border-slate-200/80 space-y-2 text-xs">
                  <p className="text-slate-700 font-medium leading-relaxed">
                    <strong>Activity:</strong> {step.activityDescription}
                  </p>
                  <div className="p-2.5 rounded-xl bg-white/90 border border-slate-200 text-slate-800">
                    <strong>Suggested Teacher Dialogue:</strong> {step.teacherPrompt}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
