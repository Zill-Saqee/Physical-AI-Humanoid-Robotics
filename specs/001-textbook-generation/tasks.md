# Tasks: Interactive Textbook Generation

**Input**: Design documents from `/specs/001-textbook-generation/`
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
- **Components**: `docusaurus/src/components/`
- **Hooks**: `docusaurus/src/hooks/`
- **Pages**: `docusaurus/src/pages/`
- **Styles**: `docusaurus/src/css/`
- **Content**: `docusaurus/docs/`
- **Static assets**: `docusaurus/static/`

---

## Phase 1: Setup (Project Initialization)

**Purpose**: Initialize Docusaurus project with required dependencies

- [x] T001 Create Docusaurus project in `docusaurus/` directory using `npx create-docusaurus@latest`
- [x] T002 Configure TypeScript in `docusaurus/tsconfig.json` with strict mode
- [x] T003 [P] Configure ESLint in `docusaurus/.eslintrc.js` for TypeScript React
- [x] T004 [P] Configure Prettier in `docusaurus/.prettierrc`
- [x] T005 Update `docusaurus/package.json` with project metadata and scripts
- [x] T006 Configure site metadata in `docusaurus/docusaurus.config.ts` (title, tagline, URL)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core configuration and shared infrastructure that MUST be complete before ANY user story

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T007 Configure sidebar structure in `docusaurus/sidebars.ts` with 6 chapter placeholders
- [x] T008 [P] Create mobile-first custom styles in `docusaurus/src/css/custom.css` with Infima overrides
- [x] T009 [P] Create TypeScript interfaces in `docusaurus/src/types/index.ts` from contracts/components.ts
- [x] T010 [P] Add PWA manifest in `docusaurus/static/manifest.json` for mobile home screen
- [x] T011 Install and configure PWA plugin in `docusaurus/docusaurus.config.ts` (@docusaurus/plugin-pwa)
- [x] T012 Configure Vercel deployment in `docusaurus/vercel.json` with build settings

**Checkpoint**: Foundation ready - user story implementation can now begin

---

## Phase 3: User Story 1 - Read Textbook Chapters Sequentially (Priority: P1) 🎯 MVP

**Goal**: Enable learners to read through all 6 chapters from start to finish with proper formatting

**Independent Test**: Navigate to textbook, open Chapter 1, read through all chapters, verify content renders correctly with headings, paragraphs, and images

### Implementation for User Story 1

- [x] T013 [P] [US1] Create introduction content in `docusaurus/docs/intro.md` with front matter
- [x] T014 [P] [US1] Create Chapter 1: Introduction to Physical AI in `docusaurus/docs/chapter-1-physical-ai-introduction.md`
- [x] T015 [P] [US1] Create Chapter 2: Humanoid Robotics Fundamentals in `docusaurus/docs/chapter-2-humanoid-robotics-fundamentals.md`
- [x] T016 [P] [US1] Create Chapter 3: Sensors and Perception in `docusaurus/docs/chapter-3-sensors-perception.md`
- [x] T017 [P] [US1] Create Chapter 4: Actuators and Movement in `docusaurus/docs/chapter-4-actuators-movement.md`
- [x] T018 [P] [US1] Create Chapter 5: AI/ML Integration in `docusaurus/docs/chapter-5-ai-ml-integration.md`
- [x] T019 [P] [US1] Create Chapter 6: Applications and Case Studies in `docusaurus/docs/chapter-6-applications-case-studies.md`
- [x] T020 [US1] Add chapter images/diagrams to `docusaurus/static/img/` directory
- [x] T021 [US1] Verify all chapters have proper front matter (sidebar_position, title, description)
- [x] T022 [US1] Ensure total word count ~9000 words (200 wpm × 45 min target)

**Checkpoint**: User Story 1 complete - 6 readable chapters with sequential navigation

---

## Phase 4: User Story 2 - Navigate Between Chapters Freely (Priority: P2)

**Goal**: Enable learners to jump to any chapter from sidebar or table of contents

**Independent Test**: Use navigation sidebar to jump between any two non-adjacent chapters and verify correct content loads

### Implementation for User Story 2

