import { useState, useEffect, useCallback } from 'react';
import type { ReadingProgress, UseProgressResult } from '@site/src/types';
import { STORAGE_KEYS } from '@site/src/types';
import { chaptersConfig } from '@site/src/config/chapters';

const INITIAL_PROGRESS: ReadingProgress = {
  chaptersVisited: [],
  lastVisited: undefined,
  firstVisitedAt: undefined,
  completedAt: undefined,
};

function getStoredProgress(): ReadingProgress {
  if (typeof window === 'undefined') {
    return INITIAL_PROGRESS;
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEYS.PROGRESS);
    if (stored) {
      return JSON.parse(stored) as ReadingProgress;
    }
  } catch (error) {
    console.error('Error reading progress from localStorage:', error);
  }

  return INITIAL_PROGRESS;
}

function saveProgress(progress: ReadingProgress): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(progress));
  } catch (error) {
    console.error('Error saving progress to localStorage:', error);
  }
}

export function useProgress(): UseProgressResult {
  const [progress, setProgress] = useState<ReadingProgress>(INITIAL_PROGRESS);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load progress from localStorage on mount
  useEffect(() => {
    setProgress(getStoredProgress());
    setIsHydrated(true);
  }, []);

  // Save progress whenever it changes (after hydration)
  useEffect(() => {
    if (isHydrated) {
      saveProgress(progress);
    }
  }, [progress, isHydrated]);

  const markVisited = useCallback((slug: string) => {
    setProgress((prev) => {
      // Don't add duplicates
      if (prev.chaptersVisited.includes(slug)) {
        return {
          ...prev,
          lastVisited: slug,
        };
      }

      const newVisited = [...prev.chaptersVisited, slug];
      const isComplete = newVisited.length >= chaptersConfig.totalChapters;

      return {
        ...prev,
        chaptersVisited: newVisited,
        lastVisited: slug,
        firstVisitedAt: prev.firstVisitedAt || new Date().toISOString(),
        completedAt: isComplete && !prev.completedAt ? new Date().toISOString() : prev.completedAt,
      };
    });
  }, []);

  const getPercentComplete = useCallback((): number => {
    if (chaptersConfig.totalChapters === 0) return 0;
    return Math.round((progress.chaptersVisited.length / chaptersConfig.totalChapters) * 100);
  }, [progress.chaptersVisited.length]);

  const isVisited = useCallback(
    (slug: string): boolean => {
      return progress.chaptersVisited.includes(slug);
    },
    [progress.chaptersVisited]
  );

  const isComplete = progress.chaptersVisited.length >= chaptersConfig.totalChapters;

  const reset = useCallback(() => {
    setProgress(INITIAL_PROGRESS);
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEYS.PROGRESS);
    }
  }, []);

  return {
    progress,
    markVisited,
    getPercentComplete,
    isVisited,
    isComplete,
    reset,
  };
}

export default useProgress;
