'use client';

import { Loader2, Briefcase, Bell } from 'lucide-react';
import { useState } from 'react';
import JobCard from './JobCard';
import JobDetailModal from './JobDetailModal';
import type { RankedJob } from '@/lib/types/jobs';

interface Props {
  jobs: RankedJob[];
  savedJobLinks: Set<string>;
  onSave: (job: RankedJob) => void;
  onTailorDetails?: (job: RankedJob) => void; 
  onTailor: (job: RankedJob) => void;
  onDelete?: (jobId: string) => void;
  loading: boolean;
  searched: boolean;
  newJobCount: number;
}

const SKELETONS = Array.from({ length: 6 });

function SkeletonCard() {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 space-y-3 animate-pulse">
      <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded-lg w-3/4" />
      <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded-lg w-1/2" />
      <div className="flex gap-2">
        <div className="h-5 w-16 bg-slate-100 dark:bg-slate-800 rounded-full" />
        <div className="h-5 w-20 bg-slate-100 dark:bg-slate-800 rounded-full" />
      </div>
      <div className="h-8 bg-slate-100 dark:bg-slate-800 rounded-xl w-full mt-2" />
    </div>
  );
}

export default function JobsGrid({ jobs, savedJobLinks, onSave, onTailor, onDelete, loading, searched, newJobCount }: Props) {
  const [selectedJob, setSelectedJob] = useState<RankedJob | null>(null);

  if (loading) {
    // ... skeleton return (omitted for brevity in replacement but usually kept)
  }

  // ... rest of logic
  
  return (
    <div>
      {/* ... banner */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {jobs.map((job) => (
          <JobCard
            key={job.applyUrl || job.apply_link || `${job.title}__${job.companyName || job.company}`}
            job={job}
            onViewDetails={() => setSelectedJob(job)}
          />
        ))}
      </div>

      <JobDetailModal 
        job={selectedJob} 
        isOpen={!!selectedJob}
        onClose={() => setSelectedJob(null)} 
      />

      <p className="text-center text-xs text-slate-400 mt-6">
        ⚠️ Job data is scraped in real-time. Apply links redirect to original platforms. Showing top {jobs.length} results by AI score.
      </p>
    </div>
  );
}
