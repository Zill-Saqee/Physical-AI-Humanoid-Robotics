import type { SidebarsConfig } from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  textbookSidebar: [
    {
      type: 'doc',
      id: 'intro',
      label: 'Introduction',
    },
    {
      type: 'doc',
      id: 'chapter-1-physical-ai-introduction',
      label: '1. Physical AI Introduction',
    },
    {
      type: 'doc',
      id: 'chapter-2-humanoid-robotics-fundamentals',
      label: '2. Humanoid Robotics Fundamentals',
    },
    {
      type: 'doc',
      id: 'chapter-3-sensors-perception',
      label: '3. Sensors & Perception',
    },
    {
      type: 'doc',
      id: 'chapter-4-actuators-movement',
      label: '4. Actuators & Movement',
    },
    {
      type: 'doc',
      id: 'chapter-5-ai-ml-integration',
      label: '5. AI/ML Integration',
    },
    {
      type: 'doc',
      id: 'chapter-6-applications-case-studies',
      label: '6. Applications & Case Studies',
    },
  ],
};

export default sidebars;
