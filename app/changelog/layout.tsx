import { Navbar } from '@/components/Navbar';
import { ProfileSync } from '@/components/ProfileSync';
import { ProfileProvider } from '@/components/ProfileContext';

export default function ChangelogLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProfileProvider>
      <ProfileSync />
      <Navbar />
      <main>{children}</main>
    </ProfileProvider>
  );
}
