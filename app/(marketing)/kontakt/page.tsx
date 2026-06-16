'use client';

import { useRef, useEffect, useState } from 'react';

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

type FormState = 'idle' | 'sending' | 'success' | 'error';

export default function KontaktPage() {
  const title = useReveal(0);
  const form = useReveal(100);

  const [state, setState] = useState<FormState>('idle');
  const [fields, setFields] = useState({ name: '', email: '', phone: '', obor: '', message: '' });

  useEffect(() => {
    const msg = new URLSearchParams(window.location.search).get('message');
    if (msg) setFields((p) => ({ ...p, message: msg }));
  }, []);

  function setField(k: keyof typeof fields, v: string) {
    setFields((p) => ({ ...p, [k]: v }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setState('sending');
    try {
      const res = await fetch('/api/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: fields.name,
          email: fields.email,
          phone: fields.phone,
          business_name: fields.obor,
          notes: fields.message || undefined,
        }),
      });
      if (!res.ok) throw new Error('failed');
      setState('success');
    } catch {
      setState('error');
    }
  }

  return (
    <div className="pt-28">
      <section className="py-20 px-5 sm:px-8">
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Left */}
          <div>
            <div ref={title.ref} style={title.style}>
              <p className="text-xs font-semibold text-blue-600 uppercase tracking-widest mb-4">Kontakt</p>
              <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-slate-900 mb-5 leading-tight">
                Začněme společně
              </h1>
              <p className="text-lg text-slate-500 leading-relaxed mb-10">
                Napište nám, co podnikáte. My se postaráme o zbytek. Odpovídáme do 2 hodin v pracovní dny.
              </p>
            </div>

            <div className="space-y-6">
              {[
                {
                  icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 10.63 19.79 19.79 0 0 1 1.61 2a2 2 0 0 1 1.98-2.18h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 7.91a16 16 0 0 0 6.06 6.06l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" /></svg>,
                  label: 'Telefon',
                  value: '+420 XXX XXX XXX',
                },
                {
                  icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>,
                  label: 'E-mail',
                  value: 'info@websiteagent.cz',
                },
                {
                  icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>,
                  label: 'Reakce',
                  value: 'Do 2 hodin v pracovní dny',
                },
              ].map((item) => (
                <div key={item.label} className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                    {item.icon}
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-medium mb-0.5">{item.label}</p>
                    <p className="text-slate-700 font-medium text-sm">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-10 p-5 rounded-2xl bg-emerald-50 border border-emerald-100">
              <div className="flex items-center gap-3 mb-2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                <p className="text-emerald-800 font-semibold text-sm">Platíte až po schválení</p>
              </div>
              <p className="text-emerald-700 text-xs leading-relaxed">Žádná záloha. Nejdřív uvidíte hotový web, teprve pak se rozhodnete. Pokud se vám výsledek nebude líbit, zaplatíte 0 Kč.</p>
            </div>
          </div>

          {/* Form */}
          <div ref={form.ref} style={form.style}>
            {state === 'success' ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-20">
                <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mb-6">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                </div>
                <h2 className="text-2xl font-bold text-slate-900 mb-3">Zpráva odeslána!</h2>
                <p className="text-slate-500 leading-relaxed max-w-xs">Ozveme se vám do 2 hodin. Těšíme se na spolupráci.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="bg-white border border-slate-100 rounded-2xl p-8 shadow-sm space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1.5">Vaše jméno *</label>
                    <input
                      required value={fields.name} onChange={(e) => setField('name', e.target.value)}
                      className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                      placeholder="Jan Novák"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1.5">Telefon</label>
                    <input
                      value={fields.phone} onChange={(e) => setField('phone', e.target.value)}
                      className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                      placeholder="+420 777 888 999"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1.5">E-mail *</label>
                  <input
                    required type="email" value={fields.email} onChange={(e) => setField('email', e.target.value)}
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                    placeholder="jan@mafirma.cz"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1.5">Čím se zabýváte?</label>
                  <input
                    value={fields.obor} onChange={(e) => setField('obor', e.target.value)}
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                    placeholder="Instalatér, kavárna, advokát..."
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1.5">Zpráva (volitelné)</label>
                  <textarea
                    value={fields.message} onChange={(e) => setField('message', e.target.value)}
                    rows={4}
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all resize-none"
                    placeholder="Co od webu očekáváte? Máte konkrétní představu o stylu?"
                  />
                </div>
                {state === 'error' && (
                  <p className="text-red-500 text-xs">Něco se nepovedlo. Zkuste to prosím znovu nebo nám napište přímo na e-mail.</p>
                )}
                <button
                  type="submit"
                  disabled={state === 'sending'}
                  className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-60 text-white font-semibold py-3.5 px-5 rounded-xl text-sm transition-all duration-200 hover:-translate-y-px hover:shadow-xl hover:shadow-blue-500/25"
                >
                  {state === 'sending' ? 'Odesílám...' : 'Odeslat poptávku →'}
                </button>
                <p className="text-xs text-slate-400 text-center">Odpovídáme do 2 hodin · Žádný spam · Bez závazku</p>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
