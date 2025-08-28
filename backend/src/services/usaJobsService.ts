import axios from "axios";

export class USAJobsService {
  private static readonly API_KEY = process.env.USAJOBS_API_KEY;
  private static readonly HOST = process.env.USAJOBS_HOST || 'data.usajobs.gov';
  private static readonly BASE_URL = 'https://data.usajobs.gov/api';

  
}

