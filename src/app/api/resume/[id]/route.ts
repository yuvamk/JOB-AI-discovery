import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/authOptions';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await params;

    const resume = await prisma.resume.findUnique({
      where: { id },
    });

    if (!resume) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    return NextResponse.json(resume);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await params;
    const { data, templateId, atsScore } = await req.json();

    const resume = await prisma.resume.update({
      where: { id },
      data: { 
        data, 
        templateId, 
        atsScore,
        version: { increment: 1 }
      },
    });

    // Create version history
    await prisma.resumeVersion.create({
      data: {
        resumeId: id,
        data: data,
      }
    });

    return NextResponse.json(resume);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
