import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { notifyLeadCreated } from '@/lib/discord';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, email, phone, business_name, notes, business_niche, city, contact_email, website_style } = body;

  const finalEmail = contact_email || email;
  const finalNiche = business_niche || business_name || 'Neuvedeno';
  const finalCity = city || 'Neuvedeno';

  if (!finalEmail) {
    return NextResponse.json({ error: 'Vyplňte email.' }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin
    .from('leads')
    .insert({
      business_name: business_name || null,
      business_niche: finalNiche,
      city: finalCity,
      contact_name: name || null,
      contact_email: finalEmail,
      notes: notes ? `[Web formulář] ${notes}` : '[Web formulář]',
      website_style: website_style || 'modern-minimal',
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
