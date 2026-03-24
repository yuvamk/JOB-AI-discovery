'use client';

import { Loader2, Briefcase } from 'lucide-react';
import { useState } from 'react';
import JobCard from './JobCard';
import JobDetailModal from './JobDetailModal';
import type { RankedJob } from '@/lib/types/jobs';

interface Props {
  jobs: RankedJob[];
  savedJobLinks: Set<string>;
  onSave: (job: RankedJob) => void;
  onTailor?: (job: RankedJob) => void;
  loading: boolean;
  searched: boolean;
  newJobCount: number;
}

const SKELETONS = Array.from({ length: 6 });

function SkeletonCard() {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 p-8 space-y-6 animate-pulse">
      <div className="flex items-start gap-5">
        <div className="w-20 h-20 rounded-[1.5rem] bg-slate-100 dark:bg-slate-800 flex-shrink-0" />
        <div className="flex-1 space-y-2 pt-1">
          <div className="h-5 bg-slate-100 dark:bg-slate-800 rounded-lg w-3/4" />
          <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded-lg w-1/2" />
        </div>
      </div>
      <div className="flex gap-2">
        <div className="h-6 w-16 bg-slate-100 dark:bg-slate-800 rounded-lg" />
        <div className="h-6 w-20 bg-slate-100 dark:bg-slate-800 rounded-lg" />
        <div className="h-6 w-14 bg-slate-100 dark:bg-slate-800 rounded-lg" />
      </div>
      <div className="h-16 bg-slate-50 dark:bg-slate-800/50 rounded-3xl" />
      <div className="flex justify-between items-center pt-2">
        <div className="h-4 w-24 bg-slate-100 dark:bg-slate-800 rounded-lg" />
        <div className="h-9 w-24 bg-slate-100 dark:bg-slate-800 rounded-xl" />
      </div>
    </div>
  );
}

export default function JobsGrid({ jobs, savedJobLinks, onSave, onTailor, loading, searched, newJobCount }: Props) {
  const [selectedJob, setSelectedJob] = useState<RankedJob | null>(null);

  if (loading && jobs.length === 0) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {SKELETONS.map((_, i) => <SkeletonCard key={i} />)}
      </div>
    );
  }

  if (searched && jobs.length === 0 && !loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center">
        <div className="w-20 h-20 bg-slate-100 dark:bg-slate-900 rounded-[2rem] flex items-center justify-center mb-6">
          <Briefcase className="w-10 h-10 text-slate-300" />
        </div>
        <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter mb-2">No matches found</h3>
        <p className="text-sm font-bold text-slate-400 max-w-xs">Try a broader role, different location, or fewer platforms.</p>
      </div>
    );
  }

  if (!searched) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center">
        <div className="w-20 h-20 bg-indigo-50 dark:bg-indigo-950/20 rounded-[2rem] flex items-center justify-center mb-6">
          <Briefcase className="w-10 h-10 text-indigo-400" />
        </div>
        <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter mb-2">Start your search</h3>
        <p className="text-sm font-bold text-slate-400 max-w-xs">Enter a role above and click Deep Scan to discover opportunities.</p>
      </div>
    );
  }

  return (
    <div>
      {/* Streaming indicator */}
      {loading && jobs.length > 0 && (
        <div className="flex items-center gap-2 mb-4 text-indigo-600">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span className="text-[10px] font-black uppercase tracking-widest">Loading more results…</span>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {jobs.map((job, idx) => {
          const key = (job as any).id || job.applyUrl || job.apply_link || `${job.title}__${job.companyName || job.company}__${job.source_platform || idx}`;
          const link = job.applyUrl || job.apply_link || '';
          return (
            <JobCard
              key={key}
              job={job}
              isSaved={savedJobLinks.has(link)}
              onSave={onSave}
              onViewDetails={setSelectedJob}
            />
          );
        })}
      </div>

      <JobDetailModal 
        job={selectedJob} 
        isOpen={!!selectedJob}
        onClose={() => setSelectedJob(null)}
        onSave={onSave}
        isSaved={!!selectedJob && savedJobLinks.has(selectedJob.applyUrl || selectedJob.apply_link || '')}
      />

      {jobs.length > 0 && (
        <p className="text-center text-xs text-slate-400 mt-8 font-bold">
          ⚠️ Job data is scraped in real-time. Apply links redirect to original platforms. Showing top {jobs.length} results by AI score.
        </p>
      )}
    </div>
  );
}
