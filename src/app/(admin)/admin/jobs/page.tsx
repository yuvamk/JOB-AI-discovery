'use client';

import { useState } from 'react';
import { Database, Play, Square, RefreshCw, Briefcase, Filter, Search } from 'lucide-react';

export default function JobManagement() {
  const [activeScrapers, setActiveScrapers] = useState<Record<string, boolean>>({
    'remoteok': true,
    'remotive': false,
    'linkedin': true,
    'wellfound': false
  });

  const toggleScraper = (id: string) => {
    setActiveScrapers(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-1000">
       <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
           <h1 className="text-3xl font-black text-white tracking-tighter">Jobs & Scrapers</h1>
           <p className="text-slate-400 font-bold text-sm tracking-wide">Control data ingestion pipelines and manage global job indexes</p>
        </div>
        <button className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 shadow-xl shadow-indigo-600/20 active:scale-95 transition-all">
           <Play className="w-4 h-4" /> Run All Scrapers
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         {/* Scraper Control Panel */}
         <div className="lg:col-span-1 space-y-4">
            <h3 className="text-sm font-black text-white uppercase tracking-widest px-2">Active Pipelines</h3>
            <div className="grid gap-3">
               {Object.entries(activeScrapers).map(([id, active]) => (
                  <div key={id} className="bg-slate-900/50 border border-slate-800 rounded-3xl p-5 backdrop-blur-sm flex items-center justify-between">
                     <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${active ? 'bg-indigo-500/10 text-indigo-400' : 'bg-slate-800 text-slate-500'}`}>
                           <Database className="w-5 h-5" />
                        </div>
                        <div>
                           <div className="font-bold text-white capitalize">{id} API</div>
                           <div className="text-[10px] font-black uppercase tracking-widest text-emerald-500 flex items-center gap-1">
                              {active ? <><RefreshCw className="w-3 h-3 animate-spin" /> Syncing</> : <span className="text-slate-500">Idle</span>}
                           </div>
                        </div>
                     </div>
                     <button 
                       onClick={() => toggleScraper(id)}
                       className={`p-3 rounded-xl transition-all ${active ? 'bg-rose-500/10 text-rose-500 hover:bg-rose-500/20' : 'bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20'}`}
                     >
                        {active ? <Square className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
                     </button>
                  </div>
               ))}
            </div>
         </div>

         {/* Job Database Preview */}
         <div className="lg:col-span-2 bg-slate-900/50 border border-slate-800 rounded-3xl overflow-hidden backdrop-blur-sm flex flex-col">
            <div className="p-6 border-b border-slate-800 flex items-center justify-between">
               <h3 className="text-sm font-black text-white uppercase tracking-widest">Indexed Jobs Database</h3>
               <div className="flex gap-2">
                 <button className="p-2 bg-slate-800 text-slate-400 rounded-lg hover:text-white"><Search className="w-4 h-4" /></button>
                 <button className="p-2 bg-slate-800 text-slate-400 rounded-lg hover:text-white"><Filter className="w-4 h-4" /></button>
               </div>
            </div>
            
            <div className="flex-1 p-8 flex flex-col items-center justify-center text-center">
               <Briefcase className="w-16 h-16 text-slate-800 mb-4" />
               <h4 className="text-white font-bold mb-2">Job Index is streaming live</h4>
               <p className="text-slate-500 text-sm max-w-sm">
                  48,231 jobs currently active in the index. Use the Discover page to search jobs. Detailed moderation is coming soon.
               </p>
            </div>
         </div>
      </div>
    </div>
  );
}
