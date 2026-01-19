/**
 * ErrorDisplay Component
 * Feature: 002-rag-chatbot
 *
 * Shows error messages with optional retry button.
 */

import React from 'react';
import type { ErrorDisplayProps } from '../../types/chat';
import styles from './styles.module.css';

export function ErrorDisplay({
  message,
  canRetry = false,
  onRetry,
}: ErrorDisplayProps): React.ReactElement {
  return (
    <div className={styles.errorDisplay} role="alert">
      <p className={styles.errorMessage}>{message}</p>
      {canRetry && onRetry && (
        <button
          className={styles.retryButton}
          onClick={onRetry}
          type="button"
        >
          Try again
        </button>
      )}
    </div>
  );
}

export default ErrorDisplay;
