# Quickstart: RAG Chatbot

**Feature**: 002-rag-chatbot
**Date**: 2026-01-18

## Prerequisites

- Node.js 20 LTS or higher
- npm 10+ or yarn 4+
- Existing Docusaurus textbook from 001-textbook-generation
- Qdrant Cloud account (free tier)
- OpenAI API key

## Initial Setup

### 1. Environment Variables

Create `.env.local` in the `docusaurus/` directory:

```bash
# Qdrant Cloud
QDRANT_URL=https://your-cluster.cloud.qdrant.io
QDRANT_API_KEY=your-qdrant-api-key

# OpenAI API
OPENAI_API_KEY=your-openai-api-key

# Optional: Custom model (defaults to gpt-4o-mini)
OPENAI_MODEL=gpt-4o-mini

# Optional: Neon PostgreSQL for conversation persistence
DATABASE_URL=postgres://...
```

### 2. Install Dependencies

```bash
cd docusaurus

# Install all dependencies (chatbot deps already in package.json)
npm install
```

### 3. Generate Embeddings

Run the embedding script to index textbook content:

```bash
npm run chatbot:index
```

This script:
- Reads all chapter markdown files
- Chunks content at section boundaries
- Generates MiniLM embeddings
- Uploads to Qdrant Cloud

### 4. Start Development Server

```bash
# Run both Docusaurus and API server concurrently
npm run dev
```

This starts:
- Docusaurus at `http://localhost:3000`
- Chat API server at `http://localhost:3001`

Open `http://localhost:3000` and click the chat button in the bottom-right corner.

## Project Structure

```
docusaurus/
├── src/
│   ├── components/
│   │   └── ChatWidget/           # Chat UI components
│   │       ├── index.tsx         # Main widget
│   │       ├── ChatButton.tsx    # Floating button
│   │       ├── ChatPanel.tsx     # Conversation panel
│   │       ├── MessageBubble.tsx # Message display
│   │       ├── ChatInput.tsx     # Text input
│   │       ├── SourceList.tsx    # Source references
│   │       └── styles.module.css # Component styles
│   ├── hooks/
│   │   ├── useChat.ts           # Chat state management
│   │   └── useChatWidget.ts     # Widget open/close state
│   ├── theme/
│   │   └── Root/index.tsx       # Widget injection point
│   └── types/
│       └── chat.ts              # TypeScript interfaces
├── server/
│   └── api.ts                   # Express API server
├── lib/
│   ├── chat-service.ts          # RAG orchestration
│   ├── embeddings.ts            # MiniLM embedding generation
│   ├── qdrant.ts                # Qdrant client wrapper
│   └── chunker.ts               # Content chunking
├── scripts/
│   └── index-content.ts         # Embedding generation script
└── .env.local                   # Environment variables
```

## Common Tasks

### Test the Chatbot

1. Open any chapter page
2. Click the chat button (bottom-right)
3. Ask: "What is Physical AI?"
4. Verify:
   - Response appears within 5 seconds
   - Sources are displayed with chapter references
   - Clicking a source navigates to that section

### Add New Content

When adding or modifying chapters:

```bash
# Re-index content after changes
npm run chatbot:index

# Verify in Qdrant dashboard
# Check collection: textbook_chunks
```

### Debug Retrieval

To see which chunks are retrieved for a query:

```bash
# In development, enable debug mode
CHATBOT_DEBUG=true npm run start
```

Debug mode logs:
- Query embedding time
- Retrieved chunks with scores
- Prompt sent to LLM

### Test Error Handling

Simulate offline mode in Chrome DevTools:
1. Open DevTools → Network → Offline
2. Send a chat message
3. Verify error message appears with retry option

## Development Guidelines

### Follow Constitution Principles

1. **Simplicity-First**: Keep components minimal and focused
2. **Mobile-First**: Test on mobile viewport first
3. **RAG-Grounded**: Never generate responses without source context
4. **Cost-Aware**: Monitor OpenAI API usage

### Code Style

- TypeScript strict mode
- Components use PascalCase
- Hooks use camelCase with `use` prefix
- API routes in `pages/api/`

### Testing Checklist

Before PR:
- [ ] Chat opens and closes correctly
- [ ] Messages send and display
- [ ] Sources are clickable and navigate correctly
- [ ] Error states show appropriate messages
- [ ] Works on mobile (320px viewport)
- [ ] Response time < 5 seconds

## Troubleshooting

### "No response from server"

Check:
1. OpenAI API key is valid
2. Qdrant cluster is active (not suspended)
3. API server is running on port 3001
4. Network connectivity

```bash
# Test API health endpoint
curl http://localhost:3001/api/health

# Test Qdrant connection
curl -H "api-key: $QDRANT_API_KEY" \
  "$QDRANT_URL/collections/textbook"
```

### "No relevant sources found"

The query might not match indexed content. Try:
1. Re-run indexing: `npm run chatbot:index`
2. Check chunk count in Qdrant dashboard
3. Adjust similarity threshold in API

### Qdrant cluster suspended

Free tier clusters suspend after 1 week of inactivity:
1. Log into Qdrant Cloud
2. Reactivate cluster
3. Re-run indexing if needed

### Rate limit errors

OpenAI has rate limits:
1. Wait 60 seconds
2. Reduce request frequency
3. Consider response caching for common questions
4. Check your API usage limits at platform.openai.com

## Useful Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Docusaurus + API server |
| `npm run start` | Start Docusaurus only |
| `npm run api` | Start API server only |
| `npm run chatbot:index` | Index textbook content |
| `npm run build` | Production build |
| `npm run typecheck` | TypeScript type checking |

## Next Steps

After completing this quickstart:

1. Run `/sp.tasks` to generate implementation tasks
2. Start with Phase 1 (Setup) tasks
3. Test each user story independently
