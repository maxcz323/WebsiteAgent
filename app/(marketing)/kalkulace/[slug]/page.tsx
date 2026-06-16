'use client';

import { use, useState } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

type Addon = { id: string; name: string; desc: string; price: number };

type ServiceDef = {
  title: string;
  subtitle: string;
  color: string;
  colorBg: string;
  basePrice: number;
  isMonthly?: boolean;
  time: string;
  baseFeatures: string[];
  addons: Addon[];
  icon: string;
};

const SERVICES: Record<string, ServiceDef> = {
  'landing-page': {
    title: 'Landing page',
    subtitle: 'Jednostránkový web zaměřený na konverzi',
    color: '#2563EB',
    colorBg: '#eff6ff',
    basePrice: 9900,
    time: '24–48 hodin',
    icon: '🖥',
    baseFeatures: [
      'Responzivní design (mobil, tablet, desktop)',
      'Hero sekce s CTA tlačítkem',
      'Popis služeb a výhod',
      'Reference a hodnocení zákazníků',
      'Kontaktní formulář',
      'Základní SEO optimalizace',
      'Rychlost nad 90/100 v Google PageSpeed',
    ],
    addons: [
      { id: 'gallery', name: 'Fotogalerie', desc: 'Profesionální galerie fotek vašich prací nebo realizací', price: 1500 },
      { id: 'blog', name: 'Blog / aktuality', desc: 'Sekce pro pravidelné příspěvky, novinky a aktuality', price: 2500 },
      { id: 'booking', name: 'Rezervační systém', desc: 'Online rezervace termínů přímo z webu bez nutnosti telefonovat', price: 4000 },
      { id: 'multilang', name: 'Vícejazyčná verze', desc: 'Web dostupný v češtině a angličtině (nebo jiném jazyce)', price: 3000 },
      { id: 'analytics', name: 'Pokročilá analytika', desc: 'Google Analytics 4 + heatmapy chování a záznam klikání', price: 1500 },
      { id: 'chat', name: 'Live chat widget', desc: 'Chat pro přímou komunikaci s návštěvníky webu v reálném čase', price: 1000 },
    ],
  },
  'firemni-web': {
    title: 'Firemní web',
    subtitle: 'Kompletní prezentace vaší firmy online',
    color: '#7c3aed',
    colorBg: '#f5f3ff',
    basePrice: 14900,
    time: '48–72 hodin',
    icon: '🏢',
    baseFeatures: [
      '3–5 samostatných stránek',
      'Galerie realizací a projektů',
      'Stránka O nás s týmem',
      'Blog / aktuality',
      'Více kontaktních formulářů',
      'Pokročilá SEO optimalizace',
      'Google Analytics integrace',
      'Propojení se sociálními sítěmi',
    ],
    addons: [
      { id: 'extrapages', name: 'Extra stránky (3 navíc)', desc: 'Rozšíření webu o 3 další podstránky dle vašich potřeb', price: 4500 },
      { id: 'booking', name: 'Rezervační systém', desc: 'Online rezervace termínů přímo z webu bez nutnosti telefonovat', price: 4000 },
      { id: 'newsletter', name: 'Newsletter integrace', desc: 'Sběr emailových kontaktů a napojení na newsletter platformu', price: 2000 },
      { id: 'multilang', name: 'Vícejazyčná verze', desc: 'Web v češtině a angličtině (nebo jiném jazyce)', price: 5000 },
      { id: 'seo', name: 'Pokročilé SEO + klíčová slova', desc: 'Hloubková optimalizace pro vyhledávače, analýza klíčových slov', price: 3000 },
      { id: 'popup', name: 'Lead capture popupy', desc: 'Inteligentní popupy pro zachycení návštěvníků a sběr kontaktů', price: 2000 },
    ],
  },
  'ecommerce': {
    title: 'E-commerce',
    subtitle: 'Plnohodnotný online obchod',
    color: '#059669',
    colorBg: '#ecfdf5',
    basePrice: 24900,
    time: '5–7 dní',
    icon: '🛒',
    baseFeatures: [
      'Neomezený počet produktů',
      'Košík a pokladna',
      'Platební brána (karta, bankovní převod)',
      'Správa objednávek',
      'Automatické emaily zákazníkům',
      'Slevové kupóny',
      'Mobilní optimalizace',
      'Integrace dopravců',
    ],
    addons: [
      { id: 'premium', name: 'Prémiový design na míru', desc: 'Unikátní vizuální identita obchodu přizpůsobená vaší značce', price: 5000 },
      { id: 'loyalty', name: 'Věrnostní program', desc: 'Body za nákupy, odměny a slevy pro stálé zákazníky', price: 4000 },
      { id: 'digital', name: 'Digitální produkty / kurzy', desc: 'Prodej PDF, videí, kurzů nebo jiného digitálního obsahu', price: 4500 },
      { id: 'stock', name: 'Napojení na skladový systém', desc: 'Automatická synchronizace s externím skladovým nebo ERP systémem', price: 6000 },
      { id: 'analytics', name: 'Pokročilá e-commerce analytika', desc: 'Konverzní funnel, heatmapy a přehled o chování zákazníků', price: 3000 },
      { id: 'multilang', name: 'Vícejazyčný obchod + měny', desc: 'Prodej v několika jazycích a různých měnách', price: 6000 },
    ],
  },
  'sprava': {
    title: 'Správa a údržba',
    subtitle: 'Pravidelná péče o váš web',
    color: '#d97706',
    colorBg: '#fffbeb',
    basePrice: 990,
    isMonthly: true,
    time: 'Průběžně každý měsíc',
    icon: '⚙',
    baseFeatures: [
      'Měsíční zálohy webu',
      'Aktualizace systémů a pluginů',
      'Monitorování dostupnosti 24/7',
      'Měsíční reporty návštěvnosti',
      'Drobné textové úpravy zdarma',
      'Technická podpora do 24 hodin',
      'SSL certifikát',
      'Bezpečnostní skenování',
    ],
    addons: [
      { id: 'content', name: 'Správa obsahu webu', desc: 'Přidávání a úprava textů, fotek, produktů a novinek', price: 500 },
      { id: 'seo', name: 'SEO monitoring', desc: 'Měsíční sledování pozic ve vyhledávačích a doporučení pro zlepšení', price: 700 },
      { id: 'ads', name: 'Google Ads správa', desc: 'Tvorba, správa a průběžná optimalizace Google reklamních kampaní', price: 2000 },
      { id: 'social', name: 'Sociální sítě', desc: '4 příspěvky týdně na Instagram a Facebook, správa komentářů', price: 3000 },
    ],
  },
};

