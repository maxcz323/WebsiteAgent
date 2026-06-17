'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';

const HeroScene = dynamic(
  () => import('@/components/marketing/HeroScene').then(m => ({ default: m.HeroScene })),
  { ssr: false }
);

/* ═══════════════════════════════════════════════════════════════════
   AMBIENT ELEMENTS
═══════════════════════════════════════════════════════════════════ */

/* Grain overlay */
function GrainOverlay() {
  return (
    <div aria-hidden style={{
      position: 'fixed', inset: 0, zIndex: 990, pointerEvents: 'none', opacity: 0.038,
      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 512 512'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
      backgroundRepeat: 'repeat', backgroundSize: '256px 256px',
    }} />
  );
}

/* Cursor blob */
function CursorBlob() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const cur = { x: -400, y: -400 };
    const tgt = { x: -400, y: -400 };
    let raf: number;
    const fn = (e: MouseEvent) => { tgt.x = e.clientX; tgt.y = e.clientY; };
    window.addEventListener('mousemove', fn, { passive: true });
    const tick = () => {
      cur.x += (tgt.x - cur.x) * 0.065;
      cur.y += (tgt.y - cur.y) * 0.065;
      if (ref.current) ref.current.style.transform = `translate(${cur.x - 350}px,${cur.y - 350}px)`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => { window.removeEventListener('mousemove', fn); cancelAnimationFrame(raf); };
  }, []);
  return (
    <div ref={ref} aria-hidden style={{
      position: 'fixed', top: 0, left: 0, zIndex: 0, pointerEvents: 'none',
      width: '700px', height: '700px', borderRadius: '50%', willChange: 'transform',
      background: 'radial-gradient(circle, rgba(37,99,235,0.07) 0%, transparent 70%)',
    }} />
  );
}

/* Scroll progress */
function ScrollBar() {
  const barRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const fn = () => {
      const el = document.documentElement;
      const pct = (window.scrollY / (el.scrollHeight - el.clientHeight)) * 100;
      if (barRef.current) barRef.current.style.width = `${pct}%`;
    };
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, height: '2px', zIndex: 200, background: 'rgba(255,255,255,0.04)' }}>
      <div ref={barRef} style={{ width: '0%', height: '100%', background: 'linear-gradient(90deg,#2563eb,#60a5fa)', transition: 'width 0.06s linear' }} />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   ANIMATION PRIMITIVES
═══════════════════════════════════════════════════════════════════ */

/* Per-character reveal */
function CharReveal({ text, delay = 0, className = '' }: { text: string; delay?: number; className?: string }) {
  const [v, setV] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    if (ref.current) {
      const o = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setV(true); o.disconnect(); } }, { threshold: 0.1 });
      o.observe(ref.current);
      return () => o.disconnect();
    }
  }, []);
  return (
    <span ref={ref} className={className} aria-label={text} style={{ display: 'inline' }}>
      {text.split('').map((ch, i) => (
        <span key={i} style={{ display: 'inline-block', overflow: 'hidden', verticalAlign: 'bottom' }}>
          <span style={{
            display: 'inline-block',
            transform: v ? 'translateY(0) rotateX(0deg)' : 'translateY(110%) rotateX(-80deg)',
            transition: `transform 0.65s cubic-bezier(0.16,1,0.3,1) ${delay + i * 28}ms`,
          }}>
            {ch === ' ' ? ' ' : ch}
          </span>
        </span>
      ))}
    </span>
  );
}

/* Line wipe */
function LineReveal({ children, delay = 0, startOnMount = false }: { children: React.ReactNode; delay?: number; startOnMount?: boolean }) {
  const [v, setV] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (startOnMount) { const t = setTimeout(() => setV(true), delay); return () => clearTimeout(t); }
    const el = ref.current; if (!el) return;
    const o = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setV(true); o.disconnect(); } }, { threshold: 0.1 });
    o.observe(el); return () => o.disconnect();
  }, [delay, startOnMount]);
  return (
    <div ref={ref} style={{ overflow: 'hidden', display: 'block' }}>
      <div style={{ display: 'block', transform: v ? 'translateY(0)' : 'translateY(108%)', transition: `transform 0.9s cubic-bezier(0.16,1,0.3,1) ${startOnMount ? 0 : delay}ms` }}>
        {children}
      </div>
    </div>
  );
}

