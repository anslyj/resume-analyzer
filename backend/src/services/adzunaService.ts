import axios from "axios";
import { AdzunaJob } from "../types";

export class AdzunaService {
  private static readonly BASE_URL = "https://api.adzuna.com/v1/api/jobs";
  private static readonly COUNTRY = "us";
  private static readonly APP_ID = process.env.ADZUNA_APP_ID || "a6031ed4";
  private static readonly APP_KEY = process.env.ADZUNA_APP_KEY || "991186631170d76d0a45b2be4d3768a3	";

  private static assertCreds() {
    if (!this.APP_ID || !this.APP_KEY) {
      throw new Error("Missing Adzuna credentials: set ADZUNA_APP_ID and ADZUNA_APP_KEY");
    }
  }

  static async searchJobs(keywords: string[], location = "United States"): Promise<AdzunaJob[]> {
    try {
      this.assertCreds();

      const url = `${this.BASE_URL}/${this.COUNTRY}/search/1`;
      const response = await axios.get(url, {
        params: {
          app_id: this.APP_ID,
          app_key: this.APP_KEY,
          results_per_page: 20,
          what: keywords.join(" "),
          where: location,
          // sort_by is valid; default is most recent anyway
          sort_by: "date",
          // drop the nonstandard "content_type" param
        },
        timeout: 30000,
      });

      return response.data?.results ? this.formatJobs(response.data.results) : [];
    } catch (error) {
      console.error("Adzuna API error:", error);
      return this.getMockJobs(keywords);
    }
  }

  static async getJobCategories(): Promise<string[]> {
    try {
      this.assertCreds();

      // ✅ correct path: /jobs/{country}/categories
      const url = `${this.BASE_URL}/${this.COUNTRY}/categories`;
      const response = await axios.get(url, {
        params: { app_id: this.APP_ID, app_key: this.APP_KEY },
        timeout: 30000,
      });

      return response.data?.results ? response.data.results.map((c: any) => c.label) : [];
    } catch (error) {
      console.error("Adzuna categories error:", error);
      return [];
    }
  }

  private static formatJobs(jobs: any[]): AdzunaJob[] {
    return jobs.map((job) => ({
      id: job.id.toString(),
      title: job.title,
      company: job.company?.display_name || "Unknown Company",
      location: job.location?.display_name || "Remote",
      description: job.description || "",
      salary_min: job.salary_min,
      salary_max: job.salary_max,
      salary_currency: job.salary_currency,
      category: job.category?.label || "General",
      url: job.redirect_url,
      created: job.created,
      contract_time: job.contract_time,
      contract_type: job.contract_type,
    }));
  }

  private static getMockJobs(keywords: string[]): AdzunaJob[] {
    return [
      {
        id: "1",
        title: "Software Developer",
        company: "Tech Corp",
        location: "Atlanta, US",
        description: "Looking for experienced developer with React and Node.js skills.",
        salary_min: 80000,
        salary_max: 120000,
        salary_currency: "USD",
        category: "IT Jobs",
        url: "https://example.com/job1",
        created: new Date().toISOString(),
        contract_time: "full_time",
        contract_type: "permanent",
      },
    ];
  }
}
