import { headers } from 'next/headers';
import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';

export async function getTenantConfig() {
  const headersList = await headers();
  const slug = headersList.get('x-tenant-slug') || 'default';

  // Skip looking up 'default' if that's what was passed unless we really want a 'default' tenant
  // For development ease, we can just return a fallback.
  if (slug === 'default') {
    return {
      slug: 'default',
      name: 'Kinetic',
      logo: null,
      plan: 'FREE',
      settings: {
        primaryColor: '#6366f1', // Indigo
      }
    };
  }

  const tenant = await prisma.tenant.findUnique({
    where: { slug }
  });

  if (!tenant) {
    // If we're on a custom subdomain but tenant doesn't exist
    return notFound();
  }

  // Parse settings or provide fallback
  let settings = { primaryColor: '#6366f1' }; // Fallback indigo
  if (tenant.settings) {
    try {
      settings = typeof tenant.settings === 'string' 
        ? JSON.parse(tenant.settings) 
        : tenant.settings;
    } catch (e) {
      console.error('Failed to parse tenant settings', e);
    }
  }

  return {
    ...tenant,
    settings
  };
}
