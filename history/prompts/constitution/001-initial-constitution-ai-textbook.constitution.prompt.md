---
id: 001
title: Initial Constitution for AI-Native Textbook
stage: constitution
date: 2026-01-17
surface: agent
model: claude-opus-4-5-20251101
feature: none
branch: main
user: unknown
command: /sp.constitution
labels: ["constitution", "initial-setup", "physical-ai", "robotics", "textbook"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - .specify/memory/constitution.md
tests:
  - N/A
---

## Prompt

# Project Constitution: AI-Native Textbook for Physical AI & Humanoid Robotics

## 1. Mission
Build a fully AI-native, interactive, intelligent textbook that teaches the Physical AI & Humanoid Robotics course.
The product must be fast, simple, beautiful, and feel like a REAL AI-powered education platform — not just a book.

## 2. Core Deliverables
1. A Docusaurus-based interactive textbook with 6-8 short, clean, modern chapters.
2. A fully functional RAG chatbot answering questions ONLY from the book.
3. User authentication (signup/login) using Better-Auth.
4. Personalized chapter content based on user background.
5. One-click Urdu translation for every chapter.
6. Auto-generated summaries, quizzes, and learning boosters.

## 3. Success Criteria
- Clean UI, fast loading, mobile-friendly.
- Minimal, smooth UI animations that enhance UX.
- Book readable in < 45 minutes total.
- RAG answers accurate, cited, and grounded.
- Personalization visibly improves text.
- Urdu translation high-quality and fast.
- Fully deployed:
  - Frontend → Vercel
  - Backend → Railway
  - Vectors → Qdrant
  - Database → Neon

## 4. Non-Goals
- No extra animations beyond minimal useful motion.
- No overly long chapters (short + clear only).
- No complex robotics code — only education content.

## 5. Architecture Principles
- Keep frontend extremely simple, readable.
- Use minimal, smooth animations (not heavy or distracting).
- Use feature-based folder structure (not tech-based like models/controllers).
- Each feature folder contains its own controller, service, and model files.
- Use reusable agent skills for bonus scoring.

## 6. User Stories (Prioritized)
1. As a learner, I want to read the textbook smoothly.
2. As a learner, I want to ask the chatbot questions.
3. As a learner, I want personalized content based on my background.
4. As a learner, I want Urdu translation.
5. As a learner, I want summaries + quizzes.
6. As an admin, I want clean architecture and deployment.

## 7. Constraints
- Must work on free tiers (Qdrant + Neon).
- Must deploy within 90 seconds demo recording.
- Must support low-end devices (users reading on phones).
- Must avoid complexity and heavy dependencies.

## 8. Risks & Mitigation
- **RAG low accuracy** → use chunking + MiniLM embeddings.
- **Token usage high** → implement in phases.
- **User confusion** → keep UI minimal and clean.
- **Backend errors** → add health checks + logging.

## 9. Definition of Done
- All chapters visible and readable.
- Chatbot fully functional with grounded answers.
- Auth + personalization + translation working.
- Quizzes + summaries per chapter generated.
- Fully deployed URLs live and stable.

## Response snapshot

Created the initial project constitution v1.0.0 for the AI-Native Textbook for Physical AI & Humanoid Robotics with 6 core principles:

1. **Simplicity-First** - Minimal frontend, <45min reading time, purposeful animations only
2. **Feature-Based Architecture** - Feature folders with self-contained controller/service/model files
3. **RAG-Grounded Responses** - Chatbot answers only from textbook, always with citations
4. **Free-Tier Infrastructure** - Qdrant, Neon, Vercel, Railway all on free tiers
5. **Mobile-First Responsive Design** - Primary target is smartphone users
6. **Personalization with Privacy** - Better-Auth authentication, transparent data handling

Added Success Criteria table with measurable targets, hard constraints, non-goals, development workflow (quality gates, testing requirements, commit standards), and governance section with amendment process and principle priority order.

## Outcome

- ✅ Impact: Established foundational governance document for the entire project
- 🧪 Tests: N/A - governance document, no code tests
- 📁 Files: .specify/memory/constitution.md (created v1.0.0)
- 🔁 Next prompts: /sp.specify to create feature specs, /sp.plan to create implementation plans
- 🧠 Reflection: Constitution captures all user requirements with testable, declarative principles

## Evaluation notes (flywheel)

- Failure modes observed: None - straightforward template fill
- Graders run and results (PASS/FAIL): Manual validation PASS - no unresolved placeholders
- Prompt variant (if applicable): Standard /sp.constitution invocation
- Next experiment (smallest change to try): Monitor if principles conflict during implementation
