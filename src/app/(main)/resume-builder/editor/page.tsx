'use client';

import { useState, useEffect, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, Sparkles, Download, Save, Eye, 
  ChevronLeft, Layout, Type, List, Briefcase, GraduationCap,
  Globe, Mail, Phone, MapPin
} from 'lucide-react';
import { useSearchParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';

import TipTapEditor from '@/components/resume/TipTapEditor';
import { TEMPLATES, TemplateId, getTemplate, ResumeContent } from '@/components/resume/templates';

function ResumeEditorContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = searchParams.get('id');
  
  const [resume, setResume] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTemplate, setActiveTemplate] = useState<TemplateId>('modern');
  const [atsScore, setAtsScore] = useState<number | null>(null);
  const [showOptimizeModal, setShowOptimizeModal] = useState(false);
  const [jobDescription, setJobDescription] = useState('');
  const [optimizing, setOptimizing] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [optimizationResult, setOptimizationResult] = useState<any>(null);

  const handleDownloadPDF = async () => {
    setExporting(true);
    try {
      const response = await fetch(`/api/resume/${id}/export/pdf`);
      if (!response.ok) throw new Error('Export failed');
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `resume-${resume?.data?.basics?.name?.replace(/\s/g, '-') || 'download'}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
      toast.success('Resume downloaded!');
    } catch (err) {
      toast.error('Failed to export PDF');
    } finally {
      setExporting(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetch(`/api/resume/${id}`)
        .then(res => res.json())
        .then(data => {
          // Normalize data...
          if (data.atsScore) setAtsScore(data.atsScore);
          setResume(data);
          if (data.templateId) setActiveTemplate(data.templateId as TemplateId);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [id]);

  const updateBasics = (field: string, value: string) => {
    setResume((prev: any) => ({
      ...prev,
      data: {
        ...prev.data,
        basics: { ...prev.data.basics, [field]: value }
      }
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch(`/api/resume/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          data: resume.data,
          templateId: activeTemplate
        }),
      });
      if (!res.ok) throw new Error('Failed to save');
      toast.success('Resume saved successfully!');
    } catch (err) {
      toast.error('Failed to save changes');
    } finally {
      setSaving(false);
    }
  };

  const handleOptimize = async () => {
    if (!jobDescription) return toast.error('Please provide a job description');
    setOptimizing(true);
    try {
      const res = await fetch('/api/resume/optimize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          resumeData: resume.data, 
          jobDescription 
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Optimization failed');
      
      setOptimizationResult(data);
      setAtsScore(data.score);
      
      // Auto-apply improvements
      setResume((prev: any) => ({
        ...prev,
        data: {
          ...prev.data,
          basics: { ...prev.data.basics, summary: data.optimizedSummary },
          work: data.optimizedWork || prev.data.work
        }
      }));
      
      toast.success('Resume optimized for the target role!');
      setShowOptimizeModal(false);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setOptimizing(false);
    }
  };

  if (loading) return <div className="p-20 text-center text-slate-500 font-bold">Initializing Architect...</div>;
  if (!resume) return <div className="p-20 text-center">Resume not found.</div>;

  const ActiveTemplateComponent = getTemplate(activeTemplate);

  return (
    <div className="h-screen bg-slate-50 dark:bg-slate-950 flex flex-col md:flex-row overflow-hidden relative">
      {/* Sidebar Editor */}
      <div className="w-full md:w-[500px] bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col h-full">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-900 z-10 gap-2">
           <div className="flex items-center gap-3">
              <button onClick={() => router.back()} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors">
                <ChevronLeft className="w-5 h-5 text-slate-500" />
              </button>
              <h1 className="text-xl font-black text-slate-900 dark:text-white tracking-tighter uppercase hidden sm:block">Architect.</h1>
           </div>
           
           <div className="flex items-center gap-2">
              {atsScore !== null && (
                <div className="hidden lg:block px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-lg text-[10px] font-black border border-emerald-100">
                  ATS: {atsScore}%
                </div>
              )}
              <button 
                onClick={handleDownloadPDF}
                disabled={exporting}
                className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all active:scale-95 disabled:opacity-50"
              >
                {exporting ? 'Generating...' : <><Download className="w-4 h-4" /> PDF</>}
              </button>
              <button 
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-lg shadow-indigo-600/20 transition-all active:scale-95 disabled:opacity-50"
              >
                {saving ? 'Saving...' : <><Save className="w-4 h-4" /> Save</>}
              </button>
           </div>
        </div>

        {/* Scrollable Form */}
        <div className="flex-1 overflow-y-auto p-8 space-y-12">
          {/* Optimization Controls */}
          <Section label="AI Intelligence" icon={Sparkles}>
             <button 
               onClick={() => setShowOptimizeModal(true)}
               className="w-full flex items-center justify-center gap-3 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-slate-900/10 hover:shadow-indigo-500/20 transition-all group active:scale-95 mb-4"
             >
                <Sparkles className="w-5 h-5 text-indigo-500 group-hover:animate-pulse" />
                Optimize for this Job
             </button>
             
             {optimizationResult && (
               <div className="bg-amber-50 dark:bg-amber-950/20 p-4 rounded-2xl border border-amber-100 dark:border-amber-900/30 space-y-3">
                  <h4 className="text-[10px] font-black text-amber-700 uppercase tracking-widest">Missing Keywords</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {optimizationResult.missingKeywords?.map((k: string) => (
                      <span key={k} className="px-2 py-0.5 bg-white dark:bg-slate-800 rounded-full text-[9px] font-bold text-amber-600 border border-amber-200">{k}</span>
                    ))}
                  </div>
               </div>
             )}
          </Section>

          {/* Template Picker */}
          <Section label="Design System" icon={Layout}>
             <div className="grid grid-cols-3 gap-2">
                {Object.keys(TEMPLATES).map((t) => (
                  <button 
                    key={t}
                    onClick={() => setActiveTemplate(t as TemplateId)}
                    className={`px-3 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest border transition-all ${
                      activeTemplate === t 
                        ? 'bg-indigo-50 border-indigo-200 text-indigo-600 shadow-sm' 
                        : 'bg-white border-slate-100 text-slate-400 hover:border-slate-300'
                    }`}
                  >
                    {t}
                  </button>
                ))}
             </div>
          </Section>

          {/* Basics */}
          <Section label="Identity" icon={Type}>
             <div className="space-y-4">
                <Input label="Full Name" value={resume.data.basics.name} onChange={(v) => updateBasics('name', v)} />
                <Input label="Professional Label" value={resume.data.basics.label} onChange={(v) => updateBasics('label', v)} />
                <div className="grid grid-cols-2 gap-4">
                   <Input label="Email" value={resume.data.basics.email} onChange={(v) => updateBasics('email', v)} />
                   <Input label="Phone" value={resume.data.basics.phone} onChange={(v) => updateBasics('phone', v)} />
                </div>
                <Input label="Location" value={resume.data.basics.location} onChange={(v) => updateBasics('location', v)} />
             </div>
          </Section>

          {/* Summary */}
          <Section label="Professional Summary" icon={Sparkles}>
             <TipTapEditor 
                content={resume.data.basics.summary} 
                onChange={(v) => updateBasics('summary', v)}
                placeholder="Briefly describe your professional background..."
             />
          </Section>

          {/* Experience */}
          <Section label="Work History" icon={Briefcase}>
             {resume.data.work.map((job: any, index: number) => (
               <div key={index} className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-4 mb-4">
                  <div className="grid grid-cols-2 gap-3">
                     <Input label="Company" value={job.company} onChange={(v) => {
                       const newWork = [...resume.data.work];
                       newWork[index].company = v;
                       setResume({...resume, data: {...resume.data, work: newWork}});
                     }} />
                     <Input label="Role" value={job.position} onChange={(v) => {
                       const newWork = [...resume.data.work];
                       newWork[index].position = v;
                       setResume({...resume, data: {...resume.data, work: newWork}});
                     }} />
                  </div>
                  <TipTapEditor 
                    content={job.summary || `<ul>${job.highlights.map((h:any) => `<li>${h}</li>`).join('')}</ul>`} 
                    onChange={(v) => {
                       // We'll store both for compatibility
                       const newWork = [...resume.data.work];
                       newWork[index].summary = v;
                       // Extract text from HTML for highlights if needed, but we'll use summary primarily
                       setResume({...resume, data: {...resume.data, work: newWork}});
                    }}
                  />
               </div>
             ))}
             <button className="w-full py-3 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-indigo-600 hover:border-indigo-200 transition-all">
               + Add Experience
             </button>
          </Section>
        </div>
      </div>

      {/* Live Preview */}
      <div className="flex-1 bg-slate-100 dark:bg-slate-950 p-6 md:p-12 overflow-y-auto flex justify-center">
        <div className="w-full max-w-[210mm] transition-all transform origin-top shadow-2xl h-fit">
           <ActiveTemplateComponent data={resume.data} />
        </div>
      </div>

      {/* Optimization Modal */}
      <AnimatePresence>
        {showOptimizeModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm"
              onClick={() => !optimizing && setShowOptimizeModal(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl p-10 border border-slate-200 dark:border-slate-800"
            >
              <div className="text-center space-y-4 mb-8">
                 <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto">
                    <Sparkles className="w-6 h-6 text-white" />
                 </div>
                 <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">ATS Optimization Engine.</h2>
                 <p className="text-sm font-bold text-slate-400">Paste the job description below. AI will analyze the requirements and auto-tailor your resume for maximum impact.</p>
              </div>

              <textarea 
                className="w-full h-64 p-6 bg-slate-50 dark:bg-slate-800 border-none rounded-3xl text-sm font-medium text-slate-700 dark:text-slate-200 outline-none ring-2 ring-transparent focus:ring-indigo-500/10 placeholder:text-slate-400 mb-6"
                placeholder="Paste Job Description here..."
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
              />

              <div className="flex gap-4">
                 <button 
                  onClick={() => setShowOptimizeModal(false)}
                  disabled={optimizing}
                  className="flex-1 py-4 border border-slate-200 dark:border-slate-700 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:bg-slate-50 transition-all disabled:opacity-50"
                 >
                    Cancel
                 </button>
                 <button 
                  onClick={handleOptimize}
                  disabled={optimizing}
                  className="flex-[2] py-4 bg-indigo-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-indigo-600/20 transition-all active:scale-95 disabled:opacity-50"
                 >
                    {optimizing ? 'Optimizing Architecture...' : 'Trigger Evolution'}
                 </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function ResumeEditor() {
  return (
    <Suspense fallback={<div className="p-20 text-center font-black tracking-widest text-slate-300">ARCHITECT_BOOTING...</div>}>
      <ResumeEditorContent />
    </Suspense>
  );
}

function Section({ label, icon: Icon, children }: { label: string; icon: any; children: React.ReactNode }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
        <Icon className="w-4 h-4 text-indigo-600" />
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-900 dark:text-white">{label}</span>
      </div>
      {children}
    </div>
  );
}

function Input({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="space-y-1.5 flex-1">
      <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">{label}</label>
      <input 
        className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 outline-none ring-2 ring-transparent focus:ring-indigo-500/10 transition-all" 
        value={value} 
        onChange={(e) => onChange(e.target.value)} 
      />
    </div>
  );
}
