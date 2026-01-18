/**
 * SourceList Component
 * Feature: 002-rag-chatbot
 *
 * Displays clickable source references for a message.
 */

import React from 'react';
import type { SourceListProps } from '../../types/chat';
import styles from './styles.module.css';

export function SourceList({
  sources,
  onSourceClick,
}: SourceListProps): React.ReactElement {
  return (
    <div className={styles.sourceList}>
      <div className={styles.sourceLabel}>Sources</div>
      <div className={styles.sourceLinks}>
        {sources.map((source) => (
          <button
            key={source.chunkId}
            className={styles.sourceLink}
            onClick={() => onSourceClick(source)}
            type="button"
            aria-label={`Go to Chapter ${source.chapterNumber}: ${source.sectionTitle}`}
          >
            <ChapterIcon />
            <span>Ch. {source.chapterNumber}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function ChapterIcon(): React.ReactElement {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
  );
}

export default SourceList;
