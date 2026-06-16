'use client';

import { useEffect, useState, useCallback } from 'react';
import { Lead } from '@/types';

const TRASH_TTL_MS = 12 * 60 * 60 * 1000;

function TrashIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
      <path d="M10 11v6M14 11v6" />
      <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
    </svg>
  );
}

function RestoreIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" />
    </svg>
  );
}

function formatTimeLeft(deletedAt: string): string {
  const expiresAt = new Date(deletedAt).getTime() + TRASH_TTL_MS;
  const remaining = expiresAt - Date.now();
  if (remaining <= 0) return 'Vyprší brzy';
  const h = Math.floor(remaining / 3600000);
  const m = Math.floor((remaining % 3600000) / 60000);
  if (h > 0) return `Odstraní se za ${h}h ${m}m`;
  return `Odstraní se za ${m}m`;
}

export default function TrashPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [restoringId, setRestoringId] = useState<string | null>(null);
  const [purging, setPurging] = useState(false);
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 30000);
    return () => clearInterval(id);
  }, []);

  const fetchTrash = useCallback(async () => {
    setLoading(true);
    const res = await fetch('/api/leads/trash');
    const data = await res.json();
    setLeads(Array.isArray(data) ? data : []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchTrash(); }, [fetchTrash]);

  async function handleRestore(id: string) {
    setRestoringId(id);
    await fetch(`/api/leads/${id}/restore`, { method: 'POST' });
    setLeads((prev) => prev.filter((l) => l.id !== id));
    setRestoringId(null);
  }

  async function handlePurgeAll() {
    if (!confirm(`Natrvalo smazat všech ${leads.length} leadů v koši? Tato akce je nevratná.`)) return;
    setPurging(true);
    await fetch('/api/leads/trash', { method: 'DELETE' });
    setLeads([]);
    setPurging(false);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2">
            <span className="text-slate-400"><TrashIcon /></span>
            Koš
          </h1>
          <p className="text-sm text-slate-400 mt-0.5">Smazané leady — obnovitelné do 12 hodin od smazání</p>
        </div>
        {leads.length > 0 && (
          <button
            onClick={handlePurgeAll}
            disabled={purging}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-red-600 border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40 rounded-lg transition-colors disabled:opacity-50"
          >
            <TrashIcon />
            {purging ? 'Mažu…' : `Vyprázdnit koš (${leads.length})`}
          </button>
        )}
      </div>

      <div className="card overflow-hidden">
        {loading ? (
          <div className="p-16 text-center text-slate-300 dark:text-slate-600 text-sm">Načítání…</div>
        ) : leads.length === 0 ? (
          <div className="p-16 text-center">
            <div className="text-slate-200 dark:text-slate-700 mb-3 flex justify-center">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                <path d="M10 11v6M14 11v6" />
                <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
              </svg>
            </div>
            <p className="text-slate-400 text-sm">Koš je prázdný</p>
          </div>
        ) : (
          <>
            {/* Mobile */}
            <div className="divide-y divide-slate-100 dark:divide-slate-800 md:hidden">
              {leads.map((lead) => (
                <div key={lead.id} className="p-4 flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-semibold text-slate-900 dark:text-slate-100 text-sm truncate">
                      {lead.business_name || lead.business_niche}
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">{lead.business_niche} · {lead.city}</p>
                    <p className="text-[11px] text-amber-500 mt-1 font-medium">
                      {void now}{formatTimeLeft(lead.deleted_at!)}
                    </p>
                  </div>
                  <button
                    onClick={() => handleRestore(lead.id)}
                    disabled={restoringId === lead.id}
                    className="flex items-center gap-1.5 shrink-0 px-3 py-1.5 text-xs font-semibold text-emerald-700 border border-emerald-200 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-900/20 hover:bg-emerald-100 rounded-lg transition-colors disabled:opacity-50"
                  >
                    <RestoreIcon />
                    {restoringId === lead.id ? '…' : 'Obnovit'}
                  </button>
                </div>
              ))}
            </div>

            {/* Desktop */}
            <table className="hidden md:table w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40">
                  <th className="text-left px-5 py-3 section-title">Firma</th>
                  <th className="text-left px-5 py-3 section-title">Obor</th>
                  <th className="text-left px-5 py-3 section-title">Město</th>
                  <th className="text-left px-5 py-3 section-title">Smazáno</th>
                  <th className="text-left px-5 py-3 section-title">Zbývá</th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-slate-800/60">
                {leads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="px-5 py-3.5 font-semibold text-slate-900 dark:text-slate-100">
                      {lead.business_name || <span className="text-slate-300 dark:text-slate-600 font-normal italic">Bez názvu</span>}
                    </td>
                    <td className="px-5 py-3.5 text-slate-500 dark:text-slate-400">{lead.business_niche}</td>
                    <td className="px-5 py-3.5 text-slate-500 dark:text-slate-400">{lead.city}</td>
                    <td className="px-5 py-3.5 text-slate-400 text-xs">
                      {new Date(lead.deleted_at!).toLocaleString('cs-CZ', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="px-5 py-3.5 text-xs font-medium text-amber-500">
                      {void now}{formatTimeLeft(lead.deleted_at!)}
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <button
                        onClick={() => handleRestore(lead.id)}
                        disabled={restoringId === lead.id}
                        className="flex items-center gap-1.5 ml-auto px-3 py-1.5 text-xs font-semibold text-emerald-700 border border-emerald-200 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-900/20 hover:bg-emerald-100 rounded-lg transition-colors disabled:opacity-50"
                      >
                        <RestoreIcon />
                        {restoringId === lead.id ? 'Obnovuji…' : 'Obnovit'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </div>
    </div>
  );
}
