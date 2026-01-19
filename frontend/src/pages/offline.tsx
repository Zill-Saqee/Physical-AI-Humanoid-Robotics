import React from 'react';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '50vh',
    padding: '2rem',
    textAlign: 'center' as const,
  },
  icon: {
    fontSize: '4rem',
    marginBottom: '1rem',
  },
  message: {
    fontSize: '1.1rem',
    color: 'var(--ifm-color-emphasis-700)',
    maxWidth: '500px',
    lineHeight: 1.6,
  },
  tip: {
    marginTop: '2rem',
    padding: '1rem 1.5rem',
    background: 'var(--ifm-color-emphasis-100)',
    borderRadius: '8px',
    maxWidth: '500px',
  },
  tipTitle: {
    fontWeight: 600,
    marginBottom: '0.5rem',
  },
};

export default function OfflinePage(): React.ReactElement {
  return (
    <Layout title="Offline" description="You are currently offline">
      <main style={styles.container}>
        <div style={styles.icon} aria-hidden="true">
          📡
        </div>
        <Heading as="h1">You're Offline</Heading>
        <p style={styles.message}>
          It looks like you've lost your internet connection. Don't worry—any
          chapters you've previously visited are still available for reading.
        </p>
        <div style={styles.tip}>
          <div style={styles.tipTitle}>Tip</div>
          <p style={{ margin: 0, fontSize: '0.9rem' }}>
            Navigate back to chapters you've already read using the sidebar or
            browser's back button. They should load from your device's cache.
          </p>
        </div>
      </main>
    </Layout>
  );
}
