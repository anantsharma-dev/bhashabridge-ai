import type {
  ContentGeneratorInputs,
  GeneratedContentPackage,
  LessonPlanOutput,
  StoryOutput,
  FlashcardItem,
  WorksheetOutput,
  QuizOutput,
  VocabularyItem,
  TeacherNotesOutput,
} from '../../types/contentGenerator';
import { aiContentRepository } from '../aiContentRepository';

export interface GenerateContentResult {
  package: GeneratedContentPackage;
  isAiGenerated: boolean;
  modelUsed: string;
  source: 'gemini-2.5-flash' | 'gemini-1.5-flash' | 'offline-curriculum-engine';
}

class GeminiContentGeneratorService {
  private primaryModel: string = 'gemini-2.5-flash';
  private fallbackModel: string = 'gemini-1.5-flash';
  private apiKey: string = (import.meta as any).env?.VITE_GEMINI_API_KEY || '';
  private isGenerating: boolean = false;

  public setApiKey(key: string) {
    this.apiKey = key;
  }

  public getIsGenerating(): boolean {
    return this.isGenerating;
  }

  public async generateCurriculumContent(inputs: ContentGeneratorInputs): Promise<GenerateContentResult> {
    const isOnline = typeof navigator !== 'undefined' ? navigator.onLine : false;

    // 1. If offline or no API key, invoke the offline curriculum engine
    if (!isOnline || !this.apiKey) {
      const offlinePkg = this.buildOfflinePackage(inputs);
      await aiContentRepository.savePackage(offlinePkg);
      return {
        package: offlinePkg,
        isAiGenerated: false,
        modelUsed: 'offline-curriculum-engine',
        source: 'offline-curriculum-engine',
      };
    }

    this.isGenerating = true;

    // 2. Try Gemini 2.5 Flash first, then fallback to Gemini 1.5 Flash, then offline engine
    try {
      const pkg = await this.callGeminiApi(inputs, this.primaryModel);
      await aiContentRepository.savePackage(pkg);
      this.isGenerating = false;
      return {
        package: pkg,
        isAiGenerated: true,
        modelUsed: this.primaryModel,
        source: 'gemini-2.5-flash',
      };
    } catch {
      try {
        const pkg = await this.callGeminiApi(inputs, this.fallbackModel);
        await aiContentRepository.savePackage(pkg);
        this.isGenerating = false;
        return {
          package: pkg,
          isAiGenerated: true,
          modelUsed: this.fallbackModel,
          source: 'gemini-1.5-flash',
        };
      } catch {
        this.isGenerating = false;
        const offlinePkg = this.buildOfflinePackage(inputs);
        await aiContentRepository.savePackage(offlinePkg);
        return {
          package: offlinePkg,
          isAiGenerated: false,
          modelUsed: 'offline-curriculum-engine',
          source: 'offline-curriculum-engine',
        };
      }
    }
  }

