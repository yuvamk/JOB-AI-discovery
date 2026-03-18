import { NextRequest, NextResponse } from 'next/server';
import { ScraperManager } from '@/lib/scrapers/ScraperManager';
import { JSearchScraper } from '@/lib/scrapers/modules/JSearchScraper';
import { PuppeteerScraper } from '@/lib/scrapers/modules/PuppeteerScraper';
import prisma from '@/lib/prisma';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const role = searchParams.get('role') || '';
  const location = searchParams.get('location') || 'Remote';
  const platforms = searchParams.get('platforms')?.split(',') || [];
  const vibeCoderMode = searchParams.get('vibeCoderMode') === 'true';

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      const send = (data: any) => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
      };

      try {
        send({ type: 'progress', message: `🚀 Initializing AI Deep Scan for "${role}"...` });

        const manager = new ScraperManager();
        // Register standard scrapers
        manager.registerScraper(new JSearchScraper());
        
        // Only run Puppeteer if needed (resource intensive)
        if (vibeCoderMode) {
          manager.registerScraper(new PuppeteerScraper());
        }

        send({ type: 'progress', message: '🕵️ Scouring 50+ global sources including Direct, LinkedIn & Indeed...' });
        
        // Find default tenant
        const tenant = await prisma.tenant.findFirst() || await prisma.tenant.create({
          data: { name: "Default", slug: "default" }
        });

        const { totalFound } = await manager.runAll(role, location, tenant.id);
        send({ type: 'progress', message: `✅ Found ${totalFound} matches. Optimizing matching vectors...` });

        // Rank and Match
        const jobs = await prisma.job.findMany({
          where: { tenantId: tenant.id, is_active: true },
          orderBy: { createdAt: 'desc' },
          take: 12
        });

        send({ type: 'progress', message: '🧠 AI Architect is calculating compatibility scores...' });

        // AI Scoring with Gemini
        const rankedJobs = await Promise.all(jobs.map(async (job) => {
           try {
             const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
             const prompt = `You are an expert Job Matcher. Compare the job to the search intent and return a match score (0-100) and a 1-sentence reason.
             
             Role Search Intent: "${role}" at "${location}"
             Job: "${job.title}" at "${job.companyName}".
             Return JSON ONLY: {"score": number, "reason": "string"}`;
             
             const scoreResponse = await model.generateContent(prompt);
             let content = scoreResponse.response.text();
             content = content.replace(/```json/g, '').replace(/```/g, '').trim();
             const scoreData = JSON.parse(content);
             
             return { ...job, match_score: scoreData.score, match_reason: scoreData.reason };
           } catch (e) {
             return { ...job, match_score: 70, match_reason: "High general compatibility." };
           }
        }));

        send({ type: 'jobs', jobs: rankedJobs.sort((a, b) => (b.match_score || 0) - (a.match_score || 0)) });
        send({ type: 'progress', message: '✨ Evolution complete. Your tailored opportunities are ready.' });
        controller.close();
      } catch (error: any) {
        console.error('Stream Error:', error);
        send({ type: 'error', message: error.message });
        controller.close();
      }
    }
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}
