'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const LINKS = [
  { href: '/sluzby', label: 'Služby' },
  { href: '/portfolio', label: 'Portfolio' },
  { href: '/jak-pracujeme', label: 'Jak pracujeme' },
  { href: '/reference', label: 'Reference' },
  { href: '/o-nas', label: 'O nás' },
];

export function MarketingNav() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 8);
    fn();
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [pathname]);

  return (
    <>
      {/* Thin blue accent line at top */}
      <div
        aria-hidden
        style={{
          position: 'fixed', top: 0, left: 0, right: 0, height: '2px', zIndex: 60,
          background: 'linear-gradient(90deg, transparent 0%, #2563eb 35%, #22d3ee 65%, transparent 100%)',
          opacity: scrolled ? 1 : 0.5,
          transition: 'opacity 0.4s ease',
        }}
      />

      <nav
        style={{
          position: 'fixed', top: '2px', left: 0, right: 0, zIndex: 50,
          background: '#060d1a',
          borderBottom: `1px solid ${scrolled ? 'rgba(255,255,255,0.07)' : 'rgba(255,255,255,0.03)'}`,
          boxShadow: scrolled ? '0 4px 32px rgba(0,0,0,0.5)' : 'none',
          transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
        }}
      >
        <div style={{ maxWidth: '1120px', margin: '0 auto', padding: '0 24px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '20px' }}>

          {/* Logo */}
          <Link href="/" style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
            <img src="/logo.png" alt="WebsiteAgent" style={{ height: '36px', width: 'auto' }} />
          </Link>

          {/* Desktop — grouped links */}
          <div className="hidden md:flex" style={{
            alignItems: 'center',
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: '12px',
            overflow: 'hidden',
            flexShrink: 1,
          }}>
            {LINKS.map(({ href, label }, i) => (
              <Link
                key={href}
                href={href}
                style={{
                  padding: '8px 16px',
                  fontSize: '13px',
                  fontWeight: 500,
                  color: pathname === href ? '#ffffff' : 'rgba(255,255,255,0.38)',
                  textDecoration: 'none',
                  background: pathname === href ? 'rgba(37,99,235,0.15)' : 'transparent',
                  borderRight: i < LINKS.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                  transition: 'color 0.15s, background 0.15s',
                  whiteSpace: 'nowrap',
                }}
                onMouseEnter={e => {
                  if (pathname !== href) {
                    (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.75)';
                    (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.04)';
                  }
                }}
                onMouseLeave={e => {
                  if (pathname !== href) {
                    (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.38)';
                    (e.currentTarget as HTMLElement).style.background = 'transparent';
                  }
                }}
              >
                {label}
              </Link>
            ))}
          </div>

          {/* CTA + mobile */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
            <Link
              href="/kontakt"
              className="hidden sm:inline-flex"
              style={{
                alignItems: 'center', gap: '6px',
                fontSize: '13px', fontWeight: 600,
                background: '#2563eb', color: '#fff',
                padding: '9px 18px', borderRadius: '10px',
                textDecoration: 'none',
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
              Získat web
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
            </Link>

            {/* Hamburger */}
            <button
              onClick={() => setMenuOpen(v => !v)}
              className="md:hidden"
              aria-label="Menu"
              style={{
                width: '38px', height: '38px', display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center', gap: '5px',
                background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '10px', cursor: 'pointer', padding: 0,
              }}
            >
              <span style={{ display: 'block', width: '16px', height: '1.5px', background: 'rgba(255,255,255,0.7)', transform: menuOpen ? 'rotate(45deg) translate(4.5px, 4.5px)' : 'none', transition: 'transform 0.2s' }} />
              <span style={{ display: 'block', width: '16px', height: '1.5px', background: 'rgba(255,255,255,0.7)', opacity: menuOpen ? 0 : 1, transition: 'opacity 0.2s' }} />
              <span style={{ display: 'block', width: '16px', height: '1.5px', background: 'rgba(255,255,255,0.7)', transform: menuOpen ? 'rotate(-45deg) translate(4.5px, -4.5px)' : 'none', transition: 'transform 0.2s' }} />
            </button>
          </div>
        </div>

        {/* Mobile dropdown */}
        <div style={{
          overflow: 'hidden', maxHeight: menuOpen ? '400px' : '0',
          transition: 'max-height 0.3s ease',
          borderTop: menuOpen ? '1px solid rgba(255,255,255,0.05)' : 'none',
          background: '#060d1a',
        }} className="md:hidden">
          <div style={{ padding: '12px 16px 16px' }}>
            {LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                style={{
                  display: 'block', padding: '11px 16px', borderRadius: '10px',
                  fontSize: '14px', fontWeight: 500, textDecoration: 'none',
                  color: pathname === href ? '#fff' : 'rgba(255,255,255,0.5)',
                  background: pathname === href ? 'rgba(37,99,235,0.12)' : 'transparent',
                  marginBottom: '2px', transition: 'color 0.15s',
                }}
              >
                {label}
              </Link>
            ))}
            <div style={{ marginTop: '10px', paddingTop: '10px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
              <Link href="/kontakt" style={{
                display: 'block', textAlign: 'center', padding: '12px',
                background: '#2563eb', color: '#fff', borderRadius: '10px',
                fontSize: '14px', fontWeight: 600, textDecoration: 'none',
              }}>
                Získat web →
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
