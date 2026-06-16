import { LeadStatus } from '@/types';

const STATUS_MAP: Record<LeadStatus, { label: string; classes: string }> = {
  new:            { label: 'Nový',          classes: 'bg-slate-100 text-slate-600 border-slate-200' },
  generating:     { label: 'Generuje se…',  classes: 'bg-amber-50 text-amber-700 border-amber-200 animate-pulse' },
  generated:      { label: 'Vygenerováno',  classes: 'bg-blue-50 text-blue-700 border-blue-200' },
  approved:       { label: 'Schváleno',     classes: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  creating_draft: { label: 'Vytváří draft…',classes: 'bg-amber-50 text-amber-700 border-amber-200 animate-pulse' },
  draft_created:  { label: 'Draft hotov',   classes: 'bg-blue-50 text-blue-700 border-blue-200' },
  rejected:       { label: 'Zamítnuto',     classes: 'bg-red-50 text-red-600 border-red-200' },
};

export function StatusBadge({ status }: { status: LeadStatus }) {
  const cfg = STATUS_MAP[status] ?? STATUS_MAP.new;
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${cfg.classes}`}>
      {cfg.label}
    </span>
  );
}
