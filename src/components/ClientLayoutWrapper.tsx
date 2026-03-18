'use client';

import { usePathname } from 'next/navigation';
import NavBar from '@/components/NavBar';

export default function ClientLayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');

  if (isAdmin) {
    return <main className="flex-1">{children}</main>;
  }

  return (
    <>
      <NavBar />
      <main className="flex-1 pt-24">
        {children}
      </main>
    </>
  );
}
