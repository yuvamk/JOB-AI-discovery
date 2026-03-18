'use client';

import { motion } from 'framer-motion';
import { 
  LayoutDashboard, Briefcase, FileText, CheckCircle2, 
  TrendingUp, Clock, Settings, Bell, Sparkles, ChevronRight
} from 'lucide-react';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';

export default function UserDashboard() {
  const { data: session } = useSession();

  const STATS = [
    { label: 'Applications', value: '12', icon: Briefcase, color: 'bg-blue-500' },
    { label: 'Saved Jobs', value: '45', icon: CheckCircle2, color: 'bg-emerald-500' },
    { label: 'Resume Score', value: '85', icon: TrendingUp, color: 'bg-violet-500' },
    { label: 'AI Matches', value: '7', icon: Sparkles, color: 'bg-amber-500' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-6 md:p-10">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              Welcome back, {session?.user?.name?.split(' ')[0] || 'Explorer'}
            </h1>
            <p className="text-slate-500 dark:text-slate-400 font-bold mt-2 uppercase text-xs tracking-widest">
              Your career evolution is 85% optimized.
            </p>
          </div>
          <div className="flex gap-4">
            <button 
              onClick={() => toast.success('You have 2 new AI Matches waiting for you!')}
              className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-blue-500 transition-all shadow-sm relative"
            >
               <Bell className="w-5 h-5" />
               <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-900" />
            </button>
            <button 
              onClick={() => toast.info('Settings preferences are currently locked for this demo tenant.')}
              className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-blue-500 transition-all shadow-sm"
            >
               <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {STATS.map((stat, idx) => (
            <motion.div 
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/40 dark:shadow-none"
            >
              <div className={`w-12 h-12 ${stat.color} rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg shadow-${stat.color.split('-')[1]}-500/20`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <p className="text-sm font-black text-slate-400 uppercase tracking-widest leading-none mb-2">{stat.label}</p>
              <h3 className="text-4xl font-black text-slate-900 dark:text-white leading-none tracking-tighter">{stat.value}</h3>
            </motion.div>
          ))}
        </div>

        {/* Main Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* Recent Activity */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Recent Activity</h2>
              <button className="text-sm font-bold text-blue-600 hover:underline">View All</button>
            </div>
            
            <div className="space-y-4">
              {[1, 2, 3].map((item) => (
                <div key={item} className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-200 dark:border-slate-800 flex items-center gap-6 group hover:scale-[1.01] transition-all cursor-pointer">
                  <div className="w-14 h-14 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center shrink-0">
                    <Briefcase className="w-6 h-6 text-slate-400 group-hover:text-blue-500 transition-colors" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-slate-900 dark:text-white">Applied to Senior AI Engineer</h4>
                    <p className="text-sm text-slate-500">Google · San Francisco · 2 hours ago</p>
                  </div>
                  <div className="px-4 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 text-[10px] font-black tracking-widest uppercase">
                    Interview
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-300" />
                </div>
              ))}
            </div>
          </div>

          {/* AI Career Coaching */}
          <div className="space-y-6">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">AI Insights</h2>
            <div className="bg-gradient-to-br from-indigo-600 to-violet-700 p-8 rounded-[3rem] text-white space-y-6 shadow-2xl shadow-indigo-500/20 relative overflow-hidden">
               <Sparkles className="absolute top-6 right-6 w-12 h-12 opacity-20" />
               <h3 className="text-xl font-black leading-tight">Your Weekly<br />Match Report</h3>
               <p className="text-indigo-100 text-sm font-medium leading-relaxed">
                 "We've found 3 new roles at unicorn startups that match your 'Vibe Coder' preferences. Your resume is already 92% tailored for these positions."
               </p>
               <button className="w-full py-4 bg-white text-indigo-600 rounded-2xl font-black text-sm shadow-xl hover:scale-[1.03] transition-all">
                 View Matches
               </button>
            </div>

            <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 space-y-6">
               <div className="flex items-center gap-3">
                 <FileText className="w-5 h-5 text-blue-500" />
                 <h4 className="font-black text-slate-900 dark:text-white uppercase text-xs tracking-widest">Resume Status</h4>
               </div>
               <div className="space-y-2">
                 <div className="flex justify-between text-xs font-bold uppercase tracking-wider">
                    <span className="text-slate-500">Optimization</span>
                    <span className="text-blue-600">85%</span>
                 </div>
                 <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-600 rounded-full w-[85%]" />
                 </div>
               </div>
               <p className="text-xs text-slate-400 font-bold leading-relaxed">
                 Add 2 more quantitative achievements to reach 95% impact.
               </p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
