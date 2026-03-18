'use client';

import { ReactNode } from 'react';
import { useTenant } from './TenantProvider';
import { Lock } from 'lucide-react';
import Link from 'next/link';

type PlanLevel = 'FREE' | 'PRO' | 'ENTERPRISE';

const PLAN_HIERARCHY: Record<PlanLevel, number> = {
  FREE: 0,
  PRO: 1,
  ENTERPRISE: 2,
};

interface FeatureGateProps {
  children: ReactNode;
  requiredPlan: PlanLevel;
  fallback?: ReactNode;
  showPaywall?: boolean;
}

export function FeatureGate({ children, requiredPlan, fallback, showPaywall = false }: FeatureGateProps) {
  const tenant = useTenant();
  const currentPlan = (tenant.plan as PlanLevel) || 'FREE';
  
  const hasAccess = PLAN_HIERARCHY[currentPlan] >= PLAN_HIERARCHY[requiredPlan];

  if (hasAccess) {
    return <>{children}</>;
  }

  if (fallback) {
    return <>{fallback}</>;
  }

  if (showPaywall) {
    return (
      <div className="bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 flex flex-col items-center justify-center text-center max-w-lg mx-auto backdrop-blur-sm">
        <div className="w-16 h-16 bg-amber-500/10 text-amber-500 rounded-full flex items-center justify-center mb-6">
          <Lock className="w-8 h-8" />
        </div>
        <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Premium Feature</h3>
        <p className="text-slate-500 font-medium mb-8">
          This feature requires the <span className="font-bold text-indigo-500">{requiredPlan}</span> plan. Upgrade your workspace to unlock advanced capabilities.
        </p>
        <Link 
          href="/admin/tenants" 
          className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-xl shadow-xl shadow-indigo-500/25 transition-all w-full md:w-auto"
        >
          Upgrade Plan
        </Link>
      </div>
    );
  }

  return null;
}
