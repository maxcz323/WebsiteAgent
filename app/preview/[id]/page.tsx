import { supabaseAdmin } from '@/lib/supabase';

export default async function PreviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const { data } = await supabaseAdmin
    .from('generated_pages')
    .select('html_content')
    .eq('lead_id', id)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  if (!data || !data.html_content) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
          color: '#6b7280',
          fontFamily: 'sans-serif',
        }}
      >
        Tento lead zatím nemá vygenerovaný web.
      </div>
    );
  }

  return (
    <iframe
      srcDoc={data.html_content}
      title="Website Preview"
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
        border: 'none',
        display: 'block',
      }}
    />
  );
}
