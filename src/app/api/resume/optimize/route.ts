import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/authOptions';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { resumeData, jobDescription } = await req.json();

    if (!resumeData || !jobDescription) {
      return NextResponse.json({ error: 'Resume data and Job Description are required' }, { status: 400 });
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });

    const prompt = `
      You are an expert ATS (Applicant Tracking System) Optimization Engine.
      Analyze the provided Resume against the Job Description.
      
      Resume: ${JSON.stringify(resumeData)}
      Job Description: ${jobDescription}
      
      Tasks:
      1. Calculate an ATS Match Score (0-100).
      2. Identify missing high-impact keywords.
      3. Suggest specific improvements for bullet points to better align with the JD.
      4. Rewrite the Professional Summary for maximum impact for this specific role.
      5. Optimization: Re-generate the entire work experience section, optimizing the existing accomplishments to match the tone and requirements of the JD without lying.
      
      Return JSON ONLY:
      {
        "score": number,
        "missingKeywords": string[],
        "suggestions": string[],
        "optimizedSummary": string,
        "optimizedWork": {
          "company": string,
          "position": string,
          "summary": string,
          "highlights": string[]
        }[]
      }
    `;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const optimization = JSON.parse(text.replace(/```json|```/g, ''));

    return NextResponse.json(optimization);
  } catch (error: any) {
    console.error('[resume/optimize] error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
