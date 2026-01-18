# Implementation Plan: Interactive Textbook Generation

**Branch**: `001-textbook-generation` | **Date**: 2026-01-17 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-textbook-generation/spec.md`

## Summary

Build a Docusaurus-based interactive textbook with 6-8 chapters covering Physical AI and Humanoid Robotics. The textbook must be mobile-first, load in under 3 seconds on 3G, support offline reading for visited chapters, and track reading progress via local storage. No backend required for this feature.

## Technical Context

**Language/Version**: TypeScript 5.x, Node.js 20 LTS
**Primary Dependencies**: Docusaurus 3.x (React 18), @docusaurus/preset-classic
**Storage**: Browser localStorage (reading progress), Service Worker cache (offline)
**Testing**: Jest + React Testing Library, Lighthouse CI
**Target Platform**: Web browsers (Chrome, Firefox, Safari, Edge - last 2 versions)
**Project Type**: Static site (frontend only)
**Performance Goals**: < 3 seconds initial load on 3G, < 1 second navigation between chapters
**Constraints**: Vercel free tier (100GB bandwidth/month), < 45 min total reading time
**Scale/Scope**: 6-8 chapters, ~9000 words total (200 wpm × 45 min), single static deployment

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Gate | Status |
|-----------|------|--------|
| I. Simplicity-First | Docusaurus default setup, minimal custom code | ✅ PASS |
| II. Feature-Based Architecture | N/A for static content (no backend) | ✅ PASS |
| III. RAG-Grounded Responses | Out of scope for this feature | ✅ N/A |
| IV. Free-Tier Infrastructure | Vercel free tier for static hosting | ✅ PASS |
| V. Mobile-First Responsive | Docusaurus default theme is responsive | ✅ PASS |
| VI. Personalization with Privacy | Local storage only, no tracking | ✅ PASS |

**Hard Constraints Check**:
- [x] MUST use Docusaurus for textbook structure
- [x] MUST deploy within free-tier limits (Vercel static hosting)
- [x] MUST support offline reading for cached chapters (Service Worker)
- [x] MUST NOT include complex robotics code (education content only)
- [x] MUST NOT use heavy JavaScript frameworks beyond React (Docusaurus default)

## Project Structure

### Documentation (this feature)

```text
specs/001-textbook-generation/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output (minimal for static site)
└── tasks.md             # Phase 2 output (/sp.tasks command)
```

### Source Code (repository root)

```text
# Docusaurus static site structure
docusaurus/
├── docusaurus.config.ts     # Site configuration
├── sidebars.ts              # Navigation sidebar config
├── package.json             # Dependencies
├── src/
│   ├── components/
│   │   ├── ProgressTracker/ # Reading progress component
│   │   └── OfflineIndicator/ # Offline status component
│   ├── css/
│   │   └── custom.css       # Mobile-first styles
│   ├── pages/
│   │   └── index.tsx        # Homepage with ToC
│   └── hooks/
│       └── useProgress.ts   # Local storage progress hook
├── docs/
│   ├── intro.md             # Introduction/overview
│   ├── chapter-1-physical-ai-introduction.md
│   ├── chapter-2-humanoid-robotics-fundamentals.md
│   ├── chapter-3-sensors-perception.md
│   ├── chapter-4-actuators-movement.md
│   ├── chapter-5-ai-ml-integration.md
│   └── chapter-6-applications-case-studies.md
├── static/
│   ├── img/                 # Chapter images and diagrams
│   └── manifest.json        # PWA manifest for offline
└── build/                   # Generated static files (gitignored)

tests/
├── e2e/
│   └── navigation.spec.ts   # Playwright navigation tests
└── unit/
    └── useProgress.test.ts  # Progress hook tests
```

**Structure Decision**: Single Docusaurus project at `/docusaurus/` with feature components in `/src/components/`. This aligns with Simplicity-First principle - no separate backend, no complex build pipeline.

## Complexity Tracking

> No violations. Design uses Docusaurus defaults with minimal customization.

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| None | N/A | N/A |
