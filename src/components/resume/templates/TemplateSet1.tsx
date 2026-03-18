import React from 'react';
import { ResumeContent } from './types';

// 1. MODERN TEMPLATE (Clean, Two-column)
export const ModernTemplate: React.FC<{ data: ResumeContent }> = ({ data }) => {
  return (
    <div className="bg-white p-12 min-h-screen font-sans text-slate-800 flex gap-10">
      {/* Sidebar */}
      <div className="w-1/3 space-y-8">
        <div>
          <h1 className="text-3xl font-black text-slate-900 leading-tight uppercase tracking-tighter">{data.basics.name}</h1>
          <p className="text-blue-600 font-bold text-sm tracking-widest uppercase mt-1">{data.basics.label}</p>
        </div>
        
        <div className="space-y-4">
          <SectionTitle>Contact</SectionTitle>
          <div className="space-y-2 text-xs font-medium text-slate-500">
            <p>{data.basics.email}</p>
            <p>{data.basics.phone}</p>
            <p>{data.basics.location}</p>
          </div>
        </div>

        <div className="space-y-4">
          <SectionTitle>Skills</SectionTitle>
          <div className="flex flex-wrap gap-2">
            {data.skills.map((skill, i) => (
              <span key={i} className="px-3 py-1 bg-slate-100 rounded-lg text-[10px] font-bold text-slate-600 uppercase tracking-widest">{skill.name}</span>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <SectionTitle>Education</SectionTitle>
          {data.education.map((edu, i) => (
            <div key={i} className="space-y-1">
              <p className="text-xs font-bold text-slate-900">{edu.institution}</p>
              <p className="text-[10px] text-slate-500 font-medium">{edu.area} • {edu.year}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 space-y-10">
        <div className="space-y-3">
          <SectionTitle>Profile</SectionTitle>
          <p className="text-sm leading-relaxed text-slate-600 font-medium italic">"{data.basics.summary}"</p>
        </div>

        <div className="space-y-6">
          <SectionTitle>Experience</SectionTitle>
          {data.work.map((job, i) => (
            <div key={i} className="space-y-2">
              <div className="flex justify-between items-baseline">
                <h3 className="font-black text-slate-900 text-lg tracking-tight">{job.position}</h3>
                <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">{job.duration}</span>
              </div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">{job.company} • {job.location}</p>
              <ul className="space-y-1.5 list-disc list-inside text-sm text-slate-600 font-medium">
                {job.highlights.map((h, j) => (
                  <li key={j} className="pl-1">{h}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="space-y-6">
          <SectionTitle>Projects</SectionTitle>
          {data.projects.map((proj, i) => (
            <div key={i} className="space-y-1">
              <h3 className="font-black text-slate-900 text-sm uppercase tracking-wider">{proj.name}</h3>
              <p className="text-xs text-slate-500 font-medium">{proj.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// 2. CLASSIC TEMPLATE (Single column, Professional)
export const ClassicTemplate: React.FC<{ data: ResumeContent }> = ({ data }) => {
  return (
    <div className="bg-white p-16 min-h-screen font-serif text-slate-900 max-w-[850px] mx-auto shadow-sm">
      <div className="text-center border-b-2 border-slate-900 pb-8 mb-10">
        <h1 className="text-4xl font-bold uppercase tracking-[0.15em] mb-2">{data.basics.name}</h1>
        <div className="flex justify-center gap-6 text-[10pt] text-slate-600 font-medium">
          <span>{data.basics.location}</span>
          <span>•</span>
          <span>{data.basics.phone}</span>
          <span>•</span>
          <span>{data.basics.email}</span>
        </div>
      </div>

      <div className="space-y-12">
        <section>
          <ClassicTitle>Summary</ClassicTitle>
          <p className="text-[10.5pt] leading-relaxed italic">{data.basics.summary}</p>
        </section>

        <section>
          <ClassicTitle>Professional Experience</ClassicTitle>
          <div className="space-y-8">
            {data.work.map((job, i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between font-bold text-[11pt]">
                  <span>{job.position}</span>
                  <span>{job.duration}</span>
                </div>
                <div className="flex justify-between italic text-[10pt] text-slate-700">
                  <span>{job.company}</span>
                  <span>{job.location}</span>
                </div>
                <ul className="list-disc list-inside space-y-1 text-[10pt] leading-snug pl-2">
                  {job.highlights.map((h, j) => (
                    <li key={j}>{h}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section className="grid grid-cols-2 gap-10">
          <div>
            <ClassicTitle>Education</ClassicTitle>
            {data.education.map((edu, i) => (
              <div key={i} className="mb-4">
                <p className="font-bold text-[10.5pt]">{edu.institution}</p>
                <p className="text-[10pt] italic">{edu.studyType} • {edu.year}</p>
              </div>
            ))}
          </div>
          <div>
            <ClassicTitle>Skills</ClassicTitle>
            <p className="text-[10pt] leading-relaxed">
              {data.skills.map(s => s.name).join(', ')}
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};

const SectionTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100 pb-2 mb-4">{children}</h2>
);

const ClassicTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <h2 className="text-[12pt] font-bold uppercase tracking-widest border-b-2 border-slate-200 pb-1 mb-4">{children}</h2>
);
