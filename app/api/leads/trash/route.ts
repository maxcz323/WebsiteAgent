import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

const TRASH_TTL_MS = 12 * 60 * 60 * 1000; // 12 hodin

export async function GET() {
  const cutoff = new Date(Date.now() - TRASH_TTL_MS).toISOString();

  // Natrvalo smaž leads starší než 12h
  await supabaseAdmin
    .from('leads')
    .delete()
    .not('deleted_at', 'is', null)
    .lt('deleted_at', cutoff);

  const { data: leads, error } = await supabaseAdmin
    .from('leads')
    .select('*')
    .not('deleted_at', 'is', null)
    .gte('deleted_at', cutoff)
    .order('deleted_at', { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const userIds = [...new Set(
    (leads ?? []).flatMap((l) => [l.created_by, l.assigned_to]).filter(Boolean)
  )];

  let profileMap: Record<string, string> = {};
  if (userIds.length > 0) {
    const { data: profiles } = await supabaseAdmin
      .from('profiles')
      .select('id, full_name')
      .in('id', userIds);
    profileMap = Object.fromEntries((profiles ?? []).map((p) => [p.id, p.full_name]));
  }

  const result = (leads ?? []).map((l) => ({
    ...l,
    created_by_name: l.created_by ? (profileMap[l.created_by] ?? null) : null,
    assigned_to_name: l.assigned_to ? (profileMap[l.assigned_to] ?? null) : null,
  }));

  return NextResponse.json(result);
}

export async function DELETE() {
  const { error } = await supabaseAdmin
    .from('leads')
    .delete()
    .not('deleted_at', 'is', null);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return new NextResponse(null, { status: 204 });
}
