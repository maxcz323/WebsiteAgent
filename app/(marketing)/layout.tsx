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

      <MarketingNav />
      <main style={{ position: 'relative', zIndex: 1 }}>{children}</main>
      <Footer />
      <CookieConsent />

      {/* Decorative lines — asymetrické, každá jiná */}
      <div aria-hidden style={{
        position: 'fixed', top: 0, right: 0,
        width: '560px', height: '100vh',
        zIndex: 10, pointerEvents: 'none', overflow: 'hidden',
        mixBlendMode: 'multiply',
      }}>
        <svg width="100%" height="100%" viewBox="0 0 560 900" preserveAspectRatio="xMaxYMid meet" xmlns="http://www.w3.org/2000/svg">
          <g stroke="#bab4ad" fill="none">
            {/* Každá křivka má unikátní tvar, amplitudu i délku */}
            <path strokeWidth="1"   d="M 560 -60 C 380 60  200 200 340 380 S 480 580 300 760 S 180 880 420 1000" />
            <path strokeWidth="0.7" d="M 520 20  C 460 180 280 140 360 360 S 440 600 240 720 S 160 840 380 960" />
            <path strokeWidth="1.2" d="M 600 -20 C 520 120 300 80  440 300 S 560 500 380 680 S 260 820 460 940" />
            <path strokeWidth="0.5" d="M 480 80  C 360 260 160 180 300 420 S 400 620 200 780 S 120 920 340 1020" />
            <path strokeWidth="0.9" d="M 640 40  C 540 200 400 100 500 340 S 600 540 420 700 S 320 860 500 980" />
            <path strokeWidth="0.6" d="M 440 -40 C 280 140 100 240 260 440 S 360 660 140 800 S  60 960 300 1040" />
            <path strokeWidth="1.1" d="M 580 100 C 480 280 360 160 460 400 S 540 580 340 760 S 220 900 440 1000" />
          </g>
        </svg>
      </div>

      <div aria-hidden style={{
        position: 'fixed', bottom: 0, left: 0,
        width: '380px', height: '65vh',
        zIndex: 10, pointerEvents: 'none', overflow: 'hidden',
        mixBlendMode: 'multiply',
      }}>
        <svg width="100%" height="100%" viewBox="0 0 380 580" preserveAspectRatio="xMinYMax meet" xmlns="http://www.w3.org/2000/svg">
          <g stroke="#bab4ad" fill="none">
            <path strokeWidth="1"   d="M -60 620 C  60 460  20 300 180 180 S 320  80 200 -40" />
            <path strokeWidth="0.7" d="M  20 640 C 160 500  80 320 220 200 S 380 100 260 -20" />
            <path strokeWidth="0.5" d="M -20 600 C 100 420  40 260 160 160 S 280  60 140 -60" />
            <path strokeWidth="0.9" d="M  60 660 C 200 520 140 340 280 220 S 420 120 300  -0" />
            <path strokeWidth="0.6" d="M -100 580 C  20 400  -40 240 120 120 S 260  20  80 -80" />
          </g>
        </svg>
      </div>

    </div>
  );
}
