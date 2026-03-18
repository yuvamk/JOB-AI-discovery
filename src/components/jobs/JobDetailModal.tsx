'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Building2, MapPin, DollarSign, Clock, 
  Sparkles, Zap, Globe, ShieldCheck, ExternalLink,
  CheckCircle2, AlertCircle, Info, Bookmark, Send
} from 'lucide-react';
import { RankedJob } from '@/lib/types/jobs';

interface JobDetailModalProps {
  job: RankedJob | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function JobDetailModal({ job, isOpen, onClose }: JobDetailModalProps) {
  if (!job) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-end">
          {/* Overlay */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-md"
            onClick={onClose}
          />

          {/* Modal Panel (Side Drawer Style) */}
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="relative w-full max-w-2xl h-full bg-white dark:bg-slate-950 shadow-2xl overflow-y-auto"
          >
            {/* Header / Cover */}
            <div className="h-48 bg-indigo-600 relative overflow-hidden">
               <div className="absolute inset-0 opacity-20">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-[100px] -mr-32 -mt-32" />
                  <div className="absolute bottom-0 left-0 w-48 h-48 bg-violet-400 rounded-full blur-[80px] -ml-24 -mb-24" />
               </div>
               <button 
                 onClick={onClose}
                 className="absolute top-8 left-8 p-3 bg-white/10 hover:bg-white/20 text-white rounded-2xl backdrop-blur-xl transition-all z-20"
               >
                 <X className="w-6 h-6" />
               </button>
            </div>

            <div className="px-10 -mt-16 relative z-10 pb-32">
               {/* Logo & Basic Info */}
               <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                  <div className="w-32 h-32 bg-white dark:bg-slate-900 rounded-[3rem] p-6 shadow-2xl border-4 border-white dark:border-slate-950 flex items-center justify-center">
                    {job.logo_url ? (
                      <img src={job.logo_url} alt={job.companyName || job.company} className="w-full h-full object-contain" />
                    ) : (
                      <Building2 className="w-16 h-16 text-slate-300" />
                    )}
                  </div>
                  <div className="flex flex-wrap gap-3">
                     <button className="px-6 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-slate-900/10 active:scale-95 transition-all">
                        Apply Now
                     </button>
                     <button className="p-3 bg-slate-100 dark:bg-slate-800 rounded-2xl text-slate-500 hover:text-indigo-600 transition-colors">
                        <Bookmark className="w-6 h-6" />
                     </button>
                  </div>
               </div>

               <div className="space-y-12">
                  <section className="space-y-4">
                    <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tighter leading-[0.9]">
                      {job.title}
                    </h1>
                    <div className="flex flex-wrap items-center gap-6 text-slate-400 font-black text-xs uppercase tracking-[0.2em]">
                       <span className="text-indigo-600">{job.companyName || job.company}</span>
                       <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> {job.location}</span>
                       <span className="flex items-center gap-1.5"><DollarSign className="w-4 h-4" /> $140k – $190k</span>
                       <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> Posted 12h ago</span>
                    </div>
                  </section>

                  {/* AI INSIGHTS BAR */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-1 bg-slate-50 dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-inner">
                     <div className="p-8 space-y-4">
                        <div className="flex items-center gap-2">
                           <Sparkles className="w-4 h-4 text-indigo-500 fill-indigo-500/10" />
                           <span className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em]">Match Analysis</span>
                        </div>
                        <div className="flex items-center gap-4">
                           <span className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter">92<span className="text-2xl opacity-30">%</span></span>
                           <div className="flex-1 space-y-1.5">
                              <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest uppercase">Excellent Match</p>
                              <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                                 <motion.div initial={{ width: 0 }} animate={{ width: '92%' }} className="h-full bg-indigo-600" />
                              </div>
                           </div>
                        </div>
                     </div>
                     <div className="p-8 bg-white dark:bg-slate-800 rounded-[2.2rem] shadow-lg border border-slate-100 dark:border-slate-700 m-1 flex flex-col justify-center gap-3">
                        <div className="flex items-center gap-2">
                           <Zap className="w-4 h-4 text-amber-500" />
                           <span className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-[0.2em]">AI Sentiment</span>
                        </div>
                        <p className="text-xs font-bold text-slate-500 leading-relaxed italic">
                           "This role emphasizes <b>ownership</b> and <b>product vision</b>, aligning perfectly with your lead experience at TechnoHub."
                        </p>
                     </div>
                  </div>

                  {/* Description Sections */}
                  <div className="space-y-10">
                     <Section title="The Mission." icon={<Globe className="w-5 h-5 text-indigo-500" />}>
                        <p className="text-slate-600 dark:text-slate-300 font-bold leading-relaxed text-sm">
                           {job.description || "We are looking for a visionary developer to architect the next generation of our global platform. You will lead a high-performance team of vibes coders to ship at warp speed."}
                        </p>
                     </Section>

                     <Section title="Requirements." icon={<ShieldCheck className="w-5 h-5 text-indigo-500" />}>
                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                           {job.skills?.map((skill, i) => (
                             <li key={i} className="flex items-center gap-3 text-xs font-bold text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-900/50 p-3 rounded-2xl border border-slate-100 dark:border-slate-800">
                                <CheckCircle2 className="w-4 h-4 text-emerald-500" /> {skill}
                             </li>
                           ))}
                        </ul>
                     </Section>

                     {/* AI ACTIONS */}
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6">
                        <ActionButton icon={<Sparkles />} label="Tailor My Resume" sub="AI Optimization" />
                        <ActionButton icon={<Send />} label="Apply with AI Cover Letter" sub="Customized JD-Match" />
                     </div>
                  </div>
               </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

function Section({ title, icon, children }: { title: string; icon: any; children: React.ReactNode }) {
  return (
    <div className="space-y-6">
       <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
          {icon}
          <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tighter uppercase tracking-[0.1em]">{title}</h3>
       </div>
       {children}
    </div>
  );
}

function ActionButton({ icon, label, sub }: { icon: any; label: string; sub: string }) {
  return (
    <button className="flex flex-col items-start p-6 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2rem] hover:border-indigo-500 group transition-all">
       <div className="p-3 bg-white dark:bg-slate-800 rounded-xl text-slate-400 group-hover:text-indigo-500 transition-colors mb-4 shadow-sm border border-slate-100 dark:border-slate-700">
          {icon}
       </div>
       <span className="text-xs font-black text-slate-900 dark:text-white tracking-tight text-left uppercase tracking-widest">{label}</span>
       <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter mt-1">{sub}</span>
    </button>
  );
}
