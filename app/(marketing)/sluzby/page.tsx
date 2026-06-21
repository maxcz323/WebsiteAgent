'use client';

import { useRef, useEffect, useState, ReactNode } from 'react';
import Link from 'next/link';

const ACCENT = '#285570';
const BG = '#faf7f6';

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

type Service = { icon: ReactNode; title: string; slug: string; subtitle: string; price: string; time: string; desc: string; features: string[]; ideal: string[]; popular: boolean };

const SERVICES: Service[] = [
  {
    icon: <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" /></svg>,
    title: 'Landing page', slug: 'landing-page',
    subtitle: 'Jednostránkový web zaměřený na konverzi',
    price: 'od 9 900 Kč', time: '24–48 hodin',
    desc: 'Ideální pro živnostníky, řemeslníky a specialisty. Jedna stránka, která obsahuje vše co zákazník potřebuje vědět — kdo jste, co děláte, proč si vybrat vás a jak vás kontaktovat.',
    features: ['Responzivní design (mobil, tablet, desktop)', 'Hero sekce s CTA tlačítkem', 'Popis služeb a výhod', 'Reference a hodnocení', 'Kontaktní formulář', 'Základní SEO optimalizace', 'Rychlost nad 90/100 v Google PageSpeed'],
    ideal: ['Instalatéři a řemeslníci', 'Terapeuti a specialisté', 'Fotografové a kreativci', 'Jednoduché provozovny'],
    popular: false,
  },
  {
    icon: <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>,
    title: 'Firemní web', slug: 'firemni-web',
    subtitle: 'Kompletní prezentace vaší firmy',
    price: 'od 14 900 Kč', time: '48–72 hodin',
    desc: 'Pro firmy, které potřebují víc než jednu stránku. Kompletní web s detailním popisem služeb, galeriemi realizací, týmem a vším co zákazníci hledají.',
    features: ['3–5 samostatných stránek', 'Galerie realizací a projektů', 'Stránka O nás s týmem', 'Blog / aktuality', 'Více kontaktních formulářů', 'Pokročilá SEO optimalizace', 'Google Analytics integrace', 'Propojení se sociálními sítěmi'],
    ideal: ['Restaurace a kavárny', 'Kosmetické salony', 'Poradenské firmy', 'Profesní kanceláře'],
    popular: true,
  },
  {
    icon: <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" /><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" /></svg>,
    title: 'E-commerce řešení', slug: 'ecommerce',
    subtitle: 'Plnohodnotný online obchod',
    price: 'od 24 900 Kč', time: '5–7 dní',
    desc: 'Prodávejte online s profesionálním e-shopem. Správa produktů, košík, platební brána a automatické notifikace — vše co potřebujete ke spuštění online prodeje.',
    features: ['Neomezený počet produktů', 'Košík a pokladna', 'Platební brána (karta, převod)', 'Správa objednávek', 'Automatické emaily zákazníkům', 'Slevové kupóny', 'Mobilní optimalizace', 'Integrace dopravců'],
    ideal: ['Řemeslníci s produkty', 'Producenti potravin', 'Módní návrháři', 'Lokální obchodníci'],
    popular: false,
  },
  {
    icon: <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3" /><path d="M19.07 4.93l-1.41 1.41M5.34 18.66l-1.41 1.41M22 12h-2M4 12H2M19.07 19.07l-1.41-1.41M5.34 5.34L3.93 3.93M12 22v-2M12 4V2" /></svg>,
    title: 'Správa a údržba', slug: 'sprava',
    subtitle: 'Pravidelná péče o váš web',
    price: 'od 990 Kč / měs', time: 'Průběžně',
    desc: 'Zajistíme, aby váš web fungoval bez výpadků, byl vždy aktuální a bezpečný. Vy se soustředíte na podnikání, techniku vyřešíme za vás.',
    features: ['Měsíční zálohy webu', 'Aktualizace systémů a pluginů', 'Monitorování dostupnosti 24/7', 'Měsíční reporty návštěvnosti', 'Drobné textové úpravy zdarma', 'Technická podpora do 24h', 'SSL certifikát', 'Bezpečnostní skenování'],
    ideal: ['Každý, kdo má web', 'Firmy bez IT oddělení', 'Zaneprázdnění podnikatelé', 'Kdokoli kdo nechce řešit techniku'],
    popular: false,
  },
];

