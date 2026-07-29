import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Jak pracujeme – Náš proces tvorby webu',
  description: 'Od poptávky po hotový web za 48 hodin. Pošlete formulář, navrhneme web, platíte až po schválení. Jednoduchý a transparentní proces.',
  keywords: ['jak vzniká web', 'proces tvorby webu', 'webdesign postup', 'tvorba webu krok za krokem'],
  openGraph: {
    title: 'Jak pracujeme – Náš proces tvorby webu | WebsiteAgent',
    description: 'Od poptávky po hotový web za 48 hodin. Platíte až po schválení.',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
