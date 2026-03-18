import { MetadataRoute } from 'next';
import prisma from '@/lib/prisma';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://jobplatform.com';

  // Get all active jobs to include in the sitemap
  const jobs = await prisma.job.findMany({
    where: { is_active: true },
    select: { id: true, title: true, companyName: true, country: true, createdAt: true },
    take: 1000, // Limit to 1000 for standard sitemaps, paginate if needed
  });

  const jobUrls = jobs.map((job) => {
    const slug = `${job.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-at-${job.companyName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${(job.country || 'remote').toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${job.id}`;
    return {
      url: `${baseUrl}/jobs/${slug}`,
      lastModified: job.createdAt,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    };
  });

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/jobs`,
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 0.9,
    },
    ...jobUrls,
  ];
}
