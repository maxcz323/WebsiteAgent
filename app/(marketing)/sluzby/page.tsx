'use client';

import { useRef, useEffect, useState, ReactNode } from 'react';
import Link from 'next/link';

function useReveal(delay = 0) {
  const ref = useRef<HTMLDivElement>(null);
  const [v, setV] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const o = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setV(true); o.disconnect(); } }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
    o.observe(el); return () => o.disconnect();
  }, []);
  return { ref, style: { opacity: v ? 1 : 0, transform: v ? 'translateY(0)' : 'translateY(22px)', transition: `opacity 0.65s ease ${delay}ms, transform 0.65s ease ${delay}ms` } };
}

type Service = { icon: ReactNode; title: string; slug: string; subtitle: string; price: string; time: string; desc: string; features: string[]; ideal: string[]; color: string; badge: string | null };

const SERVICES: Service[] = [
  {
    icon: <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" /></svg>,
    title: 'Landing page',
    slug: 'landing-page',
    subtitle: 'Jednostránkový web zaměřený na konverzi',
    price: 'od 9 900 Kč',
    time: '24–48 hodin',
    desc: 'Ideální pro živnostníky, řemeslníky a specialisty. Jedna stránka, která obsahuje vše co zákazník potřebuje vědět — kdo jste, co děláte, proč si vybrat vás a jak vás kontaktovat.',
    features: ['Responzivní design (mobil, tablet, desktop)', 'Hero sekce s CTA tlačítkem', 'Popis služeb a výhod', 'Reference a hodnocení', 'Kontaktní formulář', 'Základní SEO optimalizace', 'Rychlost nad 90/100 v Google PageSpeed'],
    ideal: ['Instalatéři a řemeslníci', 'Terapeuti a specialisté', 'Fotografové a kreativci', 'Jednoduché provozovny'],
    color: 'border-blue-200 bg-gradient-to-br from-blue-50 to-white',
    badge: null,
  },
  {
    icon: <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>,
    title: 'Firemní web',
    slug: 'firemni-web',
    subtitle: 'Kompletní prezentace vaší firmy',
    price: 'od 14 900 Kč',
    time: '48–72 hodin',
    desc: 'Pro firmy, které potřebují víc než jednu stránku. Kompletní web s detailním popisem služeb, galeriemi realizací, týmem a vším co zákazníci hledají.',
    features: ['3–5 samostatných stránek', 'Galerie realizací a projektů', 'Stránka O nás s týmem', 'Blog / aktuality', 'Více kontaktních formulářů', 'Pokročilá SEO optimalizace', 'Google Analytics integrace', 'Propojení se sociálními sítěmi'],
    ideal: ['Restaurace a kavárny', 'Kosmetické salony', 'Poradenské firmy', 'Profesní kanceláře'],
    color: 'border-violet-300 bg-gradient-to-br from-violet-50 to-white',
    badge: 'Nejoblíbenější',
  },
  {
    icon: <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" /><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" /></svg>,
    title: 'E-commerce řešení',
    slug: 'ecommerce',
    subtitle: 'Plnohodnotný online obchod',
    price: 'od 24 900 Kč',
    time: '5–7 dní',
    desc: 'Prodávejte online s profesionálním e-shopem. Správa produktů, košík, platební brána a automatické notifikace — vše co potřebujete ke spuštění online prodeje.',
    features: ['Neomezený počet produktů', 'Košík a pokladna', 'Platební brána (karta, převod)', 'Správa objednávek', 'Automatické emaily zákazníkům', 'Slevové kupóny', 'Mobilní optimalizace', 'Integrace dopravců'],
    ideal: ['Řemeslníci s produkty', 'Producenti potravin', 'Módní návrháři', 'Lokální obchodníci'],
    color: 'border-emerald-200 bg-gradient-to-br from-emerald-50 to-white',
    badge: null,
  },
  {
    icon: <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3" /><path d="M19.07 4.93l-1.41 1.41M5.34 18.66l-1.41 1.41M22 12h-2M4 12H2M19.07 19.07l-1.41-1.41M5.34 5.34L3.93 3.93M12 22v-2M12 4V2" /></svg>,
    title: 'Správa a údržba',
    slug: 'sprava',
    subtitle: 'Pravidelná péče o váš web',
    price: 'od 990 Kč / měs',
    time: 'Průběžně',
    desc: 'Zajistíme, aby váš web fungoval bez výpadků, byl vždy aktuální a bezpečný. Vy se soustředíte na podnikání, techniku vyřešíme za vás.',
    features: ['Měsíční zálohy webu', 'Aktualizace systémů a pluginů', 'Monitorování dostupnosti 24/7', 'Měsíční reporty návštěvnosti', 'Drobné textové úpravy zdarma', 'Technická podpora do 24h', 'SSL certifikát', 'Bezpečnostní skenování'],
    ideal: ['Každý, kdo má web', 'Firmy bez IT oddělení', 'Zaneprázdnění podnikatelé', 'Kdokoli kdo nechce řešit techniku'],
    color: 'border-amber-200 bg-gradient-to-br from-amber-50 to-white',
    badge: null,
  },
];

