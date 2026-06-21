'use client';

import { useRef, useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, useScroll, useTransform, useInView, AnimatePresence } from 'framer-motion';

/* ─── Shared ──────────────────────────────────────────────────── */
const BG = '#060d1a';
const CARD: React.CSSProperties = {
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: '18px', padding: '28px',
  boxShadow: '0 4px 24px rgba(0,0,0,0.28)',
};

/* Disable sticky + reset heights on mobile so content flows normally */
const MOBILE_RESET = `
  @media(max-width:767px){
    .sp-outer{height:auto!important}
    .sp-inner{position:relative!important;height:auto!important;overflow:visible!important;padding:100px 24px 80px!important;align-items:flex-start!important}
  }
`;

/* ─── Grain ───────────────────────────────────────────────────── */
function Grain() {
  return (
    <div aria-hidden style={{
      position: 'fixed', inset: 0, zIndex: 990, pointerEvents: 'none', opacity: 0.03,
      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 512 512'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
      backgroundSize: '256px 256px',
    }} />
  );
}

/* ─── CursorBlob ──────────────────────────────────────────────── */
function CursorBlob() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const c = { x: -400, y: -400 }, t = { x: -400, y: -400 };
    let raf: number;
    const fn = (e: MouseEvent) => { t.x = e.clientX; t.y = e.clientY; };
    window.addEventListener('mousemove', fn, { passive: true });
    const tick = () => {
      c.x += (t.x - c.x) * 0.06; c.y += (t.y - c.y) * 0.06;
      if (ref.current) ref.current.style.transform = `translate(${c.x - 350}px,${c.y - 350}px)`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => { window.removeEventListener('mousemove', fn); cancelAnimationFrame(raf); };
  }, []);
  return (
    <div ref={ref} aria-hidden style={{
      position: 'fixed', top: 0, left: 0, zIndex: 1, pointerEvents: 'none',
      width: '700px', height: '700px', borderRadius: '50%', willChange: 'transform',
      background: 'radial-gradient(circle, rgba(37,99,235,0.05) 0%, transparent 70%)',
    }} />
  );
}

/* ─── HERO ────────────────────────────────────────────────────── */
const STATS = [
  { n: '48h',  l: 'Průměrné dodání' },
  { n: '50+',  l: 'Hotových webů' },
  { n: '0 Kč', l: 'Záloha předem' },
  { n: '100%', l: 'Spokojených klientů' },
];

function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      <img
        src="https://images.unsplash.com/photo-1547658719-da2b51169166?w=1800&q=80&auto=format&fit=crop"
        alt=""
        className="absolute inset-0 w-full h-full object-cover scale-105"
      />
      <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(6,13,26,0.88) 0%, rgba(6,13,26,0.72) 50%, rgba(6,13,26,0.97) 100%)' }} />
      <div className="relative z-10 w-full max-w-6xl mx-auto px-5 sm:px-8" style={{ paddingTop: '160px', paddingBottom: '80px' }}>

        <motion.h1
          initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          style={{ fontFamily: 'var(--font-display)', fontWeight: 300, letterSpacing: '-0.04em', lineHeight: 0.95, color: '#fff', fontSize: 'clamp(48px,8vw,96px)', marginBottom: '28px' }}
        >
          Web, který<br />prodává.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.22 }}
          style={{ fontSize: '18px', lineHeight: 1.65, color: 'rgba(255,255,255,0.5)', maxWidth: '380px', marginBottom: '40px' }}
        >
          Moderní weby pro lokální firmy.<br />
          <span style={{ color: 'rgba(255,255,255,0.28)' }}>Platíte až po schválení. Záloha 0 Kč.</span>
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.32 }}
          className="flex flex-col sm:flex-row gap-3" style={{ marginBottom: '64px' }}
        >
          <Link href="/kontakt" className="btn-mkt-primary">
            Chci web pro svou firmu
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
          </Link>
          <Link href="/jak-pracujeme" className="btn-mkt-ghost">Jak to funguje</Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-10 border-t"
          style={{ borderColor: 'rgba(255,255,255,0.08)' }}
        >
          {STATS.map(s => (
            <div key={s.l} className="text-center">
              <p style={{ fontSize: '28px', fontWeight: 700, color: '#fff', letterSpacing: '-0.03em', marginBottom: '4px' }}>{s.n}</p>
              <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.32)' }}>{s.l}</p>
            </div>
          ))}
        </motion.div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 pointer-events-none" style={{ opacity: 0.3 }}>
        <div style={{ width: '20px', height: '32px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.4)', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: '6px' }}>
          <motion.div style={{ width: '4px', height: '6px', borderRadius: '2px', background: '#fff' }}
            animate={{ y: [0, 10, 0] }} transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }} />
        </div>
      </div>
    </section>
  );
}

