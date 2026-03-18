'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Briefcase, Search, FileText, LayoutDashboard, 
  Menu, X, Sparkles, User, LogOut, Bell, 
  ChevronDown, Globe, Zap, ShieldCheck
} from 'lucide-react';
import { useSession, signOut } from 'next-auth/react';
import { useTenant } from '@/components/tenant/TenantProvider';
import { useAuthModal } from '@/lib/auth/AuthModalContext';

const NAV_LINKS = [
  { name: 'Discover', href: '/jobs', icon: Search },
  { name: 'Resume', href: '/resume-builder', icon: FileText },
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
];

export default function NavBar() {
  const { data: session } = useSession();
  const tenant = useTenant();
  const pathname = usePathname();
  const { openModal } = useAuthModal();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled 
          ? 'py-4 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 shadow-sm' 
          : 'py-6 bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="group flex items-center gap-2.5">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/30 group-hover:scale-110 transition-transform duration-300 overflow-hidden">
            {tenant.logo ? (
               <img src={tenant.logo} alt={tenant.name} className="w-full h-full object-cover" />
            ) : (
               <Zap className="w-6 h-6 text-white fill-white" />
            )}
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-black tracking-tighter text-slate-900 dark:text-white leading-none">
              {tenant.name === 'Kinetic' ? (
                 <>KINETIC<span className="text-indigo-600">AI</span></>
              ) : (
                 <span className="uppercase">{tenant.name}</span>
              )}
            </span>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Job Discovery</span>
          </div>
        </Link>

        {/* Global Search Bar */}
        <div className="hidden lg:flex flex-1 max-w-md mx-8 relative group">
           <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
           <input 
             type="text"
             placeholder="Search jobs, companies, or articles..."
             className="w-full bg-slate-100 dark:bg-slate-900 border-none rounded-2xl pl-12 pr-4 py-2.5 text-xs font-bold text-slate-900 dark:text-white outline-none ring-2 ring-transparent focus:ring-indigo-500/10 transition-all placeholder:text-slate-400"
           />
           <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-1">
              <kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-[9px] font-black text-slate-400">⌘</kbd>
              <kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-[9px] font-black text-slate-400">K</kbd>
           </div>
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8 bg-slate-100/50 dark:bg-slate-900/50 border border-slate-200/50 dark:border-slate-800/50 px-6 py-2 rounded-2xl">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`flex items-center gap-2 text-sm font-bold transition-all ${
                  isActive 
                    ? 'text-indigo-600' 
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <link.icon className={`w-4 h-4 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
                <span className="hidden lg:inline">{link.name}</span>
              </Link>
            );
          })}
          {(session?.user as any)?.role === 'ADMIN' || (session?.user as any)?.role === 'SUPER_ADMIN' ? (
            <Link
              href="/admin"
              className={`flex items-center gap-2 text-sm font-bold transition-all ${
                pathname.startsWith('/admin') ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span className="hidden lg:inline">Admin</span>
            </Link>
          ) : null}
        </div>

        {/* Auth / Profile */}
        <div className="flex items-center gap-4">
          {session ? (
            <div className="flex items-center gap-3">
              <button className="relative p-2 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                <Bell className="w-5 h-5" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-indigo-500 rounded-full border-2 border-white dark:border-slate-950" />
              </button>
              
              <div className="h-8 w-[1px] bg-slate-200 dark:bg-slate-800 mx-1 hidden sm:block" />
              
              <div className="flex items-center gap-3 pl-1 group cursor-pointer">
                <div className="text-right hidden sm:block">
                  <p className="text-xs font-black text-slate-900 dark:text-white leading-none capitalize">{session.user?.name || 'User'}</p>
                  <p className="text-[10px] font-bold text-indigo-500 uppercase mt-0.5 tracking-tighter">Pro Member</p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-slate-200 dark:bg-slate-800 border-2 border-transparent group-hover:border-indigo-500 transition-all overflow-hidden shadow-md">
                   {session.user?.image ? (
                     <img src={session.user.image} alt="Avatar" className="w-full h-full object-cover" />
                   ) : (
                     <User className="w-full h-full p-2 text-slate-400" />
                   )}
                </div>
              </div>

              <button 
                onClick={() => signOut()}
                className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-red-500 transition-colors"
                title="Sign out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <button 
                onClick={openModal}
                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black rounded-xl transition-all shadow-xl shadow-indigo-500/25 active:scale-95 uppercase tracking-wider"
              >
                Log In
              </button>
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden p-2 text-slate-600 dark:text-slate-400"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800 overflow-hidden"
          >
            <div className="p-6 space-y-4">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-3 text-lg font-black text-slate-700 dark:text-slate-300"
                >
                  <link.icon className="w-5 h-5 text-indigo-500" />
                  {link.name}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
