import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/authOptions';
import { GoogleGenerativeAI } from '@google/generative-ai';

export interface TailoredResume {
  name: string;
  contact: {
    email: string;
    phone: string;
    location: string;
    linkedin?: string;
    github?: string;
    website?: string;
  };
  summary: string;
  experience: {
    title: string;
    company: string;
    location: string;
    duration: string;
    bullets: string[];
  }[];
  projects: {
    name: string;
    description: string;
    link?: string;
    technologies: string[];
  }[];
  skills: {
    technical: string[];
    tools: string[];
    soft: string[];
  };
  education: {
    degree: string;
    institution: string;
    year: string;
    gpa?: string;
  }[];
  certifications: string[];
  tailoring_notes?: string;
}


export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { resumeId, jobId, jobDescription } = await req.json();

    if (!resumeId || (!jobId && !jobDescription)) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const resume = await prisma.resume.findUnique({ where: { id: resumeId } });
    if (!resume) return NextResponse.json({ error: 'Resume not found' }, { status: 404 });

    let jd = jobDescription;
    if (jobId) {
      const job = await prisma.job.findUnique({ where: { id: jobId } });
      if (job) jd = job.description + '\n' + (job.requirements || '');
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `
      You are an expert ATS Resume Tailor. 
      Tailor the following resume data to match the provided job description.
      - Inject relevant keywords from the JD.
      - Rewrite bullet points to emphasize impact using action verbs.
      - Keep the data structure exactly the same.
      - Return ONLY a valid JSON object.

      RESUME DATA:
      ${JSON.stringify(resume.data)}

      JOB DESCRIPTION:
      ${jd}
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text().replace(/```json|```/g, '').trim();
    const tailoredData = JSON.parse(text);

    // Create a new version of the resume or a new resume entry
    const newResume = await prisma.resume.create({
      data: {
        userId: resume.userId,
        tenantId: resume.tenantId,
        title: `${resume.title} (Tailored for Job)`,
        templateId: resume.templateId,
        data: tailoredData,
        atsScore: 95, // Simulated high score
        isDefault: false,
      }
    });

    return NextResponse.json(newResume);
  } catch (error: any) {
    console.error('[resume/tailor] error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
