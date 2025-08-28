export interface Resume {
  id?: string;
  content: string;
  fileName: string;
  uploadDate: Date;
  skills?: string[];
  experience?: number;

}

export interface JobDescription {
  id?: string;
  content: string;
  title: string;
  company: string;
  requirements?: string[];
}

export interface AnalysisResult {
  id: string;
  type: 'resume-only' | 'job-only' | 'both';
  resume?: Resume;
  jobDescription?: JobDescription;
  result: any;
  createdAt: Date;
}

export interface User {
  id: string;
  email: string;
  name: string;
}

export interface USAJobsPosition {
  id: string;
  positionTitle: string;
  organizationName: string;
  location: string;
  qualificationSummary: string;
  positionURI: string;
  salaryMin: number;
  salaryMax: number;
  salaryType: string;
  requirements: string[];
  benefits: string[];
  jobCategory: string[];
  workSchedule: string;
  positionStartDate: string;
  positionEndDate: string;
}

export interface USAJobsSearchResult {
  search: {
    searchResultCount: number;
    searchResultCountAll: number;
    searchResultItems: USAJobsPosition[];

  };
  totalCount: number;
}