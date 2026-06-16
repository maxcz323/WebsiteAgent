import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
  maxRetries: 0,
  timeout: 90_000,
});

const STYLE_GUIDES: Record<string, string> = {
  'modern-minimal':
    'clean white space, minimal design, sans-serif fonts, subtle hover animations, monochromatic palette with one accent color',
  'bold-colorful':
    'vibrant gradients, bold typography, high-contrast colors, energetic feel, dynamic card layouts',
  'professional-corporate':
    'navy and gray palette, formal serif/sans mix, structured grid, trust badges, conservative CTA buttons',
  'creative-agency':
    'artistic typography, asymmetric layouts, generous white space, portfolio-style image placeholders',
  'restaurant-food':
    'warm amber and green tones, food imagery placeholders, large hero with CTA to order/book, menu section',
  ecommerce:
    'product grid layout, promotional hero banner, trust badges, clear pricing, shopping CTA buttons',
};

const COLOR_GUIDES: Record<string, string> = {
  auto: '',
  blue: 'Primární barva: modrá (#2563eb nebo podobná). Akcenty v modrých tónech.',
  green: 'Primární barva: zelená (#16a34a nebo podobná). Akcenty v zelených tónech.',
  red: 'Primární barva: červená (#dc2626 nebo podobná). Akcenty v červených tónech.',
  purple: 'Primární barva: fialová (#9333ea nebo podobná). Akcenty ve fialových tónech.',
  orange: 'Primární barva: oranžová (#ea580c nebo podobná). Akcenty v oranžových tónech.',
  gold: 'Primární barva: zlatá/žlutá (#d97706 nebo podobná). Luxusní zlaté akcenty.',
  dark: 'Tmavé pozadí (#0f172a), světlý text, akcenty ve světlých barvách.',
};

