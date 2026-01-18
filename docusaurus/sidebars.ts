import type { SidebarsConfig } from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  textbookSidebar: [
    'intro',
    {
      type: 'category',
      label: 'Chapters',
      collapsed: false,
      items: [
        'chapter-1-physical-ai-introduction',
        'chapter-2-humanoid-robotics-fundamentals',
        'chapter-3-sensors-perception',
        'chapter-4-actuators-movement',
        'chapter-5-ai-ml-integration',
        'chapter-6-applications-case-studies',
      ],
    },
  ],
};

export default sidebars;
