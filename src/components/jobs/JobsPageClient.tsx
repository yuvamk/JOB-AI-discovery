'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, SlidersHorizontal, MapPin, 
  Briefcase, DollarSign, Filter, Sparkles,
  ChevronDown, LayoutGrid, List as ListIcon,
  Zap, ArrowRight, ShieldCheck, Clock, Globe, RefreshCw
} from 'lucide-react';
import { toast } from 'sonner';
import JobsGrid from '@/components/jobs/JobsGrid';
import FilterSidebar, { FilterState } from '@/components/jobs/FilterSidebar';
import JobCarousel from '@/components/jobs/JobCarousel';
import AICoachChat from '@/components/jobs/AICoachChat';
import { RankedJob } from '@/lib/types/jobs';

const INITIAL_FILTERS: FilterState = {
  sortBy: 'best_match',
  jobType: 'All',
  experienceLevel: 'All',
  platform: 'All',
  remoteOnly: false,
  category: '',
  dateFrom: '',
  dateTo: '',
  salaryRange: 'All',
  industry: 'All',
  benefits: [],
};

const PLATFORMS = [
  { id: 'remotive',       label: 'Remotive',           free: true,  emoji: '🌐' },
  { id: 'remoteok',       label: 'RemoteOK',           free: true,  emoji: '🏠' },
  { id: 'jobicy',         label: 'Jobicy',             free: true,  emoji: '🎯' },
  { id: 'arbeitnow',      label: 'Arbeitnow',          free: true,  emoji: '🇪🇺' },
  { id: 'weworkremotely', label: 'We Work Remotely',   free: true,  emoji: '💼' },
  { id: 'themuse',        label: 'The Muse',           free: true,  emoji: '🎨' },
  { id: 'hn',             label: 'HN Hiring',          free: true,  emoji: '🟠' },
  { id: 'findwork',       label: 'Findwork.dev',       free: true,  emoji: '🔍' },
  { id: 'adzuna',         label: 'Adzuna',             free: false, emoji: '📋' },
  { id: 'jsearch',        label: 'LinkedIn / Indeed',  free: false, emoji: '💎' },
  { id: 'google',         label: 'Google Search',      free: true,  emoji: '🔍' },
];

const FREE_PLATFORMS = PLATFORMS.filter(p => p.free).map(p => p.id);

