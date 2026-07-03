'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Lead, GeneratedPage, EmailDraft, LeadActivity } from '@/types';
import { StatusBadge } from '@/components/StatusBadge';
import { supabaseBrowser } from '@/lib/supabase-browser';

const STYLE_LABELS: Record<string, string> = {
  'modern-minimal': 'Moderní minimál',
  'bold-colorful': 'Výrazný & Barevný',
  'professional-corporate': 'Korporátní',
  'creative-agency': 'Kreativní agentura',
  'restaurant-food': 'Restaurace / Jídlo',
  ecommerce: 'E-commerce',
};

type KalkulaceData = {
  source: 'kalkulace';
  serviceSlug: string;
  serviceTitle: string;
  basePrice: number;
  addons: { id: string; name: string; price: number }[];
  totalPrice: number;
  phone: string | null;
  specialRequirements: string | null;
};

function parseKalkulace(notes: string | null): KalkulaceData | null {
  if (!notes?.startsWith('__KALKULACE__')) return null;
  try { return JSON.parse(notes.slice('__KALKULACE__'.length)); } catch { return null; }
}

function formatCzkAdmin(n: number) {
  return n.toLocaleString('cs-CZ') + ' Kč';
}

const GEN_STEPS = [
  { label: 'Příprava dat', endSec: 3, endPct: 3 },
  { label: 'Vyhledávání informací o firmě', endSec: 20, endPct: 15 },
  { label: 'Analýza výsledků', endSec: 30, endPct: 25 },
  { label: 'Generování struktury webu', endSec: 55, endPct: 45 },
  { label: 'Vytváření obsahu', endSec: 90, endPct: 70 },
  { label: 'Finalizace a stylování', endSec: 110, endPct: 90 },
  { label: 'Ukládání', endSec: 120, endPct: 99 },
];
const TOTAL_ESTIMATED_SEC = 120;

