'use client';

import Link from 'next/link';

export function MarketingNav() {
  return (
    <nav style={{
      position: 'fixed', top: '12px', left: 0, right: 0, zIndex: 50,
      background: '#f8f9fb',
      borderBottom: '1px solid #e2e6ec',
      boxShadow: '0 1px 12px rgba(0,0,0,0.08)',
    }}>
      <div style={{
        maxWidth: '1200px', margin: '0 auto',
        padding: '0 32px', height: '64px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>

        {/* Logo */}
        <Link href="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', flexShrink: 0 }}>
          <img src="/logo.png" alt="WebsiteAgent" style={{ height: '36px', width: 'auto' }} />
        </Link>

        {/* CTA */}
        <Link
          href="/kontakt"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            padding: '10px 22px',
            background: '#2563eb', color: '#fff',
            fontSize: '14px', fontWeight: 600,
            borderRadius: '8px', textDecoration: 'none',
            transition: 'background 0.15s, transform 0.15s',
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLElement).style.background = '#1d4ed8';
            (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)';
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLElement).style.background = '#2563eb';
            (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
          }}
        >
          Kontaktujte nás
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </Link>

      </div>
    </nav>
  );
}
