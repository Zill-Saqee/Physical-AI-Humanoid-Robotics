<!--
Sync Impact Report
==================
Version change: 0.0.0 → 1.0.0 (MAJOR - initial constitution)
Modified principles: N/A (initial creation)
Added sections:
  - Core Principles (6 principles)
  - Success Criteria & Constraints
  - Development Workflow
  - Governance
Removed sections: N/A (initial creation)
Templates requiring updates:
  - .specify/templates/plan-template.md → ✅ compatible (Constitution Check section exists)
  - .specify/templates/spec-template.md → ✅ compatible (requirements structure aligns)
  - .specify/templates/tasks-template.md → ✅ compatible (phase structure supports principles)
Follow-up TODOs: None
-->

# Physical AI & Humanoid Robotics Textbook Constitution

## Core Principles

### I. Simplicity-First

The textbook and all supporting systems MUST prioritize simplicity over feature richness.
- Frontend code MUST be minimal, readable, and maintainable by a single developer
- No dependencies unless absolutely necessary for core functionality
- Total reading time MUST remain under 45 minutes
- Each chapter MUST be short and focused on a single concept
- UI animations MUST be minimal and serve a clear UX purpose (no decorative motion)

**Rationale**: Users on low-end devices (phones) need fast loading and smooth reading.
Complexity introduces bugs, slows development, and degrades user experience.

### II. Feature-Based Architecture

All code MUST follow a feature-based folder structure, not tech-based organization.
- Each feature folder contains its own controller, service, and model files
- Features are self-contained and independently testable
- No shared "models/" or "controllers/" directories at root level
- Backend features: `auth/`, `chatbot/`, `personalization/`, `translation/`, `content/`
- Frontend components organized by page/feature, not by component type

**Rationale**: Feature-based structure improves maintainability, enables parallel development,
and makes the codebase navigable by feature name rather than implementation detail.

### III. RAG-Grounded Responses

The chatbot MUST answer questions ONLY from textbook content, never from general knowledge.
- All responses MUST cite specific chapter/section sources
- Responses MUST include confidence indicators when context is limited
- System MUST gracefully handle questions outside textbook scope
- Vector embeddings use MiniLM for efficiency on free-tier infrastructure
- Chunking strategy MUST preserve semantic coherence of educational content

**Rationale**: Educational integrity requires verifiable, traceable answers. Students must
trust that chatbot responses come from course material, not hallucinated content.

### IV. Free-Tier Infrastructure

All infrastructure MUST work within free-tier limits of chosen services.
- Qdrant Cloud free tier for vector storage
- Neon free tier for PostgreSQL database
- Vercel free tier for frontend deployment
- Railway free tier for backend deployment
- Token usage MUST be optimized to stay within limits

**Rationale**: The project must be sustainable without ongoing costs and reproducible
by students or educators who want to fork and adapt the content.

### V. Mobile-First Responsive Design

All UI MUST be designed mobile-first with progressive enhancement for larger screens.
- Primary target: smartphone users reading on commute/breaks
- Touch targets MUST be appropriately sized (minimum 44x44px)
- Text MUST be readable without zooming on mobile viewports
- Interactive elements MUST have appropriate spacing for touch
- No horizontal scrolling on any supported viewport

**Rationale**: The majority of learners will access content on mobile devices.
A mobile-first approach ensures the core experience works everywhere.

### VI. Personalization with Privacy

User personalization MUST enhance learning without compromising privacy.
- Background information collected at signup: technical level, learning goals, language preference
- Personalization adapts content complexity, not content itself
- No tracking beyond what's needed for personalization
- Users can view and delete their data at any time
- Authentication via Better-Auth with secure session management

**Rationale**: Personalization improves learning outcomes, but users must trust
the platform with their data. Transparency and control build that trust.

## Success Criteria & Constraints

### Measurable Success Criteria

| Criterion | Target | Measurement Method |
|-----------|--------|-------------------|
| Page load time | < 3 seconds on 3G | Lighthouse mobile audit |
| RAG accuracy | > 85% relevant answers | Manual evaluation on test set |
| Reading time | < 45 minutes total | Word count / average reading speed |
| Mobile usability | Score > 90 | Lighthouse mobile audit |
| Translation quality | Readable Urdu | Native speaker review |
| Demo deployment | < 90 seconds | Timed recording |

### Hard Constraints

- MUST use Docusaurus for textbook structure
- MUST deploy within free-tier limits (no paid services)
- MUST support offline reading for cached chapters
- MUST NOT include complex robotics code (education only)
- MUST NOT use heavy JavaScript frameworks beyond React (Docusaurus default)

### Non-Goals (Explicitly Out of Scope)

- Real-time collaboration features
- User-generated content or comments
- Complex quizzes with grading systems
- Video content integration
- Social features or user profiles beyond personalization

## Development Workflow

### Code Quality Gates

1. **Before Implementation**: Spec and plan must exist and be approved
2. **During Implementation**: Feature-based structure enforced, no cross-feature imports without explicit dependency declaration
3. **Before Merge**: All acceptance criteria from spec must be verifiable
4. **Before Deploy**: Manual smoke test on mobile viewport

### Testing Requirements

- Unit tests for service layer logic
- Integration tests for API endpoints
- Contract tests for RAG responses (sample questions with expected source citations)
- Manual testing on actual mobile device before release

### Commit Standards

- Commits reference task IDs from tasks.md
- Commit messages describe the "what" and "why"
- No commits with failing tests to main branch

## Governance

This constitution is the authoritative source for project decisions. All implementation
choices, architectural decisions, and feature prioritization MUST align with these principles.

### Amendment Process

1. Propose amendment with rationale in an ADR (Architecture Decision Record)
2. Document impact on existing code and migration path
3. Update constitution version following semantic versioning:
   - MAJOR: Principle removal or fundamental redefinition
   - MINOR: New principle or significant expansion
   - PATCH: Clarification or wording improvement
4. Update dependent artifacts (spec, plan, tasks templates if affected)

### Compliance Review

- PRs MUST self-certify alignment with constitution principles
- Complexity additions MUST be justified against Simplicity-First principle
- Infrastructure changes MUST verify free-tier compatibility

### Escalation

When principles conflict (e.g., simplicity vs. feature request), priority order:
1. Simplicity-First
2. Mobile-First Responsive Design
3. Free-Tier Infrastructure
4. Feature-Based Architecture
5. RAG-Grounded Responses
6. Personalization with Privacy

**Version**: 1.0.0 | **Ratified**: 2026-01-17 | **Last Amended**: 2026-01-17
