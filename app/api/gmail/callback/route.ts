import { NextRequest, NextResponse } from 'next/server';
import { exchangeCodeForTokens, saveTokens } from '@/lib/gmail';

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get('code');
  const error = req.nextUrl.searchParams.get('error');

  if (error || !code) {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://www.website-agent.cz';
    return NextResponse.redirect(`${appUrl}/admin/dashboard?gmail=error`);
  }

  try {
    const tokens = await exchangeCodeForTokens(code);
    console.log('Gmail tokens received:', Object.keys(tokens));
    await saveTokens(tokens);
    console.log('Gmail tokens saved successfully');
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://www.website-agent.cz';
    return NextResponse.redirect(`${appUrl}/admin/dashboard?gmail=connected`);
  } catch (err: unknown) {
    console.error('Gmail OAuth error:', err);
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://www.website-agent.cz';
    const msg = err instanceof Error ? encodeURIComponent(err.message) : 'unknown';
    return NextResponse.redirect(`${appUrl}/admin/dashboard?gmail=error&reason=${msg}`);
  }
}
