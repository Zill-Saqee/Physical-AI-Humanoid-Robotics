/**
 * Vercel Serverless Function - Chat API
 * Feature: 002-rag-chatbot
 *
 * Handles chat API requests for the RAG chatbot.
 * Deployed as a Vercel serverless function.
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { processChat } from '../frontend/lib/chat-service';
import type { Message } from '../frontend/src/types/chat';

// CORS configuration
const allowedOrigins = [
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  // Vercel preview and production URLs
  process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : '',
  process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : '',
].filter(Boolean);

/**
 * Check if origin is allowed
 */
function isOriginAllowed(origin: string | undefined): boolean {
  if (!origin) return true; // Allow requests without origin (e.g., server-to-server)
  // Allow all Vercel preview URLs
  if (origin.includes('.vercel.app')) return true;
  return allowedOrigins.includes(origin);
}

/**
 * Set CORS headers
 */
function setCorsHeaders(req: VercelRequest, res: VercelResponse): void {
  const origin = req.headers.origin as string | undefined;
  if (isOriginAllowed(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin || '*');
  }
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
}

/**
 * Main handler
 */
export default async function handler(
  req: VercelRequest,
  res: VercelResponse
): Promise<void> {
  // Set CORS headers
  setCorsHeaders(req, res);

  // Handle preflight
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only allow POST
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const {
      query,
      conversationHistory,
      selectedText,
      conversationId,
      messageId,
    } = req.body as {
      query: string;
      conversationHistory?: Message[];
      selectedText?: string;
      conversationId?: string;
      messageId?: string;
    };

    // Validate query
    if (!query || typeof query !== 'string' || !query.trim()) {
      res.status(400).json({ error: 'Query is required' });
      return;
    }

    // Set SSE headers
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache, no-transform');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Accel-Buffering', 'no');

    // Process chat and stream response
    const chatStream = processChat({
      query: query.trim(),
      conversationHistory,
      selectedText,
      conversationId,
      messageId,
    });

    for await (const event of chatStream) {
      res.write(`data: ${JSON.stringify(event)}\n\n`);
    }

    res.end();
  } catch (error) {
    console.error('Chat error:', error);

    // If headers not sent, send error response
    if (!res.headersSent) {
      res.status(500).json({
        error:
          error instanceof Error ? error.message : 'Internal server error',
      });
    } else {
      // If streaming, send error event
      res.write(
        `data: ${JSON.stringify({
          type: 'error',
          message:
            error instanceof Error ? error.message : 'Internal server error',
          code: 'SERVICE_ERROR',
        })}\n\n`
      );
      res.end();
    }
  }
}
