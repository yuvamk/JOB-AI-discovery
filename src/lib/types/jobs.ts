import { Prisma } from '@prisma/client';
import type { JobMatch } from "../jobMatcher";

export type RankedJob = Omit<Partial<Prisma.JobGetPayload<{}>>, 'job_type' | 'experience_level'> & {
  // Common fields with Scraper format fallbacks
  title: string;
  companyName?: string;
  company?: string; // fallback for scraper
  location: string;
  description?: string;
  job_description?: string; // fallback for scraper
  applyUrl?: string;
  apply_link?: string; // fallback for scraper
  posted_at?: Date | string;
  posted_date?: string; // fallback for scraper
  posted_timestamp?: number;
  
  // AI/Ranking fields
  match?: JobMatch;
  match_score?: number;
  match_reason?: string;
  total_score?: number;
  recency_score?: number;
  applicant_score?: number;
  match_score_points?: number;
  is_new?: boolean;
  
  // Overrides for Prisma Enums to allow plain strings from scrapers
  job_type?: string;
  experience_level?: string;
  
  // Extra metadata
  source_platform?: string;
  logo_url?: string;
  skills?: string[];
  skills_required?: string[];
  salary?: string;
  salary_min?: number;
  salary_max?: number;
  industry?: string;
  benefits?: string;
  is_vibe_coder_friendly?: boolean;
};
