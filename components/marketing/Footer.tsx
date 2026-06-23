'use client';

import Link from 'next/link';

const COLS = [
  {
    title: 'Služby',
    links: [
      { href: '/sluzby', label: 'Landing page' },
      { href: '/sluzby', label: 'Firemní web' },
      { href: '/sluzby', label: 'E-commerce' },
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
      { href: '/kontakt', label: 'Získat web' },
      { href: '/kontakt', label: 'Kontaktovat nás' },
    ],
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
            <p className="text-sm leading-relaxed max-w-[200px]" style={{ color: 'rgba(255,255,255,0.5)' }}>
              Moderní weby pro lokální firmy. Rychle, na míru, bez starostí.
            </p>
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

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-3" style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}>
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
          </div>
        </div>
      </div>
    </footer>
  );
}
