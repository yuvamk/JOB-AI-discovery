'use client';

import { createContext, useContext, ReactNode } from 'react';

type TenantConfig = {
  slug: string;
  name: string;
  logo: string | null;
  plan: string;
  settings: any;
};

const TenantContext = createContext<TenantConfig | null>(null);

export function TenantProvider({ 
  children, 
  tenant 
}: { 
  children: ReactNode; 
  tenant: TenantConfig 
}) {
  return (
    <TenantContext.Provider value={tenant}>
      {children}
    </TenantContext.Provider>
  );
}

export function useTenant() {
  const context = useContext(TenantContext);
  if (!context) {
    throw new Error('useTenant must be used within a TenantProvider');
  }
  return context;
}
