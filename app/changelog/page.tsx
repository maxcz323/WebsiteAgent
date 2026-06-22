'use client';

import { useEffect, useState } from 'react';

type ChangeType = 'feat' | 'fix' | 'change';

interface Change {
  type: ChangeType;
  text: string;
}

interface Version {
  version: string;
  date: string;
  changes: Change[];
}

const CHANGELOG: Version[] = [
  {
    version: '4.03',
    date: '22. 6. 2026',
    changes: [
      { type: 'change', text: 'Hero — obdélníky jen jako outline (border ACCENT, transparent fill). Monitor posunut výš (marginBottom: 180px).' },
    ],
  },
  {
    version: '4.02',
    date: '22. 6. 2026',
    changes: [
      { type: 'change', text: 'Hero — tablet i monitor jako plain tmavé obdélníky (žádná grafika). Monitor nakloněn stejně jako tablet (-14°), přijíždí zprava.' },
    ],
  },
  {
    version: '4.01',
    date: '22. 6. 2026',
    changes: [
      { type: 'feat', text: 'Hero — přidán landscape monitor (460px, rotate:+12°) vedle tabletu, přijíždí zprava. Oba posunuty níž (marginTop:120px). Watermark přesunut výš (top:8%).' },
    ],
  },
  {
    version: '4.00',
    date: '22. 6. 2026',
    changes: [
      { type: 'feat', text: 'Hero — monitor nahrazen nakloněným tabletem (portrait, 320px, borderRadius 32px). Animace ze zleva zespodu (x:-200 y:140 rotate:-32 → x:0 y:0 rotate:-14). Preview obsah přizpůsoben portrait layoutu.' },
    ],
  },
  {
    version: '3.99',
    date: '22. 6. 2026',
    changes: [
      { type: 'fix', text: 'Hero — watermark tmavší (opacity 0.22 tmavá modrá). Monitor rozšířen na 780px, výška obrazovky 420px (16:9 poměr), stojan upraven.' },
    ],
  },
  {
    version: '3.98',
    date: '22. 6. 2026',
    changes: [
      { type: 'fix', text: 'Hero — laptop nahrazen zpět monitorem se stojanem. Mount animace (y:80→0) místo scroll-driven. Watermark přesunut výš (top:22%). Odstraněny floating badges (48h, Web schválen, 50+ klientů).' },
    ],
  },
  {
    version: '3.97',
    date: '22. 6. 2026',
    changes: [
      { type: 'feat', text: 'Hero sekce — monitor nahrazen laptop vizuálem (klávesnice + trackpad). Scroll-driven animace: laptop vyjíždí zespoda při scrollu (y: 140→0 za 380px). Watermark text "WEB KTERÝ PRODÁVÁ" v pozadí.' },
    ],
  },
  {
    version: '3.96',
    date: '22. 6. 2026',
    changes: [
      { type: 'change', text: 'Hero sekce — odstraněn levý text (badge, nadpis, popis, tlačítka) a stats bar (48h/50+/0Kč/100%). Monitor přesunut na střed obrazovky.' },
    ],
  },
  {
    version: '3.95',
    date: '22. 6. 2026',
    changes: [
      { type: 'change', text: 'FAQ sekce přesunuta z homepage na stránku /sluzby (za service karty, před CTA). Z homepage odstraněna včetně SectionDivideru a AnimatePresence importu.' },
    ],
  },
  {
    version: '3.94',
    date: '22. 6. 2026',
    changes: [
      { type: 'change', text: 'ServicesSection — odstraněna cena (od X Kč) z karet Landing page, Firemní web a E-commerce.' },
    ],
  },
  {
    version: '3.93',
    date: '22. 6. 2026',
    changes: [
      { type: 'feat', text: 'Hero — přidán ghost text "Web, který" za monitorem (outline styl, webkit-text-stroke, z-index:0), monitor je před ním (z-index:1).' },
      { type: 'feat', text: 'Monitor preview — redesign na realistický dvousloupcový layout: navbar, hero sekce (text vlevo + 2 image boxy vpravo s barevnými gradienty), SVG vlnka (fialová), services, process, CTA.' },
    ],
  },
  {
    version: '3.92',
    date: '22. 6. 2026',
    changes: [
      { type: 'feat', text: 'Hero — nahrazena Unsplash fotka vlastním monitor vizuálem. Monitor má tmavý rám, bílou obrazovku, brand bar, stojan a 3 floating badges (Web schválen, 48h dodání, 50+ klientů).' },
      { type: 'feat', text: 'Monitor preview — automatický plynulý scroll obsahu (nav, hero, image card, 3 service karty, process steps, testimonial, CTA) přes CSS keyframe animaci 18s ease-in-out infinite alternate. Respektuje prefers-reduced-motion.' },
    ],
  },
  {
    version: '3.91',
    date: '22. 6. 2026',
    changes: [
      { type: 'fix', text: 'SectionDivider — prodloužen přechod 120→160px' },
      { type: 'change', text: 'Layout — odstraněny dekorativní SVG čáry (fixed overlay vlevo i vpravo)' },
    ],
  },
  {
    version: '3.90',
    date: '22. 6. 2026',
    changes: [
      { type: 'fix', text: 'SectionDivider — odstraněn grain SVG overlay který způsoboval viditelné pruhy. Přechody jsou teď čistý hladký gradient.' },
    ],
  },
  {
    version: '3.89',
    date: '22. 6. 2026',
    changes: [
      { type: 'change', text: 'Odstraněn cookie consent banner — smazány CookieConsent.tsx, lib/cookieConsent.ts, odstraněn import a komponenta z marketing layoutu' },
    ],
  },
  {
    version: '3.88',
    date: '22. 6. 2026',
    changes: [
      { type: 'feat', text: 'Homepage — gradient grain přechody mezi sekcemi (SectionDivider komponenta). 120px vysoké přechody s SVG fractalNoise grain texturou. Přechody: Services→Process, Process→WebNestaci, WebNestaci→CTA, CTA→Pricing, Pricing→FAQ.' },
    ],
  },
  {
    version: '3.87',
    date: '22. 6. 2026',
    changes: [
      { type: 'change', text: 'Homepage — globální zvětšení textů: hero odstavec 17→19px, service karty 13→15px, process popis 12→14px, CTA text 15→17px, pricing desc + features 13→15px, FAQ otázky 15→17px, FAQ odpovědi 14→16px, záruka text 13→15px' },
      { type: 'change', text: 'Navbar — nav linky zvětšeny z 13.5px na 15px' },
      { type: 'change', text: 'Sekce "Web nestačí" — redesign na tmavé pozadí (#1a2e3d) se 3 impaktními statistikami (96%, 7×, 75%) ve formátu velké číslo + popis' },
    ],
  },
  {
    version: '3.86',
    date: '22. 6. 2026',
    changes: [
      { type: 'change', text: 'Homepage — sekce "Web sám o sobě nestačí": nahrazen radial vizuál informativním 2-sloupcovým layoutem. Vlevo headline + popis, vpravo 3 numbered insight cards (Zákazníci vás musí najít / Důvěra se buduje opakováním / Web je konec cesty).' },
    ],
  },
  {
    version: '3.85',
    date: '22. 6. 2026',
    changes: [
      { type: 'feat', text: 'Homepage — nová sekce "Marketing Ecosystem": radial vizuál (web uprostřed, 5 kanálů kolem), animované SVG čáry, countery tikou při scrollu. Kanály: SEO, Google Ads, Social Media, E-mailing, Google My Business.' },
    ],
  },
  {
    version: '3.84',
    date: '22. 6. 2026',
    changes: [
      { type: 'change', text: 'Navbar — odebrány položky Portfolio a Reference' },
      { type: 'change', text: 'Homepage — odebrány sekce Portfolio (Naše práce) a Reference (Co říkají klienti)' },
    ],
  },
  {
    version: '3.83',
    date: '22. 6. 2026',
    changes: [
      { type: 'fix', text: 'Dekorativní čáry vlevo — opraveno height: 65vh → 100vh a bottom: 0 → top: 0, čáry nyní pokrývají celou výšku stránky stejně jako pravá strana' },
      { type: 'change', text: 'Dekorativní čáry — asymetrické tvary, každá křivka má unikátní kontrolní body, amplitudu a tloušťku (0.5–1.2px), žádné dvě nejdou stejnou cestou' },
    ],
  },
  {
    version: '3.82',
    date: '22. 6. 2026',
    changes: [
      { type: 'fix', text: 'Dekorativní čáry — oprava z-indexu (0 → 10), sekce stránek je překrývaly. Přidán mix-blend-mode: multiply — na světlých sekcích viditelné, na tmavých (#285570) automaticky mizí.' },
    ],
  },
  {
    version: '3.81',
    date: '22. 6. 2026',
    changes: [
      { type: 'feat', text: 'Dekorativní SVG čáry v pozadí — 7 organických křivek vpravo + 5 vlevo dole, napodobení referenčního designu. Fixed overlay pod obsahem, navbar nezasažen.' },
      { type: 'feat', text: 'Nové logo — nahrazeno barevnou horizontální verzí (W + hvězdička), správný poměr stran pro navbar. Footer logo invertováno do bílé přes CSS filter.' },
      { type: 'feat', text: 'Stránka Zásady ochrany soukromí (/zasady-ochrany-soukromi) — 10 sekcí dle GDPR, link v patičce webu.' },
      { type: 'change', text: 'Celoplošná warm light paleta (#faf7f6 / #285570) — přepsány všechny marketing stránky: layout, MarketingNav, Footer, CookieConsent, Jak pracujeme, Kontakt, O nás, Portfolio, Reference, Služby, Kalkulace.' },
      { type: 'fix', text: "Footer.tsx chyběl 'use client' — event handlery způsobovaly build error, Vercel nasazoval starou verzi." },
    ],
  },
  {
    version: '3.80',
    date: '22. 6. 2026',
    changes: [
      { type: 'feat', text: 'Dekorativní čáry v pozadí — redesign: 7 organicky zakřivených linií soustředěných vpravo (jako v referenčním designu) + 5 menší cluster vlevo dole. Čáry se nepřekrývají s obsahem (zIndex 0 pod main).' },
    ],
  },
  {
    version: '3.78',
    date: '21. 6. 2026',
    changes: [
      { type: 'fix', text: 'Logo nahrazeno správnou verzí — předchozí mělo špatný poměr stran (čtvercový formát), nová verze je horizontální a správně sedí do navbaru i footeru' },
    ],
  },
  {
    version: '3.77',
    date: '21. 6. 2026',
    changes: [
      { type: 'feat', text: 'Nové logo — nahrazen logo.png barevnou verzí s ikonou W a hvězdičkou, funguje na světlém i tmavém pozadí (footer invertuje přes CSS filter)' },
      { type: 'feat', text: 'Stránka Zásady ochrany soukromí (/zasady-ochrany-soukromi) — 10 sekcí dle GDPR: správce, rozsah dat, účel, doba uchování, příjemci, práva subjektů, cookies, zabezpečení, stížnosti, aktualizace' },
      { type: 'feat', text: 'Footer: link na Zásady ochrany soukromí v patičce vedle copyright textu' },
    ],
  },
  {
    version: '3.76',
    date: '21. 6. 2026',
    changes: [
      { type: 'fix', text: "Footer.tsx chyběl 'use client' — onMouseEnter/onMouseLeave handlery způsobovaly build error v Next.js App Routeru, Vercel nasazoval starou verzi webu" },
    ],
  },
  {
    version: '3.75',
    date: '21. 6. 2026',
    changes: [
      { type: 'change', text: 'Celoplošné přepracování barevného schématu na warm light paletu: #faf7f6 (pozadí), #f0ebe7 (alt sekce), #285570 (akcent), #e3ded7 (bordery), #1a2e3d (nadpisy), #6b6560 (text), #cbcac7 (muted)' },
      { type: 'change', text: 'MarketingNav přepsán z dark (#060d1a) na light (#fff), indikátor aktivní stránky nyní #285570 místo bílé, hamburger a linky v tmavých warm tónech' },
      { type: 'change', text: 'Footer přepnut na #285570 dark background s bílým textem — elegantní kontrast vůči světlým stránkám, logo invertováno do bílé' },
      { type: 'change', text: 'CookieConsent přepsán na bílé pozadí s #e3ded7 borderem a warm shadow, tlačítko Přijmout vše má background #285570' },
      { type: 'change', text: 'Jak pracujeme: step ikony warm beige místo dark blue, FAQ sekce na #f0ebe7, bílá karta, všechny dark třídy nahrazeny warm inline styly' },
      { type: 'change', text: 'Kontakt: formulář bílý s #e3ded7 inputy, ikony #285570, focus ring warm, success stav s #285570 checkem místo zelené' },
      { type: 'change', text: 'O nás: stats strip přepnut na #285570 dark, team karta bílá, approach boxy warm beige/bílá, value karty bílé s #285570 levou čárkou' },
      { type: 'change', text: 'Portfolio: karty bílé s #e3ded7 borderem, hover overlay zůstává tmavý (nad gradient MockBrowser), CTA sekce #285570' },
      { type: 'change', text: 'Reference: testimonial karty bílé, featured karta s #285570 borderem a warm badge, result badge warm #285570 verze místo emerald, stats bar bílý' },
      { type: 'change', text: 'Služby: service karty bílé (#fff), popular karta s #285570 borderem a badge, check ikony stroke #285570, pricing box na #faf7f6, CTA sekce #285570' },
      { type: 'change', text: 'Kalkulace: všechny per-service barvy normalizovány na #285570 / rgba(40,85,112,0.06) — konzistentní look napříč všemi kalkulacemi' },
      { type: 'change', text: 'Layout wrapper přepnut z bg-[#060d1a] na bg-[#faf7f6] text-[#1a2e3d]' },
    ],
  },
  {
    version: '3.72',
    date: '21. 6. 2026',
    changes: [
      { type: 'feat', text: 'Exit animace — každá sekce se animuje zpět do výchozí polohy (opacity 0, x/y offset) při opuštění viewportu (useInView once: false) — plynulý leave efekt při scrollu oběma směry' },
      { type: 'change', text: 'Padding sekcí Služby / Jak pracujeme / Portfolio / Reference zdvojen na 220px — více prostoru pro animaci, plynulejší scrolling experience bez zasekávání' },
    ],
  },
  {
    version: '3.63',
    date: '21. 6. 2026',
    changes: [
      { type: 'change', text: 'Animační systém přepracován z scroll-linked (useScroll + useTransform) na viewport-based (useInView + fixní čas) — rychlost animace je vždy 0.9 s bez ohledu na rychlost scrollu myší' },
      { type: 'fix', text: 'Odstraněno sticky scroll-pin (position: sticky + 3× výška sekce) — stránka se již nezasekává v sekcích, normální scroll flow' },
      { type: 'change', text: 'Karty Služby: L/zdola/R vstup (x: ±110, rotate: ±2.5°) se stagger 0.1/0.18/0.1 s; Process / Portfolio / Reference: analogické directionální animace per karta' },
    ],
  },
  {
    version: '3.62',
    date: '21. 6. 2026',
    changes: [
      { type: 'feat', text: 'FAQ sekce na homepage — 6 nejčastějších otázek jako accordion (Jak dlouho trvá web / Záloha / Revize / SEO / Co potřebujeme / Úpravy po spuštění), umístěna mezi Ceník a konec stránky' },
      { type: 'feat', text: 'FAQ accordion: AnimatePresence + framer-motion pro plynulé otevření/zavření odpovědi; ikona + rotuje na × při otevření; pouze jedna otázka otevřena najednou' },
    ],
  },
  {
    version: '3.61',
    date: '21. 6. 2026',
    changes: [
      { type: 'feat', text: 'Cookie consent banner — "Přijmout vše" nebo "Pouze nezbytné", volba uložena do localStorage (wa-cookie-consent), banner se zobrazí jen při první návštěvě' },
      { type: 'feat', text: 'Animovaný slide-up při zobrazení / slide-down při zavření (AnimatePresence + framer-motion)' },
    ],
  },
  {
    version: '3.60',
    date: '21. 6. 2026',
    changes: [
      { type: 'feat', text: 'Scroll-locked animace — každá sekce je sticky-pinned, karty vlétají ze stran přesně úměrně aktuální scroll pozici (useScroll + useTransform)' },
      { type: 'change', text: 'Obnoven veškerý obsah homepage: Služby, Jak pracujeme, Portfolio, Reference, Ceník, CTA' },
      { type: 'change', text: 'Paper-slide směry: headingy z leva/prava, karty L/zdola/R, process kroky staggered zprava' },
    ],
  },
  {
    version: '3.59',
    date: '21. 6. 2026',
    changes: [
      { type: 'change', text: 'Homepage přepracovaná — odstraněny neonové prvky (cyan gradient, fialová, neonová zelená), čistší barevná paleta' },
      { type: 'feat', text: 'Paper-slide animace — karty vlétávají z boku (vlevo/zdola/zprava) s rotací, process karty staggered ze strany' },
      { type: 'change', text: 'Homepage zkrácena ze 7 na 4 sekce — odstraněny Portfolio, Reference a Ceník (mají vlastní podstránky)' },
    ],
  },
  {
    version: '3.58',
    date: '21. 6. 2026',
    changes: [
      { type: 'fix', text: 'MarketingNav indikátor — při page load se snapne na správnou pozici bez animace (první render), slide animace se zapne až při navigaci mezi sekcemi' },
    ],
  },
  {
    version: '3.57',
    date: '21. 6. 2026',
    changes: [
      { type: 'feat', text: 'Tlačítka — fill-sweep animace: na hover se barva plynule vyplní zleva doprava (background-position trick, CSS only)' },
      { type: 'feat', text: 'Tlačítka — Montserrat font, letter-spacing, unified třídy: btn-mkt-primary / btn-mkt-ghost / btn-mkt-card-primary / btn-mkt-card-ghost / btn-nav-cta' },
      { type: 'change', text: 'Tlačítka — defaultní stav je outline (ne solid), fill přichází na hover' },
    ],
  },
  {
    version: '3.56',
    date: '21. 6. 2026',
    changes: [
      { type: 'fix', text: 'MarketingNav — indikátor se při page reload přestal zobrazovat na špatném místě (double requestAnimationFrame před měřením)' },
      { type: 'change', text: 'MarketingNav — barva indikátoru změněna z modré na bílou' },
    ],
  },
  {
    version: '3.55',
    date: '21. 6. 2026',
    changes: [
      { type: 'feat', text: 'MarketingNav — zaoblené rohy (border-radius 14px), sekce zpět (Domů/Služby/Portfolio/Jak pracujeme/Reference/O nás)' },
      { type: 'feat', text: 'MarketingNav — sliding indikátor: modrá čárka na spodku navbaru plynule přejíždí pod aktivní sekci (CSS transition left+width)' },
    ],
  },
  {
    version: '3.54',
    date: '21. 6. 2026',
    changes: [
      { type: 'change', text: 'MarketingNav — dark navy barva zpět, navbar jako levitující obdélník (ne přes celou šířku, s mezerami po stranách)' },
    ],
  },
  {
    version: '3.53',
    date: '21. 6. 2026',
    changes: [
      { type: 'change', text: 'MarketingNav — zjednodušen na logo + CTA button, odebrány nav linky, světlé pozadí (#f8f9fb), ostré obdélné hrany' },
    ],
  },
  {
    version: '3.52',
    date: '21. 6. 2026',
    changes: [
      { type: 'fix', text: 'MarketingNav — odstraněn text "WebsiteAgent" vedle loga (zůstává jen logo obrázek)' },
      { type: 'fix', text: 'MarketingNav — odstraněn duplicitní desktop hamburger, zůstává jen jeden pro mobil' },
      { type: 'change', text: 'MarketingNav — top: 0 → top: 12px, navbar není přilepený na vrchol stránky' },
    ],
  },
  {
    version: '3.51',
    date: '21. 6. 2026',
    changes: [
      { type: 'feat', text: 'MarketingNav — redesign dle reference: logo+název vlevo, linky centrované s blue underline aktivní stránky, CTA "Kontaktujte nás →" vpravo, hamburger ikona, solid dark bg' },
    ],
  },
  {
    version: '3.50',
    date: '21. 6. 2026',
    changes: [
      { type: 'change', text: 'Hero — odstraněn AI-looking badge "Profesionální weby · Hotovo za 48 hodin"' },
      { type: 'feat', text: 'MarketingNav — kompletní redesign: solidní tmavý navbar (ne průhledný), links vizuálně seskupeny v jednom containeru se separátory, modrá accent linka nahoře' },
    ],
  },
  {
    version: '3.49',
    date: '21. 6. 2026',
    changes: [
      { type: 'feat', text: 'Font — DM Serif Display nahrazen Montserrat (weights 300/400/600/700) pro lepší čitelnost na dark bg' },
    ],
  },
  {
    version: '3.48',
    date: '21. 6. 2026',
    changes: [
      { type: 'change', text: 'Homepage — kompletní redesign, 3D scéna (Three.js/ImmersiveScene) odstraněna, nahrazena fotkami s dark navy stylem' },
      { type: 'feat', text: 'Homepage — 7 sekcí: Hero (foto bg), Služby, Proces (foto), Portfolio, Reference, CTA, Ceník' },
      { type: 'fix', text: 'Homepage — animace při scrollu se spouštějí dříve (amount: 0.05 místo 0.2), texty se neobjevují pozdě' },
      { type: 'change', text: 'Smazány komponenty ImmersiveScene, HeroScene, Monitor3D (Three.js závislosti)' },
    ],
  },
  {
    version: '3.47',
    date: '21. 6. 2026',
    changes: [
      { type: 'change', text: 'Kontakt — OriginButton (cursor-origin fill animace) nahrazen normálním tlačítkem' },
    ],
  },
  {
    version: '3.46',
    date: '18. 6. 2026',
    changes: [
      { type: 'change', text: 'S1 HERO: status badge ("48 h dodání · záloha 0 Kč · 50+ projektů") odstraněn — informace jsou prezentovány jako velká čísla v S3; opakování před headlinem bylo noise' },
      { type: 'change', text: 'S1 HERO: headline fontSize clamp(64px,8.5vw,112px) → clamp(76px,10vw,130px); lineHeight 1.0 → 0.93; letterSpacing -0.045em → -0.05em — víc prostorový, editorský pocit' },
      { type: 'change', text: 'S2 PROCESS: sekce přesunuta na pravou stranu (justifyContent: flex-end; padding: 0 52px 0 40px) — kamera v PROCESS orbitu vpravo (camX=2.5), monitor leží vlevo; text vpravo eliminuje překryv a vytváří správnou kompozici' },
      { type: 'change', text: 'S2 PROCESS: step word fontSize clamp(46px,6.5vw,80px) → clamp(52px,7.5vw,94px) — dominantnější, product-showcase váha; časové značky color #1e3a5e → #3a5878 — čitelnější' },
      { type: 'change', text: 'S4 CTA: odstraněn odstavec "Záloha nula. Návrh do 24 hodin. Web do 48 hodin." — přebytek vysvětlování pod silným headlinem oslaboval výzvu k akci; CTA sekce nyní: headline + jedno tlačítko' },
      { type: 'change', text: 'S4 CTA: h2 margin-bottom 28px → 48px (headlinu dává prostor k dechu bez odstavce); button padding 17px 44px → 17px 52px; border-radius 10px → 8px — konzistentní s S1 tlačítky' },
      { type: 'feat',   text: 'Animace: S1 vstup — přidán Y lift (opacity:0,y:16 → opacity:1,y:0); S2–S4 onEnter/onEnterBack — fromTo s y:14/-12 pro směrový vstup; onLeave/onLeaveBack — exit s y:-10/10 pro plynulý pohyb; duration 0.8 → 0.65; stagger 0.12 → 0.09' },
      { type: 'change', text: 'Animace: ScrollTrigger start "top 22%" → "top 18%" — text se objeví o něco dříve v průběhu scrollu, přirozenější timing' },
    ],
  },
  {
    version: '3.45',
    date: '18. 6. 2026',
    changes: [
      { type: 'change', text: 'Struktura přepracována z 6 sekcí (600vh) na 4 sekce (400vh): HERO → PROCES → VÝSLEDKY → CTA — jasná narativní linka: co stavíme / jak to funguje / co klienti získají / začni dnes' },
      { type: 'feat',   text: 'ScreenProcess (sekce 1): nová obrazovka — 3-krokový timeline (01 Sdělíte / 02 Navrhneme / 03 Online) s časovými značkami (3 min / 24 h / 48 h); monitor v sekci 1 je podpůrný prvek (monScale 0.88), ne dominantní' },
      { type: 'change', text: 'GSAP timeline přepsán na 3 tweeny s pozicemi 0/1/2 a délkou 1.0 — každý tween přesně odpovídá jedné sekci scrollu; sekce 3 (CTA) nepotřebuje tween, monitor zůstává jako malá miniatura ze sekce 2' },
      { type: 'change', text: 'ExplosionFragments odstraněn (~60 řádků, 23 mesh objektů) — explozní efekt neodpovídal nové naraci "Začněte dnes"; scéna je čistší bez fragmentů létajících na pozadí CTA' },
      { type: 'change', text: 'ScreenIdea, ScreenLanding, ScreenEcommerce odstraněny (~340 řádků) — nahrazeny jednou novou ScreenProcess komponentou; 3 zbytečné obrazovky nestály storytelling hodnotu' },
      { type: 'change', text: 'CameraRig zjednodušen — odebrán shake efekt vázaný na explodeProgress; CameraRig nyní jen sleduje SV hodnoty bez vedlejší logiky' },
      { type: 'change', text: 'SCREEN_RIM/EM arrays zmenšeny z 6 na 4 položky; explosion světlo (red pointLight) odstraněno; sekce detekce: Math.min(5,...) → Math.min(3,...)' },
      { type: 'change', text: 'page.tsx: S3 (Nabídka) a S4 (Záruka) odstraněny — obsah překrýval informace v pricing sekci níže; staré S5/S6 přejmenovány na S3/S4; GSAP pairs: 5 triggerů → 3' },
    ],
  },
  {
    version: '3.44',
    date: '18. 6. 2026',
    changes: [
      { type: 'fix', text: 'ImmersiveScene: monitor neproblikává — všechny screen komponenty jsou nyní vždy namontované (visible toggle místo conditional render); Three.js Text nemusí znovu načítat font při přechodu sekce → žádný flash' },
      { type: 'fix', text: 'ImmersiveScene: ScreenEcommerce — odstraněn IMG_BG array a tmavé placeholder obdélníky v produktových kartách; nahrazeny průhledným accent tónem + větší kategorie text (0.082) — žádné náhodné černé boxy' },
      { type: 'fix', text: 'ImmersiveScene: ScreenHero + ScreenLanding — zdvojené "ghost button" meshe (2× překrývající se boxGeometry) zjednodušeny na jeden poloprůhledný mesh — méně vizuálního šumu' },
      { type: 'change', text: 'ImmersiveScene: ScreenHero snap() animace — binary target (0/1) s lerp 0.18 nahrazen přímým vis hodnotou s lerp 0.08 — každý element se plynule škáluje proporcionálně s buildProgress, ne náhle snapuje; build timings rozšířeny pro plynulejší sekvenci' },
    ],
  },
  {
    version: '3.43',
    date: '18. 6. 2026',
    changes: [
      { type: 'feat', text: 'ImmersiveScene: Z-axis journey — kamera cestuje hloubkou scény: 11.0 → 9.2 → 3.8 (dive do DESIGN) → 11.5 (blast back do BUSINESS) → 5.8 (swoop do ECOMMERCE) → 10.5 (wide RESULTS) → 20.0 (LAUNCH pull-back) — 16 jednotek Z-rozsahu' },
      { type: 'feat', text: 'ImmersiveScene: DESIGN sekce — kamera se přiblíží na Z=3.8, monScale 1.55 — monitor vyplní viewport, divák sleduje sestavování UI z bezprostřední vzdálenosti' },
      { type: 'feat', text: 'ImmersiveScene: RESULTS sekce — monScale 0.36, monX 1.4, monY 0.6 — monitor se zmenší na miniaturu v pravém rohu; čísla (48h / 50+ / 0 Kč) dominují levé polovině stránky' },
      { type: 'change', text: 'ImmersiveScene: RingAccent odstraněn — dekorativní prsten bez storytelling hodnoty; Particles odstraněny — temná prázdnota zvýrazňuje monitor (Apple product reveal přístup)' },
      { type: 'change', text: 'ImmersiveScene: STATE 2 orbit camX 3.2→4.5 (výraznější pravá orbita), STATE 3 camX -3.0→-4.2 (výraznější levý průlet), STATE 4 nízký úhel camY -2.4 nahrazen neutrálním camY -0.5 + přiblížením Z=5.8' },
      { type: 'change', text: 'ImmersiveScene: CameraRig lookAt koeficient monX 0.4→0.55 — kamera lépe sleduje monitor při posunutí do pravé strany v RESULTS sekci' },
      { type: 'change', text: 'page.tsx: S5 šířka clamp(260px,31vw,400px)→clamp(300px,44vw,560px) — monitor je malý a vpravo, čísla mohou zabrat celou levou část viewportu' },
      { type: 'change', text: 'page.tsx: S5 čísla fontSize clamp(52px,8vw,100px)→clamp(64px,9.5vw,120px) — čísla jsou hrdina sekce' },
    ],
  },
  {
    version: '3.42',
    date: '18. 6. 2026',
    changes: [
      { type: 'feat', text: 'ImmersiveScene: monitor nyní vypráví příběh — 6 obrazovek mapuje celý proces: 01/IDEA → 02/DESIGN → 03/FIREMNÍ WEB → 04/E-SHOP → 05/VÝSLEDKY → 06/SPUŠTĚNÍ' },
      { type: 'feat', text: 'ScreenIdea (sekce 0): nová obrazovka — klientský intake formulář s browserovým chromem (macOS traffic lights, URL bar), vyplněný formulář "Kuchař & synové", blikající kurzor, potvrzení ✓ Požadavek přijat' },
      { type: 'feat', text: 'ScreenResults (sekce 4): nová analytická obrazovka — velké číslo 12,847 návštěv +127%, konverzní poměr 4.2%, tržby 142k Kč, sloupcový graf 12 měsíců se zvýrazněnými posledními 3 sloupci (cyan), živý pulsující dot LIVE' },
      { type: 'feat', text: 'ScreenLaunch (sekce 5): nová launch obrazovka — velký pulsující zelený dot, obří "LIVE" text (fontSize 0.200), doména "vaseweb.cz", "Váš web je online", čas spuštění, 3 stats (48h / 100% / 0 Kč)' },
      { type: 'change', text: 'ScreenCorporate odstraněna — nahrazena ScreenEcommerce přesunutou na sekci 3; sekce 3 (původně E-SHOP) nyní za sekcí FIREMNÍ WEB — příběh dává logický sled' },
      { type: 'change', text: 'SCREEN_RIM/EM barvy přeladěny na paletu podle fáze: IDEA grey-blue → DESIGN blue → BUSINESS deep blue → ECOM teal → RESULTS cyan → LAUNCH green — monitor vizuálně signalizuje fázi příběhu' },
      { type: 'change', text: 'Monitor switch: section < 5 guard odstraněn — všechny sekce 0–5 mají vlastní obsah; section 5 (LAUNCH) zobrazuje ScreenLaunch + exploze fragmentů létá přes live obrazovku' },
      { type: 'change', text: 'Stage labels přidány do každé obrazovky: "01 / IDEA", "02 / DESIGN", "03 / FIREMNÍ WEB", "04 / E-SHOP", "05 / VÝSLEDKY", "06 / SPUŠTĚNÍ"' },
    ],
  },
  {
    version: '3.40',
    date: '18. 6. 2026',
    changes: [
      { type: 'fix', text: 'page.tsx: S1/S2/S4/S5 — maxWidth nahrazen přesným clamp() — S1/S2/S4: clamp(260px,33vw,420px), S5: clamp(260px,31vw,400px) — text nikdy nepřekryje monitor bez ohledu na šířku viewportu' },
      { type: 'fix', text: 'page.tsx: padding změněn z "0 52px" na "0 40px 0 52px" — menší pravý padding, více místa pro obsah při zachování levého odsazení' },
    ],
  },
  {
    version: '3.39',
    date: '18. 6. 2026',
    changes: [
      { type: 'feat', text: 'ImmersiveScene: všechny 4 screen komponenty zesvětleny +40% — přepočteny hex hodnoty pozadí, sidebar, karet, navigací, textů, statistik (meshBasicMaterial není ovlivněn světly, změna přímo v barvách)' },
      { type: 'feat', text: 'ImmersiveScene: MonitorGLTF — GLTF stand části (Neck, NeckTaper, Base, BaseChamfer, BaseReflection) skryty přes obj.visible = false; nahrazeny manuálním tenkým stojánkem (cylinder 0.022r + box 0.72×0.022) — podstavec zmenšen o ~50%' },
      { type: 'feat', text: 'ImmersiveScene: screen glass mesh rozšířen [3.38,2.2]→[3.56,2.32] a screen rim [3.4,2.22]→[3.58,2.34] — opticky minimalizuje viditelný rámeček monitoru bez úpravy GLB geometrie' },
      { type: 'feat', text: 'ImmersiveScene: RingAccent zjednodušen 2 prsteny → 1 prsten; Particles sloučeny 2 cloudy (1800+400) → 1 cloud (1000, mobile 400) — méně vizuálního šumu' },
      { type: 'feat', text: 'ImmersiveScene: světla přeladěna — ambient 0.18→0.35, key blue pointLight 5.8→8.0, fill přebarven #7c3aed→#22d3ee (electric cyan) 3.2→5.0; pozadí Canvas #060c1a→#060d1a — tmavá navy paleta' },
      { type: 'feat', text: 'ScreenHero: stats "50+" přebarven #a78bfa→#22d3ee (electric cyan), bottom Speed karta accent #7c3aed→#22d3ee, bar chart barvy doplněny o cyan — konzistentní navy+cyan palette' },
      { type: 'change', text: 'page.tsx: pozadí #06060a→#060d1a — sjednoceno s canvas background' },
      { type: 'change', text: 'page.tsx: S1 headline fontSize clamp(58px,7.5vw,100px)→clamp(64px,8.5vw,112px); S2 slova clamp(38px,5.5vw,68px)→clamp(46px,6.5vw,80px); S5 čísla clamp(44px,6.5vw,84px)→clamp(52px,8vw,100px); S6 clamp(60px,9.5vw,116px)→clamp(68px,11vw,128px)' },
      { type: 'change', text: 'page.tsx: safe zones — maxWidth na všech scroll sekcích omezeno na min(X, 42vw) resp. min(460px, 38vw) pro S3 — text nikdy nepřekryje střed s monitorem' },
      { type: 'change', text: 'page.tsx: S1/S6 gradient accent #93c5fd→#22d3ee — elektrická cyan barva místo světle modré; dimové body texty #2d4460/#1e3050/#1a2c44 zesvětleny na #4a6880/#3a5878/#3a5068' },
    ],
  },
  {
    version: '3.38',
    date: '18. 6. 2026',
    changes: [
      { type: 'feat', text: 'S1 Hero: odstraněn industry strip (Instalatéři · Zubaři…) a pulsující badge — nahrazen čistým inline statusem "48 h · záloha 0 Kč · 50+ projektů"' },
      { type: 'feat', text: 'S2 Process: kompletní přepis — 3 kroky jako 3 obří slova ("Formulář. / Návrh. / Online.") s časovou notací vpravo — Apple keynote styl místo odrážkového listu' },
      { type: 'feat', text: 'S3 Nabídka: přepsána sekce Služby — každá položka má název (Vercel/Linear typografie), cenu a jedno věty outcome; žádné ikonky ani barevné pruhy' },
      { type: 'feat', text: 'S4 Záruka: kompletně nová sekce místo fake referencí — "Záloha nula. / Platíte až / po schválení." — guarantee jako hlavní statement místo karet s fiktivními jmény' },
      { type: 'feat', text: 'S5 Čísla: odstraněny count-up animace a sloupcový graf — nahrazeny 3 statickými čísly v extrémní typografii (48h / 50+ / 0 Kč) jako Tesla reveal' },
      { type: 'feat', text: 'S6 Close: odstraněny animovaný radial gradient a grid overlay — čistý centered headline "Začněte / dnes." + jedno CTA tlačítko' },
      { type: 'change', text: 'Barevný systém: odstraněn fialový akcent (#8b5cf6, #7c3aed, #a78bfa) z celé stránky — zjednodušeno na: černá + bílá + modrá (#2563eb) + zelená (záruka)' },
      { type: 'change', text: 'Pricing sekce: odstraněny fialové barvy z karet a hlavičky; popular badge přebarven z fialové na modrou; FAQ sekce odstraněna' },
      { type: 'change', text: 'Odstraněny chaotické animace: @keyframes glowPulse (pulzující CTA), @keyframes ctaRadial (pohyblivé pozadí S6), @keyframes numReveal, count-up čítač, sloupcový graf' },
      { type: 'change', text: 'Odstraněny hover animace způsobující layout shift: .svc-row margin-left:-12px shift, .ref-card hover (sekce neexistuje), .cta-glow klasa' },
      { type: 'change', text: 'ScrollBar: gradient (blue→light blue) → solid #2563eb — jednodušší, čistější' },
      { type: 'change', text: 'CursorBlob: opacity 0.065 → 0.05 — méně rušivý' },
    ],
  },
  {
    version: '3.37',
    date: '18. 6. 2026',
    changes: [
      { type: 'change', text: 'ImmersiveScene: odstraněna podlaha (planeGeometry 48×32) a všechny zdi (back wall, left wall, right wall) — scéna je čistě 3D bez místnosti' },
    ],
  },
  {
    version: '3.36',
    date: '18. 6. 2026',
    changes: [
      { type: 'change', text: 'ImmersiveScene: odstraněna lampička (DeskLamp) — základna, tyčka, stínidlo, žárovka + pointLight #ff9430' },
      { type: 'change', text: 'ImmersiveScene: odstraněn stůl (desk surface 8.2×3.2 + edge highlight + 4 nohy) a teplá světla lampy (#5c2200 floor bounce, #8b3010 wall spill)' },
    ],
  },
  {
    version: '3.35',
    date: '18. 6. 2026',
    changes: [
      { type: 'change', text: 'ImmersiveScene: 23 samostatných useFrame (jeden na fragment) → 1 konsolidovaný loop v ExplosionFragments přes meshRefs/matRefs pole — ~23× méně React fiber overhead per frame' },
      { type: 'change', text: 'ImmersiveScene: světla 8 → 5 — odstraněn přední bílý (0.7), rim cyan (1.8), zadní modrý (1.4); ambient posílen 0.12→0.18 pro kompenzaci' },
      { type: 'change', text: 'ImmersiveScene: DPR [1, 1.5] → [1, 1.2] — snižuje počet renderovaných pixelů na HiDPI displejích (při 2× DPR: 44% méně fragmentů)' },
      { type: 'change', text: 'ImmersiveScene: Torus segmenty 100→60 a 120→72 — snižuje vertex count prstenců bez viditelné ztráty kvality' },
      { type: 'change', text: 'ImmersiveScene: ~8 meshStandardMaterial → meshBasicMaterial na pozadích screen karet (dashboard, feature cards, sidebar, blog cards, product grid) — přeskakuje PBR lighting výpočet' },
    ],
  },
  {
    version: '3.34',
    date: '18. 6. 2026',
    changes: [
      { type: 'feat', text: 'ImmersiveScene: vsechny 4 screeny mají reálný text místo barevných bloků — přidán import Text z @react-three/drei (troika SDF rendering)' },
      { type: 'feat', text: 'ScreenHero: nav "WebsiteAgent" + položky menu, headline "Váš web / do 48 hodin", subtext, CTA "Získat web / Zjistit více", dashboard karta s číslem 1247 a +34%, stats band 48h/50+/100%/0Kč, bottom karty SEO/Speed/Mobile' },
      { type: 'feat', text: 'ScreenLanding: nav + headline "Moderní web / pro vaši firmu", subtext, CTA tlačítka, 3 feature karty (Rychlé dodání / SEO zdarma / Záriuka kvality), trust bar se 4 statistikami' },
      { type: 'feat', text: 'ScreenCorporate: nav "FirmaXYZ s.r.o.", sidebar s 8 položkami menu (aktivní "Projekty"), hlavní obsah "Aktivní projekty / 3 zakázky", 3 blog karty se kategoriemi (SEO/Design/Rychlost), tituly a datem' },
      { type: 'feat', text: 'ScreenEcommerce: search bar s textem, 6 produktů se jmény a cenami (Starter 9900/Business 14900/E-shop 24900/Landing 6900/Redesign 12900/SEO 4900), filter sidebar s kategoriemi a checkboxy, tlačítko "Objednat"' },
    ],
  },
  {
    version: '3.33',
    date: '18. 6. 2026',
    changes: [
      { type: 'feat', text: 'ImmersiveScene: přidán stůl (desk) pod monitor — tmavá dřevěná deska 8.2×3.2 s edge highlightem + 4 nohy v rozích' },
      { type: 'feat', text: 'ImmersiveScene: přidána podlaha (planeGeometry 48×32) a back wall + boční zdi — Room komponenta v Three.js Canvas' },
      { type: 'feat', text: 'ImmersiveScene: lampička na stole (DeskLamp) — základna + tyčka + kónické stínidlo (DoubleSide, amber/oranžová), žárovka s emissive glow + pointLight (ff9430) s pulzující intensitou' },
      { type: 'feat', text: 'ImmersiveScene: cozy teplé světlo — 2 warm fill pointLights (floor bounce #5c2200 + wall spill #8b3010) + teplý odlesk lampy na zdi (emissive plane)' },
      { type: 'fix', text: 'Navbar: verze opravena na v3.33 (předchozí verze v3.13 nebyla aktualizována od v3.13)' },
    ],
  },
  {
    version: '3.32',
    date: '18. 6. 2026',
    changes: [
      { type: 'feat', text: 'Monitor má 6 příběhových stavů: HERO (vzdálený, elegantní) → BUILD (kamera přiblíží, UI se skládá v reálu) → LANDING PAGE (kamera obíhá vpravo) → FIREMNÍ WEB (kamera vlevo) → E-COMMERCE (dramatický nízký úhel) → ROZPAD (WOW moment)' },
      { type: 'feat', text: 'BUILD animace: 8 skupin elementů se skládají postupně (nav → badge → h1 → sub → CTA → dashboard → stats → karty) na základě SV.buildProgress (0→1) přes GSAP scrub — snap-in efekt přes group.scale' },
      { type: 'feat', text: 'LANDING PAGE screen: prémiový layout — tmavý nav, velký centrovaný headline, sub-text, 2 CTA, oddělovač, 3 feature karty s icon dot + title + body, trust bar' },
      { type: 'feat', text: 'CORPORATE screen: sidebar navigation + main content area (heading, body text, divider) + 3 news/blog karty s image placeholder + kategorie + datum, footer strip' },
      { type: 'feat', text: 'E-COMMERCE screen: header se search barem + cart badge (zelený dot), filter sidebar s checkboxy, 2×3 product grid (image area + product name + barevná cena + add-to-cart button)' },
      { type: 'feat', text: 'WOW MOMENT — ROZPAD: 23 UI fragmentů (nav, logo, h1, badge, CTA, dashboard card, chart bars, stats, bottom cards) letí z [0,0,0] do prostoru přes ease-out křivku + spin rotace' },
      { type: 'feat', text: 'Explosion kamera: při State 5 se kamera dramaticky oddaluje (camZ 8→18), stoupá (camY +2.8), vychyluje doleva (camX -2.0) — dává pocit "kamera proletí scénou"' },
      { type: 'feat', text: 'Explosion světlo: pointLight color="#ff2200" intensity=4 se aktivuje v section===5 — monitor/fragmenty se obarví červeným zábleskem při rozpadu' },
      { type: 'feat', text: 'Monitor screen glow reaguje na stav: blue (0-2) → purple (3) → green (4) → dark red (5 / explode) — SCREEN_EM a SCREEN_RIM arrays' },
      { type: 'feat', text: 'Cinematic kamera: každá sekce má unikátní úhel — straight-on → zoom-in → orbit vpravo → orbit vlevo → nízký úhel → dramatický pullback. Žádné prosté zoomování.' },
      { type: 'change', text: 'Prstence zjednodušeny: 3 orbity → 2 (main orbit ø8.0 blue + secondary ø11.0 purple) — více elegance, méně chaosu. Torus segmenty sníženy.' },
      { type: 'change', text: 'ServiceCards, ProjectPanels, StatPanels kompletně odstraněny — nahrazeny 6-state monitor storytelling systémem' },
      { type: 'change', text: 'SV state rozšířen o buildProgress a explodeProgress — GSAP animuje obě přes scrub timeline' },
    ],
  },
  {
    version: '3.31',
    date: '18. 6. 2026',
    changes: [
      { type: 'feat', text: 'S1 — industry strip: 4 emoji pills nahrazeny řádkem oborů (Instalatéři · Zubaři · Kavárny · Autoservisy · ...) — signalizuje šíři zkušeností, buduje důvěru' },
      { type: 'feat', text: 'S1 — badge přepsán: "Profesionální weby pro lokální firmy" → "50+ firem. Hotovo do 48 h. Záloha nula." — konkrétní čísla místo generické fráze' },
      { type: 'feat', text: 'S2 — přepsáno: 3 velká čísla (48h/0Kč/100%) nahrazena transparentním procesem — 01 Formulář (3 min) / 02 Návrh (24 h) / 03 Spuštění (48 h) — každý krok s barevným time-badge' },
      { type: 'feat', text: 'S3 — každá služba má outcome mikro-popis: Landing page "Více poptávek od prvního dne", Firemní web "Kompletní online prezentace", E-commerce "Prodávejte 24/7 bez omezení"' },
      { type: 'feat', text: 'S4 — reference dramaticky obohaceny: přidána jméno+role (Jan Kovář, MUDr. Petra Marková, ...), datace spuštění (leden 2025), doba dodání (44 h od podpisu), plnější citace' },
      { type: 'feat', text: 'S4 — hlavička: "Co říkají naši klienti." → "Tihle nám už důvěřovali." + label "50+ dokončených projektů" — tvrdší důkazní rámec' },
      { type: 'feat', text: 'S5 — nové framing: label "Za rok fungování" + h2 "Čísla, která mluví za nás." — kontext místo vágního "Výsledky v číslech"' },
      { type: 'feat', text: 'S6 — kompletní přepis: "Začněte dnes." → "Váháte? Správně." — námitková CTA, odstraňuje psychologické bloky, záruční pill (Pokud nejste spokojení — neplatíte ani korunu.), 4 trust checkmarky' },
      { type: 'feat', text: 'SPricing — garantní pruh nad kartami: SVG shield ikona + "Záruka spokojenosti — web nesplní zadání? Vrátíme 100 % ceny, bez diskuze."' },
    ],
  },
  {
    version: '3.30',
    date: '18. 6. 2026',
    changes: [
      { type: 'feat', text: 'Footer je nyní viditelný na homepage: přidáno relative z-[10] — fixed 3D canvas (z-index 2) ho dříve překrýval' },
      { type: 'change', text: 'Footer background: bg-[#0a0f1e] → bg-[#06060a] — plynulý přechod ze sekce ceníku, konzistentní dark palette' },
      { type: 'change', text: 'Footer separator: tenká bílá linka (opacity 7%) odděluje footer od obsahu nad ním' },
      { type: 'change', text: 'Footer linky: hover efekt text-slate-600 → text-slate-300 s transition-colors duration-150' },
    ],
  },
  {
    version: '3.29',
    date: '18. 6. 2026',
    changes: [
      { type: 'feat', text: 'Nová sekce Ceník (SPricing): 3 tarify — Landing page (9 900 Kč), Firemní web (14 900 Kč, highlighted), E-commerce (24 900 Kč)' },
      { type: 'feat', text: 'Pricing cards: glassmorphism design, barevný glow dot, animovaný hover (translateY -6px, border glow, box-shadow hloubka)' },
      { type: 'feat', text: 'Populární karta zvýrazněna: fialový gradientový badge "Nejoblíbenější", mírné vysunutí nahoru (-16px margin-top), glow tlačítko' },
      { type: 'feat', text: 'Feature checklisty: barevné SVG checkmarky per tarif, 6 položek každý, responsive grid (3 sloupce → 1 na mobilu)' },
      { type: 'feat', text: 'FAQ blok: 3 karty s nejčastějšími otázkami — proč po schválení, revize, 48h dodání' },
      { type: 'feat', text: 'Bottom CTA: "Nezávazná konzultace zdarma →" link na /kontakt s fialovým pill stylem' },
      { type: 'feat', text: 'Sekce je za 600vh 3D scroll experience — vlastní background, nenarušuje GSAP timeline ani 3D scénu' },
      { type: 'feat', text: 'Vizuální přechod: radial purple glow spotlight nahoře + tenký gradientový separator odděluje sekci od 3D' },
    ],
  },
  {
    version: '3.28',
    date: '18. 6. 2026',
    changes: [
      { type: 'feat', text: 'S5 count-up animace: čísla 48h / 50+ / 100% počítají od nuly přes requestAnimationFrame s easing funkcí — spouštějí se při scrollu přes sekci (CustomEvent "countup-start" z GSAP onEnter)' },
      { type: 'feat', text: 'S5 animovaný bar chart: 10 sloupců s různými výškami, gradientové barvy (modrá→fialová), CSS scaleY(0→1) animace s cubic-bezier překmitem, popisek "Počet projektů / kvartál"' },
      { type: 'feat', text: 'S4 reference: horizontální scroll karty (4 klienti + "Celé portfolio" karta) se scroll-snap, glassmorphism styl, výsledkové metriky (+340%, 70%, +40%, +120%)' },
      { type: 'feat', text: 'S4 ref karty: CSS hover efekty (.ref-card:hover) — translateY(-5px), border glow, box-shadow hloubka — beze stavu React, pouze CSS transition' },
      { type: 'feat', text: 'S3 service hover: .svc-row:hover → mírný slide + background fill, šipka → se objeví s transition, barevný bar se zvětší scaleY — CSS třídy bez JS state' },
      { type: 'feat', text: 'S6 CTA premium: animated radial spotlight (CSS bgPosition animation), dot-grid overlay s mask-image radial fade, pulsující glow tlačítko (.cta-glow keyframes), social proof pills' },
      { type: 'feat', text: 'S6 CTA headline: h2 96px fontWeight 300 — "Začněte / dnes." — maximální kontrast a prostota' },
      { type: 'change', text: 'Komplexní rozšíření <style> tagu: 5 nových @keyframes (glowPulse, ctaRadial, gridFade, numReveal), CSS třídy pro .svc-row, .ref-card, .stat-bar, .cta-glow' },
    ],
  },
  {
    version: '3.27',
    date: '18. 6. 2026',
    changes: [
      { type: 'feat', text: 'S1 hero: odstraněn odstavec, h1 zvětšen (clamp 52→88px), fontWeight 300 — více prostoru a luxusnější dojem, kopie zkrácena na "Web, který prodává."' },
      { type: 'feat', text: 'S2 výhody: feature card grid nahrazen třemi řadami s velkými čísly (48h / 0 Kč / 100%) v accent barvách (800 weight, 58px) — čistší vizuální hierachie' },
      { type: 'feat', text: 'S3 služby: odebrány ceny z řádků služeb — zbyly jen barevné bary + název, sekce působí čistěji a méně jako ceník' },
      { type: 'feat', text: 'S4 portfolio: odstraněn odstavec s popisem, h2 zvětšen (38→72px, weight 300) — text ustupuje 3D portfoliu v pozadí' },
      { type: 'feat', text: 'S5 statistiky: bullet-list nahrazen 2×2 gridem s velkými čísly (62px, 800 weight) v accent barvách a malými uppercase štítky' },
      { type: 'feat', text: 'S6 CTA: odstraněn odstavec, h2 zkrácen na "Začněte / dnes." (88px, weight 300) — silnější impact při menším textu' },
      { type: 'feat', text: 'Particles: přidána druhá sada fialových částic (500 ks, kontrrotace) — bohatší vizuální atmosféra bez dopadu na výkon' },
      { type: 'feat', text: 'RingAccent: přidány 2 další prstence (fialový ø9, zelený ø5.2) s různými osami rotace a rychlostmi — více vrstvená hloubka scény' },
      { type: 'feat', text: 'Osvětlení: zvýšena intenzita klíčového světla (4→5.5), fill (2.2→3.0), přidáno zadní světlo za monitor (1.4) a horní zelený akcent (0.8) — dramatičtější kontrasty' },
      { type: 'change', text: 'Odstraněny přebytečné transform: translateY/X z textových kontejnerů — GSAP nyní používá čistý opacity fade' },
    ],
  },
  {
    version: '3.26',
    date: '18. 6. 2026',
    changes: [
      { type: 'feat', text: 'Mobile experience: detekce mobilního zařízení (<768px), předává mobile prop do ImmersiveScene' },
      { type: 'feat', text: 'Mobile 3D: na mobilu jemnější kamera (max ±0.7 orbit), antialiasing vypnut, DPR snížen na [0.75, 1]' },
      { type: 'feat', text: 'Mobile particles: 500 místo 2200, RingAccent vypnut — výrazně nižší GPU zátěž' },
      { type: 'feat', text: 'AdaptiveDpr: R3F automaticky snižuje rozlišení při poklesu FPS (performance.min: 0.5)' },
      { type: 'feat', text: 'powerPreference: high-performance — GPU upřednostněn před úsporou baterie' },
      { type: 'feat', text: 'Mobilní layout: media queries opravují padding, zarovnání a max-width pro S1–S6' },
      { type: 'feat', text: 'S1 trust badges: pill-styled badge komponenty (ikona + text) místo prostých checkmark spans' },
      { type: 'change', text: 'will-change: opacity na text kontejnerech — browser optimalizuje compositor layers' },
    ],
  },
  {
    version: '3.25',
    date: '17. 6. 2026',
    changes: [
      { type: 'feat', text: 'Monitor GLB: vygenerován /public/models/monitor.glb (47.9 KB) pomocí Three.js GLTFExporter — chamfer edges, stand, power LED, screen glow' },
      { type: 'feat', text: 'GLTF loader aktivní: monitor.glb se načítá přes useGLTF + Suspense, fallback = procedurální geometrie' },
      { type: 'feat', text: 'useGLTF.preload — model se načítá při startu stránky, ne až při scrollu' },
      { type: 'feat', text: 'scripts/generate-monitor.mjs: Node.js skript pro regeneraci GLB s FileReader polyfill' },
    ],
  },
  {
    version: '3.24',
    date: '17. 6. 2026',
    changes: [
      { type: 'feat', text: 'Monitor hardware: připraven GLTF loader (useGLTF + Suspense) pro model z Sketchfab — umísti monitor.glb do /public/models/' },
      { type: 'feat', text: 'Monitor fallback: pokud GLB soubor chybí, zobrazí se původní procedurální geometrie — stránka se nerozbije' },
      { type: 'change', text: 'Kamera: monX range zúžen na ±0.15 — monitor zůstává celý viditelný vždy, kamera obíhá' },
      { type: 'change', text: 'Kamera S2: orbit vlevo (camX: -2.6), monitor mírně vpravo (+0.15) — pohled ze strany na celý monitor' },
      { type: 'change', text: 'Kamera S3: přímý záběr zezdola (camY: -0.4, camZ: 5.2) — monitor na středu, dramatický detail' },
      { type: 'change', text: 'Kamera S4: orbit vpravo + nahoru (camX: 2.5, camY: 0.8) — monitor mírně vlevo (-0.15), statistiky obklopují' },
    ],
  },
  {
    version: '3.23',
    date: '17. 6. 2026',
    changes: [
      { type: 'feat', text: 'Monitor pohyb zleva doprava: monX swings zvětšeny — S2: monitor jede vpravo (+1.9), S3: vlevo (−1.6), S4: vpravo (+1.6), S5: střed (0)' },
      { type: 'feat', text: 'CameraRig lookAt: zvýšen tracking faktor (0.3→0.42) — kamera lépe sleduje monitor při pohybu' },
      { type: 'change', text: 'Text animace: odstraněn y-slide offset, text se nyní materializuje čistým fade-in bez pohybu' },
      { type: 'change', text: 'Text triggery zpřísněny: end: bottom 38% místo 20% — sekce texty mizí dříve, žádné překrývání na konci' },
      { type: 'feat', text: 'Scroll indikátor: tenká animovaná čára + text "Scroll" ve spodní části S1 — zmizí při prvním scrollu (>60px)' },
    ],
  },
  {
    version: '3.22',
    date: '17. 6. 2026',
    changes: [
      { type: 'feat', text: 'Monitor hardware přepracován: vysoce lesklý tmavý hliník (metalness 0.9, roughness 0.1), tenké bezely, zkosené hrany (4 chamfer strips na všech rozích)' },
      { type: 'feat', text: 'Monitor: nový stojan — tenký hliníkový neck s obloukovým tapered přechodem, matná základna s bevel hranou a reflection plane' },
      { type: 'feat', text: 'Monitor: zadní panel s reliéfní oválnou deskou a ventilačními mřížkami, minimalistický power LED (modrý glow) ve spodním chinbaru' },
      { type: 'feat', text: 'Monitor: subtilní screen-light-bleed efekt, thin top-bezel highlight stripe, screen recess inset pro hloubku' },
      { type: 'feat', text: 'Cinematic kamera: 5 unikátních pohledů — velký levý oblouk (S2), dramatický close-up zdola (S3), ptačí perspektiva (S4), pomalý ústup (S5)' },
      { type: 'feat', text: 'Kamera S1: startuje blíže (camZ: 8.5) s mírnou výškou (camY: 0.15) — monitor je na začátku velký a impozantní' },
      { type: 'feat', text: 'Per-element text stagger: každý child element sekce (badge→headline→tělo→CTA) se animuje samostatně se stagger 0.1s — S1-S6' },
      { type: 'feat', text: 'Při scrollu zpět (onEnterBack): stagger animace probíhá v opačném pořadí (from: end) — přirozenější UX' },
    ],
  },
  {
    version: '3.21',
    date: '17. 6. 2026',
    changes: [
      { type: 'change', text: 'ServiceCards: odstraněn dramatický fly-from-behind efekt, karty se nyní pomalu materializují na místě (scale 0→1 + gentle y-lift)' },
      { type: 'change', text: 'Všechny 3D elementy: pomalejší lerp (0.07→0.045), plynulejší stagger per karta/orb' },
      { type: 'change', text: 'Monitor: pomalejší float animace (0.5→0.38 Hz), slabší mouse parallax, klidnější rotace' },
      { type: 'change', text: 'CameraRig: lerp 0.055→0.038 — kamera se pohybuje hladce jako přechod, ne skok' },
      { type: 'change', text: 'Text přechody: fade-in 0.75s→0.95s, fade-out 0.4s→0.6s, offset 18→12px, ease power2.inOut' },
      { type: 'change', text: 'Glow puls na SvcCards: intenzita snížena (1.6→1.1), frekvence klidnější (1.8→1.4 Hz)' },
    ],
  },
  {
    version: '3.20',
    date: '17. 6. 2026',
    changes: [
      { type: 'fix', text: 'S1 text nyní mizí při scrollu — přidán ScrollTrigger (bottom 20%) který ho vymaže; dřív zůstával přes S2–S6 celou dobu' },
      { type: 'fix', text: 'S2–S6 trigger bounds zpřísněny: start/end top/bottom 20% místo 72%/28% — text se zobrazí jen když je sekce v centru viewportu' },
      { type: 'fix', text: 'Service karty: hard snap scale=0 + odsunutí x=-8 když svcVis<0.02 — žádné "přízračné" karty v přechodech' },
      { type: 'fix', text: 'Portfolio karty a stat orby: stejný hard snap při portVis/statVis<0.02' },
      { type: 'fix', text: 'GSAP scrub: 2 → 1.2 — rychlejší odezva kamery a monitoru, čistší přechody mezi sekcemi' },
    ],
  },
  {
    version: '3.19',
    date: '17. 6. 2026',
    changes: [
      { type: 'feat', text: 'Monitor zvětšen na startu: počáteční monScale 1.0 → 1.25, kamera blíže (camZ: 11 → 10)' },
      { type: 'feat', text: 'Monitor screen: split-layout hero — vlevo headline+CTA, vpravo živé analytické grafy s animovanými bary' },
      { type: 'feat', text: 'Dashboard preview: 5 animovaných chart barů (oscilují nezávisle), visitor trend line, pulsující zelený live dot' },
      { type: 'feat', text: 'Blinkující textový kurzor za headline na obrazovce monitoru' },
      { type: 'feat', text: 'Monitor hardware zvětšen: 3.5×2.4 → 3.7×2.55, screen 3.2×2.1 → 3.4×2.22' },
      { type: 'change', text: 'GSAP timeline: monScale plynule mění 1.25→1.12→1.05→1.12→1.0→0.82 napříč sekcemi' },
    ],
  },
  {
    version: '3.18',
    date: '17. 6. 2026',
    changes: [
      { type: 'feat', text: 'ServiceCards redesign: karty vyletí zpoza monitoru (staggered x: 0 → -2.75) — text z S2: 48 hodin / Bez závazku / Přesně na míru + subtituly' },
      { type: 'feat', text: 'ServiceCards: pulzující glow strip vlevo, dot ikona, divider linka — proporcionální ke monitoru (2.05 × 0.60)' },
      { type: 'feat', text: 'PortCards redesign: text z S4 — projekt + velké výsledkové číslo + metrika, tmavá karta s barevným bottom bandem, blíže monitoru (±2.55)' },
      { type: 'feat', text: 'StatOrbs redesign: gyro systém — 2 prstence na různých osách s různými rychlostmi, 4 tick dot značky kolem rovníku, text číslo + label' },
      { type: 'feat', text: 'StatOrbs: každá koule vlastní barevnou sadu (modrá/fialová/zelená/cyan), pulzující emissive sféra' },
      { type: 'fix', text: 'Oprava prázdné stránky: canvas alpha:false + color attachment, S1 text animovaný na mount, layout bg-white přepsán' },
    ],
  },
  {
    version: '3.17',
    date: '17. 6. 2026',
    changes: [
      { type: 'change', text: 'Pozadí homepage: #080e1c → #06060a (téměř černá s jemným modrým nádechem)' },
      { type: 'change', text: 'Texty přizpůsobeny tmavému pozadí: tělo #64748b → #8892a4, utlumený #475569 → #6b7a8d, sekundární #94a3b8 → #a8b4c4' },
      { type: 'change', text: 'Feature karty a oddělovače — vyšší opacity pro lepší čitelnost na černém pozadí' },
      { type: 'change', text: 'Částice v 3D scéně: opacity 0.5 → 0.65, jasnější barva — na černém pozadí více vyniknou' },
      { type: 'change', text: 'Světla 3D scény — ambient down, point lights up (dramatičtější kontrast na tmavém pozadí)' },
    ],
  },
  {
    version: '3.16',
    date: '17. 6. 2026',
    changes: [
      { type: 'feat', text: 'ImmersiveScene — kompletní scroll-driven 3D zážitek: 600vh kontejner řídí GSAP timeline (scrub 2.2s), kamera prochází 6 pozicemi' },
      { type: 'feat', text: 'Monitor se otáčí, naklání a mění měřítko per-sekce přes lerp v useFrame' },
      { type: 'feat', text: 'Html transform overlay — živý HTML obsah na monitoru (6 panelů: Boot, Hero, Služby, Portfolio, Statistiky, CTA)' },
      { type: 'feat', text: 'ServiceCards — 3 levitující karty služeb vyjíždí zleva (sekce 2), ProjectPanels — 4 portfolio karty (sekce 3), StatOrbs — 4 sféry se statistikami (sekce 4)' },
      { type: 'feat', text: 'GSAP per-section ScrollTrigger: text fade+slide in/out při vstupu/výstupu ze sekce' },
      { type: 'feat', text: 'Nav links bílé na homepage dokud není scroll; pointer-events: none na text sekcích — mouse parallax prochází skrz text' },
    ],
  },
  {
    version: '3.15',
    date: '17. 6. 2026',
    changes: [
      { type: 'feat', text: 'WebGL 3D hero — React Three Fiber canvas s detailním 3D monitorem (mockup webu na obrazovce), 3000 partikulí, 5 orbitujících drátěných tvarů, rotující prstencový akcent' },
      { type: 'feat', text: 'Mouse-driven parallax — kamera i monitor plynule sledují pohyb myši přes lerp (0.04 smoothing)' },
      { type: 'feat', text: 'Magnetická tlačítka — CTA buttony se přitahují k kurzoru (0.28× offset) a vrací se spring animací' },
      { type: 'feat', text: 'Grain overlay — jemná filmová zrnitost přes celou stránku (SVG feTurbulence, opacity 0.038)' },
      { type: 'feat', text: 'Cursor blob — 700px radial gradient sleduje kurzor přes RAF + DOM mutation (bez React re-renderů)' },
      { type: 'feat', text: 'Per-line a char-level reveal — hero headline s IntersectionObserver, text sekce s LineReveal / Reveal' },
      { type: 'feat', text: 'Hero vignette — levý gradient (rgba 0.97 → transparent) zajišťuje čitelnost textu přes 3D scénu' },
      { type: 'feat', text: 'Stats grid redesign — 2×2 tmavá mřížka s CountUp, left border accent a sub-popisky' },
    ],
  },
  {
    version: '3.14',
    date: '17. 6. 2026',
    changes: [
      { type: 'feat', text: '3D interaktivní homepage — monitor s CSS perspective rotací řízenou pohybem myši, plovoucí info badges (dodání, příjem, hodnocení)' },
      { type: 'feat', text: 'TiltCard efekt — 3D naklánění karet s odleskem při hoveru (služby, portfolio, reference)' },
      { type: 'feat', text: 'CountUp animace statistik — čísla se počítají při scrollu do viewport' },
      { type: 'feat', text: 'Směrové scroll animace — fadeInUp / fadeInLeft / fadeInRight / scaleIn dle sekce' },
      { type: 'fix', text: 'Lazy inicializace supabaseAdmin — oprava build chyby při chybějících env proměnných' },
    ],
  },
  {
    version: '3.13',
    date: '16. 6. 2026',
    changes: [
      { type: 'feat', text: 'Soft-delete leadů — smazaný lead jde do koše, ne ihned pryč' },
      { type: 'feat', text: 'Koš (/admin/trash) — přehled smazaných leadů s odpočtem zbývajícího času (12h okno)' },
      { type: 'feat', text: 'Obnovení leadu z koše — tlačítko Obnovit vrátí lead zpět do přehledu' },
      { type: 'feat', text: 'Vyprázdnit koš — okamžité natrvalo smazání všech položek v koši' },
      { type: 'feat', text: 'Checkboxy v tabulce — výběr více leadů najednou (select all v headeru)' },
      { type: 'feat', text: 'Bulk delete — smazání vybraných leadů najednou přes červenou action bar' },
      { type: 'feat', text: 'Trash ikona per řádek — hover odhalí ikonu koše, klik vyžaduje potvrzení inline' },
    ],
  },
  {
    version: '3.12',
    date: '16. 6. 2026',
    changes: [
      { type: 'feat', text: 'Mobilní responsivita admin navbaru — hamburger menu s rozbalovacím dropdownem' },
    ],
  },
  {
    version: '3.11',
    date: '16. 6. 2026',
    changes: [
      { type: 'feat', text: 'Animace otevření modalu — backdrop fade-in, karta slide-up ze spodu s ease-out cubic-bezier' },
      { type: 'feat', text: 'Success stav — animované SVG: kolečko se "nakreslí" stroke-dashoffset animací, fajfka vyjede z kolečka s půl-sekundovým zpožděním' },
      { type: 'feat', text: 'Pop-in efekt kolečka s přestřelením (scale 0→1.18→1) a postupný fade-in textu "Poptávka odeslána" a "Těšíme se na spolupráci"' },
      { type: 'feat', text: 'Spinner animace na tlačítku Odesílám...' },
    ],
  },
  {
    version: '3.10',
    date: '16. 6. 2026',
    changes: [
      { type: 'feat', text: 'Kalkulace odesílá lead přímo do adminu přes /api/kalkulace — bez redirectu na kontaktní formulář' },
      { type: 'feat', text: 'Modal na kalkulaci — jméno, email, telefon; po submitu lead okamžitě přistane v přehledu' },
      { type: 'feat', text: 'Leady z webu označeny "Z webu" badge v dashboardu i v detailu leadu' },
      { type: 'feat', text: 'Detail leadu — karta "Poptávka z kalkulace" zobrazuje vybrané doplňky, cenu a speciální požadavky přehledně' },
    ],
  },
  {
    version: '3.9',
    date: '16. 6. 2026',
    changes: [
      { type: 'feat', text: 'Kalkulační stránka pro každou službu (/kalkulace/[slug]) — výběr doplňků s live výpočtem ceny a polem pro speciální požadavky' },
      { type: 'feat', text: 'Ceny na homepage i /sluzby zobrazeny jako "od X Kč" — kliknutí na kartu otevře kalkulaci místo přehledu služeb' },
      { type: 'feat', text: 'Kontaktní formulář pre-filluje zprávu z kalkulace přes URL param ?message=...' },
      { type: 'change', text: 'Tlačítko "Chci tuto službu" na /sluzby přejmenováno na "Spočítat cenu" a odkazuje na kalkulaci' },
    ],
  },
  {
    version: '3.8',
    date: '16. 6. 2026',
    changes: [
      { type: 'feat', text: 'Nové logo — modernizovaný W+i mark se hvězdou, sjednoceno ve všech komponentách (nav, footer, login)' },
      { type: 'change', text: 'Barevná paleta přepnuta z indigo na modrou (#2563EB) dle nového loga — platí pro celý web i admin' },
    ],
  },
  {
    version: '3.7',
    date: '15. 6. 2026',
    changes: [
      { type: 'feat', text: 'Sekce "Říkáme to rovnou" na homepage — upřímná zpráva o tom, že web není zázrak, ale dobrý start' },
    ],
  },
  {
    version: '3.6',
    date: '15. 6. 2026',
    changes: [
      { type: 'feat', text: 'Unsplash fotky na homepage, /o-nas a dalších stránkách — reálné vizuály místo abstraktních placeholderů' },
      { type: 'feat', text: 'DM Serif Display font pro nadpisy — lepší typografický kontrast, více „rozbitá" stránka' },
      { type: 'feat', text: 'Odstraněny emoji ikony ze služeb a nahrazeny SVG ikonami, odstraněn „AI Engine" tým' },
      { type: 'feat', text: 'Tmavá sekce pro statistiky na homepage, fialový gradient v process sekci, více barevných pozadí' },
      { type: 'change', text: 'Kopie webu přepsána — přirozený tón, Max zmíněn jménem, přístup k AI nástrojům přirozený' },
    ],
  },
  {
    version: '3.5',
    date: '15. 6. 2026',
    changes: [
      { type: 'feat', text: 'Kompletní marketingový web — 6 stránek: Domů, Služby, Portfolio, Jak pracujeme, O nás, Reference, Kontakt' },
      { type: 'feat', text: 'Kontaktní formulář na /kontakt posílá poptávky přímo do admin panelu s Discord notifikací' },
      { type: 'feat', text: 'Scroll animace, hover efekty, mobilní responsivita a SEO metadata na všech veřejných stránkách' },
    ],
  },
  {
    version: '3.4',
    date: '15. 6. 2026',
    changes: [
      { type: 'feat', text: 'Marketing homepage na / — hero, jak to funguje, obory, features, formulář pro zákazníky' },
      { type: 'feat', text: 'Admin přesunut na /admin — celý interní nástroj na /admin/dashboard, /admin/leads atd.' },
      { type: 'feat', text: 'Veřejný formulář "Chci web" na homepage vytvoří lead přímo v databázi a pošle Discord notifikaci' },
    ],
  },
  {
    version: '3.3',
    date: '15. 6. 2026',
    changes: [
      { type: 'feat', text: 'Aktivity na leadech — přidej připomínku (📞 Zavolat / ✉️ Napsat / 🤝 Schůzka) s datem a časem přímo na detailu leadu' },
      { type: 'feat', text: 'Sdílený kalendář — webcal:// odkaz v Nastavení, celý tým si přidá do Apple/Google/Outlook Calendar a aktivity se syncují automaticky každou hodinu' },
    ],
  },
  {
    version: '3.2',
    date: '15. 6. 2025',
    changes: [
      { type: 'feat', text: 'Hodnota dealu (Kč) — pole na každém leadu, inline editace v detailu, zadání při vytvoření' },
      { type: 'feat', text: 'Revenue dashboard — Pipeline / Uzavřeno celkem / Tento měsíc / Průměr na deal + conversion rate (zobrazí se po zadání první hodnoty)' },
    ],
  },
  {
    version: '3.1',
    date: '15. 6. 2025',
    changes: [
      { type: 'feat', text: 'Kanban board — drag & drop leady mezi sloupci pipeline (Nový / Vygenerováno / Schváleno / Draft hotov / Zamítnuto)' },
      { type: 'feat', text: 'Toggle Tabulka ↔ Kanban na dashboardu, volba se uloží' },
    ],
  },
  {
    version: '3.0',
    date: '15. 6. 2025',
    changes: [
      { type: 'fix', text: 'Jméno profilu se okamžitě aktualizuje všude (navbar, dashboard) po uložení v nastavení — sdílený ProfileContext' },
    ],
  },
  {
    version: '2.9',
    date: '15. 6. 2025',
    changes: [
      { type: 'feat', text: 'Stránka Nastavení — změna jména profilu (zobrazuje se v dashboardu)' },
      { type: 'feat', text: 'Tmavý / světlý režim — přepínač v navbaru, volba přetrvá po dalším otevření' },
    ],
  },
  {
    version: '2.8',
    date: '15. 6. 2025',
    changes: [
      { type: 'feat', text: 'Kompletní redesign UI — nová barevná paleta dle loga (tmavá navy + modrá), SVG logo mark v navbaru, přehlednější karty a hierarchie' },
      { type: 'feat', text: 'Login stránka s prominentním logem a čistším layoutem' },
      { type: 'change', text: 'StatusBadge přeložen do češtiny' },
    ],
  },
  {
    version: '2.7',
    date: '15. 6. 2025',
    changes: [
      { type: 'fix', text: 'Discord notifikace na Vercelu — oprava serverless prostředí kde fire-and-forget fetch nestihl odeslat před ukončením funkce' },
    ],
  },
  {
    version: '2.6',
    date: '15. 6. 2025',
    changes: [
      { type: 'fix', text: 'Discord webhook URL se čte při každém volání místo při startu modulu — opravuje nefunkční notifikace na Vercelu' },
    ],
  },
  {
    version: '2.5',
    date: '15. 6. 2025',
    changes: [
      { type: 'feat', text: 'Discord notifikace — webhook posílá zprávy při vytvoření leadu, změně statusu, úpravě, smazání a vygenerování stránky' },
    ],
  },
  {
    version: '2.4',
    date: '15. 6. 2025',
    changes: [
      { type: 'feat', text: 'Changelog dostupný přímo z hlavní lišty (odkaz v Navbaru)' },
      { type: 'feat', text: 'Přihlášení do dashboardu automaticky odemkne changelog — externí heslo jen pro sdílení' },
    ],
  },
  {
    version: '2.3',
    date: '15. 6. 2025',
    changes: [
      { type: 'feat', text: 'Changelog stránka s historií verzí a přehledem změn, chráněná heslem' },
    ],
  },
  {
    version: '2.2',
    date: '15. 6. 2025',
    changes: [
      { type: 'feat', text: 'Automatická synchronizace uživatelských profilů — jména se zobrazují ve sloupci Zpracovává a Přidal' },
      { type: 'feat', text: 'Sekce Tým nyní zobrazuje statistiky všech členů (přidáno, zpracovává, vygenerováno, schváleno, drafty)' },
    ],
  },
  {
    version: '2.1',
    date: '15. 6. 2025',
    changes: [
      { type: 'feat', text: 'Preview stránky vygenerovaných webů jsou veřejně přístupné bez přihlášení — lze sdílet odkaz přímo klientovi' },
    ],
  },
  {
    version: '2.0',
    date: '15. 6. 2025',
    changes: [
      { type: 'change', text: 'Generování přepnuto zpět na Anthropic claude-sonnet-4-6' },
    ],
  },
  {
    version: '1.9',
    date: '15. 6. 2025',
    changes: [
      { type: 'change', text: 'Generování přepnuto na Google Gemini 2.0 Flash (free tier, nulové náklady)' },
    ],
  },
  {
    version: '1.8',
    date: '15. 6. 2025',
    changes: [
      { type: 'fix', text: 'Oprava duplicitního klíče při regeneraci webu' },
      { type: 'fix', text: 'Odblokování zaseknutého leadu ve stavu generating' },
      { type: 'fix', text: 'Prázdný preview se nyní správně rozpozná a nezobrazuje' },
    ],
  },
  {
    version: '1.7',
    date: '15. 6. 2025',
    changes: [
      { type: 'fix', text: 'Oprava 5min timeoutu — vypnuty SDK retry pokusy, nastaven 90s timeout na generování' },
    ],
  },
];

