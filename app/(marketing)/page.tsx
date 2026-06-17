'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';

const Monitor3D = dynamic(
  () => import('@/components/marketing/Monitor3D').then(m => ({ default: m.Monitor3D })),
  { ssr: false }
);
const Cursor = dynamic(
  () => import('@/components/marketing/Cursor').then(m => ({ default: m.Cursor })),
  { ssr: false }
);

/* ─── Scroll progress bar ───────────────────────────────────────────── */
function ScrollBar() {
  const [w, setW] = useState(0);
  useEffect(() => {
    const fn = () => {
      const el = document.documentElement;
      setW((window.scrollY / (el.scrollHeight - el.clientHeight)) * 100);
    };
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, height: '2px', zIndex: 200, background: 'rgba(255,255,255,0.04)' }}>
      <div style={{ width: `${w}%`, height: '100%', background: 'linear-gradient(90deg,#3b82f6,#60a5fa)', transition: 'width 0.05s linear' }} />
    </div>
  );
}

/* ─── Line reveal (clip-path wipe from bottom) ─────────────────────── */
function LineReveal({
  children, delay = 0, as: Tag = 'div', className = '', startOnMount = false,
}: {
  children: React.ReactNode;
  delay?: number;
  as?: keyof React.JSX.IntrinsicElements;
  className?: string;
  startOnMount?: boolean;
}) {
  const [v, setV] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (startOnMount) { setTimeout(() => setV(true), delay); return; }
    const el = ref.current;
    if (!el) return;
    const o = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setV(true); o.disconnect(); }
    }, { threshold: 0.1 });
    o.observe(el);
    return () => o.disconnect();
  }, [delay, startOnMount]);
  return (
    // @ts-expect-error dynamic tag
    <Tag ref={ref} className={className} style={{ overflow: 'hidden', display: 'block' }}>
      <span style={{
        display: 'block',
        transform: v ? 'translateY(0)' : 'translateY(108%)',
        transition: `transform 0.9s cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
      }}>
        {children}
      </span>
    </Tag>
  );
}

/* ─── Fade reveal ───────────────────────────────────────────────────── */
function FadeReveal({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  const [v, setV] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const o = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setV(true); o.disconnect(); }
    }, { threshold: 0.05, rootMargin: '0px 0px -30px 0px' });
    o.observe(el);
    return () => o.disconnect();
  }, []);
  return (
    <div ref={ref} className={className} style={{ opacity: v ? 1 : 0, transform: v ? 'translateY(0)' : 'translateY(22px)', transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms` }}>
      {children}
    </div>
  );
}

/* ─── Count-up number ───────────────────────────────────────────────── */
function CountUp({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const o = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      o.disconnect();
      let start: number | null = null;
      const dur = 1600;
      const step = (ts: number) => {
        if (!start) start = ts;
        const p = Math.min((ts - start) / dur, 1);
        setVal(Math.round((1 - Math.pow(1 - p, 3)) * target));
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }, { threshold: 0.5 });
    o.observe(el);
    return () => o.disconnect();
  }, [target]);
  return <span ref={ref}>{val}{suffix}</span>;
}

