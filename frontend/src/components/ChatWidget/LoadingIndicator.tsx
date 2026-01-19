/**
 * LoadingIndicator Component
 * Feature: 002-rag-chatbot
 *
 * Shows loading state while waiting for response.
 */

import React from 'react';
import type { LoadingIndicatorProps } from '../../types/chat';
import styles from './styles.module.css';

export function LoadingIndicator({
  message = 'Thinking...',
}: LoadingIndicatorProps): React.ReactElement {
  return (
    <div className={styles.loadingIndicator} role="status" aria-live="polite">
      <div className={styles.loadingDots}>
        <span className={styles.dot} />
        <span className={styles.dot} />
        <span className={styles.dot} />
      </div>
      <span className={styles.loadingText}>{message}</span>
    </div>
  );
}

export default LoadingIndicator;
