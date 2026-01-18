# Quickstart: RAG Chatbot

**Feature**: 002-rag-chatbot
**Date**: 2026-01-18

## Prerequisites

- Node.js 20 LTS or higher
- npm 10+ or yarn 4+
- Existing Docusaurus textbook from 001-textbook-generation
- Qdrant Cloud account (free tier)
- Groq API key (free tier)

## Initial Setup

### 1. Environment Variables

Create `.env.local` in the `docusaurus/` directory:

```bash
# Qdrant Cloud
QDRANT_URL=https://your-cluster.cloud.qdrant.io
QDRANT_API_KEY=your-qdrant-api-key

# Groq API
GROQ_API_KEY=your-groq-api-key

# Optional: Custom model
GROQ_MODEL=llama3-8b-8192
```

### 2. Install Dependencies

```bash
cd docusaurus

# Install chatbot dependencies
npm install @qdrant/js-client-rest groq-sdk uuid
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
npm run start
```

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
│   └── pages/
│       └── api/
│           └── chat.ts          # Serverless chat endpoint
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
4. **Free-Tier**: Stay within Qdrant and Groq free tier limits

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
1. Groq API key is valid
2. Qdrant cluster is active (not suspended)
3. Network connectivity

```bash
# Test Qdrant connection
curl -H "api-key: $QDRANT_API_KEY" \
  "$QDRANT_URL/collections/textbook_chunks"
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

Groq free tier has rate limits:
1. Wait 60 seconds
2. Reduce request frequency
3. Consider response caching for common questions

## Useful Commands

| Command | Description |
|---------|-------------|
| `npm run start` | Start dev server |
| `npm run chatbot:index` | Index textbook content |
| `npm run build` | Production build |
| `npm run typecheck` | TypeScript type checking |

## Next Steps

After completing this quickstart:

1. Run `/sp.tasks` to generate implementation tasks
2. Start with Phase 1 (Setup) tasks
3. Test each user story independently
