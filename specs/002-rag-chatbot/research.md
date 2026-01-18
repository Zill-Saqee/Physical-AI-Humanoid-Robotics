# Research: RAG Chatbot Implementation

**Feature**: 002-rag-chatbot
**Date**: 2026-01-18
**Status**: Complete

## Research Questions Addressed

1. Frontend chat widget patterns for Docusaurus
2. RAG architecture with free-tier infrastructure
3. Content chunking for educational textbooks
4. API design for streaming responses

---

## Decision 1: Frontend Chat Widget

**Decision**: Custom React chat widget with bottom-sheet modal pattern

**Rationale**:
- Docusaurus uses React 18 natively, so custom widget integrates seamlessly
- Bottom-sheet pattern provides better mobile UX (thumb accessibility)
- Avoids external dependencies per Simplicity-First principle
- Can be implemented as swizzled Docusaurus theme component

**Alternatives Considered**:
- `chatscope/chat-ui-kit-react` - Good but adds dependency
- `react-chat-widget` (Wolox) - Lightweight but less customizable for bottom-sheet
- Third-party SaaS widgets - Violates free-tier and simplicity principles

**Implementation Notes**:
- Lazy-load chat widget (not in critical render path)
- Use CSS transforms for animations (60fps on low-end devices)
- Minimum 44x44px touch targets
- Sticky input at bottom with keyboard handling

---

## Decision 2: Vector Database

**Decision**: Qdrant Cloud free tier

**Rationale**:
- Free tier: 1M vectors (sufficient for ~50 chunks from 6 chapters)
- Native REST API + Python/JavaScript SDKs
- Metadata support for chapter/section/position storage
- Aligned with constitution (explicitly mentioned)

**Alternatives Considered**:
- Pinecone - Requires credit card for free tier
- Weaviate Cloud - Similar to Qdrant but less constitution alignment
- Self-hosted Qdrant on Railway - Uses compute budget unnecessarily

**Implementation Notes**:
- Collection schema: `{ vector: [384-dim], payload: { chapter, section, text, position } }`
- Weekly ping task to prevent auto-suspension after 1 week inactivity
- Pre-compute embeddings at build time, not runtime

---

## Decision 3: Embedding Model

**Decision**: MiniLM (all-MiniLM-L6-v2) via local inference

**Rationale**:
- Output dimension: 384 (lightweight)
- Speed: 5-14K sentences/second on CPU
- Latency: <30ms per request
- Constitution explicitly recommends MiniLM for efficiency
- Can run locally on backend (no API costs)

**Alternatives Considered**:
- BGE-Small-EN - Slightly better accuracy but higher latency
- OpenAI text-embedding-3-small - Violates free-tier constraint
- Hugging Face Inference API - Rate-limited (5 req/min)

**Implementation Notes**:
- Pre-compute textbook embeddings at build time
- Only embed user queries at runtime
- Use sentence-transformers Python library or Ollama

---

## Decision 4: LLM Provider

**Decision**: Groq API with Llama 3 8B (free tier)

**Rationale**:
- Groq offers generous free tier with fast inference
- Llama 3 8B provides good quality responses
- <1 second latency for most responses
- No self-hosting complexity

**Alternatives Considered**:
- Ollama + self-hosted Mistral 7B - Adds Railway compute cost
- Together AI - $25 free credits run out
- OpenRouter - Rate-limited free tier (20 req/min)
- Claude API - Paid only

**Implementation Notes**:
- Use streaming responses via SSE
- Set 4-second timeout on generation
- Fallback error message if API unavailable

---

## Decision 5: Content Chunking Strategy

**Decision**: Document-aware semantic chunking at subsection boundaries

**Rationale**:
- Honors textbook structure: chapters → sections → subsections
- Preserves educational context and learning flow
- 6 chapters (~7000 words) = ~40-50 chunks at 200 tokens average
- Fits within Qdrant free tier limits easily

