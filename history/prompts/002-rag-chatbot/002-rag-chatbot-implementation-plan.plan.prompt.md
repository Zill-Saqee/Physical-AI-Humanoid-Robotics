---
id: 002
title: RAG Chatbot Implementation Plan
stage: plan
date: 2026-01-18
surface: agent
model: claude-opus-4-5-20251101
feature: 002-rag-chatbot
branch: 002-rag-chatbot
user: ishaq
command: /sp.plan
labels: ["planning", "rag", "architecture", "chatbot"]
links:
  spec: specs/002-rag-chatbot/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - specs/002-rag-chatbot/plan.md
  - specs/002-rag-chatbot/research.md
  - specs/002-rag-chatbot/data-model.md
  - specs/002-rag-chatbot/quickstart.md
  - specs/002-rag-chatbot/contracts/components.ts
  - CLAUDE.md
tests:
  - Constitution check (all principles PASS)
---

## Prompt

/sp.plan

Continue planning for the RAG chatbot feature (002-rag-chatbot). Complete Phase 0 research and Phase 1 design artifacts.

## Response snapshot

Completed implementation planning for RAG chatbot:

### Phase 0: Research (research.md)
- Frontend: Custom React chat widget with bottom-sheet pattern
- Vector DB: Qdrant Cloud free tier (1M vectors)
- Embeddings: MiniLM-L6-v2 (384 dimensions, local inference)
- LLM: Groq API with Llama 3 8B (free tier)
- Streaming: Server-Sent Events (SSE)
- Storage: Browser sessionStorage (ephemeral)

### Phase 1: Design Artifacts
- **data-model.md**: 6 entities (TextChunk, Message, SourceReference, Conversation, ChatRequest, ChatResponse)
- **contracts/components.ts**: TypeScript interfaces for all components, hooks, and API types
- **quickstart.md**: Setup instructions for development
- **plan.md**: Complete implementation plan with architecture diagram

### Constitution Check
All 6 principles verified:
- I. Simplicity-First: ✅ Minimal dependencies
- II. Feature-Based Architecture: ✅ ChatWidget/ folder structure
- III. RAG-Grounded Responses: ✅ Source citations required
- IV. Free-Tier Infrastructure: ✅ Qdrant, Groq, Vercel all free
- V. Mobile-First Responsive: ✅ Bottom-sheet, 44px targets
- VI. Personalization with Privacy: N/A (session-only)

### Key Architecture Decisions
- Build-time indexing (not runtime) for embeddings
- Single /api/chat endpoint with SSE streaming
- ~50 chunks from 6 chapters indexed in Qdrant
- <5 second response target with streaming

## Outcome

- ✅ Impact: Complete implementation plan ready for task generation
- 🧪 Tests: Constitution check PASS on all applicable principles
- 📁 Files: 5 artifacts created (plan, research, data-model, quickstart, contracts)
- 🔁 Next prompts: /sp.tasks to generate implementation tasks
- 🧠 Reflection: Architecture optimized for free-tier constraints while meeting all spec requirements

## Evaluation notes (flywheel)

- Failure modes observed: None
- Graders run and results (PASS/FAIL): Constitution check PASS
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): N/A
