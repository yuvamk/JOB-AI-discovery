import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'Invalid messages format' }, { status: 400 });
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
    // Format messages for Gemini Chat
    const chat = model.startChat({
      history: [
        {
          role: 'user',
          parts: [{ text: "You are the 'Kinetic Career Coach', a highly professional, energetic, and highly actionable AI agent within an advanced Job Discovery platform. Your goal is to give top-tier advice on resumes, interview prep, and career strategy. Be concise, direct, and slightly futuristic/edgy in your tone. Keep responses under 150 words when possible. Emphasize 'evolution' and 'impact'." }]
        },
        {
          role: 'model',
          parts: [{ text: "Understood. I am online and ready to guide our candidates toward their next evolution. What's the directive?" }]
        },
        ...messages.slice(0, -1).map((m: any) => ({
          role: m.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: m.content }]
        }))
      ]
    });

    const currentMessage = messages[messages.length - 1];
    const result = await chat.sendMessage(currentMessage.content);
    const text = result.response.text();

    return NextResponse.json({ content: text });
  } catch (error: any) {
    console.error('Coach API Error:', error);
    return NextResponse.json({ error: error.message || 'Failed to generate response' }, { status: 500 });
  }
}