function ServiceCard({ s, delay }: { s: Service; delay: number }) {
  const r = useReveal(delay);
  return (
    <div ref={r.ref} style={r.style} className={`relative rounded-2xl border-2 p-8 md:p-10 ${s.color}`}>
      {s.badge && (
        <div className="absolute -top-3 left-8">
          <span className="bg-violet-600 text-white text-xs font-bold px-3 py-1 rounded-full">{s.badge}</span>
        </div>
      )}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-10">
        <div>
          <div className="flex items-start gap-4 mb-5">
            <div className="w-12 h-12 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center justify-center text-slate-600 shrink-0">
              {s.icon}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900">{s.title}</h2>
              <p className="text-slate-500 text-sm mt-0.5">{s.subtitle}</p>
            </div>
          </div>
          <p className="text-slate-600 leading-relaxed mb-7">{s.desc}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {s.features.map((f) => (
              <div key={f} className="flex items-center gap-2.5 text-sm text-slate-600">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                {f}
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-col justify-between">
          <div className="bg-white rounded-xl border border-slate-100 p-6 shadow-sm">
            <p className="text-3xl font-bold text-slate-900 mb-1" style={{ fontFamily: 'var(--font-display)' }}>{s.price}</p>
            <p className="text-sm text-slate-400 mb-5">Hotovo za: <strong className="text-slate-600">{s.time}</strong></p>
            <div className="mb-5">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">Ideální pro</p>
              <ul className="space-y-1.5">
                {s.ideal.map((id) => (
                  <li key={id} className="text-sm text-slate-600 flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full bg-blue-400 shrink-0" />
                    {id}
                  </li>
                ))}
              </ul>
            </div>
            <Link href={`/kalkulace/${s.slug}`} className="block text-center bg-slate-900 hover:bg-blue-700 text-white font-semibold py-3 px-5 rounded-xl text-sm transition-all duration-200 hover:-translate-y-px hover:shadow-md">
              Spočítat cenu →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SluzbyPage() {
  const title = useReveal(0);

  return (
    <div className="pt-28">
      <section className="py-20 px-5 sm:px-8 text-center">
        <div className="max-w-3xl mx-auto">
          <div ref={title.ref} style={title.style}>
            <p className="text-xs font-semibold text-blue-600 uppercase tracking-widest mb-4">Naše služby</p>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-slate-900 mb-5 leading-tight" style={{ fontFamily: 'var(--font-display)' }}>
              Web na míru pro každou firmu
            </h1>
            <p className="text-lg text-slate-500 leading-relaxed">
              Ať podnikáte v čemkoli — máme řešení přesně pro vás. Jasné ceny, žádné skryté poplatky, platíte až po schválení.
            </p>
          </div>
        </div>
      </section>

      <section className="pb-28 px-5 sm:px-8">
        <div className="max-w-6xl mx-auto space-y-6">
          {SERVICES.map((s, i) => <ServiceCard key={s.title} s={s} delay={i * 80} />)}
        </div>
      </section>

      <section className="py-20 px-5 sm:px-8" style={{ background: '#0f1629' }}>
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3" style={{ fontFamily: 'var(--font-display)' }}>Platíte až po schválení</h2>
          <p className="text-slate-400 leading-relaxed mb-8">Žádná záloha. Nejdřív uvidíte výsledek, pak rozhodnete. Pokud web neschválíte, neplatíte nic.</p>
          <Link href="/kontakt" className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold px-7 py-3.5 rounded-xl text-sm transition-all duration-200 hover:-translate-y-px hover:shadow-xl hover:shadow-blue-500/25">
            Začít zdarma →
          </Link>
        </div>
      </section>
    </div>
  );
}
