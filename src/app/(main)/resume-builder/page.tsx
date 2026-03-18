'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, BookOpen, Briefcase, Sparkles, FolderGit2, Award, 
  ChevronRight, ChevronLeft, Save, CheckCircle2, Loader2 
} from 'lucide-react';
import { useRouter } from 'next/navigation';

const STEPS = [
  { id: 'personal', title: 'Personal Info', icon: User },
  { id: 'education', title: 'Education', icon: BookOpen },
  { id: 'experience', title: 'Work Experience', icon: Briefcase },
  { id: 'skills', title: 'Skills', icon: Sparkles },
  { id: 'projects', title: 'Projects', icon: FolderGit2 },
  { id: 'extra', title: 'Extra-Curricular', icon: Award },
  { id: 'generate', title: 'AI Generation', icon: CheckCircle2 },
];

export default function ResumeBuilderWizard() {
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [formData, setFormData] = useState({
    personal: { name: '', email: '', phone: '', location: '', linkedin: '', github: '' },
    education: [{ degree: '', school: '', year: '', gpa: '' }],
    experience: [{ title: '', company: '', duration: '', responsibilities: '' }],
    skills: [] as string[],
    projects: [{ name: '', tech: '', link: '', description: '' }],
    extra: { awards: '', certifications: '', volunteer: '' },
  });

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, STEPS.length - 1));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 0));

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/resume/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok) {
        router.push(`/resume-builder/editor?id=${data.id}`);
      }
    } catch (error) {
       console.error('Generation failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-10 pb-20 px-4 md:px-6">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 border border-slate-200 dark:border-slate-800 shadow-xl overflow-x-auto">
          <div className="flex items-center justify-between min-w-[600px]">
            {STEPS.map((step, idx) => {
              const Icon = step.icon;
              const active = idx === currentStep;
              const completed = idx < currentStep;
              return (
                <div key={step.id} className="flex flex-col items-center gap-2 relative">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                    active ? 'bg-blue-600 text-white scale-110 shadow-lg shadow-blue-500/30' : 
                    completed ? 'bg-emerald-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                  }`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className={`text-[10px] font-black uppercase tracking-widest ${active ? 'text-blue-600' : 'text-slate-400'}`}>
                    {step.title}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-[3rem] p-10 border border-slate-200 dark:border-slate-800 shadow-2xl min-h-[500px] flex flex-col">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              className="flex-1"
            >
              {currentStep === 0 && (
                <div className="space-y-6">
                  <h2 className="text-3xl font-black text-slate-900 dark:text-white">Personal info.</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input label="Full Name" placeholder="John Doe" value={formData.personal.name} onChange={v => setFormData({ ...formData, personal: { ...formData.personal, name: v } })} />
                    <Input label="Email Address" placeholder="john@example.com" value={formData.personal.email} onChange={v => setFormData({ ...formData, personal: { ...formData.personal, email: v } })} />
                    <Input label="Phone Number" placeholder="+1..." value={formData.personal.phone} onChange={v => setFormData({ ...formData, personal: { ...formData.personal, phone: v } })} />
                    <Input label="Location" placeholder="San Francisco, CA" value={formData.personal.location} onChange={v => setFormData({ ...formData, personal: { ...formData.personal, location: v } })} />
                  </div>
                </div>
              )}

              {currentStep === 1 && (
                <div className="space-y-6">
                  <h2 className="text-3xl font-black text-slate-900 dark:text-white">Education.</h2>
                  {formData.education.map((edu, idx) => (
                    <div key={idx} className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl space-y-4 border border-slate-100 dark:border-slate-800">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input label="Degree" placeholder="B.Tech Computer Science" value={edu.degree} onChange={v => {
                          const newEdu = [...formData.education];
                          newEdu[idx].degree = v;
                          setFormData({ ...formData, education: newEdu });
                        }} />
                        <Input label="Institution" placeholder="Stanford University" value={edu.school} onChange={v => {
                          const newEdu = [...formData.education];
                          newEdu[idx].school = v;
                          setFormData({ ...formData, education: newEdu });
                        }} />
                      </div>
                    </div>
                  ))}
                  <button 
                    onClick={() => setFormData({ ...formData, education: [...formData.education, { degree: '', school: '', year: '', gpa: '' }] })}
                    className="text-sm font-bold text-blue-600 hover:text-blue-700"
                  >
                    + Add More Education
                  </button>
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-6">
                  <h2 className="text-3xl font-black text-slate-900 dark:text-white">Experience.</h2>
                  {formData.experience.map((exp, idx) => (
                    <div key={idx} className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl space-y-4 border border-slate-100 dark:border-slate-800">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input label="Title" placeholder="Software Engineer" value={exp.title} onChange={v => {
                          const newExp = [...formData.experience];
                          newExp[idx].title = v;
                          setFormData({ ...formData, experience: newExp });
                        }} />
                        <Input label="Company" placeholder="Google" value={exp.company} onChange={v => {
                          const newExp = [...formData.experience];
                          newExp[idx].company = v;
                          setFormData({ ...formData, experience: newExp });
                        }} />
                      </div>
                      <textarea 
                        placeholder="Responsibilities..."
                        className="w-full h-32 px-6 py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-900 dark:text-white focus:ring-2 ring-blue-500/20 outline-none"
                        value={exp.responsibilities}
                        onChange={(e) => {
                          const newExp = [...formData.experience];
                          newExp[idx].responsibilities = e.target.value;
                          setFormData({ ...formData, experience: newExp });
                        }}
                      />
                    </div>
                  ))}
                </div>
              )}

              {currentStep === 6 && (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-6 py-10">
                  <h2 className="text-3xl font-black text-slate-900 dark:text-white">Ready for AI Generation?</h2>
                  <button onClick={handleGenerate} className="px-10 py-5 bg-blue-600 text-white rounded-2xl font-black text-xl">
                    Architect My Resume
                  </button>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          <div className="mt-12 flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-8">
            <button
              onClick={prevStep}
              className={`flex items-center gap-2 text-slate-400 hover:text-slate-600 font-bold uppercase ${currentStep === 0 ? 'invisible' : ''}`}
            >
              <ChevronLeft className="w-5 h-5" /> Back
            </button>
            <button
              onClick={nextStep}
              className={`px-8 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-black ${currentStep === 6 ? 'hidden' : ''}`}
            >
              Continue <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Input({ label, placeholder, value, onChange }: { label: string; placeholder: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="space-y-2">
      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">{label}</label>
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-14 px-6 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-900 dark:text-white focus:ring-2 ring-blue-500/20 transition-all outline-none"
      />
    </div>
  );
}
