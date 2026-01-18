import React, { useEffect } from 'react';
import DocItem from '@theme-original/DocItem';
import type DocItemType from '@theme/DocItem';
import type { WrapperProps } from '@docusaurus/types';
import { useLocation } from '@docusaurus/router';
import BrowserOnly from '@docusaurus/BrowserOnly';
import { useProgress } from '@site/src/hooks/useProgress';

type Props = WrapperProps<typeof DocItemType>;

function ProgressTracker(): null {
  const { markVisited } = useProgress();
  const location = useLocation();

  useEffect(() => {
    // Extract slug from pathname (remove leading slash)
    const slug = location.pathname.replace(/^\//, '') || 'intro';
    markVisited(slug);
  }, [location.pathname, markVisited]);

  return null;
}

export default function DocItemWrapper(props: Props): React.ReactElement {
  return (
    <>
      <BrowserOnly>{() => <ProgressTracker />}</BrowserOnly>
      <DocItem {...props} />
    </>
  );
}
