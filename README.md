# Physical AI & Humanoid Robotics Textbook

An interactive, AI-powered textbook on Physical AI and Humanoid Robotics with a RAG-based chatbot for intelligent Q&A.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Zill-Saqee/Physical-AI-Humanoid-Robotics)

## Features

- **Interactive Textbook**: 6 chapters covering Physical AI fundamentals, humanoid robotics, sensors, actuators, AI/ML integration, and real-world applications
- **RAG Chatbot**: AI-powered Q&A that answers questions strictly from textbook content with source citations
- **Text Selection Q&A**: Select any text in the textbook and ask questions about it
- **Mobile-First Design**: Optimized for reading on smartphones and tablets
- **Offline Support**: PWA with service worker caching for offline reading
- **Dark Mode**: Automatic theme switching based on system preference

## Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| [Docusaurus 3.x](https://docusaurus.io/) | Static site generator for documentation |
| [React 19](https://react.dev/) | UI component library |
| [TypeScript 5.x](https://www.typescriptlang.org/) | Type-safe JavaScript |
| [CSS Modules](https://github.com/css-modules/css-modules) | Scoped component styling |

### Backend / AI
| Technology | Purpose |
|------------|---------|
| [OpenAI API](https://openai.com/) | GPT-4o-mini for chat, text-embedding-3-small for vectors |
| [Qdrant Cloud](https://qdrant.tech/) | Vector database for semantic search |
| [Neon PostgreSQL](https://neon.tech/) | Serverless Postgres for conversation history |
| [Vercel Serverless](https://vercel.com/) | API hosting with SSE streaming |

### Development Tools
| Tool | Purpose |
|------|---------|
| [Claude Code](https://claude.ai/claude-code) | AI-powered development assistant |
| [SpecKit Plus](https://github.com/SpecKit/speckit-plus) | Spec-Driven Development framework |
| [GitHub Actions](https://github.com/features/actions) | CI/CD pipeline |

## Spec-Driven Development (SDD)

This project follows **Spec-Driven Development** using SpecKit Plus. SDD ensures all code is traceable to specifications and architectural decisions are documented.

### SDD Workflow

```
1. /sp.specify     → Create feature specification (spec.md)
2. /sp.plan        → Design architecture and implementation plan (plan.md)
3. /sp.tasks       → Generate actionable, testable tasks (tasks.md)
4. /sp.implement   → Execute tasks with AI assistance
5. /sp.adr         → Document architectural decisions (ADRs)
```

### Key Artifacts

| Artifact | Location | Purpose |
|----------|----------|---------|
| Constitution | `.specify/memory/constitution.md` | Project principles and constraints |
| Specs | `specs/<feature>/spec.md` | Feature requirements |
| Plans | `specs/<feature>/plan.md` | Architecture decisions |
| Tasks | `specs/<feature>/tasks.md` | Implementation checklist |
| ADRs | `history/adr/` | Architectural Decision Records |
| PHRs | `history/prompts/` | Prompt History Records |

### Core Principles (from Constitution)

1. **Simplicity-First**: Minimal dependencies, readable code
2. **Feature-Based Architecture**: Self-contained feature folders
3. **RAG-Grounded Responses**: Answers only from textbook content
4. **Free-Tier Infrastructure**: No paid services required
5. **Mobile-First Design**: Optimized for smartphones
6. **Personalization with Privacy**: User control over data

## Project Structure

```
.
├── api/                    # Vercel serverless functions
│   └── chat.ts             # Chat API with SSE streaming
├── frontend/               # Docusaurus application
│   ├── docs/               # Textbook chapters (Markdown)
│   ├── lib/                # Backend services
│   │   ├── chat-service.ts # RAG pipeline orchestration
│   │   ├── chunker.ts      # Content chunking for vectors
│   │   ├── db.ts           # Neon PostgreSQL client
│   │   ├── embeddings.ts   # OpenAI embeddings
│   │   └── qdrant.ts       # Vector search client
│   ├── scripts/            # Build and indexing scripts
│   ├── server/             # Local development API
│   └── src/
│       ├── components/     # React components
│       │   └── ChatWidget/ # Chat UI components
│       ├── css/            # Global styles
│       ├── hooks/          # React hooks
│       └── types/          # TypeScript definitions
├── specs/                  # Feature specifications
│   ├── 001-textbook-generation/
│   └── 002-rag-chatbot/
├── history/                # Development history
│   ├── adr/                # Architecture Decision Records
│   └── prompts/            # Prompt History Records
├── .specify/               # SpecKit Plus templates
└── vercel.json             # Vercel deployment config
```

## Setup

### Prerequisites

- Node.js 20+
- npm or yarn
- OpenAI API key
- Qdrant Cloud account (free tier)
- Neon PostgreSQL account (free tier)

### Environment Variables

Create `frontend/.env`:

```env
# OpenAI
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4o-mini

# Qdrant Cloud
QDRANT_URL=https://xxx.qdrant.tech
QDRANT_API_KEY=...

# Neon PostgreSQL
DATABASE_URL=postgresql://...
```

### Installation

```bash
# Clone the repository
git clone https://github.com/Zill-Saqee/Physical-AI-Humanoid-Robotics.git
cd Physical-AI-Humanoid-Robotics

# Install dependencies
cd frontend
npm install

# Initialize database
npm run db:init

# Index textbook content into Qdrant
npm run chatbot:index

# Start development servers
npm run dev
```

This starts:
- Docusaurus at `http://localhost:3000`
- API server at `http://localhost:3001`

### Build for Production

```bash
cd frontend
npm run build
npm run serve
```

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project in Vercel
3. Set environment variables in Vercel dashboard
4. Deploy

The project auto-deploys on push to `main` via GitHub Actions.

### Manual Deployment

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

## API Reference

### POST /api/chat

Chat with the AI assistant about textbook content.

**Request:**
```json
{
  "message": "What is Physical AI?",
  "conversationId": "optional-uuid",
  "selectedText": "optional context from textbook"
}
```

**Response:** Server-Sent Events (SSE) stream

```
data: {"type":"chunk","content":"Physical AI refers to..."}
data: {"type":"sources","sources":[{"chapterNumber":1,"sectionTitle":"Introduction"}]}
data: {"type":"done","conversationId":"uuid"}
```

## Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start frontend + API servers |
| `npm run build` | Build for production |
| `npm run chatbot:index` | Index textbook into Qdrant |
| `npm run db:init` | Initialize PostgreSQL tables |
| `npm run typecheck` | Run TypeScript compiler |
| `npm run lint` | Run ESLint |

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Follow SDD workflow:
   - Create spec with `/sp.specify`
   - Plan with `/sp.plan`
   - Generate tasks with `/sp.tasks`
4. Commit changes (`git commit -m 'feat: add amazing feature'`)
5. Push to branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

## License

MIT License - see [LICENSE](LICENSE) for details.

## Author

**Zill-Saqee**
- GitHub: [@Zill-Saqee](https://github.com/Zill-Saqee)
- LinkedIn: [zill-saqee](https://www.linkedin.com/in/zill-saqee)

---

Built with [Docusaurus](https://docusaurus.io/) and [Claude Code](https://claude.ai/claude-code)
