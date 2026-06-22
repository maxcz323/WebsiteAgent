'use client';

import Link from 'next/link';
import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useTheme } from '@/components/ThemeProvider';
import { useProfile } from '@/components/ProfileContext';
import { supabaseBrowser } from '@/lib/supabase-browser';

const NAV_LINKS = [
  { href: '/admin/dashboard', label: 'Přehled' },
  { href: '/admin/team', label: 'Tým' },
  { href: '/changelog', label: 'Changelog' },
];

function SunIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

function HamburgerIcon({ open }: { open: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {open ? (
        <>
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </>
      ) : (
        <>
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </>
      )}
    </svg>
  );
}

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, toggle } = useTheme();
  const { name: userName } = useProfile();
  const [mobileOpen, setMobileOpen] = useState(false);

  async function handleLogout() {
    await supabaseBrowser().auth.signOut();
    router.push('/login');
    router.refresh();
  }

  return (
    <nav style={{ backgroundColor: '#0f1629' }} className="border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-14 gap-4 sm:gap-8">
          <Link href="/dashboard" className="flex items-center gap-2 shrink-0">
            <img src="/logo.png" alt="WebsiteAgent" className="h-9 w-auto" />
            <span className="text-white/20 font-mono text-[10px] hidden sm:inline">v4.19</span>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden sm:flex gap-0.5 flex-1">
            {NAV_LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                  pathname === href
                    ? 'bg-blue-600/20 text-blue-300 border border-blue-500/20'
                    : 'text-white/50 hover:text-white/80 hover:bg-white/5'
                }`}
              >
                {label}
              </Link>
            ))}
          </div>

          {/* Desktop right side */}
          <div className="hidden sm:flex items-center gap-2">
            <Link href="/admin/leads/new" className="text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded-lg transition-colors">
              + Nový lead
            </Link>
            <button
              onClick={toggle}
              className="text-white/40 hover:text-white/80 transition-colors p-1.5 rounded-md hover:bg-white/5"
              title={theme === 'light' ? 'Přepnout na tmavý režim' : 'Přepnout na světlý režim'}
            >
              {theme === 'light' ? <MoonIcon /> : <SunIcon />}
            </button>
            <Link
              href="/admin/settings"
              className={`text-xs font-medium transition-colors px-2 py-1.5 rounded-md hover:bg-white/5 ${pathname === '/settings' ? 'text-white/80' : 'text-white/40 hover:text-white/70'}`}
              title="Nastavení"
            >
              {userName || '⚙'}
            </Link>
            <button onClick={handleLogout} className="text-xs text-white/30 hover:text-white/60 transition-colors px-2 py-1 rounded">
              Odhlásit
            </button>
          </div>

          {/* Mobile right side */}
          <div className="flex sm:hidden items-center gap-2 ml-auto">
            <Link href="/admin/leads/new" className="text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded-lg transition-colors">
              + Lead
            </Link>
            <button
              onClick={() => setMobileOpen((v) => !v)}
              className="text-white/50 hover:text-white/80 transition-colors p-1.5 rounded-md hover:bg-white/5"
            >
              <HamburgerIcon open={mobileOpen} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      {mobileOpen && (
        <div className="sm:hidden border-t border-white/5" style={{ backgroundColor: '#0f1629' }}>
          <div className="px-4 pt-2 pb-4 space-y-0.5">
            {NAV_LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setMobileOpen(false)}
                className={`block px-3 py-2.5 rounded-md text-sm font-medium transition-all ${
                  pathname === href
                    ? 'bg-blue-600/20 text-blue-300'
                    : 'text-white/60 hover:text-white/90 hover:bg-white/5'
                }`}
              >
                {label}
              </Link>
            ))}
            <div className="pt-3 mt-3 border-t border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  onClick={toggle}
                  className="text-white/40 hover:text-white/80 transition-colors p-1.5 rounded-md hover:bg-white/5"
                >
                  {theme === 'light' ? <MoonIcon /> : <SunIcon />}
                </button>
                <Link
                  href="/admin/settings"
                  onClick={() => setMobileOpen(false)}
                  className="text-xs font-medium text-white/40 hover:text-white/70 px-2 py-1.5 rounded-md hover:bg-white/5 transition-colors"
                >
                  {userName || 'Nastavení'}
                </Link>
              </div>
              <button onClick={handleLogout} className="text-xs text-white/30 hover:text-white/60 transition-colors px-2 py-1 rounded">
                Odhlásit
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
