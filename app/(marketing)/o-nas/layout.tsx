import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'O nás – Kdo stojí za WebsiteAgent',
  description: 'Jsme tým vývojářů a designérů, kteří tvoří moderní weby pro české firmy. Rychle, profesionálně a za férovou cenu.',
  keywords: ['webová agentura', 'tvorba webů Česko', 'webdesign agentura', 'WebsiteAgent tým'],
  openGraph: {
    title: 'O nás – Kdo stojí za WebsiteAgent',
    description: 'Tým vývojářů a designérů tvořících moderní weby pro české firmy.',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
