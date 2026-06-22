import { MarketingNav } from '@/components/marketing/MarketingNav';
import { Footer } from '@/components/marketing/Footer';
import { Montserrat, Inter } from 'next/font/google';
import type { Metadata } from 'next';

const display = Montserrat({ subsets: ['latin'], weight: ['300', '400', '600', '700'], variable: '--font-display' });
const body    = Inter({ subsets: ['latin'], weight: ['400', '500', '600'], variable: '--font-body' });

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
    <div className={`bg-[#faf7f6] text-[#1a2e3d] antialiased ${display.variable} ${body.variable}`}>

      <MarketingNav />
      <main style={{ position: 'relative', zIndex: 1 }}>{children}</main>
      <Footer />
    </div>
  );
}
