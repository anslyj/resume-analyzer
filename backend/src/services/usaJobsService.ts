import axios from "axios";
import { USAJobsPosition } from "../types";

export class USAJobsService {
  private static readonly API_KEY = process.env.USAJOBS_API_KEY;
  private static readonly HOST = process.env.USAJOBS_HOST || 'data.usajobs.gov';
  private static readonly BASE_URL = 'https://data.usajobs.gov/api';

  static async searchJobs(keywords: string[], location: string = 'United States'): Promise<USAJobsPosition[]> {
    try {
      const searchParams = new URLSearchParams({
        'Keyword': keywords.join(' '),
        'LocationName': location,
        'RadiusInMiles': '25',
        'ResultsPerPage': '20',
        'Page': '1'
      });

      const response = await axios.get(
        '${this.BASE_URL}/search?${searchParams.toString()}',
        {
          headers: {
            'Authorization-Key': this.API_KEY,
            'Host': this.HOST,
            'User-Agent': 'ResumeAnalyzer/1.0 (your-email@example.com)',
            'Accept': 'application/json'
          },
          timeout: 30000
        }
      );
      if ( response.data && response.data.searchResult) {
        return this.formatPositions(response.data.searchResult.searchResultItems);
      }
      return[];

    } catch (error) {
      console.error('USAJobs API error:', error);
      return this.getMockPositions(keywords);
    }
  }
  static async getJobDetails(jobId: string): Promise<USAJobsPosition | null> {
    try {
      const response = await axios.get(
        `${this.BASE_URL}/jobs/${jobId}`,
        {
          headers: {
            'Authorization-Key': this.API_KEY,
            'Host': this.HOST,
            'User-Agent': 'ResumeAnalyzer/1.0 (your-email@example.com)',
            'Accept': 'application/json'
          },
          timeout: 30000
        }
      );

      if (response.data) {
        return this.formatPosition(response.data);
      }

      return null;
    } catch (error) {
      console.error('USAJobs API error:', error);
      return null;
    }
  }
  static async getJobCategories(): Promise<string[]> {
    try {
      const response = await axios.get(
        `${this.BASE_URL}/codelist/jobcategory`,
        {
          headers: {
            'Authorization-Key': this.API_KEY,
            'Host': this.HOST,
            'User-Agent': 'ResumeAnalyzer/1.0 (your-email@example.com)',
            'Accept': 'application/json'
          },
          timeout: 30000
        }
      );

      if (response.data && response.data.CodeList) {
        return response.data.CodeList[0].ValidValue.map((item: any) => item.Value);
      }

      return [];
    } catch (error) {
      console.error('USAJobs API error:', error);
      return [];
    }
  }
  private static formatPositions(positions: any[]): USAJobsPosition[] {
    return positions.map(position => ({
      id: position.MatchedObjectId,
      positionTitle: position.MatchedObjectDescriptor.PositionTitle,
      organizationName: position.MatchedObjectDescriptor.OrganizationName,
      location: this.formatLocation(position.MatchedObjectDescriptor.PositionLocationDisplay),
      qualificationSummary: position.MatchedObjectDescriptor.QualificationSummary,
      positionURI: position.MatchedObjectDescriptor.PositionURI,
      salaryMin: position.MatchedObjectDescriptor.PositionRemuneration?.[0]?.MinimumRange || 0,
      salaryMax: position.MatchedObjectDescriptor.PositionRemuneration?.[0]?.MaximumRange || 0,
      salaryType: position.MatchedObjectDescriptor.PositionRemuneration?.[0]?.RateIntervalCode || 'Per Year',
      requirements: this.extractRequirements(position.MatchedObjectDescriptor.QualificationSummary),
      benefits: position.MatchedObjectDescriptor.Benefits || [],
      jobCategory: position.MatchedObjectDescriptor.JobCategory || [],
      workSchedule: position.MatchedObjectDescriptor.WorkSchedule || 'Full-time',
      positionStartDate: position.MatchedObjectDescriptor.PositionStartDate,
      positionEndDate: position.MatchedObjectDescriptor.PositionEndDate
    }));
  }
  private static formatPosition(position: any): USAJobsPosition {
    return {
      id: position.PositionID,
      positionTitle: position.PositionTitle,
      organizationName: position.OrganizationName,
      location: this.formatLocation(position.PositionLocationDisplay),
      qualificationSummary: position.QualificationSummary,
      positionURI: position.PositionURI,
      salaryMin: position.PositionRemuneration?.[0]?.MinimumRange || 0,
      salaryMax: position.PositionRemuneration?.[0]?.MaximumRange || 0,
      salaryType: position.PositionRemuneration?.[0]?.RateIntervalCode || 'Per Year',
      requirements: this.extractRequirements(position.QualificationSummary),
      benefits: position.Benefits || [],
      jobCategory: position.JobCategory || [],
      workSchedule: position.WorkSchedule || 'Full-time',
      positionStartDate: position.PositionStartDate,
      positionEndDate: position.PositionEndDate
    };
  }
}

