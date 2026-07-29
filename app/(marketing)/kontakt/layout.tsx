import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Kontakt – Spojte se s námi',
  description: 'Kontaktujte WebsiteAgent pro nezávaznou poptávku na tvorbu webu. Odpovídáme do 24 hodin.',
  keywords: ['kontakt webová agentura', 'poptávka webu', 'nezávazná konzultace web'],
  openGraph: {
    title: 'Kontakt – Spojte se s námi | WebsiteAgent',
    description: 'Kontaktujte nás pro nezávaznou poptávku. Odpovídáme do 24 hodin.',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