- [x] T023 [US2] Create homepage with table of contents in `docusaurus/src/pages/index.tsx`
- [x] T024 [P] [US2] Create ChapterNavigation component in `docusaurus/src/components/ChapterNavigation/index.tsx`
- [x] T025 [P] [US2] Create ChapterNavigation styles in `docusaurus/src/components/ChapterNavigation/styles.module.css`
- [x] T026 [US2] Update sidebar config in `docusaurus/sidebars.ts` to show chapter order and highlights
- [x] T027 [US2] Add mobile menu toggle styling in `docusaurus/src/css/custom.css` for sidebar accessibility
- [x] T028 [US2] Integrate ChapterNavigation at bottom of each chapter using Docusaurus MDX components

**Checkpoint**: User Story 2 complete - Full navigation between all chapters via sidebar and next/prev buttons

---

## Phase 5: User Story 3 - View Chapter Progress (Priority: P3)

**Goal**: Display reading progress indicator showing chapters completed and percentage

**Independent Test**: Read through 3 chapters and verify progress shows ~50% completion

### Implementation for User Story 3

- [x] T029 [US3] Create useProgress hook in `docusaurus/src/hooks/useProgress.ts` implementing UseProgressResult interface
- [x] T030 [US3] Implement localStorage read/write in useProgress with STORAGE_KEYS.PROGRESS key
- [x] T031 [P] [US3] Create ProgressTracker component in `docusaurus/src/components/ProgressTracker/index.tsx`
- [x] T032 [P] [US3] Create ProgressTracker styles in `docusaurus/src/components/ProgressTracker/styles.module.css`
- [x] T033 [P] [US3] Create CompletionBanner component in `docusaurus/src/components/CompletionBanner/index.tsx`
- [x] T034 [P] [US3] Create CompletionBanner styles in `docusaurus/src/components/CompletionBanner/styles.module.css`
- [x] T035 [US3] Create chapters config with metadata in `docusaurus/src/config/chapters.ts`
- [x] T036 [US3] Integrate ProgressTracker into homepage in `docusaurus/src/pages/index.tsx`
- [x] T037 [US3] Add progress tracking calls to chapter pages (mark visited on load)
- [x] T038 [US3] Display CompletionBanner when all chapters visited

**Checkpoint**: User Story 3 complete - Progress visible and persists across sessions

---

## Phase 6: User Story 4 - Access Textbook Offline (Priority: P3)

**Goal**: Enable previously viewed chapters to be available without network connection

**Independent Test**: View a chapter, disconnect network, navigate to same chapter and verify it renders

### Implementation for User Story 4

- [x] T039 [US4] Configure PWA plugin caching strategy in `docusaurus/docusaurus.config.ts` (staleWhileRevalidate for docs)
- [x] T040 [P] [US4] Create OfflineIndicator component in `docusaurus/src/components/OfflineIndicator/index.tsx`
- [x] T041 [P] [US4] Create OfflineIndicator styles in `docusaurus/src/components/OfflineIndicator/styles.module.css`
- [x] T042 [US4] Create offline fallback page in `docusaurus/src/pages/offline.tsx`
- [x] T043 [US4] Add navigator.onLine detection hook in `docusaurus/src/hooks/useOnlineStatus.ts`
- [x] T044 [US4] Integrate OfflineIndicator into layout showing network status
- [x] T045 [US4] Configure workbox precaching for static assets in PWA plugin config

**Checkpoint**: User Story 4 complete - Visited chapters accessible offline

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Performance optimization, accessibility, and deployment validation

- [x] T046 [P] Add ARIA labels and semantic HTML to all components for accessibility (FR-006)
- [x] T047 [P] Add loading="lazy" to all images for performance optimization
- [x] T048 [P] Add keyboard navigation support to ChapterNavigation component
- [x] T049 Run Lighthouse audit and fix issues to achieve score ≥90 (SC-005)
- [x] T050 Verify WCAG 2.1 Level AA contrast requirements (SC-006)
- [x] T051 Test on mobile viewport 320px minimum width (FR-005)
- [x] T052 Verify page load < 3 seconds on 3G simulation (SC-003)
- [x] T053 Run build and verify deployment to Vercel
- [x] T054 Validate quickstart.md instructions work correctly

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Story 1 (Phase 3)**: Depends on Foundational - Core content creation
- **User Story 2 (Phase 4)**: Depends on US1 (needs chapters to navigate)
- **User Story 3 (Phase 5)**: Can start after Foundational (parallel with US1/US2)
- **User Story 4 (Phase 6)**: Depends on Foundational (PWA config) - Can parallel with content
- **Polish (Phase 7)**: Depends on all user stories being complete

