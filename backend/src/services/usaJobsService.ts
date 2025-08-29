import axios from "axios";
import { USAJobsPosition } from "../types";

export class USAJobsService {
  private static get API_KEY() {
    const v = (process.env.USAJOBS_API_KEY || '').trim();
    if (!v) console.warn('USAJOBS_API_KEY is missing');
    return v;
  }

  private static readonly HOST = process.env.USAJOBS_HOST || 'data.usajobs.gov';
  private static readonly BASE_URL = 'https://data.usajobs.gov/api';

  private static headers() {
    return {
      'Authorization-Key': this.API_KEY,            // not needed for /codelist but harmless
      'Host': this.HOST,
      'User-Agent': 'your-email@example.com',       // <-- use the email you registered with
      'Accept': 'application/json'
    };
  }

  static async searchJobs(keywords: string[], location: string = 'United States'): Promise<USAJobsPosition[]> {
    try {
      const searchParams = new URLSearchParams({
        Keyword: keywords.join(' '),
        LocationName: location,
        Radius: '25',                // <-- correct param name
        ResultsPerPage: '20',
        Page: '1',
        Fields: 'full',              // return richer fields
        WhoMayApply: 'public'        // optional, often what you want
      });

      // <-- use backticks so the template interpolates
      const url = `${this.BASE_URL}/Search?${searchParams.toString()}`;

      const response = await axios.get(url, {
        headers: this.headers(),
        timeout: 30000
      });

      // <-- correct response casing
      if (response.data?.SearchResult) {
        return this.formatPositions(response.data.SearchResult.SearchResultItems || []);
      }
      return [];
    } catch (error) {
      console.error('USAJobs API error (search):', error);
      return this.getMockPositions(keywords);
    }
  }

  // There is no /jobs/{id} endpoint. Pull a single job via Search (Fields=full) and match.
  static async getJobDetails(jobId: string): Promise<USAJobsPosition | null> {
    try {
      const url = `${this.BASE_URL}/Search?Fields=full&Keyword=${encodeURIComponent(jobId)}`;
      const response = await axios.get(url, { headers: this.headers(), timeout: 30000 });
      const items = response.data?.SearchResult?.SearchResultItems || [];

      const match = items.find((it: any) =>
        it?.MatchedObjectId?.toString() === jobId ||
        it?.MatchedObjectDescriptor?.PositionID === jobId
      );

      return match ? this.formatPositionFromSearchItem(match) : null;
    } catch (error) {
      console.error('USAJobs API error (getJobDetails):', error);
      return null;
    }
  }

  static async getJobCategories(): Promise<string[]> {
    try {
      // <-- correct endpoint for categories (occupational series)
      const url = `${this.BASE_URL}/codelist/occupationalseries`;
      const response = await axios.get(url, {
        // headers are NOT required for codelist, but leaving them is fine
        headers: this.headers(),
        timeout: 30000
      });

      const values = response.data?.CodeList?.[0]?.ValidValue || [];
      return values.map((item: any) => item.Value);
    } catch (error) {
      console.error('USAJobs API error (categories):', error);
      return [];
    }
  }

  // Helpers to adapt shapes coming from /api/Search
  private static formatPositions(items: any[]): USAJobsPosition[] {
    return items.map(this.formatPositionFromSearchItem.bind(this));
  }

  private static formatPositionFromSearchItem(item: any): USAJobsPosition {
    const d = item?.MatchedObjectDescriptor || {};
    return {
      id: item?.MatchedObjectId?.toString() || d.PositionID || '',
      positionTitle: d.PositionTitle,
      organizationName: d.OrganizationName,
      location: this.formatLocation(d.PositionLocationDisplay),
      qualificationSummary: d.QualificationSummary,
      positionURI: d.PositionURI,
      salaryMin: d.PositionRemuneration?.[0]?.MinimumRange || 0,
      salaryMax: d.PositionRemuneration?.[0]?.MaximumRange || 0,
      salaryType: d.PositionRemuneration?.[0]?.RateIntervalCode || 'Per Year',
      requirements: this.extractRequirements(d.QualificationSummary),
      benefits: d.Benefits ? [d.Benefits] : [], // often comes back as long text; adjust to your type
      jobCategory: d.JobCategory || [],
      workSchedule: d.PositionSchedule?.[0]?.Name || 'Full-time',
      positionStartDate: d.PositionStartDate,
      positionEndDate: d.PositionEndDate
    };
  }

  private static formatLocation(locationDisplay: string): string {
    if (!locationDisplay) return 'Remote/Unknown';
    return locationDisplay.replace(/\s+/g, ' ').trim();
  }

  private static extractRequirements(qualificationSummary: string): string[] {
    if (!qualificationSummary) return [];
    const sentences = qualificationSummary.split(/[.!?]+/);
    const requirementKeywords = [
      'experience', 'years', 'skills', 'knowledge', 'proficiency',
      'familiarity', 'expertise', 'background', 'qualifications',
      'requirements', 'must have', 'should have', 'preferred'
    ];
    const requirementSentences = sentences.filter(s =>
      requirementKeywords.some(k => s.toLowerCase().includes(k))
    );
    return requirementSentences.slice(0, 5).map(s => s.trim());
  }

  // ... your getMockPositions unchanged ...


  // Mock data for development/testing
  private static getMockPositions(keywords: string[]): USAJobsPosition[] {
    const mockPositions = [
      {
        id: '1',
        positionTitle: 'Software Developer',
        organizationName: 'Department of Defense',
        location: 'Washington, DC',
        qualificationSummary: 'Looking for experienced developer with React and Node.js skills. Must have 3+ years experience.',
        positionURI: 'https://www.usajobs.gov/job/123',
        salaryMin: 80000,
        salaryMax: 120000,
        salaryType: 'Per Year',
        requirements: ['3+ years experience', 'React knowledge', 'Node.js proficiency'],
        benefits: ['Health Insurance', 'Retirement Plan', 'Paid Time Off'],
        jobCategory: ['Information Technology'],
        workSchedule: 'Full-time',
        positionStartDate: '2024-01-01',
        positionEndDate: '2024-12-31'
      },
      {
        id: '2',
        positionTitle: 'Data Scientist',
        organizationName: 'Department of Energy',
        location: 'Oak Ridge, TN',
        qualificationSummary: 'Join our team analyzing energy data. Python and machine learning experience required.',
        positionURI: 'https://www.usajobs.gov/job/456',
        salaryMin: 90000,
        salaryMax: 130000,
        salaryType: 'Per Year',
        requirements: ['Python expertise', 'Machine learning experience', 'Data analysis skills'],
        benefits: ['Health Insurance', 'Retirement Plan', 'Flexible Schedule'],
        jobCategory: ['Data Science'],
        workSchedule: 'Full-time',
        positionStartDate: '2024-01-01',
        positionEndDate: '2024-12-31'
      }
    ];

    return mockPositions.filter(position =>
      keywords.some(keyword =>
        position.positionTitle.toLowerCase().includes(keyword.toLowerCase()) ||
        position.qualificationSummary.toLowerCase().includes(keyword.toLowerCase())
      )
    );
  }
}

