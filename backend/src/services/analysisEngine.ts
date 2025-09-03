import { CerebrasService } from './cerebrasService';
import { AdzunaService } from './adzunaService';
import { Resume, JobDescription, AnalysisResult } from '../types';

export class AnalysisEngine {
  static async analyzeResumeOnly(resume: Resume) {
    const skills = this.extractSkills(resume.content);
    const aiResult = await CerebrasService.analyzeResumeOnly(resume.content, skills);
    const adzunaJobs = await AdzunaService.searchJobs(skills, 'United States');
    
    return {
      type: 'resume-only' as const,
      summary: aiResult.summary,
      strengths: aiResult.strengths,
      improvements: aiResult.improvements,
      skillAssessments: aiResult.skillAssessments,
      jobRecommendations: AdzunaService.transformJobRecommendations(adzunaJobs, skills),
      actionableRecommendations: aiResult.actionableRecommendations
    };
  }

  static async analyzeJobOnly(jobDescription: JobDescription) {
  const requirements = this.extractRequirements(jobDescription.content);
  const aiResult = await CerebrasService.analyzeJobOnly(jobDescription.content, requirements);
  
  return {
    type: 'job-only' as const,
    summary: aiResult.summary,
    strengths: aiResult.strengths,
    improvements: aiResult.improvements,
    actionableRecommendations: aiResult.actionableRecommendations
  };
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

  static async analyzeBoth(resume: Resume, jobDescription: JobDescription) {
    const resumeSkills = this.extractSkills(resume.content);
    const jobRequirements = this.extractRequirements(jobDescription.content);
    
    const aiResult = await CerebrasService.analyzeBoth(
      resume.content, 
      jobDescription.content, 
      resumeSkills, 
      jobRequirements
    );
    
    return {
      type: 'both' as const,
      summary: aiResult.summary,
      strengths: aiResult.strengths,
      improvements: aiResult.improvements,
      matchScore: aiResult.matchScore,
      skillAssessments: aiResult.skillAssessments,
      actionableRecommendations: aiResult.actionableRecommendations
    };
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