export default function JobsPageClient() {
  const [activeTab, setActiveTab] = useState<'search' | 'saved'>('search');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>(INITIAL_FILTERS);
  const [savedJobs, setSavedJobs] = useState<Set<string>>(new Set());
  const [savedJobsList, setSavedJobsList] = useState<RankedJob[]>([]);
  
  const MOCK_TRENDING: RankedJob[] = [
    { title: 'AI Research Engineer', companyName: 'OpenAI', location: 'San Francisco', total_score: 98, source_platform: 'Direct', job_type: 'Full-time', salary: '$200k - $300k', industry: 'Technology', benefits: 'Equity, Health', match_score: 95 },
    { title: 'Full Stack Developer', companyName: 'Vercel', location: 'Remote', total_score: 95, source_platform: 'Direct', job_type: 'Full-time', salary: '$150k - $220k', industry: 'Technology', benefits: 'Remote, Health', match_score: 92 },
    { title: 'Product Designer', companyName: 'Stripe', location: 'Dublin', total_score: 92, source_platform: 'Direct', job_type: 'Full-time', salary: '$140k - $190k', industry: 'Finance', benefits: 'Health, 401k', match_score: 88 },
    { title: 'Platform Engineer', companyName: 'Cloudflare', location: 'London', total_score: 90, source_platform: 'Direct', job_type: 'Full-time', salary: '£120k - £160k', industry: 'Technology', benefits: 'Equity, Remote', match_score: 85 },
  ];
  const [trendingJobs] = useState<RankedJob[]>(MOCK_TRENDING);
  
  // Search State
  const [role, setRole] = useState('');
  const [location, setLocation] = useState('Remote');
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(FREE_PLATFORMS);
  const [vibeCoderMode, setVibeCoderMode] = useState(false);
  const [autonomousMode, setAutonomousMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [jobs, setJobs] = useState<RankedJob[]>([]);
  const [progress, setProgress] = useState<string[]>([]);
  const [selectedJob, setSelectedJob] = useState<RankedJob | null>(null);


  // Re-calculate filtered jobs when deps change
  const displayedJobs = (() => {
    const list = activeTab === 'search' ? jobs : savedJobsList;
    return list.filter(job => {
      // Job Type Filter
      if (filters.jobType !== 'All') {
        const type = (job.job_type || '').toLowerCase();
        if (!type.includes(filters.jobType.toLowerCase())) return false;
      }
      
      // Experience Level Filter
      if (filters.experienceLevel !== 'All') {
        const exp = (job.experience_level || '').toLowerCase();
        if (!exp.includes(filters.experienceLevel.toLowerCase())) return false;
      }
      
      // Remote Only
      if (filters.remoteOnly) {
        if (!job.location.toLowerCase().includes('remote')) return false;
      }
      
      // Platform
      if (filters.platform && filters.platform !== 'All') {
        if (job.source_platform !== filters.platform) return false;
      }

      // Salary Range Filter
      if (filters.salaryRange !== 'All') {
        const [min, max] = filters.salaryRange.replace('k', '').split('-').map(v => parseInt(v) * 1000 || (v.includes('+') ? 200000 : 0));
        const jobMin = job.salary_min || 0;
        const jobMax = job.salary_max || 0;
        if (filters.salaryRange.includes('+')) {
           if (jobMax < 150000 && jobMin < 150000) return false;
        } else {
           if (jobMin > max || (jobMax < min && jobMax > 0)) return false;
        }
      }

      // Industry Filter
      if (filters.industry !== 'All') {
        if (!job.industry?.toLowerCase().includes(filters.industry.toLowerCase())) return false;
      }

      // Benefits Filter
      if (filters.benefits.length > 0) {
        const jobBenefits = (job.benefits || '').toLowerCase();
        if (!filters.benefits.some(b => jobBenefits.includes(b.toLowerCase()))) return false;
      }

      return true;
    });
  })();

  const handleSaveJob = (job: RankedJob) => {
    const link = job.applyUrl || job.apply_link;
    if (!link) return;

    setSavedJobs(prev => {
      const next = new Set(prev);
      if (next.has(link)) {
        next.delete(link);
        setSavedJobsList(list => list.filter(j => (j.applyUrl || j.apply_link) !== link));
        toast.info('Job removed from saved list');
      } else {
        next.add(link);
        setSavedJobsList(list => [job, ...list]);
        toast.success('Job saved to library');
      }
      return next;
    });
  };

  const handleSearch = async () => {
    if (!role.trim()) return;
    setActiveTab('search');
    setLoading(true);
    setJobs([]);
    setProgress(['Initializing Deep Scan...']);
    
    try {
      const params = new URLSearchParams({
        role,
        location,
        platforms: selectedPlatforms.join(','),
        vibeCoderMode: vibeCoderMode.toString(),
        autonomous: autonomousMode.toString()
      });

      const response = await fetch(`/api/jobs/stream?${params.toString()}`);
      if (!response.body) throw new Error('No response body');

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));
              if (data.type === 'progress') {
                setProgress(prev => [...prev.slice(-3), data.message]);
              } else if (data.type === 'jobs') {
                setJobs(data.jobs);
              } else if (data.type === 'error') {
                toast.error(data.message);
              }
            } catch (e) {
              console.error('Error parsing SSE:', e);
            }
          }
        }
      }
    } catch (error) {
      console.error('Search failed:', error);
      toast.error('Deep Scan failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleExportCSV = () => {
    if (savedJobsList.length === 0) return;
    const headers = ['Title', 'Company', 'Location', 'Source', 'Posted', 'Match Score', 'Apply Link'];
    const rows = savedJobsList.map(j => [
      `"${j.title}"`,
      `"${j.companyName || j.company}"`,
      `"${j.location}"`,
      `"${j.source_platform || 'Direct'}"`,
      `"${j.posted_date || 'Recently'}"`,
      j.match_score || j.total_score || 0,
      `"${j.applyUrl || j.apply_link}"`
    ]);
    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `kinetic-saved-jobs-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('CSV Exported successfully');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div className="space-y-4 max-w-2xl">
            <div className="flex items-center gap-2 text-indigo-600 font-black uppercase tracking-[0.2em] text-[10px]">
              <Globe className="w-3.5 h-3.5" />
              <span>Scanning 50+ Global Direct Sources</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-slate-900 dark:text-white tracking-tighter leading-[0.85]">
              DISCOVER YOUR<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">NEXT EVOLUTION.</span>
            </h1>
          </div>

          <div className="flex flex-col items-end gap-6">
             <div className="flex bg-slate-100 dark:bg-slate-900 p-1.5 rounded-[2rem] border border-slate-200 dark:border-slate-800">
                <button 
                  onClick={() => setActiveTab('search')}
                  className={`px-8 py-3 rounded-[1.5rem] font-black text-[10px] uppercase tracking-widest transition-all ${
                    activeTab === 'search' ? 'bg-white dark:bg-slate-800 text-indigo-600 shadow-xl' : 'text-slate-400'
                  }`}
                >
                  AI Search
                </button>
                <button 
                  onClick={() => setActiveTab('saved')}
                  className={`px-8 py-3 rounded-[1.5rem] font-black text-[10px] uppercase tracking-widest transition-all relative ${
                    activeTab === 'saved' ? 'bg-white dark:bg-slate-800 text-indigo-600 shadow-xl' : 'text-slate-400'
                  }`}
                >
                  Saved {savedJobsList.length > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-indigo-600 text-white rounded-full flex items-center justify-center text-[8px]">
                      {savedJobsList.length}
                    </span>
                  )}
                </button>
             </div>

             <div className="flex items-center gap-3">
                {activeTab === 'saved' && (
                  <button 
                    onClick={handleExportCSV}
                    disabled={savedJobsList.length === 0}
                    className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 transition-all disabled:opacity-50"
                  >
                    Export CSV
                  </button>
                )}
                <button 
                  onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                  className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-400 hover:text-indigo-600 transition-colors"
                >
                  {viewMode === 'grid' ? <ListIcon className="w-5 h-5" /> : <LayoutGrid className="w-5 h-5" />}
                </button>
                <button 
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                  className="px-6 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 shadow-xl shadow-slate-900/10"
                >
                  <Filter className="w-4 h-4" /> Filters
                </button>
             </div>
          </div>
        </div>

        {/* Discovery Carousels */}
        {activeTab === 'search' && jobs.length === 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-20">
             <JobCarousel 
               title="Trending Evolutions" 
               subtitle="Global Impact Roles" 
               icon="trending" 
               jobs={trendingJobs}
               onSave={handleSaveJob}
               onViewDetails={setSelectedJob}
               savedJobLinks={savedJobs}
             />
             
             <JobCarousel 
               title="Recommended for You" 
               subtitle="AI Matched specifically for you" 
               icon="sparkles" 
               jobs={trendingJobs.slice().reverse()} 
               onSave={handleSaveJob}
               onViewDetails={setSelectedJob}
               savedJobLinks={savedJobs}
             />
          </motion.div>
        )}

        {/* Search Panel & Options - Only show in Search tab */}
        <AnimatePresence>
          {activeTab === 'search' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="mb-12 relative group">
                <div className="absolute inset-0 bg-indigo-500/10 blur-[60px] opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[3rem] shadow-2xl flex flex-col md:flex-row items-stretch md:items-center">
                  <div className="flex-1 flex items-center px-8 py-5 md:py-0">
                    <Search className="w-6 h-6 text-slate-400 mr-4" />
                    <input 
                      type="text" 
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                      placeholder="Search by keywords, role, or company..."
                      className="w-full bg-transparent border-none outline-none text-slate-900 dark:text-white font-black text-lg placeholder:text-slate-400"
                    />
                  </div>
                  <div className="h-10 w-[1px] bg-slate-100 dark:bg-slate-800 hidden md:block mx-2" />
                  <div className="flex items-center px-8 py-5 md:py-0">
                    <MapPin className="w-5 h-5 text-slate-400 mr-3" />
                    <input 
                      type="text" 
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                      placeholder="Location (Bangalore, Remote...)"
                      className="bg-transparent border-none outline-none font-bold text-slate-600 dark:text-slate-300 placeholder:text-slate-400"
                    />
                  </div>
                  <button 
                    onClick={handleSearch}
                    disabled={loading || !role.trim()}
                    className="px-10 py-5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-[2.5rem] font-black uppercase tracking-widest text-sm shadow-xl shadow-indigo-600/20 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? <RefreshCw className="w-5 h-5 animate-spin mx-auto" /> : 'Deep Scan'}
                  </button>
                </div>
                
                <AnimatePresence>
                  {loading && progress.length > 0 && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute -bottom-10 left-12 right-12 flex items-center justify-center gap-2"
                    >
                      <Sparkles className="w-3 h-3 text-indigo-500 animate-pulse" />
                      <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600/60 transition-all duration-500">
                        {progress[progress.length - 1]}
                      </span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="mb-16">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                  <div className="md:col-span-3 space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Target Platforms</h3>
                      <div className="flex gap-4">
                        <button onClick={() => setSelectedPlatforms(PLATFORMS.map(p => p.id))} className="text-[10px] font-bold text-indigo-600 hover:text-indigo-700 uppercase tracking-widest">Select All</button>
                        <button onClick={() => setSelectedPlatforms(FREE_PLATFORMS)} className="text-[10px] font-bold text-slate-400 hover:text-slate-500 uppercase tracking-widest">Free Only</button>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {PLATFORMS.map((p) => (
                        <button key={p.id} onClick={() => setSelectedPlatforms(prev => prev.includes(p.id) ? prev.filter(id => id !== p.id) : [...prev, p.id])}
                          className={`px-4 py-2 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all ${selectedPlatforms.includes(p.id) ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-400 hover:border-indigo-400'}`}>
                          <span className="mr-2">{p.emoji}</span> {p.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                     <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Search Intelligence</h3>
                     <div className="space-y-2">
                        <button onClick={() => setAutonomousMode(!autonomousMode)} className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all ${autonomousMode ? 'bg-amber-500 border-amber-500 text-white shadow-lg shadow-amber-500/20' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-400'}`}>
                          <div className="flex items-center gap-3">
                            <Globe className={`w-4 h-4 ${autonomousMode ? 'text-white' : 'text-slate-400'}`} />
                            <div className="text-left">
                              <div className="text-[10px] font-black uppercase tracking-wider">Autonomous</div>
                              <div className={`text-[8px] font-bold uppercase ${autonomousMode ? 'text-white/70' : 'text-slate-400'}`}>ECC Wave Search</div>
                            </div>
                          </div>
                          <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${autonomousMode ? 'border-white' : 'border-slate-200'}`}>{autonomousMode && <div className="w-2 h-2 rounded-full bg-white" />}</div>
                        </button>
                        <button onClick={() => setVibeCoderMode(!vibeCoderMode)} className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all ${vibeCoderMode ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-400'}`}>
                          <div className="flex items-center gap-3">
                            <Zap className={`w-4 h-4 ${vibeCoderMode ? 'text-white' : 'text-slate-400'}`} />
                            <div className="text-left">
                              <div className="text-[10px] font-black uppercase tracking-wider">Vibe Coder</div>
                              <div className={`text-[8px] font-bold uppercase ${vibeCoderMode ? 'text-white/70' : 'text-slate-400'}`}>AI & LLM Jobs Only</div>
                            </div>
                          </div>
                          <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${vibeCoderMode ? 'border-white' : 'border-slate-200'}`}>{vibeCoderMode && <div className="w-2 h-2 rounded-full bg-white" />}</div>
                        </button>
                     </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10 sticky top-32">
          {/* Active Filters Sidebar */}
          <AnimatePresence>
            {isFilterOpen && (
              <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} className="lg:col-span-1">
                <FilterSidebar 
                  filters={filters} 
                  onChange={setFilters} 
                  autoRefresh={false} 
                  onAutoRefreshToggle={() => {}} 
                  jobCount={displayedJobs.length} 
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Job Results */}
          <div className={isFilterOpen ? 'lg:col-span-3' : 'lg:col-span-4'}>
             <div className="flex items-center gap-4 mb-8">
                <span className="text-xs font-black text-slate-400 uppercase tracking-widest">
                  {activeTab === 'search' 
                    ? (loading ? 'Scanning Global Sources...' : `Showing ${displayedJobs.length.toLocaleString()} Matches Found Globally`)
                    : `Your Library: ${displayedJobs.length.toLocaleString()} saved opportunities`}
                </span>
                <div className="h-[1px] flex-1 bg-slate-100 dark:bg-slate-800" />
             </div>

             <JobsGrid 
               jobs={displayedJobs} 
               savedJobLinks={savedJobs} 
               onSave={handleSaveJob} 
               onTailor={() => toast.info('Resume tailoring coming soon!')} 
               loading={loading}
               searched={activeTab === 'search' ? jobs.length > 0 : true}
               newJobCount={0}
             />
          </div>
        </div>
      </div>
      <AICoachChat />
    </div>
  );
}

function Badge({ label, active }: { label: string; active?: boolean }) {
  return (
    <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer ${
      active 
        ? 'bg-indigo-600 text-white' 
        : 'bg-slate-100 dark:bg-slate-900 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-800'
    }`}>
      {label}
    </div>
  );
}
