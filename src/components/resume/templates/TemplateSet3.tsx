import React from 'react';
import { ResumeContent } from './types';

// 5. TECH TEMPLATE (Code Aesthetic, GitHub-inspired)
export const TechTemplate: React.FC<{ data: ResumeContent }> = ({ data }) => {
  return (
    <div className="bg-[#0d1117] min-h-screen p-12 font-mono text-[#c9d1d9]">
       <div className="max-w-4xl mx-auto space-y-12">
          <header className="flex items-center gap-8 border-b border-[#30363d] pb-10">
             <div className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl flex items-center justify-center text-white text-4xl font-black shadow-xl">
               {data.basics.name.charAt(0)}
             </div>
             <div>
               <h1 className="text-4xl font-black text-white tracking-tighter mb-2">{data.basics.name}</h1>
               <div className="flex gap-4 text-xs font-bold text-slate-500 uppercase tracking-widest">
                  <span>{data.basics.label}</span>
                  <span className="text-[#3fb950]">active_now</span>
               </div>
               <div className="mt-4 flex gap-6 text-[10px] text-[#8b949e]">
                 <span>git@github.com:{data.basics.name.toLowerCase().replace(' ', '-')}.git</span>
                 <span>ssh {data.basics.email}</span>
               </div>
             </div>
          </header>

          <div className="grid grid-cols-12 gap-12">
             <div className="col-span-8 space-y-10">
                <section>
                   <p className="text-[#8b949e] italic leading-relaxed font-sans">{data.basics.summary}</p>
                </section>

                <section className="space-y-6">
                   <h2 className="text-[#58a6ff] font-black uppercase tracking-widest text-xs flex items-center gap-2">
                     <span className="w-2 h-2 bg-[#58a6ff] rounded-full" /> Experience
                   </h2>
                   {data.work.map((job, i) => (
                      <div key={i} className="p-6 bg-[#161b22] border border-[#30363d] rounded-2xl hover:border-[#58a6ff] transition-all group">
                         <div className="flex justify-between items-start mb-4">
                            <div>
                               <h3 className="text-white font-black">{job.position}</h3>
                               <p className="text-xs text-[#8b949e]">{job.company}</p>
                            </div>
                            <span className="text-[10px] text-[#3fb950] bg-[#3fb950]/10 px-2 py-0.5 rounded-full">{job.duration}</span>
                         </div>
                         <ul className="space-y-2 list-none text-xs leading-relaxed font-sans text-slate-400">
                           {job.highlights.map((h, j) => <li key={j} className="flex gap-3"><span className="text-[#58a6ff]">$</span> {h}</li>)}
                         </ul>
                      </div>
                   ))}
                </section>
             </div>

             <div className="col-span-4 space-y-10">
                <section className="space-y-4">
                   <h2 className="text-[#d2a8ff] font-black uppercase tracking-widest text-xs">Stack</h2>
                   <div className="flex flex-wrap gap-2">
                      {data.skills.map((s, i) => (
                         <span key={i} className="px-3 py-1 bg-[#21262d] text-[#c9d1d9] border border-[#30363d] rounded-lg text-[10px]">{s.name}</span>
                      ))}
                   </div>
                </section>

                <section className="space-y-4">
                   <h2 className="text-[#ff7b72] font-black uppercase tracking-widest text-xs">Education</h2>
                   {data.education.map((edu, i) => (
                      <div key={i} className="text-xs space-y-1">
                         <p className="text-white font-bold">{edu.institution}</p>
                         <p className="text-[#8b949e]">{edu.area}</p>
                         <p className="text-[#3fb950]">{edu.year}</p>
                      </div>
                   ))}
                </section>
             </div>
          </div>
       </div>
    </div>
  );
};

// 6. MINIMAL TEMPLATE (Ultra-clean, Lots of white space)
export const MinimalTemplate: React.FC<{ data: ResumeContent }> = ({ data }) => {
  return (
    <div className="bg-white min-h-screen p-20 font-sans text-slate-950 font-medium">
       <div className="max-w-3xl mx-auto space-y-20">
          <header className="space-y-4">
             <h1 className="text-6xl font-black italic tracking-tighter uppercase">{data.basics.name}</h1>
             <p className="text-sm font-black uppercase tracking-[0.5em] text-slate-400">{data.basics.label}</p>
             <div className="flex gap-8 text-[10px] font-black uppercase tracking-widest pt-4 text-slate-400 border-t border-slate-100">
                <span>{data.basics.email}</span>
                <span>{data.basics.phone}</span>
                <span>{data.basics.location}</span>
             </div>
          </header>

          <section className="space-y-10">
             <h2 className="text-[10px] font-black uppercase tracking-widest text-slate-300">Experience</h2>
             <div className="space-y-16">
               {data.work.map((job, i) => (
                  <div key={i} className="space-y-4">
                     <div className="flex justify-between items-baseline">
                        <h3 className="text-4xl font-black italic lowercase tracking-tight">{job.position}</h3>
                        <span className="text-[10px] font-black uppercase text-slate-300">{job.duration}</span>
                     </div>
                     <p className="text-xs font-black uppercase tracking-widest text-slate-400">{job.company}</p>
                     <ul className="space-y-3 text-sm leading-relaxed text-slate-600 max-w-xl">
                        {job.highlights.map((h, j) => <li key={j}>{h}</li>)}
                     </ul>
                  </div>
               ))}
             </div>
          </section>

          <section className="grid grid-cols-2 gap-20">
             <div className="space-y-10">
                <h2 className="text-[10px] font-black uppercase tracking-widest text-slate-300">Skills</h2>
                <div className="flex flex-wrap gap-4 text-xs font-black uppercase tracking-widest">
                   {data.skills.map((s, i) => <span key={i}>{s.name}</span>)}
                </div>
             </div>
             <div className="space-y-10">
                <h2 className="text-[10px] font-black uppercase tracking-widest text-slate-300">Education</h2>
                {data.education.map((edu, i) => (
                   <div key={i} className="space-y-2">
                       <p className="text-xs font-black uppercase tracking-widest">{edu.institution}</p>
                       <p className="text-[10px] text-slate-400">{edu.studyType} • {edu.year}</p>
                   </div>
                ))}
             </div>
          </section>
       </div>
    </div>
  );
};