function ServiceCard({ s, delay }: { s: Service; delay: number }) {
  const r = useReveal(delay);
  return (
    <div ref={r.ref} style={{
      ...r.style, position: 'relative',
      background: '#fff',
      border: s.popular ? `1.5px solid ${ACCENT}` : '1px solid #e3ded7',
      borderRadius: 18, padding: '32px 40px',
      boxShadow: s.popular ? '0 4px 32px rgba(40,85,112,0.10)' : '0 2px 12px rgba(40,85,112,0.04)',
    }}>
      {s.popular && (
        <div style={{ position: 'absolute', top: -12, left: 32 }}>
          <span style={{ background: ACCENT, color: '#fff', fontSize: 11, fontWeight: 700, padding: '4px 14px', borderRadius: 20 }}>Nejoblíbenější</span>
        </div>
      )}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-10">
        <div>
          <div className="flex items-start gap-4 mb-5">
            <div style={{ width: 48, height: 48, borderRadius: 14, background: 'rgba(40,85,112,0.07)', border: '1px solid rgba(40,85,112,0.13)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: ACCENT, flexShrink: 0 }}>
              {s.icon}
            </div>
            <div>
              <h2 style={{ fontSize: 22, fontWeight: 700, color: '#1a2e3d' }}>{s.title}</h2>
              <p style={{ color: '#a8a4a0', fontSize: 14, marginTop: 2 }}>{s.subtitle}</p>
            </div>
          </div>
          <p style={{ color: '#5c5650', lineHeight: 1.7, marginBottom: 24 }}>{s.desc}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {s.features.map((f) => (
              <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, color: '#5c5650' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={ACCENT} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                {f}
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-col justify-between">
          <div style={{ background: BG, borderRadius: 14, border: '1px solid #e3ded7', padding: 24 }}>
            <p style={{ fontSize: 28, fontWeight: 700, color: '#1a2e3d', marginBottom: 4, fontFamily: 'var(--font-display)' }}>{s.price}</p>
            <p style={{ fontSize: 13, color: '#a8a4a0', marginBottom: 20 }}>Hotovo za: <strong style={{ color: '#1a2e3d' }}>{s.time}</strong></p>
            <div style={{ marginBottom: 20 }}>
              <p style={{ fontSize: 11, fontWeight: 600, color: '#cbcac7', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>Ideální pro</p>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {s.ideal.map((id) => (
                  <li key={id} style={{ fontSize: 13, color: '#5c5650', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ width: 5, height: 5, borderRadius: '50%', background: ACCENT, flexShrink: 0 }} />
                    {id}
                  </li>
                ))}
              </ul>
            </div>
            <Link href={`/kalkulace/${s.slug}`} style={{
              display: 'block', textAlign: 'center', background: ACCENT, color: '#fff',
              fontWeight: 700, padding: '12px 20px', borderRadius: 12, fontSize: 14,
              textDecoration: 'none', transition: 'background 0.15s, transform 0.15s',
            }}
              onMouseEnter={e => { e.currentTarget.style.background = '#1a3446'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = ACCENT; e.currentTarget.style.transform = 'none'; }}>
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
    <div className="pt-28" style={{ background: BG }}>
      <section className="py-20 px-5 sm:px-8 text-center">
        <div className="max-w-3xl mx-auto">
          <div ref={title.ref} style={title.style}>
            <p style={{ fontSize: 11, fontWeight: 700, color: 'rgba(40,85,112,0.55)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 16 }}>Naše služby</p>
            <h1 style={{ fontSize: 'clamp(32px,5vw,46px)', fontWeight: 700, letterSpacing: '-0.03em', color: '#1a2e3d', marginBottom: 18, lineHeight: 1.15, fontFamily: 'var(--font-display)' }}>
              Web na míru pro každou firmu
            </h1>
            <p style={{ fontSize: 17, color: '#6b6560', lineHeight: 1.65 }}>
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

      <section className="py-20 px-5 sm:px-8" style={{ background: ACCENT }}>
        <div className="max-w-3xl mx-auto text-center">
          <h2 style={{ fontSize: 'clamp(22px,3.5vw,30px)', fontWeight: 700, color: '#fff', marginBottom: 12, fontFamily: 'var(--font-display)' }}>Platíte až po schválení</h2>
          <p style={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1.65, marginBottom: 32 }}>Žádná záloha. Nejdřív uvidíte výsledek, pak rozhodnete. Pokud web neschválíte, neplatíte nic.</p>
          <Link href="/kontakt" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#fff', color: ACCENT, fontWeight: 700, padding: '14px 32px', borderRadius: 12, fontSize: 14, textDecoration: 'none', transition: 'box-shadow 0.2s, transform 0.2s' }}
            onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.15)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
            onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'none'; }}>
            Začít zdarma →
          </Link>
        </div>
      </section>
    </div>
  );
}
