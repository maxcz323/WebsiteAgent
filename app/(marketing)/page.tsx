'use client';

import { useRef, useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, useScroll, useTransform, useInView, AnimatePresence } from 'framer-motion';

/* ─── Palette ─────────────────────────────────────────────────── */
const BG    = '#faf7f6';
const BG2   = '#f0ebe7';
const ACCENT = '#285570';

const CARD: React.CSSProperties = {
  background: '#ffffff',
  border: '1px solid #e3ded7',
  borderRadius: '18px', padding: '28px',
  boxShadow: '0 2px 20px rgba(40,85,112,0.06)',
};

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
      position: 'fixed', inset: 0, zIndex: 990, pointerEvents: 'none', opacity: 0.025,
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
      background: 'radial-gradient(circle, rgba(40,85,112,0.06) 0%, transparent 70%)',
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
    <section style={{ background: BG, minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', overflow: 'hidden', position: 'relative' }}>
      {/* Background blobs */}
      <div aria-hidden style={{ position: 'absolute', top: '-15%', right: '-8%', width: '700px', height: '700px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(40,85,112,0.06) 0%, transparent 65%)', pointerEvents: 'none' }} />
      <div aria-hidden style={{ position: 'absolute', bottom: '-5%', left: '-10%', width: '550px', height: '550px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(227,222,215,0.45) 0%, transparent 65%)', pointerEvents: 'none' }} />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-5 sm:px-10" style={{ paddingTop: '120px', paddingBottom: '60px' }}>

        {/* ── 2-column grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center" style={{ marginBottom: '72px' }}>

          {/* Left: text */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.05 }}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', background: 'rgba(40,85,112,0.08)', border: '1px solid rgba(40,85,112,0.14)', borderRadius: '20px', padding: '5px 14px', marginBottom: '28px' }}
            >
              <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: ACCENT }} />
              <span style={{ fontSize: '12px', fontWeight: 600, color: ACCENT, letterSpacing: '0.02em' }}>Přijímáme nové projekty</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.12 }}
              style={{ fontFamily: 'var(--font-display)', fontWeight: 300, letterSpacing: '-0.04em', lineHeight: 0.95, color: '#1a2e3d', fontSize: 'clamp(44px,6vw,88px)', marginBottom: '28px' }}
            >
              Web, který<br />prodává.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.22 }}
              style={{ fontSize: '19px', lineHeight: 1.7, color: '#5c5650', maxWidth: '380px', marginBottom: '40px' }}
            >
              Moderní weby pro lokální firmy.<br />
              <span style={{ color: '#cbcac7' }}>Platíte až po schválení. Záloha 0 Kč.</span>
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.32 }}
              className="flex flex-col sm:flex-row gap-3"
            >
              <Link href="/kontakt" className="btn-mkt-primary">
                Chci web pro svou firmu
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
              </Link>
              <Link href="/jak-pracujeme" className="btn-mkt-ghost">Jak to funguje</Link>
            </motion.div>
          </div>

          {/* Right: image with floating badges */}
          <motion.div
            initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.85, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="hidden lg:block"
            style={{ position: 'relative' }}
          >
            {/* Main image */}
            <div style={{ borderRadius: '24px', overflow: 'hidden', boxShadow: '0 32px 80px rgba(40,85,112,0.14), 0 4px 16px rgba(40,85,112,0.08)', border: '1px solid #e3ded7' }}>
              <img
                src="https://images.unsplash.com/photo-1547658719-da2b51169166?w=900&q=85&auto=format&fit=crop"
                alt="Web design na monitoru"
                style={{ width: '100%', height: '480px', objectFit: 'cover', display: 'block' }}
              />
            </div>

            {/* Floating card — bottom left */}
            <motion.div
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.65 }}
              style={{ position: 'absolute', bottom: '28px', left: '-28px', background: '#fff', border: '1px solid #e3ded7', borderRadius: '16px', padding: '14px 18px', boxShadow: '0 12px 32px rgba(40,85,112,0.12)', display: 'flex', alignItems: 'center', gap: '12px', minWidth: '200px' }}
            >
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(40,85,112,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={ACCENT} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
              </div>
              <div>
                <p style={{ fontSize: '13px', fontWeight: 700, color: '#1a2e3d', margin: 0, lineHeight: 1.2 }}>Web schválen</p>
                <p style={{ fontSize: '11px', color: '#cbcac7', margin: 0, marginTop: '2px' }}>Pavel Novák Instalace</p>
              </div>
            </motion.div>

            {/* Floating badge — top right */}
            <motion.div
              initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.75 }}
              style={{ position: 'absolute', top: '28px', right: '-24px', background: ACCENT, borderRadius: '16px', padding: '14px 20px', boxShadow: '0 12px 32px rgba(40,85,112,0.3)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
            >
              <span style={{ fontSize: '26px', fontWeight: 700, color: '#fff', lineHeight: 1 }}>48h</span>
              <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.65)', marginTop: '3px', letterSpacing: '0.04em' }}>DODÁNÍ</span>
            </motion.div>

            {/* Floating mini-card — middle right edge */}
            <motion.div
              initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.85 }}
              style={{ position: 'absolute', top: '50%', right: '-20px', transform: 'translateY(-50%)', background: '#fff', border: '1px solid #e3ded7', borderRadius: '12px', padding: '10px 14px', boxShadow: '0 8px 24px rgba(40,85,112,0.1)', display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              <div style={{ display: 'flex', gap: '1px' }}>
                {[1,2,3,4,5].map(s => (
                  <svg key={s} width="10" height="10" viewBox="0 0 24 24" fill={ACCENT}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
                ))}
              </div>
              <span style={{ fontSize: '11px', fontWeight: 600, color: '#1a2e3d' }}>50+ klientů</span>
            </motion.div>
          </motion.div>
        </div>

        {/* ── Stats bar — full width ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-px"
          style={{ background: '#e3ded7', borderRadius: '16px', overflow: 'hidden', border: '1px solid #e3ded7' }}
        >
          {STATS.map(s => (
            <div key={s.l} style={{ background: '#fff', padding: '22px 28px', textAlign: 'center' }}>
              <p style={{ fontSize: '26px', fontWeight: 700, color: ACCENT, letterSpacing: '-0.03em', marginBottom: '4px' }}>{s.n}</p>
              <p style={{ fontSize: '11px', color: '#cbcac7', margin: 0 }}>{s.l}</p>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 pointer-events-none" style={{ opacity: 0.3 }}>
        <div style={{ width: '20px', height: '32px', borderRadius: '10px', border: `1px solid ${ACCENT}`, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: '6px' }}>
          <motion.div style={{ width: '4px', height: '6px', borderRadius: '2px', background: ACCENT }}
            animate={{ y: [0, 10, 0] }} transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }} />
        </div>
      </div>
    </section>
  );
}

/* ─── SERVICES ────────────────────────────────────────────────── */
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
  const inView = useInView(outerRef, { once: false, amount: 0.2 });
  const E = (delay = 0) => ({ duration: 0.9, ease: [0.22, 1, 0.36, 1] as any, delay: inView ? delay : 0 });

  return (
    <div ref={outerRef} style={{ background: BG, padding: '220px 24px' }}>
      <div style={{ maxWidth: '1080px', margin: '0 auto' }}>

        <motion.div
          animate={{ opacity: inView ? 1 : 0, x: inView ? 0 : -80 }}
          transition={E(0)}
          className="mb-10"
        >
          <p style={{ fontSize: '11px', fontWeight: 600, color: 'rgba(40,85,112,0.55)', textTransform: 'uppercase', letterSpacing: '0.16em', marginBottom: '14px' }}>Naše služby</p>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(26px,3.8vw,50px)', fontWeight: 300, color: '#1a2e3d', letterSpacing: '-0.03em', lineHeight: 1.1, margin: 0 }}>
              Co vytvoříme<br />pro vaši firmu
            </h2>
            <Link href="/sluzby" style={{ fontSize: '13px', fontWeight: 600, color: '#cbcac7', textDecoration: 'none', whiteSpace: 'nowrap', transition: 'color .15s' }}
              onMouseEnter={e => (e.currentTarget.style.color = ACCENT)}
              onMouseLeave={e => (e.currentTarget.style.color = '#cbcac7')}
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
              <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(40,85,112,0.08)', color: ACCENT, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '22px' }}>
                {s.icon}
              </div>
              <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#1a2e3d', marginBottom: '8px' }}>{s.title}</h3>
              <p style={{ fontSize: '15px', lineHeight: 1.65, color: '#a8a4a0', marginBottom: '28px' }}>{s.desc}</p>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '13px', fontWeight: 600, color: ACCENT }}>{s.price}</span>
                <span style={{ fontSize: '12px', color: '#cbcac7' }}>Detail →</span>
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
  const inView = useInView(outerRef, { once: false, amount: 0.2 });
  const E = (delay = 0) => ({ duration: 0.9, ease: [0.22, 1, 0.36, 1] as any, delay: inView ? delay : 0 });

  return (
    <div ref={outerRef} style={{ background: BG2, padding: '220px 24px' }}>
      <div style={{ maxWidth: '1080px', margin: '0 auto' }}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          <motion.div animate={{ opacity: inView ? 1 : 0, x: inView ? 0 : -90 }} transition={E(0)}>
            <p style={{ fontSize: '11px', fontWeight: 600, color: 'rgba(40,85,112,0.55)', textTransform: 'uppercase', letterSpacing: '0.16em', marginBottom: '14px' }}>Jak pracujeme</p>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(26px,3.8vw,50px)', fontWeight: 300, color: '#1a2e3d', letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: '24px' }}>
              Od formuláře<br />po hotový web<br />za 48 hodin.
            </h2>
            <p style={{ fontSize: '16px', lineHeight: 1.7, color: '#8a8480', marginBottom: '32px', maxWidth: '340px' }}>
              Žádné zálohy, žádné překvapení. Platíte až ve chvíli, kdy jste spokojení s výsledkem.
            </p>
            <Link href="/jak-pracujeme" style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', fontSize: '13px', fontWeight: 600, color: '#cbcac7', textDecoration: 'none', transition: 'color .15s' }}
              onMouseEnter={e => (e.currentTarget.style.color = ACCENT)}
              onMouseLeave={e => (e.currentTarget.style.color = '#cbcac7')}
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
                style={{ background: '#fff', border: '1px solid #e3ded7', borderRadius: '14px', padding: '18px 22px', display: 'flex', alignItems: 'center', gap: '16px', boxShadow: '0 2px 12px rgba(40,85,112,0.05)' }}
              >
                <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.05em', color: ACCENT, background: 'rgba(40,85,112,0.08)', borderRadius: '8px', padding: '4px 10px', flexShrink: 0 }}>{step.n}</span>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: '15px', fontWeight: 600, color: '#1a2e3d', marginBottom: '2px' }}>{step.title}</p>
                  <p style={{ fontSize: '14px', color: '#a8a4a0', lineHeight: 1.5, margin: 0 }}>{step.desc}</p>
                </div>
                <span style={{ fontSize: '11px', color: '#cbcac7', flexShrink: 0 }}>{step.time}</span>
              </motion.div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}

/* ─── WEB NESTACI ─────────────────────────────────────────────── */
const WEB_STATS = [
  {
    number: '96 %',
    label: 'hledá online',
    desc: 'Tolik uživatelů začíná hledání produktů a služeb na internetu. Bez viditelnosti v Google nebo na sociálních sítích vás prostě nenajdou — bez ohledu na to, jak skvělý váš web je.',
  },
  {
    number: '7×',
    label: 'kontaktů před nákupem',
    desc: 'Průměrný zákazník potřebuje sedm kontaktů s vaší firmou, než se rozhodne nakoupit. Marketing tyto kontakty vytváří postupně. Web je místem, kde padne finální rozhodnutí.',
  },
  {
    number: '75 %',
    label: 'hodnotí firmu podle webu',
    desc: 'Tři ze čtyř lidí posuzují důvěryhodnost firmy přímo podle jejího webu. Ale aby tam vůbec dorazili, musí je někdo přivést — a to je práce marketingu.',
  },
];

function WebNestaci() {
  const outerRef = useRef<HTMLDivElement>(null);
  const inView = useInView(outerRef, { once: false, amount: 0.2 });
  const E = (delay = 0) => ({ duration: 0.85, ease: [0.22, 1, 0.36, 1] as any, delay: inView ? delay : 0 });

  return (
    <section ref={outerRef} style={{ background: '#1a2e3d', padding: '120px 24px', position: 'relative', overflow: 'hidden' }}>
      <div aria-hidden style={{ position: 'absolute', top: '-20%', right: '-8%', width: '600px', height: '600px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(40,85,112,0.5) 0%, transparent 65%)', pointerEvents: 'none' }} />
      <div aria-hidden style={{ position: 'absolute', bottom: '-15%', left: '-6%', width: '480px', height: '480px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(40,85,112,0.3) 0%, transparent 65%)', pointerEvents: 'none' }} />

      <div style={{ maxWidth: '1080px', margin: '0 auto', position: 'relative' }}>

        <motion.div animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : 28 }} transition={E(0)} style={{ marginBottom: '72px' }}>
          <p style={{ fontSize: '12px', fontWeight: 600, color: 'rgba(250,247,246,0.38)', textTransform: 'uppercase', letterSpacing: '0.16em', marginBottom: '18px' }}>Pravda o online úspěchu</p>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(32px,4.8vw,62px)', fontWeight: 300, color: '#faf7f6', letterSpacing: '-0.04em', lineHeight: 1.05, margin: 0 }}>
            Web je základ.<br />
            <span style={{ color: 'rgba(250,247,246,0.38)' }}>Marketing je motor.</span>
          </h2>
        </motion.div>

        <div style={{ borderTop: '1px solid rgba(250,247,246,0.1)' }}>
          {WEB_STATS.map((s, i) => (
            <motion.div
              key={s.number}
              animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : 20 }}
              transition={E(0.12 + i * 0.12)}
              style={{ borderBottom: '1px solid rgba(250,247,246,0.1)', padding: '44px 0' }}
            >
              <div className="flex flex-col sm:flex-row items-start gap-6 sm:gap-16">
                <div style={{ flexShrink: 0, minWidth: '160px' }}>
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(48px,5.5vw,72px)', fontWeight: 300, color: '#faf7f6', letterSpacing: '-0.04em', lineHeight: 1, display: 'block' }}>{s.number}</span>
                  <p style={{ fontSize: '12px', color: 'rgba(250,247,246,0.35)', marginTop: '6px', margin: '6px 0 0', letterSpacing: '0.04em', textTransform: 'uppercase' }}>{s.label}</p>
                </div>
                <p style={{ fontSize: '17px', lineHeight: 1.75, color: 'rgba(250,247,246,0.6)', margin: 0, maxWidth: '600px', paddingTop: '8px' }}>{s.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : 14 }} transition={E(0.5)} style={{ marginTop: '48px' }}>
          <Link href="/kontakt" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '15px', fontWeight: 600, color: 'rgba(250,247,246,0.42)', textDecoration: 'none', transition: 'color .2s' }}
            onMouseEnter={e => (e.currentTarget.style.color = '#faf7f6')}
            onMouseLeave={e => (e.currentTarget.style.color = 'rgba(250,247,246,0.42)')}
          >
            Pojďme probrat váš online marketing
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