/* ─── SERVICES ── scroll-pinned, cards fly L / bottom / R ──────── */
const SERVICES = [
  {
    title: 'Landing page', price: 'od 9 900 Kč', href: '/kalkulace/landing-page',
    desc: 'Jednostránkový web zaměřený na konverze. Rychlý, přehledný, funkční.',
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>,
  },
  {
    title: 'Firemní web', price: 'od 14 900 Kč', href: '/kalkulace/firemni-web',
    desc: 'Kompletní online prezentace firmy. Více stránek, CMS, analytics.',
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  },
  {
    title: 'E-commerce', price: 'od 24 900 Kč', href: '/kalkulace/ecommerce',
    desc: 'Online obchod s košíkem a platební bránou. Připraveno na prodej.',
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>,
  },
];

function ServicesSection() {
  const outerRef = useRef<HTMLDivElement>(null);
  const inView = useInView(outerRef, { once: false, amount: 0.15 });
  const E = (delay = 0) => ({ duration: 0.9, ease: [0.22, 1, 0.36, 1] as any, delay: inView ? delay : 0 });

  return (
    <div ref={outerRef} style={{ background: BG, padding: '112px 24px' }}>
        <div style={{ maxWidth: '1080px', margin: '0 auto' }}>

            <motion.div
              animate={{ opacity: inView ? 1 : 0, x: inView ? 0 : -80 }}
              transition={E(0)}
              className="mb-10"
            >
              <p style={{ fontSize: '11px', fontWeight: 600, color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase', letterSpacing: '0.16em', marginBottom: '14px' }}>Naše služby</p>
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(26px,3.8vw,50px)', fontWeight: 300, color: '#fff', letterSpacing: '-0.03em', lineHeight: 1.1, margin: 0 }}>
                  Co vytvoříme<br />pro vaši firmu
                </h2>
                <Link href="/sluzby" style={{ fontSize: '13px', fontWeight: 600, color: 'rgba(255,255,255,0.3)', textDecoration: 'none', whiteSpace: 'nowrap', transition: 'color .15s' }}
                  onMouseEnter={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.65)')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.3)')}
                >Všechny služby →</Link>
              </div>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { from: { x: -110, rotate: -2.5 }, to: { x: 0, rotate: 0 }, delay: 0.1, s: SERVICES[0] },
                { from: { y:   90 },                to: { y: 0 },             delay: 0.18, s: SERVICES[1] },
                { from: { x:  110, rotate:  2.5 }, to: { x: 0, rotate: 0 }, delay: 0.1, s: SERVICES[2] },
              ].map(({ from, to, delay, s }) => (
                <motion.div key={s.title}
                  animate={{ opacity: inView ? 1 : 0, ...(inView ? to : from) }}
                  transition={E(delay)}
                  style={CARD}
                  className="cursor-pointer group"
                  onClick={() => (window.location.href = s.href)}
                >
                  <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '22px' }}>
                    {s.icon}
                  </div>
                  <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#fff', marginBottom: '8px' }}>{s.title}</h3>
                  <p style={{ fontSize: '13px', lineHeight: 1.65, color: 'rgba(255,255,255,0.36)', marginBottom: '28px' }}>{s.desc}</p>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '13px', fontWeight: 600, color: 'rgba(255,255,255,0.65)' }}>{s.price}</span>
                    <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.2)' }}>Detail →</span>
                  </div>
                </motion.div>
              ))}
            </div>
        </div>
    </div>
  );
}

