import { NextRequest } from 'next/server';
import { ScraperManager } from '@/lib/scrapers/ScraperManager';
import { JSearchScraper } from '@/lib/scrapers/modules/JSearchScraper';
import { PuppeteerScraper } from '@/lib/scrapers/modules/PuppeteerScraper';
import prisma from '@/lib/prisma';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(req: NextRequest) {
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      const send = (event: string, data: any) => {
        controller.enqueue(encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`));
      };

      try {
        const { role, location, resumeProfile, tenantSlug } = await req.json();
        
        const tenant = await prisma.tenant.findUnique({
          where: { slug: tenantSlug || 'default' }
        });
        if (!tenant) throw new Error('Tenant not found');

        send('status', { phase: 'start', message: `🚀 Starting autonomous search for "${role}"...` });

        const manager = new ScraperManager();
        manager.registerScraper(new JSearchScraper());
        manager.registerScraper(new PuppeteerScraper());

        // Run scrapers
        send('status', { phase: 'scraping', message: '🕵️ Scouring 50+ sources worldwide...' });
        const { totalFound } = await manager.runAll(role, location, tenant.id);
        send('status', { phase: 'scraped', message: `✅ Found ${totalFound} potential matches.` });

        // Rank and Match
        send('status', { phase: 'matching', message: '🧠 AI is calculating match scores & insights...' });
        const jobs = await prisma.job.findMany({
          where: { tenantId: tenant.id, is_active: true },
          orderBy: { createdAt: 'desc' },
          take: 20
        });

        // AI Scoring (Simplified for stream speed)
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
        const rankedJobs = await Promise.all(jobs.map(async (job) => {
           const matchResult = await model.generateContent(`
             Match resume to job. 
             Resume: ${JSON.stringify(resumeProfile)}
             Job: ${job.title} at ${job.companyName}. ${job.description.slice(0, 500)}
             Return JSON: {"score": 0-100, "reason": "why"}
           `);
           const text = matchResult.response.text();
           const scoreData = JSON.parse(text.replace(/```json|```/g, ''));
           return { ...job, total_score: scoreData.score, match_reason: scoreData.reason };
        }));

        send('result', { jobs: rankedJobs });
        send('status', { phase: 'done', message: '✨ Search complete. Personal recommendations ready.' });
        controller.close();
      } catch (error: any) {
        send('error', { message: error.message });
        controller.close();
      }
    }
  });

  return new NextResponse(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}

import { NextResponse } from 'next/server';
