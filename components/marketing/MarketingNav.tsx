'use client';

import { useState, useEffect, useRef } from 'react';
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

function isActive(href: string, pathname: string) {
  if (href === '/') return pathname === '/';
  return pathname === href || pathname.startsWith(href + '/');
}

export function MarketingNav() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [indicator, setIndicator] = useState({ left: 0, width: 0, visible: false });
  const navRef = useRef<HTMLElement>(null);
  const linkRefs = useRef<(HTMLAnchorElement | null)[]>([]);

  useEffect(() => { setMenuOpen(false); }, [pathname]);

  useEffect(() => {
    const measure = () => {
      const idx = LINKS.findIndex(({ href }) => isActive(href, pathname));
      if (idx < 0) { setIndicator(p => ({ ...p, visible: false })); return; }
      const el = linkRefs.current[idx];
      const nav = navRef.current;
      if (!el || !nav) return;
      const nr = nav.getBoundingClientRect();
      const er = el.getBoundingClientRect();
      if (nr.width === 0) return; // nav not laid out yet
      setIndicator({ left: er.left - nr.left, width: er.width, visible: true });
    };
    // Double rAF ensures layout is fully painted before measuring
    const id = requestAnimationFrame(() => requestAnimationFrame(measure));
    return () => cancelAnimationFrame(id);
  }, [pathname]);

  return (
    <nav ref={navRef} style={{
      position: 'fixed', top: '16px', left: '50%', transform: 'translateX(-50%)',
      width: 'calc(100% - 48px)', maxWidth: '1140px', zIndex: 50,
      background: '#060d1a',
      border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: '14px',
      boxShadow: '0 8px 40px rgba(0,0,0,0.55)',
      overflow: 'hidden',
    }}>

      {/* Sliding bottom indicator */}
      <span aria-hidden style={{
        position: 'absolute', bottom: 0,
        left: indicator.left, width: indicator.width,
        height: '2px',
        background: '#ffffff',
        borderRadius: '2px 2px 0 0',
        opacity: indicator.visible ? 1 : 0,
        transition: 'left 0.35s cubic-bezier(0.4,0,0.2,1), width 0.35s cubic-bezier(0.4,0,0.2,1), opacity 0.2s',
        pointerEvents: 'none',
      }} />

      {/* Main bar */}
      <div style={{
        padding: '0 24px', height: '64px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px',
      }}>

        {/* Logo */}
        <Link href="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', flexShrink: 0 }}>
          <img src="/logo.png" alt="WebsiteAgent" style={{ height: '34px', width: 'auto' }} />
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex" style={{ alignItems: 'center', gap: '2px', flex: 1, justifyContent: 'center' }}>
          {LINKS.map(({ href, label }, i) => {
            const active = isActive(href, pathname);
            return (
              <Link
                key={href}
                href={href}
                ref={el => { linkRefs.current[i] = el; }}
                style={{
                  padding: '8px 15px',
                  fontSize: '13.5px',
                  fontWeight: active ? 600 : 400,
                  fontFamily: 'var(--font-display)',
                  letterSpacing: '-0.01em',
                  color: active ? '#fff' : 'rgba(255,255,255,0.4)',
                  textDecoration: 'none',
                  whiteSpace: 'nowrap',
                  transition: 'color 0.15s',
                }}
                onMouseEnter={e => { if (!active) (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.8)'; }}
                onMouseLeave={e => { if (!active) (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.4)'; }}
              >
                {label}
              </Link>
            );
          })}
        </div>

        {/* CTA + mobile toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
          <Link
            href="/kontakt"
            className="hidden sm:inline-flex"
            style={{
              alignItems: 'center', gap: '7px',
              padding: '9px 20px',
              background: '#2563eb', color: '#fff',
              fontSize: '13.5px', fontWeight: 600,
              borderRadius: '9px', textDecoration: 'none',
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
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen(v => !v)}
            className="md:hidden"
            aria-label="Menu"
            style={{
              width: '38px', height: '38px', display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center', gap: '5px',
              background: 'transparent', border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: '8px', cursor: 'pointer', padding: 0,
            }}
          >
            <span style={{ display: 'block', width: '16px', height: '1.5px', background: 'rgba(255,255,255,0.7)', transform: menuOpen ? 'rotate(45deg) translate(4px,4px)' : 'none', transition: 'transform 0.2s' }} />
            <span style={{ display: 'block', width: '16px', height: '1.5px', background: 'rgba(255,255,255,0.7)', opacity: menuOpen ? 0 : 1, transition: 'opacity 0.2s' }} />
            <span style={{ display: 'block', width: '16px', height: '1.5px', background: 'rgba(255,255,255,0.7)', transform: menuOpen ? 'rotate(-45deg) translate(4px,-4px)' : 'none', transition: 'transform 0.2s' }} />
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      <div style={{
        overflow: 'hidden',
        maxHeight: menuOpen ? '400px' : '0',
        transition: 'max-height 0.3s ease',
        borderTop: menuOpen ? '1px solid rgba(255,255,255,0.06)' : 'none',
      }}>
        <div style={{ padding: '10px 16px 16px' }}>
          {LINKS.map(({ href, label }) => {
            const active = isActive(href, pathname);
            return (
              <Link key={href} href={href} style={{
                display: 'block', padding: '11px 14px', borderRadius: '9px',
                fontSize: '14px', fontWeight: active ? 600 : 400,
                fontFamily: 'var(--font-display)',
                color: active ? '#fff' : 'rgba(255,255,255,0.5)',
                background: active ? 'rgba(37,99,235,0.1)' : 'transparent',
                borderLeft: active ? '2px solid #2563eb' : '2px solid transparent',
                textDecoration: 'none', marginBottom: '2px',
              }}>
                {label}
              </Link>
            );
          })}
          <div style={{ marginTop: '10px', paddingTop: '10px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
            <Link href="/kontakt" style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              padding: '12px', background: '#2563eb', color: '#fff',
              borderRadius: '9px', fontSize: '14px', fontWeight: 600, textDecoration: 'none',
            }}>
              Kontaktujte nás
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
