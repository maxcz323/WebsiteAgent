'use client';

import { useRef, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

const VP   = { once: true, amount: 0.07 } as const;
const EASE = [0.22, 1, 0.36, 1] as const;

/* ── Grain ────────────────────────────────────────────────────── */
function Grain() {
  return (
    <div aria-hidden style={{
      position: 'fixed', inset: 0, zIndex: 990, pointerEvents: 'none', opacity: 0.03,
      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 512 512'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
      backgroundSize: '256px 256px',
    }} />
  );
}

/* ── Cursor blob ──────────────────────────────────────────────── */
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

/* ── HERO ─────────────────────────────────────────────────────── */
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
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          style={{
            fontFamily: 'var(--font-display)', fontWeight: 300,
            letterSpacing: '-0.04em', lineHeight: 0.95, color: '#fff',
            fontSize: 'clamp(48px,8vw,96px)', marginBottom: '28px',
          }}
        >
          Web, který<br />prodává.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.22 }}
          style={{ fontSize: '18px', lineHeight: 1.65, color: 'rgba(255,255,255,0.5)', maxWidth: '380px', marginBottom: '40px' }}
        >
          Moderní weby pro lokální firmy.<br />
          <span style={{ color: 'rgba(255,255,255,0.28)' }}>Platíte až po schválení. Záloha 0 Kč.</span>
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.32 }}
          className="flex flex-col sm:flex-row gap-3"
          style={{ marginBottom: '64px' }}
        >
          <Link href="/kontakt" className="btn-mkt-primary">
            Chci web pro svou firmu
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
          </Link>
          <Link href="/jak-pracujeme" className="btn-mkt-ghost">
            Jak to funguje
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
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
          <motion.div
            style={{ width: '4px', height: '6px', borderRadius: '2px', background: '#fff' }}
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>
      </div>
    </section>
  );
}

/* ── SERVICES ─────────────────────────────────────────────────── */
const SERVICES = [
  {
    title: 'Landing page',
    desc: 'Jednostránkový web zaměřený na konverze. Rychlý, přehledný, funkční.',
    price: 'od 9 900 Kč',
    href: '/kalkulace/landing-page',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>
      </svg>
    ),
  },
  {
    title: 'Firemní web',
    desc: 'Kompletní online prezentace vaší firmy. Více stránek, CMS, analytics.',
    price: 'od 14 900 Kč',
    href: '/kalkulace/firemni-web',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
      </svg>
    ),
  },
  {
    title: 'E-commerce',
    desc: 'Online obchod s košíkem a platební bránou. Připraveno na prodej.',
    price: 'od 24 900 Kč',
    href: '/kalkulace/ecommerce',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
      </svg>
    ),
  },
];

/* Entry direction per card: left / bottom / right */
const CARD_ENTRY = [
  { x: -80, y: 0,  rotate: -1.5 },
  { x: 0,  y: 64, rotate: 0    },
  { x: 80,  y: 0,  rotate:  1.5 },
] as const;

const CARD_STYLE = {
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: '18px',
  padding: '32px',
  cursor: 'pointer',
  boxShadow: '0 4px 28px rgba(0,0,0,0.28)',
};

function Services() {
  return (
    <section className="overflow-hidden" style={{ background: '#060d1a', padding: '112px 24px' }}>
      <div style={{ maxWidth: '1080px', margin: '0 auto' }}>

        <motion.div
          initial={{ opacity: 0, y: 36 }}
          whileInView={{ opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } }}
          viewport={VP}
          style={{ marginBottom: '64px' }}
        >
          <p style={{ fontSize: '11px', fontWeight: 600, color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase', letterSpacing: '0.16em', marginBottom: '16px' }}>Naše služby</p>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px,4vw,52px)', fontWeight: 300, color: '#fff', letterSpacing: '-0.03em', lineHeight: 1.1, margin: 0 }}>
              Co vytvoříme<br />pro vaši firmu
            </h2>
            <Link
              href="/sluzby"
              style={{ fontSize: '13px', fontWeight: 600, color: 'rgba(255,255,255,0.3)', textDecoration: 'none', whiteSpace: 'nowrap', transition: 'color 0.15s' }}
              onMouseEnter={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.65)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.3)')}
            >
              Všechny služby →
            </Link>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {SERVICES.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, x: CARD_ENTRY[i].x, y: CARD_ENTRY[i].y, rotate: CARD_ENTRY[i].rotate }}
              whileInView={{
                opacity: 1, x: 0, y: 0, rotate: 0,
                transition: { duration: 0.75, ease: EASE, delay: i === 1 ? 0.08 : 0 },
              }}
              viewport={VP}
              style={CARD_STYLE}
              onClick={() => (window.location.href = s.href)}
            >
              <div style={{
                width: '44px', height: '44px', borderRadius: '12px',
                background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.5)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: '24px',
              }}>
                {s.icon}
              </div>
              <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#fff', marginBottom: '8px' }}>{s.title}</h3>
              <p style={{ fontSize: '13px', lineHeight: 1.65, color: 'rgba(255,255,255,0.36)', marginBottom: '28px' }}>{s.desc}</p>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '13px', fontWeight: 600, color: 'rgba(255,255,255,0.7)' }}>{s.price}</span>
                <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.2)' }}>Detail →</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── PROCESS ──────────────────────────────────────────────────── */
