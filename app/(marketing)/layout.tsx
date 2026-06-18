import { MarketingNav } from '@/components/marketing/MarketingNav';
import { Footer } from '@/components/marketing/Footer';
import { DM_Serif_Display } from 'next/font/google';
import type { Metadata } from 'next';

const serif = DM_Serif_Display({ subsets: ['latin'], weight: '400', style: ['normal', 'italic'], variable: '--font-display' });

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
    <div className={`bg-[#060d1a] text-slate-100 antialiased ${serif.variable}`}>
      <MarketingNav />
      <main>{children}</main>
      <Footer />
    </div>
  );
}
