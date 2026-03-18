'use client';

import { useRef } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Sparkles, TrendingUp } from 'lucide-react';
import { RankedJob } from '@/lib/types/jobs';
import JobCard from './JobCard';

interface Props {
  title: string;
  subtitle: string;
  icon: 'sparkles' | 'trending';
  jobs: RankedJob[];
  onSave: (job: RankedJob) => void;
  onViewDetails: (job: RankedJob) => void;
  savedJobLinks: Set<string>;
}

export default function JobCarousel({ title, subtitle, icon, jobs, onSave, onViewDetails, savedJobLinks }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth : scrollLeft + clientWidth;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  if (jobs.length === 0) return null;

  return (
    <div className="space-y-6 mb-16">
      <div className="flex items-end justify-between px-2">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-indigo-600 font-black uppercase tracking-[0.2em] text-[10px]">
             {icon === 'sparkles' ? <Sparkles className="w-3.5 h-3.5" /> : <TrendingUp className="w-3.5 h-3.5" />}
             <span>{subtitle}</span>
          </div>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter uppercase">{title}</h2>
        </div>
        
        <div className="flex gap-2">
          <button 
            onClick={() => scroll('left')}
            className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-400 hover:text-indigo-600 transition-all active:scale-90"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button 
            onClick={() => scroll('right')}
            className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-400 hover:text-indigo-600 transition-all active:scale-90"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div 
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto no-scrollbar scroll-smooth pb-8 pt-2"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {jobs.map((job, i) => (
          <motion.div 
            key={job.applyUrl || job.apply_link || i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="min-w-[400px] max-w-[400px]"
          >
             <JobCard 
               job={job} 
               isSaved={savedJobLinks.has(job.applyUrl || job.apply_link || '')} 
               onSave={() => onSave(job)} 
               onViewDetails={onViewDetails}
               compact={true}
             />
          </motion.div>
        ))}
      </div>

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}
