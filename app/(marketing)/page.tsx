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

/* ─── Grain overlay ──────────────────────────────────────────── */
function Grain() {
  return (
    <div aria-hidden style={{
      position: 'fixed', inset: 0, zIndex: 990, pointerEvents: 'none', opacity: 0.035,
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
      c.x += (t.x - c.x) * 0.065; c.y += (t.y - c.y) * 0.065;
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
      background: 'radial-gradient(circle, rgba(37,99,235,0.065) 0%, transparent 70%)',
    }} />
  );
}

/* ─── Scroll progress bar ────────────────────────────────────── */
function ScrollBar() {
  const bar = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const fn = () => {
      const el = document.documentElement;
      if (bar.current) bar.current.style.width = `${(window.scrollY / (el.scrollHeight - el.clientHeight)) * 100}%`;
    };
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, height: '2px', zIndex: 200, background: 'rgba(255,255,255,0.04)' }}>
      <div ref={bar} style={{ width: '0%', height: '100%', background: 'linear-gradient(90deg,#2563eb,#60a5fa)', transition: 'width 0.05s linear' }} />
    </div>
  );
}

/* ─── Magnetic link ──────────────────────────────────────────── */
function Mag({ children, href, primary = false }: { children: React.ReactNode; href: string; primary?: boolean }) {
  const ref = useRef<HTMLAnchorElement>(null);
  const move = (e: React.MouseEvent) => {
    const r = ref.current!.getBoundingClientRect();
    ref.current!.style.transform = `translate(${(e.clientX - (r.left + r.width / 2)) * 0.28}px,${(e.clientY - (r.top + r.height / 2)) * 0.28}px)`;
  };
  const reset = () => { if (ref.current) ref.current.style.transform = ''; };
  return (
    <Link ref={ref} href={href} onMouseMove={move} onMouseLeave={reset}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: '10px',
        fontWeight: 700, fontSize: '14px', textDecoration: 'none', borderRadius: '14px',
        padding: '15px 30px', transition: 'transform 0.45s cubic-bezier(.33,1,.68,1), background 0.2s, box-shadow 0.2s',
        ...(primary
          ? { background: '#2563eb', color: 'white', boxShadow: '0 0 44px rgba(37,99,235,0.42)' }
          : { background: 'rgba(255,255,255,0.05)', color: '#a8b4c4', border: '1px solid rgba(255,255,255,0.1)' }),
      }}
      onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = primary ? '#1d4ed8' : 'rgba(255,255,255,0.09)'; }}
    >
      {children}
    </Link>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SECTION TEXT LAYERS  (pointer-events: none so canvas gets mouse)
═══════════════════════════════════════════════════════════════ */

function ScrollIndicator() {
  return (
    <div id="scroll-ind" aria-hidden style={{
      position: 'absolute', bottom: '36px', left: '50%', transform: 'translateX(-50%)',
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px',
      opacity: 0, pointerEvents: 'none',
    }}>
      <span style={{ fontSize: '9px', fontWeight: 700, color: '#3d4e64', textTransform: 'uppercase', letterSpacing: '0.18em' }}>Scroll</span>
      <div style={{ position: 'relative', width: '1px', height: '44px', overflow: 'hidden', background: 'rgba(37,99,235,0.15)' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, width: '1px', height: '50%', background: 'linear-gradient(to bottom, transparent, #2563eb)', animation: 'scrollbar 1.6s ease-in-out infinite' }} />
      </div>
    </div>
  );
}

