import axios from "axios";
import { AdzunaJob, AdzunaSearchResult } from "../types";

export class AdzunaService {
  private static readonly BASE_URL = 'https://api.adzuna.com/v1/api';
  private static readonly COUNTRY = 'us'; // Change to 'us' for US jobs
  private static readonly APP_ID = process.env.ADZUNA_APP_ID || '';
  private static readonly APP_KEY = process.env.ADZUNA_APP_KEY || '';

  static async searchJobs(keywords: string[], location: string = 'United States'): Promise<AdzunaJob[]> {
    try {
      const searchParams = new URLSearchParams({
        app_id: this.APP_ID,
        app_key: this.APP_KEY,
        results_per_page: '20',
        what: keywords.join(' '),
        where: location,
        content_type: 'jobs',
        sort_by: 'date'
      });

      const url = `${this.BASE_URL}/${this.COUNTRY}/jobs/search/1?${searchParams.toString()}`;
      
      const response = await axios.get(url, {
        timeout: 30000
      });

      if (response.data?.results) {
        return this.formatJobs(response.data.results);
      }
      return [];
    } catch (error) {
      console.error('Adzuna API error:', error);
      return this.getMockJobs(keywords);
    }
  }

  static async getJobCategories(): Promise<string[]> {
    try {
      const url = `${this.BASE_URL}/${this.COUNTRY}/jobs/categories`;
      const response = await axios.get(url, {
        params: {
          app_id: this.APP_ID,
          app_key: this.APP_KEY
        },
        timeout: 30000
      });

      if (response.data?.results) {
        return response.data.results.map((cat: any) => cat.label);
      }
      return [];
    } catch (error) {
      console.error('Adzuna categories error:', error);
      return [];
    }
  }

  private static formatJobs(jobs: any[]): AdzunaJob[] {
    return jobs.map(job => ({
      id: job.id.toString(),
      title: job.title,
      company: job.company?.display_name || 'Unknown Company',
      location: job.location?.display_name || 'Remote',
      description: job.description || '',
      salary_min: job.salary_min,
      salary_max: job.salary_max,
      salary_currency: job.salary_currency,
      category: job.category?.label || 'General',
      url: job.redirect_url,
      created: job.created,
      contract_time: job.contract_time,
      contract_type: job.contract_type
    }));
  }

  private static getMockJobs(keywords: string[]): AdzunaJob[] {
    return [
      {
        id: '1',
        title: 'Software Developer',
        company: 'Tech Corp',
        location: 'Atlanta, US',
        description: 'Looking for experienced developer with React and Node.js skills.',
        salary_min: 40000,
        salary_max: 60000,
        salary_currency: 'GBP',
        category: 'IT Jobs',
        url: 'https://example.com/job1',
        created: new Date().toISOString(),
        contract_time: 'full_time',
        contract_type: 'permanent'
      }
    ];
  }
}