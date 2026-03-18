'use client';

import { ShieldCheck, AlertTriangle, Flag, Ban, CheckCircle } from 'lucide-react';

export default function ModerationPage() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <div>
         <h1 className="text-3xl font-black text-white tracking-tighter">System Moderation</h1>
         <p className="text-slate-400 font-bold text-sm tracking-wide">Review reported jobs, flag anomalies, and ensure platform health</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
         <div className="md:col-span-1 space-y-4">
            <div className="bg-amber-500/10 border border-amber-500/20 rounded-3xl p-6">
               <div className="flex items-center gap-3 mb-4">
                  <AlertTriangle className="w-6 h-6 text-amber-500" />
                  <h3 className="font-black text-white">Pending Review</h3>
               </div>
               <div className="text-4xl font-black text-amber-500 tracking-tighter">24</div>
               <p className="text-xs font-bold text-amber-500/60 mt-2">Requires administrator action</p>
            </div>
            
            <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6">
               <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-4">Auto-Moderation Engine</h4>
               <div className="space-y-3">
                 <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-400">Toxicity Filter</span>
                    <span className="text-[10px] font-black uppercase text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded">Active</span>
                 </div>
                 <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-400">Spam Detection</span>
                    <span className="text-[10px] font-black uppercase text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded">Active</span>
                 </div>
                 <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-400">Scam Prevention</span>
                    <span className="text-[10px] font-black uppercase text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded">Learning</span>
                 </div>
               </div>
            </div>
         </div>

         <div className="md:col-span-3">
            <div className="bg-slate-900/50 border border-slate-800 rounded-3xl overflow-hidden backdrop-blur-sm">
               <div className="p-6 border-b border-slate-800 flex items-center justify-between">
                  <h3 className="text-sm font-black text-white uppercase tracking-widest">Moderation Queue</h3>
               </div>
               
               <div className="divide-y divide-slate-800/50">
                  {/* Mock Item */}
                  <div className="p-6 hover:bg-slate-800/30 transition-colors flex flex-col md:flex-row gap-6 md:items-center">
                     <div className="w-12 h-12 bg-rose-500/10 text-rose-500 rounded-2xl flex items-center justify-center flex-shrink-0">
                        <Flag className="w-6 h-6" />
                     </div>
                     <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                           <h4 className="font-bold text-white">Suspected Scam Posting</h4>
                           <span className="text-[10px] font-black uppercase bg-slate-800 text-slate-400 px-2 py-0.5 rounded">Reported by 3 users</span>
                        </div>
                        <p className="text-sm text-slate-400">Job posting "Data Entry Clerk - Work From Home" contains suspicious payment links and requests for personal banking info.</p>
                     </div>
                     <div className="flex gap-2">
                        <button className="px-4 py-2 bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 rounded-xl text-xs font-bold transition-colors flex items-center gap-2">
                           <CheckCircle className="w-4 h-4" /> Ignore
                        </button>
                        <button className="px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-2 shadow-lg shadow-rose-500/20">
                           <Ban className="w-4 h-4" /> Ban & Remove
                        </button>
                     </div>
                  </div>
                  
                  {/* Success State */}
                  <div className="p-16 flex flex-col items-center justify-center text-center opacity-50">
                     <ShieldCheck className="w-16 h-16 text-emerald-500 mb-4" />
                     <h4 className="text-white font-bold mb-2">Queue is clear</h4>
                     <p className="text-sm text-slate-500">All other reports have been resolved. The system is safe.</p>
                  </div>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
