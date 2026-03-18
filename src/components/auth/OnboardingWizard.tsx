'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, MapPin, Briefcase, Rocket, 
  ChevronRight, ChevronLeft, Check, Target
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';

interface OnboardingWizardProps {
  user: {
    id: string;
    name?: string;
  };
}

export default function OnboardingWizard({ user }: OnboardingWizardProps) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { update } = useSession();

  // Form State
  const [formData, setFormData] = useState({
    headline: '',
    bio: '',
    location: '',
    experienceLevel: 'JUNIOR',
    skills: [] as string[],
  });

  const [skillInput, setSkillInput] = useState('');

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);

  const addSkill = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && skillInput.trim()) {
      e.preventDefault();
      if (!formData.skills.includes(skillInput.trim())) {
        setFormData({ ...formData, skills: [...formData.skills, skillInput.trim()] });
      }
      setSkillInput('');
    }
  };

  const removeSkill = (skill: string) => {
    setFormData({ ...formData, skills: formData.skills.filter(s => s !== skill) });
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/auth/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error('Failed to update profile');

      toast.success('Onboarding complete! Welcome to the evolution.');
      await update({ profileComplete: true });
      router.refresh();
    } catch (err) {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[110] bg-white dark:bg-slate-950 flex flex-col items-center justify-center p-6">
      <div className="max-w-xl w-full">
        {/* Progress Bar */}
        <div className="flex gap-2 mb-12">
          {[1, 2, 3].map((s) => (
            <div 
              key={s} 
              className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${
                s <= step ? 'bg-indigo-600' : 'bg-slate-100 dark:bg-slate-800'
              }`} 
            />
          ))}
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div 
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="space-y-2">
                <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">
                  Let's define your <span className="text-indigo-600">Headline.</span>
                </h1>
                <p className="text-slate-500 dark:text-slate-400 font-bold">
                  This is the first thing recruiters and the AI see.
                </p>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Professional Headline</label>
                  <input 
                    type="text"
                    value={formData.headline}
                    onChange={(e) => setFormData({ ...formData, headline: e.target.value })}
                    placeholder="e.g. Senior Fullstack Engineer | React & Node.js"
                    className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl outline-none font-bold text-lg focus:ring-4 ring-indigo-500/10 transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Short Bio</label>
                  <textarea 
                    rows={4}
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    placeholder="Tell us your mission in 2 sentences..."
                    className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl outline-none font-bold text-sm resize-none focus:ring-4 ring-indigo-500/10 transition-all"
                  />
                </div>
              </div>

              <button 
                onClick={nextStep}
                disabled={!formData.headline}
                className="w-full py-5 bg-indigo-600 text-white rounded-[2rem] font-black text-lg shadow-2xl shadow-indigo-600/30 flex items-center justify-center gap-3 disabled:opacity-50 transition-all active:scale-95"
              >
                Continue <ChevronRight className="w-5 h-5" />
              </button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div 
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="space-y-2">
                <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">
                  Where are you <span className="text-indigo-600">Based?</span>
                </h1>
                <p className="text-slate-500 dark:text-slate-400 font-bold">
                  Location and experience level help us find precision matches.
                </p>
              </div>

              <div className="space-y-6">
                <div className="space-y-2 relative">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">City, Country</label>
                  <div className="relative">
                    <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-indigo-500" />
                    <input 
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      placeholder="e.g. Bangalore, India"
                      className="w-full pl-14 pr-6 py-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl outline-none font-bold text-lg focus:ring-4 ring-indigo-500/10 transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Experience Level</label>
                  <div className="grid grid-cols-2 gap-3">
                    {['FRESHER', 'JUNIOR', 'MID', 'SENIOR', 'EXECUTIVE'].map((lvl) => (
                      <button
                        key={lvl}
                        onClick={() => setFormData({ ...formData, experienceLevel: lvl })}
                        className={`py-4 rounded-2xl font-black text-xs uppercase tracking-widest border transition-all ${
                          formData.experienceLevel === lvl 
                            ? 'bg-indigo-600 border-indigo-600 text-white shadow-xl shadow-indigo-600/20' 
                            : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-400 hover:border-indigo-500'
                        }`}
                      >
                        {lvl.replace('_', ' ')}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <button onClick={prevStep} className="p-5 rounded-[2rem] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button 
                  onClick={nextStep}
                  disabled={!formData.location}
                  className="flex-1 py-5 bg-indigo-600 text-white rounded-[2rem] font-black text-lg shadow-2xl shadow-indigo-600/30 flex items-center justify-center gap-3 disabled:opacity-50 transition-all active:scale-95"
                >
                  Continue <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div 
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="space-y-2">
                <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">
                  What's in your <span className="text-indigo-600">Arsenal?</span>
                </h1>
                <p className="text-slate-500 dark:text-slate-400 font-bold">
                  Add your top 5+ skills to unlock AI matching.
                </p>
              </div>

              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="relative">
                    <Target className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-indigo-500" />
                    <input 
                      type="text"
                      value={skillInput}
                      onChange={(e) => setSkillInput(e.target.value)}
                      onKeyDown={addSkill}
                      placeholder="Add a skill (e.g. React) and press Enter"
                      className="w-full pl-14 pr-6 py-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl outline-none font-bold text-lg focus:ring-4 ring-indigo-500/10 transition-all"
                    />
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {formData.skills.map((skill) => (
                      <span 
                        key={skill}
                        className="flex items-center gap-2 px-4 py-2 bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 rounded-full text-sm font-black uppercase tracking-widest"
                      >
                        {skill}
                        <button onClick={() => removeSkill(skill)} className="hover:text-red-500 transition-colors">
                          <Check className="w-4 h-4" />
                        </button>
                      </span>
                    ))}
                    {formData.skills.length === 0 && (
                      <p className="text-slate-400 font-bold text-sm italic">No skills added yet...</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <button onClick={prevStep} className="p-5 rounded-[2rem] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button 
                  onClick={handleSubmit}
                  disabled={loading || formData.skills.length < 1}
                  className="flex-1 py-5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-[2rem] font-black text-lg shadow-2xl flex items-center justify-center gap-3 disabled:opacity-50 transition-all active:scale-95"
                >
                  {loading ? 'Finalizing...' : 'Launch Platform'} <Rocket className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
