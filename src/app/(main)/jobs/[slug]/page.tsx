import { notFound } from 'next/navigation';
import prisma from '@/lib/prisma';
import { Metadata } from 'next';
import { Calendar, Building2, MapPin, DollarSign, Briefcase } from 'lucide-react';
import { format } from 'date-fns';

type Props = {
  params: Promise<{ slug: string }>;
};

async function getJobFromSlug(slug: string) {
  // Extract ID from the end of the slug: "title-at-company-location-id"
  const parts = slug.split('-');
  const id = parts[parts.length - 1];

  if (!id) return null;

  try {
    const job = await prisma.job.findUnique({
      where: { id }
    });
    return job;
  } catch (e) {
    return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const job = await getJobFromSlug(resolvedParams.slug);

  if (!job) {
    return { title: 'Job Not Found' };
  }

  return {
    title: `${job.title} at ${job.companyName} | Kinetic Job Discovery`,
    description: job.description.substring(0, 160) + '...',
    openGraph: {
      title: `${job.title} at ${job.companyName}`,
      description: `We are hiring a ${job.title} in ${job.location}. Apply now!`,
      type: 'website',
    }
  };
}

export default async function JobDetailPage({ params }: Props) {
  const resolvedParams = await params;
  const job = await getJobFromSlug(resolvedParams.slug);

  if (!job) {
    notFound();
  }

  // Generate Google Jobs structured data (JSON-LD)
  const jsonLd = {
    '@context': 'https://schema.org/',
    '@type': 'JobPosting',
    title: job.title,
    description: job.description,
    identifier: {
      '@type': 'PropertyValue',
      name: job.companyName,
      value: job.id,
    },
    datePosted: job.createdAt.toISOString(),
    validThrough: new Date(job.createdAt.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    employmentType: job.job_type === 'FULL_TIME' ? 'FULL_TIME' : 
                    job.job_type === 'CONTRACT' ? 'CONTRACTOR' : 
                    job.job_type === 'PART_TIME' ? 'PART_TIME' : 'OTHER',
    hiringOrganization: {
      '@type': 'Organization',
      name: job.companyName,
      sameAs: job.source_url,
      ...(job.logo_url && { logo: job.logo_url }),
    },
    jobLocation: {
      '@type': 'Place',
      address: {
        '@type': 'PostalAddress',
        addressLocality: job.location,
        addressCountry: job.country || 'US',
      },
    },
    ...(job.salary_min && job.salary_max && {
      baseSalary: {
        '@type': 'MonetaryAmount',
        currency: job.currency || 'USD',
        value: {
          '@type': 'QuantitativeValue',
          value: job.salary_min,
          minValue: job.salary_min,
          maxValue: job.salary_max,
          unitText: 'YEAR',
        },
      },
    }),
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-24 pb-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <div className="max-w-4xl mx-auto px-6">
         <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-sm mb-8">
            <div className="flex flex-col md:flex-row gap-6 mb-8 items-start">
               <div className="w-24 h-24 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center overflow-hidden flex-shrink-0 border border-slate-200 dark:border-slate-700">
                  {job.logo_url ? (
                     <img src={job.logo_url} alt={job.companyName} className="w-full h-full object-cover" />
                  ) : (
                     <Building2 className="w-10 h-10 text-slate-400" />
                  )}
               </div>
               <div className="flex-1">
                  <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tighter mb-2">
                     {job.title}
                  </h1>
                  <h2 className="text-xl font-bold text-indigo-600 dark:text-indigo-400 mb-4">
                     {job.companyName}
                  </h2>
                  
                  <div className="flex flex-wrap items-center gap-4 text-sm font-bold text-slate-500">
                     <div className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> {job.location}</div>
                     <div className="flex items-center gap-1.5"><Briefcase className="w-4 h-4" /> {job.job_type?.replace('_', ' ')}</div>
                     {(job.salary_min || job.salary_max) ? (
                        <div className="flex items-center gap-1.5"><DollarSign className="w-4 h-4" /> 
                          {job.salary_min ? job.salary_min.toLocaleString() : '0'} 
                          {job.salary_max ? ` - ${job.salary_max.toLocaleString()}` : ''} {job.currency}
                        </div>
                     ) : (
                        <div className="flex items-center gap-1.5"><DollarSign className="w-4 h-4" /> Salary Undisclosed</div>
                     )}
                  </div>
               </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 border-t border-slate-200 dark:border-slate-800 pt-6">
               <a 
                 href={job.application_url || job.source_url} 
                 target="_blank" rel="noopener noreferrer"
                 className="flex-1 text-center px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-xl shadow-xl shadow-indigo-500/25 transition-all text-sm uppercase tracking-widest"
               >
                 Apply Now {job.source ? `on ${job.source}` : ''}
               </a>
               <button className="px-8 py-4 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white hover:bg-slate-200 hover:dark:bg-slate-700 font-black rounded-xl transition-all text-sm uppercase tracking-widest">
                 Save Job
               </button>
            </div>
         </div>

         <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-sm prose prose-slate dark:prose-invert max-w-none">
            <h3 className="text-xl font-black uppercase tracking-widest text-slate-900 dark:text-white mb-6 flex items-center gap-2">
               <FileText className="w-5 h-5 text-indigo-500" /> About the Role
            </h3>
            
            {/* Some simple parsing if the description is plain text */}
            <div className="text-slate-600 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">
               {job.description}
            </div>

            {job.requirements && (
               <>
                  <h3 className="text-xl font-black uppercase tracking-widest text-slate-900 dark:text-white mt-12 mb-6">
                     Requirements
                  </h3>
                  <div className="text-slate-600 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">
                     {job.requirements}
                  </div>
               </>
            )}

            {job.skills && job.skills.length > 0 && (
               <div className="mt-12">
                  <h3 className="text-xl font-black uppercase tracking-widest text-slate-900 dark:text-white mb-6">
                     Required Skills
                  </h3>
                  <div className="flex flex-wrap gap-2">
                     {job.skills.map((skill: string) => (
                        <span key={skill} className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl font-bold text-xs uppercase tracking-widest">
                           {skill}
                        </span>
                     ))}
                  </div>
               </div>
            )}
         </div>
      </div>
    </div>
  );
}
