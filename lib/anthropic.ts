import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
  maxRetries: 0,
  timeout: 90_000,
});

const STYLE_GUIDES: Record<string, string> = {
  'modern-minimal': `STRIKTNĚ MINIMALISTICKÝ DESIGN — toto je nejdůležitější pravidlo celého webu:
- Barevná paleta: maximálně 2-3 barvy. Dominantní bílá/světle šedá (#fafafa, #f5f5f5), jeden akcent (černá nebo jedna sytá barva). ŽÁDNÉ gradienty.
- Typografie: čistý geometrický sans-serif (Inter, Helvetica, Space Grotesk). Velké nadpisy, tenké fonty (font-weight: 300-400).
- Layout: HODNĚ bílého prostoru (padding min 80-120px). Málo obsahu na stránku — nechej dýchat. Žádné přeplněné sekce.
- Karty a boxy: žádné stíny nebo minimální (box-shadow: 0 1px 3px rgba(0,0,0,0.05)). Tenké border (1px solid #eee). Žádné zaoblené rohy větší než 8px.
- CTA tlačítka: čistá, jednoduchá — buď solid černé s bílým textem, nebo ghost (průhledné s borderem). Žádné gradient tlačítka.
- Animace: pouze jemné hover efekty (opacity, translateY 2-4px). Žádné výrazné animace.
- Inspirace: Apple.com, Stripe.com, Linear.app — čistota, preciznost, vzduch.`,

  'bold-colorful': `VÝRAZNÝ A BAREVNÝ DESIGN — web musí KŘIČET energií:
- Barevná paleta: 3-5 sytých barev. Používej odvážné kombinace (žlutá + fialová, růžová + tyrkysová, oranžová + modrá). Gradienty POVINNÉ a výrazné.
- Pozadí sekcí: střídej barevné bloky — jedna sekce žlutá, další fialová, další bílá s barevnými akcenty. ŽÁDNÉ nudné šedé/bílé na všech sekcích.
- Typografie: tučné a velké (font-weight: 700-900, velikost hero nadpisu min 64px). Použij display font (Sora, Plus Jakarta Sans, Clash Display).
- Karty a boxy: výrazné stíny, velké zaoblení (border-radius: 20-30px), barevné pozadí karet. Hover efekty s výrazným scale(1.05) a změnou barvy.
- CTA tlačítka: velká, pill tvar (border-radius: 999px), gradient pozadí, hover animace (scale, glow efekt). Minimálně 2 barvy v gradientu.
- Dekorace: barevné blob tvary v pozadí (SVG), tečky, vlny, geometrické tvary. Web nesmí být nudný.
- Animace: výrazné — scale, rotate, color shift na hover. Sekce s barevnými přechody.
- Inspirace: Notion.so marketing, Figma.com, moderní SaaS weby — hravé, energické, odvážné.`,

  'professional-corporate': `KORPORÁTNÍ PROFESIONÁLNÍ DESIGN — web musí vyzařovat důvěru a stabilitu:
- Barevná paleta: tmavá navy (#0f1b2d, #1a2744) jako primární, bílá pro obsah, zlatá/modrá (#2563eb) pro akcenty. Žádné křiklavé barvy.
- Typografie: serifový font pro nadpisy (Libre Baskerville, Merriweather, Georgia) — dodává autoritu. Sans-serif pro body text (Source Sans 3, Noto Sans).
- Layout: přísný grid systém, symetrické rozvržení. Sekce oddělené čistými linkami. Žádné asymetrie nebo kreativní experimenty.
- Karty a boxy: jemné stíny, ostré nebo mírně zaoblené rohy (border-radius: 4-8px). Bílé karty na světle šedém pozadí.
- Trust prvky POVINNÉ: "20+ let zkušeností", "500+ spokojených klientů", certifikace, loga partnerů (placeholder šedé boxy), reference s fotkami.
- CTA tlačítka: konzervativní tvary (border-radius: 4-6px), navy nebo tmavě modrá barva. Žádné gradient nebo pill tvary.
- Sekce: MUSÍ obsahovat sekci "Proč nám důvěřovat" s čísly a ikonami, a sekci s referencemi/testimonials.
- Inspirace: McKinsey.com, Deloitte.com, bankovní weby — seriózní, důvěryhodné, konzervativní.`,

  'creative-agency': `KREATIVNÍ AGENTURNÍ DESIGN — web musí ukazovat originalitu a umělecký cit:
- Barevná paleta: buď monochromatická (černá + bílá + jeden výrazný akcent) NEBO odvážná kombinace 2 kontrastních barev. Záleží na náladě firmy.
- Typografie: EXPERIMENTÁLNÍ — použij display/art font pro nadpisy (Cormorant Garamond, Fraunces, Space Mono). Velký kontrast velikostí (hero nadpis 80-120px, body text 16px).
- Layout: ASYMETRICKÝ — text na jedné straně, obrázek přesahuje na druhou. Nestejně velké sloupce (40/60, 30/70). Prvky mimo grid. Overlapping elementy.
- Sekce portfolio/galerie POVINNÉ: velké obrázky, masonry nebo bento grid, hover efekty s overlay textem.
- White space: HODNĚ — nechej design dýchat, ale asymetricky (víc prostoru na jedné straně).
- CTA tlačítka: unikátní — underline styl, nebo text s šipkou →, nebo ghost s animací. NE klasické obdélníky.
- Kurzor a interakce: hover efekty na obrázcích (reveal, zoom, color shift). Jemné parallax efekty.
- Dekorace: minimální ale promyšlené — jedna výrazná linka, kruh, nebo typografický prvek jako dekorace.
- Inspirace: Awwwards.com weby, 21hrs.space, Bureau Borsche — umělecké, konceptuální, unikátní.`,

  'restaurant-food': `RESTAURAČNÍ/FOOD DESIGN — web musí vyvolat chuť a atmosféru:
- Barevná paleta: teplé tóny POVINNÉ — tmavě zelená (#2d5016), teplá béžová (#f5f0e8), hnědá (#8b6914), vínová (#722f37), krémová (#faf7f2). ŽÁDNÁ modrá nebo studené tóny.
- Pozadí: tmavé sekce (tmavě zelená nebo černá) střídané s krémovými/béžovými. Dodává to eleganci a kontrast.
- Typografie: elegantní serifový font pro nadpisy (Playfair Display, Cormorant Garamond) — dodává restaurační atmosféru. Script/kurzíva font pro dekorativní texty (název jídla, citáty).
- MENU SEKCE POVINNÉ: přehledné rozdělení na kategorie (Předkrmy, Hlavní jídla, Dezerty, Nápoje) s cenami. Formát: název jídla ... cena. Čistý, čitelný layout.
- Hero: full-width fotka jídla nebo interiéru s tmavým overlay. Velký název restaurace + slogan + CTA "Rezervovat stůl".
- Galerie/fotky: minimálně 4-6 fotek z Unsplash — jídlo, interiér, kuchyně. Zobrazené ve stylové galerii.
- Otevírací doba POVINNÉ: přehledná tabulka s dny a hodinami.
- Rezervace/kontakt: formulář nebo výrazné CTA "Zarezervujte si stůl" s telefonem.
- Dekorace: jemné ilustrace (listy, bylinky jako SVG), texturované pozadí, organické tvary.
- Inspirace: prémiové restaurační weby — Noma, The French Laundry, lokální bistra.`,

  ecommerce: `E-COMMERCE DESIGN — web musí prodávat a budovat důvěru:
- Barevná paleta: čistá a profesionální. Bílé pozadí pro produkty, jeden výrazný akcent pro CTA (zelená "Koupit", oranžová "Do košíku", červená pro slevy). Žádné tmavé pozadí u produktů.
- Typografie: čistý sans-serif (Inter, DM Sans, Plus Jakarta Sans). Důraz na čitelnost cen — ceny velké a tučné (font-size: 24-32px, font-weight: 700).
- PRODUKT GRID POVINNÝ: minimálně 6-8 produktových karet v gridu (3 sloupce desktop, 2 mobile). Každá karta: obrázek nahoře, název, krátký popis, cena, CTA tlačítko.
- Hero: promo banner s aktuální nabídkou/slevou. Výrazný headline + CTA "Nakupovat" nebo "Prohlédnout kolekci". Countdown timer na slevu (statický).
- Trust prvky POVINNÉ: "Doprava zdarma nad 1500 Kč", "Vrácení do 30 dnů", "Bezpečná platba", "4.8/5 hodnocení". Zobrazené jako ikonky s textem v řadě pod hero.
- Kategorie sekce: vizuální bloky s fotkami kategorií (3-4 kategorie).
- Testimonials: hodnocení zákazníků s hvězdičkami (★★★★★) a jménem.
- Newsletter: sekce "Získejte 10% slevu" s emailovým formulářem.
- Sticky navbar: s logem, vyhledáváním (placeholder), ikonou košíku s číslem.
- CTA tlačítka: výrazná, kontrastní barva, velká (padding: 14px 32px). Hover s tmavším odstínem.
- Inspirace: Shopify themes, About You, Alza.cz — přehledné, prodejní, důvěryhodné.`,
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
- Pro obrázky používej VÝHRADNĚ Picsum: https://picsum.photos/seed/UNIKATNI_SLOVO/SIRKA/VYSKA
- Příklady: https://picsum.photos/seed/hero-${seed}/1920/1080, https://picsum.photos/seed/services-${seed}/800/600
- Pro každý obrázek použij JINÉ seed slovo (hero, about, service1, service2, gallery1, atd.) aby byly fotky různé.
- NIKDY nepoužívej Unsplash URL — ty nefungují s vymyšlenými photo ID.
- Místo fotek konkrétních podniků (interiéry kaváren, restaurací atd.) používej ABSTRAKTNÍ nebo tematické fotky — barvy, textury, příroda, architektura. Web je NÁHLED/UKÁZKA, ne finální produkt — nesmí vypadat jako fotka z cizího podniku.
- Hero obrázek: použij CSS gradient overlay aby byl text čitelný.
- Kde je to vhodné, místo fotek použij CSS gradienty, barevné bloky, SVG ilustrace nebo geometrické tvary.

ZAKÁZANÉ PRVKY — toto NIKDY nepoužívej:
- ŽÁDNÝ scrolling marquee / running text / ticker pás. Tenhle prvek je otřepaný a generický.
- ŽÁDNÝ scroll indikátor ("SCROLL" text, scroll šipka, scroll animace). Uživatel ví jak scrollovat.
- ŽÁDNÉ emoji v celém dokumentu.
- ŽÁDNÝ horizontálně scrollující obsah.
- ŽÁDNÉ animace které skrývají obsah (opacity:0 jako výchozí stav).

IKONKY:
- Použij jednoduché SVG ikony inline v HTML, nebo čisté CSS tvary (čtverce, kruhy, šipky).
- Unicode symboly jako → ← • — jsou OK.

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
- Obsah MUSÍ být viditelný bez JS.
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
