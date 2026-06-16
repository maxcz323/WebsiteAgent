import { google } from 'googleapis';
import { supabaseAdmin } from './supabase';

function makeOAuth2Client() {
  return new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID!,
    process.env.GOOGLE_CLIENT_SECRET!,
    process.env.GOOGLE_REDIRECT_URI!
  );
}

export function getAuthUrl(): string {
  const client = makeOAuth2Client();
  return client.generateAuthUrl({
    access_type: 'offline',
    scope: ['https://www.googleapis.com/auth/gmail.compose'],
    prompt: 'consent',
  });
}

export async function exchangeCodeForTokens(code: string) {
  const client = makeOAuth2Client();
  const { tokens } = await client.getToken(code);
  return tokens;
}

export async function saveTokens(tokens: object) {
  await supabaseAdmin.from('settings').upsert(
    { key: 'gmail_tokens', value: tokens, updated_at: new Date().toISOString() },
    { onConflict: 'key' }
  );
}

export async function getStoredTokens(): Promise<Record<string, unknown> | null> {
  const { data } = await supabaseAdmin
    .from('settings')
    .select('value')
    .eq('key', 'gmail_tokens')
    .single();
  return (data?.value as Record<string, unknown>) ?? null;
}

export async function isGmailConnected(): Promise<boolean> {
  const tokens = await getStoredTokens();
  return !!(tokens?.refresh_token);
}

export async function createGmailDraft(
  to: string,
  subject: string,
  body: string
): Promise<string> {
  const tokens = await getStoredTokens();
  if (!tokens?.refresh_token) {
    throw new Error('Gmail not connected. Connect your account from the dashboard first.');
  }

  const client = makeOAuth2Client();
  client.setCredentials(tokens);

  // Refresh silently if needed; persist updated credentials
  client.on('tokens', async (newTokens) => {
    const merged = { ...tokens, ...newTokens };
    await saveTokens(merged);
  });

  const gmail = google.gmail({ version: 'v1', auth: client });

  const encodedSubject = `=?UTF-8?B?${Buffer.from(subject, 'utf-8').toString('base64')}?=`;
  const htmlBody = body.replace(/\n/g, '<br>');
  const rawEmail = [
    `To: ${to}`,
    `Subject: ${encodedSubject}`,
    'MIME-Version: 1.0',
    'Content-Type: text/html; charset=utf-8',
    '',
    htmlBody,
  ].join('\r\n');

  const encoded = Buffer.from(rawEmail, 'utf-8')
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');

  const { data } = await gmail.users.drafts.create({
    userId: 'me',
    requestBody: { message: { raw: encoded } },
  });

  return data.id!;
}
