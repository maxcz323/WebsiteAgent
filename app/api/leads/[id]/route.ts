import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { notifyLeadUpdated, notifyLeadDeleted } from '@/lib/discord';

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
  const { id } = await params;

  const [leadRes, pageRes, draftRes] = await Promise.all([
    supabaseAdmin.from('leads').select('*').eq('id', id).single(),
    supabaseAdmin
      .from('generated_pages')
      .select('*')
      .eq('lead_id', id)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle(),
    supabaseAdmin
      .from('email_drafts')
      .select('*')
      .eq('lead_id', id)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle(),
  ]);

  if (leadRes.error || !leadRes.data) {
    return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
  }

  const lead = leadRes.data;
  const userIds = [...new Set([lead.created_by, lead.assigned_to].filter(Boolean))];
  let profileMap: Record<string, string> = {};
  if (userIds.length > 0) {
    const { data: profiles } = await supabaseAdmin
      .from('profiles').select('id, full_name').in('id', userIds);
    profileMap = Object.fromEntries((profiles ?? []).map((p) => [p.id, p.full_name]));
  }

  return NextResponse.json({
    lead: {
      ...lead,
      created_by_name: lead.created_by ? (profileMap[lead.created_by] ?? null) : null,
      assigned_to_name: lead.assigned_to ? (profileMap[lead.assigned_to] ?? null) : null,
    },
    page: pageRes.data ?? null,
    draft: draftRes.data ?? null,
  });
}

export async function PATCH(req: NextRequest, { params }: Params) {
  const { id } = await params;
  const body = await req.json();

  const allowed = ['status', 'notes', 'business_name', 'contact_name', 'contact_email', 'assigned_to', 'deal_value'];
  const updates: Record<string, unknown> = {};
  for (const key of allowed) {
    if (key in body) updates[key] = body[key];
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 });
  }

  const { data: before } = await supabaseAdmin.from('leads').select('*').eq('id', id).single();

  const { data, error } = await supabaseAdmin
    .from('leads')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await notifyLeadUpdated(id, updates, before ?? undefined);
  return NextResponse.json(data);
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const { id } = await params;

  const { data: lead } = await supabaseAdmin.from('leads').select('*').eq('id', id).single();

  const { error } = await supabaseAdmin
    .from('leads')
    .update({ deleted_at: new Date().toISOString() })
    .eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await notifyLeadDeleted(id, lead ?? undefined);
  return new NextResponse(null, { status: 204 });
}
