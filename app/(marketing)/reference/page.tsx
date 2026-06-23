'use client';

import { useRef, useEffect, useState } from 'react';
import Link from 'next/link';

const ACCENT = '#285570';
const BG = '#faf7f6';

function useReveal(delay = 0) {
  const ref = useRef<HTMLDivElement>(null);
  const [v, setV] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const o = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setV(true); o.disconnect(); } }, { threshold: 0.08 });
    o.observe(el); return () => o.disconnect();
  }, []);
  return { ref, style: { opacity: v ? 1 : 0, transform: v ? 'translateY(0)' : 'translateY(22px)', transition: `opacity 0.65s ease ${delay}ms, transform 0.65s ease ${delay}ms` } };
}

const TESTIMONIALS = [
  { name: 'Pavel Novák', company: 'Pavel Novák Instalace', obor: 'Instalatér, Praha', stars: 5, text: 'Za dva týdny od spuštění mi přišlo 12 poptávek přímo z webu. Dřív jsem byl závislý jen na doporučeních od kamarádů. Web vypadá lépe než od firem, co si účtují trojnásobek.', result: '+340% poptávek online', featured: true },
  { name: 'MUDr. Jana Procházková', company: 'Zubní ordinace Procházková', obor: 'Zubní lékařka, Brno', stars: 5, text: 'Potřebovala jsem profesionální prezentaci ordinace, ale neměla jsem čas to řešit. Max to dal dohromady za 48 hodin a přesně pochopil, co pacienti chtějí vidět.', result: '70% nových pacientů přes web', featured: false },
  { name: 'Tomáš Vávra', company: 'Kavárna Na Rohu', obor: 'Majitel kavárny, Jihlava', stars: 5, text: 'Myslel jsem si, že pro kavárnu web nepotřebuju. Mýlil jsem se. Online rezervace vzrostly o 40% a lidi nás nacházejí přes Google, kde jsme předtím vůbec nebyli.', result: '+40% rezervací online', featured: false },
  { name: 'Mgr. Radek Pospíšil', company: 'Advokátní kancelář Pospíšil', obor: 'Advokát, Praha', stars: 5, text: 'Jako advokát mi záleží na prvním dojmu. Web od WebsiteAgent vypadá přesně tak, jak si klienti prestižní kanceláře představují. Platil jsem za výsledek — a výsledek přišel.', result: 'Nárůst klientů z online vyhledávání', featured: false },
  { name: 'Petra Horáková', company: 'Fitness Centrum Olymp', obor: 'Majitelka fitness studia, Ostrava', stars: 5, text: 'Prodej permanentek přes web se ztrojnásobil. Stránka je přehledná, rychlá a zákazníci ji chválí. Líbí se mi, že jsem nemusela vůbec nic připravovat — Max vše vyřídil sám.', result: '3× více prodaných permanentek', featured: false },
  { name: 'Ing. Milan Červenka', company: 'MC Elektro', obor: 'Elektrikář, České Budějovice', stars: 5, text: 'Žádná záloha, zaplatil jsem až po schválení — to mě přesvědčilo zkusit to. Web vznikl za den a půl. Teď volají zákazníci z celého kraje, ne jen z okolí.', result: 'Poptávky z celého jihočeského kraje', featured: false },
];

function Stars({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill="#f59e0b" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
      ))}
    </div>
  );
}

type Testimonial = typeof TESTIMONIALS[0];

