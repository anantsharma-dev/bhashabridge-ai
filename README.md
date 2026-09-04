# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend enabling type-aware lint rules by installing `oxlint-tsgolint` and editing `.oxlintrc.json`:

```json
{
  "$schema": "./node_modules/oxlint/configuration_schema.json",
  "plugins": ["react", "typescript", "oxc"],
  "options": {
    "typeAware": true
  },
  "rules": {
    "react/rules-of-hooks": "error",
    "react/only-export-components": ["warn", { "allowConstantExport": true }]
  }
}
```

See the [Oxlint rules documentation](https://oxc.rs/docs/guide/usage/linter/rules) for the full list of rules and categories.
# BhashaBridge AI

*A multilingual AI-powered learning platform for India's foundational classrooms.*

## Vision

BhashaBridge AI is an offline-first multilingual educational platform designed for children studying in **Jharkhand MTB-MLE (Mother Tongue Based Multilingual Education)** classrooms from **Grade 1 to Grade 5**. The platform combines foundational literacy, multilingual learning, artificial intelligence, local cultural knowledge, and interactive educational design into a single application optimized for Android tablets used in government schools.

The project addresses one of the largest challenges in early education: children often begin school in a language different from the language they speak at home. BhashaBridge AI creates a bridge between **Santali (Ol Chiki), Hindi, English, Ho, Mundari**, and future Indian languages while preserving children's linguistic identity and gradually introducing multilingual literacy.

Rather than functioning as a translation application alone, BhashaBridge AI is designed as a complete educational ecosystem where students learn to read, speak, listen, explore stories, solve worksheets, understand their environment, and interact with AI in their own language.

---

## Educational Mission

The platform follows three guiding principles:

* **Mother Tongue First Learning** — children understand concepts first in the language they already know.
* **Multilingual Progression** — concepts gradually expand into Hindi and English without replacing the home language.
* **Inquiry-Based Learning** — children learn to ask questions, reason, observe, compare ideas, and develop curiosity across subjects.

The application integrates the objectives of **NIPUN Bharat**, **NCERT Foundational Stage Curriculum**, and **Jharkhand MTB-MLE pedagogy** with modern AI-assisted learning experiences.

---

## Core Features

BhashaBridge AI is organized into educational modules instead of isolated utilities.

The dashboard introduces today's lessons, vocabulary milestones, learning streaks, classroom progress, and personalized activities.

Voice Translation allows children and teachers to converse naturally across Hindi, Santali, English, and other supported languages through speech recognition and speech synthesis.

Flashcards Explorer teaches vocabulary using illustrations, pronunciation, bilingual sentences, and interactive quizzes.

Stories & Read Along provides narrated multilingual stories with synchronized word highlighting and vocabulary explanations.

Worksheet Generator creates printable bilingual worksheets aligned with NCERT and NIPUN Bharat learning outcomes.

Lesson Planner assists teachers in creating multilingual classroom lesson plans and assessments.

Offline Library stores books, stories, worksheets, and curriculum packs for schools with unreliable internet connectivity.

Teacher Classroom Dashboard tracks classroom progress, attendance, vocabulary milestones, and learning analytics.

---

## Technology Stack

BhashaBridge AI is built using a modern offline-first architecture.

**Frontend**

* React
* TypeScript
* Vite
* Tailwind CSS v4
* Material Design 3 inspired component system

**AI Layer**

* Gemini Flash (translation, lesson generation, worksheets)
* Whisper (speech recognition)
* Kokoro / Neural TTS (speech synthesis)
* Indic language translation models
* OCR pipeline for worksheets and textbooks

**Offline Layer**

* IndexedDB
* SQLite (Android deployment)
* Local JSON curriculum packs
* Offline synchronization engine

---

## Design Philosophy

The interface is intentionally designed for children between the ages of **6 and 11**.

Instead of dark themes or futuristic interfaces, the application follows the visual language of educational products like **Duolingo ABC**, **Khan Academy Kids**, **Google Read Along**, and **Material Design 3**.

The interface emphasizes warmth, simplicity, accessibility, rounded shapes, soft colors, expressive illustrations, and joyful interactions that reduce cognitive load during learning.

---

## Target Devices

The primary deployment target is **10-inch Android tablets (1280×800)** distributed in Jharkhand government schools.

The application is responsive down to mobile devices while prioritizing tablet-first classroom usability.

---

## Repository Documentation

The repository contains a complete technical and educational specification.

| Document           | Purpose                                                |
| ------------------ | ------------------------------------------------------ |
| GEMINI.md          | AI development rules followed by Gemini CLI.           |
| ROADMAP.md         | Sprint tracker and development milestones.             |
| DESIGN_SYSTEM.md   | Complete visual design language and UI specifications. |
| CURRICULUM.md      | Educational framework across all subjects.             |
| AI_ARCHITECTURE.md | AI pipeline and offline infrastructure.                |
| CONTENT_ENGINE.md  | Rules for generating educational content.              |

Together these documents define the long-term architecture of BhashaBridge AI.

---

## Installation

Clone the repository.

Install dependencies.

Run the development server.

```bash
npm install
npm run dev
```

Create a production build.

```bash
npm run build
```

The project should compile without TypeScript or Tailwind errors before every sprint is considered complete.

---

## Development Workflow

Development follows a sprint-based workflow. Every sprint introduces one complete educational module while preserving existing routing, architecture, and functionality.

Each sprint ends only after:

* TypeScript compilation succeeds.
* `npm run build` passes.
* The new module is responsive.
* Existing pages remain functional.
* Changes are committed to Git.

This incremental workflow ensures that the application remains deployable throughout development.

---

## Long-Term Goal

BhashaBridge AI is intended to become an AI-assisted multilingual learning platform for foundational education in India. The long-term roadmap includes offline AI models, curriculum synchronization, speech-based classroom assistants, local language storytelling, teacher analytics, and deployable Android tablet applications for rural classrooms.
# bhashabridge-ai
