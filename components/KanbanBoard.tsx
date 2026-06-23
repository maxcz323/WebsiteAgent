'use client';

import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  useDroppable,
  useDraggable,
} from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { useState } from 'react';
import Link from 'next/link';
import { Lead, LeadStatus } from '@/types';
import { StatusBadge } from '@/components/StatusBadge';

const COLUMNS: { id: LeadStatus; label: string; accent: string; bg: string }[] = [
  { id: 'new',          label: 'Nový',         accent: 'border-slate-300 dark:border-slate-600', bg: 'bg-slate-50 dark:bg-slate-800/30' },
  { id: 'generated',   label: 'Vygenerováno', accent: 'border-blue-400',                        bg: 'bg-blue-50/40 dark:bg-blue-900/10' },
  { id: 'approved',    label: 'Schváleno',    accent: 'border-emerald-400',                     bg: 'bg-emerald-50/40 dark:bg-emerald-900/10' },
  { id: 'draft_created', label: 'Draft hotov', accent: 'border-blue-400',                    bg: 'bg-blue-50/40 dark:bg-blue-900/10' },
  { id: 'rejected',    label: 'Zamítnuto',    accent: 'border-red-300 dark:border-red-800',     bg: 'bg-red-50/30 dark:bg-red-900/10' },
];

// Map transient statuses to their nearest column
function columnFor(status: LeadStatus): LeadStatus {
  if (status === 'generating') return 'new';
  if (status === 'creating_draft') return 'approved';
  return status;
}

// Which statuses can a column receive on drop
const DROPPABLE_STATUSES: LeadStatus[] = ['new', 'generated', 'approved', 'draft_created', 'rejected'];

function LeadCard({ lead, dragging }: { lead: Lead; dragging?: boolean }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id: lead.id });

  const style = transform
    ? { transform: CSS.Translate.toString(transform), zIndex: 50 }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`card p-3 cursor-grab active:cursor-grabbing select-none transition-shadow ${
        dragging ? 'opacity-50' : 'hover:shadow-md'
      }`}
    >
      <p className="font-semibold text-slate-900 dark:text-slate-100 text-sm truncate">
        {lead.business_name || lead.business_niche}
      </p>
      <p className="text-xs text-slate-400 mt-0.5 truncate">{lead.business_niche} · {lead.city}</p>
      <div className="flex items-center justify-between mt-2.5 gap-2">
        <StatusBadge status={lead.status} />
        {lead.assigned_to_name && (
          <span className="text-xs text-blue-500 dark:text-blue-400 font-medium truncate">
            {lead.assigned_to_name}
          </span>
        )}
      </div>
      <Link
        href={`/leads/${lead.id}`}
        onClick={(e) => e.stopPropagation()}
        className="mt-2 text-[10px] text-slate-300 dark:text-slate-600 hover:text-blue-500 transition-colors block"
      >
        Otevřít →
      </Link>
    </div>
  );
}

function Column({
  column,
  leads,
  activeId,
}: {
  column: typeof COLUMNS[number];
  leads: Lead[];
  activeId: string | null;
}) {
  const { setNodeRef, isOver } = useDroppable({ id: column.id });

  return (
    <div className="flex flex-col min-w-[180px] w-full sm:min-w-[220px] sm:w-[220px] sm:shrink-0">
      {/* Header */}
      <div className={`flex items-center justify-between px-3 py-2 mb-2 rounded-lg border-l-4 ${column.accent} bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm`}>
        <span className="text-xs font-bold text-slate-700 dark:text-slate-200">{column.label}</span>
        <span className="text-xs font-bold text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">
          {leads.length}
        </span>
      </div>

      {/* Drop zone */}
      <div
        ref={setNodeRef}
        className={`flex-1 min-h-[120px] sm:min-h-[500px] rounded-xl p-2 space-y-2 transition-colors ${column.bg} ${
          isOver ? 'ring-2 ring-blue-400 ring-offset-1' : ''
        }`}
      >
        {leads.map((lead) => (
          <LeadCard key={lead.id} lead={lead} dragging={lead.id === activeId} />
        ))}
        {leads.length === 0 && (
          <div className="h-20 flex items-center justify-center">
            <p className="text-xs text-slate-300 dark:text-slate-700">Přetáhni sem</p>
          </div>
        )}
      </div>
    </div>
  );
}

export function KanbanBoard({
  leads,
  onStatusChange,
}: {
  leads: Lead[];
  onStatusChange: (id: string, status: LeadStatus) => void;
}) {
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  const activeLead = leads.find((l) => l.id === activeId) ?? null;

  function handleDragStart(e: DragStartEvent) {
    setActiveId(e.active.id as string);
  }

  function handleDragEnd(e: DragEndEvent) {
    setActiveId(null);
    const { active, over } = e;
    if (!over) return;

    const lead = leads.find((l) => l.id === active.id);
    const newStatus = over.id as LeadStatus;

    if (!lead || !DROPPABLE_STATUSES.includes(newStatus)) return;
    if (columnFor(lead.status) === newStatus) return;

    onStatusChange(lead.id, newStatus);
  }

  const grouped = COLUMNS.reduce<Record<string, Lead[]>>((acc, col) => {
    acc[col.id] = leads.filter((l) => columnFor(l.status) === col.id);
    return acc;
  }, {});

  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="flex flex-col sm:flex-row gap-3 overflow-x-auto pb-4">
        {COLUMNS.map((col) => (
          <Column key={col.id} column={col} leads={grouped[col.id]} activeId={activeId} />
        ))}
      </div>

      <DragOverlay>
        {activeLead && (
          <div className="w-[220px] opacity-95 shadow-xl rotate-1">
            <LeadCard lead={activeLead} />
          </div>
        )}
      </DragOverlay>
    </DndContext>
  );
}
