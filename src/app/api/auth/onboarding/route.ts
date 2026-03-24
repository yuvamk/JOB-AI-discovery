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

    // Use $runCommandRaw to bypass Prisma's transaction wrapper.
    // MongoDB Atlas M0 (free tier) does not support transactions, and Prisma
    // wraps all update() / updateMany() calls in transactions for MongoDB.
    // Using the native findAndModify command avoids this entirely.
    await prisma.$runCommandRaw({
      findAndModify: 'users',
      query: { email: session.user.email },
      update: {
        $set: {
          headline: headline ?? null,
          bio: bio ?? null,
          location: location ?? null,
          experienceLevel: experienceLevel ?? null,
          skills: skills ?? [],
          profileComplete: true,
        },
      },
      new: true,
    });

    // Fetch the updated document via a read (reads don't need transactions)
    const updatedUser = await prisma.user.findFirst({
      where: { email: session.user.email },
    });

    return NextResponse.json(updatedUser);
  } catch (error: any) {
    console.error('Onboarding Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
