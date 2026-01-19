import type { ReactNode } from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import BrowserOnly from '@docusaurus/BrowserOnly';
import ProgressTracker from '@site/src/components/ProgressTracker';
import CompletionBanner from '@site/src/components/CompletionBanner';
import { useProgress } from '@site/src/hooks/useProgress';
import { chaptersConfig } from '@site/src/config/chapters';

import styles from './index.module.css';

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <Heading as="h1" className="hero__title">
          {siteConfig.title}
        </Heading>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
        <div className={styles.buttons}>
          <Link className="button button--secondary button--lg" to="/intro">
            Start Reading
          </Link>
        </div>
      </div>
    </header>
  );
}

function ProgressSection() {
  const { progress, isComplete } = useProgress();

  return (
    <section className={styles.progressSection}>
      <div className="container">
        {isComplete && progress.completedAt && (
          <CompletionBanner
            completedAt={progress.completedAt}
            totalChapters={chaptersConfig.totalChapters}
          />
        )}
        <ProgressTracker progress={progress} config={chaptersConfig} showDetails />
      </div>
    </section>
  );
}

function ChapterList() {
  const chapters = [
    {
      title: 'Introduction to Physical AI',
      description: 'Learn what Physical AI means and how it differs from traditional AI',
      link: '/chapter-1-physical-ai-introduction',
      time: '7 min',
    },
    {
      title: 'Humanoid Robotics Fundamentals',
      description: 'Explore the design principles and engineering of humanoid robots',
      link: '/chapter-2-humanoid-robotics-fundamentals',
      time: '7 min',
    },
    {
      title: 'Sensors and Perception',
      description: 'Understand how robots sense and perceive their environment',
      link: '/chapter-3-sensors-perception',
      time: '7 min',
    },
    {
      title: 'Actuators and Movement',
      description: 'Learn about motors and mechanisms that enable robot motion',
      link: '/chapter-4-actuators-movement',
      time: '7 min',
    },
    {
      title: 'AI/ML Integration',
      description: 'Discover how AI and machine learning power physical systems',
      link: '/chapter-5-ai-ml-integration',
      time: '7 min',
    },
    {
      title: 'Applications and Case Studies',
      description: 'Explore real-world applications across industries',
      link: '/chapter-6-applications-case-studies',
      time: '7 min',
    },
  ];

  return (
    <section className={styles.chapters}>
      <div className="container">
        <Heading as="h2" className={styles.chaptersTitle}>
          Chapters
        </Heading>
        <p className={styles.chaptersSubtitle}>
          Estimated total reading time: 45 minutes
        </p>
        <div className={styles.chapterGrid}>
          {chapters.map((chapter, idx) => (
            <Link key={idx} to={chapter.link} className={styles.chapterCard}>
              <div className={styles.chapterNumber}>Chapter {idx + 1}</div>
              <h3 className={styles.chapterTitle}>{chapter.title}</h3>
              <p className={styles.chapterDescription}>{chapter.description}</p>
              <span className={styles.chapterTime}>{chapter.time} read</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function Home(): ReactNode {
  return (
    <Layout
      title="Home"
      description="An interactive textbook on Physical AI and Humanoid Robotics"
    >
      <HomepageHeader />
      <main>
        <BrowserOnly fallback={<div style={{ minHeight: '100px' }} />}>
          {() => <ProgressSection />}
        </BrowserOnly>
        <ChapterList />
      </main>
    </Layout>
  );
}
