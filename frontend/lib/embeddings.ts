/**
 * Embeddings Utility
 * Feature: 002-rag-chatbot
 *
 * Generates text embeddings using OpenAI's text-embedding-3-small model.
 * Works in Vercel serverless environment.
 */

import OpenAI from 'openai';

// Model configuration
const EMBEDDING_MODEL = 'text-embedding-3-small';
export const EMBEDDING_DIM = 1536;

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
 * Generate embedding for a single text
 */
export async function generateEmbedding(text: string): Promise<number[]> {
  const client = getOpenAIClient();

  const response = await client.embeddings.create({
    model: EMBEDDING_MODEL,
    input: text,
  });

  const embedding = response.data[0].embedding;

  if (embedding.length !== EMBEDDING_DIM) {
    throw new Error(
      `Expected ${EMBEDDING_DIM} dimensions, got ${embedding.length}`
    );
  }

  return embedding;
}

/**
 * Generate embeddings for multiple texts in batch
 */
export async function generateEmbeddings(
  texts: string[]
): Promise<number[][]> {
  const client = getOpenAIClient();

  // OpenAI supports batch embedding
  const response = await client.embeddings.create({
    model: EMBEDDING_MODEL,
    input: texts,
  });

  return response.data.map((item) => item.embedding);
}

/**
 * Estimate token count for a text (rough approximation)
 * Uses the rule of thumb: ~4 characters per token for English text
 */
export function estimateTokenCount(text: string): number {
  return Math.ceil(text.length / 4);
}

/**
 * Check if the embedding model is ready (always true for API-based)
 */
export function isModelLoaded(): boolean {
  return true;
}

/**
 * Preload check (no-op for API-based embeddings)
 */
export async function preloadModel(): Promise<void> {
  // No preloading needed for API-based embeddings
  getOpenAIClient(); // Just validate the API key exists
}
