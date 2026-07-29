import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Reference – Co říkají naši klienti',
  description: 'Přečtěte si recenze a zkušenosti firem, kterým jsme vytvořili webové stránky. Spokojení klienti z celé České republiky.',
  keywords: ['recenze webová agentura', 'reference tvorba webu', 'zkušenosti s WebsiteAgent', 'hodnocení webdesign'],
  openGraph: {
    title: 'Reference – Co říkají naši klienti | WebsiteAgent',
    description: 'Recenze a zkušenosti firem, kterým jsme vytvořili web.',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
