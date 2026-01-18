/**
 * Component Contracts: Interactive Textbook Generation
 *
 * This file defines TypeScript interfaces for React components.
 * Since this is a static site with no backend API, contracts
 * describe component props and hooks rather than REST endpoints.
 */

// ============================================================
// Reading Progress Types
// ============================================================

/**
 * Reading progress stored in localStorage
 */
export interface ReadingProgress {
  /** Array of visited chapter slugs */
  chaptersVisited: string[];
  /** Most recently visited chapter slug */
  lastVisited?: string;
  /** ISO 8601 timestamp of first visit */
  firstVisitedAt?: string;
  /** ISO 8601 timestamp when all chapters visited */
  completedAt?: string;
}

/**
 * Return type for useProgress hook
 */
export interface UseProgressResult {
  /** Current progress state */
  progress: ReadingProgress;
  /** Mark a chapter as visited */
  markVisited: (slug: string) => void;
  /** Calculate completion percentage (0-100) */
  getPercentComplete: () => number;
  /** Check if specific chapter was visited */
  isVisited: (slug: string) => boolean;
  /** Check if all chapters completed */
  isComplete: boolean;
  /** Reset all progress */
  reset: () => void;
}

// ============================================================
// Chapter Metadata Types
// ============================================================

/**
 * Metadata for a single chapter
 */
export interface ChapterMetadata {
  /** URL slug identifier */
  slug: string;
  /** Display title */
  title: string;
  /** Position in reading order (1-based) */
  position: number;
  /** Approximate word count */
  wordCount: number;
  /** Estimated read time in minutes */
  readTimeMinutes: number;
}

/**
 * All chapters metadata for progress calculation
 */
export interface ChaptersConfig {
  /** Total number of chapters */
  totalChapters: number;
  /** Array of chapter metadata */
  chapters: ChapterMetadata[];
}

// ============================================================
// Component Props
// ============================================================

/**
 * Props for ProgressTracker component
 * Displays reading progress bar and stats
 */
export interface ProgressTrackerProps {
  /** Current progress from useProgress hook */
  progress: ReadingProgress;
  /** Total chapters configuration */
  config: ChaptersConfig;
  /** Show detailed stats (chapters completed, time remaining) */
  showDetails?: boolean;
  /** CSS class for styling */
  className?: string;
}

/**
 * Props for OfflineIndicator component
 * Shows online/offline status
 */
export interface OfflineIndicatorProps {
  /** Override online status for testing */
  forceOffline?: boolean;
  /** CSS class for styling */
  className?: string;
}

/**
 * Props for ChapterNavigation component
 * Next/Previous buttons at bottom of chapters
 */
export interface ChapterNavigationProps {
  /** Current chapter slug */
  currentSlug: string;
  /** All chapters for navigation */
  chapters: ChapterMetadata[];
  /** Callback when navigating */
  onNavigate?: (slug: string) => void;
}

/**
 * Props for CompletionBanner component
 * Shown when all chapters are read
 */
export interface CompletionBannerProps {
  /** Completion timestamp */
  completedAt: string;
  /** Total chapters read */
  totalChapters: number;
  /** Callback to dismiss banner */
  onDismiss?: () => void;
}

// ============================================================
// localStorage Keys
// ============================================================

export const STORAGE_KEYS = {
  /** Key for reading progress */
  PROGRESS: 'textbook-progress',
  /** Key for dismissed completion banner */
  BANNER_DISMISSED: 'completion-banner-dismissed',
} as const;

// ============================================================
// Constants
// ============================================================

export const READING_SPEED_WPM = 200; // Average reading speed
export const TARGET_TOTAL_MINUTES = 45; // Max total reading time
export const MAX_CHAPTERS = 8;
export const MIN_CHAPTERS = 6;
