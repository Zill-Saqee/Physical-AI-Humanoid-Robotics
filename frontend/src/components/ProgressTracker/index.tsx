import React from 'react';
import type { ProgressTrackerProps } from '@site/src/types';
import styles from './styles.module.css';

export default function ProgressTracker({
  progress,
  config,
  showDetails = true,
  className = '',
}: ProgressTrackerProps): React.ReactElement {
  const percentComplete = Math.round(
    (progress.chaptersVisited.length / config.totalChapters) * 100
  );

  const chaptersRemaining = config.totalChapters - progress.chaptersVisited.length;
  const timeRemaining = config.chapters
    .filter((ch) => !progress.chaptersVisited.includes(ch.slug))
    .reduce((acc, ch) => acc + ch.readTimeMinutes, 0);

  return (
    <div className={`${styles.progressTracker} ${className}`} role="region" aria-label="Reading progress">
      <div className={styles.progressHeader}>
        <span className={styles.progressLabel}>Your Progress</span>
        <span className={styles.progressPercent}>{percentComplete}%</span>
      </div>

      <div className={styles.progressBar} role="progressbar" aria-valuenow={percentComplete} aria-valuemin={0} aria-valuemax={100}>
        <div
          className={styles.progressFill}
          style={{ width: `${percentComplete}%` }}
        />
      </div>

      {showDetails && (
        <div className={styles.progressDetails}>
          <span className={styles.progressStat}>
            {progress.chaptersVisited.length} of {config.totalChapters} chapters read
          </span>
          {chaptersRemaining > 0 && (
            <span className={styles.progressStat}>
              ~{timeRemaining} min remaining
            </span>
          )}
        </div>
      )}
    </div>
  );
}
