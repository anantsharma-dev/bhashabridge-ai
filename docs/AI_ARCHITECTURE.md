# BhashaBridge AI Architecture

## Purpose

This document defines the complete artificial intelligence architecture powering BhashaBridge AI.

It explains how multilingual speech recognition, translation, text generation, speech synthesis, OCR, offline storage, synchronization, and Android deployment interact inside the application.

The architecture is designed for unreliable internet connectivity and offline-first classroom environments.

---

## Architectural Vision

BhashaBridge AI separates the user interface from AI services.

Every AI capability is implemented through reusable services that can operate online or offline depending on device connectivity.

The application should continue functioning even when cloud services are unavailable.

---

## AI Pipeline

Voice input begins with microphone capture.

Speech recognition converts audio into multilingual text.

Language detection identifies Hindi, Santali, English, or mixed-language speech.

Translation services normalize multilingual text before generating target-language output.

Speech synthesis converts translated text into natural child-friendly audio.

The same architecture supports reading stories, vocabulary pronunciation, classroom translation, and lesson narration.

---

## Speech Recognition

Speech recognition is powered through Whisper.

Audio recordings remain abstracted behind reusable services so different Whisper models can be swapped depending on device capability.

Streaming transcription should be supported in future versions.

---

## Translation Engine

Gemini Flash functions as the multilingual reasoning engine.

Translation services normalize Hinglish, mixed Hindi-English speech, Santali vocabulary, and contextual classroom phrases before translation.

Translation architecture remains reusable across stories, flashcards, worksheets, and classroom conversations.

---

## Speech Synthesis

Speech synthesis uses natural neural voices rather than robotic synthesis.

Kokoro TTS is the preferred offline architecture.

Edge Neural voices serve as optional online fallbacks.

Future Santali voices can replace placeholders without changing application architecture.

---

## OCR Pipeline

OCR extracts text from textbooks, worksheets, handwritten pages, classroom posters, and printed educational materials.

OCR output feeds translation services and reading-aloud services.

---

## Offline AI

Offline AI services use lightweight local models wherever practical.

Translation memories, vocabulary packs, pronunciation dictionaries, and curriculum packs remain locally cached.

AI requests automatically switch between offline and online providers depending on connectivity.

---

## Storage Architecture

IndexedDB stores flashcards, stories, vocabulary progress, lesson history, translations, and downloaded curriculum packs.

SQLite becomes the persistent database inside Android tablet deployments.

Synchronization occurs only when connectivity becomes available.

---

## Android Tablet Deployment

The application is packaged for Android tablets using Capacitor.

Offline curriculum packs download once and remain locally available.

Background synchronization updates vocabulary, stories, worksheets, and curriculum revisions without interrupting classroom use.

---

## Security Principles

API keys remain inside environment variables.

Sensitive AI providers are never exposed directly to the client.

Translation requests use reusable service abstractions.

Offline storage encrypts sensitive classroom information where appropriate.

---

## Future AI Modules

Future AI capabilities include handwriting recognition, pronunciation scoring, adaptive learning recommendations, classroom analytics, multilingual tutoring, image recognition for educational objects, and offline conversational tutoring.

These modules extend the architecture without changing existing educational interfaces.
