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

const VALUES = [
  { title: 'Rychlost bez kompromisů', desc: 'Dodáváme do 48 hodin. Nikdy na úkor kvality. Kde jiní tráví týdny briefy, my jdeme rovnou k výsledku.' },
  { title: 'Platíte až za výsledek', desc: 'Zálohy nebereme. Nejdřív uvidíte hotový web, pak se rozhodnete. Riziko je na nás — proto pracujeme pečlivě.' },
  { title: 'Lokální firmy si zaslouží víc', desc: 'Každý řemeslník, živnostník nebo kavárna si zaslouží web, který by mu udělali v Praze za pětinásobek.' },
  { title: 'Jdeme s dobou', desc: 'Sledujeme trendy v designu i nové nástroje. Kde dává smysl je využít pro rychlejší nebo kvalitnější výsledek, využíváme je.' },
];

const MILESTONES = [
  { year: '2024', event: 'První web pro lokálního instalatéra. Výsledek: 12 poptávek za 2 týdny.' },
  { year: '2025', event: 'Vyladění procesu tak, aby byl každý web hotový do 48 hodin bez kompromisů na kvalitě.' },
  { year: '2026', event: 'Přes 50 spokojených klientů. Rozšíření na e-commerce a správu webů.' },
];

function ValueCard({ title, desc, delay }: { title: string; desc: string; delay: number }) {
  const r = useReveal(delay);
  return (
    <div ref={r.ref} style={r.style} className="bg-white rounded-2xl border border-slate-100 p-7 hover:shadow-md transition-shadow duration-200">
      <div className="w-1 h-8 rounded-full bg-blue-500 mb-4" />
      <h3 className="font-bold text-slate-900 mb-2">{title}</h3>
      <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
    </div>
  );
}

function MilestoneCard({ year, event, delay }: { year: string; event: string; delay: number }) {
  const r = useReveal(delay);
  return (
    <div ref={r.ref} style={r.style} className="flex gap-6 items-start">
      <div className="text-sm font-bold text-blue-600 font-mono w-12 shrink-0 mt-0.5">{year}</div>
      <div className="flex-1 bg-white rounded-xl border border-slate-100 p-5">
        <p className="text-slate-700 text-sm leading-relaxed">{event}</p>
      </div>
    </div>
  );
}

