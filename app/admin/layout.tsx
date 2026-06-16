import { Navbar } from '@/components/Navbar';
import { ProfileSync } from '@/components/ProfileSync';
import { ProfileProvider } from '@/components/ProfileContext';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProfileProvider>
      <ProfileSync />
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">{children}</main>
    </ProfileProvider>
  );
}
