/** @type {import('next-sitemap').IConfig} */
export default {
  siteUrl: process.env.SITE_URL || 'http://localhost:3000',
  changefreq: 'weekly',
  priority: '0.5',
  generateIndexSitemap: false,
  exclude: ['/icon.svg']
}
