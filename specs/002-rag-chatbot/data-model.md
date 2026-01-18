# Data Model: RAG Chatbot

**Feature**: 002-rag-chatbot
**Date**: 2026-01-18
**Source**: spec.md Key Entities + research.md decisions

## Entities

### 1. TextChunk

Represents a segment of textbook content indexed for retrieval.

| Field | Type | Description | Constraints |
|-------|------|-------------|-------------|
| id | string | Unique chunk identifier | Format: `ch{N}_sec{N}_{index}` |
| chapterNumber | number | Chapter number (1-6) | 1-6 |
| chapterTitle | string | Chapter title | Non-empty |
| sectionId | string | Section identifier | Format: `{chapter}.{section}` |
| sectionTitle | string | Section heading | Non-empty |
| content | string | Chunk text content | 50-500 tokens |
| position | number | Order within chapter | >= 0 |
| tokenCount | number | Token count | 50-500 |
| embedding | number[] | Vector embedding | 384 dimensions (MiniLM) |

**Relationships**:
- Belongs to one Chapter
- Referenced by SourceReference

**Storage**: Qdrant Cloud vector database

---

### 2. Message

Represents a single message in the conversation (user or assistant).

| Field | Type | Description | Constraints |
|-------|------|-------------|-------------|
| id | string | Unique message ID | UUID v4 |
| role | enum | Message author | "user" \| "assistant" |
| content | string | Message text | Non-empty, max 4000 chars |
| timestamp | string | ISO 8601 timestamp | Auto-generated |
| sources | SourceReference[] | Citations (assistant only) | Optional, 0-5 items |

**Relationships**:
- Part of Conversation
- Assistant messages may have SourceReferences

**Storage**: Browser sessionStorage (ephemeral)

---

### 3. SourceReference

Links a response to the textbook content that informed it.

| Field | Type | Description | Constraints |
|-------|------|-------------|-------------|
| chunkId | string | Referenced chunk ID | Valid TextChunk.id |
| chapterNumber | number | Chapter number | 1-6 |
| sectionTitle | string | Section name | Non-empty |
| url | string | Link to section | Valid internal URL |
| relevanceScore | number | Retrieval similarity | 0.0-1.0 |

**Relationships**:
- References one TextChunk
- Attached to Message

**Storage**: Embedded in Message

---

### 4. Conversation

Collection of messages in a single session.

| Field | Type | Description | Constraints |
|-------|------|-------------|-------------|
| id | string | Session identifier | UUID v4 |
| messages | Message[] | Ordered message list | Max 50 messages |
| createdAt | string | Session start time | ISO 8601 |
| lastActivityAt | string | Last message time | ISO 8601 |

**Relationships**:
- Contains many Messages

**Storage**: Browser sessionStorage

---

### 5. ChatRequest

API request payload for chat endpoint.

| Field | Type | Description | Constraints |
|-------|------|-------------|-------------|
| query | string | User's question | 1-1000 chars |
| conversationHistory | Message[] | Previous messages | Max 10 for context |

**Validation**:
- Query must be non-empty after trimming
- Query must be <= 1000 characters
- ConversationHistory is optional

---

### 6. ChatResponse (Streaming)

Server-sent events for streaming response.

| Event Type | Payload | Description |
|------------|---------|-------------|
| token | `{ content: string }` | Partial response text |
| sources | `{ citations: SourceReference[] }` | Source attributions |
| done | `{}` | Stream complete |
| error | `{ message: string, code: string }` | Error occurred |

---

## State Transitions

### Conversation Lifecycle

```
[Empty] → [Active] → [Idle] → [Expired]
   |          |          |
   |          v          v
   +------→ [Active] ←--+
```

| State | Trigger | Behavior |
|-------|---------|----------|
| Empty | Widget opened, no messages | Show welcome message |
| Active | User sends message | Process and respond |
| Idle | No activity for 5 min | Still accessible |
| Expired | Page refresh/close | Session cleared |

### Message Processing States

```
[Pending] → [Processing] → [Streaming] → [Complete]
                |               |
                v               v
            [Error] ←----------+
```

| State | UI Indicator |
|-------|--------------|
| Pending | Message in queue |
| Processing | "Thinking..." indicator |
| Streaming | Tokens appearing progressively |
| Complete | Full response with sources |
| Error | Error message with retry option |

---

## Validation Rules

### User Input Validation

| Rule | Constraint | Error Message |
|------|------------|---------------|
| Non-empty query | `query.trim().length > 0` | "Please enter a question" |
| Max length | `query.length <= 1000` | "Question is too long (max 1000 characters)" |
| Rate limit | Max 1 request per 2 seconds | "Please wait before sending another question" |

### Response Validation

| Rule | Constraint | Fallback |
|------|------------|----------|
| Has content | `content.length > 0` | "I couldn't generate a response. Please try again." |
| Valid sources | Each source has valid chunkId | Filter invalid sources |
| Timeout | Response within 5 seconds | "Response is taking longer than expected..." |

---

## Index Strategy (Qdrant)

### Collection: `textbook_chunks`

```json
{
  "name": "textbook_chunks",
  "vectors": {
    "size": 384,
    "distance": "Cosine"
  },
  "payload_schema": {
    "id": "keyword",
    "chapterNumber": "integer",
    "chapterTitle": "keyword",
    "sectionId": "keyword",
    "sectionTitle": "keyword",
    "content": "text",
    "position": "integer",
    "tokenCount": "integer"
  }
}
```

### Query Parameters

| Parameter | Value | Rationale |
|-----------|-------|-----------|
| Top K | 3 | Balance relevance vs. context window |
| Score threshold | 0.5 | Filter low-relevance chunks |
| With payload | true | Need metadata for citations |
