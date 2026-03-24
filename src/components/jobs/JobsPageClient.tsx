'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, MapPin, Filter, Sparkles,
  LayoutGrid, List as ListIcon,
  Zap, Globe, Square,
  FileText, ChevronDown, ChevronUp,
  Terminal, Database, Loader2, RefreshCw
} from 'lucide-react';
import { toast } from 'sonner';
import JobsGrid from '@/components/jobs/JobsGrid';
import FilterSidebar, { FilterState } from '@/components/jobs/FilterSidebar';
import JobCarousel from '@/components/jobs/JobCarousel';
import AICoachChat from '@/components/jobs/AICoachChat';
import ResumeUploadPanel from '@/components/jobs/ResumeUploadPanel';
import { RankedJob } from '@/lib/types/jobs';
import type { ResumeProfile } from '@/lib/resumeParser';

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
  { id: 'remotive',       label: 'Remotive',          free: true,  emoji: '🌐' },
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

const MOCK_TRENDING: RankedJob[] = [
  { title: 'AI Research Engineer', companyName: 'OpenAI', location: 'San Francisco', total_score: 98, source_platform: 'Direct', job_type: 'Full-time', salary: '$200k - $300k', industry: 'Technology', benefits: 'Equity, Health', match_score: 95 },
  { title: 'Full Stack Developer', companyName: 'Vercel', location: 'Remote', total_score: 95, source_platform: 'Direct', job_type: 'Full-time', salary: '$150k - $220k', industry: 'Technology', benefits: 'Remote, Health', match_score: 92 },
  { title: 'Product Designer', companyName: 'Stripe', location: 'Dublin', total_score: 92, source_platform: 'Direct', job_type: 'Full-time', salary: '$140k - $190k', industry: 'Finance', benefits: 'Health, 401k', match_score: 88 },
  { title: 'Platform Engineer', companyName: 'Cloudflare', location: 'London', total_score: 90, source_platform: 'Direct', job_type: 'Full-time', salary: '£120k - £160k', industry: 'Technology', benefits: 'Equity, Remote', match_score: 85 },
];

