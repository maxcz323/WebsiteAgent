'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const NICHE_GROUPS = [
  { group: 'Řemesla & Stavba', items: ['Instalatér', 'Elektrikář', 'Vzduchotechnika', 'Pokrývač', 'Malíř & Lakýrník', 'Zedník', 'Truhlář', 'Sklenář', 'Klempíř', 'Podlahář', 'Zahradník', 'Úklidová služba'] },
  { group: 'Zdraví & Wellness', items: ['Zubař', 'Lékař (všeobecný)', 'Fyzioterapeut', 'Chiropraktik', 'Osobní trenér', 'Nutriční poradce', 'Masér', 'Psycholog', 'Veterinář'] },
  { group: 'Jídlo & Pohostinství', items: ['Restaurace', 'Pekárna', 'Kavárna', 'Cukrárna', 'Catering', 'Food truck', 'Vinárna', 'Pivovar'] },
  { group: 'Krása & Péče', items: ['Kadeřnictví', 'Holič', 'Nehtové studio', 'Kosmetický salon', 'Tetovací studio', 'Solárium'] },
  { group: 'Profesní služby', items: ['Advokát', 'Účetnictví', 'Daňový poradce', 'Pojišťovací agent', 'Realitní makléř', 'Finanční poradce', 'Překladatel'] },
  { group: 'Kreativa & Média', items: ['Fotograf', 'Kameraman', 'Grafický designér', 'Webový designér', 'Copywriter', 'Hudební studio', 'Tiskárna'] },
  { group: 'Vzdělávání & Kurzy', items: ['Jazyková škola', 'Doučování', 'Autoškola', 'Hudební škola', 'Taneční škola', 'Sportovní klub'] },
  { group: 'Ostatní', items: ['E-shop', 'Přepravní služba', 'Půjčovna', 'Servis automobilů', 'Jiné'] },
];

const STYLES = [
  { value: 'modern-minimal', label: 'Moderní minimál', desc: 'Čistý, bílý prostor, jeden akcentní prvek', emoji: '⬜' },
  { value: 'bold-colorful', label: 'Výrazný & Barevný', desc: 'Živé přechody, energický, dynamické karty', emoji: '🎨' },
  { value: 'professional-corporate', label: 'Korporátní', desc: 'Námořnická/šedá, formální, důvěryhodný', emoji: '🏢' },
  { value: 'creative-agency', label: 'Kreativní agentura', desc: 'Umělecká typografie, asymetrické rozvržení', emoji: '✨' },
  { value: 'restaurant-food', label: 'Restaurace / Jídlo', desc: 'Teplé tóny, velký hero, menu sekce', emoji: '🍽️' },
  { value: 'ecommerce', label: 'E-commerce', desc: 'Produktová mřížka, promo bannery, CTA', emoji: '🛒' },
  { value: 'dark-luxury', label: 'Tmavý & Luxusní', desc: 'Tmavé pozadí, zlaté akcenty, prémiový dojem', emoji: '🖤' },
  { value: 'tech-startup', label: 'Tech / Startup', desc: 'Gradientní hero, glassmorphism, futuristický', emoji: '🚀' },
  { value: 'nature-eco', label: 'Příroda & Eco', desc: 'Zelené tóny, organické tvary, přírodní feel', emoji: '🌿' },
  { value: 'playful-kids', label: 'Hravý / Děti', desc: 'Jasné barvy, zaoblené tvary, veselý styl', emoji: '🎈' },
];

const COLOR_SCHEMES = [
  { value: 'auto', label: 'Automaticky (dle stylu)' },
  { value: 'blue', label: 'Modrá' },
  { value: 'green', label: 'Zelená' },
  { value: 'red', label: 'Červená' },
  { value: 'purple', label: 'Fialová' },
  { value: 'orange', label: 'Oranžová' },
  { value: 'gold', label: 'Zlatá / Žlutá' },
  { value: 'dark', label: 'Tmavá' },
];

