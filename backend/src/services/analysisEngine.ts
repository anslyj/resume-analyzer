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
  static async analyzeJobOnly(jobDescription: JobDescription): Promise<AnalysisResult> {
    try {
      const requirements = this.extractRequirements(jobDescription.content);
      const aiResult = await CerebrasService.analyzeJobOnly(jobDescription.content, requirements);
      
      const analysisResult: AnalysisResult = {
        id: this.generateId(),
        type: 'job-only',
        jobDescription: { ...jobDescription, requirements },
        result: {
          ...aiResult,
          requirements: requirements
        },
        createdAt: new Date(),
      };

      return analysisResult;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      throw new Error(`Job description analysis failed: ${errorMessage}`);
    }
  }

  private static extractRequirements(text: string): string[] {
    const sentences = text.split(/[.!?]+/);
    const requirementSentences = sentences.filter(sentence =>
      sentence.toLowerCase().includes('experience') ||
      sentence.toLowerCase().includes('skills') ||
      sentence.toLowerCase().includes('knowledge') ||
      sentence.toLowerCase().includes('proficiency')
    );

    return requirementSentences.slice(0, 5);
  }

  static async analyzeBoth(resume: Resume, jobDescription: JobDescription): Promise<AnalysisResult> {
    try {
      const resumeSkills = this.extractSkills(resume.content);
      const jobRequirements = this.extractRequirements(jobDescription.content);
      
      const aiResult = await CerebrasService.analyzeBoth(
        resume.content, 
        jobDescription.content, 
        resumeSkills, 
        jobRequirements
      );
      
      const matchScore = this.calculateMatchScore(resumeSkills, jobRequirements);
      
      const analysisResult: AnalysisResult = {
        id: this.generateId(),
        type: 'both',
        resume: { ...resume, skills: resumeSkills },
        jobDescription: { ...jobDescription, requirements: jobRequirements },
        result: {
          ...aiResult,
          matchScore: matchScore,
          resumeSkills: resumeSkills,
          jobRequirements: jobRequirements
        },
        createdAt: new Date(),
      };

      return analysisResult;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      throw new Error(`Combined analysis failed: ${errorMessage}`);
    }
  }

  private static calculateMatchScore(resumeSkills: string[], jobRequirements: string[]): number {
    if (jobRequirements.length === 0) return 0;
    
    const matches = resumeSkills.filter(skill =>
      jobRequirements.some(req =>
        req.toLowerCase().includes(skill.toLowerCase()) ||
        skill.toLowerCase().includes(req.toLowerCase())
      )
    );

    return Math.round((matches.length / jobRequirements.length) * 100);
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