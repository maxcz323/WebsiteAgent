'use client';

import { useRef, useEffect, useState } from 'react';
import Link from 'next/link';

const BG = '#faf7f6';
const BG2 = '#f0ebe7';
const ACCENT = '#285570';

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
  { title: 'Rychlost bez kompromisů', desc: 'Dodáváme do 48 hodin, nikdy na úkor kvality. Kde jiní tráví týdny na briefech, my jdeme rovnou k výsledku.' },
  { title: 'Platíte až za výsledek', desc: 'Zálohy nebereme. Nejdřív uvidíte hotový web, pak se rozhodnete. Riziko je na nás — proto pracujeme pečlivě.' },
  { title: 'Lokální firmy si zaslouží víc', desc: 'Každý řemeslník, živnostník nebo kavárna si zaslouží web, který by mu udělali v Praze za pětinásobek.' },
  { title: 'Jdeme s dobou', desc: 'Sledujeme trendy v designu i nové nástroje. Kde to dává smysl, využíváme je pro rychlejší a kvalitnější výsledek.' },
];

function ValueCard({ title, desc, delay }: { title: string; desc: string; delay: number }) {
  const r = useReveal(delay);
  return (
    <div ref={r.ref} style={{ ...r.style, background: '#fff', borderRadius: 18, border: '1px solid #e3ded7', padding: 28 }}>
      <div style={{ width: 4, height: 32, borderRadius: 2, background: ACCENT, marginBottom: 16 }} />
      <h3 style={{ fontWeight: 700, color: '#1a2e3d', marginBottom: 8 }}>{title}</h3>
      <p style={{ color: '#6b6560', fontSize: 14, lineHeight: 1.7 }}>{desc}</p>
    </div>
  );
}

