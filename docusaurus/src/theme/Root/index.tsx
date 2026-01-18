import React, { lazy, Suspense } from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';
import OfflineIndicator from '@site/src/components/OfflineIndicator';
import { useOnlineStatus } from '@site/src/hooks/useOnlineStatus';

// Lazy load ChatWidget to improve initial page load
const ChatWidget = lazy(() => import('@site/src/components/ChatWidget'));

interface RootProps {
  children: React.ReactNode;
}

function OfflineStatusWrapper(): React.ReactElement | null {
  const isOnline = useOnlineStatus();
  return <OfflineIndicator isOnline={isOnline} />;
}

function ChatWidgetWrapper(): React.ReactElement {
  return (
    <Suspense fallback={null}>
      <ChatWidget />
    </Suspense>
  );
}

export default function Root({ children }: RootProps): React.ReactElement {
  return (
    <>
      {children}
      <BrowserOnly>{() => <OfflineStatusWrapper />}</BrowserOnly>
      <BrowserOnly>{() => <ChatWidgetWrapper />}</BrowserOnly>
    </>
  );
}
