'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, BookOpen, Briefcase, Sparkles, FolderGit2, Award, 
  ChevronRight, ChevronLeft, Save, CheckCircle2, Loader2, Plus, Trash2, Target
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

const STEPS = [
  { id: 'personal', title: 'Personal', icon: User },
  { id: 'education', title: 'Education', icon: BookOpen },
  { id: 'experience', title: 'Experience', icon: Briefcase },
  { id: 'skills', title: 'Skills', icon: Sparkles },
  { id: 'projects', title: 'Projects', icon: FolderGit2 },
  { id: 'extra', title: 'Awards & Certs', icon: Award },
  { id: 'generate', title: 'AI Architect', icon: CheckCircle2 },
];

export default function ResumeBuilderWizard() {
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const [formData, setFormData] = useState({
    personal: { name: '', email: '', phone: '', location: '', linkedin: '', github: '' },
    education: [{ school: '', degree: '', year: '', gpa: '' }],
    experience: [{ company: '', title: '', duration: '', responsibilities: '' }],
    skills: [] as string[],
    projects: [{ name: '', description: '', tech: '', link: '' }],
    extra: { certifications: '', awards: '', volunteer: '' },
  });

  const [skillInput, setSkillInput] = useState('');

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, STEPS.length - 1));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 0));

  const addEducation = () => setFormData({ ...formData, education: [...formData.education, { school: '', degree: '', year: '', gpa: '' }] });
  const addExperience = () => setFormData({ ...formData, experience: [...formData.experience, { company: '', title: '', duration: '', responsibilities: '' }] });
  const addProject = () => setFormData({ ...formData, projects: [...formData.projects, { name: '', description: '', tech: '', link: '' }] });

  const addSkill = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && skillInput.trim()) {
      if (!formData.skills.includes(skillInput)) {
        setFormData({ ...formData, skills: [...formData.skills, skillInput.trim()] });
      }
      setSkillInput('');
    }
  };

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/resume/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Generation failed');
      
      toast.success('Resume Architected Successfully!');
      router.push(`/resume/editor/${data.id}`);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 pt-10 pb-24 px-4">
      <div className="max-w-5xl mx-auto space-y-12">
        {/* Progress Stepper */}
        <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-900 p-6 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-xl overflow-x-auto no-scrollbar">
          {STEPS.map((step, idx) => (
            <div key={step.id} className="flex flex-col items-center gap-3 min-w-[80px]">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
                idx === currentStep ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30' :
                idx < currentStep ? 'bg-emerald-500 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-400'
              }`}>
                <step.icon className="w-6 h-6" />
              </div>
              <span className={`text-[10px] font-black uppercase tracking-widest ${idx === currentStep ? 'text-indigo-600' : 'text-slate-400'}`}>
                {step.title}
              </span>
            </div>
          ))}
        </div>

        {/* Content Area */}
        <div className="bg-white dark:bg-slate-900 rounded-[3.5rem] p-12 border border-slate-100 dark:border-slate-800 shadow-2xl relative overflow-hidden min-h-[600px] flex flex-col">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="flex-1"
            >
              {currentStep === 0 && (
                <div className="space-y-8">
                  <div className="space-y-2">
                    <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">Personal Info.</h2>
                    <p className="text-slate-500 font-bold">The fundamentals of your professional identity.</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input label="Full Name" value={formData.personal.name} onChange={v => setFormData({...formData, personal: {...formData.personal, name: v}})} />
                    <Input label="Email" value={formData.personal.email} onChange={v => setFormData({...formData, personal: {...formData.personal, email: v}})} />
                    <Input label="Phone" value={formData.personal.phone} onChange={v => setFormData({...formData, personal: {...formData.personal, phone: v}})} />
                    <Input label="Location" value={formData.personal.location} onChange={v => setFormData({...formData, personal: {...formData.personal, location: v}})} />
                    <Input label="LinkedIn URL" value={formData.personal.linkedin} onChange={v => setFormData({...formData, personal: {...formData.personal, linkedin: v}})} />
                    <Input label="GitHub URL" value={formData.personal.github} onChange={v => setFormData({...formData, personal: {...formData.personal, github: v}})} />
                  </div>
                </div>
              )}

              {currentStep === 1 && (
                <div className="space-y-8">
                  <div className="flex justify-between items-center">
                    <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">Education.</h2>
                    <button onClick={addEducation} className="p-4 bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 rounded-full hover:scale-110 transition-all">
                      <Plus className="w-6 h-6" />
                    </button>
                  </div>
                  <div className="space-y-6">
                    {formData.education.map((edu, idx) => (
                      <div key={idx} className="p-8 bg-slate-50 dark:bg-slate-800/50 rounded-[2rem] border border-slate-100 dark:border-slate-800 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input label="School/University" value={edu.school} onChange={v => {
                          const newEdu = [...formData.education]; newEdu[idx].school = v; setFormData({...formData, education: newEdu});
                        }} />
                        <Input label="Degree" value={edu.degree} onChange={v => {
                          const newEdu = [...formData.education]; newEdu[idx].degree = v; setFormData({...formData, education: newEdu});
                        }} />
                        <Input label="Year" value={edu.year} onChange={v => {
                          const newEdu = [...formData.education]; newEdu[idx].year = v; setFormData({...formData, education: newEdu});
                        }} />
                        <Input label="GPA" value={edu.gpa} onChange={v => {
                          const newEdu = [...formData.education]; newEdu[idx].gpa = v; setFormData({...formData, education: newEdu});
                        }} />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-8">
                  <div className="flex justify-between items-center">
                    <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">Experience.</h2>
                    <button onClick={addExperience} className="p-4 bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 rounded-full hover:scale-110 transition-all">
                      <Plus className="w-6 h-6" />
                    </button>
                  </div>
                  <div className="space-y-6">
                    {formData.experience.map((exp, idx) => (
                      <div key={idx} className="p-8 bg-slate-50 dark:bg-slate-800/50 rounded-[2rem] border border-slate-100 dark:border-slate-800 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <Input label="Company" value={exp.company} onChange={v => {
                            const newExp = [...formData.experience]; newExp[idx].company = v; setFormData({...formData, experience: newExp});
                          }} />
                          <Input label="Job Title" value={exp.title} onChange={v => {
                            const newExp = [...formData.experience]; newExp[idx].title = v; setFormData({...formData, experience: newExp});
                          }} />
                          <Input label="Duration" value={exp.duration} onChange={v => {
                            const newExp = [...formData.experience]; newExp[idx].duration = v; setFormData({...formData, experience: newExp});
                          }} />
                        </div>
                        <div className="space-y-2">
                           <label className="text-[10px] font-black text-slate-400 tracking-widest uppercase">Responsibilities (Bullet points)</label>
                           <textarea 
                             className="w-full h-32 bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 outline-none font-bold text-sm"
                             value={exp.responsibilities}
                             onChange={(e) => {
                               const newExp = [...formData.experience]; newExp[idx].responsibilities = e.target.value; setFormData({...formData, experience: newExp});
                             }}
                             placeholder="AI will auto-expand these later..."
                           />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div className="space-y-8">
                  <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">Skills.</h2>
                  <div className="space-y-6">
                    <div className="relative">
                      <Sparkles className="absolute left-6 top-1/2 -translate-y-1/2 text-indigo-500 w-5 h-5" />
                      <input 
                        className="w-full pl-14 pr-6 py-5 bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-indigo-500 rounded-3xl outline-none font-black text-lg transition-all"
                        placeholder="Add a skill and press Enter..."
                        value={skillInput}
                        onChange={(e) => setSkillInput(e.target.value)}
                        onKeyDown={addSkill}
                      />
                    </div>
                    <div className="flex flex-wrap gap-3">
                       {formData.skills.map(skill => (
                         <span key={skill} className="px-6 py-2 bg-indigo-600 text-white rounded-full font-black text-xs uppercase tracking-widest flex items-center gap-2">
                           {skill}
                           <Trash2 className="w-4 h-4 cursor-pointer hover:text-red-300" onClick={() => setFormData({...formData, skills: formData.skills.filter(s => s !== skill)})} />
                         </span>
                       ))}
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 4 && (
                <div className="space-y-8">
                  <div className="flex justify-between items-center">
                    <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">Projects.</h2>
                    <button onClick={addProject} className="p-4 bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 rounded-full hover:scale-110 transition-all">
                      <Plus className="w-6 h-6" />
                    </button>
                  </div>
                  <div className="space-y-6">
                    {formData.projects.map((proj, idx) => (
                      <div key={idx} className="p-8 bg-slate-50 dark:bg-slate-800/50 rounded-[2rem] border border-slate-100 dark:border-slate-800 space-y-4">
                        <Input label="Project Name" value={proj.name} onChange={v => {
                          const newProj = [...formData.projects]; newProj[idx].name = v; setFormData({...formData, projects: newProj});
                        }} />
                        <Input label="Tech Stack" value={proj.tech} onChange={v => {
                          const newProj = [...formData.projects]; newProj[idx].tech = v; setFormData({...formData, projects: newProj});
                        }} />
                        <Input label="Link" value={proj.link} onChange={v => {
                          const newProj = [...formData.projects]; newProj[idx].link = v; setFormData({...formData, projects: newProj});
                        }} />
                        <textarea 
                             className="w-full h-24 bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 outline-none font-bold text-sm"
                             value={proj.description}
                             onChange={(e) => {
                               const newProj = [...formData.projects]; newProj[idx].description = e.target.value; setFormData({...formData, projects: newProj});
                             }}
                             placeholder="Brief description..."
                           />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {currentStep === 5 && (
                <div className="space-y-8">
                  <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">Final Details.</h2>
                  <div className="space-y-6">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 tracking-widest uppercase">Certifications</label>
                       <textarea 
                         className="w-full h-24 bg-slate-50 dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 outline-none font-bold text-sm"
                         value={formData.extra.certifications}
                         onChange={(e) => setFormData({...formData, extra: {...formData.extra, certifications: e.target.value}})}
                       />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 tracking-widest uppercase">Awards</label>
                       <textarea 
                         className="w-full h-24 bg-slate-50 dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 outline-none font-bold text-sm"
                         value={formData.extra.awards}
                         onChange={(e) => setFormData({...formData, extra: {...formData.extra, awards: e.target.value}})}
                       />
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 6 && (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-8 py-10">
                  <div className="w-24 h-24 bg-indigo-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-indigo-600/30">
                    <Sparkles className="w-12 h-12 text-white animate-pulse" />
                  </div>
                  <div className="space-y-2">
                    <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">Ready to Build.</h2>
                    <p className="text-slate-500 font-bold max-w-sm">
                      Our Claude AI Architect will now rewrite your experience using achievement-focused language.
                    </p>
                  </div>
                  <button 
                    onClick={handleGenerate}
                    disabled={loading}
                    className="px-12 py-5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-[2rem] font-black text-xl shadow-2xl transition-all active:scale-95 disabled:opacity-50"
                  >
                    {loading ? <Loader2 className="w-8 h-8 animate-spin" /> : 'ARCHITECT MY RESUME'}
                  </button>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Navigation Controls */}
          {currentStep < 6 && (
            <div className="mt-12 flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-10">
              <button 
                onClick={prevStep}
                className={`flex items-center gap-2 text-slate-400 hover:text-slate-600 font-black uppercase tracking-widest text-xs transition-all ${currentStep === 0 ? 'invisible' : ''}`}
              >
                <ChevronLeft className="w-5 h-5" /> Back
              </button>
              <button 
                onClick={nextStep}
                className="px-10 py-5 bg-indigo-600 text-white rounded-[2rem] font-black flex items-center gap-4 shadow-xl shadow-indigo-600/20 active:scale-95 transition-all text-sm uppercase tracking-widest"
              >
                Continue <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Input({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="space-y-2">
      <label className="text-[10px] font-black text-slate-400 tracking-widest uppercase ml-1">{label}</label>
      <input 
        className="w-full h-14 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-2xl px-6 outline-none font-bold text-sm focus:ring-4 ring-indigo-500/10 transition-all"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={`Enter ${label.toLowerCase()}...`}
      />
    </div>
  );
}
