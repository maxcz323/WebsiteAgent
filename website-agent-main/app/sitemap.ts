import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://www.website-agent.cz'

  return [
    { url: baseUrl, changeFrequency: 'weekly', priority: 1.0 },
    { url: `${baseUrl}/sluzby`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/o-nas`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/portfolio`, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/reference`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/kalkulace`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/kontakt`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/jak-pracujeme`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/changelog`, changeFrequency: 'weekly', priority: 0.5 },
    { url: `${baseUrl}/zasady-ochrany-soukromi`, changeFrequency: 'yearly', priority: 0.3 },
  ]
}
