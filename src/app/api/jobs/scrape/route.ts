import { NextRequest, NextResponse } from 'next/server';
import { ScraperManager } from '@/lib/scrapers/ScraperManager';
import { JSearchScraper } from '@/lib/scrapers/modules/JSearchScraper';
import { PuppeteerScraper } from '@/lib/scrapers/modules/PuppeteerScraper';
import prisma from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const { query, location, tenantSlug } = await req.json();

    const tenant = await prisma.tenant.findUnique({
      where: { slug: tenantSlug || 'default' }
    });

    if (!tenant) return NextResponse.json({ error: 'Tenant not found' }, { status: 404 });

    const manager = new ScraperManager();
    manager.registerScraper(new JSearchScraper());
    manager.registerScraper(new PuppeteerScraper());

    const result = await manager.runAll(query || 'Software Engineer', location || 'Global', tenant.id);

    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
