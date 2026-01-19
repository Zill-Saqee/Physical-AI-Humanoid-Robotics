import React, { lazy, Suspense } from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';
import OfflineIndicator from '@site/src/components/OfflineIndicator';
import { useOnlineStatus } from '@site/src/hooks/useOnlineStatus';
import { ChatProvider, useChatContext } from '@site/src/context/ChatContext';

// Lazy load components to improve initial page load
const ChatWidgetInner = lazy(
  () => import('@site/src/components/ChatWidget/ChatWidgetInner')
);
const TextSelectionPopover = lazy(
  () => import('@site/src/components/TextSelectionPopover')
);

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
      <ChatWidgetInner />
    </Suspense>
  );
}

function TextSelectionWrapper(): React.ReactElement {
  const { askAboutSelection } = useChatContext();

  return (
    <Suspense fallback={null}>
      <TextSelectionPopover onAskAboutSelection={askAboutSelection} />
    </Suspense>
  );
}

function ChatComponents(): React.ReactElement {
  return (
    <ChatProvider>
      <ChatWidgetWrapper />
      <TextSelectionWrapper />
    </ChatProvider>
  );
}

export default function Root({ children }: RootProps): React.ReactElement {
  return (
    <>
      {children}
      <BrowserOnly>{() => <OfflineStatusWrapper />}</BrowserOnly>
      <BrowserOnly>{() => <ChatComponents />}</BrowserOnly>
    </>
  );
}
