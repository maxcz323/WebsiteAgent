import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

const TYPE_LABELS: Record<string, string> = {
  call: '📞 Zavolat',
  email: '✉️ Napsat',
  meeting: '🤝 Schůzka',
  other: '📌 Jiné',
};

function toICalUTC(iso: string): string {
  return new Date(iso).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z');
}

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('token');
  const secret = process.env.CALENDAR_SECRET;

  if (!secret || token !== secret) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

  const { data: activities } = await supabaseAdmin
    .from('lead_activities')
    .select('*, leads!lead_id(business_name, business_niche, city)')
    .gte('scheduled_at', sevenDaysAgo)
    .order('scheduled_at', { ascending: true });

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://websiteagent.vercel.app';
  const now = toICalUTC(new Date().toISOString());

  const events = (activities ?? []).map((a: Record<string, unknown>) => {
    const lead = a.leads as { business_name: string | null; business_niche: string; city: string } | null;
    const name = lead?.business_name || `${lead?.business_niche} — ${lead?.city}`;
    const dtstart = toICalUTC(a.scheduled_at as string);
    const dtend = toICalUTC(new Date(new Date(a.scheduled_at as string).getTime() + 60 * 60 * 1000).toISOString());
    const summary = `${TYPE_LABELS[a.type as string] ?? a.type} — ${name}`;
    const lines = [
      'BEGIN:VEVENT',
      `UID:wa-activity-${a.id}@websiteagent`,
      `DTSTAMP:${now}`,
      `DTSTART:${dtstart}`,
      `DTEND:${dtend}`,
      `SUMMARY:${summary}`,
      `URL:${appUrl}/leads/${a.lead_id}`,
    ];
    if (a.notes) lines.push(`DESCRIPTION:${(a.notes as string).replace(/\n/g, '\\n')}`);
    lines.push('END:VEVENT');
    return lines.join('\r\n');
  });

  const ical = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//WebsiteAgent//Calendar//CS',
    'X-WR-CALNAME:WebsiteAgent Pipeline',
    'X-WR-TIMEZONE:Europe/Prague',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    ...events,
    'END:VCALENDAR',
  ].join('\r\n');

  return new NextResponse(ical, {
    headers: {
      'Content-Type': 'text/calendar; charset=utf-8',
      'Content-Disposition': 'inline; filename="websiteagent.ics"',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
    },
  });
}
