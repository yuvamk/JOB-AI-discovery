'use client';

import { useState, useEffect } from 'react';
import { Building2, Plus, ArrowRight, Settings2 } from 'lucide-react';
import { toast } from 'sonner';

export default function TenantManagement() {
  const [tenants, setTenants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/tenants')
      .then(res => res.json())
      .then(data => {
        setTenants(data.tenants || []);
        setLoading(false);
      });
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
           <h1 className="text-3xl font-black text-white tracking-tighter">Tenant Operations</h1>
           <p className="text-slate-400 font-bold text-sm tracking-wide">Manage multi-tenant workspaces, billing plans, and global settings</p>
        </div>
        <button 
          onClick={() => toast.info('New workspace provisioning is disabled in this demo.')}
          className="px-6 py-3 bg-white text-slate-900 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 shadow-xl hover:scale-105 active:scale-95 transition-all"
        >
           <Plus className="w-4 h-4" /> New Workspace
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         {loading ? (
           <div className="col-span-3 text-center py-12 text-slate-500 font-bold">Loading registered workspace networks...</div>
         ) : tenants.length === 0 ? (
           <div className="col-span-3 text-center py-12 text-slate-500 font-bold">No tenants found in the database.</div>
         ) : tenants.map((tenant: any) => (
            <div key={tenant.id} className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 backdrop-blur-sm group hover:border-indigo-500/30 transition-all">
               <div className="flex items-start justify-between mb-8">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center border border-indigo-500/20">
                     <Building2 className="w-6 h-6" />
                  </div>
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                    tenant.status === 'Active' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'
                  }`}>
                    {tenant.status}
                  </span>
               </div>
               
               <h3 className="text-xl font-black text-white mb-1 group-hover:text-indigo-400 transition-colors">{tenant.name}</h3>
               <div className="flex flex-wrap items-center gap-3 text-xs font-bold text-slate-500 mb-6">
                  <span>{tenant.plan} Plan</span>
                  <span className="w-1 h-1 rounded-full bg-slate-700" />
                  <span>{tenant.users} Users</span>
               </div>
               
               <div className="flex items-center gap-2 pt-4 border-t border-slate-800/50">
                  <button className="flex-1 p-3 bg-slate-800 hover:bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">
                     Manage
                  </button>
                  <button className="p-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-all">
                     <Settings2 className="w-4 h-4" />
                  </button>
               </div>
            </div>
         ))}
      </div>
    </div>
  );
}
