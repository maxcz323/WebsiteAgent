import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { createSupabaseServer } from '@/lib/supabase-server';
import { createCalendarEvent } from '@/lib/google-calendar';

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

  // Get lead name for calendar event
  const { data: lead } = await supabaseAdmin
    .from('leads')
    .select('business_name, business_niche, city')
    .eq('id', leadId)
    .single();

  const leadName = lead?.business_name || `${lead?.business_niche} — ${lead?.city}`;

  const googleEventId = await createCalendarEvent({
    id: data.id,
    type,
    scheduled_at,
    notes: notes || null,
    lead_id: leadId,
    leadName,
  });

  if (googleEventId) {
    await supabaseAdmin
      .from('lead_activities')
      .update({ google_event_id: googleEventId })
      .eq('id', data.id);
  }

  return NextResponse.json(data, { status: 201 });
}