export default function ONasPage() {
  const title = useReveal(0);
  const missionRef = useReveal(100);
  const valuesTitle = useReveal(0);
  const teamTitle = useReveal(0);
  const approachRef = useReveal(80);

  return (
    <div className="pt-28" style={{ background: BG }}>
      {/* Hero */}
      <section className="py-20 px-5 sm:px-8">
        <div className="max-w-5xl mx-auto">
          <div ref={title.ref} style={title.style} className="mb-10">
            <p style={{ fontSize: 11, fontWeight: 700, color: 'rgba(40,85,112,0.55)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 16 }}>O nás</p>
            <h1 style={{ fontSize: 'clamp(38px,5.5vw,56px)', fontWeight: 700, letterSpacing: '-0.03em', color: '#1a2e3d', marginBottom: 0, lineHeight: 1.1, fontFamily: 'var(--font-display)' }}>
              Malá firma.<br />
              <span style={{ fontStyle: 'italic', color: ACCENT }}>Velké výsledky.</span>
            </h1>
          </div>
          <div ref={missionRef.ref} style={missionRef.style} className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
            <div>
              <p style={{ fontSize: 18, color: '#5c5650', lineHeight: 1.7, marginBottom: 18 }}>
                WebsiteAgent vznikl s jedinou myšlenkou: <strong style={{ color: '#1a2e3d' }}>každá lokální firma si zaslouží web, který skutečně pracuje</strong> — ne jen existuje.
              </p>
              <p style={{ color: '#6b6560', lineHeight: 1.7, marginBottom: 14 }}>
                Viděli jsme příliš mnoho šikovných řemeslníků, lékařů a podnikatelů, kteří měli buď žádný web, nebo takový, za který se styděli. Rozhodli jsme se to změnit.
              </p>
              <p style={{ color: '#6b6560', lineHeight: 1.7 }}>
                Děláme weby poctivě a na míru. Design vždy tvoříme od základu — žádné šablony z internetu. Každý projekt si zaslouží potřebný čas a péči, a na výsledku je to znát.
              </p>
            </div>
            <div style={{ borderRadius: 18, overflow: 'hidden', boxShadow: '0 4px 28px rgba(40,85,112,0.10)', border: '1px solid #e3ded7' }}>
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
      <section className="py-14" style={{ background: ACCENT }}>
        <div className="max-w-5xl mx-auto px-5 sm:px-8 grid grid-cols-2 sm:grid-cols-4 gap-8 text-center">
          {[['50+', 'spokojených klientů'], ['48h', 'průměrná dodávka'], ['0 Kč', 'záloha předem'], ['100%', 'vlastníte výsledek']].map(([val, label]) => (
            <div key={label}>
              <p style={{ fontSize: 30, fontWeight: 700, color: '#fff', fontFamily: 'var(--font-display)' }}>{val}</p>
              <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', marginTop: 4 }}>{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Team / Who we are */}
      <section className="py-20 px-5 sm:px-8">
        <div className="max-w-5xl mx-auto">
          <div ref={teamTitle.ref} style={teamTitle.style} className="mb-12">
            <h2 style={{ fontSize: 'clamp(26px,4vw,36px)', fontWeight: 700, color: '#1a2e3d', marginBottom: 10, fontFamily: 'var(--font-display)' }}>Kdo za tím stojí</h2>
            <p style={{ color: '#6b6560' }}>Malý tým. Osobní přístup ke každému projektu.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
            {/* Max */}
            <div style={{ background: '#fff', borderRadius: 18, border: '1px solid #e3ded7', overflow: 'hidden' }}>
              <img
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80&auto=format&fit=crop"
                alt="Tým při práci"
                className="w-full h-40 sm:h-52 object-cover object-top"
                loading="lazy"
              />
              <div style={{ padding: 28 }}>
                <div className="flex items-center gap-4 mb-4">
                  <div style={{ width: 48, height: 48, borderRadius: 14, background: ACCENT, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 18 }}>M</div>
                  <div>
                    <h3 style={{ fontWeight: 700, color: '#1a2e3d', fontSize: 17 }}>Max</h3>
                    <p style={{ color: ACCENT, fontSize: 12, fontWeight: 600 }}>Zakladatel</p>
                  </div>
                </div>
                <p style={{ color: '#6b6560', fontSize: 14, lineHeight: 1.7 }}>
                  Fascinuje mě, jak moc záleží na prvním dojmu. Dobře navržený web může změnit osud celé provozovny — a přesně to chceme dělat. Každý projekt beru osobně.
                </p>
              </div>
            </div>

            {/* How we work */}
            <div ref={approachRef.ref} style={approachRef.style} className="space-y-5">
              <div style={{ borderRadius: 18, padding: 28, background: 'rgba(40,85,112,0.05)', border: '1px solid rgba(40,85,112,0.12)' }}>
                <h3 style={{ fontWeight: 700, color: '#1a2e3d', marginBottom: 10 }}>Reální designéři, ne šablony</h3>
                <p style={{ color: '#6b6560', fontSize: 14, lineHeight: 1.7 }}>
                  Každý web navrhujeme od začátku. Žádné připravené šablony z internetu — jen design na míru vaší firmě, vašemu oboru a vašim zákazníkům.
                </p>
              </div>
              <div style={{ borderRadius: 18, padding: 28, background: '#fff', border: '1px solid #e3ded7' }}>
                <h3 style={{ fontWeight: 700, color: '#1a2e3d', marginBottom: 10 }}>Jdeme s dobou</h3>
                <p style={{ color: '#6b6560', fontSize: 14, lineHeight: 1.7 }}>
                  Sledujeme, co funguje v moderním webdesignu. Kde to má smysl, využíváme i nejnovější nástroje — včetně AI asistence pro texty a strukturu. Výsledek je vždy v rukou zkušeného designéra.
                </p>
              </div>
              <div style={{ borderRadius: 18, padding: 28, background: '#fff', border: '1px solid #e3ded7' }}>
                <h3 style={{ fontWeight: 700, color: '#1a2e3d', marginBottom: 10 }}>Spolupracujeme s odborníky</h3>
                <p style={{ color: '#6b6560', fontSize: 14, lineHeight: 1.7 }}>
                  U specializovaných projektů spolupracujeme s dalšími odborníky — copywritery, fotografy, SEO specialisty. Malý tým, velká síť.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 px-5 sm:px-8" style={{ background: BG2 }}>
        <div className="max-w-5xl mx-auto">
          <div ref={valuesTitle.ref} style={valuesTitle.style} className="mb-12">
            <h2 style={{ fontSize: 'clamp(26px,4vw,36px)', fontWeight: 700, color: '#1a2e3d', marginBottom: 10, fontFamily: 'var(--font-display)' }}>Čím se řídíme</h2>
            <p style={{ color: '#6b6560' }}>Zásady, které promítáme do každého projektu.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {VALUES.map((v, i) => <ValueCard key={v.title} title={v.title} desc={v.desc} delay={i * 80} />)}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-5 sm:px-8" style={{ background: ACCENT }}>
        <div className="max-w-2xl mx-auto text-center">
          <h2 style={{ fontSize: 'clamp(26px,4vw,36px)', fontWeight: 700, color: '#fff', marginBottom: 14, fontFamily: 'var(--font-display)' }}>Pojďme spolupracovat</h2>
          <p style={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1.65, marginBottom: 32 }}>Rádi se dozvíme o vašem podnikání. Ozveme se do 2 hodin.</p>
          <Link href="/kontakt" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#fff', color: ACCENT, fontWeight: 700, padding: '14px 32px', borderRadius: 12, fontSize: 14, textDecoration: 'none', transition: 'box-shadow 0.2s, transform 0.2s' }}
            onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.15)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
            onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'none'; }}>
            Napište nám →
          </Link>
        </div>
      </section>
    </div>
  );
}
