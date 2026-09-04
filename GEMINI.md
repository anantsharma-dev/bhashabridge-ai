# GEMINI.md

## Purpose

This document defines the development rules that Gemini CLI must follow throughout the BhashaBridge AI project.

It serves as the permanent operating manual for AI-assisted development and ensures that every generated feature follows the project's architecture, educational philosophy, design language, and technical standards.

Gemini CLI must treat this document as a project contract rather than a task prompt.

---

## Project Identity

BhashaBridge AI is an offline-first multilingual educational platform built for Grade 1–5 MTB-MLE classrooms in Jharkhand.

The application combines foundational literacy, multilingual education, AI-assisted translation, storytelling, worksheet generation, classroom planning, and offline educational resources.

Every generated feature must reinforce this educational mission.

---

## Architectural Principles

The existing React + Vite + TypeScript + Tailwind project architecture is considered stable.

Gemini must preserve:

* routing structure,
* folder organization,
* state management,
* reusable UI architecture,
* environment configuration,
* TypeScript strict mode.

No sprint should refactor unrelated modules unless explicitly requested.

---

## Development Philosophy

Every sprint implements one self-contained feature.

Generated code must be modular, reusable, strongly typed, and documented where appropriate.

Large features should be broken into reusable components instead of single-page implementations.

Every reusable component belongs inside the existing component hierarchy.

---

## Design Rules

Every interface must follow the specifications defined inside `DESIGN_SYSTEM.md`.

Gemini should never introduce dark themes, glassmorphism, neon borders, cyberpunk gradients, or visually noisy interfaces.

The application always uses the warm educational design language defined by the design system.

---

## Curriculum Rules

Educational content must follow `CURRICULUM.md`.

Gemini must preserve multilingual learning progression and grade appropriateness.

Content should support Hindi, Santali (Ol Chiki), English, and expandable tribal languages.

---

## AI Rules

Gemini must follow `AI_ARCHITECTURE.md` before implementing AI functionality.

API keys must never be hardcoded.

All AI providers must be abstracted behind reusable services.

Offline fallbacks must always exist.

---

## Content Generation Rules

Stories, flashcards, quizzes, worksheets, vocabulary cards, lesson plans, and translations must follow `CONTENT_ENGINE.md`.

Generated educational content must remain culturally respectful, multilingual, age-appropriate, and curriculum aligned.

---

## Build Validation

Every completed sprint ends with a production build.

Gemini must execute:

```bash
npm run build
```

Compilation errors must be resolved before completing the sprint.

---

## Git Workflow

Every sprint represents one Git commit.

Commit messages should clearly describe the implemented educational module.

Examples:

* Sprint 1 — Dashboard redesign.
* Sprint 2 — Voice Translation UI.
* Sprint 3 — Flashcards Explorer.

This maintains a clean development history.

---

## What Gemini Must Never Do

Gemini must never remove existing pages, rename routes without instruction, delete reusable components, break tablet responsiveness, introduce incompatible dependencies without justification, or overwrite previous sprint functionality.

Every change must preserve the application's stability while extending its capabilities.
