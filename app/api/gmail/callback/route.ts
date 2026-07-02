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
    await saveTokens(tokens);
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://www.website-agent.cz';
    return NextResponse.redirect(`${appUrl}/admin/dashboard?gmail=connected`);
  } catch (err: unknown) {
    console.error('Gmail OAuth error:', err);
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://www.website-agent.cz';
    return NextResponse.redirect(`${appUrl}/admin/dashboard?gmail=error`);
  }
}
