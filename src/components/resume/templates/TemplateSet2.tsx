import React from 'react';
import { ResumeContent } from './types';

// 3. CREATIVE TEMPLATE (Visual Hierarchy, Accents)
export const CreativeTemplate: React.FC<{ data: ResumeContent }> = ({ data }) => {
  return (
    <div className="bg-[#fbfcff] min-h-screen font-sans text-slate-800">
      <div className="bg-indigo-600 p-16 text-white text-center rounded-b-[4rem] shadow-2xl">
        <h1 className="text-5xl font-black tracking-tight mb-2 uppercase">{data.basics.name}</h1>
        <p className="text-indigo-200 font-bold tracking-widest uppercase">{data.basics.label}</p>
        <div className="mt-8 flex justify-center gap-10 text-xs font-bold text-indigo-100 uppercase tracking-widest">
           <span>{data.basics.email}</span>
           <span>{data.basics.phone}</span>
           <span>{data.basics.location}</span>
        </div>
      </div>

      <div className="max-w-5xl mx-auto p-16 grid grid-cols-12 gap-16 -mt-10">
        <div className="col-span-12 bg-white rounded-[3rem] p-12 shadow-xl border border-slate-100">
           <p className="text-xl font-medium leading-relaxed text-indigo-900 italic text-center">"{data.basics.summary}"</p>
        </div>

        <div className="col-span-8 space-y-12">
          <Section>
            <Title>Experience</Title>
            {data.work.map((job, i) => (
              <div key={i} className="relative pl-8 border-l-2 border-indigo-100 pb-10 last:pb-0">
                <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-indigo-600" />
                <div className="flex justify-between items-start mb-2">
                   <div>
                      <h3 className="font-black text-xl text-slate-900">{job.position}</h3>
                      <p className="text-indigo-600 font-bold uppercase tracking-widest text-xs">{job.company}</p>
                   </div>
                   <span className="text-[10px] font-black bg-slate-100 px-3 py-1 rounded-full uppercase">{job.duration}</span>
                </div>
                <ul className="space-y-2 list-disc list-inside text-slate-600 font-medium text-sm">
                  {job.highlights.map((h, j) => <li key={j}>{h}</li>)}
                </ul>
              </div>
            ))}
          </Section>
        </div>

        <div className="col-span-4 space-y-10">
          <Section>
            <Title>Skills</Title>
            <div className="flex flex-wrap gap-2">
              {data.skills.map((s, i) => (
                <span key={i} className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-2xl text-[10px] font-black uppercase tracking-widest">{s.name}</span>
              ))}
            </div>
          </Section>

          <Section>
            <Title>Education</Title>
            {data.education.map((edu, i) => (
              <div key={i} className="mb-6 last:mb-0">
                <p className="font-black text-slate-900 text-sm uppercase">{edu.institution}</p>
                <p className="text-indigo-500 font-bold text-xs mt-1">{edu.studyType}</p>
                <p className="text-slate-400 font-bold text-[10px] mt-1">{edu.year}</p>
              </div>
            ))}
          </Section>
        </div>
      </div>
    </div>
  );
};

// 4. EXECUTIVE TEMPLATE (Premium, Serif)
export const ExecutiveTemplate: React.FC<{ data: ResumeContent }> = ({ data }) => {
  return (
    <div className="bg-slate-50 min-h-screen py-20 px-8 font-serif text-[#1e293b]">
       <div className="max-w-[750px] mx-auto bg-white p-20 shadow-2xl border-t-[12px] border-slate-800">
         <header className="mb-12">
            <h1 className="text-5xl font-black tracking-tight text-slate-900 uppercase">{data.basics.name}</h1>
            <p className="text-lg font-bold text-slate-500 uppercase tracking-[0.3em] mt-2 mb-6">{data.basics.label}</p>
            <div className="flex justify-between border-y border-slate-100 py-4 text-[10pt] font-medium text-slate-500">
               <span>{data.basics.location}</span>
               <span>{data.basics.email}</span>
               <span>{data.basics.phone}</span>
            </div>
         </header>

         <section className="mb-12">
            <h2 className="text-sm font-black uppercase tracking-[0.4em] mb-6 text-slate-400">Professional Profile</h2>
            <p className="text-[11pt] leading-[1.8] text-slate-700 font-medium">{data.basics.summary}</p>
         </section>

         <section className="mb-12">
            <h2 className="text-sm font-black uppercase tracking-[0.4em] mb-8 text-slate-400">Professional History</h2>
            <div className="space-y-10">
               {data.work.map((job, i) => (
                 <div key={i} className="grid grid-cols-4 gap-6">
                    <div className="col-span-1 text-[10pt] font-black tracking-wider uppercase text-slate-400 mt-1">{job.duration}</div>
                    <div className="col-span-3 space-y-3">
                       <h3 className="text-xl font-black text-slate-900">{job.position}</h3>
                       <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">{job.company} — {job.location}</p>
                       <ul className="space-y-2 list-square list-inside text-[10.5pt] leading-relaxed text-slate-600">
                         {job.highlights.map((h, j) => <li key={j}>{h}</li>)}
                       </ul>
                    </div>
                 </div>
               ))}
            </div>
         </section>
       </div>
    </div>
  );
};

const Section: React.FC<{ children: React.ReactNode }> = ({ children }) => <div className="space-y-6">{children}</div>;
const Title: React.FC<{ children: React.ReactNode }> = ({ children }) => <h2 className="text-sm font-black uppercase tracking-[0.25em] text-slate-900 border-b-2 border-indigo-500 inline-block pb-1 mb-4">{children}</h2>;
