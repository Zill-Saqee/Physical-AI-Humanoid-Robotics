# Tasks: RAG Chatbot

**Input**: Design documents from `/specs/002-rag-chatbot/`
**Prerequisites**: plan.md ✅, spec.md ✅, research.md ✅, data-model.md ✅, contracts/components.ts ✅

**Tests**: Not explicitly requested in specification. Test tasks omitted.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3, US4)
- Include exact file paths in descriptions

## Path Conventions

Based on plan.md structure:
- **Docusaurus root**: `docusaurus/`
- **Components**: `docusaurus/src/components/ChatWidget/`
- **Hooks**: `docusaurus/src/hooks/`
- **API**: `docusaurus/src/pages/api/`
- **Library**: `docusaurus/lib/`
- **Scripts**: `docusaurus/scripts/`
- **Types**: Copy from `specs/002-rag-chatbot/contracts/components.ts`

---

## Phase 1: Setup (Project Initialization)

**Purpose**: Install dependencies and configure environment for RAG chatbot

- [x] T001 Install chatbot dependencies: `npm install @qdrant/js-client-rest groq-sdk uuid @xenova/transformers`
- [x] T002 Create `.env.local` template in `docusaurus/.env.local.example` with QDRANT_URL, QDRANT_API_KEY, GROQ_API_KEY
- [x] T003 [P] Copy TypeScript types from `specs/002-rag-chatbot/contracts/components.ts` to `docusaurus/src/types/chat.ts`
- [x] T004 [P] Update `docusaurus/package.json` with chatbot scripts (chatbot:index)
- [x] T005 Configure environment variables loading in `docusaurus/docusaurus.config.ts`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core RAG infrastructure that MUST be complete before ANY user story

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T006 Create Qdrant client wrapper in `docusaurus/lib/qdrant.ts`
- [x] T007 Create embeddings utility in `docusaurus/lib/embeddings.ts` using @xenova/transformers (MiniLM)
- [x] T008 [P] Create content chunking utility in `docusaurus/lib/chunker.ts`
- [x] T009 Create indexing script in `docusaurus/scripts/index-content.ts`
- [ ] T010 Run indexing script to populate Qdrant with textbook chunks *(requires API keys)*
- [x] T011 Create chat service in `docusaurus/lib/chat-service.ts` (orchestrates embedding, retrieval, generation)

**Checkpoint**: RAG pipeline ready - can retrieve chunks and generate responses

---

## Phase 3: User Story 1 - Ask Questions (Priority: P1) 🎯 MVP

**Goal**: Enable learners to ask questions and receive contextual answers from textbook content

**Independent Test**: Open chatbot, ask "What is Physical AI?", receive relevant answer within 5 seconds

### Implementation for User Story 1

- [x] T012 [P] [US1] Create ChatButton component in `docusaurus/src/components/ChatWidget/ChatButton.tsx`
- [x] T013 [P] [US1] Create ChatPanel component in `docusaurus/src/components/ChatWidget/ChatPanel.tsx`
- [x] T014 [P] [US1] Create ChatInput component in `docusaurus/src/components/ChatWidget/ChatInput.tsx`
- [x] T015 [P] [US1] Create MessageBubble component in `docusaurus/src/components/ChatWidget/MessageBubble.tsx`
- [x] T016 [P] [US1] Create LoadingIndicator component in `docusaurus/src/components/ChatWidget/LoadingIndicator.tsx`
- [x] T017 [P] [US1] Create ChatWidget styles in `docusaurus/src/components/ChatWidget/styles.module.css`
- [x] T018 [US1] Create main ChatWidget component in `docusaurus/src/components/ChatWidget/index.tsx`
- [x] T019 [US1] Create useChatWidget hook in `docusaurus/src/hooks/useChatWidget.ts`
- [x] T020 [US1] Create useChat hook in `docusaurus/src/hooks/useChat.ts` (state, API calls, streaming)
- [x] T021 [US1] Create chat API endpoint in `docusaurus/src/pages/api/chat.ts` with SSE streaming
- [x] T022 [US1] Integrate ChatWidget into Root theme in `docusaurus/src/theme/Root/index.tsx`
- [ ] T023 [US1] Verify chat opens, accepts input, and returns streaming response *(requires API keys)*

**Checkpoint**: User Story 1 complete - Can ask questions and receive answers

---

## Phase 4: User Story 2 - View Source References (Priority: P2)

**Goal**: Display clickable source references that navigate to textbook sections

**Independent Test**: Ask a question, see source references, click one and navigate to the chapter

### Implementation for User Story 2

- [x] T024 [P] [US2] Create SourceList component in `docusaurus/src/components/ChatWidget/SourceList.tsx`
- [x] T025 [US2] Update MessageBubble to display sources from `docusaurus/src/components/ChatWidget/MessageBubble.tsx`
- [x] T026 [US2] Implement source click navigation using Docusaurus router
- [x] T027 [US2] Update chat API to include source references in response stream

**Checkpoint**: User Story 2 complete - Sources displayed and clickable

---

## Phase 5: User Story 3 - Conversation History (Priority: P3)

**Goal**: Persist conversation history within browser session

**Independent Test**: Ask multiple questions, scroll up to see previous exchanges, close/reopen widget to verify persistence

