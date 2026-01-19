/**
 * Chat Service
 * Feature: 002-rag-chatbot
 *
 * Orchestrates the RAG pipeline: embedding, retrieval, and generation.
 * Uses OpenAI for LLM responses and Neon Postgres for persistence.
 */

import OpenAI from 'openai';
import { generateEmbedding } from './embeddings';
import {
  searchSimilarChunks,
  toSourceReferences,
  SIMILARITY_THRESHOLD,
} from './qdrant';
import { saveMessage } from './db';
import type {
  Message,
  SourceReference,
  TextChunk,
  ChatRequest,
} from '../src/types/chat';

// Configuration
const OPENAI_MODEL = process.env.OPENAI_MODEL || 'gpt-4o-mini';

// Lazy-initialized OpenAI client
let openaiClient: OpenAI | null = null;

/**
 * Get or create OpenAI client
 */
function getOpenAIClient(): OpenAI {
  if (!openaiClient) {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error('OPENAI_API_KEY environment variable is required');
    }
    openaiClient = new OpenAI({ apiKey });
  }
  return openaiClient;
}

/**
 * Build system prompt with context chunks and optional selected text
 */
function buildSystemPrompt(
  chunks: Array<TextChunk & { score: number }>,
  selectedText?: string
): string {
  // Handle selected text context
  if (selectedText && selectedText.trim()) {
    const contextText = chunks.length > 0
      ? chunks
          .map(
            (chunk) =>
              `[Source: Chapter ${chunk.chapterNumber} - ${chunk.sectionTitle}]\n${chunk.content}`
          )
          .join('\n\n---\n\n')
      : '';

    return `You are a helpful assistant for the Physical AI & Humanoid Robotics textbook.
The user has selected the following text from the textbook and wants to ask about it:

SELECTED TEXT:
"${selectedText}"

${contextText ? `ADDITIONAL CONTEXT:\n${contextText}\n\n` : ''}INSTRUCTIONS:
1. Answer questions specifically about the selected text
2. Provide explanations, clarifications, or deeper insights
3. If the question relates to concepts in the selected text, explain them
4. Cite chapter sources when available
5. Be educational and thorough`;
  }

  // Handle no relevant chunks found
  if (chunks.length === 0) {
    return `You are a helpful assistant for the Physical AI & Humanoid Robotics textbook.
However, you could not find any relevant information in the textbook to answer the user's question.
Please politely explain that the question appears to be outside the scope of this textbook,
and suggest they rephrase their question or ask about topics covered in the textbook such as:
- Physical AI concepts and embodied intelligence
- Humanoid robotics fundamentals
- Sensors and perception systems
- Actuators and movement control
- AI/ML integration in robotics
- Real-world applications and case studies`;
  }

  // Standard RAG context
  const contextText = chunks
    .map(
      (chunk) =>
        `[Source: Chapter ${chunk.chapterNumber} - ${chunk.sectionTitle}]\n${chunk.content}`
    )
    .join('\n\n---\n\n');

  return `You are a helpful assistant for the Physical AI & Humanoid Robotics textbook.
Answer questions based ONLY on the following context from the textbook.
Always cite the source chapters when providing information.
If the context doesn't contain enough information to fully answer, say so.
Be concise but thorough.

CONTEXT:
${contextText}

INSTRUCTIONS:
1. Answer based on the context above
2. Cite relevant chapters (e.g., "According to Chapter 1...")
3. If unsure, say "Based on the available information..."
4. Keep responses focused and educational`;
}

/**
 * Build conversation messages for the API
 */
function buildMessages(
  systemPrompt: string,
  query: string,
  history?: Message[]
): Array<{ role: 'system' | 'user' | 'assistant'; content: string }> {
  const messages: Array<{
    role: 'system' | 'user' | 'assistant';
    content: string;
  }> = [{ role: 'system', content: systemPrompt }];

  // Add conversation history (max 10 messages)
  if (history && history.length > 0) {
    const recentHistory = history.slice(-10);
    for (const msg of recentHistory) {
      messages.push({
        role: msg.role,
        content: msg.content,
      });
    }
  }

  // Add current query
  messages.push({ role: 'user', content: query });

  return messages;
}

