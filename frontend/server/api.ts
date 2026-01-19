/**
 * Express API Server
 * Feature: 002-rag-chatbot
 *
 * Handles chat API requests for the RAG chatbot.
 * Runs alongside Docusaurus dev server.
 */

import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables first
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

import express, { Request, Response } from 'express';
import cors from 'cors';
import { processChat } from '../lib/chat-service';
import type { Message } from '../src/types/chat';

const app = express();
const PORT = process.env.API_PORT || 3001;

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true,
}));
app.use(express.json());

// Health check
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Chat endpoint with SSE streaming
app.post('/api/chat', async (req: Request, res: Response) => {
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
    res.setHeader('Cache-Control', 'no-cache');
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

      // Flush the response if available
      if (typeof (res as any).flush === 'function') {
        (res as any).flush();
      }
    }

    res.end();
  } catch (error) {
    console.error('Chat error:', error);

    // If headers not sent, send error response
    if (!res.headersSent) {
      res.status(500).json({
        error: error instanceof Error ? error.message : 'Internal server error',
      });
    } else {
      // If streaming, send error event
      res.write(`data: ${JSON.stringify({
        type: 'error',
        message: error instanceof Error ? error.message : 'Internal server error',
        code: 'SERVICE_ERROR',
      })}\n\n`);
      res.end();
    }
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`\n🤖 Chat API server running at http://localhost:${PORT}`);
  console.log(`   - Health: http://localhost:${PORT}/api/health`);
  console.log(`   - Chat:   POST http://localhost:${PORT}/api/chat\n`);
});