export async function generateLandingPage(
  businessNiche: string,
  city: string,
  websiteStyle: string,
  businessName?: string | null,
  colorScheme?: string | null,
  customDescription?: string | null
): Promise<string> {
  const styleGuide = STYLE_GUIDES[websiteStyle] ?? websiteStyle;
  const colorGuide = colorScheme ? (COLOR_GUIDES[colorScheme] ?? '') : '';
  const name = businessName || '{{BUSINESS_NAME}}';

  const prompt = `Vytvoř kompletní, vizuálně ohromující, responzivní HTML landing page pro firmu z oboru "${businessNiche}" sídlící v ${city}. Celý obsah (texty, nadpisy, CTA) piš ČESKY.

Název firmy: ${name}
Vizuální styl: ${styleGuide}
${colorGuide ? `Barevné schéma: ${colorGuide}` : ''}
${customDescription ? `\nVLASTNÍ INSTRUKCE OD ZÁKAZNÍKA (má NEJVYŠŠÍ prioritu):\n${customDescription}` : ''}

TYPOGRAFIE — POVINNÉ:
- Importuj Google Fonts přímo v <style> tagu: @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=Inter:wght@300;400;500;600&display=swap');
- Pro nadpisy (h1, h2, h3) vždy použij Playfair Display nebo jinou prémiovou serifovou/display rodinu.
- Pro texty (p, li, nav) použij Inter nebo podobnou čistou sans-serif rodinu.
- Pokud styl firmy vyžaduje odlišný charakter (moderní, tech), vyber vhodné Google Fonts a importuj je — vždy alespoň 2 různé rodiny.

OBRÁZKY — POVINNÉ:
- Hero sekce MUSÍ mít reálný fotografický background: použij <img> tag nebo CSS background-image s URL z Unsplash.
- Formát URL: https://images.unsplash.com/photo-PHOTO_ID?w=1920&q=80&fit=crop — VŽDY použij konkrétní photo ID z Unsplash které tematicky odpovídá oboru "${businessNiche}".
- Vyber 2–3 různé reálné fotky z Unsplash pro různé sekce (hero, about/proč my, případně services background).
- Hero obrázek musí mít tmavý overlay (rgba(0,0,0,0.5) nebo barevný gradient overlay) aby byl text čitelný.

IKONKY — POVINNÉ:
- ABSOLUTNĚ ŽÁDNÉ EMOJI v celém dokumentu. Emoji jsou neprofesionální.
- Pro ikonky ve služby/features sekcích použij jednoduché SVG ikony inline v HTML, nebo čisté CSS tvary (čtverce, kruhy, šipky).
- Případně použij Unicode symboly jako → ← • — nebo jednoduché čáry/linky jako dekorativní prvky.

DESIGN:
- Vrať POUZE kompletní HTML dokument (<!DOCTYPE html> … </html>). Žádné markdown bloky, žádné vysvětlivky.
- Veškeré CSS v <style> tagu, žádné inline style atributy kde to jde.
- Žádné externí JavaScript knihovny — pouze vanilla JS pokud nutné.
- Stránka musí být VIZUÁLNĚ BOHATÁ a profesionální — výrazné barvy, velká typografie, hero sekce s fotografickým pozadím a overlay.
- Sekce: Hero (fotografické pozadí + overlay + velký nadpis + podnadpis + CTA), Služby (3–4 karty se SVG ikonami), Proč nás zvolit (3 body), Kontakt (formulář UI, nefunkční), Patička.
- Přirozeně zmiň město "${city}" v textu.
- Placeholder telefon: +420 777 123 456 | email: info@${name.toLowerCase().replace(/\s+/g, '')}.cz
- Plně responzivní s mobile-first přístupem.
- Použij CSS custom properties (--primary, --secondary, --bg, --text atd.) pro konzistentní theming.
- DŮLEŽITÉ: Veškerý obsah musí být OKAMŽITĚ viditelný bez JS. Animace NESMÍ používat opacity:0 jako výchozí stav. Pokud chceš animace, používej transform ale opacity musí být vždy 1. Žádné JS pro zobrazení obsahu.`;

  const stream = anthropic.messages.stream({
    model: 'claude-sonnet-4-6',
    max_tokens: 32000,
    messages: [{ role: 'user', content: prompt }],
  });

  const msg = await stream.finalMessage();

  const block = msg.content[0];
  if (block.type !== 'text') throw new Error('Unexpected Anthropic response type');

  let html = block.text.trim();
  html = html.replace(/^```html\s*/i, '').replace(/^```\s*/i, '').replace(/\s*```$/i, '');
  return html.trim();
}

export async function generateEmailDraft(
  businessNiche: string,
  city: string,
  contactName: string | null,
  businessName: string | null,
  previewUrl: string
): Promise<{ subject: string; body: string }> {
  const msg = await anthropic.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 1024,
    messages: [
      {
        role: 'user',
        content: `Napiš krátký, přátelský cold outreach email majiteli firmy z oboru ${businessNiche} v ${city}. Email piš ČESKY.

Detaily:
- Firma: ${businessName || 'jejich firma'}
- Kontakt: ${contactName || 'majiteli'}
- Vytvořili jsme pro ně ZDARMA ukázku webu
- Náhled: ${previewUrl}

Pravidla:
- Předmět: poutavý, max 50 znaků, žádná spamová slova, ŽÁDNÉ emoji
- Text: 3-4 krátké odstavce, konverzační ale profesionální, v češtině, ŽÁDNÉ emoji
- Přirozeně zahrň URL náhledu jako prostý text odkaz (bez emoji před ním)
- Měkká výzva k odpovědi nebo krátkému hovoru
- Přátelský podpis bez emoji

Odpověz POUZE JSON:
{"subject": "...", "body": "..."}`,
      },
    ],
  });

  const block = msg.content[0];
  if (block.type !== 'text') throw new Error('Unexpected Anthropic response type');

  const match = block.text.match(/\{[\s\S]*\}/);
  if (!match) throw new Error('Could not parse email JSON from response');
  return JSON.parse(match[0]) as { subject: string; body: string };
}
