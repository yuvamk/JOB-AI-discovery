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
}

export abstract class BaseScraper {
  abstract name: string;
  abstract scrape(query: string, location: string): Promise<ScrapedJob[]>;
}

export class ScraperManager {
  private scrapers: BaseScraper[] = [];

  registerScraper(scraper: BaseScraper) {
    this.scrapers.push(scraper);
  }

  async runAll(query: string, location: string, tenantId: string) {
    console.log(`[Scraper] Starting run for "${query}" in "${location}"`);
    const startTime = Date.now();
    let totalSaved = 0;
    let totalFound = 0;

    for (const scraper of this.scrapers) {
      try {
        console.log(`[Scraper] Running ${scraper.name}...`);
        const jobs = await scraper.scrape(query, location);
        totalFound += jobs.length;

        for (const job of jobs) {
           // Basic de-duplication
           const existing = await prisma.job.findFirst({
             where: { source_url: job.source_url }
           });

           if (!existing) {
             await prisma.job.create({
               data: {
                 ...job,
                 tenantId,
                 experience_level: 'MID', // Default mapping
                 remote_type: 'ONSITE',
               }
             });
             totalSaved++;
           }
        }
      } catch (error) {
        console.error(`[Scraper] Error in ${scraper.name}:`, error);
      }
    }

    const duration = Math.floor((Date.now() - startTime) / 1000);
    await prisma.scraperLog.create({
      data: {
        source: 'Manager-Run',
        jobsFound: totalFound,
        jobsSaved: totalSaved,
        duration,
        status: 'SUCCESS'
      }
    });

    return { totalFound, totalSaved };
  }
}