/* ─── CTA ─────────────────────────────────────────────────────── */
function CTA() {
  return (
    <section className="overflow-hidden relative" style={{ background: ACCENT, padding: '140px 24px' }}>
      <div aria-hidden style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'radial-gradient(ellipse 70% 60% at 50% 55%, rgba(255,255,255,0.04) 0%, transparent 70%)' }} />
      <div aria-hidden style={{ position: 'absolute', top: '-20%', right: '-5%', width: '500px', height: '500px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,255,255,0.05) 0%, transparent 65%)', pointerEvents: 'none' }} />
      <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center', position: 'relative' }}>
        <motion.div
          initial={{ opacity: 0, y: 48 }}
          whileInView={{ opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } }}
          viewport={{ once: true, amount: 0.2 }}
        >
          <p style={{ fontSize: '11px', fontWeight: 600, color: 'rgba(250,247,246,0.5)', textTransform: 'uppercase', letterSpacing: '0.16em', marginBottom: '24px' }}>Začněte ještě dnes</p>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(36px,5.5vw,68px)', fontWeight: 300, color: '#fff', letterSpacing: '-0.04em', lineHeight: 1.05, marginBottom: '20px' }}>
            Váš nový web<br />čeká na vás.
          </h2>
          <p style={{ fontSize: '17px', color: 'rgba(250,247,246,0.6)', lineHeight: 1.65, marginBottom: '44px' }}>
            Poptávka zdarma a nezávazná.<br />Do 24 hodin máte první ukázku.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/kontakt" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '14px', fontWeight: 600, letterSpacing: '-0.01em', textDecoration: 'none', padding: '13px 28px', borderRadius: '10px', border: '1.5px solid #fff', color: ACCENT, background: '#fff', transition: 'transform 0.2s, box-shadow 0.2s', whiteSpace: 'nowrap' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 24px rgba(0,0,0,0.18)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = ''; (e.currentTarget as HTMLElement).style.boxShadow = ''; }}
            >
              Získat web ke shlédnutí zdarma
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
            </Link>
            <Link href="/sluzby" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '14px', fontWeight: 500, letterSpacing: '-0.01em', textDecoration: 'none', padding: '13px 28px', borderRadius: '10px', border: '1.5px solid rgba(250,247,246,0.3)', color: 'rgba(250,247,246,0.7)', background: 'transparent', transition: 'border-color 0.25s, color 0.25s, transform 0.2s', whiteSpace: 'nowrap' }}
              onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = 'rgba(250,247,246,0.6)'; el.style.color = '#fff'; el.style.transform = 'translateY(-1px)'; }}
              onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = 'rgba(250,247,246,0.3)'; el.style.color = 'rgba(250,247,246,0.7)'; el.style.transform = ''; }}
            >Prohlédnout služby</Link>
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
      <div aria-hidden style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '1px', background: 'linear-gradient(90deg,transparent 0%,#e3ded7 40%,#e3ded7 60%,transparent 100%)' }} />

      <div style={{ maxWidth: '1080px', margin: '0 auto' }}>
        <motion.div style={{ x: hX, opacity: hOp }} className="text-center mb-16">
          <p style={{ fontSize: '11px', fontWeight: 600, color: 'rgba(40,85,112,0.55)', textTransform: 'uppercase', letterSpacing: '0.16em', marginBottom: '16px' }}>Ceník</p>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(32px,5vw,60px)', fontWeight: 300, color: '#1a2e3d', letterSpacing: '-0.04em', lineHeight: 1.05, marginBottom: '14px' }}>
            Transparentní ceny.<br />Žádná překvapení.
          </h2>
          <p style={{ fontSize: '14px', color: '#cbcac7', margin: 0 }}>Platíte až po schválení návrhu. Záloha nula.</p>
        </motion.div>

        <motion.div style={{ opacity: pOp }} className="flex items-center justify-center gap-2 mb-10 mx-auto max-w-xl">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(40,85,112,0.05)', border: '1px solid rgba(40,85,112,0.1)', borderRadius: '10px', padding: '12px 20px' }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={ACCENT} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
            <span style={{ fontSize: '15px', color: '#5c5650', fontWeight: 500 }}>Záruka spokojenosti — web nesplní zadání? Vrátíme 100 % ceny.</span>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
          {PLANS.map((plan, i) => {
            const motionStyle = i === 0 ? { x: p1X, opacity: pOp } : i === 1 ? { y: p2Y, opacity: pOp } : { x: p3X, opacity: pOp };
            return (
              <motion.div
                key={plan.name}
                style={{ ...motionStyle, position: 'relative', padding: plan.popular ? '40px 28px 32px' : '32px 28px', background: plan.popular ? 'rgba(40,85,112,0.05)' : '#fff', border: `1px solid ${plan.popular ? 'rgba(40,85,112,0.2)' : '#e3ded7'}`, borderRadius: '18px', boxShadow: plan.popular ? '0 4px 24px rgba(40,85,112,0.1)' : '0 2px 12px rgba(40,85,112,0.04)', ...(plan.popular ? { marginTop: '-10px' } : {}) } as any}
              >
                {plan.popular && (
                  <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', background: ACCENT, color: '#fff', fontSize: '10px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', padding: '5px 16px', borderRadius: '0 0 10px 10px' }}>
                    Nejoblíbenější
                  </div>
                )}
                <div style={{ display: 'flex', alignItems: 'center', gap: '9px', marginBottom: '18px' }}>
                  <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: ACCENT, flexShrink: 0 }} />
                  <span style={{ fontSize: '15px', fontWeight: 600, color: '#1a2e3d' }}>{plan.name}</span>
                </div>
                <div style={{ marginBottom: '6px', lineHeight: 1 }}>
                  <span style={{ fontSize: '11px', color: '#cbcac7', verticalAlign: 'top', paddingTop: '8px', display: 'inline-block', marginRight: '2px' }}>od</span>
                  <span style={{ fontSize: 'clamp(32px,3.5vw,44px)', fontWeight: 700, color: '#1a2e3d', letterSpacing: '-0.04em' }}>{plan.price}</span>
                  <span style={{ fontSize: '13px', color: '#cbcac7', marginLeft: '4px' }}>Kč</span>
                </div>
                <p style={{ fontSize: '15px', color: '#8a8480', lineHeight: 1.65, margin: '0 0 20px' }}>{plan.desc}</p>
                <div style={{ height: '1px', background: '#e3ded7', marginBottom: '18px' }} />
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '26px' }}>
                  {plan.features.map(f => (
                    <div key={f} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={ACCENT} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: '3px' }}><polyline points="20 6 9 17 4 12" /></svg>
                      <span style={{ fontSize: '15px', color: '#6b6560', lineHeight: 1.55 }}>{f}</span>
                    </div>
                  ))}
                </div>
                <Link href="/kontakt" className={plan.popular ? 'btn-mkt-card-primary' : 'btn-mkt-card-ghost'}>{plan.cta}</Link>
              </motion.div>
            );
          })}
        </div>

        <motion.div style={{ opacity: pOp }} className="text-center mt-14">
          <p style={{ fontSize: '15px', color: '#cbcac7', marginBottom: '16px' }}>Nejste si jistí, který plán je pro vás správný?</p>
          <Link href="/kontakt" className="btn-mkt-primary">Nezávazná konzultace zdarma →</Link>
        </motion.div>
      </div>
    </section>
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
      style={{ borderBottom: '1px solid #e3ded7' }}
    >
      <button
        onClick={() => setOpen(o => !o)}
        style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '22px 0', background: 'none', border: 'none', cursor: 'pointer', gap: '16px', textAlign: 'left' }}
      >
        <span style={{ fontSize: '17px', fontWeight: 500, color: open ? ACCENT : '#1a2e3d', transition: 'color 0.2s' }}>{item.q}</span>
        <span style={{ flexShrink: 0, width: '24px', height: '24px', borderRadius: '50%', border: `1px solid ${open ? 'rgba(40,85,112,0.3)' : '#e3ded7'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: ACCENT, transition: 'transform 0.25s, border-color 0.2s', transform: open ? 'rotate(45deg)' : 'rotate(0deg)' }}>
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
            <p style={{ fontSize: '16px', lineHeight: 1.7, color: '#6b6560', paddingBottom: '22px', margin: 0 }}>{item.a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function FAQ() {
  return (
    <section style={{ background: BG2, padding: '220px 24px' }}>
      <div style={{ maxWidth: '720px', margin: '0 auto' }}>
        <motion.div
          initial={{ opacity: 0, y: 36 }}
          whileInView={{ opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }}
          viewport={{ once: true, amount: 0.2 }}
          style={{ marginBottom: '56px' }}
        >
          <p style={{ fontSize: '11px', fontWeight: 600, color: 'rgba(40,85,112,0.55)', textTransform: 'uppercase', letterSpacing: '0.16em', marginBottom: '16px' }}>Časté otázky</p>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px,4vw,52px)', fontWeight: 300, color: '#1a2e3d', letterSpacing: '-0.03em', lineHeight: 1.1, margin: 0 }}>
            Máte otázky?<br />Máme odpovědi.
          </h2>
        </motion.div>
        <div style={{ borderTop: '1px solid #e3ded7' }}>
          {FAQS.map((item, i) => <FaqItem key={item.q} item={item} index={i} />)}
        </div>
      </div>
    </section>
  );
}

/* ─── SECTION DIVIDER ────────────────────────────────────────── */
function SectionDivider({ from, to }: { from: string; to: string }) {
  return (
    <div style={{ height: '160px', background: `linear-gradient(to bottom, ${from}, ${to})` }} />
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
      <SectionDivider from={BG} to={BG2} />
      <ProcessSection />
      <SectionDivider from={BG2} to="#1a2e3d" />
      <WebNestaci />
      <SectionDivider from="#1a2e3d" to={ACCENT} />
      <CTA />
      <SectionDivider from={ACCENT} to={BG} />
      <Pricing />
      <SectionDivider from={BG} to={BG2} />
      <FAQ />
    </>
  );
}
