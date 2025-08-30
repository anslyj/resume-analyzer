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

export interface AdzunaJob {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  salary_min?: number;
  salary_max?: number;
  salary_currency?: string;
  category: string;
  url: string;
  created: string;
  contract_time?: string;
  contract_type?: string;
}

export interface AdzunaSearchResult {
  count: number;
  results: AdzunaJob[];
  mean: number;
  salary_min: number;
  salary_max: number;
}


export interface CerebrasResponse {
  skils: string[];
  jobMatches: string[];
  recommendations: string[];
  summary: string;
}