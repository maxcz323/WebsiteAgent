import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET() {
  const [{ data: profiles }, { data: leads }] = await Promise.all([
    supabaseAdmin.from('profiles').select('id, full_name').order('full_name'),
    supabaseAdmin.from('leads').select('created_by, assigned_to, status'),
  ]);

  if (!profiles || !leads) {
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }

  const stats = profiles.map((p) => {
    const myLeads = leads.filter((l) => l.assigned_to === p.id);
    const created = leads.filter((l) => l.created_by === p.id).length;
    return {
      id: p.id,
      full_name: p.full_name,
      created,
      assigned: myLeads.length,
      generated: myLeads.filter((l) => ['generated', 'approved', 'draft_created'].includes(l.status)).length,
      approved: myLeads.filter((l) => ['approved', 'draft_created'].includes(l.status)).length,
      draft_created: myLeads.filter((l) => l.status === 'draft_created').length,
    };
  });

  return NextResponse.json(stats);
}
