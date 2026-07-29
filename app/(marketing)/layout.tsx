import { MarketingNav } from '@/components/marketing/MarketingNav';
import { Footer } from '@/components/marketing/Footer';
import { Montserrat, Inter } from 'next/font/google';
import type { Metadata } from 'next';

const display = Montserrat({ subsets: ['latin'], weight: ['300', '400', '600', '700'], variable: '--font-display' });
const body    = Inter({ subsets: ['latin'], weight: ['400', '500', '600'], variable: '--font-body' });

export const metadata: Metadata = {
  title: { default: 'WebsiteAgent – Tvorba webových stránek pro firmy', template: '%s | WebsiteAgent' },
  description: 'Tvoříme profesionální webové stránky a landing pages pro české firmy. Moderní design, hotovo do 48 hodin, platíte až po schválení výsledku. Od 9 900 Kč.',
  keywords: ['tvorba webových stránek', 'weby pro firmy', 'webové stránky', 'landing page', 'webdesign', 'tvorba webu', 'webová agentura', 'web pro firmu', 'moderní web'],
  openGraph: {
    type: 'website',
    locale: 'cs_CZ',
    siteName: 'WebsiteAgent',
    title: 'WebsiteAgent – Tvorba webových stránek pro firmy',
    description: 'Profesionální weby pro české firmy. Moderní design, hotovo do 48 hodin, platíte až po schválení. Od 9 900 Kč.',
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
