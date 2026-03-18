'use client';

import { useState, useEffect } from 'react';
import AuthModal from './AuthModal';
import { useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const [showModal, setShowModal] = useState(false);
  const [isForced, setIsForced] = useState(false);
  const pathname = usePathname();

  // Public routes that don't trigger the modal
  const PUBLIC_ROUTES = ['/auth/signin', '/auth/signup', '/api/auth'];

  useEffect(() => {
    if (status === 'authenticated') {
      setShowModal(false);
      setIsForced(false);
      return;
    }

    if (PUBLIC_ROUTES.includes(pathname)) return;

    // 120 second auto-trigger for non-authenticated users
    const timer = setTimeout(() => {
      setShowModal(true);
      setIsForced(true);
    }, 120000); // 120 seconds

    return () => clearTimeout(timer);
  }, [status, pathname]);

  return (
    <>
      <div className={showModal && isForced ? 'blur-sm pointer-events-none' : ''}>
        {children}
      </div>
      <AuthModal 
        isOpen={showModal} 
        onClose={() => setShowModal(false)} 
        isAutoTriggered={isForced} 
      />
    </>
  );
}
