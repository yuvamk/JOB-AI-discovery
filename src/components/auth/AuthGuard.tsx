'use client';

import { useEffect } from 'react';
import OnboardingWizard from './OnboardingWizard';
import { useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import { useAuthModal } from '@/lib/auth/AuthModalContext';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const { isOpen, openModal, closeModal, isForced, setForced } = useAuthModal();
  const pathname = usePathname();

  const isProfileIncomplete = status === 'authenticated' && !(session?.user as any)?.profileComplete;

  // Public routes that don't trigger the auto modal
  const PUBLIC_ROUTES = ['/auth/signin', '/auth/signup', '/api/auth'];

  useEffect(() => {
    // Intercept redirect from admin/protected routes
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('login') === 'true') {
        openModal();
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    }

    if (status === 'authenticated') {
      closeModal();
      setForced(false);
      return;
    }

    if (PUBLIC_ROUTES.includes(pathname)) return;

    // 120 second auto-trigger for non-authenticated users
    const timer = setTimeout(() => {
      openModal();
      setForced(true);
    }, 120000); // 120 seconds

    return () => clearTimeout(timer);
  }, [status, pathname]);

  return (
    <>
      <div className={(isOpen && isForced) || isProfileIncomplete ? 'blur-[8px] pointer-events-none' : ''}>
        {children}
      </div>
      
      {isProfileIncomplete && (
        <OnboardingWizard user={{ id: (session?.user as any)?.id, name: session?.user?.name || '' }} />
      )}
    </>
  );
}
