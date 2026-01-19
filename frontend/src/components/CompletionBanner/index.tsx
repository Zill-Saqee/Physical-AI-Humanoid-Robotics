import React, { useState, useEffect } from 'react';
import type { CompletionBannerProps } from '@site/src/types';
import { STORAGE_KEYS } from '@site/src/types';
import styles from './styles.module.css';

export default function CompletionBanner({
  completedAt,
  totalChapters,
  onDismiss,
}: CompletionBannerProps): React.ReactElement | null {
  const [isDismissed, setIsDismissed] = useState(true);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const dismissed = localStorage.getItem(STORAGE_KEYS.BANNER_DISMISSED);
      setIsDismissed(dismissed === 'true');
    }
  }, []);

  const handleDismiss = () => {
    setIsDismissed(true);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.BANNER_DISMISSED, 'true');
    }
    if (onDismiss) {
      onDismiss();
    }
  };

  if (isDismissed) {
    return null;
  }

  const completionDate = new Date(completedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className={styles.completionBanner} role="alert">
      <div className={styles.bannerContent}>
        <div className={styles.bannerIcon} aria-hidden="true">
          🎉
        </div>
        <div className={styles.bannerText}>
          <h3 className={styles.bannerTitle}>Congratulations!</h3>
          <p className={styles.bannerMessage}>
            You completed all {totalChapters} chapters on {completionDate}
          </p>
        </div>
        <button
          className={styles.dismissButton}
          onClick={handleDismiss}
          aria-label="Dismiss completion banner"
        >
          ×
        </button>
      </div>
    </div>
  );
}
