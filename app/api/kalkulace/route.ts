import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { notifyLeadCreated } from '@/lib/discord';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, email, phone, serviceSlug, serviceTitle, basePrice, addons, totalPrice, specialRequirements } = body;

  if (!email || !serviceSlug) {
    return NextResponse.json({ error: 'Email a typ služby jsou povinné.' }, { status: 400 });
  }

  const notesJson = JSON.stringify({
    source: 'kalkulace',
    serviceSlug,
    serviceTitle,
    basePrice,
    addons,
    totalPrice,
    phone: phone || null,
    specialRequirements: specialRequirements || null,
  });

  const { data, error } = await supabaseAdmin
    .from('leads')
    .insert({
      business_name: null,
      business_niche: serviceTitle,
      city: 'Z webu',
      contact_name: name || null,
      contact_email: email,
      notes: `__KALKULACE__${notesJson}`,
      website_style: 'modern-minimal',
      color_scheme: 'auto',
      status: 'new',
      deal_value: totalPrice,
      created_by: null,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await notifyLeadCreated({ ...data, created_by_name: 'Z webu – kalkulace' });
  return NextResponse.json({ success: true }, { status: 201 });
}
