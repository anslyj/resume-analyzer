import { CerebrasService } from './cerebrasService';
import { USAJobsService } from './usaJobsService';
import { Resume, JobDescription, AnalysisResult } from '../types';

export class AnalysisEngine {
  static async analyzeResumeOnly(resume: Resume): Promise<AnalysisResult> {
    try {
      const skills = this.extractSkills(resume.content);
      
      const aiResult = await CerebrasService.analyzeResumeOnly(resume.content, skills);
      const jobMatches = await USAJobsService.searchJobs(skills, 'United States');
      
      const analysisResult: AnalysisResult = {
        id: this.generateId(),
        type: 'resume-only',
        resume: { ...resume, skills },
        result: {
          ...aiResult,
          jobMatches: jobMatches.slice(0, 5), // Top 5 government job matches
          skills: skills,
          totalJobsFound: jobMatches.length
        },
        createdAt: new Date(),
      };

      return analysisResult;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      throw new Error(`Resume analysis failed: ${errorMessage}`);
    }
  }

  
  private static extractSkills(text: string): string[] {
    const skillKeywords = [
      'JavaScript', 'Python', 'Java', 'React', 'Node.js', 'Angular', 'Vue.js',
      'SQL', 'MongoDB', 'AWS', 'Docker', 'Git', 'TypeScript', 'HTML', 'CSS',
      'Machine Learning', 'AI', 'Data Science', 'DevOps', 'Agile', 'Scrum',
      'Project Management', 'Leadership', 'Communication', 'Analysis'
    ];

    const foundSkills = skillKeywords.filter(skill =>
      text.toLowerCase().includes(skill.toLowerCase())
    );

    return foundSkills.length > 0 ? foundSkills : ['General Software Development'];
  }


  private static generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}