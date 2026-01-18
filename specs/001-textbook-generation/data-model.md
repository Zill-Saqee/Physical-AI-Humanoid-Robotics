# Data Model: Interactive Textbook Generation

**Feature**: 001-textbook-generation
**Date**: 2026-01-17

## Overview

This feature is a static site with no backend database. Data models describe:
1. Content structure (Markdown front matter)
2. Client-side state (localStorage)
3. Component props (TypeScript interfaces)

## Entity: Chapter

Chapters are Markdown files with front matter metadata.

**Storage**: File system (`docs/*.md`)

**Attributes**:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| sidebar_position | number | Yes | Order in sidebar (1-8) |
| title | string | Yes | Chapter title for display |
| description | string | Yes | Brief summary for SEO/preview |
| slug | string | No | URL slug (defaults to filename) |
| keywords | string[] | No | SEO keywords |
| image | string | No | OG image for social sharing |

**Example**:
```yaml
---
sidebar_position: 1
title: "Introduction to Physical AI"
description: "Learn what Physical AI means and its role in modern robotics"
keywords: [physical ai, embodied ai, robotics]
---
```

**Validation Rules**:
- `sidebar_position` must be unique across chapters
- `title` max 60 characters (SEO best practice)
- `description` max 160 characters (SEO best practice)

## Entity: ReadingProgress

Client-side reading progress stored in localStorage.

**Storage**: Browser localStorage (`textbook-progress` key)

**Attributes**:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| chaptersVisited | string[] | Yes | Array of visited chapter slugs |
| lastVisited | string | No | Slug of most recently visited chapter |
| firstVisitedAt | string | No | ISO 8601 timestamp of first visit |
| completedAt | string | No | ISO 8601 timestamp when all chapters visited |

**TypeScript Interface**:
```typescript
interface ReadingProgress {
  chaptersVisited: string[];
  lastVisited?: string;
  firstVisitedAt?: string;
  completedAt?: string;
}
```

**Example**:
```json
{
  "chaptersVisited": ["intro", "chapter-1", "chapter-2"],
  "lastVisited": "chapter-2",
  "firstVisitedAt": "2026-01-17T10:30:00Z",
  "completedAt": null
}
```

**State Transitions**:
```
[No Progress] → [In Progress] → [Completed]
     |                |              |
     └── First visit  └── Visits     └── All chapters visited
                          chapters
```

**Validation Rules**:
- `chaptersVisited` must contain valid chapter slugs
- `completedAt` set only when all chapters in `chaptersVisited`

## Entity: ChapterMetadata (Runtime)

Computed metadata for progress display.

**Storage**: Runtime (computed from docs)

**Attributes**:

| Field | Type | Description |
|-------|------|-------------|
| slug | string | URL slug identifier |
| title | string | Display title |
| position | number | Order in sequence |
| wordCount | number | Approximate word count |
| readTimeMinutes | number | Estimated read time |

**TypeScript Interface**:
```typescript
interface ChapterMetadata {
  slug: string;
  title: string;
  position: number;
  wordCount: number;
  readTimeMinutes: number;
}
```

## Relationships

```
┌─────────────────┐
│    Chapter      │
│  (Markdown)     │
└────────┬────────┘
         │ has metadata
         ▼
┌─────────────────┐
│ ChapterMetadata │
│   (Runtime)     │
└────────┬────────┘
         │ tracked by
         ▼
┌─────────────────┐
│ ReadingProgress │
│ (localStorage)  │
└─────────────────┘
```

## No Backend Entities

This feature intentionally has no backend entities:
- No User entity (authentication is separate feature)
- No API resources (static site)
- No database tables (localStorage only)

This aligns with the Simplicity-First constitution principle.
