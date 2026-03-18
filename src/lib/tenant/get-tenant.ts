import { headers } from 'next/headers';
import prisma from '@/lib/prisma';

export async function getTenant() {
  const headerList = await headers();
  const slug = headerList.get('x-tenant-slug') || 'default';

  const tenant = await prisma.tenant.findUnique({
    where: { slug }
  });

  if (!tenant) {
    // Fallback to default or create if not exists
    return await prisma.tenant.findFirst() || await prisma.tenant.create({
      data: { name: "Default", slug: "default" }
    });
  }

  return tenant;
}

export async function getTenantId() {
  const tenant = await getTenant();
  return tenant.id;
}
