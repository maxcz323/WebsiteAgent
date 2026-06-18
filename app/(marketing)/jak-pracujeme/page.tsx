'use client';

import { useRef, useEffect, useState, ReactNode } from 'react';
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
        <div className="w-14 h-14 rounded-2xl bg-[#0d1e38] border-2 border-blue-500/25 flex items-center justify-center text-blue-400 relative z-10">{s.icon}</div>
      </div>
      <div className="pt-1 flex-1">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-xs font-bold text-blue-400 font-mono">{s.num}</span>
          <span className="text-xs text-slate-500">{s.subtitle}</span>
        </div>
        <h2 className="text-2xl font-bold text-white mb-3">{s.title}</h2>
        <p className="text-slate-400 leading-relaxed mb-4">{s.desc}</p>
        <div className="inline-flex items-center gap-2 text-xs text-emerald-400 bg-emerald-950/40 px-3 py-2 rounded-lg border border-emerald-500/20">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
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
    <div ref={r.ref} style={r.style} className="border-b border-white/8 last:border-0">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between py-5 text-left group">
        <span className="font-semibold text-slate-200 text-sm group-hover:text-blue-400 transition-colors">{q}</span>
        <span className={`text-slate-400 transition-transform duration-200 ${open ? 'rotate-45' : ''} text-xl leading-none ml-4 shrink-0`}>+</span>
      </button>
      {open && <p className="text-slate-400 text-sm leading-relaxed pb-5">{a}</p>}
    </div>
  );
}

export default function JakPracujemePage() {
  const title = useReveal(0);
  const faqTitle = useReveal(0);

  return (
    <div className="pt-28">
      <section className="py-20 px-5 sm:px-8 text-center">
        <div className="max-w-3xl mx-auto">
          <div ref={title.ref} style={title.style}>
            <p className="text-xs font-semibold text-blue-400 uppercase tracking-widest mb-4">Jak pracujeme</p>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-white mb-5">Od poptávky k webu za 48 hodin</h1>
            <p className="text-lg text-slate-400 leading-relaxed">Jednoduchý proces bez zbytečného papírování. Vy se soustředíte na byznys, my na web.</p>
          </div>
        </div>
      </section>

      <section className="pb-24 px-5 sm:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="relative">
            <div className="absolute left-[27px] top-12 bottom-12 w-px bg-gradient-to-b from-blue-700 via-blue-800 to-transparent hidden sm:block" />
            <div className="space-y-0">
              {STEPS.map((s, i) => <StepCard key={s.num} s={s} delay={i * 100} />)}
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-5 sm:px-8 border-t border-white/8" style={{ background: '#081428' }}>
        <div className="max-w-3xl mx-auto">
          <div ref={faqTitle.ref} style={faqTitle.style} className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-3">Časté otázky</h2>
            <p className="text-slate-400">Odpovědi na to, co řeší většina klientů.</p>
          </div>
          <div className="bg-[#0d1e38] rounded-2xl border border-white/8 px-6 sm:px-8 divide-y divide-white/8">
            {FAQS.map((f, i) => <FaqItem key={f.q} q={f.q} a={f.a} delay={i * 60} />)}
          </div>
        </div>
      </section>

      <section className="py-20 px-5 sm:px-8" style={{ background: '#0f1629' }}>
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Připraveni začít?</h2>
          <p className="text-slate-400 leading-relaxed mb-8">Poptávka je zdarma a nezávazná. Odpovídáme do 2 hodin.</p>
          <Link href="/kontakt" className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold px-7 py-3.5 rounded-xl text-sm transition-all duration-200 hover:-translate-y-px hover:shadow-xl hover:shadow-blue-500/25">
            Získat web →
          </Link>
        </div>
      </section>
    </div>
  );
}