export default function NewLeadPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ business_niche: '', city: '', website_style: 'modern-minimal', business_name: '', contact_name: '', contact_email: '', notes: '', color_scheme: 'auto', custom_description: '', deal_value: '' });

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => setForm((prev) => ({ ...prev, [k]: e.target.value }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.business_niche || !form.city) { setError('Obor podnikání a město jsou povinné.'); return; }
    setSaving(true); setError('');
    try {
      const res = await fetch('/api/leads', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
      if (!res.ok) throw new Error(await res.text());
      const lead = await res.json();
      router.push(`/admin/leads/${lead.id}`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Něco se pokazilo');
      setSaving(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Nový lead</h1>
        <p className="text-sm text-gray-500 mt-1">Vyplňte údaje pro generování landing page.</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-5">
        {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg">{error}</div>}
        <div className="card p-5 space-y-4">
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Základní info</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label">Obor podnikání *</label>
              <select className="input" value={form.business_niche} onChange={set('business_niche')} required>
                <option value="">Vyberte obor…</option>
                {NICHE_GROUPS.map((g) => (
                  <optgroup key={g.group} label={g.group}>
                    {g.items.map((n) => <option key={n} value={n}>{n}</option>)}
                  </optgroup>
                ))}
              </select>
            </div>
            <div>
              <label className="label">Město *</label>
              <input className="input" type="text" placeholder="např. Praha" value={form.city} onChange={set('city')} required />
            </div>
          </div>
        </div>
        <div className="card p-5 space-y-4">
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Styl webu</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {STYLES.map((s) => (
              <label key={s.value} className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${form.website_style === s.value ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300 bg-white'}`}>
                <input type="radio" name="website_style" value={s.value} checked={form.website_style === s.value} onChange={set('website_style')} className="mt-0.5 shrink-0" />
                <div><p className="text-sm font-medium text-gray-900">{s.emoji} {s.label}</p><p className="text-xs text-gray-500">{s.desc}</p></div>
              </label>
            ))}
          </div>
          <div>
            <label className="label">Barevné schéma</label>
            <select className="input" value={form.color_scheme} onChange={set('color_scheme')}>
              {COLOR_SCHEMES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
            </select>
          </div>
        </div>
        <div className="card p-5 space-y-4">
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Vlastní instrukce pro AI</h2>
          <div>
            <label className="label">Popište web</label>
            <textarea className="input resize-none" rows={5} placeholder="Popište co chcete na webu…" value={form.custom_description} onChange={set('custom_description')} />
          </div>
        </div>
        <div className="card p-5 space-y-4">
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Kontaktní údaje</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div><label className="label">Název firmy</label><input className="input" type="text" placeholder="např. Novák Instalace s.r.o." value={form.business_name} onChange={set('business_name')} /></div>
            <div><label className="label">Kontaktní osoba</label><input className="input" type="text" placeholder="např. Jan Novák" value={form.contact_name} onChange={set('contact_name')} /></div>
            <div className="sm:col-span-2"><label className="label">Kontaktní email</label><input className="input" type="email" placeholder="jan@example.cz" value={form.contact_email} onChange={set('contact_email')} /></div>
            <div className="sm:col-span-2"><label className="label">Interní poznámky</label><textarea className="input resize-none" rows={2} placeholder="Interní poznámky…" value={form.notes} onChange={set('notes')} /></div>
            <div>
              <label className="label">Hodnota dealu (Kč)</label>
              <input className="input" type="number" min="0" step="100" placeholder="např. 15000" value={form.deal_value} onChange={set('deal_value')} />
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-3 pb-8">
          <button type="button" onClick={() => router.back()} className="btn-secondary">Zrušit</button>
          <button type="submit" className="btn-primary" disabled={saving}>{saving ? 'Ukládám…' : 'Vytvořit lead'}</button>
        </div>
      </form>
    </div>
  );
}
