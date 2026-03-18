'use client';

import { motion } from 'framer-motion';
import { 
  Zap, Search, Sparkles, Globe, Shield, Star, 
  ChevronRight, ArrowRight, Play, CheckCircle2,
  Briefcase, Quote, Users
} from 'lucide-react';
import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="relative overflow-hidden pt-20">
      {/* Background Decor */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] pointer-events-none opacity-20 dark:opacity-30">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500 rounded-full blur-[120px]" />
        <div className="absolute top-[10%] right-[-5%] w-[35%] h-[35%] bg-violet-500 rounded-full blur-[100px]" />
      </div>

      {/* Hero Section */}
      <section className="relative px-6 py-20 pb-40">
        <div className="max-w-6xl mx-auto text-center space-y-12">
          {/* Badge */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2.5 px-5 py-2.5 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-indigo-600 dark:text-indigo-400"
          >
            <Sparkles className="w-4 h-4 fill-indigo-500/20" />
            <span className="text-xs font-black uppercase tracking-[0.2em]">Next-Gen AI Job Discovery</span>
          </motion.div>

          {/* Main Title */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-6"
          >
            <h1 className="text-6xl md:text-8xl font-black text-slate-900 dark:text-white leading-[0.9] tracking-tighter">
              LAND YOUR DREAM<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-600 bg-[length:200%_auto] animate-gradient">ROLE AT WARP SPEED.</span>
            </h1>
            <p className="max-w-2xl mx-auto text-lg md:text-xl font-bold text-slate-400 leading-relaxed tracking-tight">
              Kinetic AI autonomously scours 50+ global sources, ranks matches in real-time, 
              and architects your resume for maximum impact. Think LinkedIn, but fully AI-native.
            </p>
          </motion.div>

          {/* Search Bar - Landing Style */}
          <motion.div
             initial={{ opacity: 0, scale: 0.95 }}
             animate={{ opacity: 1, scale: 1 }}
             transition={{ delay: 0.2 }}
             className="max-w-3xl mx-auto"
          >
            <div className="relative group p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] shadow-2xl shadow-indigo-500/10 flex flex-col md:flex-row items-stretch md:items-center">
              <div className="flex-1 flex items-center px-6 py-4 md:py-0">
                <Search className="w-6 h-6 text-slate-400 mr-4" />
                <input 
                  type="text" 
                  placeholder="Senior React Dev in Bangalore with ESOPs..."
                  className="w-full bg-transparent border-none outline-none text-slate-900 dark:text-white font-bold placeholder:text-slate-400 placeholder:font-bold"
                />
              </div>
              <div className="h-10 w-[1px] bg-slate-200 dark:bg-slate-800 hidden md:block mx-2" />
              <Link href="/jobs" className="px-8 py-5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-[2rem] font-black uppercase tracking-widest text-sm transition-all shadow-xl shadow-indigo-500/30 flex items-center justify-center gap-3">
                 Scout Roles <ChevronRight className="w-5 h-5" />
              </Link>
            </div>
            <div className="mt-4 flex flex-wrap justify-center gap-3 text-xs font-bold text-slate-400">
              <span>Trending:</span>
              <span className="text-slate-900 dark:text-slate-200 cursor-pointer hover:text-indigo-500">#AIRsearch</span>
              <span className="text-slate-900 dark:text-slate-200 cursor-pointer hover:text-indigo-500">#ProductManagement</span>
              <span className="text-slate-900 dark:text-slate-200 cursor-pointer hover:text-indigo-500">#RemoteWork</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Trust / Stats */}
      <section className="bg-slate-50 dark:bg-slate-900 py-10 border-y border-slate-200 dark:border-slate-800">
         <div className="max-w-7xl mx-auto px-6 flex flex-wrap justify-center gap-12 md:gap-32 grayscale opacity-50 dark:opacity-30">
            <span className="text-2xl font-black italic tracking-tighter">TECHSTARZ</span>
            <span className="text-2xl font-black italic tracking-tighter">UNFOLD</span>
            <span className="text-2xl font-black italic tracking-tighter">KINETIK</span>
            <span className="text-2xl font-black italic tracking-tighter">NEXUS</span>
            <span className="text-2xl font-black italic tracking-tighter">VIBE</span>
         </div>
      </section>

      {/* Features Grid */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto space-y-20">
          <div className="text-center space-y-4">
             <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tighter capitalize underline decoration-indigo-500 underline-offset-8">Engineered for Excellence.</h2>
             <p className="text-slate-500 font-bold">Every layer of the platform is infused with high-performance AI.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <FeatureCard 
              icon={<Globe className="w-7 h-7 text-indigo-500" />}
              title="Worldwide Scraper"
              description="Our modular agents scour 50+ platforms globally every 6 hours. You see jobs before they hit the main boards."
            />
            <FeatureCard 
              icon={<Zap className="w-7 h-7 text-violet-500" />}
              title="AI Match Analysis"
              description="Semantic matching ensures you only see roles where you truly shine. Real-time scores and 'why' insights on every card."
            />
            <FeatureCard 
              icon={<Sparkles className="w-7 h-7 text-amber-500" />}
              title="Resume Architect"
              description="Don't just write a resume—architect one for impact. Claude converts your history into high-performance achievement points."
            />
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-20 bg-indigo-600 text-white relative">
        <div className="max-w-5xl mx-auto px-6 text-center space-y-10">
           <Quote className="w-16 h-16 opacity-20 mx-auto" strokeWidth={3} />
           <p className="text-3xl md:text-5xl font-black tracking-tight leading-none italic">
              "Kinetic AI transformed our hiring. Within 48 hours, we found three 'Vibe Coders' we would have never reached through LinkedIn."
           </p>
           <div className="flex items-center justify-center gap-4">
             <div className="w-14 h-14 rounded-full bg-white/10" />
             <div className="text-left">
                <p className="font-black uppercase tracking-widest text-sm">Alex Rivera</p>
                <p className="text-indigo-200 text-xs font-bold">CTO @ TechStarz</p>
             </div>
           </div>
        </div>
      </section>

      {/* CTA Footer */}
      <section className="py-32 text-center space-y-12">
         <h2 className="text-5xl md:text-7xl font-black tracking-tighter text-slate-900 dark:text-white">STOP SEARCHING.<br />START <span className="text-indigo-600">EVOLVING.</span></h2>
         <Link href="/auth/signin" className="inline-flex items-center gap-3 px-10 py-5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-[2rem] font-black uppercase tracking-[0.2em] shadow-2xl hover:scale-105 transition-transform">
           Join the Evolution <ArrowRight className="w-6 h-6" />
         </Link>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="p-10 bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/40 dark:shadow-none hover:border-indigo-500/50 transition-colors group">
      <div className="w-14 h-14 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center mb-8 border border-slate-100 dark:border-slate-700 shadow-inner group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-4 tracking-tighter">{title}</h3>
      <p className="text-slate-500 font-bold leading-relaxed">
        {description}
      </p>
    </div>
  );
}
