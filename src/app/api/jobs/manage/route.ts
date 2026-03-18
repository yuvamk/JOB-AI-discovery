import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/authOptions';

export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const deleteAll = searchParams.get('deleteAll') === 'true';
    const id = searchParams.get('id');

    if (deleteAll) {
      const result = await prisma.job.deleteMany({});
      return NextResponse.json({ 
        message: 'All jobs deleted successfully', 
        count: result.count 
      });
    }

    if (!id) {
      return NextResponse.json({ error: 'Job ID is required' }, { status: 400 });
    }

    await prisma.job.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Job deleted successfully' });
  } catch (err: any) {
    console.error('[manage/DELETE] error:', err);
    return NextResponse.json({ 
      error: err.message || 'Failed to delete job' 
    }, { status: 500 });
  }
}
