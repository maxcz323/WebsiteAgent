import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { createSupabaseServer } from '@/lib/supabase-server';

export async function GET(_req: NextRequest, { params }: { params: Promise<{ leadId: string }> }) {
  const { leadId } = await params;
  const { data, error } = await supabaseAdmin
    .from('lead_activities')
    .select('*')
    .eq('lead_id', leadId)
    .order('scheduled_at', { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data ?? []);
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ leadId: string }> }) {
  const { leadId } = await params;
  const { type, scheduled_at, notes } = await req.json();

  if (!type || !scheduled_at) {
    return NextResponse.json({ error: 'type and scheduled_at are required' }, { status: 400 });
  }

  const supabase = await createSupabaseServer();
  const { data: { user } } = await supabase.auth.getUser();

  const { data, error } = await supabaseAdmin
    .from('lead_activities')
    .insert({ lead_id: leadId, type, scheduled_at, notes: notes || null, created_by: user?.id ?? null })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}
