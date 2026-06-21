import { MarketingNav } from '@/components/marketing/MarketingNav';
import { Footer } from '@/components/marketing/Footer';
import { CookieConsent } from '@/components/marketing/CookieConsent';
import { Montserrat } from 'next/font/google';
import type { Metadata } from 'next';

const display = Montserrat({ subsets: ['latin'], weight: ['300', '400', '600', '700'], variable: '--font-display' });

export const metadata: Metadata = {
  title: { default: 'WebsiteAgent – Profesionální weby pro lokální firmy', template: '%s | WebsiteAgent' },
  description: 'Tvoříme moderní webové stránky pro lokální firmy. Profesionální design, rychlé dodání do 48 hodin, platíte až po schválení.',
  keywords: ['weby pro firmy', 'webové stránky', 'landing page', 'lokální firmy'],
  openGraph: {
    type: 'website',
    locale: 'cs_CZ',
    siteName: 'WebsiteAgent',
    title: 'WebsiteAgent – Profesionální weby pro lokální firmy',
    description: 'Moderní weby pro lokální firmy. Hotové do 48 hodin. Platíte až po schválení.',
  },
};

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`bg-[#faf7f6] text-[#1a2e3d] antialiased ${display.variable}`}>

      {/* Decorative flowing lines — fixed overlay, blends away on dark sections */}
      <div
        aria-hidden
        style={{
          position: 'fixed', inset: 0, zIndex: 2,
          pointerEvents: 'none', overflow: 'hidden',
          mixBlendMode: 'multiply',
        }}
      >
        <svg
          width="100%" height="100%"
          viewBox="0 0 1440 900"
          preserveAspectRatio="xMidYMid slice"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g stroke="#cac5be" strokeWidth="1" fill="none">
            <path d="M-100,30  C 200,-25  450,110  720,30  S 1050,-45 1330,55  S 1600,95  1700,30"  />
            <path d="M-100,105 C 150,50   430,185  700,105 S 1030,25  1300,120 S 1565,160 1700,105" />
            <path d="M-100,180 C 250,125  480,260  760,180 S 1080,100 1350,200 S 1610,240 1700,180" strokeWidth="0.8" />
            <path d="M-100,255 C 180,195  440,330  720,255 S 1050,175 1320,270 S 1585,310 1700,255" />
            <path d="M-100,330 C 220,270  490,400  765,328 S 1075,255 1345,345 S 1595,385 1700,330" strokeWidth="1.2" />
            <path d="M-100,405 C 160,345  420,475  700,400 S 1010,325 1290,420 S 1570,465 1700,405" strokeWidth="0.8" />
            <path d="M-100,480 C 270,420  530,550  800,478 S 1110,400 1385,495 S 1635,535 1700,480" />
            <path d="M-100,555 C 200,495  460,625  740,550 S 1060,475 1335,570 S 1595,615 1700,555" strokeWidth="1.2" />
            <path d="M-100,630 C 240,570  500,700  780,628 S 1095,550 1365,645 S 1625,690 1700,630" strokeWidth="0.8" />
            <path d="M-100,705 C 190,645  450,775  730,703 S 1040,625 1320,720 S 1590,765 1700,705" />
            <path d="M-100,780 C 260,720  510,850  790,778 S 1105,700 1375,795 S 1635,840 1700,780" strokeWidth="1.2" />
            <path d="M-100,855 C 170,790  430,920  720,848 S 1045,770 1315,865 S 1585,910 1700,855" strokeWidth="0.8" />
            <path d="M-100,930 C 220,865  480,995  760,920 S 1085,840 1360,935 S 1625,980 1700,930" />
          </g>
        </svg>
      </div>

      <MarketingNav />
      <main style={{ position: 'relative', zIndex: 1 }}>{children}</main>
      <Footer />
      <CookieConsent />
    </div>
  );
}
