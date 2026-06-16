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
    <footer className="bg-[#0a0f1e] text-slate-400">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 pt-16 pb-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-14">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="mb-4">
              <img src="/logo.png" alt="WebsiteAgent" className="h-10 w-auto" />
            </div>
            <p className="text-sm leading-relaxed text-slate-500 max-w-[200px]">
              Moderní weby pro lokální firmy. Rychle, na míru, bez starostí.
            </p>
          </div>

          {/* Columns */}
          {COLS.map((col) => (
            <div key={col.title}>
              <p className="text-xs font-semibold text-slate-300 uppercase tracking-widest mb-4">{col.title}</p>
              <ul className="space-y-3">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link href={l.href} className="text-sm text-slate-500 hover:text-slate-200 transition-colors">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-white/5 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-600">© 2026 WebsiteAgent. Všechna práva vyhrazena.</p>
          <p className="text-xs text-slate-600">Tvoříme weby, které vydělávají.</p>
        </div>
      </div>
    </footer>
  );
}
