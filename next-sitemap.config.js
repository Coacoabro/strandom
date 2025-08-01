/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || 'https://strandom.app',
  generateRobotsTxt: true, // also generates robots.txt
  sitemapSize: 5000,       // optional, chunk sitemaps if many pages
};
