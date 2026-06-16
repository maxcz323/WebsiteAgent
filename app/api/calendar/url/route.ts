import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const token = process.env.CALENDAR_SECRET;
  if (!token) return NextResponse.json({ url: null });

  const host = req.headers.get('host') ?? '';
  const protocol = host.includes('localhost') ? 'http' : 'https';
  const webcalUrl = `webcal://${host}/api/calendar?token=${token}`;
  const httpsUrl = `${protocol}://${host}/api/calendar?token=${token}`;

  return NextResponse.json({ webcalUrl, httpsUrl });
}
