'use client';

import { useRef, useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';

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
  @keyframes autoScrollPreview {
    0%   { transform: translateY(0); }
    100% { transform: translateY(-200px); }
  }
  @media(prefers-reduced-motion: reduce){
    .preview-page { animation: none !important; }
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

/* ─── TOPENICZ PREVIEW COLORS ───────────────────────────────── */
const TP_ACCENT = '#f97316';  // orange
const TP_DARK   = '#1e293b';  // dark slate
const TP_BG     = '#f8fafc';  // light bg

/* ─── TABLET VISUAL ──────────────────────────────────────────── */
function TabletVisual() {
  const Bar = ({ w, h = 5, r = 3, bg = '#e2e8f0' }: { w: string | number; h?: number; r?: number; bg?: string }) => (
    <div style={{ width: w, height: h, borderRadius: r, background: bg }} />
  );

  return (
    <div style={{
      width: '220px',
      height: '370px',
      background: TP_BG,
      borderRadius: '22px',
      border: `2px solid ${ACCENT}`,
      overflow: 'hidden',
    }}>
      <div style={{ height: '3px', background: TP_ACCENT }} />

      <div className="preview-page" style={{ animation: 'autoScrollPreview 20s ease-in-out infinite alternate' }}>

          {/* Navbar */}
          <div style={{ padding: '8px 10px', background: TP_DARK, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <div style={{ width: '14px', height: '14px', borderRadius: '3px', background: TP_ACCENT }} />
              <span style={{ fontSize: '7px', fontWeight: 700, color: '#fff', letterSpacing: '0.03em' }}>topenicz</span>
            </div>
            <div style={{ display: 'flex', gap: '5px' }}>
              <Bar w={22} h={3} bg="rgba(255,255,255,0.25)" />
              <Bar w={28} h={3} bg="rgba(255,255,255,0.25)" />
              <Bar w={20} h={3} bg="rgba(255,255,255,0.25)" />
            </div>
            <div style={{ width: '40px', height: '15px', borderRadius: '4px', background: TP_ACCENT }} />
          </div>

          {/* Hero */}
          <div style={{ padding: '16px 10px 12px', background: TP_BG }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '10px' }}>
              <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: TP_ACCENT }} />
              <Bar w={64} h={3} r={2} bg="#cbd5e1" />
            </div>
            <Bar w="85%" h={11} r={4} bg={TP_DARK} />
            <div style={{ height: '5px' }} />
            <Bar w="62%" h={11} r={4} bg={TP_DARK} />
            <div style={{ height: '9px' }} />
            <Bar w="100%" h={4} bg="#cbd5e1" />
            <div style={{ height: '3px' }} />
            <Bar w="88%" h={4} bg="#cbd5e1" />
            <div style={{ height: '3px' }} />
            <Bar w="72%" h={4} bg="#cbd5e1" />
            <div style={{ height: '13px' }} />
            <div style={{ display: 'flex', gap: '5px' }}>
              <div style={{ width: '80px', height: '24px', borderRadius: '6px', background: TP_ACCENT }} />
              <div style={{ width: '66px', height: '24px', borderRadius: '6px', border: `1.5px solid ${TP_DARK}` }} />
            </div>
          </div>

          {/* Image block */}
          <div style={{ margin: '0 10px 10px', height: '130px', borderRadius: '10px', background: `linear-gradient(145deg, ${TP_DARK} 0%, #334155 100%)`, position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(249,115,22,0.18) 0%, transparent 60%)' }} />
            <div style={{ position: 'absolute', bottom: '8px', left: '8px', background: 'rgba(249,115,22,0.88)', borderRadius: '5px', padding: '3px 8px' }}>
              <span style={{ fontSize: '7px', fontWeight: 700, color: '#fff' }}>Voda &amp; topení</span>
            </div>
          </div>

          {/* Services */}
          <div style={{ padding: '8px 10px 10px' }}>
            <Bar w="50%" h={7} r={3} bg={TP_DARK} />
            <div style={{ height: '8px' }} />
            {[TP_ACCENT, TP_BG, TP_BG].map((bg, i) => (
              <div key={i} style={{ background: bg, borderRadius: '8px', padding: '8px 10px', border: `1px solid ${i === 0 ? 'transparent' : '#e2e8f0'}`, marginBottom: '5px' }}>
                <div style={{ width: '14px', height: '14px', borderRadius: '4px', background: i === 0 ? 'rgba(255,255,255,0.25)' : '#e2e8f0', marginBottom: '5px' }} />
                <Bar w="60%" h={4} r={2} bg={i === 0 ? 'rgba(255,255,255,0.7)' : '#cbd5e1'} />
                <div style={{ height: '3px' }} />
                <Bar w="80%" h={3} r={2} bg={i === 0 ? 'rgba(255,255,255,0.4)' : '#e2e8f0'} />
              </div>
            ))}
          </div>

          {/* Process */}
          <div style={{ padding: '8px 10px 10px', borderTop: '1px solid #f1f5f9' }}>
            <Bar w="55%" h={7} r={3} bg={TP_DARK} />
            <div style={{ height: '8px' }} />
            {['01', '02', '03'].map(n => (
              <div key={n} style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '7px' }}>
                <div style={{ width: '18px', height: '18px', borderRadius: '5px', background: 'rgba(249,115,22,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <span style={{ fontSize: '7px', fontWeight: 700, color: TP_ACCENT }}>{n}</span>
                </div>
                <div style={{ flex: 1 }}>
                  <Bar w="60%" h={4} r={2} bg={TP_DARK} />
                  <div style={{ height: '3px' }} />
                  <Bar w="80%" h={3} r={2} bg="#e2e8f0" />
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div style={{ margin: '0 10px 14px', background: TP_ACCENT, borderRadius: '10px', padding: '14px', textAlign: 'center' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '4px' }}><Bar w="55%" h={6} r={3} bg="rgba(255,255,255,0.8)" /></div>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '10px' }}><Bar w="40%" h={5} r={3} bg="rgba(255,255,255,0.5)" /></div>
            <div style={{ width: '80px', height: '20px', borderRadius: '6px', background: '#fff', margin: '0 auto' }} />
          </div>

      </div>
    </div>
  );
}

/* ─── MONITOR VISUAL (landscape) ────────────────────────────── */
function MonitorVisual() {
  const Bar = ({ w, h = 5, r = 3, bg = '#e2e8f0' }: { w: string | number; h?: number; r?: number; bg?: string }) => (
    <div style={{ width: w, height: h, borderRadius: r, background: bg }} />
  );

  return (
    <div style={{
      width: '340px',
      height: '220px',
      background: TP_BG,
      borderRadius: '18px',
      border: `2px solid ${ACCENT}`,
      overflow: 'hidden',
    }}>
      <div style={{ height: '3px', background: TP_ACCENT }} />

      <div className="preview-page" style={{ animation: 'autoScrollPreview 22s ease-in-out infinite alternate' }}>

          {/* Navbar */}
          <div style={{ padding: '7px 10px', background: TP_DARK, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <div style={{ width: '13px', height: '13px', borderRadius: '3px', background: TP_ACCENT }} />
              <span style={{ fontSize: '7px', fontWeight: 700, color: '#fff', letterSpacing: '0.03em' }}>topenicz</span>
            </div>
            <div style={{ display: 'flex', gap: '6px' }}>
              <Bar w={26} h={3} bg="rgba(255,255,255,0.25)" />
              <Bar w={32} h={3} bg="rgba(255,255,255,0.25)" />
              <Bar w={22} h={3} bg="rgba(255,255,255,0.25)" />
            </div>
            <div style={{ width: '42px', height: '15px', borderRadius: '4px', background: TP_ACCENT }} />
          </div>

          {/* Hero 2-col */}
          <div style={{ padding: '14px 10px 10px', background: TP_BG, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', alignItems: 'center' }}>
            <div>
              <Bar w="80%" h={9} r={4} bg={TP_DARK} />
              <div style={{ height: '5px' }} />
              <Bar w="58%" h={9} r={4} bg={TP_DARK} />
              <div style={{ height: '8px' }} />
              <Bar w="95%" h={4} bg="#cbd5e1" />
              <div style={{ height: '3px' }} />
              <Bar w="80%" h={4} bg="#cbd5e1" />
              <div style={{ height: '10px' }} />
              <div style={{ display: 'flex', gap: '4px' }}>
                <div style={{ width: '54px', height: '18px', borderRadius: '5px', background: TP_ACCENT }} />
                <div style={{ width: '44px', height: '18px', borderRadius: '5px', border: `1.5px solid ${TP_DARK}` }} />
              </div>
            </div>
            <div style={{ height: '110px', borderRadius: '10px', background: `linear-gradient(145deg, ${TP_DARK} 0%, #334155 100%)`, position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(249,115,22,0.2) 0%, transparent 60%)' }} />
              <div style={{ position: 'absolute', bottom: '6px', left: '6px', background: 'rgba(249,115,22,0.88)', borderRadius: '4px', padding: '2px 7px' }}>
                <span style={{ fontSize: '6px', fontWeight: 700, color: '#fff' }}>Voda &amp; topení</span>
              </div>
            </div>
          </div>

          {/* Services 3-col */}
          <div style={{ padding: '8px 10px 10px' }}>
            <Bar w="38%" h={6} r={3} bg={TP_DARK} />
            <div style={{ height: '7px' }} />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '5px' }}>
              {[TP_ACCENT, TP_BG, TP_BG].map((bg, i) => (
                <div key={i} style={{ background: bg, borderRadius: '7px', padding: '7px', border: `1px solid ${i === 0 ? 'transparent' : '#e2e8f0'}` }}>
                  <div style={{ width: '11px', height: '11px', borderRadius: '3px', background: i === 0 ? 'rgba(255,255,255,0.25)' : '#e2e8f0', marginBottom: '4px' }} />
                  <Bar w="60%" h={3} r={2} bg={i === 0 ? 'rgba(255,255,255,0.7)' : '#cbd5e1'} />
                  <div style={{ height: '3px' }} />
                  <Bar w="80%" h={3} r={2} bg={i === 0 ? 'rgba(255,255,255,0.4)' : '#e2e8f0'} />
                </div>
              ))}
            </div>
          </div>

          {/* Process */}
          <div style={{ padding: '7px 10px 8px', borderTop: '1px solid #f1f5f9' }}>
            <Bar w="42%" h={6} r={3} bg={TP_DARK} />
            <div style={{ height: '7px' }} />
            {['01', '02', '03'].map(n => (
              <div key={n} style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '5px' }}>
                <div style={{ width: '15px', height: '15px', borderRadius: '4px', background: 'rgba(249,115,22,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <span style={{ fontSize: '6px', fontWeight: 700, color: TP_ACCENT }}>{n}</span>
                </div>
                <div style={{ flex: 1 }}>
                  <Bar w="52%" h={3} r={2} bg={TP_DARK} />
                  <div style={{ height: '3px' }} />
                  <Bar w="74%" h={3} r={2} bg="#e2e8f0" />
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div style={{ margin: '0 10px 12px', background: TP_ACCENT, borderRadius: '8px', padding: '12px', textAlign: 'center' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '4px' }}><Bar w="50%" h={5} r={3} bg="rgba(255,255,255,0.8)" /></div>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '8px' }}><Bar w="38%" h={5} r={3} bg="rgba(255,255,255,0.5)" /></div>
            <div style={{ width: '64px', height: '17px', borderRadius: '5px', background: '#fff', margin: '0 auto' }} />
          </div>

      </div>
    </div>
  );
}

/* ─── HERO ────────────────────────────────────────────────────── */
const HERO_WORDS = ['prodává', 'zaujme', 'konvertuje', 'roste'];

function FloatBadge({ children, style, delay = 0, visible }: { children: React.ReactNode; style?: React.CSSProperties; delay?: number; visible: boolean }) {
  return (
    <motion.div
      animate={{ opacity: visible ? 1 : 0, scale: visible ? 1 : 0.88, y: visible ? 0 : 16 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: visible ? delay : 0 }}
      style={{
        position: 'absolute', background: '#fff',
        border: '1px solid #e3ded7',
        borderRadius: '14px', padding: '12px 18px',
        boxShadow: '0 4px 20px rgba(40,85,112,0.08)',
        display: 'flex', alignItems: 'center', gap: '10px',
        pointerEvents: 'none', whiteSpace: 'nowrap',
        ...style,
      }}
    >
      {children}
    </motion.div>
  );
}

function Hero() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: false, amount: 0.15 });
  const [wordIdx, setWordIdx] = useState(0);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const id = setInterval(() => {
      setExiting(true);
      setTimeout(() => {
        setWordIdx(i => (i + 1) % HERO_WORDS.length);
        setExiting(false);
      }, 300);
    }, 2800);
    return () => clearInterval(id);
  }, []);

  const item = (delay: number) => ({
    initial: { opacity: 0, y: 30 },
    animate: { opacity: inView ? 1 : 0, y: inView ? 0 : 30 },
    transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] as any, delay },
  });

  return (
    <section ref={ref} style={{ background: BG, minHeight: '92vh', display: 'flex', alignItems: 'center', position: 'relative', overflow: 'hidden', padding: '130px 24px 120px' }}>

      {/* Background blobs */}
      <div aria-hidden style={{ position: 'absolute', top: '-10%', right: '-5%', width: '800px', height: '800px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(40,85,112,0.05) 0%, transparent 65%)', pointerEvents: 'none' }} />
      <div aria-hidden style={{ position: 'absolute', bottom: '-10%', left: '-8%', width: '640px', height: '640px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(227,222,215,0.55) 0%, transparent 65%)', pointerEvents: 'none' }} />

      {/* ── Floating badges ── */}
      <FloatBadge delay={0.6} visible={inView} style={{ top: '18%', left: '6%', rotate: '-3deg' }}>
        <div style={{ width: '30px', height: '30px', borderRadius: '8px', background: 'rgba(40,85,112,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={ACCENT} strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
        </div>
        <div>
          <p style={{ fontSize: '16px', fontWeight: 700, color: '#1a2e3d', margin: 0, lineHeight: 1 }}>48 h</p>
          <p style={{ fontSize: '11px', color: '#9a9590', margin: 0, marginTop: '2px' }}>dodání návrhu</p>
        </div>
      </FloatBadge>

      <FloatBadge delay={0.72} visible={inView} style={{ top: '14%', right: '7%', rotate: '2.5deg' }}>
        <div style={{ width: '30px', height: '30px', borderRadius: '8px', background: 'rgba(40,85,112,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={ACCENT} strokeWidth="2" strokeLinecap="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z"/></svg>
        </div>
        <div>
          <p style={{ fontSize: '16px', fontWeight: 700, color: '#1a2e3d', margin: 0, lineHeight: 1 }}>od 9 900 Kč</p>
          <p style={{ fontSize: '11px', color: '#9a9590', margin: 0, marginTop: '2px' }}>jasná cena předem</p>
        </div>
      </FloatBadge>

      <FloatBadge delay={0.84} visible={inView} style={{ bottom: '18%', left: '5%', rotate: '2deg' }}>
        <div style={{ width: '30px', height: '30px', borderRadius: '8px', background: 'rgba(40,85,112,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={ACCENT} strokeWidth="2" strokeLinecap="round"><path d="M9 12l2 2 4-4"/><path d="M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9c1.51 0 2.93.37 4.18 1.03"/></svg>
        </div>
        <div>
          <p style={{ fontSize: '13px', fontWeight: 700, color: '#1a2e3d', margin: 0, lineHeight: 1 }}>Platíte po schválení</p>
          <p style={{ fontSize: '11px', color: '#9a9590', margin: 0, marginTop: '2px' }}>nulové riziko</p>
        </div>
      </FloatBadge>

      <FloatBadge delay={0.78} visible={inView} style={{ bottom: '20%', right: '6%', rotate: '-2deg' }}>
        <div style={{ width: '30px', height: '30px', borderRadius: '8px', background: 'rgba(40,85,112,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={ACCENT} strokeWidth="2" strokeLinecap="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
        </div>
        <div>
          <p style={{ fontSize: '13px', fontWeight: 700, color: '#1a2e3d', margin: 0, lineHeight: 1 }}>SEO & analytika</p>
          <p style={{ fontSize: '11px', color: '#9a9590', margin: 0, marginTop: '2px' }}>v ceně projektu</p>
        </div>
      </FloatBadge>

      {/* ── Centered content ── */}
      <div style={{ maxWidth: '860px', margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 2 }}>

        <motion.h1 {...item(0)} style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(52px, 8vw, 108px)',
          fontWeight: 300, lineHeight: 1.0, letterSpacing: '-0.04em',
          color: '#1a2e3d', margin: '0 0 36px',
        }}>
          Váš web,<br />
          který{' '}
          <span style={{ display: 'inline-block', position: 'relative', verticalAlign: 'bottom' }}>
            {/* ghost — reserves width of longest word so layout never shifts */}
            <span style={{ visibility: 'hidden', color: ACCENT }}>konvertuje</span>
            <span style={{
              position: 'absolute', left: 0, top: 0, color: ACCENT,
              opacity: exiting ? 0 : 1,
              filter: exiting ? 'blur(6px)' : 'blur(0px)',
              transition: 'opacity 0.28s ease, filter 0.28s ease',
            }}>
              {HERO_WORDS[wordIdx]}
            </span>
          </span>
        </motion.h1>

        <motion.p {...item(0.1)} style={{ fontFamily: 'var(--font-body)', fontSize: '18px', lineHeight: 1.75, color: '#7a8e98', maxWidth: '480px', margin: '0 auto 44px' }}>
          Tvoříme moderní weby a landing pages pro české firmy. Hotovo do 48 hodin, platíte až po schválení výsledku.
        </motion.p>

        <motion.div {...item(0.18)} style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href="/kalkulace"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: ACCENT, color: '#fff', fontSize: '15px', fontWeight: 700, padding: '16px 32px', borderRadius: '12px', textDecoration: 'none', letterSpacing: '0.01em', transition: 'transform 0.2s, box-shadow 0.2s' }}
            onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.transform = 'translateY(-2px)'; el.style.boxShadow = '0 10px 28px rgba(40,85,112,0.32)'; }}
            onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.transform = ''; el.style.boxShadow = ''; }}
          >Začít projekt →</a>
          <a href="/sluzby"
            style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '15px', fontWeight: 600, color: ACCENT, padding: '15px 32px', borderRadius: '12px', border: '1.5px solid rgba(40,85,112,0.2)', textDecoration: 'none', transition: 'transform 0.2s, border-color 0.2s, box-shadow 0.2s' }}
            onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.transform = 'translateY(-2px)'; el.style.borderColor = 'rgba(40,85,112,0.45)'; el.style.boxShadow = '0 6px 18px rgba(40,85,112,0.1)'; }}
            onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.transform = ''; el.style.borderColor = 'rgba(40,85,112,0.2)'; el.style.boxShadow = ''; }}
          >Zobrazit ceník</a>
        </motion.div>

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
    desc: 'Kompletní online prezentace firmy. Více stránek, CMS, analytika.',
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
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
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
              Chci vidět ukázku webu
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
      <WebNestaci />
      <CTA />
      <Pricing />
    </>
  );
}
