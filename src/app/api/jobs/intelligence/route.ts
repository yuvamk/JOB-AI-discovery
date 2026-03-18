import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(req: NextRequest) {
  try {
    const { title, companyName, description } = await req.json();

    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const prompt = `You are an expert Career Coach and Hiring Manager. Analyze the provided job description and return a JSON object with two keys:
1. 'summary': A punchy, 3-4 sentence high-level summary of what this role actually entails and who it's for.
2. 'interview_guide': An array of 3 actionable tips or predicted interview topics specific to this role and company.
Return ONLY valid JSON without Markdown blocks.

Job Title: ${title}
Company: ${companyName}
Description: ${description.substring(0, 4000)}`;

    const result = await model.generateContent(prompt);
    let text = result.response.text();
    text = text.replace(/```json/g, '').replace(/```/g, '').trim();
    
    const data = JSON.parse(text);

    return NextResponse.json(data);
  } catch (error: any) {
    console.error('[AI Job Intelligence Error]:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
