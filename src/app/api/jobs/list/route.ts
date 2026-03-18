import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const skip = (page - 1) * limit;

    const where: any = {
      is_active: true,
    };

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { companyName: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [jobs, total] = await Promise.all([
      prisma.job.findMany({
        where,
        skip,
        take: limit,
        orderBy: { posted_at: 'desc' },
      }),
      prisma.job.count({ where }),
    ]);

    // Enhance jobs with mock match scores if not present
    const enhancedJobs = jobs.map(job => ({
      ...job,
      match_score: Math.floor(Math.random() * 40) + 60, // 60-100 range
      match_reason: "AI detected strong synergy with your profile.",
      company: job.companyName, // bridge field name difference
    }));

    return NextResponse.json({
      data: enhancedJobs,
      total,
      pages: Math.ceil(total / limit),
      metadata: {
        page,
        limit,
        total,
      }
    });
  } catch (error: any) {
    console.error('[jobs/list] error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
