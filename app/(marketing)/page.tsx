'use client';

import { useRef, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

/* ─── Animation constants ─────────────────────────────────────── */
const VIEWPORT = { once: true, amount: 0.05 } as const;

const fade = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.25, 0.1, 0.25, 1] as const } },
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.10 } },
};

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

/* ─── Cursor blob ─────────────────────────────────────────────── */
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

/* ─── Scroll progress bar ─────────────────────────────────────── */
function ScrollBar() {
  const bar = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const fn = () => {
      const el = document.documentElement;
      if (bar.current) bar.current.style.width =
        `${(window.scrollY / (el.scrollHeight - el.clientHeight)) * 100}%`;
    };
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, height: '1px', zIndex: 200, background: 'rgba(255,255,255,0.04)' }}>
      <div ref={bar} style={{ width: '0%', height: '100%', background: '#2563eb', transition: 'width 0.05s linear' }} />
    </div>
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

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <span className="inline-flex items-center gap-2 text-xs font-semibold text-blue-300 bg-blue-500/10 border border-blue-400/20 px-4 py-2 rounded-full backdrop-blur-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
            Profesionální weby · Hotovo za 48 hodin
          </span>
        </motion.div>

        {/* H1 */}
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-5xl sm:text-7xl lg:text-8xl font-light text-white tracking-tight leading-[0.95] mb-7"
          style={{ fontFamily: 'var(--font-display)', fontWeight: 300, letterSpacing: '-0.04em' }}
        >
          Web, který<br />
          <em style={{
            fontStyle: 'normal',
            background: 'linear-gradient(135deg,#22d3ee 0%,#3b82f6 70%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>prodává.</em>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.22 }}
          className="text-lg sm:text-xl mb-10 max-w-md leading-relaxed"
          style={{ color: 'rgba(255,255,255,0.55)' }}
        >
          Moderní weby pro lokální firmy.<br />
          <span style={{ color: 'rgba(255,255,255,0.35)' }}>Platíte až po schválení. Záloha 0 Kč.</span>
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.32 }}
          className="flex flex-col sm:flex-row gap-3 mb-16"
        >
          <Link
            href="/kontakt"
            className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-semibold px-8 py-4 rounded-xl text-sm transition-all duration-200 cursor-pointer hover:-translate-y-0.5 hover:shadow-xl hover:shadow-blue-500/30"
          >
            Chci web pro svou firmu
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
          </Link>
          <Link
            href="/jak-pracujeme"
            className="inline-flex items-center justify-center gap-2 font-semibold px-8 py-4 rounded-xl text-sm border transition-all duration-200 cursor-pointer"
            style={{ color: 'rgba(255,255,255,0.6)', borderColor: 'rgba(255,255,255,0.12)' }}
          >
            Jak to funguje
          </Link>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-10 border-t"
          style={{ borderColor: 'rgba(255,255,255,0.08)' }}
        >
          {STATS.map(s => (
            <div key={s.l} className="text-center">
              <p className="text-2xl sm:text-3xl font-bold text-white mb-0.5" style={{ letterSpacing: '-0.03em' }}>{s.n}</p>
              <p className="text-xs" style={{ color: 'rgba(255,255,255,0.38)' }}>{s.l}</p>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll hint */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 pointer-events-none" style={{ opacity: 0.3 }}>
        <div className="w-5 h-8 rounded-full border flex items-start justify-center pt-1.5" style={{ borderColor: 'rgba(255,255,255,0.4)' }}>
          <motion.div
            className="w-1 h-1.5 rounded-full bg-white"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>
      </div>
    </section>
  );
}

/* ─── SERVICES ────────────────────────────────────────────────── */
const SERVICES = [
  {
    title: 'Landing page',
    slug: 'landing-page',
    desc: 'Jednostránkový web zaměřený na konverze.',
    price: 'od 9 900 Kč',
    accent: '#2563EB',
    accentBg: 'rgba(37,99,235,0.12)',
    accentShadow: 'rgba(37,99,235,0.18)',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" />
      </svg>
    ),
  },
  {
    title: 'Firemní web',
    slug: 'firemni-web',
    desc: 'Kompletní online prezentace vaší firmy.',
    price: 'od 14 900 Kč',
    accent: '#7c3aed',
    accentBg: 'rgba(124,58,237,0.12)',
    accentShadow: 'rgba(124,58,237,0.18)',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
  },
  {
    title: 'E-commerce',
    slug: 'ecommerce',
    desc: 'Online obchod s košíkem a platební bránou.',
    price: 'od 24 900 Kč',
    accent: '#059669',
    accentBg: 'rgba(5,150,105,0.12)',
    accentShadow: 'rgba(5,150,105,0.18)',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" /><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
      </svg>
    ),
  },
];