**Alternatives Considered**:
- Fixed-size tokenized chunks - Breaks semantic coherence
- Sentence-level clustering - Over-engineers for small corpus
- Paragraph-level only - Too granular for source attribution

**Implementation Notes**:
- Chunk metadata: `{ chunk_id, chapter, section, title, text, position }`
- 200-300 token overlap between chunks for context continuity
- Extract from Docusaurus markdown during build phase

---

## Decision 6: API Streaming Pattern

**Decision**: Server-Sent Events (SSE) for streaming responses

**Rationale**:
- One-way server-to-client streaming (perfect for chat)
- Lower overhead than WebSockets
- Native browser support via EventSource API
- Simpler to implement and debug

**Alternatives Considered**:
- WebSockets - Overkill for one-way streaming
- Long polling - Higher latency, more complex
- Full HTTP response - No streaming, poor UX for long responses

**Implementation Notes**:
- Endpoint: `POST /api/chat` with text/event-stream response
- Event types: `token`, `sources`, `done`, `error`
- Timeout: 4 seconds for generation phase

---

## Decision 7: Backend Deployment

**Decision**: Vercel Serverless Functions

**Rationale**:
- Already using Vercel for Docusaurus frontend
- Free tier: 150K function invocations/month
- Supports streaming responses
- Simplifies deployment (single platform)

**Alternatives Considered**:
- Railway - $5/month after trial, adds complexity
- Fly.io - Similar to Railway
- AWS Lambda - More complex setup

**Implementation Notes**:
- Edge functions for low latency
- Keep functions under 10-second timeout
- Use Vercel KV for embedding cache if needed

---

## Decision 8: Session Storage

**Decision**: Browser sessionStorage (ephemeral, no backend persistence)

**Rationale**:
- Simplest implementation for MVP
- No database required for conversation history
- Aligned with Simplicity-First principle
- Spec states "session-based conversation history is sufficient"

**Alternatives Considered**:
- Neon PostgreSQL - Adds complexity for MVP
- Redis/Vercel KV - Overkill for session data
- LocalStorage - Persists across sessions (not desired for MVP)

**Implementation Notes**:
- Store conversation array in React state
- Persist to sessionStorage on each update
- Load from sessionStorage on widget open
- Clear on page refresh/new session

---

## Latency Budget Analysis

Target: <5 seconds end-to-end response time

| Phase | Budget | Optimizations |
|-------|--------|---------------|
| Network + TLS | 200ms | Use edge functions |
| Query embedding | 50ms | Cache common queries |
| Vector retrieval | 200ms | Pre-warmed connection pool |
| LLM streaming setup | 100ms | Use Groq (fast cold start) |
| First token | 500ms | Streaming reduces perceived latency |
| Remaining tokens | 2000-3000ms | Progressive rendering |
| **Total** | ~3-4s typical | Buffer for edge cases |

---

## Free Tier Compliance Summary

| Service | Free Tier Limit | Our Usage | Status |
|---------|-----------------|-----------|--------|
| Vercel (frontend + API) | 100GB BW, 150K functions | <1GB, <10K/month | ✅ |
| Qdrant Cloud | 1M vectors | ~50 vectors | ✅ |
| Groq API | Rate-limited free tier | Reasonable usage | ✅ |
| MiniLM (local) | Unlimited | N/A | ✅ |
| **Total Monthly Cost** | - | $0 | ✅ |

---

## Risks and Mitigations

| Risk | Impact | Mitigation |
|------|--------|-----------|
| Groq rate limits | Users see errors | Implement queue + retry with backoff |
| Qdrant auto-suspension | Service down | Weekly health check ping |
| Response >5 seconds | Poor UX | Streaming + timeout fallback |
| Citation hallucination | Reduced trust | Post-process citations, verify against chunks |

---

## Next Steps

1. Create data-model.md with entity definitions
2. Create contracts/components.ts with TypeScript interfaces
3. Create quickstart.md with setup instructions
4. Update plan.md with final architecture
