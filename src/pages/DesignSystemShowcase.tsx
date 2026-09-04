import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Heading,
  Text,
  Badge,
  LanguageBadge,
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
  Input,
  Textarea,
  FloatingMicButton,
  AiAssistantBubble,
  Skeleton,
  CardSkeleton,
  FlashcardSkeleton,
  AudioWaveSkeleton,
  colors,
  useThemeStore,
  type MicState,
} from '../components/ui';
import {
  Sparkles,
  Mic,
  Volume2,
  BookOpen,
  CheckCircle2,
  Layers,
  Palette,
  Type,
  Maximize2,
  Sliders,
  Moon,
  Sun,
  ShieldCheck,
  Search,
} from 'lucide-react';

export const DesignSystemShowcase: React.FC = () => {
  const { isDark, toggleDark, isOffline, setOffline } = useThemeStore();
  const [micState, setMicState] = useState<MicState>('idle');
  const [inputValue, setInputValue] = useState('नमस्ते');
  const [activeTab, setActiveTab] = useState<'all' | 'buttons' | 'cards' | 'ai' | 'inputs'>('all');

  const cycleMic = () => {
    const states: MicState[] = ['idle', 'listening', 'processing', 'speaking'];
    const nextIdx = (states.indexOf(micState) + 1) % states.length;
    setMicState(states[nextIdx]);
  };

  return (
    <div className="space-y-12 pb-16">
      {/* Header Banner */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-[32px] p-6 md:p-10 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 text-white shadow-xl shadow-blue-500/15"
      >
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-white/20 backdrop-blur-md border border-white/30 text-white">
              SIH 2026 • PALASH MTB-MLE
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-400 text-amber-950">
              Design System v1.0
            </span>
          </div>

          <h1 className="text-3xl md:text-5xl font-extrabold font-heading tracking-tight leading-tight">
            BhashaBridge Design System
          </h1>

          <p className="text-blue-100 text-sm md:text-base leading-relaxed">
            A joyful, accessible, tablet-first UI combining <strong>Duolingo's tactile playfulness</strong>,{' '}
            <strong>Google Gemini's AI sophistication</strong>, and{' '}
            <strong>Khan Academy Kids' friendly pedagogy</strong>.
          </p>

          <div className="pt-2 flex flex-wrap gap-2.5">
            <Button
              variant="glass"
              size="sm"
              onClick={toggleDark}
              leftIcon={isDark ? <Sun size={15} className="text-amber-400" /> : <Moon size={15} />}
            >
              {isDark ? 'Switch to Light' : 'Switch to Dark'}
            </Button>
            <Button
              variant="glass"
              size="sm"
              onClick={() => setOffline(!isOffline)}
              leftIcon={<ShieldCheck size={15} className={isOffline ? 'text-amber-400' : 'text-emerald-400'} />}
            >
              {isOffline ? 'Mode: Offline' : 'Mode: Online Synced'}
            </Button>
          </div>
        </div>

        {/* Decorative Background Blob */}
        <div className="absolute right-[-40px] top-[-40px] w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none" />
      </motion.div>

      {/* Navigation Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200 dark:border-slate-800">
        {[
          { id: 'all', label: 'All Components', icon: Layers },
          { id: 'buttons', label: 'Tactile Buttons', icon: Sliders },
          { id: 'cards', label: 'MD3 & Glass Cards', icon: Maximize2 },
          { id: 'ai', label: 'AI & Audio Mic', icon: Sparkles },
          { id: 'inputs', label: 'Inputs & Typography', icon: Type },
        ].map((tab) => {
          const Icon = tab.icon;
          const isSelected = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                isSelected
                  ? 'bg-primary-blue text-white shadow-md shadow-blue-500/20'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:border-blue-300'
              }`}
            >
              <Icon size={14} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* SECTION 1: COLOR PALETTE & TOKENS */}
      {(activeTab === 'all' || activeTab === 'buttons') && (
        <section className="space-y-6">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-100 dark:bg-blue-950 text-primary-blue">
              <Palette size={20} />
            </div>
            <div>
              <Heading level={2}>Pedagogical Color Palette</Heading>
              <Text variant="caption">
                Engineered for maximum contrast, child friendliness, and distinct linguistic context.
              </Text>
            </div>
          </div>

          {/* Primary Brands */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            {[
              { name: 'Primary Blue', hex: colors.brand.blue, role: 'Core Brand & Trust' },
              { name: 'Primary Green', hex: colors.brand.green, role: 'Success & FLN Progress' },
              { name: 'Primary Orange', hex: colors.brand.orange, role: 'Vocabulary & Action' },
              { name: 'Primary Purple', hex: colors.brand.purple, role: 'Gemini AI & Magic' },
              { name: 'Primary Coral', hex: colors.brand.coral, role: 'Streaks & Alerts' },
              { name: 'Primary Yellow', hex: colors.brand.yellow, role: 'Badges & XP Coins' },
            ].map((c) => (
              <div
                key={c.name}
                className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-2"
              >
                <div
                  className="w-full h-14 rounded-xl shadow-inner flex items-end p-2 text-[10px] font-bold text-white/90"
                  style={{ backgroundColor: c.hex }}
                >
                  {c.hex}
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-100">{c.name}</p>
                  <p className="text-[10px] text-slate-400">{c.role}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Educational Pastels */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            {[
              { name: 'Pastel Blue', hex: colors.pastel.blue, border: colors.pastel.blueBorder },
              { name: 'Pastel Green', hex: colors.pastel.green, border: colors.pastel.greenBorder },
              { name: 'Pastel Orange', hex: colors.pastel.orange, border: colors.pastel.orangeBorder },
              { name: 'Pastel Purple', hex: colors.pastel.purple, border: colors.pastel.purpleBorder },
              { name: 'Pastel Coral', hex: colors.pastel.coral, border: colors.pastel.coralBorder },
              { name: 'Pastel Yellow', hex: colors.pastel.yellow, border: colors.pastel.yellowBorder },
            ].map((p) => (
              <div
                key={p.name}
                className="p-3 rounded-2xl border shadow-sm text-center"
                style={{ backgroundColor: p.hex, borderColor: p.border }}
              >
                <p className="text-xs font-bold text-slate-800">{p.name}</p>
                <p className="text-[10px] text-slate-500">{p.hex}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* SECTION 2: DUOLINGO 3D & MD3 BUTTONS */}
      {(activeTab === 'all' || activeTab === 'buttons') && (
        <section className="space-y-6">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-primary-green">
              <Sliders size={20} />
            </div>
            <div>
              <Heading level={2}>Tactile 3D Buttons & Actions</Heading>
              <Text variant="caption">
                Duolingo-inspired 3D tactile bottom bevels with satisfying spring compression on tap.
              </Text>
            </div>
          </div>

          <Card className="space-y-6">
            {/* Duolingo 3D Tactile Buttons */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                Duolingo 3D Tactile Buttons (`tactile=true`)
              </h4>
              <div className="flex flex-wrap gap-3.5 items-center">
                <Button variant="primary" tactile leftIcon={<Sparkles size={16} />}>
                  Primary Blue 3D
                </Button>
                <Button variant="green" tactile leftIcon={<CheckCircle2 size={16} />}>
                  Success Green 3D
                </Button>
                <Button variant="orange" tactile leftIcon={<BookOpen size={16} />}>
                  Action Orange 3D
                </Button>
                <Button variant="purple" tactile leftIcon={<Mic size={16} />}>
                  Gemini Purple 3D
                </Button>
                <Button variant="coral" tactile>
                  Streak Coral 3D
                </Button>
                <Button variant="secondary" tactile>
                  Secondary 3D
                </Button>
              </div>
            </div>

            {/* Standard Elevated & Gradient Buttons */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                MD3 Elevated & Gemini Gradients
              </h4>
              <div className="flex flex-wrap gap-3 items-center">
                <Button variant="gemini" leftIcon={<Sparkles size={16} />}>
                  Gemini Shimmer AI
                </Button>
                <Button variant="primary">Primary Elevated</Button>
                <Button variant="green">Green Mastered</Button>
                <Button variant="outline">Crisp Outline</Button>
                <Button variant="ghost">Subtle Ghost</Button>
                <Button variant="glass">Frosted Glass</Button>
                <Button variant="primary" loading>
                  Translating...
                </Button>
              </div>
            </div>

            {/* Sizing Matrix */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                Button Scale System (sm, md, lg, xl, icon)
              </h4>
              <div className="flex flex-wrap gap-3 items-center">
                <Button size="sm" variant="secondary">
                  Small (sm)
                </Button>
                <Button size="md" variant="primary">
                  Medium (md)
                </Button>
                <Button size="lg" variant="green">
                  Large (lg)
                </Button>
                <Button size="xl" variant="purple" leftIcon={<Sparkles size={20} />}>
                  Tablet Hero (xl)
                </Button>
                <Button size="icon" variant="primary">
                  <Mic size={18} />
                </Button>
              </div>
            </div>
          </Card>
        </section>
      )}

      {/* SECTION 3: CARDS & GLASSMORPHISM */}
      {(activeTab === 'all' || activeTab === 'cards') && (
        <section className="space-y-6">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-purple-100 dark:bg-purple-950 text-primary-purple">
              <Maximize2 size={20} />
            </div>
            <div>
              <Heading level={2}>Material Design 3 & Glassmorphic Cards</Heading>
              <Text variant="caption">
                24px rounded corners, soft shadows, pastel containers, and fluid Framer Motion hover lifts.
              </Text>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* MD3 Standard Card */}
            <Card hoverEffect>
              <CardHeader>
                <div>
                  <Badge variant="blue" size="sm">Standard MD3</Badge>
                  <CardTitle className="mt-2">Lesson Module Card</CardTitle>
                </div>
                <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-950 text-primary-blue flex items-center justify-center">
                  <BookOpen size={20} />
                </div>
              </CardHeader>
              <CardDescription>
                Clean surface elevation with subtle border for structured classroom content.
              </CardDescription>
              <CardFooter>
                <span className="text-xs font-bold text-slate-400">Grade 2 • Unit 3</span>
                <Button size="sm" variant="primary">Open Lesson</Button>
              </CardFooter>
            </Card>

            {/* Frosted Glassmorphic Card */}
            <Card variant="glass" hoverEffect>
              <CardHeader>
                <div>
                  <Badge variant="purple" size="sm">Glassmorphism</Badge>
                  <CardTitle className="mt-2">Audio Translation</CardTitle>
                </div>
                <div className="w-10 h-10 rounded-2xl bg-purple-50 dark:bg-purple-950 text-primary-purple flex items-center justify-center">
                  <Volume2 size={20} />
                </div>
              </CardHeader>
              <CardDescription>
                Backdrop-filter blur with soft light refraction, ideal for floating audio overlays.
              </CardDescription>
              <CardFooter>
                <span className="text-xs font-bold text-purple-600 dark:text-purple-400">Piper TTS 22kHz</span>
                <Button size="sm" variant="glass">Listen</Button>
              </CardFooter>
            </Card>

            {/* Gemini AI Shimmer Card */}
            <Card variant="gemini" hoverEffect>
              <CardHeader>
                <div>
                  <Badge variant="gemini" size="sm">Cosmic Shimmer</Badge>
                  <CardTitle className="mt-2">AI Worksheet Maker</CardTitle>
                </div>
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-500 to-pink-500 text-white flex items-center justify-center">
                  <Sparkles size={20} />
                </div>
              </CardHeader>
              <CardDescription>
                Intelligent bilingual worksheet generator aligned with NIPUN Bharat FLN milestones.
              </CardDescription>
              <CardFooter>
                <span className="text-xs font-bold text-slate-400">FLN Outcomes</span>
                <Button size="sm" variant="gemini">Generate</Button>
              </CardFooter>
            </Card>
          </div>

          {/* Pastel Themed Containers */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <Card variant="pastel-green" hoverEffect interactive>
              <Badge variant="green" size="sm">Vocabulary</Badge>
              <h4 className="text-base font-bold font-heading mt-2">Bilingual Words</h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">120 words mastered in Santhali.</p>
            </Card>

            <Card variant="pastel-orange" hoverEffect interactive>
              <Badge variant="orange" size="sm">Storytelling</Badge>
              <h4 className="text-base font-bold font-heading mt-2">Folk Tales</h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">15 illustrated tribal tales offline.</p>
            </Card>

            <Card variant="pastel-purple" hoverEffect interactive>
              <Badge variant="purple" size="sm">Phonics</Badge>
              <h4 className="text-base font-bold font-heading mt-2">Ol Chiki Script</h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">Interactive tracing & phonetics.</p>
            </Card>

            <Card variant="pastel-coral" hoverEffect interactive>
              <Badge variant="coral" size="sm">Streak</Badge>
              <h4 className="text-base font-bold font-heading mt-2">7 Days Streak</h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">Consistent classroom usage.</p>
            </Card>
          </div>
        </section>
      )}

      {/* SECTION 4: AI ASSISTANT BUBBLE & FLOATING MIC BUTTON */}
      {(activeTab === 'all' || activeTab === 'ai') && (
        <section className="space-y-6">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-rose-100 dark:bg-rose-950 text-primary-coral">
              <Sparkles size={20} />
            </div>
            <div>
              <Heading level={2}>AI Assistant Bubble & Voice Equalizer</Heading>
              <Text variant="caption">
                Interactive microphone states with animated concentric soundwaves and Gemini translation speech bubbles.
              </Text>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Interactive Voice Mic Demo Area */}
            <Card className="lg:col-span-5 flex flex-col items-center justify-center p-8 text-center space-y-6">
              <div>
                <Badge variant="blue" size="sm">Click Mic To Cycle States</Badge>
                <h3 className="text-lg font-bold font-heading mt-2">Speech-to-Speech Engine</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Current state: <strong className="text-primary-blue uppercase">{micState}</strong>
                </p>
              </div>

              {/* Floating Mic with Pulse Animation */}
              <div className="py-6">
                <FloatingMicButton
                  state={micState}
                  onClick={cycleMic}
                  size="hero"
                  languageLabel="Hindi"
                  targetLanguageLabel="Santhali (Ol Chiki)"
                />
              </div>

              <div className="flex gap-2">
                {(['idle', 'listening', 'processing', 'speaking'] as MicState[]).map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setMicState(st)}
                    className={`px-2.5 py-1 rounded-xl text-[11px] font-bold uppercase transition-all cursor-pointer ${
                      micState === st
                        ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-sm'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </Card>

            {/* AI Assistant Bubble Preview */}
            <div className="lg:col-span-7 flex justify-center">
              <AiAssistantBubble
                hindiText="नमस्ते बच्चों! आज हम जंगल के जानवरों के बारे में सीखेंगे।"
                santhaliText="ᱡᱚᱦᱟᱨ ᱜᱤᱫᱽᱨᱟᱹ! ᱛᱮᱦᱮᱧ ᱫᱚ ᱵᱤᱨ ᱨᱤᱱ ᱡᱤᱵᱽ ᱡᱤᱭᱟᱹᱞᱤ ᱵᱟᱵᱚᱛ ᱵᱚ ᱪᱮᱫ-ᱟ᱾"
                santhaliLatin="Johar gidra! Tehenj do bir rin jib jiyali babot bo ched-a."
                explanation="Pedagogical tip: Start by pointing to animal flashcards while pronouncing both Hindi and Santhali names."
                onPlayAudio={() => alert('Playing Piper TTS audio in Santhali...')}
              />
            </div>
          </div>
        </section>
      )}

      {/* SECTION 5: INPUTS & TYPOGRAPHY */}
      {(activeTab === 'all' || activeTab === 'inputs') && (
        <section className="space-y-6">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-100 dark:bg-amber-950 text-primary-orange">
              <Type size={20} />
            </div>
            <div>
              <Heading level={2}>Bilingual Inputs & Typography System</Heading>
              <Text variant="caption">
                Native support for Devanagari (Hindi) and Ol Chiki (Santhali) scripts with friendly rounded input controls.
              </Text>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Input Controls */}
            <Card className="space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">
                Form Controls & Script Helpers
              </h3>

              <Input
                label="Teacher Lesson Title"
                placeholder="e.g. Primary Mathematics - Counting 1 to 20"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onClear={() => setInputValue('')}
                leftIcon={<Search size={18} />}
                helperText="Enter topic for automated bilingual lesson plan generation."
              />

              <Textarea
                label="Hindi Classroom Prompt (Devanagari)"
                script="devanagari"
                placeholder="यहाँ हिंदी वाक्य लिखें..."
                defaultValue="सभी बच्चे अपनी किताबों का पृष्ठ क्रमांक 12 खोलें।"
                helperText="Type or dictate teacher speech for translation into Ol Chiki."
              />

              <div className="flex items-center gap-2 pt-2">
                <span className="text-xs font-semibold text-slate-500">Language Script Badges:</span>
                <LanguageBadge script="devanagari" label="हिन्दी" sublabel="Hindi" active />
                <LanguageBadge script="olchiki" label="ᱥᱟᱱᱛᱟᱲᱤ" sublabel="Ol Chiki" />
                <LanguageBadge script="english" label="Ho" sublabel="Warang Citi" />
              </div>
            </Card>

            {/* Typography & Script Showcase */}
            <Card className="space-y-5">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">
                Tribal Script Typography Hierarchy
              </h3>

              <div className="space-y-3">
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                  <span className="text-[10px] font-bold text-primary-blue uppercase tracking-wider block mb-1">
                    Display Heading • Poppins
                  </span>
                  <p className="text-2xl font-extrabold font-heading text-slate-900 dark:text-white">
                    Empowering Primary Tribal Classrooms
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-blue-50/50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/40">
                  <span className="text-[10px] font-bold text-primary-blue uppercase tracking-wider block mb-1">
                    Hindi • Noto Sans Devanagari
                  </span>
                  <p className="text-lg font-devanagari text-slate-900 dark:text-slate-100 leading-relaxed">
                    झारखंड के प्राथमिक विद्यालयों के लिए ऑफलाइन बहुभाषी शिक्षण सहायक
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-purple-50/50 dark:bg-purple-950/30 border border-purple-100 dark:border-purple-900/40">
                  <span className="text-[10px] font-bold text-primary-purple uppercase tracking-wider block mb-1">
                    Santhali • Noto Sans Ol Chiki (ᱚᱞ ᱪᱤᱠᱤ)
                  </span>
                  <p className="text-xl font-bold font-olchiki text-slate-900 dark:text-slate-100 leading-relaxed tracking-wide">
                    ᱡᱷᱟᱨᱠᱷᱚᱸᱰ ᱨᱮᱱᱟᱜ ᱮᱛᱚᱦᱚᱵ ᱟᱥᱲᱟ ᱠᱚ ᱞᱟᱹᱜᱤᱫ ᱚᱯᱷᱞᱟᱭᱤᱱ ᱮᱥᱤᱥᱴᱮᱱᱴ
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </section>
      )}

      {/* SECTION 6: LOADING SKELETONS */}
      {activeTab === 'all' && (
        <section className="space-y-6">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
              <Layers size={20} />
            </div>
            <div>
              <Heading level={2}>Loading Skeletons</Heading>
              <Text variant="caption">
                Pulsing placeholders for offline model inference and asset streaming.
              </Text>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <CardSkeleton />
            <FlashcardSkeleton />
            <div className="p-6 rounded-[24px] bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 flex flex-col justify-center space-y-4">
              <span className="text-xs font-bold text-slate-400 text-center uppercase tracking-wider">
                Speech Synthesis Equalizer Skeleton
              </span>
              <AudioWaveSkeleton count={16} />
              <Skeleton className="h-4 w-1/2 mx-auto rounded-lg" />
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default DesignSystemShowcase;
