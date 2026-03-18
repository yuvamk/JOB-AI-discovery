import prisma from '@/lib/prisma';
import { getTemplate } from '@/components/resume/templates';
import { notFound } from 'next/navigation';

export default async function ResumeViewPage({ params }: { params: { id: string } }) {
  const { id } = await params;
  const resume = await prisma.resume.findUnique({
    where: { id }
  });

  if (!resume) notFound();

  const ActiveTemplate = getTemplate(resume.templateId);

  return (
    <div className="bg-white min-h-screen">
      <ActiveTemplate data={resume.data as any} />
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          body {
            margin: 0;
            padding: 0;
            -webkit-print-color-adjust: exact;
          }
          @page {
            margin: 0;
            size: auto;
          }
        }
      `}} />
    </div>
  );
}
