import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/authOptions';
import prisma from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { headline, bio, location, experienceLevel, skills } = body;

    const updatedUser = await prisma.user.update({
      where: { email: session.user.email },
      data: {
        headline,
        bio,
        location,
        experienceLevel,
        skills,
        profileComplete: true,
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error: any) {
    console.error('Onboarding Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
