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
    /* relative + z-[10] — nutné pro homepage: fixed 3D canvas má z-index 2,
       footer musí být nad ním, jinak ho canvas překryje */
    <footer className="bg-[#06060a] text-slate-400 relative z-[10]">
      {/* Subtle top separator */}
      <div
        aria-hidden
        className="h-px"
        style={{ background: 'linear-gradient(90deg,transparent 0%,rgba(255,255,255,.07) 30%,rgba(255,255,255,.07) 70%,transparent 100%)' }}
      />

      <div className="max-w-6xl mx-auto px-5 sm:px-8 pt-16 pb-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-14">

          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="inline-block mb-5">
              <img src="/logo.png" alt="WebsiteAgent" className="h-10 w-auto" />
            </Link>
            <p className="text-sm leading-relaxed text-slate-600 max-w-[200px]">
              Moderní weby pro lokální firmy. Rychle, na míru, bez starostí.
            </p>
          </div>

          {/* Link columns */}
          {COLS.map((col) => (
            <div key={col.title}>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-4">
                {col.title}
              </p>
              <ul className="space-y-3">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      className="text-sm text-slate-600 hover:text-slate-300 transition-colors duration-150"
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
        <div className="border-t border-white/5 pt-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-slate-700">© 2026 WebsiteAgent. Všechna práva vyhrazena.</p>
          <p className="text-xs text-slate-700">Tvoříme weby, které vydělávají.</p>
        </div>
      </div>
    </footer>
  );
}
