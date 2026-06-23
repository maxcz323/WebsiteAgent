'use client';

import Link from 'next/link';

const COLS = [
  {
    title: 'Služby',
    links: [
      { href: '/kalkulace/landing-page', label: 'Landing page' },
      { href: '/kalkulace/firemni-web', label: 'Firemní web' },
      { href: '/kalkulace/ecommerce', label: 'E-commerce' },
      { href: '/sluzby', label: 'Správa webu' },
    ],
  },
  {
    title: 'Firma',
    links: [
      { href: '/o-nas', label: 'O nás' },
      { href: '/portfolio', label: 'Portfolio' },
      { href: '/jak-pracujeme', label: 'Jak pracujeme' },
      { href: '/reference', label: 'Reference' },
    ],
  },
  {
    title: 'Začít',
    links: [
      { href: '/kontakt', label: 'Získat web zdarma' },
      { href: '/kontakt', label: 'Kontaktovat nás' },
      { href: '/changelog', label: 'Novinky' },
    ],
  },
];

const SOCIALS = [
  {
    label: 'Instagram',
    href: 'https://instagram.com',
    icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
      </svg>
    ),
  },
  {
    label: 'LinkedIn',
    href: 'https://linkedin.com',
    icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/>
      </svg>
    ),
  },
  {
    label: 'Facebook',
    href: 'https://facebook.com',
    icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
      </svg>
    ),
  },
];

export function Footer() {
  return (
    <footer style={{ background: '#285570', color: 'rgba(255,255,255,0.6)' }} className="relative z-[10]">
      <div aria-hidden className="h-px" style={{ background: 'linear-gradient(90deg,transparent 0%,rgba(255,255,255,0.12) 30%,rgba(255,255,255,0.12) 70%,transparent 100%)' }} />

      <div className="max-w-6xl mx-auto px-5 sm:px-8 pt-16 pb-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-14">

          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="inline-block mb-5">
              <img src="/logo.png" alt="WebsiteAgent" className="h-10 w-auto" style={{ filter: 'brightness(0) invert(1)' }} />
            </Link>
            <p className="text-sm leading-relaxed mb-5" style={{ color: 'rgba(255,255,255,0.5)', maxWidth: '200px' }}>
              Moderní weby pro lokální firmy. Rychle, na míru, bez starostí.
            </p>

            {/* Contact info */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '18px' }}>
              <a href="tel:+420777000000" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'rgba(255,255,255,0.55)', textDecoration: 'none', fontSize: '13px', transition: 'color 0.15s' }}
                onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = '#fff')}
                onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.55)')}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.65 3.38 2 2 0 0 1 3.62 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.54a16 16 0 0 0 6 6l.95-.95a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                +420 777 000 000
              </a>
              <a href="mailto:info@websiteagent.cz" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'rgba(255,255,255,0.55)', textDecoration: 'none', fontSize: '13px', transition: 'color 0.15s' }}
                onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = '#fff')}
                onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.55)')}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                info@websiteagent.cz
              </a>
            </div>

            {/* Social icons */}
            <div style={{ display: 'flex', gap: '8px' }}>
              {SOCIALS.map(s => (
                <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label}
                  style={{ width: '36px', height: '36px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.5)', textDecoration: 'none', transition: 'color 0.15s, border-color 0.15s, background 0.15s' }}
                  onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.color = '#fff'; el.style.borderColor = 'rgba(255,255,255,0.4)'; el.style.background = 'rgba(255,255,255,0.08)'; }}
                  onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.color = 'rgba(255,255,255,0.5)'; el.style.borderColor = 'rgba(255,255,255,0.15)'; el.style.background = 'transparent'; }}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {COLS.map((col) => (
            <div key={col.title}>
              <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: 'rgba(255,255,255,0.35)' }}>
                {col.title}
              </p>
              <ul className="space-y-3">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      className="text-sm transition-colors duration-150"
                      style={{ color: 'rgba(255,255,255,0.55)', textDecoration: 'none' }}
                      onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = '#fff')}
                      onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.55)')}
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Rating strip */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', borderBottom: '1px solid rgba(255,255,255,0.08)', padding: '18px 0', marginBottom: '28px', display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center', justifyContent: 'center' }} className="sm:!gap-6">
          {[
            { icon: '⭐', text: '4.9/5 průměrné hodnocení' },
            { icon: '🛡️', text: 'Záruka vrácení peněz' },
            { icon: '⚡', text: 'Hotovo do 48 hodin' },
            { icon: '✅', text: 'Platíte až po schválení' },
          ].map(item => (
            <div key={item.text} style={{ display: 'flex', alignItems: 'center', gap: '7px', fontSize: '12px', color: 'rgba(255,255,255,0.45)' }}>
              <span>{item.icon}</span>
              <span>{item.text}</span>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>© 2026 WebsiteAgent. Všechna práva vyhrazena.</p>
          <div className="flex items-center gap-5">
            <Link
              href="/zasady-ochrany-soukromi"
              className="text-xs transition-colors duration-150"
              style={{ color: 'rgba(255,255,255,0.35)', textDecoration: 'none' }}
              onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.7)')}
              onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.35)')}
            >
              Zásady ochrany soukromí
            </Link>
            <span style={{ color: 'rgba(255,255,255,0.15)', fontSize: '11px' }}>|</span>
            <Link
              href="/kontakt"
              className="text-xs transition-colors duration-150"
              style={{ color: 'rgba(255,255,255,0.35)', textDecoration: 'none' }}
              onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.7)')}
              onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.35)')}
            >
              Kontakt
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
