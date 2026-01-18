# Quickstart: Interactive Textbook Generation

**Feature**: 001-textbook-generation
**Date**: 2026-01-17

## Prerequisites

- Node.js 20 LTS or higher
- npm 10+ or yarn 4+
- Git

## Initial Setup

### 1. Clone and Install

```bash
# Navigate to project root
cd physical-ai-and-robotics-web-based-book

# Install dependencies
cd docusaurus
npm install
```

### 2. Start Development Server

```bash
npm run start
```

This starts the development server at `http://localhost:3000`.

### 3. Verify Setup

Open `http://localhost:3000` in your browser. You should see:
- Homepage with table of contents
- Sidebar navigation
- Chapter 1 accessible via sidebar

## Project Structure

```
docusaurus/
├── docs/                    # Chapter content (Markdown)
├── src/
│   ├── components/          # React components
│   ├── css/custom.css       # Custom styles
│   ├── hooks/               # React hooks (useProgress)
│   └── pages/index.tsx      # Homepage
├── static/                  # Static assets
├── docusaurus.config.ts     # Site configuration
└── sidebars.ts              # Navigation configuration
```

## Common Tasks

### Add a New Chapter

1. Create file in `docs/` directory:
   ```bash
   touch docs/chapter-7-future-directions.md
   ```

2. Add front matter:
   ```markdown
   ---
   sidebar_position: 7
   title: "Future Directions"
   description: "Exploring the future of Physical AI and robotics"
   ---

   # Future Directions

   Content here...
   ```

3. Chapter appears automatically in sidebar (hot reload).

### Modify Progress Tracking

Edit `src/hooks/useProgress.ts`:
```typescript
// Mark chapter as visited
const { markVisited } = useProgress();
markVisited('chapter-1');

// Check completion
const { isComplete, getPercentComplete } = useProgress();
console.log(`${getPercentComplete()}% complete`);
```

### Test Offline Mode

1. Build production version:
   ```bash
   npm run build
   npm run serve
   ```

2. Open Chrome DevTools → Application → Service Workers
3. Check "Offline" checkbox
4. Navigate to a previously visited chapter (should load from cache)

### Run Tests

```bash
# Unit tests
npm run test

# E2E tests (requires build)
npm run build
npm run test:e2e

# Lighthouse audit
npm run lighthouse
```

## Development Guidelines

### Follow Constitution Principles

1. **Simplicity-First**: No unnecessary dependencies or complexity
2. **Mobile-First**: Test on mobile viewport first
3. **Performance**: Run Lighthouse before PR

### Code Style

- TypeScript strict mode enabled
- ESLint + Prettier for formatting
- Component files use PascalCase
- Hook files use camelCase with `use` prefix

### Commit Messages

```
feat(textbook): add chapter 3 content
fix(progress): correct percentage calculation
style(mobile): improve touch target sizes
```

## Deployment

### Preview (PR)

Automatic preview deployment on Vercel for each PR.

### Production

Merge to `main` triggers automatic deployment to:
- URL: (configured in Vercel)
- Build: `npm run build`
- Output: `build/`

## Troubleshooting

### Port 3000 in use

```bash
npm run start -- --port 3001
```

### Cache issues

```bash
npm run clear
npm run start
```

### Build fails

```bash
# Check for TypeScript errors
npm run typecheck

# Check for broken links
npm run build -- --strict
```

## Useful Commands

| Command | Description |
|---------|-------------|
| `npm run start` | Start dev server |
| `npm run build` | Production build |
| `npm run serve` | Serve production build locally |
| `npm run clear` | Clear Docusaurus cache |
| `npm run typecheck` | TypeScript type checking |
| `npm run lint` | ESLint check |
| `npm run format` | Prettier formatting |

## Next Steps

After completing this quickstart:

1. Run `/sp.tasks` to generate implementation tasks
2. Start with Phase 1 (Setup) tasks
3. Write chapter content in parallel with component development
