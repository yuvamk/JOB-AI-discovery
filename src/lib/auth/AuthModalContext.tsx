'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface AuthModalContextType {
  isOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
  isForced: boolean;
  setForced: (forced: boolean) => void;
}

const AuthModalContext = createContext<AuthModalContextType | undefined>(undefined);

import AuthModal from '@/components/auth/AuthModal';

export function AuthModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isForced, setForced] = useState(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => {
    setIsOpen(false);
    setForced(false);
  };

  return (
    <AuthModalContext.Provider value={{ isOpen, openModal, closeModal, isForced, setForced }}>
      {children}
      <AuthModal isOpen={isOpen} onClose={closeModal} isAutoTriggered={isForced} />
    </AuthModalContext.Provider>
  );
}

export function useAuthModal() {
  const context = useContext(AuthModalContext);
  if (context === undefined) {
    throw new Error('useAuthModal must be used within an AuthModalProvider');
  }
  return context;
}
