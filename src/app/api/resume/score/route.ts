import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/authOptions';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { resumeId, jobDescription } = await req.json();

    const resume = await prisma.resume.findUnique({
      where: { id: resumeId },
    });

    if (!resume) return NextResponse.json({ error: 'Resume not found' }, { status: 404 });

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `
      You are an expert ATS (Applicant Tracking System) Analyzer. 
      Analyze the following resume for its effectiveness ${jobDescription ? 'against this specific Job Description' : 'in general'}.
      
      Resume Data: ${JSON.stringify(resume.data)}
      ${jobDescription ? `Job Description: ${jobDescription}` : ''}
      
      Return JSON ONLY:
      {
        "score": 0 to 100,
        "matchingSkills": [],
        "missingSkills": [],
        "suggestions": ["specific actionable improvements"],
        "summary": "one sentence verdict"
      }
    `;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    const scoreData = JSON.parse(responseText.replace(/```json|```/g, ''));

    // Update resume with new score
    await prisma.resume.update({
      where: { id: resumeId },
      data: { atsScore: scoreData.score },
    });

    return NextResponse.json(scoreData);
  } catch (error: any) {
    console.error('[resume/score] error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
