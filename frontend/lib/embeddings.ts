/**
 * Embeddings Utility
 * Feature: 002-rag-chatbot
 *
 * Generates text embeddings using MiniLM-L6-v2 via transformers.js
 */

import { pipeline } from '@xenova/transformers';

// Model configuration
const MODEL_NAME = 'Xenova/all-MiniLM-L6-v2';
const EMBEDDING_DIM = 384;

// Type for feature extraction pipeline result
type FeatureExtractionPipeline = Awaited<ReturnType<typeof pipeline<'feature-extraction'>>>;

// Lazy-loaded embedding pipeline
let embeddingPipeline: FeatureExtractionPipeline | null = null;

/**
 * Get or create the embedding pipeline
 */
async function getEmbeddingPipeline(): Promise<FeatureExtractionPipeline> {
  if (!embeddingPipeline) {
    embeddingPipeline = await pipeline('feature-extraction', MODEL_NAME, {
      quantized: true, // Use quantized model for faster inference
    });
  }
  return embeddingPipeline;
}

/**
 * Generate embedding for a single text
 */
export async function generateEmbedding(text: string): Promise<number[]> {
  const pipe = await getEmbeddingPipeline();

  // Generate embedding
  const output = await pipe(text, {
    pooling: 'mean',
    normalize: true,
  });

  // Convert tensor to array
  const embedding = Array.from(output.data as Float32Array);

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
  const embeddings: number[][] = [];

  // Process texts one at a time to avoid memory issues
  for (const text of texts) {
    const embedding = await generateEmbedding(text);
    embeddings.push(embedding);
  }

  return embeddings;
}

/**
 * Estimate token count for a text (rough approximation)
 * Uses the rule of thumb: ~4 characters per token for English text
 */
export function estimateTokenCount(text: string): number {
  return Math.ceil(text.length / 4);
}

/**
 * Check if the embedding model is loaded
 */
export function isModelLoaded(): boolean {
  return embeddingPipeline !== null;
}

/**
 * Preload the embedding model (useful for warming up)
 */
export async function preloadModel(): Promise<void> {
  await getEmbeddingPipeline();
}
