type Color = number;
const COLORS = {
  green:  0x57f287,
  yellow: 0xfee75c,
  red:    0xed4245,
  blue:   0x5865f2,
  grey:   0x95a5a6,
} satisfies Record<string, Color>;

type Field = { name: string; value: string; inline?: boolean };

interface EmbedOptions {
  title: string;
  description?: string;
  color: Color;
  fields?: Field[];
  footer?: string;
}

async function sendEmbed(embed: EmbedOptions) {
  const WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL;
  if (!WEBHOOK_URL) return;
  try {
    await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        embeds: [{
          title: embed.title,
          description: embed.description,
          color: embed.color,
          fields: embed.fields,
          footer: embed.footer ? { text: embed.footer } : undefined,
          timestamp: new Date().toISOString(),
        }],
      }),
    });
  } catch {
    // non-blocking — never crash the app over a Discord notification
  }
}

type Lead = {
  id: string;
  business_name?: string | null;
  business_niche: string;
  city: string;
  website_style: string;
  status: string;
  contact_name?: string | null;
  contact_email?: string | null;
  created_by_name?: string | null;
};

export async function notifyLeadCreated(lead: Lead) {
  await sendEmbed({
    title: '🆕 Nový lead vytvořen',
    color: COLORS.green,
    fields: [
      { name: 'Firma', value: lead.business_name || '—', inline: true },
      { name: 'Niche', value: lead.business_niche, inline: true },
      { name: 'Město', value: lead.city, inline: true },
      { name: 'Styl webu', value: lead.website_style, inline: true },
      { name: 'Kontakt', value: lead.contact_name || '—', inline: true },
      { name: 'Email', value: lead.contact_email || '—', inline: true },
      ...(lead.created_by_name ? [{ name: 'Vytvořil', value: lead.created_by_name, inline: true }] : []),
    ],
    footer: `ID: ${lead.id}`,
  });
}

export async function notifyLeadUpdated(id: string, changes: Record<string, unknown>, before?: Partial<Lead>, leadName?: string) {
  const isStatusChange = 'status' in changes;
  const fields: Field[] = Object.entries(changes).map(([key, val]) => {
    const label = key === 'status' ? 'Status'
      : key === 'notes' ? 'Poznámky'
      : key === 'assigned_to' ? 'Přiřazen'
      : key === 'business_name' ? 'Firma'
      : key === 'contact_name' ? 'Kontakt'
      : key === 'contact_email' ? 'Email'
      : key;

    const oldVal = before?.[key as keyof Lead];
    const valueStr = oldVal !== undefined && oldVal !== val
      ? `~~${oldVal}~~ → ${val ?? '—'}`
      : String(val ?? '—');

    return { name: label, value: valueStr, inline: true };
  });

  await sendEmbed({
    title: isStatusChange
      ? `🔄 Změna statusu — ${leadName || 'Lead'}`
      : `✏️ ${leadName || 'Lead'} upraven`,
    color: isStatusChange ? COLORS.yellow : COLORS.blue,
    fields,
    footer: `ID: ${id}`,
  });
}

export async function notifyLeadDeleted(id: string, lead?: Partial<Lead>) {
  await sendEmbed({
    title: '🗑️ Lead smazán',
    color: COLORS.red,
    fields: lead ? [
      { name: 'Firma', value: lead.business_name || '—', inline: true },
      { name: 'Niche', value: lead.business_niche || '—', inline: true },
      { name: 'Město', value: lead.city || '—', inline: true },
    ] : [],
    footer: `ID: ${id}`,
  });
}

export async function notifyPageGenerated(leadId: string, lead?: Partial<Lead>) {
  await sendEmbed({
    title: '✅ Landing page vygenerována',
    color: COLORS.green,
    fields: lead ? [
      { name: 'Firma', value: lead.business_name || '—', inline: true },
      { name: 'Niche', value: lead.business_niche || '—', inline: true },
      { name: 'Město', value: lead.city || '—', inline: true },
      { name: 'Styl', value: lead.website_style || '—', inline: true },
    ] : [],
    footer: `Lead ID: ${leadId}`,
  });
}

export async function notifyGenerationFailed(leadId: string, reason: string) {
  await sendEmbed({
    title: '❌ Generování stránky selhalo',
    color: COLORS.red,
    description: reason,
    footer: `Lead ID: ${leadId}`,
  });
}
