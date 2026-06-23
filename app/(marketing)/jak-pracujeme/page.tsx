'use client';

import { useRef, useEffect, useState, ReactNode } from 'react';
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

type Step = { num: string; title: string; subtitle: string; desc: string; detail: string; icon: ReactNode };

const STEPS: Step[] = [
  {
    num: '01', title: 'Pošlete poptávku', subtitle: '2 minuty vašeho času',
    desc: 'Vyplníte jednoduchý formulář — jméno, obor, kontakt a co chcete říct světu. Žádné technické otázky, žádné složité briefy. Jen základní informace o vaší firmě.',
    detail: 'Odpovídáme do 2 hodin v pracovní dny. Většinou mnohem rychleji.',
    icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>,
  },
  {
    num: '02', title: 'My analyzujeme a navrhneme', subtitle: 'Do 24 hodin máte náhled',
    desc: 'Náš tým prostuduje vaše podnikání, konkurenci i cílové zákazníky. AI nástroje nám pomáhají s texty a koncepcí — výsledek ale vždy projde rukama zkušeného designéra.',
    detail: 'Každý web navrhujeme na míru. Žádné šablony z internetu.',
    icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2" /><polyline points="2 17 12 22 22 17" /><polyline points="2 12 12 17 22 12" /></svg>,
  },
  {
    num: '03', title: 'Schválíte nebo upravíme', subtitle: 'Neomezené revize',
    desc: 'Dostanete odkaz na živý náhled webu. Líbí se vám? Řeknete si o změny zdarma. Každé vaše připomínce věnujeme pozornost. Pokud web neschválíte, neplatíte nic.',
    detail: 'Průměrně potřebujeme 1–2 kola úprav. Nikdy neresignujeme na první ne.',
    icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>,
  },
  {
    num: '04', title: 'Spuštění a předání', subtitle: 'Platíte až tady',
    desc: 'Po schválení propojíme web s vaší doménou, nastavíme analytiku a vše předáme. Dostanete přístupy, videonávod k obsluze a jsme tady na telefonu kdykoliv budete potřebovat.',
    detail: 'Zaplatíte jednoduchou fakturou. Bez zálohy, bez překvapení.',
    icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>,
  },
];

const FAQS = [
  { q: 'Co potřebuju připravit předem?', a: 'Nic. Stačí vyplnit formulář. Texty, fotky (nebo jejich alternativy), styl — to vše řešíme my. Pokud máte vlastní fotky nebo loga, samozřejmě je použijeme.' },
  { q: 'Jak rychle web dostanu?', a: 'Landing page typicky do 24–48 hodin od první zprávy. Firemní web do 72 hodin. E-shop do 5–7 dní. Pokud spěcháte, napište to — umíme přidat prioritu.' },
  { q: 'Co když se mi web nebude líbit?', a: 'Bezplatně upravíme cokoli. Pokud web ani po úpravách neschválíte, neplatíte nic. Žádné storno poplatky, žádné podmínky.' },
  { q: 'Kdo bude vlastnit web po dodání?', a: 'Vy. Dostanete zdrojový kód, přístupy k hostingu i k doméně. Web je 100% váš.' },
  { q: 'Potřebuju technické znalosti?', a: 'Vůbec ne. Vše za vás vyřídíme — od registrace domény po nastavení e-mailu. Stačí schválit výsledek a podepsat fakturu.' },
];

