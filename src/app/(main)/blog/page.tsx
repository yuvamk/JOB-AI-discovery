import Link from 'next/link';
import { ArrowLeft, Clock, Calendar } from 'lucide-react';

const STATIC_POSTS = [
  {
    slug: 'how-to-write-an-ats-friendly-resume',
    title: 'How to Write an ATS-Friendly Resume in 2026',
    excerpt: 'Learn the exact strategies and formatting rules to ensure your resume passes any Applicant Tracking System.',
    date: 'March 18, 2026',
    readTime: '5 min read',
    tags: ['Career Advice', 'Resume Building']
  },
  {
    slug: 'top-10-remote-companies-hiring',
    title: 'Top 10 Remote-First Companies Hiring Right Now',
    excerpt: 'Discover organizations that prioritize remote work and find out what they look for in successful candidates.',
    date: 'March 15, 2026',
    readTime: '7 min read',
    tags: ['Remote Work', 'Job Search']
  },
  {
    slug: 'navigating-ai-job-interviews',
    title: 'Navigating AI Job Interviews: The Ultimate Guide',
    excerpt: 'As more companies use AI to pre-screen candidates, here is how you can prepare and stand out in the automated process.',
    date: 'March 10, 2026',
    readTime: '6 min read',
    tags: ['Interview Prep', 'AI']
  }
];

export default function BlogIndex() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 pt-32 pb-24">
       <div className="max-w-4xl mx-auto px-6">
          <div className="mb-16">
             <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-indigo-600 mb-8 transition-colors">
                <ArrowLeft className="w-4 h-4" /> Back to Home
             </Link>
             <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-slate-900 dark:text-white mb-4">
                Career Resources <span className="text-indigo-600">&</span> Insights
             </h1>
             <p className="text-lg text-slate-600 dark:text-slate-400 font-medium">
                Expert advice on resume building, interview preparation, and navigating the modern job market.
             </p>
          </div>

          <div className="space-y-8">
             {STATIC_POSTS.map(post => (
                <article key={post.slug} className="group border border-slate-200 dark:border-slate-800 rounded-3xl p-8 hover:border-indigo-500/30 transition-all bg-slate-50 dark:bg-slate-900/30">
                   <div className="flex flex-wrap gap-2 mb-4">
                      {post.tags.map(tag => (
                         <span key={tag} className="px-3 py-1 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-full text-[10px] font-black uppercase tracking-widest">
                            {tag}
                         </span>
                      ))}
                   </div>
                   <Link href={`/blog/${post.slug}`}>
                      <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-3 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                         {post.title}
                      </h2>
                   </Link>
                   <p className="text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
                      {post.excerpt}
                   </p>
                   <div className="flex items-center gap-6 text-xs font-bold text-slate-500">
                      <div className="flex items-center gap-2">
                         <Calendar className="w-4 h-4" />
                         {post.date}
                      </div>
                      <div className="flex items-center gap-2">
                         <Clock className="w-4 h-4" />
                         {post.readTime}
                      </div>
                   </div>
                </article>
             ))}
          </div>
       </div>
    </div>
  );
}
