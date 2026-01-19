import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// Load environment variables for chatbot configuration
const chatbotConfig = {
  qdrantUrl: process.env.QDRANT_URL || '',
  groqApiKey: process.env.GROQ_API_KEY || '',
  groqModel: process.env.GROQ_MODEL || 'llama3-8b-8192',
  debugMode: process.env.CHATBOT_DEBUG === 'true',
};

const config: Config = {
  title: 'Physical AI & Humanoid Robotics',
  tagline: 'An Interactive Textbook for the Future of Robotics',
  favicon: 'img/favicon.ico',

  future: {
    v4: true,
  },

  url: 'https://physical-ai-textbook.vercel.app',
  baseUrl: '/',

  organizationName: 'Zill-Saqee',
  projectName: 'Physical-AI-Humanoid-Robotics',

  onBrokenLinks: 'throw',
  markdown: {
    hooks: {
      onBrokenMarkdownLinks: 'warn',
    },
  },

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  customFields: {
    chatbot: chatbotConfig,
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          routeBasePath: '/',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  plugins: [
    [
      '@docusaurus/plugin-pwa',
      {
        debug: false,
        offlineModeActivationStrategies: [
          'appInstalled',
          'standalone',
          'queryString',
        ],
        injectManifestConfig: {
          globPatterns: ['**/*.{js,css,html,png,jpg,jpeg,gif,svg,ico,woff,woff2}'],
        },
        pwaHead: [
          {
            tagName: 'link',
            rel: 'icon',
            href: '/img/icons/icon-192x192.png',
          },
          {
            tagName: 'link',
            rel: 'manifest',
            href: '/manifest.json',
          },
          {
            tagName: 'meta',
            name: 'theme-color',
            content: '#0066cc',
          },
          {
            tagName: 'meta',
            name: 'apple-mobile-web-app-capable',
            content: 'yes',
          },
          {
            tagName: 'meta',
            name: 'apple-mobile-web-app-status-bar-style',
            content: 'default',
          },
          {
            tagName: 'link',
            rel: 'apple-touch-icon',
            href: '/img/icons/icon-152x152.png',
          },
        ],
      },
    ],
  ],

  themeConfig: {
    image: 'img/social-card.jpg',
    colorMode: {
      defaultMode: 'light',
      disableSwitch: false,
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: 'Physical AI Textbook',
      logo: {
        alt: 'Physical AI Textbook Logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'textbookSidebar',
          position: 'left',
          label: 'Chapters',
        },
        {
          href: 'https://github.com/Zill-Saqee/Physical-AI-Humanoid-Robotics',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Textbook',
          items: [
            {
              label: 'Introduction',
              to: '/intro',
            },
            {
              label: 'Chapter 1',
              to: '/chapter-1-physical-ai-introduction',
            },
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'GitHub',
              href: 'https://github.com/Zill-Saqee/Physical-AI-Humanoid-Robotics',
            },
            {
              label: 'LinkedIn',
              href: 'https://www.linkedin.com/in/zill-saqee',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Physical AI Textbook. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
