/**
 * ChatInput Component
 * Feature: 002-rag-chatbot
 *
 * Text input for sending messages.
 */

import React, { useRef, useEffect } from 'react';
import type { ChatInputProps } from '../../types/chat';
import styles from './styles.module.css';

export function ChatInput({
  value,
  onChange,
  onSubmit,
  disabled = false,
  placeholder = 'Type a message...',
  maxLength = 1000,
}: ChatInputProps): React.ReactElement {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
    }
  }, [value]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (value.trim() && !disabled) {
        onSubmit();
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  const charCount = value.length;
  const isOverLimit = charCount > maxLength;

  return (
    <div className={styles.inputWrapper}>
      <textarea
        ref={textareaRef}
        className={`${styles.textInput} ${isOverLimit ? styles.inputError : ''}`}
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={disabled}
        rows={1}
        aria-label="Message input"
        aria-invalid={isOverLimit}
      />
      <div className={styles.inputActions}>
        <span
          className={`${styles.charCount} ${isOverLimit ? styles.charCountError : ''}`}
          aria-live="polite"
        >
          {charCount}/{maxLength}
        </span>
        <button
          className={styles.sendButton}
          onClick={onSubmit}
          disabled={disabled || !value.trim() || isOverLimit}
          aria-label="Send message"
          type="button"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <line x1="22" y1="2" x2="11" y2="13" />
            <polygon points="22 2 15 22 11 13 2 9 22 2" />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default ChatInput;