function S1() {
  return (
    <section id="s1" aria-label="Intro" style={{ height: '100vh', display: 'flex', alignItems: 'center', pointerEvents: 'none', position: 'relative', zIndex: 10 }}>
      <ScrollIndicator />
      <div id="s1i" style={{ maxWidth: '560px', padding: '0 48px 0 52px', opacity: 0 }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', background: 'rgba(37,99,235,0.1)', border: '1px solid rgba(37,99,235,0.22)', borderRadius: '20px', padding: '5px 14px', marginBottom: '26px' }}>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#60a5fa', animation: 'pulse 2s infinite', flexShrink: 0 }} />
          <span style={{ color: '#60a5fa', fontSize: '11px', fontWeight: 600 }}>Profesionální weby pro lokální firmy</span>
        </div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(52px,6.5vw,88px)', fontWeight: 300, lineHeight: 1.0, letterSpacing: '-0.04em', color: 'white', margin: '0 0 36px' }}>
          Web, který<br />
          <em style={{ display: 'block', background: 'linear-gradient(135deg,#93c5fd,#60a5fa,#3b82f6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>prodává.</em>
        </h1>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', pointerEvents: 'auto' }}>
          <Mag href="/kontakt" primary>
            Chci web pro svou firmu
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </Mag>
          <Mag href="/jak-pracujeme">Jak to funguje</Mag>
        </div>
        <div style={{ display: 'flex', gap: '18px', flexWrap: 'wrap', marginTop: '32px', alignItems: 'center' }}>
          {[
            { label: 'Bez zálohy', icon: '🔒' },
            { label: 'Hotovo za 48h', icon: '⚡' },
            { label: 'Platíte po schválení', icon: '✓' },
            { label: 'Na míru', icon: '🎯' },
          ].map(({ label, icon }) => (
            <span key={label} style={{
              display: 'inline-flex', alignItems: 'center', gap: '5px',
              fontSize: '11px', color: '#6b7a8d', background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.07)', borderRadius: '20px',
              padding: '4px 10px',
            }}>
              <span style={{ fontSize: '10px' }}>{icon}</span>
              {label}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

function S2() {
  return (
    <section id="s2" aria-label="Výhody" style={{ height: '100vh', display: 'flex', alignItems: 'center', pointerEvents: 'none', position: 'relative', zIndex: 10 }}>
      <div id="s2i" style={{ maxWidth: '480px', padding: '0 48px 0 52px', opacity: 0 }}>
        <p style={{ fontSize: '11px', fontWeight: 600, color: '#3b82f6', textTransform: 'uppercase', letterSpacing: '0.14em', margin: '0 0 28px' }}>Proč si nás vybrat</p>
        {[
          { n: '48h',  c: '#60a5fa', d: 'od poptávky po doručení' },
          { n: '0 Kč', c: '#a78bfa', d: 'záloha — platíte po schválení' },
          { n: '100%', c: '#34d399', d: 'přesně na míru vašemu oboru' },
        ].map(({ n, c, d }, i) => (
          <div key={n} style={{ display: 'flex', alignItems: 'center', gap: '22px', padding: '18px 0', borderBottom: i < 2 ? '1px solid rgba(255,255,255,0.07)' : 'none' }}>
            <span style={{ fontSize: 'clamp(38px,4.5vw,58px)', fontWeight: 800, color: c, letterSpacing: '-0.05em', minWidth: '100px', lineHeight: 1 }}>{n}</span>
            <span style={{ fontSize: '14px', color: '#7a8a9e', lineHeight: 1.5 }}>{d}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function S3() {
  return (
    <section id="s3" aria-label="Služby" style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', pointerEvents: 'none', position: 'relative', zIndex: 10 }}>
      <div id="s3i" style={{ maxWidth: '480px', padding: '0 52px', opacity: 0 }}>
        <p style={{ fontSize: '11px', fontWeight: 600, color: '#a78bfa', textTransform: 'uppercase', letterSpacing: '0.14em', margin: '0 0 14px' }}>Naše služby</p>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px,3.5vw,46px)', fontWeight: 400, color: 'white', lineHeight: 1.08, letterSpacing: '-0.025em', margin: '0 0 22px' }}>
          Vše, co vaše firma<br />
          <em style={{ color: '#a78bfa' }}>potřebuje online.</em>
        </h2>
        {[
          { n: '01', t: 'Landing page', c: '#2563eb' },
          { n: '02', t: 'Firemní web',  c: '#7c3aed' },
          { n: '03', t: 'E-commerce',   c: '#059669' },
        ].map((s, i) => (
          <div key={s.n} style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '18px 0', borderBottom: i < 2 ? '1px solid rgba(255,255,255,0.07)' : 'none' }}>
            <div style={{ width: '3px', height: '36px', background: s.c, borderRadius: '2px', flexShrink: 0 }} />
            <span style={{ fontSize: '20px', fontWeight: 700, color: 'white', letterSpacing: '-0.02em' }}>{s.t}</span>
          </div>
        ))}
        <div style={{ marginTop: '22px', pointerEvents: 'auto' }}>
          <Link href="/sluzby" style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', fontSize: '13px', fontWeight: 700, color: '#a78bfa', textDecoration: 'none' }}>
            Prohlédnout všechny služby →
          </Link>
        </div>
      </div>
    </section>
  );
}

function S4() {
  return (
    <section id="s4" aria-label="Portfolio" style={{ height: '100vh', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', paddingBottom: '15vh', pointerEvents: 'none', position: 'relative', zIndex: 10 }}>
      <div id="s4i" style={{ textAlign: 'center', opacity: 0 }}>
        <p style={{ fontSize: '11px', fontWeight: 600, color: '#3b82f6', textTransform: 'uppercase', letterSpacing: '0.14em', margin: '0 0 12px' }}>Naše práce</p>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(38px,5.5vw,72px)', fontWeight: 300, color: 'white', lineHeight: 1.0, letterSpacing: '-0.04em', margin: '0 0 28px' }}>
          Weby, které<br />
          <em style={{ color: '#60a5fa' }}>vydělávají.</em>
        </h2>
        <div style={{ pointerEvents: 'auto' }}>
          <Link href="/portfolio" style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', fontSize: '13px', fontWeight: 700, color: '#3b82f6', textDecoration: 'none' }}>
            Celé portfolio →
          </Link>
        </div>
      </div>
    </section>
  );
}

function S5() {
  return (
    <section id="s5" aria-label="Statistiky" style={{ height: '100vh', display: 'flex', alignItems: 'center', pointerEvents: 'none', position: 'relative', zIndex: 10 }}>
      <div id="s5i" style={{ maxWidth: '460px', padding: '0 48px 0 52px', opacity: 0 }}>
        <p style={{ fontSize: '11px', fontWeight: 600, color: '#34d399', textTransform: 'uppercase', letterSpacing: '0.14em', margin: '0 0 28px' }}>Výsledky v číslech</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px 24px' }}>
          {[
            { n: '48h',  l: 'Dodání',       c: '#60a5fa' },
            { n: '50+',  l: 'Webů',          c: '#a78bfa' },
            { n: '100%', l: 'Spokojení',     c: '#34d399' },
            { n: '0 Kč', l: 'Záloha',        c: '#fbbf24' },
          ].map(({ n, l, c }) => (
            <div key={n}>
              <div style={{ fontSize: 'clamp(38px,5vw,62px)', fontWeight: 800, color: c, letterSpacing: '-0.05em', lineHeight: 1 }}>{n}</div>
              <div style={{ fontSize: '11px', color: '#5a6e85', marginTop: '8px', textTransform: 'uppercase', letterSpacing: '0.12em' }}>{l}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function S6() {
  return (
    <section id="s6" aria-label="Výzva k akci" style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none', position: 'relative', zIndex: 10 }}>
      <div id="s6i" style={{ textAlign: 'center', maxWidth: '700px', padding: '0 36px', opacity: 0 }}>
        <p style={{ fontSize: '11px', fontWeight: 600, color: '#3b82f6', textTransform: 'uppercase', letterSpacing: '0.14em', margin: '0 0 20px' }}>Začněte ještě dnes</p>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(44px,7vw,88px)', fontWeight: 300, color: 'white', lineHeight: 1.0, letterSpacing: '-0.04em', margin: '0 0 36px' }}>
          Začněte<br />
          <em style={{ background: 'linear-gradient(135deg,#93c5fd,#3b82f6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>dnes.</em>
        </h2>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap', pointerEvents: 'auto' }}>
          <Mag href="/kontakt" primary>
            Získat web ke shlédnutí zdarma
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </Mag>
          <Mag href="/sluzby">Prohlédnout služby</Mag>
        </div>
        <p style={{ fontSize: '11px', color: '#5a6a80', marginTop: '20px' }}>
          50+ spokojených klientů · Bez zálohy · Hotovo za 48 hodin
        </p>
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
    /* Override layout bg-white on all wrappers */
    const bg = '#06060a';
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

    /* S1 — stagger children in on mount (pure fade, no y slide) */
    gsap.set('#s1i', { opacity: 1, y: 0 });
    gsap.fromTo('#s1i > *',
      { opacity: 0 },
      { opacity: 1, duration: 0.8, stagger: 0.12, ease: 'power2.out', delay: 0.35 },
    );

    /* Scroll indicator — appears after intro, hides on first scroll */
    gsap.to('#scroll-ind', { opacity: 1, duration: 0.6, delay: 1.4, ease: 'power2.out' });
    const hideInd = () => {
      if (window.scrollY > 60) {
        gsap.to('#scroll-ind', { opacity: 0, duration: 0.4 });
        window.removeEventListener('scroll', hideInd);
      }
    };
    window.addEventListener('scroll', hideInd, { passive: true });

    const s1hide = ScrollTrigger.create({
      trigger: '#s1',
      start: 'bottom 25%',
      onEnter: () => gsap.to('#s1i', { opacity: 0, duration: 0.5, ease: 'power2.inOut' }),
      onLeaveBack: () => {
        gsap.set('#s1i', { opacity: 1, y: 0 });
        gsap.fromTo('#s1i > *',
          { opacity: 0 },
          { opacity: 1, duration: 0.7, stagger: 0.1, ease: 'power2.out' },
        );
      },
    });

    /* S2-S6 — pure opacity fade, per-element stagger; no position shift */
    const pairs: Array<{ t: string; i: string }> = [
      { t: '#s2', i: '#s2i' },
      { t: '#s3', i: '#s3i' },
      { t: '#s4', i: '#s4i' },
      { t: '#s5', i: '#s5i' },
      { t: '#s6', i: '#s6i' },
    ];

    const triggers = pairs.map(({ t, i }) => {
      gsap.set(i, { opacity: 0, x: 0, y: 0 });
      gsap.set(`${i} > *`, { opacity: 0 });

      return ScrollTrigger.create({
        trigger: t, start: 'top 22%', end: 'bottom 38%',

        onEnter: () => {
          gsap.set(i, { opacity: 1 });
          gsap.to(`${i} > *`, { opacity: 1, duration: 0.75, stagger: 0.1, ease: 'power2.out' });
        },
        onLeave: () => {
          gsap.to(i, {
            opacity: 0, duration: 0.4, ease: 'power2.inOut',
            onComplete: () => gsap.set(`${i} > *`, { opacity: 0 }),
          });
        },
        onEnterBack: () => {
          gsap.set(i, { opacity: 1 });
          gsap.to(`${i} > *`, { opacity: 1, duration: 0.75, stagger: { each: 0.1, from: 'end' }, ease: 'power2.out' });
        },
        onLeaveBack: () => {
          gsap.to(i, {
            opacity: 0, duration: 0.4, ease: 'power2.inOut',
            onComplete: () => gsap.set(`${i} > *`, { opacity: 0 }),
          });
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
      {/* Instant dark background — above layout bg-white (z:1), below canvas (z:2) */}
      <div aria-hidden style={{ position: 'fixed', inset: 0, background: '#06060a', zIndex: 1 }} />

      <Grain />
      <CursorBlob />
      <ScrollBar />

      {/* Fixed 3D canvas — behind all scroll content */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 2, pointerEvents: 'none' }}>
        <ImmersiveScene scrollContainerRef={containerRef} mobile={isMobile} />
      </div>

      {/* 600vh scroll container — drives the GSAP timeline */}
      <div ref={containerRef} style={{ position: 'relative', height: '600vh' }}>
        <S1 /><S2 /><S3 /><S4 /><S5 /><S6 />
      </div>

      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.35} }
        @keyframes scrollbar { 0%{transform:translateY(-100%);opacity:0} 40%{opacity:1} 100%{transform:translateY(200%);opacity:0} }
        html,body { scroll-behavior: smooth; }

        /* Mobile responsive overrides */
        @media (max-width: 767px) {
          #s1i { padding: 0 22px !important; max-width: 100% !important; }
          #s2i { padding: 0 22px !important; max-width: 100% !important; }
          #s3i { padding: 0 22px !important; max-width: 100% !important; }
          #s4i { padding: 0 22px !important; }
          #s5i { padding: 0 22px !important; max-width: 100% !important; }
          #s6i { padding: 0 22px !important; max-width: 100% !important; }
          #s3  { justify-content: flex-start !important; }
          #s4  { align-items: center !important; padding-bottom: 0 !important; }
          #s6i { text-align: left !important; }
        }

        /* Performance: hint browser about animated layers */
        #s1i, #s2i, #s3i, #s4i, #s5i, #s6i { will-change: opacity; }
        #scroll-ind { will-change: opacity, transform; }
      `}</style>
    </>
  );
}