/* Fade + slide reveal */
function Reveal({ children, delay = 0, dir = 'up', className = '' }: { children: React.ReactNode; delay?: number; dir?: 'up' | 'left' | 'right'; className?: string }) {
  const [v, setV] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const o = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setV(true); o.disconnect(); } }, { threshold: 0.05, rootMargin: '0px 0px -24px 0px' });
    o.observe(el); return () => o.disconnect();
  }, []);
  const from = { up: 'translateY(28px)', left: 'translateX(-28px)', right: 'translateX(28px)' }[dir];
  return (
    <div ref={ref} className={className} style={{ opacity: v ? 1 : 0, transform: v ? 'translate(0,0)' : from, transition: `opacity 0.75s ease ${delay}ms, transform 0.75s ease ${delay}ms` }}>
      {children}
    </div>
  );
}

/* CountUp */
function CountUp({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const o = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return; o.disconnect();
      let s: number | null = null;
      const dur = 1800;
      const step = (ts: number) => {
        if (!s) s = ts;
        const p = Math.min((ts - s) / dur, 1);
        setVal(Math.round((1 - Math.pow(1 - p, 3)) * target));
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }, { threshold: 0.5 });
    o.observe(el); return () => o.disconnect();
  }, [target]);
  return <span ref={ref}>{val}{suffix}</span>;
}

/* ═══════════════════════════════════════════════════════════════════
   INTERACTIVE COMPONENTS
═══════════════════════════════════════════════════════════════════ */

/* Magnetic link button */
function MagneticLink({ children, href, primary = false }: { children: React.ReactNode; href: string; primary?: boolean }) {
  const ref = useRef<HTMLAnchorElement>(null);
  const [off, setOff] = useState({ x: 0, y: 0 });
  const handle = (e: React.MouseEvent) => {
    const r = ref.current!.getBoundingClientRect();
    setOff({ x: (e.clientX - (r.left + r.width / 2)) * 0.28, y: (e.clientY - (r.top + r.height / 2)) * 0.28 });
  };
  return (
    <Link ref={ref} href={href}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: '10px',
        fontWeight: 700, fontSize: '14px', textDecoration: 'none', borderRadius: '14px',
        padding: primary ? '15px 32px' : '15px 28px',
        transform: `translate(${off.x}px,${off.y}px)`,
        transition: 'transform 0.45s cubic-bezier(0.33,1,0.68,1), background 0.2s, color 0.2s, box-shadow 0.2s',
        ...(primary ? {
          background: '#2563eb', color: 'white',
          boxShadow: '0 0 40px rgba(37,99,235,0.4)',
        } : {
          background: 'rgba(255,255,255,0.04)', color: '#94a3b8',
          border: '1px solid rgba(255,255,255,0.1)',
        }),
      }}
      onMouseMove={handle}
      onMouseLeave={() => setOff({ x: 0, y: 0 })}
      onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = primary ? '#1d4ed8' : 'rgba(255,255,255,0.08)'; }}
    >
      {children}
    </Link>
  );
}

