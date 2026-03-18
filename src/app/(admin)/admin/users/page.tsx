'use client';

import { useState, useEffect } from 'react';
import { 
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState
} from '@tanstack/react-table';
import { Shield, ShieldAlert, MoreHorizontal, User, Mail, Calendar, Search } from 'lucide-react';
import { format } from 'date-fns';

type UserData = {
  id: string;
  name: string | null;
  email: string;
  role: string;
  createdAt: string;
  profileComplete: boolean;
};

const columnHelper = createColumnHelper<UserData>();

const columns = [
  columnHelper.accessor('name', {
    header: 'User',
    cell: info => (
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700">
           <User className="w-4 h-4 text-slate-400" />
        </div>
        <div>
          <div className="font-bold text-white text-sm">{info.getValue() || 'Unnamed User'}</div>
          <div className="flex items-center gap-1 text-[10px] uppercase font-black tracking-widest text-slate-500">
             <Mail className="w-3 h-3" /> {info.row.original.email}
          </div>
        </div>
      </div>
    ),
  }),
  columnHelper.accessor('role', {
    header: 'Role / Access',
    cell: info => {
      const role = info.getValue();
      const isAdmin = role === 'ADMIN' || role === 'SUPER_ADMIN';
      return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
          isAdmin ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' : 'bg-slate-800 text-slate-400'
        }`}>
          {isAdmin ? <ShieldAlert className="w-3 h-3" /> : <Shield className="w-3 h-3" />}
          {role.replace('_', ' ')}
        </span>
      );
    },
  }),
  columnHelper.accessor('profileComplete', {
    header: 'Status',
    cell: info => (
      <span className={`inline-flex px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-widest ${
        info.getValue() ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'
      }`}>
        {info.getValue() ? 'Complete' : 'Pending Detail'}
      </span>
    ),
  }),
  columnHelper.accessor('createdAt', {
    header: 'Joined',
    cell: info => (
      <div className="flex items-center gap-1.5 text-xs font-medium text-slate-400">
        <Calendar className="w-3.5 h-3.5 text-slate-500" />
        {format(new Date(info.getValue()), 'MMM d, yyyy')}
      </div>
    ),
  }),
  columnHelper.display({
    id: 'actions',
    cell: () => (
      <button className="p-2 hover:bg-slate-800 rounded-lg text-slate-500 hover:text-white transition-colors">
        <MoreHorizontal className="w-4 h-4" />
      </button>
    )
  })
];

export default function UserManagement() {
  const [data, setData] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState('');

  useEffect(() => {
    // Fetch users (Mocking for now as we build out the full API in a separate step or just rely on Prisma via Server Actions)
    fetch('/api/admin/users')
      .then(res => res.json())
      .then(d => {
        setData(d.users || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const table = useReactTable({
    data,
    columns,
    state: { sorting, globalFilter },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
           <h1 className="text-3xl font-black text-white tracking-tighter">User Management</h1>
           <p className="text-slate-400 font-bold text-sm tracking-wide">Monitor and manage {data.length} registered accounts</p>
        </div>
        <div className="relative">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            value={globalFilter ?? ''}
            onChange={e => setGlobalFilter(e.target.value)}
            className="pl-10 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-sm font-bold text-white placeholder:text-slate-500 focus:ring-2 focus:ring-indigo-500 outline-none w-full md:w-64"
            placeholder="Search users..."
          />
        </div>
      </div>

      <div className="bg-slate-900/50 border border-slate-800 rounded-3xl overflow-hidden backdrop-blur-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              {table.getHeaderGroups().map((headerGroup: any) => (
                <tr key={headerGroup.id} className="border-b border-slate-800 bg-slate-900/80">
                  {headerGroup.headers.map((header: any) => (
                    <th key={header.id} className="p-4 text-xs font-black uppercase tracking-widest text-slate-500 whitespace-nowrap">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-500 font-bold">
                    Loading personnel data...
                  </td>
                </tr>
              ) : table.getRowModel().rows.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-500 font-bold">
                    No users found matching your criteria.
                  </td>
                </tr>
              ) : (
                table.getRowModel().rows.map((row: any) => (
                  <tr key={row.id} className="border-b border-slate-800/50 hover:bg-slate-800/20 transition-colors">
                    {row.getVisibleCells().map((cell: any) => (
                      <td key={cell.id} className="p-4">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        <div className="p-4 border-t border-slate-800 flex items-center justify-between">
           <span className="text-xs font-bold text-slate-500">
             Showing {table.getRowModel().rows.length} of {data.length} users
           </span>
           <div className="flex gap-2">
             <button
               onClick={() => table.previousPage()}
               disabled={!table.getCanPreviousPage()}
               className="px-3 py-1 bg-slate-800 text-slate-300 rounded-lg text-xs font-bold disabled:opacity-50"
             >
               Prev
             </button>
             <button
               onClick={() => table.nextPage()}
               disabled={!table.getCanNextPage()}
               className="px-3 py-1 bg-slate-800 text-slate-300 rounded-lg text-xs font-bold disabled:opacity-50"
             >
               Next
             </button>
           </div>
        </div>
      </div>
    </div>
  );
}
