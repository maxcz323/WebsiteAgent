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
          <span style={{ color: '#60a5fa', fontSize: '11px', fontWeight: 600 }}>50+ firem. Hotovo do 48 h. Záloha nula.</span>
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
          <Mag href="/jak-pracujeme">Jak to funguje →</Mag>
        </div>
        <div style={{ marginTop: '36px' }}>
          <p style={{ fontSize: '10px', color: '#2d3d50', textTransform: 'uppercase', letterSpacing: '0.16em', margin: '0 0 10px' }}>Pracujeme pro</p>
          <p style={{ fontSize: '12px', color: '#3d4e64', lineHeight: 1.9, letterSpacing: '0.01em', margin: 0 }}>
            Instalatéry&ensp;&middot;&ensp;Zubaře&ensp;&middot;&ensp;Kavárny&ensp;&middot;&ensp;Autoservisy&ensp;&middot;&ensp;Fotografy&ensp;&middot;&ensp;Advokáty&ensp;&middot;&ensp;Fitness studia&ensp;&middot;&ensp;Fyzioterapeuty&ensp;&middot;&ensp;Kosmetické salony
          </p>
        </div>
      </div>
    </section>
  );
}

function S2() {
  const steps = [
    { n: '01', t: 'Popište projekt', d: 'Formulář zabere 3 minuty. Žádné schůzky, žádný hovor.', badge: '3 min', c: '#3b82f6' },
    { n: '02', t: 'Uvidíte hotový návrh', d: 'Celý design připravíme do 24 hodin. Bez jakéhokoliv závazku.', badge: '24 h', c: '#8b5cf6' },
    { n: '03', t: 'Web jde online', d: 'Schválíte, spustíme. Platíte až tehdy — a ne dřív.', badge: '48 h', c: '#10b981' },
  ] as const;
  return (
    <section id="s2" aria-label="Jak to funguje" style={{ height: '100vh', display: 'flex', alignItems: 'center', pointerEvents: 'none', position: 'relative', zIndex: 10 }}>
      <div id="s2i" style={{ maxWidth: '500px', padding: '0 48px 0 52px', opacity: 0 }}>
        <p style={{ fontSize: '11px', fontWeight: 600, color: '#3b82f6', textTransform: 'uppercase', letterSpacing: '0.14em', margin: '0 0 22px' }}>Jak to funguje</p>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(24px,3vw,38px)', fontWeight: 300, color: 'white', lineHeight: 1.1, letterSpacing: '-0.025em', margin: '0 0 32px' }}>
          Od poptávky po spuštění.<br />
          <em style={{ color: '#60a5fa' }}>Za 48 hodin.</em>
        </h2>
        {steps.map((s, i) => (
          <div key={s.n} style={{ display: 'flex', gap: '20px', alignItems: 'flex-start', padding: '20px 0', borderBottom: i < 2 ? '1px solid rgba(255,255,255,0.06)' : 'none' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: s.c, letterSpacing: '0.06em', minWidth: '24px', paddingTop: '3px', opacity: 0.7 }}>{s.n}</span>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                <span style={{ fontSize: '16px', fontWeight: 700, color: '#d0e0ff', letterSpacing: '-0.02em' }}>{s.t}</span>
                <span style={{ fontSize: '10px', fontWeight: 700, color: s.c, background: `${s.c}18`, border: `1px solid ${s.c}30`, borderRadius: '10px', padding: '2px 8px', letterSpacing: '0.04em' }}>{s.badge}</span>
              </div>
              <span style={{ fontSize: '13px', color: '#6a7a8e', lineHeight: 1.6 }}>{s.d}</span>
            </div>
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
          { n: '01', t: 'Landing page', sub: 'Více poptávek od prvního dne',    c: '#2563eb' },
          { n: '02', t: 'Firemní web',  sub: 'Kompletní online prezentace',     c: '#7c3aed' },
          { n: '03', t: 'E-commerce',   sub: 'Prodávejte 24/7 bez omezení',     c: '#059669' },
        ].map((s, i) => (
          <div key={s.n} className="svc-row" style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '18px 0', borderBottom: i < 2 ? '1px solid rgba(255,255,255,0.07)' : 'none', cursor: 'default' }}>
            <div className="svc-bar" style={{ width: '3px', height: '36px', background: s.c, borderRadius: '2px', flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
              <span className="svc-title" style={{ display: 'block', fontSize: '18px', fontWeight: 700, color: '#d0e0ff', letterSpacing: '-0.02em', lineHeight: 1.2 }}>{s.t}</span>
              <span style={{ fontSize: '11px', color: '#3d5068', marginTop: '3px', display: 'block' }}>{s.sub}</span>
            </div>
            <span className="svc-arrow">→</span>
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

const REFS = [
  {
    result: '+340%', metric: 'organická návštěvnost',
    client: 'Instalatérství Kovář', location: 'Praha',
    person: 'Jan Kovář', role: 'majitel',
    quote: 'Zavolali jsme v pondělí, ve středu byl web online. Za první měsíc jsem měl dvojnásobek poptávek. Nejlepší investice roku.',
    launched: 'leden 2025', duration: '44 h od podpisu',
    c: '#3b82f6',
  },
  {
    result: '70%', metric: 'nových pacientů online',
    client: 'Zubní ordinace', location: 'Brno',
    person: 'MUDr. Petra Marková', role: 'vedoucí ordinace',
    quote: 'Pacienti nás teď nacházejí sami — bez jedné koruny v Google Ads. Výsledek překonal všechna očekávání.',
    launched: 'únor 2025', duration: '36 h od podpisu',
    c: '#8b5cf6',
  },
  {
    result: '+40%', metric: 'rezervací přes web',
    client: 'Kavárna Šimánek', location: 'Jihlava',
    person: 'Martin Šimánek', role: 'provozovatel',
    quote: 'Investice se vrátila za 2 týdny. Ostatní kavárenské weby vedle nás vypadají zastarale. Víc se nehodí dodat.',
    launched: 'březen 2025', duration: '48 h od podpisu',
    c: '#10b981',
  },
  {
    result: '+120%', metric: 'příchozích kontaktů',
    client: 'Autoservis Novotný', location: 'Plzeň',
    person: 'Radek Novotný', role: 'majitel',
    quote: 'Telefon začal zvonit hned první den po spuštění. Tohle je nejlepší rozhodnutí, co jsem za 10 let podnikání udělal.',
    launched: 'duben 2025', duration: '48 h od podpisu',
    c: '#f59e0b',
  },
] as const;

function S4() {
  return (
    <section id="s4" aria-label="Reference" style={{ height: '100vh', display: 'flex', alignItems: 'center', pointerEvents: 'none', position: 'relative', zIndex: 10 }}>
      <div id="s4i" style={{ width: '100%', opacity: 0, pointerEvents: 'auto' }}>
        {/* Header */}
        <div style={{ padding: '0 48px 0 52px', marginBottom: '28px' }}>
          <p style={{ fontSize: '11px', fontWeight: 600, color: '#3b82f6', textTransform: 'uppercase', letterSpacing: '0.14em', margin: '0 0 12px' }}>50+ dokončených projektů</p>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(32px,4.5vw,56px)', fontWeight: 300, color: 'white', lineHeight: 1.0, letterSpacing: '-0.04em', margin: 0 }}>
            Tihle nám<br />
            <em style={{ color: '#60a5fa' }}>už důvěřovali.</em>
          </h2>
        </div>
        {/* Horizontal scroll */}
        <div className="ref-scroll" style={{ display: 'flex', gap: '14px', overflowX: 'auto', scrollSnapType: 'x mandatory', paddingLeft: '52px', paddingRight: '52px', paddingBottom: '8px', scrollbarWidth: 'none' }}>
          {REFS.map(r => (
            <div key={r.client} className="ref-card" style={{
              flexShrink: 0, width: '268px', scrollSnapAlign: 'start',
              padding: '26px', background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)', borderRadius: '18px',
              display: 'flex', flexDirection: 'column', gap: 0,
            }}>
              {/* Big metric */}
              <div style={{ fontSize: 'clamp(38px,3.5vw,52px)', fontWeight: 800, color: r.c, letterSpacing: '-0.05em', lineHeight: 1 }}>{r.result}</div>
              <div style={{ fontSize: '11px', color: '#5a6e85', marginTop: '5px', marginBottom: '18px', lineHeight: 1.4 }}>{r.metric}</div>
              {/* Quote */}
              <p style={{ fontSize: '12.5px', color: '#8892a4', lineHeight: 1.7, margin: '0 0 18px', flex: 1, borderLeft: `2px solid ${r.c}30`, paddingLeft: '12px' }}>„{r.quote}"</p>
              {/* Person */}
              <div style={{ marginBottom: '12px' }}>
                <div style={{ fontSize: '12px', fontWeight: 700, color: '#c0d0e8' }}>{r.person}</div>
                <div style={{ fontSize: '10px', color: '#4a5a6e', marginTop: '2px' }}>{r.role} · {r.client}, {r.location}</div>
              </div>
              {/* Timeline */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', paddingTop: '12px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: r.c, flexShrink: 0 }} />
                <span style={{ fontSize: '10px', color: '#3a4a5e' }}>Spuštěno {r.launched} · {r.duration}</span>
              </div>
            </div>
          ))}
          {/* View all card */}
          <div style={{ flexShrink: 0, width: '200px', scrollSnapAlign: 'start', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px', padding: '24px', background: 'rgba(37,99,235,0.06)', border: '1px solid rgba(37,99,235,0.15)', borderRadius: '18px' }}>
            <div style={{ fontSize: '13px', color: '#3b82f6', fontWeight: 600, textAlign: 'center', lineHeight: 1.4 }}>Celé portfolio</div>
            <Link href="/portfolio" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 700, color: '#60a5fa', textDecoration: 'none', padding: '8px 18px', background: 'rgba(37,99,235,0.12)', border: '1px solid rgba(37,99,235,0.25)', borderRadius: '20px', transition: 'all 0.2s' }}>
              Zobrazit →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

const CHART_BARS = [0.52, 0.78, 0.44, 0.68, 0.96, 0.6, 0.84, 1.0, 0.72, 0.88];
const CHART_COLORS = ['#3b82f6','#4f8ef7','#6366f1','#7c3aed','#8b5cf6','#6366f1','#4f8ef7','#3b82f6','#60a5fa','#93c5fd'];

function S5() {
  useEffect(() => {
    const handleCountUp = () => {
      /* Animate 3 counting numbers (48h, 50+, 100%) */
      const items = [
        { sel: '[data-cu="48"]',  target: 48,  fmt: (v: number) => v + 'h'  },
        { sel: '[data-cu="50"]',  target: 50,  fmt: (v: number) => v + '+'  },
        { sel: '[data-cu="100"]', target: 100, fmt: (v: number) => v + '%'  },
      ];
      items.forEach(({ sel, target, fmt }, idx) => {
        const el = document.querySelector<HTMLElement>(sel);
        if (!el) return;
        const dur = 1600;
        setTimeout(() => {
          const t0 = performance.now();
          const tick = (now: number) => {
            const p = Math.min((now - t0) / dur, 1);
            const e = 1 - Math.pow(1 - p, 3);
            el.textContent = fmt(Math.round(e * target));
            if (p < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }, idx * 140);
      });
      /* Reveal chart bars */
      document.querySelectorAll<HTMLElement>('.stat-bar').forEach((el, i) => {
        el.style.transition = `transform .65s cubic-bezier(.34,1.4,.64,1) ${(0.3 + i * 0.06).toFixed(2)}s`;
        el.style.transform = 'scaleY(1)';
      });
    };
    window.addEventListener('countup-start', handleCountUp, { once: true });
    return () => window.removeEventListener('countup-start', handleCountUp as EventListener);
  }, []);

  return (
    <section id="s5" aria-label="Statistiky" style={{ height: '100vh', display: 'flex', alignItems: 'center', pointerEvents: 'none', position: 'relative', zIndex: 10 }}>
      <div id="s5i" style={{ maxWidth: '460px', padding: '0 48px 0 52px', opacity: 0 }}>
        <p style={{ fontSize: '11px', fontWeight: 600, color: '#34d399', textTransform: 'uppercase', letterSpacing: '0.14em', margin: '0 0 12px' }}>Za rok fungování</p>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(22px,2.8vw,34px)', fontWeight: 300, color: 'white', lineHeight: 1.12, letterSpacing: '-0.025em', margin: '0 0 28px' }}>
          Čísla, která<br />
          <em style={{ color: '#34d399' }}>mluví za nás.</em>
        </h2>

        {/* 2×2 stat grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '28px 20px', marginBottom: '32px' }}>
          {[
            { cu: '48',  start: '0h',    label: 'Dodání webu',    c: '#60a5fa' },
            { cu: '50',  start: '0+',    label: 'Klientů',         c: '#a78bfa' },
            { cu: '100', start: '0%',    label: 'Spokojení',       c: '#34d399' },
            { cu: null,  start: '0 Kč',  label: 'Záloha předem',  c: '#fbbf24' },
          ].map(({ cu, start, label, c }) => (
            <div key={label}>
              <div style={{ fontSize: 'clamp(38px,5vw,60px)', fontWeight: 800, color: c, letterSpacing: '-0.05em', lineHeight: 1 }}>
                {cu ? <span data-cu={cu}>{start}</span> : start}
              </div>
              <div style={{ fontSize: '10px', color: '#5a6e85', marginTop: '8px', textTransform: 'uppercase', letterSpacing: '0.12em' }}>{label}</div>
            </div>
          ))}
        </div>

        {/* Animated bar chart */}
        <div style={{ position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '4px', height: '56px' }}>
            {CHART_BARS.map((h, i) => (
              <div key={i} className="stat-bar" style={{
                flex: 1, height: `${h * 100}%`,
                background: `linear-gradient(to top,${CHART_COLORS[i]},${CHART_COLORS[i]}66)`,
                borderRadius: '2px 2px 0 0',
              }} />
            ))}
          </div>
          <div style={{ height: '1px', background: 'rgba(255,255,255,0.08)', marginTop: '0' }} />
          <p style={{ fontSize: '9px', color: '#2a3a4c', marginTop: '8px', textTransform: 'uppercase', letterSpacing: '0.12em' }}>
            Počet dokončených projektů / kvartál
          </p>
        </div>
      </div>
    </section>
  );
}

function S6() {
  return (
    <section id="s6" aria-label="Výzva k akci" style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none', position: 'relative', zIndex: 10, overflow: 'hidden' }}>
      {/* Animated radial spotlight */}
      <div aria-hidden style={{
        position: 'absolute', inset: 0, zIndex: 0,
        background: 'radial-gradient(ellipse 80% 60% at 50% 40%, rgba(37,99,235,0.18) 0%, rgba(124,58,237,0.08) 40%, transparent 70%)',
        animation: 'ctaRadial 6s ease-in-out infinite alternate',
        backgroundSize: '200% 200%',
      }} />
      {/* Grid pattern */}
      <div aria-hidden style={{
        position: 'absolute', inset: 0, zIndex: 0,
        backgroundImage: 'linear-gradient(rgba(255,255,255,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.025) 1px,transparent 1px)',
        backgroundSize: '44px 44px',
        WebkitMaskImage: 'radial-gradient(ellipse 70% 70% at 50% 50%,rgba(0,0,0,.6) 0%,transparent 100%)',
        maskImage:        'radial-gradient(ellipse 70% 70% at 50% 50%,rgba(0,0,0,.6) 0%,transparent 100%)',
      }} />

      <div id="s6i" style={{ textAlign: 'center', maxWidth: '620px', padding: '0 36px', opacity: 0, position: 'relative', zIndex: 1 }}>
        {/* Headline */}
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(52px,8vw,100px)', fontWeight: 300, color: 'white', lineHeight: 0.96, letterSpacing: '-0.05em', margin: '0 0 28px' }}>
          Váháte?<br />
          <em style={{ background: 'linear-gradient(135deg,#93c5fd 0%,#60a5fa 40%,#3b82f6 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Správně.
          </em>
        </h2>

        {/* Objection resolution */}
        <p style={{ fontSize: '15px', color: '#7a8a9e', lineHeight: 1.8, margin: '0 0 28px', maxWidth: '460px', marginLeft: 'auto', marginRight: 'auto' }}>
          Nechceme, abyste se rozhodli bezhlavě.<br />
          <span style={{ color: '#c0d0e8' }}>Záloha nula</span> &mdash; platíte až po schválení návrhu.<br />
          <span style={{ color: '#c0d0e8' }}>Revize v ceně</span> &mdash; děláme úpravy, dokud nejste spokojení.
        </p>

        {/* Guarantee */}
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(16,185,129,0.07)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: '20px', padding: '7px 18px', marginBottom: '32px' }}>
          <span style={{ fontSize: '9px', color: '#34d399', letterSpacing: '0.08em' }}>&#9670;</span>
          <span style={{ color: '#34d399', fontSize: '12px', fontWeight: 600 }}>Pokud nejste spokojení &mdash; neplatíte ani korunu.</span>
        </div>

        {/* CTAs */}
        <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap', pointerEvents: 'auto', marginBottom: '22px' }}>
          <Link href="/kontakt" className="cta-glow">
            Poptat projekt zdarma
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </Link>
          <Mag href="/jak-pracujeme">Jak to funguje</Mag>
        </div>

        {/* Social proof strip */}
        <div style={{ display: 'flex', gap: '22px', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap' }}>
          {[
            { t: 'Záloha 0 Kč' },
            { t: 'Dodání do 48h' },
            { t: 'Revize v ceně' },
            { t: '50+ spokojených klientů' },
          ].map(({ t }) => (
            <span key={t} style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '11px', color: '#4a5a6e' }}>
              <span style={{ color: '#2563eb', fontSize: '9px' }}>&#10003;</span>
              {t}
            </span>
          ))}
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
    color: '#3b82f6',
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
    color: '#8b5cf6',
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
    color: '#10b981',
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
    <section style={{ background: '#06060a', position: 'relative', zIndex: 10, padding: '128px 24px 100px' }}>
      <style>{`
        .price-card {
          transition: transform .28s ease, box-shadow .28s ease, border-color .28s ease;
        }
        .price-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 24px 64px rgba(0,0,0,.55) !important;
          border-color: rgba(255,255,255,.14) !important;
        }
        .price-card-popular:hover { border-color: rgba(139,92,246,.5) !important; }
        .price-btn { transition: filter .2s, transform .2s; }
        .price-btn:hover { filter: brightness(1.18); transform: translateY(-1px); }
        .price-btn-ghost:hover { background: rgba(255,255,255,.09) !important; }
        @media(max-width:767px){
          .price-grid { grid-template-columns: 1fr !important; }
          .price-card-popular { margin-top: 0 !important; }
        }
      `}</style>

      {/* Subtle top-glow separator */}
      <div aria-hidden style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '1px', background: 'linear-gradient(90deg,transparent 0%,rgba(139,92,246,.35) 35%,rgba(37,99,235,.35) 65%,transparent 100%)' }} />
      <div aria-hidden style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: '600px', height: '200px', background: 'radial-gradient(ellipse at top, rgba(139,92,246,.1) 0%, transparent 70%)', pointerEvents: 'none' }} />

      <div style={{ maxWidth: '1080px', margin: '0 auto' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '72px' }}>
          <p style={{ fontSize: '11px', fontWeight: 600, color: '#8b5cf6', textTransform: 'uppercase', letterSpacing: '0.14em', margin: '0 0 18px' }}>Ceník</p>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(36px,5.5vw,68px)', fontWeight: 300, color: 'white', lineHeight: 1.0, letterSpacing: '-0.04em', margin: '0 0 18px' }}>
            Transparentní ceny.<br />
            <em style={{ background: 'linear-gradient(135deg,#a78bfa,#8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Žádná překvapení.</em>
          </h2>
          <p style={{ fontSize: '15px', color: '#5a6a80', margin: 0 }}>Platíte až po schválení návrhu. Záloha nula.</p>
        </div>

        {/* Guarantee strip */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.14)', borderRadius: '14px', padding: '14px 24px', marginBottom: '40px' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          <span style={{ fontSize: '13px', color: '#34d399', fontWeight: 600 }}>Záruka spokojenosti &mdash; web nesplní zadání? Vrátíme 100 % ceny, bez diskuze.</span>
        </div>

        {/* Cards */}
        <div className="price-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '20px', alignItems: 'start' }}>
          {PLANS.map(plan => (
            <div
              key={plan.name}
              className={`price-card${plan.popular ? ' price-card-popular' : ''}`}
              style={{
                position: 'relative',
                padding: '32px',
                background: plan.popular ? 'rgba(139,92,246,0.08)' : 'rgba(255,255,255,0.03)',
                border: `1px solid ${plan.popular ? 'rgba(139,92,246,0.28)' : 'rgba(255,255,255,0.08)'}`,
                borderRadius: '20px',
                ...(plan.popular ? { marginTop: '-16px', paddingTop: '48px' } : {}),
              }}
            >
              {/* Popular badge */}
              {plan.popular && (
                <div style={{
                  position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
                  background: 'linear-gradient(135deg,#7c3aed,#6d28d9)', color: 'white',
                  fontSize: '10px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase',
                  padding: '5px 16px', borderRadius: '0 0 12px 12px',
                }}>
                  Nejoblíbenější
                </div>
              )}

              {/* Plan name + dot */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: plan.color, boxShadow: `0 0 8px ${plan.color}88`, flexShrink: 0 }} />
                <span style={{ fontSize: '15px', fontWeight: 700, color: 'white' }}>{plan.name}</span>
              </div>

              {/* Price */}
              <div style={{ marginBottom: '6px', lineHeight: 1 }}>
                <span style={{ fontSize: '11px', color: '#4a5a6e', verticalAlign: 'top', paddingTop: '8px', display: 'inline-block', marginRight: '2px' }}>od</span>
                <span style={{ fontSize: 'clamp(32px,3.5vw,44px)', fontWeight: 800, color: plan.color, letterSpacing: '-0.04em' }}>{plan.price}</span>
                <span style={{ fontSize: '13px', color: '#5a6a80', marginLeft: '4px' }}>Kč</span>
              </div>
              <p style={{ fontSize: '13px', color: '#6b7a8d', lineHeight: 1.6, margin: '0 0 24px' }}>{plan.desc}</p>

              {/* Divider */}
              <div style={{ height: '1px', background: 'rgba(255,255,255,0.07)', marginBottom: '22px' }} />

              {/* Features */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '32px' }}>
                {plan.features.map(f => (
                  <div key={f} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={plan.color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: '2px' }}>
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                    <span style={{ fontSize: '13px', color: '#a0aec0', lineHeight: 1.5 }}>{f}</span>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <Link
                href="/kontakt"
                className={`price-btn${plan.popular ? '' : ' price-btn-ghost'}`}
                style={{
                  display: 'block', textAlign: 'center', padding: '14px 20px',
                  background: plan.popular ? '#8b5cf6' : 'rgba(255,255,255,0.05)',
                  color: 'white', fontSize: '14px', fontWeight: 700,
                  borderRadius: '12px', textDecoration: 'none',
                  border: `1px solid ${plan.popular ? 'rgba(139,92,246,0.5)' : 'rgba(255,255,255,0.1)'}`,
                  ...(plan.popular ? { boxShadow: '0 0 28px rgba(139,92,246,0.28)' } : {}),
                }}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>

        {/* FAQ-style bottom note */}
        <div style={{ marginTop: '48px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: '20px' }}>
          {[
            { q: 'Proč platím až po schválení?', a: 'Nejdřív vám ukážeme hotový návrh. Teprve po odsouhlasení pošleme fakturu.' },
            { q: 'Co když web neodpovídá zadání?', a: 'Revize jsou v ceně. Děláme úpravy, dokud nejste 100% spokojení.' },
            { q: 'Jak rychle dostanu web?', a: 'Standardně do 48 hodin od zahájení spolupráce. Bez výjimek.' },
          ].map(({ q, a }) => (
            <div key={q} style={{ padding: '20px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '14px' }}>
              <p style={{ fontSize: '13px', fontWeight: 700, color: '#d0ddf0', margin: '0 0 8px', lineHeight: 1.4 }}>{q}</p>
              <p style={{ fontSize: '12px', color: '#6b7a8d', margin: 0, lineHeight: 1.65 }}>{a}</p>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div style={{ textAlign: 'center', marginTop: '64px' }}>
          <p style={{ fontSize: '13px', color: '#4a5a6e', marginBottom: '20px' }}>
            Nejste si jistí, který plán je pro vás správný? Poradíme zdarma.
          </p>
          <Link href="/kontakt" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: 700, color: '#8b5cf6', textDecoration: 'none', padding: '12px 28px', background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.25)', borderRadius: '12px', transition: 'all .2s' }}>
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
          if (i === '#s5i') window.dispatchEvent(new CustomEvent('countup-start'));
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

      {/* Pricing — after immersive 3D scroll, own background */}
      <SPricing />

      <style>{`
        @keyframes pulse    { 0%,100%{opacity:1} 50%{opacity:.35} }
        @keyframes scrollbar{ 0%{transform:translateY(-100%);opacity:0} 40%{opacity:1} 100%{transform:translateY(200%);opacity:0} }
        @keyframes glowPulse{
          0%,100%{ box-shadow:0 0 0 1px rgba(37,99,235,.5),0 8px 32px rgba(37,99,235,.35); }
          50%    { box-shadow:0 0 0 1px rgba(37,99,235,.75),0 8px 52px rgba(37,99,235,.6),0 0 100px rgba(37,99,235,.14); }
        }
        @keyframes ctaRadial{
          0%   { background-position:0% 50%; }
          100% { background-position:100% 50%; }
        }
        @keyframes gridFade { from{opacity:0} to{opacity:1} }
        @keyframes numReveal{ 0%{transform:scale(.82) translateY(6px);opacity:0} 60%{transform:scale(1.04) translateY(-1px)} 100%{transform:scale(1) translateY(0);opacity:1} }

        html,body { scroll-behavior:smooth; }

        /* ── Service row hover ─────────────────────────── */
        .svc-row { transition:background .22s ease,padding .22s ease; }
        .svc-row:hover { background:rgba(255,255,255,.04) !important; border-radius:10px; margin-left:-12px; padding-left:12px !important; padding-right:12px !important; }
        .svc-bar  { transition:transform .22s ease,opacity .22s ease; }
        .svc-row:hover .svc-bar { transform:scaleY(1.18) !important; }
        .svc-title{ transition:color .22s ease; }
        .svc-row:hover .svc-title { color:#e2eaff !important; }
        .svc-arrow{ opacity:0;transform:translateX(-5px);transition:all .22s ease;color:#a78bfa;font-size:15px;flex-shrink:0; }
        .svc-row:hover .svc-arrow { opacity:1;transform:translateX(0); }

        /* ── Reference card hover ──────────────────────── */
        .ref-card { transition:transform .28s ease,border-color .28s ease,box-shadow .28s ease; }
        .ref-card:hover { transform:translateY(-5px) !important; border-color:rgba(255,255,255,.16) !important; box-shadow:0 20px 50px rgba(0,0,0,.45),0 0 0 1px rgba(255,255,255,.07) !important; }
        .ref-scroll::-webkit-scrollbar { display:none; }

        /* ── Stat chart bars ───────────────────────────── */
        .stat-bar { transform:scaleY(0); transform-origin:bottom; }

        /* ── CTA glow button ───────────────────────────── */
        .cta-glow {
          display:inline-flex; align-items:center; gap:10px;
          padding:17px 42px; background:#2563eb; color:#fff;
          font-weight:700; font-size:15px; letter-spacing:-.01em;
          border-radius:14px; text-decoration:none;
          animation:glowPulse 2.8s ease-in-out infinite;
          transition:background .2s,transform .3s cubic-bezier(.33,1,.68,1);
        }
        .cta-glow:hover { background:#1d4ed8; transform:translateY(-3px) scale(1.03); }

        /* ── Mobile ────────────────────────────────────── */
        @media (max-width:767px){
          #s1i,#s2i,#s3i,#s5i,#s6i { padding-left:22px !important; padding-right:22px !important; max-width:100% !important; }
          #s3  { justify-content:flex-start !important; }
          #s4  { align-items:flex-start !important; padding-top:72px; }
          #s4i .ref-scroll { padding-left:22px !important; padding-right:22px !important; }
          #s6i { text-align:left !important; }
          .cta-glow { font-size:14px; padding:14px 28px; }
        }

        /* Performance */
        #s1i,#s2i,#s3i,#s4i,#s5i,#s6i { will-change:opacity; }
        #scroll-ind { will-change:opacity,transform; }
      `}</style>
    </>
  );
}
