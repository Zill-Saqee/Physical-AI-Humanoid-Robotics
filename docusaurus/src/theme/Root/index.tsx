import React from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';
import OfflineIndicator from '@site/src/components/OfflineIndicator';
import { useOnlineStatus } from '@site/src/hooks/useOnlineStatus';

interface RootProps {
  children: React.ReactNode;
}

function OfflineStatusWrapper(): React.ReactElement | null {
  const isOnline = useOnlineStatus();
  return <OfflineIndicator isOnline={isOnline} />;
}

export default function Root({ children }: RootProps): React.ReactElement {
  return (
    <>
      {children}
      <BrowserOnly>{() => <OfflineStatusWrapper />}</BrowserOnly>
    </>
  );
}
