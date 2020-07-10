module.exports = {
  title: 'Raspbernetes',
  tagline: 'Running k8s on Raspberry Pi Cluster',
  url: 'https://raspbernetes.github.io',
  baseUrl: '/',
  favicon: 'img/favicon.ico',
  organizationName: 'raspbernetes',
  projectName: 'raspbernetes.github.io',
  themeConfig: {
    navbar: {
      title: 'Raspbernetes',
      logo: {
        alt: 'Raspbernetes Logo',
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
              href: 'https://stackoverflow.com/questions/tagged/Raspbernetes',
            },
            {
              label: 'Discord',
              href: 'https://discordapp.com/invite/Raspbernetes',
            },
            {
              label: 'Twitter',
              href: 'https://twitter.com/Raspbernetes',
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
      copyright: `Copyright © ${new Date().getFullYear()} Raspbernetes, Inc. Built with ❤️`,
    },
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          // It is recommended to set document id as docs home page (`docs/` path).
          homePageId: 'introduction',
          sidebarPath: require.resolve('./sidebars.js'),
          // Please change this to your repo.
          editUrl:
            'https://github.com/raspbernetes/docs/edit/master/website/',
        },
        blog: {
          showReadingTime: true,
          // Please change this to your repo.
          editUrl:
            'https://github.com/raspbernetes/docs/edit/master/website/blog/',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],
};