/* ─── PROCESS ─────────────────────────────────────────────────── */
const STEPS = [
  { n: '01', title: 'Vyplníte formulář', desc: 'Řeknete nám o firmě. Zabere to 5 minut.', time: '3 min' },
  { n: '02', title: 'Navrhneme web na míru', desc: 'Do 48 hodin máte hotový návrh připravený ke schválení.', time: '24 h' },
  { n: '03', title: 'Schválíte a spustíte', desc: 'Zapracujeme připomínky. Platíte až po schválení.', time: '48 h' },
];

function ProcessSection() {
  const outerRef = useRef<HTMLDivElement>(null);
  const inView = useInView(outerRef, { once: false, amount: 0.15 });
  const E = (delay = 0) => ({ duration: 0.9, ease: [0.22, 1, 0.36, 1] as any, delay: inView ? delay : 0 });

  return (
    <div ref={outerRef} style={{ background: 'rgba(8,16,32,0.95)', padding: '112px 24px' }}>
        <div style={{ maxWidth: '1080px', margin: '0 auto' }}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

            <motion.div animate={{ opacity: inView ? 1 : 0, x: inView ? 0 : -90 }} transition={E(0)}>
              <p style={{ fontSize: '11px', fontWeight: 600, color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase', letterSpacing: '0.16em', marginBottom: '14px' }}>Jak pracujeme</p>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(26px,3.8vw,50px)', fontWeight: 300, color: '#fff', letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: '24px' }}>
                Od formuláře<br />po hotový web<br />za 48 hodin.
              </h2>
              <p style={{ fontSize: '14px', lineHeight: 1.7, color: 'rgba(255,255,255,0.4)', marginBottom: '32px', maxWidth: '340px' }}>
                Žádné zálohy, žádné překvapení. Platíte až ve chvíli, kdy jste spokojení s výsledkem.
              </p>
              <Link href="/jak-pracujeme" style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', fontSize: '13px', fontWeight: 600, color: 'rgba(255,255,255,0.45)', textDecoration: 'none', transition: 'color .15s' }}
                onMouseEnter={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.8)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.45)')}
              >
                Celý postup
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
              </Link>
            </motion.div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {STEPS.map((step, i) => (
                <motion.div key={step.n}
                  animate={{ opacity: inView ? 1 : 0, x: inView ? 0 : 90 }}
                  transition={E(0.1 + i * 0.1)}
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '14px', padding: '18px 22px', display: 'flex', alignItems: 'center', gap: '16px', boxShadow: '0 4px 24px rgba(0,0,0,0.28)' }}
                >
                  <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.05em', color: 'rgba(255,255,255,0.35)', background: 'rgba(255,255,255,0.06)', borderRadius: '8px', padding: '4px 10px', flexShrink: 0 }}>{step.n}</span>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: '14px', fontWeight: 600, color: '#fff', marginBottom: '2px' }}>{step.title}</p>
                    <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.36)', lineHeight: 1.5, margin: 0 }}>{step.desc}</p>
                  </div>
                  <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.2)', flexShrink: 0 }}>{step.time}</span>
                </motion.div>
              ))}
            </div>

          </div>
        </div>
    </div>
  );
}

