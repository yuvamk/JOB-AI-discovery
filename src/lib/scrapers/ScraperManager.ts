import prisma from '@/lib/prisma';

export interface ScrapedJob {
  title: string;
  companyName: string;
  location: string;
  country: string;
  description: string;
  job_type: 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'FREELANCE' | 'INTERNSHIP';
  salary_min?: number;
  salary_max?: number;
  currency?: string;
  source: string;
  source_url: string;
  logo_url?: string;
  posted_at?: Date;
  skills?: string[];
  application_url?: string;
}

export abstract class BaseScraper {
  abstract name: string;
  abstract scrape(query: string, location: string): Promise<ScrapedJob[]>;
}

export type ProgressEvent = {
  scraper: string;
  type: 'start' | 'found' | 'saved' | 'done' | 'error';
  count?: number;
  message: string;
};

export class ScraperManager {
  private scrapers: BaseScraper[] = [];
  private onProgress?: (event: ProgressEvent) => void;

  registerScraper(scraper: BaseScraper) {
    this.scrapers.push(scraper);
  }

  setProgressCallback(cb: (event: ProgressEvent) => void) {
    this.onProgress = cb;
  }

  private emit(event: ProgressEvent) {
    this.onProgress?.(event);
    console.log(`[${event.scraper}] ${event.message}`);
  }

  async runAll(query: string, location: string, tenantId: string) {
    console.log(`[Scraper] Starting run for "${query}" in "${location}"`);
    const startTime = Date.now();
    let totalSaved = 0;
    let totalFound = 0;

    for (const scraper of this.scrapers) {
      this.emit({ scraper: scraper.name, type: 'start', message: `Starting ${scraper.name}...` });
      try {
        const jobs = await scraper.scrape(query, location);
        totalFound += jobs.length;
        this.emit({ scraper: scraper.name, type: 'found', count: jobs.length, message: `${scraper.name}: found ${jobs.length} listings` });

        let scraperSaved = 0;
        for (const job of jobs) {
          // Deduplication by source_url
          const existing = await prisma.job.findFirst({ where: { source_url: job.source_url } });
          if (!existing) {
            await prisma.job.create({
              data: {
                ...job,
                tenantId,
                skills: job.skills || [],
                experience_level: 'MID',
                remote_type: job.location?.toLowerCase().includes('remote') ? 'REMOTE' : 'ONSITE',
                application_url: job.application_url || job.source_url,
              }
            });
            scraperSaved++;
            totalSaved++;
          }
        }

        this.emit({ scraper: scraper.name, type: 'done', count: scraperSaved, message: `${scraper.name}: saved ${scraperSaved} new jobs to DB` });
      } catch (error: any) {
        this.emit({ scraper: scraper.name, type: 'error', message: `${scraper.name}: error — ${error.message}` });
      }
    }

    const duration = Math.floor((Date.now() - startTime) / 1000);
    try {
      await prisma.scraperLog.create({
        data: { source: 'Manager-Run', jobsFound: totalFound, jobsSaved: totalSaved, duration, status: 'SUCCESS' }
      });
    } catch (_) { /* scraperLog write may fail if transaction issue — non-critical */ }

    return { totalFound, totalSaved };
  }
}
