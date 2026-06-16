'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { Lead, LeadStatus } from '@/types';
import { StatusBadge } from '@/components/StatusBadge';
import { KanbanBoard } from '@/components/KanbanBoard';
import { supabaseBrowser } from '@/lib/supabase-browser';

const STYLE_LABELS: Record<string, string> = {
  'modern-minimal': 'Minimál',
  'bold-colorful': 'Barevný',
  'professional-corporate': 'Korporátní',
  'creative-agency': 'Kreativní',
  'restaurant-food': 'Restaurace',
  ecommerce: 'E-commerce',
};

type FilterStatus = 'all' | 'mine' | LeadStatus;
type ViewMode = 'table' | 'kanban';

function TableIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M3 9h18M3 15h18M9 3v18" />
    </svg>
  );
}

function KanbanIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="5" height="18" rx="1" />
      <rect x="10" y="3" width="5" height="12" rx="1" />
      <rect x="17" y="3" width="5" height="15" rx="1" />
    </svg>
  );
}

function TrashIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
      <path d="M10 11v6M14 11v6" />
      <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
    </svg>
  );
}

export default function DashboardPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterStatus>('all');
  const [view, setView] = useState<ViewMode>('table');
  const [gmailConnected, setGmailConnected] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [deleting, setDeleting] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('wa-view') as ViewMode | null;
    if (stored) setView(stored);
  }, []);

  function toggleView(v: ViewMode) {
    setView(v);
    localStorage.setItem('wa-view', v);
  }

  const fetchLeads = useCallback(async () => {
    const res = await fetch('/api/leads');
    const data = await res.json();
    setLeads(data);
    setLoading(false);
  }, []);

  const fetchGmailStatus = useCallback(async () => {
    const res = await fetch('/api/gmail/status');
    const data = await res.json();
    setGmailConnected(data.connected);
  }, []);

  useEffect(() => {
    fetchLeads();
    fetchGmailStatus();
    supabaseBrowser().auth.getUser().then(({ data }) => setCurrentUserId(data.user?.id ?? null));
  }, [fetchLeads, fetchGmailStatus]);

  useEffect(() => {
    const sb = supabaseBrowser();
    const channel = sb
      .channel('leads-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'leads' }, () => fetchLeads())
      .subscribe();
    return () => { sb.removeChannel(channel); };
  }, [fetchLeads]);

  async function handleStatusChange(id: string, status: LeadStatus) {
    setLeads((prev) => prev.map((l) => l.id === id ? { ...l, status } : l));
    await fetch(`/api/leads/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
  }

  async function handleDelete(id: string) {
    setLeads((prev) => prev.filter((l) => l.id !== id));
    setSelected((prev) => { const s = new Set(prev); s.delete(id); return s; });
    setConfirmDeleteId(null);
    await fetch(`/api/leads/${id}`, { method: 'DELETE' });
  }

  async function handleBulkDelete() {
    const ids = [...selected];
    setDeleting(true);
    setLeads((prev) => prev.filter((l) => !ids.includes(l.id)));
    setSelected(new Set());
    await Promise.all(ids.map((id) => fetch(`/api/leads/${id}`, { method: 'DELETE' })));
    setDeleting(false);
  }

  function toggleSelect(id: string) {
    setSelected((prev) => {
      const s = new Set(prev);
      if (s.has(id)) s.delete(id); else s.add(id);
      return s;
    });
  }

  function toggleSelectAll() {
    if (selected.size === filtered.length && filtered.length > 0) {
      setSelected(new Set());
    } else {
      setSelected(new Set(filtered.map((l) => l.id)));
    }
  }

  const filtered = leads.filter((l) => {
    if (filter === 'mine') return l.assigned_to === currentUserId;
    if (filter === 'all') return true;
    return l.status === filter;
  });

  const allSelected = filtered.length > 0 && selected.size === filtered.length;
  const someSelected = selected.size > 0 && !allSelected;

  const stats = [
    { label: 'Celkem', value: leads.length, accent: 'border-slate-300 dark:border-slate-600', num: 'text-slate-900 dark:text-slate-100' },
    { label: 'Vygenerováno', value: leads.filter((l) => ['generated', 'approved', 'draft_created'].includes(l.status)).length, accent: 'border-blue-400', num: 'text-blue-600 dark:text-blue-400' },
    { label: 'Schváleno', value: leads.filter((l) => ['approved', 'draft_created'].includes(l.status)).length, accent: 'border-emerald-400', num: 'text-emerald-600 dark:text-emerald-400' },
    { label: 'Drafty', value: leads.filter((l) => l.status === 'draft_created').length, accent: 'border-blue-400', num: 'text-blue-600 dark:text-blue-400' },
  ];

  const thisMonth = new Date();
  thisMonth.setDate(1); thisMonth.setHours(0, 0, 0, 0);

  const closedLeads = leads.filter((l) => ['approved', 'draft_created'].includes(l.status));
  const closedThisMonth = leads.filter((l) => ['approved', 'draft_created'].includes(l.status) && new Date(l.created_at) >= thisMonth);
  const pipelineValue = leads.filter((l) => !['rejected'].includes(l.status) && l.deal_value).reduce((a, l) => a + (l.deal_value ?? 0), 0);
  const closedValue = closedLeads.filter((l) => l.deal_value).reduce((a, l) => a + (l.deal_value ?? 0), 0);
  const closedThisMonthValue = closedThisMonth.filter((l) => l.deal_value).reduce((a, l) => a + (l.deal_value ?? 0), 0);
  const leadsWithValue = leads.filter((l) => l.deal_value);
  const avgDeal = leadsWithValue.length > 0 ? Math.round(leadsWithValue.reduce((a, l) => a + (l.deal_value ?? 0), 0) / leadsWithValue.length) : 0;
  const conversionRate = leads.length > 0 ? Math.round((closedLeads.length / leads.length) * 100) : 0;
  const hasAnyDealValue = leads.some((l) => l.deal_value != null);

  function formatCzk(val: number) {
    return val.toLocaleString('cs-CZ') + ' Kč';
  }

  const FILTERS: { value: FilterStatus; label: string }[] = [
    { value: 'all', label: 'Vše' },
    { value: 'mine', label: 'Moje' },
    { value: 'new', label: 'Nové' },
    { value: 'generated', label: 'Vygenerováno' },
    { value: 'approved', label: 'Schváleno' },
    { value: 'draft_created', label: 'Draft' },
    { value: 'rejected', label: 'Zamítnuto' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">Přehled</h1>
          <p className="text-sm text-slate-400 mt-0.5">Správa leadů a vygenerovaných webů</p>
        </div>
        <div className="flex items-center gap-2">
          {gmailConnected ? (
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 px-3 py-1.5 rounded-lg">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
              Gmail připojen
            </span>
          ) : (
            <a href="/api/gmail/auth" className="btn-secondary text-xs">Připojit Gmail</a>
          )}
          <Link
            href="/admin/trash"
            className="flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 border border-slate-200 dark:border-slate-700 px-3 py-1.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            title="Koš"
          >
            <TrashIcon />
            Koš
          </Link>
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-lg p-1 gap-0.5">
            <button onClick={() => toggleView('table')} className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-semibold transition-all ${view === 'table' ? 'bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 shadow-sm' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'}`} title="Tabulka">
              <TableIcon /> Tabulka
            </button>
            <button onClick={() => toggleView('kanban')} className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-semibold transition-all ${view === 'kanban' ? 'bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 shadow-sm' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'}`} title="Kanban">
              <KanbanIcon /> Kanban
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {stats.map((s) => (
          <div key={s.label} className={`card p-4 border-l-4 ${s.accent}`}>
            <p className="section-title">{s.label}</p>
            <p className={`text-3xl font-bold mt-2 ${s.num}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {hasAnyDealValue && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="card p-4 border-l-4 border-emerald-500">
            <p className="section-title">Pipeline</p>
            <p className="text-xl font-bold mt-2 text-emerald-600 dark:text-emerald-400">{formatCzk(pipelineValue)}</p>
            <p className="text-[10px] text-slate-400 mt-0.5">aktivní dealy</p>
          </div>
          <div className="card p-4 border-l-4 border-blue-400">
            <p className="section-title">Uzavřeno celkem</p>
            <p className="text-xl font-bold mt-2 text-blue-600 dark:text-blue-400">{formatCzk(closedValue)}</p>
            <p className="text-[10px] text-slate-400 mt-0.5">{closedLeads.length} dealů</p>
          </div>
          <div className="card p-4 border-l-4 border-blue-400">
            <p className="section-title">Tento měsíc</p>
            <p className="text-xl font-bold mt-2 text-blue-600 dark:text-blue-400">{formatCzk(closedThisMonthValue)}</p>
            <p className="text-[10px] text-slate-400 mt-0.5">{closedThisMonth.length} dealů</p>
          </div>
          <div className="card p-4 border-l-4 border-amber-400">
            <p className="section-title">Průměr / deal</p>
            <p className="text-xl font-bold mt-2 text-amber-600 dark:text-amber-400">{formatCzk(avgDeal)}</p>
            <p className="text-[10px] text-slate-400 mt-0.5">konverze {conversionRate}%</p>
          </div>
        </div>
      )}

      {view === 'kanban' && !loading && (
        <KanbanBoard leads={filtered} onStatusChange={handleStatusChange} />
      )}

      {view === 'table' && (
        <>
          <div className="flex gap-1.5 flex-wrap">
            {FILTERS.map((f) => (
              <button
                key={f.value}
                onClick={() => setFilter(f.value)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${filter === f.value ? 'bg-blue-600 text-white border-blue-600 shadow-sm' : 'bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 hover:text-slate-700 dark:hover:text-slate-200'}`}
              >
                {f.label}
                {f.value === 'mine' && currentUserId && (
                  <span className="ml-1 opacity-60">({leads.filter((l) => l.assigned_to === currentUserId).length})</span>
                )}
              </button>
            ))}
          </div>

          {/* Bulk action bar */}
          {selected.size > 0 && (
            <div className="flex items-center gap-3 px-4 py-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
              <span className="text-sm font-semibold text-red-700 dark:text-red-400">
                Vybráno: {selected.size} {selected.size === 1 ? 'lead' : selected.size < 5 ? 'leady' : 'leadů'}
              </span>
              <button
                onClick={handleBulkDelete}
                disabled={deleting}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors disabled:opacity-50"
              >
                <TrashIcon />
                {deleting ? 'Mažu…' : 'Smazat vybrané'}
              </button>
              <button
                onClick={() => setSelected(new Set())}
                className="text-xs text-red-400 hover:text-red-600 ml-auto"
              >
                Zrušit výběr
              </button>
            </div>
          )}

          <div className="card overflow-hidden">
            {loading ? (
              <div className="p-16 text-center text-slate-300 dark:text-slate-600 text-sm">Načítání…</div>
            ) : filtered.length === 0 ? (
              <div className="p-16 text-center">
                <p className="text-slate-400 text-sm mb-4">Žádné leady nenalezeny.</p>
                <Link href="/admin/leads/new" className="btn-primary">Vytvořit prvního leada</Link>
              </div>
            ) : (
              <>
                {/* Mobile cards */}
                <div className="divide-y divide-slate-100 dark:divide-slate-800 md:hidden">
                  {filtered.map((lead) => {
                    const isWeb = lead.notes?.startsWith('__KALKULACE__');
                    const isSelected = selected.has(lead.id);
                    const isConfirming = confirmDeleteId === lead.id;
                    return (
                      <div key={lead.id} className={`flex items-center gap-3 p-4 transition-colors ${isSelected ? 'bg-blue-50/60 dark:bg-blue-900/10' : ''}`}>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelect(lead.id)}
                          className="w-4 h-4 rounded border-slate-300 text-blue-600 shrink-0 cursor-pointer"
                        />
                        <Link href={`/admin/leads/${lead.id}`} className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <div className="min-w-0">
                              <p className="font-semibold text-slate-900 dark:text-slate-100 text-sm truncate">{lead.business_name || lead.business_niche}</p>
                              <p className="text-xs text-slate-400 mt-0.5">{lead.business_niche} · {lead.city}</p>
                            </div>
                            <div className="flex items-center gap-1.5 shrink-0">
                              {isWeb && <span className="text-[10px] font-bold bg-blue-50 text-blue-600 border border-blue-200 px-1.5 py-0.5 rounded">Z webu</span>}
                              <StatusBadge status={lead.status} />
                            </div>
                          </div>
                          <div className="flex items-center gap-3 text-xs text-slate-400">
                            {lead.assigned_to_name && <span className="text-blue-500 font-medium">↳ {lead.assigned_to_name}</span>}
                            <span>{new Date(lead.created_at).toLocaleDateString('cs-CZ')}</span>
                          </div>
                        </Link>
                        {isConfirming ? (
                          <div className="flex gap-1 shrink-0">
                            <button onClick={() => handleDelete(lead.id)} className="text-xs font-semibold text-white bg-red-600 hover:bg-red-700 px-2 py-1 rounded transition-colors">Smazat</button>
                            <button onClick={() => setConfirmDeleteId(null)} className="text-xs text-slate-400 hover:text-slate-600 px-2 py-1 rounded transition-colors">Ne</button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setConfirmDeleteId(lead.id)}
                            className="text-slate-300 dark:text-slate-600 hover:text-red-500 dark:hover:text-red-500 transition-colors shrink-0 p-1"
                            title="Smazat"
                          >
                            <TrashIcon />
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Desktop table */}
                <table className="hidden md:table w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40">
                      <th className="px-4 py-3 w-10">
                        <input
                          type="checkbox"
                          checked={allSelected}
                          ref={(el) => { if (el) el.indeterminate = someSelected; }}
                          onChange={toggleSelectAll}
                          className="w-4 h-4 rounded border-slate-300 text-blue-600 cursor-pointer"
                        />
                      </th>
                      <th className="text-left px-5 py-3 section-title">Firma</th>
                      <th className="text-left px-5 py-3 section-title">Obor</th>
                      <th className="text-left px-5 py-3 section-title">Město</th>
                      <th className="text-left px-5 py-3 section-title hidden lg:table-cell">Styl</th>
                      <th className="text-left px-5 py-3 section-title">Stav</th>
                      <th className="text-left px-5 py-3 section-title">Zpracovává</th>
                      <th className="text-left px-5 py-3 section-title hidden xl:table-cell">Přidal</th>
                      <th className="text-left px-5 py-3 section-title hidden lg:table-cell">Datum</th>
                      <th className="px-5 py-3" />
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 dark:divide-slate-800/60">
                    {filtered.map((lead) => {
                      const isWeb = lead.notes?.startsWith('__KALKULACE__');
                      const isSelected = selected.has(lead.id);
                      const isConfirming = confirmDeleteId === lead.id;
                      return (
                        <tr key={lead.id} className={`hover:bg-slate-50/80 dark:hover:bg-slate-800/30 transition-colors group ${isSelected ? 'bg-blue-50/40 dark:bg-blue-900/10' : ''}`}>
                          <td className="px-4 py-3.5">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => toggleSelect(lead.id)}
                              className="w-4 h-4 rounded border-slate-300 text-blue-600 cursor-pointer"
                            />
                          </td>
                          <td className="px-5 py-3.5 font-semibold text-slate-900 dark:text-slate-100">
                            <div className="flex items-center gap-2">
                              {lead.business_name || <span className="text-slate-300 dark:text-slate-600 font-normal italic">Bez názvu</span>}
                              {isWeb && <span className="text-[10px] font-bold bg-blue-50 text-blue-600 border border-blue-200 px-1.5 py-0.5 rounded">Z webu</span>}
                            </div>
                          </td>
                          <td className="px-5 py-3.5 text-slate-500 dark:text-slate-400">{lead.business_niche}</td>
                          <td className="px-5 py-3.5 text-slate-500 dark:text-slate-400">{lead.city}</td>
                          <td className="px-5 py-3.5 text-slate-400 dark:text-slate-500 hidden lg:table-cell">{STYLE_LABELS[lead.website_style] ?? lead.website_style}</td>
                          <td className="px-5 py-3.5"><StatusBadge status={lead.status} /></td>
                          <td className="px-5 py-3.5">{lead.assigned_to_name ? <span className="text-blue-600 dark:text-blue-400 font-semibold text-xs">{lead.assigned_to_name}</span> : <span className="text-slate-200 dark:text-slate-700">—</span>}</td>
                          <td className="px-5 py-3.5 hidden xl:table-cell text-xs">
                            {isWeb
                              ? <span className="text-blue-500 font-semibold">Z webu</span>
                              : lead.created_by_name || <span className="text-slate-200 dark:text-slate-700">—</span>}
                          </td>
                          <td className="px-5 py-3.5 text-slate-400 dark:text-slate-500 hidden lg:table-cell text-xs">{new Date(lead.created_at).toLocaleDateString('cs-CZ')}</td>
                          <td className="px-5 py-3.5 text-right">
                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              {isConfirming ? (
                                <>
                                  <button onClick={() => handleDelete(lead.id)} className="text-xs font-semibold text-white bg-red-600 hover:bg-red-700 px-2.5 py-1 rounded transition-colors">Smazat</button>
                                  <button onClick={() => setConfirmDeleteId(null)} className="text-xs text-slate-400 hover:text-slate-600 px-2 py-1 rounded transition-colors">Ne</button>
                                </>
                              ) : (
                                <>
                                  <Link href={`/admin/leads/${lead.id}`} className="text-blue-500 hover:text-blue-700 dark:hover:text-blue-300 font-semibold text-xs">
                                    Detail →
                                  </Link>
                                  <button
                                    onClick={() => setConfirmDeleteId(lead.id)}
                                    className="text-slate-300 dark:text-slate-600 hover:text-red-500 dark:hover:text-red-500 transition-colors p-0.5"
                                    title="Smazat"
                                  >
                                    <TrashIcon />
                                  </button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}
