module.exports = {
  title: 'Raspernetes',
  tagline: 'running a k8s on Raspberry 🥧',
  url: 'https://raspbernetes.github.io',
  baseUrl: 'https://github.com/raspbernetes/raspbernetes.github.io',
  favicon: 'img/favicon.ico',
  organizationName: 'raspbernetes', // Usually your GitHub org/user name.
  projectName: 'raspbernetes.github.io', // Usually your repo name.
  themeConfig: {
    navbar: {
      title: 'Raspernetes',
      logo: {
        alt: 'Raspernetes Logo',
        src: 'img/logo.svg',
      },
      links: [
        {
          to: 'docs/',
          activeBasePath: 'docs',
          label: 'Docs',
          position: 'left',
        },
        { to: 'blog', label: 'Blog', position: 'left' },
        {
          href: 'https://github.com/raspbernetes',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            {
              label: 'Guides',
              to: 'docs/',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'Stack Overflow',
              href: 'https://stackoverflow.com/questions/tagged/raspernetes',
            },
            {
              label: 'Discord',
              href: 'https://discordapp.com/invite/raspernetes',
            },
            {
              label: 'Twitter',
              href: 'https://twitter.com/raspernetes',
            },
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'Blog',
              to: 'blog',
            },
            {
              label: 'GitHub',
              href: 'https://github.com/raspbernetes',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Raspernetes, Inc. Built with ❤️`,
    },
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          // It is recommended to set document id as docs home page (`docs/` path).
          homePageId: 'doc1',
          sidebarPath: require.resolve('./sidebars.js'),
          // Please change this to your repo.
          editUrl:
            'https://github.com/facebook/docusaurus/edit/master/website/',
        },
        blog: {
          showReadingTime: true,
          // Please change this to your repo.
          editUrl:
            'https://github.com/facebook/docusaurus/edit/master/website/blog/',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],
};
