'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Target, Lightbulb, ChevronDown, ChevronUp } from 'lucide-react';
import { toast } from 'sonner';

export default function AIJobIntelligence({ job }: { job: any }) {
  const [data, setData] = useState<{ summary: string; interview_guide: string[] } | null>(null);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const fetchIntelligence = async () => {
    if (data) {
      setIsOpen(!isOpen);
      return;
    }
    
    setLoading(true);
    setIsOpen(true);
    try {
      const res = await fetch('/api/jobs/intelligence', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: job.title,
          companyName: job.companyName,
          description: job.description
        })
      });
      
      const json = await res.json();
      if (res.ok) {
        setData(json);
      } else {
        toast.error('Failed to analyze job.');
        setIsOpen(false);
      }
    } catch (e) {
      console.error(e);
      toast.error('Error connecting to AI Architect.');
      setIsOpen(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-indigo-900 via-slate-900 to-indigo-950 rounded-3xl p-[1px] shadow-2xl overflow-hidden my-8 relative group">
      <div className="bg-slate-950/90 rounded-[23px] relative z-10 p-8 backdrop-blur-3xl">
        <div className="flex items-start justify-between">
           <div>
             <div className="flex items-center gap-2 text-indigo-400 font-black uppercase tracking-[0.2em] text-[10px] mb-2">
               <Sparkles className="w-3 h-3" />
               <span>Kinetic AI Intelligence</span>
             </div>
             <h3 className="text-2xl font-black text-white tracking-tighter">
               Role Deconstruction & Strategy
             </h3>
             <p className="text-sm font-bold text-slate-400 mt-1 max-w-xl">
               Generate a high-impact summary and tailored interview preparation guide for this specific role.
             </p>
           </div>
           
           <button 
             onClick={fetchIntelligence}
             className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-xl text-xs uppercase tracking-widest shadow-xl shadow-indigo-600/20 active:scale-95 transition-all flex items-center gap-2"
           >
             {loading ? <Sparkles className="w-4 h-4 animate-spin" /> : (isOpen && data ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />)}
             {loading ? 'Analyzing...' : (isOpen && data ? 'Hide Insights' : 'Analyze Role')}
           </button>
        </div>

        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mt-8 pt-8 border-t border-slate-800"
          >
            {loading ? (
              <div className="space-y-4 animate-pulse">
                 <div className="h-4 bg-slate-800 rounded w-3/4"></div>
                 <div className="h-4 bg-slate-800 rounded w-full"></div>
                 <div className="h-4 bg-slate-800 rounded w-5/6"></div>
              </div>
            ) : data && (
              <div className="space-y-8">
                <div>
                   <h4 className="flex items-center gap-2 text-sm font-black uppercase tracking-widest text-white mb-4">
                     <Target className="w-4 h-4 text-emerald-400" /> Executive Summary
                   </h4>
                   <p className="text-slate-300 leading-relaxed font-medium">
                     {data.summary}
                   </p>
                </div>

                <div>
                   <h4 className="flex items-center gap-2 text-sm font-black uppercase tracking-widest text-white mb-4">
                     <Lightbulb className="w-4 h-4 text-amber-400" /> Interview Strategy
                   </h4>
                   <ul className="space-y-4">
                      {data.interview_guide.map((tip, idx) => (
                        <li key={idx} className="flex gap-4 p-4 bg-slate-900/50 border border-slate-800 rounded-2xl text-slate-300 font-medium text-sm">
                           <span className="text-indigo-500 font-black">0{idx + 1}</span>
                           <span>{tip}</span>
                        </li>
                      ))}
                   </ul>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </div>
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 opacity-20 blur-xl group-hover:opacity-30 transition-opacity pointer-events-none" />
    </div>
  );
}
