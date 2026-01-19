/**
 * ChatPanel Component
 * Feature: 002-rag-chatbot
 *
 * Main conversation container with messages and input.
 */

import React, { useRef, useEffect } from 'react';
import { useHistory } from '@docusaurus/router';
import type { ChatPanelProps } from '../../types/chat';
import { MessageBubble } from './MessageBubble';
import { ChatInput } from './ChatInput';
import { LoadingIndicator } from './LoadingIndicator';
import { ErrorDisplay } from './ErrorDisplay';
import styles from './styles.module.css';

export function ChatPanel({
  conversation,
  isLoading,
  error,
  onSendMessage,
  onClose,
  onRetry,
  selectedText,
}: ChatPanelProps): React.ReactElement {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [inputValue, setInputValue] = React.useState('');
  const history = useHistory();

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation.messages, isLoading]);

  const handleSubmit = () => {
    const trimmed = inputValue.trim();
    if (trimmed && !isLoading) {
      onSendMessage(trimmed);
      setInputValue('');
    }
  };

  const handleSourceClick = (source: { url: string }) => {
    // Use client-side navigation for smooth transitions
    history.push(source.url);
  };

  return (
    <div
      className={styles.chatPanel}
      role="dialog"
      aria-label="Chat with AI assistant"
      aria-modal="true"
    >
      <header className={styles.chatHeader}>
        <h2 className={styles.chatTitle}>Ask about the textbook</h2>
        <button
          className={styles.closeButton}
          onClick={onClose}
          aria-label="Close chat"
          type="button"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden="true"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </header>

      <div className={styles.messagesContainer} role="log" aria-live="polite">
        {conversation.messages.length === 0 && (
          <div className={styles.welcomeMessage}>
            <p>
              Hi! I can help you understand the Physical AI &amp; Humanoid
              Robotics textbook. Ask me anything about the chapters!
            </p>
            <p className={styles.suggestionText}>Try asking:</p>
            <ul className={styles.suggestions}>
              <li>"What is Physical AI?"</li>
              <li>"Explain humanoid robot sensors"</li>
              <li>"How do actuators work?"</li>
            </ul>
          </div>
        )}

        {conversation.messages.map((message, index) => (
          <MessageBubble
            key={message.id}
            message={message}
            isStreaming={
              isLoading &&
              index === conversation.messages.length - 1 &&
              message.role === 'assistant'
            }
            onSourceClick={handleSourceClick}
          />
        ))}

        {isLoading && conversation.messages.length > 0 && (
          <LoadingIndicator message="Thinking..." />
        )}

        {error && (
          <ErrorDisplay
            message={error}
            canRetry={!!onRetry}
            onRetry={onRetry}
          />
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className={styles.inputContainer}>
        {selectedText && (
          <div className={styles.selectedTextContext}>
            <span className={styles.contextLabel}>Asking about:</span>
            <span className={styles.contextText}>
              "{selectedText.length > 100 ? selectedText.slice(0, 100) + '...' : selectedText}"
            </span>
          </div>
        )}
        <ChatInput
          value={inputValue}
          onChange={setInputValue}
          onSubmit={handleSubmit}
          disabled={isLoading}
          placeholder={selectedText ? "Ask about the selected text..." : "Ask a question..."}
          maxLength={1000}
        />
      </div>
    </div>
  );
}

export default ChatPanel;
