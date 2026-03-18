import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/authOptions';
import prisma from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const user = await prisma.user.findUnique({
      where: { email: session.user.email as string },
      select: { role: true, tenantId: true }
    });

    if (user?.role !== 'ADMIN' && user?.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Comprehensive Stats for Admin Dashboard
    const totalUsers = await prisma.user.count({ where: { tenantId: user.tenantId } });
    const totalJobs = await prisma.job.count({ where: { tenantId: user.tenantId } });
    const jobScrapingStats = await prisma.scraperLog.aggregate({
        _sum: { jobsFound: true, jobsSaved: true },
        where: { runAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } }
    });

    const activeApplications = await prisma.application.count({ where: { tenantId: user.tenantId } });

    // Mock Chart Data for now (can be computed by grouping)
    const dauData = [
      { name: 'Mon', users: 120 },
      { name: 'Tue', users: 245 },
      { name: 'Wed', users: 432 },
      { name: 'Thu', users: 389 },
      { name: 'Fri', users: 512 },
      { name: 'Sat', users: 231 },
      { name: 'Sun', users: 198 },
    ];

    return NextResponse.json({
      stats: {
        totalUsers,
        totalJobs,
        jobsToday: jobScrapingStats?._sum?.jobsFound || 0,
        activeApplications,
        scraperHealth: "98.4%"
      },
      charts: {
        dauData,
        jobData: [
            { name: 'Mon', jobs: 240 },
            { name: 'Tue', jobs: 139 },
            { name: 'Wed', jobs: 980 },
            { name: 'Thu', jobs: 390 },
            { name: 'Fri', jobs: 480 },
            { name: 'Sat', jobs: 380 },
            { name: 'Sun', jobs: 430 },
        ]
      }
    });

  } catch (error: any) {
    console.error('[Admin Stats API] Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
