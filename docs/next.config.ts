import nextra from 'nextra'

const withNextra = nextra({
  defaultShowCopyCode: true
})

export default withNextra({
  reactStrictMode: true,
  async redirects() {
    return [
      { source: '/zh', destination: '/docs', permanent: false },
      { source: '/en', destination: '/docs', permanent: false },
      { source: '/zh/:path*', destination: '/:path*', permanent: false },
      { source: '/en/:path*', destination: '/:path*', permanent: false },
      { source: '/:path*.html', destination: '/:path*', permanent: false },
      { source: '/:path*.html/', destination: '/:path*', permanent: false }
    ]
  },
  turbopack: {
    resolveAlias: {
      'next-mdx-import-source-file': './mdx-components.tsx'
    }
  }
})
