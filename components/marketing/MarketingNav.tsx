'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const LINKS = [
  { href: '/',              label: 'Domů' },
  { href: '/sluzby',        label: 'Služby' },
  { href: '/portfolio',     label: 'Portfolio' },
  { href: '/jak-pracujeme', label: 'Jak pracujeme' },
  { href: '/reference',     label: 'Reference' },
  { href: '/o-nas',         label: 'O nás' },
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
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
        background: '#060d1a',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        boxShadow: scrolled ? '0 2px 24px rgba(0,0,0,0.5)' : 'none',
        transition: 'box-shadow 0.3s ease',
      }}>
        <div style={{
          maxWidth: '1200px', margin: '0 auto',
          padding: '0 32px', height: '68px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px',
        }}>

          {/* Logo */}
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', flexShrink: 0 }}>
            <img src="/logo.png" alt="WebsiteAgent" style={{ height: '32px', width: 'auto' }} />
            <span style={{ fontSize: '15px', fontWeight: 400, color: 'white', letterSpacing: '-0.01em' }}>
              Website<strong style={{ fontWeight: 700 }}>Agent</strong>
            </span>
          </Link>

          {/* Desktop nav links — centered */}
          <div className="hidden md:flex" style={{ alignItems: 'center', gap: '2px', flex: 1, justifyContent: 'center' }}>
            {LINKS.map(({ href, label }) => {
              const active = pathname === href || (href !== '/' && pathname.startsWith(href));
              return (
                <Link
                  key={href}
                  href={href}
                  style={{
                    position: 'relative',
                    padding: '6px 14px',
                    fontSize: '14px',
                    fontWeight: active ? 600 : 400,
                    color: active ? '#ffffff' : 'rgba(255,255,255,0.45)',
                    textDecoration: 'none',
                    transition: 'color 0.15s',
                    whiteSpace: 'nowrap',
                  }}
                  onMouseEnter={e => {
                    if (!active) (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.85)';
                  }}
                  onMouseLeave={e => {
                    if (!active) (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.45)';
                  }}
                >
                  {label}
                  {active && (
                    <span style={{
                      position: 'absolute', bottom: '-1px', left: '14px', right: '14px',
                      height: '2px', borderRadius: '2px',
                      background: 'linear-gradient(90deg, #2563eb, #22d3ee)',
                    }} />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Right side — CTA + hamburger */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
            <Link
              href="/kontakt"
              className="hidden sm:inline-flex"
              style={{
                alignItems: 'center', gap: '8px',
                padding: '10px 22px',
                background: '#2563eb', color: '#fff',
                fontSize: '14px', fontWeight: 600,
                borderRadius: '10px', textDecoration: 'none',
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
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>

            {/* Hamburger */}
            <button
              onClick={() => setMenuOpen(v => !v)}
              className="md:hidden"
              aria-label="Menu"
              style={{
                width: '40px', height: '40px', display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center', gap: '5px',
                background: 'transparent', border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: '8px', cursor: 'pointer', padding: 0,
                transition: 'border-color 0.15s',
              }}
            >
              <span style={{ display: 'block', width: '18px', height: '1.5px', background: 'rgba(255,255,255,0.7)', transform: menuOpen ? 'rotate(45deg) translate(4.5px, 4.5px)' : 'none', transition: 'transform 0.2s' }} />
              <span style={{ display: 'block', width: '18px', height: '1.5px', background: 'rgba(255,255,255,0.7)', opacity: menuOpen ? 0 : 1, transition: 'opacity 0.2s' }} />
              <span style={{ display: 'block', width: '18px', height: '1.5px', background: 'rgba(255,255,255,0.7)', transform: menuOpen ? 'rotate(-45deg) translate(4.5px, -4.5px)' : 'none', transition: 'transform 0.2s' }} />
            </button>

            {/* Desktop hamburger-style icon (after CTA, like the reference image) */}
            <button
              className="hidden md:flex"
              style={{
                width: '40px', height: '40px', alignItems: 'center', justifyContent: 'center',
                background: 'transparent', border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: '8px', cursor: 'pointer', padding: 0,
                flexDirection: 'column', gap: '5px',
                transition: 'border-color 0.15s, background 0.15s',
              }}
              aria-label="Více"
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.25)';
                (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.04)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.12)';
                (e.currentTarget as HTMLElement).style.background = 'transparent';
              }}
            >
              <span style={{ display: 'block', width: '16px', height: '1.5px', background: 'rgba(255,255,255,0.6)' }} />
              <span style={{ display: 'block', width: '16px', height: '1.5px', background: 'rgba(255,255,255,0.6)' }} />
              <span style={{ display: 'block', width: '16px', height: '1.5px', background: 'rgba(255,255,255,0.6)' }} />
            </button>
          </div>
        </div>

        {/* Mobile dropdown */}
        <div style={{
          overflow: 'hidden',
          maxHeight: menuOpen ? '420px' : '0',
          transition: 'max-height 0.3s ease',
          borderTop: menuOpen ? '1px solid rgba(255,255,255,0.05)' : 'none',
        }} className="md:hidden">
          <div style={{ padding: '12px 20px 20px', background: '#060d1a' }}>
            {LINKS.map(({ href, label }) => {
              const active = pathname === href || (href !== '/' && pathname.startsWith(href));
              return (
                <Link key={href} href={href} style={{
                  display: 'block', padding: '12px 16px', borderRadius: '10px',
                  fontSize: '14px', fontWeight: active ? 600 : 400,
                  color: active ? '#fff' : 'rgba(255,255,255,0.5)',
                  background: active ? 'rgba(37,99,235,0.1)' : 'transparent',
                  textDecoration: 'none', marginBottom: '2px',
                  borderLeft: active ? '2px solid #2563eb' : '2px solid transparent',
                  transition: 'color 0.15s',
                }}>
                  {label}
                </Link>
              );
            })}
            <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
              <Link href="/kontakt" style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                padding: '13px', background: '#2563eb', color: '#fff',
                borderRadius: '10px', fontSize: '14px', fontWeight: 600, textDecoration: 'none',
              }}>
                Kontaktujte nás
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
