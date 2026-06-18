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

const TESTIMONIALS = [
  { name: 'Pavel Novák', company: 'Pavel Novák Instalace', obor: 'Instalatér, Praha', stars: 5, text: 'Za dva týdny od spuštění mi přišlo 12 poptávek přímo z webu. Dřív jsem byl závislý jen na doporučeních od kamarádů. Web vypadá lépe než od firem, co si účtují trojnásobek.', result: '+340% poptávek online', featured: true },
  { name: 'MUDr. Jana Procházková', company: 'Zubní ordinace Procházková', obor: 'Zubní lékařka, Brno', stars: 5, text: 'Potřebovala jsem profesionální prezentaci ordinace, ale neměla jsem čas to řešit. Max to dal dohromady za 48 hodin a přesně pochopil, co pacienti chtějí vidět.', result: '70% nových pacientů přes web', featured: false },
  { name: 'Tomáš Vávra', company: 'Kavárna Na Rohu', obor: 'Majitel kavárny, Jihlava', stars: 5, text: 'Myslel jsem si, že pro kavárnu web nepotřebuju. Mýlil jsem se. Online rezervace vzrostly o 40% a lidi nás nacházejí přes Google, kde jsme předtím vůbec nebyli.', result: '+40% rezervací online', featured: false },
  { name: 'Mgr. Radek Pospíšil', company: 'Advokátní kancelář Pospíšil', obor: 'Advokát, Praha', stars: 5, text: 'Jako advokát mi záleží na prvním dojmu. Web od WebsiteAgent vypadá přesně tak, jak si klienti prestižní kanceláře představují. Platil jsem za výsledek — a výsledek přišel.', result: 'Nárůst klientů z online vyhledávání', featured: false },
  { name: 'Petra Horáková', company: 'Fitness Centrum Olymp', obor: 'Majitelka fitness studia, Ostrava', stars: 5, text: 'Prodej permanentek přes web se ztrojnásobil. Stránka je přehledná, rychlá a zákazníci ji chválí. Líbí se mi, že jsem nemusela vůbec nic připravovat — Max vše vyřídil sám.', result: '3× více prodaných permanentek', featured: false },
  { name: 'Ing. Milan Červenka', company: 'MC Elektro', obor: 'Elektrikář, České Budějovice', stars: 5, text: 'Žádná záloha, zaplatil jsem až po schválení — to mě přesvědčilo zkusit to. Web vznikl za den a půl. Teď volají zákazníci z celého kraje, ne jen z okolí.', result: 'Poptávky z celého jihočeského kraje', featured: false },
];

function Stars({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill="#f59e0b" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
      ))}
    </div>
  );
}

type Testimonial = typeof TESTIMONIALS[0];

function TestimonialCard({ t, delay }: { t: Testimonial; delay: number }) {
  const r = useReveal(delay);
  return (
    <div ref={r.ref} style={r.style} className={`bg-[#0d1e38] rounded-2xl border p-7 flex flex-col ${t.featured ? 'border-blue-500/30 shadow-lg shadow-blue-500/10 md:col-span-2' : 'border-white/8 hover:border-white/15'} transition-all duration-200`}>
      {t.featured && (
        <span className="inline-block text-xs font-bold text-blue-400 bg-blue-950/50 px-2.5 py-1 rounded-full mb-4 self-start border border-blue-500/20">Příběh úspěchu</span>
      )}
      <Stars count={t.stars} />
      <p className="text-slate-300 leading-relaxed mt-4 mb-5 flex-1 text-sm">&ldquo;{t.text}&rdquo;</p>
      <div className={`flex ${t.featured ? 'flex-row items-center justify-between' : 'flex-col gap-3'} mt-auto`}>
        <div>
          <p className="font-semibold text-white text-sm">{t.name}</p>
          <p className="text-slate-500 text-xs mt-0.5">{t.obor}</p>
        </div>
        <div className="inline-flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-950/40 px-3 py-1.5 rounded-lg font-medium border border-emerald-500/20">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" /></svg>
          {t.result}
        </div>
      </div>
    </div>
  );
}

export default function ReferencePage() {
  const title = useReveal(0);
  const stats = useReveal(150);

  return (
    <div className="pt-28">
      <section className="py-20 px-5 sm:px-8 text-center">
        <div className="max-w-3xl mx-auto">
          <div ref={title.ref} style={title.style}>
            <p className="text-xs font-semibold text-blue-400 uppercase tracking-widest mb-4">Reference</p>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-white mb-5">Co říkají naši klienti</h1>
            <p className="text-lg text-slate-400 leading-relaxed">Výsledky hovoří za sebe. Tohle jsou slova lidí, kteří nám důvěřovali.</p>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="pb-16 px-5 sm:px-8">
        <div ref={stats.ref} style={stats.style} className="max-w-3xl mx-auto bg-[#0d1e38] border border-white/8 rounded-2xl px-8 py-6">
          <div className="grid grid-cols-3 divide-x divide-white/10 text-center">
            {[['50+', 'spokojených klientů'], ['4.9/5', 'průměrné hodnocení'], ['100%', 'doporučilo by nás']].map(([val, label]) => (
              <div key={label} className="px-4">
                <p className="text-2xl font-bold text-white">{val}</p>
                <p className="text-xs text-slate-400 mt-1">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials grid */}
      <section className="pb-28 px-5 sm:px-8">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-5">
          {TESTIMONIALS.map((t, i) => <TestimonialCard key={t.name} t={t} delay={i * 70} />)}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-5 sm:px-8" style={{ background: '#0f1629' }}>
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Napište svůj vlastní příběh úspěchu</h2>
          <p className="text-slate-400 leading-relaxed mb-8">Stačí poptávka. Zbytek nechte na nás.</p>
          <Link href="/kontakt" className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold px-7 py-3.5 rounded-xl text-sm transition-all duration-200 hover:-translate-y-px hover:shadow-xl hover:shadow-blue-500/25">
            Získat web →
          </Link>
        </div>
      </section>
    </div>
  );
}