const TYPE_CONFIG: Record<ChangeType, { label: string; className: string }> = {
  feat:   { label: 'Nové',   className: 'bg-blue-50 text-blue-700 border-blue-200' },
  fix:    { label: 'Oprava', className: 'bg-amber-50 text-amber-700 border-amber-200' },
  change: { label: 'Změna',  className: 'bg-slate-100 text-slate-600 border-slate-200' },
};

export default function ChangelogPage() {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch('/api/changelog/auth')
      .then((r) => r.json())
      .then((d) => setAuthenticated(d.authenticated));
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    const res = await fetch('/api/changelog/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });
    if (res.ok) {
      setAuthenticated(true);
    } else {
      setError('Nesprávné heslo.');
    }
    setLoading(false);
  }

  if (authenticated === null) {
    return <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center text-slate-300 text-sm">Načítání…</div>;
  }

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 w-full max-w-sm">
          <div className="mb-6">
            <p className="text-xs font-semibold text-blue-600 uppercase tracking-widest mb-1">WebsiteAgent</p>
            <h1 className="text-xl font-bold text-slate-900">Changelog</h1>
            <p className="text-sm text-slate-400 mt-1">Zadejte heslo pro zobrazení</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg">
                {error}
              </div>
            )}
            <div>
              <label className="label">Heslo</label>
              <input
                className="input"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoFocus
              />
            </div>
            <button type="submit" className="btn-primary w-full" disabled={loading}>
              {loading ? 'Ověřuji…' : 'Vstoupit'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <div className="max-w-2xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-10">
          <p className="text-xs font-semibold text-blue-600 uppercase tracking-widest mb-2">WebsiteAgent</p>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Changelog</h1>
          <p className="text-sm text-slate-400 mt-1">Historie verzí a provedených změn</p>
        </div>

        {/* Timeline */}
        <div className="relative">
          <div className="absolute left-[11px] top-2 bottom-2 w-px bg-gray-200" />

          <div className="space-y-8">
            {CHANGELOG.map((v, i) => (
              <div key={v.version} className="relative flex gap-5">
                {/* Dot */}
                <div className={`relative z-10 w-6 h-6 rounded-full border-2 flex-shrink-0 mt-0.5 flex items-center justify-center ${
                  i === 0
                    ? 'bg-blue-600 border-blue-600'
                    : 'bg-white border-gray-300'
                }`}>
                  {i === 0 && <div className="w-2 h-2 rounded-full bg-white" />}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 pb-2">
                  <div className="flex items-center gap-3 mb-3">
                    <span className={`text-sm font-bold px-2.5 py-0.5 rounded-full border font-mono ${
                      i === 0
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white text-gray-700 border-gray-200'
                    }`}>
                      v{v.version}
                    </span>
                    <span className="text-xs text-gray-400">{v.date}</span>
                    {i === 0 && (
                      <span className="text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                        Aktuální
                      </span>
                    )}
                  </div>

                  <div className="bg-white rounded-xl border border-gray-200 shadow-sm divide-y divide-gray-50">
                    {v.changes.map((c, j) => {
                      const cfg = TYPE_CONFIG[c.type];
                      return (
                        <div key={j} className="flex items-start gap-3 px-4 py-3">
                          <span className={`mt-0.5 text-xs font-semibold px-2 py-0.5 rounded border flex-shrink-0 ${cfg.className}`}>
                            {cfg.label}
                          </span>
                          <p className="text-sm text-gray-700 leading-relaxed">{c.text}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
