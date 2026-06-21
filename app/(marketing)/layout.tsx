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

      {/* Decorative lines — right cluster */}
      <div aria-hidden style={{
        position: 'fixed', top: 0, right: 0,
        width: '520px', height: '100vh',
        zIndex: 0, pointerEvents: 'none', overflow: 'hidden',
      }}>
        <svg width="100%" height="100%" viewBox="0 0 520 900" preserveAspectRatio="xMaxYMid meet" xmlns="http://www.w3.org/2000/svg">
          <g stroke="#d8d3cc" strokeWidth="1" fill="none" opacity="0.9">
            <path d="M 560 -80 C 420 80  280 160 380 340 S 520 520 360 700 S 220 860 400 980" />
            <path d="M 590 -80 C 450 80  310 160 410 340 S 550 520 390 700 S 250 860 430 980" strokeWidth="0.8" />
            <path d="M 530 -80 C 390 80  250 160 350 340 S 490 520 330 700 S 190 860 370 980" strokeWidth="1.2" />
            <path d="M 620 -80 C 480 80  340 160 440 340 S 580 520 420 700 S 280 860 460 980" strokeWidth="0.7" />
            <path d="M 500 -80 C 360 80  220 160 320 340 S 460 520 300 700 S 160 860 340 980" strokeWidth="0.9" />
            <path d="M 650 -80 C 510 80  370 160 470 340 S 610 520 450 700 S 310 860 490 980" strokeWidth="0.6" />
            <path d="M 470 -80 C 330 80  190 160 290 340 S 430 520 270 700 S 130 860 310 980" strokeWidth="0.5" />
          </g>
        </svg>
      </div>

      {/* Decorative lines — bottom-left accent */}
      <div aria-hidden style={{
        position: 'fixed', bottom: 0, left: 0,
        width: '340px', height: '60vh',
        zIndex: 0, pointerEvents: 'none', overflow: 'hidden',
      }}>
        <svg width="100%" height="100%" viewBox="0 0 340 540" preserveAspectRatio="xMinYMax meet" xmlns="http://www.w3.org/2000/svg">
          <g stroke="#d8d3cc" strokeWidth="1" fill="none" opacity="0.7">
            <path d="M -40 600 C 80 450 40 330 160 220 S 280 120 180 -20" />
            <path d="M -70 600 C 50 450 10 330 130 220 S 250 120 150 -20" strokeWidth="0.8" />
            <path d="M -10 600 C 110 450 70 330 190 220 S 310 120 210 -20" strokeWidth="0.7" />
            <path d="M -100 600 C 20 450 -20 330 100 220 S 220 120 120 -20" strokeWidth="0.6" />
            <path d="M 20 600 C 140 450 100 330 220 220 S 340 120 240 -20" strokeWidth="0.5" />
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