/**
 * Out-of-scope response template
 */
const OUT_OF_SCOPE_RESPONSE = `I apologize, but I couldn't find relevant information in the Physical AI & Humanoid Robotics textbook to answer your question.

This textbook covers topics such as:
• Physical AI and embodied intelligence concepts
• Humanoid robotics fundamentals and design
• Sensors and perception systems
• Actuators and movement control
• AI/ML integration in robotics
• Real-world applications and case studies

Please try rephrasing your question or ask about one of these topics!`;

/**
 * Extended chat request with optional selected text
 */
export interface ExtendedChatRequest extends ChatRequest {
  selectedText?: string;
  conversationId?: string;
  messageId?: string;
}

/**
 * Process a chat request and return streaming response
 */
export async function* processChat(
  request: ExtendedChatRequest
): AsyncGenerator<
  | { type: 'token'; content: string }
  | { type: 'sources'; sources: SourceReference[] }
  | { type: 'done' }
  | { type: 'error'; message: string; code: string }
> {
  try {
    let chunks: Array<TextChunk & { score: number }> = [];
    let sources: SourceReference[] = [];

    // If selected text is provided, use it as primary context
    if (request.selectedText && request.selectedText.trim()) {
      // Also search for related chunks for additional context
      const queryEmbedding = await generateEmbedding(request.selectedText);
      chunks = await searchSimilarChunks(queryEmbedding, 2);
      sources = toSourceReferences(chunks);
    } else {
      // Standard RAG: generate query embedding and search
      const queryEmbedding = await generateEmbedding(request.query);
      chunks = await searchSimilarChunks(queryEmbedding);
      sources = toSourceReferences(chunks);

      // Check if query is out of scope
      if (chunks.length === 0 || chunks[0].score < SIMILARITY_THRESHOLD) {
        // Stream out-of-scope response
        const words = OUT_OF_SCOPE_RESPONSE.split(' ');
        for (const word of words) {
          yield { type: 'token', content: word + ' ' };
          await new Promise((resolve) => setTimeout(resolve, 20));
        }
        yield { type: 'done' };
        return;
      }
    }

    // Build prompt with context
    const systemPrompt = buildSystemPrompt(chunks, request.selectedText);
    const messages = buildMessages(
      systemPrompt,
      request.query,
      request.conversationHistory
    );

    // Get OpenAI client and stream response
    const client = getOpenAIClient();
    const stream = await client.chat.completions.create({
      model: OPENAI_MODEL,
      messages,
      stream: true,
      max_tokens: 1024,
      temperature: 0.7,
    });

    let fullContent = '';

    // Stream tokens
    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content;
      if (content) {
        fullContent += content;
        yield { type: 'token', content };
      }
    }

    // Save message to database if conversation ID provided
    if (request.conversationId && request.messageId) {
      try {
        await saveMessage(
          request.conversationId,
          request.messageId,
          'assistant',
          fullContent,
          sources
        );
      } catch (dbError) {
        console.warn('Failed to save message to database:', dbError);
        // Don't fail the request if DB save fails
      }
    }

    // Send sources after content
    if (sources.length > 0) {
      yield { type: 'sources', sources };
    }

    yield { type: 'done' };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'An error occurred';

    // Determine error code
    let code = 'SERVICE_ERROR';
    if (message.includes('rate')) {
      code = 'RATE_LIMIT';
    } else if (message.includes('timeout')) {
      code = 'TIMEOUT';
    }

    yield { type: 'error', message, code };
  }
}

/**
 * Non-streaming chat for testing
 */
export async function chat(request: ExtendedChatRequest): Promise<{
  content: string;
  sources: SourceReference[];
}> {
  let content = '';
  let sources: SourceReference[] = [];

  for await (const event of processChat(request)) {
    if (event.type === 'token') {
      content += event.content;
    } else if (event.type === 'sources') {
      sources = event.sources;
    } else if (event.type === 'error') {
      throw new Error(event.message);
    }
  }

  return { content, sources };
}
