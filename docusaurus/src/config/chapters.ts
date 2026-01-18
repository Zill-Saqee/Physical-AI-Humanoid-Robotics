import type { ChaptersConfig, ChapterMetadata } from '@site/src/types';

export const chapters: ChapterMetadata[] = [
  {
    slug: 'intro',
    title: 'Welcome to Physical AI & Humanoid Robotics',
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

export const chaptersConfig: ChaptersConfig = {
  totalChapters: chapters.length,
  chapters,
};

export default chaptersConfig;
