/**
 * ChatButton Component
 * Feature: 002-rag-chatbot
 *
 * Floating action button to open/close the chat widget.
 */

import React from 'react';
import type { ChatButtonProps } from '../../types/chat';
import styles from './styles.module.css';

export function ChatButton({
  isOpen,
  onClick,
  unreadCount,
}: ChatButtonProps): React.ReactElement {
  return (
    <button
      className={`${styles.chatButton} ${isOpen ? styles.chatButtonOpen : ''}`}
      onClick={onClick}
      aria-label={isOpen ? 'Close chat' : 'Open chat'}
      aria-expanded={isOpen}
      type="button"
    >
      {isOpen ? (
        <CloseIcon />
      ) : (
        <>
          <ChatIcon />
          {unreadCount !== undefined && unreadCount > 0 && (
            <span className={styles.unreadBadge} aria-label={`${unreadCount} unread messages`}>
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </>
      )}
    </button>
  );
}

function ChatIcon(): React.ReactElement {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}

function CloseIcon(): React.ReactElement {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

export default ChatButton;
