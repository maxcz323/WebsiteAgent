import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ leadId: string; activityId: string }> }) {
  const { activityId } = await params;

  const { error } = await supabaseAdmin
    .from('lead_activities')
    .delete()
    .eq('id', activityId);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return new NextResponse(null, { status: 204 });
}
