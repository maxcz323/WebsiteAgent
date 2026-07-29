import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Portfolio – Ukázky našich webů',
  description: 'Podívejte se na weby a landing pages, které jsme vytvořili pro české firmy. Moderní design, responzivní zpracování.',
  keywords: ['portfolio webů', 'ukázky webových stránek', 'reference webdesign', 'příklady landing pages'],
  openGraph: {
    title: 'Portfolio – Ukázky našich webů | WebsiteAgent',
    description: 'Ukázky webů a landing pages pro české firmy.',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
