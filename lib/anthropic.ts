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

  // Generate a random seed to force unique designs each time
  const seed = Math.random().toString(36).slice(2, 10);
  const layoutVariants = [
    'split hero (text vlevo, obrázek vpravo)',
    'full-width hero s video-style overlay a centered textem',
    'hero s diagonálním dělením (šikmá linka mezi obrázkem a barvou)',
    'hero s velkým obrázkem dole a textem nahoře na čistém pozadí',
    'dark immersive hero na celou obrazovku s parallax efektem',
    'hero s geometrickými tvary a floating kartami',
    'minimalistický hero jen s velkým nadpisem a jednou barvou, obrázek až v další sekci',
    'hero s bočním vertikálním menu a full-bleed fotkou',
  ];
  const sectionVariants = [
    'bento grid (nestejně velké karty v mřížce)',
    'horizontální scroll sekce s kartami',
    'timeline/kroky vertikálně s čísly a ikonami',
    'velké čísla/statistiky s countery',
    'tabs s přepínáním obsahu',
    'accordion/FAQ styl',
    'masonry grid s obrázky a textem',
    'full-width sekce střídající světlé a tmavé pozadí',
  ];
  const decorVariants = [
    'blob tvary v pozadí (SVG)',
    'jemné geometrické čáry a úhly',
    'tečkovaný/grid pattern v pozadí',
    'gradient mesh efekty',
    'kruhové a organické tvary',
    'žádné dekorace — čistý minimál',
    'diagonální sekce dělení',
    'jemný noise/grain texture',
  ];
  const fontPairs = [
    'Playfair Display + Inter',
    'DM Serif Display + DM Sans',
    'Fraunces + Space Grotesk',
    'Libre Baskerville + Source Sans 3',
    'Cormorant Garamond + Montserrat',
    'Sora + Crimson Pro',
    'Plus Jakarta Sans + Lora',
    'Outfit + Merriweather',
  ];
  const pick = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];
  const chosenLayout = pick(layoutVariants);
  const chosenSection = pick(sectionVariants);
  const chosenDecor = pick(decorVariants);
  const chosenFonts = pick(fontPairs);

  const prompt = `Vytvoř kompletní, vizuálně ohromující, responzivní HTML landing page pro firmu z oboru "${businessNiche}" sídlící v ${city}. Celý obsah (texty, nadpisy, CTA) piš ČESKY.

Název firmy: ${name}
Vizuální styl: ${styleGuide}
${colorGuide ? `Barevné schéma: ${colorGuide}` : ''}
${customDescription ? `\nVLASTNÍ INSTRUKCE OD ZÁKAZNÍKA (má NEJVYŠŠÍ prioritu):\n${customDescription}` : ''}

UNIKÁTNÍ DESIGN — SEED ${seed}:
Každý web MUSÍ vypadat zásadně jinak. Pro tento konkrétní web POVINNĚ použij:
- LAYOUT HERO: ${chosenLayout}
- LAYOUT SEKCÍ: ${chosenSection}
- DEKORATIVNÍ PRVKY: ${chosenDecor}
- FONTY: ${chosenFonts} (importuj z Google Fonts v <style> tagu)
- Vymysli unikátní barevnou paletu, která odpovídá oboru "${businessNiche}" — NEvyužívej generické modré/šedé pokud to obor nevyžaduje.
- Zvol unikátní border-radius styl (ostré rohy NEBO velké zaoblení NEBO pill tvary — ale konzistentně).
- Navrhni unikátní CTA tlačítka (ne vždy stejný obdélník — zkus pill, ghost, s ikonou, s animací, atd.).

TYPOGRAFIE:
- Importuj zvolené Google Fonts v <style> tagu přes @import url().
- Nadpisy a body text MUSÍ mít výrazně odlišný charakter (serif vs sans-serif, display vs text, atd.).
- Experimentuj s velikostmi — hero nadpis může být extrémně velký (clamp(48px, 8vw, 96px)) nebo naopak elegantně malý.

OBRÁZKY — POVINNÉ:
- Hero sekce MUSÍ mít reálný fotografický background z Unsplash.
- Formát URL: https://images.unsplash.com/photo-PHOTO_ID?w=1920&q=80&fit=crop — použij konkrétní photo ID tematicky odpovídající oboru "${businessNiche}".
- Vyber 3–5 různých reálných fotek z Unsplash pro různé sekce.
- Overlay nemusí být vždy tmavý — zkus barevný gradient overlay, duotone efekt, nebo jemný blur.

IKONKY:
- ABSOLUTNĚ ŽÁDNÉ EMOJI. Použij SVG ikony inline nebo čisté CSS tvary.

SEKCE — vymysli unikátní strukturu, nepoužívej vždy stejné pořadí. Vyber 5-7 z těchto:
Hero, O nás/Příběh, Služby/Co děláme, Proces/Jak pracujeme, Čísla/Statistiky, Reference/Testimonials, Galerie/Portfolio, FAQ, Ceník, Kontakt/CTA, Patička.
Pořadí a výběr sekcí přizpůsob oboru — restaurace potřebuje menu a galerii, advokát potřebuje důvěru a reference, atd.

TECHNICKÉ:
- Vrať POUZE kompletní HTML (<!DOCTYPE html> … </html>). Žádný markdown.
- Veškeré CSS v <style> tagu. Používej CSS custom properties.
- Žádné externí JS knihovny.
- Plně responzivní, mobile-first.
- Přirozeně zmiň město "${city}" v textu.
- Placeholder: +420 777 123 456 | info@${name.toLowerCase().replace(/\s+/g, '')}.cz
- Obsah MUSÍ být viditelný bez JS. Animace nesmí používat opacity:0 jako výchozí stav.
- Stránka musí vypadat jako od profesionálního designéra — NE jako generický template.`;

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
