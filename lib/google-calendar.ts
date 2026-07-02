import { google } from 'googleapis';
import { getStoredTokens, saveTokens } from './gmail';

const TYPE_LABELS: Record<string, string> = {
  call: '📞 Zavolat',
  email: '✉️ Napsat',
  meeting: '🤝 Schůzka',
  other: '📌 Jiné',
};

function makeOAuth2Client() {
  return new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID!,
    process.env.GOOGLE_CLIENT_SECRET!,
    process.env.GOOGLE_REDIRECT_URI!
  );
}

async function getCalendarClient() {
  const tokens = await getStoredTokens();
  if (!tokens?.refresh_token) return null;

  const client = makeOAuth2Client();
  client.setCredentials(tokens);

  client.on('tokens', async (newTokens) => {
    const merged = { ...tokens, ...newTokens };
    await saveTokens(merged);
  });

  return google.calendar({ version: 'v3', auth: client });
}

export async function createCalendarEvent(activity: {
  id: string;
  type: string;
  scheduled_at: string;
  notes: string | null;
  lead_id: string;
  leadName: string;
}): Promise<string | null> {
  const calendar = await getCalendarClient();
  if (!calendar) return null;

  try {
    const startTime = new Date(activity.scheduled_at);
    const endTime = new Date(startTime.getTime() + 60 * 60 * 1000); // 1 hour

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://www.website-agent.cz';

    const { data } = await calendar.events.insert({
      calendarId: 'primary',
      requestBody: {
        summary: `${TYPE_LABELS[activity.type] ?? activity.type} — ${activity.leadName}`,
        description: [
          activity.notes || '',
          '',
          `Lead: ${appUrl}/admin/leads/${activity.lead_id}`,
        ].join('\n'),
        start: { dateTime: startTime.toISOString(), timeZone: 'Europe/Prague' },
        end: { dateTime: endTime.toISOString(), timeZone: 'Europe/Prague' },
        reminders: {
          useDefault: false,
          overrides: [
            { method: 'popup', minutes: 15 },
          ],
        },
      },
    });

    return data.id ?? null;
  } catch (err) {
    console.error('Google Calendar create event error:', err);
    return null;
  }
}

export async function deleteCalendarEvent(googleEventId: string): Promise<void> {
  const calendar = await getCalendarClient();
  if (!calendar) return;

  try {
    await calendar.events.delete({
      calendarId: 'primary',
      eventId: googleEventId,
    });
  } catch (err) {
    console.error('Google Calendar delete event error:', err);
  }
}
