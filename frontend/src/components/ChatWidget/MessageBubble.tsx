/**
 * MessageBubble Component
 * Feature: 002-rag-chatbot
 *
 * Displays a single message with optional source references.
 */

import React from 'react';
import type { MessageBubbleProps } from '../../types/chat';
import { SourceList } from './SourceList';
import styles from './styles.module.css';

export function MessageBubble({
  message,
  isStreaming = false,
  onSourceClick,
}: MessageBubbleProps): React.ReactElement {
  const isUser = message.role === 'user';

  return (
    <div
      className={`${styles.messageBubble} ${isUser ? styles.userMessage : styles.assistantMessage}`}
    >
      <div className={styles.messageContent}>
        {message.content}
        {isStreaming && <span className={styles.cursor}>|</span>}
      </div>

      {!isUser && message.sources && message.sources.length > 0 && onSourceClick && (
        <SourceList
          sources={message.sources}
          onSourceClick={onSourceClick}
        />
      )}

      <time className={styles.messageTime} dateTime={message.timestamp}>
        {formatTime(message.timestamp)}
      </time>
    </div>
  );
}

function formatTime(timestamp: string): string {
  try {
    const date = new Date(timestamp);
    return date.toLocaleTimeString(undefined, {
      hour: 'numeric',
      minute: '2-digit',
    });
  } catch {
    return '';
  }
}

export default MessageBubble;
