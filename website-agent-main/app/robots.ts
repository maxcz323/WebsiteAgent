import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin', '/api', '/login', '/auth', '/preview'],
    },
    sitemap: 'https://www.website-agent.cz/sitemap.xml',
  }
}
