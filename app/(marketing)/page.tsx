'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';

const Monitor3D = dynamic(
  () => import('@/components/marketing/Monitor3D').then(m => ({ default: m.Monitor3D })),
  { ssr: false }
);

/* ─── Scroll reveal ─────────────────────────────────────────────────── */
function useReveal(delay = 0, dir: 'up' | 'left' | 'right' | 'scale' = 'up') {
  const ref = useRef<HTMLDivElement>(null);
  const [v, setV] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const o = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setV(true); o.disconnect(); } },
      { threshold: 0.06, rootMargin: '0px 0px -40px 0px' }
    );
    o.observe(el);
    return () => o.disconnect();
  }, []);
  const t: Record<string, string> = {
    up:    v ? 'translateY(0)'   : 'translateY(28px)',
    left:  v ? 'translateX(0)'   : 'translateX(-28px)',
    right: v ? 'translateX(0)'   : 'translateX(28px)',
    scale: v ? 'scale(1)'        : 'scale(0.93)',
  };
  return { ref, style: { opacity: v ? 1 : 0, transform: t[dir], transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms` } };
}

/* ─── 3D tilt card ──────────────────────────────────────────────────── */
function TiltCard({ children, className = '', style = {}, onClick }: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
}) {
  const [t, setT] = useState({ x: 0, y: 0, sx: 50, sy: 50 });
  return (
    <div
      className={className}
      style={{
        ...style,
        transform: `perspective(900px) rotateX(${t.x}deg) rotateY(${t.y}deg)`,
        transition: 'transform 0.12s ease-out, box-shadow 0.2s ease',
        transformStyle: 'preserve-3d',
        position: 'relative',
        cursor: onClick ? 'pointer' : undefined,
      }}
      onMouseMove={e => {
        const r = e.currentTarget.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        setT({ x: y * -7, y: x * 7, sx: (x + 0.5) * 100, sy: (y + 0.5) * 100 });
      }}
      onMouseLeave={() => setT({ x: 0, y: 0, sx: 50, sy: 50 })}
      onClick={onClick}
    >
      <div style={{
        position: 'absolute', inset: 0, borderRadius: 'inherit',
        background: `radial-gradient(circle at ${t.sx}% ${t.sy}%, rgba(255,255,255,0.12) 0%, transparent 65%)`,
        pointerEvents: 'none', zIndex: 1,
        opacity: Math.abs(t.x) + Math.abs(t.y) > 0.5 ? 1 : 0,
        transition: 'opacity 0.2s',
      }} />
      {children}
    </div>
  );
}

/* ─── Animated stat counter ─────────────────────────────────────────── */
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
      const dur = 1400;
      const step = (ts: number) => {
        if (!start) start = ts;
        const p = Math.min((ts - start) / dur, 1);
        const ease = 1 - Math.pow(1 - p, 3);
        setVal(Math.round(ease * target));
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }, { threshold: 0.5 });
    o.observe(el);
    return () => o.disconnect();
  }, [target]);
  return <span ref={ref}>{val}{suffix}</span>;
}

/* ─── Data ──────────────────────────────────────────────────────────── */
const SERVICES = [
  {
    title: 'Landing page',
    slug: 'landing-page',
    desc: 'Jednostránkový web zaměřený na konverzi. Ideální pro řemeslníky, terapeuty a specialisty.',
    price: 'od 9 900 Kč',
    accent: '#2563EB',
    accentBg: '#eff6ff',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" />
      </svg>
    ),
  },
  {
    title: 'Firemní web',
    slug: 'firemni-web',
    desc: 'Kompletní prezentace firmy. Více stránek, galerie realizací, reference a vše co zákazníci hledají.',
    price: 'od 14 900 Kč',
    accent: '#7c3aed',
    accentBg: '#f5f3ff',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
  },
  {
    title: 'E-commerce',
    slug: 'ecommerce',
    desc: 'Plnohodnotný online obchod s produkty, košíkem a platební bránou. Prodávejte online.',
    price: 'od 24 900 Kč',
    accent: '#059669',
    accentBg: '#ecfdf5',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
      </svg>
    ),
  },
];

const TESTIMONIALS = [
  { quote: 'Čekal jsem, že web bude trvat měsíce. Dostal jsem ho za 48 hodin a hned první týden mi volali noví zákazníci.', name: 'Pavel Novák', role: 'Instalatér, Praha', initials: 'P', color: '#2563EB' },
  { quote: 'Cena odpovídala kvalitě. Web vypadá profesionálně, zákazníci důvěřují mé ordinaci ještě předtím, než vůbec přijdou.', name: 'MUDr. Jana Procházková', role: 'Zubní lékařka, Brno', initials: 'J', color: '#0d9488' },
  { quote: 'Jednání bylo rychlé, bez zbytečných otázek. Přesně takový web jsem chtěl — moderní, přehledný a funkční.', name: 'Martin Kovář', role: 'Restauratér, Ostrava', initials: 'M', color: '#7c3aed' },
];

function StepItem({ step, title, desc, delay }: { step: string; title: string; desc: string; delay: number }) {
  const r = useReveal(delay, 'right');
  return (
    <div ref={r.ref} style={r.style}
      className="flex gap-5 p-5 rounded-2xl border border-slate-100 hover:border-blue-100 bg-white hover:bg-blue-50/30 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
      <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shrink-0">
        <span className="text-xs font-bold text-white">{step}</span>
      </div>
      <div>
        <p className="font-bold text-slate-900 text-sm">{title}</p>
        <p className="text-sm text-slate-500 mt-0.5">{desc}</p>
      </div>
    </div>
  );
}

/* ─── Page ──────────────────────────────────────────────────────────── */
export default function HomePage() {
  /* hero text reveals */
  const h1 = useReveal(0, 'up');
  const h2 = useReveal(100, 'up');
  const h3 = useReveal(220, 'up');

  /* section titles */
  const svcTitle   = useReveal(0);
  const portTitle  = useReveal(0);
  const tTitle     = useReveal(0);
  const ctaSection = useReveal(0, 'scale');
  const processLeft = useReveal(0, 'left');

  /* cards */
  const svcRevs = [useReveal(0, 'scale'), useReveal(100, 'scale'), useReveal(200, 'scale')];
  const portRevs = [useReveal(0, 'up'), useReveal(130, 'up'), useReveal(260, 'up')];
  const testRevs = [useReveal(0, 'up'), useReveal(130, 'up'), useReveal(260, 'up')];

  return (
    <>
      {/* ═══ HERO (dark, 3D monitor) ═══════════════════════════════════ */}
      <section className="relative min-h-screen flex flex-col justify-center px-5 sm:px-8 pt-20 overflow-hidden" style={{ background: '#0b1220' }}>
        {/* Dot grid */}
        <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, rgba(37,99,235,0.18) 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
        {/* Radial glow top-center */}
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 80% 60% at 70% 40%, rgba(37,99,235,0.1) 0%, transparent 70%)' }} />

        <div className="relative max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Left: text */}
          <div>
            <div ref={h1.ref} style={h1.style} className="mb-6">
              <span className="inline-flex items-center gap-2 text-xs font-semibold text-blue-400 bg-blue-950/60 border border-blue-800/50 px-3.5 py-1.5 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400" style={{ animation: 'pulse 2s infinite' }} />
                Profesionální weby pro lokální firmy
              </span>
            </div>

            <div ref={h2.ref} style={h2.style}>
              <h1 className="text-5xl sm:text-6xl font-bold tracking-tight leading-[1.07] text-white mb-6" style={{ fontFamily: 'var(--font-display)' }}>
                Web, který vaši firmu{' '}
                <span className="italic" style={{ background: 'linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  posune vpřed.
                </span>
              </h1>
            </div>

            <div ref={h3.ref} style={h3.style}>
              <p className="text-lg text-slate-400 leading-relaxed mb-8 max-w-lg">
                Navrhujeme a stavíme moderní weby pro lokální podnikatele. Zkušení designéři, pečlivě odvedená práce,{' '}
                <strong className="text-slate-200 font-semibold">hotovo do 48 hodin.</strong> Platíte až po schválení.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link href="/kontakt"
                  className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold px-7 py-3.5 rounded-xl text-sm transition-all duration-200 hover:shadow-xl hover:shadow-blue-500/30 hover:-translate-y-px">
                  Chci web pro svou firmu
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                </Link>
                <Link href="/jak-pracujeme"
                  className="inline-flex items-center justify-center gap-2 text-slate-300 hover:text-white font-semibold px-7 py-3.5 rounded-xl text-sm border border-white/10 hover:border-white/25 hover:bg-white/5 transition-all duration-200">
                  Jak to funguje
                </Link>
              </div>
              <div className="mt-9 flex flex-wrap gap-x-7 gap-y-3">
                {['Bez zálohy', 'Platíte až po schválení', 'Hotovo za 48 hodin', 'Na míru vaší firmě'].map(t => (
                  <div key={t} className="flex items-center gap-2 text-sm text-slate-500">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                    {t}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: 3D Monitor */}
          <div className="hidden lg:block relative">
            <Monitor3D />
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-30">
          <span className="text-xs text-slate-500">Scroll</span>
          <div className="w-px h-8 bg-slate-500" style={{ animation: 'slideDown 1.5s ease infinite' }} />
        </div>
      </section>

      {/* ═══ STATS (dark) ═══════════════════════════════════════════════ */}
      <section className="py-16" style={{ background: '#0f1629' }}>
        <div className="max-w-6xl mx-auto px-5 sm:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {[
              { num: 48, suffix: 'h', label: 'Průměrná doba dodání' },
              { num: 50, suffix: '+', label: 'Hotových webů' },
              { num: 100, suffix: '%', label: 'Klientů by nás doporučilo' },
              { num: 0, suffix: ' Kč', label: 'Záloha předem' },
            ].map(s => (
              <div key={s.label}>
                <p className="text-4xl font-bold text-white tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>
                  <CountUp target={s.num} suffix={s.suffix} />
                </p>
                <p className="text-sm text-slate-400 mt-2">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ SERVICES ═══════════════════════════════════════════════════ */}
      <section className="py-28 px-5 sm:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <div ref={svcTitle.ref} style={svcTitle.style} className="mb-14">
            <p className="text-xs font-semibold text-blue-600 uppercase tracking-widest mb-3">Naše služby</p>
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-slate-900 max-w-lg leading-tight" style={{ fontFamily: 'var(--font-display)' }}>
                Vše co vaše firma potřebuje online
              </h2>
              <Link href="/sluzby" className="text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors whitespace-nowrap">Všechny služby →</Link>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {SERVICES.map((s, i) => (
              <div key={s.title} ref={svcRevs[i].ref} style={svcRevs[i].style}>
                <TiltCard
                  className="relative p-8 rounded-2xl border border-slate-100 bg-white hover:shadow-2xl transition-shadow duration-300 overflow-hidden h-full"
                  onClick={() => { window.location.href = `/kalkulace/${s.slug}`; }}
                >
                  <div className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl" style={{ background: s.accent }} />
                  <div className="w-11 h-11 rounded-2xl flex items-center justify-center mb-5" style={{ background: s.accentBg, color: s.accent }}>
                    {s.icon}
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{s.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed mb-6">{s.desc}</p>
                  <div className="flex items-center justify-between mt-auto">
                    <span className="text-sm font-bold" style={{ color: s.accent }}>{s.price}</span>
                    <span className="text-xs text-slate-300 group-hover:text-slate-600 font-medium">Detail →</span>
                  </div>
                </TiltCard>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ PROCESS ════════════════════════════════════════════════════ */}
      <section className="overflow-hidden" style={{ background: 'linear-gradient(135deg, #f0f9ff 0%, #eff6ff 100%)' }}>
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-28">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div ref={processLeft.ref} style={processLeft.style}>
              <p className="text-xs font-semibold text-blue-600 uppercase tracking-widest mb-4">Jak pracujeme</p>
              <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-slate-900 mb-5 leading-tight" style={{ fontFamily: 'var(--font-display)' }}>
                Od formuláře<br />
                <span className="italic text-blue-600">po hotový web</span><br />
                za 48 hodin.
              </h2>
              <p className="text-slate-500 leading-relaxed mb-8">
                Říkáte nám o firmě. My web navrhneme, vy schválíte. Bez schůzek, bez čekání, bez zálohy.
              </p>
              <Link href="/jak-pracujeme" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-900 hover:text-blue-600 transition-colors">
                Celý postup
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
              </Link>
            </div>
            <div className="space-y-4">
              <StepItem step="01" title="Vyplníte formulář" desc="Řeknete nám o vaší firmě. Zabere to 5 minut." delay={0} />
              <StepItem step="02" title="Navrhneme web na míru" desc="Do 48 hodin máte hotový web přesně pro vás." delay={110} />
              <StepItem step="03" title="Schválíte a spustíte" desc="Zapracujeme připomínky. Platíte až po schválení." delay={220} />
            </div>
          </div>
        </div>
      </section>

      {/* ═══ HONEST MESSAGE ═════════════════════════════════════════════ */}
      <section className="py-20 px-5 sm:px-8 border-y border-slate-100 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-10 items-start">
            <div className="pt-1">
              <p className="text-xs font-semibold text-amber-600 uppercase tracking-widest mb-3">Říkáme to rovnou</p>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 leading-tight" style={{ fontFamily: 'var(--font-display)' }}>
                Web sám o sobě vás nezachrání.
              </h2>
            </div>
            <div className="space-y-4 text-slate-500 leading-relaxed">
              <p>
                Dobrý web je mocný nástroj — ale není zázrak. Pokud prodáváte nekvalitní produkt nebo nemáte co nabídnout, žádný design vám zákazníky neudží. To si musíme říct rovnou.
              </p>
              <p>
                Úspěch stojí na více věcech najednou: na kvalitě toho, co děláte, na důvěře kterou budujete, na tom jak se o zákazníky staráte — a samozřejmě na dobrém marketingu, kde web hraje důležitou, ale ne jedinou roli.
              </p>
              <p className="text-slate-700 font-medium">
                Co ale víme jistě: firma, která dělá skvělou práci a nemá kde to ukázat, přichází o zákazníky každý den. Tady vstupujeme my. Pomůžeme vám jít úspěchu naproti — zbytek je ve vašich rukách.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ PORTFOLIO TEASER ═══════════════════════════════════════════ */}
      <section className="py-28 px-5 sm:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <div ref={portTitle.ref} style={portTitle.style} className="mb-14">
            <p className="text-xs font-semibold text-blue-600 uppercase tracking-widest mb-3">Naše práce</p>
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-slate-900 leading-tight" style={{ fontFamily: 'var(--font-display)' }}>
                Weby, které<br />mluví za sebe
              </h2>
              <Link href="/portfolio" className="text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors whitespace-nowrap">Celé portfolio →</Link>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              { client: 'Pavel Novák Instalace', obor: 'Instalatér', city: 'Praha', result: '+340% kontaktů z webu', color: 'from-blue-500 to-blue-600', r: portRevs[0] },
              { client: 'Zubní ordinace Procházková', obor: 'Zubař', city: 'Brno', result: '70% nových pacientů přes web', color: 'from-teal-500 to-cyan-600', r: portRevs[1] },
              { client: 'Kavárna Na Rohu', obor: 'Kavárna', city: 'Jihlava', result: '+40% rezervací online', color: 'from-amber-400 to-orange-500', r: portRevs[2] },
            ].map(p => (
              <div key={p.client} ref={p.r.ref} style={p.r.style}>
                <TiltCard className="rounded-2xl overflow-hidden bg-white border border-slate-100 hover:shadow-xl transition-shadow duration-300">
                  <div className={`h-44 bg-gradient-to-br ${p.color} relative overflow-hidden`}>
                    <div className="absolute inset-3 rounded-lg bg-white/10 border border-white/20">
                      <div className="flex items-center gap-1.5 px-3 py-2 border-b border-white/10">
                        <div className="w-2 h-2 rounded-full bg-white/30" /><div className="w-2 h-2 rounded-full bg-white/30" /><div className="w-2 h-2 rounded-full bg-white/30" />
                        <div className="flex-1 mx-2 h-3 rounded bg-white/20" />
                      </div>
                      <div className="p-3 space-y-2">
                        <div className="h-3 rounded bg-white/30 w-3/4" />
                        <div className="h-2 rounded bg-white/20 w-full" />
                        <div className="h-2 rounded bg-white/20 w-5/6" />
                      </div>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">{p.obor}</span>
                      <span className="text-slate-200">·</span>
                      <span className="text-xs text-slate-400">{p.city}</span>
                    </div>
                    <h3 className="font-bold text-slate-900 mb-2 text-sm">{p.client}</h3>
                    <p className="text-xs text-emerald-600 font-semibold bg-emerald-50 border border-emerald-100 px-3 py-1.5 rounded-full inline-block">{p.result}</p>
                  </div>
                </TiltCard>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ PHOTO STRIP ════════════════════════════════════════════════ */}
      <section className="h-[380px] overflow-hidden relative">
        <img
          src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1600&q=80&auto=format&fit=crop"
          alt="Práce na webu"
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, rgba(11,18,32,0.82) 0%, rgba(11,18,32,0.35) 55%, transparent 100%)' }} />
        <div className="absolute inset-0 flex items-center px-8 sm:px-16">
          <div className="max-w-xl">
            <p className="text-white/60 text-sm font-semibold uppercase tracking-widest mb-3">Náš přístup</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-white leading-snug" style={{ fontFamily: 'var(--font-display)' }}>
              Kombinujeme zkušenost designérů s rychlostí moderních nástrojů.
            </h2>
            <Link href="/o-nas" className="inline-flex items-center gap-2 mt-6 text-sm font-semibold text-white/80 hover:text-white transition-colors">
              Více o nás →
            </Link>
          </div>
        </div>
      </section>

      {/* ═══ TESTIMONIALS ═══════════════════════════════════════════════ */}
      <section className="py-28 px-5 sm:px-8" style={{ background: '#f8fafc' }}>
        <div className="max-w-6xl mx-auto">
          <div ref={tTitle.ref} style={tTitle.style} className="mb-14">
            <p className="text-xs font-semibold text-blue-600 uppercase tracking-widest mb-3">Reference</p>
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-slate-900 leading-tight" style={{ fontFamily: 'var(--font-display)' }}>
              Co říkají naši klienti
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {TESTIMONIALS.map((t, i) => (
              <div key={t.name} ref={testRevs[i].ref} style={testRevs[i].style}>
                <TiltCard className="p-8 bg-white rounded-2xl border border-slate-100 hover:shadow-lg transition-shadow duration-300 h-full">
                  <div className="flex gap-0.5 mb-6">
                    {[1,2,3,4,5].map(s => (
                      <svg key={s} width="14" height="14" viewBox="0 0 24 24" fill="#f59e0b" stroke="none">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-slate-600 text-sm leading-relaxed mb-6">&ldquo;{t.quote}&rdquo;</p>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0" style={{ background: t.color }}>{t.initials}</div>
                    <div>
                      <p className="font-bold text-slate-900 text-sm">{t.name}</p>
                      <p className="text-xs text-slate-400">{t.role}</p>
                    </div>
                  </div>
                </TiltCard>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link href="/reference" className="text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors">Zobrazit všechny reference →</Link>
          </div>
        </div>
      </section>

      {/* ═══ CTA ════════════════════════════════════════════════════════ */}
      <section className="py-28 px-5 sm:px-8" style={{ background: '#0b1220' }}>
        <div className="max-w-4xl mx-auto">
          <div ref={ctaSection.ref} style={ctaSection.style} className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-xs font-semibold text-blue-400 uppercase tracking-widest mb-4">Začněte ještě dnes</p>
              <h2 className="text-4xl sm:text-5xl font-bold text-white tracking-tight mb-6 leading-tight" style={{ fontFamily: 'var(--font-display)' }}>
                Váš nový web<br />
                <span className="italic text-blue-400">čeká na vás.</span>
              </h2>
              <p className="text-slate-400 leading-relaxed">
                Poptávka je zdarma a nezávazná. Do 24 hodin se ozveme s první ukázkou vašeho webu.
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <Link href="/kontakt"
                className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold px-8 py-4 rounded-xl text-sm transition-all duration-200 hover:shadow-2xl hover:shadow-blue-500/30 hover:-translate-y-px">
                Získat web ke shlédnutí zdarma
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
              </Link>
              <Link href="/sluzby"
                className="inline-flex items-center justify-center gap-2 text-slate-300 hover:text-white font-semibold px-8 py-4 rounded-xl text-sm border border-white/10 hover:border-white/25 transition-all duration-200">
                Prohlédnout služby
              </Link>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        @keyframes pulse    { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
        @keyframes slideDown { 0% { opacity: 0; transform: translateY(-4px); } 100% { opacity: 1; transform: translateY(4px); } }
        html { scroll-behavior: smooth; }
      `}</style>
    </>
  );
}
