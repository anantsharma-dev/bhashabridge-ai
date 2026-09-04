/**
 * BhashaBridge AI — Pedagogical AI Prompt Templates
 * Formulated according to NEP 2020 Section 4.11 & NIPUN Bharat FLN standards
 * for Jharkhand Mother Tongue-Based Multilingual Education (MTB-MLE).
 */

export const SYSTEM_PROMPT_MTB_MLE = `
You are BhashaBridge AI, an expert pedagogical assistant for Grade 1–5 primary school teachers in rural Jharkhand, India.
You specialize in Mother Tongue-Based Multilingual Education (MTB-MLE), bridging Hindi (मानक हिन्दी) with regional tribal languages:
1. Santali (ᱥᱟᱱᱛᱟᱲᱤ) using the Ol Chiki (ᱚᱞ ᱪᱤᱠᱤ) script with phonetic Roman transliteration.
2. Ho (ᱦᱳ) using Warang Chiti / Devanagari.
3. Mundari (ᱢᱩᱱᱰᱟᱨᱤ).
4. Kurukh (Oraon).

Strict Rules:
- Prioritize child-friendly, concrete, everyday vocabulary.
- Keep tone warm, encouraging, culturally grounded (Johar Hornbill mascot persona).
- Always provide Roman phonetic pronunciation alongside tribal script for non-native teachers.
- Align with NIPUN Bharat foundational literacy and numeracy (FLN) competencies.
`;

export const TRANSLATION_PROMPT = (text: string, sourceLang: string, targetLang: string) => `
Translate the following classroom text from ${sourceLang} to ${targetLang}.
Source Text: "${text}"

Provide the response in structured JSON with:
{
  "sourceText": "${text}",
  "translatedText": "<native script translation>",
  "romanPronunciation": "<phonetic romanization for teacher read-aloud>",
  "classroomContext": "<usage tip for primary school>",
  "confidence": 0.95
}
`;

export const WORKSHEET_PROMPT = (grade: string, subject: string, topic: string) => `
Generate a NIPUN Bharat FLN aligned bilingual worksheet for ${grade}, Subject: ${subject}, Topic: ${topic}.
Include:
- 5 child-friendly questions (matching, letter tracing, or counting).
- Clear teacher instructions in Hindi and Santali (Ol Chiki).
- Answer key with phonetic hints.
`;

export const LESSON_PLAN_PROMPT = (topic: string, grade: string, duration: string) => `
Create a comprehensive 9-phase MTB-MLE lesson plan for ${grade} on "${topic}" (${duration}).
Phases must follow the BhashaBridge methodology:
1. Johar Circle & Warm-up
2. Oral Storytelling in Mother Tongue
3. Ol Chiki Script & Phonics Introduction
4. Hindi Translation Bridge
5. Multi-Sensory Action Activity
6. Flashcard & Picture Card Matching
7. Worksheet Practice
8. Student Presentation & Peer Review
9. Wrap-up, Homework & Johar
`;

export const STORY_GENERATION_PROMPT = (theme: string, grade: string) => `
Write an authentic, delightful children's folklore story set in Jharkhand for ${grade}.
Theme: ${theme}
Characters should include local forest animals (elephant, peacock, deer, horned owl) or village life.
Provide side-by-side Hindi and Santali (Ol Chiki) sentences with phonetic Roman guide.
`;
