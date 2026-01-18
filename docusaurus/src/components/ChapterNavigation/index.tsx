import React from 'react';
import Link from '@docusaurus/Link';
import type { ChapterMetadata, ChapterNavigationProps } from '@site/src/types';
import styles from './styles.module.css';

const chapters: ChapterMetadata[] = [
  {
    slug: 'intro',
    title: 'Welcome',
    position: 0,
    wordCount: 363,
    readTimeMinutes: 2,
  },
  {
    slug: 'chapter-1-physical-ai-introduction',
    title: 'Introduction to Physical AI',
    position: 1,
    wordCount: 999,
    readTimeMinutes: 5,
  },
  {
    slug: 'chapter-2-humanoid-robotics-fundamentals',
    title: 'Humanoid Robotics Fundamentals',
    position: 2,
    wordCount: 1058,
    readTimeMinutes: 5,
  },
  {
    slug: 'chapter-3-sensors-perception',
    title: 'Sensors and Perception',
    position: 3,
    wordCount: 1101,
    readTimeMinutes: 6,
  },
  {
    slug: 'chapter-4-actuators-movement',
    title: 'Actuators and Movement',
    position: 4,
    wordCount: 1145,
    readTimeMinutes: 6,
  },
  {
    slug: 'chapter-5-ai-ml-integration',
    title: 'AI/ML Integration',
    position: 5,
    wordCount: 1097,
    readTimeMinutes: 5,
  },
  {
    slug: 'chapter-6-applications-case-studies',
    title: 'Applications and Case Studies',
    position: 6,
    wordCount: 1317,
    readTimeMinutes: 7,
  },
];

export default function ChapterNavigation({
  currentSlug,
  onNavigate,
}: ChapterNavigationProps): React.ReactElement | null {
  const currentIndex = chapters.findIndex((ch) => ch.slug === currentSlug);

  if (currentIndex === -1) {
    return null;
  }

  const prevChapter = currentIndex > 0 ? chapters[currentIndex - 1] : null;
  const nextChapter =
    currentIndex < chapters.length - 1 ? chapters[currentIndex + 1] : null;

  const handleClick = (slug: string) => {
    if (onNavigate) {
      onNavigate(slug);
    }
  };

  return (
    <nav className={styles.chapterNavigation} aria-label="Chapter navigation">
      {prevChapter ? (
        <Link
          to={`/${prevChapter.slug}`}
          className={`${styles.navLink} ${styles.navLinkPrev}`}
          onClick={() => handleClick(prevChapter.slug)}
          aria-label={`Previous chapter: ${prevChapter.title}`}
        >
          <span className={styles.navLabel} aria-hidden="true">Previous</span>
          <span className={styles.navTitle}>{prevChapter.title}</span>
        </Link>
      ) : (
        <div className={styles.navPlaceholder} aria-hidden="true" />
      )}

      {nextChapter ? (
        <Link
          to={`/${nextChapter.slug}`}
          className={`${styles.navLink} ${styles.navLinkNext}`}
          onClick={() => handleClick(nextChapter.slug)}
          aria-label={`Next chapter: ${nextChapter.title}`}
        >
          <span className={styles.navLabel} aria-hidden="true">Next</span>
          <span className={styles.navTitle}>{nextChapter.title}</span>
        </Link>
      ) : (
        <div className={styles.navPlaceholder} aria-hidden="true" />
      )}
    </nav>
  );
}

export { chapters };