export default function ONasPage() {
  const title = useReveal(0);
  const missionRef = useReveal(100);
  const valuesTitle = useReveal(0);
  const teamTitle = useReveal(0);
  const timelineTitle = useReveal(0);
  const approachRef = useReveal(80);

  return (
    <div className="pt-28">
      {/* Hero */}
      <section className="py-20 px-5 sm:px-8">
        <div className="max-w-5xl mx-auto">
          <div ref={title.ref} style={title.style} className="mb-10">
            <p className="text-xs font-semibold text-blue-600 uppercase tracking-widest mb-4">O nás</p>
            <h1 className="text-5xl sm:text-6xl font-bold tracking-tight text-slate-900 mb-6 leading-tight" style={{ fontFamily: 'var(--font-display)' }}>
              Malá firma.<br />
              <span className="italic text-blue-600">Velké výsledky.</span>
            </h1>
          </div>
          <div ref={missionRef.ref} style={missionRef.style} className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
            <div>
              <p className="text-xl text-slate-600 leading-relaxed mb-5">
                WebsiteAgent vznikl s jedinou myšlenkou: <strong className="text-slate-900">každá lokální firma si zaslouží web, který skutečně pracuje</strong> — ne jen existuje.
              </p>
              <p className="text-slate-500 leading-relaxed mb-5">
                Viděli jsme příliš mnoho šikovných řemeslníků, lékařů a podnikatelů, kteří měli buď žádný web, nebo takový, za který se styděli. Rozhodli jsme se to změnit.
              </p>
              <p className="text-slate-500 leading-relaxed">
                Děláme weby poctivě a na míru. S designem se nezabíháme do šablon. Každý projekt bere čas, pozornost a péči — a výsledek to vždy pozná.
              </p>
            </div>
            <div className="rounded-2xl overflow-hidden shadow-lg shadow-slate-200/80">
              <img
                src="https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=800&q=80&auto=format&fit=crop"
                alt="Naše pracovní prostředí"
                className="w-full h-64 object-cover"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats strip */}
      <section className="py-14" style={{ background: '#0f1629' }}>
        <div className="max-w-5xl mx-auto px-5 sm:px-8 grid grid-cols-2 sm:grid-cols-4 gap-8 text-center">
          {[['50+', 'spokojených klientů'], ['48h', 'průměrná dodávka'], ['0 Kč', 'záloha předem'], ['100%', 'vlastníte výsledek']].map(([val, label]) => (
            <div key={label}>
              <p className="text-3xl font-bold text-white" style={{ fontFamily: 'var(--font-display)' }}>{val}</p>
              <p className="text-xs text-slate-400 mt-1">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Team / Who we are */}
      <section className="py-20 px-5 sm:px-8">
        <div className="max-w-5xl mx-auto">
          <div ref={teamTitle.ref} style={teamTitle.style} className="mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-3 leading-tight" style={{ fontFamily: 'var(--font-display)' }}>Kdo za tím stojí</h2>
            <p className="text-slate-500">Malý tým. Osobní přístup ke každému projektu.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
            {/* Max */}
            <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
              <img
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80&auto=format&fit=crop"
                alt="Tým při práci"
                className="w-full h-52 object-cover object-top"
                loading="lazy"
              />
              <div className="p-7">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white font-bold text-lg">M</div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-lg">Max</h3>
                    <p className="text-blue-600 text-xs font-semibold">Zakladatel</p>
                  </div>
                </div>
                <p className="text-slate-500 text-sm leading-relaxed">
                  Fascinuje mě, jak moc záleží na prvním dojmu. Dobře navržený web může změnit osud celé provozovny — a přesně to chceme dělat. Každý projekt beru osobně.
                </p>
              </div>
            </div>

            {/* How we work */}
            <div ref={approachRef.ref} style={approachRef.style} className="space-y-5">
              <div className="rounded-2xl p-7" style={{ background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)', border: '1px solid #bfdbfe' }}>
                <h3 className="font-bold text-slate-900 mb-3">Reální designéři, ne šablony</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Každý web navrhujeme od začátku. Žádné připravené šablony z internetu — jen design na míru vaší firmě, vašemu oboru a vašim zákazníkům.
                </p>
              </div>
              <div className="rounded-2xl p-7 bg-white border border-slate-100">
                <h3 className="font-bold text-slate-900 mb-3">Jdeme s dobou</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Sledujeme, co funguje v moderním webdesignu. Kde to má smysl, využíváme i nejnovější nástroje — včetně AI asistence pro texty a strukturu. Výsledek je vždy v rukou zkušeného designéra.
                </p>
              </div>
              <div className="rounded-2xl p-7 bg-white border border-slate-100">
                <h3 className="font-bold text-slate-900 mb-3">Spolupracujeme s odborníky</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  U specializovaných projektů spolupracujeme s dalšími odborníky — copywritery, fotografy, SEO specialisty. Malý tým, velká síť.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 px-5 sm:px-8" style={{ background: 'linear-gradient(135deg, #f0f9ff 0%, #eff6ff 100%)' }}>
        <div className="max-w-5xl mx-auto">
          <div ref={valuesTitle.ref} style={valuesTitle.style} className="mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-3 leading-tight" style={{ fontFamily: 'var(--font-display)' }}>Čím se řídíme</h2>
            <p className="text-slate-500">Zásady, které promítáme do každého projektu.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {VALUES.map((v, i) => <ValueCard key={v.title} title={v.title} desc={v.desc} delay={i * 80} />)}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 px-5 sm:px-8 border-t border-slate-100">
        <div className="max-w-3xl mx-auto">
          <div ref={timelineTitle.ref} style={timelineTitle.style} className="mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-2" style={{ fontFamily: 'var(--font-display)' }}>Jak jsme se dostali sem</h2>
          </div>
          <div className="space-y-6">
            {MILESTONES.map((m, i) => <MilestoneCard key={m.year} year={m.year} event={m.event} delay={i * 100} />)}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-5 sm:px-8" style={{ background: '#0f1629' }}>
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 leading-tight" style={{ fontFamily: 'var(--font-display)' }}>Pojďme spolupracovat</h2>
          <p className="text-slate-400 leading-relaxed mb-8">Rádi se dozvíme o vašem podnikání. Ozveme se do 2 hodin.</p>
          <Link href="/kontakt" className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold px-7 py-3.5 rounded-xl text-sm transition-all duration-200 hover:-translate-y-px hover:shadow-xl hover:shadow-blue-500/25">
            Napište nám →
          </Link>
        </div>
      </section>
    </div>
  );
}
