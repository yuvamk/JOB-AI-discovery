import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/authOptions';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const adminCheck = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { role: true }
    });

    if (adminCheck?.role !== 'SUPER_ADMIN' && adminCheck?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const tenants = await prisma.tenant.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { users: true }
        }
      }
    });

    return NextResponse.json({ tenants });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
