import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { deleteCalendarEvent } from '@/lib/google-calendar';

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ leadId: string; activityId: string }> }) {
  const { activityId } = await params;

  // Get the activity to check for Google Calendar event
  const { data: activity } = await supabaseAdmin
    .from('lead_activities')
    .select('google_event_id')
    .eq('id', activityId)
    .single();

  if (activity?.google_event_id) {
    await deleteCalendarEvent(activity.google_event_id);
  }

  const { error } = await supabaseAdmin
    .from('lead_activities')
    .delete()
    .eq('id', activityId);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return new NextResponse(null, { status: 204 });
}
