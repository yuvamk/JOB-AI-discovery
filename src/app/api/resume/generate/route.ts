import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/authOptions';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await req.json();
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `
      You are an expert Resume Architect. Transform the following raw user data into a professional, high-impact resume JSON.
      Rewrite bullet points using strong action verbs and achievement-oriented language (result-focused).
      
      User Data: ${JSON.stringify(formData)}
      
      Return JSON ONLY in this exact structure:
      {
        "basics": { "name", "label", "email", "phone", "location", "summary" },
        "work": [ { "company", "position", "highlights": [] } ],
        "education": [ { "institution", "area", "studyType" } ],
        "skills": [],
        "projects": [ { "name", "description", "keywords": [] } ]
      }
    `;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    const resumeData = JSON.parse(responseText.replace(/```json|```/g, ''));

    // Find the user to get tenantId and userId
    const user = await prisma.user.findUnique({
      where: { email: session.user.email as string }
    });

    if (!user) throw new Error('User not found');

    const resume = await prisma.resume.create({
      data: {
        userId: user.id,
        tenantId: user.tenantId,
        title: `Resume ${new Date().toLocaleDateString()}`,
        templateId: 'modern',
        data: resumeData,
        atsScore: 85, // Initial placeholder score
      }
    });

    return NextResponse.json({ id: resume.id });
  } catch (error: any) {
    console.error('[resume/generate] error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