  private async callGeminiApi(inputs: ContentGeneratorInputs, model: string): Promise<GeneratedContentPackage> {
    const prompt = this.buildPrompt(inputs);

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${this.apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.4,
            maxOutputTokens: 8192,
            responseMimeType: 'application/json',
          },
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    const cleanJson = rawText.replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(cleanJson);

    return {
      id: `pkg_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      inputs,
      lessonPlan: parsed.lessonPlan || this.buildDefaultLessonPlan(inputs),
      story: parsed.story || this.buildDefaultStory(inputs),
      flashcards: parsed.flashcards || this.buildDefaultFlashcards(inputs),
      worksheet: parsed.worksheet || this.buildDefaultWorksheet(inputs),
      quiz: parsed.quiz || this.buildDefaultQuiz(inputs),
      vocabulary: parsed.vocabulary || this.buildDefaultVocabulary(inputs),
      teacherNotes: parsed.teacherNotes || this.buildDefaultTeacherNotes(inputs),
      isAiGenerated: true,
      modelUsed: model,
      isTeacherEdited: false,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
  }

  private buildPrompt(inputs: ContentGeneratorInputs): string {
    return `
You are the Lead Curriculum Specialist for BhashaBridge AI, designing foundational learning content for Grade 1–5 primary classrooms in Jharkhand, India.
Follow the NEP 2020 MTB-MLE (Mother Tongue-Based Multilingual Education) and NIPUN Bharat frameworks.

INPUT PARAMETERS:
- Grade: ${inputs.grade}
- Subject: ${inputs.subject}
- Topic: ${inputs.topic}
- Target Language Combination: ${inputs.language}
- Difficulty Level: ${inputs.difficulty}

GENERATE A COMPLETE MULTI-OUTPUT CURRICULUM PACKAGE IN JSON FORMAT.
Strictly return a JSON object with this exact structure:
{
  "lessonPlan": {
    "title": "Title of the 45-minute lesson",
    "learningOutcomes": ["Outcome 1", "Outcome 2", "Outcome 3"],
    "duration": "45 Minutes",
    "phases": [
      { "phase": 1, "name": "Johar Warm-up & Oral Rhyme", "duration": "5 mins", "teacherAction": "...", "studentAction": "...", "languageBridgeTip": "..." },
      { "phase": 2, "name": "Mother Tongue Exploration", "duration": "10 mins", "teacherAction": "...", "studentAction": "...", "languageBridgeTip": "..." },
      { "phase": 3, "name": "Bilingual Concept Building", "duration": "15 mins", "teacherAction": "...", "studentAction": "...", "languageBridgeTip": "..." },
      { "phase": 4, "name": "Interactive Activity / Game", "duration": "10 mins", "teacherAction": "...", "studentAction": "...", "languageBridgeTip": "..." },
      { "phase": 5, "name": "Reflection & Formative Check", "duration": "5 mins", "teacherAction": "...", "studentAction": "...", "languageBridgeTip": "..." }
    ],
    "materialsNeeded": ["Flashcards", "Pebbles/Leaves", "Chart paper"],
    "nepAlignment": "NIPUN Bharat L2.3 & NEP 2020 MTB-MLE Framework"
  },
  "story": {
    "title": "Story Title in English",
    "hindiTitle": "कहानी का शीर्षक हिंदी में",
    "tribalTitle": "ᱥᱟᱱᱛᱟᱲᱤ ᱧᱩᱛᱩᱢ / Tribal Title",
    "theme": "Local folklore, forest ecology, festival, or everyday village life",
    "paragraphs": [
      { "paragraphNumber": 1, "textPrimary": "Hindi paragraph...", "textBridge": "Tribal/Bridge paragraph...", "olChikiOrNativeScript": "...", "pronunciationGuide": "..." },
      { "paragraphNumber": 2, "textPrimary": "...", "textBridge": "...", "olChikiOrNativeScript": "...", "pronunciationGuide": "..." },
      { "paragraphNumber": 3, "textPrimary": "...", "textBridge": "...", "olChikiOrNativeScript": "...", "pronunciationGuide": "..." }
    ],
    "comprehensionQuestions": [
      { "question": "Question 1 in Hindi & English?", "answer": "Simple answer" },
      { "question": "Question 2 in Hindi & English?", "answer": "Simple answer" }
    ],
    "moral": "Cultural or ecological lesson"
  },
  "flashcards": [
    {
      "id": "card_1",
      "frontWord": "Primary Term",
      "hindiWord": "हिंदी शब्द",
      "tribalWord": "Tribal Roman",
      "scriptNative": "ᱚᱞ ᱪᱤᱠᱤ / Script",
      "phonetic": "Pronunciation in English",
      "englishWord": "English Translation",
      "exampleSentence": "Bilingual example sentence",
      "funFact": "Interesting local Jharkhand fact",
      "category": "Vocabulary"
    }
  ],
  "worksheet": {
    "title": "Worksheet Title",
    "hindiTitle": "कार्यपत्रक शीर्षक",
    "instructions": "Simple bilingual instructions for children",
    "sections": [
      {
        "sectionTitle": "Section A: चित्र पहचान एवं शब्द मिलान (Matching)",
        "activityType": "matching",
        "questions": [
          { "id": "w1", "prompt": "Prompt 1", "answer": "Correct match" },
          { "id": "w2", "prompt": "Prompt 2", "answer": "Correct match" }
        ]
      },
      {
        "sectionTitle": "Section B: रिक्त स्थान भरो (Fill in Blanks)",
        "activityType": "fill-blanks",
        "questions": [
          { "id": "w3", "prompt": "Prompt with blank ___", "answer": "Missing word" }
        ]
      }
    ],
    "teacherAnswerKey": ["Answer 1", "Answer 2", "Answer 3"]
  },
  "quiz": {
    "quizTitle": "5-Question Interactive Classroom Quiz",
    "questions": [
      {
        "id": "q1",
        "question": "Bilingual question prompt?",
        "options": ["Option A", "Option B", "Option C", "Option D"],
        "correctIndex": 0,
        "explanation": "Why this is correct in simple words",
        "languageHint": "Tribal language cue"
      }
    ]
  },
  "vocabulary": [
    {
      "id": "v1",
      "termHindi": "हाथी",
      "termTribal": "Hati",
      "termScript": "ᱦᱟᱹᱛᱤ",
      "termEnglish": "Elephant",
      "partOfSpeech": "Noun (संज्ञा)",
      "definition": "A large mammal revered in Jharkhand forests",
      "audioCue": "ha-ti"
    }
  ],
  "teacherNotes": {
    "pedagogyTips": ["Tip 1 on bridging mother tongue to Hindi", "Tip 2 on physical movement TPR"],
    "tribalBridgeStrategies": ["Strategy 1", "Strategy 2"],
    "commonMisconceptions": ["Misconception 1"],
    "remedialActivities": ["Remedial step for slow readers"],
    "parentEngagementTip": "Advice for parents who speak only native tribal tongue"
  }
}
`;
  }

  // --- OFFLINE CURRICULUM FALLBACK ENGINE ---
  public buildOfflinePackage(inputs: ContentGeneratorInputs): GeneratedContentPackage {
    return {
      id: `offline_pkg_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      inputs,
      lessonPlan: this.buildDefaultLessonPlan(inputs),
      story: this.buildDefaultStory(inputs),
      flashcards: this.buildDefaultFlashcards(inputs),
      worksheet: this.buildDefaultWorksheet(inputs),
      quiz: this.buildDefaultQuiz(inputs),
      vocabulary: this.buildDefaultVocabulary(inputs),
      teacherNotes: this.buildDefaultTeacherNotes(inputs),
      isAiGenerated: false,
      modelUsed: 'offline-jcert-curriculum-engine',
      isTeacherEdited: false,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
  }

  private buildDefaultLessonPlan(inputs: ContentGeneratorInputs): LessonPlanOutput {
    return {
      title: `${inputs.topic} — ${inputs.grade} Bilingual Lesson Plan`,
      learningOutcomes: [
        `Identify and pronounce 5 key vocabulary words related to "${inputs.topic}" in both native language and Hindi.`,
        `Connect local Jharkhand environment and community experiences to foundational ${inputs.subject} concepts.`,
        `Demonstrate comprehension by participating in oral storytelling and worksheet matching exercises.`,
      ],
      duration: '45 Minutes',
      phases: [
        {
          phase: 1,
          name: 'Phase 1: Johar Greeting & Forest Sounds Warm-up',
          duration: '5 Mins',
          teacherAction: 'Teacher greets students in Santali ("ᱡᱚᱦᱟᱨ" / Johar) and Hindi ("नमस्ते"), leads a 2-minute rhythm clap game.',
          studentAction: 'Children repeat the greeting, echo the rhythm pattern, and sit in a semi-circle.',
          languageBridgeTip: 'Validate the tribal mother tongue first so children feel safe and proud of their identity.',
        },
        {
          phase: 2,
          name: 'Phase 2: Mother Tongue Story & Real-World Discovery',
          duration: '10 Mins',
          teacherAction: `Introduces ${inputs.topic} using local natural realia (leaves, clay, pebbles, or flashcards).`,
          studentAction: 'Students name the objects in their mother tongue and share personal stories from their village.',
          languageBridgeTip: 'Write the children’s native words on the board alongside Ol Chiki script and Devanagari.',
        },
        {
          phase: 3,
          name: 'Phase 3: Bilingual Concept Modeling',
          duration: '15 Mins',
          teacherAction: 'Presents the core concept through bilingual call-and-response and TPR (Total Physical Response) gestures.',
          studentAction: 'Children practice saying the phrases with gestures, pairing with peers.',
          languageBridgeTip: 'Use sandwich technique: Mother Tongue → Target Hindi → Mother Tongue reinforcement.',
        },
        {
          phase: 4,
          name: 'Phase 4: Hands-on Peer Activity / Worksheet',
          duration: '10 Mins',
          teacherAction: 'Distributes printed or blackboard worksheet; circulates to assist Level 1 learners.',
          studentAction: 'Children complete matching and tracing exercises in pairs, speaking both languages.',
          languageBridgeTip: 'Encourage peer explanation in mother tongue.',
        },
        {
          phase: 5,
          name: 'Phase 5: Johar Circle Reflection & Star Badges',
          duration: '5 Mins',
          teacherAction: 'Asks 2 exit-ticket questions and awards daily classroom stars.',
          studentAction: 'Students chant the summary rhyme and place work in their student folders.',
          languageBridgeTip: 'End with the tribal victory cheer to celebrate daily learning.',
        },
      ],
      materialsNeeded: [
        'Multilingual Flashcard Deck',
        'Local environmental realia (Sal leaves, smooth pebbles)',
        'Chart paper & blackboard chalk',
        'Printable bilingual worksheet',
      ],
      nepAlignment: 'NIPUN Bharat Competency L2.3 & NEP 2020 MTB-MLE Multilingual Framework',
    };
  }

  private buildDefaultStory(inputs: ContentGeneratorInputs): StoryOutput {
    return {
      title: `The Story of ${inputs.topic} and the Wise Hornbill`,
      hindiTitle: `${inputs.topic} और बुद्धिमान हॉर्नबिल की लोककथा`,
      tribalTitle: 'ᱥᱟᱨᱟᱱᱰᱟ ᱵᱤᱨ ᱨᱮ ᱦᱚᱨᱱᱵᱤᱞ ᱟᱨ ᱦᱟᱹᱛᱤ',
      theme: 'Jharkhand Forest Ecology & Traditional Harmony',
      paragraphs: [
        {
          paragraphNumber: 1,
          textPrimary: 'सारंडा के घने साल जंगलों में एक छोटा गाँव था। वहाँ के बच्चे हर सुबह पंछियों के मधुर गीतों के साथ जागते थे।',
          textBridge: 'ᱥᱟᱨᱟᱱᱰᱟ ᱵᱤᱨ ᱡᱟᱯᱟᱜ ᱨᱮ ᱢᱤᱫᱴᱟᱹᱝ ᱟᱹᱛᱩ ᱛᱟᱦᱮᱸ ᱠᱟᱱᱟ ᱾ ᱜᱤᱫᱽᱨᱟᱹ ᱠᱚ ᱥᱮᱛᱟᱜ ᱪᱮᱬᱮ ᱨᱟᱜ ᱛᱮ ᱠᱚ ᱵᱮᱨᱮᱫ ᱠᱟᱱ ᱛᱟᱦᱮᱸᱫ ᱾',
          olChikiOrNativeScript: 'ᱥᱟᱨᱟᱱᱰᱟ ᱵᱤᱨ ᱡᱟᱯᱟᱜ ᱨᱮ ᱢᱤᱫᱴᱟᱹᱝ ᱟᱹᱛᱩ ᱛᱟᱦᱮᱸ ᱠᱟᱱᱟ ᱾',
          pronunciationGuide: 'Saranda bir japaag re mid-tang aatu tahe kana.',
        },
        {
          paragraphNumber: 2,
          textPrimary: `गाँव के बच्चे पेड़ के नीचे बैठकर ${inputs.topic} के बारे में बातचीत कर रहे थे। तभी एक पवित्र हॉर्नबिल पक्षी डाल पर आकर बैठा।`,
          textBridge: `ᱟᱹᱛᱩ ᱨᱤᱱ ᱜᱤᱫᱽᱨᱟᱹ ᱫᱟᱨᱮ ᱵᱩᱴᱟᱹ ᱨᱮ ᱫᱩᱲᱩᱵ ᱠᱟᱛᱮ ${inputs.topic} ᱵᱟᱵᱚᱛ ᱠᱚ ᱜᱟᱞᱢᱟᱨᱟᱣ ᱠᱟᱱ ᱛᱟᱦᱮᱸᱫ ᱾ ᱢᱤᱫ ᱪᱮᱬᱮ ᱦᱮᱡ ᱮᱱᱟᱭ ᱾`,
          olChikiOrNativeScript: 'ᱟᱹᱛᱩ ᱨᱤᱱ ᱜᱤᱫᱽᱨᱟᱹ ᱫᱟᱨᱮ ᱵᱩᱴᱟᱹ ᱨᱮ ᱫᱩᱲᱩᱵ ᱠᱟᱛᱮ ᱠᱚ ᱜᱟᱞᱢᱟᱨᱟᱣ ᱠᱟᱱ ᱛᱟᱦᱮᱸᱫ ᱾',
          pronunciationGuide: 'Aatu rin gidra dare buta re durub kate ko galmaraw kan tahend.',
        },
        {
          paragraphNumber: 3,
          textPrimary: 'हॉर्नबिल ने बच्चों को समझाया कि जब हम प्रकृति और एक-दूसरे की भाषा का सम्मान करते हैं, तो पूरा जंगल खिल उठता है।',
          textBridge: 'ᱪᱮᱬᱮ ᱜᱤᱫᱽᱨᱟᱹ ᱠᱚ ᱞᱟᱹᱭᱟᱫ ᱠᱚᱣᱟ — ᱡᱚᱠᱷᱚᱱ ᱟᱵᱚ ᱡᱤᱣᱤ-ᱡᱤᱭᱟᱹᱞᱤ ᱟᱨ ᱟᱭᱳ ᱟᱲᱟᱝ ᱵᱚᱱ ᱢᱟᱹᱱ-ᱟ, ᱵᱤᱨ ᱫᱚ ᱨᱟᱹᱥᱠᱟᱹᱜ-ᱟ ᱾',
          olChikiOrNativeScript: 'ᱡᱚᱠᱷᱚᱱ ᱟᱵᱚ ᱟᱭᱳ ᱟᱲᱟᱝ ᱵᱚᱱ ᱢᱟᱹᱱ-ᱟ, ᱵᱤᱨ ᱫᱚ ᱨᱟᱹᱥᱠᱟᱹᱜ-ᱟ ᱾',
          pronunciationGuide: 'Jokhon abo aayo aarang bon maan-aa, bir do raskag-aa.',
        },
      ],
      comprehensionQuestions: [
        {
          question: 'गाँव के बच्चे कहाँ बैठकर बातचीत कर रहे थे? (Where were the children sitting?)',
          answer: 'साल के घने पेड़ की छांव में। (Under the shade of the tall Sal tree.)',
        },
        {
          question: 'हॉर्नबिल पक्षी ने बच्चों को क्या सीख दी? (What lesson did the Hornbill give?)',
          answer: 'प्रकृति और अपनी मातृभाषा का सदैव आदर करना चाहिए। (Always respect nature and your mother tongue.)',
        },
      ],
      moral: 'प्रकृति और मातृभाषा हमारी सबसे बड़ी शक्ति हैं। (Nature and Mother Tongue are our greatest strengths.)',
    };
  }

  private buildDefaultFlashcards(inputs: ContentGeneratorInputs): FlashcardItem[] {
    return [
      {
        id: 'fc_1',
        frontWord: 'Sal Tree (साल वृक्ष)',
        hindiWord: 'साल वृक्ष (सखुआ)',
        tribalWord: 'Sarjom',
        scriptNative: 'ᱥᱟᱨᱡᱚᱢ',
        phonetic: 'Sar-jom',
        englishWord: 'Sal Tree',
        exampleSentence: 'साल के नए पत्तों से सरहुल पर्व की शुरुआत होती है।',
        funFact: 'साल का पेड़ झारखंड का राज्य वृक्ष है और इसकी लकड़ी बेहद मजबूत होती है।',
        category: inputs.subject,
      },
      {
        id: 'fc_2',
        frontWord: 'Elephant (हाथी)',
        hindiWord: 'हाथी',
        tribalWord: 'Hati',
        scriptNative: 'ᱦᱟᱹᱛᱤ',
        phonetic: 'Ha-ti',
        englishWord: 'Elephant',
        exampleSentence: 'दलमा की पहाड़ियों में हाथी झुंड में रहते हैं।',
        funFact: 'हाथी झारखंड का राज्य पशु है जो जंगल का मार्गदर्शक कहलाता है।',
        category: inputs.subject,
      },
      {
        id: 'fc_3',
        frontWord: 'Peacock (मयूर)',
        hindiWord: 'मोर (मयूर)',
        tribalWord: 'Marag',
        scriptNative: 'ᱢᱟᱨᱟᱜ',
        phonetic: 'Ma-rag',
        englishWord: 'Peacock',
        exampleSentence: 'बारिश के मौसम में मोर अपने पंख फैलाकर नाचता है।',
        funFact: 'सोहराय चित्रकला में मोर के चित्रों को घर की दीवारों पर उकेरा जाता है।',
        category: inputs.subject,
      },
      {
        id: 'fc_4',
        frontWord: 'Friend / Classmate (मित्र)',
        hindiWord: 'मित्र / सहपाठी',
        tribalWord: 'Gati',
        scriptNative: 'ᱜᱟᱛᱮ',
        phonetic: 'Ga-te',
        englishWord: 'Friend / Peer',
        exampleSentence: 'हम सब विद्यालय में एक साथ मिलकर सीखते हैं।',
        funFact: 'संताली भाषा में "ᱜᱟᱛᱮ" (गाते) का अर्थ गहरा मित्र होता है।',
        category: inputs.subject,
      },
    ];
  }

  private buildDefaultWorksheet(inputs: ContentGeneratorInputs): WorksheetOutput {
    return {
      title: `${inputs.topic} Practice Worksheet`,
      hindiTitle: `${inputs.topic} अभ्यास कार्यपत्रक (कक्षा ${inputs.grade.replace('Grade ', '')})`,
      instructions: 'दिए गए प्रश्नों को ध्यान से पढ़ें और चित्रों व शब्दों का सही मिलान करें। (Read carefully and match the words).',
      sections: [
        {
          sectionTitle: 'भाग १: शब्द और चित्र का सही मिलान करो (Word Matching)',
          activityType: 'matching',
          questions: [
            { id: 'w_1', prompt: '१. ᱥᱟᱨᱡᱚᱢ (Sarjom)', answer: 'साल का पेड़ (Sal Tree)' },
            { id: 'w_2', prompt: '२. ᱦᱟᱹᱛᱤ (Hati)', answer: 'हाथी (Elephant)' },
            { id: 'w_3', prompt: '३. ᱢᱟᱨᱟᱜ (Marag)', answer: 'मोर (Peacock)' },
            { id: 'w_4', prompt: '४. ᱜᱟᱛᱮ (Gate)', answer: 'सच्चा मित्र (Friend)' },
          ],
        },
        {
          sectionTitle: 'भाग २: सही शब्द चुनकर रिक्त स्थान भरो (Fill in the blanks)',
          activityType: 'fill-blanks',
          questions: [
            { id: 'w_5', prompt: 'झारखंड का राज्य पशु _____ (Hati / Marag) है।', answer: 'Hati (हाथी)' },
            { id: 'w_6', prompt: 'सरहुल पर्व में _____ (Sarjom / Gate) के फूलों की पूजा की जाती है।', answer: 'Sarjom (साल वृक्ष)' },
          ],
        },
      ],
      teacherAnswerKey: [
        '१. Sarjom -> साल का पेड़',
        '२. Hati -> हाथी',
        '३. Marag -> मोर',
        '४. Gate -> सच्चा मित्र',
        '५. रिक्त स्थान: Hati (हाथी)',
        '६. रिक्त स्थान: Sarjom (साल वृक्ष)',
      ],
    };
  }

  private buildDefaultQuiz(inputs: ContentGeneratorInputs): QuizOutput {
    return {
      quizTitle: `${inputs.topic} 5-Question Multilingual Quiz`,
      questions: [
        {
          id: 'q_1',
          question: `संताली भाषा में "साल के पेड़" को क्या कहते हैं? (What is Sal tree called in Santali?)`,
          options: ['ᱥᱟᱨᱡᱚᱢ (Sarjom)', 'ᱦᱟᱹᱛᱤ (Hati)', 'ᱢᱟᱨᱟᱜ (Marag)', 'ᱫᱟᱨᱮ (Dare)'],
          correctIndex: 0,
          explanation: 'साल के पेड़ को संताली में "ᱥᱟᱨᱡᱚᱢ" (सरजोम) कहा जाता है।',
          languageHint: 'Sal tree = Sarjom',
        },
        {
          id: 'q_2',
          question: `झारखंड के जंगलों में रहने वाले "हाथी" का संताली नाम क्या है?`,
          options: ['ᱦᱟᱹᱛᱤ (Hati)', 'ᱛᱟᱹᱨᱩᱯ (Tarup)', 'ᱥᱮᱛᱟ (Seta)', 'ᱠᱩᱞᱟᱹᱭ (Kulai)'],
          correctIndex: 0,
          explanation: 'हाथी को संताली में "ᱦᱟᱹᱛᱤ" (हाती) कहा जाता है।',
          languageHint: 'Elephant = Hati',
        },
        {
          id: 'q_3',
          question: `वर्षा ऋतु में नाचने वाले मोर को संताली में क्या कहा जाता है?`,
          options: ['ᱪᱮᱬᱮ (Chene)', 'ᱢᱟᱨᱟᱜ (Marag)', 'ᱯᱚᱛᱟᱢ (Potam)', 'ᱠᱟᱣᱟ (Kawa)'],
          correctIndex: 1,
          explanation: 'मोर को "ᱢᱟᱨᱟᱜ" (माराग) कहा जाता है।',
          languageHint: 'Peacock = Marag',
        },
        {
          id: 'q_4',
          question: `कक्षा में सहपाठी या मित्र को प्यार से क्या कहते हैं?`,
          options: ['ᱜᱟᱛᱮ (Gate)', 'ᱵᱚᱭᱦᱟ (Boyha)', 'ᱢᱟᱹᱪᱤ (Maci)', 'ᱯᱩᱛᱷᱤ (Puthi)'],
          correctIndex: 0,
          explanation: '"ᱜᱟᱛᱮ" (गाते) का अर्थ मित्र या साथी होता है।',
          languageHint: 'Friend = Gate',
        },
        {
          id: 'q_5',
          question: `कक्षा में अभिवादन के लिए कौन सा पारंपरिक शब्द बोला जाता है?`,
          options: ['ᱡᱚᱦᱟᱨ (Johar)', 'ᱛᱷᱩ (Thu)', 'ᱦᱮᱸ (He)', 'ᱵᱟᱝ (Bang)'],
          correctIndex: 0,
          explanation: 'झारखंड में प्रकृति और गुरुजनों को सम्मान देने के लिए "जोहार" कहा जाता है।',
          languageHint: 'Greeting = Johar',
        },
      ],
    };
  }

  private buildDefaultVocabulary(_inputs: ContentGeneratorInputs): VocabularyItem[] {
    return [
      {
        id: 'voc_1',
        termHindi: 'साल वृक्ष',
        termTribal: 'Sarjom',
        termScript: 'ᱥᱟᱨᱡᱚᱢ',
        termEnglish: 'Sal Tree',
        partOfSpeech: 'Noun (संज्ञा)',
        definition: 'झारखंड के जंगलों का सबसे पवित्र और विशाल वृक्ष।',
        audioCue: 'sar-jom',
      },
      {
        id: 'voc_2',
        termHindi: 'हाथी',
        termTribal: 'Hati',
        termScript: 'ᱦᱟᱹᱛᱤ',
        termEnglish: 'Elephant',
        partOfSpeech: 'Noun (संज्ञा)',
        definition: 'झारखंड का राज्य पशु, जो दलमा की पहाड़ियों का गौरव है।',
        audioCue: 'ha-ti',
      },
      {
        id: 'voc_3',
        termHindi: 'मोर',
        termTribal: 'Marag',
        termScript: 'ᱢᱟᱨᱟᱜ',
        termEnglish: 'Peacock',
        partOfSpeech: 'Noun (संज्ञा)',
        definition: 'सुंदर पंखों वाला पक्षी जो वर्षा ऋतु में नृत्य करता है।',
        audioCue: 'ma-rag',
      },
      {
        id: 'voc_4',
        termHindi: 'मित्र / साथी',
        termTribal: 'Gate',
        termScript: 'ᱜᱟᱛᱮ',
        termEnglish: 'Friend',
        partOfSpeech: 'Noun (संज्ञा)',
        definition: 'साथ पढ़ने और खेलने वाला सच्चा सहपाठी।',
        audioCue: 'ga-te',
      },
      {
        id: 'voc_5',
        termHindi: 'प्रणाम / आदर',
        termTribal: 'Johar',
        termScript: 'ᱡᱚᱦᱟᱨ',
        termEnglish: 'Respectful Greeting',
        partOfSpeech: 'Interjection (विस्मयादिबोधक)',
        definition: 'प्रकृति और मनुष्य के बीच पारस्परिक सम्मान का पारंपरिक संबोधन।',
        audioCue: 'jo-har',
      },
    ];
  }

  private buildDefaultTeacherNotes(_inputs: ContentGeneratorInputs): TeacherNotesOutput {
    return {
      pedagogyTips: [
        'Always validate the student\'s mother tongue before introducing Hindi textbook terminology.',
        'Use TPR (Total Physical Response) gestures for animal sounds and actions to engage non-verbal learners.',
        'Keep the 45-minute timeline brisk: spend no more than 15 minutes on direct instruction.',
      ],
      tribalBridgeStrategies: [
        'Allow students to explain concepts to each other in their tribal home language (Santali, Mundari, Ho, Kurukh).',
        'Display Ol Chiki scripts alongside Devanagari on the blackboard to build script familiarity naturally.',
        'Connect vocabulary to local festivals (Sarhul, Sohrai, Karam) to trigger prior knowledge.',
      ],
      commonMisconceptions: [
        'Children may confuse the pronunciation of Roman transliteration with Ol Chiki phonetic vowels. Emphasize oral listening first.',
        'Some children hesitate to speak standard Hindi out of fear of making mistakes. Praise every communicative effort.',
      ],
      remedialActivities: [
        'For Level 1 children: Use physical pebble counting and animal flashcard matching pairs.',
        'Assign a buddy from Level 3 to sit beside a Level 1 student during worksheet time.',
      ],
      parentEngagementTip: 'Encourage parents during village meetings to tell oral bedtime folk tales in their mother tongue.',
    };
  }
}

export const geminiContentGeneratorService = new GeminiContentGeneratorService();
export default geminiContentGeneratorService;