/* ─── PORTFOLIO ─────────────────────────────────────────────────── */
const PORTFOLIO = [
  { client: 'Pavel Novák Instalace', obor: 'Instalatér', city: 'Praha', result: '+340% kontaktů', color: 'from-blue-700 to-blue-900' },
  { client: 'Zubní ordinace Procházková', obor: 'Zubař', city: 'Brno', result: '70% nových pacientů', color: 'from-slate-600 to-slate-800' },
  { client: 'Kavárna Na Rohu', obor: 'Kavárna', city: 'Jihlava', result: '+40% rezervací', color: 'from-stone-600 to-stone-800' },
];

function PortfolioSection() {
  const outerRef = useRef<HTMLDivElement>(null);
  const inView = useInView(outerRef, { once: false, amount: 0.15 });
  const E = (delay = 0) => ({ duration: 0.9, ease: [0.22, 1, 0.36, 1] as any, delay: inView ? delay : 0 });
  const cardAnim = [
    { from: { x: -110, rotate: -2 }, to: { x: 0, rotate: 0 }, delay: 0.1 },
    { from: { y:   80 },              to: { y: 0 },             delay: 0.18 },
    { from: { x: -110, rotate: -2 }, to: { x: 0, rotate: 0 }, delay: 0.1 },
  ];

  return (
    <div ref={outerRef} style={{ background: BG, padding: '112px 24px' }}>
        <div style={{ maxWidth: '1080px', margin: '0 auto' }}>

          <motion.div animate={{ opacity: inView ? 1 : 0, x: inView ? 0 : 80 }} transition={E(0)} className="mb-10">
            <p style={{ fontSize: '11px', fontWeight: 600, color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase', letterSpacing: '0.16em', marginBottom: '14px' }}>Naše práce</p>
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(26px,3.8vw,50px)', fontWeight: 300, color: '#fff', letterSpacing: '-0.03em', lineHeight: 1.1, margin: 0 }}>
                Výsledky,<br />které mluví za sebe
              </h2>
              <Link href="/portfolio" style={{ fontSize: '13px', fontWeight: 600, color: 'rgba(255,255,255,0.3)', textDecoration: 'none', whiteSpace: 'nowrap', transition: 'color .15s' }}
                onMouseEnter={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.65)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.3)')}
              >Celé portfolio →</Link>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {PORTFOLIO.map((p, i) => (
              <motion.div key={p.client}
                animate={{ opacity: inView ? 1 : 0, ...(inView ? cardAnim[i].to : cardAnim[i].from) }}
                transition={E(cardAnim[i].delay)}
                style={{ overflow: 'hidden', borderRadius: '18px', border: '1px solid rgba(255,255,255,0.08)' }}>
                <div className={`h-36 bg-gradient-to-br ${p.color} relative overflow-hidden`}>
                  <div className="absolute inset-3 rounded-lg" style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)' }}>
                    <div className="flex items-center gap-1.5 px-3 py-2" style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                      {[0,1,2].map(j => <div key={j} className="w-2 h-2 rounded-full" style={{ background: 'rgba(255,255,255,0.2)' }} />)}
                      <div className="flex-1 mx-2 h-2.5 rounded" style={{ background: 'rgba(255,255,255,0.12)' }} />
                    </div>
                    <div className="p-3 space-y-1.5">
                      <div className="h-2.5 rounded w-3/4" style={{ background: 'rgba(255,255,255,0.2)' }} />
                      <div className="h-2 rounded w-full" style={{ background: 'rgba(255,255,255,0.12)' }} />
                      <div className="h-2 rounded w-5/6" style={{ background: 'rgba(255,255,255,0.12)' }} />
                    </div>
                  </div>
                </div>
                <div style={{ padding: '20px 24px', background: 'rgba(255,255,255,0.03)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                    <span style={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'rgba(255,255,255,0.3)' }}>{p.obor}</span>
                    <span style={{ color: 'rgba(255,255,255,0.15)' }}>·</span>
                    <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)' }}>{p.city}</span>
                  </div>
                  <p style={{ fontSize: '14px', fontWeight: 600, color: '#fff', marginBottom: '10px' }}>{p.client}</p>
                  <span style={{ fontSize: '12px', fontWeight: 600, color: 'rgba(255,255,255,0.55)', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '20px', padding: '4px 12px', display: 'inline-block' }}>
                    {p.result}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
    </div>
  );
}

/* ─── TESTIMONIALS ──────────────────────────────────────────────── */
const TESTIMONIALS = [
  { quote: 'Čekal jsem měsíce. Dostal jsem web za 48 hodin a hned první týden mi volali noví zákazníci.', name: 'Pavel Novák', role: 'Instalatér, Praha', initial: 'P' },
  { quote: 'Zákazníci důvěřují ordinaci ještě předtím, než vůbec přijdou. Web vypadá opravdu profesionálně.', name: 'MUDr. Jana Procházková', role: 'Zubní lékařka, Brno', initial: 'J' },
  { quote: 'Moderní, přehledný, funkční. Přesně takový web jsem chtěl a dostal ho bez zbytečného stresu.', name: 'Martin Kovář', role: 'Restauratér, Ostrava', initial: 'M' },
];

function TestimonialsSection() {
  const outerRef = useRef<HTMLDivElement>(null);
  const inView = useInView(outerRef, { once: false, amount: 0.15 });
  const E = (delay = 0) => ({ duration: 0.9, ease: [0.22, 1, 0.36, 1] as any, delay: inView ? delay : 0 });
  const cardAnim = [
    { from: { x: -100, rotate: -2 }, to: { x: 0, rotate: 0 }, delay: 0.1 },
    { from: { y:    80 },             to: { y: 0 },             delay: 0.18 },
    { from: { x:  100, rotate:  2 }, to: { x: 0, rotate: 0 }, delay: 0.1 },
  ];

  return (
    <div ref={outerRef} style={{ background: 'rgba(8,16,32,0.95)', padding: '112px 24px' }}>
        <div style={{ maxWidth: '1080px', margin: '0 auto' }}>

          <motion.div animate={{ opacity: inView ? 1 : 0, x: inView ? 0 : -80 }} transition={E(0)} className="mb-10">
            <p style={{ fontSize: '11px', fontWeight: 600, color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase', letterSpacing: '0.16em', marginBottom: '14px' }}>Reference</p>
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(26px,3.8vw,50px)', fontWeight: 300, color: '#fff', letterSpacing: '-0.03em', lineHeight: 1.1, margin: 0 }}>
                Co říkají klienti
              </h2>
              <Link href="/reference" style={{ fontSize: '13px', fontWeight: 600, color: 'rgba(255,255,255,0.3)', textDecoration: 'none', whiteSpace: 'nowrap', transition: 'color .15s' }}
                onMouseEnter={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.65)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.3)')}
              >Všechny reference →</Link>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {TESTIMONIALS.map((t, i) => (
              <motion.div key={t.name}
                animate={{ opacity: inView ? 1 : 0, ...(inView ? cardAnim[i].to : cardAnim[i].from) }}
                transition={E(cardAnim[i].delay)}
                style={CARD}>
                <div style={{ display: 'flex', gap: '2px', marginBottom: '18px' }}>
                  {[1,2,3,4,5].map(s => (
                    <svg key={s} width="12" height="12" viewBox="0 0 24 24" fill="rgba(255,255,255,0.5)">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                  ))}
                </div>
                <p style={{ fontSize: '13px', lineHeight: 1.7, color: 'rgba(255,255,255,0.55)', marginBottom: '24px' }}>&ldquo;{t.quote}&rdquo;</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 700, color: '#fff', flexShrink: 0 }}>
                    {t.initial}
                  </div>
                  <div>
                    <p style={{ fontSize: '13px', fontWeight: 600, color: '#fff', marginBottom: '1px' }}>{t.name}</p>
                    <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.32)' }}>{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
    </div>
  );
}

/* ─── FAQ ─────────────────────────────────────────────────────── */
const FAQS = [
  { q: 'Jak dlouho trvá vytvoření webu?', a: 'Návrh webu máte do 48 hodin od vyplnění formuláře. Po schválení a případných úpravách web spustíme — celý proces obvykle trvá 3–5 dní.' },
  { q: 'Musím platit zálohu předem?', a: 'Ne. Platíte až po schválení hotového webu. Pokud se vám výsledek nebude líbit, neplatíte nic. Žádné riziko.' },
  { q: 'Co když se mi web nebude líbit?', a: 'Zapracujeme veškeré připomínky. Počet úprav není omezen — přijdete za hotovým webem, který vám sedí, nebo neplatíte.' },
  { q: 'Děláte také SEO optimalizaci?', a: 'Ano. Základní technické SEO (rychlost, meta tagy, struktura, schema markup) je součástí každého webu. Pokročilá obsahová strategie je na domluvě.' },
  { q: 'Co od vás potřebujeme?', a: 'Jen 5 minut na vyplnění formuláře — název firmy, obor, co nabízíte a kontakt. Zbytek vyřídíme my.' },
  { q: 'Mohu web po spuštění upravovat?', a: 'Samozřejmě. Předáme vám přístup nebo nastavíme CMS dle potřeby. Větší úpravy za vás rádi zpracujeme.' },
];

function FaqItem({ item, index }: { item: typeof FAQS[0]; index: number }) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: index * 0.07 } }}
      viewport={{ once: true, amount: 0.1 }}
      style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}
    >
      <button
        onClick={() => setOpen(o => !o)}
        style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '22px 0', background: 'none', border: 'none', cursor: 'pointer', gap: '16px', textAlign: 'left' }}
      >
        <span style={{ fontSize: '15px', fontWeight: 500, color: open ? '#fff' : 'rgba(255,255,255,0.75)', transition: 'color 0.2s' }}>{item.q}</span>
        <span style={{ flexShrink: 0, width: '24px', height: '24px', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.4)', transition: 'transform 0.25s', transform: open ? 'rotate(45deg)' : 'rotate(0deg)' }}>
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg>
        </span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="a"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1, transition: { duration: 0.28, ease: [0.4, 0, 0.2, 1] } }}
            exit={{ height: 0, opacity: 0, transition: { duration: 0.22, ease: [0.4, 0, 0.2, 1] } }}
            style={{ overflow: 'hidden' }}
          >
            <p style={{ fontSize: '14px', lineHeight: 1.7, color: 'rgba(255,255,255,0.4)', paddingBottom: '22px', margin: 0 }}>{item.a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function FAQ() {
  return (
    <section style={{ background: BG, padding: '112px 24px' }}>
      <div style={{ maxWidth: '720px', margin: '0 auto' }}>
        <motion.div
          initial={{ opacity: 0, y: 36 }}
          whileInView={{ opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }}
          viewport={{ once: true, amount: 0.2 }}
          style={{ marginBottom: '56px' }}
        >
          <p style={{ fontSize: '11px', fontWeight: 600, color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase', letterSpacing: '0.16em', marginBottom: '16px' }}>Časté otázky</p>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px,4vw,52px)', fontWeight: 300, color: '#fff', letterSpacing: '-0.03em', lineHeight: 1.1, margin: 0 }}>
            Máte otázky?<br />Máme odpovědi.
          </h2>
        </motion.div>
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
          {FAQS.map((item, i) => <FaqItem key={item.q} item={item} index={i} />)}
        </div>
      </div>
    </section>
  );
}

/* ─── CTA ─────────────────────────────────────────────────────── */
function CTA() {
  return (
    <section className="overflow-hidden relative" style={{ background: BG, padding: '140px 24px' }}>
      <div aria-hidden style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'radial-gradient(ellipse 70% 60% at 50% 55%, rgba(37,99,235,0.08) 0%, transparent 70%)' }} />
      <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center', position: 'relative' }}>
        <motion.div
          initial={{ opacity: 0, y: 48 }}
          whileInView={{ opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } }}
          viewport={{ once: true, amount: 0.2 }}
        >
          <p style={{ fontSize: '11px', fontWeight: 600, color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase', letterSpacing: '0.16em', marginBottom: '24px' }}>Začněte ještě dnes</p>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(36px,5.5vw,68px)', fontWeight: 300, color: '#fff', letterSpacing: '-0.04em', lineHeight: 1.05, marginBottom: '20px' }}>
            Váš nový web<br />čeká na vás.
          </h2>
          <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.38)', lineHeight: 1.65, marginBottom: '44px' }}>
            Poptávka zdarma a nezávazná.<br />Do 24 hodin máte první ukázku.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/kontakt" className="btn-mkt-primary">
              Získat web ke shlédnutí zdarma
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
            </Link>
            <Link href="/sluzby" className="btn-mkt-ghost">Prohlédnout služby</Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ─── PRICING ─────────────────────────────────────────────────── */
