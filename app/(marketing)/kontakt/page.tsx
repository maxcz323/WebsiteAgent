'use client';

import { useRef, useEffect, useState } from 'react';

const ACCENT = '#285570';
const BG = '#faf7f6';

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

const INPUT = {
  width: '100%', background: BG, border: '1px solid #e3ded7',
  borderRadius: 12, padding: '12px 16px', fontSize: 14, color: '#1a2e3d',
  outline: 'none', transition: 'border-color 0.15s, box-shadow 0.15s',
  fontFamily: 'inherit',
} as React.CSSProperties;

export default function KontaktPage() {
  const title = useReveal(0);
  const form = useReveal(100);

  const [state, setState] = useState<FormState>('idle');
  const [fields, setFields] = useState({ name: '', email: '', phone: '', obor: '', city: '', website_style: 'modern-minimal', message: '' });

  useEffect(() => {
    const msg = new URLSearchParams(window.location.search).get('message');
    if (msg) setFields((p) => ({ ...p, message: msg }));
  }, []);

  function setField(k: keyof typeof fields, v: string) {
    setFields((p) => ({ ...p, [k]: v }));
  }

  function onFocus(e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) {
    e.currentTarget.style.borderColor = ACCENT;
    e.currentTarget.style.boxShadow = `0 0 0 3px rgba(40,85,112,0.1)`;
  }
  function onBlur(e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) {
    e.currentTarget.style.borderColor = '#e3ded7';
    e.currentTarget.style.boxShadow = 'none';
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
          city: fields.city,
          website_style: fields.website_style,
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
    <div className="pt-28" style={{ background: BG }}>
      <section className="py-20 px-5 sm:px-8">
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Left */}
          <div>
            <div ref={title.ref} style={title.style}>
              <p style={{ fontSize: 11, fontWeight: 700, color: 'rgba(40,85,112,0.55)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 16 }}>Kontakt</p>
              <h1 style={{ fontSize: 'clamp(32px,5vw,46px)', fontWeight: 700, letterSpacing: '-0.03em', color: '#1a2e3d', marginBottom: 18, lineHeight: 1.15 }}>
                Začněme společně
              </h1>
              <p style={{ fontSize: 17, color: '#6b6560', lineHeight: 1.65, marginBottom: 36 }}>
                Napište nám, co podnikáte. My se postaráme o zbytek. Odpovídáme do 2 hodin v pracovní dny.
              </p>
            </div>

            <div className="space-y-5">
              {[
                {
                  icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={ACCENT} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 10.63 19.79 19.79 0 0 1 1.61 2a2 2 0 0 1 1.98-2.18h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 7.91a16 16 0 0 0 6.06 6.06l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" /></svg>,
                  label: 'Telefon', value: '+420 606 027 802',
                },
                {
                  icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={ACCENT} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>,
                  label: 'E-mail', value: 'info@website-agent.cz',
                },
                {
                  icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={ACCENT} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>,
                  label: 'Reakce', value: 'Do 2 hodin v pracovní dny',
                },
              ].map((item) => (
                <div key={item.label} className="flex items-start gap-4">
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(40,85,112,0.07)', border: '1px solid rgba(40,85,112,0.13)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    {item.icon}
                  </div>
                  <div>
                    <p style={{ fontSize: 11, color: '#a8a4a0', fontWeight: 600, marginBottom: 2 }}>{item.label}</p>
                    <p style={{ color: '#1a2e3d', fontWeight: 500, fontSize: 14 }}>{item.value}</p>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: 36, padding: 20, borderRadius: 16, background: 'rgba(40,85,112,0.05)', border: '1px solid rgba(40,85,112,0.12)' }}>
              <div className="flex items-center gap-3 mb-2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={ACCENT} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                <p style={{ color: ACCENT, fontWeight: 600, fontSize: 14 }}>Platíte až po schválení</p>
              </div>
              <p style={{ color: '#6b6560', fontSize: 12, lineHeight: 1.65 }}>Žádná záloha. Nejdřív uvidíte hotový web, teprve pak se rozhodnete. Pokud se vám výsledek nebude líbit, zaplatíte 0 Kč.</p>
            </div>
          </div>

          {/* Form */}
          <div ref={form.ref} style={form.style}>
            {state === 'success' ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-20">
                <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(40,85,112,0.08)', border: '1.5px solid rgba(40,85,112,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={ACCENT} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                </div>
                <h2 style={{ fontSize: 24, fontWeight: 700, color: '#1a2e3d', marginBottom: 10 }}>Zpráva odeslána!</h2>
                <p style={{ color: '#6b6560', lineHeight: 1.65, maxWidth: 280 }}>Ozveme se vám do 2 hodin. Těšíme se na spolupráci.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ background: '#fff', border: '1px solid #e3ded7', borderRadius: 18, padding: 32, display: 'flex', flexDirection: 'column', gap: 18 }}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#6b6560', marginBottom: 6 }}>Vaše jméno *</label>
                    <input required value={fields.name} onChange={(e) => setField('name', e.target.value)}
                      style={INPUT} placeholder="Jan Novák" onFocus={onFocus} onBlur={onBlur} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#6b6560', marginBottom: 6 }}>Telefon</label>
                    <input value={fields.phone} onChange={(e) => setField('phone', e.target.value)}
                      style={INPUT} placeholder="+420 777 888 999" onFocus={onFocus} onBlur={onBlur} />
                  </div>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#6b6560', marginBottom: 6 }}>E-mail *</label>
                  <input required type="email" value={fields.email} onChange={(e) => setField('email', e.target.value)}
                    style={INPUT} placeholder="jan@mafirma.cz" onFocus={onFocus} onBlur={onBlur} />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#6b6560', marginBottom: 6 }}>Čím se zabýváte?</label>
                    <input value={fields.obor} onChange={(e) => setField('obor', e.target.value)}
                      style={INPUT} placeholder="Instalatér, kavárna, advokát..." onFocus={onFocus} onBlur={onBlur} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#6b6560', marginBottom: 6 }}>Město</label>
                    <input value={fields.city} onChange={(e) => setField('city', e.target.value)}
                      style={INPUT} placeholder="Praha, Brno, Ostrava..." onFocus={onFocus} onBlur={onBlur} />
                  </div>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#6b6560', marginBottom: 6 }}>Styl webu</label>
                  <select value={fields.website_style} onChange={(e) => setField('website_style', e.target.value)}
                    style={{ ...INPUT, appearance: 'none', backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'12\' height=\'12\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%236b6560\' stroke-width=\'2\'%3E%3Cpolyline points=\'6 9 12 15 18 9\'/%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 14px center', paddingRight: 36 }}>
                    <option value="modern-minimal">Moderní minimál</option>
                    <option value="bold-colorful">Výrazný & Barevný</option>
                    <option value="professional-corporate">Korporátní</option>
                    <option value="creative-agency">Kreativní agentura</option>
                    <option value="restaurant-food">Restaurace / Jídlo</option>
                    <option value="ecommerce">E-commerce</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#6b6560', marginBottom: 6 }}>Zpráva (volitelné)</label>
                  <textarea value={fields.message} onChange={(e) => setField('message', e.target.value)}
                    rows={4} style={{ ...INPUT, resize: 'none' }}
                    placeholder="Co od webu očekáváte? Máte konkrétní představu o stylu?"
                    onFocus={onFocus as React.FocusEventHandler<HTMLTextAreaElement>}
                    onBlur={onBlur as React.FocusEventHandler<HTMLTextAreaElement>} />
                </div>
                {state === 'error' && (
                  <p style={{ color: '#c0392b', fontSize: 12 }}>Něco se nepovedlo. Zkuste to prosím znovu nebo nám napište přímo na e-mail.</p>
                )}
                <button type="submit" disabled={state === 'sending'} style={{
                  width: '100%', background: ACCENT, color: '#fff', fontWeight: 700,
                  padding: '14px', borderRadius: 12, fontSize: 14, border: 'none',
                  cursor: state === 'sending' ? 'not-allowed' : 'pointer', opacity: state === 'sending' ? 0.65 : 1,
                  transition: 'background 0.15s, transform 0.15s',
                }}
                  onMouseEnter={e => { if (state !== 'sending') e.currentTarget.style.background = '#1a3446'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = ACCENT; }}>
                  {state === 'sending' ? 'Odesílám...' : 'Odeslat poptávku →'}
                </button>
                <p style={{ fontSize: 12, color: '#cbcac7', textAlign: 'center' }}>Odpovídáme do 2 hodin · Žádný spam · Bez závazku</p>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
