# Research: Interactive Textbook Generation

**Feature**: 001-textbook-generation
**Date**: 2026-01-17
**Status**: Complete

## Overview

This document captures technology decisions and best practices research for the Docusaurus-based interactive textbook.

## Decision 1: Static Site Generator

**Decision**: Use Docusaurus 3.x

**Rationale**:
- Required by constitution (Hard Constraint: "MUST use Docusaurus for textbook structure")
- Built on React 18, meets the constraint of no heavy frameworks beyond React
- Excellent documentation site features out of the box
- Built-in sidebar navigation, search, and responsive design
- Static output deploys easily to Vercel free tier
- Active maintenance by Meta

**Alternatives Considered**:
| Alternative | Why Rejected |
|-------------|--------------|
| Next.js | More complex, designed for full apps not documentation |
| VitePress | Vue-based, constitution specifies React/Docusaurus |
| GitBook | Proprietary, limited customization |
| Plain HTML | No sidebar, search, or responsive features built-in |

## Decision 2: Offline Support Strategy

**Decision**: Use Docusaurus PWA plugin with Workbox

**Rationale**:
- `@docusaurus/plugin-pwa` provides Service Worker caching out of the box
- Workbox handles cache strategies automatically
- Precaches static assets, caches docs on first visit
- Meets FR-007: "MUST cache visited chapters for offline access"
- No custom Service Worker code needed

**Alternatives Considered**:
| Alternative | Why Rejected |
|-------------|--------------|
| Custom Service Worker | More complexity, violates Simplicity-First |
| No offline support | Violates constitution and spec requirements |
| IndexedDB manual caching | Overkill for static content |

**Implementation Notes**:
- Use `cacheStrategy: 'staleWhileRevalidate'` for docs
- PWA manifest for "Add to Home Screen" on mobile
- Offline fallback page for unvisited chapters

## Decision 3: Progress Tracking

**Decision**: Browser localStorage with React hook

**Rationale**:
- No backend required (spec assumption: "Progress tracking uses browser local storage")
- Simple key-value storage: `{ "chapter-1": true, "chapter-2": true }`
- React hook (`useProgress`) encapsulates read/write logic
- Works offline
- Clears with browser data (expected behavior, no privacy concerns)

**Alternatives Considered**:
| Alternative | Why Rejected |
|-------------|--------------|
| Server-side storage | Requires backend, out of scope |
| IndexedDB | Overkill for simple boolean flags |
| Cookies | Size limits, not ideal for this use case |

**Data Structure**:
```typescript
interface ReadingProgress {
  chaptersVisited: string[];  // ['chapter-1', 'chapter-2', ...]
  lastVisited: string;        // 'chapter-3'
  completedAt?: string;       // ISO date when all chapters visited
}
```

## Decision 4: Mobile-First CSS Strategy

**Decision**: Use Docusaurus Infima CSS framework with custom overrides

**Rationale**:
- Docusaurus includes Infima, a mobile-first CSS framework
- Default theme is already responsive
- Custom overrides in `src/css/custom.css` for:
  - Touch target sizing (44x44px minimum)
  - Font sizing for mobile readability
  - Progress indicator styling
- Meets constitution principle V: Mobile-First Responsive Design

**Alternatives Considered**:
| Alternative | Why Rejected |
|-------------|--------------|
| Tailwind CSS | Additional dependency, not needed |
| Custom CSS framework | Reinventing the wheel |
| CSS-in-JS | Adds complexity, Infima sufficient |

## Decision 5: Chapter Content Format

**Decision**: Markdown with MDX support

**Rationale**:
- Docusaurus natively supports MDX (Markdown + JSX)
- Content authors can write in familiar Markdown
- Can embed React components (diagrams, interactive elements) if needed
- Front matter for metadata (title, sidebar position, read time)
- Easy to maintain and version control

**Chapter Front Matter Template**:
```markdown
---
sidebar_position: 1
title: "Introduction to Physical AI"
description: "Learn what Physical AI means and why it matters"
---

# Introduction to Physical AI

Content here...
```

## Decision 6: Performance Optimization

**Decision**: Docusaurus defaults + lazy loading images

**Rationale**:
- Docusaurus generates optimized static HTML
- Built-in code splitting per route
- Add `loading="lazy"` to images
- Preconnect to CDN origins
- Target: < 3 seconds on 3G (spec SC-003)

**Lighthouse Budget**:
| Metric | Target |
|--------|--------|
| First Contentful Paint | < 1.5s |
| Largest Contentful Paint | < 2.5s |
| Time to Interactive | < 3.0s |
| Cumulative Layout Shift | < 0.1 |

## Decision 7: Deployment

**Decision**: Vercel with automatic deployments from main branch

**Rationale**:
- Constitution requires Vercel free tier
- Zero-config deployment for Docusaurus
- Automatic HTTPS, CDN distribution
- Preview deployments for PRs
- 100GB bandwidth/month free (sufficient for educational site)

**Deployment Configuration**:
- Build command: `npm run build`
- Output directory: `build`
- Node.js version: 20.x

## Open Questions (Resolved)

All technical questions resolved. No NEEDS CLARIFICATION items remain.

## References

- [Docusaurus 3.x Documentation](https://docusaurus.io/docs)
- [Docusaurus PWA Plugin](https://docusaurus.io/docs/api/plugins/@docusaurus/plugin-pwa)
- [Infima CSS Framework](https://infima.dev/)
- [Vercel Docusaurus Deployment](https://vercel.com/guides/deploying-docusaurus-with-vercel)