function StepCard({ s, delay }: { s: Step; delay: number }) {
  const r = useReveal(delay);
  return (
    <div ref={r.ref} style={r.style} className="relative flex flex-col sm:flex-row gap-6 sm:gap-8 pb-14 last:pb-0">
      <div className="flex-shrink-0 flex items-start">
        <div style={{ width: 56, height: 56, borderRadius: 16, background: 'rgba(40,85,112,0.08)', border: '1.5px solid rgba(40,85,112,0.16)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: ACCENT, position: 'relative', zIndex: 10, flexShrink: 0 }}>
          {s.icon}
        </div>
      </div>
      <div className="pt-1 flex-1">
        <div className="flex items-center gap-3 mb-2">
          <span style={{ fontSize: 11, fontWeight: 700, color: ACCENT, fontFamily: 'monospace' }}>{s.num}</span>
          <span style={{ fontSize: 12, color: '#a8a4a0' }}>{s.subtitle}</span>
        </div>
        <h2 style={{ fontSize: 22, fontWeight: 700, color: '#1a2e3d', marginBottom: 10 }}>{s.title}</h2>
        <p style={{ color: '#6b6560', lineHeight: 1.7, marginBottom: 14, fontSize: 15 }}>{s.desc}</p>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 12, color: ACCENT, background: 'rgba(40,85,112,0.07)', padding: '7px 14px', borderRadius: 9, border: '1px solid rgba(40,85,112,0.14)' }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={ACCENT} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
          {s.detail}
        </div>
      </div>
    </div>
  );
}

function FaqItem({ q, a, delay }: { q: string; a: string; delay: number }) {
  const [open, setOpen] = useState(false);
  const r = useReveal(delay);
  return (
    <div ref={r.ref} style={{ ...r.style, borderBottom: '1px solid #e3ded7' }} className="last:border-0">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between py-5 text-left group">
        <span style={{ fontWeight: 600, color: open ? ACCENT : '#1a2e3d', fontSize: 14, transition: 'color 0.15s' }}>{q}</span>
        <span style={{ color: '#cbcac7', fontSize: 22, lineHeight: 1, marginLeft: 16, flexShrink: 0, transform: open ? 'rotate(45deg)' : 'none', display: 'inline-block', transition: 'transform 0.2s' }}>+</span>
      </button>
      {open && <p style={{ color: '#6b6560', fontSize: 14, lineHeight: 1.7, paddingBottom: 20 }}>{a}</p>}
    </div>
  );
}

export default function JakPracujemePage() {
  const title = useReveal(0);
  const faqTitle = useReveal(0);

  return (
    <div className="pt-28" style={{ background: BG }}>
      <section className="py-20 px-5 sm:px-8 text-center">
        <div className="max-w-3xl mx-auto">
          <div ref={title.ref} style={title.style}>
            <p style={{ fontSize: 11, fontWeight: 700, color: 'rgba(40,85,112,0.55)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 16 }}>Jak pracujeme</p>
            <h1 style={{ fontSize: 'clamp(32px,5vw,46px)', fontWeight: 700, letterSpacing: '-0.03em', color: '#1a2e3d', marginBottom: 18, lineHeight: 1.15 }}>Od poptávky k webu za 48 hodin</h1>
            <p style={{ fontSize: 17, color: '#6b6560', lineHeight: 1.65 }}>Jednoduchý proces bez zbytečného papírování. Vy se soustředíte na byznys, my na web.</p>
          </div>
        </div>
      </section>

      <section className="pb-24 px-5 sm:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="relative">
            <div className="absolute left-[27px] top-12 bottom-12 w-px hidden sm:block" style={{ background: '#e3ded7' }} />
            <div className="space-y-0">
              {STEPS.map((s, i) => <StepCard key={s.num} s={s} delay={i * 100} />)}
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-5 sm:px-8" style={{ background: BG2, borderTop: '1px solid #e3ded7' }}>
        <div className="max-w-3xl mx-auto">
          <div ref={faqTitle.ref} style={faqTitle.style} className="text-center mb-12">
            <h2 style={{ fontSize: 30, fontWeight: 700, color: '#1a2e3d', marginBottom: 10 }}>Časté otázky</h2>
            <p style={{ color: '#6b6560' }}>Odpovědi na to, co řeší většina klientů.</p>
          </div>
          <div style={{ background: '#fff', borderRadius: 18, border: '1px solid #e3ded7', padding: '0 32px' }}>
            {FAQS.map((f, i) => <FaqItem key={f.q} q={f.q} a={f.a} delay={i * 60} />)}
          </div>
        </div>
      </section>

      <section className="py-20 px-5 sm:px-8" style={{ background: ACCENT }}>
        <div className="max-w-2xl mx-auto text-center">
          <h2 style={{ fontSize: 30, fontWeight: 700, color: '#fff', marginBottom: 14 }}>Připraveni začít?</h2>
          <p style={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1.65, marginBottom: 32 }}>Poptávka je zdarma a nezávazná. Odpovídáme do 2 hodin.</p>
          <Link href="/kontakt" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#fff', color: ACCENT, fontWeight: 700, padding: '14px 32px', borderRadius: 12, fontSize: 14, textDecoration: 'none', transition: 'box-shadow 0.2s, transform 0.2s' }}
            onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.15)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
            onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'none'; }}>
            Získat web →
          </Link>
        </div>
      </section>
    </div>
  );
}
