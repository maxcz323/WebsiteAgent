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
