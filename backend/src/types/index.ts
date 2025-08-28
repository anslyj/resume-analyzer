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

