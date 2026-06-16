'use client';

import { useRef, useEffect, useState } from 'react';
import Link from 'next/link';

function useReveal(delay = 0) {
  const ref = useRef<HTMLDivElement>(null);
  const [v, setV] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const o = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setV(true); o.disconnect(); } }, { threshold: 0.08 });
    o.observe(el); return () => o.disconnect();
  }, []);
  return { ref, style: { opacity: v ? 1 : 0, transform: v ? 'translateY(0)' : 'translateY(22px)', transition: `opacity 0.65s ease ${delay}ms, transform 0.65s ease ${delay}ms` } };
}

type Project = { client: string; obor: string; city: string; style: string; color: string; result: string; quote: string | null; size: string };

function MockBrowser({ color }: { color: string }) {
  return (
    <div className={`h-full w-full bg-gradient-to-br ${color} p-3`}>
      <div className="h-full rounded-lg bg-white/10 border border-white/20 flex flex-col overflow-hidden">
        <div className="flex items-center gap-1.5 px-3 py-2 border-b border-white/10 bg-white/5">
          <div className="w-2 h-2 rounded-full bg-white/40" /><div className="w-2 h-2 rounded-full bg-white/40" /><div className="w-2 h-2 rounded-full bg-white/40" />
          <div className="flex-1 mx-3 h-3 rounded-md bg-white/20 text-[8px] text-white/50 px-2 flex items-center">vasefirma.cz</div>
        </div>
        <div className="flex-1 p-4 space-y-3">
          <div className="h-8 rounded-lg bg-white/20 w-2/3" />
          <div className="space-y-2"><div className="h-2 rounded bg-white/20 w-full" /><div className="h-2 rounded bg-white/20 w-5/6" /><div className="h-2 rounded bg-white/20 w-4/6" /></div>
          <div className="flex gap-2 pt-2"><div className="h-7 w-24 rounded-lg bg-white/30" /><div className="h-7 w-20 rounded-lg bg-white/15" /></div>
        </div>
      </div>
    </div>
  );
}

function ProjectCard({ p, delay }: { p: Project; delay: number }) {
  const r = useReveal(delay);
  return (
    <div ref={r.ref} style={{ ...r.style, minHeight: 280 }} className={`group relative rounded-2xl overflow-hidden bg-white border border-slate-100 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 ${p.size}`}>
      <MockBrowser color={p.color} />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
        <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-semibold text-white/60 uppercase tracking-wide">{p.obor}</span>
            <span className="text-white/30">·</span>
            <span className="text-xs text-white/60">{p.city}</span>
          </div>
          <h3 className="text-white font-bold text-base mb-2">{p.client}</h3>
          <p className="text-emerald-400 text-xs font-semibold">{p.result}</p>
          {p.quote && <p className="text-white/70 text-xs mt-2 leading-relaxed">&ldquo;{p.quote}&rdquo;</p>}
        </div>
      </div>
      <div className="absolute top-4 left-4">
        <span className="text-xs font-semibold bg-white/90 text-slate-700 px-2.5 py-1 rounded-full backdrop-blur-sm">{p.style}</span>
      </div>
    </div>
  );
}

const PROJECTS: Project[] = [
  { client: 'Pavel Novák Instalace', obor: 'Instalatér', city: 'Praha', style: 'Moderní minimál', color: 'from-blue-500 to-blue-600', result: '+340% nových kontaktů', quote: 'Za dva týdny mi přišlo 12 poptávek. Dřív jsem byl závislý jen na doporučeních.', size: 'md:col-span-2' },
  { client: 'Zubní ordinace Procházková', obor: 'Zubní lékařka', city: 'Brno', style: 'Profesionální', color: 'from-teal-500 to-cyan-600', result: '70% nových pacientů přes web', quote: null, size: '' },
  { client: 'Kavárna Na Rohu', obor: 'Kavárna', city: 'Jihlava', style: 'Restaurace & Jídlo', color: 'from-amber-400 to-orange-500', result: '+40% online rezervací', quote: null, size: '' },
  { client: 'Fitness Centrum Olymp', obor: 'Fitness studio', city: 'Ostrava', style: 'Bold & Barevný', color: 'from-rose-500 to-pink-600', result: '3× více prodaných permanentek', quote: null, size: '' },
  { client: 'Advokátní kancelář Pospíšil', obor: 'Advokát', city: 'Praha', style: 'Dark & Luxury', color: 'from-slate-700 to-slate-900', result: 'Profesionální imidž, nárůst klientů', quote: null, size: 'md:col-span-2' },
  { client: 'Zahradnictví Zelený ráj', obor: 'Zahradník', city: 'Olomouc', style: 'Příroda & Eco', color: 'from-emerald-500 to-green-600', result: 'Zakázky z celého kraje', quote: null, size: '' },
];

export default function PortfolioPage() {
  const title = useReveal(0);
  return (
    <div className="pt-28">
      <section className="py-20 px-5 sm:px-8 text-center">
        <div className="max-w-3xl mx-auto">
          <div ref={title.ref} style={title.style}>
            <p className="text-xs font-semibold text-blue-600 uppercase tracking-widest mb-4">Portfolio</p>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-slate-900 mb-5">Weby, které mluví za sebe</h1>
            <p className="text-lg text-slate-500 leading-relaxed">Každý projekt je jiný. Stejná je kvalita a péče o každý detail.</p>
          </div>
        </div>
      </section>

      <section className="pb-28 px-5 sm:px-8">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-5" style={{ gridAutoRows: '280px' }}>
          {PROJECTS.map((p, i) => <ProjectCard key={p.client} p={p} delay={i * 60} />)}
        </div>
      </section>

      <section className="py-20 px-5 sm:px-8" style={{ background: '#0f1629' }}>
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Chcete být v naší galerii?</h2>
          <p className="text-slate-400 leading-relaxed mb-8">Váš web může být dalším úspěšným projektem. Začneme co nejdřív.</p>
          <Link href="/kontakt" className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold px-7 py-3.5 rounded-xl text-sm transition-all duration-200 hover:-translate-y-px hover:shadow-xl hover:shadow-blue-500/25">
            Získat web →
          </Link>
        </div>
      </section>
    </div>
  );
}