function TestimonialCard({ t, delay }: { t: Testimonial; delay: number }) {
  const r = useReveal(delay);
  const featuredStyle = t.featured ? {
    border: '1.5px solid rgba(40,85,112,0.22)',
    boxShadow: '0 4px 24px rgba(40,85,112,0.10)',
  } : {
    border: '1px solid #e3ded7',
  };

  return (
    <div ref={r.ref} style={{ ...r.style, background: '#fff', borderRadius: 18, display: 'flex', flexDirection: 'column', ...featuredStyle, transition: 'border-color 0.2s' }}
      className={`p-5 sm:p-7 ${t.featured ? 'md:col-span-2' : ''}`}
      onMouseEnter={e => { if (!t.featured) (e.currentTarget as HTMLElement).style.borderColor = '#cbcac7'; }}
      onMouseLeave={e => { if (!t.featured) (e.currentTarget as HTMLElement).style.borderColor = '#e3ded7'; }}>
      {t.featured && (
        <span style={{ display: 'inline-block', fontSize: 11, fontWeight: 700, color: ACCENT, background: 'rgba(40,85,112,0.07)', padding: '4px 12px', borderRadius: 20, marginBottom: 16, alignSelf: 'flex-start', border: '1px solid rgba(40,85,112,0.14)' }}>Příběh úspěchu</span>
      )}
      <Stars count={t.stars} />
      <p style={{ color: '#5c5650', lineHeight: 1.7, marginTop: 16, marginBottom: 20, flex: 1, fontSize: 14 }}>&ldquo;{t.text}&rdquo;</p>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 12, marginTop: 'auto' }} className={t.featured ? 'sm:flex-row sm:items-center sm:justify-between sm:gap-0' : ''}>
        <div>
          <p style={{ fontWeight: 600, color: '#1a2e3d', fontSize: 14 }}>{t.name}</p>
          <p style={{ color: '#cbcac7', fontSize: 12, marginTop: 2 }}>{t.obor}</p>
        </div>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, color: ACCENT, background: 'rgba(40,85,112,0.07)', padding: '6px 12px', borderRadius: 9, fontWeight: 600, border: '1px solid rgba(40,85,112,0.14)' }}>
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" /></svg>
          {t.result}
        </div>
      </div>
    </div>
  );
}

export default function ReferencePage() {
  const title = useReveal(0);
  const stats = useReveal(150);

  return (
    <div className="pt-28" style={{ background: BG }}>
      <section className="py-20 px-5 sm:px-8 text-center">
        <div className="max-w-3xl mx-auto">
          <div ref={title.ref} style={title.style}>
            <p style={{ fontSize: 11, fontWeight: 700, color: 'rgba(40,85,112,0.55)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 16 }}>Reference</p>
            <h1 style={{ fontSize: 'clamp(32px,5vw,46px)', fontWeight: 700, letterSpacing: '-0.03em', color: '#1a2e3d', marginBottom: 18 }}>Co říkají naši klienti</h1>
            <p style={{ fontSize: 17, color: '#6b6560', lineHeight: 1.65 }}>Výsledky hovoří za sebe. Tohle jsou slova lidí, kteří nám důvěřovali.</p>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="pb-16 px-5 sm:px-8">
        <div ref={stats.ref} style={{ ...stats.style, maxWidth: 720, margin: '0 auto', background: '#fff', border: '1px solid #e3ded7', borderRadius: 18 }} className="px-4 py-5 sm:px-8 sm:py-6">
          <div className="grid grid-cols-3 text-center" style={{ gap: 0 }}>
            {[['50+', 'spokojených klientů'], ['4.9/5', 'průměrné hodnocení'], ['100%', 'doporučilo by nás']].map(([val, label], i) => (
              <div key={label} className="px-2 sm:px-4" style={{ borderRight: i < 2 ? '1px solid #e3ded7' : 'none' }}>
                <p className="text-lg sm:text-2xl" style={{ fontWeight: 700, color: '#1a2e3d' }}>{val}</p>
                <p className="text-[10px] sm:text-xs" style={{ color: '#cbcac7', marginTop: 4 }}>{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials grid */}
      <section className="pb-28 px-5 sm:px-8">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-5">
          {TESTIMONIALS.map((t, i) => <TestimonialCard key={t.name} t={t} delay={i * 70} />)}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-5 sm:px-8" style={{ background: ACCENT }}>
        <div className="max-w-2xl mx-auto text-center">
          <h2 style={{ fontSize: 30, fontWeight: 700, color: '#fff', marginBottom: 14 }}>Napište svůj vlastní příběh úspěchu</h2>
          <p style={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1.65, marginBottom: 32 }}>Stačí poptávka. Zbytek nechte na nás.</p>
          <Link href="/kontakt" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#fff', color: ACCENT, fontWeight: 700, padding: '14px 32px', borderRadius: 12, fontSize: 14, textDecoration: 'none', transition: 'box-shadow 0.2s, transform 0.2s' }}
            onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.15)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
            onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'none'; }}>
            Získat web →
          </Link>
        </div>
      </section>
    </div>
  );
}