const STEPS = [
  { n: '01', title: 'Vyplníte formulář', desc: 'Řeknete nám o firmě. Zabere to 5 minut.' },
  { n: '02', title: 'Návrh webu za 48h', desc: 'Do 48 hodin máte hotový návrh připravený ke schválení.' },
  { n: '03', title: 'Spuštění bez rizika', desc: 'Zapracujeme připomínky. Platíte až po schválení.' },
];

const STEP_STYLE = {
  background: 'rgba(255,255,255,0.03)',
  border: '1px solid rgba(255,255,255,0.07)',
  borderRadius: '16px',
  padding: '28px',
};

function Process() {
  return (
    <section className="overflow-hidden" style={{ background: 'rgba(6,13,26,0.5)', padding: '112px 24px' }}>
      <div style={{ maxWidth: '1080px', margin: '0 auto' }}>

        <motion.div
          initial={{ opacity: 0, x: -56 }}
          whileInView={{ opacity: 1, x: 0, transition: { duration: 0.65, ease: EASE } }}
          viewport={VP}
          style={{ marginBottom: '64px' }}
        >
          <p style={{ fontSize: '11px', fontWeight: 600, color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase', letterSpacing: '0.16em', marginBottom: '16px' }}>Jak pracujeme</p>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px,4vw,52px)', fontWeight: 300, color: '#fff', letterSpacing: '-0.03em', lineHeight: 1.1, margin: 0 }}>
              Od poptávky po web<br />za 48 hodin.
            </h2>
            <Link
              href="/jak-pracujeme"
              style={{ fontSize: '13px', fontWeight: 600, color: 'rgba(255,255,255,0.3)', textDecoration: 'none', whiteSpace: 'nowrap', transition: 'color 0.15s' }}
              onMouseEnter={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.65)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.3)')}
            >
              Celý postup →
            </Link>
          </div>
        </motion.div>

        {/* Step cards — staggered from left, paper-slide feel */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {STEPS.map((step, i) => (
            <motion.div
              key={step.n}
              initial={{ opacity: 0, x: -72, rotate: -1.2 }}
              whileInView={{
                opacity: 1, x: 0, rotate: 0,
                transition: { duration: 0.72, ease: EASE, delay: i * 0.13 },
              }}
              viewport={VP}
              style={STEP_STYLE}
            >
              <span style={{
                display: 'inline-block', fontSize: '11px', fontWeight: 700,
                letterSpacing: '0.05em', color: 'rgba(255,255,255,0.35)',
                background: 'rgba(255,255,255,0.06)', borderRadius: '8px',
                padding: '4px 10px', marginBottom: '20px',
              }}>{step.n}</span>
              <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#fff', marginBottom: '8px' }}>{step.title}</h3>
              <p style={{ fontSize: '13px', lineHeight: 1.65, color: 'rgba(255,255,255,0.36)', margin: 0 }}>{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── CTA ──────────────────────────────────────────────────────── */
function CTA() {
  return (
    <section className="overflow-hidden relative" style={{ background: '#060d1a', padding: '140px 24px' }}>
      <div aria-hidden style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'radial-gradient(ellipse 70% 60% at 50% 55%, rgba(37,99,235,0.08) 0%, transparent 70%)' }} />

      <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center', position: 'relative' }}>
        <motion.div
          initial={{ opacity: 0, y: 48 }}
          whileInView={{ opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } }}
          viewport={VP}
        >
          <p style={{ fontSize: '11px', fontWeight: 600, color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase', letterSpacing: '0.16em', marginBottom: '24px' }}>
            Začněte ještě dnes
          </p>
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
            <Link href="/sluzby" className="btn-mkt-ghost">
              Prohlédnout služby
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ── PAGE ROOT ────────────────────────────────────────────────── */
export default function HomePage() {
  return (
    <>
      <Grain />
      <CursorBlob />
      <Hero />
      <Services />
      <Process />
      <CTA />
    </>
  );
}