const PLANS = [
  {
    name: 'Landing page', price: '9 900',
    desc: 'Jednoduchý, cílený a rychlý. Ideální pro firmy, které chtějí být vidět.',
    features: ['Design + vývoj na míru', 'Dodání do 48 hodin', 'Plně responzivní (mobil/tablet)', 'SEO základ (title, meta, sitemap)', 'Kontaktní formulář / CTA tlačítko', 'Hosting první rok zdarma'],
    popular: false, cta: 'Začít s Landing page',
  },
  {
    name: 'Firemní web', price: '14 900',
    desc: 'Kompletní online prezentace firmy. Pro ty, kdo chtějí víc než jen jednu stránku.',
    features: ['Vše z Landing page', 'Více podstránek (až 6)', 'Reference nebo blog', 'Vlastní administrace (CMS)', 'Google Analytics + Search Console', 'Optimalizace rychlosti (Core Web Vitals)'],
    popular: true, cta: 'Začít s Firemním webem',
  },
  {
    name: 'E-commerce', price: '24 900',
    desc: 'Kompletní obchod s platebními branami. Pro firmy připravené na online prodej.',
    features: ['Vše z Firemního webu', 'Produktový katalog', 'Online platby (Stripe / GoPay)', 'Správa objednávek a zákazníků', 'Automatické emailové notifikace', 'Napojení na skladový systém'],
    popular: false, cta: 'Začít s E-commerce',
  },
] as const;

