import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import prisma from '@/lib/prisma';
import { randomInt } from 'crypto';

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // Generate random 6-digit OTP
    const otp = randomInt(100000, 999999).toString();

    // Store OTP in database with 10-minute expiration
    await (prisma as any).otp.upsert({
      where: {
        email_code: {
          email: email,
          code: otp,
        },
      },
      update: {
        expiresAt: new Date(Date.now() + 10 * 60 * 1000),
      },
      create: {
        email: email,
        code: otp,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000),
      },
    });

    // Clean up old OTPs for this email (optional but good practice)
    await (prisma as any).otp.deleteMany({
      where: {
        email: email,
        NOT: {
          code: otp
        }
      }
    });

    // Initialize Nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    const mailOptions = {
      from: `"Kinetic Job Discovery" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: 'Your Kinetic Login Code',
      html: `
        <div style="font-family: sans-serif; text-align: center; padding: 40px; background-color: #f8fafc; border-radius: 20px;">
          <h1 style="color: #4f46e5; margin-bottom: 20px;">Welcome to Kinetic</h1>
          <p style="color: #64748b; font-size: 16px;">Your temporary login code is:</p>
          <div style="background-color: white; border: 2px solid #e2e8f0; border-radius: 12px; padding: 20px; font-size: 32px; font-weight: 900; letter-spacing: 8px; color: #0f172a; margin: 30px auto; max-width: 300px;">
            ${otp}
          </div>
          <p style="color: #94a3b8; font-size: 14px;">This code will expire in 10 minutes.</p>
        </div>
      `
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    return NextResponse.json({ success: true, message: 'OTP sent to ' + email });
  } catch (error: any) {
    console.error('Nodemailer Error:', error);
    return NextResponse.json({ error: 'Failed to send OTP email' }, { status: 500 });
  }
}
