import axios, { AxiosResponse } from 'axios';

export class CerebrasService {
  private static readonly API_KEY = process.env.CEREBRAS_API_KEY
  private static readonly BASE_URL = 'https:api.cerebras.ai/v1';

  static async analyzeResumeOnly(resumeContent: string, skills: string[]): Promise<any> {
    
  }
}