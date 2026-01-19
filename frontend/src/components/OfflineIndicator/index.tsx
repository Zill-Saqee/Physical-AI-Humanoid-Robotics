import React from 'react';
import styles from './styles.module.css';

export interface OfflineIndicatorProps {
  isOnline: boolean;
}

export default function OfflineIndicator({
  isOnline,
}: OfflineIndicatorProps): React.ReactElement | null {
  // Only show indicator when offline
  if (isOnline) {
    return null;
  }

  return (
    <div
      className={styles.offlineIndicator}
      role="status"
      aria-live="polite"
      aria-label="You are currently offline"
    >
      <span className={styles.offlineIcon} aria-hidden="true">
        ⚡
      </span>
      <span className={styles.offlineText}>
        You're offline. Previously viewed content is still available.
      </span>
    </div>
  );
}
