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

