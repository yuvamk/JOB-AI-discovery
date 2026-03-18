import { BaseScraper, ScrapedJob } from '../ScraperManager';
import axios from 'axios';

export class JSearchScraper extends BaseScraper {
  name = 'JSearch';
  private apiKey = process.env.JSEARCH_API_KEY || '';

  async scrape(query: string, location: string): Promise<ScrapedJob[]> {
    if (!this.apiKey) {
      console.warn('[JSearch] API Key missing, skipping...');
      return [];
    }

    try {
      const response = await axios.get('https://jsearch.p.rapidapi.com/search', {
        params: { query: `${query} in ${location}`, num_pages: '1' },
        headers: {
          'X-RapidAPI-Key': this.apiKey,
          'X-RapidAPI-Host': 'jsearch.p.rapidapi.com'
        }
      });

      return response.data.data.map((job: any) => ({
        title: job.job_title,
        companyName: job.employer_name,
        location: job.job_city || location,
        country: job.job_country || 'Global',
        description: job.job_description,
        job_type: job.job_employment_type === 'FULLTIME' ? 'FULL_TIME' : 'CONTRACT',
        source: 'JSearch',
        source_url: job.job_apply_link,
        logo_url: job.employer_logo,
        posted_at: new Date(job.job_posted_at_datetime_utc),
        salary_min: job.job_min_salary,
        salary_max: job.job_max_salary,
        currency: job.job_salary_currency
      }));
    } catch (error) {
      throw error;
    }
  }
}
