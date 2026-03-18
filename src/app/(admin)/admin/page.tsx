'use client';

import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area
} from 'recharts';
import { Users, Briefcase, ServerCrash, DollarSign, TrendingUp, Database } from 'lucide-react';

const DAU_DATA = [
  { name: 'Mon', users: 4000 },
  { name: 'Tue', users: 3000 },
  { name: 'Wed', users: 2000 },
  { name: 'Thu', users: 2780 },
  { name: 'Fri', users: 1890 },
  { name: 'Sat', users: 2390 },
  { name: 'Sun', users: 3490 },
];

const JOB_DATA = [
  { name: 'Mon', jobs: 240 },
  { name: 'Tue', jobs: 139 },
  { name: 'Wed', jobs: 980 },
  { name: 'Thu', jobs: 390 },
  { name: 'Fri', jobs: 480 },
  { name: 'Sat', jobs: 380 },
  { name: 'Sun', jobs: 430 },
];

export default function AdminOverview() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <div className="flex items-center justify-between">
         <div>
            <h1 className="text-3xl font-black text-white tracking-tighter">System Overview</h1>
            <p className="text-slate-400 font-bold text-sm tracking-wide">Real-time platform metrics and health</p>
         </div>
         <div className="flex gap-3">
            <button className="px-4 py-2 bg-slate-900 border border-slate-800 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-colors">
              Last 7 Days
            </button>
            <button className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-500/20">
              Download Report
            </button>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Users" value="12,490" trend="+14%" icon={Users} color="indigo" />
        <StatCard title="Active Jobs" value="48,231" trend="+5%" icon={Briefcase} color="emerald" />
        <StatCard title="MRR" value="$14,290" trend="+22%" icon={DollarSign} color="amber" />
        <StatCard title="Scraper Health" value="98.4%" trend="-1.2%" icon={ServerCrash} color="rose" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
         {/* DAU Chart */}
         <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-8">
               <div>
                  <h3 className="text-lg font-black text-white tracking-tight">Daily Active Users</h3>
                  <p className="text-xs font-bold text-slate-500">Unique visitors per day</p>
               </div>
               <TrendingUp className="w-5 h-5 text-indigo-500" />
            </div>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={DAU_DATA}>
                  <defs>
                    <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '1rem', color: '#fff' }}
                    itemStyle={{ color: '#6366f1', fontWeight: 900 }}
                  />
                  <Area type="monotone" dataKey="users" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorUsers)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
         </div>

         {/* Scraped Jobs Chart */}
         <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-8">
               <div>
                  <h3 className="text-lg font-black text-white tracking-tight">Jobs Indexed</h3>
                  <p className="text-xs font-bold text-slate-500">Jobs scraped automatically</p>
               </div>
               <Database className="w-5 h-5 text-emerald-500" />
            </div>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={JOB_DATA}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '1rem', color: '#fff' }}
                    itemStyle={{ color: '#10b981', fontWeight: 900 }}
                  />
                  <Line type="monotone" dataKey="jobs" stroke="#10b981" strokeWidth={3} dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
         </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, trend, icon: Icon, color }: any) {
  const colors: Record<string, string> = {
    indigo: 'text-indigo-500 bg-indigo-500/10 border-indigo-500/20',
    emerald: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
    amber: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
    rose: 'text-rose-500 bg-rose-500/10 border-rose-500/20',
  };

  const isPositive = trend.startsWith('+');

  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 backdrop-blur-sm hover:bg-slate-900 transition-colors">
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-2xl border ${colors[color]}`}>
          <Icon className="w-5 h-5" />
        </div>
        <div className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full ${isPositive ? 'text-emerald-500 bg-emerald-500/10' : 'text-rose-500 bg-rose-500/10'}`}>
          {trend}
        </div>
      </div>
      <div>
        <h4 className="text-sm font-bold text-slate-400 mb-1">{title}</h4>
        <div className="text-3xl font-black text-white tracking-tighter">{value}</div>
      </div>
    </div>
  );
}
