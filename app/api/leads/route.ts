import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { createSupabaseServer } from '@/lib/supabase-server';
import { notifyLeadCreated } from '@/lib/discord';

export async function GET() {
  const { data: leads, error } = await supabaseAdmin
    .from('leads')
    .select('*')
    .order('created_at', { ascending: false });

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

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { business_niche, city, website_style, business_name, contact_name, contact_email, notes, color_scheme, custom_description, deal_value } = body;

  if (!business_niche || !city || !website_style) {
    return NextResponse.json({ error: 'business_niche, city, and website_style are required' }, { status: 400 });
  }

  const supabase = await createSupabaseServer();
  const { data: { user } } = await supabase.auth.getUser();

  const { data, error } = await supabaseAdmin
    .from('leads')
    .insert({
      business_niche,
      city,
      website_style,
      business_name: business_name || null,
      contact_name: contact_name || null,
      contact_email: contact_email || null,
      notes: notes || null,
      color_scheme: color_scheme || 'auto',
      custom_description: custom_description || null,
      deal_value: deal_value ? Number(deal_value) : null,
      status: 'new',
      created_by: user?.id ?? null,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await notifyLeadCreated({ ...data, created_by_name: null });
  return NextResponse.json(data, { status: 201 });
}
