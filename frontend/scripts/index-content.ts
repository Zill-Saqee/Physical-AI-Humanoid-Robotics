/**
 * Content Indexing Script
 * Feature: 002-rag-chatbot
 *
 * Reads markdown files, chunks content, generates embeddings,
 * and uploads to Qdrant Cloud.
 *
 * Usage: npm run chatbot:index
 */

import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });
import { chunkMarkdownFile } from '../lib/chunker';
import { generateEmbedding, preloadModel } from '../lib/embeddings';
import { ensureCollection, upsertChunks } from '../lib/qdrant';
import type { TextChunk } from '../src/types/chat';

// Configuration
const DOCS_DIR = path.join(__dirname, '../docs');
const CHAPTER_PATTERN = /^chapter-(\d+)/;

interface ChapterFile {
  path: string;
  chapterNumber: number;
}

/**
 * Find all chapter markdown files
 */
function findChapterFiles(): ChapterFile[] {
  const files = fs.readdirSync(DOCS_DIR);

  return files
    .filter((file) => file.endsWith('.md'))
    .map((file) => {
      const match = file.match(CHAPTER_PATTERN);
      if (match) {
        return {
          path: path.join(DOCS_DIR, file),
          chapterNumber: parseInt(match[1], 10),
        };
      }
      // Include intro as chapter 0
      if (file === 'intro.md') {
        return {
          path: path.join(DOCS_DIR, file),
          chapterNumber: 0,
        };
      }
      return null;
    })
    .filter((f): f is ChapterFile => f !== null)
    .sort((a, b) => a.chapterNumber - b.chapterNumber);
}

/**
 * Read and chunk all chapter files
 */
function readAndChunkFiles(
  files: ChapterFile[]
): Omit<TextChunk, 'embedding'>[] {
  const allChunks: Omit<TextChunk, 'embedding'>[] = [];

  for (const file of files) {
    console.log(`Reading: ${path.basename(file.path)}`);
    const content = fs.readFileSync(file.path, 'utf-8');
    const chunks = chunkMarkdownFile(content, file.chapterNumber);
    console.log(`  -> ${chunks.length} chunks`);
    allChunks.push(...chunks);
  }

  return allChunks;
}

/**
 * Generate embeddings for all chunks
 */
async function generateAllEmbeddings(
  chunks: Omit<TextChunk, 'embedding'>[]
): Promise<Array<TextChunk & { embedding: number[] }>> {
  console.log('\nGenerating embeddings...');
  await preloadModel();

  const chunksWithEmbeddings: Array<TextChunk & { embedding: number[] }> = [];

  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i];
    if (i % 10 === 0) {
      console.log(`  Processing chunk ${i + 1}/${chunks.length}`);
    }

    const embedding = await generateEmbedding(chunk.content);
    chunksWithEmbeddings.push({
      ...chunk,
      embedding,
    });
  }

  return chunksWithEmbeddings;
}

/**
 * Main indexing function
 */
async function main(): Promise<void> {
  console.log('=== RAG Chatbot Content Indexing ===\n');

  // Check environment
  if (!process.env.QDRANT_URL) {
    console.error('Error: QDRANT_URL environment variable is required');
    console.error('Create a .env.local file with your Qdrant credentials');
    process.exit(1);
  }

  try {
    // Find chapter files
    const chapterFiles = findChapterFiles();
    console.log(`Found ${chapterFiles.length} chapter files\n`);

    if (chapterFiles.length === 0) {
      console.error('No chapter files found in docs directory');
      process.exit(1);
    }

    // Read and chunk
    const chunks = readAndChunkFiles(chapterFiles);
    console.log(`\nTotal chunks: ${chunks.length}`);

    // Generate embeddings
    const chunksWithEmbeddings = await generateAllEmbeddings(chunks);

    // Ensure collection exists
    console.log('\nConnecting to Qdrant...');
    await ensureCollection();

    // Upload to Qdrant
    console.log('Uploading chunks to Qdrant...');
    await upsertChunks(chunksWithEmbeddings);

    console.log('\n=== Indexing Complete ===');
    console.log(`Indexed ${chunksWithEmbeddings.length} chunks`);
    console.log(
      `Chapters: ${chapterFiles.map((f) => f.chapterNumber).join(', ')}`
    );
  } catch (error) {
    console.error('Indexing failed:', error);
    process.exit(1);
  }
}

// Run if called directly
main();
