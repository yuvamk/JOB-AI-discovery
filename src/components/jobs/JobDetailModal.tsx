'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Building2, MapPin, DollarSign, Clock, 
  Sparkles, Zap, Globe, ShieldCheck, ExternalLink,
  CheckCircle2, Bookmark, Send, Calendar
} from 'lucide-react';
import { RankedJob } from '@/lib/types/jobs';

interface JobDetailModalProps {
  job: RankedJob | null;
  isOpen: boolean;
  onClose: () => void;
  onSave?: (job: RankedJob) => void;
  isSaved?: boolean;
}

export default function JobDetailModal({ job, isOpen, onClose, onSave, isSaved }: JobDetailModalProps) {
  if (!job) return null;

  const applyUrl = job.applyUrl || job.apply_link;
  const matchScore = job.match_score || job.total_score || 0;
  const salary = job.salary || (job.salary_min && job.salary_max
    ? `$${Math.round(job.salary_min / 1000)}k – $${Math.round(job.salary_max / 1000)}k`
    : null);
  const postedDate = job.posted_date || (job.posted_at
    ? new Date(job.posted_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    : null);
  const matchReason = (job as any).match_reason;

  const handleApply = () => {
    if (applyUrl) window.open(applyUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        /* Full-screen overlay */
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-slate-950/70 backdrop-blur-md"
            onClick={onClose}
          />

          {/* Centered modal card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 24 }}
            transition={{ type: 'spring', damping: 26, stiffness: 220 }}
            className="relative w-full max-w-2xl max-h-[90vh] bg-white dark:bg-slate-950 rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden border border-slate-200 dark:border-slate-800"
          >
            {/* Scrollable body */}
            <div className="flex-1 overflow-y-auto custom-scrollbar relative">
              
              {/* Gradient banner — now inside scroll area to allow overlap without clipping */}
              <div className="h-44 bg-gradient-to-br from-indigo-600 to-violet-700 relative overflow-hidden flex-shrink-0 border-b border-white/10">
                <div className="absolute inset-0 opacity-20">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-[100px] -mr-32 -mt-32" />
                  <div className="absolute bottom-0 left-0 w-48 h-48 bg-violet-400 rounded-full blur-[80px] -ml-24 -mb-24" />
                </div>
                
                {/* Top Row: Source & Close — stick to top of parent scrollable if we want, but simple absolute is fine here */}
                <div className="absolute top-6 left-6 right-6 flex justify-between items-center z-20">
                  {job.source_platform ? (
                    <div className="px-3 py-1.5 bg-white/10 backdrop-blur-md border border-white/10 rounded-full text-[10px] font-black text-white uppercase tracking-widest shadow-xl">
                      via {job.source_platform}
                    </div>
                  ) : <div />}
                  
                  <button
                    onClick={onClose}
                    className="p-2.5 bg-white/10 hover:bg-white/25 text-white rounded-xl backdrop-blur-md border border-white/10 transition-all active:scale-95 shadow-xl"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="px-8 pb-12 -mt-16 relative z-10">
                {/* Logo + actions row */}
                <div className="flex items-end justify-between gap-6 mb-8">
                  <div className="w-32 h-32 bg-white dark:bg-slate-900 rounded-[2.5rem] p-6 shadow-2xl border-[6px] border-white dark:border-slate-950 flex items-center justify-center flex-shrink-0">
                    {job.logo_url ? (
                      <img
                        src={job.logo_url}
                        alt={job.companyName || job.company || ''}
                        className="w-full h-full object-contain"
                        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                      />
                    ) : (
                      <Building2 className="w-14 h-14 text-slate-200" />
                    )}
                  </div>

                  <div className="flex items-center gap-3 pb-2">
                    <button
                      onClick={() => onSave?.(job)}
                      className={`p-4 rounded-2xl border transition-all active:scale-95 shadow-lg ${
                        isSaved
                          ? 'bg-indigo-600 border-indigo-600 text-white shadow-indigo-600/30'
                          : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-400 hover:text-indigo-600 hover:border-indigo-100'
                      }`}
                    >
                      <Bookmark className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} />
                    </button>
                    <button
                      onClick={handleApply}
                      disabled={!applyUrl}
                      className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl shadow-indigo-600/30 active:scale-95 transition-all flex items-center gap-2.5 disabled:opacity-40 disabled:cursor-not-allowed group"
                    >
                      <ExternalLink className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" /> 
                      Apply Now
                    </button>
                  </div>
                </div>

                <div className="space-y-6">
                  {/* Title & meta */}
                  <div className="space-y-2">
                    <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tighter leading-tight">
                      {job.title}
                    </h2>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-slate-400 font-bold text-[10px] uppercase tracking-[0.12em]">
                      <span className="text-indigo-600 font-black">{job.companyName || job.company}</span>
                      {job.location && (
                        <span className="flex items-center gap-1.5"><MapPin className="w-3 h-3" />{job.location}</span>
                      )}
                      {salary && (
                        <span className="flex items-center gap-1.5"><DollarSign className="w-3 h-3" />{salary}</span>
                      )}
                      {postedDate && (
                        <span className="flex items-center gap-1.5"><Calendar className="w-3 h-3" />{postedDate}</span>
                      )}
                      {job.job_type && (
                        <span className="flex items-center gap-1.5"><Clock className="w-3 h-3" />{job.job_type}</span>
                      )}
                    </div>
                  </div>

                  {/* AI Match card */}
                  <div className="grid grid-cols-2 gap-3 p-1 bg-slate-50 dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800">
                    {/* Score */}
                    <div className="p-5 space-y-3">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-indigo-500" />
                        <span className="text-[9px] font-black text-indigo-600 uppercase tracking-[0.2em]">AI Match</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">
                          {matchScore}<span className="text-base opacity-30">%</span>
                        </span>
                        <div className="flex-1 space-y-1.5">
                          <p className={`text-[9px] font-bold uppercase tracking-widest ${
                            matchScore >= 80 ? 'text-emerald-500' : matchScore >= 60 ? 'text-amber-500' : 'text-slate-400'
                          }`}>
                            {matchScore >= 80 ? 'Excellent' : matchScore >= 60 ? 'Good Match' : 'Partial'}
                          </p>
                          <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${matchScore}%` }}
                              transition={{ delay: 0.25, duration: 0.55 }}
                              className={`h-full rounded-full ${
                                matchScore >= 80 ? 'bg-indigo-600' : matchScore >= 60 ? 'bg-amber-500' : 'bg-slate-400'
                              }`}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Reason */}
                    <div className="p-5 bg-white dark:bg-slate-800 rounded-[1.5rem] border border-slate-100 dark:border-slate-700 m-1 flex flex-col justify-center gap-2">
                      <div className="flex items-center gap-2">
                        <Zap className="w-4 h-4 text-amber-500" />
                        <span className="text-[9px] font-black text-slate-700 dark:text-slate-300 uppercase tracking-widest">Why You Match</span>
                      </div>
                      <p className="text-xs font-semibold text-slate-500 leading-relaxed italic">
                        "{matchReason || `Strong alignment with "${job.title}" requirements.`}"
                      </p>
                    </div>
                  </div>

                  {/* Description */}
                  {job.description && (
                    <Section title="The Role" icon={<Globe className="w-4 h-4 text-indigo-500" />}>
                      <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                        {job.description.length > 800
                          ? job.description.slice(0, 800) + '…'
                          : job.description}
                      </p>
                    </Section>
                  )}

                  {/* Skills */}
                  {job.skills && job.skills.length > 0 && (
                    <Section title="Requirements" icon={<ShieldCheck className="w-4 h-4 text-indigo-500" />}>
                      <div className="flex flex-wrap gap-2">
                        {job.skills.map((skill, i) => (
                          <span
                            key={i}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800"
                          >
                            <CheckCircle2 className="w-3 h-3 text-emerald-500" /> {skill}
                          </span>
                        ))}
                      </div>
                    </Section>
                  )}

                  {/* Apply CTA */}
                  {applyUrl && (
                    <button
                      onClick={handleApply}
                      className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-indigo-600/20 flex items-center justify-center gap-3 active:scale-[0.99] transition-all"
                    >
                      <Send className="w-4 h-4" /> Apply for This Role
                    </button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

function Section({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2.5 border-b border-slate-100 dark:border-slate-800 pb-2.5">
        {icon}
        <h3 className="text-sm font-black text-slate-900 dark:text-white tracking-tight uppercase">{title}</h3>
      </div>
      {children}
    </div>
  );
}
