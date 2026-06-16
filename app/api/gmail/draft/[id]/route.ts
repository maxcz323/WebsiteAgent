import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { generateEmailDraft } from '@/lib/anthropic';
import { createGmailDraft, isGmailConnected } from '@/lib/gmail';

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  // Fetch lead
  const { data: lead, error: leadError } = await supabaseAdmin
    .from('leads')
    .select('*')
    .eq('id', id)
    .single();

  if (leadError || !lead) {
    return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
  }

  if (lead.status !== 'approved') {
    return NextResponse.json({ error: 'Lead must be approved before creating a draft' }, { status: 400 });
  }

  if (!lead.contact_email) {
    return NextResponse.json({ error: 'Lead has no contact email' }, { status: 400 });
  }

  const connected = await isGmailConnected();
  if (!connected) {
    return NextResponse.json({ error: 'Gmail not connected' }, { status: 400 });
  }

  // Mark as creating_draft
  await supabaseAdmin.from('leads').update({ status: 'creating_draft' }).eq('id', id);

  try {
    const appUrl =
      process.env.NEXT_PUBLIC_APP_URL ||
      `${req.nextUrl.protocol}//${req.nextUrl.host}`;
    const previewUrl = `${appUrl}/preview/${id}`;

    // Generate email content with Claude
    const { subject, body } = await generateEmailDraft(
      lead.business_niche,
      lead.city,
      lead.contact_name,
      lead.business_name,
      previewUrl
    );

    // Create Gmail draft (not sent — user reviews it in Gmail)
    const gmailDraftId = await createGmailDraft(lead.contact_email, subject, body);

    // Store draft record
    await supabaseAdmin.from('email_drafts').insert({
      lead_id: id,
      gmail_draft_id: gmailDraftId,
      subject,
      body,
    });

    // Mark as draft_created
    await supabaseAdmin.from('leads').update({ status: 'draft_created' }).eq('id', id);

    return NextResponse.json({ success: true, gmailDraftId });
  } catch (err: unknown) {
    await supabaseAdmin.from('leads').update({ status: 'approved' }).eq('id', id);
    const message = err instanceof Error ? err.message : 'Draft creation failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
