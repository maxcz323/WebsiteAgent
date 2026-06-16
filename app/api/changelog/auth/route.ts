import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServer } from '@/lib/supabase-server';

const PASSWORD = process.env.CHANGELOG_PASSWORD ?? 'websiteagent';
const COOKIE = 'cl_auth';

export async function POST(req: NextRequest) {
  const { password } = await req.json();
  if (password !== PASSWORD) {
    return NextResponse.json({ error: 'Nesprávné heslo' }, { status: 401 });
  }
  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE, '1', {
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 30,
    path: '/changelog',
  });
  return res;
}

export async function GET(req: NextRequest) {
  const cookieAuth = req.cookies.get(COOKIE)?.value === '1';
  if (cookieAuth) return NextResponse.json({ authenticated: true });

  const supabase = await createSupabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  return NextResponse.json({ authenticated: !!user });
}
