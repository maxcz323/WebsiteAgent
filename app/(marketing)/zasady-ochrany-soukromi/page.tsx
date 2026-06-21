import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Zásady ochrany soukromí',
  description: 'Informace o zpracování osobních údajů na webu WebsiteAgent.',
};

const SECTIONS = [
  {
    title: '1. Správce osobních údajů',
    content: `Správcem osobních údajů je WebsiteAgent (dále jen „my" nebo „správce"). Kontaktovat nás můžete na e-mailu info@website-agent.cz nebo telefonu +420 606 027 802.`,
  },
  {
    title: '2. Jaké údaje zpracováváme',
    content: `Zpracováváme pouze údaje, které nám sami poskytnete prostřednictvím kontaktního formuláře nebo kalkulace na tomto webu:\n\n• Jméno a příjmení\n• E-mailová adresa\n• Telefonní číslo (volitelně)\n• Název firmy nebo obor podnikání\n• Zpráva nebo poznámky k poptávce\n\nDále zpracováváme anonymní analytická data o návštěvnosti webu (pokud udělíte souhlas s analytickými cookies).`,
  },
  {
    title: '3. Účel a právní základ zpracování',
    content: `Vaše osobní údaje zpracováváme za těmito účely:\n\n• Odpověď na vaši poptávku a vzájemná komunikace — právní základ: oprávněný zájem nebo plnění smlouvy (čl. 6 odst. 1 písm. b) a f) GDPR)\n• Zasílání obchodních sdělení — pouze s vaším souhlasem (čl. 6 odst. 1 písm. a) GDPR)\n• Analytika webu — pouze s vaším souhlasem prostřednictvím cookies`,
  },
  {
    title: '4. Jak dlouho údaje uchováváme',
    content: `Osobní údaje uchováváme po dobu nezbytně nutnou k naplnění účelu, pro který byly shromážděny:\n\n• Poptávky bez uzavřené smlouvy: 1 rok od přijetí poptávky\n• Údaje z uzavřených smluv: 5 let od ukončení smluvního vztahu (daňové a účetní povinnosti)\n• Souhlas s newsletterem: do odvolání souhlasu`,
  },
  {
    title: '5. Komu údaje předáváme',
    content: `Vaše údaje neprodáváme ani nepronajímáme třetím stranám. Mohou k nim mít přístup pouze:\n\n• Technické nástroje pro správu e-mailů a projektů (např. Google Workspace)\n• Analytické nástroje (Google Analytics) — pouze v anonymizované podobě a jen po vašem souhlasu\n• Účetní nebo právní poradci, pokud to vyžaduje zákon\n\nVšichni zpracovatelé jsou vázáni mlčenlivostí a zpracovávají data výhradně dle našich pokynů.`,
  },
  {
    title: '6. Vaše práva',
    content: `Jako subjekt údajů máte následující práva:\n\n• Právo na přístup — kdykoli si můžete vyžádat přehled údajů, které o vás zpracováváme\n• Právo na opravu — pokud jsou vaše údaje nepřesné, opravíme je\n• Právo na výmaz — „právo být zapomenut" za podmínek stanovených GDPR\n• Právo na omezení zpracování\n• Právo na přenositelnost údajů\n• Právo vznést námitku proti zpracování\n• Právo odvolat souhlas — kdykoli, bez vlivu na zákonnost zpracování před odvoláním\n\nŽádost uplatněte e-mailem na info@website-agent.cz. Odpovíme do 30 dnů.`,
  },
  {
    title: '7. Cookies',
    content: `Tento web používá cookies. Nezbytné cookies zajišťují základní funkčnost webu a nepotřebují váš souhlas. Analytické cookies (Google Analytics) aktivujeme pouze na základě vašeho souhlasu udělného prostřednictvím banneru při první návštěvě.\n\nSvůj souhlas s analytickými cookies můžete kdykoli odvolat smazáním cookies v nastavení prohlížeče.`,
  },
  {
    title: '8. Zabezpečení',
    content: `Veškeré přenosy dat jsou šifrované (HTTPS/SSL). Přístup k osobním údajům mají pouze oprávněné osoby a je chráněn heslem. Pravidelně provádíme bezpečnostní kontroly.`,
  },
  {
    title: '9. Stížnosti',
    content: `Pokud se domníváte, že zpracování vašich osobních údajů je v rozporu s GDPR, máte právo podat stížnost u dozorového úřadu:\n\nÚřad pro ochranu osobních údajů\nPplk. Sochora 27, 170 00 Praha 7\nwww.uoou.cz`,
  },
  {
    title: '10. Aktualizace těchto zásad',
    content: `Tyto zásady ochrany soukromí můžeme čas od času aktualizovat. O podstatných změnách vás budeme informovat e-mailem (pokud nám ho poskytli) nebo oznámením na webu. Datum poslední aktualizace je uvedeno níže.`,
  },
];

export default function ZasadyPage() {
  return (
    <div className="pt-28 pb-24" style={{ background: '#faf7f6' }}>
      <div className="max-w-3xl mx-auto px-5 sm:px-8">

        {/* Header */}
        <div className="mb-14">
          <p style={{ fontSize: 11, fontWeight: 700, color: 'rgba(40,85,112,0.55)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 14 }}>
            Právní dokumenty
          </p>
          <h1 style={{ fontSize: 'clamp(28px,4vw,40px)', fontWeight: 700, color: '#1a2e3d', letterSpacing: '-0.02em', marginBottom: 16 }}>
            Zásady ochrany soukromí
          </h1>
          <p style={{ color: '#a8a4a0', fontSize: 14 }}>
            Poslední aktualizace: 21. června 2026
          </p>
        </div>

        {/* Intro */}
        <div style={{ background: 'rgba(40,85,112,0.05)', border: '1px solid rgba(40,85,112,0.12)', borderRadius: 14, padding: '20px 24px', marginBottom: 40 }}>
          <p style={{ color: '#5c5650', lineHeight: 1.75, fontSize: 15 }}>
            Ochrana vašeho soukromí je pro nás důležitá. Tento dokument vysvětluje, jaké osobní údaje shromažďujeme, proč a jak je používáme — v souladu s nařízením GDPR (EU) 2016/679.
          </p>
        </div>

        {/* Sections */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {SECTIONS.map((s, i) => (
            <div key={s.title} style={{ borderTop: i === 0 ? '1px solid #e3ded7' : undefined, borderBottom: '1px solid #e3ded7', padding: '32px 0' }}>
              <h2 style={{ fontSize: 17, fontWeight: 700, color: '#1a2e3d', marginBottom: 14 }}>{s.title}</h2>
              <div style={{ color: '#5c5650', lineHeight: 1.8, fontSize: 14, whiteSpace: 'pre-line' }}>
                {s.content}
              </div>
            </div>
          ))}
        </div>

        {/* Contact CTA */}
        <div style={{ marginTop: 48, background: '#fff', border: '1px solid #e3ded7', borderRadius: 16, padding: '28px 32px', display: 'flex', flexDirection: 'column', gap: 6 }}>
          <p style={{ fontWeight: 700, color: '#1a2e3d', fontSize: 15 }}>Máte otázky?</p>
          <p style={{ color: '#6b6560', fontSize: 14 }}>
            Neváhejte nás kontaktovat na{' '}
            <a href="mailto:info@website-agent.cz" style={{ color: '#285570', fontWeight: 600, textDecoration: 'none' }}>
              info@website-agent.cz
            </a>
            {' '}— rádi vše vysvětlíme.
          </p>
        </div>
      </div>
    </div>
  );
}
