'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, Users, Briefcase, 
  Settings, Database, ServerCrash, 
  ShieldCheck, ArrowLeft, Activity
} from 'lucide-react';

const navItems = [
  { name: 'Overview', href: '/admin', icon: LayoutDashboard },
  { name: 'Users', href: '/admin/users', icon: Users },
  { name: 'Jobs & Scrapers', href: '/admin/jobs', icon: Database },
  { name: 'Tenants', href: '/admin/tenants', icon: Briefcase },
  { name: 'Moderation', href: '/admin/moderation', icon: ShieldCheck },
  { name: 'Settings', href: '/admin/settings', icon: Settings },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <div className="w-64 bg-slate-900 border-r border-slate-800 text-slate-300 flex flex-col h-screen fixed left-0 top-0">
      <div className="p-6 border-b border-slate-800">
         <div className="flex items-center gap-2 mb-6">
            <Activity className="w-6 h-6 text-indigo-500" />
            <span className="font-black text-white text-xl tracking-tighter">KINETIC<span className="text-indigo-500">.</span></span>
         </div>
         <div className="text-[10px] font-black uppercase tracking-widest text-slate-500">Admin Control Center</div>
      </div>

      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-3">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-bold text-sm transition-all ${
                    isActive 
                      ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-500/20' 
                      : 'hover:bg-slate-800 hover:text-white border border-transparent'
                  }`}
                >
                  <item.icon className="w-4 h-4" /> 
                  {item.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-4 border-t border-slate-800">
         <Link href="/discovery" className="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" /> Exit to Platform
         </Link>
      </div>
    </div>
  );
}
