/**
 * Qdrant Client Wrapper
 * Feature: 002-rag-chatbot
 *
 * Provides a configured Qdrant client for vector similarity search.
 */

import { QdrantClient } from '@qdrant/js-client-rest';
import type { TextChunk, SourceReference } from '../src/types/chat';

// Collection configuration
export const COLLECTION_NAME = 'textbook_chunks';
export const VECTOR_SIZE = 1536; // OpenAI text-embedding-3-small dimension
export const SIMILARITY_THRESHOLD = 0.3; // Lower threshold for OpenAI embeddings
export const TOP_K = 3;

// Lazy-initialized client instance
let qdrantClient: QdrantClient | null = null;

/**
 * Get or create the Qdrant client instance
 */
export function getQdrantClient(): QdrantClient {
  if (!qdrantClient) {
    const url = process.env.QDRANT_URL;
    const apiKey = process.env.QDRANT_API_KEY;

    if (!url) {
      throw new Error('QDRANT_URL environment variable is required');
    }

    qdrantClient = new QdrantClient({
      url,
      apiKey: apiKey || undefined,
    });
  }

  return qdrantClient;
}

/**
 * Search for similar chunks in the vector database
 */
export async function searchSimilarChunks(
  embedding: number[],
  limit: number = TOP_K,
  scoreThreshold: number = SIMILARITY_THRESHOLD
): Promise<Array<TextChunk & { score: number }>> {
  const client = getQdrantClient();

  const results = await client.search(COLLECTION_NAME, {
    vector: embedding,
    limit,
    score_threshold: scoreThreshold,
    with_payload: true,
  });

  return results.map((result) => ({
    id: result.payload?.id as string,
    chapterNumber: result.payload?.chapterNumber as number,
    chapterTitle: result.payload?.chapterTitle as string,
    sectionId: result.payload?.sectionId as string,
    sectionTitle: result.payload?.sectionTitle as string,
    content: result.payload?.content as string,
    position: result.payload?.position as number,
    tokenCount: result.payload?.tokenCount as number,
    score: result.score,
  }));
}

// Chapter number to slug mapping
const CHAPTER_SLUGS: Record<number, string> = {
  0: 'intro',
  1: 'chapter-1-physical-ai-introduction',
  2: 'chapter-2-humanoid-robotics-fundamentals',
  3: 'chapter-3-sensors-perception',
  4: 'chapter-4-actuators-movement',
  5: 'chapter-5-ai-ml-integration',
  6: 'chapter-6-applications-case-studies',
};

/**
 * Convert search results to source references for display
 */
export function toSourceReferences(
  chunks: Array<TextChunk & { score: number }>
): SourceReference[] {
  return chunks.map((chunk) => ({
    chunkId: chunk.id,
    chapterNumber: chunk.chapterNumber,
    sectionTitle: chunk.sectionTitle,
    url: `/${CHAPTER_SLUGS[chunk.chapterNumber] || `chapter-${chunk.chapterNumber}`}`,
    relevanceScore: chunk.score,
  }));
}

/**
 * Ensure the collection exists with proper schema
 */
export async function ensureCollection(): Promise<void> {
  const client = getQdrantClient();

  const collections = await client.getCollections();
  const exists = collections.collections.some(
    (c) => c.name === COLLECTION_NAME
  );

  if (!exists) {
    await client.createCollection(COLLECTION_NAME, {
      vectors: {
        size: VECTOR_SIZE,
        distance: 'Cosine',
      },
    });
  }
}

/**
 * Upsert chunks into the collection
 */
export async function upsertChunks(
  chunks: Array<TextChunk & { embedding: number[] }>
): Promise<void> {
  const client = getQdrantClient();

  const points = chunks.map((chunk, index) => ({
    id: index,
    vector: chunk.embedding,
    payload: {
      id: chunk.id,
      chapterNumber: chunk.chapterNumber,
      chapterTitle: chunk.chapterTitle,
      sectionId: chunk.sectionId,
      sectionTitle: chunk.sectionTitle,
      content: chunk.content,
      position: chunk.position,
      tokenCount: chunk.tokenCount,
    },
  }));

  await client.upsert(COLLECTION_NAME, {
    wait: true,
    points,
  });
}

/**
 * Get collection info for debugging
 */
export async function getCollectionInfo(): Promise<{
  pointsCount: number;
  status: string;
}> {
  const client = getQdrantClient();
  const info = await client.getCollection(COLLECTION_NAME);

  return {
    pointsCount: info.points_count ?? 0,
    status: info.status,
  };
}
