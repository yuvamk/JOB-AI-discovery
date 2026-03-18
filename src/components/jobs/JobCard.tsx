'use client';

import { motion } from 'framer-motion';
import { 
  Building2, MapPin, DollarSign, Clock, 
  Sparkles, Zap, ChevronRight, Bookmark,
  Globe, ShieldCheck, ArrowRight
} from 'lucide-react';
import { RankedJob } from '@/lib/types/jobs';

interface JobCardProps {
  job: RankedJob;
  onViewDetails: (job: RankedJob) => void;
  isSaved?: boolean;
  onSave?: (job: RankedJob) => void;
  compact?: boolean;
}

export default function JobCard({ job, onViewDetails, isSaved, onSave, compact }: JobCardProps) {
  const matchScore = job.match_score || 0;
  
  return (
    <motion.div 
      layout
      className={`group relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] p-1 shadow-xl hover:shadow-2xl hover:border-indigo-500/50 transition-all duration-500 overflow-hidden ${compact ? 'max-w-[400px]' : ''}`}
    >
      {/* Premium Badge Layer */}
      <div className={`absolute ${compact ? 'top-4 right-4' : 'top-6 right-6'} z-10 flex gap-2`}>
         <div className="px-3 py-1 bg-white/90 dark:bg-slate-900/90 backdrop-blur rounded-full border border-slate-100 dark:border-slate-800 shadow-sm flex items-center gap-1.5">
            <Zap className={`w-3.5 h-3.5 ${matchScore > 80 ? 'text-emerald-500 fill-emerald-500' : 'text-amber-500 animate-pulse'}`} />
            <span className="text-[10px] font-black uppercase tracking-widest">{matchScore || job.total_score || 0}% Match</span>
         </div>
         <button 
           onClick={(e) => { e.stopPropagation(); onSave?.(job); }}
           className={`p-2 bg-white/90 dark:bg-slate-900/90 backdrop-blur rounded-full border border-slate-100 dark:border-slate-800 transition-colors ${isSaved ? 'text-indigo-600 bg-indigo-50 dark:bg-indigo-950/30' : 'hover:text-indigo-600'}`}
         >
            <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
         </button>
      </div>

      <div className={compact ? 'p-6' : 'p-8'}>
        <div className={`flex items-start gap-6 ${compact ? 'mb-4' : 'mb-8'}`}>
          <div className={`${compact ? 'w-14 h-14 p-3' : 'w-20 h-20 p-4'} bg-slate-50 dark:bg-slate-800 rounded-[1.5rem] border border-slate-100 dark:border-slate-700 flex items-center justify-center ring-4 ring-transparent group-hover:ring-indigo-500/10 transition-all shadow-inner`}>
            {job.logo_url ? (
               <img src={job.logo_url} alt={job.companyName || job.company} className="w-full h-full object-contain" />
            ) : (
               <Building2 className={`${compact ? 'w-6 h-6' : 'w-10 h-10'} text-slate-300`} />
            )}
          </div>
          <div className="flex-1 space-y-1">
            <h3 className={`${compact ? 'text-lg' : 'text-2xl'} font-black text-slate-900 dark:text-white tracking-tighter leading-tight group-hover:text-indigo-600 transition-colors line-clamp-1`}>
              {job.title}
            </h3>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-slate-400 font-bold text-[10px] uppercase tracking-widest">
              <span className="text-slate-900 dark:text-slate-200">{job.companyName || job.company}</span>
              <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {job.location}</span>
            </div>
          </div>
        </div>

        {/* Requirements Chips */}
        <div className={`flex flex-wrap gap-2 ${compact ? 'mb-4' : 'mb-8'}`}>
           {job.skills?.slice(0, compact ? 2 : 3).map((skill, i) => (
             <span key={i} className="px-3 py-1 bg-slate-50 dark:bg-slate-800/50 rounded-lg text-[9px] font-black text-slate-500 uppercase tracking-widest border border-slate-100 dark:border-slate-800">
               {skill}
             </span>
           ))}
           {job.skills && job.skills.length > (compact ? 2 : 3) && (
             <span className="px-2 py-1 text-[9px] font-black text-slate-400 uppercase tracking-widest">
               +{job.skills.length - (compact ? 2 : 3)}
             </span>
           )}
        </div>

        {/* Match Reason - Only show if not compact or if very relevant */}
        {!compact && (
          <div className="p-5 bg-indigo-50 dark:bg-indigo-500/5 rounded-3xl border border-indigo-100 dark:border-indigo-500/10 mb-8 relative group/reason">
             <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-3.5 h-3.5 text-indigo-500 fill-indigo-500/20" />
                <span className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em]">Why you match</span>
             </div>
             <p className="text-xs font-bold text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed tracking-tight italic">
                "Your experience with <b>System Design</b> and <b>Scale</b> perfectly aligns with their tech debt reduction roadmap."
             </p>
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-2">
           <div className="flex flex-col">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Est. Salary</span>
              <span className={`${compact ? 'text-xs' : 'text-sm'} font-black text-slate-900 dark:text-white tracking-tighter`}>{job.salary || '$140k – $190k'}</span>
           </div>
           <button 
             onClick={() => onViewDetails(job)}
             className={`${compact ? 'px-4 py-2 text-[8px]' : 'px-6 py-3 text-[10px]'} bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-black uppercase tracking-widest flex items-center gap-2 hover:scale-105 active:scale-95 transition-all shadow-xl shadow-slate-900/10`}
           >
             Details <ArrowRight className="w-3 h-3" />
           </button>
        </div>
      </div>
    </motion.div>
  );
}
