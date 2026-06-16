'use client';

import { useEffect, useState } from 'react';

interface UserStats {
  id: string;
  full_name: string;
  created: number;
  assigned: number;
  generated: number;
  approved: number;
  draft_created: number;
}

function Bar({ value, max, color }: { value: number; max: number; color: string }) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 mt-1 overflow-hidden">
      <div className={`h-1.5 rounded-full transition-all duration-500 ${color}`} style={{ width: `${pct}%` }} />
    </div>
  );
}

function Avatar({ name }: { name: string }) {
  return (
    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm shrink-0"
      style={{ background: 'linear-gradient(135deg, #2563EB, #60a5fa)' }}>
      {name.charAt(0).toUpperCase()}
    </div>
  );
}

export default function TeamPage() {
  const [stats, setStats] = useState<UserStats[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/team/stats').then((r) => r.json()).then((d) => { setStats(d); setLoading(false); });
  }, []);

  const maxAssigned = Math.max(...stats.map((s) => s.assigned), 1);
  const maxCreated = Math.max(...stats.map((s) => s.created), 1);

  const totals = {
    created: stats.reduce((a, s) => a + s.created, 0),
    assigned: stats.reduce((a, s) => a + s.assigned, 0),
    approved: stats.reduce((a, s) => a + s.approved, 0),
    draft_created: stats.reduce((a, s) => a + s.draft_created, 0),
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">Tým</h1>
        <p className="text-sm text-slate-400 mt-0.5">Statistiky a přehled práce členů týmu</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Přidáno celkem', value: totals.created, accent: 'border-slate-300 dark:border-slate-600', num: 'text-slate-900 dark:text-slate-100' },
          { label: 'Zpracovává se', value: totals.assigned, accent: 'border-blue-400', num: 'text-blue-600 dark:text-blue-400' },
          { label: 'Schváleno', value: totals.approved, accent: 'border-emerald-400', num: 'text-emerald-600 dark:text-emerald-400' },
          { label: 'Drafty', value: totals.draft_created, accent: 'border-blue-400', num: 'text-blue-600 dark:text-blue-400' },
        ].map((s) => (
          <div key={s.label} className={`card p-4 border-l-4 ${s.accent}`}>
            <p className="section-title">{s.label}</p>
            <p className={`text-3xl font-bold mt-2 ${s.num}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-16 text-slate-300 dark:text-slate-600 text-sm">Načítání…</div>
      ) : stats.length === 0 ? (
        <div className="card p-16 text-center text-slate-400 text-sm">Žádní uživatelé.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {stats.map((s) => (
            <div key={s.id} className="card p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar name={s.full_name} />
                  <div>
                    <p className="font-bold text-slate-900 dark:text-slate-100 text-sm">{s.full_name}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{s.assigned} leadů zpracovává</p>
                  </div>
                </div>
                {s.assigned > 0 && (
                  <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 px-2.5 py-1 rounded-lg">
                    {s.approved}/{s.assigned}
                  </span>
                )}
              </div>
              <div className="space-y-3 pt-1 border-t border-slate-50 dark:border-slate-800">
                {[
                  { label: 'Přidáno', value: s.created, max: maxCreated, color: 'bg-slate-400', num: 'text-slate-600 dark:text-slate-400' },
                  { label: 'Zpracovává', value: s.assigned, max: maxAssigned, color: 'bg-blue-400', num: 'text-blue-600 dark:text-blue-400' },
                  { label: 'Vygenerováno', value: s.generated, max: maxAssigned, color: 'bg-blue-400', num: 'text-blue-600 dark:text-blue-400' },
                  { label: 'Schváleno', value: s.approved, max: maxAssigned, color: 'bg-emerald-400', num: 'text-emerald-600 dark:text-emerald-400' },
                  { label: 'Gmail draft', value: s.draft_created, max: maxAssigned, color: 'bg-purple-400', num: 'text-purple-600 dark:text-purple-400' },
                ].map((row) => (
                  <div key={row.label}>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-500 dark:text-slate-400">{row.label}</span>
                      <span className={`font-bold ${row.num}`}>{row.value}</span>
                    </div>
                    <Bar value={row.value} max={row.max} color={row.color} />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
