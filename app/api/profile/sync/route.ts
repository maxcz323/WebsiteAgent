import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { createSupabaseServer } from '@/lib/supabase-server';

export async function POST() {
  const supabase = await createSupabaseServer();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

  const fullName =
    user.user_metadata?.full_name ||
    user.email?.split('@')[0] ||
    '';

  await supabaseAdmin
    .from('profiles')
    .upsert({ id: user.id, full_name: fullName }, { onConflict: 'id' });

  return NextResponse.json({ ok: true });
}