function Pricing() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'start 30%'] });

  const hX  = useTransform(scrollYProgress, [0, 1], [-60, 0]);
  const hOp = useTransform(scrollYProgress, [0, 0.7], [0, 1]);
  const p1X  = useTransform(scrollYProgress, [0.1, 1], [-80, 0]);
  const p2Y  = useTransform(scrollYProgress, [0.2, 1], [60, 0]);
  const p3X  = useTransform(scrollYProgress, [0.1, 1], [80, 0]);
  const pOp  = useTransform(scrollYProgress, [0.1, 0.8], [0, 1]);

  return (
    <section ref={ref} style={{ background: BG, position: 'relative', padding: '120px 24px 100px' }}>
      <div aria-hidden style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '1px', background: 'linear-gradient(90deg,transparent 0%,rgba(255,255,255,0.08) 40%,rgba(255,255,255,0.08) 60%,transparent 100%)' }} />

      <div style={{ maxWidth: '1080px', margin: '0 auto' }}>
        <motion.div style={{ x: hX, opacity: hOp }} className="text-center mb-16">
          <p style={{ fontSize: '11px', fontWeight: 600, color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase', letterSpacing: '0.16em', marginBottom: '16px' }}>Ceník</p>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(32px,5vw,60px)', fontWeight: 300, color: '#fff', letterSpacing: '-0.04em', lineHeight: 1.05, marginBottom: '14px' }}>
            Transparentní ceny.<br />Žádná překvapení.
          </h2>
          <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.3)', margin: 0 }}>Platíte až po schválení návrhu. Záloha nula.</p>
        </motion.div>

        <motion.div style={{ opacity: pOp }} className="flex items-center justify-center gap-2 mb-10 mx-auto max-w-xl">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '10px', padding: '12px 20px' }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
            <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.45)', fontWeight: 500 }}>Záruka spokojenosti — web nesplní zadání? Vrátíme 100 % ceny.</span>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
          {PLANS.map((plan, i) => {
            const motionStyle = i === 0 ? { x: p1X, opacity: pOp } : i === 1 ? { y: p2Y, opacity: pOp } : { x: p3X, opacity: pOp };
            return (
              <motion.div
                key={plan.name}
                style={{ ...motionStyle, position: 'relative', padding: plan.popular ? '40px 28px 32px' : '32px 28px', background: plan.popular ? 'rgba(37,99,235,0.06)' : 'rgba(255,255,255,0.03)', border: `1px solid ${plan.popular ? 'rgba(37,99,235,0.22)' : 'rgba(255,255,255,0.07)'}`, borderRadius: '18px', ...(plan.popular ? { marginTop: '-10px' } : {}) } as any}
              >
                {plan.popular && (
                  <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', background: '#2563eb', color: '#fff', fontSize: '10px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', padding: '5px 16px', borderRadius: '0 0 10px 10px' }}>
                    Nejoblíbenější
                  </div>
                )}
                <div style={{ display: 'flex', alignItems: 'center', gap: '9px', marginBottom: '18px' }}>
                  <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'rgba(255,255,255,0.3)', flexShrink: 0 }} />
                  <span style={{ fontSize: '15px', fontWeight: 600, color: '#fff' }}>{plan.name}</span>
                </div>
                <div style={{ marginBottom: '6px', lineHeight: 1 }}>
                  <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.2)', verticalAlign: 'top', paddingTop: '8px', display: 'inline-block', marginRight: '2px' }}>od</span>
                  <span style={{ fontSize: 'clamp(32px,3.5vw,44px)', fontWeight: 700, color: '#fff', letterSpacing: '-0.04em' }}>{plan.price}</span>
                  <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.2)', marginLeft: '4px' }}>Kč</span>
                </div>
                <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.32)', lineHeight: 1.65, margin: '0 0 20px' }}>{plan.desc}</p>
                <div style={{ height: '1px', background: 'rgba(255,255,255,0.06)', marginBottom: '18px' }} />
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '26px' }}>
                  {plan.features.map(f => (
                    <div key={f} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: '3px' }}><polyline points="20 6 9 17 4 12" /></svg>
                      <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', lineHeight: 1.55 }}>{f}</span>
                    </div>
                  ))}
                </div>
                <Link href="/kontakt" className={plan.popular ? 'btn-mkt-card-primary' : 'btn-mkt-card-ghost'}>{plan.cta}</Link>
              </motion.div>
            );
          })}
        </div>

        <motion.div style={{ opacity: pOp }} className="text-center mt-14">
          <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.3)', marginBottom: '16px' }}>Nejste si jistí, který plán je pro vás správný?</p>
          <Link href="/kontakt" className="btn-mkt-primary">Nezávazná konzultace zdarma →</Link>
        </motion.div>
      </div>
    </section>
  );
}

/* ─── PAGE ROOT ───────────────────────────────────────────────── */
export default function HomePage() {
  return (
    <>
      <style>{MOBILE_RESET}</style>
      <Grain />
      <CursorBlob />
      <Hero />
      <ServicesSection />
      <ProcessSection />
      <PortfolioSection />
      <TestimonialsSection />
      <CTA />
      <Pricing />
      <FAQ />
    </>
  );
}
