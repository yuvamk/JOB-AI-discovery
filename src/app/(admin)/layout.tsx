import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/authOptions';
import prisma from '@/lib/prisma';
import AdminSidebar from '@/components/admin/AdminSidebar';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect('/?login=true');
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { role: true }
  });

  if (user?.role !== 'ADMIN' && user?.role !== 'SUPER_ADMIN') {
    // For testing purposes, if you want to bypass this locally, comment the return redirect out.
    // redirect('/discovery');
  }

  return (
    <div className="min-h-screen bg-slate-950 flex dark">
      <AdminSidebar />
      <div className="flex-1 ml-64 bg-slate-950 min-h-screen relative">
         <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
         <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-indigo-500 opacity-20 blur-[100px]" />
         <div className="relative z-10 p-8 h-full overflow-y-auto">
            {children}
         </div>
      </div>
    </div>
  );
}