### Implementation for User Story 3

- [x] T028 [US3] Implement sessionStorage persistence in useChat hook
- [x] T029 [US3] Add conversation history to API context (last 10 messages)
- [x] T030 [US3] Add scrollable message list with auto-scroll to latest
- [x] T031 [US3] Preserve widget open state across navigation

**Checkpoint**: User Story 3 complete - Conversation persists within session

---

## Phase 6: User Story 4 - Out-of-Scope Handling (Priority: P3)

**Goal**: Gracefully handle questions outside textbook scope

**Independent Test**: Ask "What's the weather today?" and receive appropriate out-of-scope response

### Implementation for User Story 4

- [x] T032 [US4] Add similarity threshold check in chat-service.ts (score < 0.5 = out of scope)
- [x] T033 [US4] Create out-of-scope response template in chat-service.ts
- [x] T034 [P] [US4] Create ErrorDisplay component in `docusaurus/src/components/ChatWidget/ErrorDisplay.tsx`
- [x] T035 [US4] Handle API errors with retry option in useChat hook

**Checkpoint**: User Story 4 complete - Out-of-scope questions handled gracefully

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Mobile optimization, accessibility, and performance

- [x] T036 [P] Add ARIA labels and keyboard navigation to all chat components
- [x] T037 [P] Optimize chat widget for 320px viewport (mobile-first CSS)
- [x] T038 [P] Add loading states and error boundaries
- [x] T039 Lazy load ChatWidget to improve initial page load
- [x] T040 Add rate limiting (2 second minimum between requests)
- [ ] T041 Verify response time < 5 seconds on typical queries *(requires API keys)*
- [x] T042 Run build and verify no TypeScript errors
- [ ] T043 Validate quickstart.md instructions work correctly *(requires API keys)*

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Story 1 (Phase 3)**: Depends on Foundational - Core chat functionality
- **User Story 2 (Phase 4)**: Depends on US1 (needs response to display sources)
- **User Story 3 (Phase 5)**: Can start after Foundational (parallel with US1/US2)
- **User Story 4 (Phase 6)**: Depends on Foundational (parallel with US1/US2/US3)
- **Polish (Phase 7)**: Depends on all user stories being complete

### User Story Dependencies

```
Phase 1: Setup
    ↓
Phase 2: Foundational (BLOCKS ALL)
    ↓
    ├── US1 (P1): Core Chat ─────────────────┐
    │       ↓                                │
    ├── US2 (P2): Sources (needs US1 response)│
    │                                        │
    ├── US3 (P3): History ───────────────────┼── Can parallel
    │                                        │
    └── US4 (P3): Error Handling ────────────┘
                        ↓
                Phase 7: Polish
```

### Parallel Opportunities

**Phase 1 (Setup)**: T003, T004 can run in parallel

**Phase 2 (Foundational)**: T008 can run parallel with T006, T007

**Phase 3 (US1)**: T012-T017 can ALL run in parallel (independent component files)

**Phase 4 (US2)**: T024 can run parallel with other Phase 4 tasks

**Phase 6 (US4)**: T034 can run parallel with T032, T033

**Phase 7 (Polish)**: T036, T037, T038 can run in parallel

---

## Parallel Example: User Story 1 Components

```bash
# All component files can be created simultaneously (different files):
Task: T012 "Create ChatButton in docusaurus/src/components/ChatWidget/ChatButton.tsx"
Task: T013 "Create ChatPanel in docusaurus/src/components/ChatWidget/ChatPanel.tsx"
Task: T014 "Create ChatInput in docusaurus/src/components/ChatWidget/ChatInput.tsx"
Task: T015 "Create MessageBubble in docusaurus/src/components/ChatWidget/MessageBubble.tsx"
Task: T016 "Create LoadingIndicator in docusaurus/src/components/ChatWidget/LoadingIndicator.tsx"
Task: T017 "Create styles in docusaurus/src/components/ChatWidget/styles.module.css"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1 (core chat)
4. **STOP and VALIDATE**: Test asking questions, verify responses appear
5. Deploy/demo if ready - basic chatbot is functional

### Incremental Delivery

1. Setup + Foundational → RAG pipeline ready
2. Add User Story 1 → Can ask questions → Deploy (MVP!)
3. Add User Story 2 → Sources displayed → Deploy
4. Add User Story 3 → History persists → Deploy
5. Add User Story 4 → Error handling → Deploy
6. Polish → Mobile + accessibility → Final Deploy

---

## Summary

| Metric | Count |
|--------|-------|
| **Total Tasks** | 43 |
| **Setup Tasks** | 5 |
| **Foundational Tasks** | 6 |
| **US1 Tasks (Core Chat)** | 12 |
| **US2 Tasks (Sources)** | 4 |
| **US3 Tasks (History)** | 4 |
| **US4 Tasks (Errors)** | 4 |
| **Polish Tasks** | 8 |
| **Parallel Opportunities** | 18 tasks marked [P] |

### MVP Scope

- **Phase 1 + 2 + 3 = MVP** (23 tasks)
- Delivers: Working chatbot that answers questions from textbook
- Independent test: Ask "What is Physical AI?" and receive relevant answer

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story is independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Environment variables (Qdrant, Groq) must be configured before Phase 2
