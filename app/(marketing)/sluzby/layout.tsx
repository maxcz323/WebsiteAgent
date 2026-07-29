import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Služby – Tvorba webů a landing pages',
  description: 'Nabízíme tvorbu landing pages od 9 900 Kč, firemních webů od 14 900 Kč a e-shopů od 24 900 Kč. Moderní design, rychlé dodání do 48 hodin.',
  keywords: ['tvorba webových stránek', 'landing page', 'firemní web', 'e-shop', 'webdesign', 'ceník webu'],
  openGraph: {
    title: 'Služby – Tvorba webů a landing pages | WebsiteAgent',
    description: 'Landing pages od 9 900 Kč, firemní weby od 14 900 Kč, e-shopy od 24 900 Kč. Hotovo do 48 hodin.',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