function formatPrice(p: number) {
  return p.toLocaleString('cs-CZ') + ' Kč';
}

export default function KalkulacePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const service = SERVICES[slug];
  if (!service) notFound();

  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [pozadavky, setPozadavky] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [submitState, setSubmitState] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  function toggle(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  const selectedAddons = service.addons.filter((a) => selected.has(a.id));
  const addonsTotal = selectedAddons.reduce((sum, a) => sum + a.price, 0);
  const total = service.basePrice + addonsTotal;
  const suffix = service.isMonthly ? '/měs' : '';

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitState('sending');
    try {
      const res = await fetch('/api/kalkulace', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formName,
          email: formEmail,
          phone: formPhone,
          serviceSlug: slug,
          serviceTitle: service.title,
          basePrice: service.basePrice,
          addons: selectedAddons.map((a) => ({ id: a.id, name: a.name, price: a.price })),
          totalPrice: total,
          specialRequirements: pozadavky.trim() || null,
        }),
      });
      if (!res.ok) throw new Error();
      setSubmitState('success');
    } catch {
      setSubmitState('error');
    }
  }

  return (
    <div className="pt-28 pb-20">
      {/* Breadcrumb */}
      <div className="max-w-6xl mx-auto px-5 sm:px-8 mb-8">
        <div className="flex items-center gap-2 text-sm text-slate-400">
          <Link href="/sluzby" className="hover:text-slate-600 transition-colors">Služby</Link>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>
          <span className="text-slate-700 font-medium">{service.title}</span>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>
          <span className="text-slate-500">Kalkulace</span>
        </div>
      </div>

      {/* Hero */}
      <div className="max-w-6xl mx-auto px-5 sm:px-8 mb-12">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex-1">
            <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: service.color }}>
              Kalkulace ceny
            </p>
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-2" style={{ fontFamily: 'var(--font-display)' }}>
              {service.title}
            </h1>
            <p className="text-slate-500">{service.subtitle}</p>
          </div>
          <div className="rounded-2xl px-6 py-4 text-center border-2" style={{ borderColor: service.color, background: service.colorBg }}>
            <p className="text-xs font-semibold text-slate-400 mb-1 uppercase tracking-wide">Základní cena</p>
            <p className="text-2xl font-bold" style={{ color: service.color }}>
              od {formatPrice(service.basePrice)}{suffix}
            </p>
            <p className="text-xs text-slate-400 mt-1">Hotovo za: {service.time}</p>
          </div>
        </div>
      </div>

      {/* Main grid */}
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8 items-start">

          {/* Left column */}
          <div className="space-y-8">

            {/* Base features */}
            <div className="bg-white border border-slate-100 rounded-2xl p-7 shadow-sm">
              <h2 className="text-base font-bold text-slate-900 mb-5 flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: service.colorBg }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={service.color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                </div>
                Co je zahrnuto v základní ceně
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {service.baseFeatures.map((f) => (
                  <div key={f} className="flex items-start gap-2.5 text-sm text-slate-600">
                    <svg className="shrink-0 mt-0.5" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={service.color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                    {f}
                  </div>
                ))}
              </div>
            </div>

            {/* Addons */}
            <div className="bg-white border border-slate-100 rounded-2xl p-7 shadow-sm">
              <h2 className="text-base font-bold text-slate-900 mb-1 flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-slate-50">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                </div>
                Přizpůsobte si web
              </h2>
              <p className="text-sm text-slate-400 mb-6 ml-9">Zaškrtněte vše co chcete mít navíc</p>

              <div className="space-y-3">
                {service.addons.map((a) => {
                  const isOn = selected.has(a.id);
                  return (
                    <button
                      key={a.id}
                      onClick={() => toggle(a.id)}
                      className={`w-full text-left flex items-start gap-4 p-4 rounded-xl border-2 transition-all duration-150 ${
                        isOn
                          ? 'border-current bg-opacity-5'
                          : 'border-slate-100 bg-slate-50/50 hover:border-slate-200 hover:bg-white'
                      }`}
                      style={isOn ? { borderColor: service.color, background: service.colorBg } : {}}
                    >
                      {/* Checkbox visual */}
                      <div
                        className="shrink-0 mt-0.5 w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all duration-150"
                        style={isOn ? { borderColor: service.color, background: service.color } : { borderColor: '#cbd5e1' }}
                      >
                        {isOn && (
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-3">
                          <span className={`text-sm font-semibold ${isOn ? 'text-slate-900' : 'text-slate-700'}`}>{a.name}</span>
                          <span className="text-sm font-bold shrink-0" style={{ color: service.color }}>
                            +{formatPrice(a.price)}{service.isMonthly ? '/měs' : ''}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">{a.desc}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Special requirements */}
            <div className="bg-white border border-slate-100 rounded-2xl p-7 shadow-sm">
              <h2 className="text-base font-bold text-slate-900 mb-1 flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-slate-50">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                </div>
                Speciální požadavky
              </h2>
              <p className="text-sm text-slate-400 mb-4 ml-9">Napište vše co jste výše nenašli, nebo co je pro vás důležité</p>
              <textarea
                value={pozadavky}
                onChange={(e) => setPozadavky(e.target.value)}
                rows={5}
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 placeholder-slate-300 focus:outline-none focus:ring-2 focus:border-transparent transition-all resize-none"
                style={{ ['--tw-ring-color' as string]: service.color }}
                placeholder="Např. specifický design, integrace s vaším existujícím systémem, konkrétní funkce, jazyk webu, termín spuštění..."
              />
            </div>
          </div>

          {/* Right sticky column */}
          <div className="lg:sticky lg:top-24">
            <div className="bg-white border-2 border-slate-100 rounded-2xl p-6 shadow-sm">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-4">Souhrn ceny</p>

              {/* Base price row */}
              <div className="flex items-center justify-between py-3 border-b border-slate-100">
                <span className="text-sm text-slate-600">Základní balíček</span>
                <span className="text-sm font-semibold text-slate-900">{formatPrice(service.basePrice)}{suffix}</span>
              </div>

              {/* Selected addons */}
              {selectedAddons.length > 0 && (
                <div className="py-3 border-b border-slate-100 space-y-2">
                  {selectedAddons.map((a) => (
                    <div key={a.id} className="flex items-center justify-between">
                      <span className="text-sm text-slate-500 flex items-center gap-1.5">
                        <span className="text-green-500 text-xs">+</span>
                        {a.name}
                      </span>
                      <span className="text-sm font-medium text-slate-700">+{formatPrice(a.price)}{suffix}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Total */}
              <div className="flex items-center justify-between pt-4 mb-6">
                <div>
                  <p className="text-xs text-slate-400 mb-0.5">Celková odhadovaná cena</p>
                  <p className="text-2xl font-bold text-slate-900" style={{ fontFamily: 'var(--font-display)' }}>
                    {formatPrice(total)}{suffix}
                  </p>
                </div>
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: service.colorBg }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={service.color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>
                </div>
              </div>

              {/* Empty state prompt */}
              {selectedAddons.length === 0 && (
                <p className="text-xs text-slate-400 text-center -mt-2 mb-4 pb-4 border-b border-slate-50">
                  Zaškrtnutím doplňků vlevo cena poroste
                </p>
              )}

              <button
                onClick={() => setShowForm(true)}
                className="w-full text-white font-semibold py-3.5 px-5 rounded-xl text-sm transition-all duration-200 hover:-translate-y-px hover:shadow-xl flex items-center justify-center gap-2"
                style={{ background: service.color, boxShadow: `0 4px 20px ${service.color}30` }}
              >
                Odeslat poptávku →
              </button>
              <p className="text-xs text-slate-400 text-center mt-3">Cena je orientační · Finální nabídka po konzultaci</p>

              {/* Trust badges */}
              <div className="mt-5 pt-5 border-t border-slate-100 space-y-2.5">
                {[
                  'Platíte až po schválení',
                  'Žádná záloha předem',
                  'Odpovídáme do 2 hodin',
                ].map((t) => (
                  <div key={t} className="flex items-center gap-2 text-xs text-slate-500">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                    {t}
                  </div>
                ))}
              </div>
            </div>

            {/* Back link */}
            <Link
              href="/sluzby"
              className="mt-4 flex items-center justify-center gap-1.5 text-sm text-slate-400 hover:text-slate-600 transition-colors"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
              Zpět na přehled služeb
            </Link>
          </div>
        </div>
      </div>

      {/* Contact modal */}
      {showForm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ animation: 'backdropIn 0.25s ease-out forwards', background: 'rgba(15,22,41,0.72)', backdropFilter: 'blur(5px)' }}
          onClick={(e) => { if (e.target === e.currentTarget && submitState !== 'sending') setShowForm(false); }}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-7 relative"
            style={{ animation: 'cardIn 0.38s cubic-bezier(0.16,1,0.3,1) forwards' }}
          >
            {submitState !== 'success' && (
              <button
                onClick={() => { if (submitState !== 'sending') { setShowForm(false); setSubmitState('idle'); } }}
                className="absolute top-4 right-4 w-7 h-7 flex items-center justify-center rounded-full text-slate-300 hover:text-slate-600 hover:bg-slate-100 transition-all text-sm leading-none"
              >
                ✕
              </button>
            )}

            {submitState === 'success' ? (
              <div className="text-center py-8">
                {/* Animated checkmark */}
                <div className="flex justify-center mb-6" style={{ animation: 'popIn 0.55s cubic-bezier(0.175,0.885,0.32,1.275) forwards' }}>
                  <svg width="80" height="80" viewBox="0 0 52 52" fill="none">
                    {/* Background fill */}
                    <circle cx="26" cy="26" r="24" fill="#dcfce7" />
                    {/* Circle stroke — draws itself */}
                    <circle
                      cx="26" cy="26" r="24"
                      stroke="#059669" strokeWidth="2"
                      strokeDasharray="151" strokeDashoffset="151"
                      strokeLinecap="round"
                      style={{ animation: 'circleDrawIn 0.5s ease-out forwards' }}
                    />
                    {/* Checkmark — draws itself after circle */}
                    <polyline
                      points="14,27 22,35 38,19"
                      stroke="#059669" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round"
                      strokeDasharray="40" strokeDashoffset="40"
                      style={{ animation: 'checkDrawIn 0.38s cubic-bezier(0.22,1,0.36,1) 0.42s forwards' }}
                    />
                  </svg>
                </div>

                <h3
                  className="text-xl font-bold text-slate-900 mb-2"
                  style={{ opacity: 0, animation: 'fadeSlideUp 0.4s ease-out 0.6s forwards' }}
                >
                  Poptávka odeslána!
                </h3>
                <p
                  className="text-slate-500 text-sm leading-relaxed"
                  style={{ opacity: 0, animation: 'fadeSlideUp 0.4s ease-out 0.75s forwards' }}
                >
                  Ozveme se vám do 2 hodin.{' '}
                  <span className="font-medium text-slate-700">Těšíme se na spolupráci.</span>
                </p>
              </div>
            ) : (
              <>
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-slate-900 mb-1">Odeslat poptávku</h3>
                  <p className="text-sm text-slate-400">{service.title} · <span className="font-semibold" style={{ color: service.color }}>{formatPrice(total)}{suffix}</span></p>
                  {selectedAddons.length > 0 && (
                    <div className="mt-3 p-3 rounded-xl text-xs space-y-1" style={{ background: service.colorBg }}>
                      <p className="font-semibold text-slate-500 mb-1.5">Vybrané doplňky:</p>
                      {selectedAddons.map((a) => (
                        <div key={a.id} className="flex justify-between text-slate-600">
                          <span>{a.name}</span>
                          <span className="font-medium">+{formatPrice(a.price)}{suffix}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1.5">Vaše jméno *</label>
                    <input
                      required
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                      placeholder="Jan Novák"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1.5">E-mail *</label>
                    <input
                      required
                      type="email"
                      value={formEmail}
                      onChange={(e) => setFormEmail(e.target.value)}
                      className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                      placeholder="jan@mafirma.cz"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1.5">Telefon</label>
                    <input
                      value={formPhone}
                      onChange={(e) => setFormPhone(e.target.value)}
                      className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                      placeholder="+420 777 888 999"
                    />
                  </div>
                  {submitState === 'error' && (
                    <p className="text-red-500 text-xs">Něco se nepovedlo. Zkuste znovu nebo nás kontaktujte přímo.</p>
                  )}
                  <button
                    type="submit"
                    disabled={submitState === 'sending'}
                    className="w-full text-white font-semibold py-3.5 rounded-xl text-sm transition-all duration-200 disabled:opacity-70 flex items-center justify-center gap-2"
                    style={{ background: service.color }}
                  >
                    {submitState === 'sending' ? (
                      <>
                        <svg style={{ animation: 'spinAnim 0.8s linear infinite' }} width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><path d="M12 2a10 10 0 0 1 10 10" /></svg>
                        Odesílám…
                      </>
                    ) : 'Odeslat poptávku →'}
                  </button>
                  <p className="text-xs text-slate-400 text-center">Odpovídáme do 2 hodin · Bez závazku · Platíte až po schválení</p>
                </form>
              </>
            )}
          </div>
        </div>
      )}

      <style>{`
        @keyframes backdropIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes cardIn {
          from { opacity: 0; transform: translateY(28px) scale(0.95); }
          to   { opacity: 1; transform: translateY(0)    scale(1);    }
        }
        @keyframes popIn {
          0%   { opacity: 0; transform: scale(0); }
          60%  { opacity: 1; transform: scale(1.18); }
          80%  { transform: scale(0.94); }
          100% { opacity: 1; transform: scale(1); }
        }
        @keyframes circleDrawIn {
          from { stroke-dashoffset: 151; }
          to   { stroke-dashoffset: 0; }
        }
        @keyframes checkDrawIn {
          from { stroke-dashoffset: 40; }
          to   { stroke-dashoffset: 0; }
        }
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes spinAnim {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