/* Expandable service row */
function ServiceRow({ num, title, price, desc, accent, slug, delay }: {
  num: string; title: string; price: string; desc: string; accent: string; slug: string; delay: number;
}) {
  const [open, setOpen] = useState(false);
  return (
    <Reveal delay={delay}>
      <div
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onClick={() => { window.location.href = `/kalkulace/${slug}`; }}
        style={{
          borderTop: '1px solid rgba(15,23,42,0.08)',
          padding: open ? '22px 18px' : '22px 0',
          margin: open ? '0 -18px' : '0',
          cursor: 'default',
          borderRadius: open ? '14px' : '0',
          background: open ? `${accent}0e` : 'transparent',
          transition: 'background 0.3s, padding 0.25s, margin 0.25s',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span style={{ fontFamily: 'monospace', fontSize: '11px', color: '#94a3b8', width: '24px', flexShrink: 0 }}>{num}</span>
          <span style={{ flex: 1, fontSize: '20px', fontWeight: 800, color: open ? accent : '#0f172a', letterSpacing: '-0.02em', transition: 'color 0.25s' }}>{title}</span>
          <span style={{ fontSize: '13px', fontWeight: 700, color: open ? accent : '#94a3b8', marginRight: '12px', transition: 'color 0.25s' }}>{price}</span>
          <div style={{
            width: '32px', height: '32px', borderRadius: '50%', flexShrink: 0,
            background: open ? accent : '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center',
            transform: open ? 'rotate(45deg)' : 'rotate(0deg)',
            transition: 'background 0.25s, transform 0.35s cubic-bezier(0.34,1.56,0.64,1)',
          }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={open ? 'white' : '#64748b'} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </div>
        </div>
        <div style={{ maxHeight: open ? '52px' : '0', overflow: 'hidden', transition: 'max-height 0.4s cubic-bezier(0.16,1,0.3,1)' }}>
          <p style={{ fontSize: '14px', color: '#64748b', lineHeight: 1.65, paddingTop: '10px', paddingLeft: '40px' }}>{desc}</p>
        </div>
      </div>
    </Reveal>
  );
}

/* Tilt 3D card */
function TiltCard({ children, style = {}, className = '', onClick }: { children: React.ReactNode; style?: React.CSSProperties; className?: string; onClick?: () => void }) {
  const [tilt, setTilt] = useState({ x: 0, y: 0, sx: 50, sy: 50 });
  return (
    <div className={className} style={{
      ...style,
      transform: `perspective(900px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
      transition: 'transform 0.12s ease-out',
      transformStyle: 'preserve-3d', position: 'relative', cursor: onClick ? 'default' : undefined,
    }}
      onMouseMove={e => {
        const r = e.currentTarget.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        setTilt({ x: y * -7, y: x * 7, sx: (x + 0.5) * 100, sy: (y + 0.5) * 100 });
      }}
      onMouseLeave={() => setTilt({ x: 0, y: 0, sx: 50, sy: 50 })}
      onClick={onClick}
    >
      <div style={{
        position: 'absolute', inset: 0, borderRadius: 'inherit',
        background: `radial-gradient(circle at ${tilt.sx}% ${tilt.sy}%, rgba(255,255,255,0.1) 0%, transparent 65%)`,
        pointerEvents: 'none', zIndex: 2,
        opacity: Math.abs(tilt.x) + Math.abs(tilt.y) > 0.5 ? 1 : 0,
        transition: 'opacity 0.2s',
      }} />
      {children}
    </div>
  );
}

/* Testimonial marquee */
const TESTIMONIALS = [
  { quote: 'Za 48 hodin web hotový, první týden noví zákazníci.', name: 'Pavel Novák', role: 'Instalatér · Praha', initials: 'P', color: '#2563EB' },
  { quote: 'Web vypadá profesionálně. Pacienti důvěřují ordinaci ještě před příchodem.', name: 'MUDr. Jana Procházková', role: 'Zubní lékařka · Brno', initials: 'J', color: '#0d9488' },
  { quote: 'Moderní, přehledný, funkční. Přesně co jsem chtěl — bez otázek navíc.', name: 'Martin Kovář', role: 'Restauratér · Ostrava', initials: 'M', color: '#7c3aed' },
  { quote: 'Online rezervace přidány do 2 dnů. Okamžitě +40 % rezervací.', name: 'Lucie Bláhová', role: 'Kavárna · Jihlava', initials: 'L', color: '#f59e0b' },
];

function TestimonialMarquee() {
  const doubled = useMemo(() => [...TESTIMONIALS, ...TESTIMONIALS], []);
  return (
    <div style={{ overflow: 'hidden' }}>
      <div style={{ display: 'flex', gap: '16px', width: 'max-content', animation: 'marqueeX 40s linear infinite' }}
        onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.animationPlayState = 'paused'; }}
        onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.animationPlayState = 'running'; }}
      >
        {doubled.map((t, i) => (
          <div key={i} style={{
            flexShrink: 0, width: '330px', background: 'white',
            borderRadius: '18px', border: '1px solid #f1f5f9', padding: '22px',
            boxShadow: '0 2px 16px rgba(0,0,0,0.04)',
          }}>
            <div style={{ display: 'flex', gap: '1px', marginBottom: '12px' }}>
              {[1,2,3,4,5].map(s => <svg key={s} width="11" height="11" viewBox="0 0 24 24" fill="#f59e0b" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>)}
            </div>
            <p style={{ fontSize: '13px', color: '#475569', lineHeight: 1.65, marginBottom: '16px' }}>&ldquo;{t.quote}&rdquo;</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '33px', height: '33px', borderRadius: '50%', background: t.color, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '12px', fontWeight: 700, flexShrink: 0 }}>{t.initials}</div>
              <div>
                <p style={{ fontSize: '12px', fontWeight: 700, color: '#0f172a' }}>{t.name}</p>
                <p style={{ fontSize: '11px', color: '#94a3b8' }}>{t.role}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* Portfolio horizontal scroll */
const PORTFOLIO = [
  { client: 'Pavel Novák Instalace', obor: 'Instalatér', city: 'Praha', result: '+340% kontaktů z webu', from: '#1d4ed8', to: '#3b82f6' },
  { client: 'Zubní ordinace Procházková', obor: 'Zubař', city: 'Brno', result: '70% nových pacientů přes web', from: '#0f766e', to: '#0d9488' },
  { client: 'Kavárna Na Rohu', obor: 'Kavárna', city: 'Jihlava', result: '+40% rezervací online', from: '#d97706', to: '#f59e0b' },
  { client: 'Autoservis Procházka', obor: 'Autoservis', city: 'Plzeň', result: '+120% poptávek za měsíc', from: '#7c3aed', to: '#a78bfa' },
  { client: 'Florista Dvořák', obor: 'Kvěťinářství', city: 'Olomouc', result: 'E-shop spuštěn za 48h', from: '#059669', to: '#34d399' },
];

function PortfolioTrack() {
  const trackRef = useRef<HTMLDivElement>(null);
  const scroll = (d: 1 | -1) => trackRef.current?.scrollBy({ left: d * 370, behavior: 'smooth' });
  return (
    <Reveal>
      <div>
        <div ref={trackRef} style={{ display: 'flex', gap: '16px', overflowX: 'auto', scrollSnapType: 'x mandatory', scrollbarWidth: 'none', paddingBottom: '4px' }}>
          {PORTFOLIO.map(p => (
            <TiltCard key={p.client} style={{
              scrollSnapAlign: 'start', flexShrink: 0, width: '350px',
              borderRadius: '20px', overflow: 'hidden',
              background: `linear-gradient(145deg, ${p.from}, ${p.to})`,
            }}>
              {/* Browser chrome */}
              <div style={{ padding: '14px 14px 0' }}>
                <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: '10px', overflow: 'hidden' }}>
                  <div style={{ height: '26px', background: 'rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', padding: '0 10px', gap: '5px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    {['#ff5f57','#ffbd2e','#28ca41'].map(c => <div key={c} style={{ width: '7px', height: '7px', borderRadius: '50%', background: c, opacity: 0.8 }} />)}
                    <div style={{ flex: 1, height: '12px', background: 'rgba(255,255,255,0.08)', borderRadius: '3px', margin: '0 8px' }} />
                  </div>
                  <div style={{ padding: '10px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <div style={{ height: '9px', background: 'rgba(255,255,255,0.4)', borderRadius: '2px', width: '52%' }} />
                    <div style={{ height: '9px', background: 'rgba(255,255,255,0.22)', borderRadius: '2px', width: '38%' }} />
                    <div style={{ height: '5px', background: 'rgba(255,255,255,0.12)', borderRadius: '2px', marginTop: '3px' }} />
                    <div style={{ height: '5px', background: 'rgba(255,255,255,0.12)', borderRadius: '2px', width: '78%' }} />
                    <div style={{ marginTop: '5px', display: 'flex', gap: '6px' }}>
                      <div style={{ height: '18px', background: 'rgba(255,255,255,0.28)', borderRadius: '5px', width: '70px' }} />
                      <div style={{ height: '18px', background: 'rgba(255,255,255,0.08)', borderRadius: '5px', width: '58px', border: '1px solid rgba(255,255,255,0.18)' }} />
                    </div>
                  </div>
                </div>
              </div>
              {/* Info */}
              <div style={{ padding: '14px 14px 16px' }}>
                <div style={{ display: 'flex', gap: '6px', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontSize: '10px', fontWeight: 700, color: 'rgba(255,255,255,0.55)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>{p.obor}</span>
                  <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: '9px' }}>·</span>
                  <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.45)' }}>{p.city}</span>
                </div>
                <p style={{ fontSize: '16px', fontWeight: 800, color: 'white', marginBottom: '12px', letterSpacing: '-0.02em' }}>{p.client}</p>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', background: 'rgba(255,255,255,0.14)', borderRadius: '20px', padding: '6px 14px', backdropFilter: 'blur(8px)' }}>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" /></svg>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: 'white' }}>{p.result}</span>
                </div>
              </div>
            </TiltCard>
          ))}
        </div>
        <div style={{ display: 'flex', gap: '8px', marginTop: '22px' }}>
          {([-1, 1] as const).map(d => (
            <button key={d} onClick={() => scroll(d)} style={{
              width: '42px', height: '42px', borderRadius: '50%',
              border: '1.5px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.04)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'default',
              transition: 'background 0.2s, border-color 0.2s',
            }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = '#2563eb'; (e.currentTarget as HTMLButtonElement).style.borderColor = '#2563eb'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.04)'; (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.12)'; }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                style={{ transform: d === -1 ? 'rotate(180deg)' : 'none' }}>
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          ))}
        </div>
      </div>
    </Reveal>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   PAGE
═══════════════════════════════════════════════════════════════════ */
export default function HomePage() {
  return (
    <>
      <GrainOverlay />
      <CursorBlob />
      <ScrollBar />

      {/* ══ HERO ═══════════════════════════════════════════════════ */}
      <section style={{ position: 'relative', height: '100vh', minHeight: '680px', overflow: 'hidden', background: '#080e1c' }}>
        {/* 3D canvas fills entire hero */}
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
          <HeroScene />
        </div>

        {/* Left vignette — keeps text readable */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(105deg, rgba(8,14,28,0.97) 0%, rgba(8,14,28,0.88) 38%, rgba(8,14,28,0.45) 62%, transparent 80%)', pointerEvents: 'none' }} />

        {/* Dot grid */}
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle, rgba(37,99,235,0.18) 1px, transparent 1px)', backgroundSize: '38px 38px', pointerEvents: 'none', opacity: 0.5 }} />

        {/* Content */}
        <div style={{ position: 'relative', zIndex: 2, height: '100%', display: 'flex', alignItems: 'center' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 40px', width: '100%', paddingTop: '80px' }}>
            <div style={{ maxWidth: '600px' }}>

              {/* Badge */}
              <div style={{ overflow: 'hidden', marginBottom: '28px', animation: 'fadeUp 0.6s 0.1s both' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '11px', fontWeight: 600, color: '#60a5fa', background: 'rgba(37,99,235,0.1)', border: '1px solid rgba(37,99,235,0.2)', padding: '6px 14px', borderRadius: '20px' }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#60a5fa', animation: 'pulse 2s infinite', flexShrink: 0 }} />
                  Profesionální weby pro lokální firmy
                </span>
              </div>

              {/* Headline — per-character */}
              <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(44px, 5.5vw, 72px)', fontWeight: 800, lineHeight: 1.02, letterSpacing: '-0.03em', color: 'white', margin: '0 0 28px' }}>
                <span style={{ display: 'block', animation: 'fadeUp 0.7s 0.15s both' }}>
                  Web, který vaši
                </span>
                <span style={{ display: 'block', background: 'linear-gradient(135deg, #93c5fd 0%, #60a5fa 50%, #3b82f6 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontStyle: 'italic', animation: 'fadeUp 0.7s 0.25s both' }}>
                  firmu posune vpřed.
                </span>
              </h1>

              {/* Subtitle */}
              <p style={{ fontSize: '17px', color: '#94a3b8', lineHeight: 1.72, marginBottom: '36px', maxWidth: '480px', animation: 'fadeUp 0.7s 0.4s both' }}>
                Navrhujeme a stavíme moderní weby pro lokální podnikatele. Zkušení designéři, pečlivě odvedená práce —{' '}
                <strong style={{ color: '#cbd5e1', fontWeight: 600 }}>hotovo za 48 hodin.</strong> Platíte až po schválení.
              </p>

              {/* CTAs */}
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', animation: 'fadeUp 0.7s 0.55s both' }}>
                <MagneticLink href="/kontakt" primary>
                  Chci web pro svou firmu
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                </MagneticLink>
                <MagneticLink href="/jak-pracujeme">
                  Jak to funguje
                </MagneticLink>
              </div>

              {/* Trust */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', marginTop: '36px', animation: 'fadeUp 0.7s 0.7s both' }}>
                {['Bez zálohy', 'Platíte po schválení', '48 hodin', 'Na míru'].map(t => (
                  <span key={t} style={{ display: 'flex', alignItems: 'center', gap: '7px', fontSize: '12px', color: '#475569' }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ SERVICES ═══════════════════════════════════════════════ */}
      <section style={{ background: 'white', padding: '110px 0' }}>
        <div style={{ maxWidth: '860px', margin: '0 auto', padding: '0 36px' }}>
          <Reveal>
            <p style={{ fontSize: '11px', fontWeight: 600, color: '#2563eb', textTransform: 'uppercase', letterSpacing: '0.14em', marginBottom: '10px' }}>Naše služby</p>
          </Reveal>
          <div style={{ overflow: 'hidden', marginBottom: '52px' }}>
            <LineReveal>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(30px, 4vw, 52px)', fontWeight: 800, color: '#0f172a', lineHeight: 1.06, letterSpacing: '-0.03em', margin: 0 }}>
                Vše co vaše firma potřebuje online
              </h2>
            </LineReveal>
          </div>
          <ServiceRow num="01" title="Landing page"  price="od 9 900 Kč"  desc="Jednostránkový web zaměřený na konverzi. Ideální pro řemeslníky, terapeuty a specialisty." accent="#2563eb" slug="landing-page" delay={0} />
          <ServiceRow num="02" title="Firemní web"   price="od 14 900 Kč" desc="Kompletní prezentace firmy. Více stránek, galerie realizací, reference a vše co zákazníci hledají." accent="#7c3aed" slug="firemni-web"  delay={60} />
          <ServiceRow num="03" title="E-commerce"    price="od 24 900 Kč" desc="Plnohodnotný online obchod s produkty, košíkem a platební bránou. Prodávejte online." accent="#059669" slug="ecommerce"    delay={120} />
          <Reveal delay={150}>
            <div style={{ marginTop: '32px', borderTop: '1px solid rgba(15,23,42,0.08)', paddingTop: '24px' }}>
              <Link href="/sluzby" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: 700, color: '#2563eb', textDecoration: 'none', transition: 'gap 0.2s' }}
                onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.gap = '14px'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.gap = '8px'; }}>
                Všechny služby
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ══ STATS ═══════════════════════════════════════════════════ */}
      <section style={{ background: '#080e1c', padding: '110px 0' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 36px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: '1px', background: 'rgba(255,255,255,0.06)', borderRadius: '4px', overflow: 'hidden' }}>
            {[
              { n: 48, suf: 'h', label: 'Průměrná doba dodání', sub: 'od poptávky po hotový web' },
              { n: 50, suf: '+', label: 'Hotových webů', sub: 'pro lokální podnikatele' },
              { n: 100, suf: '%', label: 'Spokojených klientů', sub: 'kteří by nás doporučili' },
              { n: 0, suf: ' Kč', label: 'Záloha předem', sub: 'platíte až po schválení' },
            ].map((s, i) => (
              <Reveal key={i} delay={i * 80}>
                <div style={{ padding: '52px 44px', background: '#080e1c', position: 'relative' }}>
                  <div style={{ position: 'absolute', top: 0, left: 0, width: '3px', height: '44px', background: 'linear-gradient(180deg,#3b82f6,transparent)' }} />
                  <p style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(48px,5vw,68px)', fontWeight: 800, color: 'white', lineHeight: 1, letterSpacing: '-0.04em', marginBottom: '8px' }}>
                    <CountUp target={s.n} suffix={s.suf} />
                  </p>
                  <p style={{ fontSize: '16px', fontWeight: 700, color: '#e2e8f0', marginBottom: '4px' }}>{s.label}</p>
                  <p style={{ fontSize: '12px', color: '#475569' }}>{s.sub}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══ PROCESS ════════════════════════════════════════════════ */}
      <section style={{ background: 'linear-gradient(135deg,#f0f9ff 0%,#eff6ff 100%)', padding: '110px 0' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 36px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', alignItems: 'start' }}>
            <div style={{ position: 'sticky', top: '120px' }}>
              <Reveal dir="left">
                <p style={{ fontSize: '11px', fontWeight: 600, color: '#2563eb', textTransform: 'uppercase', letterSpacing: '0.14em', marginBottom: '10px' }}>Jak pracujeme</p>
                <div style={{ overflow: 'hidden', marginBottom: '16px' }}>
                  <LineReveal>
                    <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(30px,3.5vw,46px)', fontWeight: 800, color: '#0f172a', lineHeight: 1.08, letterSpacing: '-0.03em', margin: 0 }}>
                      Od formuláře po hotový web za 48 hodin.
                    </h2>
                  </LineReveal>
                </div>
                <p style={{ fontSize: '15px', color: '#64748b', lineHeight: 1.72, marginBottom: '24px' }}>
                  Říkáte nám o firmě. My web navrhneme, vy schválíte. Bez schůzek, bez čekání, bez zálohy.
                </p>
                <Link href="/jak-pracujeme" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: 700, color: '#0f172a', textDecoration: 'none', transition: 'gap 0.2s' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.gap = '14px'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.gap = '8px'; }}>
                  Celý postup →
                </Link>
              </Reveal>
            </div>
            <div>
              {[
                { n: '01', t: 'Vyplníte formulář', d: 'Řeknete nám o vaší firmě — obor, město, styl. Zabere to 5 minut.' },
                { n: '02', t: 'Navrhneme web na míru', d: 'Do 48 hodin máte hotový web přesně pro vás — bez schůzek.' },
                { n: '03', t: 'Schválíte a spustíte', d: 'Zapracujeme připomínky. Platíte až po schválení návrhu.' },
              ].map((s, i) => (
                <Reveal key={s.n} delay={i * 100}>
                  <div style={{ display: 'flex', gap: '20px', padding: '30px 0', borderBottom: i < 2 ? '1px solid rgba(37,99,235,0.1)' : 'none' }}>
                    <span style={{ fontFamily: 'monospace', fontSize: '11px', color: '#94a3b8', paddingTop: '3px', flexShrink: 0, width: '24px' }}>{s.n}</span>
                    <div>
                      <p style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', marginBottom: '7px', letterSpacing: '-0.02em' }}>{s.t}</p>
                      <p style={{ fontSize: '14px', color: '#64748b', lineHeight: 1.65 }}>{s.d}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══ HONEST MESSAGE ══════════════════════════════════════════ */}
      <section style={{ background: 'white', padding: '80px 0', borderTop: '1px solid #f1f5f9' }}>
        <div style={{ maxWidth: '860px', margin: '0 auto', padding: '0 36px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '52px', alignItems: 'start' }}>
            <Reveal dir="left">
              <p style={{ fontSize: '11px', fontWeight: 600, color: '#d97706', textTransform: 'uppercase', letterSpacing: '0.14em', marginBottom: '10px' }}>Říkáme to rovnou</p>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '30px', fontWeight: 800, color: '#0f172a', lineHeight: 1.18, letterSpacing: '-0.02em' }}>
                Web sám o sobě vás nezachrání.
              </h2>
            </Reveal>
            <Reveal delay={100}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '15px', color: '#64748b', lineHeight: 1.72 }}>
                <p>Dobrý web je mocný nástroj — ale není zázrak. Pokud prodáváte nekvalitní produkt, žádný design vám zákazníky neudží.</p>
                <p style={{ color: '#475569', fontWeight: 500 }}>Firma, která dělá skvělou práci a nemá kde to ukázat, přichází o zákazníky každý den. Tady vstupujeme my.</p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ══ PORTFOLIO ══════════════════════════════════════════════ */}
      <section style={{ background: '#080e1c', padding: '110px 0' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 36px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '44px', gap: '16px', flexWrap: 'wrap' }}>
            <Reveal>
              <p style={{ fontSize: '11px', fontWeight: 600, color: '#3b82f6', textTransform: 'uppercase', letterSpacing: '0.14em', marginBottom: '10px' }}>Naše práce</p>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(30px,4vw,48px)', fontWeight: 800, color: 'white', letterSpacing: '-0.03em', lineHeight: 1.08, margin: 0 }}>
                Weby, které mluví za sebe
              </h2>
            </Reveal>
            <Reveal delay={100}>
              <Link href="/portfolio" style={{ fontSize: '13px', fontWeight: 700, color: '#3b82f6', textDecoration: 'none', whiteSpace: 'nowrap' }}>
                Celé portfolio →
              </Link>
            </Reveal>
          </div>
          <PortfolioTrack />
        </div>
      </section>

      {/* ══ TESTIMONIALS ═══════════════════════════════════════════ */}
      <section style={{ background: '#f8fafc', padding: '90px 0', overflow: 'hidden' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 0 44px 36px' }}>
          <Reveal>
            <p style={{ fontSize: '11px', fontWeight: 600, color: '#2563eb', textTransform: 'uppercase', letterSpacing: '0.14em', marginBottom: '10px' }}>Reference</p>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(30px,4vw,48px)', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.03em', lineHeight: 1.08, margin: 0 }}>
              Co říkají naši klienti
            </h2>
          </Reveal>
        </div>
        <TestimonialMarquee />
        <div style={{ textAlign: 'center', marginTop: '32px' }}>
          <Link href="/reference" style={{ fontSize: '13px', fontWeight: 700, color: '#2563eb', textDecoration: 'none' }}>
            Všechny reference →
          </Link>
        </div>
      </section>

      {/* ══ PHOTO STRIP ════════════════════════════════════════════ */}
      <section style={{ height: '300px', overflow: 'hidden', position: 'relative' }}>
        <img src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1600&q=80&auto=format&fit=crop" alt="Práce na webu" style={{ width: '100%', height: '100%', objectFit: 'cover' }} loading="lazy" />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(8,14,28,0.9) 0%, rgba(8,14,28,0.3) 55%, transparent 100%)' }} />
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', padding: '0 64px' }}>
          <Reveal>
            <p style={{ fontSize: '11px', fontWeight: 600, color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '10px' }}>Náš přístup</p>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(20px,3vw,34px)', fontWeight: 800, color: 'white', lineHeight: 1.25, maxWidth: '440px', margin: '0 0 16px', letterSpacing: '-0.02em' }}>
              Zkušenost designérů + rychlost moderních nástrojů.
            </h2>
            <Link href="/o-nas" style={{ fontSize: '13px', fontWeight: 600, color: 'rgba(255,255,255,0.65)', textDecoration: 'none' }}>Více o nás →</Link>
          </Reveal>
        </div>
      </section>

      {/* ══ CTA ════════════════════════════════════════════════════ */}
      <section style={{ background: '#080e1c', padding: '130px 0', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle, rgba(37,99,235,0.12) 1px, transparent 1px)', backgroundSize: '38px 38px', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(37,99,235,0.08) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 36px', textAlign: 'center', position: 'relative' }}>
          <Reveal>
            <p style={{ fontSize: '11px', fontWeight: 600, color: '#3b82f6', textTransform: 'uppercase', letterSpacing: '0.14em', marginBottom: '22px' }}>Začněte ještě dnes</p>
          </Reveal>
          <div style={{ overflow: 'hidden', marginBottom: '20px' }}>
            <LineReveal>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(38px,6vw,72px)', fontWeight: 800, color: 'white', lineHeight: 1.02, letterSpacing: '-0.04em', margin: 0 }}>
                Váš nový web čeká na vás.
              </h2>
            </LineReveal>
          </div>
          <Reveal delay={200}>
            <p style={{ fontSize: '16px', color: '#64748b', marginBottom: '40px', lineHeight: 1.65 }}>
              Poptávka je zdarma a nezávazná. Do 24 hodin se ozveme s první ukázkou.
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <MagneticLink href="/kontakt" primary>
                Získat web ke shlédnutí zdarma
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
              </MagneticLink>
              <MagneticLink href="/sluzby">Prohlédnout služby</MagneticLink>
            </div>
          </Reveal>
        </div>
      </section>

      <style>{`
        @keyframes pulse   { 0%,100%{opacity:1} 50%{opacity:.4} }
        @keyframes fadeUp  { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes marqueeX { from{transform:translateX(0)} to{transform:translateX(-50%)} }
        html { scroll-behavior: smooth; }
      `}</style>
    </>
  );
}
