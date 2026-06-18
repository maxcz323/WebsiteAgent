'use client';

import { useRef, useEffect, useState } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') gsap.registerPlugin(ScrollTrigger);

const ImmersiveScene = dynamic(
  () => import('@/components/marketing/ImmersiveScene').then(m => ({ default: m.ImmersiveScene })),
  { ssr: false },
);

/* ─── Grain ──────────────────────────────────────────────────── */
function Grain() {
  return (
    <div aria-hidden style={{
      position: 'fixed', inset: 0, zIndex: 990, pointerEvents: 'none', opacity: 0.03,
      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 512 512'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
      backgroundSize: '256px 256px',
    }} />
  );
}

/* ─── Cursor blob ────────────────────────────────────────────── */
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

/* ─── Scroll indicator ───────────────────────────────────────── */
function ScrollIndicator() {
  return (
    <div id="scroll-ind" aria-hidden style={{
      position: 'absolute', bottom: '36px', left: '50%', transform: 'translateX(-50%)',
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px',
      opacity: 0, pointerEvents: 'none',
    }}>
      <span style={{ fontSize: '9px', fontWeight: 600, color: '#1e2e42', textTransform: 'uppercase', letterSpacing: '0.18em' }}>Scroll</span>
      <div style={{ position: 'relative', width: '1px', height: '40px', overflow: 'hidden', background: 'rgba(37,99,235,0.1)' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, width: '1px', height: '50%', background: 'linear-gradient(to bottom, transparent, #2563eb)', animation: 'scrollbar 1.6s ease-in-out infinite' }} />
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   S1 — HERO
   3D: monitor floats, first breathe
   Copy: the product, one line
═══════════════════════════════════════════════════════════════ */
function S1() {
  return (
    <section id="s1" aria-label="Intro" style={{ height: '100vh', display: 'flex', alignItems: 'center', pointerEvents: 'none', position: 'relative', zIndex: 10 }}>
      <ScrollIndicator />
      <div id="s1i" style={{ maxWidth: 'min(580px, 42vw)', padding: '0 52px', opacity: 0 }}>

        {/* Status badge — minimal, monospace-style */}
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '36px' }}>
          <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#2563eb', flexShrink: 0 }} />
          <span style={{ fontSize: '11px', color: '#4a6278', fontWeight: 500, letterSpacing: '0.05em' }}>
            48 h dodání&ensp;·&ensp;záloha 0 Kč&ensp;·&ensp;50+ projektů
          </span>
        </div>

        {/* Headline — single statement */}
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(64px,8.5vw,112px)',
          fontWeight: 300,
          lineHeight: 1.0,
          letterSpacing: '-0.045em',
          color: 'white',
          margin: '0 0 44px',
        }}>
          Web, který<br />
          <em style={{
            fontStyle: 'normal',
            background: 'linear-gradient(135deg,#22d3ee 0%,#3b82f6 70%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>prodává.</em>
        </h1>

        {/* CTAs — one clear, one ghost */}
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', pointerEvents: 'auto' }}>
          <Link href="/kontakt" style={{
            display: 'inline-flex', alignItems: 'center', gap: '9px',
            fontWeight: 600, fontSize: '14px', textDecoration: 'none',
            borderRadius: '10px', padding: '14px 28px',
            background: '#2563eb', color: 'white',
            transition: 'background 0.18s',
          }}>
            Chci web
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
          </Link>
          <Link href="/jak-pracujeme" style={{
            display: 'inline-flex', alignItems: 'center',
            fontWeight: 500, fontSize: '14px', textDecoration: 'none',
            borderRadius: '10px', padding: '14px 24px',
            color: '#5a7890',
            border: '1px solid rgba(255,255,255,0.07)',
            transition: 'color 0.18s, border-color 0.18s',
          }}>
            Jak to funguje
          </Link>
        </div>

      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   S2 — BUILD
   3D: camera zooms in, UI assembles on screen
   Copy: process as three words — confidence, not explanation
═══════════════════════════════════════════════════════════════ */
function S2() {
  return (
    <section id="s2" aria-label="Proces" style={{ height: '100vh', display: 'flex', alignItems: 'center', pointerEvents: 'none', position: 'relative', zIndex: 10 }}>
      <div id="s2i" style={{ maxWidth: 'min(520px, 42vw)', padding: '0 52px', opacity: 0 }}>

        <p style={{ fontSize: '10px', fontWeight: 600, color: '#2563eb', textTransform: 'uppercase', letterSpacing: '0.16em', margin: '0 0 36px' }}>Jak to funguje</p>

        {[
          { n: '01', word: 'Formulář.', note: '3 min' },
          { n: '02', word: 'Návrh.',    note: '24 h'  },
          { n: '03', word: 'Online.',   note: '48 h'  },
        ].map((s, i) => (
          <div key={s.n} style={{
            display: 'flex', alignItems: 'baseline',
            padding: '22px 0',
            borderBottom: i < 2 ? '1px solid rgba(255,255,255,0.05)' : 'none',
          }}>
            <span style={{ fontSize: '10px', color: '#3a5068', fontWeight: 500, marginRight: '20px', minWidth: '22px', letterSpacing: '0.04em', flexShrink: 0 }}>{s.n}</span>
            <span style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(46px,6.5vw,80px)',
              fontWeight: 300,
              color: 'white',
              letterSpacing: '-0.04em',
              lineHeight: 1,
              flex: 1,
            }}>{s.word}</span>
            <span style={{ fontSize: '11px', color: '#1e3a5e', fontWeight: 500, letterSpacing: '0.04em' }}>{s.note}</span>
          </div>
        ))}

      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   S3 — LANDING PAGE STATE
   3D: camera orbits right, landing page on screen
   Copy: what you get — clean, priced, confident
═══════════════════════════════════════════════════════════════ */
function S3() {
  return (
    <section id="s3" aria-label="Nabídka" style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', pointerEvents: 'none', position: 'relative', zIndex: 10 }}>
      <div id="s3i" style={{ maxWidth: 'min(460px, 38vw)', padding: '0 52px', opacity: 0 }}>

        <p style={{ fontSize: '10px', fontWeight: 600, color: '#2563eb', textTransform: 'uppercase', letterSpacing: '0.16em', margin: '0 0 28px' }}>Co dostanete</p>

        {[
          { name: 'Landing page', price: 'od 9 900 Kč',  sub: 'Více poptávek od prvního dne.' },
          { name: 'Firemní web',  price: 'od 14 900 Kč', sub: 'Kompletní online prezentace.'  },
          { name: 'E-commerce',   price: 'od 24 900 Kč', sub: 'Prodávejte 24/7 bez omezení.'  },
        ].map((s, i) => (
          <div key={s.name} style={{ padding: '20px 0', borderBottom: i < 2 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '5px' }}>
              <span style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(22px,3vw,36px)',
                fontWeight: 400,
                color: 'white',
                letterSpacing: '-0.03em',
                lineHeight: 1,
              }}>{s.name}</span>
              <span style={{ fontSize: '11px', color: '#1e3a5e', fontWeight: 500 }}>{s.price}</span>
            </div>
            <span style={{ fontSize: '12px', color: '#4a6880' }}>{s.sub}</span>
          </div>
        ))}

        <div style={{ marginTop: '24px', pointerEvents: 'auto' }}>
          <Link href="/sluzby" style={{ fontSize: '12px', color: '#2563eb', textDecoration: 'none', fontWeight: 500, letterSpacing: '0.02em' }}>
            Celý ceník →
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   S4 — CORPORATE STATE
   3D: camera orbits left, corporate site on screen
   Copy: guarantee — the confidence statement
═══════════════════════════════════════════════════════════════ */
function S4() {
  return (
    <section id="s4" aria-label="Záruka" style={{ height: '100vh', display: 'flex', alignItems: 'center', pointerEvents: 'none', position: 'relative', zIndex: 10 }}>
      <div id="s4i" style={{ maxWidth: 'min(540px, 42vw)', padding: '0 52px', opacity: 0 }}>

        <p style={{ fontSize: '10px', fontWeight: 600, color: '#2563eb', textTransform: 'uppercase', letterSpacing: '0.16em', margin: '0 0 32px' }}>Bez rizika</p>

        <h2 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(38px,5.5vw,72px)',
          fontWeight: 300,
          color: 'white',
          lineHeight: 1.0,
          letterSpacing: '-0.04em',
          margin: '0 0 28px',
        }}>
          Záloha nula.<br />
          Platíte až<br />
          <em style={{ color: '#2563eb', fontStyle: 'normal' }}>po schválení.</em>
        </h2>

        <p style={{ fontSize: '14px', color: '#4a6880', lineHeight: 1.85, margin: '0 0 28px', maxWidth: '360px' }}>
          Nejdřív uvidíte hotový návrh. Teprve pak se rozhodnete. Pokud web nesplní zadání &mdash; vracíme 100 %.
        </p>

        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
          <span style={{ fontSize: '12px', color: '#10b981', fontWeight: 500 }}>Záruka spokojenosti</span>
        </div>

      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   S5 — E-COMMERCE STATE
   3D: low dramatic angle, e-commerce on screen
   Copy: raw numbers — no animation, just weight
═══════════════════════════════════════════════════════════════ */
function S5() {
  return (
    <section id="s5" aria-label="Čísla" style={{ height: '100vh', display: 'flex', alignItems: 'center', pointerEvents: 'none', position: 'relative', zIndex: 10 }}>
      <div id="s5i" style={{ maxWidth: 'min(520px, 42vw)', padding: '0 52px', opacity: 0 }}>

        <p style={{ fontSize: '10px', fontWeight: 600, color: '#2563eb', textTransform: 'uppercase', letterSpacing: '0.16em', margin: '0 0 40px' }}>Za rok fungování</p>

        {[
          { val: '48h',  label: 'Průměrná doba dodání' },
          { val: '50+',  label: 'Dokončených projektů'  },
          { val: '0 Kč', label: 'Záloha předem'         },
        ].map((s, i) => (
          <div key={s.val} style={{
            display: 'flex', alignItems: 'baseline', justifyContent: 'space-between',
            padding: '18px 0',
            borderBottom: i < 2 ? '1px solid rgba(255,255,255,0.05)' : 'none',
          }}>
            <span style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(52px,8vw,100px)',
              fontWeight: 300,
              color: 'white',
              letterSpacing: '-0.05em',
              lineHeight: 1,
            }}>{s.val}</span>
            <span style={{ fontSize: '12px', color: '#3a5878', maxWidth: '140px', textAlign: 'right', lineHeight: 1.5 }}>{s.label}</span>
          </div>
        ))}

      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   S6 — EXPLOSION / CLOSE
   3D: WOW explosion — monitor shatters
   Copy: single ask — clean, no decorations
═══════════════════════════════════════════════════════════════ */
function S6() {
  return (
    <section id="s6" aria-label="Výzva k akci" style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none', position: 'relative', zIndex: 10 }}>
      <div id="s6i" style={{ textAlign: 'center', maxWidth: '580px', padding: '0 36px', opacity: 0, position: 'relative', zIndex: 1 }}>

        <h2 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(68px,11vw,128px)',
          fontWeight: 300,
          color: 'white',
          lineHeight: 0.96,
          letterSpacing: '-0.05em',
          margin: '0 0 28px',
        }}>
          Začněte<br />
          <em style={{
            fontStyle: 'normal',
            background: 'linear-gradient(135deg,#22d3ee 0%,#3b82f6 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>dnes.</em>
        </h2>

        <p style={{ fontSize: '14px', color: '#4a6880', lineHeight: 1.9, margin: '0 0 36px' }}>
          Záloha nula.&ensp;Návrh do 24 hodin.&ensp;Web do 48 hodin.
        </p>

        <div style={{ pointerEvents: 'auto' }}>
          <Link href="/kontakt" style={{
            display: 'inline-flex', alignItems: 'center', gap: '10px',
            padding: '17px 44px',
            background: '#2563eb',
            color: '#fff',
            fontWeight: 600,
            fontSize: '15px',
            letterSpacing: '-0.01em',
            borderRadius: '10px',
            textDecoration: 'none',
            transition: 'background 0.18s',
          }}>
            Poptat projekt zdarma
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
          </Link>
        </div>

      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   PRICING
═══════════════════════════════════════════════════════════════ */
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

        {/* Header */}
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

        {/* Guarantee strip */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', background: 'rgba(16,185,129,0.05)', border: '1px solid rgba(16,185,129,0.12)', borderRadius: '10px', padding: '14px 24px', marginBottom: '40px' }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
          <span style={{ fontSize: '13px', color: '#10b981', fontWeight: 500 }}>Záruka spokojenosti &mdash; web nesplní zadání? Vrátíme 100 % ceny, bez diskuze.</span>
        </div>

        {/* Cards */}
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

        {/* Bottom CTA */}
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

/* ═══════════════════════════════════════════════════════════════
   PAGE ROOT
═══════════════════════════════════════════════════════════════ */
export default function HomePage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check, { passive: true });
    return () => window.removeEventListener('resize', check);
  }, []);

  useEffect(() => {
    const bg = '#060d1a';
    document.documentElement.style.background = bg;
    document.body.style.background = bg;
    const wrap = document.body.firstElementChild as HTMLElement | null;
    if (wrap) wrap.style.background = bg;
    return () => {
      document.documentElement.style.background = '';
      document.body.style.background = '';
      if (wrap) wrap.style.background = '';
    };
  }, []);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    /* S1 — immediate fade-in, no y shift */
    gsap.set('#s1i', { opacity: 1 });
    gsap.fromTo('#s1i > *',
      { opacity: 0 },
      { opacity: 1, duration: 0.9, stagger: 0.14, ease: 'power2.out', delay: 0.3 },
    );

    /* Scroll indicator */
    gsap.to('#scroll-ind', { opacity: 1, duration: 0.6, delay: 1.5, ease: 'power2.out' });
    const hideInd = () => {
      if (window.scrollY > 60) {
        gsap.to('#scroll-ind', { opacity: 0, duration: 0.4 });
        window.removeEventListener('scroll', hideInd);
      }
    };
    window.addEventListener('scroll', hideInd, { passive: true });

    const s1hide = ScrollTrigger.create({
      trigger: '#s1', start: 'bottom 25%',
      onEnter:     () => gsap.to('#s1i', { opacity: 0, duration: 0.45, ease: 'power2.inOut' }),
      onLeaveBack: () => {
        gsap.set('#s1i', { opacity: 1 });
        gsap.fromTo('#s1i > *', { opacity: 0 }, { opacity: 1, duration: 0.7, stagger: 0.1, ease: 'power2.out' });
      },
    });

    /* S2-S6 — pure opacity, per-element stagger */
    const pairs: Array<{ t: string; i: string }> = [
      { t: '#s2', i: '#s2i' },
      { t: '#s3', i: '#s3i' },
      { t: '#s4', i: '#s4i' },
      { t: '#s5', i: '#s5i' },
      { t: '#s6', i: '#s6i' },
    ];

    const triggers = pairs.map(({ t, i }) => {
      gsap.set(i, { opacity: 0 });
      gsap.set(`${i} > *`, { opacity: 0 });

      return ScrollTrigger.create({
        trigger: t, start: 'top 22%', end: 'bottom 38%',
        onEnter: () => {
          gsap.set(i, { opacity: 1 });
          gsap.to(`${i} > *`, { opacity: 1, duration: 0.8, stagger: 0.12, ease: 'power2.out' });
        },
        onLeave: () => {
          gsap.to(i, { opacity: 0, duration: 0.4, ease: 'power2.inOut', onComplete: () => gsap.set(`${i} > *`, { opacity: 0 }) });
        },
        onEnterBack: () => {
          gsap.set(i, { opacity: 1 });
          gsap.to(`${i} > *`, { opacity: 1, duration: 0.7, stagger: { each: 0.1, from: 'end' }, ease: 'power2.out' });
        },
        onLeaveBack: () => {
          gsap.to(i, { opacity: 0, duration: 0.4, ease: 'power2.inOut', onComplete: () => gsap.set(`${i} > *`, { opacity: 0 }) });
        },
      });
    });

    return () => {
      s1hide.kill();
      triggers.forEach(t => t.kill());
      window.removeEventListener('scroll', hideInd);
    };
  }, []);

  return (
    <>
      <div aria-hidden style={{ position: 'fixed', inset: 0, background: '#060d1a', zIndex: 1 }} />

      <Grain />
      <CursorBlob />
      <ScrollBar />

      <div style={{ position: 'fixed', inset: 0, zIndex: 2, pointerEvents: 'none' }}>
        <ImmersiveScene scrollContainerRef={containerRef} mobile={isMobile} />
      </div>

      <div ref={containerRef} style={{ position: 'relative', height: '600vh' }}>
        <S1 /><S2 /><S3 /><S4 /><S5 /><S6 />
      </div>

      <SPricing />

      <style>{`
        @keyframes scrollbar {
          0%   { transform: translateY(-100%); opacity: 0; }
          40%  { opacity: 1; }
          100% { transform: translateY(200%); opacity: 0; }
        }

        html, body { scroll-behavior: smooth; }

        #s1i, #s2i, #s3i, #s4i, #s5i, #s6i { will-change: opacity; }
        #scroll-ind { will-change: opacity; }

        @media (max-width: 767px) {
          #s1i, #s2i, #s3i, #s4i, #s5i, #s6i {
            padding-left: 22px !important;
            padding-right: 22px !important;
            max-width: 100% !important;
          }
          #s3  { justify-content: flex-start !important; }
          #s6i { text-align: left !important; }
        }
      `}</style>
    </>
  );
}