/* ─── Expandable service row ────────────────────────────────────────── */
function ServiceRow({ num, title, price, desc, accent, slug, delay }: {
  num: string; title: string; price: string; desc: string;
  accent: string; slug: string; delay: number;
}) {
  const [open, setOpen] = useState(false);
  return (
    <FadeReveal delay={delay}>
      <div
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onClick={() => { window.location.href = `/kalkulace/${slug}`; }}
        style={{
          borderTop: '1px solid #e2e8f0',
          cursor: 'none',
          transition: 'background 0.25s, padding 0.2s, margin 0.2s',
          borderRadius: open ? '12px' : '0',
          padding: open ? '22px 16px' : '22px 0',
          background: open ? `${accent}0d` : 'transparent',
          marginInline: open ? '-16px' : '0',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span style={{ fontSize: '11px', fontFamily: 'monospace', color: '#94a3b8', width: '24px', flexShrink: 0 }}>{num}</span>
          <span style={{ flex: 1, fontSize: '18px', fontWeight: 700, color: '#0f172a', transition: 'color 0.2s', ...(open && { color: accent }) }}>
            {title}
          </span>
          <span style={{ fontSize: '13px', fontWeight: 700, color: open ? accent : '#94a3b8', transition: 'color 0.2s', marginRight: '12px' }}>{price}</span>
          <div style={{
            width: '30px', height: '30px', borderRadius: '50%', flexShrink: 0,
            background: open ? accent : '#f1f5f9',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'background 0.25s, transform 0.3s',
            transform: open ? 'rotate(45deg)' : 'rotate(0)',
          }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={open ? 'white' : '#64748b'} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </div>
        </div>
        <div style={{ overflow: 'hidden', maxHeight: open ? '48px' : '0', transition: 'max-height 0.35s ease' }}>
          <p style={{ fontSize: '14px', color: '#64748b', paddingTop: '10px', paddingLeft: '40px' }}>{desc}</p>
        </div>
      </div>
    </FadeReveal>
  );
}

/* ─── Marquee strip ─────────────────────────────────────────────────── */
function Marquee({ items }: { items: string[] }) {
  const doubled = [...items, ...items];
  return (
    <div style={{ overflow: 'hidden', position: 'relative' }}>
      <div style={{ display: 'flex', width: 'max-content', animation: 'marqueeScroll 22s linear infinite' }}>
        {doubled.map((item, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0', flexShrink: 0 }}>
            <span style={{ fontSize: '13px', fontWeight: 600, color: '#475569', padding: '0 28px', whiteSpace: 'nowrap' }}>{item}</span>
            <span style={{ color: '#2563eb', fontSize: '10px' }}>✦</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Testimonial marquee ───────────────────────────────────────────── */
const TESTIMONIALS = [
  { quote: 'Za 48 hodin jsem měl hotový web a hned první týden mi volali noví zákazníci.', name: 'Pavel Novák', role: 'Instalatér · Praha', initials: 'P', color: '#2563EB' },
  { quote: 'Web vypadá profesionálně. Zákazníci důvěřují mé ordinaci ještě předtím, než přijdou.', name: 'MUDr. Jana Procházková', role: 'Zubní lékařka · Brno', initials: 'J', color: '#0d9488' },
  { quote: 'Přesně takový web jsem chtěl — moderní, přehledný a funkční. Bez zbytečných otázek.', name: 'Martin Kovář', role: 'Restauratér · Ostrava', initials: 'M', color: '#7c3aed' },
  { quote: 'Přidali jsme online rezervace a okamžitě jsme zaznamenali +40 % rezervací.', name: 'Lucie Bláhová', role: 'Kavárna · Jihlava', initials: 'L', color: '#f59e0b' },
];

function TestimonialMarquee() {
  const doubled = [...TESTIMONIALS, ...TESTIMONIALS];
  return (
    <div style={{ overflow: 'hidden' }}>
      <div style={{ display: 'flex', gap: '16px', width: 'max-content', animation: 'marqueeScroll 40s linear infinite' }}
        onMouseEnter={e => (e.currentTarget.style.animationPlayState = 'paused')}
        onMouseLeave={e => (e.currentTarget.style.animationPlayState = 'running')}
      >
        {doubled.map((t, i) => (
          <div key={i} style={{
            flexShrink: 0, width: '320px',
            background: 'white', borderRadius: '16px',
            border: '1px solid #f1f5f9',
            padding: '20px',
            boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
          }}>
            <div style={{ display: 'flex', gap: '0.5px', marginBottom: '12px' }}>
              {[1,2,3,4,5].map(s => (
                <svg key={s} width="11" height="11" viewBox="0 0 24 24" fill="#f59e0b" stroke="none">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
              ))}
            </div>
            <p style={{ fontSize: '13px', color: '#475569', lineHeight: '1.6', marginBottom: '14px' }}>&ldquo;{t.quote}&rdquo;</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: t.color, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '12px', fontWeight: 700, flexShrink: 0 }}>{t.initials}</div>
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

/* ─── Portfolio horizontal scroll ───────────────────────────────────── */
const PORTFOLIO = [
  { client: 'Pavel Novák Instalace', obor: 'Instalatér', city: 'Praha', result: '+340% kontaktů z webu', color: ['#1d4ed8', '#3b82f6'] },
  { client: 'Zubní ordinace Procházková', obor: 'Zubař', city: 'Brno', result: '70% nových pacientů přes web', color: ['#0f766e', '#0d9488'] },
  { client: 'Kavárna Na Rohu', obor: 'Kavárna', city: 'Jihlava', result: '+40% rezervací online', color: ['#d97706', '#f59e0b'] },
  { client: 'Autoservis Procházka', obor: 'Autoservis', city: 'Plzeň', result: '+120% poptávek za měsíc', color: ['#7c3aed', '#a78bfa'] },
  { client: 'Florista Dvořák', obor: 'Kvěťinářství', city: 'Olomouc', result: 'Spuštění e-shopu za 48h', color: ['#059669', '#34d399'] },
];

function PortfolioTrack() {
  const trackRef = useRef<HTMLDivElement>(null);
  const scroll = (dir: 1 | -1) => {
    trackRef.current?.scrollBy({ left: dir * 380, behavior: 'smooth' });
  };
  return (
    <FadeReveal>
      <div style={{ position: 'relative' }}>
        <div ref={trackRef} style={{
          display: 'flex', gap: '16px',
          overflowX: 'auto', scrollSnapType: 'x mandatory',
          scrollbarWidth: 'none', paddingBottom: '2px',
          WebkitOverflowScrolling: 'touch' as React.CSSProperties['WebkitOverflowScrolling'],
        }}>
          {PORTFOLIO.map(p => (
            <div key={p.client} style={{
              scrollSnapAlign: 'start', flexShrink: 0,
              width: '340px', borderRadius: '18px', overflow: 'hidden',
              background: `linear-gradient(145deg, ${p.color[0]}, ${p.color[1]})`,
              cursor: 'none',
            }}
              data-hover
            >
              {/* Browser chrome */}
              <div style={{ padding: '14px 16px 0' }}>
                <div style={{ background: 'rgba(255,255,255,0.12)', borderRadius: '8px', overflow: 'hidden' }}>
                  <div style={{ height: '24px', background: 'rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', padding: '0 8px', gap: '4px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                    {['#ff5f57', '#ffbd2e', '#28ca41'].map(c => <div key={c} style={{ width: '6px', height: '6px', borderRadius: '50%', background: c, opacity: 0.8 }} />)}
                    <div style={{ flex: 1, height: '11px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', margin: '0 6px' }} />
                  </div>
                  <div style={{ padding: '12px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <div style={{ height: '8px', background: 'rgba(255,255,255,0.4)', borderRadius: '2px', width: '55%' }} />
                    <div style={{ height: '8px', background: 'rgba(255,255,255,0.25)', borderRadius: '2px', width: '40%' }} />
                    <div style={{ height: '5px', background: 'rgba(255,255,255,0.15)', borderRadius: '2px', marginTop: '4px' }} />
                    <div style={{ height: '5px', background: 'rgba(255,255,255,0.15)', borderRadius: '2px', width: '80%' }} />
                    <div style={{ marginTop: '6px', display: 'flex', gap: '5px' }}>
                      <div style={{ height: '16px', background: 'rgba(255,255,255,0.3)', borderRadius: '4px', width: '60px' }} />
                      <div style={{ height: '16px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', width: '50px', border: '1px solid rgba(255,255,255,0.2)' }} />
                    </div>
                  </div>
                </div>
              </div>
              {/* Info */}
              <div style={{ padding: '16px' }}>
                <div style={{ display: 'flex', gap: '6px', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontSize: '10px', fontWeight: 600, color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{p.obor}</span>
                  <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '10px' }}>·</span>
                  <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)' }}>{p.city}</span>
                </div>
                <p style={{ fontSize: '15px', fontWeight: 700, color: 'white', marginBottom: '10px' }}>{p.client}</p>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.15)', borderRadius: '20px', padding: '5px 12px', backdropFilter: 'blur(8px)' }}>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" /></svg>
                  <span style={{ fontSize: '12px', fontWeight: 600, color: 'white' }}>{p.result}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Nav arrows */}
        <div style={{ display: 'flex', gap: '8px', marginTop: '20px' }}>
          {([-1, 1] as const).map(dir => (
            <button key={dir} onClick={() => scroll(dir)} data-hover style={{
              width: '40px', height: '40px', borderRadius: '50%',
              border: '1.5px solid #e2e8f0', background: 'white',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'none', transition: 'background 0.2s, border-color 0.2s',
            }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = '#2563eb'; (e.currentTarget as HTMLButtonElement).style.borderColor = '#2563eb'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'white'; (e.currentTarget as HTMLButtonElement).style.borderColor = '#e2e8f0'; }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                style={{ transform: dir === -1 ? 'rotate(180deg)' : 'none' }}>
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          ))}
        </div>
      </div>
    </FadeReveal>
  );
}

/* ─── Page ──────────────────────────────────────────────────────────── */
export default function HomePage() {
  /* Hero mouse glow */
  const [glow, setGlow] = useState({ x: 60, y: 40 });
  useEffect(() => {
    const fn = (e: MouseEvent) => {
      setGlow({ x: (e.clientX / window.innerWidth) * 100, y: (e.clientY / window.innerHeight) * 100 });
    };
    window.addEventListener('mousemove', fn, { passive: true });
    return () => window.removeEventListener('mousemove', fn);
  }, []);

  return (
    <>
      <Cursor />
      <ScrollBar />

      {/* ══ HERO ═════════════════════════════════════════════════════ */}
      <section style={{ background: '#080e1c', minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '100px 0 60px', position: 'relative', overflow: 'hidden' }}>
        {/* Reactive glow */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: `radial-gradient(ellipse 70% 60% at ${glow.x}% ${glow.y}%, rgba(37,99,235,0.13) 0%, transparent 65%)`,
          transition: 'background 0.3s ease',
        }} />
        {/* Dot grid */}
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', backgroundImage: 'radial-gradient(circle, rgba(37,99,235,0.2) 1px, transparent 1px)', backgroundSize: '36px 36px' }} />

        <div style={{ maxWidth: '1200px', margin: '0 auto', width: '100%', padding: '0 32px', position: 'relative' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px', alignItems: 'center' }}>

            {/* Left: text */}
            <div>
              {/* Badge */}
              <div style={{ overflow: 'hidden', marginBottom: '28px' }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '11px', fontWeight: 600, color: '#60a5fa', background: 'rgba(37,99,235,0.12)', border: '1px solid rgba(37,99,235,0.2)', padding: '6px 14px', borderRadius: '20px', animation: 'fadeSlide 0.6s 0.1s both' }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#60a5fa', animation: 'pulse 2s infinite', flexShrink: 0 }} />
                  Profesionální weby pro lokální firmy
                </div>
              </div>

              {/* Headline — per-line wipe */}
              <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(42px, 5vw, 64px)', fontWeight: 700, lineHeight: 1.05, color: 'white', margin: '0 0 24px' }}>
                <LineReveal delay={100} startOnMount>Web, který</LineReveal>
                <LineReveal delay={200} startOnMount>
                  vaši firmu{' '}
                  <span style={{ background: 'linear-gradient(135deg, #60a5fa, #3b82f6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontStyle: 'italic' }}>
                    posune
                  </span>
                </LineReveal>
                <LineReveal delay={300} startOnMount>vpřed.</LineReveal>
              </h1>

              {/* Subtitle */}
              <div style={{ animation: 'fadeSlide 0.7s 0.6s both' }}>
                <p style={{ fontSize: '17px', color: '#94a3b8', lineHeight: 1.7, marginBottom: '32px', maxWidth: '440px' }}>
                  Moderní weby pro lokální podnikatele. Zkušení designéři, pečlivá práce —{' '}
                  <strong style={{ color: '#cbd5e1', fontWeight: 600 }}>hotovo za 48 hodin.</strong> Platíte až po schválení.
                </p>
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                  <Link href="/kontakt" data-hover style={{
                    display: 'inline-flex', alignItems: 'center', gap: '8px',
                    background: '#2563eb', color: 'white', fontWeight: 600, fontSize: '14px',
                    padding: '14px 28px', borderRadius: '12px', textDecoration: 'none',
                    transition: 'background 0.2s, transform 0.15s',
                    boxShadow: '0 0 32px rgba(37,99,235,0.35)',
                  }}
                    onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = '#1d4ed8'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = '#2563eb'; }}
                  >
                    Chci web pro svou firmu
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                  </Link>
                  <Link href="/jak-pracujeme" data-hover style={{
                    display: 'inline-flex', alignItems: 'center', gap: '8px',
                    color: '#94a3b8', fontWeight: 600, fontSize: '14px',
                    padding: '14px 24px', borderRadius: '12px', textDecoration: 'none',
                    border: '1px solid rgba(255,255,255,0.08)',
                    transition: 'color 0.2s, border-color 0.2s',
                  }}
                    onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = 'white'; (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(255,255,255,0.2)'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = '#94a3b8'; (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(255,255,255,0.08)'; }}
                  >
                    Jak to funguje
                  </Link>
                </div>
              </div>

              {/* Trust row */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', marginTop: '36px', animation: 'fadeSlide 0.7s 0.9s both' }}>
                {['Bez zálohy', 'Platíte až po schválení', '48 hodin', 'Na míru'].map(t => (
                  <div key={t} style={{ display: 'flex', alignItems: 'center', gap: '7px', fontSize: '12px', color: '#64748b' }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                    {t}
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Monitor */}
            <div className="hidden lg:block">
              <Monitor3D />
            </div>
          </div>
        </div>

        {/* Scroll hint */}
        <div style={{ position: 'absolute', bottom: '28px', left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', opacity: 0.3 }}>
          <span style={{ fontSize: '10px', letterSpacing: '0.12em', color: '#94a3b8', textTransform: 'uppercase' }}>Scroll</span>
          <div style={{ width: '1px', height: '32px', background: '#94a3b8', animation: 'slideDown 1.5s ease infinite' }} />
        </div>
      </section>

      {/* ══ MARQUEE STRIP ════════════════════════════════════════════ */}
      <div style={{ background: '#0f1629', borderTop: '1px solid rgba(255,255,255,0.04)', borderBottom: '1px solid rgba(255,255,255,0.04)', padding: '16px 0', overflow: 'hidden' }}>
        <Marquee items={['Landing page', 'Firemní web', 'E-commerce', '48 hodin dodání', '0 Kč záloha', '50+ projektů', 'Platíte po schválení', 'Na míru vaší firmě']} />
      </div>

      {/* ══ SERVICES ═════════════════════════════════════════════════ */}
      <section style={{ background: 'white', padding: '100px 0' }}>
        <div style={{ maxWidth: '860px', margin: '0 auto', padding: '0 32px' }}>
          <FadeReveal>
            <p style={{ fontSize: '11px', fontWeight: 600, color: '#2563eb', textTransform: 'uppercase', letterSpacing: '0.14em', marginBottom: '12px' }}>Naše služby</p>
          </FadeReveal>
          <div style={{ overflow: 'hidden', marginBottom: '48px' }}>
            <LineReveal>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 700, color: '#0f172a', lineHeight: 1.1, margin: 0 }}>
                Vše co vaše firma potřebuje online
              </h2>
            </LineReveal>
          </div>

          <ServiceRow num="01" title="Landing page" price="od 9 900 Kč" desc="Jednostránkový web zaměřený na konverzi. Ideální pro řemeslníky, terapeuty a specialisty." accent="#2563EB" slug="landing-page" delay={0} />
          <ServiceRow num="02" title="Firemní web" price="od 14 900 Kč" desc="Kompletní prezentace firmy. Více stránek, galerie realizací, reference a vše co zákazníci hledají." accent="#7c3aed" slug="firemni-web" delay={80} />
          <ServiceRow num="03" title="E-commerce" price="od 24 900 Kč" desc="Plnohodnotný online obchod s produkty, košíkem a platební bránou." accent="#059669" slug="ecommerce" delay={160} />

          <FadeReveal delay={200}>
            <div style={{ marginTop: '32px' }}>
              <Link href="/sluzby" data-hover style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: 600, color: '#2563eb', textDecoration: 'none' }}
                onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.gap = '14px'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.gap = '8px'; }}
              >
                Všechny služby
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
              </Link>
            </div>
          </FadeReveal>
        </div>
      </section>

      {/* ══ STATS ════════════════════════════════════════════════════ */}
      <section style={{ background: '#080e1c', padding: '100px 0' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 32px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1px', background: 'rgba(255,255,255,0.06)' }}>
            {[
              { num: 48, suffix: 'h', label: 'Průměrná doba dodání', sub: 'od poptávky po hotový web' },
              { num: 50, suffix: '+', label: 'Hotových webů', sub: 'pro lokální podnikatele' },
              { num: 100, suffix: '%', label: 'Spokojených klientů', sub: 'kteří by nás doporučili' },
              { num: 0, suffix: ' Kč', label: 'Záloha předem', sub: 'platíte až po schválení' },
            ].map((s, i) => (
              <div key={i} style={{ padding: '48px 40px', background: '#080e1c', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, width: '2px', height: '40px', background: 'linear-gradient(180deg, #3b82f6, transparent)' }} />
                <p style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(44px, 5vw, 64px)', fontWeight: 700, color: 'white', lineHeight: 1, marginBottom: '8px' }}>
                  <CountUp target={s.num} suffix={s.suffix} />
                </p>
                <p style={{ fontSize: '16px', fontWeight: 700, color: '#e2e8f0', marginBottom: '4px' }}>{s.label}</p>
                <p style={{ fontSize: '12px', color: '#475569' }}>{s.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ PROCESS ══════════════════════════════════════════════════ */}
      <section style={{ background: 'linear-gradient(135deg, #f0f9ff 0%, #eff6ff 100%)', padding: '100px 0' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 32px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', alignItems: 'start' }}>
            <div className="lg:sticky" style={{ top: '120px' }}>
            <FadeReveal>
              <p style={{ fontSize: '11px', fontWeight: 600, color: '#2563eb', textTransform: 'uppercase', letterSpacing: '0.14em', marginBottom: '12px' }}>Jak pracujeme</p>
              <div style={{ overflow: 'hidden', marginBottom: '16px' }}>
                <LineReveal>
                  <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px, 3.5vw, 44px)', fontWeight: 700, color: '#0f172a', lineHeight: 1.1, margin: 0 }}>
                    Od formuláře po hotový web za 48 hodin.
                  </h2>
                </LineReveal>
              </div>
              <p style={{ fontSize: '15px', color: '#64748b', lineHeight: 1.7, marginBottom: '24px' }}>
                Říkáte nám o firmě. My web navrhneme, vy schválíte. Bez schůzek, bez čekání, bez zálohy.
              </p>
              <Link href="/jak-pracujeme" data-hover style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: 600, color: '#0f172a', textDecoration: 'none' }}>
                Celý postup →
              </Link>
            </FadeReveal>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
              {[
                { n: '01', title: 'Vyplníte formulář', desc: 'Řeknete nám o vaší firmě — obor, město, styl. Zabere to 5 minut.' },
                { n: '02', title: 'Navrhneme web na míru', desc: 'Do 48 hodin máte hotový web přesně pro vás — bez schůzek.' },
                { n: '03', title: 'Schválíte a spustíte', desc: 'Zapracujeme připomínky. Platíte až po schválení návrhu.' },
              ].map((s, i) => (
                <FadeReveal key={s.n} delay={i * 100}>
                  <div style={{
                    display: 'flex', gap: '20px', padding: '28px 0',
                    borderBottom: i < 2 ? '1px solid rgba(37,99,235,0.12)' : 'none',
                  }}>
                    <span style={{ fontSize: '11px', fontFamily: 'monospace', color: '#94a3b8', paddingTop: '3px', flexShrink: 0, width: '24px' }}>{s.n}</span>
                    <div>
                      <p style={{ fontSize: '17px', fontWeight: 700, color: '#0f172a', marginBottom: '6px' }}>{s.title}</p>
                      <p style={{ fontSize: '14px', color: '#64748b', lineHeight: 1.6 }}>{s.desc}</p>
                    </div>
                  </div>
                </FadeReveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══ HONEST MESSAGE ═══════════════════════════════════════════ */}
      <section style={{ background: 'white', padding: '80px 0', borderTop: '1px solid #f1f5f9' }}>
        <div style={{ maxWidth: '860px', margin: '0 auto', padding: '0 32px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '48px', alignItems: 'start' }}>
            <FadeReveal>
              <p style={{ fontSize: '11px', fontWeight: 600, color: '#d97706', textTransform: 'uppercase', letterSpacing: '0.14em', marginBottom: '12px' }}>Říkáme to rovnou</p>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '28px', fontWeight: 700, color: '#0f172a', lineHeight: 1.2 }}>
                Web sám o sobě vás nezachrání.
              </h2>
            </FadeReveal>
            <FadeReveal delay={100}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '15px', color: '#64748b', lineHeight: 1.7 }}>
                <p>Dobrý web je mocný nástroj — ale není zázrak. Pokud prodáváte nekvalitní produkt, žádný design vám zákazníky neudží.</p>
                <p style={{ color: '#475569', fontWeight: 500 }}>Firma, která dělá skvělou práci a nemá kde to ukázat, přichází o zákazníky každý den. Tady vstupujeme my.</p>
              </div>
            </FadeReveal>
          </div>
        </div>
      </section>

      {/* ══ PORTFOLIO ════════════════════════════════════════════════ */}
      <section style={{ background: '#080e1c', padding: '100px 0' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 32px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '40px', gap: '20px', flexWrap: 'wrap' }}>
            <FadeReveal>
              <p style={{ fontSize: '11px', fontWeight: 600, color: '#3b82f6', textTransform: 'uppercase', letterSpacing: '0.14em', marginBottom: '10px' }}>Naše práce</p>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 700, color: 'white', margin: 0, lineHeight: 1.1 }}>
                Weby, které mluví za sebe
              </h2>
            </FadeReveal>
            <FadeReveal delay={100}>
              <Link href="/portfolio" data-hover style={{ fontSize: '13px', fontWeight: 600, color: '#3b82f6', textDecoration: 'none', whiteSpace: 'nowrap' }}>
                Celé portfolio →
              </Link>
            </FadeReveal>
          </div>

          <PortfolioTrack />
        </div>
      </section>

      {/* ══ TESTIMONIALS MARQUEE ════════════════════════════════════ */}
      <section style={{ background: '#f8fafc', padding: '80px 0', overflow: 'hidden' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 0 40px 32px' }}>
          <FadeReveal>
            <p style={{ fontSize: '11px', fontWeight: 600, color: '#2563eb', textTransform: 'uppercase', letterSpacing: '0.14em', marginBottom: '10px' }}>Reference</p>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 700, color: '#0f172a', marginBottom: '40px', lineHeight: 1.1 }}>
              Co říkají naši klienti
            </h2>
          </FadeReveal>
        </div>
        <TestimonialMarquee />
        <div style={{ textAlign: 'center', marginTop: '32px' }}>
          <Link href="/reference" data-hover style={{ fontSize: '13px', fontWeight: 600, color: '#2563eb', textDecoration: 'none' }}>
            Všechny reference →
          </Link>
        </div>
      </section>

      {/* ══ PHOTO STRIP ══════════════════════════════════════════════ */}
      <section style={{ height: '320px', overflow: 'hidden', position: 'relative' }}>
        <img src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1600&q=80&auto=format&fit=crop" alt="Práce na webu" style={{ width: '100%', height: '100%', objectFit: 'cover' }} loading="lazy" />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(8,14,28,0.85) 0%, rgba(8,14,28,0.3) 55%, transparent 100%)' }} />
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', padding: '0 64px' }}>
          <FadeReveal>
            <p style={{ fontSize: '11px', fontWeight: 600, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '10px' }}>Náš přístup</p>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(22px, 3vw, 34px)', fontWeight: 700, color: 'white', lineHeight: 1.3, maxWidth: '460px', margin: '0 0 16px' }}>
              Zkušenost designérů + rychlost moderních nástrojů.
            </h2>
            <Link href="/o-nas" data-hover style={{ fontSize: '13px', fontWeight: 600, color: 'rgba(255,255,255,0.7)', textDecoration: 'none' }}>
              Více o nás →
            </Link>
          </FadeReveal>
        </div>
      </section>

      {/* ══ CTA ══════════════════════════════════════════════════════ */}
      <section style={{ background: '#080e1c', padding: '120px 0', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle, rgba(37,99,235,0.12) 1px, transparent 1px)', backgroundSize: '36px 36px', pointerEvents: 'none' }} />
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 32px', textAlign: 'center', position: 'relative' }}>
          <FadeReveal>
            <p style={{ fontSize: '11px', fontWeight: 600, color: '#3b82f6', textTransform: 'uppercase', letterSpacing: '0.14em', marginBottom: '20px' }}>Začněte ještě dnes</p>
          </FadeReveal>
          <div style={{ overflow: 'hidden', marginBottom: '20px' }}>
            <LineReveal>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(36px, 5vw, 60px)', fontWeight: 700, color: 'white', lineHeight: 1.05, margin: 0 }}>
                Váš nový web čeká na vás.
              </h2>
            </LineReveal>
          </div>
          <FadeReveal delay={200}>
            <p style={{ fontSize: '16px', color: '#64748b', marginBottom: '36px', lineHeight: 1.6 }}>
              Poptávka je zdarma a nezávazná. Do 24 hodin se ozveme s první ukázkou.
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/kontakt" data-hover style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                background: '#2563eb', color: 'white', fontWeight: 600, fontSize: '15px',
                padding: '16px 32px', borderRadius: '12px', textDecoration: 'none',
                boxShadow: '0 0 48px rgba(37,99,235,0.4)',
                transition: 'background 0.2s',
              }}
                onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = '#1d4ed8'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = '#2563eb'; }}
              >
                Získat web ke shlédnutí zdarma
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
              </Link>
              <Link href="/sluzby" data-hover style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                color: '#64748b', fontWeight: 600, fontSize: '15px',
                padding: '16px 28px', borderRadius: '12px', textDecoration: 'none',
                border: '1px solid rgba(255,255,255,0.08)',
                transition: 'color 0.2s, border-color 0.2s',
              }}
                onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = 'white'; (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(255,255,255,0.2)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = '#64748b'; (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(255,255,255,0.08)'; }}
              >
                Prohlédnout služby
              </Link>
            </div>
          </FadeReveal>
        </div>
      </section>

      <style>{`
        @keyframes pulse     { 0%,100%{opacity:1} 50%{opacity:.4} }
        @keyframes slideDown { 0%{opacity:0;transform:translateY(-4px)} 100%{opacity:1;transform:translateY(4px)} }
        @keyframes fadeSlide { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        @keyframes marqueeScroll { from{transform:translateX(0)} to{transform:translateX(-50%)} }
        html { scroll-behavior: smooth; }
        ::-webkit-scrollbar { display: none; }
      `}</style>
    </>
  );
}
