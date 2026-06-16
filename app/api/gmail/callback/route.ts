import { NextRequest, NextResponse } from 'next/server';
import { exchangeCodeForTokens, saveTokens } from '@/lib/gmail';

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get('code');
  const error = req.nextUrl.searchParams.get('error');

  if (error || !code) {
    return NextResponse.redirect(new URL('/dashboard?gmail=error', req.url));
  }

  try {
    const tokens = await exchangeCodeForTokens(code);
    await saveTokens(tokens);
    return NextResponse.redirect(new URL('/dashboard?gmail=connected', req.url));
  } catch (err: unknown) {
    console.error('Gmail OAuth error:', err);
    return NextResponse.redirect(new URL('/dashboard?gmail=error', req.url));
  }
}
