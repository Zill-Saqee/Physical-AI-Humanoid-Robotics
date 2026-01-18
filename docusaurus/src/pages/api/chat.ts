/**
 * Chat API Endpoint
 * Feature: 002-rag-chatbot
 *
 * Handles chat requests with SSE streaming responses.
 * Deployed as a Vercel Edge Function.
 */

import type { ChatRequest, StreamEvent } from '../../types/chat';

// Dynamic import to avoid bundling issues in Docusaurus
async function getChatService() {
  const { processChat } = await import('../../../lib/chat-service');
  return { processChat };
}

export const config = {
  runtime: 'edge',
};

export default async function handler(req: Request): Promise<Response> {
  // Only allow POST
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    // Parse request body
    const body = (await req.json()) as ChatRequest;

    // Validate request
    if (!body.query || typeof body.query !== 'string') {
      return new Response(JSON.stringify({ error: 'Query is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const query = body.query.trim();
    if (query.length === 0) {
      return new Response(JSON.stringify({ error: 'Query cannot be empty' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (query.length > 1000) {
      return new Response(
        JSON.stringify({ error: 'Query is too long (max 1000 characters)' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Get chat service
    const { processChat } = await getChatService();

    // Create SSE stream
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const event of processChat({
            query,
            conversationHistory: body.conversationHistory,
          })) {
            const data = `data: ${JSON.stringify(event)}\n\n`;
            controller.enqueue(encoder.encode(data));
          }
        } catch (error) {
          const errorEvent: StreamEvent = {
            type: 'error',
            message: error instanceof Error ? error.message : 'Unknown error',
            code: 'SERVICE_ERROR',
          };
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify(errorEvent)}\n\n`)
          );
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    });
  } catch (error) {
    console.error('Chat API error:', error);
    return new Response(
      JSON.stringify({
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