export default function JobsPageClient() {
  const [activeTab, setActiveTab] = useState<'search' | 'saved'>('search');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>(INITIAL_FILTERS);
  const [savedJobs, setSavedJobs] = useState<Set<string>>(new Set());
  const [savedJobsList, setSavedJobsList] = useState<RankedJob[]>([]);
  const [trendingJobs] = useState<RankedJob[]>(MOCK_TRENDING);

  // DB-backed saved jobs
  const [dbJobs, setDbJobs] = useState<RankedJob[]>([]);
  const [dbLoading, setDbLoading] = useState(false);

  // Live scraper logs
  const [scraperLogs, setScraperLogs] = useState<{ scraper: string; type: string; message: string; time: string }[]>([]);
  const [showLogs, setShowLogs] = useState(false);

  // Search state
  const [role, setRole] = useState('');
  const [location, setLocation] = useState('Remote');
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(FREE_PLATFORMS);
  const [vibeCoderMode, setVibeCoderMode] = useState(false);
  const [autonomousMode, setAutonomousMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [jobs, setJobs] = useState<RankedJob[]>([]);
  const [searched, setSearched] = useState(false);
  const [progress, setProgress] = useState<string[]>([]);

  // Resume state
  const [resumeProfile, setResumeProfile] = useState<ResumeProfile | null>(null);
  const [resumeText, setResumeText] = useState<string | null>(null);
  const [showResume, setShowResume] = useState(false);

  // Mounted guard — prevents Next.js hydration mismatch
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // Load DB jobs when Saved tab is opened
  const fetchDbJobs = useCallback(async () => {
    setDbLoading(true);
    try {
      const res = await fetch('/api/jobs/list?limit=200');
      const data = await res.json();
      if (data.data) {
        setDbJobs(data.data.map((j: any) => ({
          ...j,
          companyName: j.companyName || j.company || 'Unknown',
          applyUrl: j.application_url || j.source_url,
          apply_link: j.application_url || j.source_url,
          source_platform: j.source || j.source_platform,
          match_score: j.match_score || 70,
        })));
      }
    } catch (e) {
      toast.error('Failed to load saved jobs from database.');
    } finally {
      setDbLoading(false);
    }
  }, []);

  useEffect(() => {
    if (activeTab === 'saved' && mounted) fetchDbJobs();
  }, [activeTab, mounted, fetchDbJobs]);

  // Stop scraper ref
  const readerRef = useRef<ReadableStreamDefaultReader<Uint8Array> | null>(null);


  const handleStopScan = useCallback(() => {
    if (readerRef.current) {
      readerRef.current.cancel();
      readerRef.current = null;
    }
    setLoading(false);
    toast.info('Scan stopped.');
  }, []);

  // Filtered display list
  const displayedJobs = (() => {
    // For saved tab: use DB-fetched jobs; for search tab: use search results
    const list = activeTab === 'search' ? jobs : dbJobs;
    return list.filter(job => {
      if (filters.jobType !== 'All') {
        if (!(job.job_type || '').toLowerCase().includes(filters.jobType.toLowerCase())) return false;
      }
      if (filters.experienceLevel !== 'All') {
        if (!(job.experience_level || '').toLowerCase().includes(filters.experienceLevel.toLowerCase())) return false;
      }
      if (filters.remoteOnly) {
        if (!job.location.toLowerCase().includes('remote')) return false;
      }
      if (filters.platform && filters.platform !== 'All') {
        if (job.source_platform !== filters.platform) return false;
      }
      if (filters.salaryRange !== 'All') {
        const jobMin = job.salary_min || 0;
        const jobMax = job.salary_max || 0;
        if (filters.salaryRange.includes('+')) {
          if (jobMax < 150000 && jobMin < 150000) return false;
        } else {
          const [min, max] = filters.salaryRange.replace('k', '').split('-').map(v => parseInt(v) * 1000 || 0);
          if (jobMin > max || (jobMax < min && jobMax > 0)) return false;
        }
      }
      if (filters.industry !== 'All') {
        if (!job.industry?.toLowerCase().includes(filters.industry.toLowerCase())) return false;
      }
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
    if (!role.trim()) { toast.error('Please enter a role to search.'); return; }
    setActiveTab('search');
    setLoading(true);
    setSearched(true);
    setJobs([]);
    setScraperLogs([]);
    setShowLogs(true);
    setProgress(['Initializing Deep Scan...']);

    try {
      const params = new URLSearchParams({
        role,
        location,
        platforms: selectedPlatforms.join(','),
        vibeCoderMode: vibeCoderMode.toString(),
        autonomous: autonomousMode.toString(),
        ...(resumeText ? { resumeText: resumeText.slice(0, 2000) } : {}),
      });

      const response = await fetch(`/api/jobs/stream?${params.toString()}`);
      if (!response.body) throw new Error('No response body');

      const reader = response.body.getReader();
      readerRef.current = reader;
      const decoder = new TextDecoder();

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        for (const line of chunk.split('\n')) {
          if (!line.startsWith('data: ')) continue;
          try {
            const data = JSON.parse(line.slice(6));
            if (data.type === 'progress') {
              setProgress(prev => [...prev.slice(-4), data.message]);
            } else if (data.type === 'log') {
              // Live per-scraper log event
              setScraperLogs(prev => [
                ...prev.slice(-49),
                { scraper: data.scraper, type: data.logType, message: data.message, time: new Date().toLocaleTimeString() }
              ]);
            } else if (data.type === 'jobs') {
              // Deduplicate cumulative results by source_url or title+company
              const seen = new Set();
              const unique = data.jobs.filter((j: any) => {
                const key = j.applyUrl || j.apply_link || `${j.title}__${j.companyName || j.company}`;
                if (seen.has(key)) return false;
                seen.add(key);
                return true;
              });
              setJobs(unique);
            } else if (data.type === 'error') {
              toast.error(data.message);
            }
          } catch { /* partial chunk */ }
        }
      }
    } catch (error: any) {
      if (error?.name !== 'AbortError' && !error?.message?.includes('cancel')) {
        console.error('Search failed:', error);
        toast.error('Scan failed. Please try again.');
      }
    } finally {
      readerRef.current = null;
      setLoading(false);
    }
  };

  const handleExportCSV = () => {
    if (savedJobsList.length === 0) return;
    const headers = ['Title', 'Company', 'Location', 'Source', 'Posted', 'Match Score', 'Apply Link'];
    const rows = savedJobsList.map(j => [
      `"${j.title}"`, `"${j.companyName || j.company}"`, `"${j.location}"`,
      `"${j.source_platform || 'Direct'}"`, `"${j.posted_date || 'Recently'}"`,
      j.match_score || j.total_score || 0, `"${j.applyUrl || j.apply_link}"`
    ]);
    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `jobs-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('CSV Exported!');
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto animate-pulse">
          <div className="h-20 bg-slate-100 dark:bg-slate-900 rounded-3xl w-1/2 mb-8" />
          <div className="h-16 bg-slate-100 dark:bg-slate-900 rounded-3xl mb-4" />
          <div className="grid grid-cols-2 gap-6 mt-12">
            {[1,2,3,4].map(i => <div key={i} className="h-64 bg-slate-100 dark:bg-slate-900 rounded-3xl" />)}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-32 pb-20 px-6" suppressHydrationWarning>
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
          <div className="space-y-3 max-w-2xl">
            <div className="flex items-center gap-2 text-indigo-600 font-black uppercase tracking-[0.2em] text-[10px]">
              <Globe className="w-3.5 h-3.5" />
              <span>Scanning 50+ Global Sources</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-slate-900 dark:text-white tracking-tighter leading-[0.85]">
              DISCOVER YOUR<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">NEXT EVOLUTION.</span>
            </h1>
          </div>

          <div className="flex flex-col items-end gap-4">
            <div className="flex bg-slate-100 dark:bg-slate-900 p-1.5 rounded-[2rem] border border-slate-200 dark:border-slate-800">
              <button onClick={() => setActiveTab('search')} className={`px-8 py-3 rounded-[1.5rem] font-black text-[10px] uppercase tracking-widest transition-all ${activeTab === 'search' ? 'bg-white dark:bg-slate-800 text-indigo-600 shadow-xl' : 'text-slate-400'}`}>AI Search</button>
              <button onClick={() => setActiveTab('saved')} className={`px-8 py-3 rounded-[1.5rem] font-black text-[10px] uppercase tracking-widest transition-all relative ${activeTab === 'saved' ? 'bg-white dark:bg-slate-800 text-indigo-600 shadow-xl' : 'text-slate-400'}`}>
                Saved {savedJobsList.length > 0 && <span className="absolute -top-1 -right-1 w-4 h-4 bg-indigo-600 text-white rounded-full flex items-center justify-center text-[8px]">{savedJobsList.length}</span>}
              </button>
            </div>

            <div className="flex items-center gap-2">
              {activeTab === 'saved' && (
                <button onClick={handleExportCSV} disabled={savedJobsList.length === 0} className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all disabled:opacity-50">
                  Export CSV
                </button>
              )}
              <button onClick={() => setViewMode(v => v === 'grid' ? 'list' : 'grid')} className="p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-400 hover:text-indigo-600 transition-colors">
                {viewMode === 'grid' ? <ListIcon className="w-4 h-4" /> : <LayoutGrid className="w-4 h-4" />}
              </button>
              <button onClick={() => setIsFilterOpen(!isFilterOpen)} className="px-5 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 shadow-xl shadow-slate-900/10">
                <Filter className="w-4 h-4" /> Filters
              </button>
            </div>
          </div>
        </div>

        {/* Trending Carousels (empty state) */}
        {activeTab === 'search' && jobs.length === 0 && !searched && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-16">
            <JobCarousel title="Trending Evolutions" subtitle="Global Impact Roles" icon="trending" jobs={trendingJobs} onSave={handleSaveJob} onViewDetails={() => {}} savedJobLinks={savedJobs} />
            <JobCarousel title="Recommended for You" subtitle="AI-matched opportunities" icon="sparkles" jobs={trendingJobs.slice().reverse()} onSave={handleSaveJob} onViewDetails={() => {}} savedJobLinks={savedJobs} />
          </motion.div>
        )}

        {/* Search Panel */}
        {activeTab === 'search' && (
          <div className="mb-10 space-y-6">

              {/* Resume Upload Toggle */}
              <div>
                <button
                  onClick={() => setShowResume(!showResume)}
                  className={`flex items-center gap-2.5 px-5 py-3 rounded-2xl border font-black text-xs uppercase tracking-widest transition-all ${resumeProfile ? 'bg-violet-600 border-violet-600 text-white shadow-lg shadow-violet-600/20' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-500 hover:border-violet-400'}`}
                >
                  <FileText className="w-4 h-4" />
                  {resumeProfile ? `✓ Resume Loaded — ${resumeProfile.name || 'Profile Active'}` : 'Upload Resume for AI Match'}
                  {showResume ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>

                <AnimatePresence>
                  {showResume && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden mt-4"
                    >
                      <ResumeUploadPanel
                        profile={resumeProfile}
                        onProfileChange={(p) => {
                          setResumeProfile(p);
                          if (p) toast.success('Resume analysed! AI will personalise your job matches.');
                        }}
                        onResumeTextChange={setResumeText}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Main Search Bar */}
              <div className="relative group">
                <div className="absolute inset-0 bg-indigo-500/10 blur-[60px] opacity-0 group-hover:opacity-100 transition-opacity rounded-[3rem]" />
                <div className="relative p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[3rem] shadow-2xl flex flex-col md:flex-row items-stretch md:items-center gap-0">
                  <div className="flex-1 flex items-center px-8 py-4 md:py-0">
                    <Search className="w-5 h-5 text-slate-400 mr-4 flex-shrink-0" />
                    <input
                      type="text"
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && !loading && handleSearch()}
                      placeholder="Role, keywords, or company..."
                      className="w-full bg-transparent border-none outline-none text-slate-900 dark:text-white font-black text-lg placeholder:text-slate-400"
                    />
                  </div>
                  <div className="h-px md:h-10 md:w-px bg-slate-100 dark:bg-slate-800 mx-0 md:mx-2" />
                  <div className="flex items-center px-8 py-4 md:py-0">
                    <MapPin className="w-5 h-5 text-slate-400 mr-3 flex-shrink-0" />
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && !loading && handleSearch()}
                      placeholder="Location or Remote"
                      className="bg-transparent border-none outline-none font-bold text-slate-600 dark:text-slate-300 placeholder:text-slate-400 w-40"
                    />
                  </div>
                  {loading ? (
                    <button
                      onClick={handleStopScan}
                      className="px-8 py-5 bg-red-500 hover:bg-red-600 text-white rounded-[2.5rem] font-black uppercase tracking-widest text-sm shadow-xl shadow-red-500/20 active:scale-95 transition-all flex items-center gap-2"
                    >
                      <Square className="w-4 h-4 fill-current" /> Stop
                    </button>
                  ) : (
                    <button
                      onClick={handleSearch}
                      disabled={!role.trim()}
                      className="px-8 py-5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-[2.5rem] font-black uppercase tracking-widest text-sm shadow-xl shadow-indigo-600/20 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Deep Scan
                    </button>
                  )}
                </div>

                {/* Progress text */}
                <AnimatePresence>
                  {loading && progress.length > 0 && (
                    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="absolute -bottom-8 left-10 flex items-center gap-2">
                      <Sparkles className="w-3 h-3 text-indigo-500 animate-pulse" />
                      <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600/70">{progress[progress.length - 1]}</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Live Scraper Log Panel */}
              <AnimatePresence>
                {showLogs && scraperLogs.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="bg-slate-900 dark:bg-black rounded-3xl border border-slate-700 dark:border-slate-800 overflow-hidden">
                      <div className="flex items-center justify-between px-5 py-3 border-b border-slate-700 dark:border-slate-800">
                        <div className="flex items-center gap-2">
                          <Terminal className="w-4 h-4 text-emerald-400" />
                          <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Live Scraper Activity</span>
                          {loading && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />}
                        </div>
                        <button onClick={() => setShowLogs(false)} className="text-slate-500 hover:text-slate-300 text-[10px] font-bold uppercase tracking-widest">Hide</button>
                      </div>
                      <div className="p-4 space-y-1.5 max-h-48 overflow-y-auto font-mono">
                        {scraperLogs.map((log, i) => (
                          <div key={i} className="flex items-start gap-3 text-xs">
                            <span className="text-slate-500 flex-shrink-0">{log.time}</span>
                            <span className={`flex-shrink-0 px-1.5 py-0.5 rounded text-[9px] font-black uppercase ${
                              log.type === 'done' ? 'bg-emerald-900 text-emerald-400' :
                              log.type === 'found' ? 'bg-blue-900 text-blue-400' :
                              log.type === 'error' ? 'bg-red-900 text-red-400' :
                              'bg-slate-800 text-slate-400'
                            }`}>{log.type}</span>
                            <span className="text-slate-300 leading-snug">{log.message}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Platform Picker & Options */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pt-4">
                <div className="md:col-span-3 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Target Platforms</h3>
                    <div className="flex gap-4">
                      <button onClick={() => setSelectedPlatforms(PLATFORMS.map(p => p.id))} className="text-[10px] font-bold text-indigo-600 hover:text-indigo-700 uppercase tracking-widest">All</button>
                      <button onClick={() => setSelectedPlatforms(FREE_PLATFORMS)} className="text-[10px] font-bold text-slate-400 hover:text-slate-500 uppercase tracking-widest">Free Only</button>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {PLATFORMS.map((p) => (
                      <button key={p.id} onClick={() => setSelectedPlatforms(prev => prev.includes(p.id) ? prev.filter(id => id !== p.id) : [...prev, p.id])}
                        className={`px-3 py-1.5 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all ${selectedPlatforms.includes(p.id) ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-400 hover:border-indigo-400'}`}>
                        <span className="mr-1.5">{p.emoji}</span>{p.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Intelligence</h3>
                  <div className="space-y-2">
                    <button onClick={() => setAutonomousMode(!autonomousMode)} className={`w-full flex items-center justify-between p-3.5 rounded-2xl border transition-all text-left ${autonomousMode ? 'bg-amber-500 border-amber-500 text-white shadow-lg shadow-amber-500/20' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-400'}`}>
                      <div className="flex items-center gap-2">
                        <Globe className="w-4 h-4" />
                        <div>
                          <div className="text-[10px] font-black uppercase tracking-wider">Autonomous</div>
                          <div className="text-[8px] font-bold uppercase opacity-70">ECC Wave Search</div>
                        </div>
                      </div>
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${autonomousMode ? 'border-white' : 'border-slate-300'}`}>{autonomousMode && <div className="w-2 h-2 rounded-full bg-white" />}</div>
                    </button>
                    <button onClick={() => setVibeCoderMode(!vibeCoderMode)} className={`w-full flex items-center justify-between p-3.5 rounded-2xl border transition-all text-left ${vibeCoderMode ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-400'}`}>
                      <div className="flex items-center gap-2">
                        <Zap className="w-4 h-4" />
                        <div>
                          <div className="text-[10px] font-black uppercase tracking-wider">Vibe Coder</div>
                          <div className="text-[8px] font-bold uppercase opacity-70">AI & LLM Jobs Only</div>
                        </div>
                      </div>
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${vibeCoderMode ? 'border-white' : 'border-slate-300'}`}>{vibeCoderMode && <div className="w-2 h-2 rounded-full bg-white" />}</div>
                    </button>
                  </div>
                </div>
              </div>
          </div>
        )}

        {/* Results Area */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <AnimatePresence>
            {isFilterOpen && (
              <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="lg:col-span-1">
                <FilterSidebar filters={filters} onChange={setFilters} autoRefresh={false} onAutoRefreshToggle={() => {}} jobCount={displayedJobs.length} />
              </motion.div>
            )}
          </AnimatePresence>

          <div className={isFilterOpen ? 'lg:col-span-3' : 'lg:col-span-4'}>
            <div className="flex items-center gap-4 mb-6">
              {activeTab === 'saved' ? (
                <>
                  <div className="flex items-center gap-2">
                    <Database className="w-4 h-4 text-indigo-500" />
                    <span className="text-xs font-black text-slate-400 uppercase tracking-widest">
                      {dbLoading ? 'Loading from database…' : `${displayedJobs.length.toLocaleString()} Jobs in Database`}
                    </span>
                    {dbLoading && <Loader2 className="w-3 h-3 text-indigo-500 animate-spin" />}
                  </div>
                  <button onClick={fetchDbJobs} disabled={dbLoading} className="flex items-center gap-1 text-[10px] font-bold text-indigo-600 hover:text-indigo-700 uppercase tracking-widest disabled:opacity-50">
                    <RefreshCw className="w-3 h-3" /> Refresh
                  </button>
                </>
              ) : (
                <span className="text-xs font-black text-slate-400 uppercase tracking-widest">
                  {loading
                    ? `Scanning… ${jobs.length > 0 ? `${jobs.length} found so far` : ''}`
                    : searched
                    ? `${displayedJobs.length.toLocaleString()} Results`
                    : 'Ready to scan'}
                </span>
              )}
              <div className="h-px flex-1 bg-slate-100 dark:bg-slate-800" />
            </div>

            <JobsGrid
              jobs={displayedJobs}
              savedJobLinks={savedJobs}
              onSave={handleSaveJob}
              loading={activeTab === 'saved' ? dbLoading : loading}
              searched={searched || activeTab === 'saved'}
              newJobCount={0}
            />
          </div>
        </div>
      </div>

      <AICoachChat />
    </div>
  );
}
