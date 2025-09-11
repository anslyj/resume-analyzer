import axios from "axios";
import { AdzunaJob } from "../types";

interface JobRecommendation {
  title: string;
  company: string;
  matchScore: number;
  location: string;
  salary?: string;
  reasons: string[];
}

export class AdzunaService {
  private static readonly BASE_URL = "https://api.adzuna.com/v1/api/jobs";
  private static readonly COUNTRY = "us";

  private static getCredentials() {
    const APP_ID = process.env.ADZUNA_APP_ID;
    const APP_KEY = process.env.ADZUNA_APP_KEY;
    
    console.log("=== Credential Check ===");
    console.log("APP_ID exists:", !!APP_ID);
    console.log("APP_KEY exists:", !!APP_KEY);
    console.log("APP_ID value:", APP_ID ? `${APP_ID.substring(0, 8)}...` : "undefined");
    console.log("APP_KEY value:", APP_KEY ? `${APP_KEY.substring(0, 8)}...` : "undefined");
    
    if (!APP_ID || !APP_KEY) {
      throw new Error("Missing Adzuna credentials: set ADZUNA_APP_ID and ADZUNA_APP_KEY");
    }
    
    return { APP_ID, APP_KEY };
  }

  static async searchJobs(keywords: string[], location = "United States"): Promise<AdzunaJob[]> {
    try {
      const { APP_ID, APP_KEY } = this.getCredentials();
      
      console.log("=== Adzuna API Call Debug ===");
      console.log("Keywords:", keywords);
      console.log("Location:", location);

      const url = `${this.BASE_URL}/${this.COUNTRY}/search/1`;
      console.log("Full URL:", url);
      
      const params = {
        app_id: APP_ID,
        app_key: APP_KEY,
        results_per_page: 20,
        what: keywords.join(" "),
        where: location,
        sort_by: "date",
      };
      console.log("Request params:", params);

      const response = await axios.get(url, {
        params,
        timeout: 30000,
      });

      console.log("Response status:", response.status);
      console.log("Response data keys:", Object.keys(response.data || {}));
      console.log("Results count:", response.data?.results?.length || 0);
      
      if (response.data?.results && response.data.results.length > 0) {
        console.log("First job title:", response.data.results[0]?.title);
        const formattedJobs = this.formatJobs(response.data.results);
        console.log("Formatted jobs count:", formattedJobs.length);
        return formattedJobs;
      } else {
        console.log("No results found in API response");
        return [];
      }
    } catch (error: any) {
      console.error("=== Adzuna API Error ===");
      console.error("Error type:", error?.constructor?.name);
      console.error("Error message:", error?.message);
      if (error?.response) {
        console.error("Response status:", error.response.status);
        console.error("Response data:", error.response.data);
      }
      return [];
    }
  }

  static async getJobCategories(): Promise<string[]> {
    try {
      const { APP_ID, APP_KEY } = this.getCredentials();
      const url = `${this.BASE_URL}/${this.COUNTRY}/categories`;
      const response = await axios.get(url, {
        params: { app_id: APP_ID, app_key: APP_KEY },
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
      id: String(job.id),
      title: job.title,
      company: job.company?.display_name || "Unknown Company", // string
      location: job.location?.display_name || "Remote",        // string
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


  static transformJobRecommendations(adzunaJobs: AdzunaJob[], resumeSkills: string[]): JobRecommendation[] {
    return adzunaJobs.slice(0, 3).map((job) => ({
      title: job.title,
      company: job.company,              // <-- changed
      matchScore: this.calculateJobMatchScore(job, resumeSkills),
      location: job.location,            // <-- changed
      salary: this.formatSalary(job.salary_min, job.salary_max, job.salary_currency),
      reasons: this.generateMatchReasons(job, resumeSkills),
    }));
  }

  private static formatSalary(
    min?: number,
    max?: number,
    currency?: string
  ): string | undefined {
    if (!min && !max) return undefined;
    const cur = currency || "USD";
    const fmt = (n: number) =>
      new Intl.NumberFormat("en-US", { style: "currency", currency: cur, maximumFractionDigits: 0 }).format(n);
    if (min && max) return `${fmt(min)} – ${fmt(max)}`;
    if (min) return `from ${fmt(min)}`;
    return `up to ${fmt(max!)}`
  }

  static calculateJobMatchScore(job: AdzunaJob, resumeSkills: string[]): number {
    const jobText = (job.title + " " + (job.description || "")).toLowerCase();
    const matches = resumeSkills.filter((skill) => jobText.includes(skill.toLowerCase()));
    const baseScore = 60;
    const matchBonus = (matches.length / Math.max(1, resumeSkills.length)) * 40;
    return Math.min(100, Math.round(baseScore + matchBonus));
  }

  static generateMatchReasons(job: AdzunaJob, resumeSkills: string[]): string[] {
    const reasons: string[] = [];
    const jobText = (job.title + " " + (job.description || "")).toLowerCase();
    const matchingSkills = resumeSkills.filter((skill) => jobText.includes(skill.toLowerCase()));
    if (matchingSkills.length > 0) {
      reasons.push(`Your ${matchingSkills.slice(0, 2).join(" and ")} skills match job requirements`);
    }
    reasons.push("Company culture and role responsibilities align with your background");
    reasons.push("Growth opportunities in this position");
    return reasons.slice(0, 3);
  }

}
