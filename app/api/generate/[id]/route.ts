import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { generateLandingPage } from '@/lib/anthropic';
import { notifyPageGenerated, notifyGenerationFailed } from '@/lib/discord';

export const maxDuration = 300;

export async function POST(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const { data: lead, error: leadError } = await supabaseAdmin
    .from('leads')
    .select('*')
    .eq('id', id)
    .single();

  if (leadError || !lead) {
    return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
  }

  await supabaseAdmin.from('leads').update({ status: 'generating' }).eq('id', id);

  try {
    const html = await generateLandingPage(
      lead.business_niche,
      lead.city,
      lead.website_style,
      lead.business_name,
      lead.color_scheme,
      lead.custom_description
    );

    await supabaseAdmin.from('generated_pages').delete().eq('lead_id', id);
    const { error: pageError } = await supabaseAdmin.from('generated_pages').insert({
      lead_id: id,
      html_content: html,
    });

    if (pageError) throw new Error(pageError.message);

    await supabaseAdmin.from('leads').update({ status: 'generated' }).eq('id', id);

    await notifyPageGenerated(id, lead);
    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    await supabaseAdmin.from('leads').update({ status: 'new' }).eq('id', id);
    const message = err instanceof Error ? err.message : 'Generation failed';
    await notifyGenerationFailed(id, message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
