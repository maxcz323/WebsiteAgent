import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { notifyLeadCreated } from '@/lib/discord';

export async function POST(req: NextRequest) {
  const { business_name, business_niche, city, contact_email, notes } = await req.json();

  if (!business_niche || !city || !contact_email) {
    return NextResponse.json({ error: 'Vyplňte obor, město a email.' }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin
    .from('leads')
    .insert({
      business_name: business_name || null,
      business_niche,
      city,
      contact_email,
      notes: notes ? `[Web formulář] ${notes}` : '[Web formulář]',
      website_style: 'modern-minimal',
      color_scheme: 'auto',
      status: 'new',
      created_by: null,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await notifyLeadCreated({ ...data, created_by_name: 'Web formulář' });
  return NextResponse.json({ success: true }, { status: 201 });
}
