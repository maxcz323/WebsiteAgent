export async function GET() {
  const baseUrl = 'https://www.website-agent.cz'

  const urls = [
    { loc: baseUrl, changefreq: 'weekly', priority: '1.0' },
    { loc: `${baseUrl}/sluzby`, changefreq: 'monthly', priority: '0.8' },
    { loc: `${baseUrl}/o-nas`, changefreq: 'monthly', priority: '0.7' },
    { loc: `${baseUrl}/portfolio`, changefreq: 'weekly', priority: '0.8' },
    { loc: `${baseUrl}/reference`, changefreq: 'monthly', priority: '0.7' },
    { loc: `${baseUrl}/kalkulace`, changefreq: 'monthly', priority: '0.8' },
    { loc: `${baseUrl}/kontakt`, changefreq: 'monthly', priority: '0.6' },
    { loc: `${baseUrl}/jak-pracujeme`, changefreq: 'monthly', priority: '0.7' },
    { loc: `${baseUrl}/changelog`, changefreq: 'weekly', priority: '0.5' },
    { loc: `${baseUrl}/zasady-ochrany-soukromi`, changefreq: 'yearly', priority: '0.3' },
  ]

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `  <url>
    <loc>${u.loc}</loc>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`).join('\n')}
</urlset>`

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml' },
  })
}
