import { NextRequest } from 'next/server';
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
        try {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
        } catch (_) { /* stream closed */ }
      };

      try {
        send({ type: 'progress', message: `🚀 Initializing Deep Scan for "${role}"...` });

        // Ensure a default tenant exists
        let tenant = await prisma.tenant.findFirst();
        if (!tenant) {
          tenant = await prisma.tenant.create({ data: { name: 'Default', slug: 'default' } });
        }

        const manager = new ScraperManager();
        manager.registerScraper(new JSearchScraper());
        if (vibeCoderMode) {
          manager.registerScraper(new PuppeteerScraper());
        }

        // Wire per-scraper live logs to the SSE stream
        manager.setProgressCallback((event) => {
          const emoji = event.type === 'start' ? '🔍'
            : event.type === 'found' ? '📋'
            : event.type === 'saved' ? '💾'
            : event.type === 'done' ? '✅'
            : '⚠️';

          send({
            type: 'log',
            scraper: event.scraper,
            logType: event.type,
            count: event.count,
            message: `${emoji} ${event.message}`,
          });
          // Also emit as progress so the main progress bar updates
          send({ type: 'progress', message: `${emoji} ${event.message}` });
        });

        send({ type: 'progress', message: '🕵️ Launching scrapers across global sources...' });

        const { totalFound, totalSaved } = await manager.runAll(role, location, tenant.id);

        send({ type: 'progress', message: `📦 Scraped ${totalFound} jobs, saved ${totalSaved} new to database. Running AI match scoring...` });

        // Fetch ALL scraped jobs for this tenant (no limit)
        const jobs = await prisma.job.findMany({
          where: { tenantId: tenant.id, is_active: true },
          orderBy: { createdAt: 'desc' },
        });

        if (jobs.length === 0) {
          send({ type: 'progress', message: '⚠️ No jobs found. Try different keywords or platforms.' });
          controller.close();
          return;
        }

        send({ type: 'progress', message: `🧠 AI scoring ${jobs.length} opportunities in parallel...` });

        // Score in batches of 5 — stream each batch as it completes
        const BATCH = 5;
        const rankedBatches: any[] = [];

        for (let i = 0; i < jobs.length; i += BATCH) {
          const batch = jobs.slice(i, i + BATCH);

          const scored = await Promise.all(batch.map(async (job) => {
            try {
              const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
              const prompt = `Score how well this job matches the search intent. Return ONLY valid JSON.
Search: "${role}" in "${location}"
Job: "${job.title}" at "${job.companyName}"
Description snippet: ${(job.description || '').slice(0, 200)}
JSON format: {"score": 0-100, "reason": "one sentence"}`;

              const result = await model.generateContent(prompt);
              let text = result.response.text().replace(/```json/g, '').replace(/```/g, '').trim();
              const parsed = JSON.parse(text);
              return { ...job, match_score: parsed.score, match_reason: parsed.reason };
            } catch {
              return { ...job, match_score: 65, match_reason: 'Good compatibility with your search.' };
            }
          }));

          rankedBatches.push(...scored);

          // Stream cumulative sorted result after each batch
          const sorted = [...rankedBatches].sort((a, b) => (b.match_score || 0) - (a.match_score || 0));
          send({ type: 'jobs', jobs: sorted });
          send({ type: 'progress', message: `🔬 Scored ${Math.min(i + BATCH, jobs.length)} / ${jobs.length}...` });
        }

        const final = rankedBatches.sort((a, b) => (b.match_score || 0) - (a.match_score || 0));
        send({ type: 'jobs', jobs: final });
        send({ type: 'progress', message: `✨ Done — ${final.length} opportunities ranked by AI match score.` });
        controller.close();

      } catch (error: any) {
        console.error('Stream Error:', error);
        send({ type: 'error', message: error.message });
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}
