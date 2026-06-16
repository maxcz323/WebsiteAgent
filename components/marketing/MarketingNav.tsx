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
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [pathname]);

  return (
    <>
      <nav
        style={{ transition: 'background 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease' }}
        className={`fixed top-0 left-0 right-0 z-50 ${scrolled ? 'bg-white/96 backdrop-blur-md border-b border-slate-100 shadow-sm' : 'bg-transparent border-b border-transparent'}`}
      >
        <div className="max-w-6xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center shrink-0">
            <img src="/logo.png" alt="WebsiteAgent" className="h-11 w-auto" />
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-1">
            {LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                  pathname === href
                    ? 'text-slate-900 bg-slate-100'
                    : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                {label}
              </Link>
            ))}
          </div>

          {/* CTA + mobile toggle */}
          <div className="flex items-center gap-3">
            <Link
              href="/kontakt"
              className="hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold bg-[#2563EB] hover:bg-blue-700 text-white px-4 py-2 rounded-xl transition-all duration-200 hover:shadow-md hover:-translate-y-px"
            >
              Získat web
            </Link>
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="md:hidden w-9 h-9 flex flex-col items-center justify-center gap-1.5 rounded-lg hover:bg-slate-100 transition-colors"
              aria-label="Menu"
            >
              <span className={`block w-5 h-0.5 bg-slate-700 transition-all duration-200 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
              <span className={`block w-5 h-0.5 bg-slate-700 transition-all duration-200 ${menuOpen ? 'opacity-0' : ''}`} />
              <span className={`block w-5 h-0.5 bg-slate-700 transition-all duration-200 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ${menuOpen ? 'max-h-96 border-b border-slate-100 bg-white' : 'max-h-0'}`}
        >
          <div className="px-5 py-4 space-y-1">
            {LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`block px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${pathname === href ? 'bg-slate-100 text-slate-900' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
              >
                {label}
              </Link>
            ))}
            <div className="pt-2">
              <Link href="/kontakt" className="block text-center text-sm font-semibold bg-[#2563EB] text-white px-4 py-3 rounded-xl">
                Získat web
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
