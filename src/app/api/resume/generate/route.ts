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
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    // Step 1: AI Content Generation & Bullet Point Expansion
    const architecturePrompt = `You are the world's leading Resume Architect. Transform raw user career data into a high-impact, professional JSON resume.
CRITICAL RULES:
1. Rewrite every work responsibility into achievement-oriented bullet points using strong action verbs.
2. Quantify achievements (e.g., 'Increased efficiency by 40%').
3. Generate a high-impact summary.
4. Inject relevant industry keywords for ATS.
5. Return ONLY a valid JSON object matching the standard JSON Resume schema without markdown block characters.

Transform this data into a professional resume JSON: ${JSON.stringify(formData)}

REQUIRED JSON STRUCTURE:
{
  "basics": { "name", "label", "email", "phone", "location", "summary", "headline", "url" },
  "work": [ { "company", "position", "location", "duration", "summary", "highlights": [] } ],
  "education": [ { "institution", "area", "studyType", "year", "gpa" } ],
  "skills": [ { "name", "level", "keywords": [] } ],
  "projects": [ { "name", "description", "highlights": [], "keywords": [], "url" } ],
  "certificates": [ { "name", "issuer", "date" } ]
}`;

    const archResult = await model.generateContent(architecturePrompt);
    let content = archResult.response.text();
    content = content.replace(/```json/g, '').replace(/```/g, '').trim();
    const resumeData = JSON.parse(content);

    // Step 2: ATS Optimization Engine (Scoring)
    const atsPrompt = `You are an ATS (Applicant Tracking System) simulation engine. Analyze the provided resume JSON and provide an objective ATS compatibility score out of 100, along with identifying 3 missing keywords for the target role.
    
Analyze this resume and return JSON ONLY without markdown block characters: ${JSON.stringify(resumeData)}

REQUIRED RESPONSE STRUCTURE:
{
  "score": 85,
  "missingKeywords": ["Docker", "Kubernetes", "Redis"],
  "improvement": "Add more quantitative results to the work experience section."
}`;

    const atsResult = await model.generateContent(atsPrompt);
    let atsContent = atsResult.response.text();
    atsContent = atsContent.replace(/```json/g, '').replace(/```/g, '').trim();
    const atsData = JSON.parse(atsContent);

    // Step 3: Persistence
    const user = await prisma.user.findUnique({
      where: { email: session.user.email as string }
    });

    if (!user) throw new Error('User context not found');

    const resume = await prisma.resume.create({
      data: {
        userId: user.id,
        tenantId: user.tenantId,
        title: `${resumeData.basics.name || 'My'} Resume - AI Architected`,
        templateId: 'modern',
        data: {
            ...resumeData,
            atsAnalysis: atsData
        },
        atsScore: atsData.score,
      }
    });

    return NextResponse.json({ id: resume.id });

  } catch (error: any) {
    console.error('[resume/generate] Claude Error:', error);
    return NextResponse.json({ error: 'AI Architect was unable to process your request. Please check your data and try again.' }, { status: 500 });
  }
}
