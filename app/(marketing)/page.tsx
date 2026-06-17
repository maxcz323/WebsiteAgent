'use client';

import { useRef, useEffect } from 'react';
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

function S1() {
  return (
    <section id="s1" aria-label="Intro" style={{ height: '100vh', display: 'flex', alignItems: 'center', pointerEvents: 'none', position: 'relative', zIndex: 10 }}>
      <div id="s1i" style={{ maxWidth: '560px', padding: '0 48px 0 52px', opacity: 0, transform: 'translateY(28px)' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', background: 'rgba(37,99,235,0.1)', border: '1px solid rgba(37,99,235,0.22)', borderRadius: '20px', padding: '5px 14px', marginBottom: '26px' }}>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#60a5fa', animation: 'pulse 2s infinite', flexShrink: 0 }} />
          <span style={{ color: '#60a5fa', fontSize: '11px', fontWeight: 600 }}>Profesionální weby pro lokální firmy</span>
        </div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(44px,5.5vw,72px)', fontWeight: 400, lineHeight: 1.02, letterSpacing: '-0.025em', color: 'white', margin: '0 0 20px' }}>
          Web, který vaší firmě
          <em style={{ display: 'block', background: 'linear-gradient(135deg,#93c5fd,#60a5fa,#3b82f6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>posune vpřed.</em>
        </h1>
        <p style={{ fontSize: '17px', color: '#8892a4', lineHeight: 1.72, maxWidth: '440px', margin: '0 0 36px' }}>
          Navrhujeme moderní weby pro lokální podnikatele.{' '}
          <strong style={{ color: '#a8b4c4', fontWeight: 600 }}>Hotovo za 48 hodin. Platíte až po schválení.</strong>
        </p>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', pointerEvents: 'auto' }}>
          <Mag href="/kontakt" primary>
            Chci web pro svou firmu
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </Mag>
          <Mag href="/jak-pracujeme">Jak to funguje</Mag>
        </div>
        <div style={{ display: 'flex', gap: '22px', flexWrap: 'wrap', marginTop: '32px' }}>
          {['Bez zálohy','Platíte po schválení','48 hodin','Na míru'].map(t => (
            <span key={t} style={{ display: 'flex', alignItems: 'center', gap: '7px', fontSize: '12px', color: '#6b7a8d' }}>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
              {t}
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
      <div id="s2i" style={{ maxWidth: '520px', padding: '0 48px 0 52px', opacity: 0, transform: 'translateY(28px)' }}>
        <p style={{ fontSize: '11px', fontWeight: 600, color: '#3b82f6', textTransform: 'uppercase', letterSpacing: '0.14em', margin: '0 0 14px' }}>Naše výhody</p>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(30px,4vw,52px)', fontWeight: 400, color: 'white', lineHeight: 1.06, letterSpacing: '-0.025em', margin: '0 0 24px' }}>
          Rychle. Profesionálně.<br />
          <em style={{ color: '#60a5fa' }}>Bez stresu.</em>
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {[
            { icon: '⚡', t: '48 hodin od poptávky', d: 'Web navrhneme a postavíme za 48 hodin od vašeho formuláře.' },
            { icon: '🔒', t: 'Platíte až po schválení', d: 'Vidíte hotový návrh dříve, než zaplatíte korunu. Bez závazku.' },
            { icon: '🎯', t: 'Přesně na míru', d: 'Každý web navrhujeme nově. Váš obor, váš styl, vaši zákazníci.' },
          ].map(f => (
            <div key={f.t} style={{ display: 'flex', gap: '14px', padding: '14px 16px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.09)' }}>
              <span style={{ fontSize: '18px', flexShrink: 0 }}>{f.icon}</span>
              <div>
                <p style={{ fontSize: '14px', fontWeight: 700, color: 'white', margin: '0 0 3px' }}>{f.t}</p>
                <p style={{ fontSize: '12px', color: '#8892a4', margin: 0, lineHeight: 1.55 }}>{f.d}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function S3() {
  return (
    <section id="s3" aria-label="Služby" style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', pointerEvents: 'none', position: 'relative', zIndex: 10 }}>
      <div id="s3i" style={{ maxWidth: '480px', padding: '0 52px', opacity: 0, transform: 'translateX(28px)' }}>
        <p style={{ fontSize: '11px', fontWeight: 600, color: '#a78bfa', textTransform: 'uppercase', letterSpacing: '0.14em', margin: '0 0 14px' }}>Naše služby</p>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px,3.5vw,46px)', fontWeight: 400, color: 'white', lineHeight: 1.08, letterSpacing: '-0.025em', margin: '0 0 22px' }}>
          Vše, co vaše firma<br />
          <em style={{ color: '#a78bfa' }}>potřebuje online.</em>
        </h2>
        {[
          { n: '01', t: 'Landing page', p: 'od 9 900 Kč',  c: '#2563eb', slug: 'landing-page' },
          { n: '02', t: 'Firemní web',  p: 'od 14 900 Kč', c: '#7c3aed', slug: 'firemni-web'  },
          { n: '03', t: 'E-commerce',   p: 'od 24 900 Kč', c: '#059669', slug: 'ecommerce'    },
        ].map((s, i) => (
          <div key={s.n} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 0', borderBottom: i < 2 ? '1px solid rgba(255,255,255,0.09)' : 'none' }}>
            <span style={{ fontFamily: 'monospace', fontSize: '10px', color: '#6b7a8d', width: '22px', flexShrink: 0 }}>{s.n}</span>
            <div style={{ width: '3px', height: '32px', background: s.c, borderRadius: '2px', flexShrink: 0 }} />
            <span style={{ flex: 1, fontSize: '17px', fontWeight: 700, color: 'white', letterSpacing: '-0.01em' }}>{s.t}</span>
            <span style={{ fontSize: '12px', fontWeight: 600, color: '#6b7a8d' }}>{s.p}</span>
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
      <div id="s4i" style={{ textAlign: 'center', opacity: 0, transform: 'translateY(24px)' }}>
        <p style={{ fontSize: '11px', fontWeight: 600, color: '#3b82f6', textTransform: 'uppercase', letterSpacing: '0.14em', margin: '0 0 12px' }}>Naše práce</p>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px,4vw,52px)', fontWeight: 400, color: 'white', lineHeight: 1.06, letterSpacing: '-0.025em', margin: '0 0 14px' }}>
          Weby, které vydělávají.
        </h2>
        <p style={{ fontSize: '14px', color: '#8892a4', maxWidth: '420px', margin: '0 auto 22px', lineHeight: 1.65 }}>
          Každý web měříme výsledky — kontakty, rezervace, prodeje. Ne jen estetiku.
        </p>
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
      <div id="s5i" style={{ maxWidth: '480px', padding: '0 48px 0 52px', opacity: 0, transform: 'translateY(24px)' }}>
        <p style={{ fontSize: '11px', fontWeight: 600, color: '#34d399', textTransform: 'uppercase', letterSpacing: '0.14em', margin: '0 0 14px' }}>Čísla, která mluví</p>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px,3.5vw,46px)', fontWeight: 400, color: 'white', lineHeight: 1.08, letterSpacing: '-0.025em', margin: '0 0 18px' }}>
          Výsledky, na které<br />
          <em style={{ color: '#34d399' }}>se můžete spolehnout.</em>
        </h2>
        <p style={{ fontSize: '14px', color: '#8892a4', lineHeight: 1.72, marginBottom: '22px' }}>
          Za každým číslem je skutečný klient s reálným výsledkem. Žádné slevy na pravdě.
        </p>
        {['Bez zálohy — platíte jen za hotový schválený web','Do 48 hodin od poptávky po doručení','Každý web měříme a optimalizujeme'].map(t => (
          <div key={t} style={{ display: 'flex', gap: '9px', alignItems: 'flex-start', marginBottom: '9px' }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginTop: '2px', flexShrink: 0 }}><polyline points="20 6 9 17 4 12"/></svg>
            <span style={{ fontSize: '13px', color: '#a8b4c4', lineHeight: 1.55 }}>{t}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function S6() {
  return (
    <section id="s6" aria-label="Výzva k akci" style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none', position: 'relative', zIndex: 10 }}>
      <div id="s6i" style={{ textAlign: 'center', maxWidth: '700px', padding: '0 36px', opacity: 0, transform: 'translateY(24px)' }}>
        <p style={{ fontSize: '11px', fontWeight: 600, color: '#3b82f6', textTransform: 'uppercase', letterSpacing: '0.14em', margin: '0 0 20px' }}>Začněte ještě dnes</p>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(38px,6vw,72px)', fontWeight: 400, color: 'white', lineHeight: 1.02, letterSpacing: '-0.04em', margin: '0 0 18px' }}>
          Váš nový web<br />
          <em style={{ background: 'linear-gradient(135deg,#93c5fd,#3b82f6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>čeká na vás.</em>
        </h2>
        <p style={{ fontSize: '16px', color: '#8892a4', marginBottom: '38px', lineHeight: 1.65 }}>
          Poptávka je zdarma a nezávazná.<br />Do 24 hodin se ozveme s první ukázkou.
        </p>
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

    /* S1 — stagger children in on mount, fade container out on scroll */
    gsap.set('#s1i', { opacity: 1, y: 0 });
    gsap.fromTo('#s1i > *',
      { opacity: 0, y: 26 },
      { opacity: 1, y: 0, duration: 0.88, stagger: 0.13, ease: 'power3.out', delay: 0.3 },
    );

    const s1hide = ScrollTrigger.create({
      trigger: '#s1',
      start: 'bottom 20%',
      onEnter: () => gsap.to('#s1i', { opacity: 0, y: -10, duration: 0.55, ease: 'power2.inOut' }),
      onLeaveBack: () => {
        gsap.set('#s1i', { opacity: 1, y: 0 });
        gsap.fromTo('#s1i > *',
          { opacity: 0, y: 18 },
          { opacity: 1, y: 0, duration: 0.75, stagger: 0.1, ease: 'power3.out' },
        );
      },
    });

    /* S2-S6 — per-element stagger; container controls visibility only */
    const pairs: Array<{ t: string; i: string; ax: 'y' | 'x' }> = [
      { t: '#s2', i: '#s2i', ax: 'y' },
      { t: '#s3', i: '#s3i', ax: 'x' },
      { t: '#s4', i: '#s4i', ax: 'y' },
      { t: '#s5', i: '#s5i', ax: 'y' },
      { t: '#s6', i: '#s6i', ax: 'y' },
    ];

    const triggers = pairs.map(({ t, i, ax }) => {
      /* Reset container transform, hide it; hide children at offset position */
      gsap.set(i, { opacity: 0, x: 0, y: 0 });
      gsap.set(`${i} > *`, { opacity: 0, [ax]: 22 });

      return ScrollTrigger.create({
        trigger: t, start: 'top 20%', end: 'bottom 20%',

        onEnter: () => {
          gsap.set(i, { opacity: 1 });
          gsap.to(`${i} > *`, { opacity: 1, [ax]: 0, duration: 0.8, stagger: 0.1, ease: 'power3.out' });
        },
        onLeave: () => {
          gsap.to(i, {
            opacity: 0, duration: 0.45, ease: 'power2.inOut',
            onComplete: () => gsap.set(`${i} > *`, { opacity: 0, [ax]: 22 }),
          });
        },
        onEnterBack: () => {
          gsap.set(i, { opacity: 1 });
          gsap.to(`${i} > *`, { opacity: 1, [ax]: 0, duration: 0.8, stagger: { each: 0.1, from: 'end' }, ease: 'power3.out' });
        },
        onLeaveBack: () => {
          gsap.to(i, {
            opacity: 0, duration: 0.45, ease: 'power2.inOut',
            onComplete: () => gsap.set(`${i} > *`, { opacity: 0, [ax]: 22 }),
          });
        },
      });
    });

    return () => { s1hide.kill(); triggers.forEach(t => t.kill()); };
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
        <ImmersiveScene scrollContainerRef={containerRef} />
      </div>

      {/* 600vh scroll container — drives the GSAP timeline */}
      <div ref={containerRef} style={{ position: 'relative', height: '600vh' }}>
        <S1 /><S2 /><S3 /><S4 /><S5 /><S6 />
      </div>

      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.35} }
        html,body { scroll-behavior: smooth; }
      `}</style>
    </>
  );
}