export default function LeadDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [lead, setLead] = useState<Lead | null>(null);
  const [page, setPage] = useState<GeneratedPage | null>(null);
  const [draft, setDraft] = useState<EmailDraft | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState('');
  const [error, setError] = useState('');
  const [dealValueInput, setDealValueInput] = useState('');
  const [savingDeal, setSavingDeal] = useState(false);
  const [gmailConnected, setGmailConnected] = useState(false);
  const [previewTab, setPreviewTab] = useState<'info' | 'preview' | 'activities'>('info');
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  const [activities, setActivities] = useState<LeadActivity[]>([]);
  const [actType, setActType] = useState<'call' | 'email' | 'meeting' | 'other'>('call');
  const [actDate, setActDate] = useState('');
  const [actNotes, setActNotes] = useState('');
  const [savingAct, setSavingAct] = useState(false);

  const [genProgress, setGenProgress] = useState(0);
  const [genStepLabel, setGenStepLabel] = useState('');
  const [genStepIndex, setGenStepIndex] = useState(0);
  const [genTimeLeft, setGenTimeLeft] = useState(TOTAL_ESTIMATED_SEC);
  const genStartRef = useRef<number | null>(null);
  const genIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchActivities = useCallback(async () => {
    const res = await fetch(`/api/lead-activities/${id}`);
    setActivities(await res.json());
  }, [id]);

  const fetchData = useCallback(async () => {
    const [leadRes, gmailRes] = await Promise.all([
      fetch(`/api/leads/${id}`),
      fetch('/api/gmail/status'),
    ]);
    const { lead, page, draft } = await leadRes.json();
    const { connected } = await gmailRes.json();
    setLead(lead);
    setPage(page ?? null);
    setDraft(draft ?? null);
    setGmailConnected(connected);
    setLoading(false);
    setDealValueInput(lead?.deal_value != null ? String(lead.deal_value) : '');
  }, [id]);

  useEffect(() => {
    fetchData();
    fetchActivities();
    supabaseBrowser().auth.getUser().then(({ data }) => setCurrentUserId(data.user?.id ?? null));
  }, [fetchData, fetchActivities]);

  useEffect(() => {
    if (actionLoading === 'generate') {
      genStartRef.current = Date.now();
      setGenProgress(0);
      setGenStepIndex(0);
      setGenStepLabel(GEN_STEPS[0].label);
      setGenTimeLeft(TOTAL_ESTIMATED_SEC);

      genIntervalRef.current = setInterval(() => {
        const elapsed = (Date.now() - genStartRef.current!) / 1000;
        const stepIdx = GEN_STEPS.findIndex((s) => elapsed < s.endSec);
        const activeIdx = stepIdx === -1 ? GEN_STEPS.length - 1 : stepIdx;
        const step = GEN_STEPS[activeIdx];
        const prevEnd = activeIdx === 0 ? 0 : GEN_STEPS[activeIdx - 1].endSec;
        const prevPct = activeIdx === 0 ? 0 : GEN_STEPS[activeIdx - 1].endPct;
        const fraction = Math.min(1, (elapsed - prevEnd) / (step.endSec - prevEnd));
        const pct = prevPct + fraction * (step.endPct - prevPct);
        setGenProgress(Math.min(99, Math.round(pct)));
        setGenStepIndex(activeIdx);
        setGenStepLabel(step.label);
        setGenTimeLeft(Math.max(0, Math.round(TOTAL_ESTIMATED_SEC - elapsed)));
      }, 200);
    } else {
      if (genIntervalRef.current) {
        clearInterval(genIntervalRef.current);
        genIntervalRef.current = null;
      }
      if (actionLoading === '') setGenProgress(0);
    }
    return () => { if (genIntervalRef.current) clearInterval(genIntervalRef.current); };
  }, [actionLoading]);

  async function doAction(action: string, extraBody?: object) {
    setActionLoading(action);
    setError('');
    try {
      let res: Response;
      if (action === 'generate') {
        res = await fetch(`/api/generate/${id}`, { method: 'POST' });
      } else if (action === 'approve') {
        res = await fetch(`/api/leads/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status: 'approved' }) });
      } else if (action === 'reject') {
        res = await fetch(`/api/leads/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status: 'rejected' }) });
      } else if (action === 'claim') {
        res = await fetch(`/api/leads/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ assigned_to: currentUserId }) });
      } else if (action === 'unclaim') {
        res = await fetch(`/api/leads/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ assigned_to: null }) });
      } else if (action === 'draft') {
        res = await fetch(`/api/gmail/draft/${id}`, { method: 'POST', ...extraBody });
      } else if (action === 'delete') {
        res = await fetch(`/api/leads/${id}`, { method: 'DELETE' });
        if (res.ok) { router.push('/dashboard'); return; }
        throw new Error(await res.text());
      } else {
        return;
      }

      if (!res!.ok) throw new Error(await res!.text());
      if (action === 'generate') {
        setGenProgress(100);
        setGenStepLabel('Hotovo!');
        await new Promise((r) => setTimeout(r, 600));
      }
      await fetchData();
      if (action === 'generate') setPreviewTab('preview');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Action failed');
    } finally {
      setActionLoading('');
    }
  }

  if (loading) {
    return <div className="text-center py-24 text-slate-300 text-sm">Načítání…</div>;
  }

  if (!lead) {
    return (
      <div className="text-center py-24">
        <p className="text-slate-400 mb-4">Lead nenalezen.</p>
        <Link href="/admin/dashboard" className="btn-primary">Zpět na přehled</Link>
      </div>
    );
  }

  async function createActivity(e: React.FormEvent) {
    e.preventDefault();
    if (!actDate) return;
    setSavingAct(true);
    await fetch(`/api/lead-activities/${id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: actType, scheduled_at: new Date(actDate).toISOString(), notes: actNotes || null }),
    });
    setActNotes('');
    await fetchActivities();
    setSavingAct(false);
  }

  async function deleteActivity(activityId: string) {
    await fetch(`/api/lead-activities/${id}/${activityId}`, { method: 'DELETE' });
    await fetchActivities();
  }

  async function saveDealValue() {
    setSavingDeal(true);
    await fetch(`/api/leads/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ deal_value: dealValueInput ? Number(dealValueInput) : null }),
    });
    await fetchData();
    setSavingDeal(false);
  }

  const canGenerate = ['new', 'rejected', 'generating'].includes(lead.status);
  const canApprove = lead.status === 'generated';
  const canReject = ['generated', 'approved'].includes(lead.status);
  const canDraft = lead.status === 'approved' && gmailConnected;
  const isActing = actionLoading !== '';

  return (
    <div className="max-w-5xl mx-auto space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <Link href="/admin/dashboard" className="inline-flex items-center gap-1 text-slate-400 hover:text-slate-600 text-xs font-medium mb-3 transition-colors">
            ← Přehled
          </Link>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
            {lead.business_name || `${lead.business_niche} — ${lead.city}`}
          </h1>
          <div className="flex items-center gap-3 mt-2 flex-wrap">
            <StatusBadge status={lead.status} />
            {parseKalkulace(lead.notes) && (
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200 px-2.5 py-1 rounded-lg">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
                Z webu
              </span>
            )}
            <span className="text-xs text-slate-400">{new Date(lead.created_at).toLocaleString('cs-CZ')}</span>
          </div>
        </div>
        <button
          onClick={() => { if (confirm('Smazat tohoto leada natrvalo?')) doAction('delete'); }}
          className="text-xs font-medium text-red-500 hover:text-red-700 hover:bg-red-50 border border-transparent hover:border-red-200 px-3 py-1.5 rounded-lg transition-all"
          disabled={isActing}
        >
          Smazat
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Assignment + Actions row */}
      <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-3">
        {/* Assignment */}
        <div className="card p-4 flex items-center gap-3 min-w-0">
          <span className="section-title whitespace-nowrap">Zpracovává</span>
          {lead.assigned_to_name ? (
            <>
              <span className="text-sm font-semibold text-blue-700 bg-blue-50 border border-blue-200 px-3 py-1 rounded-lg">
                {lead.assigned_to_name}
              </span>
              {lead.assigned_to === currentUserId && (
                <button onClick={() => doAction('unclaim')} disabled={isActing} className="btn-secondary text-xs py-1">
                  Vzdát se
                </button>
              )}
            </>
          ) : (
            <>
              <span className="text-sm text-slate-300">Nikdo</span>
              <button onClick={() => doAction('claim')} disabled={isActing} className="btn-secondary text-xs py-1">
                Vzít si
              </button>
            </>
          )}
        </div>

        {/* Actions */}
        <div className="card p-4 flex flex-wrap gap-2 items-center">
          <span className="section-title mr-1">Akce</span>

          <button onClick={() => doAction('generate')} disabled={!canGenerate || isActing} className="btn-secondary text-xs">
            {actionLoading === 'generate' ? 'Generuji…' : page ? 'Regenerovat' : 'Vygenerovat web'}
          </button>
          <button onClick={() => doAction('approve')} disabled={!canApprove || isActing} className="btn-success text-xs">
            {actionLoading === 'approve' ? 'Schvaluji…' : 'Schválit'}
          </button>
          <button onClick={() => doAction('reject')} disabled={!canReject || isActing} className="btn-danger text-xs">
            {actionLoading === 'reject' ? 'Zamítám…' : 'Zamítnout'}
          </button>

          {lead.status === 'approved' && !gmailConnected && (
            <a href="/api/gmail/auth" className="btn-secondary text-xs">Připojit Gmail</a>
          )}
          {lead.status === 'draft_created' && (
            <span className="text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-200 px-3 py-1.5 rounded-lg">
              ✓ Gmail draft vytvořen
            </span>
          )}
          {canDraft && (
            <button
              onClick={() => doAction('draft')}
              disabled={isActing || !lead.contact_email}
              className="btn-primary text-xs"
              title={!lead.contact_email ? 'Přidejte kontaktní email' : ''}
            >
              {actionLoading === 'draft' ? 'Vytvářím draft…' : 'Vytvořit Gmail draft'}
            </button>
          )}
          {lead.status === 'approved' && !lead.contact_email && (
            <span className="text-xs text-amber-600">Přidejte kontaktní email pro draft.</span>
          )}
        </div>
      </div>

      {/* Generation progress */}
      {actionLoading === 'generate' && (
        <div className="card p-5 space-y-4 border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-800">
                Generování webu <span className="text-slate-400 font-normal">— krok {genStepIndex + 1} / {GEN_STEPS.length}</span>
              </p>
              <p className="text-xs text-blue-500 mt-0.5 font-medium">{genStepLabel}…</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-slate-400 uppercase tracking-wide">Zbývá</p>
              <p className="text-sm font-mono font-bold text-slate-700">
                {genTimeLeft > 0 ? `~${genTimeLeft}s` : 'Dokončuji…'}
              </p>
            </div>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
            <div
              className="h-2 rounded-full transition-all duration-300"
              style={{
                width: `${genProgress}%`,
                background: genProgress === 100 ? '#10b981' : 'linear-gradient(90deg, #2563EB, #60a5fa)',
              }}
            />
          </div>
          <div className="flex gap-1">
            {GEN_STEPS.map((s, i) => (
              <div
                key={i}
                title={s.label}
                className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                  i < genStepIndex ? 'bg-blue-500' : i === genStepIndex ? 'bg-blue-300' : 'bg-slate-200'
                }`}
              />
            ))}
          </div>
        </div>
      )}

      {/* Tabs */}
      <div>
        <div className="flex gap-0 border-b border-slate-200 mb-5">
          {([
            { key: 'info', label: 'Informace' },
            { key: 'preview', label: 'Náhled webu' },
            { key: 'activities', label: `Aktivity${activities.length > 0 ? ` (${activities.length})` : ''}` },
          ] as const).map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setPreviewTab(key)}
              className={`px-5 py-2.5 text-sm font-semibold border-b-2 transition-all -mb-px ${
                previewTab === key
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              {label}
              {key === 'preview' && !page && (
                <span className="ml-2 text-xs text-slate-300">(nevygenerováno)</span>
              )}
            </button>
          ))}
        </div>

        {previewTab === 'info' && (() => {
          const kal = parseKalkulace(lead.notes);
          return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="card p-5 space-y-4">
              <h2 className="section-title">Detaily firmy</h2>
              <div className="space-y-3">
                <Detail label="Obor" value={lead.business_niche} />
                <Detail label="Město" value={lead.city} />
                {!kal && <Detail label="Styl webu" value={STYLE_LABELS[lead.website_style] ?? lead.website_style} />}
                {lead.business_name && <Detail label="Název firmy" value={lead.business_name} />}
              </div>
            </div>
            <div className="card p-5 space-y-4">
              <h2 className="section-title">Kontaktní údaje</h2>
              <div className="space-y-3">
                <Detail label="Jméno" value={lead.contact_name ?? '—'} />
                <Detail label="Email" value={lead.contact_email ?? '—'} />
                {kal?.phone && <Detail label="Telefon" value={kal.phone} />}
                {!kal && lead.notes && <Detail label="Poznámky" value={lead.notes} />}
              </div>
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide mb-1.5">Hodnota dealu (Kč)</p>
                <div className="flex items-center gap-2">
                  <input
                    className="input max-w-[140px]"
                    type="number"
                    min="0"
                    step="100"
                    placeholder="0"
                    value={dealValueInput}
                    onChange={(e) => setDealValueInput(e.target.value)}
                    onBlur={saveDealValue}
                    onKeyDown={(e) => e.key === 'Enter' && saveDealValue()}
                  />
                  {savingDeal && <span className="text-xs text-slate-400">Ukládám…</span>}
                  {lead.deal_value != null && !savingDeal && (
                    <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                      {lead.deal_value.toLocaleString('cs-CZ')} Kč
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Kalkulace card */}
            {kal && (
              <div className="md:col-span-2 card p-5 space-y-4 border-l-4 border-blue-400">
                <div className="flex items-center justify-between">
                  <h2 className="section-title">Poptávka z kalkulace</h2>
                  <span className="text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200 px-2.5 py-1 rounded-lg">Z webu</span>
                </div>

                {/* Service + price summary */}
                <div className="flex flex-wrap items-center gap-4">
                  <div>
                    <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide mb-0.5">Služba</p>
                    <p className="text-sm font-bold text-slate-900">{kal.serviceTitle}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide mb-0.5">Základ</p>
                    <p className="text-sm font-semibold text-slate-700">{formatCzkAdmin(kal.basePrice)}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide mb-0.5">Celkem (odhadem)</p>
                    <p className="text-sm font-bold text-emerald-600">{formatCzkAdmin(kal.totalPrice)}</p>
                  </div>
                </div>

                {/* Addons */}
                {kal.addons.length > 0 && (
                  <div>
                    <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide mb-2">Vybrané doplňky</p>
                    <div className="flex flex-wrap gap-2">
                      {kal.addons.map((a) => (
                        <span key={a.id} className="inline-flex items-center gap-1.5 text-xs font-medium bg-slate-100 text-slate-700 px-3 py-1.5 rounded-lg">
                          {a.name}
                          <span className="text-slate-400">+{formatCzkAdmin(a.price)}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {kal.addons.length === 0 && (
                  <p className="text-xs text-slate-400 italic">Žádné doplňky nebyly vybrány.</p>
                )}

                {/* Special requirements */}
                {kal.specialRequirements && (
                  <div>
                    <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide mb-1.5">Speciální požadavky</p>
                    <p className="text-sm text-slate-700 bg-slate-50 rounded-xl p-4 border border-slate-100 leading-relaxed whitespace-pre-wrap">{kal.specialRequirements}</p>
                  </div>
                )}
              </div>
            )}

            {draft && (
              <div className="md:col-span-2 card p-5 space-y-4">
                <h2 className="section-title">Email draft</h2>
                <Detail label="Předmět" value={draft.subject} />
                <div>
                  <p className="label">Text</p>
                  <pre className="text-sm text-slate-700 whitespace-pre-wrap bg-slate-50 rounded-lg p-4 border border-slate-100 leading-relaxed">
                    {draft.body}
                  </pre>
                </div>
                {draft.gmail_draft_id && (
                  <p className="text-xs text-slate-300">Gmail Draft ID: {draft.gmail_draft_id}</p>
                )}
              </div>
            )}
          </div>
          );
        })()}

        {previewTab === 'activities' && (
          <div className="space-y-4">
            {/* Add activity form */}
            <div className="card p-5">
              <h2 className="section-title mb-4">Přidat aktivitu</h2>
              <form onSubmit={createActivity} className="flex flex-wrap gap-3 items-end">
                <div>
                  <label className="label">Typ</label>
                  <select className="input" value={actType} onChange={(e) => setActType(e.target.value as typeof actType)}>
                    <option value="call">📞 Zavolat</option>
                    <option value="email">✉️ Napsat</option>
                    <option value="meeting">🤝 Schůzka</option>
                    <option value="other">📌 Jiné</option>
                  </select>
                </div>
                <div>
                  <label className="label">Datum a čas</label>
                  <input
                    className="input"
                    type="datetime-local"
                    value={actDate}
                    onChange={(e) => setActDate(e.target.value)}
                    required
                  />
                </div>
                <div className="flex-1 min-w-[180px]">
                  <label className="label">Poznámka (volitelná)</label>
                  <input
                    className="input"
                    type="text"
                    placeholder="Zavolat ohledně ceny…"
                    value={actNotes}
                    onChange={(e) => setActNotes(e.target.value)}
                  />
                </div>
                <button type="submit" className="btn-primary" disabled={savingAct || !actDate}>
                  {savingAct ? 'Ukládám…' : 'Přidat'}
                </button>
              </form>
            </div>

            {/* Activity list */}
            {activities.length === 0 ? (
              <div className="card p-10 text-center text-slate-400 text-sm">
                Žádné aktivity. Přidej první připomínku výše.
              </div>
            ) : (
              <div className="card divide-y divide-slate-100 dark:divide-slate-800">
                {activities.map((a) => {
                  const isPast = new Date(a.scheduled_at) < new Date();
                  const typeLabels: Record<string, string> = { call: '📞 Zavolat', email: '✉️ Napsat', meeting: '🤝 Schůzka', other: '📌 Jiné' };
                  return (
                    <div key={a.id} className={`flex items-start justify-between gap-4 px-5 py-4 ${isPast ? 'opacity-50' : ''}`}>
                      <div className="flex items-start gap-3 min-w-0">
                        <span className="text-base mt-0.5">{typeLabels[a.type]?.split(' ')[0]}</span>
                        <div className="min-w-0">
                          <p className={`text-sm font-semibold ${isPast ? 'text-slate-400' : 'text-slate-800 dark:text-slate-100'}`}>
                            {typeLabels[a.type]?.split(' ').slice(1).join(' ')}
                          </p>
                          <p className={`text-xs mt-0.5 ${isPast ? 'text-slate-300' : 'text-blue-600 dark:text-blue-400 font-medium'}`}>
                            {new Date(a.scheduled_at).toLocaleString('cs-CZ', { weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                            {isPast && ' · proběhlo'}
                          </p>
                          {a.notes && <p className="text-xs text-slate-400 mt-1">{a.notes}</p>}
                        </div>
                      </div>
                      <button
                        onClick={() => deleteActivity(a.id)}
                        className="text-xs text-slate-300 hover:text-red-500 transition-colors shrink-0 px-2 py-1"
                      >
                        ✕
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {previewTab === 'preview' && (
          <div>
            {page ? (
              <div className="card p-12 flex flex-col items-center gap-5 text-center">
                <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-2xl">
                  🌐
                </div>
                <div>
                  <p className="text-base font-bold text-slate-800">Web byl vygenerován</p>
                  <p className="text-xs text-slate-400 mt-1">
                    {new Date(page.created_at).toLocaleString('cs-CZ')}
                  </p>
                </div>
                <Link href={`/preview/${id}`} target="_blank" className="btn-primary px-8 py-3 text-base">
                  Otevřít vygenerovaný web ↗
                </Link>
                <p className="text-xs text-slate-300">Otevře se v novém okně</p>
              </div>
            ) : (
              <div className="card p-16 text-center">
                <p className="text-slate-400 text-sm mb-4">Web ještě nebyl vygenerován.</p>
                <button onClick={() => { setPreviewTab('info'); doAction('generate'); }} disabled={isActing} className="btn-primary">
                  Vygenerovat web
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide mb-0.5">{label}</p>
      <p className="text-sm text-slate-800 font-medium">{value}</p>
    </div>
  );
}