### User Story Dependencies

```
Phase 1: Setup
    ↓
Phase 2: Foundational (BLOCKS ALL)
    ↓
    ├── US1 (P1): Content Creation ──────────────┐
    │       ↓                                    │
    ├── US2 (P2): Navigation (needs US1 content) │
    │                                            │
    ├── US3 (P3): Progress Tracking ─────────────┼── Can parallel
    │                                            │
    └── US4 (P3): Offline Access ────────────────┘
                        ↓
                Phase 7: Polish
```

### Parallel Opportunities

**Phase 1 (Setup)**: T003, T004 can run in parallel

**Phase 2 (Foundational)**: T008, T009, T010 can run in parallel

**Phase 3 (US1)**: T013-T019 can ALL run in parallel (independent chapter files)

**Phase 4 (US2)**: T024, T025 can run in parallel

**Phase 5 (US3)**: T031-T034 can run in parallel (independent components)

**Phase 6 (US4)**: T040, T041 can run in parallel

**Phase 7 (Polish)**: T046, T047, T048 can run in parallel

---

## Parallel Example: User Story 1 Content Creation

```bash
# All chapter files can be created simultaneously (different files):
Task: T013 "Create introduction in docusaurus/docs/intro.md"
Task: T014 "Create Chapter 1 in docusaurus/docs/chapter-1-physical-ai-introduction.md"
Task: T015 "Create Chapter 2 in docusaurus/docs/chapter-2-humanoid-robotics-fundamentals.md"
Task: T016 "Create Chapter 3 in docusaurus/docs/chapter-3-sensors-perception.md"
Task: T017 "Create Chapter 4 in docusaurus/docs/chapter-4-actuators-movement.md"
Task: T018 "Create Chapter 5 in docusaurus/docs/chapter-5-ai-ml-integration.md"
Task: T019 "Create Chapter 6 in docusaurus/docs/chapter-6-applications-case-studies.md"
```

## Parallel Example: User Story 3 Components

```bash
# Components with no dependencies on each other:
Task: T031 "Create ProgressTracker in docusaurus/src/components/ProgressTracker/index.tsx"
Task: T032 "Create ProgressTracker styles in docusaurus/src/components/ProgressTracker/styles.module.css"
Task: T033 "Create CompletionBanner in docusaurus/src/components/CompletionBanner/index.tsx"
Task: T034 "Create CompletionBanner styles in docusaurus/src/components/CompletionBanner/styles.module.css"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1 (6 readable chapters)
4. **STOP and VALIDATE**: Test chapters render correctly on mobile and desktop
5. Deploy/demo if ready - basic textbook is functional

### Incremental Delivery

1. Setup + Foundational → Foundation ready
2. Add User Story 1 → 6 readable chapters → Deploy (MVP!)
3. Add User Story 2 → Navigation working → Deploy
4. Add User Story 3 → Progress tracking → Deploy
5. Add User Story 4 → Offline access → Deploy
6. Polish → Accessibility and performance verified → Final Deploy

### Content Creation Strategy

User Story 1 involves creating 6 chapters (~9000 words total, ~1500 words each). Options:

1. **Sequential**: Write chapters in order (slower but ensures continuity)
2. **Parallel**: Assign different chapters to different writers/sessions
3. **Hybrid**: Write intro + Ch1 first, then parallelize remaining

---

## Summary

| Metric | Count |
|--------|-------|
| **Total Tasks** | 54 |
| **Setup Tasks** | 6 |
| **Foundational Tasks** | 6 |
| **US1 Tasks (Content)** | 10 |
| **US2 Tasks (Navigation)** | 6 |
| **US3 Tasks (Progress)** | 10 |
| **US4 Tasks (Offline)** | 7 |
| **Polish Tasks** | 9 |
| **Parallel Opportunities** | 22 tasks marked [P] |

### MVP Scope

- **Phase 1 + 2 + 3 = MVP** (22 tasks)
- Delivers: 6 readable chapters with basic navigation
- Independent test: Full textbook readable from start to finish

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story is independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Content creation (US1) is the largest effort - consider parallelization
