import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(req: NextRequest) {
  try {
    const { name, email, password, phone } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return NextResponse.json({ error: 'User already exists' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const defaultTenant = await prisma.tenant.findFirst() || await prisma.tenant.create({
      data: { name: "Default", slug: "default" }
    });

    const user = await prisma.user.create({
      data: {
        name,
        email,
        phone,
        passwordHash: hashedPassword,
        tenantId: defaultTenant.id,
        role: "JOB_SEEKER",
        profileComplete: false
      }
    });

    return NextResponse.json({ 
      message: 'User created successfully',
      user: { id: user.id, email: user.email, name: user.name }
    });
  } catch (error: any) {
    console.error('[signup] error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
