import prisma from '@/lib/prisma';
import { ScraperManager } from './ScraperManager';
import { JSearchScraper } from './modules/JSearchScraper';
import { PuppeteerScraper } from './modules/PuppeteerScraper';

export async function runBackgroundScraping() {
  console.log('[Cron] Starting background scraping job...');
  
  // Get all active tenants to refresh their data
  const tenants = await prisma.tenant.findMany({ where: { isActive: true } });
  
  const manager = new ScraperManager();
  manager.registerScraper(new JSearchScraper());
  manager.registerScraper(new PuppeteerScraper());

  const DEFAULT_QUERIES = ['AI Engineer', 'Software Engineer', 'Product Manager', 'Vibe Coder'];
  const LOCATIONS = ['Remote', 'San Francisco', 'London', 'Berlin', 'Bangalore'];

  for (const tenant of tenants) {
    for (const query of DEFAULT_QUERIES) {
      for (const loc of LOCATIONS) {
        try {
          console.log(`[Cron] Scraping "${query}" for ${tenant.name} in ${loc}`);
          await manager.runAll(query, loc, tenant.id);
        } catch (err) {
          console.error(`[Cron] Error for tenant ${tenant.id}:`, err);
        }
      }
    }
  }

  console.log('[Cron] Background scraping cycle complete.');
}
