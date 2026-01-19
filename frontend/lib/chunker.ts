/**
 * Content Chunking Utility
 * Feature: 002-rag-chatbot
 *
 * Splits markdown content into semantic chunks for indexing.
 */

import { estimateTokenCount } from './embeddings';
import type { TextChunk } from '../src/types/chat';

// Chunking configuration
const MIN_TOKENS = 50;
const MAX_TOKENS = 500;
const TARGET_TOKENS = 300;
const OVERLAP_TOKENS = 50;

interface ChunkingOptions {
  minTokens?: number;
  maxTokens?: number;
  targetTokens?: number;
  overlapTokens?: number;
}

interface MarkdownSection {
  heading: string;
  level: number;
  content: string;
}

/**
 * Parse markdown frontmatter
 */
export function parseFrontmatter(content: string): {
  frontmatter: Record<string, string>;
  body: string;
} {
  const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);

  if (!frontmatterMatch) {
    return { frontmatter: {}, body: content };
  }

  const frontmatter: Record<string, string> = {};
  const lines = frontmatterMatch[1].split('\n');

  for (const line of lines) {
    const match = line.match(/^(\w+):\s*(.*)$/);
    if (match) {
      frontmatter[match[1]] = match[2].replace(/^["']|["']$/g, '');
    }
  }

  return { frontmatter, body: frontmatterMatch[2] };
}

/**
 * Extract sections from markdown content
 */
export function extractSections(markdown: string): MarkdownSection[] {
  const sections: MarkdownSection[] = [];
  const lines = markdown.split('\n');

  let currentSection: MarkdownSection | null = null;
  let contentBuffer: string[] = [];

  for (const line of lines) {
    const headingMatch = line.match(/^(#{1,6})\s+(.+)$/);

    if (headingMatch) {
      // Save previous section
      if (currentSection) {
        currentSection.content = contentBuffer.join('\n').trim();
        if (currentSection.content) {
          sections.push(currentSection);
        }
      }

      // Start new section
      currentSection = {
        heading: headingMatch[2],
        level: headingMatch[1].length,
        content: '',
      };
      contentBuffer = [];
    } else {
      contentBuffer.push(line);
    }
  }

  // Save final section
  if (currentSection) {
    currentSection.content = contentBuffer.join('\n').trim();
    if (currentSection.content) {
      sections.push(currentSection);
    }
  }

  return sections;
}

/**
 * Split text into chunks based on token limits
 */
function splitByTokens(
  text: string,
  options: Required<ChunkingOptions>
): string[] {
  const { maxTokens, targetTokens, overlapTokens } = options;
  const chunks: string[] = [];

  // Split by paragraphs first
  const paragraphs = text.split(/\n\n+/);
  let currentChunk = '';
  let currentTokens = 0;

  for (const paragraph of paragraphs) {
    const paragraphTokens = estimateTokenCount(paragraph);

    // If single paragraph exceeds max, split by sentences
    if (paragraphTokens > maxTokens) {
      if (currentChunk) {
        chunks.push(currentChunk.trim());
        currentChunk = '';
        currentTokens = 0;
      }

      const sentences = paragraph.split(/(?<=[.!?])\s+/);
      for (const sentence of sentences) {
        const sentenceTokens = estimateTokenCount(sentence);

        if (currentTokens + sentenceTokens > maxTokens) {
          if (currentChunk) {
            chunks.push(currentChunk.trim());
          }
          currentChunk = sentence;
          currentTokens = sentenceTokens;
        } else {
          currentChunk += (currentChunk ? ' ' : '') + sentence;
          currentTokens += sentenceTokens;
        }
      }
    } else if (currentTokens + paragraphTokens > targetTokens) {
      // Start new chunk but keep some overlap
      if (currentChunk) {
        chunks.push(currentChunk.trim());
      }

      // Add overlap from end of previous chunk
      const words = currentChunk.split(/\s+/);
      const overlapWords = words.slice(-Math.ceil(overlapTokens / 1.5));
      currentChunk = overlapWords.join(' ') + '\n\n' + paragraph;
      currentTokens = estimateTokenCount(currentChunk);
    } else {
      currentChunk += (currentChunk ? '\n\n' : '') + paragraph;
      currentTokens += paragraphTokens;
    }
  }

  // Add final chunk
  if (currentChunk) {
    chunks.push(currentChunk.trim());
  }

  return chunks.filter((c) => estimateTokenCount(c) >= options.minTokens);
}

/**
 * Chunk a markdown file into TextChunk objects
 */
export function chunkMarkdownFile(
  content: string,
  chapterNumber: number,
  options: ChunkingOptions = {}
): Omit<TextChunk, 'embedding'>[] {
  const opts: Required<ChunkingOptions> = {
    minTokens: options.minTokens ?? MIN_TOKENS,
    maxTokens: options.maxTokens ?? MAX_TOKENS,
    targetTokens: options.targetTokens ?? TARGET_TOKENS,
    overlapTokens: options.overlapTokens ?? OVERLAP_TOKENS,
  };

  const { frontmatter, body } = parseFrontmatter(content);
  const chapterTitle = frontmatter.title || `Chapter ${chapterNumber}`;
  const sections = extractSections(body);

  const chunks: Omit<TextChunk, 'embedding'>[] = [];
  let position = 0;

  for (let sectionIndex = 0; sectionIndex < sections.length; sectionIndex++) {
    const section = sections[sectionIndex];
    const sectionId = `${chapterNumber}.${sectionIndex + 1}`;

    // Prepend heading to content for context
    const fullContent = `${section.heading}\n\n${section.content}`;
    const contentChunks = splitByTokens(fullContent, opts);

    for (let chunkIndex = 0; chunkIndex < contentChunks.length; chunkIndex++) {
      const chunkContent = contentChunks[chunkIndex];
      const tokenCount = estimateTokenCount(chunkContent);

      chunks.push({
        id: `ch${chapterNumber}_sec${sectionIndex + 1}_${chunkIndex}`,
        chapterNumber,
        chapterTitle,
        sectionId,
        sectionTitle: section.heading,
        content: chunkContent,
        position,
        tokenCount,
      });

      position++;
    }
  }

  return chunks;
}

/**
 * Process multiple markdown files into chunks
 */
export function chunkAllFiles(
  files: Array<{ content: string; chapterNumber: number }>
): Omit<TextChunk, 'embedding'>[] {
  const allChunks: Omit<TextChunk, 'embedding'>[] = [];

  for (const file of files) {
    const chunks = chunkMarkdownFile(file.content, file.chapterNumber);
    allChunks.push(...chunks);
  }

  return allChunks;
}