function Services() {
  return (
    <section className="py-28 px-5 sm:px-8" style={{ background: 'rgba(255,255,255,0.01)' }}>
      <div className="max-w-6xl mx-auto">
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={VIEWPORT}
          className="mb-14"
        >
          <motion.p variants={fade} className="text-xs font-semibold text-blue-500 uppercase tracking-widest mb-3">
            Naše služby
          </motion.p>
          <motion.div variants={fade} className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <h2 className="text-3xl sm:text-5xl font-light text-white leading-tight" style={{ fontFamily: 'var(--font-display)', fontWeight: 300, letterSpacing: '-0.03em' }}>
              Co vytvoříme<br />pro vaši firmu
            </h2>
            <Link href="/sluzby" className="text-sm font-semibold text-blue-500 hover:text-blue-400 transition-colors whitespace-nowrap cursor-pointer group">
              Všechny služby <span className="group-hover:translate-x-1 inline-block transition-transform duration-200">→</span>
            </Link>
          </motion.div>
        </motion.div>

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={VIEWPORT}
          className="grid grid-cols-1 md:grid-cols-3 gap-5"
        >
          {SERVICES.map((s) => (
            <motion.div
              key={s.title}
              variants={fade}
              whileHover={{ y: -6, boxShadow: `0 24px 60px ${s.accentShadow}` }}
              transition={{ type: 'spring', stiffness: 300, damping: 22 }}
              className="group relative p-8 rounded-2xl cursor-pointer overflow-hidden"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
              onClick={() => (window.location.href = `/kalkulace/${s.slug}`)}
            >
              <div className="absolute top-0 left-0 right-0 h-[3px] rounded-t-2xl" style={{ background: s.accent }} />
              <div
                className="w-11 h-11 rounded-2xl flex items-center justify-center mb-5 transition-transform duration-200 group-hover:scale-110"
                style={{ background: s.accentBg, color: s.accent }}
              >
                {s.icon}
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">{s.title}</h3>
              <p className="text-sm leading-relaxed mb-6" style={{ color: 'rgba(255,255,255,0.45)' }}>{s.desc}</p>
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold" style={{ color: s.accent }}>{s.price}</span>
                <span className="text-xs font-semibold transition-all duration-200 group-hover:translate-x-1" style={{ color: 'rgba(255,255,255,0.25)' }}>
                  Detail →
                </span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ─── PROCESS ─────────────────────────────────────────────────── */
const STEPS = [
  { n: '01', title: 'Vyplníte formulář', desc: 'Řeknete nám o firmě. Zabere to 5 minut.', time: '3 min' },
  { n: '02', title: 'Navrhneme web na míru', desc: 'Do 48 hodin máte hotový návrh webu.', time: '24 h' },
  { n: '03', title: 'Schválíte a spustíte', desc: 'Zapracujeme připomínky. Platíte až po schválení.', time: '48 h' },
];

function Process() {
  return (
    <section className="py-28 px-5 sm:px-8 overflow-hidden" style={{ background: '#060d1a' }}>
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={VIEWPORT}
        >
          <motion.p variants={fade} className="text-xs font-semibold text-blue-500 uppercase tracking-widest mb-4">
            Jak pracujeme
          </motion.p>
          <motion.h2 variants={fade} className="text-3xl sm:text-5xl font-light text-white leading-tight mb-8" style={{ fontFamily: 'var(--font-display)', fontWeight: 300, letterSpacing: '-0.03em' }}>
            Od formuláře<br />
            <em style={{ fontStyle: 'normal', color: '#3b82f6' }}>po hotový web</em><br />
            za 48 hodin.
          </motion.h2>

          <div className="space-y-3 mb-8">
            {STEPS.map((step, i) => (
              <motion.div
                key={step.n}
                variants={fade}
                custom={i}
                className="flex gap-4 items-start p-4 rounded-xl transition-all duration-200"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
              >
                <div className="flex-shrink-0 flex items-center justify-between w-full">
                  <div className="flex gap-4 items-start">
                    <span className="text-xs font-bold rounded-lg px-2.5 py-1 shrink-0 tabular-nums" style={{ color: '#60a5fa', background: 'rgba(37,99,235,0.15)' }}>
                      {step.n}
                    </span>
                    <div>
                      <p className="font-semibold text-white text-sm">{step.title}</p>
                      <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.4)' }}>{step.desc}</p>
                    </div>
                  </div>
                  <span className="text-xs font-medium shrink-0 ml-3" style={{ color: 'rgba(255,255,255,0.25)' }}>{step.time}</span>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div variants={fade}>
            <Link href="/jak-pracujeme" className="inline-flex items-center gap-2 text-sm font-semibold text-blue-400 hover:text-blue-300 transition-colors group cursor-pointer">
              Celý postup
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="transition-transform duration-200 group-hover:translate-x-1"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
            </Link>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={VIEWPORT}
          transition={{ duration: 0.75 }}
          className="rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/10"
          style={{ boxShadow: '0 32px 80px rgba(0,0,0,0.6)' }}
        >
          <img
            src="https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=900&q=80&auto=format&fit=crop"
            alt="Tým pracující na designu webu"
            className="w-full object-cover"
            style={{ height: '420px' }}
          />
        </motion.div>
      </div>
    </section>
  );
}

/* ─── PORTFOLIO ───────────────────────────────────────────────── */
const PORTFOLIO = [
  { client: 'Pavel Novák Instalace', obor: 'Instalatér', city: 'Praha', result: '+340% kontaktů', color: 'from-blue-600 to-blue-800' },
  { client: 'Zubní ordinace Procházková', obor: 'Zubař', city: 'Brno', result: '70% nových pacientů', color: 'from-teal-600 to-cyan-700' },
  { client: 'Kavárna Na Rohu', obor: 'Kavárna', city: 'Jihlava', result: '+40% rezervací', color: 'from-amber-500 to-orange-600' },
];

function Portfolio() {
  return (
    <section className="py-28 px-5 sm:px-8" style={{ background: 'rgba(255,255,255,0.01)' }}>
      <div className="max-w-6xl mx-auto">
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={VIEWPORT}
          className="mb-14"
        >
          <motion.p variants={fade} className="text-xs font-semibold text-blue-500 uppercase tracking-widest mb-3">
            Naše práce
          </motion.p>
          <motion.div variants={fade} className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <h2 className="text-3xl sm:text-5xl font-light text-white leading-tight" style={{ fontFamily: 'var(--font-display)', fontWeight: 300, letterSpacing: '-0.03em' }}>
              Výsledky,<br />které mluví za sebe
            </h2>
            <Link href="/portfolio" className="text-sm font-semibold text-blue-500 hover:text-blue-400 transition-colors whitespace-nowrap cursor-pointer group">
              Celé portfolio <span className="group-hover:translate-x-1 inline-block transition-transform duration-200">→</span>
            </Link>
          </motion.div>
        </motion.div>

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={VIEWPORT}
          className="grid grid-cols-1 md:grid-cols-3 gap-5"
        >
          {PORTFOLIO.map((p) => (
            <motion.div
              key={p.client}
              variants={fade}
              whileHover={{ y: -6, boxShadow: '0 20px 50px rgba(0,0,0,0.4)' }}
              transition={{ type: 'spring', stiffness: 300, damping: 22 }}
              className="rounded-2xl overflow-hidden"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
            >
              <div className={`h-44 bg-gradient-to-br ${p.color} relative overflow-hidden`}>
                <div className="absolute inset-3 rounded-lg" style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)' }}>
                  <div className="flex items-center gap-1.5 px-3 py-2" style={{ borderBottom: '1px solid rgba(255,255,255,0.10)' }}>
                    {[0, 1, 2].map(i => <div key={i} className="w-2 h-2 rounded-full" style={{ background: 'rgba(255,255,255,0.25)' }} />)}
                    <div className="flex-1 mx-2 h-3 rounded" style={{ background: 'rgba(255,255,255,0.15)' }} />
                  </div>
                  <div className="p-3 space-y-2">
                    <div className="h-3 rounded w-3/4" style={{ background: 'rgba(255,255,255,0.25)' }} />
                    <div className="h-2 rounded w-full" style={{ background: 'rgba(255,255,255,0.15)' }} />
                    <div className="h-2 rounded w-5/6" style={{ background: 'rgba(255,255,255,0.15)' }} />
                  </div>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'rgba(255,255,255,0.35)' }}>{p.obor}</span>
                  <span style={{ color: 'rgba(255,255,255,0.2)' }}>·</span>
                  <span className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>{p.city}</span>
                </div>
                <h3 className="font-semibold text-white text-sm mb-3">{p.client}</h3>
                <span className="text-xs font-semibold px-3 py-1.5 rounded-full inline-block" style={{ color: '#34d399', background: 'rgba(52,211,153,0.08)', border: '1px solid rgba(52,211,153,0.18)' }}>
                  {p.result}
                </span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ─── TESTIMONIALS ────────────────────────────────────────────── */
const TESTIMONIALS = [
  { quote: 'Čekal jsem měsíce. Dostal jsem web za 48 hodin a hned první týden mi volali noví zákazníci.', name: 'Pavel Novák', role: 'Instalatér, Praha', initial: 'P', color: '#2563EB' },
  { quote: 'Zákazníci důvěřují ordinaci ještě předtím, než vůbec přijdou.', name: 'MUDr. Jana Procházková', role: 'Zubní lékařka, Brno', initial: 'J', color: '#0d9488' },
  { quote: 'Moderní, přehledný, funkční. Přesně takový web jsem chtěl.', name: 'Martin Kovář', role: 'Restauratér, Ostrava', initial: 'M', color: '#7c3aed' },
];

function Testimonials() {
  return (
    <section className="py-28 px-5 sm:px-8" style={{ background: '#060d1a' }}>
      <div className="max-w-6xl mx-auto">
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={VIEWPORT}
          className="mb-14"
        >
          <motion.p variants={fade} className="text-xs font-semibold text-blue-500 uppercase tracking-widest mb-3">
            Reference
          </motion.p>
          <motion.h2 variants={fade} className="text-3xl sm:text-5xl font-light text-white leading-tight" style={{ fontFamily: 'var(--font-display)', fontWeight: 300, letterSpacing: '-0.03em' }}>
            Co říkají klienti
          </motion.h2>
        </motion.div>

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={VIEWPORT}
          className="grid grid-cols-1 md:grid-cols-3 gap-5"
        >
          {TESTIMONIALS.map((t) => (
            <motion.div
              key={t.name}
              variants={fade}
              whileHover={{ y: -5, borderColor: 'rgba(37,99,235,0.2)' }}
              transition={{ type: 'spring', stiffness: 300, damping: 22 }}
              className="p-8 rounded-2xl transition-colors duration-300"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
            >
              <div className="flex gap-0.5 mb-5">
                {[1, 2, 3, 4, 5].map(s => (
                  <svg key={s} width="13" height="13" viewBox="0 0 24 24" fill="#f59e0b">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                ))}
              </div>
              <p className="text-sm leading-relaxed mb-6" style={{ color: 'rgba(255,255,255,0.6)' }}>&ldquo;{t.quote}&rdquo;</p>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0" style={{ background: t.color }}>
                  {t.initial}
                </div>
                <div>
                  <p className="font-semibold text-white text-sm">{t.name}</p>
                  <p className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={VIEWPORT}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mt-10"
        >
          <Link href="/reference" className="text-sm font-semibold text-blue-500 hover:text-blue-400 transition-colors cursor-pointer">
            Zobrazit všechny reference →
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

/* ─── CTA ─────────────────────────────────────────────────────── */
function CTA() {
  return (
    <section className="py-32 px-5 sm:px-8 relative overflow-hidden" style={{ background: '#060d1a' }}>
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 70% 60% at 50% 60%, rgba(37,99,235,0.12) 0%, transparent 70%)' }}
      />
      <div className="max-w-2xl mx-auto relative text-center">
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={VIEWPORT}
        >
          <motion.p variants={fade} className="text-xs font-semibold text-blue-500 uppercase tracking-widest mb-6">
            Začněte ještě dnes
          </motion.p>
          <motion.h2 variants={fade} className="text-4xl sm:text-6xl font-light text-white tracking-tight leading-tight mb-5" style={{ fontFamily: 'var(--font-display)', fontWeight: 300, letterSpacing: '-0.04em' }}>
            Váš nový web<br />
            <em style={{
              fontStyle: 'normal',
              background: 'linear-gradient(135deg,#22d3ee 0%,#3b82f6 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>čeká na vás.</em>
          </motion.h2>
          <motion.p variants={fade} className="text-base mb-10 max-w-xs mx-auto leading-relaxed" style={{ color: 'rgba(255,255,255,0.45)' }}>
            Poptávka zdarma a nezávazná.<br />Do 24 hodin máte první ukázku.
          </motion.p>
          <motion.div variants={fade} className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/kontakt"
              className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-semibold px-8 py-4 rounded-xl text-sm transition-all duration-200 cursor-pointer hover:-translate-y-0.5 hover:shadow-xl hover:shadow-blue-500/30"
            >
              Získat web ke shlédnutí zdarma
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
            </Link>
            <Link
              href="/sluzby"
              className="inline-flex items-center justify-center gap-2 font-semibold px-10 py-4 rounded-xl text-sm transition-all duration-200 cursor-pointer"
              style={{ color: 'rgba(255,255,255,0.55)', border: '1px solid rgba(255,255,255,0.1)' }}
            >
              Prohlédnout služby
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

/* ─── PRICING ─────────────────────────────────────────────────── */
const PLANS = [
  {
    name: 'Landing page',
    price: '9 900',
    desc: 'Jednoduchý, cílený a rychlý. Ideální pro firmy bez webu, které chtějí být vidět.',
    color: '#2563eb',
    features: [
      'Design + vývoj na míru',
      'Dodání do 48 hodin',
      'Plně responzivní (mobil/tablet)',
      'SEO základ (title, meta, sitemap)',
      'Kontaktní formulář / CTA tlačítko',
      'Hosting první rok zdarma',
    ],
    popular: false,
    cta: 'Začít s Landing page',
  },
  {
    name: 'Firemní web',
    price: '14 900',
    desc: 'Kompletní online prezentace firmy. Pro ty, kdo chtějí víc než jen jednu stránku.',
    color: '#2563eb',
    features: [
      'Vše z Landing page',
      'Více podstránek (až 6)',
      'Reference nebo blog',
      'Vlastní administrace (CMS)',
      'Google Analytics + Search Console',
      'Optimalizace rychlosti (Core Web Vitals)',
    ],
    popular: true,
    cta: 'Začít s Firemním webem',
  },
  {
    name: 'E-commerce',
    price: '24 900',
    desc: 'Kompletní obchod s platebními branami. Pro firmy připravené na online prodej.',
    color: '#2563eb',
    features: [
      'Vše z Firemního webu',
      'Produktový katalog',
      'Online platby (Stripe / GoPay)',
      'Správa objednávek a zákazníků',
      'Automatické emailové notifikace',
      'Napojení na skladový systém',
    ],
    popular: false,
    cta: 'Začít s E-commerce',
  },
] as const;

function SPricing() {
  return (
    <section style={{ background: '#060d1a', position: 'relative', zIndex: 10, padding: '128px 24px 100px' }}>
      <style>{`
        .price-card { transition: transform .25s ease, border-color .25s ease; }
        .price-card:hover { transform: translateY(-5px); border-color: rgba(255,255,255,.12) !important; }
        .price-card-popular:hover { border-color: rgba(37,99,235,.4) !important; }
        .price-btn { transition: background .18s; }
        .price-btn:hover { background: #1d4ed8 !important; }
        .price-btn-ghost { transition: background .18s; }
        .price-btn-ghost:hover { background: rgba(255,255,255,.08) !important; }
        @media(max-width:767px){
          .price-grid { grid-template-columns: 1fr !important; }
          .price-card-popular { margin-top: 0 !important; }
        }
      `}</style>

      <div aria-hidden style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '1px', background: 'linear-gradient(90deg,transparent 0%,rgba(37,99,235,.25) 40%,rgba(37,99,235,.25) 60%,transparent 100%)' }} />

      <div style={{ maxWidth: '1080px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '72px' }}>
          <p style={{ fontSize: '10px', fontWeight: 600, color: '#2563eb', textTransform: 'uppercase', letterSpacing: '0.16em', margin: '0 0 20px' }}>Ceník</p>
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(38px,5.5vw,68px)',
            fontWeight: 300,
            color: 'white',
            lineHeight: 1.0,
            letterSpacing: '-0.04em',
            margin: '0 0 16px',
          }}>
            Transparentní ceny.<br />
            <em style={{ color: '#2563eb', fontStyle: 'normal' }}>Žádná překvapení.</em>
          </h2>
          <p style={{ fontSize: '14px', color: '#4a6880', margin: 0 }}>Platíte až po schválení návrhu. Záloha nula.</p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', background: 'rgba(16,185,129,0.05)', border: '1px solid rgba(16,185,129,0.12)', borderRadius: '10px', padding: '14px 24px', marginBottom: '40px' }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
          <span style={{ fontSize: '13px', color: '#10b981', fontWeight: 500 }}>Záruka spokojenosti &mdash; web nesplní zadání? Vrátíme 100 % ceny, bez diskuze.</span>
        </div>

        <div className="price-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '16px', alignItems: 'start' }}>
          {PLANS.map(plan => (
            <div
              key={plan.name}
              className={`price-card${plan.popular ? ' price-card-popular' : ''}`}
              style={{
                position: 'relative',
                padding: '32px',
                background: plan.popular ? 'rgba(37,99,235,0.06)' : 'rgba(255,255,255,0.03)',
                border: `1px solid ${plan.popular ? 'rgba(37,99,235,0.24)' : 'rgba(255,255,255,0.07)'}`,
                borderRadius: '16px',
                ...(plan.popular ? { marginTop: '-12px', paddingTop: '44px' } : {}),
              }}
            >
              {plan.popular && (
                <div style={{
                  position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
                  background: '#2563eb', color: 'white',
                  fontSize: '10px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase',
                  padding: '5px 16px', borderRadius: '0 0 10px 10px',
                }}>
                  Nejoblíbenější
                </div>
              )}

              <div style={{ display: 'flex', alignItems: 'center', gap: '9px', marginBottom: '18px' }}>
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#2563eb', flexShrink: 0 }} />
                <span style={{ fontSize: '15px', fontWeight: 600, color: 'white' }}>{plan.name}</span>
              </div>

              <div style={{ marginBottom: '6px', lineHeight: 1 }}>
                <span style={{ fontSize: '11px', color: '#3a4e66', verticalAlign: 'top', paddingTop: '8px', display: 'inline-block', marginRight: '2px' }}>od</span>
                <span style={{ fontSize: 'clamp(32px,3.5vw,44px)', fontWeight: 700, color: 'white', letterSpacing: '-0.04em' }}>{plan.price}</span>
                <span style={{ fontSize: '13px', color: '#3a4e66', marginLeft: '4px' }}>Kč</span>
              </div>
              <p style={{ fontSize: '13px', color: '#3a4e66', lineHeight: 1.65, margin: '0 0 22px' }}>{plan.desc}</p>

              <div style={{ height: '1px', background: 'rgba(255,255,255,0.06)', marginBottom: '20px' }} />

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '28px' }}>
                {plan.features.map(f => (
                  <div key={f} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: '3px' }}>
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span style={{ fontSize: '13px', color: '#6a7e96', lineHeight: 1.55 }}>{f}</span>
                  </div>
                ))}
              </div>

              <Link
                href="/kontakt"
                className={plan.popular ? 'price-btn' : 'price-btn-ghost'}
                style={{
                  display: 'block', textAlign: 'center', padding: '13px 20px',
                  background: plan.popular ? '#2563eb' : 'rgba(255,255,255,0.04)',
                  color: 'white', fontSize: '14px', fontWeight: 600,
                  borderRadius: '10px', textDecoration: 'none',
                  border: `1px solid ${plan.popular ? 'transparent' : 'rgba(255,255,255,0.08)'}`,
                }}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: '56px' }}>
          <p style={{ fontSize: '13px', color: '#4a6278', marginBottom: '16px' }}>Nejste si jistí, který plán je pro vás správný?</p>
          <Link href="/kontakt" style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', fontSize: '14px', fontWeight: 600, color: '#2563eb', textDecoration: 'none', padding: '11px 26px', background: 'rgba(37,99,235,0.08)', border: '1px solid rgba(37,99,235,0.18)', borderRadius: '10px', transition: 'background .18s' }}>
            Nezávazná konzultace zdarma →
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ─── PAGE ROOT ───────────────────────────────────────────────── */
export default function HomePage() {
  return (
    <>
      <Grain />
      <CursorBlob />
      <ScrollBar />
      <Hero />
      <Services />
      <Process />
      <Portfolio />
      <Testimonials />
      <CTA />
      <SPricing />
    </>
  );
}
